import type { Project, Track } from './types';
import {
  archivedSlugs,
  projectCategories,
  projectEvidence,
  projectRank,
  projectSpecs,
  trackRank,
} from './projectEvidence';

/**
 * Project content.
 *
 * Source of truth for every entry is Vishnu's own published ArtStation post
 * (linked via `externalUrl`) plus the July 2026 résumé. Case-study prose is a
 * rewrite of his own technical breakdowns — the technical claims are his, not
 * invented here. Nothing in this file describes employer-owned work: see
 * `experience.ts` for how the Analyzer Tensor role is presented.
 *
 * To add a project: append an entry, add its images to scripts/media-manifest.mjs,
 * run `npm run media`, and it appears in the grid. Add a `caseStudy` block and it
 * also gets its own prerendered page at /work/<slug>/.
 */
export const projects: Project[] = [
  {
    slug: 'maintenance-hangar',
    title: 'Maintenance Hangar',
    summary:
      'A large-scale sci-fi hangar built from a custom modular kit, lit with Lumen and textured almost entirely from a single trim sheet.',
    domain: 'worlds',
    ownership: 'personal',
    evidence: 'verified',
    year: '2026',
    software: ['Unreal Engine 5', 'Blender', 'Substance 3D Painter'],
    tags: ['Modular kit', 'Lumen GI', 'Trim sheets', 'Spline Blueprint', 'Decals'],
    cover: 'hangar-01',
    externalUrl: 'https://www.artstation.com/artwork/6LYWDN',
    externalLabel: 'View on ArtStation',
    caseStudy: {
      standfirst:
        'A vehicle-maintenance and cargo hub inside a deep-space station — built to hold up at industrial scale without the texture budget that usually implies.',
      role: 'Environment art, modular kit design, materials, lighting and set dressing.',
      contribution:
        'Personal project. Every element described here — the modular kit, the trim sheet, the spline Blueprint, the lighting and the set dressing — is my own work. Work in progress; the images show the environment mid-development.',
      sections: [
        {
          heading: 'The problem',
          body: [
            'A hangar has to read as enormous, and it has to read as functional. Those two goals fight each other: the scale that makes a space impressive is exactly what makes it repetitive and expensive to texture, and a big open volume gives the player no obvious route through it.',
            'So the brief I set myself had three constraints. The space had to feel massive and lived-in. Player pathing had to stay legible without signage doing all the work. And the whole thing had to stay inside a texture budget that a real-time scene could actually afford.',
          ],
        },
        {
          heading: 'A kit, not a set',
          body: [
            'Rather than model the hangar as a single environment, I built a modular kit — structural trusses, floor gridding and wall panels designed to snap together on a consistent grid.',
            'The practical payoff is texel density. Because every piece is authored against the same grid and the same unwrap rules, surface detail stays consistent everywhere in the environment instead of drifting as the space expands. It also means the hangar can grow: adding another bay is assembly, not modelling.',
          ],
        },
        {
          heading: 'One trim sheet instead of many bakes',
          body: [
            'The texturing approach is the decision I would defend hardest. Instead of unique bakes for every structural beam and wall panel, I authored a single 4K trim sheet in Substance 3D Painter containing corrugated metal, cable bundles, bolted seams and non-directional grunge.',
            'Modular pieces — the yellow crane supports, the ceiling trusses — are then unwrapped to specific coordinates on that sheet. The result is detail that reads as bespoke across the entire hangar while resolving to a single material ID.',
            'Tiling trims do have a tell: repetition. I broke that up with deferred decals for floor markings and safety warnings, which lets me put specific, narrative wear exactly where the composition needs it without adding a texture set.',
          ],
        },
        {
          heading: 'Lighting as navigation',
          body: [
            'Lumen handles real-time global illumination, but the lighting design is doing a navigational job. Bright work lights pick out the central maintenance platform, which is where I want the eye to land first.',
            'Under the walkways I let contrast go deep. Those shadows add the depth and industrial grime the space needs, and the brightness gradient between them and the platform is what tells a player which way is "in".',
          ],
        },
        {
          heading: 'A spline Blueprint for the transit tube',
          body: [
            'The curved transit tube running through the background is not modelled by hand. I built a Blueprint that instances and deforms static meshes along a 3D spline: I move the spline points, and it recalculates how many segments are needed and handles their orientation and spacing.',
            'This is the kind of Blueprint work I do — tooling that removes repetitive placement from the art process, rather than gameplay programming.',
          ],
        },
        {
          heading: 'Making scale legible',
          body: [
            'Large environments lose their sense of size without a human reference. Traffic cones, crates and terminal stations are placed specifically to give the viewer something whose real-world size they already know, which is what makes the crane supports and trusses read as massive.',
            'The composition uses a high-angle perspective so the floor layout and overhead gantries are both visible, with the floor markings and the horizontal transit tube acting as leading lines into the depth of the scene.',
          ],
        },
      ],
      gallery: [
        { id: 'hangar-01', caption: 'High-angle establishing view — floor layout and gantry systems read together.' },
        {
          id: 'hangar-02',
          caption: 'BP_Array: the construction script that reads spline positions and instances meshes along them.',
        },
        {
          id: 'hangar-03',
          caption: 'Unlit — the modular kit and the spline-generated transit tube, before any lighting.',
        },
      ],
    },
  },

  {
    slug: 'performance-audit',
    title: 'Performance Audit',
    summary:
      'A measured optimisation pass on a scene I did not author: 30.45 → 22.60 ms GPU frame time at native 1440p, with the method and the missed target reported in full.',
    domain: 'systems',
    ownership: 'personal',
    evidence: 'verified',
    year: '2026',
    software: ['Unreal Engine 5.8', 'PowerShell', 'Python'],
    tags: ['GPU profiling', 'Virtual Shadow Maps', 'Lumen', 'TSR', 'Benchmark harness'],
    cover: 'perf-audit-passes',
    caseStudy: {
      standfirst:
        'Deliberately run on a third-party environment pack rather than my own scene — because if I do not own the art, every millisecond saved has to come from engineering.',
      role: 'Performance analysis, benchmark tooling, optimisation and QA.',
      contribution:
        'Personal project, worked on alone. The scene is “Stylized Windmill Valley Environment” by StylArts (Fab, Standard License), obtained through Fab’s free-for-the-month giveaway — none of the art, models, materials or lighting in it are mine, and it is not presented as my environment work. What is mine is the benchmark harness, the profiling method, the optimisation decisions and the analysis below.',
      sections: [
        {
          heading: 'Why optimise someone else’s scene',
          body: [
            'Optimising your own environment is easy to fake. If the frame gets faster and the artist also happens to control the art, a reviewer cannot tell whether the win came from engineering or from quietly deleting half the foliage.',
            'So I used a scene I had no authorship over: “Stylized Windmill Valley Environment” by StylArts (Fab, Standard License), running in Unreal Engine 5.8. The art is a fixed control variable. Nothing was removed from it, no mesh was simplified, no texture was reduced — the primitive count is the same before and after, and the draw-call count only moved because of a Nanite setting. Every millisecond had to come from how the renderer was configured.',
            'That constraint is the point of the project. It is also why the result is worth reading: the numbers cannot be explained by the scene getting smaller.',
          ],
        },
        {
          heading: 'Building the measurement before the optimisation',
          body: [
            'The first version of the harness produced numbers I could not trust, and finding out why took longer than the optimisation itself.',
            'The engine’s `-ForceRes` flag does not reliably give you the resolution you asked for. Depending on the desktop state at launch, the same command line produced a 2560×1440 client area, or 2560×1080, or 1920×1032, or 1706×960. Runs that happened to be correct were correct by luck. Because a smaller render target is faster, that silently inflates any result you record.',
            'The fix was to stop trusting the engine flag: the harness now resizes the window itself and asserts the client area is exactly 2560×1440 before it records anything, aborting the run otherwise. Measurement noise fell from roughly ±3% to 0.02 FPS across repeat runs. Every figure quoted here comes from runs that passed that assertion, and the engine’s own on-screen `RenderRes: 100.0% (2560x1440)` readout is the second check.',
            'The rest of the protocol is fixed and stated: standalone game process, Epic scalability, 100% screen percentage, no frame cap, a 20-second warm-up, then a 2 400-frame CsvProfiler capture at each of five fixed camera positions reached by `BugItGo`.',
          ],
        },
        {
          heading: 'What the profile actually said',
          body: [
            'The baseline ran at 32.99 FPS — a 30.45 ms frame — and it was GPU-bound at every camera. The game thread sat at 2.89 ms, about 9% of the frame, so gameplay, Blueprints and ticking were irrelevant. So was streaming: the texture pool wanted 116 MB of a 1 000 MB budget and never came under pressure. So was light count — the Light Complexity view was uniformly blue, because the level has three lights.',
            'Ruling those out mattered as much as finding the real cost. Each one is a place an optimisation pass can burn a day for nothing.',
            'The frame divided into shadows at 6.94 ms, TSR at 5.83 ms, Lumen and deferred lighting at 4.46 ms, geometry at 4.58 ms and velocity at 2.78 ms.',
          ],
        },
        {
          heading: 'The finding: the preset, not the scene',
          body: [
            'Reading Unreal’s own `BaseScalability.ini` explained most of the frame. At Epic, `ShadowQuality@3` sets `r.Shadow.Virtual.ResolutionLodBiasDirectional` to **−1.5** — a negative bias, meaning virtual-shadow-map pages render roughly 2.8× denser than neutral. The scene’s directional light also carried a `ShadowResolutionScale` of 8.0. Those two multiply.',
            'The engine was reporting the consequence out loud: `[VSM] Non-Nanite Marking Job Queue overflow. Performance may be affected.` About 102 000 shadow-casting foliage instances were being marked into a shadow map far denser than a 1440p output can show.',
            'Epic also keeps a TSR history buffer at 200% screen percentage — 5120×2880 to produce a 2560×1440 image — and quadruples the volumetric fog grid, and enables Lumen hit lighting and full-resolution short-range AO.',
            'Picking those individual settings, rather than dropping whole quality groups, gave a better result per unit of visual change than any blanket scalability drop I tested. The VSM overflow warning stopped appearing.',
          ],
        },
        {
          heading: 'Two hypotheses the data killed',
          body: [
            'I expected hardware ray tracing to be the expensive path on a mid-range card, so I switched Lumen to software tracing. It was **5.9% slower**. The ray-tracing scene cost did drop to zero as predicted, but shadow projection rose 1.64 ms and the base pass 0.81 ms. Hardware ray tracing is genuinely the faster path for this scene on this GPU, and I reverted it.',
            'I also believed the wind animation on the foliage was invalidating cached shadow-map pages every frame, which would explain why shadow-depth cost stayed high in a static scene. The setting I reached for to test it, `MaxMaterialPositionInvalidationRange 0`, turns out to mean "no clamp" rather than "no invalidation" — so it never tested the idea, and it made things slightly worse. It is recorded as disproven rather than quietly dropped.',
            'Both are in the write-up because a performance pass that only reports its wins is not evidence of judgement.',
          ],
        },
        {
          heading: 'Not fooling yourself',
          body: [
            'Two things nearly produced a false conclusion, and both were caught by testing the measurement rather than trusting it.',
            'The first was drift. A "volumetric fog off" probe came back 2.8% slower, with every unrelated GPU pass up by an identical ~3%. No rendering change does that: the machine was slowing under sustained load. From then on a control run with no changes was interleaved between candidates and each result compared against the control interpolated to its position in the run order.',
            'The second was visual. The before/after images appeared to show foliage disappearing — which would have been a serious regression. It was not one. The level animates: its Blueprint drives a Timeline that changes the crop fields over time, and a screenshot taken after a fixed frame count lands at a different moment when the build is faster. Running the *unoptimised* configuration twice reproduced the same difference, which settled it. Had I not checked, I would have reported a regression that did not exist, or reverted a real win chasing it.',
          ],
        },
        {
          heading: 'The result, and the target I did not reach',
          body: [
            'Average FPS went from 32.99 to 44.37, a 34.7% improvement. Frame time fell 30.45 → 22.60 ms and GPU time 29.60 → 21.76 ms. VRAM dropped 537 MB, from 4 327 to 3 790. The 1% lows rose in proportion to the average, so frame pacing did not degrade. Every camera improved, and the worst-performing camera in the baseline improved the most.',
            'The goal was 90 FPS — an 11.1 ms frame. **I did not reach it, and it is not reachable on this hardware at native 1440p without visibly degrading the image.** After the pass the frame is still GPU-bound, and what remains is TSR at 3.70 ms, shadow projection at 3.09 ms, the base pass at 2.81 ms and shadow depths at 2.63 ms. Getting to 11.1 ms means removing half of what is left from a frame that no longer contains obvious waste.',
            'The only realistic route to 90 FPS here is rendering below 1440p and letting TSR upsample. That is a legitimate shipping decision, and it was explicitly outside the brief I set myself, so it is written up as a costed option rather than applied to make the headline number look better.',
            'I would rather show the ceiling and the reason for it than a figure that does not survive questioning.',
          ],
        },
      ],
      gallery: [
        {
          id: 'perf-audit-passes',
          caption:
            'Per-pass GPU cost before and after, averaged over five fixed cameras. The two orange bars are increases: suppressing vertex-deformation velocity moves work into the depth prepass rather than deleting it, so that change’s real contribution is about 0.8 ms rather than the 2.6 ms the velocity row alone suggests.',
        },
      ],
    },
  },

  {
    slug: 'layered-material-system',
    title: 'Modular Layered Material System',
    summary:
      'An Unreal Engine 5 master material driven by ID masks, so one mesh can swap between wood, painted metal and emissive trim without leaving the engine.',
    domain: 'systems',
    ownership: 'personal',
    evidence: 'verified',
    year: '2026',
    software: ['Unreal Engine 5', 'Substance 3D Painter'],
    tags: ['Material layers', 'ID masking', 'Channel packing', 'Shader complexity', 'Optimisation'],
    cover: 'material-01',
    externalUrl: 'https://www.artstation.com/artwork/8B69yn',
    externalLabel: 'View on ArtStation',
    caseStudy: {
      standfirst:
        'A technical-art study in removing the re-bake from the iteration loop — built so an artist can retexture an asset with a dropdown instead of a round trip to Substance.',
      role: 'Material system design and implementation in Unreal Engine 5.',
      contribution:
        'Personal technical study. The master material, the layer set, the ID-mask logic and the exposed parameter interface are entirely my own work.',
      sections: [
        {
          heading: 'Why bother',
          body: [
            'The default way to change how an asset looks is to go back to Substance 3D Painter, re-texture, re-bake and re-import. That is a slow loop, and it gets slower the more assets share a look, because a single art-direction change fans out across every texture set in the environment.',
            'It is also expensive at runtime. Unique texture sets per asset is the single easiest way to spend a memory budget without meaning to.',
            'So the goal was a system where colour and material changes happen in-engine, in seconds, and where a whole environment shares a small number of textures.',
          ],
        },
        {
          heading: 'Master material and layers',
          body: [
            'The system is built around one master material that blends several material layers — base wood grains, painted metals, emissive trims — all resolved inside a single material instance.',
            'Working in layers rather than in a monolithic graph means each surface type is authored once and reused everywhere. Adding a new surface to the environment is adding a layer, not rewriting a shader.',
          ],
        },
        {
          heading: 'ID masking',
          body: [
            'The part that makes it useful is the ID map. A mask texture assigns different material properties to specific regions of a mesh, so I can address "the handle" or "the panel" independently inside one material.',
            'That is what allows a wood layer to be swapped for a metal layer instantly, with no re-bake and no leaving the engine. The mesh does not change; the mask tells the shader which layer belongs where.',
          ],
        },
        {
          heading: 'An interface other artists can use',
          body: [
            'A system nobody else can drive is not a system. I exposed the parameters that actually get adjusted in practice: colour tint, roughness and metallic scalars, and static switches for optional features like surface wear.',
            'Static switches matter specifically because they compile out. An artist gets the flexibility of an optional wear pass, and assets that do not use it do not pay for it in shader complexity.',
          ],
        },
        {
          heading: 'What it costs',
          body: [
            'The optimisation argument is straightforward: this approach significantly reduces the number of unique texture sets a scene needs. Shared tiling textures plus channel-packed masks carry the detail, so high-fidelity results come with a much smaller memory footprint.',
            'I have not published percentage figures for the saving, because I have not measured it under controlled conditions — the honest claim is the structural one, not a number.',
          ],
        },
      ],
      gallery: [
        { id: 'material-01', caption: 'The layered stack inside a single material instance.' },
        {
          id: 'material-02',
          caption: 'The ID mask, unlit. Each flat colour selects a layer for that part of the mesh.',
        },
        { id: 'material-03', caption: 'The same view, lit: the layered material resolved on the mesh.' },
        {
          id: 'material-04',
          caption:
            'MM_BaseLayer, the master material — 152 base-pass instructions and 2 of 16 texture samplers.',
        },
        { id: 'material-06', caption: 'ML_LayerBase: the graph every layer in the system is built from.' },
        { id: 'material-05', caption: 'MLB_ID: the blend that reads the mask channels and picks a layer.' },
        { id: 'material-07', caption: 'MF_uvr: the reusable UV rotation, tiling and offset function.' },
      ],
    },
  },

  {
    slug: 'time-of-day-system',
    title: 'Time of Day: Runtime Day/Night Lighting System',
    summary:
      'A baked, night-only Unreal scene rebuilt as a fully dynamic Lumen environment, with a C++ controller that switches or blends between two complete lighting looks at runtime.',
    domain: 'systems',
    ownership: 'personal',
    evidence: 'verified',
    year: '2026',
    software: ['Unreal Engine 5.4', 'C++', 'Movie Render Queue'],
    tags: ['Lumen', 'Lighting pipeline', 'Tools programming', 'Runtime systems', 'Optimisation'],
    cover: 'tod-01',
    externalUrl: 'https://www.artstation.com/artwork/EzBAXq',
    externalLabel: 'View on ArtStation',
    caseStudy: {
      standfirst:
        'The scene shipped lit exactly one way: baked, static, night. Making it a second time of day was not a slider — it was a second bake. So I removed the bake entirely and replaced it with a system.',
      role: 'Lighting pipeline conversion, C++ tooling, optimisation and look development.',
      contribution:
        'Personal project, worked on alone. The environment is “Dreamscape: Stylized Environment Tower” by Polyart Studio (Fab), used as-is — the models, materials and level layout are theirs, not mine, and this is not presented as my environment work. What is mine is the conversion from baked to dynamic lighting, the C++ Time of Day system, both lighting presets, and the optimisation described below.',
      sections: [
        {
          heading: 'What was actually in the box',
          body: [
            'The level arrived fully baked: 1.1 GB of lightmap data, a Static directional light at 1 lux, and a Post Process Volume that explicitly forced Lumen global illumination and reflections to None. The project was also running DX11 with Shader Model 5, so Lumen and Virtual Shadow Maps were not merely disabled — they were unavailable.',
            'That rules out the obvious approach. You cannot brighten a baked night into a day, because every bounce you can see is stored in a lightmap that was solved for one sun position. A day version means a second bake, and a second bake means every subsequent tweak costs hours.',
          ],
        },
        {
          heading: 'Removing the bake',
          body: [
            'I moved the project to DX12 / SM6 and enabled Virtual Shadow Maps, then set the sun, the sky light and all 49 local lights to Movable, with the sky light on Real-Time Capture. The 1.1 GB of built lighting data had to leave the content directory entirely: with the sun Movable it no longer contributes, but Unreal will still apply the stale baked night on top of Lumen if the file is present.',
            'I chose software Lumen over hardware ray tracing. Switching to DX12 would have silently activated the project’s dormant ray-tracing flags across every level, and the target here was a playable frame budget on a mid-range GPU, not a maximum-quality still.',
            'The important constraint was blast radius. This project contains around thirty other levels that are still baked, so Lumen is enabled only on this one, through its own Post Process Volume overrides, rather than by flipping the project-wide default. Nothing else in the project changed appearance.',
          ],
        },
        {
          heading: 'The system',
          body: [
            'The controller is a C++ actor holding two instances of one struct. A preset describes an entire look: sun angle, colour, intensity and volumetric scattering; sky intensity and colour; height fog and volumetric fog; the post-process grade; multipliers for the level’s local lamps; and which particle systems are visible.',
            'Apply Day and Apply Night are exposed as editor buttons, so the viewport updates live while you tune, and the same code path runs at runtime. Because a look is data rather than a saved level state, blending between the two is a lerp across the struct.',
            'One design detail mattered more than it looks. The local lamp multipliers scale relative to a saved record of what is already applied, not to a sampled baseline. The first version sampled live intensities on load — which meant every reload treated the already-scaled values as the new baseline, and the multiplier compounded silently. The lamps had reached 2.7× their authored brightness before I caught it.',
          ],
        },
        {
          heading: 'Making it cheap enough to run',
          body: [
            'The pack’s candle Blueprint carries a point light with dynamic shadows enabled. That is invisible in a baked scene and ruinous in a dynamic one: 132 candle instances meant 132 shadow-casting lights, each of them a 10-lumen source with a 200 cm radius — the kind of light whose shadows nobody will ever see.',
            'Turning shadows off on that one component took the level from 143 dynamic shadow casters to 11. I applied it as a per-instance override rather than editing the shared Blueprint, because other levels in the project use the same asset and none of them asked for a lighting change.',
          ],
        },
        {
          heading: 'Three bugs worth writing down',
          body: [
            'Renders came out white while the viewport looked correct. The editor viewport applies physical camera exposure — f/4, 1/60 s, ISO 100, about 9.9 EV of it — and Movie Render Queue does not. Every value I had tuned by eye in the viewport was roughly ten stops too bright when rendered. Pinning that setting off in both paths and re-baselining the exposure bias closed the gap. I was wrong twice before I found it.',
            'Volumetric fog effectively only exists at Cinematic scalability. Movie Render Queue forces Cinematic through its Game Override settings, so fog I had tuned in a default viewport — where volumetric fog is quietly off — rendered as an opaque white-out. It was around seventy-five times too dense. Fog tuning now happens with the viewport pinned to Cinematic, which is the only way what you see matches what renders.',
            'The blend flashed magenta at its midpoint. Interpolating light colour with Unreal’s HSV lerp takes the long way round the hue wheel between a warm sun and a cool moon, and passes straight through magenta on the way. Linear RGB fixed it, and the midpoint now reads as a believable dusk.',
          ],
        },
      ],
      video: {
        id: 'tod-blend',
        poster: 'tod-01',
        width: 1920,
        height: 804,
        description:
          'The cave entrance cross-fading from the Day preset to the Night preset and back: sunlight drains from the rock face, the sky cools to deep blue, and the two door lamps rise from barely visible to the brightest thing in frame.',
        caption: 'Day to night and back. One level, one controller, no baked lighting.',
      },
      gallery: [
        {
          id: 'silent-gate-01',
          caption:
            'Before: the scene as it shipped and as I first presented it — baked lighting, night only, one fixed look.',
        },
        { id: 'tod-01', caption: 'Day preset — sun at −52°, exposure bias −4.0, lamps at 0.8× their authored intensity.' },
        { id: 'tod-02', caption: 'Night preset — the same camera and geometry, with only the preset changed.' },
        { id: 'tod-03', caption: 'Every field of the preset struct, Day against Night. The highlighted rows are what actually differs.' },
        { id: 'tod-04', caption: 'Five points along the night-to-day interpolation.' },
      ],
    },
  },

  // --- Supporting work: cards only, no dedicated case-study page ---

  {
    slug: 'reactor-access-hatch',
    title: 'Sub-Level 04: Reactor Access Hatch',
    summary:
      'A stylised hard-surface door prop designed for high readability — retro-futurist shapes, custom decals and a refractive locking hub.',
    domain: 'worlds',
    ownership: 'personal',
    evidence: 'verified',
    year: '2026',
    software: ['Blender', 'Substance 3D Painter'],
    tags: ['Hard surface', 'Prop design', 'Decals', 'Silhouette'],
    cover: 'hatch-01',
    externalUrl: 'https://www.artstation.com/artwork/EzBAKq',
    externalLabel: 'View on ArtStation',
  },
  {
    slug: 'arc-04-fusion-cell',
    title: 'ARC-04 Fusion Cell',
    summary:
      'A hero power-source prop using a weighted-normal workflow to keep bevels smooth at a real-time-friendly poly count.',
    domain: 'worlds',
    ownership: 'personal',
    evidence: 'verified',
    year: '2026',
    software: ['Blender', 'Substance 3D Painter'],
    tags: ['Hard surface', 'Weighted normals', 'Emissive', 'Game-ready'],
    cover: 'fusion-cell-01',
    externalUrl: 'https://www.artstation.com/artwork/NqnAeD',
    externalLabel: 'View on ArtStation',
  },
  {
    slug: 'gilded-relic',
    title: 'The Gilded Relic',
    summary:
      'An ornate short blade sculpted in ZBrush — tri-metal material definition with refractive gemstones and aged gold filigree.',
    domain: 'worlds',
    ownership: 'personal',
    evidence: 'verified',
    year: '2024',
    software: ['Blender', 'ZBrush', 'Substance 3D Painter', 'Marmoset Toolbag'],
    tags: ['Sculpting', 'Custom alphas', 'PBR', 'Hero asset'],
    cover: 'gilded-relic-01',
    externalUrl: 'https://www.artstation.com/artwork/n0gLaK',
    externalLabel: 'View on ArtStation',
  },
  {
    slug: 'industrial-lpg-cylinder',
    title: 'Industrial LPG Cylinder',
    summary:
      'A photoreal prop study in material storytelling — layered oxidation, grime and stencil wear that imply years of handling.',
    domain: 'worlds',
    ownership: 'study',
    evidence: 'verified',
    year: '2024',
    software: ['Blender', 'Substance 3D Painter', 'Marmoset Toolbag'],
    tags: ['Realism', 'Weathering', 'Smart masks', 'Custom alphas'],
    cover: 'lpg-01',
    externalUrl: 'https://www.artstation.com/artwork/9E9J3O',
    externalLabel: 'View on ArtStation',
  },
  {
    slug: 'travellers-trio',
    title: "Traveller's Trio",
    summary:
      'Product visualisation: a hard-shell luggage set with a subtle orange-peel finish authored to keep the polycarbonate from reading as CG.',
    domain: 'worlds',
    ownership: 'study',
    evidence: 'verified',
    year: '2024',
    software: ['Blender', 'Substance 3D Painter', 'Photoshop', 'Marmoset Toolbag'],
    tags: ['Product render', 'Subdivision surface', 'Studio lighting', 'Clean topology'],
    cover: 'luggage-01',
    externalUrl: 'https://www.artstation.com/artwork/lDwWP5',
    externalLabel: 'View on ArtStation',
  },
  {
    slug: 'bmo',
    title: 'BMO',
    summary: 'A low-poly game-ready character prop built to a 7,500 triangle budget, baked and rendered in Marmoset.',
    domain: 'worlds',
    ownership: 'personal',
    evidence: 'verified',
    year: '2024',
    software: ['Blender', 'Substance 3D Painter', 'Marmoset Toolbag'],
    tags: ['Low poly', 'Baking', 'Fan art', 'Game-ready'],
    cover: 'bmo-01',
    externalUrl: 'https://www.artstation.com/artwork/5vrbmW',
    externalLabel: 'View on ArtStation',
  },
  {
    // Published game, not artwork: the source project stays private, and
    // everything stated here is restated from its public itch.io page.
    slug: 'lastline-echoes-below',
    title: 'LASTLINE: ECHOES BELOW',
    summary: "Every lap you drive walls off the track. How many laps before there's no line left?",
    // 'systems', not 'worlds': the site files AI-assisted prototypes under
    // Intelligent systems, and this is one — its store page discloses AI
    // assistance across code, graphics, sound and text.
    domain: 'systems',
    ownership: 'personal',
    evidence: 'verified',
    year: '2026',
    // Deliberately empty. The itch.io page names no engine or toolchain, and
    // the only other source is the private project directory — so no claim is
    // made. Both arrays render nothing on a supporting card.
    software: [],
    tags: [],
    cover: 'lastline-01',
    externalUrl: 'https://tekkem007.itch.io/lastline',
    externalCta: 'Play on itch.io',
    release: {
      genre: 'Racing',
      platform: 'HTML5/browser',
      status: 'In development',
      // itch.io states this in full as "AI Assisted, Code, Graphics, Sounds,
      // Text". The headline term is what the card carries.
      aiDisclosure: 'AI Assisted',
    },
  },

  {
    slug: 'metal-toy-car',
    title: 'Metal Toy Car',
    summary: 'An early hard-surface study in worn painted metal and chrome, modelled in 3ds Max.',
    domain: 'worlds',
    ownership: 'study',
    evidence: 'verified',
    year: '2022',
    software: ['3ds Max', 'Substance 3D Painter', 'Marmoset Toolbag'],
    tags: ['Hard surface', 'Realism', 'Early work'],
    cover: 'toy-car-01',
    externalUrl: 'https://www.artstation.com/artwork/6b28gx',
    externalLabel: 'View on ArtStation',
  },
  {
    slug: 'checkmate',
    title: 'Checkmate',
    summary: 'A full chess set modelled and textured as a materials exercise, rendered in Cycles.',
    domain: 'worlds',
    ownership: 'study',
    evidence: 'verified',
    year: '2022',
    software: ['3ds Max', 'Blender', 'Substance 3D Painter'],
    tags: ['Realism', 'Materials', 'Early work'],
    cover: 'checkmate-01',
    externalUrl: 'https://www.artstation.com/artwork/3qk9lv',
    externalLabel: 'View on ArtStation',
  },
  {
    slug: 'uzui-swords',
    title: 'Uzui Swords',
    summary: 'A stylised weapon pair modelled in Blender — an early study in silhouette and anime-accurate proportion.',
    domain: 'worlds',
    ownership: 'personal',
    evidence: 'verified',
    year: '2022',
    software: ['Blender'],
    tags: ['Weapons', 'Stylised', 'Early work'],
    cover: 'uzui-01',
    externalUrl: 'https://www.artstation.com/artwork/eJrXNw',
    externalLabel: 'View on ArtStation',
  },
];

