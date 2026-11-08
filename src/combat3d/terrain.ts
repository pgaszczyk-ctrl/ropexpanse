// Terrain height (owner's design doc, Teren i kamera + review of 8 Nov 2026). OSM is flat,
// so heights come from AWS Terrain Tiles (Terrarium PNGs: free, worldwide, no API key;
// attribution "Terrain Tiles: Mapzen / AWS Open Data"), fetched and kept like the map.
// The game turns them into gentle rolling ground (no terrace steps any more):
// - full-precision decoding (R·256 + G + B/256 − 32768) and bilinear sampling;
// - relief is exaggerated on lowlands and compressed in mountains (asinh), kept continuous;
// - slopes are limited so the party can always walk up, then smoothed (blur 2 cells);
// - flat ground gets a faint low-frequency swell (±1–2 m) that fades out at roads,
//   buildings and water;
// - water is always flat.
// Without data (offline, ocean) the world stays flat at 0, as before.
import { unproject, wrapLongitude, type Geo, type MapData } from "./world.ts";
import type { Point } from "./rules.ts";

export const TERRAIN_ZOOM = 12;
export const VOXEL = 0.6; // scene units per former terrace step (keeps the height scale)
export const CELL = 2; // scene units per height cell (~11 m)
/** Steepest rise between neighbouring cells (scene units per CELL): ~14°, always walkable. */
export const MAX_RISE = 0.5;
/** Swell on flat ground: amplitude in metres and wavelength in metres. */
export const SWELL_M = 1.5;
export const SWELL_WAVE_M = 260;
const DEFAULT_URL = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium";
export function terrainUrl() {
  const q = typeof location === "undefined" ? null : new URLSearchParams(location.search).get("terrain");
  return q || DEFAULT_URL;
}
/** Metres above the start → scene units: strong on lowlands, gentle in mountains (continuous). */
export const heightFor = (deltaMeters: number) => 5 * Math.asinh(deltaMeters / 12) * VOXEL;

/** Decodes a Terrarium tile to metres (256×256). Browser only; tests inject their own. */
export type TileDecoder = (url: string) => Promise<Float32Array | null>;
export const browserDecoder: TileDecoder = async (url) => {
  const r = await fetch(url, { signal: AbortSignal.timeout(12_000) });
  if (!r.ok) return null;
  const bmp = await createImageBitmap(await r.blob());
  const c = new OffscreenCanvas(bmp.width, bmp.height);
  const g = c.getContext("2d")!;
  g.drawImage(bmp, 0, 0);
  const px = g.getImageData(0, 0, bmp.width, bmp.height).data,
    out = new Float32Array(bmp.width * bmp.height);
  for (let i = 0; i < out.length; i++)
    out[i] = px[i * 4] * 256 + px[i * 4 + 1] + px[i * 4 + 2] / 256 - 32768;
  return out;
};

