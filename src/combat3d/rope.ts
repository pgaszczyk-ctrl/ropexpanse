import { distance, circleBlocked, type Point } from "./rules.ts";
export type Obstacle = { rings: number[][][] };
export function pointSegment(p: Point, a: Point, b: Point) {
  const dx = b.x - a.x,
    dz = b.z - a.z,
    den = dx * dx + dz * dz,
    t = den
      ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.z - a.z) * dz) / den))
      : 0;
  return Math.hypot(p.x - a.x - dx * t, p.z - a.z - dz * t);
}
export function nearRope(p: Point, points: Point[], radius: number) {
  if (points.length === 1) return distance(p, points[0]) <= radius;
  return points.some((b, i) => i > 0 && pointSegment(p, points[i - 1], b) <= radius);
}
function cross(a: Point, b: Point, c: Point) {
  return (b.x - a.x) * (c.z - a.z) - (b.z - a.z) * (c.x - a.x);
}
// Obstacles are bucketed on a grid once per obstacle list, so a rope segment is tested
// against the few buildings beside it instead of every building of the loaded map
// (report of 11 Nov 2026: 6699 buildings, 3–4 s frames while pulling a rope).
type Boxed = { o: Obstacle; i: number; x0: number; x1: number; z0: number; z1: number; stamp: number };
const GRID = 12,
  NODE_BUDGET = 450;
