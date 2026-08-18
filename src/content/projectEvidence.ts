import type { EvidenceItem, ProjectSpec, Track, WorkCategory } from './types';

/**
 * Project ranking, scannable specs, and the evidence ledger.
 *
 * Kept beside `projects.ts` rather than inside it so the *claims* a recruiter
 * reads are separable from the *prose*, and so the outstanding-evidence list is
 * a single reviewable file.
 *
 * ## The rule this file enforces
 *
 * An `EvidenceItem` reaches the public site only when `status: 'verified'` and
 * `value` is set. Everything else is a request: rendered as an authoring
 * checklist during `npm run dev`, stripped from production.
 *
 * A value may be marked `verified` in exactly two cases:
 *   1. the owner supplied it, or
 *   2. it was measured directly from a file in this repository.
 * `source` must say which. Nothing is estimated, rounded from memory, or
 * inferred from what "looks about right".
 */

/**
 * Which projects appear on each recruiter track, and in what order.
 *
 * Absence means the project is not shown on that track at all — a reviewer
 * screening for one role should not have to scroll past evidence for the other.
 * A project appears twice only when it carries independently strong evidence for
 * both audiences, and its position changes to match what that reviewer cares
 * about first.
 *
 * Two deliberate exclusions worth stating, because they look like omissions:
 *   • `performance-audit` and `time-of-day-system` are technical-art only. Both
 *     run on third-party environment packs. Their technical contribution is
 *     entirely Vishnu's, but listing them as environment work would invite
 *     exactly the misreading the case studies go out of their way to prevent.
 *   • `maintenance-hangar` is the one project on both tracks: it is his own
 *     environment AND it contains the spline-based mesh-instancing Blueprint,
 *     so each audience has something of its own to look at.
 */
export const trackRank: Record<Track, Record<string, number>> = {
  'technical-art': {
    'time-of-day-system': 1,
    'performance-audit': 2,
    'layered-material-system': 3,
    'maintenance-hangar': 4,
    'lastline-echoes-below': 5,
  },
  // Environments lead, then the props, strongest first. Time of Day appears on
  // both tracks and is read differently on each: pipeline evidence there,
  // environment lighting here. Its card says so.
  'environment-art': {
    'maintenance-hangar': 1,
    'time-of-day-system': 2,
    'layered-material-system': 3,
    'reactor-access-hatch': 4,
    'arc-04-fusion-cell': 5,
    'gilded-relic': 6,
    'industrial-lpg-cylinder': 7,
    'travellers-trio': 8,
    bmo: 9,
    'metal-toy-car': 10,
    checkmate: 11,
    'uzui-swords': 12,
  },
};

/**
 * Category label and filter group for the unified "Selected Environment & Prop
 * Work" gallery on the environment track.
 *
 * The label is the honest description of what the piece is; the group is only
 * which of the two filters it answers to. That is why the LPG cylinder is a
 * Material Study filed under Props (it is one object, studied for its surface)
 * while the layered material system is a Material Study filed under
 * Environments (it surfaces a whole modular kit).
 *
 * A slug missing from this map simply renders without a category chip.
 */
export const projectCategories: Record<string, WorkCategory> = {
  'maintenance-hangar': { label: 'Environment / Modular Kit', group: 'environment' },
  'time-of-day-system': { label: 'Lighting Study', group: 'environment' },
  'layered-material-system': { label: 'Material Study', group: 'environment' },
  'reactor-access-hatch': { label: 'Prop', group: 'prop' },
  'arc-04-fusion-cell': { label: 'Prop', group: 'prop' },
  'gilded-relic': { label: 'Prop', group: 'prop' },
  'industrial-lpg-cylinder': { label: 'Material Study', group: 'prop' },
  "travellers-trio": { label: 'Product Render', group: 'prop' },
  bmo: { label: 'Prop', group: 'prop' },
  'metal-toy-car': { label: 'Prop', group: 'prop' },
  checkmate: { label: 'Prop', group: 'prop' },
  'uzui-swords': { label: 'Prop', group: 'prop' },
};

/**
 * A second, genuine image per gallery entry, revealed on interaction.
 *
 * Every one of these already exists in the media manifest and is a real
 * capture from the project it belongs to: an alternate angle, a detail, a
 * breakdown sheet, or in Time of Day's case the same shot under the other
 * lighting preset. Nothing here is a rendered-for-the-website flourish.
 *
 * A slug with no entry simply does not get the reveal; the card is otherwise
 * identical. `label` names what the reviewer is being shown, because a picture
 * swapping under the cursor with no caption is a puzzle, not evidence.
 */
