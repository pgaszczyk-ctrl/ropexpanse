# Pilot model: warrior with sword and shield, after the owner's low-poly reference.
# Run headless:  blender -b -P tools/blender/warrior.py -- public/models/warrior.glb
# Coordinates below are game space (x right, y up, z forward/face), converted to
# Blender (z up, face towards -y). Parts hang under empties named like the game rig
# (body, head, arm_L, arm_R, leg_L, leg_R, weapon, offhand), so the game animates them.
import bpy, bmesh, sys, random
from mathutils import Vector, Matrix

out = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else "warrior.glb"
random.seed(7)
bpy.ops.wm.read_factory_settings(use_empty=True)

def V(x, y, z):  # game → Blender
    return Vector((x, -z, y))

mats = {}
def mat(hexc):
    if hexc in mats: return mats[hexc]
    m = bpy.data.materials.new(f"c{hexc:06x}")
    m.use_nodes = True
    r, g, b = ((hexc >> 16) & 255) / 255, ((hexc >> 8) & 255) / 255, (hexc & 255) / 255
    # glTF wants linear colour; the hex values are sRGB.
    lin = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    bsdf = m.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (lin(r), lin(g), lin(b), 1)
    bsdf.inputs["Roughness"].default_value = 0.85
    mats[hexc] = m
    return m

def finish(obj, color, bevel, segs=1):
    obj.data.materials.append(mat(color))
    if bevel > 0:
        md = obj.modifiers.new("bevel", "BEVEL")
        md.width = bevel
        md.segments = segs
        md.limit_method = "ANGLE"
    for p in obj.data.polygons: p.use_smooth = False
    return obj

def cube(color, size, at, bevel=0.025, segs=1, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=V(*at))
    o = bpy.context.object
    o.scale = (size[0], size[2], size[1])
    o.rotation_euler = (rot[0], -rot[2], rot[1])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(o, color, bevel, segs)

def hull(color, pts, bevel=0.0):
    me = bpy.data.meshes.new("hull")
    bm = bmesh.new()
    for p in pts: bm.verts.new(V(*p))
    bmesh.ops.convex_hull(bm, input=bm.verts)
    bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new("hull", me)
    bpy.context.collection.objects.link(o)
    return finish(o, color, bevel)

def slab(color, outline, depth, at, facing="z", bevel=0.02):
    """Flat outline (x, y) extruded `depth`; facing z = lies in the game's XY plane."""
    me = bpy.data.meshes.new("slab")
    bm = bmesh.new()
    vs = [bm.verts.new((x, y, -depth / 2)) for x, y in outline]
    f = bm.faces.new(vs)
    r = bmesh.ops.extrude_face_region(bm, geom=[f])
    for v in [e for e in r["geom"] if isinstance(e, bmesh.types.BMVert)]: v.co.z += depth
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new("slab", me)
    bpy.context.collection.objects.link(o)
    # local (x, y, z) = game (x, y, z) then to Blender
    o.matrix_world = Matrix.Translation(V(*at)) @ Matrix(((1, 0, 0, 0), (0, 0, -1, 0), (0, 1, 0, 0), (0, 0, 0, 1)))
    if facing == "x":
        o.matrix_world = Matrix.Translation(V(*at)) @ Matrix.Rotation(-1.5708, 4, "Z") @ Matrix(((1, 0, 0, 0), (0, 0, -1, 0), (0, 1, 0, 0), (0, 0, 0, 1)))
    return finish(o, color, bevel)

def empty(name, at, parent=None):
    e = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(e)
    e.location = V(*at)
    if parent:
        e.parent = parent
        e.matrix_parent_inverse = parent.matrix_world.inverted()
    bpy.context.view_layer.update()
    return e

def attach(objs, parent):
    for o in objs:
        o.parent = parent
        o.matrix_parent_inverse = parent.matrix_world.inverted()

NAVY, NAVY_D, GOLD, GOLD_D = 0x2b4166, 0x1d2c47, 0xdaa53c, 0xa8782a
SKIN, EYE, HAIR = 0xf2c49b, 0x1b1716, 0x1f2236
BOOT, BOOT_T, LEATHER, STEEL, STEEL_L = 0x6b4226, 0x83563a, 0x5a3a22, 0xa9b0b5, 0xd5dadd

