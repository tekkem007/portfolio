import type { Project } from './types';
import { archivedSlugs, projectEvidence, projectRank, projectSpecs } from './projectEvidence';

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
        { id: 'hangar-02', caption: 'Set dressing at human scale; decals break up the tiling trim material.' },
        { id: 'hangar-03', caption: 'The transit tube generated by the spline-instancing Blueprint.' },
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
        { id: 'material-02', caption: 'Layer breakdown — each surface type authored once, reused everywhere.' },
        { id: 'material-03', caption: 'The ID mask that assigns layers to regions of the mesh.' },
        { id: 'material-06', caption: 'Exposed parameters: tints, scalars and static switches for optional wear.' },
        { id: 'material-05', caption: 'The same mesh after an in-engine layer swap — no re-bake.' },
        { id: 'material-07', caption: 'Final shaded result across a set of props.' },
      ],
    },
  },

  {
    slug: 'the-silent-gate',
    title: 'The Silent Gate',
    summary:
      'A stylised environment study about contrast — a soft, sunlit meadow leading straight into a cold industrial vault door.',
    domain: 'worlds',
    ownership: 'personal',
    evidence: 'verified',
    year: '2026',
    software: ['Unreal Engine 5', 'Blender', 'Substance 3D Painter'],
    tags: ['Stylised', 'Environment storytelling', 'Foliage', 'Lighting design', 'Composition'],
    cover: 'silent-gate-01',
    externalUrl: 'https://www.artstation.com/artwork/EzBAXq',
    externalLabel: 'View on ArtStation (includes camera fly-through)',
    caseStudy: {
      standfirst:
        'An environment that has to feel inviting and exclusionary at the same time — and a lighting setup built to make the viewer feel both without being told.',
      role: 'Full environment: modelling, texturing, foliage, lighting and camera.',
      contribution: 'Personal project, made independently end to end, including the camera fly-through below.',
      sections: [
        {
          heading: 'The idea',
          body: [
            'I wanted a single frame to hold two opposite feelings: a lush, peaceful meadow that leads directly to the cold, immovable presence of a high-security vault.',
            'That contrast is the whole piece. The natural world is soft, warm and moving; the fortification is hard, cool and absolutely static. Everything else — palette, lighting, foliage behaviour — is in service of making that opposition land.',
          ],
        },
        {
          heading: 'Stylised, but with weight',
          body: [
            'The target was a painterly, stylised aesthetic that still carries physical weight and scale. Stylisation makes it very easy to lose mass; shapes get charming and stop feeling heavy.',
            'The rock faces do most of that work. I leaned into a lived-in treatment — moss and hanging vines breaking up the harsh geometry of the cavern entrance — so the cliffs read as old and solid rather than as smooth stylised forms.',
          ],
        },
        {
          heading: 'Two lights, one story',
          body: [
            'The lighting is a deliberate dual setup. The mountain shadows sit in cool ambient light, and that cool field is punctured by the warm, high-contrast glow of the entryway torches.',
            'The eye goes to the warmest, highest-contrast point in a frame, so that torchlight is what pulls the viewer straight to the circular vault door. The narrative focal point and the lighting focal point are the same place, which is the only reason the composition works without a marker or a prompt.',
          ],
        },
        {
          heading: 'Depth through palette',
          body: [
            'The grass and flowers are designed to look soft and wind-swept, deliberately contrasting with the sharp, craggy cliff textures.',
            'I kept the foreground palette vibrant and let it desaturate into the distance. That atmospheric perspective is what gives the shot depth, and it also means the muted vault reads as further away and colder than it strictly is.',
          ],
        },
        {
          heading: 'Framing the discovery',
          body: [
            'I chose wide-angle cinematic framing to emphasise discovery — the sense of coming upon this rather than arriving at it.',
            'The natural pathing of the rocks and the central tree guide the eye from the sunlit grass toward the mystery in the mountain. The composition does the narration.',
          ],
        },
      ],
      video: {
        id: 'silent-gate-flythrough',
        poster: 'silent-gate-02',
        width: 1920,
        height: 1080,
        description:
          'Camera fly-through of The Silent Gate: the shot travels across the sunlit meadow, past the central tree, and settles on the torch-lit circular vault door set into the mossy cliff face.',
        caption:
          'Camera fly-through — the composition reads as one continuous move from sunlit grass to the vault door.',
      },
      gallery: [{ id: 'silent-gate-01', caption: 'The meadow approach — warm torchlight against cool mountain shadow.' }],
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

export function getProject(slug: string): Project | undefined {
  return decorated.find((p) => p.slug === slug);
}
