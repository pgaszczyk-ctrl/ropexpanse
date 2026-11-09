import assert from "node:assert/strict";
import {
  inArc,
  circleBlocked,
  segmentHitsCircle,
  deathExperience,
} from "../../src/combat3d/rules.ts";
const p = { x: 0, z: 0 };
assert(inArc(p, { x: 0, z: 2 }, 0, 3, 0.8));
assert(
  !inArc(p, { x: 0, z: -2 }, 0, 3, 0.8),
  "targets behind the blade are not hit",
);
assert(!inArc(p, { x: 0, z: 5 }, 0, 3, 0.8), "range is finite");
assert(
  inArc(p, { x: -0.05, z: -2 }, Math.PI - 0.03, 3, 0.8),
  "arc wraps around pi",
);
const rings = [
  [
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10],
    [0, 0],
  ],
  [
    [3, 3],
    [7, 3],
    [7, 7],
    [3, 7],
    [3, 3],
  ],
];
assert(circleBlocked({ x: 1, z: 1 }, 0.4, rings));
assert(!circleBlocked({ x: 5, z: 5 }, 0.4, rings), "courtyards remain open");
assert(
  circleBlocked({ x: -0.2, z: 5 }, 0.4, rings),
  "body radius blocks the wall before its centre enters",
);
assert(
  segmentHitsCircle({ x: 0, z: 0 }, { x: 10, z: 0 }, { x: 5, z: 0 }, 0.5),
  "fast projectiles cannot tunnel through a target",
);
assert(
  !segmentHitsCircle({ x: 0, z: 0 }, { x: 10, z: 0 }, { x: 5, z: 2 }, 0.5),
);
assert.equal(deathExperience(90), 87);
assert.equal(deathExperience(120), 120, "death cannot remove an earned level");
console.log(
  "PASS: melee arcs, range, courtyards, wall clearance, swept projectiles and death XP",
);
const geo = await import("../../src/combat3d/geo.ts");
const { segmentHitsPolygon, onScreen } = await import("../../src/combat3d/rules.ts");
{
  // A square crossing the right edge of a 0..10 box is cut along it and stays closed.
  const c = geo.clipRing([[8, 2], [14, 2], [14, 6], [8, 6], [8, 2]], 0, 0, 10, 10);
  assert.deepEqual(c[0], c[c.length - 1], "clipped ring is closed");
  assert(c.every(([x]) => x <= 10), "nothing outside the tile");
  assert.equal(Math.abs(geo.ringArea(c)), 8, "clipped area is the part inside");
  assert.equal(geo.clipRing([[12, 2], [14, 2], [14, 6], [12, 2]], 0, 0, 10, 10), null);
  const p = geo.projection();
  assert(Math.abs(p.x(p.lon(123.4)) - 123.4) < 1e-9 && Math.abs(p.z(p.lat(-55)) + 55) < 1e-9, "projection round trip");
  // Tiles touching a 2.5 km circle cover its whole square and start with the one underfoot.
  const r = 2500 * geo.SCALE,
    tiles = geo.tilesAround(15, -13, r, p);
  assert(tiles.length >= 9 && tiles.length <= 25);
  assert(geo.rectDistance(tiles[0].rect, 15, -13) === 0, "nearest tile first");
  for (const [x, z] of [[15 + r * 0.7, -13], [15, -13 - r * 0.7], [15 - r * 0.7, -13 + r * 0.7 * 0]])
    assert(tiles.some((t) => geo.rectDistance(t.rect, x, z) === 0), "circle is covered");
  // Neighbouring tiles share their edges exactly, so collision has no seams.
  const a = geo.tileRect(9219, 5466, p), b = geo.tileRect(9220, 5466, p);
  assert.equal(a.x1, b.x0);
  assert.equal(geo.buildingHeight(3), 2.35);
  assert(geo.buildingHeight(80) <= 6.8, "towers stay readable");
}
{
  const square = [[[0, 0], [4, 0], [4, 4], [0, 4], [0, 0]]];
  assert(segmentHitsPolygon({ x: -1, z: 2 }, { x: 5, z: 2 }, square), "line through a building");
  assert(segmentHitsPolygon({ x: 1, z: 1 }, { x: 1, z: 2 }, square), "line inside a building");
  assert(!segmentHitsPolygon({ x: -1, z: 5 }, { x: 5, z: 5 }, square), "line beside a building");
  assert(onScreen(0.5, -0.9) && !onScreen(1.3, 0));
}
console.log("PASS: tile clipping, projection, tile coverage, building fade lines and on-screen test");
