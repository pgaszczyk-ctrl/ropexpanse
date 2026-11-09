// Turns map content into ready vertex arrays. Runs in the tile worker (or on the
// main thread as a fallback), so it only uses typed arrays and three's triangulator.
import { ShapeUtils, Vector2 } from "three";
import { inPolygon } from "./rules.ts";
import { ringArea, ringBox, type Area, type RawRegion, type Rect } from "./geo.ts";

export type MeshData = {
  positions: Float32Array;
  colors: Uint8Array;
  index: Uint16Array | Uint32Array;
};
export type BuildingRef = {
  rings: number[][][];
  height: number;
  box: [number, number, number, number];
  chunk: number;
  start: number;
  count: number;
};
export type RegionData = {
  key: string;
  rect: Rect;
  buildings: BuildingRef[];
  water: { rings: number[][][]; box: [number, number, number, number] }[];
  chunks: MeshData[];
  ground: MeshData;
  /** Per tree: x, z, crown scale x, y, z, lightness. */
  trees: Float32Array;
  counts: { buildings: number; roads: number; areas: number };
};

/** Buildings are grouped into square chunks so the camera draws only nearby ones. */
export const CHUNK = 48;
const WALLS = [0xd9c4a0, 0xd1b68e, 0xc0c7b0, 0xd8ccaf, 0xc7af8e],
  ROOFS = [0x657e72, 0x7e8975, 0x9a7052, 0x586f6c];
const GROUND: Record<string, number> = {
  land: 0xb8c397,
  grass: 0x96af78,
  park: 0x8fab70,
  wood: 0x7f9d68,
  farm: 0xb3bb84,
  water: 0x72acae,
  road: 0xe1d5b9,
  path: 0xcabd96,
  stream: 0x7fb3b2,
};
const LEVEL: Record<string, number> = {
  land: 0.005,
  farm: 0.01,
  grass: 0.014,
  park: 0.014,
  wood: 0.016,
  water: 0.02,
  stream: 0.03,
  path: 0.033,
  road: 0.036,
};

