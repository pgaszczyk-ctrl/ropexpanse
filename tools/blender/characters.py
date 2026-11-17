# All character parts in one GLB, after the owner's low-poly references (14 Nov 2026):
# outfits (warrior, archer, mage, herbalist, folk; 3 variants each), head, hair styles,
# beard, weapons and second-hand items. The game assembles a figure from them, so every
# Wayfarer can differ (hair, beard, skin, outfit, weapon).
#   blender -b -P tools/blender/characters.py -- public/models/characters.glb
# Every part is one mesh named "<part>__<joint>", modelled in game space (x right, y up,
# z = face) and stored relative to its joint, so the game hangs it on the rig:
#   body (0, 1.1, 0) · head (0, 1.44, 0) · arm_L/arm_R (∓0.5, 1.34, 0) · leg_L/leg_R (∓0.2, 0.78, 0)
#   hand: in the right arm at (0, -0.6, 0.06), melee blades point +z, staffs and bows stand up.
# Materials named "skin" and "hair" are recoloured by the game per character.
import bpy, bmesh, sys, random
from mathutils import Vector, Matrix

import os
out = os.path.abspath(sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else "characters.glb")
os.makedirs(os.path.dirname(out), exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)

def V(x, y, z):  # game → Blender
    return Vector((x, -z, y))

LEG, BODY = 0.78, 1.1
JOINTS = {
    "body": (0, BODY, 0), "head": (0, BODY + 0.34, 0),
    "arm_L": (-0.5, BODY + 0.24, 0), "arm_R": (0.5, BODY + 0.24, 0),
    "leg_L": (-0.2, LEG, 0), "leg_R": (0.2, LEG, 0),
    "hand": (0, 0, 0), "offhand": (0, 0, 0),
}

mats = {}
def mat(hexc, name=None):
    key = name or hexc
    if key in mats: return mats[key]
    m = bpy.data.materials.new(name or f"c{hexc:06x}")
    if bpy.app.version < (5, 0, 0):
        m.use_nodes = True
    lin = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = ((hexc >> 16) & 255) / 255, ((hexc >> 8) & 255) / 255, (hexc & 255) / 255
    bsdf = m.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (lin(r), lin(g), lin(b), 1)
    bsdf.inputs["Roughness"].default_value = 0.85
    mats[key] = m
    return m

SKIN, HAIR = "skin", "hair"
def m_of(color):
    if color == SKIN: return mat(0xf2c49b, "skin")
    if color == HAIR: return mat(0x2a2220, "hair")
    return mat(color)

pending = []  # objects of the part being built
def finish(o, color, bevel, segs=1):
    o.data.materials.append(m_of(color))
    if bevel > 0:
        md = o.modifiers.new("bevel", "BEVEL")
        md.width = bevel
        md.segments = 1  # one chamfer is enough at game size and keeps the file small
        md.limit_method = "ANGLE"
    pending.append(o)
    return o

def cube(color, size, at, bevel=0.025, segs=1, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=V(*at))
    o = bpy.context.object
    o.scale = (size[0], size[2], size[1])
    o.rotation_euler = (rot[0], -rot[2], rot[1])
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

def ball(color, r, at, detail=1, scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=detail, radius=r, location=V(*at))
    o = bpy.context.object
    o.scale = (scale[0], scale[2], scale[1])
    return finish(o, color, 0)

def gem(color, at, scale, rot=(0, 0, 0)):
    pts = [(0, scale[1], 0), (0, -scale[1], 0), (scale[0], 0, 0), (-scale[0], 0, 0), (0, 0, scale[2]), (0, 0, -scale[2])]
    import math
    c, s = math.cos(rot[2]), math.sin(rot[2])
    pts = [(at[0] + x * c - y * s, at[1] + x * s + y * c, at[2] + z) for x, y, z in pts]
    return hull(color, pts)

FLAT = Matrix(((1, 0, 0, 0), (0, 0, -1, 0), (0, 1, 0, 0), (0, 0, 0, 1)))  # local xy → game xy
def slab(color, outline, depth, at, facing="z", bevel=0.02):
    me = bpy.data.meshes.new("slab")
    bm = bmesh.new()
    f = bm.faces.new([bm.verts.new((x, y, -depth / 2)) for x, y in outline])
    r = bmesh.ops.extrude_face_region(bm, geom=[f])
    for v in [e for e in r["geom"] if isinstance(e, bmesh.types.BMVert)]: v.co.z += depth
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new("slab", me)
    bpy.context.collection.objects.link(o)
    turn = Matrix.Rotation(-1.5708, 4, "Z") if facing == "x" else Matrix.Rotation(1.5708, 4, "X") if facing == "y" else Matrix()
    o.matrix_world = Matrix.Translation(V(*at)) @ turn @ FLAT
    return finish(o, color, bevel)