root = empty("rig", (0, 0, 0))
LEG, BODY = 0.78, 1.1   # hip and body pivot heights (longer legs than the old figure)
body = empty("body", (0, BODY, 0), root)
parts = {}

# ---- legs: navy trousers, gold knee guards, brown boots with a turned-down top ----
for name, x in (("leg_L", -0.2), ("leg_R", 0.2)):
    j = empty(name, (x, LEG, 0), root)
    objs = [
        cube(NAVY_D, (0.3, 0.46, 0.32), (x, 0.56, 0), 0.03),
        cube(GOLD, (0.32, 0.18, 0.1), (x, 0.5, 0.15), 0.035, 2),
        cube(GOLD_D, (0.33, 0.04, 0.11), (x, 0.42, 0.15), 0.0),
        cube(BOOT, (0.36, 0.3, 0.46), (x, 0.15, 0.04), 0.05, 2),
        cube(BOOT_T, (0.4, 0.1, 0.44), (x, 0.31, 0.02), 0.03),
        cube(0x3e2616, (0.37, 0.05, 0.47), (x, 0.02, 0.04), 0.0),
    ]
    attach(objs, j)

# ---- torso: navy tunic, V-neck with gold edges, belt with buckle, plated skirt ----
y0 = BODY
t = [
    cube(NAVY, (0.8, 0.56, 0.48), (0, y0 + 0.02, 0), 0.06, 2),
    cube(NAVY, (0.84, 0.3, 0.52), (0, y0 - 0.3, 0), 0.04),
    cube(0x141d30, (0.22, 0.26, 0.03), (0, y0 + 0.14, 0.245), 0.0),       # dark inside of the V
]
for s_ in (-1, 1):
    t.append(cube(GOLD, (0.06, 0.34, 0.05), (s_ * 0.12, y0 + 0.12, 0.25), 0.01, rot=(0, 0, -s_ * 0.38)))
    t.append(cube(GOLD, (0.22, 0.05, 0.05), (s_ * 0.3, y0 - 0.43, 0.26), 0.01))   # skirt plate edges
    t.append(cube(NAVY, (0.36, 0.26, 0.05), (s_ * 0.22, y0 - 0.3, 0.26), 0.02))
    t.append(cube(GOLD, (0.14, 0.12, 0.06), (s_ * 0.3, y0 + 0.2, 0.25), 0.02))      # gold plates at the chest corners
t += [
    cube(0x3a2618, (0.84, 0.1, 0.52), (0, y0 - 0.16, 0), 0.02),
    cube(GOLD, (0.2, 0.15, 0.06), (0, y0 - 0.16, 0.27), 0.02),
    cube(0x3a2618, (0.1, 0.07, 0.07), (0, y0 - 0.16, 0.29), 0.0),
    cube(LEATHER, (0.15, 0.15, 0.09), (-0.27, y0 - 0.24, 0.27), 0.02),
    cube(NAVY_D, (0.46, 0.1, 0.42), (0, y0 + 0.31, 0), 0.03),             # neck
]
attach(t, body)

# ---- arms: pauldron with gold rim, navy sleeve, gold bracer, hand ----
for name, x, s_ in (("arm_L", -0.5, -1), ("arm_R", 0.5, 1)):
    j = empty(name, (x, y0 + 0.24, 0), body)
    objs = [
        cube(NAVY, (0.24, 0.3, 0.26), (x, y0 + 0.1, 0), 0.04),
        cube(NAVY_D, (0.22, 0.14, 0.24), (x, y0 - 0.1, 0)),
        cube(GOLD, (0.28, 0.14, 0.3), (x, y0 - 0.2, 0), 0.03, 2),
        cube(SKIN, (0.23, 0.22, 0.23), (x, y0 - 0.36, 0), 0.05, 2),
        cube(NAVY, (0.36, 0.2, 0.4), (x + s_ * 0.04, y0 + 0.28, 0), 0.07, 2),
        cube(GOLD, (0.38, 0.06, 0.42), (x + s_ * 0.05, y0 + 0.18, 0), 0.02),
        cube(GOLD, (0.06, 0.18, 0.2), (x + s_ * 0.2, y0 + 0.24, 0), 0.02),
    ]
    attach(objs, j)
    parts[name] = j

