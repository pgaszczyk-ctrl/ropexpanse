// Closed circles produce goods (owner's design doc, Krąg + AFK): by area and by what
// OpenStreetMap shows inside — forest gives wood, quarries ore, meadows fibre — into
// one shared Vault buffer that keeps growing while the player is away, up to
// CAP_HOURS of production, so a full Vault is a reason to come back. Pure rules.
import { insideArea } from "./territory-rules.ts";
import type { Point } from "./rules.ts";
import type { MapData } from "./world.ts";
import { areaKindAt, primaryKinds, NODE_KINDS, type NodeKind } from "./resources.ts";

export type Rates = Record<NodeKind, number>;
/** Grid step (scene units) used to read what lies inside a circle. */
export const SAMPLE = 4;
/** Goods per hour from one sample cell of a matching main source. */
export const PER_CELL_HOUR = 0.6;
/** Built-up or unknown ground still yields a trickle of everything (fallback sources). */
export const FALLBACK_SHARE = 0.1;
export const CAP_HOURS = 10;
export const emptyRates = (): Rates => ({ wood: 0, ore: 0, fiber: 0, herbs: 0 });

/** Production per hour of the given closed circles, or null while some of the ground
 * under them is not loaded yet (the last known rates are then kept). */
export function circleRates(
  circles: Point[][],
  map: MapData,
  loaded: (p: Point) => boolean,
): Rates | null {
  const r = emptyRates();
  for (const ring of circles) {
    let x0 = Infinity, z0 = Infinity, x1 = -Infinity, z1 = -Infinity;
    for (const p of ring) {
      x0 = Math.min(x0, p.x);
      z0 = Math.min(z0, p.z);
      x1 = Math.max(x1, p.x);
      z1 = Math.max(z1, p.z);
    }
    for (let x = Math.floor(x0 / SAMPLE) * SAMPLE + SAMPLE / 2; x < x1; x += SAMPLE)
      for (let z = Math.floor(z0 / SAMPLE) * SAMPLE + SAMPLE / 2; z < z1; z += SAMPLE) {
        const p = { x, z };
        if (!insideArea(p, ring)) continue;
        if (!loaded(p)) return null;
        const kinds = primaryKinds(areaKindAt(map, p));
        if (kinds)
          for (const k of kinds) r[k] += PER_CELL_HOUR / kinds.length;
        else for (const k of NODE_KINDS) r[k] += (PER_CELL_HOUR * FALLBACK_SHARE) / 4;
      }
  }
  return r;
}
