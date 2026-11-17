// Spell effects: rings, glowing ground circles, light pillars, flame cones, lightning,
// falling meteors, ice and petal rain, shields. Simple meshes with shared geometry and
// additive glow, cheap enough for phones. Each effect lives a fixed time, then cleans up.
import * as T from "three";

type P = { x: number; z: number };
type Fx = { update: (dt: number) => boolean; dispose: () => void };
export type Handle = { end: () => void };

const geo = {
  ring: new T.RingGeometry(0.86, 1, 48),
  disc: new T.CircleGeometry(1, 40),
  tube: new T.CylinderGeometry(1, 1, 1, 14, 1, true),
  rod: new T.CylinderGeometry(1, 1, 1, 5, 1),
  shard: new T.OctahedronGeometry(1, 0),
  ball: new T.IcosahedronGeometry(1, 1),
  petal: new T.PlaneGeometry(1, 0.6),
  cube: new T.BoxGeometry(1, 1, 1),
};
for (const g of Object.values(geo)) g.userData.shared = true;

function glow(color: number, opacity = 1, additive = true) {
  return new T.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    side: T.DoubleSide,
    blending: additive ? T.AdditiveBlending : T.NormalBlending,
  });
}

type Spark = { m: T.Mesh; v: T.Vector3; life: number; total: number; gravity: number; spin: number; size: number };

export class Vfx {
  private list: Fx[] = [];
  private sparks: Spark[] = [];
  private sparkMats = new Map<string, T.MeshBasicMaterial>();
  constructor(
    private scene: T.Scene,
    private ground: (x: number, z: number) => number,
  ) {}

