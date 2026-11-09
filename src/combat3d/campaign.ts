import { RARITY_POWER, RARITY_VALUE, type ItemRarity } from "./loot.ts";
import {
  safeDistance,
  invalidateTerritory,
  type Connection,
} from "./territory-rules.ts";
import { candidatesFor } from "./recruitment.ts";
export { candidatesFor } from "./recruitment.ts";
import { distance, type Point } from "./rules.ts";
import { unproject } from "./world.ts";
import { regionAt, type Rarity, type Region, type Sex } from "./wayfarers.ts";
export const BALANCE = {
  slots: 24,
  safeRadius: 7.5,
  minCampDistance: 18,
  ropeLength: 65,
  ropeSafeMeters: 10,
  quietBorderMeters: 300,
  recruitmentMs: 300_000,
  /** Wood for a new camp (owner's design doc: wood builds camps and buoys). */
  campWood: 20,
  /** Metres of rope twisted from one bundle of fibre. */
  ropePerFiber: 5,
  /** What a new expedition starts with in the shared Vault. */
  startStock: { wood: 40, ore: 0, fiber: 10, herbs: 0, rope: 500 },
};
/** Gathered goods, kept in one shared Vault for the whole rope network. Rope is in metres. */
export type Stock = { wood: number; ore: number; fiber: number; herbs: number; rope: number };
export const STOCK_KEYS = ["wood", "ore", "fiber", "herbs", "rope"] as const;
export const STOCK_NAMES: Record<keyof Stock, string> = {
  wood: "Drewno",
  ore: "Ruda",
  fiber: "Włókno",
  herbs: "Zioła",
  rope: "Lina",
};
/** Longest rope (scene units) the hero may run out now: the stretch limit or what is left in stock. */
export function ropeAvailable(s: Campaign, scale: number) {
  return Math.min(BALANCE.ropeLength, s.stock.rope * scale);
}
/** Takes a laid rope (scene units) from the stock, in whole metres. */
export function spendRope(s: Campaign, units: number, scale: number) {
  const metres = Math.ceil(units / scale);
  if (metres > s.stock.rope) return false;
  s.stock.rope -= metres;
  return true;
}
/** Production keys: the four gathered goods plus rope from the ropemaker (metres). */
const MADE = ["wood", "ore", "fiber", "herbs", "rope"] as const;
export type Made = Record<(typeof MADE)[number], number>;
export const PRODUCTION_CAP_HOURS = 10;
/** Counts circle production since the last count (also time spent away), up to the cap.
 * Returns true when the buffer just became full. A clock moved backwards adds nothing. */
export function accrue(s: Campaign, now: number) {
  const rates = s.rates;
  const pending = (s.pending ??= {});
  const since = s.producedAt ?? now;
  s.producedAt = now;
  if (!rates || now <= since) return false;
  const hours = Math.min(PRODUCTION_CAP_HOURS, (now - since) / 3_600_000);
  let full = true,
    wasFull = true,
    any = false;
  for (const k of MADE) {
    const rate = rates[k] ?? 0,
      cap = rate * PRODUCTION_CAP_HOURS;
    if (cap <= 0) continue;
    any = true;
    const have = pending[k] ?? 0;
    if (have < cap - 1e-9) wasFull = false;
    let add = Math.min(cap - have, rate * hours);
    // The ropemaker twists fibre from the Vault: no fibre, no rope.
    if (k === "rope") {
      add = Math.max(0, Math.min(add, s.stock.fiber * BALANCE.ropePerFiber));
      s.stock.fiber -= Math.ceil(add / BALANCE.ropePerFiber - 1e-9);
      s.stock.fiber = Math.max(0, s.stock.fiber);
    }
    pending[k] = have + Math.max(0, add);
    if (pending[k]! < cap - 1e-9) full = false;
  }
  return any && full && !wasFull;
}
/** Moves whole units of collected production into the Vault stock. */
export function collect(s: Campaign) {
  const got: Made = { wood: 0, ore: 0, fiber: 0, herbs: 0, rope: 0 };
  if (!s.pending) return got;
  for (const k of MADE) {
    const n = Math.floor(s.pending[k] ?? 0);
    if (!n) continue;
    s.pending[k] = (s.pending[k] ?? 0) - n;
    s.stock[k] += n;
    got[k] = n;
  }
  return got;
}
/** Twists fibre into rope (a stand-in for the ropemaker until camp characters exist). */
export function twistRope(s: Campaign, bundles: number) {
  const n = Math.min(Math.floor(bundles), s.stock.fiber);
  if (n <= 0) return 0;
  s.stock.fiber -= n;
  s.stock.rope += n * BALANCE.ropePerFiber;
  return n * BALANCE.ropePerFiber;
}
export type Role =
  | "warrior"
  | "mage"
  | "archer"
  | "herbalist"
  | "woodcutter"
  | "miner"
  | "ropemaker";
