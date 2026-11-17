// The inventory window (owner, 14 Nov 2026: calm, comfortable, no thinking where to tap).
// One layout for three tabs, the backpack always in the middle:
//   Plecak   — the hero on the left (what they wear, attack/defence/health), details right;
//   Skarbiec — the shared Vault on the left (goods, tix, stored items), details right;
//   Sklep    — the merchant on the left (wallet, potions), sale prices on the right.
// Tap = details with the main action as the first button; double tap (or double click)
// = that main action at once. Materials stack, gear compares itself with what is worn.
import {
  BALANCE,
  STOCK_KEYS,
  STOCK_NAMES,
  attackPower,
  armorPower,
  maxHealth,
  equip,
  unequip,
  transfer,
  compareWorn,
  countOf,
  sortItems,
  potionsOf,
  twistRope,
  collect,
  type Campaign,
  type Character,
  type Item,
  type Slot,
} from "./campaign";
import { ITEM_PATHS, itemIcon, itemStat, stockIcon, uiIcon } from "./icons";
import { PAYS, SHOP, buyPotion, payout, sell, sellMaterials, sellPrice, type Pay } from "./shop";
import { RARITY_COLORS } from "./wayfarers";

export type InvTab = "inventory" | "vault" | "shop";
export type Pick = { id: string; from: "bag" | "vault" | "worn" } | null;
export type InvContext = {
  state: Campaign;
  hero: Character;
  tab: InvTab;
  atCamp: boolean;
  pick: Pick;
  setPick: (p: Pick) => void;
  setTab: (t: InvTab) => void;
  rerender: () => void;
  /** After a change: saves, and refreshes the hero (gear changes the attack and skills). */
  changed: (gear?: boolean) => void;
  notify: (s: string) => void;
};

const RARITY_LABEL: Record<string, string> = {
  common: "Zwykły",
  uncommon: "Rzadki",
  rare: "Rzadki",
  epic: "Epicki",
  legendary: "Legendarny",
};
const SLOT_LABEL: Record<Slot | "material", string> = {
  weapon: "Broń",
  offhand: "Druga ręka",
  armor: "Zbroja",
  helmet: "Hełm",
  boots: "Buty",
  material: "Materiał",
};
const SLOT_GHOST: Record<Slot, string> = { weapon: "sword", offhand: "shield", armor: "armor", helmet: "helmet", boots: "boots" };
const PAY_LABEL: Record<Pay, (n: number) => string> = {
  tix: (n) => `${n} tix`,
  wood: (n) => `${n} drewna`,
  rope: (n) => `${n} m liny`,
  potions: (n) => (n === 1 ? "1 mikstura" : n > 1 && n < 5 ? `${n} mikstury` : `${n} mikstur`),
};
const PAY_ICON: Record<Pay, string> = { tix: uiIcon("tix"), wood: stockIcon("wood"), rope: stockIcon("rope"), potions: uiIcon("potion") };

function node<K extends keyof HTMLElementTagNameMap>(tag: K, text = "", cls = "") {
  const e = document.createElement(tag);
  if (text) e.textContent = text;
  if (cls) e.className = cls;
  return e;
}
function button(html: string, click: () => void, cls = "inv-btn") {
  const b = node("button", "", cls);
  b.type = "button";
  b.innerHTML = html;
  b.onclick = click;
  return b;
}
const rarityColor = (i: Item) =>
  RARITY_COLORS[(i.rarity === "uncommon" ? "rare" : (i.rarity ?? "common")) as keyof typeof RARITY_COLORS] ?? RARITY_COLORS.common;

const VAULT_ICON =
  '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#8b5c31" stroke="#4a3220" stroke-width="2" d="M4 13h24v14H4z"/><path fill="#b0793c" stroke="#4a3220" stroke-width="2" d="M4 13c0-6 4-8 12-8s12 2 12 8z"/><path fill="#e8c27a" d="M13 15h6v6h-6z"/><path stroke="#e8c27a" stroke-width="2" d="M4 18h24"/></svg>';
/** Taps on the same cell twice within this time count as a double tap. */
const DOUBLE_TAP_MS = 420;
let lastTap = { id: "", at: 0 };

