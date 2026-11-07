import { BALANCE, distanceToSafeZone, type Campaign } from "./campaign.ts";
import { distance, type Point } from "./rules.ts";

// A separate stable roll avoids correlating thinning, enemy class and rare spawns.
export function encounterRoll(key: string, salt: string) {
  let h = 2166136261;
  for (const ch of `${key}:${salt}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  h ^= h >>> 16; h = Math.imul(h, 0x7feb352d); h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}
// Near camps and ropes the land is quiet: at the safe border only 15% of the encounter
// points stay, rising evenly to all of them QUIET_METERS out (owner's design doc: fewer
// spawns by camps, scaling with the distance from the ropes).
export const QUIET_METERS = BALANCE.quietBorderMeters;
export function encounterShare(edgeMeters: number) {
  return edgeMeters <= 0 ? 0 : Math.min(1, 0.15 + 0.85 * (edgeMeters / QUIET_METERS));
}
export function encounterAllowed(s: Campaign, p: Point, key: string, scale: number) {
  const edge = distanceToSafeZone(s, p, scale) / scale;
  return encounterRoll(key, "density") < encounterShare(edge);
}
export function difficultyAt(s: Campaign, p: Point, scale: number) {
  const roots = s.camps.filter(c => !c.parentId);
  const rootMeters = Math.min(...(roots.length ? roots : s.camps).map(c => distance(c, p))) / scale;
  const frontierMeters = distanceToSafeZone(s, p, scale) / scale;
  // Root distance never disappears, but an established frontier softens it.
  // Near a long chain of camps growth is slow; away from the network both terms grow.
  const exposure = Math.min(1, frontierMeters / 250);
  const pressure = Math.sqrt(rootMeters / 300) * (0.35 + 0.65 * exposure) + frontierMeters / 350;
  const tier = 1 + Math.min(39, Math.floor(pressure));
  const bossChance = rootMeters < 1000 || frontierMeters < 250 ? 0 : Math.min(0.08, 0.005 + (frontierMeters - 250) / 20000 + rootMeters / 2000000);
  return { tier, rootMeters, frontierMeters, bossChance, eliteChance: Math.min(0.28, 0.04 + exposure * 0.12 + tier * 0.003) };
}
export function encounterProfile(s: Campaign, p: Point, key: string, scale: number) {
  const difficulty = difficultyAt(s, p, scale);
  const boss = encounterRoll(key, "boss") < difficulty.bossChance;
  const elite = boss || encounterRoll(key, "elite") < difficulty.eliteChance;
  return { ...difficulty, boss, elite };
}