export const ROLES: Role[] = ["warrior", "mage", "archer", "herbalist", "woodcutter", "miner", "ropemaker"];
/** Camp folk do not fight: they stay in their camp and work (owner's design doc). */
export const CAMP_ROLES: Role[] = ["woodcutter", "miner", "ropemaker"];
export const isCampRole = (r: Role) => CAMP_ROLES.includes(r);
export type Slot = "weapon" | "offhand" | "armor" | "helmet" | "boots";
/** Display order of the five equipment places. */
export const SLOTS: readonly Slot[] = [
  "weapon",
  "offhand",
  "armor",
  "helmet",
  "boots",
];
export type Item = {
  id: string;
  kind: string;
  name: string;
  slot: Slot | "material";
  level?: number;
  rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";
  affinity?: Role;
  power: number;
  value: number;
  icon: string;
};
/** Who a Wayfarer is (owner's design doc): rarity frame, passive trait, local name,
 * a title for legends. Optional so older saves stay valid. */
export type WayfarerInfo = {
  sex?: Sex;
  rarity?: Rarity;
  trait?: string;
  title?: string;
  region?: Region;
};
export type Character = Point & WayfarerInfo & {
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
export type Candidate = WayfarerInfo & {
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
  /** Who walks the rope together (ids, at most PARTY_SIZE, the controlled one included). */
  party?: string[];
  characters: Character[];
  camps: Camp[];
  connections?: Connection[];
  vault: Item[];
  bank: number;
  stock: Stock;
  offers: Offer[];
  encounters: Record<string, number>;
  /** Circle production per hour (last computed from the map), what waits to be collected,
   * and when it was last counted (ms). */
  rates?: Partial<Made>;
  pending?: Partial<Made>;
  producedAt?: number;
  /** Fog of war: explored geographic cells (explore.ts). */
  explored?: string[];
  /** Wayfarers already rescued on the map, by spot key → when (ms). */
  rescued?: Record<string, number>;
  /** Closed haze vents, by key → when they were closed (ms). They stay closed. */
  vents?: Record<string, number>;
  /** Gathering spots taken, by key → time (ms) they grow back. */
  harvested?: Record<string, number>;
  serial: number;
};
export const roleName = (r: Role) =>
  ({
    warrior: "Wojownik",
    mage: "Mag",
    archer: "Łucznik",
    herbalist: "Zielarz",
    woodcutter: "Drwal",
    miner: "Górnik",
    ropemaker: "Powroźnik",
  })[r];
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
  return ["offhand", "armor", "helmet", "boots"].reduce(
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
  ["Drewniana tarcza", "offhand", 2, 70, "shield"],
  ["Kryształowy orb", "offhand", 2, 70, "orb"],
  ["Topór", "weapon", 5, 180, "axe"],
  ["Młot", "weapon", 6, 220, "hammer"],
] as const;
export const GEAR_KINDS = templates.length;
/** Materials left by animals (owner's design doc: hides, fangs). */
const MATERIALS = { skora: ["Skóra", "hide", 8], kiel: ["Kieł", "fang", 12] } as const;
export function makeMaterial(s: Campaign, kind: keyof typeof MATERIALS, tier = 1): Item {
  const [name, icon, value] = MATERIALS[kind];
  return { id: nextId(s, "item"), kind: `mat-${kind}`, name, slot: "material", level: tier, rarity: "common", power: 0, value: value * tier, icon };
}
export function makeItem(
  s: Campaign,
  index: number,
  tier = 1,
  rarity: ItemRarity = "common",
): Item {
  const [name, slot, power, value, icon] =
    templates[Math.abs(index) % templates.length];
  return {
    id: nextId(s, "item"),
    kind: `gear-${index % templates.length}`,
    name,
    slot,
    level: tier,
    rarity,
    affinity:
      icon === "sword" || icon === "shield" || icon === "axe" || icon === "hammer"
        ? "warrior"
        : icon === "staff" || icon === "orb"
          ? "mage"
          : undefined,
    power: power + Math.max(0, tier - 1) + RARITY_POWER[rarity],
    value: value * tier * RARITY_VALUE[rarity],
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
    stock: { ...BALANCE.startStock },
    offers: [],
    encounters: {},
    serial: 1,
  };
  c.bag.push(makeItem(s, 0), makeItem(s, 1), makeItem(s, 2));
  return s;
}
export const PARTY_SIZE = 3;
/** The party's ids: the controlled character first, then up to two companions. */
export function partyOf(s: Campaign) {
  const ids = [s.activeId, ...(s.party ?? []).filter((id) => id !== s.activeId)]
    .filter(
      (id, i, a) =>
        a.indexOf(id) === i &&
        s.characters.some((c) => c.id === id && (id === s.activeId || !isCampRole(c.role))),
    )
    .slice(0, PARTY_SIZE);
  s.party = ids;
  return ids;
}
/** Adds or removes a companion; the controlled character always stays. */
export function toggleParty(s: Campaign, id: string) {
  const ids = partyOf(s);
  if (id === s.activeId) return false;
  const c = s.characters.find((v) => v.id === id);
  if (!c || isCampRole(c.role)) return false;
  if (ids.includes(id)) s.party = ids.filter((v) => v !== id);
  else if (ids.length < PARTY_SIZE) s.party = [...ids, id];
  else return false;
  return true;
}
export function activeCharacter(s: Campaign) {
  return s.characters.find((c) => c.id === s.activeId)!;
}
export function nearCamp(s: Campaign, p: Point, r = BALANCE.safeRadius) {
  return s.camps
    .filter((c) => distance(c, p) <= r)
    .sort((a, b) => distance(a, p) - distance(b, p))[0];
}
export function distanceToSafeZone(s: Campaign, p: Point, scale: number) {
  return safeDistance(s, p, scale, BALANCE.safeRadius, BALANCE.ropeSafeMeters);
}
// A carried rope protects nothing until its connection is committed.
export function inSafeZone(s: Campaign, p: Point, scale: number, margin = 0) {
  return distanceToSafeZone(s, p, scale) <= margin;
}
export function connectCamps(
  s: Campaign,
  from: string,
  to: string,
  route: Point[],
) {
  const a = s.camps.find((c) => c.id === from),
    b = s.camps.find((c) => c.id === to);
  if (
    !a ||
    !b ||
    a === b ||
    route.length < 2 ||
    route.some((p) => !Number.isFinite(p.x) || !Number.isFinite(p.z)) ||
    distance(route[0], a) > 0.01 ||
    distance(route.at(-1)!, b) > 0.01
  )
    return false;
  if (
    s.camps.some(
      (c) =>
        (c.id === to && c.parentId === from) ||
        (c.id === from && c.parentId === to),
    ) ||
    s.connections?.some(
      (c) =>
        (c.from === from && c.to === to) || (c.from === to && c.to === from),
    )
  )
    return false;
  s.connections ??= [];
  s.connections.push({
    id: nextId(s, "link"),
    from,
    to,
    route: route.map((p) => ({ ...p })),
  });
  invalidateTerritory(s);
  return true;
}
export function equip(c: Character, id: string) {
  const i = c.bag.findIndex((v) => v.id === id);
  if (i < 0) return false;
  if (c.bag[i].slot === "material") return false;
  const item = c.bag[i] as Item & { slot: Slot },
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
    // One shared offer for the whole network: any camp shows and manages it (owner, 8 Nov).
    s.offers.length > 0 ||
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
    ceiling: levelOf(c.exp),
    candidates: null,
  };
  s.offers.push(o);
  return o;
}
export function resolveOffers(s: Campaign, now = Date.now()) {
  let changed = false;
  for (const o of s.offers)
    if (!o.candidates && now >= o.readyAt) {
      const camp = s.camps.find((c) => c.id === o.campId);
      const geo = camp ? unproject(camp, s.origin) : s.origin;
      o.candidates = candidatesFor(
        o,
        camp?.buildings ?? 0,
        regionAt(geo.lat, geo.lon),
        new Set(s.characters.map((c) => c.name)),
      );
      changed = true;
    }
  return changed;
}
/** A new Wayfarer standing at `at`, belonging to camp `campId`. */
export function addWayfarer(s: Campaign, v: Candidate, at: Point, campId: string) {
  const c: Character = {
    x: at.x,
    z: at.z,
    id: nextId(s, "hero"),
    name: v.name,
    role: v.role,
    appearance: v.appearance,
    sex: v.sex,
    rarity: v.rarity,
    trait: v.trait,
    title: v.title,
    region: v.region,
    exp: xpThreshold(v.level),
    hp: 100 + (v.level - 1) * 8,
    coins: 0,
    kills: 0,
    fragments: 0,
    campId,
    bag: [],
    equipment: {},
    weapon: v.role === "warrior" ? "sword" : "magic",
  };
  c.equipment.weapon = makeItem(s, v.role === "warrior" ? 0 : 1);
  s.characters.push(c);
  return c;
}
/** Hires a candidate into `campId` (the camp you stand at), or the camp the offer came from. */
export function hire(s: Campaign, offerId: string, candidateId: string, campId?: string) {
  const o = s.offers.find((v) => v.id === offerId),
    v = o?.candidates?.find((v) => v.id === candidateId),
    camp =
      s.camps.find((c) => c.id === campId) ??
      s.camps.find((c) => c.id === o?.campId);
  if (!o || !v || !camp) return null;
  const c = addWayfarer(s, v, camp, camp.id);
  s.offers = s.offers.filter((v) => v !== o);
  return c;
}
/** The offer seen from a camp: its own one first (old saves), else the shared one. */
export function offerAt(s: Campaign, campId?: string) {
  return s.offers.find((o) => o.campId === campId) ?? s.offers[0];
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
    s.connections ??= [];
    if (!Array.isArray(s.connections)) return null;
    // Saves from before gathering get the starting stock.
    s.stock = { ...BALANCE.startStock, ...(s.stock ?? {}) };
    if (STOCK_KEYS.some((k) => !Number.isFinite(s.stock[k]) || s.stock[k] < 0))
      return null;
    for (const key of ["rates", "pending"] as const) {
      const v = s[key];
      if (
        v !== undefined &&
        (typeof v !== "object" ||
          MADE.some(
            (k) => v[k] !== undefined && (!Number.isFinite(v[k]) || v[k]! < 0),
          ))
      )
        return null;
    }
    if (s.producedAt !== undefined && !Number.isFinite(s.producedAt))
      return null;
    if (
      s.party !== undefined &&
      (!Array.isArray(s.party) || s.party.some((id) => typeof id !== "string"))
    )
      return null;
    s.explored ??= [];
    if (!Array.isArray(s.explored) || s.explored.some((k) => typeof k !== "string"))
      return null;
    s.rescued ??= {};
    if (
      typeof s.rescued !== "object" ||
      Array.isArray(s.rescued) ||
      Object.values(s.rescued).some((n) => !Number.isFinite(n))
    )
      return null;
    s.vents ??= {};
    if (
      typeof s.vents !== "object" ||
      Array.isArray(s.vents) ||
      Object.values(s.vents).some((n) => !Number.isFinite(n))
    )
      return null;
    s.harvested ??= {};
    if (
      typeof s.harvested !== "object" ||
      Array.isArray(s.harvested) ||
      Object.values(s.harvested).some((n) => !Number.isFinite(n))
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
        ![...SLOTS, "material"].includes(i.slot) ||
        !Number.isFinite(i.power) ||
        i.power < 0 ||
        !Number.isFinite(i.value) ||
        i.value < 0 ||
        typeof i.name !== "string"
      )
        throw Error();
      if (
        i.level !== undefined &&
        (!Number.isInteger(i.level) || i.level < 1 || i.level > 100)
      )
        throw Error();
      if (
        i.rarity !== undefined &&
        !["common", "uncommon", "rare", "epic", "legendary"].includes(i.rarity)
      )
        throw Error();
      if (
        i.affinity !== undefined &&
        !ROLES.includes(i.affinity)
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
    for (const link of s.connections) {
      const from = s.camps.find((c) => c.id === link.from),
        to = s.camps.find((c) => c.id === link.to);
      if (
        typeof link.id !== "string" ||
        ids.has(link.id) ||
        !from ||
        !to ||
        from === to ||
        !Array.isArray(link.route) ||
        link.route.length < 2 ||
        !link.route.every(point) ||
        distance(link.route[0], from) > 0.01 ||
        distance(link.route.at(-1)!, to) > 0.01
      )
        return null;
      ids.add(link.id);
    }
    for (const c of s.characters) {
      if (
        !point(c) ||
        ids.has(c.id) ||
        !s.camps.some((v) => v.id === c.campId) ||
        !ROLES.includes(c.role) ||
        typeof c.name !== "string" ||
        !Number.isFinite(c.appearance) ||
        ![c.exp, c.hp, c.coins, c.kills, c.fragments].every(
          (n) => Number.isFinite(n) && n >= 0,
        ) ||
        !Array.isArray(c.bag) ||
        c.bag.length > BALANCE.slots ||
        !c.equipment ||
        (c.rarity !== undefined &&
          !["common", "rare", "epic", "legendary"].includes(c.rarity)) ||
        (c.sex !== undefined && !["m", "f"].includes(c.sex)) ||
        [c.trait, c.title, c.region].some(
          (v) => v !== undefined && typeof v !== "string",
        )
      )
        return null;
      ids.add(c.id);
      c.bag.forEach(item);
      Object.entries(c.equipment).forEach(([slot, i]) => {
        if (i.slot !== slot || i.slot === "material") throw Error();
        item(i);
      });
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
              !ROLES.includes(c.role) ||
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