/** One square with an item: icon, rarity frame, power or stack size, ▲ when better than worn. */
function cell(ctx: InvContext, item: Item | undefined, from: "bag" | "vault" | "worn", quick?: () => void) {
  const b = node("button", "", "inv-cell");
  b.type = "button";
  if (!item) {
    b.disabled = true;
    b.setAttribute("aria-label", "Puste pole");
    return b;
  }
  const cmp = from !== "worn" ? compareWorn(ctx.hero, item) : null;
  const badge =
    item.slot === "material"
      ? countOf(item) > 1
        ? `<span class="inv-count">×${countOf(item)}</span>`
        : ""
      : `<span class="inv-power">${item.power}</span>`;
  const better = cmp && cmp.delta > 0 ? `<span class="inv-up" title="Lepsze niż założone">▲</span>` : "";
  b.innerHTML = itemIcon(item) + badge + better;
  b.style.setProperty("--rarity", rarityColor(item));
  b.classList.add(`r-${item.rarity ?? "common"}`);
  b.setAttribute("aria-label", `${item.name}${countOf(item) > 1 ? ` ×${countOf(item)}` : ""}, ${itemStat(item)}`);
  b.title = `${item.name} · ${itemStat(item)}`;
  const selected = ctx.pick?.id === item.id;
  b.classList.toggle("selected", selected);
  b.setAttribute("aria-pressed", String(selected));
  b.onclick = () => {
    const now = performance.now();
    const double = lastTap.id === item.id && now - lastTap.at < DOUBLE_TAP_MS;
    lastTap = { id: item.id, at: now };
    if (double && quick) {
      lastTap = { id: "", at: 0 };
      quick();
      return;
    }
    ctx.setPick({ id: item.id, from });
    ctx.rerender();
  };
  return b;
}

function chip(icon: string, value: string, label: string, cls = "", shown = false) {
  const c = node("span", "", `inv-chip ${cls}`);
  c.innerHTML = `${icon}${shown ? `<span>${label}</span>` : ""}<b>${value}</b>`;
  c.title = label;
  c.setAttribute("aria-label", `${label}: ${value}`);
  return c;
}

