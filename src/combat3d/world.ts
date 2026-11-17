import { circleBlocked, type Point } from "./rules.ts";
import { worldUrl } from "./osmTiles.ts";
import { WORLD_VERSION, cache, readTile, type Tile, type TileBox } from "./tileStore.ts";
export { WORLD_VERSION, type Tile };
export type Geo = { lat: number; lon: number };
export type Building = {
  id?: string;
  rings: number[][][];
  height: number;
  name: string;
  address: string;
};
export type MapData = {
  origin: Geo;
  scale: number;
  radius: number;
  buildings: Building[];
  roads: {
    id?: string;
    pts: number[][];
    width: number;
    path: boolean;
    name: string;
  }[];
  areas: {
    id?: string;
    rings: number[][][];
    water: boolean;
    name: string;
    /** OSM landuse / leisure / natural value (absent in the bundled extract = green). */
    kind?: string;
  }[];
};
export const SCALE = 0.18,
  TILE_DEGREES = 0.006;
export const OSM_ENDPOINT = "https://overpass.private.coffee/api/interpreter";
const METERS = 111320;
export const wrapLongitude = (lon: number) =>
  ((((lon + 180) % 360) + 360) % 360) - 180;
export function project(p: Geo, origin: Geo): Point {
  return {
    x:
      wrapLongitude(p.lon - origin.lon) *
      METERS *
      Math.max(0.00001, Math.cos((origin.lat * Math.PI) / 180)) *
      SCALE,
    z: (origin.lat - p.lat) * METERS * SCALE,
  };
}
export function unproject(p: Point, origin: Geo): Geo {
  return {
    lat: Math.max(-90, Math.min(90, origin.lat - p.z / (METERS * SCALE))),
    lon: wrapLongitude(
      origin.lon +
        p.x /
          (METERS *
            Math.max(0.00001, Math.cos((origin.lat * Math.PI) / 180)) *
            SCALE),
    ),
  };
}
// Latitude bands keep each tile approximately the same physical size, including near the poles.
export function columnsForRow(y: number) {
  const latitude = -90 + (y + 0.5) * TILE_DEGREES;
  return Math.max(
    1,
    Math.ceil(
      (360 * Math.max(0.00001, Math.cos((latitude * Math.PI) / 180))) /
        TILE_DEGREES,
    ),
  );
}
export function tileAt(p: Geo) {
  const y = Math.min(
    29999,
    Math.max(
      0,
      Math.floor((Math.max(-90, Math.min(90, p.lat)) + 90) / TILE_DEGREES),
    ),
  );
  const columns = columnsForRow(y);
  return {
    x: Math.min(
      columns - 1,
      Math.floor(((wrapLongitude(p.lon) + 180) / 360) * columns),
    ),
    y,
  };
}
export function tileBounds(x: number, y: number) {
  const width = 360 / columnsForRow(y);
  return {
    south: -90 + y * TILE_DEGREES,
    west: -180 + x * width,
    north: Math.min(90, -90 + (y + 1) * TILE_DEGREES),
    east: Math.min(180, -180 + (x + 1) * width),
  };
}
export function hash(text: string) {
  let n = 2166136261;
  for (const ch of text) n = Math.imul(n ^ ch.charCodeAt(0), 16777619);
  return n >>> 0;
}
type Coord = { lat: number; lon: number };
type Element = {
  type: string;
  id: number;
  tags?: Record<string, string>;
  geometry?: Coord[];
  members?: { type: string; role: string; geometry?: Coord[] }[];
};
function stitch(parts: Coord[][]) {
  const pending = parts.map((p) => p.slice()),
    out: Coord[][] = [];
  const same = (a: Coord, b: Coord) => a.lat === b.lat && a.lon === b.lon;
  while (pending.length) {
    let ring = pending.shift()!;
    let added = true;
    while (added && !same(ring[0], ring[ring.length - 1])) {
      added = false;
      for (let i = 0; i < pending.length; i++) {
        let p = pending[i];
        if (same(ring.at(-1)!, p.at(-1)!)) p = p.slice().reverse();
        if (same(ring.at(-1)!, p[0])) {
          ring.push(...p.slice(1));
          pending.splice(i, 1);
          added = true;
          break;
        }
      }
    }
    if (ring.length >= 4 && same(ring[0], ring.at(-1)!)) out.push(ring);
  }
  return out;
}
export function convertElements(elements: Element[], origin: Geo): MapData {
  const data: MapData = {
    origin,
    scale: SCALE,
    radius: Infinity,
    buildings: [],
    roads: [],
    areas: [],
  };
  const relationWays = new Set<number>();
  for (const e of elements)
    if (
      e.type === "relation" &&
      (e.tags?.building || e.tags?.water || e.tags?.natural === "water")
    )
      for (const m of (
        e as Element & { members?: { ref: number; type: string }[] }
      ).members ?? [])
        if (m.type === "way") relationWays.add(m.ref);
  const coord = (g: Coord[]) =>
    g.map((p) => {
      const q = project(p, origin);
      return [q.x, q.z];
    });
  for (const e of elements) {
    const t = e.tags ?? {},
      id = `${e.type}/${e.id}`;
    if (e.type === "way" && relationWays.has(e.id)) continue;
    const outers =
      e.type === "relation"
        ? stitch(
            (e.members ?? [])
              .filter((m) => m.role !== "inner" && m.geometry?.length)
              .map((m) => m.geometry!),
          )
        : e.geometry?.length
          ? [e.geometry]
          : [];
    const inners =
      e.type === "relation"
        ? stitch(
            (e.members ?? [])
              .filter((m) => m.role === "inner" && m.geometry?.length)
              .map((m) => m.geometry!),
          )
        : [];
    if (t.highway && e.geometry?.length) {
      const path = [
        "footway",
        "path",
        "steps",
        "cycleway",
        "track",
        "pedestrian",
      ].includes(t.highway);
      data.roads.push({
        id,
        pts: coord(e.geometry),
        width: Math.max(
          0.35,
          Math.min(3, (Number.parseFloat(t.width) || (path ? 2 : 6)) * SCALE),
        ),
        path,
        name: t.name ?? "",
      });
      continue;
    }
    for (let i = 0; i < outers.length; i++) {
      const g = outers[i];
      if (
        g.length < 4 ||
        g[0].lat !== g.at(-1)!.lat ||
        g[0].lon !== g.at(-1)!.lon
      )
        continue;
      const outer = coord(g),
        holes = inners
          .filter((h) => pointInside(project(h[0], origin), outer))
          .map(coord),
        rings = [outer, ...holes];
      if (t.building)
        data.buildings.push({
          id: `${id}/${i}`,
          rings,
          height: Math.max(
            1,
            Math.min(
              10,
              (Number.parseFloat(t.height) ||
                Number(t["building:levels"]) * 3 ||
                6) * SCALE,
            ),
          ),
          name: t.name ?? "",
          address: t["addr:street"] ?? "",
        });
      else if (t.landuse || t.leisure || t.natural === "water" || t.water)
        data.areas.push({
          id: `${id}/${i}`,
          rings,
          water:
            t.natural === "water" || !!t.water || t.landuse === "reservoir",
          name: t.name ?? "",
          kind: t.landuse ?? t.leisure ?? t.natural,
        });
    }
  }
  return data;
}
function pointInside(p: Point, ring: number[][]) {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i],
      b = ring[j];
    if (
      a[1] > p.z !== b[1] > p.z &&
      p.x < ((b[0] - a[0]) * (p.z - a[1])) / (b[1] - a[1]) + a[0]
    )
      hit = !hit;
  }
  return hit;
}
const breathe = () => new Promise<void>((r) => setTimeout(r, 0));
const idle = (job: () => void) =>
  typeof requestIdleCallback === "function" ? requestIdleCallback(job, { timeout: 4000 }) : setTimeout(job, 50);