/** Raw elevations from Terrarium tiles, loaded on demand and kept (failures = unknown). */
export class Elevation {
  private tiles = new Map<string, Promise<Float32Array | null>>();
  private ready = new Map<string, Float32Array | null>();
  private decode: TileDecoder;
  constructor(decode: TileDecoder = browserDecoder) {
    this.decode = decode;
  }
  private key(x: number, y: number) {
    return `${TERRAIN_ZOOM}/${x}/${y}`;
  }
  private load(x: number, y: number) {
    const k = this.key(x, y);
    let job = this.tiles.get(k);
    if (!job) {
      job = this.decode(`${terrainUrl()}/${k}.png`).catch(() => null);
      job.then((t) => this.ready.set(k, t));
      this.tiles.set(k, job);
    }
    return job;
  }
  /** Loads every tile under a lat/lon box. */
  async ensure(b: { south: number; west: number; north: number; east: number }) {
    const n = 2 ** TERRAIN_ZOOM;
    const tx = (lon: number) => Math.floor(((wrapLongitude(lon) + 180) / 360) * n);
    const ty = (lat: number) =>
      Math.floor(((1 - Math.asinh(Math.tan((lat * Math.PI) / 180)) / Math.PI) / 2) * n);
    const jobs: Promise<unknown>[] = [];
    for (let x = tx(b.west); x <= tx(b.east); x++)
      for (let y = ty(b.north); y <= ty(b.south); y++) jobs.push(this.load(((x % n) + n) % n, y));
    await Promise.all(jobs);
  }
  /** Metres at a point (bilinear), or null while unknown. */
  at(geo: Geo): number | null {
    const n = 2 ** TERRAIN_ZOOM;
    const fx = ((wrapLongitude(geo.lon) + 180) / 360) * n * 256,
      fy = ((1 - Math.asinh(Math.tan((geo.lat * Math.PI) / 180)) / Math.PI) / 2) * n * 256;
    const sample = (px: number, py: number) => {
      const x = Math.floor(px / 256),
        y = Math.floor(py / 256);
      const t = this.ready.get(this.key(((x % n) + n) % n, y));
      if (!t) return null;
      return t[(Math.floor(py) - y * 256) * 256 + (Math.floor(px) - x * 256)];
    };
    const x0 = Math.floor(fx - 0.5),
      y0 = Math.floor(fy - 0.5),
      ax = fx - 0.5 - x0,
      ay = fy - 0.5 - y0;
    const a = sample(x0, y0), b = sample(x0 + 1, y0), c = sample(x0, y0 + 1), d = sample(x0 + 1, y0 + 1);
    if (a === null || b === null || c === null || d === null) return null;
    return (a * (1 - ax) + b * ax) * (1 - ay) + (c * (1 - ax) + d * ax) * ay;
  }
}

/** Lowers peaks until no neighbour (4-way) rises by more than `step`. */
export function limitSlope(v: Float32Array, w: number, h: number, step = MAX_RISE) {
  for (let pass = 0; pass < 6; pass++) {
    let changed = false;
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        let m = v[i];
        if (x > 0) m = Math.min(m, v[i - 1] + step);
        if (y > 0) m = Math.min(m, v[i - w] + step);
        if (m < v[i] - 1e-6) (v[i] = m), (changed = true);
      }
    for (let y = h - 1; y >= 0; y--)
      for (let x = w - 1; x >= 0; x--) {
        const i = y * w + x;
        let m = v[i];
        if (x < w - 1) m = Math.min(m, v[i + 1] + step);
        if (y < h - 1) m = Math.min(m, v[i + w] + step);
        if (m < v[i] - 1e-6) (v[i] = m), (changed = true);
      }
    if (!changed) break;
  }
  return v;
}

/** Separable box blur (radius in cells), edges clamped. */
export function blur(v: Float32Array, w: number, h: number, radius: number) {
  const tmp = new Float32Array(v.length);
  const n = radius * 2 + 1;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      let s = 0;
      for (let k = -radius; k <= radius; k++) s += v[y * w + Math.min(w - 1, Math.max(0, x + k))];
      tmp[y * w + x] = s / n;
    }
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      let s = 0;
      for (let k = -radius; k <= radius; k++) s += tmp[Math.min(h - 1, Math.max(0, y + k)) * w + x];
      v[y * w + x] = s / n;
    }
  return v;
}

