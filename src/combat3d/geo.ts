// Map data types, local projection and slippy-tile math. Pure functions: used by
// the game, the tile worker and the Node tests.
export type Rect = { x0: number; x1: number; z0: number; z1: number };
export type Building = {
  rings: number[][][];
  height: number;
  name: string;
  address: string;
};
export type Road = {
  pts: number[][];
  width: number;
  path: boolean;
  name: string;
  water?: boolean;
};
export type AreaKind = "water" | "grass" | "park" | "wood" | "farm";
export type Area = { rings: number[][][]; kind: AreaKind; name: string };
/** Map content of one rectangle, in scene units. */
export type RawRegion = {
  key: string;
  rect: Rect;
  buildings: Building[];
  roads: Road[];
  areas: Area[];
};
export type Origin = { lat: number; lon: number };

/** Scene units per metre. Same as the bundled Lublin extract and existing saves. */
export const SCALE = 0.18;
export const ORIGIN: Origin = { lat: 51.2482, lon: 22.5681 };
/** Zoom of the vector tiles: about 1.5 km per tile at Lublin's latitude. */
export const TILE_ZOOM = 14;
const M_PER_DEG = 111320;

export function projection(origin: Origin = ORIGIN, scale = SCALE) {
  const kx = M_PER_DEG * Math.cos((origin.lat * Math.PI) / 180) * scale,
    kz = M_PER_DEG * scale;
  return {
    x: (lon: number) => (lon - origin.lon) * kx,
    z: (lat: number) => -(lat - origin.lat) * kz,
    lon: (x: number) => origin.lon + x / kx,
    lat: (z: number) => origin.lat - z / kz,
  };
}
export type Projection = ReturnType<typeof projection>;

const tiles = (z: number) => 2 ** z;
export const tileX = (lon: number, z = TILE_ZOOM) =>
  Math.floor(((lon + 180) / 360) * tiles(z));
export const tileY = (lat: number, z = TILE_ZOOM) =>
  Math.floor(
    ((1 - Math.asinh(Math.tan((lat * Math.PI) / 180)) / Math.PI) / 2) *
      tiles(z),
  );
export const tileLon = (x: number, z = TILE_ZOOM) => (x / tiles(z)) * 360 - 180;
export const tileLat = (y: number, z = TILE_ZOOM) =>
  (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / tiles(z)))) * 180) / Math.PI;

/** Tile edges are meridians and parallels, so a tile is an exact rectangle in the local projection. */
export function tileRect(tx: number, ty: number, p: Projection): Rect {
  return {
    x0: p.x(tileLon(tx)),
    x1: p.x(tileLon(tx + 1)),
    z0: p.z(tileLat(ty)),
    z1: p.z(tileLat(ty + 1)),
  };
}
export function rectDistance(r: Rect, x: number, z: number) {
  const dx = Math.max(r.x0 - x, 0, x - r.x1),
    dz = Math.max(r.z0 - z, 0, z - r.z1);
  return Math.hypot(dx, dz);
}
/** Tiles touching a circle (scene units), nearest first. */
export function tilesAround(x: number, z: number, radius: number, p: Projection) {
  const a = tileX(p.lon(x - radius)),
    b = tileX(p.lon(x + radius)),
    c = tileY(p.lat(z - radius)),
    d = tileY(p.lat(z + radius));
  const out: { tx: number; ty: number; key: string; rect: Rect; d: number }[] = [];
  for (let tx = a; tx <= b; tx++)
    for (let ty = c; ty <= d; ty++) {
      const rect = tileRect(tx, ty, p),
        dist = rectDistance(rect, x, z);
      if (dist <= radius) out.push({ tx, ty, key: `${TILE_ZOOM}/${tx}/${ty}`, rect, d: dist });
    }
  return out.sort((u, v) => u.d - v.d);
}

/** Sutherland–Hodgman clip of a ring to an axis-aligned box. Returns a closed ring or null. */
export function clipRing(
  ring: number[][],
  x0: number,
  z0: number,
  x1: number,
  z1: number,
): number[][] | null {
  let pts = ring.slice();
  if (pts.length > 1) {
    const f = pts[0],
      l = pts[pts.length - 1];
    if (f[0] === l[0] && f[1] === l[1]) pts.pop();
  }
  const edges: [(p: number[]) => boolean, (a: number[], b: number[]) => number[]][] = [
    [(p) => p[0] >= x0, (a, b) => [x0, a[1] + ((b[1] - a[1]) * (x0 - a[0])) / (b[0] - a[0])]],
    [(p) => p[0] <= x1, (a, b) => [x1, a[1] + ((b[1] - a[1]) * (x1 - a[0])) / (b[0] - a[0])]],
    [(p) => p[1] >= z0, (a, b) => [a[0] + ((b[0] - a[0]) * (z0 - a[1])) / (b[1] - a[1]), z0]],
    [(p) => p[1] <= z1, (a, b) => [a[0] + ((b[0] - a[0]) * (z1 - a[1])) / (b[1] - a[1]), z1]],
  ];
  for (const [inside, cut] of edges) {
    if (!pts.length) break;
    const out: number[][] = [];
    for (let i = 0; i < pts.length; i++) {
      const cur = pts[i],
        prev = pts[(i + pts.length - 1) % pts.length],
        ci = inside(cur),
        pi = inside(prev);
      if (ci) {
        if (!pi) out.push(cut(prev, cur));
        out.push(cur);
      } else if (pi) out.push(cut(prev, cur));
    }
    pts = out;
  }
  if (pts.length < 3 || Math.abs(ringArea(pts)) < 1e-6) return null;
  pts.push(pts[0].slice());
  return pts;
}
/** Shoelace area in (x, z); sign depends on orientation. */
export function ringArea(r: number[][]) {
  let a = 0;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++)
    a += (r[j][0] - r[i][0]) * (r[j][1] + r[i][1]);
  return a / 2;
}
/** Bounding box [x0, z0, x1, z1] of a ring. */
export function ringBox(r: number[][]): [number, number, number, number] {
  let x0 = Infinity,
    z0 = Infinity,
    x1 = -Infinity,
    z1 = -Infinity;
  for (const [x, z] of r) {
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (z < z0) z0 = z;
    if (z > z1) z1 = z;
  }
  return [x0, z0, x1, z1];
}
/** Game height of a building (scene units) from its real height in metres. */
export function buildingHeight(metres: number) {
  const levels = Math.max(1, Math.min(4, Math.round((metres || 6) / 3)));
  return Math.min(6.8, 1.5 + levels * 0.85);
}
