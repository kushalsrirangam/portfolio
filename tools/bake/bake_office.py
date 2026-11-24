"""Step 2 of the bake: light the exported office in Blender and bake a lightmap.

Usage:
  blender -b -P tools/bake/bake_office.py -- <in.glb> <hdri> <out.glb> <out_lightmap.png> [size] [samples]

Writes <out.glb> (the office as one mesh, with a second UV set "lightmap")
and <out_lightmap.png> (baked direct + indirect diffuse light, sRGB encoded,
divided by a scale factor saved next to it as <out_lightmap>.json).

Positions below are in the site's three.js coordinates (Y up, metres) and are
converted to Blender's (Z up) with b(). Keep them in step with
src/three/office/*.jsx when the office layout changes.
"""
import bpy
import json
import math
import os
import sys
import time

import numpy as np

argv = sys.argv[sys.argv.index("--") + 1:]
SRC, HDRI, OUT_GLB, OUT_LM = (os.path.abspath(p) for p in argv[:4])
SIZE = int(argv[4]) if len(argv) > 4 else 4096
SAMPLES = int(argv[5]) if len(argv) > 5 else 512

WARM = (1.0, 0.86, 0.72)


def b(x, y, z):
    """three.js (x, y, z) -> Blender (x, -z, y)."""
    return (x, -z, y)


def log(*a):
    print("[bake]", *a, flush=True)


t0 = time.time()
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
bpy.ops.import_scene.gltf(filepath=SRC)
occluders = [o for o in scene.objects if o.type == "MESH" and o.name.startswith("occl_")]
meshes = [o for o in scene.objects if o.type == "MESH" and o.name.startswith("recv_")]
log(f"imported {len(meshes)} receivers, {len(occluders)} occluders")

# --- One mesh, so one lightmap atlas covers the whole office ---------------
bpy.ops.object.select_all(action="DESELECT")
for o in meshes:
    o.select_set(True)
bpy.context.view_layer.objects.active = meshes[0]
bpy.ops.object.make_single_user(object=True, obdata=True)
bpy.ops.object.join()
office = bpy.context.view_layer.objects.active
office.name = "office_baked"
me = office.data

# Lightmap UVs: second UV set, uniform texel density, packed with margins.
render_uv = me.uv_layers.active
lm = me.uv_layers.new(name="lightmap")
me.uv_layers.active = lm
render_uv.active_render = True  # textures keep reading the original UVs
scene.tool_settings.use_uv_select_sync = True
bpy.ops.object.mode_set(mode="EDIT")
bpy.ops.mesh.select_all(action="SELECT")
bpy.ops.uv.smart_project(angle_limit=math.radians(60), island_margin=0.0, scale_to_bounds=False)
# A fixed margin (a few pixels) rather than one scaled per island: the office
# has thousands of small islands and scaled margins waste most of the atlas.
bpy.ops.uv.pack_islands(margin=0.001, margin_method="FRACTION", rotate=True, shape_method="CONCAVE")
bpy.ops.object.mode_set(mode="OBJECT")
log(f"lightmap UVs ready ({len(me.polygons)} faces) {time.time() - t0:.0f}s")

# --- Light the room ---------------------------------------------------------
temp = list(occluders)  # helper objects removed before export


def add_light(kind, name, pos, energy, color=WARM, size=0.1, size_y=None, rot=(0, 0, 0)):
    data = bpy.data.lights.new(name, kind)
    data.energy = energy
    data.color = color
    if kind == "AREA":
        data.shape = "RECTANGLE"
        data.size = size
        data.size_y = size_y or size
    else:
        data.shadow_soft_size = size
    obj = bpy.data.objects.new(name, data)
    obj.location = b(*pos)
    obj.rotation_euler = rot
    scene.collection.objects.link(obj)
    temp.append(obj)
    return obj


# Recessed linear ceiling lights (emit straight down).
for x in (-3, 0, 3):
    for z in (-1.6, 1.4):
        add_light("AREA", f"strip_{x}_{z}", (x, 3.18, z), 140, size=1.6, size_y=0.1)
# Pendants over the meeting table.
for dz in (-0.5, 0.5):
    add_light("POINT", f"pendant_{dz}", (4.45, 2.25, -2.2 + dz), 30, size=0.06)
# Picture lights over the gallery prints.
for px in (-0.98, 0, 0.98):
    add_light("POINT", f"picture_{px}", (-5.55, 2.1, -1.0 - px), 5, size=0.05)
# Warm wash on the walnut wall and the awards shelf.
add_light("POINT", "feature_wash", (0, 2.0, -3.5), 25, size=0.3)
add_light("POINT", "awards_wash", (5.2, 2.2, 1.0), 20, size=0.3)
# Cool glow from the monitors and the TV (screens face the room).
add_light("AREA", "main_screen", (0.12, 1.13, -3.47), 4, color=(0.75, 0.85, 1.0), size=0.7, size_y=0.4,
          rot=(-math.pi / 2, 0, 0))
