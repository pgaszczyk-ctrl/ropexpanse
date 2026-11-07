import * as T from "three";
import { territoryModel } from "./territory";
import { completedRoutes, invalidateTerritory } from "./territory-rules";
import { recruitmentProfile } from "./recruitment";
import { person, material, type Rig } from "./models";
import {
  BALANCE,
  activeCharacter,
  nearCamp,
  levelOf,
  maxHealth,
  roleName,
  equip,
  transfer,
  postOffer,
  resolveOffers,
  hire,
  cancelOffer,
  nextId,
  connectCamps,
  ropeAvailable,
  spendRope,
  twistRope,
  collect,
  STOCK_KEYS,
  STOCK_NAMES,
  type Campaign,
  type Camp,
  type Character,
  type Item,
} from "./campaign";
import { updateRope, routeLength, type Obstacle } from "./rope";
import { distance, type Point } from "./rules";
import { SCALE, type Geo } from "./world";
type Hooks = {
  scene: T.Scene;
  camera: T.Camera;
  state: Campaign;
  blocked: (p: Point, r: number) => boolean;
  obstacles: () => Obstacle[];
  contains: (p: Point) => boolean;
  combat: () => boolean;
  canAct: () => boolean;
  notify: (s: string) => void;
  save: () => void;
  switch: (c: Character) => void | Promise<void>;
  panel: (open: boolean) => void;
  travel: (geo: Geo) => Promise<void>;
  retry: () => void;
  worldStatus: () => { loading: boolean; error: string };
};
const el = <T extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id) as T;
function node<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text = "",
  cls = "",
) {
  const e = document.createElement(tag);
  e.textContent = text;
  e.className = cls;
  return e;
}
function button(text: string, click: () => void, cls = "") {
  const b = node("button", text, cls);
  b.type = "button";
  b.onclick = click;
  return b;
}
const paths: Record<string, string> = {
  sword:
    '<path fill="#a8b5ba" d="m40 5 7 2-2 8-23 25-8-8Z"/><path stroke="#4c5b60" stroke-width="5" d="m10 29 17 15M17 36 8 47"/>',
  staff:
    '<path stroke="#8b5c31" stroke-width="7" stroke-linecap="round" d="m14 47 20-34 8-4"/><path fill="#70c9e3" d="m33 5 10 1 5 10-11 4-8-7Z"/>',
  armor:
    '<path fill="#668b94" stroke="#3e5860" stroke-width="2" d="m15 10 9 5h8l9-5 9 14-8 7-3-5v23H17V26l-3 5-8-7Z"/><path stroke="#d4b575" stroke-width="3" d="M17 36h22"/>',
  helmet:
    '<path fill="#99a8ab" stroke="#53696f" stroke-width="2" d="M11 38V27a17 17 0 0 1 34 0v11l-10 8V29H21v17Z"/><path stroke="#d0aa63" stroke-width="4" d="M9 28h38"/>',
  shield:
    '<path fill="#9a6a3c" stroke="#5d452f" stroke-width="2" d="M28 6c8 4 14 5 20 5 0 19-6 31-20 39C14 42 8 30 8 11c6 0 12-1 20-5Z"/><path stroke="#c9ccc6" stroke-width="4" d="M28 9v38M12 22h32"/><circle cx="28" cy="22" r="5" fill="#d4b575"/>',
  orb: '<circle cx="28" cy="25" r="15" fill="#70c9e3" stroke="#2f6f85" stroke-width="2"/><circle cx="23" cy="20" r="4" fill="#e9fbff"/><path fill="#8b5c31" stroke="#5d452f" stroke-width="2" d="M17 40h22l-4 9H21Z"/>',
  boots:
    '<path fill="#8e643f" stroke="#5d452f" stroke-width="2" d="m15 8 17 2-3 22 14 9v8H10V34Z"/><path stroke="#d4b575" stroke-width="3" d="M14 18h17"/>',
};
const STOCK_ICONS: Record<string, string> = {
  wood: '<path fill="#8b5c31" stroke="#4a3220" stroke-width="2" d="M4 12h20v10H4z"/><ellipse cx="24" cy="17" rx="4" ry="5" fill="#d9a86a" stroke="#4a3220" stroke-width="2"/>',
  ore: '<path fill="#8f9aa0" stroke="#3e474c" stroke-width="2" d="m6 22 4-11 9-4 8 8-3 10H9Z"/><path fill="#d27a4a" d="m13 13 4-2 2 4-4 2Z"/>',
  fiber: '<path fill="none" stroke="#c9d36a" stroke-width="2.5" stroke-linecap="round" d="M16 28V8M16 20c-4-3-7-8-8-12M16 18c4-3 7-7 8-11"/>',
  herbs: '<path fill="#6fcf7a" stroke="#2f6b3a" stroke-width="1.5" d="M16 28c0-10 2-15 9-19-1 8-4 13-9 14M16 28C14 19 11 15 6 13c1 7 4 11 10 12"/><circle cx="16" cy="9" r="3" fill="#e98fc6"/>',
  rope: '<circle cx="16" cy="17" r="9" fill="none" stroke="#e8c27a" stroke-width="3"/><circle cx="16" cy="17" r="4" fill="none" stroke="#b0793c" stroke-width="2.5"/>',
};
/** Small picture of a gathered good (Vault and HUD). */
export function stockIcon(key: string) {
  return `<svg viewBox="0 0 32 32" aria-hidden="true">${STOCK_ICONS[key] ?? ""}</svg>`;
}
const CAMP_ICONS = {
  rope: '<path fill="none" stroke="#e8c27a" stroke-width="3" stroke-linecap="round" d="M5 25c4-9 8-9 11-3s7 6 11-5"/><path fill="#8b5c31" d="M3 23h5v7H3zM24 13h5v7h-5z"/><circle cx="26.5" cy="10" r="2.5" fill="#ffd27a"/>',
  vault:
    '<path fill="#8b5c31" stroke="#4a3220" stroke-width="2" d="M4 13h24v14H4z"/><path fill="#b0793c" stroke="#4a3220" stroke-width="2" d="M4 13c0-6 4-8 12-8s12 2 12 8z"/><path fill="#e8c27a" d="M13 15h6v6h-6z"/><path stroke="#e8c27a" stroke-width="2" d="M4 18h24"/>',
  recruit:
    '<circle cx="12" cy="10" r="5" fill="#e8c27a"/><path fill="#b0793c" d="M3 28c0-7 4-11 9-11s9 4 9 11z"/><path stroke="#8ff0bf" stroke-width="3" stroke-linecap="round" d="M25 9v10M20 14h10"/>',
};
/** What an item gives, in a few words. */
export function itemStat(item: Item) {
  return item.slot === "material"
    ? "materiał"
    : `${item.slot === "weapon" ? "Atak" : "Obrona"} ${item.power}`;
}
/** How far an offer's waiting time has gone, 0–100. */
function offerShare(o: { readyAt: number }) {
  return Math.max(
    0,
    Math.min(100, 100 - ((o.readyAt - Date.now()) / BALANCE.recruitmentMs) * 100),
  );
}
function itemBadge(item: Item) {
  return item.slot === "material"
    ? ""
    : `<span class="item-power" aria-hidden="true">${item.power}</span>`;
}
export function itemIcon(item: Item) {
  return `<svg viewBox="0 0 56 56" aria-hidden="true">${paths[item.icon] ?? paths.sword}</svg>`;
}
function mesh(
  group: T.Group,
  g: T.BufferGeometry,
  color: number,
  x: number,
  y: number,
  z: number,
) {
  const m = new T.Mesh(g, material(color));
  m.position.set(x, y, z);
  group.add(m);
  return m;
}
function campModel(c: Camp) {
  const g = new T.Group();
  g.position.set(c.x, 0, c.z);
  g.userData.campId = c.id;
  const tent = mesh(
    g,
    new T.CylinderGeometry(0, 1.8, 2.2, 4, 1, false, Math.PI / 4),
    0xbd9b65,
    -1.6,
    1.1,
    -1.2,
  );
  tent.scale.z = 0.8;
  mesh(g, new T.PlaneGeometry(0.7, 1.25), 0x4c5142, -1.6, 0.65, 0.12);
  mesh(g, new T.CylinderGeometry(0.13, 0.18, 1.7, 7), 0x82623d, 1.2, 0.85, 0.5);
  mesh(g, new T.BoxGeometry(1.5, 1.1, 0.14), 0x87643c, 1.2, 1.8, 0.5);
  mesh(g, new T.PlaneGeometry(0.62, 0.72), 0xe9d8b0, 1, 1.8, 0.58);
  mesh(g, new T.PlaneGeometry(0.4, 0.5), 0xdcc38f, 1.62, 1.9, 0.59);
  mesh(g, new T.CylinderGeometry(0.12, 0.16, 0.85, 7), 0x755235, 0, 0.43, 1.7);
  mesh(g, new T.TorusGeometry(0.18, 0.05, 6, 10), 0xc5a15c, 0, 0.75, 1.7);
  const highlight = new T.Mesh(
    new T.RingGeometry(2.7, 2.85, 40),
    new T.MeshBasicMaterial({
      color: 0xe6bb62,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    }),
  );
  highlight.rotation.x = -Math.PI / 2;
  highlight.position.y = 0.08;
  highlight.visible = false;
  g.add(highlight);
  g.userData.highlight = highlight;
  return g;
}
function ropeLine(points: Point[], time: number, live: boolean) {
  const out: T.Vector3[] = [];
  for (let j = 1; j < points.length; j++) {
    const a = points[j - 1],
      b = points[j],
      d = distance(a, b),
      count = Math.max(2, Math.ceil(d * 2));
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      out.push(
        new T.Vector3(
          a.x + (b.x - a.x) * t,
          Math.max(
            0.12,
            0.8 - Math.sin(Math.PI * t) * Math.min(0.65, d * 0.055),
          ) + (live ? Math.sin(time * 3 + t * 7) * 0.025 : 0),
          a.z + (b.z - a.z) * t,
        ),
      );
    }
  }
  return out;
}
export class Expedition {
  h: Hooks;
  group = new T.Group();
  campViews = new Map<string, T.Group>();
  waiting = new Map<string, Rig>();
  private territory = new T.Group();
  private liveLine = new T.Line(
    new T.BufferGeometry(),
    new T.LineBasicMaterial({ color: 0x795437 }),
  );
  private connections = new T.LineSegments(
    new T.BufferGeometry(),
    new T.LineBasicMaterial({ color: 0x886d49 }),
  );
  private marker = new T.Mesh(
    new T.RingGeometry(3.5, 3.6, 32),
    new T.MeshBasicMaterial({
      color: 0xd3b36b,
      transparent: true,
      opacity: 0.8,
      depthTest: false,
    }),
  );
  // Where a camp can stand when the hero's own spot is not allowed (shown instead of a message).
  private spots = new T.Group();
  private spotList: Point[] = [];
  /** Green circles currently shown (QA diagnostics). */
  get spotCount() {
    return this.spotList.length;
  }
  private spotPulse = 0;
  rope: { campId: string; points: Point[] } | null = null;
  selected: Camp | undefined;
  private menuCamp: Camp | undefined;
  private dialog: HTMLDialogElement;
  private body: HTMLElement;
  private title: HTMLElement;
  private previousFocus: HTMLElement | null = null;
  private selectedItem: string | null = null;
  private view = "";
  private offerItems = new Set<string>();
  private offerGold = 0;
  private clock = 0;
  private noticeClock = 0;
  constructor(h: Hooks) {
    this.h = h;
    h.scene.add(
      this.group,
      this.liveLine,
      this.connections,
      this.marker,
      this.territory,
      this.spots,
    );
    for (let i = 0; i < 3; i++) {
      const spot = new T.Group();
      const disc = new T.Mesh(
        new T.CircleGeometry(3.6, 40),
        new T.MeshBasicMaterial({ color: 0x6fd3a0, transparent: true, opacity: 0.18, depthWrite: false }),
      );
      const ring = new T.Mesh(
        new T.RingGeometry(3.3, 3.6, 40),
        new T.MeshBasicMaterial({ color: 0x8ff0bf, transparent: true, opacity: 0.85, depthTest: false }),
      );
      disc.rotation.x = ring.rotation.x = -Math.PI / 2;
      spot.add(disc, ring);
      spot.visible = false;
      this.spots.add(spot);
    }
    this.marker.rotation.x = -Math.PI / 2;
    this.marker.visible = false;
    document.body.insertAdjacentHTML(
      "beforeend",
      `<button id="action" class="context-action" aria-label="Akcja"><span>⚑</span><small id="action-label">Akcja</small></button><nav id="camp-menu" hidden aria-label="Obóz"></nav><dialog id="expedition-panel"><div class="panel-heading"><h2 id="panel-title"></h2><button id="panel-close" aria-label="Zamknij">×</button></div><div id="panel-body"></div></dialog><nav id="expedition-tools" aria-label="Wyprawa"><button id="inventory" aria-label="Ekwipunek">▦</button><button id="world-map" aria-label="Świat">◎</button></nav><button id="world-state" hidden></button>`,
    );
    this.dialog = el<HTMLDialogElement>("expedition-panel");
    this.body = el("panel-body");
    this.title = el("panel-title");
    el("panel-close").onclick = () => this.close();
    this.dialog.addEventListener("cancel", (e) => {
      e.preventDefault();
      this.close();
    });
    this.dialog.addEventListener("click", (e) => {
      if (e.target === this.dialog) {
        const b = this.dialog.getBoundingClientRect();
        const m = e as MouseEvent;
        if (
          m.clientX < b.left ||
          m.clientX > b.right ||
          m.clientY < b.top ||
          m.clientY > b.bottom
        )
          this.close();
      }
    });
    el("action").onclick = () => this.action();
    el("inventory").onclick = () => this.open("inventory");
    // Characters are switched by tapping the portrait (owner's design doc), not a "Wędrowiec ▾" button.
    const portrait = document.createElement("button");
    portrait.id = "characters";
    portrait.className = "portrait-switch";
    portrait.setAttribute("aria-label", "Wędrowcy");
    document.querySelector(".vitals")?.append(portrait);
    portrait.onclick = () => this.open("characters");
    el("world-map").onclick = () => this.open("world");
    el("world-state").onclick = () => h.retry();
    document.addEventListener("pointerdown", (e) => {
      if (!(e.target as HTMLElement).closest("#camp-menu,#world"))
        this.hideMenu();
    });
    document.addEventListener("keydown", (e) => {
      if (
        e.code === "Escape" &&
        !this.dialog.open &&
        (this.rope || !el("camp-menu").hidden)
      ) {
        e.preventDefault();
        this.rope = null;
        this.hideMenu();
      }
      if (e.code === "KeyE" && !this.dialog.open && !e.repeat) {
        e.preventDefault();
        this.action();
      }
      if (e.code === "KeyI" && !this.dialog.open) {
        e.preventDefault();
        this.open("inventory");
      }
    });
    this.refreshWorld();
  }
  close() {
    this.dialog.close();
    this.h.panel(false);
    this.previousFocus?.focus();
    this.view = "";
    this.selectedItem = null;
    this.h.save();
  }
  private open(view: string) {
    if (!this.h.canAct() && !this.dialog.open) return;
    this.hideMenu();
    this.view = view;
    this.selectedItem = null;
    if (!this.dialog.open) {
      this.previousFocus = document.activeElement as HTMLElement;
      this.dialog.showModal();
      this.h.panel(true);
    }
    this.render();
  }
  private render() {
    this.body.replaceChildren();
    const s = this.h.state,
      c = activeCharacter(s);
    el("characters").setAttribute("aria-label", `Wędrowcy · ${c.name}`);
    if (this.view === "characters") {
      this.title.textContent = "Postacie";
      for (const v of s.characters) {
        const b = button(
          `${v.name} · ${roleName(v.role)} · ${levelOf(v.exp)}`,
          async () => {
            if (v.id === c.id) return;
            if (this.rope || !nearCamp(s, c) || this.h.combat()) {
              this.h.notify("Wróć do obozu");
              return;
            }
            this.h.save();
            try {
              await this.h.switch(v);
              s.activeId = v.id;
              this.refreshWorld();
              this.close();
            } catch {
              this.h.notify("Mapa tej postaci jest niedostępna");
            }
          },
          "character-choice",
        );
        b.classList.toggle("selected", v.id === c.id);
        b.style.setProperty(
          "--portrait-color",
          `hsl(${v.appearance % 360} 25% 47%)`,
        );
        this.body.append(b);
      }
      return;
    }
    if (this.view === "world") {
      this.title.textContent = "Świat";
      const form = node("form");
      const lat = node("input"),
        lon = node("input");
      lat.type = lon.type = "number";
      lat.step = lon.step = "any";
      lat.required = lon.required = true;
      lat.min = "-90";
      lat.max = "90";
      lon.min = "-180";
      lon.max = "180";
      lat.placeholder = "Szerokość";
      lon.placeholder = "Długość";
      lat.setAttribute("aria-label", "Szerokość geograficzna");
      lon.setAttribute("aria-label", "Długość geograficzna");
      const go = button("Wyrusz", () => {});
      go.type = "submit";
      form.append(lat, lon, go);
      form.onsubmit = (e) => {
        e.preventDefault();
        void this.travel({ lat: Number(lat.value), lon: Number(lon.value) });
      };
      this.body.append(form);
      const places = [
        ["Lublin", 51.2482, 22.5681],
        ["Warszawa", 52.2297, 21.0122],
        ["Stambuł", 41.0082, 28.9784],
        ["Singapur", 1.3521, 103.8198],
        ["Nowy Jork", 40.7128, -74.006],
      ] as const;
      for (const [name, latitude, longitude] of places)
        this.body.append(
          button(
            name,
            () => void this.travel({ lat: latitude, lon: longitude }),
            "place-choice",
          ),
        );
      return;
    }
    if (this.view === "recruit") {
      this.recruit();
      return;
    }
    const vault = this.view === "vault";
    this.title.textContent = vault ? "Skarbiec" : "Ekwipunek";
    const layout = node("div", "", "inventory-layout");
    const col = node("div", "", "inventory-column");
    const count = node(
      "span",
      `${vault ? s.vault.length : c.bag.length} / ${vault ? "∞" : BALANCE.slots}`,
      "slot-count",
    );
    this.title.append(count);
    const gold = node("div", `${vault ? s.bank : c.coins} zł`, "gold-line");
    if (vault) {
      gold.append(
        button("Wpłać", () => {
          s.bank += c.coins;
          c.coins = 0;
          this.h.save();
          this.render();
        }),
        button("Wypłać", () => {
          c.coins += s.bank;
          s.bank = 0;
          this.h.save();
          this.render();
        }),
      );
    }
    col.append(gold);
    if (vault) {
      // Shared goods of the whole rope network.
      const goods = node("div", "", "stock-row");
      for (const k of STOCK_KEYS) {
        const cell = node("span", "", "stock-cell");
        cell.innerHTML = `${stockIcon(k)}<b>${s.stock[k]}${k === "rope" ? " m" : ""}</b>`;
        cell.title = STOCK_NAMES[k];
        cell.setAttribute("aria-label", `${STOCK_NAMES[k]}: ${s.stock[k]}`);
        goods.append(cell);
      }
      col.append(goods);
      const twist = button(
        `Skręć linę: 10 włókna → ${10 * BALANCE.ropePerFiber} m`,
        () => {
          twistRope(s, 10);
          this.h.save();
          this.render();
        },
      );
      twist.disabled = s.stock.fiber < 10;
      col.append(twist);
      // What the closed circles produced (also while you were away).
      const rates = s.rates;
      if (rates && Object.values(rates).some((v) => v > 0)) {
        const made = node("div", "", "stock-row production");
        for (const k of ["wood", "ore", "fiber", "herbs"] as const) {
          if (rates[k] <= 0) continue;
          const cell = node("span", "", "stock-cell");
          cell.innerHTML = `${stockIcon(k)}<b>+${Math.floor(s.pending?.[k] ?? 0)}</b><small>${rates[k].toFixed(1)}/h</small>`;
          cell.setAttribute("aria-label", `${STOCK_NAMES[k]}: ${Math.floor(s.pending?.[k] ?? 0)} czeka, ${rates[k].toFixed(1)} na godzinę`);
          made.append(cell);
        }
        const take = button("Zbierz z kręgów", () => {
          collect(s);
          this.h.save();
          this.render();
        });
        take.disabled = !Object.values(s.pending ?? {}).some((v) => v >= 1);
        col.append(made, take);
      }
    }
    const items = vault ? s.vault : c.bag,
      grid = node("div", "", "item-grid");
    const slots = vault
      ? Math.max(24, Math.ceil((items.length + 1) / 4) * 4)
      : BALANCE.slots;
    for (let i = 0; i < slots; i++) {
      const item = items[i],
        b = button(
          "",
          () => {
            this.selectedItem = item?.id ?? null;
            this.render();
          },
          "item-slot",
        );
      if (item) {
        b.innerHTML = itemIcon(item) + itemBadge(item);
        b.setAttribute("aria-label", `${item.name}, ${itemStat(item)}`);
        b.title = `${item.name} · ${itemStat(item)}`;
        b.classList.toggle("selected", this.selectedItem === item.id);
      } else {
        b.disabled = true;
        b.setAttribute("aria-label", "Puste pole");
      }
      grid.append(b);
    }
    col.append(grid);
    layout.append(col);
    const side = node("aside", "", "equipment");
    if (!vault) {
      for (const [slot, label] of [
        ["weapon", "Broń"],
        ["offhand", "Druga ręka"],
        ["armor", "Zbroja"],
        ["helmet", "Hełm"],
        ["boots", "Buty"],
      ] as const) {
        const item = c.equipment[slot];
        const b = button(
          item ? `${item.name} · ${item.power}` : label,
          () => {
            if (item && c.bag.length < BALANCE.slots) {
              delete c.equipment[slot];
              c.bag.push(item);
              c.hp = Math.min(c.hp, maxHealth(c));
              this.h.save();
              this.render();
            }
          },
          "equipment-slot",
        );
        side.append(b);
      }
    }
    const item = items.find((i) => i.id === this.selectedItem);
    if (item) {
      side.append(
        node("h3", item.name),
        node(
          "p",
          `${item.slot === "weapon" ? "Atak" : "Obrona"} ${item.power}`,
        ),
      );
      if (!vault && item.slot !== "material")
        side.append(
          button("Załóż", () => {
            equip(c, item.id);
            this.h.switch(c);
            this.h.save();
            this.render();
          }),
        );
      if (nearCamp(s, c))
        side.append(
          button(vault ? "Do plecaka" : "Do skarbca", () => {
            if (
              !transfer(
                items,
                vault ? c.bag : s.vault,
                item.id,
                vault ? BALANCE.slots : Infinity,
              )
            )
              this.h.notify("Plecak jest pełny");
            this.h.save();
            this.render();
          }),
        );
    }
    layout.append(side);
    this.body.append(layout);
  }
  private async travel(geo: Geo) {
    if (
      !nearCamp(this.h.state, activeCharacter(this.h.state)) ||
      this.h.combat() ||
      this.rope
    ) {
      this.h.notify("Wróć do obozu");
      return;
    }
    if (
      !Number.isFinite(geo.lat) ||
      Math.abs(geo.lat) > 90 ||
      !Number.isFinite(geo.lon) ||
      Math.abs(geo.lon) > 180
    )
      return;
    this.body.replaceChildren(node("p", "Wczytywanie mapy…"));
    try {
      await this.h.travel(geo);
      this.close();
      this.refreshWorld();
    } catch {
      this.body.replaceChildren(
        node("p", "Mapa jest niedostępna"),
        button("Spróbuj ponownie", () => void this.travel(geo)),
        button("Wróć", () => this.render()),
      );
    }
  }
  private recruit() {
    const s = this.h.state,
      c = activeCharacter(s),
      camp = this.menuCamp ?? nearCamp(s, c);
    this.title.textContent = "Twoja oferta";
    if (!camp || distance(camp, c) > BALANCE.safeRadius) {
      this.body.append(node("p", "Wróć do obozu"));
      return;
    }
    const o = s.offers.find((v) => v.campId === camp.id);
    if (o) {
      this.body.append(node("p", `${o.gold} zł · ${o.items.length} przedm.`));
      if (o.candidates !== null) {
        this.title.textContent = o.candidates.length
          ? "Zgłoszenia"
          : "Brak zgłoszeń";
        for (const v of o.candidates)
          this.body.append(
            button(
              `${v.name} · ${roleName(v.role)} · ${v.level} — Zatrudnij`,
              () => {
                const hired = hire(s, o.id, v.id);
                if (hired) {
                  this.h.save();
                  this.refreshWorld();
                  this.render();
                }
              },
              "candidate",
            ),
          );
      } else {
        const remaining = Math.max(
          0,
          Math.ceil((o.readyAt - Date.now()) / 1000),
        );
        const timer = node(
          "p",
          `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`,
          "offer-timer",
        );
        timer.id = "offer-timer";
        const bar = node("div", "", "offer-progress");
        bar.innerHTML = `<i id="offer-bar" style="width:${offerShare(o)}%"></i>`;
        bar.setAttribute("role", "progressbar");
        this.body.append(timer, bar);
      }
      this.body.append(
        button(
          o.candidates?.length === 0 ? "Odbierz ofertę" : "Wycofaj ofertę",
          () => {
            cancelOffer(s, o.id);
            this.h.save();
            this.render();
          },
        ),
      );
      return;
    }
    const form = node("form");
    // A slider with ±10/±50 steps: no on-screen keyboard and no "050" (owner's design doc).
    const gold = node("input");
    gold.type = "range";
    gold.min = "0";
    gold.max = String(c.coins);
    gold.step = "1";
    this.offerGold = Math.min(this.offerGold, c.coins);
    gold.value = String(this.offerGold);
    gold.setAttribute("aria-label", "Złoto w ofercie");
    const readout = node("output", `${this.offerGold} zł`, "gold-readout");
    const setGold = (v: number) => {
      this.offerGold = Math.max(0, Math.min(c.coins, Math.round(v)));
      gold.value = String(this.offerGold);
      readout.textContent = `${this.offerGold} zł`;
      updateProfile();
    };
    gold.oninput = () => setGold(Number(gold.value));
    const stepper = node("div", "", "gold-stepper");
    for (const d of [-50, -10, 10, 50])
      stepper.append(
        button(d > 0 ? `+${d}` : `−${-d}`, () => setGold(this.offerGold + d), "gold-step"),
      );
    stepper.insertBefore(readout, stepper.children[2]);
    form.append(stepper, gold);
    const grid = node("div", "", "offer-grid");
    for (const item of c.bag) {
      const b = button(
        "",
        () => {
          if (this.offerItems.has(item.id)) this.offerItems.delete(item.id);
          else this.offerItems.add(item.id);
          this.render();
        },
        "item-slot",
      );
      b.innerHTML = itemIcon(item) + itemBadge(item);
      b.setAttribute("aria-label", `${item.name}, ${itemStat(item)}`);
      b.title = `${item.name} · ${itemStat(item)}`;
      b.setAttribute("aria-pressed", String(this.offerItems.has(item.id)));
      b.classList.toggle("selected", this.offerItems.has(item.id));
      grid.append(b);
    }
    form.append(grid);
    const chosen = c.bag.filter((i) => this.offerItems.has(i.id));
    if (chosen.length) {
      const list = node("ul", "", "offer-items");
      for (const i of chosen)
        list.append(node("li", `${i.name} · ${itemStat(i)} · ${i.value} zł`));
      form.append(list);
    }
    const submit = button("Wystaw", () => {});
    submit.type = "submit";
    const summary = node("div", "", "recruitment-profile");
    const updateProfile = () => {
      const profile = recruitmentProfile(
        {
          gold: this.offerGold,
          items: c.bag.filter((i) => this.offerItems.has(i.id)),
          ceiling: levelOf(c.exp),
        },
        camp.buildings,
      );
      submit.disabled =
        !Number.isSafeInteger(this.offerGold) ||
        this.offerGold < 0 ||
        this.offerGold > c.coins ||
        !profile.chance;
      summary.replaceChildren(
        node("p", `Szansa zgłoszenia: ${Math.round(profile.chance * 100)}%`),
        node(
          "p",
          `Wojownik ${Math.round(profile.roles.warrior * 100)}% · Mag ${Math.round(profile.roles.mage * 100)}% · Łucznik ${Math.round(profile.roles.archer * 100)}%`,
        ),
        node(
          "p",
          `Poziom: ${profile.minLevel === profile.maxLevel ? profile.maxLevel : `${profile.minLevel}–${profile.maxLevel}`}`,
        ),
      );
    };
    updateProfile();
    form.append(summary);
    form.append(submit);
    form.onsubmit = (e) => {
      e.preventDefault();
      const o = postOffer(s, camp.id, this.offerGold, [...this.offerItems]);
      if (!o) {
        this.h.notify("Dodaj złoto lub przedmiot");
        return;
      }
      this.offerGold = 0;
      this.offerItems.clear();
      this.h.save();
      this.render();
    };
    this.body.append(form);
  }
  private hideMenu() {
    el("camp-menu").hidden = true;
  }
  private menu(camp: Camp) {
    this.menuCamp = camp;
    const menu = el("camp-menu");
    const item = (label: string, icon: string, click: () => void) => {
      const b = button("", click, "camp-item");
      b.innerHTML = `<svg viewBox="0 0 32 32" aria-hidden="true">${icon}</svg><span>${label}</span>`;
      b.setAttribute("aria-label", label);
      return b;
    };
    menu.replaceChildren(
      item("Rozciągnij linę", CAMP_ICONS.rope, () => {
        this.rope = {
          campId: camp.id,
          points: [
            { x: camp.x, z: camp.z },
            { ...activeCharacter(this.h.state) },
          ],
        };
        this.hideMenu();
      }),
      item("Skarbiec", CAMP_ICONS.vault, () => this.open("vault")),
      item("Rekrutuj", CAMP_ICONS.recruit, () => {
        this.offerGold = 0;
        this.offerItems.clear();
        this.open("recruit");
      }),
    );
    menu.hidden = false;
    this.positionMenu();
  }
  private positionMenu() {
    if (!this.menuCamp) return;
    const p = new T.Vector3(this.menuCamp.x, 2.6, this.menuCamp.z).project(
        this.h.camera,
      ),
      menu = el("camp-menu");
    menu.style.left = `${Math.max(10, Math.min(innerWidth - 195, ((p.x + 1) * innerWidth) / 2 + 30))}px`;
    menu.style.top = `${Math.max(10, Math.min(innerHeight - 160, ((1 - p.y) * innerHeight) / 2 - 40))}px`;
  }
  action() {
    if (!this.h.canAct()) return;
    if (this.rope) {
      this.place();
      return;
    }
    if (this.selected) this.menu(this.selected);
  }
  click(clientX: number, clientY: number) {
    if (!this.h.canAct()) return false;
    if (this.rope) {
      this.place();
      return true;
    }
    const v = new T.Vector2(
        (clientX / innerWidth) * 2 - 1,
        (-clientY / innerHeight) * 2 + 1,
      ),
      ray = new T.Raycaster();
    ray.setFromCamera(v, this.h.camera);
    const hits = ray.intersectObjects([...this.campViews.values()], true);
    if (hits.length) {
      let object: T.Object3D | null = hits[0].object;
      while (object && !object.userData.campId) object = object.parent;
      const camp = this.h.state.camps.find(
        (c) => c.id === object?.userData.campId,
      );
      if (camp) {
        if (distance(camp, activeCharacter(this.h.state)) > BALANCE.safeRadius)
          this.h.notify("Podejdź do obozu");
        else this.menu(camp);
        return true;
      }
    }
    this.hideMenu();
    return false;
  }
  private connectionTarget() {
    if (!this.rope) return undefined;
    const c = activeCharacter(this.h.state);
    return this.h.state.camps
      .filter(
        (camp) => camp.id !== this.rope!.campId && distance(camp, c) <= 2.4,
      )
      .sort((a, b) => distance(a, c) - distance(b, c))[0];
  }
  private connectingRoute() {
    const target = this.connectionTarget();
    return target && this.rope
      ? updateRope(this.rope.points, target, this.h.obstacles())
      : null;
  }
  private placementError() {
    const c = activeCharacter(this.h.state);
    if (!this.rope) return "";
    if (this.h.combat()) return "Najpierw zakończ walkę";
    const target = this.connectionTarget();
    if (target) {
      const route = this.connectingRoute();
      if (!route || routeLength(route) > this.ropeMax())
        return "Lina nie sięga obozu";
      const from = this.rope.campId,
        to = target.id,
        s = this.h.state;
      if (
        s.camps.some(
          (camp) =>
            (camp.id === from && camp.parentId === to) ||
            (camp.id === to && camp.parentId === from),
        ) ||
        s.connections?.some(
          (link) =>
            (link.from === from && link.to === to) ||
            (link.from === to && link.to === from),
        )
      )
        return "Obozy są już połączone";
      return "";
    }
    if (!this.h.contains(c)) return "Mapa jeszcze się wczytuje";
    if (
      this.h.state.camps.some((v) => distance(v, c) < BALANCE.minCampDistance)
    )
      return "Za blisko obozu";
    if (this.h.state.stock.wood < BALANCE.campWood)
      return `Potrzebujesz ${BALANCE.campWood} drewna`;
    if (routeLength(this.rope.points) > this.ropeMax())
      return "Lina jest za krótka";
    if (this.h.blocked(c, 3.6)) return "Brak miejsca na obóz";
    return "";
  }
  /** Longest rope the hero can run out now (stretch limit or what is left in the Vault). */
  private ropeMax() {
    return ropeAvailable(this.h.state, SCALE);
  }
  /** Up to three nearby places where the rope's next camp may stand. */
  private freeSpots(): Point[] {
    const s = this.h.state,
      c = activeCharacter(s);
    if (!this.rope || this.connectionTarget() || s.stock.wood < BALANCE.campWood)
      return [];
    const used = routeLength(this.rope.points),
      out: Point[] = [];
    for (let r = 2; r <= 26 && out.length < 3; r += 1.5)
      for (let a = 0; a < Math.PI * 2 && out.length < 3; a += Math.PI / 10) {
        const p = { x: c.x + Math.sin(a) * r, z: c.z + Math.cos(a) * r };
        if (
          used + r <= this.ropeMax() &&
          this.h.contains(p) &&
          !this.h.blocked(p, 3.6) &&
          s.camps.every((v) => distance(v, p) >= BALANCE.minCampDistance) &&
          out.every((q) => distance(q, p) >= 6)
        )
          out.push(p);
      }
    return out;
  }
  private place() {
    const reason = this.placementError();
    if (reason) {
      // A wrong spot is shown on the map (green circles), not explained in words.
      if (this.spotList.length) this.spotPulse = 1;
      else this.h.notify(reason);
      return;
    }
    const c = activeCharacter(this.h.state),
      s = this.h.state;
    const target = this.connectionTarget();
    if (target) {
      const route = this.connectingRoute();
      if (route && connectCamps(s, this.rope!.campId, target.id, route)) {
        spendRope(s, routeLength(route), SCALE);
        this.rope = null;
        this.refreshWorld();
        this.h.save();
        this.h.notify("Obozy połączone");
      }
      return;
    }
    const camp: Camp = {
      id: nextId(s, "camp"),
      x: c.x,
      z: c.z,
      parentId: this.rope!.campId,
      route: this.rope!.points.map((p) => ({ x: p.x, z: p.z })),
      buildings: 0,
    };
    s.camps.push(camp);
    c.campId = camp.id;
    s.stock.wood -= BALANCE.campWood;
    spendRope(s, routeLength(camp.route), SCALE);
    this.rope = null;
    this.countBuildings();
    this.refreshWorld();
    this.h.save();
  }
  moveAllowed(next: Point) {
    if (!this.rope) return true;
    const points = updateRope(this.rope.points, next, this.h.obstacles());
    if (!points || routeLength(points) > this.ropeMax()) return false;
    this.rope.points = points;
    return true;
  }
  cancelRope() {
    this.rope = null;
  }
  countBuildings() {
    for (const c of this.h.state.camps) {
      if (!this.h.contains(c)) continue;
      const ids = new Set<string>();
      this.h.obstacles().forEach((b, i) => {
        const ring = b.rings[0],
          x = ring.reduce((n, v) => n + v[0], 0) / ring.length,
          z = ring.reduce((n, v) => n + v[1], 0) / ring.length;
        if (distance(c, { x, z }) < BALANCE.safeRadius)
          ids.add((b as { id?: string }).id ?? `building-${i}`);
      });
      c.buildings = ids.size;
    }
  }
  refreshWorld() {
    invalidateTerritory(this.h.state);
    this.h.scene.remove(this.territory);
    this.disposeGeometry(this.territory);
    this.territory = territoryModel(this.h.state, this.h.contains);
    this.h.scene.add(this.territory);
    for (const v of this.campViews.values()) {
      this.group.remove(v);
      this.disposeGeometry(v);
    }
    this.campViews.clear();
    for (const c of this.h.state.camps) {
      if (!this.h.contains(c)) continue;
      const g = campModel(c);
      this.campViews.set(c.id, g);
      this.group.add(g);
    }
    for (const rig of this.waiting.values()) {
      this.group.remove(rig.root);
      this.disposeGeometry(rig.root);
    }
    this.waiting.clear();
    for (const c of this.h.state.characters) {
      if (c.id === this.h.state.activeId || !this.h.contains(c)) continue;
      const rig = person(
        c.role === "warrior" ? "hero" : "archer",
        c.appearance,
      );
      rig.root.position.set(c.x + 2.4, 0, c.z);
      rig.sword.visible = c.weapon === "sword";
      rig.wand.visible = c.weapon === "magic";
      this.waiting.set(c.id, rig);
      this.group.add(rig.root);
    }
    const points: T.Vector3[] = [];
    for (const route of completedRoutes(this.h.state)) {
      const list = ropeLine(route, 0, false);
      for (let i = 1; i < list.length; i++)
        if (this.h.contains(list[i]) && this.h.contains(list[i - 1]))
          points.push(list[i - 1], list[i]);
    }
    this.connections.geometry.dispose();
    this.connections.geometry = new T.BufferGeometry().setFromPoints(points);
    el("characters").setAttribute(
      "aria-label",
      `Wędrowcy · ${activeCharacter(this.h.state).name}`,
    );
  }
  private disposeGeometry(root: T.Object3D) {
    root.traverse((o) => {
      if (o instanceof T.Mesh) o.geometry.dispose();
    });
  }
  tick(dt: number, time: number) {
    this.clock += dt;
    const s = this.h.state,
      c = activeCharacter(s);
    this.selected = nearCamp(s, c);
    el("action-label").textContent = this.rope
      ? this.connectionTarget()
        ? "Połącz obozy"
        : "Wbij palik"
      : this.selected
        ? "Obóz"
        : "Akcja";
    el<HTMLButtonElement>("action").hidden = !this.rope && !this.selected;
    el("action").classList.toggle("active", !!this.rope || !!this.selected);
    for (const [id, g] of this.campViews) {
      const highlight = g.userData.highlight as T.Mesh;
      highlight.visible = id === this.selected?.id;
      (highlight.material as T.MeshBasicMaterial).opacity =
        0.45 + Math.sin(time * 3) * 0.15;
    }
    this.marker.visible = !!this.rope;
    if (this.rope) {
      const target = this.connectionTarget() ?? c;
      this.marker.position.set(target.x, 0.09, target.z);
      (this.marker.material as T.MeshBasicMaterial).color.set(
        this.placementError() ? 0xb57b69 : 0xe3c574,
      );
      if (this.clock > 0.05) {
        this.liveLine.geometry.dispose();
        this.liveLine.geometry = new T.BufferGeometry().setFromPoints(
          ropeLine(this.rope.points, time, true),
        );
      }
    }
    this.liveLine.visible = !!this.rope;
    this.spotPulse = Math.max(0, this.spotPulse - dt * 1.5);
    this.spots.children.forEach((spot, i) => {
      const p = this.spotList[i];
      spot.visible = !!p;
      if (!p) return;
      spot.position.set(p.x, 0.08, p.z);
      spot.scale.setScalar(1 + Math.sin(time * 4) * 0.04 + this.spotPulse * 0.25);
    });
    if (this.clock > 0.25) {
      const why = this.rope ? this.placementError() : "";
      this.spotList =
        why === "Brak miejsca na obóz" || why === "Za blisko obozu"
          ? this.freeSpots()
          : [];
      this.clock = 0;
      this.noticeClock += 0.25;
      this.positionMenu();
      const pending = s.offers.filter(
        (o) => o.candidates === null && Date.now() >= o.readyAt,
      );
      const changed = resolveOffers(s);
      if (changed) {
        this.h.save();
        this.h.notify(
          pending.some((o) => o.candidates?.length)
            ? "Nowe zgłoszenia do rekrutacji"
            : "Brak zgłoszeń do rekrutacji",
        );
        if (this.view === "recruit") this.render();
      } else if (
        this.view === "recruit" &&
        s.offers.some(
          (o) => o.campId === (this.menuCamp ?? nearCamp(s, c))?.id,
        ) &&
        this.noticeClock >= 1
      ) {
        this.noticeClock = 0;
        const o = s.offers.find((o) => o.campId === this.menuCamp?.id);
        const timer = document.getElementById("offer-timer");
        if (o && timer) {
          const remaining = Math.max(
            0,
            Math.ceil((o.readyAt - Date.now()) / 1000),
          );
          timer.textContent = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`;
          const fill = document.getElementById("offer-bar");
          if (fill) fill.style.width = `${offerShare(o)}%`;
        }
      }
      const status = this.h.worldStatus(),
        b = el("world-state");
      b.hidden = !status.error && !status.loading;
      b.textContent = status.error
        ? "Mapa niedostępna · ponów"
        : "Wczytywanie mapy…";
      el("characters").classList.toggle(
        "has-candidates",
        s.offers.some((o) => !!o.candidates?.length),
      );
    }
  }
  // Reproject persisted camp routes and character coordinates together.
  reproject(convert: (p: Point) => Point) {
    for (const c of this.h.state.characters) Object.assign(c, convert(c));
    for (const c of this.h.state.camps) {
      Object.assign(c, convert(c));
      c.route = c.route.map(convert);
    }
    for (const link of this.h.state.connections ?? [])
      link.route = link.route.map(convert);
    invalidateTerritory(this.h.state);
    this.cancelRope();
  }
}
