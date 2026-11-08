// Haze vent lifecycle in the real game: walking close wakes a wave, beating it lets one
// blow drive in a stake with a lantern, which pays out and stays closed after a reload.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { preview } from "vite";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
await mkdir("work/vents", { recursive: true });
const server = await preview({ preview: { host: "127.0.0.1", port: 4180, strictPort: true } });
const browser = await chromium.launch({
  executablePath: process.env.BROWSER_EXECUTABLE,
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-gl=angle", "--use-angle=swiftshader"],
});
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.route("https://fonts.googleapis.com/**", (r) => r.fulfill({ status: 200, body: "" }));
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:4180/?qa=1");
  await page.waitForFunction(() => window.__combat3d?.snapshot().ready, null, { timeout: 60_000 });
  await page.click("#start");
  const snap = () => page.evaluate(() => window.__combat3d.snapshot());
  const vent = await page.evaluate(() => window.__combat3d.vent());
  await page.waitForTimeout(400);
  assert.equal((await snap()).vents.find((v) => v.key === "qa:vent").state, "idle");
  await page.screenshot({ path: "work/vents/idle.png" });
  // Walk up: the wave comes out.
  await page.evaluate(([x, z]) => window.__combat3d.face(x, z), [vent.x, vent.z]);
  await page.waitForFunction(() => window.__combat3d.snapshot().vents.find((v) => v.key === "qa:vent").state === "wave", null, { timeout: 5000 });
  const wave = (await snap()).enemies.filter((e) => e.key.startsWith("vent:qa:vent:") && e.state !== "dead");
  assert.ok(wave.length >= 4 && wave.length <= 9, `wave of ${wave.length}`);
  await page.screenshot({ path: "work/vents/wave.png" });
  // Beat the wave; a blow on the vent closes it.
  await page.evaluate(() => window.__combat3d.killWave());
  await page.waitForFunction(() => window.__combat3d.snapshot().vents.find((v) => v.key === "qa:vent").state === "ready", null, { timeout: 5000 });
  const before = await snap();
  await page.evaluate(([x, z]) => window.__combat3d.face(x, z), [vent.x, vent.z]);
  await page.keyboard.press("Space");
  await page.waitForFunction(() => window.__combat3d.snapshot().vents.find((v) => v.key === "qa:vent").state === "closed", null, { timeout: 5000 });
  const after = await snap();
  assert.ok(after.player.coins > before.player.coins, "chest gold");
  assert.ok(after.player.fragments > before.player.fragments, "haze shards");
  assert.ok(after.campaign.vents["qa:vent"] > 0, "saved as closed");
  // Dead wave creatures do not come back.
  await page.waitForTimeout(1500);
  assert.equal((await snap()).enemies.filter((e) => e.key.startsWith("vent:") && e.state !== "dead").length, 0);
  await page.screenshot({ path: "work/vents/closed.png" });
  // A Wayfarer in need: walking close brings the monsters around them; once beaten they join.
  const spot = await page.evaluate(() => window.__combat3d.rescue());
  const party0 = (await snap()).campaign.party?.length ?? 1;
  await page.evaluate(([x, z]) => window.__combat3d.face(x, z), [spot.x, spot.z]);
  await page.waitForFunction(() => window.__combat3d.snapshot().rescues.find((r) => r.key === "qa:rescue")?.state === "wave", null, { timeout: 5000 });
  assert.ok((await snap()).enemies.some((e) => e.key.startsWith("rescue:qa:rescue:") && e.state !== "dead"), "monsters around them");
  await page.screenshot({ path: "work/vents/rescue.png" });
  await page.evaluate(() => window.__combat3d.killWave());
  await page.waitForFunction(() => !window.__combat3d.snapshot().rescues.some((r) => r.key === "qa:rescue"), null, { timeout: 5000 });
  const saved = await snap();
  assert.equal(saved.campaign.characters.length, 2, "rescued Wayfarer joined for free");
  assert.equal(saved.campaign.party.length, party0 + 1, "and walks with the party");
  const newcomer = saved.campaign.characters.at(-1);
  assert.ok(newcomer.rarity && newcomer.trait && newcomer.name, "with rarity, trait and a local name");
  assert.ok(saved.campaign.rescued["qa:rescue"] > 0);
  assert.deepEqual(errors, []);
  console.log(`PASS: rescued ${newcomer.name} (${newcomer.role}, ${newcomer.rarity}) joined the party`);
  console.log(`PASS: haze vent wakes a wave of ${wave.length}, closes with one blow, pays ${after.player.coins - before.player.coins} gold + ${after.player.fragments - before.player.fragments} shards, stays closed`);
} finally {
  await browser.close();
  server.httpServer.close();
}
