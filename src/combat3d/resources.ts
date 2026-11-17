// Gathering spots on the map (owner's design doc, section Surowce): each good lies
// thickly where OpenStreetMap says it belongs (main source) and rarely almost
// anywhere else (fallback), so it never disappears where OSM has nothing. Placement
// is deterministic from a world grid, so every player sees the same spots without a
// server. Pure rules: no rendering here.
import { distance, type Point } from "./rules.ts";
import { hash, project, wrapLongitude, type Geo, type MapData } from "./world.ts";

export type NodeKind = "wood" | "ore" | "fiber" | "herbs";
export const NODE_KINDS: NodeKind[] = ["wood", "ore", "fiber", "herbs"];
export type ResourceNode = {
  key: string;
  kind: NodeKind;
  x: number;
  z: number;
  primary: boolean;
};
/** What one blow gives (goods go to the shared Vault). */
export const YIELD: Record<NodeKind, number> = {
  wood: 3,
  ore: 2,
  fiber: 4,
  herbs: 2,
};
export const NODE_NAMES: Record<NodeKind, [string, string]> = {
  wood: ["drewna", "Pień"],
  ore: ["rudy", "Skałka"],
  fiber: ["włókna", "Kępa traw"],
  herbs: ["ziół", "Zioła"],
};
/** A gathered spot grows back after this long; inside a closed circle twice as slow
 * (camp folk work there). */
export const RESPAWN_MS = 10 * 60_000;
export const GRID_DEGREES = 0.00022; // ~24 m north–south
export const PRIMARY_CHANCE = 0.45;
export const FALLBACK_CHANCE = 0.04;

/** Main sources by OSM area kind (landuse / leisure / natural). Unknown green = "green". */
const PRIMARY: Record<string, NodeKind[]> = {
  forest: ["wood", "wood", "herbs"],
  wood: ["wood", "wood", "herbs"],
  scrub: ["wood", "herbs"],
  orchard: ["wood", "herbs"],
  park: ["wood", "herbs", "fiber"],
  green: ["fiber", "herbs", "wood"],
  garden: ["herbs", "fiber"],
  grass: ["fiber"],
  meadow: ["fiber", "fiber", "herbs"],
  grassland: ["fiber", "herbs"],
  village_green: ["fiber"],
  farmland: ["fiber", "fiber", "herbs"],
  allotments: ["herbs", "fiber"],
  cemetery: ["herbs"],
  quarry: ["ore"],
  industrial: ["ore"],
  construction: ["ore"],
  railway: ["ore"],
  brownfield: ["ore", "fiber"],
  landfill: ["ore"],
};
export function primaryKinds(areaKind: string | null) {
  return areaKind ? (PRIMARY[areaKind] ?? null) : null;
}