add_light("AREA", "side_screen", (-0.6, 1.13, -3.39), 3, color=(0.75, 0.85, 1.0), size=0.6, size_y=0.34,
          rot=(-math.pi / 2, 0, 0.38))
add_light("AREA", "tv", (5.93, 1.45, -2.2), 6, color=(0.7, 0.85, 1.0), size=1.44, size_y=0.81,
          rot=(-math.pi / 2, 0, -math.pi / 2))

# Close the open front of the room so only the windows let the city in.
bpy.ops.mesh.primitive_plane_add(size=1, location=b(0, 1.6, 5.5))
front = bpy.context.active_object
front.scale = (12, 3.2, 1)
front.rotation_euler = (math.pi / 2, 0, 0)
temp.append(front)

# Night city light through the windows.
world = bpy.data.worlds.new("city")
world.use_nodes = True
nt = world.node_tree
env = nt.nodes.new("ShaderNodeTexEnvironment")
env.image = bpy.data.images.load(HDRI)
mapping = nt.nodes.new("ShaderNodeMapping")
coord = nt.nodes.new("ShaderNodeTexCoord")
mapping.inputs["Rotation"].default_value = (0, 0, math.pi * 0.62)
nt.links.new(coord.outputs["Generated"], mapping.inputs["Vector"])
nt.links.new(mapping.outputs["Vector"], env.inputs["Vector"])
bg = nt.nodes["Background"]
bg.inputs["Strength"].default_value = 0.8
nt.links.new(env.outputs["Color"], bg.inputs["Color"])
scene.world = world

# --- Bake -------------------------------------------------------------------
scene.render.engine = "CYCLES"
prefs = bpy.context.preferences.addons["cycles"].preferences
for device_type in ("OPTIX", "CUDA"):
    try:
        prefs.compute_device_type = device_type
        prefs.get_devices()
        gpus = [d for d in prefs.devices if d.type == device_type]
        if gpus:
            for d in prefs.devices:
                d.use = d.type == device_type
            scene.cycles.device = "GPU"
            log(f"rendering on {device_type}: {[d.name for d in gpus]}")
            break
    except TypeError:
        continue
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = False
scene.cycles.max_bounces = 6
scene.cycles.diffuse_bounces = 4
scene.render.bake.use_pass_direct = True
scene.render.bake.use_pass_indirect = True
scene.render.bake.use_pass_color = False
scene.render.bake.margin = 6
scene.render.bake.margin_type = "EXTEND"

img = bpy.data.images.new("lightmap", SIZE, SIZE, float_buffer=True, alpha=True)
img.colorspace_settings.name = "Linear Rec.709"
bake_nodes = []
for mat in me.materials:
    if not mat or not mat.use_nodes:
        continue
    node = mat.node_tree.nodes.new("ShaderNodeTexImage")
    node.image = img
    mat.node_tree.nodes.active = node
    bake_nodes.append((mat, node))

bpy.ops.object.select_all(action="DESELECT")
office.select_set(True)
bpy.context.view_layer.objects.active = office
log(f"baking {SIZE}px @ {SAMPLES} samples ...")
bpy.ops.object.bake(type="DIFFUSE")
log(f"bake done {time.time() - t0:.0f}s")

# --- Save the lightmap: scale into 0..1, encode sRGB via PNG ---------------
px = np.empty(SIZE * SIZE * 4, dtype=np.float32)
img.pixels.foreach_get(px)
px = px.reshape(-1, 4)
lit = px[:, :3][px[:, 3] > 0]
scale = float(np.percentile(lit.max(axis=1), 99.7)) if lit.size else 1.0
scale = max(scale, 1e-4)
px[:, :3] = np.clip(px[:, :3] / scale, 0, 1)
px[:, 3] = 1.0
img.pixels.foreach_set(px.ravel())
scene.view_settings.view_transform = "Standard"
scene.view_settings.look = "None"
scene.view_settings.exposure = 0
scene.view_settings.gamma = 1
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGB"
scene.render.image_settings.color_depth = "8"
img.save_render(OUT_LM, scene=scene)
with open(os.path.splitext(OUT_LM)[0] + ".json", "w") as f:
    json.dump({"scale": scale, "size": SIZE, "samples": SAMPLES}, f)
log(f"lightmap saved, scale {scale:.4f}")

# --- Export the office mesh with both UV sets ------------------------------
for mat, node in bake_nodes:
    mat.node_tree.nodes.remove(node)
for obj in temp:
    bpy.data.objects.remove(obj, do_unlink=True)
bpy.ops.object.select_all(action="DESELECT")
office.select_set(True)
bpy.ops.export_scene.gltf(
    filepath=OUT_GLB,
    export_format="GLB",
    use_selection=True,
    export_texcoords=True,
    export_normals=True,
    export_lights=False,
    export_cameras=False,
)
log(f"exported {OUT_GLB} in {time.time() - t0:.0f}s total")
