// Terrain height (owner's design doc, Teren i kamera). OSM is flat, so heights come
// from AWS Terrain Tiles (Terrarium PNGs: free, worldwide, no API key; attribution
// "Terrain Tiles: Mapzen / AWS Open Data"), fetched and kept like the map. The game
// turns them into voxel terraces:
// - heights are rounded to whole voxels, so slopes become steps;
// - relief is exaggerated on lowlands and compressed in mountains (asinh);
// - neighbouring cells differ by at most one voxel, so the party can always step up;
// - water is always flat.
// Without data (offline, ocean) the world stays flat at 0, as before.
import { unproject, wrapLongitude, type Geo, type MapData } from "./world.ts";
import type { Point } from "./rules.ts";

export const TERRAIN_ZOOM = 12;
export const VOXEL = 0.6; // scene units per terrace step
export const CELL = 2; // scene units per height cell (~11 m)
const DEFAULT_URL = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium";
export function terrainUrl() {
  const q = typeof location === "undefined" ? null : new URLSearchParams(location.search).get("terrain");
  return q || DEFAULT_URL;
}
/** Metres above the start → voxels: strong on lowlands, gentle in mountains. */
export const voxelsFor = (deltaMeters: number) => Math.round(5 * Math.asinh(deltaMeters / 12));

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

/** Lowers peaks until no neighbour (4-way) differs by more than one voxel. */
export function limitSteps(v: Int16Array, w: number, h: number) {
  for (let pass = 0; pass < 4; pass++) {
    let changed = false;
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        let m = v[i];
        if (x > 0) m = Math.min(m, v[i - 1] + 1);
        if (y > 0) m = Math.min(m, v[i - w] + 1);
        if (m !== v[i]) (v[i] = m), (changed = true);
      }
    for (let y = h - 1; y >= 0; y--)
      for (let x = w - 1; x >= 0; x--) {
        const i = y * w + x;
        let m = v[i];
        if (x < w - 1) m = Math.min(m, v[i + 1] + 1);
        if (y < h - 1) m = Math.min(m, v[i + w] + 1);
        if (m !== v[i]) (v[i] = m), (changed = true);
      }
    if (!changed) break;
  }
  return v;
}

/** The voxel terraces around a point: a square window of height cells. */
export class HeightField {
  x0 = 0;
  z0 = 0;
  w = 0;
  v = new Int16Array(0);
  version = 0;
  /** Voxel height (0 outside the window or without data). */
  voxel(x: number, z: number) {
    const cx = Math.floor((x - this.x0) / CELL),
      cz = Math.floor((z - this.z0) / CELL);
    if (cx < 0 || cz < 0 || cx >= this.w || cz >= this.w) return 0;
    return this.v[cz * this.w + cx];
  }
  /** Ground height in scene units at a point. */
  at(x: number, z: number) {
    return this.voxel(x, z) * VOXEL;
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
  ) {
    const w = Math.ceil((radius * 2) / CELL),
      x0 = Math.floor((center.x - radius) / CELL) * CELL,
      z0 = Math.floor((center.z - radius) / CELL) * CELL,
      v = new Int16Array(w * w);
    let known = 0;
    for (let j = 0; j < w; j++)
      for (let i = 0; i < w; i++) {
        const p = { x: x0 + (i + 0.5) * CELL, z: z0 + (j + 0.5) * CELL };
        const m = elevation.at(unproject(p, origin));
        if (m !== null) known++;
        v[j * w + i] = m === null ? 0 : voxelsFor(m - ref);
      }
    if (known < w * w * 0.5) return false;
    // Water is flat: each water cell sits at the lowest water cell around it.
    const wet = new Uint8Array(w * w);
    let waterLevel = Infinity;
    for (let j = 0; j < w; j++)
      for (let i = 0; i < w; i++)
        if (water({ x: x0 + (i + 0.5) * CELL, z: z0 + (j + 0.5) * CELL })) {
          wet[j * w + i] = 1;
          waterLevel = Math.min(waterLevel, v[j * w + i]);
        }
    if (waterLevel < Infinity) for (let k = 0; k < w * w; k++) if (wet[k]) v[k] = waterLevel;
    limitSteps(v, w, w);
    Object.assign(this, { x0, z0, w, v });
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
