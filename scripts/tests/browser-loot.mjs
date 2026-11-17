// Loot in the real game: coins jump out, wait ~0.4 s, fly to the hero and the counter
// (which pulses); a common item flies into the backpack; a rare one waits on the ground
// with its aura until the hero walks up; a wolf leaves no gear, a bandit can.
// Computer and phone landscape; screenshots in work/loot/.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { preview } from "vite";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
await mkdir("work/loot", { recursive: true });
const server = await preview({ preview: { host: "127.0.0.1", port: 4194, strictPort: true } });
const browser = await chromium.launch({
  executablePath: process.env.BROWSER_EXECUTABLE,
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-gl=angle", "--use-angle=swiftshader"],
});
try {
  for (const [name, viewport] of [["komputer", { width: 1280, height: 800 }], ["telefon", { width: 844, height: 390 }]]) {
    const page = await browser.newPage({ viewport, ...(name === "telefon" ? { isMobile: true, hasTouch: true } : {}) });
    await page.route("https://fonts.googleapis.com/**", (r) => r.fulfill({ status: 200, body: "" }));
    await page.route("**/elevation-tiles-prod/**", (r) => r.abort());
    await page.route("**/api.open-meteo.com/**", (r) => r.abort());
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("http://127.0.0.1:4194/?qa=1&weather=clear&time=day");
    await page.waitForFunction(() => window.__combat3d?.snapshot().ready, null, { timeout: 60_000 });
    await page.click("#start");
    const snap = () => page.evaluate(() => window.__combat3d.snapshot());
    const qa = (fn, ...args) => page.evaluate(([f, a]) => window.__combat3d[f](...a), [fn, args]);
    const gameWait = async (sec) => {
      const t0 = (await snap()).time;
      await page.waitForFunction((t) => window.__combat3d.snapshot().time >= t, t0 + sec, { timeout: 120_000 });
    };
    await qa("fixture", "empty");
    await qa("camp");
    const s0 = await snap();
    const coins0 = s0.player.coins, bag0 = s0.player.bag.length;
    await qa("dropLoot", 30, ["common", "rare"]);
    let s = await snap();
    assert.equal(s.player.coins, coins0, "tix do not count instantly");
    assert.ok(s.drops.filter((d) => d.coin).length >= 2, "tix are a few coins");
    await gameWait(0.25);
    await page.screenshot({ path: `work/loot/${name}-wypada.png` });
    await page.waitForFunction((c) => window.__combat3d.snapshot().player.coins === c + 30, coins0, { timeout: 60_000 });
    await page.waitForFunction(() => document.getElementById("loot").textContent.includes("tix"), null, { timeout: 5000 });
    await page.waitForFunction((b) => window.__combat3d.snapshot().player.bag.length === b + 1, bag0, { timeout: 30_000 });
    s = await snap();
    const rare = s.drops.find((d) => d.rarity === "rare");
    assert.ok(rare && rare.landed, "the rare item waits on the ground");
    await gameWait(1);
    assert.ok((await snap()).drops.some((d) => d.rarity === "rare"), "still waiting");
    await page.screenshot({ path: `work/loot/${name}-rzadki.png` });
    await qa("moveTo", rare.x - 0.4, rare.z);
    await page.waitForFunction((b) => window.__combat3d.snapshot().player.bag.length === b + 2, bag0, { timeout: 30_000 });
    assert.equal((await snap()).player.bag.at(-1).rarity, "rare", "picked up on walking up");
    // Legendary: pillar and a slow fall, still waits on the ground.
    await qa("dropLoot", 0, ["legendary"]);
    await gameWait(1.5);
    await page.screenshot({ path: `work/loot/${name}-legendarny.png` });
    assert.ok((await snap()).drops.some((d) => d.rarity === "legendary"));
    // A wolf leaves tix (and maybe hide/fang), never gear.
    await qa("fixture", "empty");
    await qa("spawnSpecies", "wilk", 4);
    const k = await qa("killNearest");
    assert.equal(k.look, "wolf");
    const after = (await snap()).drops.filter((d) => d.slot && d.slot !== "material" && d.rarity !== "legendary");
    assert.equal(after.length, 0, "no gear from a wolf");
    assert.deepEqual(errors, [], "no page errors");
    await page.close();
    console.log(`PASS: loot ${name} → coins fly after landing and count, common item auto, rare waits for the hero, legendary pillar, wolf no gear`);
  }
} finally {
  await browser.close();
  await server.close();
}
