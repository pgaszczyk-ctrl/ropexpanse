import { nearRope } from "./rope.ts";
import { distance, type Point } from "./rules.ts";
export const BALANCE = {
  slots: 24,
  safeRadius: 7.5,
  minCampDistance: 18,
  ropeLength: 65,
  ropeSafeMeters: 3,
  recruitmentMs: 300_000,
  campCost: 30,
};
export type Role = "warrior" | "mage" | "archer";
export type Slot = "weapon" | "armor" | "helmet" | "boots";
export type Item = {
  id: string;
  kind: string;
  name: string;
  slot: Slot;
  power: number;
  value: number;
  icon: string;
};
export type Character = Point & {
  id: string;
  name: string;
  role: Role;
  appearance: number;
  exp: number;
  hp: number;
  coins: number;
  kills: number;
  fragments: number;
  campId: string;
  bag: Item[];
  equipment: Partial<Record<Slot, Item>>;
  weapon: "sword" | "magic";
  sweepReady?: number;
  potionReady?: number;
};
export type Camp = Point & {
  id: string;
  parentId?: string;
  route: Point[];
  buildings: number;
};
export type Offer = {
  id: string;
  campId: string;
  gold: number;
  items: Item[];
  readyAt: number;
  seed: number;
  ceiling: number;
  candidates: Candidate[] | null;
};
export type Candidate = {
  id: string;
  name: string;
  role: Role;
  appearance: number;
  level: number;
};
export type Campaign = {
  v: 2;
  origin: { lat: number; lon: number };
  activeId: string;
  characters: Character[];
  camps: Camp[];
  vault: Item[];
  bank: number;
  offers: Offer[];
  encounters: Record<string, number>;
  serial: number;
};
export const roleName = (r: Role) =>
  ({ warrior: "Wojownik", mage: "Mag", archer: "Łucznik" })[r];
