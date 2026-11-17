// Vector instrument faces; no emoji or font-dependent combat symbols.
const paths: Record<string, string> = {
  sword: '<path d="m8 21 13-13 3-1-1 4L10 24M6 17l9 9M9 22l-4 5m-2-2 4 4"/>',
  magic: '<path d="m6 26 14-14m-3-4 3-5 3 5 5 3-5 3-3 5-3-5-5-3 5-3ZM5 5v6m-3-3h6m17 14v6m-3-3h6"/>',
  sweep: '<path d="M4 23C5 9 22 3 29 12M4 23l2-9m-2 9 9-3M12 26 25 13m-7-1 9 9"/>',
  potion: '<path d="M12 4h8m-7 0v8L7 23q-3 6 5 6h8q8 0 5-6l-6-11V4M10 20h12"/><path d="M16 20v6m-3-3h6"/>',
  fullscreen: '<path d="M4 12V4h8m8 0h8v8m0 8v8h-8M12 28H4v-8"/>',
  compass: '<path d="m16 3 4 9 9 4-9 4-4 9-4-9-9-4 9-4 4-9Z"/><path d="m12 20 8-8-2 6-6 2Z"/>',
  goggles: '<circle cx="10" cy="17" r="6"/><circle cx="24" cy="17" r="6"/><path d="M16 16h2M4 14 2 8m28 6 2-6M8 11V8h18v3"/>',
  // Skill faces: the special button takes the active hero's skill.
  charge: '<path d="M4 17h14m-6-6 6 6-6 6M20 9l10 8-10 8"/>',
  whirl: '<path d="M17 5a12 12 0 1 1-11 8m11-8-4 4m4-4 4 4"/><path d="m12 17 10-6-4 11Z"/>',
  quake: '<path d="M3 26h28M8 26l3-6 3 3 3-8 3 6 2-3 4 8M17 4v7m-5-4 5 4 5-4"/>',
  fireball: '<circle cx="20" cy="20" r="7"/><path d="M14 15 4 5m11 4L9 3m10 6-3-6M15 20H5"/>',
  volley: '<path d="M5 29 26 8m-5 0h5v5M5 29l12-21m-4 1 4-1 1 4M5 29 29 19m-4-3 4 3-3 3"/>',
  heal: '<path d="M17 29S4 21 4 12a6 6 0 0 1 13-3 6 6 0 0 1 13 3c0 9-13 17-13 17Z"/><path d="M17 13v8m-4-4h8"/>',
  taunt: '<path d="M17 4 28 8v8c0 7-5 11-11 14C11 27 6 23 6 16V8Z"/><path d="M13 13l8 8m0-8-8 8"/>',
  manaShield: '<circle cx="17" cy="17" r="12"/><path d="m17 9 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z"/>',
};
export function hudIcon(name: string) {
  return `<svg viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.compass}</svg>`;
}
/** Lays out the round buttons on an arc around Attack (owner's design doc, HUD):
 * evenly from the left of Attack (180°) upwards, the special first, the second-hand
 * skill (if any) next, the potion last; the action/Camp button sits right above Attack.
 * Radius grows so neighbours never touch. Cheap: re-runs only when something changed. */
let arcKey = "";
export function layoutArc() {
  const attack = document.getElementById("attack-stick");
  if (!attack) return;
  const ring = ["sweep", "skill2", "heal"]
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => !!el && !el.hidden);
  const action = document.getElementById("action");
  const showAction = !!action && !action.hidden;
  const a = attack.getBoundingClientRect();
  const menu = document.querySelector<HTMLElement>(".loadout"),
    tools = document.getElementById("expedition-tools");
  const m = menu?.getBoundingClientRect();
  const key = `${m ? `${m.left},${m.top},${m.height}|${tools?.offsetWidth}` : ""}${innerWidth}x${innerHeight}|${a.left},${a.top},${a.width}|${ring.map((e) => e.id + e.offsetWidth).join()}|${showAction ? action!.offsetWidth + "x" + action!.offsetHeight : "-"}`;
  if (key === arcKey) return;
  arcKey = key;
  const cx = a.left + a.width / 2,
    cy = a.top + a.height / 2,
    gap = 10,
    size = Math.max(...ring.map((e) => e.offsetWidth), 0),
    step = ring.length ? 90 / ring.length : 90,
    r = Math.max(a.width / 2 + gap + size / 2, (size + gap) / (2 * Math.sin((step * Math.PI) / 360)));
  ring.forEach((el, i) => {
    const t = ((180 - i * step) * Math.PI) / 180,
      w = el.offsetWidth,
      h = el.offsetHeight;
    Object.assign(el.style, { left: `${cx + r * Math.cos(t) - w / 2}px`, top: `${cy - r * Math.sin(t) - h / 2}px`, right: "auto", bottom: "auto" });
  });
  // The backpack sits right beside the menu button, top right.
  if (m && tools)
    Object.assign(tools.style, { left: `${m.left - 8 - tools.offsetWidth}px`, top: `${m.top + (m.height - tools.offsetHeight) / 2}px`, right: "auto", transform: "none" });
  if (showAction) {
    const w = action!.offsetWidth,
      h = action!.offsetHeight;
    Object.assign(action!.style, { left: `${cx - w / 2}px`, top: `${cy - Math.max(r, a.height / 2 + gap + h / 2) - h / 2}px`, right: "auto", bottom: "auto" });
  }
}
export function mountHud() {
  document.querySelectorAll<HTMLElement>('[data-icon]').forEach(el => {
    el.innerHTML = hudIcon(el.dataset.icon!);
  });
}
