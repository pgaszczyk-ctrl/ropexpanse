import * as T from "three";
import { BALANCE, type Campaign } from "./campaign";
import { pointSegment } from "./rope";
import { distance, type Point } from "./rules";
import { SCALE } from "./world";

type Capsule = { a: Point; b: Point; r: number };
// The visual footprint uses exactly the same circles and swept rope segments as protection.
export function territoryFootprint(state: Campaign): Capsule[] {
  const shapes: Capsule[] = state.camps.map(c => ({ a: c, b: c, r: BALANCE.safeRadius }));
  for (const c of state.camps) if (c.parentId)
    for (let i = 1; i < c.route.length; i++)
      shapes.push({ a: c.route[i - 1], b: c.route[i], r: BALANCE.ropeSafeMeters * SCALE });
  return shapes;
}
function perimeter(s: Capsule): Point[] {
  const angle = Math.atan2(s.b.z - s.a.z, s.b.x - s.a.x);
  const arcSteps = Math.max(16, Math.ceil(Math.PI * s.r / 0.06));
  const points: Point[] = [];
  const arc = (p: Point, start: number) => {
    for (let i = 0; i <= arcSteps; i++) {
      const a = start + Math.PI * i / arcSteps;
      points.push({ x: p.x + Math.cos(a) * s.r, z: p.z + Math.sin(a) * s.r });
    }
  };
  arc(s.b, angle - Math.PI / 2);
  arc(s.a, angle + Math.PI / 2);
  // Subdivide the straight sides too, so crossings with another safe area are clipped.
  const sampled: Point[] = [];
  for (let i = 0; i < points.length; i++) {
    const a = points[i], b = points[(i + 1) % points.length];
    const steps = Math.max(1, Math.ceil(distance(a, b) / 0.06));
    for (let j = 0; j < steps; j++) sampled.push({ x: a.x + (b.x - a.x) * j / steps, z: a.z + (b.z - a.z) * j / steps });
  }
  return sampled;
}
const fillMaterial = new T.MeshBasicMaterial({ color: 0x46cda5, transparent: true, opacity: 0.18, depthWrite: true, depthFunc: T.LessDepth, toneMapped: false, side: T.DoubleSide });
const borderMaterials = [
  new T.MeshBasicMaterial({ color: 0x36eab6, transparent: true, opacity: 0.22, depthWrite: false, toneMapped: false, side: T.DoubleSide }),
  new T.MeshBasicMaterial({ color: 0x123e33, depthWrite: false, toneMapped: false, side: T.DoubleSide }),
  new T.MeshBasicMaterial({ color: 0x79ffd1, depthWrite: false, toneMapped: false, side: T.DoubleSide }),
];
function geometry(vertices: number[]) {
  const g = new T.BufferGeometry();
  g.setAttribute("position", new T.Float32BufferAttribute(vertices, 3));
  return g;
}
export function territoryModel(state: Campaign, contains: (p: Point) => boolean) {
  const group = new T.Group(), shapes = territoryFootprint(state);
  const fill: number[] = [], edges: [Point, Point][] = [];
  for (const [index, s] of shapes.entries()) {
    const points = perimeter(s), center = { x: (s.a.x + s.b.x) / 2, z: (s.a.z + s.b.z) / 2 };
    for (let i = 0; i < points.length; i++) {
      const a = points[i], b = points[(i + 1) % points.length];
      if (!contains(a) || !contains(b)) continue;
      fill.push(center.x, 0.065, center.z, a.x, 0.065, a.z, b.x, 0.065, b.z);
      const mid = { x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 };
      if (!shapes.some((other, j) => j !== index && pointSegment(mid, other.a, other.b) < other.r - 0.003)) edges.push([a, b]);
    }
  }
  const tint = new T.Mesh(geometry(fill), fillMaterial);
  tint.renderOrder = 1;
  group.add(tint);
  // World-space ribbons stay thick on mobile; WebGL lineWidth is usually limited to 1px.
  [0.42, 0.24, 0.13].forEach((width, layer) => {
    const vertices: number[] = [], y = 0.075 + layer * 0.005;
    for (const [a, b] of edges) {
      const len = distance(a, b);
      if (len < 0.00001) continue;
      const nx = -(b.z - a.z) / len * width / 2, nz = (b.x - a.x) / len * width / 2;
      const p = [a.x + nx, y, a.z + nz], q = [a.x - nx, y, a.z - nz], r = [b.x + nx, y, b.z + nz], t = [b.x - nx, y, b.z - nz];
      vertices.push(...p, ...q, ...r, ...q, ...t, ...r);
    }
    const mesh = new T.Mesh(geometry(vertices), borderMaterials[layer]);
    mesh.renderOrder = 2 + layer;
    group.add(mesh);
  });
  // Ground overlays must not intercept camp clicks.
  group.traverse(o => { o.raycast = () => {}; });
  return group;
}