def part(name, joint, pivot=None):
    """Joins what was built since the last part into one mesh, stored relative to its joint."""
    global pending
    objs = pending
    pending = []
    if not objs: return
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs: o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.convert(target="MESH")
    bpy.ops.object.join()
    o = bpy.context.view_layer.objects.active
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    o.data.transform(Matrix.Translation(-V(*(pivot or JOINTS[joint]))))
    o.name = o.data.name = f"{name}__{joint}"
    for p in o.data.polygons: p.use_smooth = False

GOLD, GOLD_D, STEEL, STEEL_L = 0xdaa53c, 0xa8782a, 0xaab1b6, 0xd5dadd
LEATHER, BELT, BOOT, BOOT_T, SOLE, EYE, WOOD = 0x5a3a22, 0x3a2618, 0x6b4226, 0x83563a, 0x3e2616, 0x1b1716, 0x8a5228
SHIRT = 0xe6dccb

# ---------------------------------------------------------------- outfits
OUTFITS = {
    # role.variant: tunic, dark, trim, shawl, style
    "warrior.0": dict(tunic=0x2b4166, dark=0x1d2c47, trim=GOLD, shawl=0x2b4166, style="plate"),
    "warrior.1": dict(tunic=0x9a4a2a, dark=0x5a3226, trim=STEEL, shawl=0x7a3a22, style="leather"),
    "warrior.2": dict(tunic=0x1f8a96, dark=0x4a3a2e, trim=STEEL, shawl=STEEL, style="silver"),
    "archer.0": dict(tunic=0x3f7a2e, dark=0x2e4a22, trim=0x2e5e22, shawl=0x2e5e22, style="hooded"),
    "archer.1": dict(tunic=0x7a2e32, dark=0x3a2a26, trim=0x5a2226, shawl=0x6a282c, style="straps"),
    "archer.2": dict(tunic=0x4a3f8a, dark=0x2a2a44, trim=0xe8dcc0, shawl=0x2f2f5e, style="zigzag"),
    "mage.0": dict(tunic=0x5b2a6e, dark=0x2e1e30, trim=GOLD, shawl=0x8a4fb0, style="robe", gem=0xb57aff),
    "mage.1": dict(tunic=0x2f5a8f, dark=0x1e2a3a, trim=0x9fcbee, shawl=0x2f5a8f, style="hoodrobe", gem=0x8fe6ff),
    "mage.2": dict(tunic=0x8a2a2a, dark=0x3a2a24, trim=GOLD, shawl=0x8a2a2a, style="robe", gem=0xff8a2a, inner=0x3a2a24),
    "herbalist.0": dict(tunic=0x5f8a2e, dark=0x2e4a22, trim=0x7aa83a, shawl=0x7aa83a, style="shawl"),
    "herbalist.1": dict(tunic=0x8a5a2a, dark=0x3a2a1e, trim=0xd29a2e, shawl=0xd29a2e, style="shawl"),
    "herbalist.2": dict(tunic=0x2e6e2e, dark=0x1e3a1e, trim=0x5aa83a, shawl=0x4a9a3a, style="shawl"),
    "folk.0": dict(tunic=0x6a5a44, dark=0x343c3b, trim=LEATHER, shawl=0x5a4a36, style="folk"),
    "folk.1": dict(tunic=0x4a5a6a, dark=0x2a3038, trim=LEATHER, shawl=0x3a4a5a, style="folk"),
    "folk.2": dict(tunic=0x6a3a3a, dark=0x342a2a, trim=LEATHER, shawl=0x5a2e2e, style="folk"),
}

