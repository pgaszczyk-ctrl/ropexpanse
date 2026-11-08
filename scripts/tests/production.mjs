// Circle production: rates from what OSM shows inside, growth while away, a 10-hour cap.
import assert from "node:assert/strict";
import { circleRates, workerRates, PER_CELL_HOUR, SAMPLE } from "../../src/combat3d/production.ts";
import { newCampaign, accrue, collect, parseCampaign, partyOf, toggleParty, PRODUCTION_CAP_HOURS } from "../../src/combat3d/campaign.ts";

const square = (x0, z0, s) => [{ x: x0, z: z0 }, { x: x0 + s, z: z0 }, { x: x0 + s, z: z0 + s }, { x: x0, z: z0 + s }];
const map = {
  origin: { lat: 0, lon: 0 }, scale: 0.18, radius: Infinity, buildings: [], roads: [],
  areas: [
    { rings: [square(0, 0, 40).map((p) => [p.x, p.z])], water: false, name: "", kind: "forest" },
    { rings: [square(100, 0, 40).map((p) => [p.x, p.z])], water: false, name: "", kind: "quarry" },
  ],
};
const forest = circleRates([square(0, 0, 40)], map, () => true);
assert.ok(forest.wood > forest.herbs && forest.herbs > 0 && forest.ore === 0, "forest: wood, some herbs");
const cells = (40 / SAMPLE) ** 2;
assert.ok(Math.abs(forest.wood + forest.herbs - cells * PER_CELL_HOUR) < 1e-6, "rate grows with area");
const quarry = circleRates([square(100, 0, 40)], map, () => true);
assert.ok(quarry.ore > 0 && quarry.wood === 0, "quarry: ore");
const town = circleRates([square(300, 0, 40)], map, () => true);
assert.ok(town.wood > 0 && town.wood < forest.wood / 5, "built-up ground: only a trickle");
assert.equal(circleRates([square(0, 0, 40)], map, () => false), null, "unknown ground keeps old rates");

const s = newCampaign({ x: 0, z: 0 }, { lat: 0, lon: 0 });
s.rates = { wood: 10, ore: 0, fiber: 2, herbs: 0 };
const t0 = 1_000_000_000_000;
accrue(s, t0);
assert.equal(accrue(s, t0 + 3 * 3_600_000), false);
assert.ok(Math.abs(s.pending.wood - 30) < 1e-6, "3 hours away = 3 hours of production");
assert.equal(accrue(s, t0 + 40 * 3_600_000), true, "becomes full");
assert.equal(s.pending.wood, 10 * PRODUCTION_CAP_HOURS, `capped at ${PRODUCTION_CAP_HOURS} h`);
accrue(s, t0); // clock moved back
assert.equal(s.pending.wood, 100, "a clock moved back adds nothing");
const wood = s.stock.wood;
assert.equal(collect(s).wood, 100);
assert.equal(s.stock.wood, wood + 100);
assert.equal(parseCampaign(JSON.stringify(s)).rates.wood, 10, "rates saved");
const bad = JSON.parse(JSON.stringify(s));
bad.pending.wood = -5;
assert.equal(parseCampaign(JSON.stringify(bad)), null);
// Camp folk: faster by matching ground, never zero; the ropemaker needs fibre.
const byForest = workerRates([{ role: "woodcutter", level: 1, at: { x: 20, z: 20 } }], map).wood;
const inTown = workerRates([{ role: "woodcutter", level: 1, at: { x: 300, z: 300 } }], map).wood;
assert.ok(byForest > 2 * inTown && inTown > 0, `woodcutter by forest ${byForest} vs town ${inTown}`);
assert.ok(workerRates([{ role: "miner", level: 1, at: { x: 120, z: 20 } }], map).ore > workerRates([{ role: "miner", level: 1, at: { x: 20, z: 20 } }], map).ore);
assert.ok(workerRates([{ role: "woodcutter", level: 1, at: { x: 20, z: 20 }, trait: "master" }], map).wood === 2 * byForest);
const r = newCampaign({ x: 0, z: 0 }, { lat: 0, lon: 0 });
r.rates = { rope: 10 };
r.stock.fiber = 3;
accrue(r, t0);
accrue(r, t0 + 5 * 3_600_000);
assert.equal(r.stock.fiber, 0, "fibre used up");
assert.equal(r.pending.rope, 15, "3 bundles → 15 m, no more");
// Camp folk never join the party.
const folk = { ...r.characters[0], id: "w1", name: "Drwal", role: "woodcutter" };
r.characters.push(folk);
assert.equal(toggleParty(r, "w1"), false);
r.party = [r.activeId, "w1"];
assert.deepEqual(partyOf(r), [r.activeId]);
console.log("PASS: camp folk work faster by matching ground, ropemaker needs fibre, camp folk stay out of the party");
console.log("PASS: circle production by OSM ground and area, growth while away, 10-hour cap, collect, save");