class ObstacleIndex {
  private cells = new Map<number, Boxed[]>();
  private stamp = 0;
  constructor(obstacles: Obstacle[]) {
    obstacles.forEach((o, i) => {
      const b: Boxed = { o, i, x0: Infinity, x1: -Infinity, z0: Infinity, z1: -Infinity, stamp: 0 };
      for (const p of o.rings[0]) {
        if (p[0] < b.x0) b.x0 = p[0];
        if (p[0] > b.x1) b.x1 = p[0];
        if (p[1] < b.z0) b.z0 = p[1];
        if (p[1] > b.z1) b.z1 = p[1];
      }
      if (b.x0 > b.x1) return;
      for (let cx = Math.floor(b.x0 / GRID); cx <= Math.floor(b.x1 / GRID); cx++)
        for (let cz = Math.floor(b.z0 / GRID); cz <= Math.floor(b.z1 / GRID); cz++) {
          const key = cx * 65536 + cz,
            cell = this.cells.get(key);
          if (cell) cell.push(b);
          else this.cells.set(key, [b]);
        }
    });
  }
  /** Obstacles whose box meets the given box, each once; `visit` returning true stops. */
  inBox(x0: number, z0: number, x1: number, z1: number, visit: (b: Boxed) => boolean | void, a?: Point, b?: Point, reach = 0) {
    const stamp = ++this.stamp;
    for (let cx = Math.floor(x0 / GRID); cx <= Math.floor(x1 / GRID); cx++)
      for (let cz = Math.floor(z0 / GRID); cz <= Math.floor(z1 / GRID); cz++) {
        // A long diagonal segment only touches the cells along it, not its whole box.
        if (a && b && pointSegment({ x: (cx + 0.5) * GRID, z: (cz + 0.5) * GRID }, a, b) > GRID * 0.7072 + reach)
          continue;
        const cell = this.cells.get(cx * 65536 + cz);
        if (!cell) continue;
        for (const q of cell) {
          if (q.stamp === stamp) continue;
          q.stamp = stamp;
          if (q.x1 < x0 || q.x0 > x1 || q.z1 < z0 || q.z0 > z1) continue;
          if (visit(q)) return true;
        }
      }
    return false;
  }
}
const indexes = new WeakMap<Obstacle[], ObstacleIndex>();
function indexOf(obstacles: Obstacle[]) {
  let index = indexes.get(obstacles);
  if (!index) indexes.set(obstacles, (index = new ObstacleIndex(obstacles)));
  return index;
}
function hitsObstacle(a: Point, b: Point, o: Obstacle, clearance: number) {
  if (circleBlocked(a, clearance, o.rings) || circleBlocked(b, clearance, o.rings)) return true;
  for (const r of o.rings)
    for (let i = 1; i < r.length; i++) {
      const c = { x: r[i - 1][0], z: r[i - 1][1] },
        d = { x: r[i][0], z: r[i][1] };
      const intersect =
        cross(a, b, c) * cross(a, b, d) < 0 &&
        cross(c, d, a) * cross(c, d, b) < 0;
      if (
        intersect ||
        Math.min(
          pointSegment(a, c, d),
          pointSegment(b, c, d),
          pointSegment(c, a, b),
          pointSegment(d, a, b),
        ) < clearance
      )
        return true;
    }
  return false;
}
export function segmentClear(
  a: Point,
  b: Point,
  obstacles: Obstacle[],
  clearance = 0.1,
) {
  return !indexOf(obstacles).inBox(
    Math.min(a.x, b.x) - clearance,
    Math.min(a.z, b.z) - clearance,
    Math.max(a.x, b.x) + clearance,
    Math.max(a.z, b.z) + clearance,
    (q) => hitsObstacle(a, b, q.o, clearance),
    a,
    b,
    clearance,
  );
}
export function routeLength(points: Point[]) {
  return points.slice(1).reduce((n, p, i) => n + distance(points[i], p), 0);
}
// Keep the walked route's topology. Insert detours only when a segment meets a wall;
// then remove anchors as soon as the character can see past them.
export function updateRope(
  previous: Point[],
  target: Point,
  obstacles: Obstacle[],
): Point[] | null {
  const route = previous.map((v) => ({ ...v }));
  if (!route.length) return null;
  if (route.length > 1) route.pop();
  while (
    route.length > 1 &&
    segmentClear(route[route.length - 2], target, obstacles)
  )
    route.pop();
  const anchor = route[route.length - 1];
  if (!segmentClear(anchor, target, obstacles)) {
    // Buildings around the blocked stretch, those in the rope's way first: the search
    // below has a node budget, and on a long rope the box holds hundreds of buildings
    // (in map order the corner that mattered often fell outside the budget, the step was
    // refused and the whole graph was searched again on every frame).
    const x0 = Math.min(anchor.x, target.x) - 5,
      x1 = Math.max(anchor.x, target.x) + 5,
      z0 = Math.min(anchor.z, target.z) - 5,
      z1 = Math.max(anchor.z, target.z) + 5,
      found: { o: Obstacle; i: number; d: number }[] = [];
    indexOf(obstacles).inBox(x0, z0, x1, z1, (q) => {
      const hit = hitsObstacle(anchor, target, q.o, 0.1);
      if (!hit && !q.o.rings[0].some((v) => v[0] >= x0 && v[0] <= x1 && v[1] >= z0 && v[1] <= z1)) return;
      let d = 0;
      if (!hit) {
        d = Infinity;
        for (const v of q.o.rings[0]) d = Math.min(d, pointSegment({ x: v[0], z: v[1] }, anchor, target));
      }
      found.push({ o: q.o, i: q.i, d });
    });
    const nearby = found.sort((a, b) => a.d - b.d || a.i - b.i).map((q) => q.o);
    // Standing inside a wall's margin: no route can end here, skip the search.
    if (nearby.some((q) => circleBlocked(target, 0.1, q.rings))) return null;
    const nodes: Point[] = [anchor, target],
      index = indexOf(obstacles);
    fill: for (const o of nearby)
      for (const ring of o.rings)
        for (let i = 0; i < ring.length - 1; i++) {
          const v = ring[i];
          for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
            const p = {
              x: v[0] + Math.sin(a) * 0.28,
              z: v[1] + Math.cos(a) * 0.28,
            };
            if (!index.inBox(p.x - 0.11, p.z - 0.11, p.x + 0.11, p.z + 0.11, (q) => circleBlocked(p, 0.11, q.o.rings)))
              nodes.push(p);
            if (nodes.length >= NODE_BUDGET) break fill;
          }
        }
    // Bounded visibility graph, searched towards the target (A*): only the corners that
    // can lie on a short way round are ever tested for a clear line.
    const bounded = nodes,
      cost = bounded.map(() => Infinity),
      prev = bounded.map(() => -1),
      ahead = bounded.map((n) => distance(n, target)),
      seen = new Set<number>();
    cost[0] = 0;
    for (let step = 0; step < bounded.length; step++) {
      let at = -1;
      for (let i = 0; i < bounded.length; i++)
        if (!seen.has(i) && (at < 0 || cost[i] + ahead[i] < cost[at] + ahead[at])) at = i;
      if (at < 0 || !Number.isFinite(cost[at])) break;
      if (at === 1) break;
      seen.add(at);
      for (let j = 1; j < bounded.length; j++) {
        if (seen.has(j)) continue;
        const c = cost[at] + distance(bounded[at], bounded[j]);
        if (c < cost[j] && segmentClear(bounded[at], bounded[j], obstacles)) {
          cost[j] = c;
          prev[j] = at;
        }
      }
    }
    if (!Number.isFinite(cost[1])) return null;
    const detour: Point[] = [];
    for (let at = 1; at > 0; at = prev[at]) {
      if (at < 0) return null;
      detour.unshift(bounded[at]);
    }
    route.push(...detour.slice(0, -1));
  }
  route.push({ ...target });
  return route;
}

