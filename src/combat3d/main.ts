import "./style.css";
import {
  BALANCE,
  newCampaign,
  parseCampaign,
  activeCharacter,
  nearCamp,
  inSafeZone,
  levelOf,
  xpShare,
  loseXp,
  maxHealth,
  attackPower,
  armorPower,
  makeItem,
  GEAR_KINDS,
  accrue,
  isCampRole,
  distanceToSafeZone,
  partyOf,
  addWayfarer,
  roleName,
  PARTY_SIZE,
  type Character,
} from "./campaign";
import { enclosedAreas } from "./territory-rules";
import { circleRates, workerRates } from "./production";
import { weaponSkill, offhandSkill, SKILLS } from "./skills";
import { timeOfDayAt, LIGHT } from "./sky";
import { Elevation, HeightField, waterTest, CELL } from "./terrain";
import { markSeen, cellOf, greyed } from "./explore";
import { fetchWeather, WEATHER_NAMES } from "./weather";
import {
  biomeAt,
  pickSpecies,
  speciesById,
  SERVANTS,
  type Species,
  type Behavior,
  type TimeOfDay,
  type Weather,
} from "./bestiary";
import {
  TRAIT_STRENGTH,
  RARITY_COLORS,
  RARITY_NAMES,
  fullName,
  rollWayfarer,
  regionAt,
} from "./wayfarers";
import {
  ventCells,
  ventChance,
  ventRoll,
  rescueChance,
  rescueRarity,
  RESCUE_GRID,
  waveSize,
  WAKE_RADIUS,
  type Vent,
} from "./vents";
import { Expedition } from "./expedition";
import {
  resourceNodes,
  starterNodes,
  YIELD,
  NODE_NAMES,
  RESPAWN_MS,
  type ResourceNode,
  type NodeKind,
} from "./resources";
import { encounterAllowed, encounterProfile } from "./encounters";
import {
  WorldStream,
  project,
  unproject,
  encounterCells,
  findLanding,
  hash,
  type MapData,
  type Geo,
} from "./world";
import { mountHud, hudIcon } from "./hud";
mountHud();
import * as T from "three";
import { animate, material, person, sector, wolf, type Rig } from "./models";
import {
  RULES as R,
  clamp,
  distance,
  inArc,
  inPolygon,
  circleBlocked,
  segmentHitsCircle,
  type Point,
} from "./rules";

type Enemy = {
  id: number;
  rig: Rig;
  spawn: Point;
  wanderTarget: Point | null;
  wanderWait: number;
  hp: number;
  maxHp: number;
  kind: "wolf" | "archer" | "mage" | "raider" | "heavy";
  /** Who it is (bestiary) and how it fights (archetype). */
  species: Species;
  behavior: Behavior;
  hidden: boolean;
  summonT: number;
  stolen: number;
  fleeUntil: number;
  tier: number;
  key: string;
  elite: boolean;
  boss: boolean;
  state: "idle" | "windup" | "strike" | "recover" | "dead";
  timer: number;
  heading: number;
  hit: boolean;
  flash: number;
  bar: T.Group;
  fill: T.Mesh;
  warning: T.Mesh;
  respawn: number;
};
type Shot = {
  node: T.Mesh;
  fromEnemy: boolean;
  vx: number;
  vz: number;
  life: number;
  damage: number;
  /** Who shot it (for traits). */
  by?: Character;
  /** Fireball: bursts and hurts everyone within this radius. */
  explode?: number;
};
type Particle = {
  node: T.Mesh;
  velocity: T.Vector3;
  life: number;
  total: number;
};
const $ = <E extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id) as E;
const SAVE_KEY = "ropexpanse:campaign:v2";
const LEGACY_KEY = "exp-lore:combat3d:v1";
const DEFAULT_ORIGIN = { lat: 51.2482, lon: 22.5681 };
let savedCampaign: ReturnType<typeof parseCampaign> = null;
try {
  const raw = localStorage.getItem(SAVE_KEY);
  if (raw) savedCampaign = parseCampaign(raw);
} catch {}
const campaign =
  savedCampaign ?? newCampaign({ x: 15, z: -13 }, DEFAULT_ORIGIN);
let expedition: Expedition;
let worldStream: WorldStream;
const terrain = new T.Group();
let worldClock = 0;
let qaFixtureActive = false;

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
// Installed as an app (manifest display "fullscreen"): the screen is already the
// game's, so we skip the browser's own full-screen request and its notice.
const installedApp =
  typeof matchMedia === "function" &&
  (matchMedia("(display-mode: fullscreen)").matches ||
    matchMedia("(display-mode: standalone)").matches);
async function enterFullscreen() {
  if (document.fullscreenElement) return;
  if (installedApp) {
    fullscreenState = "app";
    return;
  }
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
let player = activeCharacter(campaign);
let hero = person(
  player.role === "archer" ? "archer" : "hero",
  player.appearance,
);
const maxHp = () => maxHealth(player);
let weapon: "sword" | "magic" = "sword",
  map: MapData,
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
const buildingViews: {
  data: MapData["buildings"][number];
  node: T.Mesh;
  materials: T.Material[];
  box: { x0: number; x1: number; z0: number; z1: number };
}[] = [];
const obstacleCells = new Map<string, typeof buildingViews>();
const cellKey = (x: number, z: number) =>
  `${Math.floor(x / 8)},${Math.floor(z / 8)}`;
const scratch = new T.Vector3(),
  ray = new T.Raycaster(),
  ground = new T.Plane(new T.Vector3(0, 1, 0), 0),
  cameraTarget = new T.Vector3();
const aimView = sector(R.reach, R.halfArc, 0xffe6a3, 0.23);
aimView.position.y = 0.065;
scene.add(aimView);
aimView.visible = false;
// Sound uses a small oscillator, no downloaded audio assets.
let audioContext: AudioContext | undefined,
  soundOn = false;

function notify(text: string) {
  $("toast").textContent = text;
  $("toast").classList.add("on");
  toastUntil = time + 3.2;
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
    player.weapon = weapon;
    player.sweepReady = Math.max(0, sweepReady - time);
    player.potionReady = Math.max(0, potionReady - time);
    for (const key in campaign.encounters)
      if (campaign.encounters[key] < Date.now())
        delete campaign.encounters[key];
    localStorage.setItem(SAVE_KEY, JSON.stringify(campaign));
  } catch {
    if (time - toastUntil > 10)
      notify("Nie można zapisać postępu w tej przeglądarce");
  }
}
function loadSave() {
  if (!savedCampaign) {
    try {
      const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) || "null");
      if (legacy?.v === 1) {
        for (const key of ["exp", "kills", "fragments", "coins"] as const)
          if (Number.isFinite(legacy[key]))
            player[key] = Math.max(0, legacy[key]);
        if (
          Number.isFinite(legacy.x) &&
          Number.isFinite(legacy.z) &&
          !blocked(legacy.x, legacy.z, R.radius)
        ) {
          player.x = legacy.x;
          player.z = legacy.z;
        }
        player.hp = Math.max(1, Math.min(maxHp(), Number(legacy.hp) || 100));
        player.weapon = legacy.weapon === "magic" ? "magic" : "sword";
      }
    } catch {}
  }
  weapon = player.weapon;
  sweepReady = time + (player.sweepReady ?? 0);
  potionReady = time + (player.potionReady ?? 0);
}
function polyShape(rings: number[][][]) {
  const shape = new T.Shape(rings[0].map(([x, z]) => new T.Vector2(x, -z)));
  for (const r of rings.slice(1))
    shape.holes.push(new T.Path(r.map(([x, z]) => new T.Vector2(x, -z))));
  return shape;
}
function blocked(x: number, z: number, r = 0.4) {
  if (
    !map ||
    (worldStream
      ? !worldStream.contains({ x, z }, r + 1)
      : Math.abs(x) > map.radius - 2 || Math.abs(z) > map.radius - 2)
  )
    return true;
  for (const b of obstacleCells.get(cellKey(x, z)) ?? []) {
    const q = b.box;
    if (x < q.x0 - r || x > q.x1 + r || z < q.z0 - r || z > q.z1 + r) continue;
    if (circleBlocked({ x, z }, r, b.data.rings)) return true;
  }
  return map.areas.some((a) => a.water && circleBlocked({ x, z }, r, a.rings));
}
function lineClear(a: Point, b: Point) {
  const n = Math.ceil(distance(a, b) / 0.4);
  for (let i = 1; i < n; i++)
    if (blocked(a.x + ((b.x - a.x) * i) / n, a.z + ((b.z - a.z) * i) / n, 0.08))
      return false;
  return true;
}
function slide(p: Point, dx: number, dz: number, r: number) {
  const allow = (next: Point) =>
    !blocked(next.x, next.z, r) &&
    (p !== player || !expedition || expedition.moveAllowed(next));
  if (allow({ x: p.x + dx, z: p.z })) p.x += dx;
  if (allow({ x: p.x, z: p.z + dz })) p.z += dz;
}
function safe(p: Point, margin = 0) {
  return inSafeZone(campaign, p, map?.scale ?? 0.18, margin);
}
function slideEnemy(p: Point, dx: number, dz: number) {
  // Sweep the whole step so a charge cannot jump across a narrow rope corridor.
  const move = (x: number, z: number) => {
    const steps = Math.max(1, Math.ceil(Math.hypot(x, z) / 0.1));
    for (let i = 0; i < steps; i++) {
      const next = { x: p.x + x / steps, z: p.z + z / steps };
      // A newly built connection may cover an existing enemy; let it leave.
      if (blocked(next.x, next.z, 0.48) || (!safe(p, 0.48) && safe(next, 0.48)))
        break;
      p.x = next.x;
      p.z = next.z;
    }
  };
  move(dx, 0);
  move(0, dz);
}
function wander(e: Enemy, dt: number) {
  const p = e.rig.root.position;
  e.wanderWait -= dt;
  if (!e.wanderTarget && e.wanderWait <= 0) {
    for (let i = 0; i < 12; i++) {
      const a = Math.random() * Math.PI * 2,
        r = 1.5 + Math.random() * 5;
      const target = {
        x: e.spawn.x + Math.sin(a) * r,
        z: e.spawn.z + Math.cos(a) * r,
      };
      if (
        !blocked(target.x, target.z, 0.48) &&
        !safe(target, 0.48) &&
        lineClear(p, target)
      ) {
        e.wanderTarget = target;
        break;
      }
    }
    e.wanderWait = 0.5 + Math.random();
  }
  if (!e.wanderTarget) return false;
  if (distance(p, e.wanderTarget) < 0.3) {
    e.wanderTarget = null;
    e.wanderWait = 0.5 + Math.random() * 2;
    return false;
  }
  e.heading = Math.atan2(e.wanderTarget.x - p.x, e.wanderTarget.z - p.z);
  const before = { x: p.x, z: p.z };
  slideEnemy(p, Math.sin(e.heading) * 1.2 * dt, Math.cos(e.heading) * 1.2 * dt);
  const moved = distance(before, p) > 0.0001;
  if (!moved) e.wanderTarget = null;
  return moved;
}
function findFree(wanted: Point, clearance = 0.75) {
  if (!blocked(wanted.x, wanted.z, clearance)) return { ...wanted };
  for (let r = 0.5; r < 30; r += 0.65)
    for (let a = 0; a < Math.PI * 2; a += 0.32) {
      const p = {
        x: wanted.x + Math.sin(a) * r,
        z: wanted.z + Math.cos(a) * r,
      };
      if (!blocked(p.x, p.z, clearance)) return p;
    }
  throw new Error("Nie znaleziono przejścia na mapie");
}
function healthBar(width = 1.3, color = 0xb9d791) {
  const group = new T.Group(),
    back = new T.Mesh(
      new T.PlaneGeometry(width + 0.12, 0.3),
      new T.MeshBasicMaterial({ color: 0x25342d, depthTest: false }),
    ),
    fill = new T.Mesh(
      new T.PlaneGeometry(width, 0.2),
      new T.MeshBasicMaterial({ color, depthTest: false }),
    );
  fill.position.z = 0.01;
  group.add(back, fill);
  group.renderOrder = 10;
  return { group, fill };
}
const heroBar = healthBar(1.4);
scene.add(heroBar.group);
// Sky: real sunrise/sunset at the hero's place sets the light; a warm lamp follows the
// party and the camp's fire glows after dark (owner's design doc, Pory dnia).
let sunLight: T.DirectionalLight, skyLight: T.HemisphereLight;
const partyLamp = new T.PointLight(0xffc27a, 0, 18, 1.3);
const campFire = new T.PointLight(0xffb347, 0, 16, 1.4);
let skyClock = 99;
const forcedTime = new URLSearchParams(location.search).get("time") as TimeOfDay | null;
function updateSky(dt: number) {
  skyClock += dt;
  if (skyClock > 30) {
    skyClock = 0;
    const geo = unproject(player, campaign.origin);
    const next = forcedTime ?? timeOfDayAt(Date.now(), geo.lat, geo.lon);
    if (next !== timeOfDay) {
      timeOfDay = next;
      notify(next === "night" ? "Zapada noc — Mgła gęstnieje" : next === "twilight" ? "Zmierzch" : "Dzień");
    }
  }
  const L = LIGHT[timeOfDay],
    k = Math.min(1, dt * 1.5),
    dim = weatherNow === "rain" || weatherNow === "storm" ? 0.65 : weatherNow === "fog" ? 0.82 : 1;
  sunLight.intensity += (L.sun * dim - sunLight.intensity) * k;
  sunLight.color.lerp(new T.Color(L.sunColor), k);
  skyLight.intensity += (L.sky * (dim < 1 ? 0.9 : 1) - skyLight.intensity) * k;
  if (flash > 0) skyLight.intensity = L.sky + 5 * (flash / 0.18);
  skyLight.color.lerp(new T.Color(L.skyColor), k);
  skyLight.groundColor.lerp(new T.Color(L.ground), k);
  (scene.background as T.Color).lerp(new T.Color(L.fog), k);
  scene.fog!.color.lerp(new T.Color(L.fog), k);
  partyLamp.intensity += (L.lamp - partyLamp.intensity) * k;
  partyLamp.position.set(player.x, 2.4, player.z);
  campFire.intensity += (L.lamp * 1.3 - campFire.intensity) * k;
  campFire.position.set(home.x, 1.4, home.z);
}
// ---- Weather (real, from Open-Meteo): rain, snow, mist, storms with flashes, wind ----
const forcedWeather = new URLSearchParams(location.search).get("weather") as Weather | null;
let weatherClock = Infinity,
  flashAt = 0,
  flash = 0;