type Box = [number, number, number, number];
const boxes = new WeakMap<object, Box>();
function boxOf(ring: number[][]) {
  let b = boxes.get(ring);
  if (!b) {
    b = [Infinity, Infinity, -Infinity, -Infinity];
    for (const [x, z] of ring) {
      if (x < b[0]) b[0] = x;
      if (z < b[1]) b[1] = z;
      if (x > b[2]) b[2] = x;
      if (z > b[3]) b[3] = z;
    }
    boxes.set(ring, b);
  }
  return b;
}
function inside(p: Point, ring: number[][]) {
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
/** Kind of the land area under a point (the last, i.e. topmost, wins), or null. */
// Areas are bucketed on a grid once per map: a look-up tests the few areas over that
// spot instead of every area of the loaded map (25 tiles hold thousands).
const AREA_GRID = 8,
  areaIndexes = new WeakMap<MapData, Map<number, number[]>>();
const gridKey = (x: number, z: number) => (Math.floor(x / AREA_GRID) + 32768) * 65536 + Math.floor(z / AREA_GRID) + 32768;
function areaIndex(map: MapData) {
  let index = areaIndexes.get(map);
  if (index) return index;
  index = new Map();
  for (let i = 0; i < map.areas.length; i++) {
    if (map.areas[i].water) continue;
    const b = boxOf(map.areas[i].rings[0]);
    for (let x = Math.floor(b[0] / AREA_GRID); x <= Math.floor(b[2] / AREA_GRID); x++)
      for (let z = Math.floor(b[1] / AREA_GRID); z <= Math.floor(b[3] / AREA_GRID); z++) {
        const key = gridKey(x * AREA_GRID, z * AREA_GRID),
          list = index.get(key);
        if (list) list.push(i);
        else index.set(key, [i]);
      }
  }
  areaIndexes.set(map, index);
  return index;
}
/** Kind of the mapped area over a point (the last one drawn wins), or null. */
export function areaKindAt(map: MapData, p: Point): string | null {
  const list = areaIndex(map).get(gridKey(p.x, p.z));
  if (!list) return null;
  for (let k = list.length - 1; k >= 0; k--) {
    const a = map.areas[list[k]],
      outer = a.rings[0],
      b = boxOf(outer);
    if (p.x < b[0] || p.x > b[2] || p.z < b[1] || p.z > b[3]) continue;
    if (!inside(p, outer) || a.rings.slice(1).some((h) => inside(p, h)))
      continue;
    return a.kind ?? "green";
  }
  return null;
}

/** Spots within `radius` scene units of `center`. `free` rejects walls and water. */
export function resourceNodes(
  map: MapData,
  origin: Geo,
  centerGeo: Geo,
  center: Point,
  radius: number,
  free: (p: Point) => boolean,
): ResourceNode[] {
  const out: ResourceNode[] = [];
  const latSpan = radius / (111320 * map.scale) + GRID_DEGREES;
  const y0 = Math.floor((centerGeo.lat - latSpan + 90) / GRID_DEGREES),
    y1 = Math.floor((centerGeo.lat + latSpan + 90) / GRID_DEGREES);
  for (let y = y0; y <= y1; y++) {
    const lat = -90 + (y + 0.5) * GRID_DEGREES;
    const cos = Math.max(0.00001, Math.cos((lat * Math.PI) / 180));
    const columns = Math.max(1, Math.ceil((360 * cos) / GRID_DEGREES)),
      width = 360 / columns,
      lonSpan = radius / (111320 * cos * map.scale) + width,
      x0 = Math.floor((wrapLongitude(centerGeo.lon - lonSpan) + 180) / width),
      n = Math.ceil((2 * lonSpan) / width);
    for (let i = 0; i <= n; i++) {
      const x = (x0 + i) % columns,
        key = `r1:${x}:${y}`,
        seed = hash(key);
      const geo = {
        lat: -90 + (y + 0.15 + (seed % 71) / 100) * GRID_DEGREES,
        lon: wrapLongitude(-180 + (x + 0.15 + ((seed >>> 8) % 71) / 100) * width),
      };
      const p = project(geo, origin);
      if (distance(p, center) > radius) continue;
      const roll = ((seed >>> 16) % 1000) / 1000;
      const kinds = primaryKinds(areaKindAt(map, p));
      let kind: NodeKind | null = null;
      if (kinds && roll < PRIMARY_CHANCE)
        kind = kinds[(seed >>> 4) % kinds.length];
      else if (roll < FALLBACK_CHANCE)
        kind = NODE_KINDS[(seed >>> 5) % NODE_KINDS.length];
      if (kind && free(p))
        out.push({ key, kind, x: p.x, z: p.z, primary: !!kinds });
    }
  }
  return out;
}

/** One spot of every good beside the first camp, so each is close to the start even
 * where OSM gives nothing (the design doc's guarantee). */
export function starterNodes(
  root: Point,
  free: (p: Point) => boolean,
): ResourceNode[] {
  const out: ResourceNode[] = [];
  NODE_KINDS.forEach((kind, i) => {
    for (let r = 9; r <= 24; r += 1.5)
      for (let k = 0; k < 12; k++) {
        const a = ((i * 90 + 25 + k * 30) * Math.PI) / 180;
        const p = { x: root.x + Math.sin(a) * r, z: root.z + Math.cos(a) * r };
        if (free(p) && out.every((q) => distance(q, p) > 3)) {
          out.push({ key: `start:${kind}`, kind, x: p.x, z: p.z, primary: false });
          return;
        }
      }
  });
  return out;
}