def outfit(key, o):
    st, T_, D, TR, SH = o["style"], o["tunic"], o["dark"], o["trim"], o["shawl"]
    robe = st in ("robe", "hoodrobe")
    plate = st in ("plate", "silver")
    y0 = BODY
    # legs
    for j, x in (("leg_L", -0.2), ("leg_R", 0.2)):
        cube(D, (0.3, 0.46, 0.32), (x, 0.56, 0), 0.03)
        if st == "plate":
            cube(GOLD, (0.32, 0.18, 0.1), (x, 0.5, 0.15), 0.035, 2)
            cube(GOLD_D, (0.33, 0.04, 0.11), (x, 0.42, 0.15), 0.0)
        if st in ("silver", "leather"):
            cube(STEEL, (0.34, 0.12, 0.36), (x, 0.38, 0.0), 0.02)
        cube(BOOT, (0.36, 0.3, 0.46), (x, 0.15, 0.04), 0.05, 2)
        cube(BOOT_T if not st == "zigzag" else 0x3a3050, (0.4, 0.1, 0.44), (x, 0.31, 0.02), 0.03)
        cube(SOLE, (0.37, 0.05, 0.47), (x, 0.02, 0.04), 0.0)
        part(f"outfit.{key}", j)
    # torso
    cube(T_, (0.8, 0.56, 0.48), (0, y0 + 0.02, 0), 0.06, 2)
    skirt_h = 0.5 if robe else 0.3
    cube(T_, (0.86, skirt_h, 0.54), (0, y0 - 0.2 - skirt_h / 2, 0), 0.04)
    if robe:
        cube(o.get("inner", o["shawl"] if st == "robe" else 0x8fbde6), (0.26, skirt_h + 0.5, 0.04), (0, y0 - 0.12, 0.25), 0.0)
        for s in (-1, 1):
            cube(TR, (0.06, skirt_h + 0.5, 0.05), (s * 0.15, y0 - 0.12, 0.255), 0.01)
        cube(TR, (0.88, 0.06, 0.56), (0, y0 - 0.2 - skirt_h + 0.03, 0), 0.01)
    elif plate or st == "leather":
        for s in (-1, 1):
            cube(T_ if st != "silver" else STEEL, (0.36, 0.26, 0.05), (s * 0.22, y0 - 0.3, 0.26), 0.02)
            cube(TR if st == "plate" else STEEL_L, (0.22, 0.05, 0.05), (s * 0.3, y0 - 0.43, 0.26), 0.01)
        cube(D if st == "plate" else T_, (0.24, 0.28, 0.04), (0, y0 - 0.3, 0.27), 0.01)
    else:
        cube(TR if st != "zigzag" else T_, (0.3, 0.3, 0.04), (0, y0 - 0.32, 0.27), 0.01)   # lighter front panel
    if st == "zigzag":
        for s in (-1, 1): cube(TR, (0.3, 0.05, 0.05), (s * 0.24, y0 - 0.44, 0.27), 0.0, rot=(0, 0, s * 0.5))
    if st == "plate":
        cube(0x141d30, (0.22, 0.26, 0.03), (0, y0 + 0.14, 0.245), 0.0)
        for s in (-1, 1):
            cube(GOLD, (0.06, 0.34, 0.05), (s * 0.12, y0 + 0.12, 0.25), 0.01, rot=(0, 0, -s * 0.38))
            cube(GOLD, (0.14, 0.12, 0.06), (s * 0.3, y0 + 0.2, 0.25), 0.02)
    if st == "silver":
        cube(STEEL, (0.84, 0.46, 0.52), (0, y0 + 0.08, 0), 0.05, 2)
        cube(T_, (0.28, 0.22, 0.04), (0, y0 + 0.2, 0.27), 0.01)
        cube(T_, (0.3, 0.5, 0.04), (0, y0 - 0.32, 0.28), 0.01)
    if st in ("leather", "straps", "hooded"):
        cube(BELT, (0.1, 0.8, 0.04), (0, y0 + 0.05, 0.255), 0.0, rot=(0, 0, 0.7))
    if st == "straps":
        cube(BELT, (0.1, 0.8, 0.04), (0, y0 + 0.05, 0.26), 0.0, rot=(0, 0, -0.7))
    if st == "leather":
        cube(STEEL, (0.14, 0.14, 0.05), (0, y0 + 0.08, 0.28), 0.02, rot=(0, 0, 0.785))
    # belt, buckle, pouch
    cube(BELT, (0.86, 0.1, 0.54), (0, y0 - 0.16, 0), 0.02)
    cube(GOLD if st not in ("leather", "silver") else STEEL_L, (0.2, 0.15, 0.06), (0, y0 - 0.16, 0.28), 0.02)
    cube(BELT, (0.1, 0.07, 0.07), (0, y0 - 0.16, 0.3), 0.0)
    cube(LEATHER, (0.15, 0.15, 0.09), (-0.27, y0 - 0.25, 0.28), 0.02)
    # collar / shawl / hood down / zigzag
    if st == "hooded":
        cube(SH, (0.96, 0.22, 0.62), (0, y0 + 0.28, 0), 0.06, 2)
        cube(SH, (0.7, 0.3, 0.2), (0, y0 + 0.28, -0.32), 0.06, 2)     # hood lying on the back
        cube(SH, (0.8, 0.7, 0.08), (0, y0 - 0.02, -0.29), 0.02)        # short cape
    elif st in ("shawl", "folk"):
        cube(SH, (0.96, 0.18, 0.62), (0, y0 + 0.26, 0), 0.05, 2)
        hull(SH, [(-0.48, y0 + 0.22, 0.31), (0.48, y0 + 0.22, 0.31), (0, y0 + 0.0, 0.33), (-0.3, y0 + 0.3, 0.31), (0.3, y0 + 0.3, 0.31),
                  (-0.48, y0 + 0.22, 0.25), (0.48, y0 + 0.22, 0.25), (0, y0 + 0.0, 0.27)])        # V over the chest
    elif st == "zigzag":
        cube(SH, (0.96, 0.16, 0.62), (0, y0 + 0.26, 0), 0.04)
        for s in (-1, 1):
            cube(TR, (0.5, 0.06, 0.06), (s * 0.22, y0 + 0.16, 0.3), 0.0, rot=(0, 0, -s * 0.45))
    elif robe:
        cube(SH, (0.98, 0.16, 0.64), (0, y0 + 0.26, 0), 0.05, 2)
        cube(TR, (1.0, 0.05, 0.66), (0, y0 + 0.18, 0), 0.01)
        gem(o["gem"], (0, y0 + 0.2, 0.34), (0.09, 0.09, 0.05))
        cube(TR, (0.16, 0.16, 0.05), (0, y0 + 0.2, 0.32), 0.02, rot=(0, 0, 0.785))
    elif plate or st == "leather":
        cube(D if st != "silver" else T_, (0.46, 0.1, 0.42), (0, y0 + 0.31, 0), 0.03)
    part(f"outfit.{key}", "body")
    # arms
    for j, x, s in (("arm_L", -0.5, -1), ("arm_R", 0.5, 1)):
        cube(T_, (0.24, 0.3, 0.26), (x, y0 + 0.1, 0), 0.04)
        cube(T_ if robe else (D if plate else SHIRT), (0.22, 0.14, 0.24), (x, y0 - 0.1, 0))
        bracer = TR if robe or st == "plate" else STEEL if st == "silver" else 0x3a3050 if st == "zigzag" else LEATHER
        cube(bracer, (0.28, 0.14, 0.3), (x, y0 - 0.2, 0), 0.03, 2)
        cube(SKIN, (0.23, 0.22, 0.23), (x, y0 - 0.36, 0), 0.05, 2)
        if plate or st == "leather":
            pc = T_ if st == "plate" else STEEL
            cube(pc, (0.36, 0.2, 0.4), (x + s * 0.04, y0 + 0.28, 0), 0.07, 2)
            if st == "plate":
                cube(GOLD, (0.38, 0.06, 0.42), (x + s * 0.05, y0 + 0.18, 0), 0.02)
                cube(GOLD, (0.06, 0.18, 0.2), (x + s * 0.2, y0 + 0.24, 0), 0.02)
            else:
                cube(STEEL_L, (0.38, 0.05, 0.42), (x + s * 0.05, y0 + 0.19, 0), 0.01)
        if robe:
            cube(TR, (0.27, 0.06, 0.29), (x, y0 - 0.04, 0), 0.01)
        part(f"outfit.{key}", j)
    # a hood that goes over the head (mage.1)
    if st == "hoodrobe":
        c = BODY + 0.34 + 0.42
        cube(T_, (1.04, 0.94, 0.78), (0, c + 0.02, -0.12), 0.08, 2)   # open at the front: the face shows
        for s_ in (-1, 1): cube(T_, (0.1, 0.9, 0.2), (s_ * 0.5, c + 0.02, 0.3), 0.02)
        hull(T_, [(-0.4, c + 0.4, -0.1), (0.4, c + 0.4, -0.1), (0, c + 0.78, -0.42), (-0.3, c + 0.3, -0.5), (0.3, c + 0.3, -0.5), (0, c + 0.55, -0.55)])
        cube(TR, (1.08, 0.1, 0.1), (0, c + 0.47, 0.39), 0.03)
        for s in (-1, 1): cube(TR, (0.09, 0.9, 0.1), (s * 0.52, c + 0.02, 0.39), 0.03)
        part(f"outfit.{key}", "head")

