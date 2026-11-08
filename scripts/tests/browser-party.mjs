// Party of three: companions follow the leader, fight on their own, can be the enemy's
// target (a warrior draws it), go down instead of dying and stand up after the fight;
// the leader can take control of a companion.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { preview } from "vite";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
await mkdir("work/party", { recursive: true });
const server = await preview({ preview: { host: "127.0.0.1", port: 4183, strictPort: true } });
const browser = await chromium.launch({
  executablePath: process.env.BROWSER_EXECUTABLE,
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-gl=angle", "--use-angle=swiftshader"],
});
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.route("https://fonts.googleapis.com/**", (r) => r.fulfill({ status: 200, body: "" }));
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:4183/?qa=1");
  await page.waitForFunction(() => window.__combat3d?.snapshot().ready, null, { timeout: 60_000 });
  await page.click("#start");
  const snap = () => page.evaluate(() => window.__combat3d.snapshot());
  // Waits in game time (headless rendering can be much slower than the wall clock).
  const gameWait = async (sec) => {
    const t0 = (await snap()).time;
    await page.waitForFunction((t) => window.__combat3d.snapshot().time >= t, t0 + sec, { timeout: 120_000 });
  };
  const qa = (name, ...args) => page.evaluate(([n, a]) => window.__combat3d[n](...a), [name, args]);
  const warrior = await qa("companion", "warrior");
  const mage = await qa("companion", "mage");
  let s = await snap();
  assert.equal(s.companions.length, 2);
  assert.deepEqual(s.campaign.party, [s.campaign.activeId, warrior, mage]);
  // Followers: walk away; they keep up.
  await qa("fixture", "empty");
  const start = (await snap()).player;
  // Step the leader away in small hops (a building may stand in one direction).
  for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    for (let k = 1; k <= 8; k++) await qa("moveTo", start.x + dx * k, start.z + dz * k);
    const p = (await snap()).player;
    if (Math.hypot(p.x - start.x, p.z - start.z) > 3) break;
  }
  await gameWait(2.5);
  s = await snap();
  assert.ok(Math.hypot(s.player.x - start.x, s.player.z - start.z) > 3, "leader moved");
  for (const m of s.companions) assert.ok(Math.hypot(m.x - s.player.x, m.z - s.player.z) < 4.5, `${m.role} kept up`);
  // A fight: an enemy next to the party loses health without the leader attacking.
  await qa("fixture", "duel");
  await gameWait(0.2);
  // The leader steps back; the warrior companion walks up and is now the nearest target.
  const lead = (await snap()).player, foe0 = (await snap()).enemies[0];
  const away = Math.atan2(lead.x - foe0.x, lead.z - foe0.z);
  for (let k = 1; k <= 7; k++) await qa("moveTo", lead.x + Math.sin(away) * k, lead.z + Math.cos(away) * k);
  const full = Object.fromEntries((await snap()).companions.map((m) => [m.id, m.hp]));
  const hp0 = (await snap()).enemies[0].hp;
  let targeted = false;
  for (let i = 0; i < 48; i++) {
    await gameWait(0.25);
    const t = await snap();
    if (t.companions.some((m) => m.hp < full[m.id])) targeted = true;
    if (t.enemies[0].hp < hp0 && targeted) break;
  }
  s = await snap();
  await page.screenshot({ path: "work/party/fight.png" });
  assert.ok(s.enemies[0].hp < hp0, `companions hit the enemy (${hp0} → ${s.enemies[0].hp})`);
  assert.ok(targeted, "the enemy also attacks the party, not only the leader");
  // Take control of the warrior from the party panel.
  await qa("fixture", "empty");
  await qa("camp"); // out of the fight (the fixture counts as combat)
  await gameWait(0.3);
  await page.click(".vitals #characters");
  await page.getByRole("button", { name: /^Bogdan/ }).click();
  await page.waitForFunction((id) => window.__combat3d.snapshot().campaign.activeId === id, warrior, { timeout: 5000 });
  s = await snap();
  assert.equal(s.companions.length, 2, "old leader became a companion");
  assert.ok(!s.companions.some((m) => m.id === warrior));
  // A herbalist companion heals a hurt leader.
  await page.click("#panel-close").catch(() => {});
  await page.click(".vitals #characters");
  await page.getByRole("button", { name: "Zostaw w obozie" }).first().click();
  await page.click("#panel-close");
  await qa("companion", "herbalist");
  await qa("fixture", "empty");
  await qa("setHp", 30);
  let healed = false;
  for (let i = 0; i < 20 && !healed; i++) {
    await gameWait(0.3);
    healed = (await snap()).player.hp > 30;
  }
  assert.ok(healed, "herbalist healed the leader");
  assert.deepEqual(errors, []);
  console.log("PASS: party of three follows, fights alone, draws enemy attacks, switch control from the panel, herbalist heals");
} finally {
  await browser.close();
  server.httpServer.close();
}
