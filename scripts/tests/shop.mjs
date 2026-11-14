// Inventory, shop and spells (owner, 14 Nov 2026): materials stack, the bag sorts,
// gear compares itself with what is worn; the camp merchant pays in tix, wood, rope or
// potions; potions are counted; every mage and herbalist keeps their own spell.
import assert from "node:assert/strict";
import {
  newCampaign,
  makeItem,
  makeMaterial,
  addItem,
  stackAll,
  sortItems,
  transfer,
  compareWorn,
  unequip,
  equip,
  countOf,
  potionsOf,
  parseCampaign,
  addWayfarer,
  BALANCE,
} from "../../src/combat3d/campaign.ts";
import { sell, sellPrice, payout, buyPotion, sellMaterials, SHOP } from "../../src/combat3d/shop.ts";
import { spellOf, MAGE_SPELLS, HEALER_ARTS, SPELLS } from "../../src/combat3d/spells.ts";
import { weaponSkill } from "../../src/combat3d/skills.ts";

const s = newCampaign({ x: 0, z: 0 }, { lat: 51.2, lon: 22.5 });
const c = s.characters[0];
assert.equal(potionsOf(c), 3, "a new hero carries 3 potions");
// Stacks: five hides take one place.
for (let i = 0; i < 5; i++) addItem(c.bag, makeMaterial(s, "skora"));
const hides = c.bag.filter((i) => i.kind === "mat-skora");
assert.equal(hides.length, 1);
assert.equal(countOf(hides[0]), 5);
addItem(c.bag, makeMaterial(s, "skora", 2));
assert.equal(c.bag.filter((i) => i.kind === "mat-skora").length, 2, "another tier is another stack");
// A full bag still takes a matching material, but no new gear.
const full = Array.from({ length: BALANCE.slots }, (_, i) => (i === 0 ? makeMaterial(s, "kiel") : makeItem(s, i)));
assert.ok(addItem(full, makeMaterial(s, "kiel"), BALANCE.slots));
assert.equal(countOf(full[0]), 2);
assert.equal(addItem(full, makeItem(s, 0), BALANCE.slots), false);
// Moving a stack to the Vault joins the Vault's stack.
s.vault.push({ ...makeMaterial(s, "skora"), count: 2 });
transfer(c.bag, s.vault, hides[0].id);
assert.equal(countOf(s.vault[0]), 7);
// Older saves with loose materials are merged on load.
const loose = stackAll([makeMaterial(s, "kiel"), makeMaterial(s, "kiel"), makeItem(s, 0)]);
assert.equal(loose.length, 2);
// Sorting: weapons first, best first, materials last.
const bag = [makeMaterial(s, "kiel"), makeItem(s, 4), makeItem(s, 0, 1, "common"), makeItem(s, 0, 1, "epic")];
sortItems(bag);
assert.deepEqual(bag.map((i) => [i.slot, i.rarity]), [["weapon", "epic"], ["weapon", "common"], ["boots", "common"], ["material", "common"]]);
// Comparison with what is worn.
c.bag = [makeItem(s, 0), makeItem(s, 5)]; // travel sword 4, guard sword 7
equip(c, c.bag[0].id);
const cmp = compareWorn(c, c.bag.find((i) => i.name === "Miecz strażnika"));
assert.equal(cmp.delta, 3);
assert.equal(compareWorn(c, makeMaterial(s, "kiel")), null);
assert.ok(unequip(c, "weapon"));
assert.equal(c.equipment.weapon, undefined);
assert.equal(c.weapon, "sword", "a warrior without a weapon still strikes");
// Shop: half the value, paid in tix, wood, rope or potions.
const sword = makeItem(s, 5); // value 260
assert.equal(sellPrice(sword), 130);
assert.equal(payout(130, "wood"), 26);
assert.equal(payout(130, "rope"), 260);
assert.equal(payout(130, "potions"), 3);
c.bag = [sword, makeItem(s, 5), makeItem(s, 5), makeItem(s, 5)];
const coins = c.coins,
  wood = s.stock.wood,
  rope = s.stock.rope;