# ---- head: rounded box, ears, dot eyes; faceted hair covering the top, back and sides ----
hy = y0 + 0.34
head = empty("head", (0, hy, 0), body)
c = hy + 0.42
h = [cube(SKIN, (0.86, 0.8, 0.78), (0, c, 0), 0.09, 2)]
for x in (-0.45, 0.45): h.append(cube(SKIN, (0.09, 0.2, 0.15), (x, c - 0.04, 0.02), 0.03))
for x in (-0.16, 0.16): h.append(cube(EYE, (0.075, 0.17, 0.03), (x, c + 0.02, 0.395), 0.0))
top = c + 0.4
pts = []
for i in range(40):  # crown
    x = random.uniform(-0.5, 0.5); z = random.uniform(-0.48, 0.42)
    pts.append((x, top + 0.06 + random.uniform(0, 0.1) - x * x * 0.25, z))
pts += [
    # swept-up peak at the front right, lower at the front left (like the reference)
    (0.3, top + 0.34, 0.2), (0.12, top + 0.28, 0.34), (0.42, top + 0.2, 0.36), (-0.2, top + 0.2, 0.3),
    (-0.48, top + 0.02, 0.38), (0.5, top + 0.02, 0.4),
    # sides above the ears and down the back of the head to the neck
    (-0.5, c + 0.1, 0.18), (0.5, c + 0.1, 0.18), (-0.5, c - 0.12, -0.05), (0.5, c - 0.12, -0.05),
    (-0.48, c - 0.3, -0.38), (0.48, c - 0.3, -0.38), (0, c - 0.36, -0.46), (-0.3, c - 0.34, -0.46), (0.3, c - 0.34, -0.46),
    (-0.5, top, -0.46), (0.5, top, -0.46), (0, top + 0.1, -0.5),
]
h.append(hull(HAIR, pts))
attach(h, head)

# ---- sword in the right hand, blade forward ----
sx, sy = 0.5, y0 - 0.36
w = empty("weapon", (sx, sy, 0.06), parts["arm_R"])
sw = [
    cube(GOLD, (0.13, 0.13, 0.09), (sx, sy, -0.06), 0.03),
    cube(0x2a3a5a, (0.08, 0.08, 0.24), (sx, sy, 0.1), 0.0),
    cube(GOLD, (0.5, 0.11, 0.13), (sx, sy, 0.26), 0.03),
    hull(STEEL, [(sx - 0.085, sy, 0.32), (sx + 0.085, sy, 0.32), (sx, sy + 0.035, 0.32), (sx, sy - 0.035, 0.32),
                 (sx - 0.085, sy, 1.2), (sx + 0.085, sy, 1.2), (sx, sy + 0.035, 1.2), (sx, sy - 0.035, 1.2), (sx, sy, 1.48)]),
]
attach(sw, w)

# ---- heater shield on the left forearm, facing out ----
shx, shy = -0.67, y0 - 0.2
sh = empty("offhand", (shx, shy, 0.06), parts["arm_L"])
outline = [(-0.3, 0.36), (0.3, 0.36), (0.32, 0.06), (0.18, -0.2), (0, -0.4), (-0.18, -0.2), (-0.32, 0.06)]
sobj = [slab(GOLD, outline, 0.07, (shx, shy, 0.06), "x", 0.02),
        slab(NAVY, [(x * 0.8, y * 0.8 + 0.01) for x, y in outline], 0.09, (shx - 0.01, shy, 0.06), "x", 0.015),
        cube(GOLD, (0.06, 0.16, 0.16), (shx - 0.06, shy + 0.05, 0.06), 0.03, 2)]
attach(sobj, sh)

bpy.ops.export_scene.gltf(filepath=out, export_format="GLB", export_apply=True, export_yup=True,
                          export_materials="EXPORT", export_normals=True)
print("WROTE", out)
