import type { CapabilityGroup } from './types';

/**
 * Capabilities.
 *
 * Every item is backed by the résumé skills section, a résumé role bullet, or a
 * published ArtStation breakdown. Two deliberate accuracy constraints:
 *
 *  1. Godot is listed as engine/editor familiarity ONLY. There is no claim of
 *     GDScript, C#, gameplay programming or production Godot work.
 *  2. Blueprint work is described as "basic" and pipeline-facing, matching the
 *     résumé wording. No gameplay-programming claim is made.
 */
/**
 * Skills are split three ways so a reviewer can tell instantly what is proven
 * on this site, what is a working tool, and what is honestly still ahead.
 *
 * `capabilities` = demonstrated: every item is evidenced by a case study or a
 * published piece linked from this portfolio. Nothing goes here on the strength
 * of having read about it.
 */
export const capabilities: CapabilityGroup[] = [
  {
    heading: 'Environment art',
    domain: 'worlds',
    items: [
      { label: 'Stylised & low-poly environments', detail: 'Modular kits, blockout through final dressing' },
      { label: 'Hard-surface & prop modelling', detail: 'Blender, 3ds Max, Maya, ZBrush' },
      { label: 'PBR texturing', detail: 'Substance 3D Painter, Photoshop' },
      { label: 'Trim sheets & channel-packed masks' },
      { label: 'Scene composition & visual storytelling' },
      { label: 'Rendering', detail: 'Cycles, Marmoset Toolbag, V-Ray, Arnold' },
    ],
  },
  {
    heading: 'Unreal Engine 5',
    domain: 'worlds',
    items: [
      { label: 'Lighting', detail: 'Lumen real-time GI and baked workflows' },
      { label: 'Materials & shaders', detail: 'Layered materials, ID masking, material instances' },
      { label: 'Real-time optimisation', detail: 'Draw-call reduction, virtual textures, texel-density discipline' },
      { label: 'Basic Blueprints', detail: 'Simple interactions and art-pipeline tooling — not gameplay programming' },
      { label: 'Scene assembly & set dressing' },
    ],
  },
  {
    heading: 'Production & leadership',
    domain: 'systems',
    items: [
      { label: 'Leading 3D production workflows' },
      { label: 'Asset-quality review' },
      { label: 'Team coordination' },
      { label: 'Workflow alignment & output consistency' },
      { label: 'Production planning' },
    ],
  },
  {
    heading: 'AI-assisted prototyping',
    domain: 'systems',
    items: [
      { label: 'Interactive website & experience prototypes' },
      { label: 'UI/UX concepts and visual direction' },
      { label: 'Generated imagery & story structures' },
      { label: 'Reusable pipeline tools', detail: 'Small Python tools that remove repetitive steps' },
      { label: 'Implementation planning' },
    ],
  },
];

/**
 * Engines and tools where familiarity is real but shallower than the headline
 * skills. Kept separate and worded precisely so nothing here can be read as a
 * proficiency claim.
 */
export const familiarity = {
  heading: 'Supporting tools',
  note: 'Working knowledge rather than production depth — listed for accuracy, not as a headline skill.',
  items: [
    {
      label: 'Godot (2D and 3D)',
      detail:
        'Comfortable in the editor: scenes, nodes, the project structure and general engine concepts in both 2D and 3D. I do not write Godot scripting, and I make no claim to GDScript, C# or gameplay programming in Godot.',
    },
    {
      label: 'Python',
      detail:
        'Small pipeline tools rather than software engineering — see the Blender add-on below. Not a claim to Unreal editor scripting yet.',
    },
  ],
} as const;

/**
 * Currently learning.
 *
 * Stated openly because the alternative — silence — reads as either ignorance
 * or concealment, and a reviewer will spot the gap either way. Naming it is the
 * stronger move, and nothing here is claimed as a skill.
 *
 * This list must stay honest: an item moves up into `capabilities` only once a
 * case study on this site demonstrates it.
 */
export const learning = {
  heading: 'Currently building',
  note: 'Not yet demonstrated on this site, so not claimed as a skill. Listed so the gap is visible rather than hidden.',
  items: [
    { label: 'Nanite and Virtual Shadow Maps', detail: 'UE5 workflows I am moving my environments onto.' },
    { label: 'Unreal Insights & GPU profiling', detail: 'Capturing before/after evidence for optimisation passes.' },
    { label: 'Niagara', detail: 'Real-time VFX — no published work yet.' },
    { label: 'Python editor utilities', detail: 'Extending pipeline tooling from Blender into Unreal.' },
  ],
} as const;

/**
 * Small tools and software work. Only entries with public, inspectable evidence
 * appear here — this section exists to show implementation capability, not to
 * compete with the environment-art work.
 */
export const tools = [
  {
    name: 'Batch Image to Brush Asset Library',
    repo: 'https://github.com/tekkem007/imgtoalpha',
    summary:
      'A Blender add-on that converts a folder of images into a single .blend brush asset library, with a modal progress loop so Blender stays responsive across large batches.',
    contribution: 'Written by me. Public repository, GPL-3.0.',
    stack: ['Python', 'Blender 4.x add-on API'],
    status: 'Published',
  },
  {
    name: 'This portfolio',
    repo: 'https://github.com/tekkem007/tekkem007.github.io',
    summary:
      'A static site built with Vite, React, TypeScript, Three.js and GSAP, deployed to GitHub Pages through GitHub Actions.',
    contribution:
      'Directed the content, structure and art direction; built with AI assistance. Included as an honest example of how I prototype interactive web work, not as a claim to front-end engineering depth.',
    stack: ['TypeScript', 'React', 'Three.js', 'GSAP', 'Vite'],
    status: 'Live',
  },
] as const;
