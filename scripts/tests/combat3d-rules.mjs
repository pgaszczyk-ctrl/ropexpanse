import assert from "node:assert/strict";
import {
  inArc,
  circleBlocked,
  segmentHitsCircle,
  deathExperience,
  rollDamage,
  MISS_CHANCE,
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

// Blows vary: ±30% around the base and about one in ten misses.
{
  let seed = 7;
  const rand = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) | 0) >>> 0) / 4294967296;
  const hits = [];
  let misses = 0;
  for (let i = 0; i < 5000; i++) {
    const d = rollDamage(16, MISS_CHANCE, rand);
    if (d) hits.push(d);
    else misses++;
  }
  assert(Math.min(...hits) >= 11 && Math.max(...hits) <= 21, `range ${Math.min(...hits)}..${Math.max(...hits)}`);
  assert(new Set(hits).size >= 9, "many different values, not always 16");
  assert(Math.abs(misses / 5000 - MISS_CHANCE) < 0.02, `miss rate ${misses / 5000}`);
  assert.equal(rollDamage(1, 0, () => 0), 1, "a hit is at least 1");
  console.log(`PASS: hit rolls 16 → ${Math.min(...hits)}..${Math.max(...hits)}, misses ${(misses / 50).toFixed(1)}%`);
}
