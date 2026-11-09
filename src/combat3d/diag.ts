// Gameplay diagnostics, enabled with ?diag=1. Records frame times, stutter spikes
// with their context, long tasks and game events, and builds a plain-text report
// the player can copy or download. Nothing is sent anywhere.
export type DiagSample = {
  draw: number;
  tri: number;
  geometries: number;
  programs: number;
  regions: number;
  visible: number;
  x: number;
  z: number;
  enemiesNear: number;
  state: string;
};
type Second = { t: number; frames: number[]; update: number; render: number; s: DiagSample; heap: number };
const STORE = "exp-lore:combat3d:diag";
const MAX_SECONDS = 900,
  MAX_SPIKES = 400,
  MAX_EVENTS = 600;

export class Diag {
  readonly on: boolean;
  private t0 = performance.now();
  private seconds: string[] = [];
  private spikes: string[] = [];
  private events: string[] = [];
  private recent: { t: number; text: string }[] = [];
  private cur: Second | null = null;
  private last: DiagSample | null = null;
  private window: number[] = [];
  private header: Record<string, string | number> = {};
  private longTasks = 0;
  private longMs = 0;
  private savedAt = 0;
  worst = 0;
  spikeCount = 0;
  fps = 0;

  constructor() {
    this.on = new URLSearchParams(location.search).has("diag");
    if (!this.on) return;
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          this.longTasks++;
          this.longMs += e.duration;
          this.event("długie zadanie JS", `${Math.round(e.duration)} ms`);
        }
      }).observe({ type: "longtask", buffered: false });
    } catch {
      /* Not every browser reports long tasks. */
    }
    addEventListener("error", (e) => this.event("błąd", String(e.message)));
    addEventListener("unhandledrejection", (e) => this.event("błąd obietnicy", String(e.reason)));
  }
  /** Seconds since the page started. */
  now() {
    return (performance.now() - this.t0) / 1000;
  }
  setHeader(values: Record<string, string | number>) {
    Object.assign(this.header, values);
  }
  event(name: string, detail = "") {
    if (!this.on) return;
    const t = this.now(),
      text = detail ? `${name}: ${detail}` : name;
    this.events.push(`${t.toFixed(2)}s ${text}`);
    if (this.events.length > MAX_EVENTS) this.events.shift();
    this.recent.push({ t, text });
  }
  /** One rendered frame: interval since the previous frame and time spent in our code. */
  frame(rawMs: number, updateMs: number, renderMs: number, s: DiagSample) {
    if (!this.on) return;
    const t = this.now();
    // Spike: well above the recent median, or a frame slower than 50 ms.
    this.window.push(rawMs);
    if (this.window.length > 90) this.window.shift();
    const sorted = [...this.window].sort((a, b) => a - b),
      median = sorted[sorted.length >> 1] || 16;
    const prev = this.last ?? s;
    if (this.window.length > 10 && rawMs > Math.max(50, median * 2.2)) {
      this.spikeCount++;
      this.recent = this.recent.filter((e) => e.t > t - 0.6);
      const ctx = [
        `+geo ${s.geometries - prev.geometries}`,
        `+prog ${s.programs - prev.programs}`,
        `regiony ${s.visible}/${s.regions}`,
        `rys ${s.draw}`,
        `tri ${s.tri}`,
        s.state,
      ];
      const ev = this.recent.map((e) => e.text).join("; ");
      this.spikes.push(
        `${t.toFixed(2)}s ${Math.round(rawMs)} ms (mediana ${Math.round(median)}, logika ${updateMs.toFixed(1)}, render ${renderMs.toFixed(1)}) ${ctx.join(" · ")}${ev ? ` · zdarzenia: ${ev}` : ""}`,
      );
      if (this.spikes.length > MAX_SPIKES) this.spikes.shift();
    }
    this.recent = this.recent.filter((e) => e.t > t - 0.6);
    this.last = s;
    const sec = Math.floor(t);
    if (!this.cur || this.cur.t !== sec) {
      if (this.cur) this.flush();
      this.cur = { t: sec, frames: [], update: 0, render: 0, s, heap: 0 };
    }
    this.cur.frames.push(rawMs);
    this.cur.update += updateMs;
    this.cur.render += renderMs;
    this.cur.s = s;
    if (t - this.savedAt > 5) {
      this.savedAt = t;
      this.save();
    }
  }
  private flush() {
    const c = this.cur!,
      f = [...c.frames].sort((a, b) => a - b),
      n = f.length,
      heap = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize;
    this.fps = n;
    this.worst = Math.round(f[n - 1] || 0);
    const s = c.s;
    this.seconds.push(
      [
        c.t,
        n,
        Math.round(f[n >> 1] || 0),
        Math.round(f[Math.floor(n * 0.95)] || 0),
        Math.round(f[n - 1] || 0),
        (c.update / Math.max(1, n)).toFixed(1),
        (c.render / Math.max(1, n)).toFixed(1),
        s.draw,
        s.tri,
        s.geometries,
        s.programs,
        `${s.visible}/${s.regions}`,
        heap ? Math.round(heap / 1e6) : "-",
        `${Math.round(s.x)},${Math.round(s.z)}`,
        s.enemiesNear,
        s.state,
      ].join(" "),
    );
    if (this.seconds.length > MAX_SECONDS) this.seconds.shift();
  }
  report(final = true) {
    if (final && this.cur) {
      this.flush();
      this.cur = null;
    }
    const lines = [
      "ROPExpanse — raport diagnostyczny",
      ...Object.entries(this.header).map(([k, v]) => `${k}: ${v}`),
      `czas nagrania: ${this.now().toFixed(0)} s · skoki: ${this.spikeCount} · długie zadania JS: ${this.longTasks} (${Math.round(this.longMs)} ms)`,
      "",
      "== SKOKI (klatki znacznie dłuższe od mediany) ==",
      "logika/render = czas kodu gry w tej klatce; jeśli są małe, a klatka długa, czas zabrał GPU lub przeglądarka. +geo = nowe siatki wysłane do GPU.",
      ...this.spikes,
      "",
      "== ZDARZENIA ==",
      ...this.events,
      "",
      "== SEKUNDY ==",
      "s klatki mediana_ms p95_ms max_ms logika_ms render_ms rysowania trójkąty geometrie programy regiony_widoczne/wszystkie pamięć_MB pozycja wrogowie_blisko stan",
      ...this.seconds,
    ];
    return lines.join("\n");
  }
  save() {
    try {
      localStorage.setItem(STORE, this.report(false));
    } catch {
      /* Storage may be full or disabled. */
    }
  }
  /** The report of the previous session (kept when the page reloads or crashes). */
  static takePrevious() {
    try {
      const old = localStorage.getItem(STORE);
      if (old) localStorage.setItem(`${STORE}:prev`, old);
      return localStorage.getItem(`${STORE}:prev`);
    } catch {
      return null;
    }
  }
}