for k, o in OUTFITS.items():
    outfit(k, o)

# ---------------------------------------------------------------- head, hair, beard
c = BODY + 0.34 + 0.42   # head centre
top = c + 0.4
cube(SKIN, (0.86, 0.8, 0.78), (0, c, 0), 0.09, 2)
for x in (-0.45, 0.45): cube(SKIN, (0.09, 0.2, 0.15), (x, c - 0.04, 0.02), 0.03)
for x in (-0.16, 0.16): cube(EYE, (0.075, 0.17, 0.03), (x, c + 0.02, 0.395), 0.0)
part("head", "head")

def crown(seed, lift=0.1, back_low=c - 0.34, sides=c - 0.12, front=0.42):
    random.seed(seed)
    pts = []
    for i in range(40):
        x = random.uniform(-0.5, 0.5); z = random.uniform(-0.48, front)
        pts.append((x, top + 0.04 + random.uniform(0, lift) - x * x * 0.25, z))
    pts += [(-0.5, top, -0.46), (0.5, top, -0.46), (0, top + 0.1, -0.5),
            (-0.5, c + 0.1, 0.18), (0.5, c + 0.1, 0.18), (-0.5, sides, -0.05), (0.5, sides, -0.05),
            (-0.48, back_low + 0.04, -0.38), (0.48, back_low + 0.04, -0.38), (0, back_low, -0.46),
            (-0.48, top - 0.02, 0.4), (0.48, top - 0.02, 0.4)]
    return pts

