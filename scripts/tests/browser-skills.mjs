// Skills from equipment: the weapon sets button Q (sword charge, hammer quake, staff
// fireball), the second hand adds button R (shield taunt, orb mana shield).
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { preview } from "vite";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
await mkdir("work/skills", { recursive: true });
const server = await preview({ preview: { host: "127.0.0.1", port: 4184, strictPort: true } });
const browser = await chromium.launch({
  executablePath: process.env.BROWSER_EXECUTABLE,
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-gl=angle", "--use-angle=swiftshader"],
});
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.route("https://fonts.googleapis.com/**", (r) => r.fulfill({ status: 200, body: "" }));
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:4184/?qa=1");
  await page.waitForFunction(() => window.__combat3d?.snapshot().ready, null, { timeout: 60_000 });
  await page.click("#start");
  const snap = () => page.evaluate(() => window.__combat3d.snapshot());
  const qa = (name, ...args) => page.evaluate(([n, a]) => window.__combat3d[n](...a), [name, args]);
  const gameWait = async (sec) => {
    const t0 = (await snap()).time;
    await page.waitForFunction((t) => window.__combat3d.snapshot().time >= t, t0 + sec, { timeout: 120_000 });
  };
  assert.equal((await snap()).skill, "sweep", "bare hands: the old cut");
  assert.equal(await page.locator("#skill2").isHidden(), true, "no second-hand skill yet");
  // Sword: charge hurts the enemy in front.
  await qa("equipTemplate", 0);
  assert.equal((await snap()).skill, "charge");
  await gameWait(0.2);
  assert.equal((await page.locator("#sweep-name").textContent()).trim(), "SZARŻA");
  await qa("fixture", "duel");
  await gameWait(0.2);
  let hp = (await snap()).enemies[0].hp;
  await page.keyboard.press("KeyQ");
  await gameWait(0.3);
  assert.ok((await snap()).enemies[0].hp < hp, "charge hit");
  // Hammer: quake stuns (after the skill's cooldown).
  await gameWait(6.2);
  await qa("equipTemplate", 10);
  assert.equal((await snap()).skill, "quake");
  await qa("fixture", "duel");
  await gameWait(0.2);
  hp = (await snap()).enemies[0].hp;
  await page.keyboard.press("KeyQ");
  await gameWait(0.2);
  const quaked = (await snap()).enemies[0];
  assert.ok(quaked.hp < hp && quaked.state === "recover", "quake hit and stunned");
  // Shield: R taunts and softens blows.
  await qa("equipTemplate", 7);
  assert.equal((await snap()).skill2, "taunt");
  await gameWait(0.1);
  assert.equal(await page.locator("#skill2").isVisible(), true);
  await page.screenshot({ path: "work/skills/buttons.png" });
  await page.keyboard.press("KeyR");
  await gameWait(0.1);
  assert.equal((await snap()).taunt, true);
  // Orb: mana shield.
  await qa("equipTemplate", 8);
  await gameWait(13);
  await page.keyboard.press("KeyR");
  await gameWait(0.1);
  assert.ok((await snap()).manaShield > 0, "mana shield up");
  assert.deepEqual(errors, []);
  console.log("PASS: equipment skills → sword charge, hammer quake + stun, shield taunt, orb mana shield");
} finally {
  await browser.close();
  server.httpServer.close();
}
