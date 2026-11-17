// Travel along ropes (owner, 8 Nov): tap a rope anywhere, an arrow shows one way or the
// other with the price, and the party rides to the camp at that end. 100 tix per km.
import type { Campaign } from "./campaign.ts";
import { pointSegment } from "./rope.ts";
import { distance, type Point } from "./rules.ts";

/** At most this many ropes leave one camp. */
export const MAX_CAMP_LINKS = 4;
export const TIX_PER_KM = 100;

/** One finished rope between two camps; `route` runs from camp `a` to camp `b`. */
export type RopeLink = { id: string; a: string; b: string; route: Point[] };

export function ropeLinks(s: Campaign): RopeLink[] {
  const out: RopeLink[] = [];
  for (const c of s.camps)
    if (c.parentId && c.route.length > 1)
      out.push({ id: `tree:${c.id}`, a: c.parentId, b: c.id, route: c.route });
  for (const l of s.connections ?? [])
    if (l.route.length > 1) out.push({ id: l.id, a: l.from, b: l.to, route: l.route });
  return out;
}
export function campLinks(s: Campaign, campId: string) {
  return ropeLinks(s).filter((l) => l.a === campId || l.b === campId).length;
}
export function canAddLink(s: Campaign, campId: string) {
  return campLinks(s, campId) < MAX_CAMP_LINKS;
}
export function travelCost(meters: number) {
  return meters <= 0 ? 0 : Math.max(1, Math.ceil((meters / 1000) * TIX_PER_KM));
}
/** Nearest place on a route: distance to it and how far along the route it lies. */
export function onRoute(p: Point, route: Point[]) {
  let best = { d: Infinity, along: 0, at: route[0] };
  let walked = 0;
  for (let i = 1; i < route.length; i++) {
    const a = route[i - 1],
      b = route[i],
      len = distance(a, b),
      d = pointSegment(p, a, b);
    if (d < best.d) {
      const t = len ? Math.max(0, Math.min(1, ((p.x - a.x) * (b.x - a.x) + (p.z - a.z) * (b.z - a.z)) / (len * len))) : 0;
      best = { d, along: walked + t * len, at: { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t } };
    }
    walked += len;
  }
  return { ...best, length: walked };
}
/** The rope nearest a tapped point, if it is within `radius`. */
export function linkAt(s: Campaign, p: Point, radius: number) {
  let best: { link: RopeLink; d: number; at: Point; along: number } | null = null;
  for (const link of ropeLinks(s)) {
    const r = onRoute(p, link.route);
    if (r.d <= radius && (!best || r.d < best.d)) best = { link, d: r.d, at: r.at, along: r.along };
  }
  return best;
}
/** A ride from where the party stands to one end of a rope. The party must stand on that
 * rope (its corridor or one of its camps, within `reach`). */
export function travelPlan(
  s: Campaign,
  link: RopeLink,
  from: Point,
  toCamp: string,
  scale: number,
  reach: number,
) {
  const r = onRoute(from, link.route),
    dest = s.camps.find((c) => c.id === toCamp && (toCamp === link.a || toCamp === link.b));
  if (!dest) return null;
  const units = toCamp === link.b ? r.length - r.along : r.along,
    meters = units / scale;
  return {
    dest,
    meters,
    cost: travelCost(meters),
    onRope: r.d <= reach,
    arrived: distance(from, dest) <= reach,
  };
}
/** Default direction: towards the end farther from the party. */
export function fartherEnd(link: RopeLink, from: Point) {
  const r = onRoute(from, link.route);
  return r.along < r.length / 2 ? link.b : link.a;
}
/** The point `along` units from the start of a route. */
export function pointAlong(route: Point[], along: number): Point {
  let left = Math.max(0, along);
  for (let i = 1; i < route.length; i++) {
    const a = route[i - 1],
      b = route[i],
      len = distance(a, b);
    if (left <= len && len > 0) return { x: a.x + ((b.x - a.x) * left) / len, z: a.z + ((b.z - a.z) * left) / len };
    left -= len;
  }
  return { ...route[route.length - 1] };
}
