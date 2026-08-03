# Model Guide

How to put a real 3D model on this portfolio.

The viewer is **manifest-driven**: adding, replacing or removing a model means editing
`src/content/models.ts` and dropping a file in `public/models/`. You should never need to touch
`ModelViewer.tsx` or `modelViewer.ts`.

---

## 1. Blender export steps

Follow these exactly. They fix the four problems that cause 90% of "my model looks wrong on the
web" issues — wrong scale, wrong orientation, offset pivot, and unbaked transforms. **None of them
change artistic intent.**

### Before exporting

1. **Apply transforms.** Select the object → `Ctrl+A` → **All Transforms**.
   Unapplied scale is the single most common cause of a model arriving huge, tiny, or lit wrongly
   (non-uniform scale breaks normals).
2. **Set the pivot where the model should rotate.** For a prop that sits on the ground, put the
   origin at the base centre: place the 3D cursor at the bottom centre → `Object → Set Origin →
   Origin to 3D Cursor`. The viewer orbits around the bounding-box centre, but a sane pivot makes
   `transform.position` predictable.
3. **Sit the model on Z = 0.** glTF is Y-up and Blender is Z-up; the exporter converts, so a model
   standing on Blender's Z = 0 arrives standing on the viewer's ground plane.
4. **Face −Y in Blender.** That becomes +Z in glTF, which is what the default camera looks at. If
   you cannot re-orient the mesh, correct it with `transform.rotationY` in the manifest instead.
5. **Real-world scale, metres.** A 3 m wall panel should be 3 units tall. The camera framing is
   derived from the bounding sphere, so any consistent scale *works*, but metres keep
   `distance` values meaningful across models.
6. **Triangulate.** Add a Triangulate modifier (or tick it on export). Quads are converted anyway;
   doing it yourself means you see what the browser sees.
7. **One UV map, named.** Multiple UV layers export but only the first is used by the standard
   material.
8. **Use Principled BSDF only.** glTF exports base colour, metallic, roughness, normal, occlusion
   and emission from Principled. Anything procedural (noise, musgrave, geometry nodes) **will not
   export** — bake it to a texture first.
9. **Limit materials.** Each material is a draw call. A kit piece should be 1–3.

### Export dialogue

`File → Export → glTF 2.0 (.glb/.gltf)`

| Setting | Value | Why |
| --- | --- | --- |
| Format | **glTF Binary (.glb)** | One file, no missing-texture surprises |
| Include → Limit to | **Selected Objects** | Stops stray scene junk shipping |
| Include → Data | Leave Cameras and Punctual Lights **off** | The viewer supplies its own lighting preset |
| Transform → +Y Up | **On** | Required by glTF |
| Data → Mesh → Apply Modifiers | **On** | Bakes your modifier stack |
| Data → Mesh → UVs, Normals | **On** | Tangents only if you ship a normal map |
| Data → Mesh → Vertex Colors | **Off** unless used | Free bytes otherwise |
| Data → Material → Images | **WebP** or JPEG | PNG is usually 3–5× larger for no visible gain |
| Compression → Draco | **On** for anything over ~500 kB | Typically 4–10× smaller geometry |

### After exporting

```bash
npm run models:check
```

This validates the GLB header and chunk alignment, reports triangle/vertex/material/texture counts
and detected compression, enforces `budgetKb`, and fails if a model has no accessible description.

---

## 2. Optimisation targets

| Model role | Triangles | Transfer size | Materials | Textures |
| --- | --- | --- | --- | --- |
| Hero / centrepiece | ≤ 150k | ≤ 3 MB | ≤ 4 | ≤ 4 × 2K |
| Case-study prop | ≤ 60k | ≤ 1.5 MB | ≤ 3 | ≤ 3 × 2K |
| Small inline prop | ≤ 20k | ≤ 500 kB | 1–2 | ≤ 2 × 1K |

If you exceed the transfer budget:

1. **Draco** the geometry (Blender export option) — biggest single win, no visual cost.
2. **Resize textures.** 2K → 1K is a 4× saving and is usually invisible at viewer size.
3. **Channel-pack** metallic/roughness/occlusion into one RGB texture.
4. **KTX2/Basis** for GPU-compressed textures — supported by the loader; needs an external tool
   (`toktx` or `gltf-transform`) as Blender cannot produce it directly.

