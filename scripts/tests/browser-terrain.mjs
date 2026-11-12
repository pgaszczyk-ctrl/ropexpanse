// Terrain in the real game: Lublin's real heights (Terrarium fixtures) give gentle rolling
// ground with no steps, the party walks on it smoothly, buildings stay seated; trees keep
// their places across redraws and the world is not redrawn while standing still.
// Screenshots (computer + phone landscape) in work/terrain/.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, readFile } from "node:fs/promises";
import { preview } from "vite";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
await mkdir("work/terrain", { recursive: true });
const server = await preview({ preview: { host: "127.0.0.1", port: 4191, strictPort: true } });
const browser = await chromium.launch({
  executablePath: process.env.BROWSER_EXECUTABLE,
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-gl=angle", "--use-angle=swiftshader"],
});
try {
  for (const [name, viewport] of [["komputer", { width: 1280, height: 800 }], ["telefon", { width: 844, height: 390 }]]) {
    const page = await browser.newPage({ viewport, ...(name === "telefon" ? { isMobile: true, hasTouch: true, deviceScaleFactor: 1 } : {}) });
    await page.route("https://fonts.googleapis.com/**", (r) => r.fulfill({ status: 200, body: "" }));
    await page.route("**/api.open-meteo.com/**", (r) => r.abort());
    await page.route("**/elevation-tiles-prod/**", async (r) => {
      const k = new URL(r.request().url()).pathname.split("/").slice(-3).join("/");
      try {
        r.fulfill({ status: 200, contentType: "image/png", body: await readFile(new URL(`./fixtures/terrarium/${k}`, import.meta.url)) });
      } catch {
        r.fulfill({ status: 404, body: "" });
      }
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("http://127.0.0.1:4191/?qa=1&weather=clear&time=day");
    await page.waitForFunction(() => window.__combat3d?.snapshot().ready, null, { timeout: 60_000 });
    await page.click("#start");
    await page.waitForFunction(() => window.__combat3d.snapshot().terrain?.cells > 0, null, { timeout: 90_000 });
    const snap = () => page.evaluate(() => window.__combat3d.snapshot());
    const t = (await snap()).terrain;
    assert.ok(t.max - t.min > 1, `relief visible: ${t.min.toFixed(2)}..${t.max.toFixed(2)}`);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `work/terrain/${name}.png` });
    // Standing still: no redraws (they swapped every tree before).
    const r0 = (await snap()).renders;
    await page.waitForTimeout(4000);
    assert.equal((await snap()).renders, r0, "no redraw while standing still");
    const before = new Set((await snap()).trees);
    assert.ok(before.size > 5, `trees around: ${before.size}`);
    // Walk east: the hero's height changes in small steps (no terrace jumps).
    const ys = [];
    await page.keyboard.down("KeyD");
    for (let k = 0; k < 20; k++) {
      ys.push((await snap()).terrain.here);
      await page.waitForTimeout(80);
    }
    await page.keyboard.up("KeyD");
    let jump = 0;
    for (let k = 1; k < ys.length; k++) jump = Math.max(jump, Math.abs(ys[k] - ys[k - 1]));
    assert.ok(jump < 0.35, `smooth walk, biggest change ${jump.toFixed(3)}`);
    // Far enough for the heights to rebuild: the world is redrawn, the trees stay put.
    const s0 = await snap();
    await page.evaluate(({ x, z }) => window.__combat3d.moveTo(x + 60, z), s0.player);
    await page.waitForFunction((r) => window.__combat3d.snapshot().renders > r, s0.renders, { timeout: 60_000 });
    await page.waitForTimeout(1500);
    const after = (await snap()).trees;
    const p1 = (await snap()).player;
    // Trees visible both times (inside both squares) must be identical.
    const inBoth = (t) => { const [x, z] = t.split(",").map(Number); return Math.abs(x - s0.player.x) < 90 && Math.abs(z - s0.player.z) < 90 && Math.abs(x - p1.x) < 90 && Math.abs(z - p1.z) < 90; };
    const a = [...before].filter(inBoth).sort(), b = after.filter(inBoth).sort();
    assert.ok(a.length > 3, `shared trees: ${a.length}`);
    assert.deepEqual(b, a, "trees keep their places after a redraw");
    await page.screenshot({ path: `work/terrain/${name}-po-marszu.png` });
    assert.deepEqual(errors, [], "no page errors");
    await page.close();
    console.log(`PASS: terrain ${name} → relief ${t.min.toFixed(2)}..${t.max.toFixed(2)}, walk step ≤ ${jump.toFixed(3)}, trees stay put, no idle redraws`);
  }
} finally {
  await browser.close();
  await server.close();
}