// --- Derived views ------------------------------------------------------
//
// Rank, archive state and the scannable spec live in projectEvidence.ts so the
// ordering decisions and the evidence ledger sit together in one reviewable
// file. They are merged in here so components keep consuming plain `Project`s.

const decorated: Project[] = projects
  .map((project) => ({
    ...project,
    rank: projectRank[project.slug] ?? 99,
    archived: archivedSlugs.has(project.slug),
    spec: projectSpecs[project.slug],
    facts: projectEvidence[project.slug],
    category: projectCategories[project.slug],
  }))
  .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));

/** Current work, ordered by hiring value. */
export const currentProjects = decorated.filter((p) => !p.archived);

/** Earlier work, shown collapsed so it cannot set the perceived standard. */
export const archivedProjects = decorated.filter((p) => p.archived);

/** Projects with a dedicated prerendered page. */
export const flagshipProjects = decorated.filter((p) => p.caseStudy);

/** Supporting work: current, but without its own page. */
export const supportingProjects = currentProjects.filter((p) => !p.caseStudy);

/**
 * Everything shown on one recruiter track, in that track's order.
 *
 * Membership comes from `trackRank`: a project missing from a track's map is not
 * shown on it at all. Archive state is still honoured, so an older study stays
 * collapsed on whichever track it appears on.
 */
