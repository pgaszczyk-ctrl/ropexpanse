// The loaded map: merged meshes per region, collision grid, building fade-out and
// the tile loading queue. The whole radius is prepared before play (and during
// the camp), so nothing is downloaded or meshed while the player walks.
import * as T from "three";
import { circleBlocked, segmentHitsPolygon, type Point } from "./rules.ts";
import {
  projection,
  tilesAround,
  ORIGIN,
  SCALE,
  type Origin,
  type RawRegion,
  type Rect,
} from "./geo.ts";
import { buildRegion, type BuildingRef, type MeshData, type RegionData } from "./region.ts";

type BuildingView = BuildingRef & { region: RegionView; faded: boolean };
type WaterView = { rings: number[][][]; box: [number, number, number, number] };
type RegionView = {
  key: string;
  rect: Rect;
  group: T.Group;
  chunks: T.Mesh[];
  buildings: BuildingView[];
  water: WaterView[];
  counts: RegionData["counts"];
};

const CELL = 8,
  WATER_CELL = 16;
const cell = (ix: number, iz: number) => (ix + 32768) * 65536 + (iz + 32768);

/** Building fade: a screen-door pattern in an opaque pass, so no sorting or per-building materials. */
function fadeShader(m: T.Material) {
  m.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nattribute float fade;\nvarying float vFade;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvFade = fade;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vFade;")
      .replace(
        "#include <clipping_planes_fragment>",
        "if (vFade > 0.5) { vec2 q = mod(floor(gl_FragCoord.xy), 3.0); if (q.x + q.y > 0.5) discard; }\n#include <clipping_planes_fragment>",
      );
  };
  m.customProgramCacheKey = () => "fade";
  return m;
}

export class World {
  readonly origin: Origin;
  readonly scale: number;
  readonly proj;
  readonly regions = new Map<string, RegionView>();
  private cells = new Map<number, BuildingView[]>();
  private waterCells = new Map<number, WaterView[]>();
  private lastRegion: RegionView | null = null;
  private faded = new Set<BuildingView>();
  private buildingMat: T.Material;
  private groundMat: T.Material;
  private trunkGeo = new T.CylinderGeometry(0.12, 0.17, 1.25, 5);
  private crownGeo = new T.IcosahedronGeometry(1, 0);
  private trunkMat: T.Material;
  private crownMat: T.Material;
  private workers: Worker[] = [];
  private jobs = new Map<number, { resolve: (r: RegionData) => void; reject: (e: Error) => void }>();
  private nextJob = 1;
  private pending = new Map<string, Promise<void>>();
  /** Set when something changed that the static shadow map must redraw. */
  dirty = false;
  /** Regions added/removed so far (for diagnostics). */
  added = 0;
  removed = 0;
  /** URL template of the vector tiles ({z}/{x}/{y}). */
  template = "";

  constructor(
    private scene: T.Scene,
    private opts: { safe: boolean; shadows: boolean },
    origin = ORIGIN,
    scale = SCALE,
  ) {
    this.origin = origin;
    this.scale = scale;
    this.proj = projection(origin, scale);
    const make = (params: { vertexColors?: boolean; color?: number }) =>
      opts.safe
        ? new T.MeshBasicMaterial(params)
        : new T.MeshStandardMaterial({ ...params, roughness: 0.88, flatShading: true });
    this.buildingMat = fadeShader(make({ vertexColors: true }));
    this.groundMat = make({ vertexColors: true });
    this.trunkMat = make({ color: 0x756044 });
    this.crownMat = make({ color: 0xffffff });
  }

  get buildingCount() {
    let n = 0;
    for (const r of this.regions.values()) n += r.counts.buildings;
    return n;
  }
  get roadCount() {
    let n = 0;
    for (const r of this.regions.values()) n += r.counts.roads;
    return n;
  }

  // ------------------------------------------------------------ loading

  /** Tiles in `radius` (scene units) around a point that are not loaded yet. */
  missing(center: Point, radius: number) {
    return tilesAround(center.x, center.z, radius, this.proj).filter((t) => !this.regions.has(t.key));
  }

  /** Loads every tile touching the circle. Resolves when all are on the scene. */
  async ensure(center: Point, radius: number, progress?: (done: number, total: number, failed: number) => void) {
    if (!this.template) throw new Error("Brak źródła kafelków");
    const list = this.missing(center, radius);
    let done = 0,
      failed = 0;
    progress?.(0, list.length, 0);
    await Promise.all(
      list.map(async (t) => {
        let job = this.pending.get(t.key);
        if (!job) {
          job = this.fetchRegion(t.tx, t.ty).then((data) => this.add(data));
          this.pending.set(t.key, job);
          job.finally(() => this.pending.delete(t.key)).catch(() => {});
        }
        try {
          await job;
        } catch {
          failed++;
        }
        progress?.(++done, list.length, failed);
      }),
    );
    return { total: list.length, failed };
  }

