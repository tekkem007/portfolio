import type { EvidenceItem, ProjectSpec } from './types';

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
    },
    {
      label: 'Frame time',
      value: '30.45 → 22.60 ms',
      status: 'verified',
      source: 'CsvProfiler, 2400-frame captures at 2560×1440 native',
    },
    {
      label: 'GPU time',
      value: '29.60 → 21.76 ms',
      status: 'verified',
      source: 'CsvProfiler GPU stats, same runs',
    },
    {
      label: '1% low FPS',
      value: '31.87 → 41.91',
      status: 'verified',
      source: '99th-percentile frame time from the same captures',
    },
    {
      label: 'VRAM',
      value: '4 327 → 3 790 MB',
      status: 'verified',
      source: 'Windows GPU Process Memory counter, cross-checked against the engine’s own stat unit readout',
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
      status: 'awaiting-owner',
      howToCapture:
        'Material Editor → Stats panel. Record base-pass instruction count, and again with the wear static switch on.',
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
