// Archetypes in the real game: an ambusher hides until close, a thief grabs gold and
// runs (and gives it back when caught), a summoner calls servants, a colossus hits the
// whole red circle.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { preview } from "vite";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
await mkdir("work/bestiary", { recursive: true });
const server = await preview({ preview: { host: "127.0.0.1", port: 4185, strictPort: true } });
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
  await page.goto("http://127.0.0.1:4185/?qa=1");
  await page.waitForFunction(() => window.__combat3d?.snapshot().ready, null, { timeout: 60_000 });
  await page.click("#start");
  const snap = () => page.evaluate(() => window.__combat3d.snapshot());
  const qa = (name, ...args) => page.evaluate(([n, a]) => window.__combat3d[n](...a), [name, args]);
  const gameWait = async (sec) => {
    const t0 = (await snap()).time;
    await page.waitForFunction((t) => window.__combat3d.snapshot().time >= t, t0 + sec, { timeout: 120_000 });
  };
  const enemy = async (key) => (await snap()).enemies.find((e) => e.key === key);
  // Clear the area: fixtures hide every ordinary enemy.
  await qa("fixture", "empty");
  await qa("grantGold", 200);
  // Ambush: hidden at 5 units, out as soon as the hero is within 4.
  const spider = await qa("spawnSpecies", "pajak", 6);
  await gameWait(0.2);
  assert.equal((await enemy(spider)).hidden, true, "ambusher hidden");
  const e0 = await enemy(spider);
  await qa("face", e0.x, e0.z);
  await gameWait(0.3);
  assert.equal((await enemy(spider)).hidden, false, "jumps out when close");
  await qa("killWave");
  await qa("fixture", "empty");
  // Thief: steals gold and runs.
  await qa("grantGold", 200);
  const thief = await qa("spawnSpecies", "zlodziej", 2.5);
  let stolen = false;
  for (let i = 0; i < 40 && !stolen; i++) {
    await gameWait(0.25);
    stolen = (await snap()).player.coins < 200;
  }
  assert.ok(stolen, "thief took gold");
  await page.screenshot({ path: "work/bestiary/thief.png" });
  await qa("fixture", "empty");
  // Summoner: calls servants.
  await qa("grantGold", 0);
  const leszy = await qa("spawnSpecies", "leszy", 8);
  let servants = 0;
  for (let i = 0; i < 40 && !servants; i++) {
    await gameWait(0.25);
    servants = (await snap()).enemies.filter((e) => e.key.startsWith(`summon:${leszy}:`) && e.state !== "dead").length;
  }
  assert.ok(servants >= 1, `summoner called ${servants} servants`);
  assert.ok((await snap()).enemies.filter((e) => e.key.startsWith(`summon:${leszy}:`)).every((e) => e.species === "wilk"), "forest servants are wolves");
  await page.screenshot({ path: "work/bestiary/summoner.png" });
  await qa("fixture", "empty");
  // Colossus: a slam hits everyone inside the red circle.
  await qa("setHp", 100);
  const golem = await qa("spawnSpecies", "golem", 2);
  let hit = false;
  for (let i = 0; i < 40 && !hit; i++) {
    await gameWait(0.25);
    hit = (await snap()).player.hp < 100;
  }
  assert.ok(hit, "colossus slam hit the hero");
  assert.equal((await snap()).weather, "clear", "no weather service = clear sky, the game goes on");
  assert.deepEqual(errors, []);
  console.log("PASS: archetypes → ambusher hides until close, thief steals gold, summoner calls biome servants, colossus slams the circle");
} finally {
  await browser.close();
  server.httpServer.close();
}
