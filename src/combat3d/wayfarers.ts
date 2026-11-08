// Wayfarers (owner's design doc, Wędrowcy): every recruit has a rarity (portrait
// frame), one passive trait from its class pool (weak / full / strong by rarity,
// a unique one for legends) and a local name from the region where it was found.
// Names are always Latin script, diacritics kept, never translated; titles are
// translated. Name lists are a DRAFT: before a region ships, someone from that
// region checks them (as with enemies). Regions are coarse lat/lon boxes, an
// approximation for the game, not borders.
import type { Role } from "./campaign.ts";

export type Rarity = "common" | "rare" | "epic" | "legendary";
export type Sex = "m" | "f";
export const RARITY_NAMES: Record<Rarity, string> = {
  common: "Zwykły",
  rare: "Rzadki",
  epic: "Epicki",
  legendary: "Legendarny",
};
/** Frame colours shared with item rarity. */
export const RARITY_COLORS: Record<Rarity, string> = {
  common: "#9A9A9A",
  rare: "#3F8FE0",
  epic: "#C77DFF",
  legendary: "#E8B53A",
};
/** Strength of the trait by rarity (common = weak version). */
export const TRAIT_STRENGTH: Record<Rarity, number> = {
  common: 0.5,
  rare: 1,
  epic: 1.5,
  legendary: 1.5,
};

export type Trait = { id: string; name: string; text: string };
export const TRAITS: Record<Role, Trait[]> = {
  warrior: [
    { id: "stun5", name: "Ciężka ręka", text: "co 5. cios ogłusza" },
    { id: "lastStand", name: "Upór", text: "poniżej 30% życia przyjmuje mniej obrażeń" },
  ],
  mage: [
    { id: "volatile", name: "Iskra", text: "zabity wróg wybucha" },
    { id: "doubleBolt", name: "Echo", text: "pocisk czasem uderza podwójnie" },
  ],
  archer: [
    { id: "firstCrit", name: "Pierwsza strzała", text: "pierwszy strzał w walce zawsze krytyczny" },
    { id: "evasion", name: "Zwinność", text: "czasem unika ciosu" },
  ],
};
/** One legend per class, unlike anyone else's. */
export const LEGENDS: Record<Role, Trait> = {
  warrior: { id: "unbroken", name: "Niezłomność", text: "ogłusza co 4. ciosem i nie spada poniżej 1 życia raz na walkę" },
  mage: { id: "lantern", name: "Latarnik", text: "wokół niego Mgła się przerzedza: wrogowie zadają mniej, spod nóg sypią się iskry" },
  archer: { id: "hawk", name: "Sokole oko", text: "każdy strzał po 3 s spokoju jest krytyczny, unika co piątego ciosu" },
};
export const TITLES: Record<Role, [string, string, string][]> = {
  warrior: [
    ["Waleczny", "Waleczna", "the Valiant"],
    ["Niezłomny", "Niezłomna", "the Unbroken"],
  ],
  mage: [["Mądry", "Mądra", "the Wise"]],
  archer: [["Bystrooki", "Bystrooka", "the Keen-eyed"]],
};
export function traitOf(role: Role, id?: string): Trait | undefined {
  return [...TRAITS[role], LEGENDS[role]].find((t) => t.id === id);
}

export type Region =
  | "pl"
  | "slav"
  | "scandinavia"
  | "westeu"
  | "med"
  | "mena"
  | "ssa"
  | "eastasia"
  | "southasia"
  | "latam"
  | "northam"
  | "oceania";
