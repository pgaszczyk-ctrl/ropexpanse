// Enemies (owner's design doc, Wrogowie i skalowanie): the biome decides who comes,
// the cultural region how they look, the distance how strong they are. Combat
// archetypes are the same everywhere; only model, name and palette change. This is
// the starting region (Slavic Europe). Looks are placeholders built from the current
// rigs (wolf / person) with a tint and a size until the artist's models arrive.
import type { MapData } from "./world.ts";
import type { Point } from "./rules.ts";
import { areaKindAt } from "./resources.ts";

export type Biome = "las" | "laki" | "woda" | "cmentarz" | "miasto" | "przemysl";
export type Behavior =
  | "pack" // stado: fast and weak, flank from the sides
  | "charge" // szarżownik: red line, pause, dash — can be dodged
  | "shooter" // strzelec: keeps distance, runs when you come close
  | "caster" // czarownik: spells from afar
  | "ambush" // zasadzka: hidden, jumps out close by
  | "summoner" // przywoływacz: weak, calls servants — kill it first
  | "colossus" // kolos: slow, a big red circle slam
  | "thief" // złodziej: steals gold and runs
  | "lure" // zwodziciel: draws you away and bursts
  | "whirl"; // wir: spins in a circle of blades
export type Rank = "weak" | "medium" | "elite" | "boss";
export type TimeOfDay = "day" | "twilight" | "night";
export type Weather = "clear" | "rain" | "snow" | "fog" | "storm" | "wind";
export type Species = {
  id: string;
  name: string;
  biome: Biome | "any";
  rank: Rank;
  behavior: Behavior;
  look: "wolf" | "person" | "archer";
  color: number;
  size: number;
  /** Only at these times / in this weather (absent = always). */
  when?: TimeOfDay[];
  weather?: Weather[];
  /** Only far from the ropes (design doc: "dalekie od lin"). */
  far?: boolean;
};
const S = (
  id: string,
  name: string,
  biome: Species["biome"],
  rank: Rank,
  behavior: Behavior,
  look: Species["look"],
  color: number,
  size = 1,
  extra: Partial<Species> = {},
): Species => ({ id, name, biome, rank, behavior, look, color, size, ...extra });

export const SLAVIC: Species[] = [
  // Las
  S("wilk", "Wilk", "las", "weak", "pack", "wolf", 0x8a8f93, 0.9),
  S("dzik", "Dzik", "las", "medium", "charge", "wolf", 0x4b3423, 1.1),
  S("pajak", "Pająk leśny", "las", "medium", "ambush", "wolf", 0x2f4a2a, 0.9),
  S("leszy", "Leszy", "las", "elite", "summoner", "person", 0x5b4630, 1.3),
  // Łąki i pola
  S("szczur", "Szczur polny", "laki", "weak", "pack", "wolf", 0x7a6a58, 0.55),
  S("strach", "Strach na wróble", "laki", "medium", "shooter", "archer", 0xc9a85a),
  S("bandyta_polny", "Bandyta polny", "laki", "medium", "charge", "person", 0x9c7b4a),
  S("poludnica", "Południca", "laki", "elite", "whirl", "person", 0xf2ede0, 1.3, { when: ["day"] }),
  // Woda i brzegi
  S("rak", "Rak", "woda", "weak", "pack", "wolf", 0x9e3b2a, 0.55),
  S("topielec", "Topielec", "woda", "medium", "ambush", "person", 0x5f8f7a),
  S("kumak", "Żaba-kumak", "woda", "medium", "shooter", "wolf", 0x5d7a3a, 0.7),
  S("wodnik", "Wodnik", "woda", "elite", "caster", "person", 0x3d6f86, 1.25),
  // Cmentarz
  S("szkielet", "Szkielet", "cmentarz", "weak", "pack", "person", 0xe6e1cf, 0.95),
  S("upior", "Upiór", "cmentarz", "medium", "caster", "person", 0xa8a8b0),
  S("nekromanta", "Nekromanta", "cmentarz", "elite", "summoner", "person", 0x26222b, 1.2),
  S("strzyga", "Strzyga", "cmentarz", "elite", "charge", "person", 0x8c8a86, 1.2),
  // Miasto
  S("bandyta", "Bandyta", "miasto", "weak", "pack", "person", 0x6b5a48),
  S("kusznik", "Bandyta-kusznik", "miasto", "medium", "shooter", "archer", 0x5a4a3a),
  S("zlodziej", "Złodziej", "miasto", "medium", "thief", "person", 0x3a3530, 0.85),
  S("herszt", "Herszt", "miasto", "elite", "colossus", "person", 0x6b4a2a, 1.45),
  // Przemysł i kamieniołom
  S("kamyczak", "Kamyczak", "przemysl", "weak", "pack", "wolf", 0x8f9aa0, 0.6),
  S("bies", "Bies kopalni", "przemysl", "medium", "ambush", "person", 0x1e1a1a),
  S("golem", "Golem", "przemysl", "elite", "colossus", "person", 0x7c8a78, 1.6),
  // Time of day
  S("ognik", "Błędny ognik", "any", "weak", "lure", "wolf", 0x9fd86a, 0.45, { when: ["twilight"] }),
  S("nietoperz", "Nietoperze", "any", "weak", "pack", "wolf", 0x3a2a22, 0.5, { when: ["twilight", "night"] }),
  S("nocnica", "Nocnica", "laki", "elite", "caster", "person", 0x1c1a26, 1.25, { when: ["night"] }),
  S("wilkolak", "Wilkołak", "las", "elite", "charge", "wolf", 0x6f6a66, 1.6, { when: ["night"] }),
  // Weather
  S("topielec_deszcz", "Topielec", "any", "medium", "ambush", "person", 0x5f8f7a, 1, { weather: ["rain", "storm"] }),
  S("upior_lodowy", "Lodowy upiór", "any", "medium", "caster", "person", 0xbfe3f2, 1, { weather: ["snow"] }),
  S("planetnik", "Płanetnik", "any", "elite", "caster", "person", 0x55606e, 1.3, { weather: ["storm"] }),
  // Far from the ropes
  S("zmij", "Żmij", "any", "elite", "charge", "wolf", 0x6b7a3a, 1.8, { far: true }),
  S("licz", "Licz", "cmentarz", "elite", "summoner", "person", 0x5a2a6a, 1.35, { far: true }),
];
/** Servants called by a summoner, by biome. */
export const SERVANTS: Record<Biome, string> = {
  las: "wilk",
  laki: "szczur",
  woda: "rak",
  cmentarz: "szkielet",
  miasto: "bandyta",
  przemysl: "kamyczak",
};
export const speciesById = (id: string) => SLAVIC.find((s) => s.id === id)!;

