// Bestiary: biome decides who comes; time, weather and distance from the ropes add
// their own creatures; every species of the starting region can appear.
import assert from "node:assert/strict";
import { SLAVIC, pickSpecies, biomeAt } from "../../src/combat3d/bestiary.ts";

const biomes = ["las", "laki", "woda", "cmentarz", "miasto", "przemysl"];
const seen = new Set();
for (const b of biomes)
  for (const rank of ["weak", "medium", "elite"])
    for (const time of ["day", "twilight", "night"])
      for (const w of ["clear", "rain", "snow", "fog", "storm"])
        for (const far of [false, true])
          for (let r = 0; r < 1; r += 0.05) {
            const s = pickSpecies(b, rank, time, w, far, r);
            seen.add(s.id);
            if (s.when) assert.ok(s.when.includes(time), `${s.id} at ${time}`);
            if (s.weather) assert.ok(s.weather.includes(w), `${s.id} in ${w}`);
            if (s.far) assert.ok(far, `${s.id} only far from ropes`);
            assert.ok(s.biome === b || s.biome === "any" || (b === "miasto" && s.id === "zlodziej"), `${s.id} in ${b}`);
          }
const base = SLAVIC.filter((s) => s.biome !== "any" && !s.weather && !s.far && (!s.when || s.id === "poludnica"));
assert.equal(base.length, 23, "23 enemies in 6 biomes");
for (const s of SLAVIC) assert.ok(seen.has(s.id), `${s.id} can appear`);
assert.equal(pickSpecies("laki", "elite", "night", "clear", false, 0).id === "poludnica", false, "no Południca at night");
assert.ok(["poludnica"].includes(pickSpecies("laki", "elite", "day", "clear", false, 0.01).id) || pickSpecies("laki", "elite", "day", "clear", false, 0.01).biome === "laki");
// Biome from the map: water nearby wins, OSM kind next, else town.
const sq = (x, z, s) => [[[x, z], [x + s, z], [x + s, z + s], [x, z + s]]];
const map = { areas: [
  { rings: sq(0, 0, 20), water: false, name: "", kind: "forest" },
  { rings: sq(50, 0, 20), water: false, name: "", kind: "cemetery" },
  { rings: sq(100, 0, 10), water: true, name: "" },
] };
assert.equal(biomeAt(map, { x: 5, z: 5 }), "las");
assert.equal(biomeAt(map, { x: 55, z: 5 }), "cmentarz");
assert.equal(biomeAt(map, { x: 112, z: 5 }), "woda", "shore counts as water");
assert.equal(biomeAt(map, { x: 300, z: 5 }), "miasto");
console.log(`PASS: bestiary → ${SLAVIC.length} species (23 base in 6 biomes + night, weather, far), time/weather/distance rules, biomes from OSM`);
