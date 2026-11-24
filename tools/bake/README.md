# Baked lighting for the 3D office

The office's realistic light (ceiling lights, lamps, city glow through the
windows, light bouncing off walls, soft shadows) is rendered once in Blender
and saved into a lightmap. The site loads that instead of faking it live.

Re-bake whenever you change the office layout in `src/three/office/`.

## What gets baked

`bakeRole()` in `src/three/office/shared.jsx` decides:

- **receiver**: baked light is painted onto it (room, desk, shelves, frames…)
- **occluder**: casts shadows in the bake but keeps live lighting (the
  downloaded furniture models)
- left out: screens and light strips, glass, 3D text, keyboard keys, plants

## Steps

Needs Blender 5.x (`winget install BlenderFoundation.Blender`) and Chrome.
Run from the repo root in PowerShell.

1. Serve the site:

   ```powershell
   npm run build; npm run preview
   ```

2. In another terminal, export the office (opens the site with `?bake-export`):

   ```powershell
   node tools/bake/export-office.mjs
   ```

3. Bake (about 3 minutes on an RTX 4080 at 4096 px / 1024 samples):

   ```powershell
   & "C:\Program Files\Blender Foundation\Blender 5.3\blender.exe" -b -P tools/bake/bake_office.py -- tools/bake/out/office_export.glb public/hdri/shanghai_bund_2k.hdr tools/bake/out/office_baked.glb tools/bake/out/office_lightmap.png 4096 1024
   ```

4. Compress into the site:

   ```powershell
   npx @gltf-transform/cli optimize tools/bake/out/office_baked.glb public/baked/office.glb --texture-compress webp --texture-size 1024 --simplify false --prune false
   npx sharp-cli -i tools/bake/out/office_lightmap.png -o public/baked/office_lightmap.webp -f webp -q 88
   Copy-Item tools/bake/out/office_lightmap.json src/three/office/bake-info.json
   ```

`--prune false` matters: it keeps the second UV set the lightmap uses.

## Checking a bake

Open the site with `?bake-debug` to see only the baked light (white
surfaces, live lights off). Light positions in `bake_office.py` are written
in the site's coordinates; keep them in step with the office code.