export const projectDetailShots: Record<string, { id: string; label: string }> = {
  'maintenance-hangar': { id: 'hangar-03', label: 'Unlit' },
  'time-of-day-system': { id: 'tod-02', label: 'Night preset' },
  'layered-material-system': { id: 'material-02', label: 'ID mask' },
  'reactor-access-hatch': { id: 'hatch-02', label: 'Wireframe' },
  'arc-04-fusion-cell': { id: 'fusion-cell-02', label: 'Wireframe' },
  'gilded-relic': { id: 'gilded-relic-02', label: 'Texture maps' },
  "travellers-trio": { id: 'luggage-02', label: 'Studio view' },
};

/** Lower sorts first. Ordered by hiring value for the stated primary role. */
export const projectRank: Record<string, number> = {
  // --- Flagship grid ("Selected work"), order set by Vishnu ---------------
  // The Silent Gate leads: it is the only flagship that is finished and shown
  // Time of Day sits second: it is the strongest technical-art evidence in
  // the grid — a shipped system with measured before/after numbers — and it
  // reframes the same scene as pipeline work rather than environment art.
  'time-of-day-system': 1,
  // Performance follows now the title reads "Environments & Performance". It is
  // the only project carrying measured numbers, and the strongest evidence for
  // the technical half of that positioning.
  'performance-audit': 2,
  // Technical art is the stated support skill.
  'layered-material-system': 3,
  // Maintenance Hangar last of the flagships — still work in progress, so it
  // sets the standard a reviewer judges the others by if it leads.
  'maintenance-hangar': 4,
  // 2026 hard-surface work.
  'reactor-access-hatch': 5,
  'arc-04-fusion-cell': 6,
  // 2024 craft studies.
  'gilded-relic': 7,
  'industrial-lpg-cylinder': 8,
  'travellers-trio': 9,
  bmo: 10,
  // Playable release. Last in the supporting grid because a browser game is the
  // least direct evidence for the stated environment-art role — not a judgement
  // on the work. Move this number to move the card.
  'lastline-echoes-below': 11,
  // 2022 — see `archivedSlugs`.
  'metal-toy-car': 12,
  checkmate: 13,
  'uzui-swords': 14,
};

/**
 * Early work, moved into a collapsed "Earlier work" list.
 *
 * Not deleted: a 2022 study is honest history and costs nothing when it is
 * clearly dated and out of the main grid. It is demoted because a reviewer
 * judges you by the weakest thing at your current standard, and these sit four
 * years behind it.
 */
export const archivedSlugs = new Set(['metal-toy-car', 'checkmate', 'uzui-swords']);