const BIOME_OF: Record<string, Biome> = {
  forest: "las", wood: "las", scrub: "las", orchard: "las", park: "las",
  meadow: "laki", grass: "laki", grassland: "laki", farmland: "laki", village_green: "laki", allotments: "laki", green: "laki", garden: "laki",
  cemetery: "cmentarz",
  industrial: "przemysl", quarry: "przemysl", railway: "przemysl", construction: "przemysl", brownfield: "przemysl", landfill: "przemysl",
};
/** Biome under a point: water nearby wins, then the OSM area, else town. */
export function biomeAt(map: MapData, p: Point): Biome {
  for (const a of map.areas) {
    if (!a.water) continue;
    const r = a.rings[0];
    let x0 = Infinity, z0 = Infinity, x1 = -Infinity, z1 = -Infinity;
    for (const [x, z] of r) {
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (z < z0) z0 = z;
      if (z > z1) z1 = z;
    }
    if (p.x > x0 - 5 && p.x < x1 + 5 && p.z > z0 - 5 && p.z < z1 + 5) return "woda";
  }
  return BIOME_OF[areaKindAt(map, p) ?? ""] ?? "miasto";
}

/** Who appears: the biome's species of the rank, plus whatever the time, weather and
 * distance allow; `roll` (0–1) is the encounter's stable choice. */
export function pickSpecies(
  biome: Biome,
  rank: Rank,
  time: TimeOfDay,
  weather: Weather,
  far: boolean,
  roll: number,
): Species {
  const fits = (s: Species) =>
    (s.biome === biome || s.biome === "any") &&
    (!s.when || s.when.includes(time)) &&
    (!s.weather || s.weather.includes(weather)) &&
    (!s.far || far);
  const want = rank === "boss" ? "elite" : rank;
  let pool = SLAVIC.filter((s) => s.rank === want && fits(s));
  // At night towns have fewer bandits and more thieves (design doc).
  if (time === "night" && biome === "miasto" && want === "weak")
    pool = pool.concat(SLAVIC.filter((s) => s.id === "zlodziej"));
  // Nobody of that rank fits now (e.g. no elite on the meadows at dusk): step down a
  // rank, still keeping time, weather and distance rules.
  for (const r of ["medium", "weak"] as const)
    if (!pool.length) pool = SLAVIC.filter((s) => s.rank === r && fits(s));
  return pool[Math.floor(roll * pool.length) % pool.length];
}
