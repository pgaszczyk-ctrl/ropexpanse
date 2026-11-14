import * as T from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { Character } from "./campaign";
import { boltElement } from "./spells";

const rigMaterial = new T.MeshStandardMaterial({
  vertexColors: true,
  roughness: 0.88,
  flatShading: true,
});
// Keep animated joints separate; batch the fixed coloured pieces inside each joint.
function batchRig(root: T.Group) {
  const groups: T.Object3D[] = [];
  root.traverse((o) => {
    if (o instanceof T.Group) groups.push(o);
  });
  for (const group of groups) {
    const meshes = group.children.filter(
      (o): o is T.Mesh => o instanceof T.Mesh,
    );
    if (meshes.length < 2) continue;
    const geos = meshes.map((m) => {
      m.updateMatrix();
      const source = m.geometry.index
        ? m.geometry.toNonIndexed()
        : m.geometry.clone();
      source.applyMatrix4(m.matrix);
      source.deleteAttribute("uv");
      const color = (m.material as T.MeshStandardMaterial).color;
      const values = new Float32Array(source.attributes.position.count * 3);
      for (let i = 0; i < values.length; i += 3) {
        values[i] = color.r;
        values[i + 1] = color.g;
        values[i + 2] = color.b;
      }
      source.setAttribute("color", new T.BufferAttribute(values, 3));
      return source;
    });
    const merged = mergeGeometries(geos);
    if (merged) {
      for (const m of meshes) {
        group.remove(m);
        m.geometry.dispose();
      }
      const mesh = new T.Mesh(merged, rigMaterial);
      mesh.receiveShadow = true;
      group.add(mesh);
    }
    geos.forEach((g) => g.dispose());
  }
}
const materials = new Map<number, T.MeshStandardMaterial>();
export function material(color: number) {
  let m = materials.get(color);
  if (!m) {
    m = new T.MeshStandardMaterial({
      color,
      roughness: 0.88,
      flatShading: true,
    });
    materials.set(color, m);
  }
  return m;
}
function box(parent: T.Object3D, color: number, size: number[], at: number[]) {
  const m = new T.Mesh(
    new T.BoxGeometry(...(size as [number, number, number])),
    material(color),
  );
  m.position.set(...(at as [number, number, number]));
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}
function ball(
  parent: T.Object3D,
  color: number,
  r: number,
  at: number[],
  scale = [1, 1, 1],
) {
  const m = new T.Mesh(new T.IcosahedronGeometry(r, 1), material(color));
  m.position.set(...(at as [number, number, number]));
  m.scale.set(...(scale as [number, number, number]));
  m.castShadow = true;
  parent.add(m);
  return m;
}
export type Rig = {
  root: T.Group;
  body: T.Group;
  leftLeg: T.Group;
  rightLeg: T.Group;
  leftArm: T.Group;
  rightArm: T.Group;
  sword: T.Group;
  wand: T.Group;
  head: T.Group;
  kind: "hero" | "wolf" | "archer";
  phase: number;
};
/** Who the figure is, so the outfit and weapon fit (party characters pass it; enemies do not). */
export type Look = {
  role?: "warrior" | "mage" | "archer" | "herbalist" | "woodcutter" | "miner" | "ropemaker";
  sex?: "m" | "f";
  /** Icon of the weapon in hand (sword, axe, hammer, staff) and of the second hand (shield, orb). */
  weapon?: string;
  offhand?: string;
  /** A caster's school: the staff top and the robe colours follow it. */
  element?: "fire" | "frost" | "storm" | "life";
};
/** The look of a party character: profession, sex, what they hold, their school of magic. */
export function lookOf(c: Pick<Character, "id" | "role" | "sex" | "equipment" | "spell">): Look {
  return {
    role: c.role,
    sex: c.sex,
    weapon: c.equipment.weapon?.icon,
    offhand: c.equipment.offhand?.icon,
    element: boltElement(c) ?? undefined,
  };
}
/** Body height of a standing figure (the walk bob adds to it). */
const BODY_Y = 0.9;
type Outfit = { tunic: number; trim: number; shawl: number; pants: number; extra?: "plate" | "leather" | "silver" | "hood" | "robe" | "cape" };
const OUTFITS: Record<string, Outfit[]> = {
  warrior: [
    { tunic: 0x2f4a6e, trim: 0xd9a43a, shawl: 0x2f4a6e, pants: 0x1f2a3a, extra: "plate" },
    { tunic: 0x9a4a2a, trim: 0x9aa0a4, shawl: 0x7a3a22, pants: 0x4a3226, extra: "leather" },
    { tunic: 0x1f8a96, trim: 0xb8bec4, shawl: 0xb8bec4, pants: 0x4a3a2e, extra: "silver" },
  ],
  archer: [
    { tunic: 0x3f7a2e, trim: 0x2e5e22, shawl: 0x2e5e22, pants: 0x3a4a2a, extra: "cape" },
    { tunic: 0x7a2e32, trim: 0x5a2226, shawl: 0x6a282c, pants: 0x3a2a26, extra: "cape" },
    { tunic: 0x4a3f8a, trim: 0xe8dcc0, shawl: 0x2f2f5e, pants: 0x2a2a44, extra: "cape" },
  ],
  mage: [
    { tunic: 0x5b2a6e, trim: 0xd9a43a, shawl: 0x8a4fb0, pants: 0x2e1e30, extra: "robe" },
    { tunic: 0x2f5a8f, trim: 0x9fcbee, shawl: 0x2f5a8f, pants: 0x1e2a3a, extra: "hood" },
    { tunic: 0x8a2a2a, trim: 0xd9a43a, shawl: 0x8a2a2a, pants: 0x3a2a24, extra: "robe" },
  ],
  herbalist: [
    { tunic: 0x5f8a2e, trim: 0x7aa83a, shawl: 0x7aa83a, pants: 0x2e4a22 },
    { tunic: 0x8a5a2a, trim: 0xd29a2e, shawl: 0xd29a2e, pants: 0x3a2a1e },
    { tunic: 0x2e6e2e, trim: 0x5aa83a, shawl: 0x4a9a3a, pants: 0x1e3a1e },
  ],
};
const SKINS = [0xf0c49a, 0xd9a073, 0xb27a52, 0x7d5238];
const HAIRS = [0x3a2a22, 0x7a4a24, 0x24202a, 0x5a2a2a, 0xc49447, 0x2a2a44, 0x4a2a5a, 0x8a8a84];
const LEATHER = 0x5a3a22,
  BOOT = 0x5a3a26,
  BOOT_TOP = 0x7a5034,
  GOLD = 0xd9a43a,
  STEEL = 0xb8bec4,
  WOOD = 0x8a5228,
  EYE = 0x1e1a18;

