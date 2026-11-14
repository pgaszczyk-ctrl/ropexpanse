// Camp shop (owner, 14 Nov 2026): sell items for tix, wood, rope or potions; buy a potion.
// Pure rules; expedition.ts draws the window. Prices are starting values, to be balanced.
import { countOf, potionsOf, type Campaign, type Character, type Item } from "./campaign.ts";

export const SHOP = {
  /** A merchant pays half of an item's value. */
  sellShare: 0.5,
  /** One potion costs this many tix (buying, and when taken as payment). */
  potionPrice: 40,
  /** One piece of wood is worth this many tix. */
  woodPrice: 5,
  /** Metres of rope per tix. */
  ropePerTix: 2,
};
export type Pay = "tix" | "wood" | "rope" | "potions";
export const PAYS: Pay[] = ["tix", "wood", "rope", "potions"];

/** What a merchant gives in tix for a whole entry (a stack sells together). */
export function sellPrice(item: Item) {
  return Math.max(1, Math.floor(item.value * countOf(item) * SHOP.sellShare));
}
/** The same price paid in goods: tix, pieces of wood, metres of rope or potions. */
export function payout(tix: number, pay: Pay) {
  switch (pay) {
    case "wood":
      return Math.floor(tix / SHOP.woodPrice);
    case "rope":
      return Math.floor(tix * SHOP.ropePerTix);
    case "potions":
      return Math.floor(tix / SHOP.potionPrice);
    default:
      return tix;
  }
}
/** Sells one entry from `list` (the bag or the Vault). Returns what was paid, 0 if nothing. */
export function sell(s: Campaign, c: Character, list: Item[], id: string, pay: Pay) {
  const i = list.findIndex((v) => v.id === id);
  if (i < 0) return 0;
  const got = payout(sellPrice(list[i]), pay);
  if (got <= 0) return 0;
  list.splice(i, 1);
  if (pay === "tix") c.coins += got;
  else if (pay === "wood") s.stock.wood += got;
  else if (pay === "rope") s.stock.rope += got;
  else c.potions = potionsOf(c) + got;
  return got;
}
/** Sells every material in the bag for tix (one tap after a hunt). Returns the tix. */
export function sellMaterials(c: Character) {
  let tix = 0;
  c.bag = c.bag.filter((i) => {
    if (i.slot !== "material") return true;
    tix += sellPrice(i);
    return false;
  });
  c.coins += tix;
  return tix;
}
export function buyPotion(c: Character) {
  if (c.coins < SHOP.potionPrice) return false;
  c.coins -= SHOP.potionPrice;
  c.potions = potionsOf(c) + 1;
  return true;
}