  private fetchRegion(tx: number, ty: number): Promise<RegionData> {
    const template = this.template;
    if (!this.workers.length && typeof Worker !== "undefined") {
      try {
        const n = Math.max(2, Math.min(4, (navigator.hardwareConcurrency || 4) - 1));
        for (let i = 0; i < n; i++) {
          const w = new Worker(new URL("./tile-worker.ts", import.meta.url), { type: "module" });
          w.onmessage = (e: MessageEvent<{ id: number; region?: RegionData; error?: string }>) => {
            const job = this.jobs.get(e.data.id);
            if (!job) return;
            this.jobs.delete(e.data.id);
            if (e.data.region) job.resolve(e.data.region);
            else job.reject(new Error(e.data.error || "Kafelek mapy"));
          };
          w.onerror = () => {
            // A worker that cannot start (e.g. offline single-file export): use the main thread.
            this.workers = this.workers.filter((x) => x !== w);
            for (const [id, job] of this.jobs) {
              this.jobs.delete(id);
              job.reject(new Error("worker"));
            }
          };
          this.workers.push(w);
        }
      } catch {
        this.workers = [];
      }
    }
    if (!this.workers.length) return this.mainThread(template, tx, ty);
    const id = this.nextJob++,
      worker = this.workers[id % this.workers.length];
    return new Promise<RegionData>((resolve, reject) => {
      this.jobs.set(id, { resolve, reject });
      worker.postMessage({ id, template, tx, ty, origin: this.origin, scale: this.scale });
    }).catch((e: Error) => (e.message === "worker" ? this.mainThread(template, tx, ty) : Promise.reject(e)));
  }
  private async mainThread(template: string, tx: number, ty: number) {
    const { loadTile } = await import("./tiles.ts");
    return loadTile(template, tx, ty, this.origin, this.scale);
  }

  /** Adds a prepared region from raw content (the bundled extract). */
  addRaw(raw: RawRegion) {
    this.add(buildRegion(raw));
  }

  private geometry(m: MeshData, fade = false) {
    const g = new T.BufferGeometry();
    g.setAttribute("position", new T.BufferAttribute(m.positions, 3));
    g.setAttribute("color", new T.BufferAttribute(m.colors, 3, true));
    if (fade) g.setAttribute("fade", new T.BufferAttribute(new Uint8Array(m.positions.length / 3), 1, true));
    g.setIndex(new T.BufferAttribute(m.index, 1));
    g.computeBoundingSphere();
    g.computeBoundingBox();
    return g;
  }

