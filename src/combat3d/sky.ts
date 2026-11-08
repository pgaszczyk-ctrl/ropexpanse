// Time of day from the real sunrise and sunset at the player's place (owner's design
// doc, Pory dnia), computed locally with the NOAA solar formulas — no server, no API.
// Day: from an hour after sunrise to an hour before sunset; twilight: the hour around
// sunrise and sunset; night: the rest.
import type { TimeOfDay } from "./bestiary.ts";

const RAD = Math.PI / 180;
/** Sunrise and sunset (ms, UTC) for the date of `when` at lat/lon; null when the sun
 * stays up (polar day: rise = -Infinity) or down (polar night: rise = Infinity). */
export function sunTimes(when: number, lat: number, lon: number) {
  const day = Math.floor(when / 86_400_000); // days since 1970-01-01 UTC
  const n = day - 10957 + 0.0008; // days since J2000.0 (2000-01-01 12:00)
  const jStar = n - lon / 360;
  const M = (357.5291 + 0.98560028 * jStar) % 360;
  const C = 1.9148 * Math.sin(M * RAD) + 0.02 * Math.sin(2 * M * RAD) + 0.0003 * Math.sin(3 * M * RAD);
  const L = (M + C + 180 + 102.9372) % 360;
  const transit = 2451545 + jStar + 0.0053 * Math.sin(M * RAD) - 0.0069 * Math.sin(2 * L * RAD);
  const dec = Math.asin(Math.sin(L * RAD) * Math.sin(23.44 * RAD));
  const cosH = (Math.sin(-0.833 * RAD) - Math.sin(lat * RAD) * Math.sin(dec)) / (Math.cos(lat * RAD) * Math.cos(dec));
  const toMs = (jd: number) => (jd - 2440587.5) * 86_400_000;
  if (cosH > 1) return { rise: Infinity, set: -Infinity }; // polar night
  if (cosH < -1) return { rise: -Infinity, set: Infinity }; // polar day
  const H = Math.acos(cosH) / RAD;
  return { rise: toMs(transit - H / 360), set: toMs(transit + H / 360) };
}
const HOUR = 3_600_000;
export function timeOfDayAt(when: number, lat: number, lon: number): TimeOfDay {
  // Check today's sun and the neighbouring days (the local date may differ from UTC).
  for (const d of [0, -1, 1]) {
    const { rise, set } = sunTimes(when + d * 86_400_000, lat, lon);
    if (rise === -Infinity) return "day";
    if (rise === Infinity) continue;
    if (Math.abs(when - rise) <= HOUR / 2 || Math.abs(when - set) <= HOUR / 2) return "twilight";
    if (when > rise + HOUR / 2 && when < set - HOUR / 2) return "day";
  }
  return "night";
}
/** Light for each time of day (design doc palette: golden-pink dusk, navy night, never black). */
export const LIGHT: Record<TimeOfDay, { sun: number; sunColor: number; sky: number; skyColor: number; ground: number; fog: number; lamp: number }> = {
  // Warm sun from the upper left, cooler shadows (review of 8 Nov 2026).
  day: { sun: 2.3, sunColor: 0xffe4bf, sky: 1.45, skyColor: 0xeef3ff, ground: 0x66748a, fog: 0xcfdcc0, lamp: 0 },
  twilight: { sun: 1.3, sunColor: 0xffb38a, sky: 1.3, skyColor: 0xf1c6b8, ground: 0x5a4f6a, fog: 0xc9a9a4, lamp: 1.2 },
  night: { sun: 0.75, sunColor: 0x9fb4e6, sky: 1.7, skyColor: 0x7088c0, ground: 0x2c3d63, fog: 0x1b2a4a, lamp: 2.6 },
};
