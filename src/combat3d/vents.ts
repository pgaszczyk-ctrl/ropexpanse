// Haze vents (owner's design doc, Wyziewy): places where the Haze pours out of the
// ground. They appear more often far from the ropes and never inside the safe land;
// closing one means beating a wave and then driving a stake with a lantern into it
// with one blow. Placement is deterministic from a coarse world grid. Pure rules.
import { distance, type Point } from "./rules.ts";
import { hash, project, wrapLongitude, type Geo } from "./world.ts";

export const VENT_GRID = 0.003; // ~330 m north–south
/** No vents this close to the safe land (metres). */
export const VENT_CLEAR_METERS = 150;
/** Chance of a vent in a grid cell, growing with the distance from the safe land. */
export function ventChance(frontierMeters: number) {
  return frontierMeters < VENT_CLEAR_METERS
    ? 0
    : Math.min(0.6, (frontierMeters - VENT_CLEAR_METERS) / 1500);
}
/** Haze creatures in a vent's wave, by the land's tier. */
export const waveSize = (tier: number) => Math.min(9, 4 + Math.floor(tier / 3));
/** Walking this close wakes the vent (scene units). */
export const WAKE_RADIUS = 9;

export type Vent = { key: string; x: number; z: number; seed: number };

/** Candidate vents within `radius` of `center`; `allowed` decides by distance to the
 * safe land (ventChance) and free ground. */
export function ventCells(
  origin: Geo,
  centerGeo: Geo,
  center: Point,
  radius: number,
  scale: number,
  allowed: (p: Point, seed: number) => boolean,
  grid = VENT_GRID,
  prefix = "v1",
): Vent[] {
  const VENT_GRID = grid; // the same placement grid serves other world features
  const out: Vent[] = [];
  const latSpan = radius / (111320 * scale) + VENT_GRID;
  const y0 = Math.floor((centerGeo.lat - latSpan + 90) / VENT_GRID),
    y1 = Math.floor((centerGeo.lat + latSpan + 90) / VENT_GRID);
  for (let y = y0; y <= y1; y++) {
    const lat = -90 + (y + 0.5) * VENT_GRID;
    const cos = Math.max(0.00001, Math.cos((lat * Math.PI) / 180));
    const columns = Math.max(1, Math.ceil((360 * cos) / VENT_GRID)),
      width = 360 / columns,
      lonSpan = radius / (111320 * cos * scale) + width,
      x0 = Math.floor((wrapLongitude(centerGeo.lon - lonSpan) + 180) / width),
      n = Math.ceil((2 * lonSpan) / width);
    for (let i = 0; i <= n; i++) {
      const x = (x0 + i) % columns,
        key = `${prefix}:${x}:${y}`,
        seed = hash(key);
      const geo = {
        lat: -90 + (y + 0.2 + (seed % 61) / 100) * VENT_GRID,
        lon: wrapLongitude(-180 + (x + 0.2 + ((seed >>> 8) % 61) / 100) * width),
      };
      const p = project(geo, origin);
      if (distance(p, center) <= radius && allowed(p, seed))
        out.push({ key, x: p.x, z: p.z, seed });
    }
  }
  return out;
}
/** Roll for one cell: the same answer for everyone. */
export const ventRoll = (seed: number) => ((seed >>> 12) % 1000) / 1000;

// ---- Wayfarers in need (owner's design doc, Rekrutacja na mapie) ----
export const RESCUE_GRID = 0.004; // ~440 m
/** A lone Wayfarer surrounded by monsters: none near the safe land, more farther out. */
export function rescueChance(frontierMeters: number) {
  return frontierMeters < 100 ? 0 : Math.min(0.35, (frontierMeters - 100) / 2500);
}
/** Better Wayfarers wait farther from the ropes; legends only from active play far out. */
export function rescueRarity(frontierMeters: number) {
  return {
    rarityLift: Math.min(1, frontierMeters / 1500),
    legendChance: frontierMeters > 800 ? Math.min(0.1, 0.03 + (frontierMeters - 800) / 20000) : 0,
  };
}
