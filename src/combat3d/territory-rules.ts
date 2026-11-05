import type { Campaign } from "./campaign.ts";
import { distance, inRing, type Point } from "./rules.ts";
import { pointSegment } from "./rope.ts";

export type Connection = { id: string; from: string; to: string; route: Point[] };
type Segment = { a: Point; b: Point; cuts: number[] };
const cache = new WeakMap<Campaign, Point[][]>();
export const invalidateTerritory = (s: Campaign) => cache.delete(s);
export function completedRoutes(s: Campaign): Point[][] {
  return [...s.camps.filter(c => c.parentId).map(c => c.route), ...(s.connections ?? []).map(c => c.route)];
}
// Split rope crossings into a planar graph, then walk its bounded faces. A tree
// encloses nothing; bends, extra connections and crossing ropes all retain topology.
export function enclosedAreas(s: Campaign): Point[][] {
  const cached = cache.get(s);
  if (cached) return cached;
  const segments: Segment[] = [];
  for (const route of completedRoutes(s)) for (let i = 1; i < route.length; i++)
    if (distance(route[i - 1], route[i]) > 1e-6) segments.push({ a: route[i - 1], b: route[i], cuts: [0, 1] });
  const cross = (x: number, z: number, u: number, v: number) => x * v - z * u;
  const cut = (line: Segment, p: Point) => {
    if (pointSegment(p, line.a, line.b) > 1e-6) return;
    const dx = line.b.x - line.a.x, dz = line.b.z - line.a.z;
    line.cuts.push(Math.max(0, Math.min(1, ((p.x - line.a.x) * dx + (p.z - line.a.z) * dz) / (dx * dx + dz * dz))));
  };
  for (let i = 0; i < segments.length; i++) for (let j = i + 1; j < segments.length; j++) {
    const a = segments[i], b = segments[j];
    const dx = a.b.x - a.a.x, dz = a.b.z - a.a.z, ux = b.b.x - b.a.x, uz = b.b.z - b.a.z;
    const den = cross(dx, dz, ux, uz), qx = b.a.x - a.a.x, qz = b.a.z - a.a.z;
    if (Math.abs(den) > 1e-9) {
      const t = cross(qx, qz, ux, uz) / den, u = cross(qx, qz, dx, dz) / den;
      if (t >= -1e-8 && t <= 1 + 1e-8 && u >= -1e-8 && u <= 1 + 1e-8) {
        a.cuts.push(Math.max(0, Math.min(1, t))); b.cuts.push(Math.max(0, Math.min(1, u)));
      }
    } else { cut(a, b.a); cut(a, b.b); cut(b, a.a); cut(b, a.b); }
  }
  const points: Point[] = [], ids = new Map<string, number>(), neighbors: Set<number>[] = [];
  const vertex = (p: Point) => {
    const key = `${Math.round(p.x * 100000)}:${Math.round(p.z * 100000)}`;
    let id = ids.get(key);
    if (id === undefined) { id = points.length; ids.set(key, id); points.push(p); neighbors.push(new Set()); }
    return id;
  };
  for (const seg of segments) {
    const cuts = [...new Set(seg.cuts)].sort((a, b) => a - b);
    let prev = -1;
    for (const t of cuts) {
      const id = vertex({ x: seg.a.x + (seg.b.x - seg.a.x) * t, z: seg.a.z + (seg.b.z - seg.a.z) * t });
      if (prev >= 0 && id !== prev) { neighbors[prev].add(id); neighbors[id].add(prev); }
      prev = id;
    }
  }
  const ordered = neighbors.map((ns, i) => [...ns].sort((a, b) => Math.atan2(points[a].z - points[i].z, points[a].x - points[i].x) - Math.atan2(points[b].z - points[i].z, points[b].x - points[i].x)));
  const visited = new Set<string>(), faces: Point[][] = [];
  for (let start = 0; start < points.length; start++) for (const next of ordered[start]) {
    let a = start, b = next; const ring: number[] = [];
    while (!visited.has(`${a}:${b}`)) {
      visited.add(`${a}:${b}`); ring.push(a);
      const ns = ordered[b], at = ns.indexOf(a), c = ns[(at + ns.length - 1) % ns.length];
      a = b; b = c;
    }
    if (a !== start || b !== next) continue;
    // Remove a branch walked in both directions from a face contour.
    let changed = true;
    while (changed && ring.length > 2) {
      changed = false;
      for (let i = 0; i < ring.length; i++) if (ring[(i + ring.length - 1) % ring.length] === ring[(i + 1) % ring.length]) {
        ring.splice(i, 1); ring.splice(i % ring.length, 1); changed = true; break;
      }
    }
    const polygon = ring.map(i => points[i]);
    const area = polygon.reduce((n, p, i) => { const q = polygon[(i + 1) % polygon.length]; return n + p.x * q.z - q.x * p.z; }, 0) / 2;
    if (area > 1e-5) faces.push(polygon);
  }
  cache.set(s, faces);
  return faces;
}
export function insideArea(p: Point, ring: Point[]) {
  return inRing(p.x, p.z, ring.map(v => [v.x, v.z]));
}
export function safeDistance(s: Campaign, p: Point, scale: number, campRadius: number, ropeMeters: number) {
  let d = Math.min(...s.camps.map(c => distance(c, p) - campRadius));
  for (const route of completedRoutes(s)) for (let i = 1; i < route.length; i++)
    d = Math.min(d, pointSegment(p, route[i - 1], route[i]) - ropeMeters * scale);
  for (const ring of enclosedAreas(s)) {
    if (insideArea(p, ring)) return 0;
    for (let i = 0; i < ring.length; i++) d = Math.min(d, pointSegment(p, ring[i], ring[(i + 1) % ring.length]));
  }
  return Math.max(0, d);
}
