// Pictures of items and goods (vector, readable at phone size). Temporary until the
// artist's set arrives.
import type { Item } from "./campaign.ts";
export const ITEM_PATHS: Record<string, string> = {
  sword:
    '<path fill="#a8b5ba" d="m40 5 7 2-2 8-23 25-8-8Z"/><path stroke="#4c5b60" stroke-width="5" d="m10 29 17 15M17 36 8 47"/>',
  staff:
    '<path stroke="#8b5c31" stroke-width="7" stroke-linecap="round" d="m14 47 20-34 8-4"/><path fill="#70c9e3" d="m33 5 10 1 5 10-11 4-8-7Z"/>',
  armor:
    '<path fill="#668b94" stroke="#3e5860" stroke-width="2" d="m15 10 9 5h8l9-5 9 14-8 7-3-5v23H17V26l-3 5-8-7Z"/><path stroke="#d4b575" stroke-width="3" d="M17 36h22"/>',
  helmet:
    '<path fill="#99a8ab" stroke="#53696f" stroke-width="2" d="M11 38V27a17 17 0 0 1 34 0v11l-10 8V29H21v17Z"/><path stroke="#d0aa63" stroke-width="4" d="M9 28h38"/>',
  axe:
    '<path stroke="#8b5c31" stroke-width="5" stroke-linecap="round" d="M14 48 38 12"/><path fill="#b9c3c6" stroke="#4c5b60" stroke-width="2" d="M33 8c9 0 15 6 15 15l-9 1-8-8Z"/>',
  hammer:
    '<path stroke="#8b5c31" stroke-width="5" stroke-linecap="round" d="M16 48 34 18"/><path fill="#9aa5a8" stroke="#4c5b60" stroke-width="2" d="m24 10 16-6 8 14-16 6Z"/>',
  shield:
    '<path fill="#9a6a3c" stroke="#5d452f" stroke-width="2" d="M28 6c8 4 14 5 20 5 0 19-6 31-20 39C14 42 8 30 8 11c6 0 12-1 20-5Z"/><path stroke="#c9ccc6" stroke-width="4" d="M28 9v38M12 22h32"/><circle cx="28" cy="22" r="5" fill="#d4b575"/>',
  hide: '<path fill="#9a6b45" stroke="#5c3d26" stroke-width="2" d="M14 12 22 8l6 4 6-4 8 4-2 9 5 8-5 6 2 9-8 3-6-4-6 4-8-3 2-9-5-6 5-8Z"/><path stroke="#c99a6c" stroke-width="2" d="M22 20q6 4 12 0M21 32q7 4 14 0"/>',
  fang: '<path fill="#f1e8d2" stroke="#7d6b55" stroke-width="2" d="M20 8q14 2 16 14-2 14-10 28-2-14-9-24Q14 14 20 8Z"/><path stroke="#c9b894" stroke-width="2" d="M24 16q6 3 7 10"/>',
  orb: '<circle cx="28" cy="25" r="15" fill="#70c9e3" stroke="#2f6f85" stroke-width="2"/><circle cx="23" cy="20" r="4" fill="#e9fbff"/><path fill="#8b5c31" stroke="#5d452f" stroke-width="2" d="M17 40h22l-4 9H21Z"/>',
  boots:
    '<path fill="#8e643f" stroke="#5d452f" stroke-width="2" d="m15 8 17 2-3 22 14 9v8H10V34Z"/><path stroke="#d4b575" stroke-width="3" d="M14 18h17"/>',
};
export const STOCK_ICONS: Record<string, string> = {
  wood: '<path fill="#8b5c31" stroke="#4a3220" stroke-width="2" d="M4 12h20v10H4z"/><ellipse cx="24" cy="17" rx="4" ry="5" fill="#d9a86a" stroke="#4a3220" stroke-width="2"/>',
  ore: '<path fill="#8f9aa0" stroke="#3e474c" stroke-width="2" d="m6 22 4-11 9-4 8 8-3 10H9Z"/><path fill="#d27a4a" d="m13 13 4-2 2 4-4 2Z"/>',
  fiber: '<path fill="none" stroke="#c9d36a" stroke-width="2.5" stroke-linecap="round" d="M16 28V8M16 20c-4-3-7-8-8-12M16 18c4-3 7-7 8-11"/>',
  herbs: '<path fill="#6fcf7a" stroke="#2f6b3a" stroke-width="1.5" d="M16 28c0-10 2-15 9-19-1 8-4 13-9 14M16 28C14 19 11 15 6 13c1 7 4 11 10 12"/><circle cx="16" cy="9" r="3" fill="#e98fc6"/>',
  rope: '<circle cx="16" cy="17" r="9" fill="none" stroke="#e8c27a" stroke-width="3"/><circle cx="16" cy="17" r="4" fill="none" stroke="#b0793c" stroke-width="2.5"/>',
};
/** Small picture of a gathered good (Vault and HUD). */
export function stockIcon(key: string) {
  return `<svg viewBox="0 0 32 32" aria-hidden="true">${STOCK_ICONS[key] ?? ""}</svg>`;
}
export function itemIcon(item: Pick<Item, "icon">) {
  return `<svg viewBox="0 0 56 56" aria-hidden="true">${ITEM_PATHS[item.icon] ?? ITEM_PATHS.sword}</svg>`;
}
/** What an item gives, in a few words. */
export function itemStat(item: Item) {
  return item.slot === "material"
    ? "materiał"
    : `${item.slot === "weapon" ? "Atak" : "Obrona"} ${item.power}`;
}
/** Small pictures for the wallet and the inventory toolbar (32×32). */
export const UI_ICONS: Record<string, string> = {
  tix: '<circle cx="16" cy="16" r="11" fill="#e7b13c" stroke="#8a5a12" stroke-width="2"/><circle cx="16" cy="16" r="6.5" fill="none" stroke="#fff3b8" stroke-width="1.6" opacity=".7"/>',
  potion: '<path fill="#c0445a" stroke="#5a1c28" stroke-width="2" d="M12 5h8v6l6 8a8 8 0 0 1-6.5 9h-7A8 8 0 0 1 6 19l6-8Z"/><path fill="#ffd2da" opacity=".7" d="M10 18h5v4h-5z"/><path stroke="#b0793c" stroke-width="3" d="M11 5h10"/>',
  sword: '<path fill="#c9d3d6" d="m24 4 4 1-1 5-12 13-5-5Z"/><path stroke="#8b5c31" stroke-width="3" stroke-linecap="round" d="m7 18 7 7M10 22l-5 5"/>',
  shield: '<path fill="#8fa4ab" stroke="#3e5860" stroke-width="2" d="M16 4c4 2 7 3 11 3 0 11-4 17-11 21C9 24 5 18 5 7c4 0 7-1 11-3Z"/>',
  heart: '<path fill="#e05a5a" stroke="#6b1f1f" stroke-width="2" d="M16 27S4 19 4 11a6 6 0 0 1 12-2 6 6 0 0 1 12 2c0 8-12 16-12 16Z"/>',
  bag: '<path fill="#a8703c" stroke="#4a3220" stroke-width="2" d="M7 12h18l2 15H5Z"/><path fill="none" stroke="#4a3220" stroke-width="2.5" d="M11 12V9a5 5 0 0 1 10 0v3"/><path fill="#e8c27a" d="M13 17h6v4h-6z"/>',
  sort: '<path fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" d="M9 6v20M5 10l4-4 4 4M23 26V6M19 22l4 4 4-4"/>',
  shop: '<path fill="#b0793c" stroke="#4a3220" stroke-width="2" d="M4 13 7 5h18l3 8Z"/><path fill="#8b5c31" stroke="#4a3220" stroke-width="2" d="M6 13h20v14H6z"/><path fill="#e7b13c" d="M13 18h6v9h-6z"/><path stroke="#e8c27a" stroke-width="2" d="M10 5 9 13M16 5v8M22 5l1 8"/>',
};
export const uiIcon = (k: string) => `<svg viewBox="0 0 32 32" aria-hidden="true">${UI_ICONS[k] ?? ""}</svg>`;
