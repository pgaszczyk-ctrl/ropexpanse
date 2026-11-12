// Sunrise/sunset and time of day computed locally.
import assert from "node:assert/strict";
import { sunTimes, timeOfDayAt } from "../../src/combat3d/sky.ts";
const at = (iso) => Date.parse(iso);
// Warsaw, 21 June: sunrise ≈ 04:14, sunset ≈ 21:01 local (UTC+2).
const june = sunTimes(at("2026-06-21T12:00:00Z"), 52.23, 21.01);
const near = (t, iso, min) => assert.ok(Math.abs(t - at(iso)) < min * 60_000, `${new Date(t).toISOString()} vs ${iso}`);
near(june.rise, "2026-06-21T02:14:00Z", 6);
near(june.set, "2026-06-21T19:01:00Z", 6);
// Warsaw, 21 December: ≈ 07:43 / 15:25 local (UTC+1).
const dec = sunTimes(at("2026-12-21T12:00:00Z"), 52.23, 21.01);
near(dec.rise, "2026-12-21T06:43:00Z", 6);
near(dec.set, "2026-12-21T14:25:00Z", 6);
assert.equal(timeOfDayAt(at("2026-06-21T10:00:00Z"), 51.25, 22.57), "day");
assert.equal(timeOfDayAt(at("2026-06-21T18:45:00Z"), 51.25, 22.57), "twilight");
assert.equal(timeOfDayAt(at("2026-06-21T23:00:00Z"), 51.25, 22.57), "night");
assert.equal(timeOfDayAt(at("2026-12-21T17:00:00Z"), 51.25, 22.57), "night");
// Tokyo at 12:00 local (03:00 UTC) is day; Svalbard in June has polar day, in December night.
assert.equal(timeOfDayAt(at("2026-03-10T03:00:00Z"), 35.68, 139.69), "day");
assert.equal(timeOfDayAt(at("2026-06-21T00:00:00Z"), 78.2, 15.6), "day");
assert.equal(timeOfDayAt(at("2026-12-21T12:00:00Z"), 78.2, 15.6), "night");
console.log("PASS: sun times for Warsaw (June/December), day/twilight/night, Tokyo, polar day and night");
