// Real weather at the player's place (owner's design doc: free Open-Meteo, no API key).
// One request per ~25 km square every 30 minutes, kept in the browser; offline or on any
// error the weather is simply clear. `?weather=` forces it for tests.
import type { Weather } from "./bestiary.ts";

export const WEATHER_ENDPOINT = "https://api.open-meteo.com/v1/forecast";
const KEEP_MS = 30 * 60_000;
/** WMO weather code (+ wind in m/s) → the game's weather. */
export function weatherFromCode(code: number, wind = 0): Weather {
  if (code >= 95) return "storm";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if (code === 45 || code === 48) return "fog";
  return wind >= 10 ? "wind" : "clear";
}
const cellKey = (lat: number, lon: number) =>
  `ropexpanse:weather:${Math.round(lat * 4)}:${Math.round(lon * 4)}`;
export async function fetchWeather(
  lat: number,
  lon: number,
  now = Date.now(),
  get: typeof fetch = fetch,
): Promise<Weather> {
  const key = cellKey(lat, lon);
  try {
    const kept = JSON.parse(localStorage.getItem(key) ?? "null");
    if (kept && now - kept.at < KEEP_MS) return kept.weather;
  } catch {
    /* no storage */
  }
  try {
    const url = `${WEATHER_ENDPOINT}?latitude=${lat.toFixed(2)}&longitude=${lon.toFixed(2)}&current=weather_code,wind_speed_10m&wind_speed_unit=ms`;
    const r = await get(url, { signal: AbortSignal.timeout(8000) });
    if (!r.ok) return "clear";
    const j = await r.json();
    const weather = weatherFromCode(Number(j?.current?.weather_code ?? 0), Number(j?.current?.wind_speed_10m ?? 0));
    try {
      localStorage.setItem(key, JSON.stringify({ at: now, weather }));
    } catch {
      /* full storage */
    }
    return weather;
  } catch {
    return "clear";
  }
}
export const WEATHER_NAMES: Record<Weather, string> = {
  clear: "Pogodnie",
  rain: "Deszcz",
  snow: "Śnieg",
  fog: "Mgła",
  storm: "Burza",
  wind: "Wiatr",
};
