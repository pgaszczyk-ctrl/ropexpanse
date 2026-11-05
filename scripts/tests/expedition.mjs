import assert from "node:assert/strict";
import {
  newCampaign,
  activeCharacter,
  makeItem,
  equip,
  transfer,
  postOffer,
  resolveOffers,
  hire,
  cancelOffer,
  parseCampaign,
  levelOf,
  xpThreshold,
  loseXp,
  BALANCE,
} from "../../src/combat3d/campaign.ts";
import {
  updateRope,
  segmentClear,
  routeLength,
} from "../../src/combat3d/rope.ts";
import {
  project,
  unproject,
  tileAt,
  convertElements,
  WorldStream,
} from "../../src/combat3d/world.ts";
const origin = { lat: 51.2482, lon: 22.5681 };
const s = newCampaign({ x: 0, z: 0 }, origin),
  c = activeCharacter(s);
c.coins = 1000;
c.exp = xpThreshold(5);
s.camps[0].buildings = 12;
assert.equal(levelOf(xpThreshold(5)), 5);
assert.equal(levelOf(xpThreshold(5) - 1), 4);
assert(xpThreshold(6) - xpThreshold(5) > xpThreshold(3) - xpThreshold(2));
assert(loseXp(xpThreshold(5) + 100) >= xpThreshold(5));
const sword = c.bag[0];
assert(equip(c, sword.id));
assert.equal(c.equipment.weapon.id, sword.id);
assert(!c.bag.some((v) => v.id === sword.id));
const better = makeItem(s, 5);
c.bag.push(better);
assert(equip(c, better.id));
assert(c.bag.some((v) => v.id === sword.id));
assert(transfer(c.bag, s.vault, sword.id));
assert(
  !transfer(c.bag, s.vault, sword.id),
  "transfers cannot duplicate ownership",
);
const offered = c.bag[0];
const offer = postOffer(s, "camp-1", 700, [offered.id], 1000);
assert(offer);
assert.equal(c.coins, 300);
assert(!c.bag.some((v) => v.id === offered.id));
assert(!postOffer(s, "camp-1", 1, [], 2000), "one pending offer per camp");
assert(!resolveOffers(s, 1000 + BALANCE.recruitmentMs - 1));
assert(resolveOffers(s, 1000 + BALANCE.recruitmentMs));
assert(offer.candidates.length >= 2);
assert(offer.candidates.every((v) => v.level <= 5));
const candidates = JSON.stringify(offer.candidates);
const restored = parseCampaign(JSON.stringify(s));
assert(restored);
assert.equal(
  JSON.stringify(restored.offers[0].candidates),
  candidates,
  "reload keeps candidates",
);
const recruit = hire(s, offer.id, offer.candidates[0].id);
assert(recruit);
assert.equal(s.characters.length, 2);
assert.equal(s.offers.length, 0);
assert.equal(c.coins, 300);
assert(!hire(s, offer.id, "anything"), "offer can be consumed only once");
const cancelled = postOffer(s, "camp-1", 100, [], 4000);
assert(cancelled);
assert(cancelOffer(s, cancelled.id));
assert.equal(s.bank, 100);
assert(!cancelOffer(s, cancelled.id));
assert.equal(s.bank, 100);
const corrupted = JSON.parse(JSON.stringify(s));
corrupted.vault.push(corrupted.characters[0].bag[0]);
assert.equal(
  parseCampaign(JSON.stringify(corrupted)),
  null,
  "duplicate item graph rejected",
);
const snap = JSON.stringify(s);
assert(parseCampaign(snap));
assert(!postOffer(s, "camp-1", -1, []));
assert(!postOffer(s, "camp-1", NaN, []));
assert(!postOffer(s, "camp-1", 1, [c.bag[0].id, c.bag[0].id]));
const wall = {
  rings: [
    [
      [2, -1],
      [4, -1],
      [4, 1],
      [2, 1],
      [2, -1],
    ],
  ],
};
assert(!segmentClear({ x: 0, z: 0 }, { x: 6, z: 0 }, [wall]));
assert(segmentClear({ x: 0, z: 2 }, { x: 6, z: 2 }, [wall]));
let rope = [
  { x: 0, z: 0 },
  { x: 0, z: 0 },
];
for (const p of [
  { x: 1, z: 0 },
  { x: 1, z: 2 },
  { x: 3, z: 2 },
  { x: 5, z: 2 },
  { x: 6, z: 0 },
]) {
  rope = updateRope(rope, p, [wall]);
  assert(rope);
  for (let i = 1; i < rope.length; i++)
    assert(
      segmentClear(rope[i - 1], rope[i], [wall]),
      "every rope segment stays outside walls",
    );
}
assert(routeLength(rope) > 6, "wrapped route includes detour");
for (const p of [
  { x: 5, z: 2 },
  { x: 3, z: 2 },
  { x: 1, z: 2 },
  { x: 1, z: 0 },
])
  rope = updateRope(rope, p, [wall]);
