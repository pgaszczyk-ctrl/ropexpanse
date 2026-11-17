// Spells of casters (owner, 14 Nov 2026: mages must not all throw the same ball).
// Every mage knows one spell and every herbalist one healing art. A Wayfarer keeps the
// same one for good: picked from their id, so older saves get variety without migration.
// Pure data; main.ts and vfx.ts make them happen.
import type { Character } from "./campaign.ts";

export type SpellId = "fireball" | "meteor" | "blizzard" | "flameCone" | "chainLightning" | "frostNova";
export type HealId = "heal" | "renewal" | "petals" | "bark";
export type Element = "fire" | "frost" | "storm" | "life";

export const SPELLS: Record<SpellId | HealId, { name: string; cooldown: number; text: string; element: Element }> = {
  fireball: { name: "Kula ognia", cooldown: 6, text: "pocisk wybuchający przy trafieniu", element: "fire" },
  meteor: { name: "Meteor", cooldown: 9, text: "po chwili spada z nieba, rani mocno i podpala w kręgu", element: "fire" },
  blizzard: { name: "Zamieć", cooldown: 9, text: "lodowy deszcz rani i spowalnia wszystkich w kręgu", element: "frost" },
  flameCone: { name: "Stożek ognia", cooldown: 6, text: "płomień przed sobą rani i podpala", element: "fire" },
  chainLightning: { name: "Łańcuch piorunów", cooldown: 7, text: "piorun skacze po pięciu wrogach i ogłusza", element: "storm" },
  frostNova: { name: "Fala mrozu", cooldown: 9, text: "lód wokół maga rani i zamraża", element: "frost" },
  heal: { name: "Leczenie", cooldown: 6, text: "leczy całą drużynę w pobliżu", element: "life" },
  renewal: { name: "Krąg odnowy", cooldown: 10, text: "krąg na ziemi leczy przez kilka sekund każdego w środku", element: "life" },
  petals: { name: "Deszcz płatków", cooldown: 9, text: "płatki leczą całą drużynę, ranni zyskują więcej", element: "life" },
  bark: { name: "Kora", cooldown: 9, text: "leczy najbardziej rannego i osłania go korą przed ciosami", element: "life" },
};
export const MAGE_SPELLS: SpellId[] = ["fireball", "meteor", "blizzard", "flameCone", "chainLightning", "frostNova"];
export const HEALER_ARTS: HealId[] = ["heal", "renewal", "petals", "bark"];

/** Colour of a caster's bolts and sparks by element. */
export const ELEMENT_COLOR: Record<Element, number> = {
  fire: 0xff8a3d,
  frost: 0x9fe4ff,
  storm: 0xfff27a,
  life: 0x9df29a,
};

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
/** A mage's spell or a herbalist's art; null for everyone else. */
export function spellOf(c: Pick<Character, "id" | "role" | "spell">): SpellId | HealId | null {
  const list: readonly string[] = c.role === "mage" ? MAGE_SPELLS : c.role === "herbalist" ? HEALER_ARTS : [];
  if (!list.length) return null;
  if (c.spell && list.includes(c.spell)) return c.spell as SpellId | HealId;
  return list[hash(c.id) % list.length] as SpellId | HealId;
}
/** Element of a caster's ordinary bolt (an apprentice without a school shoots arcane light). */
export function boltElement(c: Pick<Character, "id" | "role" | "spell">): Element | null {
  const s = spellOf(c);
  return s ? SPELLS[s].element : null;
}