assert.equal(sell(s, c, c.bag, c.bag[0].id, "tix"), 130);
assert.equal(c.coins, coins + 130);
sell(s, c, c.bag, c.bag[0].id, "wood");
assert.equal(s.stock.wood, wood + 26);
sell(s, c, c.bag, c.bag[0].id, "rope");
assert.equal(s.stock.rope, rope + 260);
sell(s, c, c.bag, c.bag[0].id, "potions");
assert.equal(potionsOf(c), 6);
assert.equal(c.bag.length, 0);
// Too cheap for a potion: nothing changes hands.
c.bag = [makeMaterial(s, "skora")];
assert.equal(sell(s, c, c.bag, c.bag[0].id, "potions"), 0);
assert.equal(c.bag.length, 1, "kept");
c.bag.push({ ...makeMaterial(s, "kiel"), count: 3 });
const before = c.coins;
assert.equal(sellMaterials(c), 4 + 18);
assert.equal(c.coins, before + 22);
assert.equal(c.bag.length, 0);
c.coins = SHOP.potionPrice;
assert.ok(buyPotion(c));
assert.equal(c.coins, 0);
assert.equal(buyPotion(c), false);
// Save round trip keeps stacks and potions; old saves get 3 potions.
const raw = JSON.parse(JSON.stringify(s));
delete raw.characters[0].potions;
raw.characters[0].bag = [makeMaterial(s, "kiel"), makeMaterial(s, "kiel")];
const back = parseCampaign(JSON.stringify(raw));
assert.ok(back);
assert.equal(back.characters[0].potions, 3);
assert.equal(back.characters[0].bag.length, 1);
assert.equal(countOf(back.characters[0].bag[0]), 2);
raw.characters[0].bag[0].count = 0;
assert.equal(parseCampaign(JSON.stringify(raw)), null, "a stack of zero is refused");
// Spells: every mage and herbalist has one of their school, the same each time.
const seen = new Set(),
  arts = new Set();
for (let i = 0; i < 60; i++) {
  const m = spellOf({ id: `hero-${i}`, role: "mage" });
  assert.ok(MAGE_SPELLS.includes(m));
  assert.equal(spellOf({ id: `hero-${i}`, role: "mage" }), m, "stable");
  seen.add(m);
  arts.add(spellOf({ id: `hero-${i}`, role: "herbalist" }));
}
assert.equal(seen.size, MAGE_SPELLS.length, "all six spells appear among mages");
assert.equal(arts.size, HEALER_ARTS.length, "all four healing arts appear");
assert.equal(spellOf({ id: "x", role: "warrior" }), null);
assert.equal(spellOf({ id: "x", role: "mage", spell: "meteor" }), "meteor");
// The skill button: a mage casts their own spell, a warrior with a staff a fireball.
assert.equal(weaponSkill({ id: "a", role: "mage", spell: "blizzard", equipment: {} }), "blizzard");
assert.equal(weaponSkill({ id: "a", role: "warrior", equipment: { weapon: makeItem(s, 1) } }), "fireball");
assert.equal(weaponSkill({ id: "a", role: "herbalist", spell: "bark", equipment: {} }), "bark");
for (const id of [...MAGE_SPELLS, ...HEALER_ARTS]) assert.ok(SPELLS[id].name && SPELLS[id].cooldown > 0);
// A hired Wayfarer keeps the spell shown in the notice.
const hired = addWayfarer(s, { id: "cand-7", name: "Bogna", role: "mage", appearance: 1, level: 2 }, { x: 0, z: 0 }, "camp-1");
assert.equal(hired.spell, spellOf({ id: "cand-7", role: "mage" }));
assert.equal(potionsOf(hired), 1);
console.log(`PASS: inventory stacks, sort, compare; shop pays tix/wood/rope/potions; ${seen.size} spells, ${arts.size} healing arts`);