# short, swept up to a peak at the front right (warrior reference)
hull(HAIR, crown(1) + [(0.3, top + 0.34, 0.2), (0.12, top + 0.28, 0.34), (0.42, top + 0.2, 0.36), (-0.2, top + 0.2, 0.3)])
part("hair.short", "head")
# tousled: big rounded top falling over the forehead (herbalist / mage references)
hull(HAIR, crown(2, 0.16) + [(-0.3, top + 0.2, 0.2), (0.3, top + 0.22, 0.1), (0.0, top + 0.26, -0.1), (-0.52, c + 0.2, 0.3), (0.52, c + 0.2, 0.3), (0, top - 0.06, 0.46)])
part("hair.tousled", "head")
# flat-top (archer reference)
hull(HAIR, crown(3, 0.04) + [(-0.52, top + 0.14, 0.42), (0.52, top + 0.16, 0.42), (-0.52, top + 0.16, -0.48), (0.52, top + 0.16, -0.48)])
part("hair.flat", "head")
# bob down to the jaw with a straight fringe
def bob():
    hull(HAIR, crown(4, 0.06, c - 0.3, c - 0.3) + [(-0.52, c - 0.3, 0.2), (0.52, c - 0.3, 0.2), (-0.5, c - 0.32, -0.3), (0.5, c - 0.32, -0.3)])
    cube(HAIR, (0.86, 0.16, 0.12), (0, top - 0.1, 0.4), 0.03)
bob(); part("hair.bob", "head")
bob(); ball(HAIR, 0.3, (0, top + 0.12, -0.32), 1); cube(0xdaa53c, (0.4, 0.09, 0.34), (0, top - 0.02, -0.3), 0.02)
part("hair.bun", "head")
bob(); hull(HAIR, [(-0.18, top + 0.05, -0.4), (0.18, top + 0.05, -0.4), (-0.2, top - 0.1, -0.7), (0.2, top - 0.1, -0.7),
                   (-0.14, c - 0.5, -0.72), (0.14, c - 0.5, -0.72), (0, c - 0.6, -0.66)])
