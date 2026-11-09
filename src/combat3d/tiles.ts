// OpenStreetMap vector tiles (OpenMapTiles schema, served by OpenFreeMap) → map
// regions. Decoding follows erpeg's world loader: @mapbox/vector-tile + pbf,
// outer rings followed by their holes, each tile clipped to its own square.
import { VectorTile, type VectorTileFeature } from "@mapbox/vector-tile";
import { PbfReader } from "pbf";
import {
  buildingHeight,
  clipRing,
  projection,
  ringArea,
  tileRect,
  TILE_ZOOM,
  type Area,
  type Building,
  type Origin,
  type RawRegion,
  type Road,
} from "./geo.ts";
import { buildRegion, type RegionData } from "./region.ts";

/** Public, key-free vector tiles. `?tiles=<url with {z}/{x}/{y}>` overrides the source. */
export const TILE_SOURCE = "https://tiles.openfreemap.org/planet";
export const TILE_ATTRIBUTION = "OpenFreeMap © OpenMapTiles · dane © OpenStreetMap";

export async function tileTemplate(source = TILE_SOURCE) {
  if (source.includes("{z}")) return source;
  const res = await fetch(source);
  if (!res.ok) throw new Error(`Źródło mapy: HTTP ${res.status}`);
  const json = (await res.json()) as { tiles?: string[] };
  if (!json.tiles?.[0]) throw new Error("Źródło mapy nie podało adresu kafelków");
  return json.tiles[0];
}

type P = { x: number; y: number };
function tileRingArea(r: P[]) {
  let a = 0;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += (r[j].x - r[i].x) * (r[j].y + r[i].y);
  return a;
}
/** Polygons (outer ring first, then its holes) of a vector tile feature. */
function polygons(f: VectorTileFeature) {
  const out: P[][][] = [];
  for (const r of f.loadGeometry()) {
    if (r.length < 4) continue;
    if (tileRingArea(r) > 0 || !out.length) out.push([r]);
    else out[out.length - 1].push(r);
  }
  return out;
}
const ROAD_WIDTH: Record<string, number> = {
  motorway: 2.8,
  trunk: 2.8,
  primary: 2.6,
  secondary: 2.4,
  tertiary: 2.3,
  minor: 2.1,
  service: 1.6,
  track: 1.2,
  raceway: 2.1,
  busway: 2.1,
};

export async function inflate(buf: ArrayBuffer) {
  const head = new Uint8Array(buf, 0, 2);
  if (head[0] !== 0x1f || head[1] !== 0x8b) return buf;
  const stream = new Blob([buf]).stream().pipeThrough(new DecompressionStream("gzip"));
  return new Response(stream).arrayBuffer();
}

