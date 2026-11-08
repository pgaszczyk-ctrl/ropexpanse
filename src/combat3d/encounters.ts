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
/** World level grows +1 every WORLD_KM from the start (the first camp); the local threat
 * adds levels with the distance from the rope network (owner's design doc). Camps make an
 * area safer only relatively: near Gdańsk wolves are level 30, not 3. Starting values. */
export const WORLD_KM = 15;
export const LOCAL_METERS_PER_LEVEL = 350;
export function difficultyAt(s: Campaign, p: Point, scale: number) {
  const start = s.camps[0];
  const rootMeters = distance(start, p) / scale;
  const frontierMeters = distanceToSafeZone(s, p, scale) / scale;
  const exposure = Math.min(1, frontierMeters / 250);
  const worldTier = 1 + Math.floor(rootMeters / 1000 / WORLD_KM);
  const tier = Math.min(100, worldTier + Math.floor(frontierMeters / LOCAL_METERS_PER_LEVEL));
  // Up to ~300 m from a rope weak and medium foes; farther, elites more and more often.
  const bossChance = rootMeters < 1000 || frontierMeters < 250 ? 0 : Math.min(0.08, 0.005 + (frontierMeters - 250) / 20000 + rootMeters / 2000000);
  const eliteChance = frontierMeters < 300 ? 0.02 : Math.min(0.32, 0.04 + exposure * 0.12 + (frontierMeters - 300) / 4000);
  return { tier, worldTier, rootMeters, frontierMeters, bossChance, eliteChance };
}
export function encounterProfile(s: Campaign, p: Point, key: string, scale: number) {
  const difficulty = difficultyAt(s, p, scale);
  const boss = encounterRoll(key, "boss") < difficulty.bossChance;
  const elite = boss || encounterRoll(key, "elite") < difficulty.eliteChance;
  return { ...difficulty, boss, elite };
}
