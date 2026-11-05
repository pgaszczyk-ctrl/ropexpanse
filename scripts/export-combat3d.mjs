// Package the built experiment, styles and OSM subset into one offline HTML.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
const output = resolve(
  process.argv[2] || "work/combat3d/EXP-LORE_proba_walki_3D.html",
);
let html = readFileSync("dist/index.html", "utf8");
const jsPath = /<script[^>]+src="([^"]+)"[^>]*><\/script>/.exec(html)?.[1];
const cssPath = /<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/.exec(
  html,
)?.[1];
if (!jsPath || !cssPath) throw Error("Missing experiment bundle");
let js = readFileSync(resolve("dist", jsPath), "utf8");
js = js.replace(/import\s*"(\.\/modulepreload[^"\n]+)";/g, (_, path) =>
  readFileSync(resolve("dist/assets", path), "utf8"),
);
const mapFetch = /fetch\((["'`])combat3d\/lublin\.json\1\)/;
if (!mapFetch.test(js))
  throw Error("Map loader changed; inspect export before publishing");
js = js.replace(
  mapFetch,
  'Promise.resolve(new Response(document.getElementById("embedded-map").textContent,{headers:{"Content-Type":"application/json"}}))',
);
const css = readFileSync(resolve("dist", cssPath), "utf8").replace(
  /@import\s+(["']).*?\1\s*;/gs,
  "",
);
if (!css.startsWith(":root") || /fonts.googleapis/.test(css))
  throw Error("Offline stylesheet is invalid");
html = html
  .replace(/<script[^>]+src="[^"]+"[^>]*><\/script>/g, "")
  .replace(/<link[^>]+rel="modulepreload"[^>]*>/g, "")
  .replace(/<link[^>]+rel="stylesheet"[^>]*>/g, () => `<style>${css}</style>`);
const map = readFileSync("public/combat3d/lublin.json", "utf8").replaceAll(
  "<",
  "\\u003c",
);
html = html
  .replace(
    "</body>",
    () =>
      `<script id="embedded-map" type="application/json">${map}</script><script type="module">${js.replaceAll("</script", "<\\/script")}</script></body>`,
  )
  ;
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, html);
console.log(output);