const DROPS = 700;
const rain = new T.LineSegments(
  new T.BufferGeometry().setAttribute("position", new T.BufferAttribute(new Float32Array(DROPS * 6), 3)),
  new T.LineBasicMaterial({ color: 0xbcd3e6, transparent: true, opacity: 0.55 }),
);
const snow = new T.Points(
  new T.BufferGeometry().setAttribute("position", new T.BufferAttribute(new Float32Array(DROPS * 3), 3)),
  new T.PointsMaterial({ color: 0xffffff, size: 4, sizeAttenuation: false, transparent: true, opacity: 0.95 }), // pixels: the camera is orthographic
);
rain.frustumCulled = snow.frustumCulled = false;
rain.visible = snow.visible = false;
const dropSeed = Array.from({ length: DROPS }, (_, i) => [((i * 7919) % 1000) / 1000, ((i * 104729) % 1000) / 1000, ((i * 1299709) % 1000) / 1000]);
function setWeather(w: Weather) {
  if (w === weatherNow) return;
  weatherNow = w;
  notify(WEATHER_NAMES[w]);
}
function updateWeather(dt: number) {
  weatherClock += dt;
  if (weatherClock > 60) {
    // Ask at most every minute; the module keeps answers for 30 minutes per square.
    weatherClock = 0;
    if (forcedWeather) setWeather(forcedWeather);
    else {
      const geo = unproject(player, campaign.origin);
      void fetchWeather(geo.lat, geo.lon).then(setWeather);
    }
  }
  const wet = weatherNow === "rain" || weatherNow === "storm";
  rain.visible = wet;
  snow.visible = weatherNow === "snow";
  // Fog distances count from the camera, which hangs ~55 units above the party:
  // mist starts right past the party and thickens with distance.
  const fogNear = weatherNow === "fog" ? 36 : wet ? 50 : 55,
    fogFar = weatherNow === "fog" ? 72 : wet ? 102 : 115;
  const fog = scene.fog as T.Fog;
  fog.near += (fogNear - fog.near) * Math.min(1, dt);
  fog.far += (fogFar - fog.far) * Math.min(1, dt);
  if (rain.visible || snow.visible) {
    const t = time,
      wind = weatherNow === "storm" ? 0.35 : 0.12;
    const pos = ((rain.visible ? rain : snow).geometry.getAttribute("position") as T.BufferAttribute).array as Float32Array;
    for (let i = 0; i < DROPS; i++) {
      const [a, b, c] = dropSeed[i];
      const fall = rain.visible ? 22 : 2.2,
        h = 18 - ((t * fall + c * 18) % 18);
      const x = player.x + (a - 0.5) * 60 + (rain.visible ? wind * h : Math.sin(t + c * 6) * 0.6),
        z = player.z + (b - 0.5) * 60;
      if (rain.visible) {
        pos.set([x, h, z, x - wind * 0.9, h + 0.9, z], i * 6);
      } else pos.set([x, h, z], i * 3);
    }
    (rain.visible ? rain : snow).geometry.getAttribute("position").needsUpdate = true;
  }
  // Storm: a flash every 8–18 s.
  if (weatherNow === "storm" && time > flashAt) {
    flashAt = time + 8 + Math.random() * 10;
    flash = 0.18;
    sound(60, 0.4, "sawtooth", 0.03);
  }
  flash = Math.max(0, flash - dt);
}
function buildWorld() {
  const sun = new T.DirectionalLight(0xffeed0, 2.4);
  sunLight = sun;
  sun.position.set(-28, 55, 25);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -55;
  sun.shadow.camera.right = 55;
  sun.shadow.camera.top = 55;
  sun.shadow.camera.bottom = -55;
  sun.shadow.normalBias = 0.06;
  sun.shadow.bias = -0.0002;
  scene.add(sun, sun.target);
  skyLight = new T.HemisphereLight(0xe5f2df, 0x6b7557, 2);
  scene.add(skyLight, partyLamp, campFire, rain, snow);
  scene.add(terrain);
  renderTerrain();
  if (!savedCampaign) {
    home = findFree({ x: 15, z: -13 }, 3.6);
    Object.assign(campaign.camps[0], home);
    Object.assign(player, home);
  } else
    home =
      campaign.camps.find((c) => c.id === player.campId) ?? campaign.camps[0];
  scene.add(hero.root);
  addBlobShadow(hero);
  addXray(hero);
  loadSave();
  populateEncounters();
  selectWeapon(weapon);
  cameraTarget.set(player.x, 0, player.z);
}
// ---- Camera turn (owner's design doc, Kamera): two-finger twist, snaps to 45° ----
let camYaw = 0,
  camYawTarget = 0;
const SNAP = Math.PI / 4;
/** Screen direction (x right, z down) → world direction for the current camera turn. */
function screenToWorld(sx: number, sz: number) {
  const c = Math.cos(camYaw),
    s = Math.sin(camYaw);
  return { x: sx * c + sz * s, z: -sx * s + sz * c };
}
function snapYaw(yaw: number) {
  return Math.round(yaw / SNAP) * SNAP;
}
function turnCamera(by: number) {
  camYawTarget = snapYaw(camYawTarget + by);
}
/** The compass shows only while the camera does not face north; a tap turns it back. */
function updateCompass() {
  const el = document.getElementById("compass");
  if (!el) return;
  const off = Math.abs(Math.atan2(Math.sin(camYawTarget), Math.cos(camYawTarget))) > 0.01;
  el.hidden = !off;
  if (off) (el.firstElementChild as HTMLElement).style.transform = `rotate(${camYaw}rad)`;
}
/** Two-finger twist on the map turns the camera; on release it snaps to 45°. */
function bindTwist(canvas: HTMLElement) {
  const touches = new Map<number, { x: number; y: number }>();
  let startAngle = 0,
    startYaw = 0;
  const angle = () => {
    const [a, b] = [...touches.values()];
    return Math.atan2(b.y - a.y, b.x - a.x);
  };
  canvas.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "touch") return;
    touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (touches.size === 2) {
      startAngle = angle();
      startYaw = camYawTarget;
    }
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!touches.has(e.pointerId)) return;
    touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (touches.size === 2) camYawTarget = camYaw = startYaw - (angle() - startAngle);
  });
  const end = (e: PointerEvent) => {
    if (!touches.delete(e.pointerId)) return;
    if (touches.size < 2) camYawTarget = snapYaw(camYawTarget);
  };
  canvas.addEventListener("pointerup", end);
  canvas.addEventListener("pointercancel", end);
}
// ---- Terrain heights: gentle rolling ground from real elevations (flat at 0 without data) ----
const elevation = new Elevation();
const field = new HeightField();
let fieldCenter: Point | null = null,
  fieldMap: MapData | null = null,
  fieldBusy = false,
  fieldClock = 99;
const groundY = (x: number, z: number) => field.at(x, z);
/** Adds the ground height to every vertex of flat overlays (territory, ropes). */
function drape(obj: T.Object3D) {
  obj.updateMatrixWorld(true);
  obj.traverse((o) => {
    if (!(o instanceof T.Mesh || o instanceof T.Line)) return;
    const pos = o.geometry.getAttribute("position") as T.BufferAttribute | undefined;
    if (!pos) return;
    const base = (o.userData.flatY ??= Float32Array.from({ length: pos.count }, (_, i) => pos.getY(i)));
    const wp = new T.Vector3();
    for (let i = 0; i < pos.count; i++) {
      wp.set(pos.getX(i), base[i], pos.getZ(i)).applyMatrix4(o.matrixWorld);
      pos.setY(i, base[i] + groundY(wp.x, wp.z));
    }
    pos.needsUpdate = true;
    o.geometry.computeBoundingSphere();
  });
}
// Redrawing the world is costly and swaps every mesh, so map tiles and height updates
// that arrive close together share one redraw.
let renderDue = Infinity;
function requestRender(delay = 0.6) {
  renderDue = Math.min(renderDue, time + delay);
}
function flushRender() {
  if (time < renderDue || fieldBusy) return;
  renderDue = Infinity;
  renderTerrain();
  expedition.countBuildings();
  expedition.refreshWorld();
  nodeMap = null;
}
function updateTerrainField(dt: number) {
  fieldClock += dt;
  // A new map snapshot rebuilds the heights at once, so its redraw waits for them.
  if (fieldBusy || (fieldClock < 1 && !(field.w && fieldMap !== map))) return;
  fieldClock = 0;
  if (fieldCenter && fieldMap === map && distance(fieldCenter, player) < 30 && field.w) return;
  const start = campaign.camps[0];
  const center = { x: player.x, z: player.z },
    r = 110,
    a = unproject({ x: center.x - r, z: center.z + r }, campaign.origin),
    b = unproject({ x: center.x + r, z: center.z - r }, campaign.origin),
    startGeo = unproject(start, campaign.origin);
  fieldBusy = true;
  const origin = campaign.origin,
    builtFor = map;
  void Promise.all([
    elevation.ensure({ south: a.lat, west: a.lon, north: b.lat, east: b.lon }),
    elevation.ensure({ south: startGeo.lat - 0.001, west: startGeo.lon - 0.001, north: startGeo.lat + 0.001, east: startGeo.lon + 0.001 }),
  ])
    .then(() => {
      const ref = elevation.at(startGeo);
      if (ref === null || origin !== campaign.origin) return;
      if (field.build(center, r, origin, ref, elevation, waterTest(builtFor), builtFor)) {
        fieldCenter = center;
        fieldMap = builtFor;
        requestRender(0);
      }
    })
    .finally(() => (fieldBusy = false));
}
/** Smooth ground: one vertex per height cell, coloured by what OSM shows there,
 * with shared (smoothed) normals so slopes shade softly instead of stepping. */
function groundMesh() {
  const w = field.w,
    pos = new Float32Array(w * w * 3),
    col = new Float32Array(w * w * 3),
    c = new T.Color();
  const kindColor = (x: number, z: number, k: number) =>
    field.wet[k] ? 0x72acae : map.areas.some((a) => !a.water && inPolygon(x, z, a.rings)) ? 0x96af78 : 0xb8c397;
  for (let j = 0; j < w; j++)
    for (let i = 0; i < w; i++) {
      const k = j * w + i,
        x = field.x0 + (i + 0.5) * CELL,
        z = field.z0 + (j + 0.5) * CELL;
      pos.set([x, field.v[k], z], k * 3);
      c.setHex(kindColor(x, z, k));
      col.set([c.r, c.g, c.b], k * 3);
    }
  const index: number[] = [];
  for (let j = 0; j < w - 1; j++)
    for (let i = 0; i < w - 1; i++) {
      const a = j * w + i, b = a + 1, d = a + w, e = d + 1;
      index.push(a, d, b, b, d, e);
    }
  const g = new T.BufferGeometry();
  g.setAttribute("position", new T.BufferAttribute(pos, 3));
  g.setAttribute("color", new T.BufferAttribute(col, 3));
  g.setIndex(index);
  g.computeVertexNormals();
  const m = new T.Mesh(g, new T.MeshLambertMaterial({ vertexColors: true }));
  m.receiveShadow = true;
  m.userData.baseColors = Float32Array.from(col);
  m.userData.cellOfVertex = Int32Array.from({ length: w * w }, (_, k) => k);
  terraceView = m;
  return m;
}
// ---- Fog of war: unexplored land greyed, colour returns once seen ----
let terraceView: T.Mesh | null = null;
let seen = new Set<string>();
let seenClock = 0;
const isSeen = (x: number, z: number) => seen.has(cellOf(unproject({ x, z }, campaign.origin)));
function recolor() {
  if (terraceView) {
    const base = terraceView.userData.baseColors as Float32Array,
      cells = terraceView.userData.cellOfVertex as Int32Array,
      attr = terraceView.geometry.getAttribute("color") as T.BufferAttribute,
      known = new Map<number, boolean>();
    for (let v = 0; v < cells.length; v++) {
      const ci = cells[v];
      let ok = known.get(ci);
      if (ok === undefined) {
        const i = ci % field.w,
          j = Math.floor(ci / field.w);
        ok = isSeen(field.x0 + (i + 0.5) * CELL, field.z0 + (j + 0.5) * CELL);
        known.set(ci, ok);
      }
      const [r, g, b] = ok
        ? [base[v * 3], base[v * 3 + 1], base[v * 3 + 2]]
        : greyed(base[v * 3], base[v * 3 + 1], base[v * 3 + 2]);
      attr.setXYZ(v, r, g, b);
    }
    attr.needsUpdate = true;
  }
  for (const b of buildingViews) {
    const ok = isSeen((b.box.x0 + b.box.x1) / 2, (b.box.z0 + b.box.z1) / 2);
    for (const m of b.materials as T.MeshLambertMaterial[]) {
      const base = (m.userData.base ??= m.color.clone()) as T.Color;
      const [r, g, bb] = ok ? [base.r, base.g, base.b] : greyed(base.r, base.g, base.b);
      m.color.setRGB(r, g, bb);
    }
  }
}
function updateSeen(dt: number) {
  seenClock += dt;
  if (seenClock < 1) return;
  seenClock = 0;
  let added = markSeen(seen, unproject(player, campaign.origin));
  for (const m of companions) added += markSeen(seen, unproject(m.c, campaign.origin), 60);
  if (added) {
    campaign.explored = [...seen];
    recolor();
  }
}
/** Everything that walks or stands on the map follows the ground. */
function liftActors() {
  if (!field.w) return;
  const lift = (o: T.Object3D, extra = 0) => {
    o.position.y = groundY(o.position.x, o.position.z) + extra;
  };
  lift(hero.root, deathUntil > time ? -0.1 : 0);
  for (const m of companions) {
    lift(m.rig.root, m.c.hp <= 0 ? -0.1 : 0);
    m.bar.position.y = 2.6 + m.rig.root.position.y;
  }
  for (const e of enemies) {
    lift(e.rig.root);
    e.bar.position.y = (e.kind === "wolf" ? 1.8 : 2.8) + e.rig.root.position.y;
    e.warning.position.y = 0.07 + e.rig.root.position.y;
  }
  for (const { view } of nodeViews.values()) lift(view);
  for (const v of ventViews.values()) lift(v.view);
  for (const r of rescues.values()) {
    lift(r.rig.root);
    r.mark.position.y += r.rig.root.position.y;
  }
  partyLamp.position.y = 2.4 + hero.root.position.y;
  campFire.position.y = 1.4 + groundY(home.x, home.z);
}
function disposeTerrain() {
  for (const b of buildingViews) for (const m of b.materials) m.dispose();
  terrain.traverse((o) => {
    if (o instanceof T.Mesh) o.geometry.dispose();
  });
  terrain.clear();
  terraceView = null;
  buildingViews.length = 0;
  obstacleCells.clear();
}
let renderCount = 0,
  treeSpots: string[] = [];