// First matching box wins: [region, south, north, west, east].
const BOXES: [Region, number, number, number, number][] = [
  ["pl", 49, 54.9, 14.1, 24.2],
  ["slav", 53.9, 59.7, 20.9, 28.3], // Baltic states: the nearest list we have
  ["scandinavia", 54.5, 71.5, 4.5, 31.6],
  ["latam", -56, 32.5, -118, -34],
  ["northam", 15, 72, -170, -52],
  ["med", 35, 44.2, -10, 28.5],
  ["slav", 41, 70, 18.9, 60],
  ["westeu", 42, 61, -11, 18.9],
  ["mena", 12, 42, -18, 63],
  ["ssa", -35, 15, -18, 52],
  ["southasia", 5, 37, 60, 92],
  ["eastasia", -11, 54, 92, 146],
  ["oceania", -48, -10, 110, 180],
];
export function regionAt(lat: number, lon: number): Region {
  for (const [r, s, n, w, e] of BOXES)
    if (lat >= s && lat <= n && lon >= w && lon <= e) return r;
  return "westeu";
}
const list = (s: string) => s.split(",").map((n) => n.trim());
export const NAMES: Record<Region, { m: string[]; f: string[] }> = {
  pl: {
    m: list("Mieczysław, Bogdan, Jan, Piotr, Krzysztof, Tomasz, Wojciech, Marek, Kazimierz, Stanisław, Zbigniew, Jakub, Antoni, Franciszek, Szymon, Bartosz, Łukasz, Grzegorz, Władysław, Leszek"),
    f: list("Jadwiga, Bogna, Anna, Maria, Katarzyna, Małgorzata, Agnieszka, Barbara, Zofia, Helena, Krystyna, Ewa, Joanna, Magdalena, Dorota, Wanda, Grażyna, Halina, Jolanta, Urszula"),
  },
  slav: {
    m: list("Dmitri, Ivan, Bohdan, Miroslav, Vladimír, Oleksandr, Pavel, Milan, Dušan, Yaroslav, Andrej, Taras, Radek, Luboš, Stanislav, Vasyl, Igor, Boris, Zoran, Petr"),
    f: list("Olena, Natalia, Milena, Daria, Svetlana, Lucie, Zuzana, Oksana, Vesna, Ludmila, Tatiana, Irina, Jana, Veronika, Mariya, Kateřina, Bojana, Yulia, Nadia, Alena"),
  },
  scandinavia: {
    m: list("Sigurd, Halvar, Erik, Lars, Bjørn, Gunnar, Magnus, Leif, Torsten, Ragnar, Anders, Olav, Henrik, Nils, Ivar, Sven, Johan, Eino, Mikko, Rasmus"),
    f: list("Astrid, Sigrid, Ingrid, Freja, Solveig, Liv, Karin, Elin, Saga, Maja, Linnea, Helga, Ronja, Tuva, Aino, Hanna, Signe, Ylva, Kerstin, Eira"),
  },
  westeu: {
    m: list("Gaspard, Hugo, Louis, Mathis, Lukas, Felix, Oliver, Arthur, Liam, Noah, Henri, Jules, Maximilian, Finn, Théo, Emil, Pieter, Daan, Callum, Rory"),
    f: list("Margot, Élodie, Camille, Léa, Emma, Charlotte, Sophie, Clara, Amélie, Lena, Hannah, Isla, Freya, Chloé, Inès, Marie, Lotte, Fenna, Siobhan, Niamh"),
  },
  med: {
    m: list("Lorenzo, Matteo, Alessandro, Giovanni, Marco, Pablo, Javier, Diego, Carlos, Álvaro, João, Tiago, Nikos, Giorgos, Dimitris, Andrea, Luca, Sergio, Rafael, Miguel"),
    f: list("Lucia, Chiara, Giulia, Sofia, Francesca, Martina, Elena, Carmen, Lucía, Paula, Inés, Beatriz, Mariana, Eleni, Katerina, Alessia, Valeria, Marta, Irene, Rosa"),
  },
  mena: {
    m: list("Karim, Tarik, Omar, Youssef, Ahmed, Amir, Hassan, Samir, Khalid, Nabil, Rami, Farid, Ali, Mehmet, Emre, Reza, Darius, Bilal, Malik, Ziad"),
    f: list("Leila, Yasmin, Amira, Nour, Fatima, Salma, Rania, Zainab, Hana, Mariam, Layla, Dina, Sara, Elif, Zeynep, Shirin, Aylin, Lina, Noor, Huda"),
  },
  ssa: {
    m: list("Kwame, Tunde, Kofi, Chidi, Emeka, Juma, Baraka, Sipho, Thabo, Oluwaseun, Kamau, Abebe, Moussa, Ibrahima, Tendai, Jabari, Ade, Kayode, Lwazi, Mandla"),
    f: list("Amara, Ngozi, Ama, Chiamaka, Adaeze, Zawadi, Nia, Thandiwe, Nomvula, Folake, Wanjiru, Abena, Aminata, Fatoumata, Makena, Imani, Ayana, Lerato, Zuri, Yetunde"),
  },
  eastasia: {
    m: list("Haruto, Kenji, Takumi, Ren, Hiroshi, Wei, Jun, Hao, Ming, Minjun, Seojun, Hyun, Daiki, Sota, Yuto, Long, Jian, Kai, Tuan, Somchai"),
    f: list("Aiko, Mei, Yui, Sakura, Hina, Mio, Xiu, Lan, Jia, Yuna, Seoyeon, Jiwoo, Haeun, Rin, Akari, Ling, Xin, Linh, Mai, Ploy"),
  },
  southasia: {
    m: list("Arjun, Rohan, Aarav, Vihaan, Rahul, Vikram, Kabir, Aditya, Sanjay, Imran, Faisal, Tenzin, Nikhil, Ravi, Amit, Dev, Kiran, Suresh, Ishaan, Pranav"),
    f: list("Priya, Ananya, Aisha, Diya, Kavya, Meera, Saanvi, Neha, Pooja, Riya, Isha, Lakshmi, Sana, Ayesha, Nisha, Tara, Anjali, Divya, Shreya, Zara"),
  },
  latam: {
    m: list("Mateo, Joaquín, Santiago, Sebastián, Diego, Tomás, Benjamín, Martín, Lucas, Gabriel, Emiliano, Nicolás, Felipe, Alejandro, Rodrigo, Thiago, Andrés, Leonardo, Bruno, Iker"),
    f: list("Valentina, Camila, Isabella, Sofía, Martina, Lucía, Mariana, Ximena, Renata, Florencia, Catalina, Antonella, Daniela, Gabriela, Paula, Julieta, Fernanda, Victoria, Emilia, Luana"),
  },
  northam: {
    m: list("Wyatt, Logan, Mason, Ethan, Jackson, Caleb, Owen, Hunter, Carter, Grayson, Landon, Ryan, Tyler, Austin, Cole, Brody, Dylan, Nathan, Eli, Jonah"),
    f: list("Hazel, Riley, Avery, Harper, Madison, Aubrey, Brooklyn, Savannah, Paisley, Kennedy, Peyton, Taylor, Addison, Skylar, Claire, Ellie, Nora, Piper, Quinn, Sadie"),
  },
  oceania: {
    m: list("Lachlan, Hamish, Cooper, Angus, Fletcher, Jack, Archie, Harrison, Tane, Nikau, Mitchell, Bailey, Flynn, Oscar, Hudson, Kieran, Rhys, Ari, Toby, Lincoln"),
    f: list("Matilda, Isla, Ruby, Georgia, Poppy, Mia, Aroha, Kaia, Willow, Sienna, Indie, Billie, Zoe, Grace, Evie, Lily, Maeve, Harriet, Tahlia, Ivy"),
  },
};
const REGIONS = Object.keys(NAMES) as Region[];