const hash2 = (x: number, y: number) => {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
/** Smooth value noise in [-1, 1], deterministic per world position (metres). */
export function swell(xm: number, zm: number) {
  let total = 0,
    amp = 1,
    norm = 0;
  for (let o = 0; o < 2; o++) {
    const f = (1 << o) / SWELL_WAVE_M,
      x = xm * f,
      z = zm * f,
      x0 = Math.floor(x),
      z0 = Math.floor(z),
      ax = x - x0,
      az = z - z0,
      sx = ax * ax * (3 - 2 * ax),
      sz = az * az * (3 - 2 * az);
    const a = hash2(x0 + o * 101, z0),
      b = hash2(x0 + 1 + o * 101, z0),
      c = hash2(x0 + o * 101, z0 + 1),
      d = hash2(x0 + 1 + o * 101, z0 + 1);
    total += amp * ((a * (1 - sx) + b * sx) * (1 - sz) + (c * (1 - sx) + d * sx) * sz);
    norm += amp;
    amp *= 0.45;
  }
  return (total / norm) * 2 - 1;
}

/** What keeps the ground calm: roads, buildings (OSM features near the window). */
export type Calm = {
  roads: { pts: number[][]; width: number }[];
  buildings: { rings: number[][][] }[];
};

/** The ground around a point: a square window of height cells (heights at cell centres). */
export class HeightField {
  x0 = 0;
  z0 = 0;
  w = 0;
  v = new Float32Array(0);
  /** 1 = water cell (flat). */
  wet = new Uint8Array(0);
  waterLevel = 0;
  version = 0;
  /** Ground height in scene units at a point (bilinear between cell centres; 0 without data). */
  at(x: number, z: number) {
    const w = this.w;
    if (!w) return 0;
    const fx = Math.min(w - 1, Math.max(0, (x - this.x0) / CELL - 0.5)),
      fz = Math.min(w - 1, Math.max(0, (z - this.z0) / CELL - 0.5)),
      i = Math.min(w - 2, Math.floor(fx)),
      j = Math.min(w - 2, Math.floor(fz)),
      ax = fx - i,
      az = fz - j,
      v = this.v;
    const a = v[j * w + i], b = v[j * w + i + 1], c = v[(j + 1) * w + i], d = v[(j + 1) * w + i + 1];
    return (a * (1 - ax) + b * ax) * (1 - az) + (c * (1 - ax) + d * ax) * az;
  }
  /** Lowest height in the window. */
  low() {
    let m = 0;
    for (let k = 0; k < this.v.length; k++) m = Math.min(m, this.v[k]);
    return m;
  }
  /** Rebuilds the window (`radius` scene units) from elevations; `ref` metres = height 0.
   * Returns false while the elevation is still unknown there. */
  build(
    center: Point,
    radius: number,
    origin: Geo,
    ref: number,
    elevation: Elevation,
    water: (p: Point) => boolean,
    calm?: Calm,
  ) {
    const w = Math.ceil((radius * 2) / CELL),
      x0 = Math.floor((center.x - radius) / CELL) * CELL,
      z0 = Math.floor((center.z - radius) / CELL) * CELL,
      v = new Float32Array(w * w),
      centre = (i: number, j: number) => ({ x: x0 + (i + 0.5) * CELL, z: z0 + (j + 0.5) * CELL });
    let known = 0;
    for (let j = 0; j < w; j++)
      for (let i = 0; i < w; i++) {
        const m = elevation.at(unproject(centre(i, j), origin));
        if (m !== null) known++;
        v[j * w + i] = m === null ? 0 : heightFor(m - ref);
      }
    if (known < w * w * 0.5) return false;
    // Water is flat: each water cell sits at the lowest water cell around it.
    const wet = new Uint8Array(w * w);
    let waterLevel = Infinity;
    for (let j = 0; j < w; j++)
      for (let i = 0; i < w; i++)
        if (water(centre(i, j))) {
          wet[j * w + i] = 1;
          waterLevel = Math.min(waterLevel, v[j * w + i]);
        }
    const flatten = () => {
      if (waterLevel < Infinity) for (let k = 0; k < w * w; k++) if (wet[k]) v[k] = waterLevel;
    };
    flatten();
    // Swell on open ground, fading within 3 cells of roads, buildings and water.
    const calmCells = new Uint8Array(w * w);
    calmCells.set(wet);
    const mark = (x: number, z: number, r: number) => {
      const ci0 = Math.floor((x - r - x0) / CELL), ci1 = Math.floor((x + r - x0) / CELL),
        cj0 = Math.floor((z - r - z0) / CELL), cj1 = Math.floor((z + r - z0) / CELL);
      for (let j = Math.max(0, cj0); j <= Math.min(w - 1, cj1); j++)
        for (let i = Math.max(0, ci0); i <= Math.min(w - 1, ci1); i++) calmCells[j * w + i] = 1;
    };
    const x1 = x0 + w * CELL, z1 = z0 + w * CELL;
    for (const road of calm?.roads ?? [])
      for (let k = 1; k < road.pts.length; k++) {
        const [ax, az] = road.pts[k - 1], [bx, bz] = road.pts[k];
        if (Math.max(ax, bx) < x0 || Math.min(ax, bx) > x1 || Math.max(az, bz) < z0 || Math.min(az, bz) > z1) continue;
        const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / (CELL / 2)));
        for (let t = 0; t <= steps; t++) mark(ax + ((bx - ax) * t) / steps, az + ((bz - az) * t) / steps, road.width / 2);
      }
    for (const b of calm?.buildings ?? []) {
      const r = b.rings[0];
      let bx0 = Infinity, bx1 = -Infinity, bz0 = Infinity, bz1 = -Infinity;
      for (const [px, pz] of r) (bx0 = Math.min(bx0, px)), (bx1 = Math.max(bx1, px)), (bz0 = Math.min(bz0, pz)), (bz1 = Math.max(bz1, pz));
      if (bx1 < x0 || bx0 > x1 || bz1 < z0 || bz0 > z1) continue;
      mark((bx0 + bx1) / 2, (bz0 + bz1) / 2, Math.max(bx1 - bx0, bz1 - bz0) / 2);
    }
    // Distance (cells) to the nearest calm cell: two chamfer passes.
    const dist = new Float32Array(w * w);
    for (let k = 0; k < w * w; k++) dist[k] = calmCells[k] ? 0 : 99;
    for (let j = 0; j < w; j++)
      for (let i = 0; i < w; i++) {
        const k = j * w + i;
        if (i) dist[k] = Math.min(dist[k], dist[k - 1] + 1);
        if (j) dist[k] = Math.min(dist[k], dist[k - w] + 1);
      }
    for (let j = w - 1; j >= 0; j--)
      for (let i = w - 1; i >= 0; i--) {
        const k = j * w + i;
        if (i < w - 1) dist[k] = Math.min(dist[k], dist[k + 1] + 1);
        if (j < w - 1) dist[k] = Math.min(dist[k], dist[k + w] + 1);
      }
    const amp = heightFor(SWELL_M) - heightFor(0);
    for (let j = 0; j < w; j++)
      for (let i = 0; i < w; i++) {
        const k = j * w + i,
          fade = Math.min(1, dist[k] / 3);
        if (!fade) continue;
        const g = unproject(centre(i, j), origin),
          xm = g.lon * 111320 * Math.cos((origin.lat * Math.PI) / 180),
          zm = g.lat * 110540;
        v[k] += swell(xm, zm) * amp * fade;
      }
    limitSlope(v, w, w);
    blur(v, w, w, 2);
    flatten();
    // Keep dry land at or above the water so shores never dip under it.
    if (waterLevel < Infinity) for (let k = 0; k < w * w; k++) if (!wet[k]) v[k] = Math.max(v[k], waterLevel + 0.02);
    Object.assign(this, { x0, z0, w, v, wet, waterLevel: waterLevel < Infinity ? waterLevel : 0 });
    this.version++;
    return true;
  }
}
/** Water test for a map (point inside any water polygon). */
export function waterTest(map: MapData) {
  const boxes = map.areas
    .filter((a) => a.water)
    .map((a) => {
      const r = a.rings[0];
      return { r, x0: Math.min(...r.map((p) => p[0])), x1: Math.max(...r.map((p) => p[0])), z0: Math.min(...r.map((p) => p[1])), z1: Math.max(...r.map((p) => p[1])) };
    });
  return (p: Point) =>
    boxes.some((b) => {
      if (p.x < b.x0 || p.x > b.x1 || p.z < b.z0 || p.z > b.z1) return false;
      let hit = false;
      for (let i = 0, j = b.r.length - 1; i < b.r.length; j = i++) {
        const a = b.r[i], c = b.r[j];
        if (a[1] > p.z !== c[1] > p.z && p.x < ((c[0] - a[0]) * (p.z - a[1])) / (c[1] - a[1]) + a[0]) hit = !hit;
      }
      return hit;
    });
}