function renderTerrain() {
  renderCount++;
  disposeTerrain();
  const land = new T.Mesh(new T.PlaneGeometry(1400, 1400), material(0xb8c397));
  land.rotation.x = -Math.PI / 2;
  // Beyond the height window the plain lies at its lowest point.
  land.position.set(player.x, field.w ? field.low() - 0.02 : 0, player.z);
  land.receiveShadow = true;
  terrain.add(land);
  if (field.w) terrain.add(groundMesh());
  else for (const area of map.areas) {
    const m = new T.Mesh(
      new T.ShapeGeometry(polyShape(area.rings)),
      material(area.water ? 0x72acae : 0x96af78),
    );
    m.rotation.x = -Math.PI / 2;
    m.position.y = 0.014;
    m.receiveShadow = true;
    terrain.add(m);
  }
  // Roads are ribbons whose vertices follow the ground every half cell.
  const ribbons = { road: { pos: [] as number[], idx: [] as number[] }, path: { pos: [] as number[], idx: [] as number[] } };
  for (const road of map.roads) {
    const r = road.path ? ribbons.path : ribbons.road,
      lift = road.path ? 0.03 : 0.045,
      half = road.width / 2;
    for (let i = 1; i < road.pts.length; i++) {
      const [ax, az] = road.pts[i - 1],
        [bx, bz] = road.pts[i],
        dx = bx - ax,
        dz = bz - az,
        len = Math.hypot(dx, dz);
      if (len < 0.02) continue;
      const ux = dx / len, uz = dz / len, nx = -uz * half, nz = ux * half,
        ext = 0.09, // small overlap so corners close
        steps = field.w ? Math.max(1, Math.ceil(len / (CELL / 2))) : 1,
        base = r.pos.length / 3;
      for (let k = 0; k <= steps; k++) {
        const t = -ext + ((len + 2 * ext) * k) / steps,
          x = ax + ux * t,
          z = az + uz * t;
        r.pos.push(x + nx, lift + groundY(x + nx, z + nz), z + nz, x - nx, lift + groundY(x - nx, z - nz), z - nz);
        if (k) {
          const q = base + (k - 1) * 2;
          r.idx.push(q, q + 2, q + 1, q + 1, q + 2, q + 3);
        }
      }
    }
  }
  for (const [r, color] of [
    [ribbons.road, 0xe1d5b9],
    [ribbons.path, 0xcabd96],
  ] as const) {
    if (!r.idx.length) continue;
    const g = new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute(r.pos, 3));
    g.setIndex(r.idx);
    g.computeVertexNormals();
    const m = new T.Mesh(g, material(color));
    m.receiveShadow = true;
    terrain.add(m);
  }
  const wallColors = [0xd9c4a0, 0xd1b68e, 0xc0c7b0, 0xd8ccaf, 0xc7af8e],
    roofColors = [0x657e72, 0x7e8975, 0x9a7052, 0x586f6c];
  map.buildings.forEach((b, i) => {
    // Sits on the lowest point of its outline with a foundation sunk into the ground,
    // so it never hangs on a slope; a plinth fills the downhill side.
    const hs = b.rings[0].map((p) => groundY(p[0], p[1])),
      low = Math.min(...hs, groundY(b.rings[0].reduce((s, p) => s + p[0], 0) / b.rings[0].length, b.rings[0].reduce((s, p) => s + p[1], 0) / b.rings[0].length)),
      high = Math.max(...hs),
      sink = field.w ? 0.5 : 0;
    const g = new T.ExtrudeGeometry(polyShape(b.rings), {
      depth: b.height + (high - low) + sink,
      bevelEnabled: false,
    });
    g.rotateX(-Math.PI / 2);
    g.translate(0, low - sink, 0);
    const mats = [
      material(roofColors[i % 4]).clone(),
      material(wallColors[i % 5]).clone(),
    ];
    const node = new T.Mesh(g, mats);
    node.castShadow = true;
    node.receiveShadow = true;
    terrain.add(node);
    const xs = b.rings[0].map((p) => p[0]),
      zs = b.rings[0].map((p) => p[1]);
    buildingViews.push({
      data: b,
      node,
      materials: mats,
      box: {
        x0: Math.min(...xs),
        x1: Math.max(...xs),
        z0: Math.min(...zs),
        z1: Math.max(...zs),
      },
    });
  });
  for (const b of buildingViews) {
    for (
      let x = Math.floor((b.box.x0 - 2) / 8);
      x <= Math.floor((b.box.x1 + 2) / 8);
      x++
    )
      for (
        let z = Math.floor((b.box.z0 - 2) / 8);
        z <= Math.floor((b.box.z1 + 2) / 8);
        z++
      ) {
        const key = `${x},${z}`;
        const cell = obstacleCells.get(key) ?? [];
        cell.push(b);
        obstacleCells.set(key, cell);
      }
  }
  // Trees on mapped green areas: five types by ground (owner's design doc, Drzewa),
  // each with size and turn variants; deciduous crowns follow the real season.
  // Trees are anchored to the map: a fixed grid, each cell decides from its own hash
  // whether it holds a tree, where exactly, which kind, size and turn. Redrawing the
  // world never moves or swaps a tree.
  const TREE_CELL = 3.4;
  const cellRand = (cx: number, cz: number, salt: number) => {
    let h = (Math.imul(cx | 0, 374761393) + Math.imul(cz | 0, 668265263) + Math.imul(salt, 1442695041)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  };
  type TreeKind = "round" | "spruce" | "pine" | "birch" | "bush";
  const trees: (Point & { kind: TreeKind; r: (salt: number) => number })[] = [];
  const mix: Record<string, TreeKind[]> = {
    forest: ["round", "spruce", "pine", "birch", "spruce"],
    wood: ["spruce", "pine", "round", "birch", "spruce"],
    scrub: ["bush", "bush", "birch"],
    park: ["round", "round", "birch", "bush"],
    cemetery: ["round", "spruce", "birch"],
    green: ["round", "birch", "bush"],
  };
  const density: Record<string, number> = { forest: 0.55, wood: 0.55, scrub: 0.4, park: 0.28, cemetery: 0.3, green: 0.16 };
  const roadNear = map.roads.filter((r) => r.pts.some((p) => Math.abs(p[0] - player.x) < 110 && Math.abs(p[1] - player.z) < 110));
  const nearRoad = (x: number, z: number) =>
    roadNear.some((r) => {
      for (let k = 1; k < r.pts.length; k++) {
        const [ax, az] = r.pts[k - 1], [bx, bz] = r.pts[k], dx = bx - ax, dz = bz - az, l2 = dx * dx + dz * dz || 1;
        const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / l2));
        if (Math.hypot(ax + dx * t - x, az + dz * t - z) < r.width / 2 + 1.1) return true;
      }
      return false;
    });
  const cx0 = Math.floor((player.x - 95) / TREE_CELL), cx1 = Math.floor((player.x + 95) / TREE_CELL),
    cz0 = Math.floor((player.z - 95) / TREE_CELL), cz1 = Math.floor((player.z + 95) / TREE_CELL);
  for (let cz = cz0; cz <= cz1; cz++)
    for (let cx = cx0; cx <= cx1; cx++) {
      const r = (salt: number) => cellRand(cx, cz, salt);
      const x = (cx + 0.15 + r(1) * 0.7) * TREE_CELL,
        z = (cz + 0.15 + r(2) * 0.7) * TREE_CELL;
      const area = map.areas.find((a) => !a.water && inPolygon(x, z, a.rings));
      if (!area || r(3) > (density[area.kind ?? "green"] ?? density.green)) continue;
      if (blocked(x, z, 0.9)) continue;
      if (nearRoad(x, z)) continue;
      const kinds = mix[area.kind ?? "green"] ?? mix.green;
      trees.push({ x, z, kind: kinds[Math.floor(r(4) * kinds.length)], r });
    }
  treeSpots = trees.map((t) => `${t.x.toFixed(2)},${t.z.toFixed(2)},${t.kind}`);
  const geo = new Date().getUTCMonth(),
    south = unproject(player, campaign.origin).lat < 0,
    month = (geo + (south ? 6 : 0)) % 12,
    season = month < 2 || month === 11 ? "winter" : month < 5 ? "spring" : month < 8 ? "summer" : "autumn";
  const leaf = (base: number, rand: () => number) => {
    const c = new T.Color(base);
    if (season === "spring") c.offsetHSL(0.02, 0.05, 0.1);
    if (season === "autumn") c.setHSL(0.04 + rand() * 0.07, 0.6, 0.45);
    return c;
  };
  const parts: { kind: TreeKind; trunk?: [T.BufferGeometry, number, number]; crown: [T.BufferGeometry, number, number] }[] = [
    { kind: "round", trunk: [new T.CylinderGeometry(0.12, 0.17, 1.25, 5), 0x756044, 0.63], crown: [new T.IcosahedronGeometry(1, 0), 0x56764d, 2.1] },
    { kind: "spruce", trunk: [new T.CylinderGeometry(0.1, 0.14, 0.7, 5), 0x5a4532, 0.35], crown: [new T.ConeGeometry(0.95, 2.8, 6), 0x2f5a3a, 2.05] },
    { kind: "pine", trunk: [new T.CylinderGeometry(0.11, 0.15, 2.2, 5), 0x9a5b34, 1.1], crown: [new T.CylinderGeometry(1.1, 0.8, 0.6, 7), 0x4e7a44, 2.45] },
    { kind: "birch", trunk: [new T.CylinderGeometry(0.08, 0.11, 1.5, 5), 0xe8e4da, 0.75], crown: [new T.IcosahedronGeometry(0.7, 0), 0x8fc46a, 2.0] },
    { kind: "bush", crown: [new T.IcosahedronGeometry(0.75, 0), 0x5b8a46, 0.4] },
  ];
  const matrix = new T.Matrix4();
  for (const part of parts) {
    const list = trees.filter((t) => t.kind === part.kind);
    if (!list.length) continue;
    const deciduous = part.kind === "round" || part.kind === "birch" || part.kind === "bush";
    const bare = season === "winter" && part.kind !== "bush" && deciduous;
    const trunks = part.trunk && new T.InstancedMesh(part.trunk[0], material(part.trunk[1]), list.length);
    const crowns = new T.InstancedMesh(part.crown[0], material(0xffffff), list.length);
    list.forEach((p, i) => {
      let salt = 5;
      const rand = () => p.r(salt++);
      const gy = groundY(p.x, p.z),
        size = 0.8 + rand() * 0.5,
        turn = new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 1, 0), rand() * Math.PI * 2);
      if (trunks)
        trunks.setMatrixAt(i, matrix.compose(new T.Vector3(p.x, part.trunk![2] * size + gy, p.z), turn, new T.Vector3(size, size, size)));
      const flat = part.kind === "bush" ? new T.Vector3(1.3 * size, 0.7 * size, 1.3 * size) : part.kind === "round" ? new T.Vector3(size, (1.3 + rand() * 0.5) * size, size) : new T.Vector3(size, size, size);
      // Winter: deciduous trees lose their crowns (only a thin twig cluster stays).
      if (bare) flat.multiplyScalar(0.35);
      crowns.setMatrixAt(i, matrix.compose(new T.Vector3(p.x, part.crown[2] * size + gy, p.z), turn, flat));
      crowns.setColorAt(i, bare ? new T.Color(0x6b5a4a) : deciduous ? leaf(part.crown[1], rand) : new T.Color(part.crown[1]).offsetHSL(0, 0, (rand() - 0.5) * 0.06));
    });
    crowns.castShadow = true;
    if (trunks) {
      trunks.castShadow = true;
      terrain.add(trunks);
    }
    terrain.add(crowns);
  }

  recolor();
  if (renderer) {
    renderer.shadowMap.needsUpdate = true;
  }
}
function resolveForQA() {
  for (const o of campaign.offers) o.readyAt = 0;
}
async function switchCharacter(c: Character) {
  let terrainChanged = false;
  if (!worldStream.contains(c)) {
    const next = new WorldStream(campaign.origin);
    await next.load(c);
    worldStream = next;
    map = next.snapshot();
    terrainChanged = true;
  }
  if (c !== player) {
    player.weapon = weapon;
    player.sweepReady = Math.max(0, sweepReady - time);
    player.potionReady = Math.max(0, potionReady - time);
  }
  player = c;
  if (terrainChanged) renderTerrain();
  home = campaign.camps.find((v) => v.id === c.campId) ?? campaign.camps[0];
  scene.remove(hero.root);
  hero.root.traverse((o) => {
    if (o instanceof T.Mesh) o.geometry.dispose();
  });
  hero = person(c.role === "archer" ? "archer" : "hero", c.appearance);
  scene.add(hero.root);
  addBlobShadow(hero);
  addXray(hero);
  weapon = c.weapon;
  sweepReady = time + (c.sweepReady ?? 0);
  potionReady = time + (c.potionReady ?? 0);
  attack = null;
  resetInput();
  for (const s of shots) {
    scene.remove(s.node);
    s.node.geometry.dispose();
    (s.node.material as T.Material).dispose();
  }
  shots.length = 0;
  invincibleUntil = time + 1;
  lastCombat = time - 10;
  cameraTarget.set(c.x, 0, c.z);
  hero.root.position.set(c.x, 0, c.z);
  selectWeapon(weapon);
  populateEncounters();
  syncCompanions();
}
function removeEnemy(e: Enemy) {
  scene.remove(e.rig.root, e.bar, e.warning);
  e.rig.root.traverse((o) => {
    if (o instanceof T.Mesh) o.geometry.dispose();
  });
  e.bar.traverse((o) => {
    if (o instanceof T.Mesh) {
      o.geometry.dispose();
      (o.material as T.Material).dispose();
    }
  });
  e.warning.geometry.dispose();
  (e.warning.material as T.Material).dispose();
}
// ---- Gathering spots (owner's design doc: gathered with a blow, crumble into cubes) ----
const nodeGeo = new T.BoxGeometry(1, 1, 1);
const nodeMats: Record<string, T.MeshLambertMaterial> = {};
const nodeMat = (c: number) =>
  (nodeMats[c] ??= new T.MeshLambertMaterial({ color: c }));