`gltf-transform` is the fastest route for 2–4 if you want it:
`npx @gltf-transform/cli optimize in.glb out.glb --texture-compress webp`

---

## 3. Manifest reference

Every field of `ModelEntry` in `src/content/models.ts`:

| Field | Required | Purpose |
| --- | --- | --- |
| `id` | ✅ | Unique key; also used for DOM ids |
| `status` | ✅ | `'final'` ships; `'placeholder'` is **excluded from production builds** |
| `title` | ✅ | Heading beside the viewer |
| `description` | ✅ | **Accessible text equivalent.** `models:check` fails without it |
| `src` | ✅ | Path under `public/`, e.g. `/models/crate.glb` |
| `fallbackImage` | Strongly advised | Media-manifest id shown when WebGL is unavailable |
| `projectSlug` | — | Case study to attach to. Omit and it renders nowhere |
| `transform.rotationY` | — | Degrees; fixes export orientation without re-exporting |
| `transform.scale` | — | Uniform scale escape hatch — prefer fixing it in Blender |
| `transform.position` | — | Offset in local units |
| `camera.azimuth` | — | Horizontal angle, degrees. Default 25 |
| `camera.elevation` | — | Vertical angle, degrees. Default 12 |
| `camera.distance` | — | Multiple of bounding-sphere radius. Default 2.2; lower crops in |
| `camera.target` | — | Look-at point. Defaults to bounding-box centre |
| `lighting` | ✅ | `'worlds'` (warm key/cool fill), `'systems'` (cool key), `'studio'` (neutral) |
| `interaction` | ✅ | `'orbit'` (drag), `'turntable'` (auto-rotate), `'static'` |
| `hotspots[]` | — | `{ id, label, description, position: [x,y,z] }` in **local space** |
| `credits` | — | Attribution if the asset is not wholly yours |
| `budgetKb` | — | Enforced by `models:check` |

### Adding a model, start to finish

```bash
# 1. Export from Blender to public/models/my-model.glb
# 2. Add an entry to src/content/models.ts with status: 'final'
npm run models:check      # validate
npm run build             # confirm it builds
npm run serve:dist        # check it on the real path
```

### Finding hotspot coordinates

Hotspot positions are in the model's **local space**. In Blender, snap the 3D cursor to the vertex
you want (`Shift+S → Cursor to Selected`) and read the cursor's XYZ from the N-panel. Swap for
glTF's Y-up: Blender `(x, y, z)` → manifest `[x, z, -y]`.

---

## 4. What the viewer guarantees

- **Never blocks first paint.** `three`, `GLTFLoader` and `DRACOLoader` are separate lazy chunks;
  a page with no model downloads none of them.
- **Loads only near the viewport**, with a measured backstop in case `IntersectionObserver`
  delivery is throttled.
- **Renders only when on screen and the tab is visible.**
- **Full teardown** — geometries, materials, textures, renderer, and an explicit
  `forceContextLoss()` so repeated route changes cannot exhaust the browser's WebGL context limit.
- **Quality tiers** chosen from `hardwareConcurrency`, `deviceMemory` and pointer type; pixel ratio
  capped at 1.75 / 1.5 / 1.0.
- **The wheel is never captured.** Page scroll always wins; zoom is keyboard-only. On touch,
  `touch-action: pan-y` keeps vertical scrolling working.
- **Keyboard operable** — arrows rotate, `+`/`−` zoom, `0` resets, when the stage has focus.
- **Accessible fallbacks** — the description always renders; hotspots are real buttons; the canvas
  is `aria-hidden`; a still image is shown whenever WebGL is unavailable, reduced motion is on,
  Data Saver is enabled, or the connection is 2G.

---

## 5. Placeholder policy

`public/models/placeholder-panel.glb` is **generated geometry, not artwork** — produced by
`npm run models:placeholder` purely to prove the pipeline works. Its manifest entry is
`status: 'placeholder'`, so `publishedModels` filters it out of production builds and it can never
appear on the live site next to real work.

To replace it: export your real model, set `status: 'final'`, point `src` at it, and delete the
placeholder entry.
