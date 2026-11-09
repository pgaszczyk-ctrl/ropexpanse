import "./style.css";
import { mountHud, hudIcon } from "./hud";
mountHud();
import * as T from "three";
import { animate, material, person, sector, wolf, campProps, tent, type Rig } from "./models";
import {
  RULES as R,
  clamp,
  distance,
  inArc,
  segmentHitsCircle,
  deathExperience,
  onScreen,
  type Point,
} from "./rules";
import { World } from "./world.ts";
import { tileTemplate, TILE_SOURCE } from "./tiles.ts";
import type { Building, Road, AreaKind } from "./geo.ts";

/** The bundled Lublin extract: used when map tiles cannot be downloaded. */
type MapData = {
  origin: { lat: number; lon: number };
  scale: number;
  radius: number;
  buildings: Building[];
  roads: Road[];
  areas: { rings: number[][][]; water: boolean; name: string }[];
};
/** Map loaded before play: 2.5 km around the hero (5 km across). */
const LOAD_RADIUS = 2500 * 0.18;
/** Regions farther than this from a new camp are freed. */
const KEEP_RADIUS = 4200 * 0.18;
type Enemy = {
  id: number;
  rig: Rig;
  spawn: Point;
  hp: number;
  maxHp: number;
  kind: "wolf" | "archer";
  elite: boolean;
  state: "idle" | "windup" | "strike" | "recover" | "dead";
  timer: number;
  heading: number;
  hit: boolean;
  flash: number;
  bar: T.Group;
  fill: T.Mesh;
  warning: T.Mesh;
  respawn: number;
  /** Seconds spent far from the hero and out of sight. */
  far: number;
};
type Shot = {
  node: T.Mesh;
  fromEnemy: boolean;
  vx: number;
  vz: number;
  life: number;
  damage: number;
};
type Particle = {
  node: T.Mesh;
  velocity: T.Vector3;
  life: number;
  total: number;
};
type Save = {
  v: 1;
  x: number;
  z: number;
  exp: number;
  fragments: number;
  kills: number;
  hp: number;
  weapon: "sword" | "magic";
  coins: number;
  hx?: number;
  hz?: number;
};
const $ = <E extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id) as E;
const SAVE_KEY = "exp-lore:combat3d:v1";
const scene = new T.Scene();
scene.background = new T.Color(0xcbd5b8);
scene.fog = new T.Fog(0xcbd5b8, 55, 115);
const canvas = $<HTMLCanvasElement>("world");
let renderer: T.WebGLRenderer;
const safeGraphics =
  new URLSearchParams(location.search).get("quality") === "safe";
const compatibility =
  safeGraphics ||
  matchMedia("(pointer: coarse)").matches ||
  new URLSearchParams(location.search).get("quality") === "low";
let contextLost = false,
  rendererFault = "",
  frameChecks = 3,
  frameHealthy = false;
let fullscreenState = "idle";
function rendererProblem(message: string) {
  rendererFault = message;
  frameHealthy = false;
  resetInput();
  persist();
  $("renderer-error-text").textContent = message;
  $("renderer-details").textContent =
    `Tryb ${compatibility ? "zgodności" : "standardowy"} · ${location.protocol} · ${innerWidth}×${innerHeight} · próba 03`;
  $("renderer-error").hidden = false;
}
async function enterFullscreen() {
  if (document.fullscreenElement) return;
  if (!document.documentElement.requestFullscreen) {
    fullscreenState = "unavailable";
    return;
  }
  fullscreenState = "requesting";
  try {
    // Called directly by Start/click, before any await or login/network work.
    await document.documentElement.requestFullscreen({ navigationUI: "hide" });
    fullscreenState = "active";
    const orientation = screen.orientation as ScreenOrientation & {
      lock?: (mode: string) => Promise<void>;
    };
    if (matchMedia("(pointer: coarse)").matches) {
      try {
        await orientation.lock?.("landscape");
      } catch {
        /* Rotation overlay remains available. */
      }
    }
  } catch {
    fullscreenState = "unavailable";
  }
  if (ready) {
    resize();
    frameChecks = 3;
  }
}
function checkDrawingBuffer() {
  const gl = renderer.getContext();
  if (gl.isContextLost()) return;
  const colors = new Set<string>(),
    pixel = new Uint8Array(4);
  for (const x of [0.2, 0.5, 0.8])
    for (const y of [0.2, 0.5, 0.8]) {
      gl.readPixels(
        Math.floor(gl.drawingBufferWidth * x),
        Math.floor(gl.drawingBufferHeight * y),
        1,
        1,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixel,
      );
      if (pixel[3]) colors.add(`${pixel[0]},${pixel[1]},${pixel[2]}`);
    }
  frameHealthy = colors.size > 1;
  if (!frameHealthy && frameChecks === 1)
    rendererProblem(
      "Interfejs działa, ale przeglądarka nie wyświetla świata 3D. Spróbuj trybu zgodności lub otwórz grę bezpośrednio w Chrome.",
    );
}
const camera = new T.OrthographicCamera(-25, 25, 25, -25, 0.1, 220);
const hero = person(),
  player = { x: 0, z: 0, hp: 100, exp: 0, kills: 0, fragments: 0, coins: 40 };
const maxHp = () => 100 + Math.floor(player.exp / 60) * 8;
let weapon: "sword" | "magic" = "sword",
  world: World,
  mapSource = "tiles",
  home: Point = { x: 0, z: 0 },
  ready = false,
  started = false,
  paused = false,
  helpOpen = false;
let time = 0,
  lastCombat = -100,
  lastAttack = -100,
  sweepReady = 0,
  potionReady = 0,
  invincibleUntil = 0,
  deathUntil = 0,
  lastSave = 0;
let heading = Math.PI,
  attack: {
    t: number;
    duration: number;
    hit: boolean;
    sweep: boolean;
    heading: number;
    ranged: boolean;
  } | null = null;
let mouseAim: { x: number; y: number } | null = null;
let move = { x: 0, z: 0 },
  keys = new Set<string>(),
  aiming = false;
let shake = 0,
  flashUntil = 0,
  toastUntil = 0,
  frames: number[] = [],
  lastHud = 0,
  occlusionClock = 0;
const enemies: Enemy[] = [],
  shots: Shot[] = [],
  particles: Particle[] = [],
  floating: {
    el: HTMLSpanElement;
    p: T.Vector3;
    life: number;
    total: number;
  }[] = [];
const scratch = new T.Vector3(),
  ray = new T.Raycaster(),
  ground = new T.Plane(new T.Vector3(0, 1, 0), 0),
  cameraTarget = new T.Vector3();
const aimView = sector(R.reach, R.halfArc, 0xffe6a3, 0.23);
aimView.position.y = 0.065;
scene.add(aimView);
aimView.visible = false;
const targetArrow = new T.Mesh(
  new T.ConeGeometry(0.33, 0.65, 3),
  material(0xf2bb55),
);
scene.add(targetArrow);
// Sound uses a small oscillator, no downloaded audio assets.
let audioContext: AudioContext | undefined,
  soundOn = false;

function notify(text: string) {
  $("toast").textContent = text;
  $("toast").classList.add("on");
  toastUntil = time + 3.2;
}
let edgeHintAt = -100,
  edgeClock = 0;