cube(0xdaa53c, (0.34, 0.08, 0.3), (0, top - 0.04, -0.52), 0.02)
part("hair.ponytail", "head")
# hair under a hood: strands at the sides and a fringe
for s in (-1, 1): cube(HAIR, (0.08, 0.56, 0.12), (s * 0.41, c - 0.04, 0.38), 0.02)
cube(HAIR, (0.86, 0.12, 0.1), (0, top - 0.1, 0.38), 0.02)
part("hair.hood", "head")
# beard with a small mouth
hull(HAIR, [(-0.46, c + 0.0, 0.42), (0.46, c + 0.0, 0.42), (-0.46, c + 0.0, 0.0), (0.46, c + 0.0, 0.0),
            (-0.4, c - 0.42, 0.38), (0.4, c - 0.42, 0.38), (-0.3, c - 0.5, 0.2), (0.3, c - 0.5, 0.2), (0, c - 0.52, 0.4),
            (-0.46, c - 0.25, 0.0), (0.46, c - 0.25, 0.0)])
cube(0x8a5a44, (0.18, 0.035, 0.03), (0, c - 0.15, 0.445), 0.0)
part("beard", "head")

# ---------------------------------------------------------------- weapons (hand-local: grip at origin)
def melee_sword():
    cube(GOLD, (0.13, 0.13, 0.09), (0, 0, -0.12), 0.03)
    cube(0x2a3a5a, (0.08, 0.08, 0.24), (0, 0, 0.04), 0.0)
    cube(GOLD, (0.5, 0.11, 0.13), (0, 0, 0.2), 0.03)
    hull(STEEL, [(-0.085, 0, 0.26), (0.085, 0, 0.26), (0, 0.035, 0.26), (0, -0.035, 0.26),
                 (-0.085, 0, 1.14), (0.085, 0, 1.14), (0, 0.035, 1.14), (0, -0.035, 1.14), (0, 0, 1.42)])
melee_sword(); part("weapon.sword", "hand")
# double-bladed axe
cube(WOOD, (0.09, 0.09, 1.2), (0, 0, 0.42), 0.0)
for z in (0.05, 0.62): cube(0x8a9094, (0.13, 0.13, 0.08), (0, 0, z), 0.02)
cube(0x8a9094, (0.15, 0.15, 0.26), (0, 0, 0.92), 0.02)
for s in (-1, 1):
    slab(STEEL, [(s * 0.07, 0.12), (s * 0.28, 0.24), (s * 0.44, 0.3), (s * 0.46, 0.0), (s * 0.44, -0.3), (s * 0.28, -0.24), (s * 0.07, -0.12)][::s], 0.06, (0, 0, 0.92), "y", 0.015)
part("weapon.axe", "hand")
# hammer with teal bands
cube(WOOD, (0.09, 0.09, 1.1), (0, 0, 0.38), 0.0)
cube(0x8a9094, (0.13, 0.13, 0.12), (0, 0, -0.18), 0.02)
cube(0x1f8a96, (0.12, 0.12, 0.05), (0, 0, 0.62), 0.0)
cube(STEEL, (0.64, 0.32, 0.32), (0, 0, 0.95), 0.04, 2)
for x in (-0.36, 0.36): cube(STEEL_L, (0.08, 0.36, 0.36), (x, 0, 0.95), 0.02)
for x in (-0.19, 0.19): cube(0x1f8a96, (0.06, 0.34, 0.34), (x, 0, 0.95), 0.0)
gem(0x8a9094, (0, 0.17, 0.95), (0.1, 0.1, 0.03))
part("weapon.hammer", "hand")

def staff_pole(color, ring):
    cube(color, (0.09, 1.75, 0.09), (0, 0.32, 0), 0.0)
    for y in (-0.5, 0.62): cube(ring, (0.13, 0.07, 0.13), (0, y, 0), 0.015)
def fork():
    cube(GOLD, (0.34, 0.07, 0.11), (0, 1.2, 0), 0.02)
    for s in (-1, 1): cube(GOLD, (0.07, 0.24, 0.11), (s * 0.16, 1.32, 0), 0.015)