const NODE_COLORS: Record<NodeKind, number> = {
  wood: 0x8b5c31,
  ore: 0x8f9aa0,
  fiber: 0xc9d36a,
  herbs: 0x6fcf7a,
};
function nodeModel(kind: NodeKind) {
  const g = new T.Group();
  const block = (c: number, x: number, y: number, z: number, w: number, h: number, d: number) => {
    const m = new T.Mesh(nodeGeo, nodeMat(c));
    m.position.set(x, y + h / 2, z);
    m.scale.set(w, h, d);
    m.castShadow = true;
    g.add(m);
  };
  if (kind === "wood") {
    block(0x8b5c31, 0, 0, 0, 1.5, 0.45, 0.45);
    block(0xd9a86a, 0.76, 0.02, 0, 0.04, 0.38, 0.38);
    block(0x6b4224, -0.3, 0.45, 0.05, 0.6, 0.3, 0.35);
  } else if (kind === "ore") {
    block(0x8f9aa0, 0, 0, 0, 0.9, 0.55, 0.8);
    block(0x737e84, 0.25, 0.55, -0.1, 0.45, 0.3, 0.45);
    block(0xd27a4a, -0.2, 0.4, 0.38, 0.22, 0.18, 0.08);
  } else if (kind === "fiber") {
    for (const [x, z, h] of [[0, 0, 0.9], [0.22, 0.12, 0.7], [-0.2, 0.1, 0.75], [0.05, -0.2, 0.8]])
      block(0xc9d36a, x, 0, z, 0.1, h, 0.1);
  } else {
    block(0x4f9e5a, 0, 0, 0, 0.7, 0.35, 0.7);
    block(0x6fcf7a, 0.1, 0.35, -0.05, 0.45, 0.2, 0.45);
    block(0xe98fc6, -0.15, 0.45, 0.2, 0.14, 0.14, 0.14);
  }
  return g;
}
const nodeViews = new Map<string, { node: ResourceNode; view: T.Group }>();
let nodeCenter: Point | null = null;
let nodeMap: MapData | null = null;
function refreshResources(force = false) {
  if (!worldStream || !player) return;
  if (
    !force &&
    nodeMap === map &&
    nodeCenter &&
    distance(nodeCenter, player) < 10
  )
    return;
  nodeCenter = { x: player.x, z: player.z };
  nodeMap = map;
  const free = (p: Point) =>
    worldStream.contains(p) && !blocked(p.x, p.z, 0.75);
  const root = campaign.camps.find((c) => !c.parentId) ?? campaign.camps[0];
  const list = [
    ...starterNodes(root, free),
    ...resourceNodes(map, campaign.origin, unproject(player, campaign.origin), player, 60, free),
  ];
  const keep = new Set(list.map((n) => n.key));
  for (const [key, v] of nodeViews)
    if (!keep.has(key) || force) {
      scene.remove(v.view);
      nodeViews.delete(key);
    }
  const now = Date.now();
  for (const key of Object.keys(campaign.harvested ?? {}))
    if (campaign.harvested![key] <= now) delete campaign.harvested![key];
  for (const n of list) {
    const old = nodeViews.get(n.key);
    if (old && distance(old.node, n) < 0.5) continue;
    if (old) scene.remove(old.view);
    const view = nodeModel(n.kind);
    view.position.set(n.x, 0, n.z);
    view.rotation.y = (hash(n.key) % 628) / 100;
    scene.add(view);
    nodeViews.set(n.key, { node: n, view });
  }
  for (const v of nodeViews.values())
    v.view.visible = (campaign.harvested?.[v.node.key] ?? 0) <= now;
}
/** A blow gathers every ready spot it reaches: goods to the Vault, the spot crumbles. */
function harvestAt(hits: (p: Point) => boolean) {
  const now = Date.now();
  let got = false;
  for (const { node, view } of nodeViews.values()) {
    if (!view.visible || !hits(node)) continue;
    view.visible = false;
    campaign.harvested ??= {};
    campaign.harvested[node.key] =
      now + RESPAWN_MS * (safe(node) ? 2 : 1);
    campaign.stock[node.kind] += YIELD[node.kind];
    burst(node, NODE_COLORS[node.kind], 10);
    floatingText(`+${YIELD[node.kind]} ${NODE_NAMES[node.kind][0]}`, node, "#ffe5ab", "xp");
    got = true;
  }
  if (got) {
    sound(330, 0.08, "square");
    persist();
  }
  return got;
}
// Circle production: rates are re-read from the map when circles or ground change;
// the buffer grows from saved time, so it also counts while the game is closed.
let ratesFor: { circles: unknown; map: MapData | null } = { circles: null, map: null };
let circlePart: Record<string, number> = {};
let productionClock = 0;
function updateProduction(dt: number) {
  productionClock += dt;
  if (productionClock < 2) return;
  productionClock = 0;
  const circles = enclosedAreas(campaign);
  if (ratesFor.circles !== circles || ratesFor.map !== map) {
    const rates = circleRates(circles, map, (p) => worldStream.contains(p));
    if (rates) {
      circlePart = rates;
      ratesFor = { circles, map };
    }
  }
  // Camp folk add their work to what the circles give.
  const workers = workerRates(
    campaign.characters
      .filter((c) => isCampRole(c.role))
      .map((c) => ({
        role: c.role,
        level: levelOf(c.exp),
        trait: c.trait,
        rarity: c.rarity,
        at: campaign.camps.find((v) => v.id === c.campId) ?? c,
      })),
    map,
  );
  const rates: Record<string, number> = { ...circlePart };
  for (const [k, v] of Object.entries(workers)) rates[k] = (rates[k] ?? 0) + v;
  campaign.rates = rates;
  if (accrue(campaign, Date.now())) notify("Skarbiec pełny — zajrzyj do obozu");
}
// ---- Equipment skills (owner's design doc, Arsenał) ----
let whirl = false,
  skill2Ready = 0,
  tauntUntil = 0,
  manaShield = 0,
  manaShieldUntil = 0;
