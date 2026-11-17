// Fog of war (owner's design doc, Mgła wojny): unexplored land is drawn ~70% greyer,
// so colour is the reward for discovery. Explored ground is kept as a geographic grid
// (~55 m cells) that survives moving the origin and reloading.
import { wrapLongitude, type Geo } from "./world.ts";

export const EXPLORE_GRID = 0.0005; // degrees north–south (~55 m)
/** How far around the party land counts as seen (metres). */
export const SIGHT_METERS = 150;
export const DESATURATE = 0.7;

export function cellOf(geo: Geo) {
  const y = Math.floor((geo.lat + 90) / EXPLORE_GRID);
  const lat = -90 + (y + 0.5) * EXPLORE_GRID;
  const columns = Math.max(1, Math.ceil((360 * Math.max(0.00001, Math.cos((lat * Math.PI) / 180))) / EXPLORE_GRID));
  const x = Math.floor(((wrapLongitude(geo.lon) + 180) / 360) * columns) % columns;
  return `${x}:${y}`;
}
/** Marks every cell within SIGHT_METERS of `geo`; returns how many were new. */
export function markSeen(seen: Set<string>, geo: Geo, meters = SIGHT_METERS) {
  let added = 0;
  const dLat = meters / 111320,
    dLon = meters / (111320 * Math.max(0.00001, Math.cos((geo.lat * Math.PI) / 180))),
    step = EXPLORE_GRID / 2;
  for (let a = -dLat; a <= dLat; a += step)
    for (let b = -dLon; b <= dLon; b += step * (dLon / dLat)) {
      if ((a / dLat) ** 2 + (b / dLon) ** 2 > 1) continue;
      const k = cellOf({ lat: geo.lat + a, lon: geo.lon + b });
      if (!seen.has(k)) {
        seen.add(k);
        added++;
      }
    }
  return added;
}
/** A colour pulled towards grey (luminance) by `amount`. */
export function greyed(r: number, g: number, b: number, amount = DESATURATE) {
  const l = 0.3 * r + 0.59 * g + 0.11 * b;
  return [r + (l - r) * amount, g + (l - g) * amount, b + (l - b) * amount];
}