function mapEdgeHint(atEdge: boolean) {
  if (time - edgeHintAt < (atEdge ? 8 : 40) || camp) return;
  edgeHintAt = time;
  notify(
    mapSource !== "tiles"
      ? "To granica zapisanego wycinka Lublina."
      : atEdge
        ? "Dalej mapa nie jest jeszcze wczytana. Rozbij obóz (C), aby odkryć kolejne kilometry."
        : "Za niecały kilometr kończy się wczytana mapa. Rozbij obóz (C), aby wczytać dalsze tereny.",
  );
}
function sound(
  freq: number,
  duration = 0.06,
  type: OscillatorType = "triangle",
  volume = 0.055,
) {
  if (!soundOn || !audioContext) return;
  const ctx = audioContext,
    o = ctx.createOscillator(),
    g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, ctx.currentTime);
  o.frequency.exponentialRampToValueAtTime(
    freq * 0.45,
    ctx.currentTime + duration,
  );
  g.gain.setValueAtTime(volume, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  o.connect(g);
  g.connect(ctx.destination);
  o.start();
  o.stop(ctx.currentTime + duration);
}
function enableAudio() {
  try {
    audioContext ??= new AudioContext();
    void audioContext.resume();
  } catch {
    soundOn = false;
  }
}
function persist() {
  if (!ready || deathUntil > time) return;
  try {
    const save: Save = {
      v: 1,
      x: player.x,
      z: player.z,
      exp: player.exp,
      kills: player.kills,
      fragments: player.fragments,
      hp: player.hp,
      weapon,
      coins: player.coins,
      hx: home.x,
      hz: home.z,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch {
    /* Private browsers may disable storage. */
  }
}
function readSave(): Save | null {
  try {
    const s = JSON.parse(
      localStorage.getItem(SAVE_KEY) || "null",
    ) as Save | null;
    return s && s.v === 1 ? s : null;
  } catch {
    /* A corrupt lab save never affects a real character. */
    return null;
  }
}
function applySave(s: Save | null) {
  if (!s) return;
  for (const key of ["exp", "kills", "fragments", "coins"] as const)
    if (Number.isFinite(s[key])) player[key] = clamp(s[key], 0, 1e7);
  if (Number.isFinite(s.hp)) player.hp = clamp(s.hp, 1, maxHp());
  if (
    Number.isFinite(s.x) &&
    Number.isFinite(s.z) &&
    !blocked(s.x, s.z, R.radius)
  ) {
    player.x = s.x;
    player.z = s.z;
  }
  weapon = s.weapon === "magic" ? "magic" : "sword";
}
function blocked(x: number, z: number, r = 0.4) {
  return !world || world.blocked(x, z, r);
}
function lineClear(a: Point, b: Point) {
  const n = Math.ceil(distance(a, b) / 0.4);
  for (let i = 1; i < n; i++)
    if (blocked(a.x + ((b.x - a.x) * i) / n, a.z + ((b.z - a.z) * i) / n, 0.08))
      return false;
  return true;
}
function slide(p: Point, dx: number, dz: number, r: number) {
  if (!blocked(p.x + dx, p.z, r)) p.x += dx;
  if (!blocked(p.x, p.z + dz, r)) p.z += dz;
}
function safe(p: Point) {
  return distance(p, home) < R.safeRadius;
}
function findFree(wanted: Point) {
  if (!blocked(wanted.x, wanted.z, 0.7)) return { ...wanted };
  for (let r = 0.5; r < 30; r += 0.65)
    for (let a = 0; a < Math.PI * 2; a += 0.32) {
      const p = {
        x: wanted.x + Math.sin(a) * r,
        z: wanted.z + Math.cos(a) * r,
      };
      if (!blocked(p.x, p.z, 0.75)) return p;
    }
  throw new Error("Nie znaleziono przejścia na mapie");
}
function healthBar(width = 1.3, color = 0xb9d791) {
  const group = new T.Group(),
    back = new T.Mesh(
      new T.PlaneGeometry(width + 0.1, 0.18),
      new T.MeshBasicMaterial({ color: 0x25342d, depthTest: false }),
    ),
    fill = new T.Mesh(
      new T.PlaneGeometry(width, 0.1),
      new T.MeshBasicMaterial({ color, depthTest: false }),
    );
  fill.position.z = 0.01;
  group.add(back, fill);
  group.renderOrder = 10;
  return { group, fill };
}
const heroBar = healthBar(1.4);
scene.add(heroBar.group);
const sun = new T.DirectionalLight(0xffeed0, 2.4);
let shadowCenter: Point = { x: Infinity, z: Infinity };
// Land beyond the loaded map: darker, so the edge of the known world reads as such.
const unknownLand = new T.Mesh(
  new T.PlaneGeometry(1200, 1200),
  new T.MeshBasicMaterial({ color: 0x8b9276 }),
);
unknownLand.rotation.x = -Math.PI / 2;
unknownLand.position.y = -0.03;
const refuge = new T.Group(),
  refugeBeacon = new T.Group();
const campTent = tent();
campTent.root.visible = false;
const props = campProps();
function placeRefuge() {
  refuge.position.set(home.x, 0, home.z);
}
function buildWorld(save: Save | null) {
  sun.position.set(-28, 55, 25);
  sun.castShadow = !compatibility;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -60;
  sun.shadow.camera.right = 60;
  sun.shadow.camera.top = 60;
  sun.shadow.camera.bottom = -60;
  sun.shadow.camera.far = 160;
  sun.shadow.normalBias = 0.06;
  sun.shadow.bias = -0.0002;
  scene.add(sun, sun.target);
  scene.add(new T.HemisphereLight(0xe5f2df, 0x6b7557, 2));
  scene.add(unknownLand);
  const savedHome =
    save && Number.isFinite(save.hx) && Number.isFinite(save.hz)
      ? { x: save.hx!, z: save.hz! }
      : null;
  home =
    savedHome && !blocked(savedHome.x, savedHome.z, 0.7)
      ? savedHome
      : findFree({ x: 15, z: -13 });
  player.x = home.x;
  player.z = home.z;
  const safeDisc = new T.Mesh(
    new T.CircleGeometry(R.safeRadius, 64),
    new T.MeshBasicMaterial({
      color: 0x6ebcc1,
      transparent: true,
      opacity: 0.11,
      depthWrite: false,
    }),
  );
  safeDisc.rotation.x = -Math.PI / 2;
  safeDisc.position.y = 0.05;
  const safeRing = new T.Mesh(
    new T.RingGeometry(R.safeRadius - 0.055, R.safeRadius + 0.055, 64),
    new T.MeshBasicMaterial({
      color: 0xeff8d9,
      transparent: true,
      opacity: 0.8,
      side: T.DoubleSide,
    }),
  );
  safeRing.rotation.x = -Math.PI / 2;
  safeRing.position.y = 0.05;
  // The refuge is a prototype gameplay zone, not a claim about real-world safety.
  const beacon = new T.Mesh(
    new T.CylinderGeometry(0.23, 0.4, 2.8, 8),
    material(0x50766f),
  );
  beacon.position.set(-1.4, 1.4, 0);
  beacon.castShadow = true;
  const lamp = new T.Mesh(
    new T.IcosahedronGeometry(0.44, 1),
    new T.MeshStandardMaterial({
      color: 0xffd38b,
      emissive: 0xe7a847,
      emissiveIntensity: 1,
    }),
  );
  lamp.position.set(-1.4, 3, 0);
  refugeBeacon.add(beacon, lamp);
  refuge.add(safeDisc, safeRing, refugeBeacon);
  scene.add(refuge, campTent.root, props.stakeGroup, props.fire);
  placeRefuge();
  scene.add(hero.root);
  addBlobShadow(hero);
  hero.leftArm.add(props.stakeInHand);
  hero.rightArm.add(props.mallet, props.bundle);
  applySave(save);
  if (save && savedHome && distance(home, { x: 15, z: -13 }) > 1) {
    // A camp from an earlier session: show its tent instead of the city beacon.
    pitchTentAt(home, true);
  }
  selectWeapon(weapon);
  cameraTarget.set(player.x, 0, player.z);
  placeCamera();
  // Enemies start out of sight; later ones also appear only where the camera cannot see.
  for (let i = 0; i < 9; i++) spawnEnemy(spawnPoint() ?? fallbackSpot(i), i);
}
// ------------------------------------------------------------ camp
// Pitching a camp is a short scene: stakes hammered in, the tent taken out of the
// backpack and unfolded. Meanwhile the next kilometres of map load in the background.
type CampLayout = { at: Point; tentAt: Point; f: Point; s: Point; stakes: Point[]; fire: Point };
type Camp = CampLayout & {
  t: number;
  loaded: boolean;
  failed: number;
  done: number;
  total: number;
  finishing: number;
  strikes: number;
};
let camp: Camp | null = null;
const CAMP = { walk1: 0.6, hammer1: 2.2, walk2: 2.7, hammer2: 4.3, pack: 5.3, unfold: 6.9, rest: 7.3 };
function campLayout(at: Point): CampLayout | null {
  // Prefer a tent north of the hero: the camera then sees its door and the work in front of it.
  for (const [fx, fz] of [[0, -1], [-1, 0], [1, 0], [0, 1]]) {
    const tentAt = { x: at.x + fx * 2.5, z: at.z + fz * 2.5 };
    if (blocked(tentAt.x, tentAt.z, 1.5)) continue;
    const f = { x: fx, z: fz },
      s = { x: -fz, z: fx },
      corner = (a: number, b: number) => ({
        x: tentAt.x + f.x * a * 1.05 + s.x * b * 1.25,
        z: tentAt.z + f.z * a * 1.05 + s.z * b * 1.25,
      });
    return {
      at: { ...at },
      tentAt,
      f,
      s,
      stakes: [corner(-1, 1), corner(-1, -1), corner(1, 1), corner(1, -1)],
      fire: { x: at.x + s.x * 1.6 - f.x * 0.4, z: at.z + s.z * 1.6 - f.z * 0.4 },
    };
  }
  return null;
}
function pitchTentAt(at: Point, instant: boolean) {
  const layout = campLayout(at);
  if (!layout) return null;
  campTent.root.position.set(layout.tentAt.x, 0, layout.tentAt.z);
  campTent.root.rotation.y = Math.atan2(layout.f.x, layout.f.z) + Math.PI;
  campTent.root.scale.setScalar(instant ? 1 : 0.05);
  campTent.root.visible = instant;
  props.stakes.forEach((st, i) => {
    st.position.set(layout.stakes[i].x, instant ? -0.35 : 0, layout.stakes[i].z);
    st.visible = instant;
  });
  props.fire.position.set(layout.fire.x, 0, layout.fire.z);
  props.fire.visible = instant;
  refugeBeacon.visible = false;
  return layout;
}
function campBlocker() {
  if (!started || paused || helpOpen || orientationHeld || deathUntil > time) return "";
  if (camp) return "";
  if (
    time - lastCombat < 4 ||
    enemies.some((e) => e.state !== "dead" && distance(player, e.rig.root.position) < 14)
  )
    return "Najpierw odejdź od wrogów — obozu nie rozbija się w trakcie walki.";
  return "ok";
}
function startCamp() {
  const why = campBlocker();
  if (why !== "ok") {
    if (why) notify(why);
    return;
  }
  const at = { x: player.x, z: player.z },
    layout = pitchTentAt(at, false);
  if (!layout) {
    notify("Za ciasno na namiot. Znajdź kawałek wolnego terenu.");
    return;
  }
  attack = null;
  resetInput();
  camp = { ...layout, t: 0, loaded: false, failed: 0, done: 0, total: 0, finishing: 0, strikes: 0 };
  // The camp becomes the new refuge at once: enemies back off while the tent goes up.
  home = { ...at };
  placeRefuge();
  heading = Math.atan2(layout.f.x, layout.f.z);
  hero.sword.visible = false;
  hero.wand.visible = false;
  const current = camp;
  if (mapSource === "tiles")
    world
      .ensure(at, LOAD_RADIUS, (done, total, failed) => {
        current.done = done;
        current.total = total;
        current.failed = failed;
      })
      .then(() => (current.loaded = true))
      .catch(() => (current.loaded = true));
  else current.loaded = true;
  campStatus();
  persist();
}
function campStatus() {
  if (!camp) return;
  const map =
    mapSource !== "tiles"
      ? ""
      : camp.loaded
        ? " · mapa gotowa"
        : camp.total
          ? ` · wczytuję kolejne kilometry mapy ${camp.done} / ${camp.total}`
          : " · sprawdzam okolicę";
  $("toast").textContent = `Rozbijasz obóz${map}`;
  $("toast").classList.add("on");
  toastUntil = time + 1;
}
const ease = (x: number) => 1 - (1 - x) ** 3;
const backOut = (x: number) => 1 + 2.4 * (x - 1) ** 3 + 1.4 * (x - 1) ** 2;
function crouch() {
  hero.root.position.y = -0.22;
  hero.leftLeg.rotation.x = -1.05;
  hero.rightLeg.rotation.x = 0.85;
  hero.body.position.y = 0.94;
}
function hammer(c: Camp, start: number, stake: number) {
  const u = clamp((c.t - start) / 1.6, 0, 0.999),
    k = u * 4,
    s = k % 1,
    // A blow lands just before each swing ends.
    landed = Math.floor(k + 0.05);
  crouch();
  props.mallet.visible = true;
  props.stakeInHand.visible = false;
  hero.leftArm.rotation.x = -0.75;
  hero.rightArm.rotation.x =
    s < 0.62 ? -0.85 - 1.75 * ease(s / 0.62) : -2.6 + 1.75 * ((s - 0.62) / 0.38) ** 2;
  const st = props.stakes[stake];
  st.visible = true;
  st.position.set(c.stakes[stake].x, -0.085 * landed, c.stakes[stake].z);
  while (c.strikes < stake * 4 + landed) {
    c.strikes++;
    sound(170, 0.05, "square", 0.05);
    burst(c.stakes[stake], 0xb7a27a, 3);
    shake = Math.max(shake, 0.04);
  }
}
function walkTo(c: Camp, from: Point, to: Point, a: number, b: number, dt: number) {
  const u = clamp((c.t - a) / (b - a), 0, 1);
  player.x = from.x + (to.x - from.x) * u;
  player.z = from.z + (to.z - from.z) * u;
  animate(hero, dt, u < 1, 0, false);
}
function updateCamp(dt: number) {
  const c = camp!;
  c.t += dt;
  const t = c.t;
  hero.root.position.y = 0;
  hero.rightArm.rotation.set(0, 0, -0.12);
  hero.leftArm.rotation.set(0, 0, 0);
  props.mallet.visible = false;
  props.bundle.visible = false;
  // Kneeling spots just short of the two front stakes.
  const spot = (i: number) => ({
    x: c.stakes[i].x - c.f.x * 0.95,
    z: c.stakes[i].z - c.f.z * 0.95,
  });
  heading = Math.atan2(c.f.x, c.f.z);
  if (t < CAMP.walk1) {
    walkTo(c, c.at, spot(0), 0, CAMP.walk1, dt);
    props.stakeInHand.visible = true;
    hero.leftArm.rotation.x = -0.5;
  } else if (t < CAMP.hammer1) {
    animate(hero, dt, false, 0, false);
    hammer(c, CAMP.walk1, 0);
  } else if (t < CAMP.walk2) {
    walkTo(c, spot(0), spot(1), CAMP.hammer1, CAMP.walk2, dt);
    props.stakeInHand.visible = true;
    hero.leftArm.rotation.x = -0.5;
  } else if (t < CAMP.hammer2) {
    animate(hero, dt, false, 0, false);
    hammer(c, CAMP.walk2, 1);
  } else if (t < CAMP.pack) {
    walkTo(c, spot(1), c.at, CAMP.hammer2, CAMP.hammer2 + 0.4, dt);
    // Reach over the shoulder into the backpack, then bring the tent round.
    const u = (t - CAMP.hammer2) / (CAMP.pack - CAMP.hammer2);
    props.stakeInHand.visible = false;
    if (u > 0.35) {
      hero.rightArm.rotation.x =
        u < 0.6 ? 1.3 * ((u - 0.35) / 0.25) : 1.3 - 2.3 * ease((u - 0.6) / 0.4);
      props.bundle.visible = u > 0.55;
      hero.body.rotation.y = u < 0.6 ? 0.5 : 0.5 * (1 - (u - 0.6) / 0.4);
    }
  } else if (t < CAMP.unfold) {
    animate(hero, dt, false, 0, false);
    const u = (t - CAMP.pack) / (CAMP.unfold - CAMP.pack);
    hero.rightArm.rotation.x = -1 - Math.sin(u * Math.PI) * 1.2;
    hero.leftArm.rotation.x = -1 - Math.sin(u * Math.PI) * 1.2;
    props.bundle.visible = u < 0.12;
    const grow = backOut(clamp((u - 0.1) / 0.75, 0, 1));
    campTent.root.visible = u >= 0.1;
    campTent.root.scale.set(0.35 + 0.65 * grow, Math.max(0.05, grow), 0.6 + 0.4 * grow);
    if (u > 0.55 && !props.stakes[2].visible) {
      for (const i of [2, 3]) {
        props.stakes[i].visible = true;
        props.stakes[i].position.set(c.stakes[i].x, -0.35, c.stakes[i].z);
      }
      sound(240, 0.12, "triangle", 0.04);
    }
  } else {
    // Rest by the fire until the map is ready.
    campTent.root.scale.setScalar(1);
    props.fire.visible = true;
    animate(hero, dt, false, 0, false);
    crouch();
    hero.rightArm.rotation.x = -0.6;
    hero.leftArm.rotation.x = -0.6;
    heading = Math.atan2(c.fire.x - player.x, c.fire.z - player.z);
    if (t >= CAMP.rest && c.loaded && !c.finishing) {
      c.finishing = t;
      world.unloadFar(home, KEEP_RADIUS, [home]);
      const msg =
        mapSource !== "tiles"
          ? "Obóz rozbity — to Twoje nowe schronienie."
          : c.failed
            ? `Obóz rozbity. Części mapy nie udało się pobrać (${c.failed}) — tam teren pozostaje nieznany.`
            : "Obóz rozbity — to Twoje nowe schronienie. Mapa na 2,5 km wokół jest gotowa.";
      notify(msg);
      persist();
    }
    if (c.finishing && t > c.finishing + 0.9) {
      camp = null;
      hero.root.position.y = 0;
      props.mallet.visible = false;
      selectWeapon(weapon);
      return;
    }
  }
  if (!c.finishing) campStatus();
  hero.root.position.x = player.x;
  hero.root.position.z = player.z;
  hero.root.rotation.y = heading;
}
function placeCamera() {
  camera.position.set(cameraTarget.x, 39, cameraTarget.z + 30);
  camera.lookAt(cameraTarget.x, 0, cameraTarget.z);
  camera.updateMatrixWorld();
}
function onCamera(p: Point) {
  for (const y of [0.2, 2.2]) {
    scratch.set(p.x, y, p.z).project(camera);
    if (onScreen(scratch.x, scratch.y, 0.2)) return true;
  }
  return false;
}
/** A free spot near the hero that the camera cannot see and that is not in a safe place. */
function spawnPoint(): Point | null {
  for (let i = 0; i < 80; i++) {
    const a = Math.random() * Math.PI * 2,
      r = 30 + Math.random() * 32,
      p = { x: player.x + Math.sin(a) * r, z: player.z + Math.cos(a) * r };
    if (
      blocked(p.x, p.z, 1.3) ||
      onCamera(p) ||
      distance(p, home) < R.safeRadius + 8 ||
      enemies.some((e) => e.state !== "dead" && distance(e.rig.root.position, p) < 5)
    )
      continue;
    return p;
  }
  return null;
}
function fallbackSpot(i: number): Point {
  for (let radius = 40; radius < 90; radius += 4)
    for (let a = 0.3 + i * 0.7; a < 0.3 + i * 0.7 + Math.PI * 2; a += 0.4) {
      const p = { x: home.x + Math.sin(a) * radius, z: home.z + Math.cos(a) * radius };
      if (!blocked(p.x, p.z, 1.3)) return p;
    }
  return findFree({ x: home.x + 30, z: home.z + 30 });
}
function addBlobShadow(rig: Rig) {
  rig.root.traverse((o) => {
    if (o instanceof T.Mesh) o.castShadow = false;
  });
  const m = new T.Mesh(
    new T.CircleGeometry(0.65, 16),
    new T.MeshBasicMaterial({
      color: 0x20382c,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    }),
  );
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.045;
  rig.root.add(m);
}
function spawnEnemy(p: Point, id: number) {
  const kind = id % 3 === 2 ? "archer" : "wolf",
    elite = id === 8,
    rig = kind === "wolf" ? wolf() : person("archer");
  rig.root.position.set(p.x, 0, p.z);
  if (elite) rig.root.scale.setScalar(1.25);
  scene.add(rig.root);
  addBlobShadow(rig);
  const { group: bar, fill } = healthBar(
    elite ? 1.8 : 1.15,
    elite ? 0xf2bc68 : 0xd9a27e,
  );
  scene.add(bar);
  const warning =
    kind === "wolf"
      ? sector(elite ? 5 : 3.5, 0.38, 0xe66c43, 0.4)
      : sector(11, 0.08, 0xe66c43, 0.3);
  warning.position.y = 0.07;
  warning.visible = false;
  scene.add(warning);
  enemies.push({
    id,
    rig,
    spawn: { ...p },
    hp: elite ? 120 : kind === "wolf" ? 40 : 32,
    maxHp: elite ? 120 : kind === "wolf" ? 40 : 32,
    kind,
    elite,
    state: "idle",
    timer: 0,
    heading: 0,
    hit: false,
    flash: 0,
    bar,
    fill,
    warning,
    respawn: 0,
    far: 0,
  });
}
/** Brings an enemy back at a new, unseen place with full health. */
function revive(e: Enemy, p: Point) {
  e.state = "idle";
  e.hp = e.maxHp;
  e.timer = 0;
  e.far = 0;
  e.spawn = { ...p };
  e.rig.root.visible = true;
  e.rig.root.position.set(p.x, 0, p.z);
  e.rig.root.rotation.z = 0;
  e.rig.root.scale.setScalar(e.elite ? 1.25 : 1);
}
function selectWeapon(w: "sword" | "magic") {
  weapon = w;
  hero.sword.visible = w === "sword";
  hero.wand.visible = w === "magic";
  $("attack-symbol").innerHTML = hudIcon(w);
  document
    .querySelectorAll<HTMLButtonElement>("[data-weapon]")
    .forEach((b) => {
      const selected = b.dataset.weapon === w;
      b.classList.toggle("selected", selected);
      b.setAttribute("aria-pressed", String(selected));
    });
  persist();
}
function floatingText(text: string, p: Point, color = "#fff1c8") {
  const el = document.createElement("span");
  el.className = "float-label";
  el.textContent = text;
  el.style.color = color;
  document.body.append(el);
  floating.push({ el, p: new T.Vector3(p.x, 2.5, p.z), life: 0.8, total: 0.8 });
}
function burst(p: Point, color: number, n = 8) {
  for (let i = 0; i < n; i++) {
    const node = new T.Mesh(
      new T.BoxGeometry(0.09, 0.09, 0.22),
      new T.MeshBasicMaterial({ color }),
    );
    node.position.set(p.x, 1, p.z);
    scene.add(node);
    const a = Math.random() * Math.PI * 2;
    particles.push({
      node,
      velocity: new T.Vector3(
        Math.sin(a) * (1 + Math.random() * 3),
        2 + Math.random() * 3,
        Math.cos(a) * (1 + Math.random() * 3),
      ),
      life: 0.35 + Math.random() * 0.2,
      total: 0.55,
    });
  }
}
function hurtEnemy(e: Enemy, damage: number) {
  if (e.state === "dead") return;
  e.hp -= damage;
  e.flash = 0.13;
  burst(e.rig.root.position, e.elite ? 0xffd270 : 0xf3e2ab);
  floatingText(String(damage), e.rig.root.position);
  shake = Math.max(shake, 0.07);
  sound(210, 0.06, "triangle");
  if (e.hp <= 0) {
    e.hp = 0;
    e.state = "dead";
    e.timer = 0;
    e.warning.visible = false;
    e.bar.visible = false;
    e.respawn = R.respawnDelay;
    player.kills++;
    player.exp += e.elite ? 32 : 12;
    player.fragments += e.elite ? 5 : 1;
    sound(640, 0.13, "sine");
    floatingText(
      e.elite ? "+32 EXP · 5 odłamków" : "+12 EXP",
      e.rig.root.position,
      "#e6f3be",
    );
    if (player.kills === 6)
      notify(
        "Wyprawa ukończona! Sprawdź magię lub poszukaj silniejszego przeciwnika.",
      );
    persist();
  }
}
function hurtPlayer(damage: number) {
  if (time < invincibleUntil || time < deathUntil || safe(player)) return;
  player.hp = Math.max(0, player.hp - damage);
  invincibleUntil = time + 0.35;
  lastCombat = time;
  shake = 0.2;
  flashUntil = time + 0.22;
  floatingText("−" + damage, player, "#ffbfa4");
  sound(95, 0.11, "sawtooth", 0.04);
  if (player.hp <= 0) {
    deathUntil = time + 1.1;
    player.exp = deathExperience(player.exp);
    player.coins = 0;
    attack = null;
    resetInput();
    notify("Pokonano Cię. Wracasz do schronienia — sprzęt i odkrycia zostają.");
  }
}
function nearestEnemy(range: number) {
  return enemies
    .filter(
      (e) =>
        e.state !== "dead" &&
        distance(player, e.rig.root.position) < range &&
        lineClear(player, e.rig.root.position),
    )
    .sort(
      (a, b) =>
        distance(player, a.rig.root.position) -
        distance(player, b.rig.root.position),
    )[0];
}
function beginAttack(sweep = false, autoAim = false) {
  if (
    !started ||
    paused ||
    helpOpen ||
    orientationHeld ||
    contextLost ||
    !!rendererFault ||
    deathUntil > time ||
    !!camp ||
    attack
  )
    return;
  if (sweep ? time < sweepReady : time - lastAttack < R.attackCooldown) return;
  if (autoAim) {
    const e = nearestEnemy(weapon === "magic" ? 16 : 5);
    if (e)
      heading = Math.atan2(
        e.rig.root.position.x - player.x,
        e.rig.root.position.z - player.z,
      );
  }
  if (sweep) sweepReady = time + R.sweepCooldown;
  attack = {
    t: 0,
    duration: sweep ? 0.58 : R.attackDuration,
    hit: false,
    sweep,
    heading,
    ranged: weapon === "magic" && !sweep,
  };
  lastAttack = time;
  lastCombat = time;
  hero.sword.visible = weapon === "sword" || sweep;
  hero.wand.visible = weapon === "magic" && !sweep;
  sound(sweep ? 330 : 260, 0.09, "triangle", 0.03);
}
function fire(p: Point, dir: number, fromEnemy: boolean) {
  const node = new T.Mesh(
    new T.IcosahedronGeometry(fromEnemy ? 0.14 : 0.23, 1),
    new T.MeshBasicMaterial({ color: fromEnemy ? 0xea845a : 0x87edee }),
  );
  node.position.set(p.x, 1.1, p.z);
  scene.add(node);
  const speed = fromEnemy ? 10 : 23;
  shots.push({
    node,
    fromEnemy,
    vx: Math.sin(dir) * speed,
    vz: Math.cos(dir) * speed,
    life: fromEnemy ? 2.2 : 1.1,
    damage: fromEnemy ? 13 : 18 + Math.floor(player.exp / 60),
  });
}
function usePotion() {
  if (
    !started ||
    paused ||
    helpOpen ||
    !!camp ||
    deathUntil > time ||
    time < potionReady ||
    player.hp >= maxHp()
  )
    return;
  potionReady = time + R.potionCooldown;
  player.hp = Math.min(maxHp(), player.hp + 38);
  floatingText("+38", player, "#c8eea4");
  burst(player, 0xbce6a2);
  sound(540, 0.18, "sine");
  persist();
}
function updateEnemies(dt: number) {
  for (const e of enemies) {
    e.flash = Math.max(0, e.flash - dt);
    if (e.state === "dead") {
      e.timer += dt;
      e.rig.root.rotation.z = Math.min(1, e.timer * 5) * Math.PI * 0.45;
      e.rig.root.scale.setScalar(
        (e.elite ? 1.25 : 1) * Math.max(0, 1 - Math.max(0, e.timer - 0.6) * 2),
      );
      e.respawn -= dt;
      if (e.respawn <= 0) {
        const spot = spawnPoint();
        if (spot) revive(e, spot);
        else e.respawn = 1;
      }
      continue;
    }
    const p = e.rig.root.position,
      d = distance(player, p);
    // Enemies left far behind move to unseen places near the hero, so travel stays populated.
    if (e.state === "idle" && d > 110 && !onCamera(p)) {
      e.far += dt;
      if (e.far > 20) {
        const spot = spawnPoint();
        if (spot) revive(e, spot);
        else e.far = 15;
        continue;
      }
    } else e.far = 0;
    let moving = false;
    e.timer -= dt;
    if (e.state === "idle") {
      if (distance(p, e.spawn) > 13 || safe(player) || d > 17) {
        if (distance(p, e.spawn) > 0.5) {
          const a = Math.atan2(e.spawn.x - p.x, e.spawn.z - p.z);
          slide(p, Math.sin(a) * 2 * dt, Math.cos(a) * 2 * dt, 0.48);
          e.heading = a;
          moving = true;
        }
        if (d > 20) e.hp = Math.min(e.maxHp, e.hp + dt * 6);
      } else if (d < (e.kind === "wolf" ? 3.6 : 10) && lineClear(p, player)) {
        e.state = "windup";
        e.timer = e.kind === "wolf" ? 0.65 : 0.85;
        e.heading = Math.atan2(player.x - p.x, player.z - p.z);
        e.hit = false;
      } else {
        const a = Math.atan2(player.x - p.x, player.z - p.z);
        e.heading = a;
        const sign = e.kind === "archer" && d < 5 ? -1 : 1;
        slide(
          p,
          Math.sin(a) * 2.5 * dt * sign,
          Math.cos(a) * 2.5 * dt * sign,
          0.48,
        );
        moving = true;
      }
    } else if (e.state === "windup" && e.timer <= 0) {
      e.state = "strike";
      e.timer = e.kind === "wolf" ? 0.32 : 0.12;
      if (e.kind === "archer") fire(p, e.heading, true);
    } else if (e.state === "strike") {
      if (e.kind === "wolf") {
        const before = { x: p.x, z: p.z };
        slide(
          p,
          Math.sin(e.heading) * 10 * dt,
          Math.cos(e.heading) * 10 * dt,
          0.48,
        );
        if (!e.hit && segmentHitsCircle(before, p, player, 0.95)) {
          hurtPlayer(e.elite ? 25 : 15);
          e.hit = true;
        }
      }
      if (e.timer <= 0) {
        e.state = "recover";
        e.timer = e.elite ? 0.65 : 1;
      }
    } else if (e.state === "recover" && e.timer <= 0) e.state = "idle";
    e.rig.root.rotation.y = e.heading;
    e.warning.visible = e.state === "windup";
    e.warning.position.set(p.x, 0.065, p.z);
    e.warning.rotation.z = e.heading;
    // Shape lies in XY before rotation. Local Z rotation becomes a Y heading after projection.
    e.warning.rotation.set(-Math.PI / 2, 0, e.heading);
    animate(e.rig, dt, moving, e.state === "strike" ? 0.5 : 0, false);
    if (e.flash > 0) e.rig.body.position.y += 0.12;
    e.bar.visible = d < 20;
    e.bar.position.set(p.x, e.kind === "wolf" ? 1.8 : 2.8, p.z);
    e.bar.quaternion.copy(camera.quaternion);
    e.fill.scale.x = clamp(e.hp / e.maxHp, 0, 1);
  }
}
function updateAttack(dt: number) {
  if (!attack) return;
  attack.t += dt;
  heading = attack.heading;
  if (!attack.hit && attack.t >= R.attackHitAt) {
    attack.hit = true;
    if (attack.ranged) {
      fire(
        {
          x: player.x + Math.sin(heading) * 0.65,
          z: player.z + Math.cos(heading) * 0.65,
        },
        heading,
        false,
      );
    } else {
      let hit = false;
      for (const e of enemies)
        if (
          e.state !== "dead" &&
          inArc(
            player,
            e.rig.root.position,
            heading,
            attack.sweep ? R.sweepReach : R.reach,
            attack.sweep ? R.sweepHalfArc : R.halfArc,
          ) &&
          lineClear(player, e.rig.root.position)
        ) {
          hurtEnemy(e, (attack.sweep ? 24 : 16) + Math.floor(player.exp / 60));
          hit = true;
        }
      if (hit && attack.sweep) {
        shake = 0.16;
        sound(130, 0.15, "triangle");
      }
    }
  }
  if (attack.t >= attack.duration) {
    attack = null;
    hero.sword.visible = weapon === "sword";
    hero.wand.visible = weapon === "magic";
  }
}
function updateShots(dt: number) {
  for (let i = shots.length - 1; i >= 0; i--) {
    const s = shots[i],
      p = s.node.position,
      before = { x: p.x, z: p.z };
    p.x += s.vx * dt;
    p.z += s.vz * dt;
    s.life -= dt;
    let hit = false;
    if (!lineClear(before, p)) hit = true;
    if (!hit && s.fromEnemy && segmentHitsCircle(before, p, player, 0.6)) {
      hurtPlayer(s.damage);
      hit = true;
    }
    if (!hit && !s.fromEnemy)
      for (const e of enemies)
        if (
          e.state !== "dead" &&
          segmentHitsCircle(before, p, e.rig.root.position, 0.7)
        ) {
          hurtEnemy(e, s.damage);
          hit = true;
          break;
        }
    if (hit || s.life <= 0) {
      burst(p, s.fromEnemy ? 0xe59a6b : 0xa4e8e4, 4);
      scene.remove(s.node);
      s.node.geometry.dispose();
      (s.node.material as T.Material).dispose();
      shots.splice(i, 1);
    }
  }
}
function updateEffects(dt: number) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= dt;
    p.velocity.y -= 12 * dt;
    p.node.position.addScaledVector(p.velocity, dt);
    p.node.rotation.x += dt * 10;
    p.node.scale.setScalar(Math.max(0, p.life / p.total));
    if (p.life <= 0) {
      scene.remove(p.node);
      p.node.geometry.dispose();
      (p.node.material as T.Material).dispose();
      particles.splice(i, 1);
    }
  }
  for (let i = floating.length - 1; i >= 0; i--) {
    const f = floating[i];
    f.life -= dt;
    f.p.y += dt * 1.6;
    const v = f.p.clone().project(camera);
    f.el.style.left = `${((v.x + 1) * innerWidth) / 2}px`;
    f.el.style.top = `${((1 - v.y) * innerHeight) / 2}px`;
    f.el.style.opacity = String(Math.min(1, f.life * 3));
    if (f.life <= 0) {
      f.el.remove();
      floating.splice(i, 1);
    }
  }
}
function updateHud() {
  const hp = clamp(player.hp / maxHp(), 0, 1);
  $("hp-fill").style.width = `${hp * 100}%`;
  document.querySelector(".health")?.setAttribute("aria-valuenow", String(Math.round(hp * 100)));
  const xpShare = (player.exp % 60) / 60;
  document.querySelector<HTMLElement>(".avatar")?.style.setProperty("--xp", `${xpShare * 360}deg`);
  document.querySelector(".xp")?.setAttribute("aria-valuenow", String(Math.round(xpShare * 100)));
  document.querySelector(".vitals")?.classList.toggle("low-health", hp < 0.3);
  $("hp-label").textContent = `${Math.ceil(player.hp)} / ${maxHp()}`;
  $("level").textContent = String(1 + Math.floor(player.exp / 60));
  $("xp-fill").style.width = `${((player.exp % 60) / 60) * 100}%`;
  const count = Math.min(6, player.kills);
  $("progress").textContent =
    count < 6
      ? `${count} / 6 · bursztynowy znacznik prowadzi do wroga`
      : "6 / 6 · eksploruj, ćwicz i porównaj bronie";
  $("goal").textContent =
    count < 6
      ? "Opuść schronienie i pokonaj 6 przeciwników"
      : "Pierwsza wyprawa ukończona";
  const inSafe = safe(player);
  $("zone").className = `zone ${inSafe ? "safe" : "danger"}`;
  $("zone").textContent = inSafe
    ? "SCHRONIENIE · regeneracja"
    : time - lastCombat < R.regenDelay
      ? "DZICZ · walka"
      : "DZICZ · poza walką";
  $("loot").textContent =
    `${player.fragments} odłamków · ${player.coins} złota`;
  const sweepLeft = Math.max(0, sweepReady - time),
    healLeft = Math.max(0, potionReady - time);
  $<HTMLButtonElement>("sweep").disabled = sweepLeft > 0 || paused || helpOpen;
  $("sweep-time").textContent = sweepLeft
    ? `${sweepLeft.toFixed(1)} s`
    : "GOTOWY";
  $<HTMLButtonElement>("heal").disabled =
    healLeft > 0 || player.hp >= maxHp() || paused || helpOpen;
  $("heal-time").textContent = healLeft
    ? `${Math.ceil(healLeft)} s`
    : "MIKSTURA";
  $("fps").textContent =
    `${Math.round(1 / (frames.reduce((a, b) => a + b, 0) / Math.max(1, frames.length) || 1))} FPS · ${world.buildingCount} brył OSM`;
  $<HTMLButtonElement>("camp").disabled = !!camp;
  document.body.classList.toggle("camping", !!camp);
  if (time > toastUntil) $("toast").classList.remove("on");
  $("damage-vignette").style.opacity = time < flashUntil ? ".55" : "0";
}
function resetInput() {
  keys.clear();
  mouseAim = null;
  move = { x: 0, z: 0 };
  aiming = false;
  document
    .querySelectorAll<HTMLElement>(".stick i")
    .forEach((e) => (e.style.transform = ""));
  cancelSticks();
}
let cancelSticks = () => {};
function setPause(value: boolean) {
  paused = value;
  resetInput();
  persist();
  updateHud();
  if (value)
    notify("Pauza — dotknij ekranu albo naciśnij P, aby wrócić. Świat i przeciwnicy czekają.");
  else $("toast").classList.remove("on");
}
function pointerAim(clientX: number, clientY: number) {
  ray.setFromCamera(
    new T.Vector2(
      (clientX / innerWidth) * 2 - 1,
      1 - (clientY / innerHeight) * 2,
    ),
    camera,
  );
  const p = ray.ray.intersectPlane(ground, scratch);
  if (p) heading = Math.atan2(p.x - player.x, p.z - player.z);
}
function bindControls() {
  const cancels: (() => void)[] = [];
  function stick(id: string, isAttack: boolean) {
    const el = $(id);
    let pointer: number | null = null,
      startX = 0,
      startY = 0,
      dragged = false;
    const nub = el.querySelector("i")!;
    const clear = () => {
      pointer = null;
      nub.style.transform = "";
      if (isAttack) aiming = false;
      else move = { x: 0, z: 0 };
    };
    cancels.push(clear);
    el.addEventListener("pointerdown", (e) => {
      if (!started || paused || helpOpen || orientationHeld) return;
      pointer = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      dragged = false;
      el.setPointerCapture(pointer);
      if (isAttack) aiming = true;
      e.preventDefault();
    });
    el.addEventListener("pointermove", (e) => {
      if (pointer !== e.pointerId) return;
      const dx = e.clientX - startX,
        dy = e.clientY - startY,
        len = Math.hypot(dx, dy),
        r = el.clientWidth * 0.34,
        k = Math.min(1, r / (len || 1));
      nub.style.transform = `translate(${dx * k}px,${dy * k}px)`;
      if (len > 7) dragged = true;
      if (isAttack) {
        if (len > 5) heading = Math.atan2(dx, dy);
      } else move = { x: (dx * k) / r, z: (dy * k) / r };
    });
    el.addEventListener("pointerup", (e) => {
      if (pointer !== e.pointerId) return;
      if (isAttack) beginAttack(false, !dragged);
      clear();
    });
    el.addEventListener("pointercancel", clear);
    el.addEventListener("lostpointercapture", clear);
  }
  stick("move-stick", false);
  stick("attack-stick", true);
  cancelSticks = () => cancels.forEach((fn) => fn());
  window.addEventListener("keydown", (e) => {
    if (!started || e.target instanceof HTMLInputElement) return;
    if (
      ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
        e.code,
      )
    )
      e.preventDefault();
    if (e.code === "KeyP" || e.code === "Escape") {
      if (!e.repeat && !helpOpen) setPause(!paused);
      return;
    }
    if (paused || helpOpen || orientationHeld || contextLost || rendererFault)
      return;
    keys.add(e.code);
    if (e.repeat) return;
    if (e.code === "Space") beginAttack(false, true);
    if (e.code === "KeyQ") beginAttack(true, true);
    if (e.code === "KeyH") usePotion();
    if (e.code === "Digit1") selectWeapon("sword");
    if (e.code === "Digit2") selectWeapon("magic");
    if (e.code === "KeyC") startCamp();
  });
  window.addEventListener("keyup", (e) => keys.delete(e.code));
  window.addEventListener("blur", () => {
    if (started) setPause(true);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && started) setPause(true);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (e.pointerType === "mouse" && !paused && !helpOpen) {
      mouseAim = { x: e.clientX, y: e.clientY };
      pointerAim(e.clientX, e.clientY);
    }
  });
  canvas.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    pointerAim(e.clientX, e.clientY);
    beginAttack();
  });
  canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  $("sweep").onclick = () => beginAttack(true, true);
  $("heal").onclick = usePotion;
  $("camp").onclick = startCamp;
  // Without an on-screen pause button, a tap anywhere resumes a paused game.
  window.addEventListener(
    "pointerdown",
    (e) => {
      if (
        paused &&
        !helpOpen &&
        !(e.target instanceof Element && e.target.closest(".overlay, button"))
      )
        setPause(false);
    },
    true,
  );
  document.querySelectorAll<HTMLButtonElement>("[data-weapon]").forEach(
    (b) =>
      (b.onclick = () => {
        if (!attack) selectWeapon(b.dataset.weapon as "sword" | "magic");
      }),
  );
  $("audio").onclick = () => {
    soundOn = !soundOn;
    if (soundOn) enableAudio();
    $("audio").setAttribute("aria-pressed", String(soundOn));
    $("audio").textContent = soundOn ? "♫" : "♩";
  };
  $("help-button").onclick = () => {
    helpOpen = true;
    resetInput();
    $("help").hidden = false;
    updateHud();
  };
  $("close-help").onclick = () => {
    helpOpen = false;
    $("help").hidden = true;
    resetInput();
  };
  $("reset").onclick = () => {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch {}
    location.reload();
  };
  $("start").onclick = () => {
    void enterFullscreen();
    started = true;
    $("loading").hidden = true;
    clock.start();
    soundOn = true;
    enableAudio();
    $("audio").setAttribute("aria-pressed", "true");
    notify("Witaj w Lublinie. Sprawdź miecz, potem przełącz na magię.");
  };
  $("fullscreen").onclick = () => {
    if (document.fullscreenElement)
      void document.exitFullscreen().catch(() => {});
    else void enterFullscreen();
  };
  document.addEventListener("fullscreenchange", () => {
    fullscreenState = document.fullscreenElement ? "active" : "idle";
    requestAnimationFrame(() => {
      resize();
      frameChecks = 3;
    });
  });
  window.addEventListener("pagehide", persist);
}
let orientationHeld = false;
function resize() {
  const touch = matchMedia("(pointer: coarse)").matches;
  const hold = touch && innerHeight > innerWidth;
  if (hold !== orientationHeld) resetInput();
  orientationHeld = hold;
  $("rotate-notice").hidden = !hold;
  const aspect = innerWidth / innerHeight,
    vertical =
      touch && innerWidth > innerHeight ? 10 : innerWidth < 700 ? 19 : 16;
  camera.left = -vertical * aspect;
  camera.right = vertical * aspect;
  camera.top = vertical;
  camera.bottom = -vertical;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(compatibility ? 1 : Math.min(devicePixelRatio, 1.5));
  renderer.setSize(innerWidth, innerHeight);
  frameChecks = 3;
}
const clock = new T.Clock();
function tick() {
  requestAnimationFrame(tick);
  const raw = clock.getDelta(),
    dt = Math.min(raw, 0.1);
  frames.push(raw);
  if (frames.length > 90) frames.shift();
  if (
    ready &&
    started &&
    !paused &&
    !helpOpen &&
    !orientationHeld &&
    !contextLost &&
    !rendererFault
  ) {
    time += dt;
    if (deathUntil > 0) {
      if (time >= deathUntil) {
        deathUntil = 0;
        player.x = home.x;
        player.z = home.z;
        player.hp = maxHp();
        invincibleUntil = time + 2;
        shots.forEach((s) => {
          scene.remove(s.node);
          s.node.geometry.dispose();
          (s.node.material as T.Material).dispose();
        });
        shots.length = 0;
        cameraTarget.set(player.x, 0, player.z);
        persist();
      }
    } else if (camp) {
      updateCamp(dt);
    } else {
      let dx =
          move.x +
          (keys.has("KeyD") || keys.has("ArrowRight") ? 1 : 0) -
          (keys.has("KeyA") || keys.has("ArrowLeft") ? 1 : 0),
        dz =
          move.z +
          (keys.has("KeyS") || keys.has("ArrowDown") ? 1 : 0) -
          (keys.has("KeyW") || keys.has("ArrowUp") ? 1 : 0),
        len = Math.hypot(dx, dz);
      if (len > 1) {
        dx /= len;
        dz /= len;
      }
      if (len > 0.08) {
        if (!world.covered(player.x + dx * 1.2, player.z + dz * 1.2))
          mapEdgeHint(true);
        slide(
          player,
          dx * R.speed * dt * (attack?.sweep ? 0.6 : 1),
          dz * R.speed * dt * (attack?.sweep ? 0.6 : 1),
          R.radius,
        );
        if (!aiming && !attack && !keys.has("Space"))
          heading = Math.atan2(dx, dz);
      }
      if (mouseAim && !attack) pointerAim(mouseAim.x, mouseAim.y);
      updateAttack(dt);
      animate(
        hero,
        dt,
        len > 0.08,
        attack ? attack.t / attack.duration : 0,
        attack?.sweep ?? false,
      );
      hero.root.position.set(player.x, 0, player.z);
      hero.root.rotation.y = heading;
      hero.root.rotation.z = 0;
      if (
        player.hp < maxHp() &&
        (safe(player) || time - lastCombat > R.regenDelay)
      )
        player.hp = Math.min(maxHp(), player.hp + dt * (safe(player) ? 22 : 4));
    }
    updateEnemies(dt);
    updateShots(dt);
    updateEffects(dt);
    if (deathUntil > time) {
      hero.root.rotation.z =
        Math.min(1, (1.1 - (deathUntil - time)) * 3) * Math.PI * 0.4;
      hero.root.position.y = -0.1;
    }
    edgeClock += dt;
    if (edgeClock > 1) {
      edgeClock = 0;
      if (!camp)
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4)
          if (!world.covered(player.x + Math.sin(a) * 160, player.z + Math.cos(a) * 160)) {
            mapEdgeHint(false);
            break;
          }
    }
    if (props.fire.visible)
      props.flame.scale.set(1, 0.8 + Math.sin(time * 17) * 0.12 + Math.sin(time * 5.3) * 0.1, 1);
    if (time - lastSave > 2) {
      persist();
      lastSave = time;
    }
  }
  if (!ready || contextLost || rendererFault) return;
  const focus = camp
    ? new T.Vector3((player.x * 2 + camp.tentAt.x) / 3, 0, (player.z * 2 + camp.tentAt.z) / 3)
    : new T.Vector3(player.x, 0, player.z);
  cameraTarget.lerp(focus, 1 - Math.exp(-dt * (camp ? 4 : 10)));
  // Zoom in on the hero while the camp goes up.
  const zoom = camp && !camp.finishing ? 2.6 : 1;
  if (Math.abs(camera.zoom - zoom) > 0.002) {
    camera.zoom += (zoom - camera.zoom) * (1 - Math.exp(-dt * 4));
    camera.updateProjectionMatrix();
  } else if (camera.zoom !== zoom) {
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
  }
  placeCamera();
  if (shake > 0) {
    camera.position.x += (Math.random() - 0.5) * shake;
    camera.position.z += (Math.random() - 0.5) * shake;
    if (!paused && !helpOpen) shake = Math.max(0, shake - dt);
  }
  heroBar.group.position.set(player.x, 2.9, player.z);
  heroBar.group.quaternion.copy(camera.quaternion);
  heroBar.fill.scale.x = clamp(player.hp / maxHp(), 0, 1);
  const activeAttack = attack && !attack.ranged;
  aimView.visible = aiming || !!activeAttack;
  aimView.position.set(player.x, 0.065, player.z);
  aimView.rotation.set(-Math.PI / 2, 0, heading);
  aimView.scale.setScalar(attack?.sweep ? R.sweepReach / R.reach : 1);
  (aimView.material as T.MeshBasicMaterial).opacity = activeAttack
    ? 0.35
    : 0.18;
  const target = enemies
    .filter((e) => e.state !== "dead")
    .sort(
      (a, b) =>
        distance(player, a.rig.root.position) -
        distance(player, b.rig.root.position),
    )[0];
  targetArrow.visible = !!target && player.kills < 6;
  if (target) {
    const p = target.rig.root.position,
      d = distance(player, p),
      k = Math.min(1, 6 / (d || 1));
    targetArrow.position.set(
      player.x + (p.x - player.x) * k,
      3.3 + Math.sin(time * 3) * 0.15,
      player.z + (p.z - player.z) * k,
    );
    targetArrow.rotation.z = Math.PI;
  }
  occlusionClock += dt;
  if (occlusionClock > 0.1) {
    occlusionClock = 0;
    world.updateOcclusion(camera.position, [
      player,
      ...enemies
        .filter(
          (e) =>
            e.state !== "dead" && distance(player, e.rig.root.position) < 16,
        )
        .map((e) => e.rig.root.position),
    ]);
  }
  unknownLand.position.set(player.x, -0.03, player.z);
  // The static shadow map follows the hero in steps and redraws only after a move or new map.
  if (sun.castShadow && (world.dirty || distance(player, shadowCenter) > 20)) {
    shadowCenter = { x: player.x, z: player.z };
    sun.position.set(player.x - 28, 55, player.z + 25);
    sun.target.position.set(player.x, 0, player.z);
    sun.target.updateMatrixWorld();
    renderer.shadowMap.needsUpdate = true;
    world.dirty = false;
  }
  if (time - lastHud > 0.1 || paused || helpOpen || !started) {
    updateHud();
    lastHud = time;
  }
  try {
    renderer.render(scene, camera);
    if (frameChecks > 0) {
      checkDrawingBuffer();
      frameChecks--;
    }
  } catch (error) {
    rendererProblem(
      `Błąd rysowania świata: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
async function init() {
  try {
    $("compatibility").onclick = () => {
      const url = new URL(location.href);
      url.searchParams.set("quality", "safe");
      location.href = url.href;
    };
    $("reload-renderer").onclick = () => location.reload();
    canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      contextLost = true;
      rendererProblem(
        "Telefon lub przeglądarka przerwały rysowanie 3D. Postęp jest zachowany. Czekam na przywrócenie obrazu; możesz też wczytać grę ponownie.",
      );
    });
    canvas.addEventListener("webglcontextrestored", () => {
      contextLost = false;
      rendererFault = "";
      frameChecks = 3;
      $("renderer-error").hidden = true;
      renderer.shadowMap.needsUpdate = !compatibility;
      clock.getDelta();
      resize();
    });
    renderer = new T.WebGLRenderer({
      canvas,
      antialias: !compatibility,
      alpha: false,
      powerPreference: compatibility ? "default" : "high-performance",
      preserveDrawingBuffer: compatibility,
      precision: compatibility ? "mediump" : "highp",
    });
    const contextControl = renderer
      .getContext()
      .getExtension("WEBGL_lose_context");
    renderer.debug.onShaderError = () =>
      rendererProblem(
        "Układ graficzny nie skompilował efektów 3D. Uruchom tryb zgodności.",
      );
    renderer.shadowMap.enabled = !compatibility;
    renderer.shadowMap.type = T.PCFShadowMap;
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    const params = new URLSearchParams(location.search),
      save = readSave(),
      fallbackHome = { x: 15, z: -13 },
      savedAt = (x?: number, z?: number) =>
        Number.isFinite(x) && Number.isFinite(z) ? { x: x!, z: z! } : null,
      startAt = savedAt(save?.x, save?.z) ?? fallbackHome,
      homeAt = savedAt(save?.hx, save?.hz) ?? fallbackHome;
    world = new World(scene, { safe: safeGraphics, shadows: !compatibility });
    let tilesReady = false;
    if (params.get("map") !== "local") {
      // Everything within 2.5 km is downloaded and meshed now, so walking never waits for the map.
      try {
        world.template = await tileTemplate(params.get("tiles") || TILE_SOURCE);
        const label = $("loading-text");
        const result = await world.ensure(startAt, LOAD_RADIUS, (done, total) => {
          label.textContent = `Wczytuję mapę okolicy (5 km): ${done} / ${total} fragmentów…`;
        });
        await world.ensure(homeAt, 40);
        tilesReady = result.failed < result.total && world.covered(startAt.x, startAt.z);
      } catch (error) {
        console.warn("Kafelki mapy niedostępne, używam zapisanego wycinka", error);
      }
    }
    if (!tilesReady) {
      world.unloadFar(startAt, -1);
      mapSource = "local";
      const response = await fetch("combat3d/lublin.json");
      if (!response.ok) throw new Error(`Mapa: HTTP ${response.status}`);
      const map = (await response.json()) as MapData,
        edge = map.radius - 2;
      world.addRaw({
        key: "lublin",
        rect: { x0: -edge, x1: edge, z0: -edge, z1: edge },
        buildings: map.buildings,
        roads: map.roads,
        areas: map.areas.map((a) => ({
          rings: a.rings,
          kind: (a.water ? "water" : "grass") as AreaKind,
          name: a.name,
        })),
      });
    }
    resize();
    buildWorld(save);
    if (safeGraphics) {
      const replacements = new Map<T.Material, T.Material>();
      const flat = (m: T.Material): T.Material => {
        if (!(m instanceof T.MeshStandardMaterial)) return m;
        let replacement = replacements.get(m);
        if (!replacement) {
          replacement = new T.MeshBasicMaterial({
            color: m.color,
            vertexColors: m.vertexColors,
            transparent: m.transparent,
            opacity: m.opacity,
            side: m.side,
            depthWrite: m.depthWrite,
          });
          replacements.set(m, replacement);
        }
        return replacement;
      };
      scene.traverse((object) => {
        if (object instanceof T.Mesh)
          object.material = Array.isArray(object.material)
            ? object.material.map(flat)
            : flat(object.material);
      });
    }
    renderer.shadowMap.autoUpdate = false;
    renderer.shadowMap.needsUpdate = true;
    bindControls();
    resize();
    window.addEventListener("resize", resize);
    // Compile every shader before the first frame so the opening seconds do not stutter.
    renderer.compile(scene, camera);
    ready = true;
    $("loading-text").textContent =
      "Prawdziwy układ Starego Miasta. Nowy bohater, miecz, magia i sweep. Sprawdź, czy walka daje frajdę.";
    $("start").hidden = false;
    updateHud();
    tick();
    // Read-only diagnostics. Optional QA fixtures are restricted to ?qa=1 in this local-only laboratory.
    Object.assign(window, {
      __combat3d: {
        snapshot: () => ({
          ready,
          started,
          paused,
          helpOpen,
          orientationHeld,
          compatibility,
          safeGraphics,
          contextLost,
          rendererFault,
          frameHealthy,
          fullscreenState,
          time,
          player: { ...player },
          home: { ...home },
          weapon,
          camp: camp ? { t: camp.t, loaded: camp.loaded, done: camp.done, total: camp.total } : null,
          sweepReady,
          potionReady,
          attack: attack ? { ...attack } : null,
          enemies: enemies.map((e) => ({
            id: e.id,
            x: e.rig.root.position.x,
            z: e.rig.root.position.z,
            hp: e.hp,
            state: e.state,
            kind: e.kind,
            onScreen: e.state !== "dead" && onCamera(e.rig.root.position),
          })),
          map: {
            buildings: world.buildingCount,
            roads: world.roadCount,
            regions: world.regions.size,
            source: mapSource,
          },
          drawCalls: renderer.info.render.calls,
          triangles: renderer.info.render.triangles,
          faded: world.fadedCount(),
        }),
        ...(new URLSearchParams(location.search).has("qa")
          ? {
              fixture: (name: string) => {
                resetInput();
                attack = null;
                shots.forEach((s) => scene.remove(s.node));
                shots.length = 0;
                for (const e of enemies) {
                  e.state = "dead";
                  e.hp = 0;
                  e.respawn = 9999;
                  e.rig.root.visible = false;
                  e.warning.visible = false;
                  e.bar.visible = false;
                }
                const open = findFree({ x: home.x + 10, z: home.z + 10 });
                player.x = open.x;
                player.z = open.z;
                player.hp = maxHp();
                lastCombat = time;
                invincibleUntil = 0;
                cameraTarget.set(player.x, 0, player.z);
                const e = enemies[0];
                if (name !== "empty") {
                  e.rig.root.visible = true;
                  e.rig.root.scale.setScalar(1);
                  e.rig.root.rotation.z = 0;
                  e.state = "idle";
                  e.hp = e.maxHp = 100;
                  e.spawn = findFree({ x: open.x, z: open.z - 2 });
                  for (let a = 0; a < Math.PI * 2; a += 0.2) {
                    const p = {
                      x: open.x + Math.sin(a) * 2,
                      z: open.z + Math.cos(a) * 2,
                    };
                    if (!blocked(p.x, p.z, 0.7) && lineClear(open, p)) {
                      e.spawn = p;
                      break;
                    }
                  }
                  e.rig.root.position.set(e.spawn.x, 0, e.spawn.z);
                  e.timer = name === "duel" ? 0 : 100;
                  e.state = name === "duel" ? "idle" : "recover";
                  e.hit = false;
                  heading = Math.atan2(e.spawn.x - open.x, e.spawn.z - open.z);
                }
                if (name === "hurt") {
                  player.hp = 25;
                }
                if (name === "death") {
                  hurtPlayer(999);
                }
                if (name === "wall") {
                  const b = world.buildingsNear(home.x, home.z)[0];
                  if (b) {
                    const p = findFree({
                      x: b.box[0] - 1,
                      z: (b.box[1] + b.box[3]) / 2,
                    });
                    player.x = p.x;
                    player.z = p.z;
                  }
                }
                return { x: player.x, z: player.z };
              },
              hurt: (n: number) => hurtPlayer(n),
              travel: (x: number, z: number) => {
                const p = findFree({ x, z });
                player.x = p.x;
                player.z = p.z;
                cameraTarget.set(p.x, 0, p.z);
                return { ...p, covered: world.covered(p.x + 200, p.z) };
              },
              covered: (x: number, z: number) => world.covered(x, z),
              camp: () => {
                lastCombat = -100;
                startCamp();
                return camp ? { ...camp.tentAt } : null;
              },
              bench: (n = 20) => {
                const gl = renderer.getContext(),
                  t = performance.now();
                for (let i = 0; i < n; i++) {
                  renderer.render(scene, camera);
                  gl.finish();
                }
                return (performance.now() - t) / n;
              },
              attack: (s = false) => beginAttack(s, true),
              potion: usePotion,
              loseContext: () => contextControl?.loseContext(),
              restoreContext: () => contextControl?.restoreContext(),
            }
          : {}),
      },
    });
  } catch (error) {
    $("loading-text").textContent =
      `Nie udało się uruchomić próby: ${error instanceof Error ? error.message : String(error)}. Wymagana jest przeglądarka z WebGL 2.`;
    console.error(error);
  }
}
void init();