export const projectSpecs: Record<string, ProjectSpec> = {
  'maintenance-hangar': {
    role: 'Sole environment artist — kit design, materials, lighting, set dressing, Blueprint tooling',
    ownership: 'Personal project',
    status: 'Work in progress',
    responsibilities: [
      'Designed the modular kit and its snapping grid',
      'Authored the trim sheet in Substance 3D Painter',
      'Built the Lumen lighting for readability and pathing',
      'Wrote the spline mesh-instancing Blueprint',
    ],
    assetSources: 'All geometry, materials and lighting authored by me. No marketplace or library assets.',
  },
  'performance-audit': {
    role: 'Sole author — benchmark harness, profiling method, optimisation decisions, QA pass',
    ownership: 'Personal project',
    status: 'Complete',
    responsibilities: [
      'Built a reproducible 1440p benchmark harness with a hard resolution assertion',
      'Profiled the frame with CsvProfiler and identified the real bottleneck',
      'Ran controlled A/B iterations with interleaved control runs to cancel machine drift',
      'Reverted two changes the measurements showed were regressions',
      'Ran a QA regression pass over the engine logs and reported the missed target',
    ],
    assetSources:
      "Scene is “Stylized Windmill Valley Environment” by StylArts (Fab, Standard License), acquired through Fab’s free-for-the-month giveaway — none of the art is mine and none of it was modified. The harness, method and analysis are mine.",
  },
  'layered-material-system': {
    role: 'Sole author — master material, layer set, ID-mask logic, exposed parameter interface',
    ownership: 'Personal technical study',
    status: 'Complete',
    responsibilities: [
      'Built a master material blending several material layers',
      'Drove per-region assignment from an ID mask',
      'Exposed tint, roughness, metallic and static-switch wear controls',
      'Channel-packed masks against shared tiling textures',
    ],
    assetSources: 'Material graph and layer set authored by me.',
  },
  'time-of-day-system': {
    role: 'Technical artist — lighting pipeline, C++ tooling, optimisation',
    ownership: 'Personal project',
    status: 'Complete',
    responsibilities: [
      'Converted a baked level to fully dynamic Lumen (DX12/SM6, Virtual Shadow Maps)',
      'Wrote the C++ Time of Day controller and its preset struct',
      'Authored and tuned the Day and Night lighting presets',
      'Cut dynamic shadow casters from 143 to 11',
    ],
    assetSources:
      'The environment is “Dreamscape: Stylized Environment Tower” by Polyart Studio (Fab), used as-is — models, materials and level layout are theirs. The lighting conversion, the C++ system, both presets and the optimisation are mine.',
  },
  'reactor-access-hatch': {
    role: 'Sole artist — hard-surface modelling, decals, materials',
    ownership: 'Personal project',
    status: 'Complete',
    responsibilities: ['Modelled the pressure-door silhouette', 'Authored custom signage decals'],
    assetSources: 'Authored by me.',
  },
  'arc-04-fusion-cell': {
    role: 'Sole artist — hard-surface modelling, weighted normals, emissive workflow',
    ownership: 'Personal project',
    status: 'Complete',
    responsibilities: ['Modelled to a real-time-friendly poly budget', 'Authored the layered emissive map'],
    assetSources: 'Authored by me.',
  },
  'gilded-relic': {
    role: 'Sole artist — sculpting, materials, lookdev',
    ownership: 'Personal project',
    status: 'Complete',
    responsibilities: [
      'Sculpted the blade, filigree and gemstone settings in ZBrush',
      'Authored the tri-metal material definition and refractive gems',
    ],
    assetSources: 'Authored by me.',
  },
  'industrial-lpg-cylinder': {
    role: 'Sole artist — modelling, material authoring, rendering',
    ownership: 'Study',
    status: 'Complete',
    responsibilities: [
      'Modelled the cylinder and valve assembly',
      'Authored the layered oxidation, grime and stencil wear',
    ],
    assetSources: 'Authored by me.',
  },
  "travellers-trio": {
    role: 'Sole artist — modelling, materials, studio lighting',
    ownership: 'Study',
    status: 'Complete',
    responsibilities: [
      'Modelled the hard-shell luggage set with subdivision surfaces',
      'Authored the orange-peel polycarbonate finish and the studio lighting',
    ],
    assetSources: 'Authored by me.',
  },
  bmo: {
    role: 'Sole artist — modelling, UVs, baking, rendering',
    ownership: 'Personal project (fan art)',
    status: 'Complete',
    responsibilities: [
      'Built the model to a 7,500-triangle budget',
      'Baked and rendered in Marmoset Toolbag',
    ],
    assetSources:
      'Character design by Pendleton Ward / Cartoon Network. Model, textures and render by me.',
  },
};

/**
 * The evidence ledger.
 *
 * Almost everything here is `awaiting-owner`, and that is the honest state: the
 * portfolio currently makes no numeric claims because none have been measured.
 * `howToCapture` exists so each gap is a ten-minute task rather than a vague ask.
 */