export function projectsForTrack(track: Track): Project[] {
  const ranks = trackRank[track];
  return decorated
    .filter((p) => ranks[p.slug] !== undefined)
    .slice()
    .sort((a, b) => ranks[a.slug] - ranks[b.slug]);
}

/** Flagships for a track: the three-to-five pieces a reviewer should open. */
export function flagshipsForTrack(track: Track): Project[] {
  return projectsForTrack(track).filter((p) => p.caseStudy && !p.archived);
}

/** Supporting cards for a track: current work without its own page. */
export function supportingForTrack(track: Track): Project[] {
  return projectsForTrack(track).filter((p) => !p.caseStudy && !p.archived);
}

/** Earlier work for a track, shown collapsed. */
export function archivedForTrack(track: Track): Project[] {
  return projectsForTrack(track).filter((p) => p.archived);
}

/**
 * Everything the unified "Selected Environment & Prop Work" gallery shows.
 *
 * One collection, not two: environments and props are the same body of work
 * seen at different scales, and splitting them into separate sections made the
 * props read as an afterthought. Order still comes from `trackRank`, so the
 * strongest complete environment leads and the props follow in the order they
 * were already ranked in.
 *
 * Archived studies stay out. They are still listed, collapsed, underneath.
 */
export function galleryForTrack(track: Track): Project[] {
  return projectsForTrack(track).filter((p) => !p.archived);
}

/** How many gallery entries answer to each filter, for the control's counts. */
export function galleryCounts(items: Project[]): { environment: number; prop: number } {
  return {
    environment: items.filter((p) => p.category?.group === 'environment').length,
    prop: items.filter((p) => p.category?.group === 'prop').length,
  };
}

export function getProject(slug: string): Project | undefined {
  return decorated.find((p) => p.slug === slug);
}
