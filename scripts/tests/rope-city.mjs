// Rope on a city-sized map: the report of 11 Nov 2026 showed 3–4 s frames while the hero
// pulled a rope across 25 tiles (6699 buildings). Every step must stay cheap.
import assert from "node:assert/strict";
import { open } from "node:fs/promises";
import { useWorldSource, elementsInBox } from "../../src/combat3d/osmTiles.ts";
import { convertElements, tileAt, tileBounds, project } from "../../src/combat3d/world.ts";
import { updateRope, routeLength, segmentClear } from "../../src/combat3d/rope.ts";
import { circleBlocked } from "../../src/combat3d/rules.ts";

const fh = await open(new URL("./fixtures/lublin.pmtiles", import.meta.url));
useWorldSource({
  getKey: () => "lublin-sample",
  getBytes: async (offset, length) => {
    const b = Buffer.alloc(length);
    await fh.read(b, 0, length, offset);
    return { data: b.buffer.slice(b.byteOffset, b.byteOffset + length) };
  },
});
const origin = { lat: 51.2482, lon: 22.5681 },
  t = tileAt(origin),
  elements = new Map();
for (let dx = -2; dx <= 2; dx++)
  for (let dy = -2; dy <= 2; dy++)
    for (const e of await elementsInBox(tileBounds(t.x + dx, t.y + dy))) elements.set(`${e.type}/${e.id}`, e);
const map = convertElements([...elements.values()], origin);
assert.ok(map.buildings.length > 3000, `a city block of buildings: ${map.buildings.length}`);
const boxes = map.buildings.map((b) => {
  const xs = b.rings[0].map((p) => p[0]),
    zs = b.rings[0].map((p) => p[1]);
  return [Math.min(...xs) - 1, Math.max(...xs) + 1, Math.min(...zs) - 1, Math.max(...zs) + 1];
});
const free = (p, r = 0.45) =>
  !map.buildings.some((b, i) => {
    const q = boxes[i];
    return p.x > q[0] && p.x < q[1] && p.z > q[2] && p.z < q[3] && circleBlocked(p, r, b.rings);
  });
// A real walk: the shortest way over free ground from the camp to places a few hundred
// metres away (grid search), taken in the game's small steps.
const R = 110,
  N = 2 * R + 1,
  walkable = new Uint8Array(N * N);
for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) walkable[j * N + i] = free({ x: i - R, z: j - R }, 0.75) ? 1 : 0;
function walkTo(from, goal) {
  const start = Math.round(from.z + R) * N + Math.round(from.x + R),
    prev = new Int32Array(N * N).fill(-1),
    queue = [start];
  prev[start] = start;
  let best = start,
    bestD = Infinity;
  for (let h = 0; h < queue.length; h++) {
    const k = queue[h],
      i = k % N,
      j = (k - i) / N,
      d = Math.hypot(i - R - goal.x, j - R - goal.z);
    if (d < bestD) (bestD = d), (best = k);
    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const ni = i + di,
        nj = j + dj,
        n = nj * N + ni;
      if (ni < 0 || nj < 0 || ni >= N || nj >= N || !walkable[n] || prev[n] >= 0) continue;
      prev[n] = k;
      queue.push(n);
    }
  }
  const path = [];
  for (let k = best; k !== start; k = prev[k]) path.unshift({ x: (k % N) - R, z: Math.floor(k / N) - R });
  return path;
}
let at = { x: 0, z: 0 };
search: for (let r = 0; ; r++)
  for (let a = 0; a < 6.3; a += 0.3) {
    at = { x: Math.round(Math.sin(a) * r), z: Math.round(Math.cos(a) * r) };
    // Not a closed courtyard: the camp must reach the streets.
    if (walkable[(at.z + R) * N + at.x + R] && walkTo(at, { x: 95, z: -95 }).length > 80) break search;
  }
let rope = [{ ...at }, { ...at }],
  worst = 0,
  total = 0,
  steps = 0,
  refused = 0;
const times = [];
for (const goal of [{ x: 95, z: -95 }, { x: -90, z: 60 }, { x: 80, z: 90 }])
  for (const cell of walkTo(at, goal))
    while (Math.hypot(cell.x - at.x, cell.z - at.z) > 0.05) {
      const d = Math.hypot(cell.x - at.x, cell.z - at.z),
        next = { x: at.x + ((cell.x - at.x) / d) * Math.min(d, 0.11), z: at.z + ((cell.z - at.z) / d) * Math.min(d, 0.11) };
      const t0 = performance.now(),
        points = updateRope(rope, next, map.buildings),
        ms = performance.now() - t0;
      times.push(ms);
      if (process.env.ROPE_TRACE && ms > 30) console.log("slow", ms.toFixed(0), "ms at step", steps, "rope points", rope.length, points ? "ok" : "refused");
      worst = Math.max(worst, ms);
      total += ms;
      steps++;
      at = next;
      if (points) rope = points;
      else refused++;
    }
// Pushing into a wall (the hero's centre never gets nearer than his radius, but the
// game asks for the step every frame).
let wallAt = null;
for (let i = 0; i < 400 && !wallAt; i++) {
  const p = { x: at.x + i * 0.05, z: at.z };
  if (!free(p, 0.02)) wallAt = p;
}
if (wallAt)
  for (let i = 0; i < 50; i++) {
    const t0 = performance.now();
    updateRope(rope, wallAt, map.buildings);
    const ms = performance.now() - t0;
    worst = Math.max(worst, ms);
  }
times.sort((a, b) => a - b);
for (let i = 1; i < rope.length; i++)
  assert(segmentClear(rope[i - 1], rope[i], map.buildings), "rope never crosses a wall");
assert.ok(steps > 3000, `walked ${steps} steps`);
assert.ok(refused < steps / 50, `rope followed the walk (${refused} refused steps)`);
assert.ok(rope.length > 2, "the rope wrapped around buildings");
console.log(
  `PASS: rope on a city map (${map.buildings.length} buildings): ${steps} steps, mean ${(total / steps).toFixed(2)} ms, 99th percentile ${times[Math.floor(times.length * 0.99)].toFixed(2)} ms, worst ${worst.toFixed(1)} ms, length ${routeLength(rope).toFixed(0)}, ${rope.length} points`,
);
if (!process.env.ROPE_BENCH_ONLY) {
  assert.ok(total / steps < 2, `mean step ${(total / steps).toFixed(2)} ms`);
  assert.ok(worst < 60, `worst step ${worst.toFixed(1)} ms`);
}
await fh.close();