export const projectEvidence: Record<string, EvidenceItem[]> = {
  'time-of-day-system': [
    {
      label: 'Dynamic shadow casters',
      value: '143 → 11',
      status: 'verified',
      source:
        'Counted in-editor across all light components before and after the candle-Blueprint shadow fix; recorded in the project handover doc.',
      better: 'lower',
    },
    {
      label: 'Baked lighting data removed',
      value: '1.1 GB',
      status: 'verified',
      source: 'Size of DemoMap_BuiltData.uasset, moved out of the content directory.',
    },
    {
      label: 'Lights converted to Movable',
      value: '49 standalone + 264 in Blueprints',
      status: 'verified',
      source: 'Enumerated in-editor: 34 Point, 12 Rect, 3 Spot, plus 2 per candle across 132 instances.',
    },
    {
      label: 'Frame time, before and after',
      status: 'awaiting-owner',
      howToCapture:
        'UE5: `stat unit` in PIE at a fixed camera, Cinematic scalability, before and after the shadow-caster fix. The optimisation is currently supported by a shadow-caster count, not a measured frame time.',
    },
  ],
  // The first project on this site to carry measured numbers. Every value below
  // was produced by the audit's own tooling and read out of a committed file —
  // none is quoted from memory. `source` names the file in each case.
  'performance-audit': [
    {
      label: 'Average FPS',
      value: '32.99 → 44.37 (+34.7%)',
      status: 'verified',
      source: 'Mean of 5 cameras, definitive interleaved A/B — Iteration_16_definitive/definitive_summary.csv',
      better: 'higher',
    },
    {
      label: 'Frame time',
      value: '30.45 → 22.60 ms',
      status: 'verified',
      source: 'CsvProfiler, 2400-frame captures at 2560×1440 native',
      better: 'lower',
    },
    {
      label: 'GPU time',
      value: '29.60 → 21.76 ms',
      status: 'verified',
      source: 'CsvProfiler GPU stats, same runs',
      better: 'lower',
    },
    {
      label: '1% low FPS',
      value: '31.87 → 41.91',
      status: 'verified',
      source: '99th-percentile frame time from the same captures',
      better: 'higher',
    },
    {
      label: 'VRAM',
      value: '4 327 → 3 790 MB',
      status: 'verified',
      source: 'Windows GPU Process Memory counter, cross-checked against the engine’s own stat unit readout',
      better: 'lower',
    },
    {
      label: 'Test conditions',
      value: '2560×1440 native, Epic scalability, RTX 3060',
      status: 'verified',
      source: 'Asserted per run: client area checked before any measurement was recorded',
    },
    {
      label: 'Target',
      value: '90 FPS — not reached',
      status: 'verified',
      source: 'Stated goal was an 11.1 ms frame; the pass ended at 22.60 ms',
    },
  ],

  'maintenance-hangar': [
    {
      label: 'Trim sheet',
      value: 'Single 4K sheet',
      status: 'verified',
      source: "Owner's published ArtStation breakdown",
    },
    {
      label: 'Material IDs',
      value: 'One across the environment',
      status: 'verified',
      source: "Owner's published ArtStation breakdown",
    },
    {
      label: 'Triangle count',
      status: 'awaiting-owner',
      howToCapture: 'UE5: Window → Statistics → Primitive Stats. Record total tris for the hangar level.',
    },
    {
      label: 'Draw calls',
      status: 'awaiting-owner',
      howToCapture: 'Console: `stat RHI`. Record DrawPrimitive calls, and state the resolution and GPU.',
    },
    {
      label: 'Frame time',
      status: 'awaiting-owner',
      howToCapture: 'Console: `stat unit`. Record Frame / Game / Draw / GPU in ms at a stated resolution and GPU.',
    },
    {
      label: 'Optimisation before/after',
      status: 'awaiting-owner',
      howToCapture:
        'Capture `stat unit` and `stat RHI` before and after the instancing/trim pass. Two screenshots is enough.',
    },
  ],

  'layered-material-system': [
    {
      label: 'Shader instructions',
      value: '152 base pass, 119 vertex',
      status: 'verified',
      source: 'MM_BaseLayer Material Editor Stats panel, read off the material-04 capture',
    },
    {
      label: 'Texture sets replaced',
      status: 'awaiting-owner',
      howToCapture: 'Count unique texture sets the environment needed before the layered system, and after.',
    },
    {
      label: 'Texture memory',
      status: 'awaiting-owner',
      howToCapture: 'Window → Statistics → Texture Stats. Record total texture memory before and after.',
    },
    {
      label: 'Shader complexity view',
      status: 'awaiting-owner',
      howToCapture: 'Viewport → View Mode → Shader Complexity. Screenshot with the legend visible.',
    },
  ],

 };

/** True when a fact is safe to publish. */
export function isPublishable(item: EvidenceItem): boolean {
  return item.status === 'verified' && Boolean(item.value);
}

export function publishableEvidence(slug: string): EvidenceItem[] {
  return (projectEvidence[slug] ?? []).filter(isPublishable);
}

export function pendingEvidence(slug: string): EvidenceItem[] {
  return (projectEvidence[slug] ?? []).filter((item) => !isPublishable(item));
}

/** Every outstanding request across all projects — used by `npm run evidence`. */
export function allPendingEvidence(): { slug: string; item: EvidenceItem }[] {
  return Object.entries(projectEvidence).flatMap(([slug, items]) =>
    items.filter((item) => !isPublishable(item)).map((item) => ({ slug, item })),
  );
}
