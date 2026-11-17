// Gathering spots: thick where OSM says (main source), rare elsewhere (fallback),
// deterministic, never in walls, and one of each good beside the first camp.
import assert from "node:assert/strict";
import { open } from "node:fs/promises";
import { useWorldSource, elementsInBox } from "../../src/combat3d/osmTiles.ts";
import { convertElements, tileAt, tileBounds, project } from "../../src/combat3d/world.ts";
import { resourceNodes, starterNodes, areaKindAt, primaryKinds, NODE_KINDS } from "../../src/combat3d/resources.ts";
import { circleBlocked } from "../../src/combat3d/rules.ts";

const fh = await open(new URL("./fixtures/lublin.pmtiles", import.meta.url));
useWorldSource({
  getKey: () => "lublin-sample",
  getBytes: async (o, l) => {
    const b = Buffer.alloc(l);
    await fh.read(b, 0, l, o);
    return { data: b.buffer.slice(b.byteOffset, b.byteOffset + l) };
  },
});
// Ogród Saski and its surroundings: park, grass and city blocks.
const origin = { lat: 51.2465, lon: 22.5455 };
const elements = [];
for (const [dy, dx] of [[0, 0], [1, 0], [0, 1], [1, 1], [-1, 0], [0, -1], [-1, -1], [1, -1], [-1, 1]]) {
  const t = tileAt({ lat: origin.lat + dy * 0.006, lon: origin.lon + dx * 0.009 });
  elements.push(...(await elementsInBox(tileBounds(t.x, t.y))));
}
const seen = new Map(elements.map((e) => [`${e.type}/${e.id}`, e]));
const map = convertElements([...seen.values()], origin);
const free = (p) => !map.buildings.some((b) => circleBlocked(p, 0.75, b.rings)) && !map.areas.some((a) => a.water && circleBlocked(p, 0.75, a.rings));
const center = { x: 0, z: 0 };
const nodes = resourceNodes(map, origin, origin, center, 70, free);
assert.ok(nodes.length > 15, `spots near Ogród Saski: ${nodes.length}`);
assert.deepEqual(resourceNodes(map, origin, origin, center, 70, free), nodes, "deterministic");
assert.ok(nodes.every(free), "never inside walls or water");
// Main sources: a spot on park/forest/grass ground is far more likely than one elsewhere.
const primary = nodes.filter((n) => n.primary), fallback = nodes.filter((n) => !n.primary);
assert.ok(primary.length > fallback.length, `primary ${primary.length} > fallback ${fallback.length}`);
for (const n of primary) assert.ok(primaryKinds(areaKindAt(map, n)).includes(n.kind), `${n.kind} fits its ground`);
// The same spot keeps its key wherever the origin of local coordinates moves.
const shifted = { lat: origin.lat + 0.002, lon: origin.lon };
const again = resourceNodes(convertElements([...seen.values()], shifted), shifted, origin, project(origin, shifted), 70, () => true);
const keys = new Set(again.map((n) => n.key));
assert.ok(nodes.filter((n) => keys.has(n.key)).length / nodes.length > 0.95, "keys stable across rebasing");
// Starter set: every good within 24 units (~130 m) of the first camp.
const start = starterNodes(center, free);
assert.deepEqual(start.map((n) => n.kind).sort(), [...NODE_KINDS].sort());
assert.ok(start.every((n) => Math.hypot(n.x, n.z) <= 24.5));
console.log(`PASS: gathering spots → ${nodes.length} near Ogród Saski (${primary.length} main, ${fallback.length} fallback), deterministic, stable keys, starter set of 4`);
await fh.close();