/** A flat outline (x, y) made thick along z. */
function slab(parent: T.Object3D, color: number, pts: [number, number][], depth: number) {
  const shape = new T.Shape(pts.map(([x, y]) => new T.Vector2(x, y)));
  const g = new T.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
  g.translate(0, 0, -depth / 2);
  const m = new T.Mesh(g, material(color));
  m.castShadow = true;
  parent.add(m);
  return m;
}
function gem(parent: T.Object3D, color: number, at: number[], scale: number[]) {
  const m = new T.Mesh(new T.OctahedronGeometry(1, 0), material(color));
  m.position.set(...(at as [number, number, number]));
  m.scale.set(...(scale as [number, number, number]));
  m.castShadow = true;
  parent.add(m);
  return m;
}
/** Weapons held in the right hand, blade or head pointing forward (+z). */
function meleeWeapon(g: T.Group, icon: string | undefined) {
  if (icon === "axe") {
    box(g, WOOD, [0.09, 0.09, 1.15], [0, 0, 0.42]);
    box(g, 0x8a9094, [0.13, 0.13, 0.1], [0, 0, -0.12]);
    box(g, 0x8a9094, [0.14, 0.14, 0.2], [0, 0, 0.88]);
    for (const side of [-1, 1]) {
      const blade = slab(g, STEEL, [[0.06, -0.12], [0.3, -0.26], [0.44, -0.3], [0.44, 0.3], [0.3, 0.26], [0.06, 0.12]], 0.06);
      blade.rotation.x = Math.PI / 2;
      blade.scale.x = side;
      blade.position.z = 0.88;
    }
    return;
  }
  if (icon === "hammer") {
    box(g, WOOD, [0.09, 0.09, 1.05], [0, 0, 0.38]);
    box(g, 0x8a9094, [0.12, 0.12, 0.12], [0, 0, -0.14]);
    box(g, 0x1f8a96, [0.13, 0.13, 0.06], [0, 0, 0.0]);
    box(g, STEEL, [0.64, 0.3, 0.3], [0, 0, 0.92]);
    box(g, 0xd6dadd, [0.08, 0.34, 0.34], [-0.34, 0, 0.92]);
    box(g, 0xd6dadd, [0.08, 0.34, 0.34], [0.34, 0, 0.92]);
    for (const x of [-0.18, 0.18]) box(g, 0x1f8a96, [0.06, 0.32, 0.32], [x, 0, 0.92]);
    gem(g, 0x9aa0a4, [0, 0.16, 0.92], [0.1, 0.03, 0.1]);
    return;
  }
  // Sword (default): navy grip, gold guard and pommel, steel blade with a point.
  box(g, GOLD, [0.12, 0.12, 0.08], [0, 0, -0.1]);
  box(g, 0x2a3a5a, [0.08, 0.08, 0.22], [0, 0, 0.04]);
  box(g, GOLD, [0.46, 0.1, 0.12], [0, 0, 0.2]);
  box(g, STEEL, [0.16, 0.06, 0.92], [0, 0, 0.72]);
  box(g, 0xdfe3e6, [0.05, 0.065, 0.92], [0, 0, 0.72]);
  const tip = new T.Mesh(new T.ConeGeometry(0.115, 0.26, 4), material(STEEL));
  tip.rotation.x = Math.PI / 2;
  tip.rotation.y = Math.PI / 4;
  tip.scale.set(1, 1, 0.4);
  tip.position.set(0, 0, 1.31);
  g.add(tip);
}
/** A staff stands up from the hand; its top shows the school (orb, crystal, leaf, stone). */
function staff(g: T.Group, element: Look["element"], variant: number) {
  const pole = element === "frost" ? 0x2a3a5a : element === "life" ? WOOD : 0x4a3022;
  box(g, pole, [0.09, 1.75, 0.09], [0, 0.32, 0]);
  for (const y of [-0.5, 0.62]) box(g, element === "life" ? 0x7aa83a : GOLD, [0.13, 0.07, 0.13], [0, y, 0]);
  if (element === "life") {
    if (variant === 1) {
      // A grey stone held in a gold cup.
      box(g, GOLD, [0.26, 0.08, 0.26], [0, 1.22, 0]);
      const stone = new T.Mesh(new T.IcosahedronGeometry(0.2, 0), material(0x8a8e90));
      stone.position.y = 1.4;
      g.add(stone);
      return;
    }
    // A forked branch with a fresh leaf.
    for (const side of [-1, 1]) {
      const twig = box(g, WOOD, [0.08, 0.36, 0.08], [side * 0.1, 1.3, 0]);
      twig.rotation.z = -side * 0.55;
    }
    const leaf = gem(g, 0x6fb03a, [0.2, 1.56, 0], [0.12, 0.24, 0.04]);
    leaf.rotation.z = -0.5;
    return;
  }
  // Gold fork holding the top.
  box(g, GOLD, [0.34, 0.07, 0.1], [0, 1.2, 0]);
  for (const side of [-1, 1]) box(g, GOLD, [0.07, 0.22, 0.1], [side * 0.16, 1.32, 0]);
  if (element === "fire") ball(g, 0xff8a2a, 0.17, [0, 1.4, 0]);
  else if (element === "frost") gem(g, 0x8fe6ff, [0, 1.42, 0], [0.11, 0.26, 0.11]);
  else if (element === "storm") gem(g, 0x9b5cff, [0, 1.42, 0], [0.12, 0.26, 0.12]);
  else ball(g, 0x72e4ed, 0.17, [0, 1.4, 0]);
}
/** A bow held upright, bending forward, with its string. */
function bow(g: T.Group, color: number) {
  const pts: T.Vector3[] = [];
  for (let i = 0; i <= 6; i++) {
    const y = -0.85 + (i / 6) * 1.7;
    pts.push(new T.Vector3(0, y, 0.08 + 0.3 * (1 - (y / 0.85) ** 2)));
  }
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i],
      b = pts[i + 1];
    const rod = box(g, color, [0.1, a.distanceTo(b) + 0.04, 0.1], [0, (a.y + b.y) / 2, (a.z + b.z) / 2]);
    rod.rotation.x = Math.atan2(b.z - a.z, b.y - a.y);
  }
  box(g, LEATHER, [0.13, 0.24, 0.13], [0, 0, 0.38]);
  box(g, 0xe0d4b4, [0.02, 1.7, 0.02], [0, 0, 0.08]);
}
export function person(kind: "hero" | "archer" = "hero", appearance = 0, look: Look = {}): Rig {
  const root = new T.Group(),
    body = new T.Group(),
    head = new T.Group(),
    leftLeg = new T.Group(),
    rightLeg = new T.Group(),
    leftArm = new T.Group(),
    rightArm = new T.Group(),
    sword = new T.Group(),
    wand = new T.Group();
  root.add(body);
  body.position.y = BODY_Y;
  const a = Math.abs(Math.floor(appearance));
  const role = look.role === "woodcutter" || look.role === "miner" || look.role === "ropemaker" ? "herbalist" : look.role;
  const female = look.sex ? look.sex === "f" : a % 2 === 1;
  // Mages dress in the colours of their school; everyone else by appearance.
  const variant =
    role === "mage" && look.element
      ? { storm: 0, frost: 1, fire: 2, life: 0 }[look.element]
      : Math.floor(a / 2) % 3;
  const outfit: Outfit = role
    ? OUTFITS[role][variant]
    : kind === "archer"
      ? OUTFITS.archer[a % 3]
      : // Enemies and nameless folk: a plain tunic in one of the old coat colours.
        { tunic: [0x345e70, 0x755579, 0x537048, 0x9b623d, 0x435b8b, 0x9a7846][a % 6], trim: LEATHER, shawl: 0x6a5a44, pants: 0x343c3b, extra: "leather" };
  const skin = SKINS[Math.floor(a / 6) % SKINS.length];
  const hair = HAIRS[Math.floor(a / 3) % HAIRS.length];
  const robe = outfit.extra === "robe" || outfit.extra === "hood";

  // ---- Legs: short trousers and chunky boots ----
  for (const [joint, x] of [
    [leftLeg, -0.2],
    [rightLeg, 0.2],
  ] as const) {
    root.add(joint);
    joint.position.set(x, 0.56, 0);
    box(joint, outfit.pants, [0.3, 0.26, 0.32], [0, -0.1, 0]);
    box(joint, BOOT, [0.36, 0.32, 0.44], [0, -0.4, 0.04]);
    box(joint, BOOT_TOP, [0.4, 0.08, 0.46], [0, -0.25, 0.03]);
    if (outfit.extra === "plate") box(joint, GOLD, [0.26, 0.14, 0.06], [0, -0.12, 0.18]);
    if (outfit.extra === "silver" || outfit.extra === "leather") box(joint, STEEL, [0.38, 0.1, 0.44], [0, -0.32, 0.03]);
  }
  // ---- Body: tunic, skirt, belt with a gold buckle, collar or shawl ----
  box(body, outfit.tunic, [0.8, 0.62, 0.48], [0, -0.02, 0]);
  box(body, outfit.tunic, [0.86, robe ? 0.42 : 0.28, 0.54], [0, robe ? -0.4 : -0.3, 0]);
  // Lighter front panel of the skirt (tabard / apron), like the references.
  box(body, outfit.extra === "silver" ? outfit.tunic : outfit.trim, [0.3, robe ? 0.5 : 0.36, 0.04], [0, robe ? -0.36 : -0.3, 0.28]);
  box(body, LEATHER, [0.84, 0.1, 0.52], [0, -0.16, 0]);
  box(body, GOLD, [0.18, 0.15, 0.05], [0, -0.16, 0.27]);
  box(body, outfit.tunic, [0.08, 0.07, 0.06], [0, -0.16, 0.3]);
  box(body, LEATHER, [0.16, 0.16, 0.08], [-0.24, -0.24, 0.27]);
  if (outfit.extra === "silver") {
    box(body, STEEL, [0.84, 0.44, 0.52], [0, 0.08, 0]);
    box(body, outfit.tunic, [0.3, 0.2, 0.04], [0, 0.22, 0.27]);
  }
  if (outfit.extra === "leather" || kind === "archer") {
    // A strap across the chest.
    const strap = box(body, 0x3a2618, [0.1, 0.8, 0.04], [0, 0.05, 0.25]);
    strap.rotation.z = 0.7;
  }
  if (robe) {
    // Gold trim down the front and a gem brooch at the collar.
    for (const x of [-0.13, 0.13]) box(body, outfit.trim, [0.06, 0.62, 0.04], [x, 0.0, 0.25]);
    box(body, outfit.trim, [0.9, 0.06, 0.56], [0, -0.6, 0]);
  }
  // Collar / shawl over the shoulders.
  box(body, outfit.shawl, [0.92, 0.16, 0.58], [0, 0.26, 0]);
  box(body, outfit.shawl, [0.56, 0.14, 0.06], [0, 0.17, 0.28]);
  if (robe || outfit.extra === "plate") box(body, outfit.trim, [0.94, 0.05, 0.6], [0, 0.19, 0]);
  if (robe) gem(body, { 0x5b2a6e: 0xb57aff, 0x2f5a8f: 0x8fe6ff, 0x8a2a2a: 0xff8a2a }[outfit.tunic] ?? 0x8fe6ff, [0, 0.2, 0.33], [0.09, 0.09, 0.04]);
  if (outfit.extra === "cape") box(body, outfit.shawl, [0.78, 0.82, 0.08], [0, -0.06, -0.29]);
  if (kind === "archer" || role === "archer") {
    // Quiver with three fletched arrows on the back.
    const q = new T.Group();
    q.position.set(0.18, 0.08, -0.38);
    q.rotation.z = -0.35;
    body.add(q);
    box(q, 0x5a3a22, [0.2, 0.56, 0.2], [0, 0, 0]);
    box(q, outfit.tunic, [0.22, 0.08, 0.22], [0, -0.06, 0]);
    for (const x of [-0.05, 0, 0.05]) {
      box(q, 0x6a4a2a, [0.025, 0.22, 0.025], [x, 0.36, 0]);
      box(q, 0xf0e6cc, [0.05, 0.1, 0.05], [x, 0.48, 0]);
    }
  }
  // ---- Arms: sleeve, light undershirt, bracer, boxy hand ----
  for (const [joint, x] of [
    [leftArm, -0.52],
    [rightArm, 0.52],
  ] as const) {
    body.add(joint);
    joint.position.set(x, 0.22, 0);
    box(joint, outfit.tunic, [0.26, 0.26, 0.28], [0, -0.08, 0]);
    box(joint, robe ? outfit.tunic : 0xe8dcc8, [0.24, 0.14, 0.26], [0, -0.27, 0]);
    box(joint, robe ? outfit.trim : outfit.extra === "silver" ? STEEL : LEATHER, [0.28, 0.12, 0.3], [0, -0.38, 0]);
    box(joint, skin, [0.24, 0.2, 0.24], [0, -0.53, 0]);
    if (outfit.extra === "plate" || outfit.extra === "silver" || (outfit.extra === "leather" && role === "warrior")) {
      // Pauldrons on the shoulders.
      box(joint, outfit.extra === "plate" ? outfit.tunic : STEEL, [0.36, 0.16, 0.38], [x > 0 ? 0.03 : -0.03, 0.06, 0]);
      if (outfit.extra === "plate") box(joint, GOLD, [0.38, 0.05, 0.4], [x > 0 ? 0.03 : -0.03, -0.01, 0]);
    }
  }
  // ---- Head: big boxy head, dot eyes, ears, hair (or hood), maybe a beard ----
  body.add(head);
  head.position.y = 0.3;
  box(head, skin, [0.9, 0.84, 0.82], [0, 0.44, 0]);
  for (const x of [-0.47, 0.47]) box(head, skin, [0.08, 0.18, 0.14], [x, 0.4, 0.02]);
  for (const x of [-0.17, 0.17]) box(head, EYE, [0.075, 0.16, 0.03], [x, 0.46, 0.415]);
  const beard = !female && (role === "archer" || role === "herbalist" ? a % 3 !== 2 : a % 3 === 0);
  if (beard) {
    box(head, hair, [0.92, 0.32, 0.12], [0, 0.17, 0.4]);
    for (const x of [-0.42, 0.42]) box(head, hair, [0.1, 0.42, 0.5], [x, 0.3, 0.12]);
    box(head, 0x8a5a44, [0.2, 0.04, 0.03], [0, 0.26, 0.465]);
  }
  if (outfit.extra === "hood") {
    // A pointed hood with a light edge around the face; hair shows at the sides.
    for (const x of [-0.4, 0.4]) box(head, hair, [0.14, 0.6, 0.3], [x, 0.5, 0.3]);
    box(head, hair, [0.9, 0.14, 0.14], [0, 0.82, 0.36]);
    box(head, outfit.tunic, [1.06, 0.98, 0.9], [0, 0.5, -0.06]);
    box(head, outfit.trim, [1.1, 0.1, 0.1], [0, 0.98, 0.38]);
    for (const x of [-0.52, 0.52]) box(head, outfit.trim, [0.08, 0.96, 0.1], [x, 0.5, 0.38]);
    const tip = box(head, outfit.tunic, [0.6, 0.4, 0.6], [0, 1.02, -0.28]);
    tip.rotation.x = 0.5;
  } else {
    box(head, hair, [0.98, 0.26, 0.9], [0, 0.9, -0.02]);
    box(head, hair, [0.98, 0.64, 0.22], [0, 0.62, -0.36]);
    box(head, hair, [0.9, 0.14, 0.12], [0, 0.8, 0.38]);
    const style = female ? Math.floor(a / 4) % 3 : Math.floor(a / 4) % 2;
    if (female) {
      // Bob down to the jaw, then a bun or a ponytail.
      for (const x of [-0.48, 0.48]) box(head, hair, [0.12, 0.62, 0.66], [x, 0.52, 0.0]);
      if (style === 1) {
        ball(head, hair, 0.27, [0, 1.06, -0.32]);
        box(head, role === "herbalist" ? 0x5aa83a : GOLD, [0.34, 0.08, 0.3], [0, 0.95, -0.3]);
      } else if (style === 2) {
        box(head, hair, [0.3, 0.3, 0.3], [0, 0.92, -0.5]);
        box(head, hair, [0.26, 0.7, 0.26], [0, 0.52, -0.6]);
        box(head, outfit.trim === LEATHER ? GOLD : outfit.trim, [0.32, 0.07, 0.32], [0, 0.82, -0.52]);
      }
    } else if (style === 1) {
      // Swept-up spiky fringe.
      const f = box(head, hair, [0.9, 0.22, 0.3], [0.05, 1.0, 0.18]);
      f.rotation.x = -0.35;
      f.rotation.z = 0.12;
    } else {
      for (const x of [-0.47, 0.47]) box(head, hair, [0.08, 0.3, 0.6], [x, 0.68, -0.08]);
    }
  }
  // ---- Weapons ----
  rightArm.add(sword, wand);
  sword.position.set(0, -0.53, 0.06);
  wand.position.copy(sword.position);
  meleeWeapon(sword, look.weapon === "axe" || look.weapon === "hammer" ? look.weapon : "sword");
  if (kind === "archer" || role === "archer") bow(wand, { 0x3f7a2e: 0x9a6a3a, 0x7a2e32: 0x6a2a2a, 0x4a3f8a: 0xe8dcc0 }[outfit.tunic] ?? 0x94683e);
  else staff(wand, role === "herbalist" ? "life" : look.element, a % 2);
  if (look.offhand === "shield") {
    const sh = new T.Group();
    sh.position.set(-0.17, -0.36, 0.06);
    sh.rotation.y = -Math.PI / 2;
    leftArm.add(sh);
    const outline: [number, number][] = [[-0.3, 0.34], [0.3, 0.34], [0.3, 0.02], [0, -0.38], [-0.3, 0.02]];
    slab(sh, GOLD, outline, 0.06);
    const inner = slab(sh, 0x2f4a6e, outline.map(([x, y]) => [x * 0.82, y * 0.82 + 0.01] as [number, number]), 0.07);
    inner.position.z = 0.01;
    box(sh, GOLD, [0.14, 0.14, 0.06], [0, 0.06, 0.05]);
  } else if (look.offhand === "orb") ball(leftArm, 0x72e4ed, 0.13, [0, -0.6, 0.12]);
  wand.visible = false;
  batchRig(root);
  return {
    root,
    body,
    head,
    leftLeg,
    rightLeg,
    leftArm,
    rightArm,
    sword,
    wand,
    kind,
    phase: 0,
  };
}
export function wolf(): Rig {
  const root = new T.Group(),
    body = new T.Group(),
    head = new T.Group(),
    leftLeg = new T.Group(),
    rightLeg = new T.Group(),
    leftArm = new T.Group(),
    rightArm = new T.Group();
  root.add(body);
  body.position.y = 0.6;
  ball(body, 0x777b70, 0.6, [0, 0.22, 0], [0.75, 0.85, 1.3]);
  body.add(head);
  head.position.set(0, 0.45, 0.64);
  ball(head, 0x8f9585, 0.36, [0, 0, 0], [1, 0.95, 1.1]);
  box(head, 0xb7baa2, [0.36, 0.24, 0.44], [0, -0.06, 0.32]);
  box(head, 0x283733, [0.21, 0.12, 0.12], [0, -0.03, 0.56]);
  for (const x of [-0.22, 0.22]) {
    const ear = new T.Mesh(
      new T.ConeGeometry(0.15, 0.36, 3),
      material(0x667368),
    );
    ear.position.set(x, 0.36, -0.08);
    head.add(ear);
    ball(head, 0xffcc70, 0.055, [x, 0.07, 0.29]);
  }
  for (const [j, x, z] of [
    [leftLeg, -0.29, -0.42],
    [rightLeg, 0.29, -0.42],
    [leftArm, -0.29, 0.4],
    [rightArm, 0.29, 0.4],
  ] as const) {
    root.add(j);
    j.position.set(x, 0.64, z);
    box(j, 0x5a655b, [0.19, 0.54, 0.2], [0, -0.24, 0]);
  }
  const tail = box(body, 0x69756b, [0.19, 0.19, 0.74], [0, 0.17, -0.9]);
  tail.rotation.x = -0.4;
  batchRig(root);
  return {
    root,
    body,
    head,
    leftLeg,
    rightLeg,
    leftArm,
    rightArm,
    sword: new T.Group(),
    wand: new T.Group(),
    kind: "wolf",
    phase: 0,
  };
}
export function animate(
  rig: Rig,
  dt: number,
  moving: boolean,
  attack: number,
  sweep: boolean,
) {
  rig.phase += dt * (moving ? 11 : 2);
  const p = rig.phase,
    step = moving ? 0.65 : 0;
  rig.leftLeg.rotation.x = Math.sin(p) * step;
  rig.rightLeg.rotation.x = -Math.sin(p) * step;
  rig.body.position.y =
    (rig.kind === "wolf" ? 0.6 : BODY_Y) +
    (moving ? Math.abs(Math.sin(p)) * 0.06 : Math.sin(p) * 0.018);
  if (rig.kind === "wolf") {
    rig.leftArm.rotation.x = -Math.sin(p) * step;
    rig.rightArm.rotation.x = Math.sin(p) * step;
    rig.body.rotation.x = attack > 0 ? -0.2 : 0;
    return;
  }
  rig.leftArm.rotation.x = -Math.sin(p) * step * 0.5;
  rig.rightArm.rotation.x = Math.sin(p) * step * 0.35;
  rig.body.rotation.y = 0;
  rig.rightArm.rotation.y = 0;
  rig.rightArm.rotation.z = -0.12;
  if (attack > 0) {
    const wind = 0.28;
    const progress =
      attack < wind
        ? -attack / wind
        : -1 +
          2.4 *
            Math.sin((Math.min(1, (attack - wind) / (1 - wind)) * Math.PI) / 2);
    rig.body.rotation.y = progress * (sweep ? 0.65 : 0.28);
    rig.rightArm.rotation.y = progress * (sweep ? 1.8 : 1.35);
    rig.rightArm.rotation.x = -0.9;
    rig.rightArm.rotation.z = -0.22;
  }
}
export function sector(
  radius: number,
  halfArc: number,
  color: number,
  opacity = 0.4,
) {
  const shape = new T.Shape();
  shape.moveTo(0, 0);
  for (let i = 0; i <= 28; i++) {
    const a = -halfArc + (2 * halfArc * i) / 28;
    shape.lineTo(Math.sin(a) * radius, -Math.cos(a) * radius);
  }
  shape.lineTo(0, 0);
  const m = new T.Mesh(
    new T.ShapeGeometry(shape),
    new T.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthWrite: false,
      side: T.DoubleSide,
    }),
  );
  m.rotation.x = -Math.PI / 2;
  return m;
}