export function xpThreshold(level: number) {
  const n = Math.max(0, level - 1);
  return Math.round(240 * n + 85 * n * n + 12 * n * n * n);
}
export function levelOf(xp: number) {
  let l = 1;
  while (l < 100 && xp >= xpThreshold(l + 1)) l++;
  return l;
}
export function xpShare(xp: number) {
  const l = levelOf(xp);
  return (xp - xpThreshold(l)) / (xpThreshold(l + 1) - xpThreshold(l));
}
export function loseXp(xp: number) {
  const base = xpThreshold(levelOf(xp));
  return base + Math.floor((xp - base) * 0.9);
}
export function maxHealth(c: Character) {
  return 100 + (levelOf(c.exp) - 1) * 8 + (c.equipment.armor?.power ?? 0) * 2;
}
export function attackPower(c: Character) {
  return levelOf(c.exp) - 1 + (c.equipment.weapon?.power ?? 0);
}
export function armorPower(c: Character) {
  return ["armor", "helmet", "boots"].reduce(
    (n, k) => n + (c.equipment[k as Slot]?.power ?? 0),
    0,
  );
}
export function nextId(s: Campaign, prefix: string) {
  return `${prefix}-${++s.serial}`;
}
const templates = [
  ["Miecz podróżny", "weapon", 4, 140, "sword"],
  ["Kostur", "weapon", 4, 140, "staff"],
  ["Kurtka wędrowca", "armor", 5, 110, "armor"],
  ["Skórzany hełm", "helmet", 2, 60, "helmet"],
  ["Buty wędrowca", "boots", 2, 60, "boots"],
  ["Miecz strażnika", "weapon", 7, 260, "sword"],
  ["Kostur bursztynowy", "weapon", 7, 260, "staff"],
] as const;
export function makeItem(s: Campaign, index: number, tier = 1): Item {
  const [name, slot, power, value, icon] =
    templates[Math.abs(index) % templates.length];
  return {
    id: nextId(s, "item"),
    kind: `gear-${index % templates.length}`,
    name,
    slot,
    power: power + Math.max(0, tier - 1),
    value: value * tier,
    icon,
  };
}
export function newCampaign(
  home: Point,
  origin: { lat: number; lon: number },
): Campaign {
  const c: Character = {
    ...home,
    id: "hero-1",
    name: "Wędrowiec",
    role: "warrior",
    appearance: 0,
    exp: 0,
    hp: 100,
    coins: 40,
    kills: 0,
    fragments: 0,
    campId: "camp-1",
    bag: [],
    equipment: {},
    weapon: "sword",
  };
  const s: Campaign = {
    v: 2,
    origin,
    activeId: c.id,
    characters: [c],
    camps: [{ ...home, id: "camp-1", route: [], buildings: 0 }],
    vault: [],
    bank: 0,
    offers: [],
    encounters: {},
    serial: 1,
  };
  c.bag.push(makeItem(s, 0), makeItem(s, 1), makeItem(s, 2));
  return s;
}
export function activeCharacter(s: Campaign) {
  return s.characters.find((c) => c.id === s.activeId)!;
}
export function nearCamp(s: Campaign, p: Point, r = BALANCE.safeRadius) {
  return s.camps
    .filter((c) => distance(c, p) <= r)
    .sort((a, b) => distance(a, p) - distance(b, p))[0];
}
// Only established connections protect a route; a carried rope is not a mobile refuge.
export function inSafeZone(s: Campaign, p: Point, scale: number, margin = 0) {
  return !!nearCamp(s, p, BALANCE.safeRadius + margin) || s.camps.some(
    (camp) => !!camp.parentId && nearRope(p, camp.route, BALANCE.ropeSafeMeters * scale + margin),
  );
}
export function equip(c: Character, id: string) {
  const i = c.bag.findIndex((v) => v.id === id);
  if (i < 0) return false;
  const item = c.bag[i],
    old = c.equipment[item.slot];
  c.bag.splice(i, 1);
  if (old) c.bag.push(old);
  c.equipment[item.slot] = item;
  if (item.slot === "weapon")
    c.weapon = item.icon === "staff" ? "magic" : "sword";
  c.hp = Math.min(c.hp, maxHealth(c));
  return true;
}
export function transfer(
  from: Item[],
  to: Item[],
  id: string,
  limit = Infinity,
) {
  const i = from.findIndex((v) => v.id === id);
  if (i < 0 || to.length >= limit) return false;
  to.push(...from.splice(i, 1));
  return true;
}
export function postOffer(
  s: Campaign,
  campId: string,
  gold: number,
  ids: string[],
  now = Date.now(),
): Offer | null {
  const c = activeCharacter(s);
  if (
    !s.camps.some((v) => v.id === campId) ||
    s.offers.some((v) => v.campId === campId) ||
    !Number.isSafeInteger(gold) ||
    gold < 0 ||
    gold > c.coins
  )
    return null;
  if (
    new Set(ids).size !== ids.length ||
    ids.some((id) => !c.bag.some((i) => i.id === id)) ||
    (!gold && !ids.length)
  )
    return null;
  const items = ids.map((id) => c.bag.find((v) => v.id === id)!);
  c.bag = c.bag.filter((i) => !ids.includes(i.id));
  c.coins -= gold;
  const o: Offer = {
    id: nextId(s, "offer"),
    campId,
    gold,
    items,
    readyAt: now + BALANCE.recruitmentMs,
    seed: s.serial * 7919,
    ceiling: Math.max(...s.characters.map((v) => levelOf(v.exp))),
    candidates: null,
  };
  s.offers.push(o);
  return o;
}
export function candidatesFor(o: Offer, buildings: number): Candidate[] {
  let seed = o.seed;
  const rand = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
    return (seed >>> 0) / 4294967296;
  };
  const generosity = o.gold + o.items.reduce((n, i) => n + i.value, 0);
  const count = Math.min(
    4,
    1 + Math.floor(Math.log2(1 + Math.max(0, buildings)) / 2),
  );
  const quality = Math.min(
    o.ceiling,
    1 + Math.floor(Math.sqrt(generosity / 100)),
  );
  const names = [
    "Mira",
    "Bruno",
    "Iga",
    "Oskar",
    "Nela",
    "Wit",
    "Ada",
    "Leon",
    "Ruta",
    "Jan",
  ];
  const roles: Role[] = ["warrior", "mage", "archer"];
  return Array.from({ length: count }, (_, i) => ({
    id: `${o.id}-candidate-${i}`,
    name: names[Math.floor(rand() * names.length)],
    role: roles[Math.floor(rand() * 3)],
    appearance: Math.floor(rand() * 10000),
    level: Math.max(1, quality - Math.floor(rand() * Math.max(1, quality - 1))),
  }));
}
export function resolveOffers(s: Campaign, now = Date.now()) {
  let changed = false;
  for (const o of s.offers)
    if (!o.candidates && now >= o.readyAt) {
      o.candidates = candidatesFor(
        o,
        s.camps.find((c) => c.id === o.campId)?.buildings ?? 0,
      );
      changed = true;
    }
  return changed;
}
export function hire(s: Campaign, offerId: string, candidateId: string) {
  const o = s.offers.find((v) => v.id === offerId),
    v = o?.candidates?.find((v) => v.id === candidateId),
    camp = s.camps.find((c) => c.id === o?.campId);
  if (!o || !v || !camp) return null;
  const c: Character = {
    x: camp.x,
    z: camp.z,
    id: nextId(s, "hero"),
    name: v.name,
    role: v.role,
    appearance: v.appearance,
    exp: xpThreshold(v.level),
    hp: 100 + (v.level - 1) * 8,
    coins: 0,
    kills: 0,
    fragments: 0,
    campId: camp.id,
    bag: [],
    equipment: {},
    weapon: v.role === "warrior" ? "sword" : "magic",
  };
  c.equipment.weapon = makeItem(s, v.role === "warrior" ? 0 : 1);
  s.characters.push(c);
  s.offers = s.offers.filter((v) => v !== o);
  return c;
}
export function cancelOffer(s: Campaign, id: string) {
  const o = s.offers.find((v) => v.id === id);
  if (!o) return false;
  s.bank += o.gold;
  s.vault.push(...o.items);
  s.offers = s.offers.filter((v) => v !== o);
  return true;
}
// Validate the complete ownership graph before accepting a browser save.
export function parseCampaign(raw: string): Campaign | null {
  try {
    const s = JSON.parse(raw) as Campaign;
    if (
      s.v !== 2 ||
      !Array.isArray(s.characters) ||
      !s.characters.length ||
      !Array.isArray(s.camps) ||
      !s.camps.length ||
      !Array.isArray(s.vault) ||
      !Array.isArray(s.offers) ||
      !Number.isSafeInteger(s.serial) ||
      s.serial < 1 ||
      !Number.isFinite(s.bank) ||
      s.bank < 0 ||
      !Number.isFinite(s.origin?.lat) ||
      Math.abs(s.origin.lat) > 90 ||
      !Number.isFinite(s.origin.lon) ||
      Math.abs(s.origin.lon) > 180
    )
      return null;
    s.encounters ??= {};
    if (
      typeof s.encounters !== "object" ||
      Array.isArray(s.encounters) ||
      Object.values(s.encounters).some((n) => !Number.isFinite(n))
    )
      return null;
    const ids = new Set<string>(),
      items = new Set<string>();
    const item = (i: Item) => {
      if (
        !i ||
        typeof i.id !== "string" ||
        items.has(i.id) ||
        !["weapon", "armor", "helmet", "boots"].includes(i.slot) ||
        !Number.isFinite(i.power) ||
        i.power < 0 ||
        !Number.isFinite(i.value) ||
        i.value < 0 ||
        typeof i.name !== "string"
      )
        throw Error();
      items.add(i.id);
    };
    const point = (p: Point) => Number.isFinite(p.x) && Number.isFinite(p.z);
    for (const c of s.camps) {
      if (
        !point(c) ||
        typeof c.id !== "string" ||
        ids.has(c.id) ||
        !Array.isArray(c.route) ||
        !c.route.every(point) ||
        !Number.isFinite(c.buildings)
      )
        return null;
      ids.add(c.id);
    }
    for (const c of s.camps)
      if (c.parentId && !ids.has(c.parentId)) return null;
    for (const c of s.characters) {
      if (
        !point(c) ||
        ids.has(c.id) ||
        !s.camps.some((v) => v.id === c.campId) ||
        !["warrior", "mage", "archer"].includes(c.role) ||
        typeof c.name !== "string" ||
        !Number.isFinite(c.appearance) ||
        ![c.exp, c.hp, c.coins, c.kills, c.fragments].every(
          (n) => Number.isFinite(n) && n >= 0,
        ) ||
        !Array.isArray(c.bag) ||
        c.bag.length > BALANCE.slots ||
        !c.equipment
      )
        return null;
      ids.add(c.id);
      c.bag.forEach(item);
      Object.values(c.equipment).forEach(item);
    }
    s.vault.forEach(item);
    for (const o of s.offers) {
      if (
        !ids.has(o.campId) ||
        !Number.isSafeInteger(o.gold) ||
        o.gold < 0 ||
        !Number.isFinite(o.readyAt) ||
        !Number.isFinite(o.seed) ||
        !Number.isFinite(o.ceiling) ||
        !Array.isArray(o.items)
      )
        return null;
      o.items.forEach(item);
      if (
        o.candidates !== null &&
        (!Array.isArray(o.candidates) ||
          o.candidates.some(
            (c) =>
              !["warrior", "mage", "archer"].includes(c.role) ||
              !Number.isInteger(c.level) ||
              c.level < 1 ||
              c.level > 100,
          ))
      )
        return null;
    }
    if (!s.characters.some((c) => c.id === s.activeId)) return null;
    return s;
  } catch {
    return null;
  }
}

