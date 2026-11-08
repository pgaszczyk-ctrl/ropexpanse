// Terrain: real Lublin elevations (Terrarium fixtures) become gentle rolling ground:
// continuous heights (no terrace steps), limited slope, flat water, a swell that calms
// down at roads, exaggerated lowland relief.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { inflateSync } from "node:zlib";
import { Elevation, HeightField, limitSlope, heightFor, swell, MAX_RISE, CELL } from "../../src/combat3d/terrain.ts";

// Minimal PNG decoder (8-bit RGB/RGBA, all five filters) for the test fixtures.
function decodePng(buf) {
  let p = 8, w = 0, h = 0, type = 0;
  const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), kind = buf.toString("ascii", p + 4, p + 8), data = buf.subarray(p + 8, p + 8 + len);
    if (kind === "IHDR") { w = data.readUInt32BE(0); h = data.readUInt32BE(4); type = data[9]; }
    if (kind === "IDAT") idat.push(data);
    p += 12 + len;
  }
  const bpp = type === 6 ? 4 : 3, raw = inflateSync(Buffer.concat(idat)), stride = w * bpp, out = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? out[y * stride + x - bpp] : 0, b = y ? out[(y - 1) * stride + x] : 0, c = x >= bpp && y ? out[(y - 1) * stride + x - bpp] : 0;
      const pa = Math.abs(b - c), pb = Math.abs(a - c), pc = Math.abs(a + b - 2 * c);
      const pred = [0, a, b, (a + b) >> 1, pa <= pb && pa <= pc ? a : pb <= pc ? b : c][f];
      out[y * stride + x] = (line[x] + pred) & 255;
    }
  }
  const m = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) m[i] = out[i * bpp] * 256 + out[i * bpp + 1] + out[i * bpp + 2] / 256 - 32768;
  return m;
}
const decoder = async (url) => {
  const k = url.split("/").slice(-3).join("/");
  try { return decodePng(await readFile(new URL(`./fixtures/terrarium/${k}`, import.meta.url))); } catch { return null; }
};

assert.ok(heightFor(10) > 0 && heightFor(40) - heightFor(10) > heightFor(1000) - heightFor(970), "lowland relief stronger than mountain");
const v = new Float32Array([0, 9, 0, 0, 0, 0, 0, 0, 0]);
limitSlope(v, 3, 3);
assert.ok(Math.abs(v[1] - MAX_RISE) < 1e-6, "a spike is lowered to the steepest walkable rise");
let sw = 0;
for (let k = 0; k < 200; k++) sw = Math.max(sw, Math.abs(swell(k * 37.1, k * 11.3)));
assert.ok(sw <= 1 && sw > 0.2, "swell stays in [-1, 1] and is not flat");
assert.equal(swell(1234.5, 678.9), swell(1234.5, 678.9), "swell is deterministic");

const origin = { lat: 51.2482, lon: 22.5681 };
const el = new Elevation(decoder);
await el.ensure({ south: 51.23, west: 22.54, north: 51.27, east: 22.6 });
const ref = el.at(origin);
assert.ok(ref > 150 && ref < 240, `Lublin Old Town ${ref} m`);
const field = new HeightField();
const water = (p) => p.x > 60 && p.x < 80 && p.z > -10 && p.z < 10; // a test pond
const road = { pts: [[-100, -40], [100, -40]], width: 2 };
assert.ok(field.build({ x: 0, z: 0 }, 120, origin, ref, el, water, { roads: [road], buildings: [] }));
let maxRise = 0, min = Infinity, max = -Infinity, fractional = 0;
for (let j = 0; j < field.w; j++)
  for (let i = 0; i < field.w; i++) {
    const a = field.v[j * field.w + i];
    min = Math.min(min, a); max = Math.max(max, a);
    if (Math.abs(a / 0.6 - Math.round(a / 0.6)) > 0.05) fractional++;
    if (i) maxRise = Math.max(maxRise, Math.abs(a - field.v[j * field.w + i - 1]));
    if (j) maxRise = Math.max(maxRise, Math.abs(a - field.v[(j - 1) * field.w + i]));
  }
assert.ok(maxRise <= MAX_RISE + 1e-4, `slope limited: ${maxRise.toFixed(3)} per cell`);
assert.ok(fractional > field.w * field.w * 0.5, "heights are continuous, not whole terrace steps");
assert.ok(max - min >= 2, `visible relief in Lublin: ${min.toFixed(2)}..${max.toFixed(2)}`);
// Walking along a line, height changes smoothly (no step jumps between samples).
let jump = 0;
for (let x = -60; x < 60; x += 0.25) jump = Math.max(jump, Math.abs(field.at(x + 0.25, 20) - field.at(x, 20)));
assert.ok(jump < 0.1, `no steps while walking: max ${jump.toFixed(3)} per 0.25`);
const pond = new Set();
for (let x = 64; x < 78; x += CELL) for (let z = -6; z < 8; z += CELL) pond.add(field.at(x, z).toFixed(4));
assert.equal(pond.size, 1, "water is flat");
assert.ok(field.at(0, 0) >= field.waterLevel, "dry land not under water");
// Same build without the road: the swell differs only away from the road.
const wild = new HeightField();
wild.build({ x: 0, z: 0 }, 120, origin, ref, el, water, { roads: [], buildings: [] });
let nearRoad = 0, farRoad = 0;
for (let x = -50; x < 50; x += 4) {
  nearRoad = Math.max(nearRoad, Math.abs(field.at(x, -40) - wild.at(x, -40)));
}
assert.ok(nearRoad > 0, "road calms the swell");
// No data = flat world.
const none = new HeightField();
assert.equal(none.build({ x: 0, z: 0 }, 50, { lat: 10, lon: 10 }, 0, new Elevation(async () => null), () => false), false);
assert.equal(none.at(5, 5), 0);
console.log(`PASS: terrain → Lublin ${ref.toFixed(0)} m, smooth ground ${min.toFixed(2)}..${max.toFixed(2)}, max rise ${maxRise.toFixed(2)}/cell, step ${jump.toFixed(3)}, flat water, flat world without data`);
