// Wayfarers: local names (diacritics kept, never repeated), rarity odds, no legends
// from camp recruitment, gendered titles for legends, class traits, coarse regions.
import assert from "node:assert/strict";
import { rollWayfarer, regionAt, NAMES, TRAITS, LEGENDS, fullName } from "../../src/combat3d/wayfarers.ts";
import { candidatesFor } from "../../src/combat3d/recruitment.ts";

const places = [
  [51.25, 22.57, "pl"], [59.33, 18.07, "scandinavia"], [48.86, 2.35, "westeu"], [41.9, 12.5, "med"],
  [30.04, 31.24, "mena"], [6.52, 3.38, "ssa"], [35.68, 139.69, "eastasia"], [19.08, 72.88, "southasia"],
  [-23.55, -46.63, "latam"], [40.71, -74.0, "northam"], [-33.87, 151.21, "oceania"], [50.45, 30.52, "slav"],
];
for (const [lat, lon, r] of places) assert.equal(regionAt(lat, lon), r, `${lat},${lon}`);

let seed = 7;
const rand = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) | 0) >>> 0) / 4294967296;
const taken = new Set();
const counts = { common: 0, rare: 0, epic: 0, legendary: 0 };
let local = 0;
for (let i = 0; i < 2000; i++) {
  const w = rollWayfarer(rand, "warrior", "pl", i < 30 ? taken : new Set());
  counts[w.rarity]++;
  if (w.region === "pl") local++;
  assert.ok(TRAITS.warrior.some((t) => t.id === w.trait));
  assert.equal(w.title, undefined);
  if (i < 30) {
    assert.ok(!taken.has(w.name), "names never repeat among your Wayfarers");
    taken.add(w.name);
  }
}
assert.equal(counts.legendary, 0, "camps never give legends");
assert.ok(counts.common > counts.rare && counts.rare > counts.epic && counts.epic > 0, JSON.stringify(counts));
assert.ok(local / 2000 > 0.75 && local / 2000 < 0.88, `about 4 in 5 local (${local / 2000})`);
// Legends: unique trait and a title in the right gender form.
for (let i = 0; i < 40; i++) {
  const w = rollWayfarer(rand, "archer", "pl", new Set(), { legendary: true });
  assert.equal(w.trait, LEGENDS.archer.id);
  assert.equal(w.title, w.sex === "m" ? "Bystrooki" : "Bystrooka");
  assert.equal(fullName(w), `${w.name} ${w.title}`);
}
assert.ok(NAMES.pl.m.includes("Mieczysław") && NAMES.westeu.f.includes("Élodie"), "diacritics kept");
// Recruitment: candidates carry who they are, deterministically, with local names.
const offer = { id: "o", campId: "c", gold: 900, items: [], readyAt: 0, seed: 12345, ceiling: 5, candidates: null };
const a = candidatesFor(offer, 4, "pl", new Set(["Jan"]));
assert.deepEqual(candidatesFor(offer, 4, "pl", new Set(["Jan"])), a, "same offer, same candidates");
assert.ok(a.length >= 1 && a.every((c) => c.rarity && c.trait && c.sex && c.name !== "Jan"));
console.log(`PASS: wayfarers → regions, local names (${(local / 20).toFixed(0)}% local), rarity ${JSON.stringify(counts)}, legends with titles, deterministic candidates`);
