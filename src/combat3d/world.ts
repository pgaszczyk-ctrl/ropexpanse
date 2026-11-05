import { circleBlocked, type Point } from "./rules.ts";
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
  areas: { id?: string; rings: number[][][]; water: boolean; name: string }[];
};
export const WORLD_VERSION = 1,
  SCALE = 0.18,
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
export type Tile = { v: 1; key: string; elements: Element[]; savedAt: number };
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
let dbPromise: Promise<IDBDatabase> | undefined;
function database() {
  return (dbPromise ??= new Promise<IDBDatabase>((resolve, reject) => {
    const r = indexedDB.open("ropexpanse-world", 1);
    r.onupgradeneeded = () =>
      r.result.createObjectStore("tiles", { keyPath: "key" });
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  }));
}
async function cached(key: string): Promise<Tile | undefined> {
  try {
    const db = await database();
    return await new Promise((resolve, reject) => {
      const r = db.transaction("tiles").objectStore("tiles").get(key);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
  } catch {
    return undefined;
  }
}
async function cache(tile: Tile) {
  try {
    const db = await database();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("tiles", "readwrite");
      tx.objectStore("tiles").put(tile);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    const tx = db.transaction("tiles", "readwrite"),
      store = tx.objectStore("tiles");
    const r = store.getAll();
    r.onsuccess = () => {
      const all = (r.result as Tile[]).sort((a, b) => b.savedAt - a.savedAt);
      for (const old of all.slice(96)) store.delete(old.key);
    };
  } catch {
    /* Play remains available when persistent cache is full/disabled. */
  }
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
  request(p: Point) {
    const geo = unproject(p, this.origin),
      t = tileAt(geo);
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
        this.tiles.delete(key);
        this.changed = true;
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
  async pump() {
    if (this.loading) return;
    const tile = this.wanted.find(
      (t) =>
        !this.tiles.has(`${t.x}:${t.y}`) &&
        Date.now() - (this.failures.get(`${t.x}:${t.y}`) ?? 0) > 60_000,
    );
    if (!tile) return;
    this.loading = true;
    const key = `${tile.x}:${tile.y}`,
      generation = this.generation;
    try {
      let data = await cached(key);
      if (!data || data.v !== WORLD_VERSION) {
        const delay = Math.max(0, 3000 - (Date.now() - this.lastRequest));
        if (delay) await new Promise((r) => setTimeout(r, delay));
        this.lastRequest = Date.now();
        const b = tileBounds(tile.x, tile.y),
          bbox = `${b.south},${b.west},${b.north},${b.east}`;
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
        data = { v: 1, key, elements: json.elements, savedAt: Date.now() };
        await cache(data);
      }
      if (
        generation === this.generation &&
        this.wanted.some((t) => `${t.x}:${t.y}` === key)
      ) {
        this.tiles.set(key, data);
        this.changed = true;
        this.error = "";
      }
    } catch (e) {
      this.failures.set(key, Date.now());
      this.error = e instanceof Error ? e.message : "Brak połączenia";
    } finally {
      this.loading = false;
    }
  }
  snapshot(): MapData {
    const elements = new Map<string, Element>();
    for (const t of this.tiles.values())
      for (const e of t.elements) elements.set(`${e.type}/${e.id}`, e);
    const next = convertElements([...elements.values()], this.origin);
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