// Palette colours are sRGB; vertex colours are read as linear, like three's material colours.
const LINEAR = Array.from({ length: 256 }, (_, i) => {
  const c = i / 255;
  return Math.round(255 * (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
});
class Builder {
  pos: number[] = [];
  col: number[] = [];
  idx: number[] = [];
  get vertices() {
    return this.pos.length / 3;
  }
  vertex(x: number, y: number, z: number, color: number) {
    this.pos.push(x, y, z);
    this.col.push(LINEAR[(color >> 16) & 255], LINEAR[(color >> 8) & 255], LINEAR[color & 255]);
    return this.vertices - 1;
  }
  data(): MeshData {
    const n = this.vertices;
    return {
      positions: new Float32Array(this.pos),
      colors: new Uint8Array(this.col),
      index: n > 65535 ? new Uint32Array(this.idx) : new Uint16Array(this.idx),
    };
  }
}
const open = (r: number[][]) => {
  const f = r[0],
    l = r[r.length - 1];
  return r.length > 1 && f[0] === l[0] && f[1] === l[1] ? r.slice(0, -1) : r;
};
/** Flat polygon (with holes) at height y, facing up. */
function flat(b: Builder, rings: number[][][], y: number, color: number) {
  const contour = open(rings[0]).map(([x, z]) => new Vector2(x, z));
  if (contour.length < 3) return;
  const holes = rings.slice(1).map((r) => open(r).map(([x, z]) => new Vector2(x, z)));
  let faces: number[][];
  try {
    faces = ShapeUtils.triangulateShape(contour, holes);
  } catch {
    return;
  }
  const base = b.vertices,
    all = [contour, ...holes].flat();
  for (const p of all) b.vertex(p.x, y, p.y, color);
  for (const [i, j, k] of faces) {
    const a = all[i],
      c = all[j],
      d = all[k];
    // Up-facing in three's right-handed space: (c-a)×(d-a) must have positive y.
    const cy = (d.x - a.x) * (c.y - a.y) - (c.x - a.x) * (d.y - a.y);
    if (cy >= 0) b.idx.push(base + i, base + j, base + k);
    else b.idx.push(base + i, base + k, base + j);
  }
}
/** Extruded building: shared-vertex walls (flat shading needs no normals) and a roof. */
function building(b: Builder, rings: number[][][], h: number, wall: number, roof: number) {
  rings.forEach((ring, r) => {
    const pts = open(ring);
    if (pts.length < 3) return;
    const base = b.vertices,
      // Outer rings face out, holes face into the courtyard.
      flip = (ringArea(pts) > 0) !== (r === 0);
    for (const [x, z] of pts) {
      b.vertex(x, 0, z, wall);
      b.vertex(x, h, z, wall);
    }
    for (let i = 0; i < pts.length; i++) {
      const j = (i + 1) % pts.length,
        a0 = base + i * 2,
        a1 = a0 + 1,
        b0 = base + j * 2,
        b1 = b0 + 1;
      if (flip) b.idx.push(a0, b0, b1, a0, b1, a1);
      else b.idx.push(a0, b1, b0, a0, a1, b1);
    }
  });
  flat(b, rings, h, roof);
}
function quad(b: Builder, a: number[], c: number[], width: number, y: number, color: number) {
  const dx = c[0] - a[0],
    dz = c[1] - a[1],
    len = Math.hypot(dx, dz);
  if (len < 0.02) return;
  // Slightly longer than the segment so joints have no gaps.
  const ux = (dx / len) * 0.09,
    uz = (dz / len) * 0.09,
    nx = (-dz / len) * width * 0.5,
    nz = (dx / len) * width * 0.5;
  const i = b.vertex(a[0] - ux + nx, y, a[1] - uz + nz, color);
  b.vertex(a[0] - ux - nx, y, a[1] - uz - nz, color);
  b.vertex(c[0] + ux - nx, y, c[1] + uz - nz, color);
  b.vertex(c[0] + ux + nx, y, c[1] + uz + nz, color);
  // n is the left normal of the segment, so this order faces up.
  b.idx.push(i, i + 2, i + 1, i, i + 3, i + 2);
}
const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};

export function buildRegion(raw: RawRegion): RegionData {
  const { rect } = raw;
  // Buildings → chunks.
  const chunkOf = new Map<string, number>(),
    builders: Builder[] = [],
    buildings: BuildingRef[] = [];
  raw.buildings.forEach((bd, i) => {
    const box = ringBox(bd.rings[0]);
    const cx = Math.floor((box[0] + box[2]) / 2 / CHUNK),
      cz = Math.floor((box[1] + box[3]) / 2 / CHUNK),
      ck = `${cx},${cz}`;
    let chunk = chunkOf.get(ck);
    if (chunk === undefined) {
      chunk = builders.length;
      chunkOf.set(ck, chunk);
      builders.push(new Builder());
    }
    const b = builders[chunk],
      start = b.vertices,
      seed = Math.round(box[0] * 7 + box[1] * 13) + i;
    building(b, bd.rings, bd.height, WALLS[Math.abs(seed) % 5], ROOFS[Math.abs(seed >> 2) % 4]);
    buildings.push({ rings: bd.rings, height: bd.height, box, chunk, start, count: b.vertices - start });
  });
  // Ground: land, areas, water and roads in one mesh.
  const g = new Builder();
  {
    const y = LEVEL.land,
      c = GROUND.land,
      i = g.vertex(rect.x0, y, rect.z0, c);
    g.vertex(rect.x1, y, rect.z0, c);
    g.vertex(rect.x1, y, rect.z1, c);
    g.vertex(rect.x0, y, rect.z1, c);
    g.idx.push(i, i + 2, i + 1, i, i + 3, i + 2);
  }
  const order: Area["kind"][] = ["farm", "grass", "park", "wood", "water"];
  for (const kind of order)
    for (const a of raw.areas) if (a.kind === kind) flat(g, a.rings, LEVEL[kind], GROUND[kind]);
  const roadCells = new Set<number>();
  const mark = (x: number, z: number) =>
    roadCells.add(Math.floor(x / 2) * 100003 + Math.floor(z / 2));
  for (const r of raw.roads) {
    const kind = r.water ? "stream" : r.path ? "path" : "road";
    for (let i = 1; i < r.pts.length; i++) {
      const a = r.pts[i - 1],
        c = r.pts[i];
      quad(g, a, c, r.width, LEVEL[kind], GROUND[kind]);
      const n = Math.ceil(Math.hypot(c[0] - a[0], c[1] - a[1]) / 1.5);
      for (let k = 0; k <= n; k++)
        mark(a[0] + ((c[0] - a[0]) * k) / Math.max(1, n), a[1] + ((c[1] - a[1]) * k) / Math.max(1, n));
    }
  }
  // Trees on green areas, deterministic per region, never on buildings or roads.
  let seed = hash(raw.key) | 1;
  const rand = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
    return (seed >>> 0) / 4294967296;
  };
  const near = (x: number, z: number) => {
    const cx = Math.floor(x / 2),
      cz = Math.floor(z / 2);
    for (let dx = -1; dx <= 1; dx++)
      for (let dz = -1; dz <= 1; dz++) if (roadCells.has((cx + dx) * 100003 + cz + dz)) return true;
    return false;
  };
  const bgrid = new Map<number, BuildingRef[]>();
  for (const b of buildings)
    for (let x = Math.floor(b.box[0] / 8); x <= Math.floor(b.box[2] / 8); x++)
      for (let z = Math.floor(b.box[1] / 8); z <= Math.floor(b.box[3] / 8); z++) {
        const k = x * 100003 + z,
          list = bgrid.get(k) ?? [];
        list.push(b);
        bgrid.set(k, list);
      }
  const onBuilding = (x: number, z: number) =>
    (bgrid.get(Math.floor(x / 8) * 100003 + Math.floor(z / 8)) ?? []).some(
      (b) =>
        x > b.box[0] - 1 && x < b.box[2] + 1 && z > b.box[1] - 1 && z < b.box[3] + 1 &&
        inPolygon(x, z, b.rings),
    );
  const density: Partial<Record<Area["kind"], number>> = { wood: 1 / 14, park: 1 / 45, grass: 1 / 160 };
  const trees: number[] = [];
  const MAX_TREES = 2200;
  for (const a of raw.areas) {
    const d = density[a.kind];
    if (!d || trees.length / 6 >= MAX_TREES) continue;
    const box = ringBox(a.rings[0]),
      n = Math.min(400, Math.round(Math.abs(ringArea(a.rings[0])) * d));
    for (let i = 0, placed = 0; i < n * 2 && placed < n && trees.length / 6 < MAX_TREES; i++) {
      const x = box[0] + rand() * (box[2] - box[0]),
        z = box[1] + rand() * (box[3] - box[1]);
      if (!inPolygon(x, z, a.rings) || near(x, z) || onBuilding(x, z)) continue;
      trees.push(x, z, 0.85 + rand() * 0.35, 1.3 + rand() * 0.7, 0.85 + rand() * 0.35, 0.31 + rand() * 0.12);
      placed++;
    }
  }
  return {
    key: raw.key,
    rect,
    buildings,
    water: raw.areas
      .filter((a) => a.kind === "water")
      .map((a) => ({ rings: a.rings, box: ringBox(a.rings[0]) })),
    chunks: builders.map((b) => b.data()),
    ground: g.data(),
    trees: new Float32Array(trees),
    counts: { buildings: raw.buildings.length, roads: raw.roads.length, areas: raw.areas.length },
  };
}

/** Transferable buffers of a region (for postMessage). */
export function transferables(r: RegionData) {
  const out: ArrayBuffer[] = [];
  for (const m of [...r.chunks, r.ground])
    out.push(m.positions.buffer as ArrayBuffer, m.colors.buffer as ArrayBuffer, m.index.buffer as ArrayBuffer);
  out.push(r.trees.buffer as ArrayBuffer);
  return out;
}