  update(dt: number) {
    for (let i = this.list.length - 1; i >= 0; i--)
      if (!this.list[i].update(dt)) {
        this.list[i].dispose();
        this.list.splice(i, 1);
      }
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.life -= dt;
      s.v.y -= s.gravity * dt;
      s.m.position.addScaledVector(s.v, dt);
      s.m.rotation.x += s.spin * dt;
      s.m.rotation.z += s.spin * 0.7 * dt;
      s.m.scale.setScalar(s.size * Math.max(0, Math.min(1, s.life / s.total + 0.15)));
      if (s.life <= 0) {
        this.scene.remove(s.m);
        this.sparks.splice(i, 1);
      }
    }
  }
  clear() {
    for (const f of this.list) f.dispose();
    this.list.length = 0;
    for (const s of this.sparks) this.scene.remove(s.m);
    this.sparks.length = 0;
  }
  /** Everything the effects draw, once, so shaders compile under the start screen. */
  warmObjects() {
    return [glow(0xffffff), glow(0xffffff, 1, false)].map((m) => new T.Mesh(geo.ball, m));
  }
  private y(p: P, lift = 0.07) {
    return this.ground(p.x, p.z) + lift;
  }
  private add(objs: T.Object3D[], mats: T.Material[], step: (t: number, dt: number) => boolean | void, dur: number) {
    let t = 0;
    for (const o of objs) this.scene.add(o);
    this.list.push({
      update: (dt) => {
        t += dt;
        const k = Math.min(1, t / dur);
        return step(k, dt) !== false && t < dur;
      },
      dispose: () => {
        for (const o of objs) this.scene.remove(o);
        for (const m of mats) m.dispose();
      },
    });
  }

  /** Small glowing bits flying out (fire, frost, sparks, leaves). Negative gravity rises. */
  burst(
    p: { x: number; y?: number; z: number },
    color: number,
    n: number,
    o: { speed?: number; up?: number; gravity?: number; life?: number; size?: number; spread?: number; shape?: "ball" | "shard" | "petal" | "cube"; additive?: boolean } = {},
  ) {
    const key = `${color}:${o.additive !== false}`;
    let mat = this.sparkMats.get(key);
    if (!mat) this.sparkMats.set(key, (mat = glow(color, 0.95, o.additive !== false)));
    const base = p.y ?? this.y(p, 0.9);
    for (let i = 0; i < n; i++) {
      const m = new T.Mesh(geo[o.shape ?? "ball"], mat);
      const a = Math.random() * Math.PI * 2,
        sp = (o.speed ?? 3) * (0.4 + Math.random() * 0.8),
        spread = o.spread ?? 0;
      m.position.set(p.x + Math.sin(a) * spread * Math.random(), base, p.z + Math.cos(a) * spread * Math.random());
      const life = (o.life ?? 0.6) * (0.6 + Math.random() * 0.6);
      const size = (o.size ?? 0.09) * (0.7 + Math.random() * 0.6);
      m.scale.setScalar(size);
      this.scene.add(m);
      this.sparks.push({
        m,
        v: new T.Vector3(Math.sin(a) * sp, (o.up ?? 2) * (0.5 + Math.random()), Math.cos(a) * sp),
        life,
        total: life,
        gravity: o.gravity ?? 6,
        spin: (Math.random() - 0.5) * 12,
        size,
      });
    }
  }
  /** A flat ring growing from `from` to `to` (shock wave). */
  ring(p: P, color: number, from: number, to: number, dur = 0.45, lift = 0.09) {
    const mat = glow(color, 0.9);
    const m = new T.Mesh(geo.ring, mat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(p.x, this.y(p, lift), p.z);
    this.add([m], [mat], (k) => {
      const r = from + (to - from) * (1 - (1 - k) ** 2);
      m.scale.set(r, r, 1);
      mat.opacity = 0.9 * (1 - k);
    }, dur);
  }
  /** A glowing circle on the ground for `dur` s (area of a spell); fades in and out. */
  disc(p: P, color: number, r: number, dur: number, opacity = 0.35, spin = 0): Handle {
    const mat = glow(color, 0),
      edge = glow(color, 0);
    const m = new T.Mesh(geo.disc, mat),
      e = new T.Mesh(geo.ring, edge);
    const runes = new T.Group();
    const runeMat = glow(color, 0);
    if (spin)
      for (let i = 0; i < 6; i++) {
        const b = new T.Mesh(geo.cube, runeMat);
        const a = (i / 6) * Math.PI * 2;
        b.position.set(Math.sin(a) * r * 0.72, 0, Math.cos(a) * r * 0.72);
        b.scale.set(r * 0.16, 0.02, r * 0.05);
        b.rotation.y = a;
        runes.add(b);
      }
    for (const o of [m, e]) {
      o.rotation.x = -Math.PI / 2;
      o.position.set(p.x, this.y(p, 0.08), p.z);
      o.scale.set(r, r, 1);
    }
    runes.position.set(p.x, this.y(p, 0.1), p.z);
    let over = false;
    this.add([m, e, runes], [mat, edge, runeMat], (k, dt) => {
      const fade = Math.min(1, k * dur * 5, (1 - k) * dur * 4);
      mat.opacity = opacity * fade;
      edge.opacity = Math.min(1, opacity * 2.4) * fade;
      runeMat.opacity = 0.8 * fade;
      runes.rotation.y += spin * dt;
      return !over;
    }, dur);
    return { end: () => (over = true) };
  }
  /** A pillar of light rising from the ground (healing, impacts). */
  pillar(p: P, color: number, h = 3, r = 0.55, dur = 0.7) {
    const mat = glow(color, 0.6);
    const m = new T.Mesh(geo.tube, mat);
    const base = this.y(p, 0);
    this.add([m], [mat], (k) => {
      const rise = Math.min(1, k * 3);
      m.scale.set(r * (1 - k * 0.5), h * rise, r * (1 - k * 0.5));
      m.position.set(p.x, base + (h * rise) / 2, p.z);
      mat.opacity = 0.6 * (1 - k);
    }, dur);
  }
  /** A flat flame fan in front of the caster, with flames spraying along it. */
  cone(p: P, heading: number, range: number, half: number, color: number, dur = 0.5) {
    // The sector opens along +Y; turned flat it points along +Z, then the holder turns it to the heading.
    const shape = new T.CircleGeometry(range, 24, Math.PI / 2 - half, half * 2);
    const mat = glow(color, 0.55);
    const m = new T.Mesh(shape, mat);
    m.rotation.x = Math.PI / 2;
    const holder = new T.Group();
    holder.position.set(p.x, this.y(p, 0.12), p.z);
    holder.rotation.y = heading;
    holder.add(m);
    this.add([holder], [mat], (k) => {
      m.scale.setScalar(0.3 + 0.7 * Math.min(1, k * 3));
      mat.opacity = 0.55 * (1 - k);
    }, dur);
    const last = this.list.at(-1)!,
      dispose = last.dispose;
    last.dispose = () => {
      dispose();
      shape.dispose();
    };
    for (let i = 0; i < 26; i++) {
      const a = heading + (Math.random() * 2 - 1) * half,
        d = 0.4 + Math.random() * 0.6;
      const sp = range * (1.6 + Math.random());
      const q = { x: p.x + Math.sin(a) * d, z: p.z + Math.cos(a) * d };
      const key = `${i % 3 ? color : 0xffe08a}:true`;
      let pm = this.sparkMats.get(key);
      if (!pm) this.sparkMats.set(key, (pm = glow(i % 3 ? color : 0xffe08a, 0.95)));
      const s = new T.Mesh(geo.ball, pm);
      s.position.set(q.x, this.y(q, 0.7), q.z);
      const size = 0.12 + Math.random() * 0.14;
      this.scene.add(s);
      this.sparks.push({ m: s, v: new T.Vector3(Math.sin(a) * sp, 0.6 + Math.random(), Math.cos(a) * sp), life: 0.35, total: 0.35, gravity: -2, spin: 6, size });
    }
  }
  /** A jagged lightning bolt through the points, flickering out. */
  bolt(points: P[], color: number, dur = 0.35) {
    const group = new T.Group();
    const mat = glow(color, 1),
      core = glow(0xffffff, 1);
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i],
        b = points[i + 1];
      const ya = this.y(a, 1.1),
        yb = this.y(b, 1.1);
      const steps = Math.max(2, Math.round(Math.hypot(b.x - a.x, b.z - a.z) / 0.8));
      let prev = new T.Vector3(a.x, ya, a.z);
      for (let s = 1; s <= steps; s++) {
        const f = s / steps,
          jitter = s === steps ? 0 : 0.35;
        const next = new T.Vector3(
          a.x + (b.x - a.x) * f + (Math.random() - 0.5) * jitter,
          ya + (yb - ya) * f + (Math.random() - 0.5) * jitter,
          a.z + (b.z - a.z) * f + (Math.random() - 0.5) * jitter,
        );
        for (const [m, w] of [[mat, 0.07], [core, 0.025]] as const) {
          const rod = new T.Mesh(geo.rod, m);
          const len = prev.distanceTo(next);
          rod.scale.set(w, len, w);
          rod.position.copy(prev).lerp(next, 0.5);
          rod.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), next.clone().sub(prev).normalize());
          group.add(rod);
        }
        prev = next;
      }
    }
    this.add([group], [mat, core], (k) => {
      const flicker = k < 0.5 ? (Math.random() < 0.7 ? 1 : 0.3) : 1 - k;
      mat.opacity = flicker;
      core.opacity = flicker;
    }, dur);
  }
  /** A burning rock falls on `p` after a red warning circle; `impact` runs when it lands. */
  meteor(p: P, delay: number, impact: () => void) {
    const warn = this.disc(p, 0xff3b1a, 3, delay + 0.15, 0.28);
    const rockMat = glow(0xff7a2a, 1),
      coreMat = glow(0xfff0b0, 1, false);
    const rock = new T.Group();
    const shell = new T.Mesh(geo.ball, rockMat),
      core = new T.Mesh(geo.shard, coreMat);
    shell.scale.setScalar(0.75);
    core.scale.setScalar(0.45);
    rock.add(shell, core);
    const end = this.y(p, 0.4),
      from = new T.Vector3(p.x - 6, end + 16, p.z - 3);
    let done = false;
    this.add([rock], [rockMat, coreMat], (k) => {
      const f = k * k;
      rock.position.set(from.x + (p.x - from.x) * f, from.y + (end - from.y) * f, from.z + (p.z - from.z) * f);
      rock.rotation.x += 0.3;
      if (Math.random() < 0.9)
        this.burst({ x: rock.position.x, y: rock.position.y, z: rock.position.z }, Math.random() < 0.5 ? 0xff7a2a : 0xffd27a, 2, { speed: 0.6, up: 0.4, gravity: 0, life: 0.45, size: 0.22 });
      if (k >= 1 && !done) {
        done = true;
        warn.end();
        impact();
      }
    }, delay);
  }
  /** Ice shards or petals falling inside a circle for `dur` s. */
  rain(p: P, r: number, kind: "ice" | "petal", dur: number) {
    let t = 0,
      acc = 0;
    const rate = kind === "ice" ? 34 : 22;
    this.list.push({
      update: (dt) => {
        t += dt;
        acc += dt * rate;
        while (acc >= 1) {
          acc--;
          const a = Math.random() * Math.PI * 2,
            d = Math.sqrt(Math.random()) * r;
          const q = { x: p.x + Math.sin(a) * d, z: p.z + Math.cos(a) * d };
          const color = kind === "ice" ? (Math.random() < 0.5 ? 0xd8f6ff : 0x8fd8ff) : [0xf7a8d8, 0xffd1ea, 0xfff2a8, 0xb9f59a][Math.floor(Math.random() * 4)];
          this.burst({ x: q.x, y: this.y(q, kind === "ice" ? 5 : 4), z: q.z }, color, 1, {
            speed: kind === "ice" ? 0.4 : 0.8,
            up: kind === "ice" ? -6 : -1.4,
            gravity: kind === "ice" ? 8 : 0.6,
            life: kind === "ice" ? 0.6 : 1.6,
            size: kind === "ice" ? 0.16 : 0.2,
            shape: kind === "ice" ? "shard" : "petal",
            additive: kind === "ice",
          });
        }
        return t < dur;
      },
      dispose: () => {},
    });
  }
  /** A see-through sphere that follows someone (shield, bark); ends on its own or by end(). */
  bubble(follow: () => { x: number; z: number } | null, color: number, dur: number, r = 0.95): Handle {
    const mat = glow(color, 0.25);
    const m = new T.Mesh(geo.ball, mat);
    let over = false;
    this.add([m], [mat], (k) => {
      const at = follow();
      if (!at || over) return false;
      m.position.set(at.x, this.y(at, 0.9), at.z);
      m.scale.setScalar(r * (1 + Math.sin(k * dur * 6) * 0.04));
      mat.opacity = 0.25 * Math.min(1, (1 - k) * dur * 2);
    }, dur);
    return { end: () => (over = true) };
  }
  /** A block of ice around a frozen enemy. */
  iceBlock(follow: () => { x: number; z: number } | null, dur: number, size = 1) {
    const mat = glow(0xbfefff, 0.42, false);
    const m = new T.Mesh(geo.cube, mat);
    this.add([m], [mat], (k) => {
      const at = follow();
      if (!at) return false;
      m.position.set(at.x, this.y(at, 0.75 * size), at.z);
      m.scale.set(1.1 * size, 1.6 * size, 1.1 * size);
      m.rotation.y = 0.4;
      mat.opacity = 0.42 * Math.min(1, (1 - k) * dur * 3);
    }, dur);
  }
}