function useSkill(id: "charge" | "quake" | "fireball") {
  const power = attackPower(player);
  if (id === "charge") {
    // A dash along the heading: everyone on the way is hurt and thrown aside.
    const from = { x: player.x, z: player.z };
    for (let i = 0; i < 50; i++) {
      const nx = player.x + Math.sin(heading) * 0.1,
        nz = player.z + Math.cos(heading) * 0.1;
      if (blocked(nx, nz, R.radius)) break;
      player.x = nx;
      player.z = nz;
    }
    for (const e of enemies)
      if (e.state !== "dead" && segmentHitsCircle(from, player, e.rig.root.position, 1.2)) {
        hurtEnemy(e, dealtBy(player, 22 + power, e, false), player);
        slideEnemy(e.rig.root.position, Math.sin(heading + 1.4) * 1.5, Math.cos(heading + 1.4) * 1.5);
      }
    burst(from, 0xd9c79a, 10);
    sound(180, 0.15, "sawtooth", 0.04);
  } else if (id === "quake") {
    shake = 0.25;
    burst(player, 0x8b6b45, 18);
    for (const e of enemies)
      if (e.state !== "dead" && distance(e.rig.root.position, player) < 3.5) {
        hurtEnemy(e, dealtBy(player, 20 + power, e, false), player);
        if ((e.state as string) !== "dead") {
          e.state = "recover";
          e.timer = Math.max(e.timer, 1.2);
          e.warning.visible = false;
        }
      }
    sound(90, 0.25, "triangle", 0.05);
  } else {
    fire({ x: player.x + Math.sin(heading) * 0.65, z: player.z + Math.cos(heading) * 0.65 }, heading, false);
    const shot = shots[shots.length - 1];
    shot.damage = 26 + power;
    shot.explode = 2.5;
    (shot.node.material as T.MeshBasicMaterial).color.set(0xff8a3d);
    shot.node.scale.setScalar(1.6);
  }
}
/** Second-hand skill (button R): shield taunt or mana shield. */
function useSkill2() {
  const id = offhandSkill(player);
  if (!id || !started || paused || helpOpen || deathUntil > time || time < skill2Ready) return;
  skill2Ready = time + SKILLS[id].cooldown;
  if (id === "taunt") {
    tauntUntil = time + 4;
    for (const e of enemies)
      if (e.state !== "dead" && distance(e.rig.root.position, player) < 8)
        floatingText("!", e.rig.root.position, "#ff6b4a");
    burst(player, 0xff7a1a, 12);
  } else {
    manaShield = 40 + attackPower(player) * 2;
    manaShieldUntil = time + 6;
    burst(player, 0x2e9bff, 14);
  }
  sound(440, 0.15, "sine");
}
// ---- Passive traits (owner's design doc, Cecha): work alone, for the hero and companions ----
const traitRuntime = new Map<string, { hits: number; lastHit: number; saved: boolean }>();
function traitState(c: Character) {
  let t = traitRuntime.get(c.id);
  if (!t) traitRuntime.set(c.id, (t = { hits: 0, lastHit: -99, saved: false }));
  return t;
}
const traitPower = (c: Character) => TRAIT_STRENGTH[c.rarity ?? "common"];
/** Damage a blow or shot of `c` deals, after its trait (crits, double bolts, stuns). */
function dealtBy(c: Character | undefined, base: number, e: Enemy, rangedHit: boolean) {
  if (!c?.trait) return base;
  const t = traitState(c),
    k = traitPower(c);
  let dmg = base;
  const calm = time - t.lastHit;
  if (c.trait === "firstCrit" && calm > 5) dmg *= 1 + k;
  if (c.trait === "hawk" && calm > 3) dmg *= 2.5;
  if (c.trait === "doubleBolt" && rangedHit && Math.random() < 0.25 * k) dmg *= 2;
  t.lastHit = time;
  t.hits++;
  if ((c.trait === "stun5" && t.hits % 5 === 0) || (c.trait === "unbroken" && t.hits % 4 === 0)) {
    e.state = "recover";
    e.timer = Math.max(e.timer, 0.8 * k);
    e.warning.visible = false;
    burst(e.rig.root.position, 0xffe27a, 6);
  }
  return Math.round(dmg);
}
/** Damage `c` takes after its trait (dodges, last stand, the lantern). 0 = dodged. */
function takenBy(c: Character, damage: number) {
  if (!c.trait) return damage;
  const t = traitState(c),
    k = traitPower(c);
  if (time - lastCombat > 8) t.saved = false;
  if ((c.trait === "evasion" && Math.random() < 0.1 * k) || (c.trait === "hawk" && Math.random() < 0.2)) {
    floatingText("unik", c, "#bfe9ff");
    return 0;
  }
  if (c.trait === "lastStand" && c.hp < maxHealth(c) * 0.3) damage *= 1 - 0.3 * k;
  if (c.trait === "lantern") damage *= 0.8;
  if (c.trait === "unbroken" && !t.saved && damage >= c.hp) {
    t.saved = true;
    damage = Math.max(0, c.hp - 1);
  }
  return Math.round(damage);
}
// ---- Party: up to two companions follow the controlled character and fight alone ----
type Companion = {
  c: Character;
  rig: Rig;
  bar: T.Group;
  fill: T.Mesh;
  cool: number;
  heading: number;
  swing: number;
  stuck: number;
};
const companions: Companion[] = [];
const ranged = (c: Character) => c.role !== "warrior";
function slideCompanion(p: Point, dx: number, dz: number) {
  const steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / 0.1));
  for (let i = 0; i < steps; i++) {
    const nx = p.x + dx / steps,
      nz = p.z + dz / steps;
    if (!blocked(nx, p.z, 0.45)) p.x = nx;
    if (!blocked(p.x, nz, 0.45)) p.z = nz;
  }
}
/** Where a companion walks: behind the leader, left or right. */
function formation(slot: number): Point {
  const back = heading + Math.PI + (slot ? 0.55 : -0.55);
  return findFree({ x: player.x + Math.sin(back) * 1.8, z: player.z + Math.cos(back) * 1.8 });
}
function removeCompanion(m: Companion) {
  scene.remove(m.rig.root, m.bar);
  m.rig.root.traverse((o) => {
    if (o instanceof T.Mesh) o.geometry.dispose();
  });
}
/** Makes the companions match the saved party (after a switch, hire or panel change). */
function syncCompanions() {
  const ids = partyOf(campaign).filter((id) => id !== player.id);
  for (let i = companions.length - 1; i >= 0; i--)
    if (!ids.includes(companions[i].c.id)) {
      removeCompanion(companions[i]);
      companions.splice(i, 1);
    }
  ids.forEach((id, slot) => {
    if (companions.some((m) => m.c.id === id)) return;
    const c = campaign.characters.find((v) => v.id === id)!;
    if (distance(c, player) > 12) Object.assign(c, formation(slot));
    const rig = person(c.role === "archer" ? "archer" : "hero", c.appearance);
    rig.sword.visible = !ranged(c);
    rig.wand.visible = ranged(c);
    rig.root.position.set(c.x, 0, c.z);
    scene.add(rig.root);
    addBlobShadow(rig);
    const { group: bar, fill } = healthBar(1.3, 0x9bd27e);
    scene.add(bar);
    companions.push({ c, rig, bar, fill, cool: 0, heading: 0, swing: 0, stuck: 0 });
  });
  expedition.refreshWorld();
}
function hurtCompanion(m: Companion, damage: number) {
  if (m.c.hp <= 0 || safe(m.c)) return;
  damage = takenBy(m.c, Math.max(1, Math.round(damage - armorPower(m.c) * 0.45)));
  if (!damage) return;
  m.c.hp = Math.max(0, m.c.hp - damage);
  floatingText(String(damage), m.c, "#ff9b8a");
  lastCombat = time;
  if (m.c.hp <= 0) notify(`${m.c.name} padł — wstanie po walce`);
}
function updateCompanions(dt: number) {
  companions.forEach((m, slot) => {
    const c = m.c,
      p = m.rig.root.position;
    let moving = false;
    m.cool -= dt;
    m.swing = Math.max(0, m.swing - dt);
    if (c.hp <= 0) {
      // Downed: lies until the fight is over (8 s of calm) or the leader is in a camp.
      p.y = -0.1;
      m.rig.root.rotation.z = Math.PI * 0.4;
      const healers = [player, ...companions.map((o) => o.c)].filter(
        (v) => v.role === "herbalist" && v.hp > 0,
      );
      const calm = healers.some((v) => v.trait === "lifebloom")
        ? 0.5
        : healers.some((v) => v.trait === "quickRevive")
          ? 4
          : 8;
      if (time - lastCombat > calm || safe(player)) {
        c.hp = Math.round(maxHealth(c) * 0.3);
        m.rig.root.rotation.z = 0;
        p.y = 0;
      }
    } else {
      if (distance(p, player) > 25) {
        const f = formation(slot);
        p.set(f.x, 0, f.z);
      }
      // Herbalist: heal the most hurt party member within reach before fighting.
      if (c.role === "herbalist" && m.cool <= 0) {
        const hurt = [player, ...companions.map((o) => o.c)]
          .filter((v) => v.hp > 0 && v.hp < maxHealth(v) * 0.7 && distance(v, p) < 9)
          .sort((a, b) => a.hp / maxHealth(a) - b.hp / maxHealth(b));
        if (hurt.length) {
          healParty(c, c.trait === "lifebloom" ? hurt : [hurt[0]]);
          m.cool = 2.2;
          m.swing = 0.3;
        }
      }
      const foe = enemies
        .filter(
          (e) =>
            e.state !== "dead" &&
            distance(e.rig.root.position, player) < 10 &&
            lineClear(p, e.rig.root.position),
        )
        .sort((a, b) => distance(a.rig.root.position, p) - distance(b.rig.root.position, p))[0];
      if (foe) {
        const q = foe.rig.root.position,
          d = distance(p, q);
        m.heading = Math.atan2(q.x - p.x, q.z - p.z);
        const want = ranged(c) ? 6 : 1.5;
        if (Math.abs(d - want) > 0.6) {
          const dir = d > want ? 1 : -1,
            v = R.speed * 0.9 * dt * dir;
          slideCompanion(p, Math.sin(m.heading) * v, Math.cos(m.heading) * v);
          moving = true;
        }
        if (m.cool <= 0 && (ranged(c) ? d < 11 : d < R.reach + 0.5)) {
          m.cool = 1.1;
          m.swing = 0.3;
          if (ranged(c)) {
            fire({ x: p.x + Math.sin(m.heading) * 0.6, z: p.z + Math.cos(m.heading) * 0.6 }, m.heading, false);
            shots[shots.length - 1].damage = 10 + attackPower(c);
            shots[shots.length - 1].by = c;
          } else hurtEnemy(foe, dealtBy(c, 12 + attackPower(c), foe, false), c);
        }
      } else {
        const f = formation(slot),
          d = distance(p, f);
        if (d > 0.9) {
          m.heading = Math.atan2(f.x - p.x, f.z - p.z);
          const v = Math.min(d, R.speed * (d > 5 ? 1.25 : 0.95) * dt);
          const before = { x: p.x, z: p.z };
          slideCompanion(p, Math.sin(m.heading) * v, Math.cos(m.heading) * v);
          moving = true;
          // No path finding: a companion stuck behind a wall, or out of sight and
          // far behind, catches up by joining the leader (common in party games).
          m.stuck = distance(before, p) < v * 0.3 ? m.stuck + dt : 0;
          if ((m.stuck > 0.8 && d > 3) || (d > 8 && !lineClear(p, player))) {
            p.set(f.x, 0, f.z);
            m.stuck = 0;
          }
        }
      }
      if (c.hp < maxHealth(c) && (safe(c) || time - lastCombat > R.regenDelay))
        c.hp = Math.min(maxHealth(c), c.hp + dt * (safe(c) ? 22 : 4));
    }
    c.x = p.x;
    c.z = p.z;
    m.rig.root.rotation.y = m.heading;
    animate(m.rig, dt, moving, m.swing > 0 ? 0.5 : 0, false);
    m.bar.visible = c.hp < maxHealth(c);
    m.bar.position.set(p.x, 2.6, p.z);
    m.bar.quaternion.copy(camera.quaternion);
    m.fill.scale.x = clamp(c.hp / maxHealth(c), 0, 1);
  });
}
/** A herbalist's healing: leaves spiral round each target, green numbers. */
function healParty(by: Character, targets: Character[]) {
  const amount = Math.round(
    (12 + levelOf(by.exp) * 2) * (by.trait === "bloom" ? 1 + 0.3 * traitPower(by) : 1),
  );
  for (const v of targets) {
    if (v.hp <= 0) continue;
    v.hp = Math.min(maxHealth(v), v.hp + amount);
    floatingText(`+${amount}`, v, "#9df29a");
    burst(v, 0x8be05a, 8);
  }
  sound(720, 0.12, "sine");
}
/** Who an enemy goes for: the nearest of the party, a warrior counting as nearer (draws aggro). */
function enemyTarget(p: Point): { at: Point; m?: Companion } {
  if (time < tauntUntil && distance(player, p) < 12) return { at: player };
  let best: { at: Point; m?: Companion } = { at: player },
    score = distance(player, p) * (player.role === "warrior" ? 0.7 : 1);
  for (const m of companions) {
    if (m.c.hp <= 0) continue;
    const sc = distance(m.c, p) * (m.c.role === "warrior" ? 0.7 : 1);
    if (sc < score) {
      score = sc;
      best = { at: m.c, m };
    }
  }
  return best;
}
function hurtTarget(t: { at: Point; m?: Companion }, damage: number) {
  if (t.m) hurtCompanion(t.m, damage);
  else hurtPlayer(damage);
}
// ---- Haze vents: wake → wave → one blow drives in a stake with a lantern ----
type VentView = {
  vent: Vent;
  view: T.Group;
  state: "idle" | "wave" | "ready" | "closed";
  cubes: T.Mesh[];
};
const ventViews = new Map<string, VentView>();
const ventFog = new T.MeshBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.55, depthWrite: false });
const ventGround = new T.MeshBasicMaterial({ color: 0x1e0f33, transparent: true, opacity: 0.85, depthWrite: false });
function ventModel(v: VentView) {
  const g = v.view;
  g.clear();
  v.cubes = [];
  if (v.state === "closed") {
    // Stake with a rope knot and a lantern in the rope's colour; lighter ground.
    const glow = new T.Mesh(new T.CircleGeometry(2.6, 28), new T.MeshBasicMaterial({ color: 0xe9e2b8, transparent: true, opacity: 0.35, depthWrite: false }));
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = 0.03;
    const pole = new T.Mesh(nodeGeo, nodeMat(0x6b4224));
    pole.scale.set(0.22, 2.4, 0.22);
    pole.position.y = 1.2;
    const knot = new T.Mesh(nodeGeo, nodeMat(0xd9b46a));
    knot.scale.set(0.38, 0.2, 0.38);
    knot.position.y = 1.5;
    const lamp = new T.Mesh(nodeGeo, new T.MeshBasicMaterial({ color: 0xffd27a }));
    lamp.scale.set(0.34, 0.4, 0.34);
    lamp.position.set(0.3, 2.2, 0);
    g.add(glow, pole, knot, lamp);
    return;
  }
  const crack = new T.Mesh(new T.CircleGeometry(2.4, 24), ventGround);
  crack.rotation.x = -Math.PI / 2;
  crack.position.y = 0.04;
  g.add(crack);
  for (let i = 0; i < 9; i++) {
    const c = new T.Mesh(nodeGeo, i % 3 ? ventFog : nodeMat(0x6a5a4a));
    const s = 0.2 + ((v.vent.seed >>> i) % 5) * 0.06;
    c.scale.setScalar(s);
    c.userData.phase = i / 9;
    g.add(c);
    v.cubes.push(c);
  }
}
let ventClock = 0;
function updateVents(dt: number, now: number) {
  ventClock += dt;
  if (ventClock > 1) {
    ventClock = 0;
    const scale = map.scale;
    const list = ventCells(
      campaign.origin,
      unproject(player, campaign.origin),
      player,
      80,
      scale,
      (p, seed) =>
        worldStream.contains(p) &&
        ventRoll(seed) < ventChance(distanceToSafeZone(campaign, p, scale) / scale) &&
        !blocked(p.x, p.z, 2.6),
    );
    const keep = new Set(list.map((v) => v.key));
    for (const key of Object.keys(campaign.vents ?? {})) keep.add(key);
    keep.add("qa:vent");
    for (const [key, v] of ventViews)
      if (!keep.has(key) || distance(v.vent, player) > 110) {
        scene.remove(v.view);
        ventViews.delete(key);
      }
    for (const vent of list) {
      const old = ventViews.get(vent.key);
      if (old && distance(old.vent, vent) < 0.5) continue;
      if (old) scene.remove(old.view);
      const v: VentView = { vent, view: new T.Group(), state: campaign.vents?.[vent.key] ? "closed" : "idle", cubes: [] };
      v.view.position.set(vent.x, 0, vent.z);
      ventModel(v);
      scene.add(v.view);
      ventViews.set(vent.key, v);
    }
  }
  for (const v of ventViews.values()) {
    // Cubes torn from the ground drift up and fade, faster while it is awake.
    for (const c of v.cubes) {
      const t = (now * (v.state === "idle" ? 0.25 : 0.5) + c.userData.phase) % 1;
      const a = c.userData.phase * Math.PI * 2;
      c.position.set(Math.sin(a) * 1.4 * (1 - t * 0.5), 0.2 + t * 3.2, Math.cos(a) * 1.4 * (1 - t * 0.5));
      c.rotation.set(t * 4, t * 3, 0);
    }
    if (v.state === "idle" && distance(v.vent, player) < WAKE_RADIUS && !safe(player)) {
      v.state = "wave";
      const tier = encounterProfile(campaign, v.vent, v.vent.key, map.scale).tier;
      for (let i = 0; i < waveSize(tier); i++) {
        const a = (i / waveSize(tier)) * Math.PI * 2;
        const p = findFree({ x: v.vent.x + Math.sin(a) * 4, z: v.vent.z + Math.cos(a) * 4 });
        spawnEnemy(p, v.vent.seed + i * 7, `vent:${v.vent.key}:${i}`);
      }
    }
    if (v.state === "wave") {
      const wave = enemies.filter((e) => e.key.startsWith(`vent:${v.vent.key}:`));
      if (!wave.length && distance(v.vent, player) > WAKE_RADIUS * 3) v.state = "idle";
      else if (wave.length && wave.every((e) => e.state === "dead")) v.state = "ready";
    }
    if (v.state === "ready")
      v.view.children[0].scale.setScalar(1 + Math.sin(now * 6) * 0.08);
  }
}
/** One blow on a cleared vent drives in the stake: a chest of loot. */
function closeVentAt(hits: (p: Point) => boolean) {
  for (const v of ventViews.values()) {
    if (v.state !== "ready" || !hits(v.vent)) continue;
    v.state = "closed";
    campaign.vents ??= {};
    campaign.vents[v.vent.key] = Date.now();
    ventModel(v);
    const tier = encounterProfile(campaign, v.vent, v.vent.key, map.scale).tier;
    const gold = 20 + tier * 10,
      shards = 3 + Math.floor(tier / 2);
    player.coins += gold;
    player.fragments += shards;
    campaign.stock.ore += 2;
    if (player.bag.length < BALANCE.slots)
      player.bag.push(makeItem(campaign, v.vent.seed % GEAR_KINDS, tier + 1));
    burst(v.vent, 0xffd27a, 18);
    floatingText(`+${gold} zł · +${shards} odł.`, v.vent, "#ffe5ab", "xp");
    sound(520, 0.25, "sine");
    persist();
    return true;
  }
  return false;
}
// ---- Wayfarers in need: surrounded by monsters, join for free once saved ----
type RescueView = { spot: Vent; rig: Rig; mark: T.Mesh; state: "waiting" | "wave" };
const rescues = new Map<string, RescueView>();
let rescueClock = 0;
function addRescue(spot: Vent) {
  const rig = person(spot.seed % 2 ? "archer" : "hero", spot.seed % 10000);
  rig.sword.visible = rig.wand.visible = false;
  rig.root.position.set(spot.x, 0, spot.z);
  rig.root.scale.set(1, 0.78, 1); // kneeling, waiting for help
  scene.add(rig.root);
  addBlobShadow(rig);
  const mark = new T.Mesh(nodeGeo, new T.MeshBasicMaterial({ color: 0xffd27a }));
  mark.scale.set(0.22, 0.55, 0.22);
  scene.add(mark);
  rescues.set(spot.key, { spot, rig, mark, state: "waiting" });
}
function dropRescue(key: string) {
  const r = rescues.get(key);
  if (!r) return;
  scene.remove(r.rig.root, r.mark);
  r.rig.root.traverse((o) => {
    if (o instanceof T.Mesh) o.geometry.dispose();
  });
  rescues.delete(key);
}
function updateRescues(dt: number, now: number) {
  rescueClock += dt;
  if (rescueClock > 1) {
    rescueClock = 0;
    const scale = map.scale;
    const list = ventCells(
      campaign.origin,
      unproject(player, campaign.origin),
      player,
      80,
      scale,
      (p, seed) =>
        worldStream.contains(p) &&
        ventRoll(seed ^ 0x5bd1e995) < rescueChance(distanceToSafeZone(campaign, p, scale) / scale) &&
        !blocked(p.x, p.z, 1.5),
      RESCUE_GRID,
      "w1",
    ).filter((v) => !campaign.rescued?.[v.key]);
    const keep = new Set(list.map((v) => v.key));
    keep.add("qa:rescue");
    for (const [key, r] of rescues)
      if ((!keep.has(key) && r.state === "waiting") || distance(r.spot, player) > 110) dropRescue(key);
    for (const spot of list) if (!rescues.has(spot.key)) addRescue(spot);
  }
  for (const r of rescues.values()) {
    r.mark.position.set(r.spot.x, 2.6 + Math.sin(now * 4) * 0.15, r.spot.z);
    r.mark.visible = r.state === "waiting";
    if (r.state === "waiting" && distance(r.spot, player) < 10 && !safe(player)) {
      r.state = "wave";
      const tier = encounterProfile(campaign, r.spot, r.spot.key, map.scale).tier;
      const n = Math.max(3, waveSize(tier) - 1);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + 0.3;
        const p = findFree({ x: r.spot.x + Math.sin(a) * 3.5, z: r.spot.z + Math.cos(a) * 3.5 });
        spawnEnemy(p, r.spot.seed + i * 13, `rescue:${r.spot.key}:${i}`);
      }
    }
    if (r.state === "wave") {
      const wave = enemies.filter((e) => e.key.startsWith(`rescue:${r.spot.key}:`));
      if (!wave.length && distance(r.spot, player) > 30) r.state = "waiting";
      else if (wave.length && wave.every((e) => e.state === "dead")) freeWayfarer(r);
    }
  }
}
/** Saved: joins the party for free (or waits in the nearest camp), with the land's level. */
function freeWayfarer(r: RescueView) {
  const scale = map.scale,
    frontier = distanceToSafeZone(campaign, r.spot, scale) / scale,
    geo = unproject(r.spot, campaign.origin);
  let seed = r.spot.seed | 0;
  const rand = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) | 0) >>> 0) / 4294967296;
  const roles = ["warrior", "mage", "archer", "herbalist"] as const;
  const role = roles[Math.floor(rand() * roles.length)];
  const odds = rescueRarity(frontier);
  const w = rollWayfarer(rand, role, regionAt(geo.lat, geo.lon), new Set(campaign.characters.map((c) => c.name)), {
    rarityLift: odds.rarityLift,
    legendary: rand() < odds.legendChance,
  });
  const level = encounterProfile(campaign, r.spot, r.spot.key, scale).tier;
  const camp = nearCamp(campaign, r.spot, Infinity) ?? campaign.camps[0];
  const c = addWayfarer(
    campaign,
    { id: r.spot.key, ...w, role, appearance: r.spot.seed % 10000, level },
    r.spot,
    camp.id,
  );
  campaign.rescued ??= {};
  campaign.rescued[r.spot.key] = Date.now();
  dropRescue(r.spot.key);
  if (partyOf(campaign).length < PARTY_SIZE) {
    campaign.party = [...partyOf(campaign), c.id];
    syncCompanions();
    notify(`${fullName(c)} (${roleName(role)}, ${RARITY_NAMES[c.rarity ?? "common"]}) dołącza do drużyny`);
  } else {
    Object.assign(c, { x: camp.x + 1.5, z: camp.z + 1.5 });
    expedition.refreshWorld();
    notify(`${fullName(c)} czeka na Ciebie w obozie`);
  }
  burst(r.spot, 0xffd27a, 16);
  persist();
}
/** QA: haze vents near the hero. */
function ventSnapshot() {
  return [...ventViews.values()].map((v) => ({ key: v.vent.key, x: v.vent.x, z: v.vent.z, state: v.state }));
}
/** QA: the gathering spots near the hero. */
function resourceSnapshot() {
  return [...nodeViews.values()].map(({ node, view }) => ({ ...node, ready: view.visible }));
}
function populateEncounters() {
  if (!worldStream || qaFixtureActive) return;
  for (let i = enemies.length - 1; i >= 0; i--)
    if (
      distance(enemies[i].spawn, player) > 85 ||
      (!/^(vent|rescue|summon):/.test(enemies[i].key) &&
        !encounterAllowed(campaign, enemies[i].spawn, enemies[i].key, map.scale))
    ) {
      removeEnemy(enemies[i]);
      enemies.splice(i, 1);
    }
  // Stable geographic rolls; a settled frontier reduces density and softens threat.
  const cells = encounterCells(unproject(player, campaign.origin))
    .map((c) => ({ ...c, p: project(c.geo, campaign.origin) }))
    .filter((c) => distance(c.p, player) < 70)
    .sort((a, b) => distance(a.p, player) - distance(b.p, player));
  for (const { key, seed, p } of cells) {
    if (enemies.length >= (compatibility ? 22 : 32)) break;
    if (
      enemies.some((e) => e.key === key) ||
      seed % 4 === 0 ||
      (campaign.encounters[key] ?? 0) > Date.now() ||
      blocked(p.x, p.z, 1.2) ||
      !encounterAllowed(campaign, p, key, map.scale)
    )
      continue;
    spawnEnemy(p, seed, key);
  }
}
async function travelTo(geo: Geo) {
  const next = new WorldStream(geo);
  await next.load({ x: 0, z: 0 });
  const nextMap = next.snapshot();
  const destination = findLanding(nextMap, (p) => next.contains(p, 4.6));
  const oldOrigin = campaign.origin;
  expedition.reproject((p) => project(unproject(p, oldOrigin), geo));
  campaign.origin = geo;
  worldStream = next;
  map = nextMap;
  for (const e of enemies) removeEnemy(e);
  enemies.length = 0;
  renderTerrain();
  player.x = destination.x;
  player.z = destination.z;
  const camp = {
    ...destination,
    id: `camp-${++campaign.serial}`,
    route: [] as Point[],
    buildings: 0,
  };
  campaign.camps.push(camp);
  player.campId = camp.id;
  home = camp;
  await switchCharacter(player);
  expedition.countBuildings();
  expedition.refreshWorld();
  persist();
}
function updateWorld(dt: number) {
  worldClock += dt;
  if (worldClock < 0.5) return;
  worldClock = 0;
  if (Math.hypot(player.x, player.z) > 1500 && !expedition.rope) {
    const oldOrigin = campaign.origin,
      nextOrigin = unproject(player, oldOrigin);
    expedition.reproject((p) => project(unproject(p, oldOrigin), nextOrigin));
    campaign.origin = nextOrigin;
    worldStream.rebase(nextOrigin);
    for (const e of enemies) removeEnemy(e);
    enemies.length = 0;
    home = campaign.camps.find((c) => c.id === player.campId)!;
    cameraTarget.set(player.x, 0, player.z);
    refreshResources(true);
    persist();
  }
  // The bundled Lublin fragment works offline; fetch geography before its edge.
  if (
    !savedCampaign &&
    worldStream.tiles.size === 0 &&
    Math.abs(player.x) < 55 &&
    Math.abs(player.z) < 55
  ) {
    populateEncounters();
    updateProduction(0.5);
    return;
  }
  worldStream.request(player);
  if (worldStream.changed) {
    map = worldStream.snapshot();
    requestRender();
  }
  populateEncounters();
  refreshResources();
  updateProduction(0.5);
}
// The hero stays visible behind buildings: a flat tinted copy drawn only where
// something already drawn is nearer (depth test "greater"). The copy is drawn after
// the world (render order 1) but before the hero himself (2), so his own parts never
// hide each other and in plain sight he paints over it (owner's design doc).
const xrayMaterial = new T.MeshBasicMaterial({
  color: 0xc9a46a,
  depthWrite: false,
  depthFunc: T.GreaterDepth,
});
function addXray(rig: Rig) {
  const meshes: T.Mesh[] = [];
  rig.root.traverse((o) => {
    if (
      o instanceof T.Mesh &&
      !(o.material instanceof T.Material && o.material.transparent)
    )
      meshes.push(o);
  });
  for (const m of meshes) {
    m.renderOrder = 2;
    const ghost = new T.Mesh(m.geometry, xrayMaterial);
    ghost.renderOrder = 1;
    ghost.userData.xray = true;
    m.add(ghost);
  }
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
/** Time of day and weather now (set by the sky; day and clear until known). */
let timeOfDay: TimeOfDay = "day",
  weatherNow: Weather = "clear";
const KIND_OF: Record<Behavior, Enemy["kind"]> = {
  pack: "wolf",
  charge: "raider",
  shooter: "archer",
  caster: "mage",
  ambush: "raider",
  summoner: "mage",
  colossus: "heavy",
  thief: "raider",
  lure: "wolf",
  whirl: "heavy",
};
const BASE_HP = { weak: 32, medium: 48, elite: 120, boss: 320 };
function enemyHp(e: Pick<Enemy, "boss" | "elite" | "species" | "tier">) {
  const rank = e.boss ? "boss" : e.elite ? "elite" : e.species.rank;
  return BASE_HP[rank] * (rank === "medium" && e.species.behavior === "summoner" ? 0.6 : 1) * (1 + (e.tier - 1) * 0.35);
}
function enemyScale(e: Pick<Enemy, "boss" | "elite" | "species">) {
  return e.species.size * (e.boss ? 1.5 : e.elite && e.species.rank !== "elite" ? 1.2 : 1);
}
/** Placeholder look: the current rigs tinted towards the species colour. */
function tintRig(rig: Rig, color: number) {
  const c = new T.Color(color);
  rig.root.traverse((o) => {
    if (o instanceof T.Mesh && o.material instanceof T.MeshLambertMaterial) {
      o.material = o.material.clone();
      o.material.color.lerp(c, 0.55);
    } else if (o instanceof T.Mesh && o.material instanceof T.MeshStandardMaterial) {
      o.material = o.material.clone();
      o.material.color.lerp(c, 0.55);
    }
  });
}
function spawnEnemy(p: Point, id: number, key = `legacy-${id}`, forced?: Species) {
  const { elite, boss, tier, frontierMeters } = encounterProfile(campaign, p, key, map.scale);
  const roll = (hash(`${key}:species`) % 1000) / 1000;
  const species =
    forced ??
    pickSpecies(
      biomeAt(map, p),
      boss ? "boss" : elite ? "elite" : roll < 0.6 ? "weak" : "medium",
      timeOfDay,
      weatherNow,
      frontierMeters > 800,
      (hash(`${key}:pick`) % 1000) / 1000,
    );
  const behavior = species.behavior,
    kind = KIND_OF[behavior],
    rig =
      species.look === "wolf"
        ? wolf()
        : person(species.look === "archer" ? "archer" : "hero", id % 10000);
  if (species.look !== "wolf") {
    rig.sword.visible = kind === "raider" || kind === "heavy";
    rig.wand.visible = !rig.sword.visible;
  }
  tintRig(rig, species.color);
  rig.root.position.set(p.x, 0, p.z);
  rig.root.scale.setScalar(enemyScale({ boss, elite, species }));
  scene.add(rig.root);
  addBlobShadow(rig);
  const { group: bar, fill } = healthBar(
    boss ? 3.2 : elite ? 2.3 : 1.7,
    boss ? 0xe57975 : elite ? 0xf2bc68 : 0xd9a27e,
  );
  scene.add(bar);
  // Red shape on the ground = "I am about to hit here" (the only warning language).
  const warning =
    behavior === "charge"
      ? sector(6.5, 0.14, 0xe66c43, 0.4)
      : behavior === "colossus"
        ? sector(3.2, Math.PI, 0xe66c43, 0.35)
        : behavior === "whirl"
          ? sector(2.7, Math.PI, 0xe66c43, 0.35)
          : kind === "wolf" || kind === "raider" || kind === "heavy"
            ? sector(elite ? 5 : 3.5, 0.38, 0xe66c43, 0.4)
            : sector(11, 0.08, 0xe66c43, 0.3);
  warning.position.y = 0.07;
  warning.visible = false;
  scene.add(warning);
  const e: Enemy = {
    id,
    key,
    tier,
    boss,
    rig,
    spawn: { ...p },
    wanderTarget: null,
    wanderWait: Math.random() * 2,
    hp: 0,
    maxHp: 0,
    kind,
    species,
    behavior,
    hidden: behavior === "ambush",
    summonT: 3,
    stolen: 0,
    fleeUntil: 0,
    elite: elite || species.rank === "elite",
    state: "idle",
    timer: 0,
    heading: 0,
    hit: false,
    flash: 0,
    bar,
    fill,
    warning,
    respawn: 0,
  };
  e.hp = e.maxHp = enemyHp(e);
  if (e.hidden) rig.root.visible = false;
  enemies.push(e);
  return e;
}
function selectWeapon(w: "sword" | "magic") {
  weapon = w;
  hero.sword.visible = w === "sword";
  hero.wand.visible = w === "magic";
  $("attack-symbol").innerHTML = hudIcon(w);
  document.querySelectorAll<HTMLButtonElement>("[data-weapon]").forEach((b) => {
    const selected = b.dataset.weapon === w;
    b.classList.toggle("selected", selected);
    b.setAttribute("aria-pressed", String(selected));
  });
  persist();
}
// Damage numbers and "+XP" use separate lanes (XP higher and slower) and are pushed
// apart on screen, so they never sit on top of each other (owner's design doc).
function floatingText(
  text: string,
  p: Point,
  color = "#fff1c8",
  lane: "damage" | "xp" = "damage",
) {
  const el = document.createElement("span");
  el.className = lane === "xp" ? "float-label float-xp" : "float-label";
  el.textContent = text;
  el.style.color = color;
  document.body.append(el);
  const jitter = lane === "damage" ? (Math.random() - 0.5) * 0.9 : 0,
    life = lane === "xp" ? 1.3 : 0.8;
  floating.push({
    el,
    p: new T.Vector3(p.x + jitter, lane === "xp" ? 3.5 : 2.4, p.z),
    life,
    total: life,
  });
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
function hurtEnemy(e: Enemy, damage: number, by?: Character) {
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
    e.respawn = /^(vent|rescue|summon):/.test(e.key) ? Infinity : 30;
    if (e.stolen) {
      player.coins += e.stolen;
      floatingText(`+${e.stolen} zł`, e.rig.root.position, "#ffd27a", "xp");
      e.stolen = 0;
    }
    // Trait "Iskra": the fallen enemy bursts and hurts its neighbours (no chain).
    if (by?.trait === "volatile") {
      burst(e.rig.root.position, 0x9fd8ff, 12);
      for (const o of enemies)
        if (o !== e && o.state !== "dead" && distance(o.rig.root.position, e.rig.root.position) < 2.5)
          hurtEnemy(o, Math.round(10 * traitPower(by)));
    }
    player.kills++;
    const earned = Math.max(
      1,
      Math.round(
        ((e.boss ? 80 : e.elite ? 24 : 8) * (1 + (e.tier - 1) * 0.3)) /
          (1 + Math.max(0, levelOf(player.exp) - e.tier - 2) * 0.6),
      ),
    );
    player.exp += earned;
    // Everyone in the party who took part (nearby and standing) learns from the fight.
    for (const m of companions)
      if (m.c.hp > 0 && distance(m.c, e.rig.root.position) < 15) m.c.exp += earned;
    player.coins += e.boss ? 100 : e.elite ? 35 : 5 + e.tier * 2;
    campaign.encounters[e.key] = Date.now() + 45_000;
    if (
      player.bag.length < BALANCE.slots &&
      (player.kills % 3 === 0 || e.elite)
    )
      player.bag.push(makeItem(campaign, e.id % GEAR_KINDS, e.tier));
    player.fragments += e.elite ? 5 : 1;
    sound(640, 0.13, "sine");
    floatingText(`+${earned} XP`, e.rig.root.position, "#e6f3be", "xp");
    persist();
  }
}
function hurtPlayer(damage: number) {
  if (time < invincibleUntil || time < deathUntil || safe(player)) return;
  damage = takenBy(player, Math.max(1, Math.round(damage - armorPower(player) * 0.45)));
  if (time < tauntUntil) damage = Math.round(damage * 0.7);
  if (time < manaShieldUntil && manaShield > 0) {
    const absorbed = Math.min(manaShield, damage);
    manaShield -= absorbed;
    damage -= absorbed;
    if (absorbed) floatingText(`−${absorbed}`, player, "#8fc8ff");
  }
  if (!damage) return;
  player.hp = Math.max(0, player.hp - damage);
  invincibleUntil = time + 0.35;
  lastCombat = time;
  shake = 0.2;
  flashUntil = time + 0.22;
  floatingText("−" + damage, player, "#ffbfa4");
  sound(95, 0.11, "sawtooth", 0.04);
  if (player.hp <= 0) {
    deathUntil = time + 1.1;
    player.exp = loseXp(player.exp);
    expedition?.cancelRope();
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
  const skill = sweep ? weaponSkill(player) : null;
  if (sweep) sweepReady = time + SKILLS[skill!].cooldown;
  if (skill === "heal") {
    healParty(player, [player, ...companions.map((m) => m.c)].filter((v) => distance(v, player) < 8));
    lastAttack = time;
    return;
  }
  if (skill === "charge" || skill === "quake" || skill === "fireball") {
    useSkill(skill);
    lastAttack = time;
    lastCombat = time;
    return;
  }
  whirl = skill === "whirl";
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
  node.position.set(p.x, 1.1 + groundY(p.x, p.z), p.z);
  scene.add(node);
  const speed = fromEnemy ? 10 : 23;
  shots.push({
    node,
    fromEnemy,
    vx: Math.sin(dir) * speed,
    vz: Math.cos(dir) * speed,
    life: fromEnemy ? 2.2 : 1.1,
    damage: fromEnemy ? 13 : 18 + attackPower(player),
    by: fromEnemy ? undefined : player,
  });
}
function usePotion() {
  if (
    !started ||
    paused ||
    helpOpen ||
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
        enemyScale(e) * Math.max(0, 1 - Math.max(0, e.timer - 0.6) * 2),
      );
      e.respawn -= dt;
      if (e.respawn <= 0 && distance(player, e.spawn) > 10 && !safe(e.spawn)) {
        const profile = encounterProfile(campaign, e.spawn, e.key, map.scale);
        e.tier = profile.tier;
        e.boss = profile.boss;
        e.elite = profile.elite;
        e.maxHp = enemyHp(e);
        e.state = "idle";
        e.hp = e.maxHp;
        e.timer = 0;
        e.rig.root.position.set(e.spawn.x, 0, e.spawn.z);
        e.rig.root.rotation.z = 0;
        e.rig.root.scale.setScalar(enemyScale(e));
        e.hidden = e.behavior === "ambush";
        e.rig.root.visible = !e.hidden;
        e.stolen = 0;
      }
      continue;
    }
    const p = e.rig.root.position,
      target = enemyTarget(p),
      tgt = target.at,
      d = distance(tgt, p);
    let moving = false;
    e.timer -= dt;
    // Ambush: hidden in water, trees or under the ground until you come close.
    if (e.hidden) {
      e.rig.root.visible = false;
      e.bar.visible = false;
      if (d < 4 && !safe(tgt)) {
        e.hidden = false;
        e.rig.root.visible = true;
        burst(p, e.species.color, 12);
        e.state = "windup";
        e.timer = 0.35;
        e.heading = Math.atan2(tgt.x - p.x, tgt.z - p.z);
        e.hit = false;
      } else continue;
    }
    // Lure: draws you in and bursts next to the party.
    if (e.behavior === "lure" && d < 1.6 && !safe(tgt)) {
      burst(p, e.species.color, 18);
      for (const t of [{ at: player as Point }, ...companions.filter((m) => m.c.hp > 0).map((m) => ({ at: m.c as Point, m }))])
        if (distance(t.at, p) < 2.6) hurtTarget(t, Math.round(14 * (1 + (e.tier - 1) * 0.22)));
      hurtEnemy(e, 99999);
      continue;
    }
    // Summoner: calls servants of its biome (at most four), stays back itself.
    if (e.behavior === "summoner" && d < 12 && !safe(tgt)) {
      e.summonT -= dt;
      const servants = enemies.filter((o) => o.key.startsWith(`summon:${e.key}:`) && o.state !== "dead");
      if (e.summonT <= 0 && servants.length < 4) {
        e.summonT = 6;
        // Servants of its own biome (a leshy calls wolves wherever it stands).
        const kind = speciesById(
          SERVANTS[e.species.biome === "any" ? biomeAt(map, e.spawn) : e.species.biome],
        );
        for (let i = 0; i < 2; i++) {
          const q = findFree({ x: p.x + Math.sin(e.heading + 1.5 + i * 3) * 1.6, z: p.z + Math.cos(e.heading + 1.5 + i * 3) * 1.6 });
          spawnEnemy(q, e.id + 7919 * (servants.length + i + 1), `summon:${e.key}:${Date.now() % 100000}:${i}`, kind);
        }
        burst(p, 0x7c3aed, 12);
      }
    }
    // Thief with loot: runs away fast, no fighting.
    if (e.behavior === "thief" && time < e.fleeUntil) {
      const a = Math.atan2(p.x - tgt.x, p.z - tgt.z);
      e.heading = a;
      slideEnemy(p, Math.sin(a) * 4.2 * dt, Math.cos(a) * 4.2 * dt);
      e.state = "idle";
      e.warning.visible = false;
      e.rig.root.rotation.y = e.heading;
      animate(e.rig, dt, true, 0, false);
      e.bar.visible = d < 20;
      e.bar.position.set(p.x, e.kind === "wolf" ? 1.8 : 2.8, p.z);
      e.bar.quaternion.copy(camera.quaternion);
      e.fill.scale.x = clamp(e.hp / e.maxHp, 0, 1);
      continue;
    }
    if (safe(tgt) || safe(p)) {
      e.state = "idle";
      e.timer = 0;
      e.hit = false;
    }
    if (e.state === "idle") {
      if (distance(p, e.spawn) > 20 || safe(tgt) || safe(p) || d > 17) {
        moving = wander(e, dt);
        if (d > 20) e.hp = Math.min(e.maxHp, e.hp + dt * 6);
      } else if (
        d <
          (e.behavior === "charge"
            ? 6
            : e.behavior === "colossus" || e.behavior === "whirl"
              ? 2.8
              : e.kind === "wolf" || e.kind === "raider" || e.kind === "heavy"
                ? 3.6
                : 10) &&
        lineClear(p, tgt)
      ) {
        e.wanderTarget = null;
        e.state = "windup";
        e.timer =
          e.behavior === "colossus"
            ? 1.3
            : e.behavior === "charge"
              ? 0.8
              : e.kind === "heavy"
                ? 1.1
                : e.kind === "wolf" || e.kind === "raider"
                  ? 0.65
                  : 0.85;
        e.heading = Math.atan2(tgt.x - p.x, tgt.z - p.z);
        e.hit = false;
      } else {
        let a = Math.atan2(tgt.x - p.x, tgt.z - p.z);
        e.heading = a;
        // A pack circles in from the sides.
        if (e.behavior === "pack" && d > 3) a += e.id % 2 ? 0.6 : -0.6;
        // A summoner keeps its distance.
        if (e.behavior === "summoner" && d < 7) a += Math.PI;
        const sign = e.kind === "archer" && d < 5 ? -1 : 1;
        slideEnemy(
          p,
          Math.sin(a) *
            (e.kind === "heavy" ? 1.7 : e.kind === "wolf" ? 3.1 : 2.5) *
            dt *
            sign,
          Math.cos(a) *
            (e.kind === "heavy" ? 1.7 : e.kind === "wolf" ? 3.1 : 2.5) *
            dt *
            sign,
        );
        moving = true;
      }
    } else if (e.state === "windup" && e.timer <= 0) {
      e.state = "strike";
      e.timer =
        e.behavior === "charge"
          ? 0.45
          : e.kind === "wolf" || e.kind === "raider" || e.kind === "heavy"
            ? 0.32
            : 0.12;
      // Colossus slam / whirl: the whole red circle is hit at once.
      if (e.behavior === "colossus" || e.behavior === "whirl") {
        const r = e.behavior === "colossus" ? 3.2 : 2.7;
        shake = Math.max(shake, e.behavior === "colossus" ? 0.2 : 0.08);
        burst(p, e.species.color, 14);
        for (const t of [{ at: player as Point }, ...companions.filter((m) => m.c.hp > 0).map((m) => ({ at: m.c as Point, m }))])
          if (distance(t.at, p) < r)
            hurtTarget(t, Math.round((e.boss ? 38 : e.elite ? 28 : 22) * (1 + (e.tier - 1) * 0.22)));
        e.hit = true;
      }
      if (e.kind === "archer" || e.kind === "mage") {
        fire(p, e.heading, true);
        shots[shots.length - 1].damage = Math.round(
          (e.kind === "mage" ? 17 : 13) *
            (e.boss ? 1.6 : e.elite ? 1.15 : 1) *
            (1 + (e.tier - 1) * 0.22),
        );
      }
    } else if (e.state === "strike") {
      if (
        (e.kind === "wolf" || e.kind === "raider" || e.kind === "heavy") &&
        e.behavior !== "colossus" &&
        e.behavior !== "whirl"
      ) {
        const before = { x: p.x, z: p.z };
        const speed = e.behavior === "charge" ? 14 : 10;
        slideEnemy(
          p,
          Math.sin(e.heading) * speed * dt,
          Math.cos(e.heading) * speed * dt,
        );
        if (!e.hit && segmentHitsCircle(before, p, tgt, 0.95)) {
          hurtTarget(
            target,
            Math.round(
              (e.boss ? 38 : e.elite ? 25 : e.kind === "heavy" ? 24 : 15) *
                (1 + (e.tier - 1) * 0.22),
            ),
          );
          e.hit = true;
          // Thief: grabs gold from the hero and runs.
          if (e.behavior === "thief" && !target.m && player.coins > 0) {
            const grab = Math.min(player.coins, Math.max(5, Math.round(player.coins * 0.1)));
            player.coins -= grab;
            e.stolen += grab;
            e.fleeUntil = time + 7;
            floatingText(`−${grab} zł`, player, "#ffd27a");
          }
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
            attack.sweep ? (whirl ? Math.PI : R.sweepHalfArc) : R.halfArc,
          ) &&
          lineClear(player, e.rig.root.position)
        ) {
          hurtEnemy(e, dealtBy(player, (attack.sweep ? 24 : 16) + attackPower(player), e, false), player);
          hit = true;
        }
      const a = attack;
      if (
        closeVentAt(
          (p) =>
            inArc(player, p, heading, a.sweep ? R.sweepReach : R.reach, a.sweep ? R.sweepHalfArc : R.halfArc, 2.2),
        )
      )
        hit = true;
      if (
        harvestAt(
          (p) =>
            inArc(
              player,
              p,
              heading,
              a.sweep ? R.sweepReach : R.reach,
              a.sweep ? R.sweepHalfArc : R.halfArc,
              0.6,
            ) && lineClear(player, p),
        )
      )
        hit = true;
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
    if (!hit && s.fromEnemy)
      for (const m of companions)
        if (m.c.hp > 0 && segmentHitsCircle(before, p, m.c, 0.6)) {
          hurtCompanion(m, s.damage);
          hit = true;
          break;
        }
    if (!hit && !s.fromEnemy)
      hit = harvestAt((q) => segmentHitsCircle(before, p, q, 0.7));
    if (!hit && !s.fromEnemy)
      for (const e of enemies)
        if (
          e.state !== "dead" &&
          segmentHitsCircle(before, p, e.rig.root.position, 0.7)
        ) {
          hurtEnemy(e, dealtBy(s.by, s.damage, e, true), s.by);
          hit = true;
          break;
        }
    if (hit && s.explode) {
      burst(p, 0xff8a3d, 16);
      for (const e of enemies)
        if (e.state !== "dead" && distance(e.rig.root.position, p) < s.explode)
          hurtEnemy(e, Math.round(s.damage * 0.6), s.by);
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
  const placed: { x: number; y: number }[] = [];
  for (let i = 0; i < floating.length; i++) {
    const f = floating[i];
    f.life -= dt;
    f.p.y += dt * (f.total > 1 ? 0.9 : 1.6);
    const v = f.p.clone().project(camera);
    const x = ((v.x + 1) * innerWidth) / 2;
    let y = ((1 - v.y) * innerHeight) / 2;
    // Older labels keep their place; a newer one moves up until it is clear.
    for (let k = 0; k < placed.length; k++)
      if (Math.abs(placed[k].x - x) < 46 && Math.abs(placed[k].y - y) < 22) {
        y = placed[k].y - 22;
        k = -1;
      }
    placed.push({ x, y });
    f.el.style.left = `${x}px`;
    f.el.style.top = `${y}px`;
    f.el.style.opacity = String(Math.min(1, f.life * 3));
  }
  for (let i = floating.length - 1; i >= 0; i--)
    if (floating[i].life <= 0) {
      floating[i].el.remove();
      floating.splice(i, 1);
    }
}
function updateHud() {
  const hp = clamp(player.hp / maxHp(), 0, 1);
  $("hp-fill").style.width = `${hp * 100}%`;
  document
    .querySelector(".health")
    ?.setAttribute("aria-valuenow", String(Math.round(hp * 100)));
  const share = xpShare(player.exp);
  document
    .querySelector<HTMLElement>(".avatar")
    ?.style.setProperty("--xp", `${share * 360}deg`);
  document
    .querySelector(".xp")
    ?.setAttribute("aria-valuenow", String(Math.round(share * 100)));
  document.querySelector(".vitals")?.classList.toggle("low-health", hp < 0.3);
  $("hp-label").textContent = `${Math.ceil(player.hp)} / ${maxHp()}`;
  $("level").textContent = String(levelOf(player.exp));
  const nameNode = document.querySelector(".hero-name")?.firstChild;
  if (nameNode) nameNode.textContent = `${fullName(player)} `;
  document
    .querySelector<HTMLElement>(".vitals")
    ?.style.setProperty("--rarity", RARITY_COLORS[player.rarity ?? "common"]);
  $("xp-fill").style.width = `${share * 100}%`;
  const inSafe = safe(player);
  $("zone").className = `zone ${inSafe ? "safe" : "danger"}`;
  $("zone").textContent = inSafe
    ? nearCamp(campaign, player)
      ? "Obóz"
      : "Bezpieczna lina"
    : time - lastCombat < R.regenDelay
      ? "Walka"
      : "Poza obozem";
  // Gold and shards are the hero's own; the rest is the shared Vault.
  const stockLine = `${player.coins} zł · ${player.fragments} odł. · ${campaign.stock.wood} drewna · ${campaign.stock.rope} m liny`;
  if ($("loot").textContent !== stockLine) $("loot").textContent = stockLine;
  const sweepLeft = Math.max(0, sweepReady - time),
    healLeft = Math.max(0, potionReady - time);
  $<HTMLButtonElement>("sweep").disabled = sweepLeft > 0 || paused || helpOpen;
  const s1 = SKILLS[weaponSkill(player)].name.toUpperCase();
  if ($("sweep-name").textContent !== s1) $("sweep-name").textContent = s1;
  const off = offhandSkill(player),
    s2 = $<HTMLButtonElement>("skill2");
  s2.hidden = !off;
  if (off) {
    const left = Math.max(0, skill2Ready - time);
    s2.disabled = left > 0 || paused || helpOpen;
    $("skill2-name").textContent = SKILLS[off].name.toUpperCase();
    $("skill2-time").textContent = left ? `${left.toFixed(1)} s` : "GOTOWY";
  }
  $("sweep-time").textContent = sweepLeft
    ? `${sweepLeft.toFixed(1)} s`
    : "GOTOWY";
  $<HTMLButtonElement>("heal").disabled =
    healLeft > 0 || player.hp >= maxHp() || paused || helpOpen;
  $("heal-time").textContent = healLeft
    ? `${Math.ceil(healLeft)} s`
    : "MIKSTURA";
  $("fps").textContent =
    `${Math.round(1 / (frames.reduce((a, b) => a + b, 0) / Math.max(1, frames.length) || 1))} FPS · ${map.buildings.length} brył OSM`;
  $("pause").textContent = paused ? "▶" : "Ⅱ";
  $("pause").setAttribute("aria-label", paused ? "Wznów grę" : "Pauza");
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
  if (value) notify("Pauza — świat i przeciwnicy czekają.");
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
  ground.constant = -groundY(player.x, player.z);
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
        if (len > 5) {
          const w = screenToWorld(dx, dy);
          heading = Math.atan2(w.x, w.z);
        }
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
    if (e.code === "Escape" && e.defaultPrevented) return;
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
    if (e.code === "KeyR") useSkill2();
    if (e.code === "Comma") turnCamera(-SNAP);
    if (e.code === "Period") turnCamera(SNAP);
    if (e.code === "Digit1") selectWeapon("sword");
    if (e.code === "Digit2") selectWeapon("magic");
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
      canvas.dataset.interaction = expedition?.selected ? "camp" : "";
      mouseAim = { x: e.clientX, y: e.clientY };
      pointerAim(e.clientX, e.clientY);
    }
  });
  canvas.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    if (expedition.click(e.clientX, e.clientY)) return;
    pointerAim(e.clientX, e.clientY);
    beginAttack();
  });
  canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  $("sweep").onclick = () => beginAttack(true, true);
  $("skill2").onclick = () => useSkill2();
  bindTwist(canvas);
  $("compass").onclick = () => (camYawTarget = 0);
  $("heal").onclick = usePotion;
  $("pause").onclick = () => setPause(!paused);
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
      localStorage.removeItem(LEGACY_KEY);
    } catch {}
    location.reload();
  };
  $("start").onclick = () => {
    // Production counted while away (capped); collected in the Vault.
    accrue(campaign, Date.now());
    const waiting = campaign.pending
      ? Object.values(campaign.pending).reduce((a, b) => a + Math.floor(b), 0)
      : 0;
    if (waiting > 0)
      setTimeout(() => notify(`Kręgi wyprodukowały ${waiting} surowców — Skarbiec`), 4000);
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
    dt = Math.min(raw, 0.075);
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
      // "Up" on the stick or W always goes into the screen, whatever the camera turn.
      ({ x: dx, z: dz } = screenToWorld(dx, dz));
      if (len > 0.08) {
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
    updateWorld(dt);
    updateSky(dt);
    updateTerrainField(dt);
    flushRender();
    updateSeen(dt);
    updateWeather(dt);
    if (safe(player)) {
      const camp = nearCamp(campaign, player);
      if (camp) {
        player.campId = camp.id;
        home = camp;
      }
    }
    updateEnemies(dt);
    updateCompanions(dt);
    updateShots(dt);
    updateEffects(dt);
    if (worldStream && !qaFixtureActive) {
      updateVents(dt, time);
      updateRescues(dt, time);
    }
    if (deathUntil > time) {
      hero.root.rotation.z =
        Math.min(1, (1.1 - (deathUntil - time)) * 3) * Math.PI * 0.4;
      hero.root.position.y = -0.1;
    }
    if (time - lastSave > 2) {
      persist();
      lastSave = time;
    }
  }
  if (ready && started) expedition.tick(dt, time);
  if (!ready || contextLost || rendererFault) return;
  cameraTarget.lerp(
    new T.Vector3(player.x, groundY(player.x, player.z), player.z),
    1 - Math.exp(-dt * 10),
  );
  camYaw += (camYawTarget - camYaw) * (1 - Math.exp(-dt * 12));
  camera.position.set(
    cameraTarget.x + Math.sin(camYaw) * 30,
    39 + cameraTarget.y,
    cameraTarget.z + Math.cos(camYaw) * 30,
  );
  updateCompass();
  camera.lookAt(cameraTarget.x, cameraTarget.y, cameraTarget.z);
  if (shake > 0) {
    camera.position.x += (Math.random() - 0.5) * shake;
    camera.position.z += (Math.random() - 0.5) * shake;
    if (!paused && !helpOpen) shake = Math.max(0, shake - dt);
  }
  heroBar.group.position.set(player.x, 2.9 + groundY(player.x, player.z), player.z);
  liftActors();
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
  occlusionClock += dt;
  if (occlusionClock > 0.1) {
    occlusionClock = 0;
    const occluded = new Set<T.Object3D>();
    const actors = [
      hero.root.position,
      ...enemies
        .filter(
          (e) =>
            e.state !== "dead" && distance(player, e.rig.root.position) < 16,
        )
        .map((e) => e.rig.root.position),
    ];
    const nearbyBuildings = buildingViews
      .filter(
        (b) =>
          b.box.x0 < player.x + 23 &&
          b.box.x1 > player.x - 23 &&
          b.box.z0 < player.z + 23 &&
          b.box.z1 > player.z - 23,
      )
      .map((b) => b.node);
    const sight = new T.Raycaster();
    for (const actor of actors) {
      const target = actor.clone().add(new T.Vector3(0, 0.8, 0));
      const direction = target.clone().sub(camera.position);
      sight.set(camera.position, direction.clone().normalize());
      sight.far = direction.length() - 0.15;
      for (const hit of sight.intersectObjects(nearbyBuildings, false))
        occluded.add(hit.object);
    }
    for (const b of buildingViews) {
      const near = occluded.has(b.node);
      for (const m of b.materials) {
        m.transparent = near;
        m.opacity = near ? 0.15 : 1;
        m.depthWrite = !near;
      }
    }
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
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    const response = await fetch("combat3d/lublin.json");
    if (!response.ok) throw new Error(`Mapa: HTTP ${response.status}`);
    map = (await response.json()) as MapData;
    if (
      savedCampaign &&
      Math.hypot(
        map.origin.lat - campaign.origin.lat,
        map.origin.lon - campaign.origin.lon,
      ) > 0.000001
    ) {
      worldStream = new WorldStream(campaign.origin);
      await worldStream.load(player);
      map = worldStream.snapshot();
    } else {
      worldStream = new WorldStream(campaign.origin, map);
      if (!worldStream.contains(player)) {
        await worldStream.load(player);
        map = worldStream.snapshot();
      }
    }
    buildWorld();
    expedition = new Expedition({
      scene,
      camera,
      state: campaign,
      blocked: (p, r) => blocked(p.x, p.z, r),
      obstacles: () => map.buildings,
      contains: (p) => worldStream.contains(p),
      combat: () => time - lastCombat < 5 || !!attack,
      canAct: () =>
        ready &&
        started &&
        !paused &&
        !helpOpen &&
        !orientationHeld &&
        !contextLost &&
        !rendererFault &&
        deathUntil <= time,
      notify,
      save: persist,
      switch: switchCharacter,
      party: () => syncCompanions(),
      ground: (x: number, z: number) => groundY(x, z),
      drape: (o: T.Object3D) => drape(o),
      panel: (open) => {
        helpOpen = open;
        resetInput();
      },
      travel: travelTo,
      retry: () => worldStream.retry(),
      worldStatus: () => ({
        loading: worldStream.loading,
        error: worldStream.error,
      }),
    });
    expedition.countBuildings();
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
      for (const b of buildingViews)
        b.materials = Array.isArray(b.node.material)
          ? b.node.material
          : [b.node.material];
    }
    renderer.shadowMap.autoUpdate = false;
    renderer.shadowMap.needsUpdate = true;
    bindControls();
    resize();
    window.addEventListener("resize", resize);
    seen = new Set(campaign.explored ?? []);
    markSeen(seen, unproject(player, campaign.origin));
    campaign.explored = [...seen];
    recolor();
    syncCompanions();
    ready = true;
    $("loading-text").textContent = "";
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
          campaign: JSON.parse(JSON.stringify(campaign)),
          rope: expedition.rope,
          resources: resourceSnapshot(),
          rates: campaign.rates ?? null,
          vents: ventSnapshot(),
          rescues: [...rescues.values()].map((r) => ({ key: r.spot.key, x: r.spot.x, z: r.spot.z, state: r.state })),
          pending: campaign.pending ?? null,
          spots: expedition.spotCount,
          world: {
            origin: campaign.origin,
            tiles: worldStream.tiles.size,
            loading: worldStream.loading,
            error: worldStream.error,
          },
          sweepReady,
          skill: weaponSkill(player),
          skill2: offhandSkill(player),
          taunt: time < tauntUntil,
          manaShield: time < manaShieldUntil ? manaShield : 0,
          potionReady,
          attack: attack ? { ...attack } : null,
          companions: companions.map((m) => ({
            id: m.c.id,
            x: m.c.x,
            z: m.c.z,
            hp: m.c.hp,
            role: m.c.role,
          })),
          enemies: enemies.map((e) => ({
            id: e.id,
            key: e.key,
            species: e.species.id,
            behavior: e.behavior,
            hidden: e.hidden,
            x: e.rig.root.position.x,
            z: e.rig.root.position.z,
            hp: e.hp,
            state: e.state,
            kind: e.kind,
            tier: e.tier,
            boss: e.boss,
          })),
          map: {
            buildings: map.buildings.length,
            roads: map.roads.length,
            source: worldStream.tiles.size
              ? "world map tiles"
              : "bundled Lublin extract",
          },
          drawCalls: renderer.info.render.calls,
          timeOfDay,
          weather: weatherNow,
          cameraYaw: camYawTarget,
          renders: renderCount,
          trees: treeSpots,
          terrain: field.w
            ? {
                cells: field.w,
                version: field.version,
                min: field.v.reduce((m, v) => Math.min(m, v), 99),
                max: field.v.reduce((m, v) => Math.max(m, v), -99),
                here: field.at(player.x, player.z),
              }
            : null,
        }),
        ...(new URLSearchParams(location.search).has("qa")
          ? {
              fixture: (name: string) => {
                qaFixtureActive = true;
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
                  // A plain fighter for the fixed QA scenarios (no ambush, summons or theft).
                  e.hidden = false;
                  e.behavior = e.kind === "wolf" ? "pack" : e.kind === "archer" ? "shooter" : e.kind === "mage" ? "caster" : "charge";
                  if (e.behavior === "charge") e.behavior = "pack";
                  e.fleeUntil = 0;
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
                if (name === "patrol") {
                  Object.assign(player, { x: home.x, z: home.z });
                  e.state = "idle";
                  e.timer = 0;
                  e.wanderTarget = null;
                  e.wanderWait = 0;
                  e.spawn = findFree({ x: home.x + 12, z: home.z });
                  e.rig.root.position.set(e.spawn.x, 0, e.spawn.z);
                  cameraTarget.set(player.x, 0, player.z);
                }
                if (name === "hurt") {
                  player.hp = 25;
                }
                if (name === "death") {
                  hurtPlayer(999);
                }
                if (name === "wall") {
                  const b = buildingViews.find((b) => Math.abs(b.box.x0) < 30);
                  if (b) {
                    const p = findFree({
                      x: b.box.x0 - 1,
                      z: (b.box.z0 + b.box.z1) / 2,
                    });
                    player.x = p.x;
                    player.z = p.z;
                  }
                }
                return { x: player.x, z: player.z };
              },
              camp: () => {
                player.x = home.x;
                player.z = home.z;
                lastCombat = time - 10;
                cameraTarget.set(player.x, 0, player.z);
              },
              advanceOffers: (seed?: number) => {
                for (const o of campaign.offers) {
                  o.readyAt = Date.now() - 1;
                  if (seed !== undefined) o.seed = seed;
                }
                resolveForQA();
              },
              travel: (lat: number, lon: number) => travelTo({ lat, lon }),
              // A companion of the given role joins the party next to the hero.
              companion: (role: "warrior" | "mage" | "archer" | "herbalist") => {
                const c: Character = {
                  ...JSON.parse(JSON.stringify(player)),
                  id: `qa-${role}-${++campaign.serial}`,
                  name: { warrior: "Bogdan", mage: "Bogna", archer: "Hugo", herbalist: "Zofia" }[role],
                  role,
                  appearance: 120 + campaign.serial,
                  bag: [],
                  equipment: {},
                  weapon: role === "warrior" ? "sword" : "magic",
                  coins: 0,
                };
                Object.assign(c, findFree({ x: player.x - 2, z: player.z - 2 }));
                c.hp = maxHealth(c);
                campaign.characters.push(c);
                campaign.party = [...partyOf(campaign), c.id];
                syncCompanions();
                return c.id;
              },
              // A haze vent 14 units away (ignores the placement rules).
              vent: () => {
                const p = findFree({ x: player.x + 14, z: player.z }, 2.6);
                const vent = { key: "qa:vent", x: p.x, z: p.z, seed: 4242 };
                const v: VentView = { vent, view: new T.Group(), state: "idle", cubes: [] };
                v.view.position.set(p.x, 0, p.z);
                ventModel(v);
                scene.add(v.view);
                ventViews.set(vent.key, v);
                return p;
              },
              killWave: () => {
                for (const e of enemies)
                  if ((e.key.startsWith("vent:") || e.key.startsWith("rescue:")) && e.state !== "dead")
                    hurtEnemy(e, 99999);
              },
              rescue: () => {
                const p = findFree({ x: player.x + 14, z: player.z }, 1.5);
                addRescue({ key: "qa:rescue", x: p.x, z: p.z, seed: 987654 });
                return p;
              },
              face: (x: number, z: number) => {
                for (let a = 0; a < Math.PI * 2; a += 0.3) {
                  const p = { x: x + Math.sin(a) * 2.2, z: z + Math.cos(a) * 2.2 };
                  if (!blocked(p.x, p.z, R.radius)) {
                    player.x = p.x;
                    player.z = p.z;
                    heading = Math.atan2(x - p.x, z - p.z);
                    cameraTarget.set(player.x, 0, player.z);
                    return true;
                  }
                }
                return false;
              },
              // Circle production as if the hero had been away for `hours`.
              production: (rates: Record<string, number>, hours: number) => {
                circlePart = { wood: 0, ore: 0, fiber: 0, herbs: 0, ...rates };
                campaign.rates = circlePart;
                campaign.producedAt = Date.now() - hours * 3_600_000;
                ratesFor = { circles: enclosedAreas(campaign), map };
                accrue(campaign, Date.now());
              },
              // Stand next to a ready gathering spot, facing it.
              faceNode: (kind: string) => {
                refreshResources(true);
                const v = [...nodeViews.values()].find(
                  (v) => v.view.visible && v.node.kind === kind,
                );
                if (!v) return null;
                for (let a = 0; a < Math.PI * 2; a += 0.3) {
                  const p = {
                    x: v.node.x + Math.sin(a) * 1.6,
                    z: v.node.z + Math.cos(a) * 1.6,
                  };
                  if (!blocked(p.x, p.z, R.radius) && lineClear(p, v.node)) {
                    player.x = p.x;
                    player.z = p.z;
                    heading = Math.atan2(v.node.x - p.x, v.node.z - p.z);
                    cameraTarget.set(player.x, 0, player.z);
                    return v.node.key;
                  }
                }
                return null;
              },
              // Sets the leader's health and keeps the fight going (no calm regeneration).
              // A creature of the given species `d` units in front of the hero.
              spawnSpecies: (id: string, d = 5) => {
                const q = findFree({ x: player.x + Math.sin(heading) * d, z: player.z + Math.cos(heading) * d });
                const e = spawnEnemy(q, 4000 + enemies.length, `qa:${id}:${enemies.length}`, speciesById(id));
                return e.key;
              },
              // Puts an item from the templates straight into the hero's hands.
              equipTemplate: (index: number) => {
                const item = makeItem(campaign, index);
                if (item.slot !== "material") player.equipment[item.slot] = item;
                if (item.slot === "weapon") weapon = item.icon === "staff" ? "magic" : "sword";
                selectWeapon(weapon);
                return item.icon;
              },
              setHp: (hp: number) => {
                player.hp = hp;
                lastCombat = time + 30;
              },
              grantGold: (n: number) => {
                player.coins = n;
              },
              moveTo: (x: number, z: number) => {
                if (!blocked(x, z, R.radius)) {
                  player.x = x;
                  player.z = z;
                  lastCombat = time - 10;
                }
              },
              hurt: (n: number) => hurtPlayer(n),
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
      `Nie udało się uruchomić gry: ${error instanceof Error ? error.message : String(error)}`;
    const retry = document.createElement("button");
    retry.textContent = "Spróbuj ponownie";
    retry.onclick = () => location.reload();
    $("loading-text").after(retry);
    console.error(error);
  }
}
void init();
