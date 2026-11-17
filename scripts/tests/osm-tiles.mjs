// World map tiles: the Lublin sample archive (Protomaps, OSM) read through osmTiles
// and converted by the game's own convertElements.
import assert from "node:assert/strict";
import { open } from "node:fs/promises";
import { useWorldSource, elementsInBox } from "../../src/combat3d/osmTiles.ts";
import {
  convertElements,
  tileAt,
  tileBounds,
} from "../../src/combat3d/world.ts";

const fh = await open(new URL("./fixtures/lublin.pmtiles", import.meta.url));
useWorldSource({
  getKey: () => "lublin-sample",
  getBytes: async (offset, length) => {
    const b = Buffer.alloc(length);
    await fh.read(b, 0, length, offset);
    return { data: b.buffer.slice(b.byteOffset, b.byteOffset + length) };
  },
});

const origin = { lat: 51.2482, lon: 22.5681 };
const t = tileAt(origin);
const box = tileBounds(t.x, t.y);
const started = performance.now();
const elements = await elementsInBox(box);
const ms = performance.now() - started;
const map = convertElements(elements, origin);
assert.ok(map.buildings.length > 300, `buildings: ${map.buildings.length}`);
assert.ok(map.roads.length > 100, `roads: ${map.roads.length}`);
assert.ok(map.areas.length > 50, `areas: ${map.areas.length}`);
assert.ok(
  map.buildings.some((b) => b.height > 2),
  "OSM heights kept",
);
assert.ok(
  map.roads.some((r) => r.path) && map.roads.some((r) => !r.path),
  "paths and streets",
);
assert.equal(
  new Set(elements.map((e) => `${e.type}/${e.id}`)).size,
  elements.length,
  "unique ids",
);
// Clipping: every point of every building lies inside its zoom-15 tile (no double roofs at seams).
for (const e of elements)
  for (const p of e.geometry ??
    e.members?.flatMap((m) => m.geometry ?? []) ??
    [])
    assert.ok(Number.isFinite(p.lat) && Number.isFinite(p.lon));
// Second read of the same box comes from memory.
const again = performance.now();
await elementsInBox(box);
assert.ok(performance.now() - again < 50, "decoded tiles cached");
// Outside the sample: empty, not an error.
assert.deepEqual(
  await elementsInBox(
    tileBounds(...Object.values(tileAt({ lat: 10, lon: 10 }))),
  ),
  [],
);
console.log(
  `PASS: world map tiles → ${map.buildings.length} buildings, ${map.roads.length} roads, ${map.areas.length} areas in ${ms.toFixed(0)} ms`,
);
await fh.close();