export type WayfarerRoll = {
  name: string;
  sex: Sex;
  rarity: Rarity;
  trait: string;
  title?: string;
  region: Region;
};
/** A new Wayfarer from a seeded random source. Camp recruitment never yields legends;
 * `rarityLift` (0–1) shifts the odds towards better ones. Names never repeat among
 * `taken`; 1 in 5 comes from another region. */
export function rollWayfarer(
  rand: () => number,
  role: Role,
  region: Region,
  taken: Set<string>,
  opts: { rarityLift?: number; legendary?: boolean } = {},
): WayfarerRoll {
  const lift = Math.max(0, Math.min(1, opts.rarityLift ?? 0));
  const r = rand();
  const rarity: Rarity = opts.legendary
    ? "legendary"
    : r < 0.06 + lift * 0.12
      ? "epic"
      : r < 0.3 + lift * 0.25
        ? "rare"
        : "common";
  const sex: Sex = rand() < 0.5 ? "m" : "f";
  const home = rand() < 0.2 ? REGIONS[Math.floor(rand() * REGIONS.length)] : region;
  const pool = NAMES[home][sex].filter((n) => !taken.has(n));
  const name =
    pool[Math.floor(rand() * pool.length)] ??
    `${NAMES[home][sex][0]} ${taken.size + 1}`;
  const trait =
    rarity === "legendary"
      ? LEGENDS[role].id
      : TRAITS[role][Math.floor(rand() * TRAITS[role].length)].id;
  const titles = TITLES[role];
  const title =
    rarity === "legendary"
      ? titles[Math.floor(rand() * titles.length)][sex === "m" ? 0 : 1]
      : undefined;
  return { name, sex, rarity, trait, title, region: home };
}
/** Full display name: legends carry their title (Mieczysław Waleczny). */
export const fullName = (c: { name: string; title?: string }) =>
  c.title ? `${c.name} ${c.title}` : c.name;