export function renderInventory(body: HTMLElement, title: HTMLElement, ctx: InvContext) {
  const { state: s, hero: c } = ctx;
  if (!ctx.atCamp && ctx.tab !== "inventory") ctx.tab = "inventory";
  // Tabs in the title bar: the bag everywhere, Vault and Shop in a camp.
  title.replaceChildren();
  const tabs = node("div", "", "inv-tabs");
  tabs.setAttribute("role", "tablist");
  const tabList: [InvTab, string, string][] = [
    ["inventory", "Plecak", "bag"],
    ["vault", "Skarbiec", "vault"],
    ["shop", "Sklep", "shop"],
  ];
  for (const [t, label, icon] of tabList) {
    if (t !== "inventory" && !ctx.atCamp) continue;
    const b = button(`${icon === "vault" ? VAULT_ICON : uiIcon(icon)}<span>${label}</span>`, () => ctx.setTab(t), "inv-tab");
    b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", String(ctx.tab === t));
    b.setAttribute("aria-label", label);
    tabs.append(b);
  }
  title.append(tabs);

  const root = node("div", "", `inv inv-${ctx.tab}`);
  const bagList = c.bag;
  const vault = s.vault;
  const picked = ctx.pick;
  const pickedItem =
    picked?.from === "bag"
      ? bagList.find((i) => i.id === picked.id)
      : picked?.from === "vault"
        ? vault.find((i) => i.id === picked.id)
        : picked?.from === "worn"
          ? Object.values(c.equipment).find((i) => i?.id === picked.id)
          : undefined;
  if (picked && !pickedItem) ctx.setPick(null);

  // ---- Main actions (also used by the double tap) ----
  const toVault = (item: Item) => {
    transfer(bagList, vault, item.id);
    ctx.setPick(null);
    ctx.changed();
  };
  const toBag = (item: Item) => {
    if (!transfer(vault, bagList, item.id, BALANCE.slots)) ctx.notify("Plecak jest pełny");
    else ctx.setPick(null);
    ctx.changed();
  };
  const wear = (item: Item) => {
    if (item.slot === "material") return;
    equip(c, item.id);
    ctx.setPick({ id: item.id, from: "worn" });
    ctx.changed(true);
  };
  const takeOff = (item: Item) => {
    if (item.slot === "material") return;
    if (!unequip(c, item.slot)) ctx.notify("Plecak jest pełny");
    else ctx.setPick({ id: item.id, from: "bag" });
    ctx.changed(true);
  };
  const bagQuick = (item: Item) =>
    ctx.tab === "vault" ? () => toVault(item) : ctx.tab === "inventory" && item.slot !== "material" ? () => wear(item) : undefined;

  // ---- Left: the hero, the Vault or the merchant ----
  const side = node("section", "", "inv-side");
  if (ctx.tab === "inventory") {
    const doll = node("div", "", "inv-doll");
    for (const slot of ["helmet", "weapon", "armor", "offhand", "boots"] as const) {
      const item = c.equipment[slot];
      const b = item ? cell(ctx, item, "worn", () => takeOff(item)) : node("button", "", "inv-cell inv-empty");
      b.classList.add(`slot-${slot}`);
      if (!item) {
        (b as HTMLButtonElement).type = "button";
        (b as HTMLButtonElement).disabled = true;
        b.innerHTML = `<svg viewBox="0 0 56 56" aria-hidden="true">${ITEM_PATHS[SLOT_GHOST[slot]]}</svg><small>${SLOT_LABEL[slot]}</small>`;
        b.setAttribute("aria-label", `${SLOT_LABEL[slot]}: puste`);
      }
      doll.append(b);
    }
    const stats = node("div", "", "inv-stats");
    stats.append(
      chip(uiIcon("sword"), String(attackPower(c)), "Atak", "stat", true),
      chip(uiIcon("shield"), String(armorPower(c)), "Obrona", "stat", true),
      chip(uiIcon("heart"), `${Math.round(c.hp)}/${maxHealth(c)}`, "Zdrowie", "stat", true),
      chip(uiIcon("tix"), String(c.coins), "Tix", "stat", true),
      chip(uiIcon("potion"), String(potionsOf(c)), "Mikstury", "stat", true),
    );
    side.append(node("h3", c.name, "inv-head"), doll, stats);
  } else if (ctx.tab === "vault") {
    const head = node("div", "", "inv-head-row");
    head.append(node("h3", "Skarbiec", "inv-head"), node("span", `${vault.length}`, "inv-sub"));
    const money = node("div", "", "inv-money");
    money.append(chip(uiIcon("tix"), String(s.bank), "Tix w skarbcu"));
    const dep = button(`Wpłać${c.coins ? ` ${c.coins}` : ""}`, () => {
      s.bank += c.coins;
      c.coins = 0;
      ctx.changed();
    }, "inv-btn small");
    dep.disabled = !c.coins;
    dep.setAttribute("aria-label", "Wpłać");
    const wd = button(`Wypłać${s.bank ? ` ${s.bank}` : ""}`, () => {
      c.coins += s.bank;
      s.bank = 0;
      ctx.changed();
    }, "inv-btn small");
    wd.disabled = !s.bank;
    wd.setAttribute("aria-label", "Wypłać");
    money.append(dep, wd);
    const goods = node("div", "", "inv-goods");
    for (const k of STOCK_KEYS) goods.append(chip(stockIcon(k), `${s.stock[k]}${k === "rope" ? " m" : ""}`, STOCK_NAMES[k]));
    const acts = node("div", "", "inv-acts");
    const waiting = Object.entries(s.pending ?? {}).filter(([, v]) => (v ?? 0) >= 1);
    if (s.rates && Object.values(s.rates).some((v) => (v ?? 0) > 0)) {
      const take = button(
        `Zbierz z kręgów${waiting.length ? ` <small>${waiting.map(([k, v]) => `+${Math.floor(v ?? 0)}${k === "rope" ? " m" : ""} ${STOCK_NAMES[k as keyof typeof STOCK_NAMES].toLowerCase()}`).join(", ")}</small>` : ""}`,
        () => {
          collect(s);
          ctx.changed();
        },
        "inv-btn",
      );
      take.disabled = !waiting.length;
      take.setAttribute("aria-label", "Zbierz z kręgów");
      acts.append(take);
    }
    const twist = button(`Skręć linę <small>10 włókna → ${10 * BALANCE.ropePerFiber} m</small>`, () => {
      twistRope(s, 10);
      ctx.changed();
    });
    twist.setAttribute("aria-label", "Skręć linę");
    twist.disabled = s.stock.fiber < 10;
    acts.append(twist);
    const grid = node("div", "", "inv-grid inv-grid-vault");
    const cells = Math.max(16, Math.ceil((vault.length + 1) / 4) * 4);
    for (let i = 0; i < cells; i++) grid.append(cell(ctx, vault[i], "vault", vault[i] ? () => toBag(vault[i]) : undefined));
    side.append(head, money, goods, acts, grid);
  } else {
    const head = node("div", "", "inv-head-row");
    head.append(node("h3", "Kupiec", "inv-head"));
    const wallet = node("div", "", "inv-goods");
    wallet.append(
      chip(uiIcon("tix"), String(c.coins), "Tix"),
      chip(uiIcon("potion"), String(potionsOf(c)), "Mikstury"),
      chip(stockIcon("wood"), String(s.stock.wood), "Drewno"),
      chip(stockIcon("rope"), `${s.stock.rope} m`, "Lina"),
    );
    const buy = button(`${uiIcon("potion")}<span>Kup miksturę</span><small>${SHOP.potionPrice} tix</small>`, () => {
      if (buyPotion(c)) ctx.changed();
    }, "inv-btn inv-buy");
    buy.setAttribute("aria-label", "Kup miksturę");
    buy.disabled = c.coins < SHOP.potionPrice;
    const mats = bagList.filter((i) => i.slot === "material");
    const matTix = mats.reduce((n, i) => n + sellPrice(i), 0);
    const sellMats = button(`<span>Sprzedaj materiały</span><small>${matTix} tix</small>`, () => {
      const got = sellMaterials(c);
      if (got) ctx.notify(`Sprzedano materiały za ${got} tix`);
      ctx.setPick(null);
      ctx.changed();
    }, "inv-btn inv-buy");
    sellMats.setAttribute("aria-label", "Sprzedaj materiały");
    sellMats.disabled = !mats.length;
    side.append(head, wallet, buy, sellMats);
  }

  // ---- Middle: the backpack ----
  const bag = node("section", "", "inv-bag");
  const bagHead = node("div", "", "inv-head-row");
  bagHead.append(node("h3", "Plecak", "inv-head"), node("span", `${bagList.length}/${BALANCE.slots}`, "inv-sub"));
  const tools = node("div", "", "inv-tools");
  if (ctx.tab === "vault") {
    const allMats = button("Materiały do skarbca", () => {
      for (const i of bagList.filter((v) => v.slot === "material")) transfer(bagList, vault, i.id);
      ctx.setPick(null);
      ctx.changed();
    }, "inv-btn small");
    allMats.disabled = !bagList.some((i) => i.slot === "material");
    tools.append(allMats);
  }
  const sort = button(uiIcon("sort"), () => {
    sortItems(bagList);
    ctx.changed();
  }, "inv-btn small icon");
  sort.title = "Sortuj";
  sort.setAttribute("aria-label", "Sortuj plecak");
  tools.append(sort);
  bagHead.append(tools);
  const grid = node("div", "", "inv-grid inv-grid-bag");
  for (let i = 0; i < BALANCE.slots; i++) {
    const item = bagList[i];
    grid.append(cell(ctx, item, "bag", item ? bagQuick(item) : undefined));
  }
  bag.append(bagHead, grid);

  // ---- Right: details of the picked item and what can be done with it ----
  const info = node("aside", "", "inv-info");
  info.setAttribute("aria-live", "polite");
  if (!pickedItem) {
    const empty = node("div", "", "inv-placeholder");
    empty.innerHTML = `${uiIcon("bag")}<span>Wybierz przedmiot</span><small>${ctx.tab === "shop" ? "z plecaka, aby go sprzedać" : "dwa dotknięcia: " + (ctx.tab === "vault" ? "przenieś" : "załóż / zdejmij")}</small>`;
    info.append(empty);
  } else {
    const item = pickedItem;
    const top = node("div", "", "inv-info-top");
    const pic = node("div", "", `inv-pic r-${item.rarity ?? "common"}`);
    pic.innerHTML = itemIcon(item);
    pic.style.setProperty("--rarity", rarityColor(item));
    const name = node("div", "", "inv-name");
    const h = node("h3", item.name);
    h.style.color = rarityColor(item);
    name.append(
      h,
      node(
        "small",
        [item.slot === "material" ? "" : RARITY_LABEL[item.rarity ?? "common"], SLOT_LABEL[item.slot], item.level && item.level > 1 ? `poz. ${item.level}` : ""]
          .filter(Boolean)
          .join(" · "),
      ),
    );
    top.append(pic, name);
    info.append(top);
    if (item.slot === "material") {
      info.append(node("p", `Ilość: ${countOf(item)}`, "inv-stat"));
    } else {
      const stat = node("p", "", "inv-stat");
      stat.innerHTML = `<b>${item.slot === "weapon" ? "Atak" : "Obrona"} ${item.power}</b>`;
      const cmp = picked?.from !== "worn" ? compareWorn(c, item) : null;
      if (cmp) {
        const d = node(
          "span",
          cmp.delta > 0 ? `▲ ${cmp.delta}` : cmp.delta < 0 ? `▼ ${-cmp.delta}` : "=",
          `inv-delta ${cmp.delta > 0 ? "up" : cmp.delta < 0 ? "down" : ""}`,
        );
        d.title = cmp.worn ? `względem: ${cmp.worn.name} (${cmp.worn.power})` : "nic nie założone";
        stat.append(d);
        info.append(stat, node("small", cmp.worn ? `zamiast: ${cmp.worn.name}` : "pole jest puste", "inv-vs"));
      } else {
        info.append(stat);
        if (picked?.from === "worn") info.append(node("small", "założone", "inv-vs"));
      }
    }
    const acts = node("div", "", "inv-info-acts");
    if (ctx.tab === "shop") {
      if (picked?.from === "worn") {
        acts.append(node("small", "Zdejmij przedmiot, aby go sprzedać", "inv-vs"));
      } else {
        const price = sellPrice(item);
        const list = picked?.from === "vault" ? vault : bagList;
        acts.append(node("small", `Sprzedaj${countOf(item) > 1 ? ` (×${countOf(item)})` : ""} za:`, "inv-label"));
        for (const pay of PAYS) {
          const n = payout(price, pay);
          const b = button(`${PAY_ICON[pay]}<span>${PAY_LABEL[pay](n)}</span>`, () => {
            const got = sell(s, c, list, item.id, pay);
            if (got) ctx.notify(`Sprzedano: ${item.name} → ${PAY_LABEL[pay](got)}`);
            ctx.setPick(null);
            ctx.changed();
          }, `inv-btn inv-pay${pay === "tix" ? " primary" : ""}`);
          b.setAttribute("aria-label", `Sprzedaj za ${PAY_LABEL[pay](n)}`);
          b.disabled = n <= 0;
          acts.append(b);
        }
      }
    } else if (picked?.from === "worn") {
      acts.append(button("Zdejmij", () => takeOff(item), "inv-btn primary"));
    } else if (picked?.from === "vault") {
      acts.append(button("Do plecaka", () => toBag(item), "inv-btn primary"));
    } else {
      const wearBtn = item.slot !== "material" ? button("Załóż", () => wear(item), "inv-btn") : null;
      const store = ctx.atCamp ? button("Do skarbca", () => toVault(item), "inv-btn") : null;
      // The tab decides which is the main (first, highlighted) action.
      const order = ctx.tab === "vault" ? [store, wearBtn] : [wearBtn, store];
      order.forEach((b, i) => {
        if (!b) return;
        if (i === 0 || !order[0]) b.classList.add("primary");
        acts.append(b);
      });
    }
    info.append(acts);
  }
  root.append(side, bag, info);
  body.replaceChildren(root);
}

