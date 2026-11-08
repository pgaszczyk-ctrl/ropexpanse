// Terrain: real Lublin elevations (Terrarium fixtures) become voxel terraces with steps
// of at most one voxel, flat water, exaggerated lowland relief.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { inflateSync } from "node:zlib";
import { Elevation, HeightField, limitSteps, voxelsFor, VOXEL, CELL } from "../../src/combat3d/terrain.ts";

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

assert.ok(voxelsFor(10) > 0 && voxelsFor(40) - voxelsFor(10) > voxelsFor(1000) - voxelsFor(970), "lowland relief stronger than mountain");
const v = new Int16Array([0, 9, 0, 0, 0, 0, 0, 0, 0]);
limitSteps(v, 3, 3);
assert.equal(v[1], 1, "a spike is lowered to one step");

const origin = { lat: 51.2482, lon: 22.5681 };
const el = new Elevation(decoder);
await el.ensure({ south: 51.23, west: 22.54, north: 51.27, east: 22.6 });
const ref = el.at(origin);
assert.ok(ref > 150 && ref < 240, `Lublin Old Town ${ref} m`);
const field = new HeightField();
const water = (p) => p.x > 60 && p.x < 80 && p.z > -10 && p.z < 10; // a test pond
assert.ok(field.build({ x: 0, z: 0 }, 120, origin, ref, el, water));
let maxStep = 0, min = Infinity, max = -Infinity;
for (let j = 0; j < field.w; j++)
  for (let i = 0; i < field.w; i++) {
    const a = field.v[j * field.w + i];
    min = Math.min(min, a); max = Math.max(max, a);
    if (i) maxStep = Math.max(maxStep, Math.abs(a - field.v[j * field.w + i - 1]));
    if (j) maxStep = Math.max(maxStep, Math.abs(a - field.v[(j - 1) * field.w + i]));
  }
assert.equal(maxStep <= 1, true, "neighbours differ by at most one voxel");
assert.ok(max - min >= 4, `visible relief in Lublin: ${min}..${max} voxels`);
const pond = new Set();
for (let x = 62; x < 80; x += CELL) for (let z = -8; z < 10; z += CELL) pond.add(field.voxel(x, z));
assert.equal(pond.size, 1, "water is flat");
assert.equal(field.at(0, 0) % VOXEL < 1e-9 || Math.abs((field.at(0, 0) / VOXEL) - Math.round(field.at(0, 0) / VOXEL)) < 1e-9, true);
// No data = flat world.
const none = new HeightField();
assert.equal(none.build({ x: 0, z: 0 }, 50, { lat: 10, lon: 10 }, 0, new Elevation(async () => null), () => false), false);
assert.equal(none.at(5, 5), 0);
console.log(`PASS: terrain → Lublin ${ref.toFixed(0)} m, terraces ${min}..${max} voxels, steps ≤ 1, flat water, flat world without data`);
