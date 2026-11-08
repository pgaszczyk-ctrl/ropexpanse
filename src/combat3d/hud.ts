// Bold vector icons for the mobile HUD; no emoji or font-dependent combat symbols.
const paths: Record<string, string> = {
  sword: '<path d="m8 21 13-13 3-1-1 4L10 24M6 17l9 9M9 22l-4 5m-2-2 4 4"/>',
  magic: '<path d="m6 26 14-14m-3-4 3-5 3 5 5 3-5 3-3 5-3-5-5-3 5-3ZM5 5v6m-3-3h6m17 14v6m-3-3h6"/>',
  sweep: '<path d="M4 23C5 9 22 3 29 12M4 23l2-9m-2 9 9-3M12 26 25 13m-7-1 9 9"/>',
  potion: '<path d="M12 4h8m-7 0v8L7 23q-3 6 5 6h8q8 0 5-6l-6-11V4M10 20h12"/><path d="M16 20v6m-3-3h6"/>',
  fullscreen: '<path d="M4 12V4h8m8 0h8v8m0 8v8h-8M12 28H4v-8"/>',
  shard: '<path d="m16 3 9 9-9 18-9-18 9-9Z"/><path d="M7 12h18M16 3v27"/>',
  coin: '<circle cx="17" cy="17" r="12"/><path d="M17 10v14m-4-11q0-3 4-3t4 3-4 4-4 3 4 4 4-3"/>',
  menu: '<path d="M7 10h20M7 17h20M7 24h20"/>',
  compass: '<path d="m16 3 4 9 9 4-9 4-4 9-4-9-9-4 9-4 4-9Z"/><path d="m12 20 8-8-2 6-6 2Z"/>',
  goggles: '<circle cx="10" cy="17" r="6"/><circle cx="24" cy="17" r="6"/><path d="M16 16h2M4 14 2 8m28 6 2-6M8 11V8h18v3"/>',
};
export function hudIcon(name: string) {
  return `<svg viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.compass}</svg>`;
}
export function mountHud() {
  document.querySelectorAll<HTMLElement>('[data-icon]').forEach(el => {
    el.innerHTML = hudIcon(el.dataset.icon!);
  });
}