export function decodeTile(buf: ArrayBuffer, tx: number, ty: number, origin: Origin, scale: number): RawRegion {
  const p = projection(origin, scale),
    rect = tileRect(tx, ty, p),
    vt = new VectorTile(new PbfReader(new Uint8Array(buf)));
  const buildings: Building[] = [],
    roads: Road[] = [],
    areas: Area[] = [];
  const each = (name: string, fn: (f: VectorTileFeature, ext: number) => void) => {
    const l = vt.layers[name];
    if (l) for (let i = 0; i < l.length; i++) fn(l.feature(i), l.extent);
  };
  const toLocal = (ext: number) => (q: number[]) => [
    +(rect.x0 + ((rect.x1 - rect.x0) * q[0]) / ext).toFixed(3),
    +(rect.z0 + ((rect.z1 - rect.z0) * q[1]) / ext).toFixed(3),
  ];
  // Clip in tile coordinates, so a building split by a tile edge is drawn once.
  const clipped = (f: VectorTileFeature, ext: number) => {
    const local = toLocal(ext),
      out: number[][][][] = [];
    for (const poly of polygons(f)) {
      const outer = clipRing(poly[0].map((q) => [q.x, q.y]), 0, 0, ext, ext);
      if (!outer) continue;
      const rings = [outer.map(local)];
      for (const hole of poly.slice(1)) {
        const c = clipRing(hole.map((q) => [q.x, q.y]), 0, 0, ext, ext);
        if (c) rings.push(c.map(local));
      }
      out.push(rings);
    }
    return out;
  };
  const lines = (f: VectorTileFeature, ext: number) => {
    const local = toLocal(ext),
      out: number[][][] = [];
    // Keep segments whose middle lies in this tile; the neighbour draws the rest.
    for (const g of f.loadGeometry()) {
      let run: number[][] = [];
      for (let i = 1; i < g.length; i++) {
        const mx = (g[i - 1].x + g[i].x) / 2,
          my = (g[i - 1].y + g[i].y) / 2;
        if (mx >= 0 && mx < ext && my >= 0 && my < ext) {
          if (!run.length) run.push(local([g[i - 1].x, g[i - 1].y]));
          run.push(local([g[i].x, g[i].y]));
        } else if (run.length) {
          out.push(run);
          run = [];
        }
      }
      if (run.length > 1) out.push(run);
    }
    return out;
  };

  each("building", (f, ext) => {
    if (f.type !== 3 || Number(f.properties.render_min_height) >= 3) return;
    const height = buildingHeight(Number(f.properties.render_height));
    for (const rings of clipped(f, ext)) {
      const area = Math.abs(ringArea(rings[0]));
      if (area < 0.5) continue;
      buildings.push({ rings, height, name: "", address: "" });
    }
  });
  each("water", (f, ext) => {
    if (f.type !== 3 || f.properties.brunnel === "tunnel") return;
    for (const rings of clipped(f, ext)) areas.push({ rings, kind: "water", name: "" });
  });
  each("landcover", (f, ext) => {
    if (f.type !== 3) return;
    const c = String(f.properties.class),
      s = String(f.properties.subclass ?? "");
    const kind: Area["kind"] | null =
      c === "wood" ? "wood"
      : c === "grass" ? (s === "park" || s === "garden" || s === "village_green" ? "park" : "grass")
      : c === "farmland" ? "farm"
      : c === "wetland" ? "grass"
      : null;
    if (kind) for (const rings of clipped(f, ext)) areas.push({ rings, kind, name: "" });
  });
  each("park", (f, ext) => {
    if (f.type === 3) for (const rings of clipped(f, ext)) areas.push({ rings, kind: "park", name: "" });
  });
  each("waterway", (f, ext) => {
    if (f.type !== 2 || f.properties.brunnel === "tunnel") return;
    const width = f.properties.class === "river" ? 1.6 : f.properties.class === "canal" ? 1.2 : 0.7;
    for (const pts of lines(f, ext)) roads.push({ pts, width, path: false, water: true, name: "" });
  });
  each("transportation", (f, ext) => {
    if (f.type !== 2 || f.properties.brunnel === "tunnel") return;
    const c = String(f.properties.class),
      s = String(f.properties.subclass ?? "");
    let width = ROAD_WIDTH[c],
      path = false;
    if (c === "path") {
      if (s === "platform") return;
      path = s !== "pedestrian";
      width = path ? 0.8 : 1.7;
    }
    if (!width) return;
    for (const pts of lines(f, ext)) roads.push({ pts, width, path, name: "" });
  });
  return { key: `${TILE_ZOOM}/${tx}/${ty}`, rect, buildings, roads, areas };
}

export async function loadTile(
  template: string,
  tx: number,
  ty: number,
  origin: Origin,
  scale: number,
): Promise<RegionData> {
  const url = template.replace("{z}", String(TILE_ZOOM)).replace("{x}", String(tx)).replace("{y}", String(ty));
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url);
      // A tile with no data (open sea) is a valid, empty region.
      if (res.status === 204 || res.status === 404)
        return buildRegion({ key: `${TILE_ZOOM}/${tx}/${ty}`, rect: tileRect(tx, ty, projection(origin, scale)), buildings: [], roads: [], areas: [] });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = await inflate(await res.arrayBuffer());
      return buildRegion(decodeTile(buf, tx, ty, origin, scale));
    } catch (error) {
      lastError = error;
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}
