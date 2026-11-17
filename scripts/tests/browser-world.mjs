// World map in the real game: tiles come from the PMTiles archive (here the Lublin
// sample served with HTTP ranges), not from a public Overpass server.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, readFile } from "node:fs/promises";
import { preview } from "vite";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
await mkdir("work/world", { recursive: true });
const archive = await readFile(
  new URL("./fixtures/lublin.pmtiles", import.meta.url),
);
const server = await preview({
  preview: { host: "127.0.0.1", port: 4179, strictPort: true },
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
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });
  const overpass = [],
    ranges = [];
  await page.route("https://fonts.googleapis.com/**", (r) =>
    r.fulfill({ status: 200, body: "" }),
  );
  await page.route("**/elevation-tiles-prod/**", (r) => r.abort()); // offline, flat terrain
  await page.route(
    "**/overpass**",
    (r) => (overpass.push(r.request().url()), r.abort()),
  );
  await page.route("**/fixture/lublin.pmtiles", (r) => {
    const m = /bytes=(\d+)-(\d+)/.exec(r.request().headers().range ?? "");
    const from = m ? Number(m[1]) : 0,
      to = m ? Math.min(Number(m[2]), archive.length - 1) : archive.length - 1;
    ranges.push(to - from + 1);
    return r.fulfill({
      status: m ? 206 : 200,
      headers: {
        "content-range": `bytes ${from}-${to}/${archive.length}`,
        "accept-ranges": "bytes",
        "access-control-allow-origin": "*",
      },
      body: archive.subarray(from, to + 1),
    });
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(
    `http://127.0.0.1:4179/?qa=1&world=${encodeURIComponent("http://127.0.0.1:4179/fixture/lublin.pmtiles")}`,
  );
  await page.waitForFunction(() => window.__combat3d?.snapshot().ready, null, {
    timeout: 60_000,
  });
  await page.click("#start");
  // Śródmieście, ~1.5 km from the bundled fragment's centre.
  const started = Date.now();
  await page.evaluate(() => window.__combat3d.travel(51.2365, 22.5785));
  const loadMs = Date.now() - started;
  await page.waitForFunction(
    () => window.__combat3d.snapshot().world.tiles >= 4,
    null,
    { timeout: 30_000 },
  );
  const fullMs = Date.now() - started;
  const s = await page.evaluate(() => window.__combat3d.snapshot());
  assert.ok(s.world.tiles >= 4, `tiles ${s.world.tiles}`);
  assert.equal(s.world.error, "");
  assert.ok(s.map.buildings > 300, `buildings ${s.map.buildings}`);
  assert.equal(s.map.source, "world map tiles");
  assert.equal(overpass.length, 0, "no Overpass requests");
  assert.ok(
    ranges.every((n) => n < 600_000),
    "archive read in small pieces",
  );
  assert.ok(loadMs < 20_000, `travel took ${loadMs} ms`);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "work/world/srodmiescie.png" });
  // Installable app: manifest with fullscreen display and icons that load.
  const manifest = await page.evaluate(async () => {
    const href = document.querySelector('link[rel="manifest"]').href;
    const m = await (await fetch(href)).json();
    const icons = await Promise.all(m.icons.map(async (i) => (await fetch(new URL(i.src, href))).ok));
    return { display: m.display, orientation: m.orientation, icons };
  });
  assert.equal(manifest.display, "fullscreen");
  assert.equal(manifest.orientation, "landscape");
  assert.ok(manifest.icons.length >= 3 && manifest.icons.every(Boolean), "icons load");
  assert.deepEqual(errors, []);
  console.log(
    `PASS: world map from PMTiles: ${s.world.tiles} tiles, ${s.map.buildings} buildings, ${ranges.length} range reads, first view ${loadMs} ms, 4+ tiles ${fullMs} ms, no Overpass; installable app manifest`,
  );
} finally {
  await browser.close();
  server.httpServer.close();
}
