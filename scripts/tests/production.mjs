// Circle production: rates from what OSM shows inside, growth while away, a 10-hour cap.
import assert from "node:assert/strict";
import { circleRates, PER_CELL_HOUR, SAMPLE } from "../../src/combat3d/production.ts";
import { newCampaign, accrue, collect, parseCampaign, PRODUCTION_CAP_HOURS } from "../../src/combat3d/campaign.ts";

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
console.log("PASS: circle production by OSM ground and area, growth while away, 10-hour cap, collect, save");