  add(data: RegionData) {
    if (this.regions.has(data.key)) return;
    const group = new T.Group();
    group.name = `region ${data.key}`;
    const ground = new T.Mesh(this.geometry(data.ground), this.groundMat);
    ground.receiveShadow = true;
    group.add(ground);
    const chunks = data.chunks.map((c) => {
      const m = new T.Mesh(this.geometry(c, true), this.buildingMat);
      m.castShadow = this.opts.shadows;
      m.receiveShadow = this.opts.shadows;
      group.add(m);
      return m;
    });
    const count = data.trees.length / 6;
    if (count) {
      const trunks = new T.InstancedMesh(this.trunkGeo, this.trunkMat, count),
        crowns = new T.InstancedMesh(this.crownGeo, this.crownMat, count),
        matrix = new T.Matrix4(),
        q = new T.Quaternion(),
        color = new T.Color();
      for (let i = 0; i < count; i++) {
        const t = data.trees.subarray(i * 6, i * 6 + 6);
        matrix.compose(new T.Vector3(t[0], 0.63, t[1]), q, new T.Vector3(1, 1, 1));
        trunks.setMatrixAt(i, matrix);
        matrix.compose(new T.Vector3(t[0], 2.1, t[1]), q, new T.Vector3(t[2], t[3], t[4]));
        crowns.setMatrixAt(i, matrix);
        crowns.setColorAt(i, color.setHSL(0.23 + (t[5] % 0.04), 0.22, t[5]));
      }
      trunks.computeBoundingSphere();
      crowns.computeBoundingSphere();
      trunks.castShadow = crowns.castShadow = this.opts.shadows;
      group.add(trunks, crowns);
    }
    const view: RegionView = {
      key: data.key,
      rect: data.rect,
      group,
      chunks,
      buildings: [],
      water: data.water,
      counts: data.counts,
    };
    for (const b of data.buildings) {
      const bv: BuildingView = { ...b, region: view, faded: false };
      view.buildings.push(bv);
      for (let x = Math.floor((b.box[0] - 2) / CELL); x <= Math.floor((b.box[2] + 2) / CELL); x++)
        for (let z = Math.floor((b.box[1] - 2) / CELL); z <= Math.floor((b.box[3] + 2) / CELL); z++) {
          const k = cell(x, z),
            list = this.cells.get(k);
          if (list) list.push(bv);
          else this.cells.set(k, [bv]);
        }
    }
    for (const w of data.water)
      for (let x = Math.floor((w.box[0] - 2) / WATER_CELL); x <= Math.floor((w.box[2] + 2) / WATER_CELL); x++)
        for (let z = Math.floor((w.box[1] - 2) / WATER_CELL); z <= Math.floor((w.box[3] + 2) / WATER_CELL); z++) {
          const k = cell(x, z),
            list = this.waterCells.get(k);
          if (list) list.push(w);
          else this.waterCells.set(k, [w]);
        }
    // The map never moves: compute matrices once and skip it in the per-frame matrix pass.
    group.traverse((o) => (o.matrixAutoUpdate = false));
    group.updateMatrixWorld(true);
    group.matrixWorldAutoUpdate = false;
    this.regions.set(data.key, view);
    this.scene.add(group);
    this.dirty = true;
    this.added++;
  }

  /** Frees regions whose square lies entirely farther than `radius`, except `keep` points' regions. */
  unloadFar(center: Point, radius: number, keep: Point[] = []) {
    for (const r of [...this.regions.values()]) {
      const d = Math.hypot(
        Math.max(r.rect.x0 - center.x, 0, center.x - r.rect.x1),
        Math.max(r.rect.z0 - center.z, 0, center.z - r.rect.z1),
      );
      if (d <= radius || keep.some((p) => this.inRect(r.rect, p.x, p.z))) continue;
      this.remove(r);
    }
  }
  private remove(r: RegionView) {
    this.scene.remove(r.group);
    r.group.traverse((o) => {
      if (o instanceof T.InstancedMesh) o.dispose();
      else if (o instanceof T.Mesh) o.geometry.dispose();
    });
    const gone = new Set<unknown>(r.buildings);
    for (const [k, list] of this.cells) {
      const kept = list.filter((b) => !gone.has(b));
      if (kept.length !== list.length) kept.length ? this.cells.set(k, kept) : this.cells.delete(k);
    }
    const wgone = new Set<unknown>(r.water);
    for (const [k, list] of this.waterCells) {
      const kept = list.filter((w) => !wgone.has(w));
      if (kept.length !== list.length) kept.length ? this.waterCells.set(k, kept) : this.waterCells.delete(k);
    }
    for (const b of r.buildings) this.faded.delete(b);
    if (this.lastRegion === r) this.lastRegion = null;
    this.regions.delete(r.key);
    this.dirty = true;
    this.removed++;
  }

  // ------------------------------------------------------------ queries

  private inRect(r: Rect, x: number, z: number) {
    return x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1;
  }
  /** Whether map data exists at a point. Beyond it the world is not yet known. */
  covered(x: number, z: number) {
    const last = this.lastRegion;
    if (last && this.inRect(last.rect, x, z)) return true;
    for (const r of this.regions.values())
      if (this.inRect(r.rect, x, z)) {
        this.lastRegion = r;
        return true;
      }
    return false;
  }
  blocked(x: number, z: number, r = 0.4) {
    if (!this.covered(x, z)) return true;
    for (const b of this.cells.get(cell(Math.floor(x / CELL), Math.floor(z / CELL))) ?? []) {
      const q = b.box;
      if (x < q[0] - r || x > q[2] + r || z < q[1] - r || z > q[3] + r) continue;
      if (circleBlocked({ x, z }, r, b.rings)) return true;
    }
    for (const w of this.waterCells.get(cell(Math.floor(x / WATER_CELL), Math.floor(z / WATER_CELL))) ?? []) {
      const q = w.box;
      if (x < q[0] - r || x > q[2] + r || z < q[1] - r || z > q[3] + r) continue;
      if (circleBlocked({ x, z }, r, w.rings)) return true;
    }
    return false;
  }
  /** Buildings within a square around a point, nearest cells first (for QA fixtures). */
  buildingsNear(x: number, z: number, reach = 32) {
    const out = new Set<BuildingView>();
    for (let r = 0; r <= reach / CELL; r++)
      for (let ix = -r; ix <= r; ix++)
        for (let iz = -r; iz <= r; iz++)
          if (Math.max(Math.abs(ix), Math.abs(iz)) === r)
            for (const b of this.cells.get(cell(Math.floor(x / CELL) + ix, Math.floor(z / CELL) + iz)) ?? []) out.add(b);
    return [...out];
  }

