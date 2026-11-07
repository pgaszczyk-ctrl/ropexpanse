// Map data from the Protomaps world map: one big PMTiles file of OpenStreetMap
// vector tiles, read in small pieces with HTTP range requests. It is the same
// immutable archive the sister game (erpeg) uses, so there is no public Overpass
// server to wait for. The game's tiles keep their shape: this module turns the
// zoom-15 vector tiles under a game tile into the Overpass-like elements that
// convertElements already understands.
import { PMTiles, type Source } from "pmtiles";
import { VectorTile, type VectorTileFeature } from "@mapbox/vector-tile";
import { PbfReader } from "pbf";

/** Immutable world archive (never overwritten; a new build gets a new name). */
const DEFAULT_WORLD =
  "https://pub-e885d1b5314941a1bc22df18bed8e25d.r2.dev/world-20261103.pmtiles";
export const ZOOM = 15;

type Coord = { lat: number; lon: number };
export type OsmElement = {
  type: string;
  id: number;
  tags?: Record<string, string>;
  geometry?: Coord[];
  members?: { type: string; role: string; geometry?: Coord[] }[];
};
type Pt = { x: number; y: number };

/** Archive address: `?world=<url>` (tests), then VITE_WORLD_URL at build time, then the shared archive. */
export function worldUrl() {
  const fromQuery =
    typeof location === "undefined"
      ? null
      : new URLSearchParams(location.search).get("world");
  const env = (import.meta as { env?: Record<string, string | undefined> }).env;
  return fromQuery || env?.VITE_WORLD_URL || DEFAULT_WORLD;
}

let file: PMTiles | undefined;
function world() {
  return (file ??= new PMTiles(worldUrl()));
}
/** Tests in Node read the archive from a local file. */
export function useWorldSource(source: Source) {
  file = new PMTiles(source);
  decoded.clear();
}

export const tileX = (lon: number) =>
  Math.floor(((lon + 180) / 360) * 2 ** ZOOM);
export const tileY = (lat: number) =>
  Math.floor(
    ((1 - Math.asinh(Math.tan((lat * Math.PI) / 180)) / Math.PI) / 2) *
      2 ** ZOOM,
  );
const lonOf = (x: number) => (x / 2 ** ZOOM) * 360 - 180;
const latOf = (y: number) =>
  (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / 2 ** ZOOM))) * 180) / Math.PI;

// Sutherland–Hodgman against the tile square: neighbouring tiles then meet edge to edge
// (vector tiles carry a buffer, which would draw shared roofs and roads twice).
function clipRing(ring: Pt[], ext: number) {
  let out = ring;
  const edges: [(p: Pt) => boolean, (a: Pt, b: Pt) => Pt][] = [
    [(p) => p.x >= 0, (a, b) => at(a, b, (0 - a.x) / (b.x - a.x))],
    [(p) => p.x <= ext, (a, b) => at(a, b, (ext - a.x) / (b.x - a.x))],
    [(p) => p.y >= 0, (a, b) => at(a, b, (0 - a.y) / (b.y - a.y))],
    [(p) => p.y <= ext, (a, b) => at(a, b, (ext - a.y) / (b.y - a.y))],
  ];
  for (const [inside, cross] of edges) {
    const src = out;
    out = [];
    for (let i = 0; i < src.length; i++) {
      const a = src[(i + src.length - 1) % src.length],
        b = src[i];
      if (inside(b)) {
        if (!inside(a)) out.push(cross(a, b));
        out.push(b);
      } else if (inside(a)) out.push(cross(a, b));
    }
    if (!out.length) break;
  }
  return out;
}
const at = (a: Pt, b: Pt, t: number) => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});
function clipLine(line: Pt[], ext: number) {
  const pieces: Pt[][] = [];
  let cur: Pt[] = [];
  const inside = (p: Pt) => p.x >= 0 && p.x <= ext && p.y >= 0 && p.y <= ext;
  for (let i = 0; i < line.length; i++) {
    const p = line[i];
    if (i > 0) {
      const seg = clipSegment(line[i - 1], p, ext);
      if (seg) {
        if (!cur.length) cur.push(seg[0]);
        cur.push(seg[1]);
      }
      if (!seg || !inside(p)) {
        if (cur.length > 1) pieces.push(cur);
        cur = [];
      }
    }
  }
  if (cur.length > 1) pieces.push(cur);
  return pieces;
}
// Liang–Barsky.
function clipSegment(a: Pt, b: Pt, ext: number): [Pt, Pt] | null {
  let t0 = 0,
    t1 = 1;
  const dx = b.x - a.x,
    dy = b.y - a.y;
  for (const [p, q] of [
    [-dx, a.x],
    [dx, ext - a.x],
    [-dy, a.y],
    [dy, ext - a.y],
  ]) {
    if (p === 0) {
      if (q < 0) return null;
      continue;
    }
    const r = q / p;
    if (p < 0) {
      if (r > t1) return null;
      if (r > t0) t0 = r;
    } else {
      if (r < t0) return null;
      if (r < t1) t1 = r;
    }
  }
  return [at(a, b, t0), at(a, b, t1)];
}

