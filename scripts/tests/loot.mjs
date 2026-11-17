// Loot table (review of 8 Nov 2026): animals leave tix and materials, never gear;
// humanoids leave weapons and armour with a rarity roll; bosses always two rare+ pieces.
import assert from "node:assert/strict";
import { lootFor, rollRarity, coinSplit, isValuable, RARITY_ODDS, RARITY_POWER } from "../../src/combat3d/loot.ts";
import { makeItem, makeMaterial } from "../../src/combat3d/campaign.ts";

let seed = 7;
const rng = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) | 0) >>> 0) / 4294967296;
for (const rank of ["weak", "medium", "elite", "boss"]) {
  const sum = Object.values(RARITY_ODDS[rank]).reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(sum - 1) < 1e-9, `${rank} odds sum to 1`);
}
let materials = 0;
for (let i = 0; i < 3000; i++) {
  const l = lootFor("wolf", "weak", 2, rng);
  assert.equal(l.gear.length, 0, "animals never drop gear");
  assert.ok(l.tix > 0);
  materials += l.materials.length;
}
assert.ok(materials > 500 && materials < 2500, `some hides and fangs: ${materials}`);
const strongWolf = lootFor("wolf", "elite", 3, rng);
assert.deepEqual(strongWolf.materials.sort(), ["kiel", "skora"], "elite beasts always leave both materials");
let gear = 0, rare = 0;
for (let i = 0; i < 3000; i++) {
  const l = lootFor("person", "weak", 1, rng);
  assert.equal(l.materials.length, 0, "humanoids leave gear, not hides");
  gear += l.gear.length;
  rare += l.gear.filter(isValuable).length;
}
assert.ok(gear > 500 && gear < 1100, `weak humanoids drop gear about a quarter of the time: ${gear}`);
assert.ok(rare > 0 && rare < gear * 0.4, `rare+ is the minority: ${rare}/${gear}`);
for (let i = 0; i < 200; i++) {
  const b = lootFor("archer", "boss", 5, rng);
  assert.equal(b.gear.length, 2, "boss: two pieces");
  assert.ok(b.gear.every(isValuable), "boss: rare or better");
}
assert.equal(rollRarity("weak", 0.999), "common");
assert.equal(rollRarity("weak", 0.001), "legendary");
for (const t of [1, 5, 13, 35, 100]) {
  const parts = coinSplit(t);
  assert.equal(parts.reduce((a, b) => a + b, 0), t, `coins add up to ${t}`);
  assert.ok(parts.length >= 1 && parts.length <= 8);
}
const s = { serial: 0 };
const common = makeItem(s, 0, 1), epic = makeItem(s, 0, 1, "epic");
assert.equal(epic.power - common.power, RARITY_POWER.epic, "rarity raises power moderately");
assert.equal(epic.rarity, "epic");
const hide = makeMaterial(s, "skora", 2);
assert.equal(hide.slot, "material");
assert.equal(hide.icon, "hide");
console.log(`PASS: loot → animals tix + materials (${materials}/3000 kills), humanoids gear ${gear}/3000 (${rare} rare+), bosses two rare+ pieces, coins add up`);
