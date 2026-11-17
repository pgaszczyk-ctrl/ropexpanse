// HUD (review of 8 Nov 2026): no game name, no sword/magic switch, no test tools on
// screen; round buttons on an even arc around Attack (special, second hand, potion,
// Camp above) without overlaps and inside the screen; the special button takes the
// active hero's skill (sword → Szarża, staff → Kula ognia, archer → Salwa).
// Computer and phone landscape; screenshots in work/hud/.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { preview } from "vite";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
await mkdir("work/hud", { recursive: true });
const server = await preview({ preview: { host: "127.0.0.1", port: 4193, strictPort: true } });
const browser = await chromium.launch({
  executablePath: process.env.BROWSER_EXECUTABLE,
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-gl=angle", "--use-angle=swiftshader"],
});
const rects = (page) =>
  page.evaluate(() =>
    ["attack-stick", "sweep", "skill2", "heal", "action", "expedition-tools", "help-button"]
      .map((id) => document.getElementById(id))
      .filter((el) => el && !el.hidden && el.offsetWidth)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return { id: el.id, x: r.x, y: r.y, right: r.right, bottom: r.bottom };
      }),
  );
const checkLayout = async (page, label) => {
  await page.waitForTimeout(600); // arc re-measures a few times a second
  const rs = await rects(page);
  const w = page.viewportSize();
  for (const r of rs) assert.ok(r.x >= 0 && r.y >= 0 && r.right <= w.width && r.bottom <= w.height, `${label}: ${r.id} inside the screen`);
  for (let i = 0; i < rs.length; i++)
    for (let j = i + 1; j < rs.length; j++) {
      const a = rs[i], b = rs[j];
      const round = (r) => ["attack-stick", "sweep", "skill2", "heal"].includes(r.id);
      if (round(a) && round(b)) {
        // Round buttons: compare circles, not their square boxes.
        const d = Math.hypot((a.x + a.right) / 2 - (b.x + b.right) / 2, (a.y + a.bottom) / 2 - (b.y + b.bottom) / 2);
        assert.ok(d >= (a.right - a.x) / 2 + (b.right - b.x) / 2, `${label}: ${a.id} touches ${b.id}`);
      } else assert.ok(!(a.x < b.right - 1 && a.right > b.x + 1 && a.y < b.bottom - 1 && a.bottom > b.y + 1), `${label}: ${a.id} overlaps ${b.id}`);
    }
  return rs;
};
try {
  for (const [name, viewport] of [["komputer", { width: 1280, height: 800 }], ["telefon", { width: 844, height: 390 }]]) {
    const page = await browser.newPage({ viewport, ...(name === "telefon" ? { isMobile: true, hasTouch: true } : {}) });
    await page.route("https://fonts.googleapis.com/**", (r) => r.fulfill({ status: 200, body: "" }));
    await page.route("**/elevation-tiles-prod/**", (r) => r.abort());
    await page.route("**/api.open-meteo.com/**", (r) => r.abort());
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("http://127.0.0.1:4193/?qa=1&weather=clear&time=day");
    await page.waitForFunction(() => window.__combat3d?.snapshot().ready, null, { timeout: 60_000 });
    await page.click("#start");
    const qa = (fn, ...args) => page.evaluate(([f, a]) => window.__combat3d[f](...a), [fn, args]);
    assert.equal(await page.locator(".brand").count(), 0, "no game name");
    assert.equal(await page.locator("[data-weapon]").count(), 0, "no sword/magic switch");
    assert.equal(await page.locator("#world-map").isVisible(), false, "travel tool only in the menu");
    await qa("fixture", "empty");
    await qa("equipTemplate", 0); // sword
    await page.waitForFunction(() => document.getElementById("sweep-name").textContent === "SZARŻA", null, { timeout: 20_000 });
    assert.equal((await page.evaluate(() => window.__combat3d.snapshot().weapon)), "sword");
    await checkLayout(page, `${name} sword`);
    await page.screenshot({ path: `work/hud/${name}-wojownik.png` });
    await qa("equipTemplate", 1); // staff: magic, fireball
    await page.waitForFunction(() => document.getElementById("sweep-name").textContent === "KULA OGNIA", null, { timeout: 20_000 });
    assert.equal((await page.evaluate(() => window.__combat3d.snapshot().weapon)), "magic", "staff → magic attack");
    // A shield adds the second-hand skill: four slots on the arc, still no overlap.
    const shield = await page.evaluate(() => {
      for (let i = 0; i < 40; i++) if (window.__combat3d.equipTemplate(i) === "shield") return i;
      return -1;
    });
    if (shield >= 0) {
      await page.waitForFunction(() => !document.getElementById("skill2").hidden, null, { timeout: 20_000 });
      await checkLayout(page, `${name} shield`);
      await page.screenshot({ path: `work/hud/${name}-tarcza.png` });
    }
    // Archer in control: the special is a volley.
    await qa("companion", "archer");
    await qa("camp");
    await page.waitForTimeout(300);
    await page.click(".vitals #characters");
    await page.getByRole("button", { name: /^Hugo/ }).click();
    await page.click("#panel-close").catch(() => {});
    await page.waitForFunction(() => document.getElementById("sweep-name").textContent === "SALWA", null, { timeout: 20_000 });
    await checkLayout(page, `${name} archer`);
    await page.screenshot({ path: `work/hud/${name}-lucznik.png` });
    // The menu holds the travel tool.
    await page.click("#help-button");
    assert.equal(await page.locator("#world-map").isVisible(), true, "travel tool in the menu");
    await page.click("#close-help");
    assert.deepEqual(errors, [], "no page errors");
    await page.close();
    console.log(`PASS: HUD ${name} → no name/switch/test tools, arc without overlaps, special = Szarża / Kula ognia / Salwa${shield >= 0 ? ", shield skill on the arc" : ""}`);
  }
} finally {
  await browser.close();
  await server.close();
}
