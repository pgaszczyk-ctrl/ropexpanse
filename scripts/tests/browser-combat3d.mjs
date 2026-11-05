import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { preview } from "vite";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
await mkdir("work/combat3d", { recursive: true });
const server = await preview({
  preview: { host: "127.0.0.1", port: 4178, strictPort: true },
});
const browser = await chromium.launch({
  executablePath: process.env.BROWSER_EXECUTABLE,
  args: [
    "--no-sandbox",
    "--enable-unsafe-swiftshader",
    "--use-gl=angle",
    "--use-angle=swiftshader",
  ],
});
try {
  for (const mobile of [false, true]) {
    const tag = mobile ? "phone" : "desktop",
      errors = [],
      network = [];
    const context = await browser.newContext({
      viewport: mobile
        ? { width: 844, height: 390 }
        : { width: 1280, height: 860 },
      hasTouch: mobile,
      isMobile: mobile,
      deviceScaleFactor: 1,
    });
    await context.route("https://fonts.googleapis.com/**", (r) =>
      r.fulfill({ status: 200, body: "" }),
    );
    const page = await context.newPage();
    await page.addInitScript(() => {
      const original = Element.prototype.requestFullscreen;
      window.__fullscreenRequests = [];
      Element.prototype.requestFullscreen = function (...args) {
        window.__fullscreenRequests.push({
          active: navigator.userActivation.isActive,
        });
        return original.apply(this, args);
      };
    });
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => network.push(r.url()));
    await page.goto("http://127.0.0.1:4178/?qa=1");
    await page.waitForSelector("#start:not([hidden])", { timeout: 60000 });
    await page.click("#start");
    const snap = () => page.evaluate(() => window.__combat3d.snapshot());
    const fixture = (name) =>
      page.evaluate((n) => window.__combat3d.fixture(n), name);
    const gameWait = async (seconds) => {
      const t = (await snap()).time;
      await page.waitForFunction(
        (target) => window.__combat3d.snapshot().time >= target,
        t + seconds,
        { timeout: 20000 },
      );
    };
    const attack = async () => {
      if (mobile) {
        const b = await page.locator("#attack-stick").boundingBox();
        await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2);
      } else await page.keyboard.press("Space");
    };
    await gameWait(0.4);
    assert(
      (await snap()).frameHealthy,
      "framebuffer contains a real rendered scene",
    );
    assert.equal(
      (await snap()).compatibility,
      mobile,
      "phones start with compatible graphics",
    );
    assert(
      await page.evaluate(() => window.__fullscreenRequests[0]?.active),
      "fullscreen is requested directly from the trusted Start click",
    );
    assert((await snap()).map.buildings > 100);
    assert.equal(await page.locator("#attack-symbol svg").count(), 1);
    assert.equal(
      await page.locator(".health").getAttribute("aria-valuenow"),
      "100",
    );
    const panels = await page.evaluate(() =>
      ["#expedition-tools", ".loadout", ".vitals"].map((selector) => {
        const r = document.querySelector(selector).getBoundingClientRect();
        return { x: r.x, y: r.y, right: r.right, bottom: r.bottom };
      }),
    );
    for (let i = 0; i < panels.length; i++)
      for (let j = i + 1; j < panels.length; j++) {
        const a = panels[i],
          b = panels[j];
        assert(
          !(a.x < b.right && a.right > b.x && a.y < b.bottom && a.bottom > b.y),
          "HUD panels must not overlap",
        );
      }
    await page.screenshot({ path: `work/combat3d/${tag}-city.png` });
    await fixture("patrol");
    const patrolStart = await snap();
    await gameWait(4);
    const patrolEnd = await snap();
    assert(Math.hypot(patrolEnd.enemies[0].x - patrolStart.enemies[0].x,
      patrolEnd.enemies[0].z - patrolStart.enemies[0].z) > 0.1,
      "enemy must wander while player rests in camp");
    assert.equal(patrolEnd.player.hp, patrolStart.player.hp);
    assert.equal(patrolEnd.enemies[0].state, "idle");
    await fixture("target");
    await attack();
    await gameWait(0.6);
    assert.equal((await snap()).enemies[0].hp, 84, "melee hits exactly once");
    await page.click("#sweep");
    await gameWait(0.7);
    assert.equal((await snap()).enemies[0].hp, 60, "sweep hits once");
    await page.keyboard.press("KeyQ");
    await gameWait(0.3);
    assert.equal(
      (await snap()).enemies[0].hp,
      60,
      "sweep cooldown cannot be bypassed",
    );
    console.log(`PASS ${tag}: melee, sweep, cooldown`);
    await page.click('[data-weapon="magic"]');
    await fixture("target");
    await gameWait(0.5);
    await attack();
    await gameWait(0.8);
    assert.equal(
      (await snap()).enemies[0].hp,
      82,
      "aimed magic projectile hits",
    );
    console.log(`PASS ${tag}: magic and assisted aim`);
    await fixture("hurt");
    await page.click("#heal");
    await gameWait(0.15);
    assert.equal(
      Math.round((await snap()).player.hp),
      63,
      "potion heals immediately",
    );
    await page.keyboard.press("KeyH");
    await gameWait(0.2);
    assert.equal(
      Math.round((await snap()).player.hp),
      63,
      "potion cooldown works",
    );
    await page.click("#pause");
    const t = (await snap()).time;
    await page.waitForTimeout(350);
    assert.equal((await snap()).time, t, "pause freezes simulation");
    await page.click("#pause");
    await gameWait(0.2);
    console.log(`PASS ${tag}: healing and pause`);
    if (mobile) {
      await page.evaluate(async () => {
        if (document.fullscreenElement) await document.exitFullscreen();
      });
      const windowSession = await context.newCDPSession(page);
      const windowInfo = await windowSession.send("Browser.getWindowForTarget");
      await windowSession.send("Browser.setWindowBounds", {
        windowId: windowInfo.windowId,
        bounds: { windowState: "normal" },
      });
      await page.waitForTimeout(300);
      if ((await snap()).paused) await page.click("#pause");
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForFunction(
        () => window.__combat3d.snapshot().orientationHeld,
      );
      assert(await page.locator("#rotate-notice").isVisible());
      const held = (await snap()).time;
      await page.waitForTimeout(250);
      assert.equal((await snap()).time, held, "portrait holds simulation");
      await page.setViewportSize({ width: 844, height: 390 });
      await page.waitForFunction(
        () => !window.__combat3d.snapshot().orientationHeld,
      );
      await gameWait(0.2);
      assert(!(await page.locator("#rotate-notice").isVisible()));
      console.log("PASS phone: landscape layout and portrait hold");
    }
    await fixture("empty");
    const before = (await snap()).player;
    if (mobile) {
      const b = await page.locator("#move-stick").boundingBox(),
        cdp = await context.newCDPSession(page),
        x = b.x + b.width / 2,
        y = b.y + b.height / 2;
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x, y, id: 1 }],
      });
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: x + 32, y, id: 1 }],
      });
      await gameWait(0.5);
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
      const after = (await snap()).player;
      assert(
        Math.hypot(after.x - before.x, after.z - before.z) > 0.1,
        "touch stick moves",
      );
      await gameWait(0.3);
      const stopped = (await snap()).player;
      assert(
        Math.hypot(stopped.x - after.x, stopped.z - after.z) < 0.01,
        "release stops movement",
      );
      await fixture("target");
      const hp = (await snap()).enemies[0].hp;
      const a = await page.locator("#attack-stick").boundingBox();
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x: a.x + 40, y: a.y + 40, id: 2 }],
      });
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchCancel",
        touchPoints: [],
      });
      await gameWait(0.6);
      assert.equal(
        (await snap()).enemies[0].hp,
        hp,
        "touch cancellation does not attack",
      );
    } else {
      await page.keyboard.down("KeyD");
      await gameWait(0.5);
      await page.keyboard.up("KeyD");
      const after = (await snap()).player;
      assert(
        Math.hypot(after.x - before.x, after.z - before.z) > 0.1,
        "keyboard moves",
      );
    }
    console.log(`PASS ${tag}: movement and input cleanup`);
    // Exercise the public UI with only time/gold/location arranged by QA.
    await page.evaluate(() => window.__combat3d.camp());
    await gameWait(0.3);
    await page.click("#inventory");
    assert.equal(await page.locator(".item-slot").count(), 24);
    const itemCount = (await snap()).campaign.characters[0].bag.length;
    await page.locator(".item-slot:not(:disabled)").first().click();
    await page.getByRole("button", { name: "Załóż", exact: true }).click();
    assert.equal(
      (await snap()).campaign.characters[0].bag.length,
      itemCount - 1,
    );
    await page.click("#panel-close");
    await page.evaluate(() => window.__combat3d.grantGold(1000));
    await page.click("#action");
    await page.getByRole("button", { name: "Rekrutuj", exact: true }).click();
    await page.getByLabel("Złoto w ofercie").fill("500");
    await page.getByRole("button", { name: "Wystaw", exact: true }).click();
    assert.equal((await snap()).campaign.offers.length, 1);
    assert.equal((await snap()).player.coins, 500);
    await page.evaluate(() => window.__combat3d.advanceOffers(1));
    await page.waitForSelector(".candidate");
    await page.locator(".candidate").first().click();
    assert.equal((await snap()).campaign.characters.length, 2);
    assert.equal((await snap()).campaign.offers.length, 0);
    await page.getByLabel("Złoto w ofercie").fill("1");
    await page.getByRole("button", { name: "Wystaw", exact: true }).click();
    await page.evaluate(() => window.__combat3d.advanceOffers(1));
    await page.getByRole("heading", { name: "Brak zgłoszeń", exact: true }).waitFor();
    assert.deepEqual((await snap()).campaign.offers[0].candidates, []);
    await page.getByRole("button", { name: "Odbierz ofertę", exact: true }).click();
    assert.equal((await snap()).campaign.offers.length, 0);
    assert.equal((await snap()).campaign.bank, 1);
    await page.click("#panel-close");
    await page.click("#characters");
    await page.locator(".character-choice").nth(1).click();
    assert.equal(
      (await snap()).campaign.activeId,
      (await snap()).campaign.characters[1].id,
    );
    console.log(
      `PASS ${tag}: inventory, equipment, escrow, recruitment and character switch`,
    );
    await fixture("death");
    await gameWait(1.3);
    const restored = await snap();
    assert(
      Math.hypot(
        restored.player.x - restored.home.x,
        restored.player.z - restored.home.z,
      ) < 0.1,
      "death returns to refuge",
    );
    assert.equal(restored.player.coins, 0);
    assert(restored.player.hp > 0);
    await page.click('[data-weapon="magic"]');
    const saved = (await snap()).player;
    await page.reload();
    await page.waitForSelector("#start:not([hidden])");
    assert.equal((await snap()).weapon, "magic");
    assert.equal((await snap()).player.coins, saved.coins);
    await page.click("#start");
    assert(
      !network.some((url) => url.includes("supabase")),
      "laboratory never touches real player server",
    );
    assert.deepEqual(errors, []);
    await page.evaluate(() => window.__combat3d.loseContext());
    await page.waitForFunction(() => window.__combat3d.snapshot().contextLost);
    assert(
      await page.locator("#renderer-error").isVisible(),
      "lost context shows recovery instructions",
    );
    const stoppedTime = (await snap()).time;
    await page.waitForTimeout(250);
    assert.equal(
      (await snap()).time,
      stoppedTime,
      "context loss holds gameplay",
    );
    await page.evaluate(() => window.__combat3d.restoreContext());
    await page.waitForFunction(
      () => {
        const s = window.__combat3d.snapshot();
        return !s.contextLost && !s.rendererFault && s.frameHealthy;
      },
      null,
      { timeout: 30000 },
    );
    assert(
      !(await page.locator("#renderer-error").isVisible()),
      "restored context redraws the scene",
    );
    console.log(
      `PASS ${tag}: fullscreen gesture, nonblank framebuffer, context loss and restoration`,
    );
    await fixture("duel");
    await gameWait(0.5);
    await page.screenshot({ path: `work/combat3d/${tag}-combat.png` });
    console.log(
      `PASS ${tag}: death, local save, no live backend, no page errors`,
    );
    await context.close();
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}