assert.equal(rope.length, 2, "rope unwraps after returning");
assert.equal(
  updateRope(
    [
      { x: 0, z: 0 },
      { x: 0, z: 0 },
    ],
    { x: 3, z: 0 },
    [wall],
  ),
  null,
  "cannot attach rope inside building",
);
for (const geo of [
  { lat: 1.35, lon: 103.82 },
  { lat: -33.86, lon: 151.2 },
  { lat: 89.99, lon: 179.999 },
  { lat: -89.99, lon: -179.999 },
]) {
  const p = project(geo, origin),
    back = unproject(p, origin);
  assert(Math.abs(back.lat - geo.lat) < 1e-7);
  assert(Math.abs(back.lon - geo.lon) < 1e-7);
}
assert.equal(
  tileAt({ lat: 0, lon: 180 }).x,
  tileAt({ lat: 0, lon: -180 }).x,
  "dateline uses canonical tile",
);
const geometry = [
  { lat: 0, lon: 0 },
  { lat: 0, lon: 0.001 },
  { lat: 0.001, lon: 0.001 },
  { lat: 0.001, lon: 0 },
  { lat: 0, lon: 0 },
];
const converted = convertElements(
  [
    {
      type: "way",
      id: 1,
      tags: { building: "yes", "building:levels": "2" },
      geometry,
    },
    {
      type: "way",
      id: 2,
      tags: { highway: "footway" },
      geometry: geometry.slice(0, 2),
    },
  ],
  { lat: 0, lon: 0 },
);
assert.equal(converted.buildings.length, 1);
assert.equal(converted.roads.length, 1);
assert(converted.buildings[0].height > 0);
const relation = convertElements(
  [
    {
      type: "relation",
      id: 3,
      tags: { building: "yes" },
      members: [
        { type: "way", role: "outer", geometry: geometry.slice(0, 3) },
        { type: "way", role: "outer", geometry: geometry.slice(2) },
      ],
    },
  ],
  { lat: 0, lon: 0 },
);
assert.equal(
  relation.buildings.length,
  1,
  "split multipolygon rings are stitched",
);
// Mock network at the boundary, exercise the real streaming/cache state machine.
let calls = 0;
globalThis.fetch = async () => {
  calls++;
  return { ok: true, json: async () => ({ elements: [] }) };
};
const stream = new WorldStream({ lat: 0, lon: 179.999 });
assert(!stream.contains({ x: 0, z: 0 }));
await stream.load({ x: 0, z: 0 });
assert(stream.contains({ x: 0, z: 0 }));
assert(stream.tiles.size>=1);
assert(calls>=1);
stream.snapshot();
assert(!stream.changed);
const failed = new WorldStream({ lat: 20, lon: 20 });
globalThis.fetch = async () => {
  throw Error("offline");
};
await assert.rejects(failed.load({ x: 0, z: 0 }));
assert(!failed.contains({ x: 0, z: 0 }), "failed tiles are never traversable");
failed.request({ x: 0, z: 0 });
assert(failed.error);
console.log(
  "PASS: inventory ownership, escrow, deterministic recruitment, hire/cancel, save validation, XP curve, rope wrapping/unwrapping, world projection, multipolygons, streaming failure",
);
