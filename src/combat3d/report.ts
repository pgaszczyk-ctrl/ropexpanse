// Live FPS on screen and a bug report the player can copy, share or download
// (owner, 9 Nov). Nothing is sent anywhere: the player pastes it into the chat.
export type Spike = { at: string; ms: number; context: string };
const spikes: Spike[] = [];
const errors: string[] = [];
const seconds: { fps: number; worst: number }[] = [];
let frameCount = 0,
  worst = 0,
  secondStart = performance.now();
const started = new Date();
window.addEventListener("error", (e) => remember(`${e.message} @ ${e.filename}:${e.lineno}`));
window.addEventListener("unhandledrejection", (e) => remember(`Promise: ${String(e.reason)}`));
function remember(text: string) {
  errors.push(`${new Date().toISOString().slice(11, 19)} ${text}`);
  if (errors.length > 15) errors.shift();
}
/** Called once per frame with the real frame time (s) and what the game is doing. */
export function trackFrame(raw: number, context: () => string) {
  const ms = raw * 1000;
  frameCount++;
  worst = Math.max(worst, ms);
  // A frame over 80 ms is a visible hitch; keep what happened around it.
  if (ms > 80) {
    spikes.push({ at: new Date().toISOString().slice(11, 19), ms: Math.round(ms), context: context() });
    if (spikes.length > 40) spikes.shift();
  }
  const now = performance.now();
  if (now - secondStart >= 1000) {
    const fps = Math.round((frameCount * 1000) / (now - secondStart));
    seconds.push({ fps, worst: Math.round(worst) });
    if (seconds.length > 120) seconds.shift();
    const el = document.getElementById("perf-fps");
    if (el) {
      el.textContent = String(fps);
      el.parentElement!.classList.toggle("low", fps < 25);
    }
    frameCount = 0;
    worst = 0;
    secondStart = now;
  }
}
export async function buildReport(extra: Record<string, unknown>) {
  let version = "dev";
  try {
    const r = await fetch("./version.txt", { cache: "no-store" });
    const text = (await r.text()).trim();
    // Only the published build has version.txt (a dev server answers with the page).
    if (r.ok && text.length < 120 && !text.startsWith("<")) version = text;
  } catch {}
  const last = seconds.slice(-30),
    avg = last.length ? Math.round(last.reduce((n, s) => n + s.fps, 0) / last.length) : 0;
  const lines = [
    "ROPExpanse — raport błędu",
    `Wersja: ${version}`,
    `Czas: ${new Date().toISOString()} (gra od ${started.toISOString().slice(11, 19)})`,
    `Urządzenie: ${navigator.userAgent}`,
    `Ekran: ${innerWidth}×${innerHeight} @${devicePixelRatio} · ${screen.orientation?.type ?? ""}`,
    ...Object.entries(extra).map(([k, v]) => `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`),
    "",
    `FPS (ostatnie 30 s): średnio ${avg}, najgorsza klatka ${Math.max(0, ...last.map((s) => s.worst))} ms`,
    `FPS co sekundę: ${seconds.slice(-60).map((s) => s.fps).join(" ")}`,
    "",
    `Zacięcia > 80 ms (${spikes.length}):`,
    ...spikes.map((s) => `  ${s.at} ${s.ms} ms · ${s.context}`),
    "",
    `Błędy (${errors.length}):`,
    ...errors.map((e) => `  ${e}`),
  ];
  return lines.join("\n");
}