staff_pole(0x4a3022, GOLD); fork(); ball(0xff8a2a, 0.17, (0, 1.4, 0), 1); part("staff.fire", "hand")
staff_pole(0x2a3a5a, GOLD); cube(GOLD, (0.14, 0.1, 0.14), (0, 1.2, 0), 0.02); gem(0x8fe6ff, (0, 1.44, 0), (0.1, 0.24, 0.1)); part("staff.frost", "hand")
staff_pole(0x4a3022, GOLD); fork(); gem(0x9b5cff, (0, 1.44, 0), (0.12, 0.26, 0.12)); part("staff.storm", "hand")
staff_pole(0x4a3022, GOLD); fork(); ball(0x72e4ed, 0.17, (0, 1.4, 0), 1); part("staff.plain", "hand")
staff_pole(WOOD, 0x7aa83a)
for s in (-1, 1): cube(WOOD, (0.08, 0.38, 0.08), (s * 0.1, 1.3, 0), 0.0, rot=(0, 0, -s * 0.55))
gem(0x6fb03a, (0.22, 1.58, 0), (0.12, 0.25, 0.04), (0, 0, -0.5))
part("staff.life.0", "hand")
staff_pole(WOOD, 0x7aa83a); cube(GOLD, (0.28, 0.08, 0.28), (0, 1.2, 0), 0.02)
for s in (-1, 1): cube(GOLD, (0.06, 0.12, 0.28), (s * 0.12, 1.28, 0), 0.01)
ball(0x8a8e90, 0.21, (0, 1.42, 0), 0); part("staff.life.1", "hand")

import math
def bow(color, grip):
    pts = []
    for i in range(7):
        y = -0.85 + i / 6 * 1.7
        pts.append((y, 0.08 + 0.3 * (1 - (y / 0.85) ** 2)))
    for (y1, z1), (y2, z2) in zip(pts, pts[1:]):
        cube(color, (0.1, math.hypot(y2 - y1, z2 - z1) + 0.04, 0.1), (0, (y1 + y2) / 2, (z1 + z2) / 2), 0.015, rot=(math.atan2(z2 - z1, y2 - y1), 0, 0))
    cube(grip, (0.13, 0.26, 0.13), (0, 0, 0.38), 0.02)
    cube(0xe0d4b4, (0.02, 1.7, 0.02), (0, 0, 0.08), 0.0)
bow(0x9a6a3a, LEATHER); part("bow.0", "hand")
bow(0x6a2a2a, 0x3a2620); part("bow.1", "hand")
bow(0xe8dcc0, 0x2a2a44); part("bow.2", "hand")

# heater shield on the left forearm (arm-local), facing out
outline = [(-0.3, 0.36), (0.3, 0.36), (0.32, 0.06), (0.18, -0.2), (0, -0.4), (-0.18, -0.2), (-0.32, 0.06)]
slab(GOLD, outline, 0.07, (-0.17, -0.42, 0.06), "x", 0.02)
slab(0x2b4166, [(x * 0.8, y * 0.8 + 0.01) for x, y in outline], 0.09, (-0.18, -0.42, 0.06), "x", 0.015)
cube(GOLD, (0.06, 0.16, 0.16), (-0.23, -0.37, 0.06), 0.03, 2)
part("offhand.shield", "offhand")
ball(0x72e4ed, 0.13, (0, -0.66, 0.12), 1); cube(GOLD, (0.14, 0.05, 0.14), (0, -0.54, 0.12), 0.01)
part("offhand.orb", "offhand")

# quivers on the back (body-local), one per archer outfit colour
for i, band in enumerate((0x6a7a2a, 0x8a3a3a, 0xe8dcc0)):
    q = (0.2, BODY + 0.1, -0.4)
    cube(0x5a3a22 if i < 2 else 0x2a2a44, (0.22, 0.6, 0.22), q, 0.03, rot=(0, 0, -0.35))
    cube(band, (0.235, 0.08, 0.235), (q[0] + 0.02, q[1] - 0.05, q[2]), 0.01, rot=(0, 0, -0.35))
    for dx in (-0.05, 0.0, 0.05):
        cube(0x6a4a2a, (0.025, 0.24, 0.025), (q[0] + 0.12 + dx, q[1] + 0.38, q[2]), 0.0, rot=(0, 0, -0.35))
        cube(0xf0e6cc, (0.06, 0.1, 0.03), (q[0] + 0.16 + dx, q[1] + 0.5, q[2]), 0.0, rot=(0, 0, -0.35))
    part(f"quiver.{i}", "body")

try:
    bpy.ops.export_scene.gltf(filepath=out, export_format="GLB", export_apply=True, export_yup=True,
                              export_materials="EXPORT", export_normals=False, export_texcoords=False)
except TypeError:
    bpy.ops.export_scene.gltf(filepath=out, export_format="GLB", export_apply=True)
print("WROTE", out)
