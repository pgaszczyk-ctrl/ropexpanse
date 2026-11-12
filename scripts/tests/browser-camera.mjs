// Camera turn: keys and a two-finger twist turn it, it snaps to 45°, "up" always moves
// into the screen, the compass shows only off north and a tap returns north.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { preview } from "vite";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
await mkdir("work/camera", { recursive: true });
const server = await preview({ preview: { host: "127.0.0.1", port: 4188, strictPort: true } });
const browser = await chromium.launch({
  executablePath: process.env.BROWSER_EXECUTABLE,
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-gl=angle", "--use-angle=swiftshader"],
});
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.route("https://fonts.googleapis.com/**", (r) => r.fulfill({ status: 200, body: "" }));
  await page.route("**/elevation-tiles-prod/**", (r) => r.abort()); // offline, flat terrain
  await page.route("**/api.open-meteo.com/**", (r) => r.abort());
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:4188/?qa=1&weather=clear&time=day");
  await page.waitForFunction(() => window.__combat3d?.snapshot().ready, null, { timeout: 60_000 });
  await page.click("#start");
  const snap = () => page.evaluate(() => window.__combat3d.snapshot());
  const gameWait = async (sec) => {
    const t0 = (await snap()).time;
    await page.waitForFunction((t) => window.__combat3d.snapshot().time >= t, t0 + sec, { timeout: 120_000 });
  };
  await page.evaluate(() => window.__combat3d.fixture("empty"));
  assert.equal(await page.locator("#compass").isHidden(), true, "no compass facing north");
  await page.keyboard.press("Period");
  await gameWait(0.5);
  assert.ok(Math.abs((await snap()).cameraYaw - Math.PI / 4) < 1e-6, "turned 45°");
  assert.equal(await page.locator("#compass").isVisible(), true, "compass off north");
  await page.screenshot({ path: "work/camera/turned.png" });
  // W goes into the screen: with the camera turned 45° that is north-west in the world.
  const a = (await snap()).player;
  await page.keyboard.down("KeyW");
  await gameWait(0.4);
  await page.keyboard.up("KeyW");
  const b = (await snap()).player;
  const dx = b.x - a.x, dz = b.z - a.z;
  assert.ok(Math.hypot(dx, dz) > 0.5, "moved");
  assert.ok(Math.abs(Math.atan2(dx, dz) - Math.atan2(-Math.SQRT1_2, -Math.SQRT1_2)) < 0.35, `into the screen (${dx.toFixed(2)}, ${dz.toFixed(2)})`);
  await page.click("#compass");
  await gameWait(0.3);
  assert.equal((await snap()).cameraYaw, 0, "tap the compass: north again");
  // Two-finger twist on the map, then snap to the nearest 45°.
  await page.evaluate(() => {
    const c = document.getElementById("world");
    const fire = (type, id, x, y) => c.dispatchEvent(new PointerEvent(type, { pointerId: id, pointerType: "touch", clientX: x, clientY: y, bubbles: true }));
    fire("pointerdown", 11, 500, 400);
    fire("pointerdown", 12, 700, 400);
    fire("pointermove", 12, 500 + 200 * Math.cos(1.1), 400 + 200 * Math.sin(1.1)); // ~63° twist
    fire("pointerup", 12, 0, 0);
    fire("pointerup", 11, 0, 0);
  });
  await gameWait(0.3);
  const yaw = (await snap()).cameraYaw;
  assert.ok(Math.abs(Math.abs(yaw) - Math.PI / 4) < 1e-6 || Math.abs(Math.abs(yaw) - Math.PI / 2) < 1e-6, `twist snapped to 45° steps (${yaw})`);
  assert.deepEqual(errors, []);
  console.log("PASS: camera turns by keys and two-finger twist, snaps to 45°, W into the screen, compass off north returns north");
} finally {
  await browser.close();
  server.httpServer.close();
}
