import type { Candidate, Item, Offer, Role } from "./campaign.ts";
import { rollWayfarer, type Region } from "./wayfarers.ts";
const rarityBonus = { common: 0, uncommon: 1, rare: 2, epic: 4, legendary: 7 };
export function itemRarity(i: Item) { return rarityBonus[i.rarity ?? "common"]; }
export function itemAffinity(i: Item): Role | undefined {
  return i.affinity ?? (i.icon === "sword" ? "warrior" : i.icon === "staff" || i.icon === "scales" ? "mage" : i.icon === "bow" ? "archer" : undefined);
}
export function recruitmentProfile(o: Pick<Offer, "gold" | "items" | "ceiling">, buildings: number) {
  const score = Math.max(0, o.gold) + o.items.reduce((n, i) => n + i.value * (1 + itemRarity(i) * 0.15), 0);
  const weights: Record<Role, number> = { warrior: 1, mage: 1, archer: 1 };
  for (const item of o.items) {
    const affinity = itemAffinity(item);
    if (affinity) weights[affinity] += Math.sqrt(item.value / 35) * (1 + itemRarity(item) * 0.25);
  }
  const sum = weights.warrior + weights.mage + weights.archer;
  const roles = Object.fromEntries(Object.entries(weights).map(([key, n]) => [key, n / sum])) as Record<Role, number>;
  const weaponBonus = Math.max(0, ...o.items.filter(i => i.slot === "weapon").map(i => Math.max(0, (i.level ?? Math.max(1, Math.floor(i.power / 3))) - 1) * 0.6 + itemRarity(i)));
  const maxLevel = Math.max(1, Math.min(100, o.ceiling, 1 + Math.floor(Math.sqrt(score / 120) + weaponBonus)));
  return {
    chance: score <= 0 ? 0 : Math.min(0.97, 0.05 + 0.86 * (1 - Math.exp(-score / 220)) + Math.min(0.06, Math.log2(1 + Math.max(0, buildings)) * 0.012)),
    roles,
    maxLevel,
    minLevel: Math.max(1, maxLevel - Math.ceil(maxLevel * 0.4) + 1),
    extraChance: Math.min(0.65, score / 2200 + Math.log2(1 + Math.max(0, buildings)) * 0.04),
  };
}
export function candidatesFor(o: Offer, buildings: number, region: Region = "pl", taken = new Set<string>()): Candidate[] {
  let seed = o.seed;
  const rand = () => { seed = (Math.imul(seed, 1664525) + 1013904223) | 0; return (seed >>> 0) / 4294967296; };
  const profile = recruitmentProfile(o, buildings);
  if (rand() >= profile.chance) return [];
  let count = 1;
  while (count < 4 && rand() < profile.extraChance) count++;
  // Who they are comes from a separate stream, so the older draws (chance, count, class,
  // level) stay exactly as they were for existing saves.
  const score = Math.max(0, o.gold) + o.items.reduce((n, i) => n + i.value, 0);
  const names = new Set(taken);
  return Array.from({ length: count }, (_, i) => {
    const pick = rand(), role: Role = pick < profile.roles.warrior ? "warrior" : pick < profile.roles.warrior + profile.roles.mage ? "mage" : "archer";
    rand(); // formerly the name draw
    const appearance = Math.floor(rand() * 10000), level = Math.max(1, profile.maxLevel - Math.floor(rand() * Math.max(1, Math.ceil(profile.maxLevel * 0.4))));
    let who = (o.seed ^ Math.imul(i + 1, 2654435761)) | 0;
    const whoRand = () => { who = (Math.imul(who, 1664525) + 1013904223) | 0; return (who >>> 0) / 4294967296; };
    const w = rollWayfarer(whoRand, role, region, names, { rarityLift: Math.min(1, score / 2500) });
    names.add(w.name);
    return { id: `${o.id}-candidate-${i}`, ...w, role, appearance, level };
  });
}
