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
export function segmentClear(
  a: Point,
  b: Point,
  obstacles: Obstacle[],
  clearance = 0.1,
) {
  for (const o of obstacles) {
    const ring = o.rings[0];
    let x0 = Infinity,
      x1 = -Infinity,
      z0 = Infinity,
      z1 = -Infinity;
    for (const p of ring) {
      x0 = Math.min(x0, p[0]);
      x1 = Math.max(x1, p[0]);
      z0 = Math.min(z0, p[1]);
      z1 = Math.max(z1, p[1]);
    }
    if (
      Math.max(a.x, b.x) < x0 - clearance ||
      Math.min(a.x, b.x) > x1 + clearance ||
      Math.max(a.z, b.z) < z0 - clearance ||
      Math.min(a.z, b.z) > z1 + clearance
    )
      continue;
    if (
      circleBlocked(a, clearance, o.rings) ||
      circleBlocked(b, clearance, o.rings)
    )
      return false;
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
          return false;
      }
  }
  return true;
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
    const nearby = obstacles.filter(
      (o) =>
        o.rings[0].some(
          (v) =>
            v[0] >= Math.min(anchor.x, target.x) - 5 &&
            v[0] <= Math.max(anchor.x, target.x) + 5 &&
            v[1] >= Math.min(anchor.z, target.z) - 5 &&
            v[1] <= Math.max(anchor.z, target.z) + 5,
        ) || !segmentClear(anchor, target, [o]),
    );
    const nodes: Point[] = [anchor, target];
    for (const o of nearby)
      for (const ring of o.rings)
        for (let i = 0; i < ring.length - 1; i++) {
          const v = ring[i];
          for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
            const p = {
              x: v[0] + Math.sin(a) * 0.28,
              z: v[1] + Math.cos(a) * 0.28,
            };
            if (!nearby.some((q) => circleBlocked(p, 0.11, q.rings)))
              nodes.push(p);
          }
        }
    // Bounded visibility graph; keep long/dense routes responsive.
    const bounded = nodes.slice(0, 450),
      cost = bounded.map(() => Infinity),
      prev = bounded.map(() => -1),
      seen = new Set<number>();
    cost[0] = 0;
    for (let step = 0; step < bounded.length; step++) {
      let at = -1;
      for (let i = 0; i < bounded.length; i++)
        if (!seen.has(i) && (at < 0 || cost[i] < cost[at])) at = i;
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

