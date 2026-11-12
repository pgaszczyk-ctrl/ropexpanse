// What a fallen enemy leaves (owner's design doc, review of 8 Nov 2026, Tabela łupów):
// - animals (wolves and other beasts): tix, sometimes materials (hide, fang); never gear;
// - humanoids (bandits, guardians of legends): weapons and armour, with a rarity roll.
// Pure rules: the game decides how the loot looks and flies (main.ts).
import type { Rank } from "./bestiary.ts";

export type ItemRarity = "common" | "rare" | "epic" | "legendary";
export type MaterialKind = "skora" | "kiel";
export type Loot = {
  tix: number;
  /** Materials from animals. */
  materials: MaterialKind[];
  /** Gear from humanoids: one entry per item, with its rarity. */
  gear: ItemRarity[];
};

/** Chance of each rarity by rank (sums to 1). Starting values, to be balanced. */
export const RARITY_ODDS: Record<Rank, Record<ItemRarity, number>> = {
  weak: { common: 0.78, rare: 0.17, epic: 0.045, legendary: 0.005 },
  medium: { common: 0.7, rare: 0.22, epic: 0.07, legendary: 0.01 },
  elite: { common: 0.4, rare: 0.4, epic: 0.17, legendary: 0.03 },
  boss: { common: 0, rare: 0.5, epic: 0.4, legendary: 0.1 },
};
/** Chance that a humanoid drops a piece of gear at all. */
export const GEAR_CHANCE: Record<Rank, number> = { weak: 0.25, medium: 0.35, elite: 1, boss: 1 };
export const HIDE_CHANCE = 0.35;
export const FANG_CHANCE = 0.2;

export function rollRarity(rank: Rank, roll: number): ItemRarity {
  const odds = RARITY_ODDS[rank];
  let acc = 0;
  for (const r of ["legendary", "epic", "rare", "common"] as ItemRarity[]) {
    acc += odds[r];
    if (roll < acc) return r;
  }
  return rank === "boss" ? "rare" : "common";
}

/** Loot of one fallen enemy. `rng` returns [0, 1); the game passes Math.random. */
export function lootFor(look: "wolf" | "person" | "archer", rank: Rank, tier: number, rng: () => number): Loot {
  const tix = rank === "boss" ? 100 : rank === "elite" ? 35 : 5 + tier * 2;
  if (look === "wolf") {
    const strong = rank === "elite" || rank === "boss";
    const materials: MaterialKind[] = [];
    if (strong || rng() < HIDE_CHANCE) materials.push("skora");
    if (strong || rng() < FANG_CHANCE) materials.push("kiel");
    return { tix, materials, gear: [] };
  }
  const gear: ItemRarity[] = [];
  if (rng() < GEAR_CHANCE[rank]) gear.push(rollRarity(rank, rng()));
  if (rank === "boss") gear.push(rollRarity(rank, rng()));
  return { tix, materials: [], gear };
}

/** Stat bonus and price factor of a rarity (moderate: better gear helps, not replaces skill). */
export const RARITY_POWER: Record<ItemRarity, number> = { common: 0, rare: 2, epic: 4, legendary: 7 };
export const RARITY_VALUE: Record<ItemRarity, number> = { common: 1, rare: 2, epic: 4, legendary: 8 };
/** Valuable loot waits on the ground until the hero walks up; common loot flies to them. */
export const isValuable = (r: ItemRarity | undefined) => !!r && r !== "common";
/** Coins a pile of tix splits into on the ground (a few small coins). */
export function coinSplit(tix: number) {
  const n = Math.max(2, Math.min(8, Math.ceil(tix / 6)));
  const out: number[] = [];
  let left = tix;
  for (let i = 0; i < n; i++) {
    const part = i === n - 1 ? left : Math.floor(tix / n);
    out.push(part);
    left -= part;
  }
  return out.filter((v) => v > 0);
}