// Tiles are read and decoded in a worker, off the thread that draws the game: decoding
// a city tile and storing it took tens of milliseconds each, in the middle of frames
// (report of 11 Nov 2026). Where a worker cannot start (tests in Node, the single-file
// offline export) the same code runs here, as before.
let tileWorker: Worker | null | undefined;
let tileJobs = 0;
const WORKER_WAIT_MS = 8_000,
  TILE_WAIT_MS = 30_000;
const waiting = new Map<number, { resolve: (t: Tile) => void; reject: (e: Error) => void; key: string; box: TileBox }>();
function startTileWorker() {
  if (tileWorker !== undefined) return tileWorker;
  tileWorker = null;
  if (typeof Worker === "undefined" || typeof location === "undefined") return null;
  try {
    const worker = new Worker(new URL("./tileWorker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (e: MessageEvent<{ id: number; tile?: Tile; error?: string }>) => {
      const job = waiting.get(e.data.id);
      if (!job) return;
      waiting.delete(e.data.id);
      if (e.data.tile) job.resolve(e.data.tile);
      else job.reject(Error(e.data.error || "Mapa niedostępna"));
    };
    // The worker failed to load or crashed: finish what it held here, and stay here.
    worker.onerror = () => {
      tileWorker = null;
      for (const [id, job] of waiting) {
        waiting.delete(id);
        readTile(job.key, job.box).then(job.resolve, job.reject);
      }
    };
    tileWorker = worker;
  } catch {
    tileWorker = null;
  }
  return tileWorker;
}
function loadTile(key: string, box: TileBox): Promise<Tile> {
  const worker = startTileWorker();
  if (!worker) return readTile(key, box);
  return new Promise((resolve, reject) => {
    const id = ++tileJobs;
    waiting.set(id, { resolve, reject, key, box });
    worker.postMessage({ id, key, box, world: worldUrl() });
    // A worker that stays silent is given up on: the tile is read here instead, and so
    // are the next ones. The game must not sit on its loading screen because of it.
    setTimeout(() => {
      if (!waiting.delete(id)) return;
      if (tileWorker === worker) tileWorker = null;
      console.warn("Tile worker did not answer; reading tiles on the main thread");
      readTile(key, box).then(resolve, reject);
    }, WORKER_WAIT_MS);
  });
}
async function overpass(
  b: ReturnType<typeof tileBounds>,
  wait: () => number,
): Promise<Element[]> {
  const delay = wait();
  if (delay) await new Promise((r) => setTimeout(r, delay));
  const bbox = `${b.south},${b.west},${b.north},${b.east}`;
  const query = `[out:json][timeout:20];(way[building](${bbox});relation[building](${bbox});way[highway](${bbox});way[natural=water](${bbox});relation[natural=water](${bbox});way[landuse](${bbox});way[leisure=park](${bbox}););out geom;`;
  const response = await fetch(OSM_ENDPOINT, {
    method: "POST",
    body: new URLSearchParams({ data: query }),
    signal: AbortSignal.timeout(25_000),
  });
  if (!response.ok) throw Error(`HTTP ${response.status}`);
  const json = await response.json();
  if (!Array.isArray(json.elements) || json.remark)
    throw Error("Niepełne dane mapy");
  return json.elements;
}
export class WorldStream {
  origin: Geo;
  tiles = new Map<string, Tile>();
  loading = false;
  error = "";
  changed = false;
  private wanted: { x: number; y: number }[] = [];
  private failures = new Map<string, number>();
  private lastRequest = 0;
  private generation = 0;
  private seed?: MapData;
  /** A wider block of tiles kept around a new camp or a ride's end (owner, 8 Nov: load a
   * bigger piece while the camp goes up, so walking around it does not stutter). */
  private pinned: { x: number; y: number }[] = [];
  private pinCenter: { x: number; y: number } | null = null;
  constructor(origin: Geo, seed?: MapData) {
    this.origin = origin;
    this.seed = seed;
  }
  contains(p: Point, margin = 1) {
    if (
      this.seed &&
      Math.abs(p.x) < this.seed.radius - margin &&
      Math.abs(p.z) < this.seed.radius - margin
    )
      return true;
    for (const dx of [-margin, margin])
      for (const dz of [-margin, margin]) {
        const t = tileAt(unproject({ x: p.x + dx, z: p.z + dz }, this.origin));
        if (!this.tiles.has(`${t.x}:${t.y}`)) return false;
      }
    return true;
  }
  /** Keeps the tiles within `ring` of `p` loaded until the party walks well away. */
  pin(p: Point, ring = 2) {
    const geo = unproject(p, this.origin),
      t = tileAt(geo);
    this.pinCenter = t;
    this.pinned = [];
    for (let dy = -ring; dy <= ring; dy++) {
      const y = t.y + dy;
      if (y < 0 || y >= 30000) continue;
      const row = tileAt({ lat: -90 + (y + 0.5) * TILE_DEGREES, lon: geo.lon }),
        columns = columnsForRow(y);
      for (let dx = -ring; dx <= ring; dx++)
        this.pinned.push({ x: (row.x + dx + columns) % columns, y });
    }
    this.request(p);
  }
  request(p: Point) {
    const geo = unproject(p, this.origin),
      t = tileAt(geo);
    if (this.pinCenter && (Math.abs(this.pinCenter.y - t.y) > 4 || Math.abs(this.pinCenter.x - t.x) > 4)) {
      this.pinCenter = null;
      this.pinned = [];
    }
    this.wanted = [];
    const required = new Set<string>();
    for (const dx of [-2, 2])
      for (const dz of [-2, 2]) {
        const q = tileAt(unproject({ x: p.x + dx, z: p.z + dz }, this.origin));
        required.add(`${q.x}:${q.y}`);
      }
    for (let dy = -1; dy <= 1; dy++) {
      const y = t.y + dy;
      if (y < 0 || y >= 30000) continue;
      const row = tileAt({ lat: -90 + (y + 0.5) * TILE_DEGREES, lon: geo.lon }),
        columns = columnsForRow(y);
      for (let dx = -1; dx <= 1; dx++) {
        const x = (row.x + dx + columns) % columns;
        if (!this.wanted.some((v) => v.x === x && v.y === y))
          this.wanted.push({ x, y });
      }
    }
    for (const v of this.pinned)
      if (!this.wanted.some((w) => w.x === v.x && w.y === v.y)) this.wanted.push(v);
    const score = (v: { x: number; y: number }) => {
      const b = tileBounds(v.x, v.y),
        q = project(
          { lat: (b.south + b.north) / 2, lon: (b.west + b.east) / 2 },
          this.origin,
        );
      return Math.hypot(q.x - p.x, q.z - p.z);
    };
    this.wanted.sort(
      (a, b) =>
        Number(required.has(`${b.x}:${b.y}`)) -
          Number(required.has(`${a.x}:${a.y}`)) || score(a) - score(b),
    );
    const wantedKeys = new Set(this.wanted.map((v) => `${v.x}:${v.y}`));
    for (const key of this.tiles.keys())
      if (!wantedKeys.has(key)) {
        // Dropping far tiles needs no redraw of its own; the next one leaves them out.
        this.tiles.delete(key);
      }
    if (!this.loading) void this.pump();
  }
  async load(p: Point) {
    this.request(p);
    while (this.loading) await new Promise((r) => setTimeout(r, 50));
    for (let i = 0; i < 9 && !this.contains(p) && !this.error; i++)
      await this.pump();
    if (!this.contains(p)) throw Error(this.error || "Mapa niedostępna");
  }
  retry() {
    this.failures.clear();
    this.error = "";
    void this.pump();
  }
  private next() {
    return this.wanted.find(
      (t) =>
        !this.tiles.has(`${t.x}:${t.y}`) &&
        Date.now() - (this.failures.get(`${t.x}:${t.y}`) ?? 0) > 60_000,
    );
  }
  /** Wanted tiles still to come (failed ones wait a minute and do not count). */
  pending() {
    return this.wanted.filter(
      (t) =>
        !this.tiles.has(`${t.x}:${t.y}`) &&
        Date.now() - (this.failures.get(`${t.x}:${t.y}`) ?? 0) > 60_000,
    ).length;
  }
  /** Loads every wanted tile one after another (it used to fetch one per world tick,
   * so a new area arrived tile by tile, about one a second, each forcing a redraw). */
  async pump() {
    if (this.loading) return;
    while (this.next()) await this.fetchOne(this.next()!);
  }
  private async fetchOne(tile: { x: number; y: number }) {
    this.loading = true;
    const key = `${tile.x}:${tile.y}`,
      generation = this.generation;
    try {
      let data: Tile;
      try {
        // A read that never ends (a hung connection) would hold the whole queue.
        data = await Promise.race([
          loadTile(key, tileBounds(tile.x, tile.y)),
          new Promise<never>((_, reject) => setTimeout(() => reject(Error("Mapa nie odpowiada")), TILE_WAIT_MS)),
        ]);
      } catch (worldError) {
        // The world archive is the source; the public Overpass server is only a fallback.
        console.warn("World map tile failed, trying Overpass", worldError);
        const elements = await overpass(tileBounds(tile.x, tile.y), () => {
          const delay = Math.max(0, 3000 - (Date.now() - this.lastRequest));
          this.lastRequest = Date.now() + delay;
          return delay;
        });
        const fresh = (data = { v: WORLD_VERSION, key, elements, savedAt: Date.now() });
        idle(() => void cache(fresh));
      }
      // A tile is read, turned into shapes and handed over in separate small steps, so
      // no single frame carries the whole tile.
      await breathe();
      const wanted = () => generation === this.generation && this.wanted.some((t) => `${t.x}:${t.y}` === key);
      if (wanted()) {
        const shapes = this.tileData(key, data);
        this.tiles.set(key, data);
        this.changed = true;
        this.error = "";
        await breathe();
        if (wanted()) this.onTile?.(shapes);
      }
    } catch (e) {
      this.failures.set(key, Date.now());
      this.error = e instanceof Error ? e.message : "Brak połączenia";
    } finally {
      this.loading = false;
    }
  }
  /** Each tile is turned into map shapes once and kept; a snapshot only joins them.
   * The same building object comes back in every snapshot, so whatever the game
   * prepared for it (its mesh data) is reused instead of being built again. */
  private converted = new Map<string, { tile: Tile; data: MapData }>();
  /** Told about every tile as it arrives (the game starts preparing its buildings). */
  onTile?: (data: MapData) => void;
  private tileData(key: string, tile: Tile) {
    let c = this.converted.get(key);
    if (!c || c.tile !== tile)
      this.converted.set(key, (c = { tile, data: convertElements(tile.elements, this.origin) }));
    return c.data;
  }
  snapshot(): MapData {
    const next: MapData = { origin: this.origin, scale: SCALE, radius: Infinity, buildings: [], roads: [], areas: [] };
    for (const key of this.converted.keys()) if (!this.tiles.has(key)) this.converted.delete(key);
    // Shapes on a tile edge come with both tiles; the first copy is kept.
    for (const list of ["buildings", "roads", "areas"] as const) {
      const seen = new Set<string>(),
        out = next[list] as { id?: string }[];
      for (const [key, tile] of this.tiles)
        for (const item of this.tileData(key, tile)[list]) {
          if (item.id !== undefined) {
            if (seen.has(item.id)) continue;
            seen.add(item.id);
          }
          out.push(item);
        }
    }
    if (this.seed) {
      const seed = this.seed; // Bundled geometry wins inside its footprint to avoid duplicate buildings.
      const inside = (pts: number[][]) =>
        pts.length &&
        pts.every(
          (p) => Math.abs(p[0]) < seed.radius && Math.abs(p[1]) < seed.radius,
        );
      next.buildings = next.buildings.filter((b) => !inside(b.rings[0]));
      next.roads = next.roads.filter((r) => !inside(r.pts));
      next.areas = next.areas.filter((a) => !inside(a.rings[0]));
      next.buildings.unshift(...seed.buildings);
      next.roads.unshift(...seed.roads);
      next.areas.unshift(...seed.areas);
    }
    this.changed = false;
    return next;
  }
  // Rebase all geographic data, keeping renderer coordinates small during long trips.
  rebase(origin: Geo) {
    this.origin = origin;
    this.seed = undefined;
    this.generation++;
    this.converted.clear();
    this.changed = true;
  }
}

export function findLanding(
  data: MapData,
  contains: (p: Point) => boolean,
): Point {
  const free = (p: Point) =>
    contains(p) &&
    !data.buildings.some((b) => circleBlocked(p, 3.6, b.rings)) &&
    !data.areas.some((a) => a.water && circleBlocked(p, 3.6, a.rings));
  if (free({ x: 0, z: 0 })) return { x: 0, z: 0 };
  for (let r = 1; r <= 35; r += 1)
    for (let a = 0; a < Math.PI * 2; a += 0.25) {
      const p = { x: Math.sin(a) * r, z: Math.cos(a) * r };
      if (free(p)) return p;
    }
  throw Error("Brak miejsca na obóz w tym miejscu");
}
export function encounterCells(geo: Geo) {
  const step = 0.00038,
    cy = Math.floor((geo.lat + 90) / step),
    cells: { key: string; seed: number; geo: Geo }[] = [];
  for (
    let y = Math.max(0, cy - 8);
    y <= Math.min(Math.ceil(180 / step) - 1, cy + 8);
    y++
  ) {
    const lat = -90 + (y + 0.5) * step,
      columns = Math.max(
        1,
        Math.ceil(
          (360 * Math.max(0.00001, Math.cos((lat * Math.PI) / 180))) / step,
        ),
      ),
      width = 360 / columns,
      cx = Math.floor((wrapLongitude(geo.lon) + 180) / width);
    for (let dx = -8; dx <= 8; dx++) {
      const x = (cx + dx + columns) % columns,
        key = `v2:${x}:${y}`;
      if (cells.some((c) => c.key === key)) continue;
      const seed = hash(key);
      cells.push({
        key,
        seed,
        geo: {
          lat: -90 + (y + 0.2 + (seed % 61) / 100) * step,
          lon: wrapLongitude(
            -180 + (x + 0.2 + ((seed >>> 8) % 61) / 100) * width,
          ),
        },
      });
    }
  }
  return cells;
}