  /** Fades buildings standing between the camera and any of the actors. */
  updateOcclusion(cam: T.Vector3, actors: Point[], actorHeight = 0.8, maxHeight = 6.8) {
    const now = new Set<BuildingView>();
    for (const a of actors) {
      const len = Math.hypot(a.x - cam.x, actorHeight - cam.y, a.z - cam.z);
      const tEnd = 1 - 0.15 / len,
        span = cam.y - actorHeight;
      const at = (t: number) => ({ x: cam.x + (a.x - cam.x) * t, z: cam.z + (a.z - cam.z) * t });
      const lo = at(Math.max(0, (cam.y - maxHeight) / span)),
        hi = at(tEnd);
      const seen = new Set<BuildingView>();
      for (let x = Math.floor((Math.min(lo.x, hi.x) - 1) / CELL); x <= Math.floor((Math.max(lo.x, hi.x) + 1) / CELL); x++)
        for (let z = Math.floor((Math.min(lo.z, hi.z) - 1) / CELL); z <= Math.floor((Math.max(lo.z, hi.z) + 1) / CELL); z++)
          for (const b of this.cells.get(cell(x, z)) ?? []) {
            if (seen.has(b)) continue;
            seen.add(b);
            const from = at(Math.max(0, (cam.y - b.height) / span));
            if (segmentHitsPolygon(from, hi, b.rings)) now.add(b);
          }
    }
    const changed = new Set<RegionView["chunks"][number]>();
    const set = (b: BuildingView, on: boolean) => {
      b.faded = on;
      const mesh = b.region.chunks[b.chunk],
        attr = mesh.geometry.getAttribute("fade") as T.BufferAttribute;
      (attr.array as Uint8Array).fill(on ? 255 : 0, b.start, b.start + b.count);
      changed.add(mesh);
    };
    for (const b of this.faded) if (!now.has(b)) set(b, false);
    for (const b of now) if (!b.faded) set(b, true);
    for (const m of changed) m.geometry.getAttribute("fade").needsUpdate = true;
    this.faded = now;
  }
  /** Only regions near the camera take part in rendering at all. */
  setFocus(x: number, z: number, reach: number) {
    for (const r of this.regions.values())
      r.group.visible =
        Math.hypot(Math.max(r.rect.x0 - x, 0, x - r.rect.x1), Math.max(r.rect.z0 - z, 0, z - r.rect.z1)) <= reach;
  }
  /**
   * Sends every loaded mesh to the GPU now (three uploads lazily on first draw,
   * which made walking into new streets stutter). Renders all regions once into
   * a tiny off-screen target with a camera that sees the whole loaded map.
   */
  prewarm(renderer: T.WebGLRenderer) {
    if (!this.regions.size) return;
    let x0 = Infinity,
      x1 = -Infinity,
      z0 = Infinity,
      z1 = -Infinity;
    for (const r of this.regions.values()) {
      r.group.visible = true;
      x0 = Math.min(x0, r.rect.x0);
      x1 = Math.max(x1, r.rect.x1);
      z0 = Math.min(z0, r.rect.z0);
      z1 = Math.max(z1, r.rect.z1);
    }
    const half = Math.max(x1 - x0, z1 - z0) / 2 + 10,
      cam = new T.OrthographicCamera(-half, half, half, -half, 1, 400),
      target = new T.WebGLRenderTarget(4, 4),
      previous = renderer.getRenderTarget(),
      shadows = renderer.shadowMap.needsUpdate;
    cam.position.set((x0 + x1) / 2, 200, (z0 + z1) / 2);
    cam.lookAt((x0 + x1) / 2, 0, (z0 + z1) / 2);
    cam.updateMatrixWorld();
    renderer.setRenderTarget(target);
    renderer.render(this.scene, cam);
    renderer.setRenderTarget(previous);
    renderer.shadowMap.needsUpdate = shadows;
    target.dispose();
  }
  fadedCount() {
    return this.faded.size;
  }
}
