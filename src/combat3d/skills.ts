// Skills come from equipment (owner's design doc, Rozwój + Arsenał): the weapon gives
// one skill, the second hand another; a level only raises statistics.
import type { Character } from "./campaign.ts";
import { SPELLS, spellOf, type HealId, type SpellId } from "./spells.ts";

export type SkillId = "sweep" | "charge" | "whirl" | "quake" | "volley" | "taunt" | "manaShield" | SpellId | HealId;
export const SKILLS: Record<SkillId, { name: string; cooldown: number; text: string }> = {
  ...SPELLS,
  sweep: { name: "Cięcie", cooldown: 6, text: "szerokie cięcie przed sobą" },
  charge: { name: "Szarża", cooldown: 6, text: "pęd naprzód, rani i odrzuca wszystkich na drodze" },
  whirl: { name: "Wir", cooldown: 7, text: "obrót z bronią, rani wszystkich dookoła" },
  quake: { name: "Wstrząs", cooldown: 8, text: "uderzenie w ziemię, rani i ogłusza w kręgu" },
  volley: { name: "Salwa", cooldown: 6, text: "pięć pocisków wachlarzem przed siebie" },
  taunt: { name: "Prowokacja", cooldown: 12, text: "wrogowie atakują Ciebie, a Ty przyjmujesz mniej" },
  manaShield: { name: "Tarcza many", cooldown: 14, text: "pochłania kolejne ciosy" },
};
/** The weapon's skill (button Q). A herbalist uses their healing art, a mage their own
 * spell (spells.ts), an archer shoots a volley. */
export function weaponSkill(c: Pick<Character, "id" | "role" | "equipment" | "spell">): SkillId {
  if (c.role === "archer") return "volley";
  const own = spellOf(c);
  if (own && (c.role === "herbalist" || !c.equipment.weapon || c.equipment.weapon.icon === "staff")) return own;
  switch (c.equipment.weapon?.icon) {
    case "sword":
      return "charge";
    case "axe":
      return "whirl";
    case "hammer":
      return "quake";
    case "staff":
      return "fireball";
    default:
      return "sweep";
  }
}
/** How the character attacks: a staff (or a caster without a weapon) shoots, the rest strike. */
export function weaponMode(c: Pick<Character, "role" | "equipment">): "sword" | "magic" {
  const icon = c.equipment.weapon?.icon;
  if (icon) return icon === "staff" ? "magic" : "sword";
  return c.role === "warrior" ? "sword" : "magic";
}
/** The second hand's skill (button R), if it has one. */
export function offhandSkill(c: Pick<Character, "equipment">): SkillId | null {
  switch (c.equipment.offhand?.icon) {
    case "shield":
      return "taunt";
    case "orb":
      return "manaShield";
    default:
      return null;
  }
}