/** Signed area in tile coordinates (y down): > 0 for outer rings in vector tiles. */
function ringArea(r: Pt[]) {
  let a = 0;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++)
    a += (r[j].x - r[i].x) * (r[j].y + r[i].y);
  return a;
}
function polygons(f: VectorTileFeature, ext: number) {
  const out: Pt[][][] = [];
  for (const raw of f.loadGeometry()) {
    const outer = ringArea(raw) > 0;
    const r = clipRing(raw, ext);
    if (r.length < 3) continue;
    if (outer || !out.length) out.push([r]);
    else out[out.length - 1].push(r);
  }
  return out;
}

const PATHS: Record<string, string> = {
  sidewalk: "footway",
  crossing: "footway",
  corridor: "footway",
  bridleway: "path",
};
const LAYERS = ["buildings", "roads", "water", "landuse"] as const;

/** One zoom-15 tile as elements (ids are unique per tile, layer and feature). */
async function decodeTile(x: number, y: number): Promise<OsmElement[]> {
  const t = await world().getZxy(ZOOM, x, y);
  if (!t) return [];
  const vt = new VectorTile(new PbfReader(new Uint8Array(t.data)));
  const lon0 = lonOf(x),
    lon1 = lonOf(x + 1),
    lat0 = latOf(y),
    lat1 = latOf(y + 1);
  const out: OsmElement[] = [];
  LAYERS.forEach((name, li) => {
    const layer = vt.layers[name];
    if (!layer) return;
    const ext = layer.extent;
    const geo = (p: Pt): Coord => ({
      lat: lat0 + (lat1 - lat0) * (p.y / ext),
      lon: lon0 + (lon1 - lon0) * (p.x / ext),
    });
    const id = (i: number, j: number) =>
      // Fits in 2^53: tile 24 bits, layer 2, feature 17, piece 10.
      ((((x & 4095) * 4096 + (y & 4095)) * 4 + li) * 131072 + (i % 131072)) *
        1024 +
      (j % 1024);
    for (let i = 0; i < layer.length; i++) {
      const f = layer.feature(i),
        p = f.properties,
        kind = String(p.kind ?? ""),
        detail = String(p.kind_detail ?? ""),
        named: Record<string, string> = p.name ? { name: String(p.name) } : {};
      let tags: Record<string, string> | undefined;
      if (name === "buildings" && f.type === 3 && kind === "building")
        tags = { building: "yes", ...named };
      if (name === "buildings" && tags && p.height)
        tags.height = String(p.height);
      if (name === "water" && f.type === 3)
        tags = { natural: "water", ...named };
      if (name === "landuse" && f.type === 3 && kind)
        tags =
          kind === "park"
            ? { leisure: "park", ...named }
            : { landuse: kind, ...named };
      if (name === "roads" && f.type === 2) {
        if (kind === "rail" || kind === "ferry" || kind === "aerialway")
          continue;
        const highway =
          kind === "path"
            ? (PATHS[detail] ?? (detail || "path"))
            : detail || kind;
        for (const [j, piece] of f
          .loadGeometry()
          .flatMap((g) => clipLine(g, ext))
          .entries())
          out.push({
            type: "way",
            id: id(i, j),
            tags: { highway, ...named },
            geometry: piece.map(geo),
          });
        continue;
      }
      if (!tags) continue;
      for (const [j, poly] of polygons(f, ext).entries()) {
        const rings = poly.map((r) => {
          const g = r.map(geo);
          g.push(g[0]); // closed exactly, as convertElements expects
          return g;
        });
        if (rings.length === 1)
          out.push({ type: "way", id: id(i, j), tags, geometry: rings[0] });
        else
          out.push({
            type: "relation",
            id: id(i, j),
            tags,
            members: rings.map((geometry, k) => ({
              type: "way",
              role: k ? "inner" : "outer",
              geometry,
            })),
          });
      }
    }
  });
  return out;
}

// Decoded tiles are shared by the game tiles over them; the oldest go first.
const decoded = new Map<string, Promise<OsmElement[]>>();
function tileElements(x: number, y: number) {
  x = ((x % 2 ** ZOOM) + 2 ** ZOOM) % 2 ** ZOOM;
  const key = `${x}/${y}`;
  let job = decoded.get(key);
  if (job) {
    decoded.delete(key);
    decoded.set(key, job);
    return job;
  }
  job = decodeTile(x, y);
  job.catch(() => decoded.delete(key));
  decoded.set(key, job);
  while (decoded.size > 48) decoded.delete(decoded.keys().next().value!);
  return job;
}

/** Elements of the zoom-15 tiles that reach into a box (lat/lon degrees). Only those are kept,
 * so a cached game tile does not store whole neighbouring world tiles. */
export async function elementsInBox(b: {
  south: number;
  west: number;
  north: number;
  east: number;
}) {
  const jobs: Promise<OsmElement[]>[] = [];
  for (let x = tileX(b.west); x <= tileX(b.east - 1e-9); x++)
    for (let y = tileY(b.north); y <= tileY(b.south + 1e-9); y++)
      jobs.push(tileElements(x, y));
  return (await Promise.all(jobs)).flat().filter((e) => {
    let s = 90,
      w = 180,
      n = -90,
      east = -180;
    for (const p of e.geometry ??
      e.members?.flatMap((m) => m.geometry ?? []) ??
      []) {
      if (p.lat < s) s = p.lat;
      if (p.lat > n) n = p.lat;
      if (p.lon < w) w = p.lon;
      if (p.lon > east) east = p.lon;
    }
    return s <= b.north && n >= b.south && w <= b.east && east >= b.west;
  });
}
