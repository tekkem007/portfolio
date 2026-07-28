import type { Role } from './types';

/**
 * Work history — verbatim in substance from the July 2026 résumé, lightly
 * rewritten for the web. Titles, organisations, locations and dates are exactly
 * as the résumé states them and must not be embellished.
 *
 * Note on employer work: by explicit instruction, the Unreal projects built at
 * Analyzer Tensor / Analyzer CAE are described in words only. No screenshots,
 * video, level names, product names or assets from that work appear anywhere in
 * this repository.
 */
export const roles: Role[] = [
  {
    title: '3D Team Lead',
    organisation: 'Analyzer Tensor Technologies',
    location: 'Pune, Maharashtra, India',
    period: 'Apr 2026 — Present',
    current: true,
    points: [
      'Promoted and transferred from Analyzer CAE Solutions after the department spun out into a new company.',
      'Lead 3D environment production, team coordination and real-time workflow execution.',
      'Own scene lighting, optimisation and draw-call reduction, plus basic Blueprint support in Unreal Engine.',
      'Manage asset quality, workflow alignment and consistency of output across the team.',
    ],
  },
  {
    title: '3D Environment Artist',
    organisation: 'Analyzer CAE Solutions Pvt. Ltd.',
    location: 'Pune, Maharashtra, India',
    period: 'Jun 2024 — Mar 2026',
    points: [
      'Created stylised low-poly environment assets in Blender with PBR texturing in Substance 3D Painter.',
      'Lit scenes in Unreal Engine 5 using both Lumen and baked workflows.',
      'Optimised environments with virtual textures, trim sheets, shaders and draw-call reduction techniques.',
      'Built basic Blueprints for simple interactions and workflow needs.',
    ],
  },
  {
    title: '3D Artist',
    organisation: 'Aswaforce Pvt. Ltd.',
    location: 'Mehsana, Gujarat, India',
    period: 'Jul 2022 — Oct 2023',
    points: [
      'Created 3D models and textures for gaming, VR and architectural visualisation.',
      'Worked across 3ds Max, Maya, Blender, the Substance tools, V-Ray, Arnold and ZBrush.',
      'Collaborated with teams to integrate assets into final deliverables.',
    ],
  },
  {
    title: 'Freelance 3D Artist',
    organisation: 'Independent',
    location: 'Remote',
    period: 'May 2021 — Mar 2022',
    points: [
      'Created mid-poly models and textures for product advertising.',
      'Applied PBR workflow principles and baking methods for high-detail results.',
    ],
  },
  {
    title: 'EDGE Trainer',
    organisation: 'Tata ClassEdge / The Radiant Way School',
    location: 'Raipur, Chhattisgarh, India',
    period: 'Feb 2020 — Mar 2021',
    points: [
      'Maintained Linux-based Tata ClassEdge systems.',
      'Assisted teachers with platform usage and technical guidance.',
      'Ran regular teacher training sessions.',
    ],
  },
];

/**
 * What the leadership role actually involves, stated without inflation.
 * Drawn from the résumé's 3D Team Lead bullets and Core Highlights.
 */
export const leadership = {
  heading: 'Leading a 3D team',
  body: [
    'Leading 3D production is mostly about consistency. The work is setting the workflow, reviewing asset quality before it reaches the engine, and keeping output aligned as more hands touch the same scenes.',
    'The technical half of the role is scene lighting, optimisation and draw-call reduction — the decisions that determine whether an environment holds its frame budget — plus basic Blueprint support where the art pipeline needs it.',
  ],
  facts: [
    { label: 'Current role', value: '3D Team Lead, Analyzer Tensor Technologies' },
    { label: 'Since', value: 'April 2026' },
    { label: 'Route in', value: 'Promoted from 3D Environment Artist' },
    { label: 'Based in', value: 'Pune, Maharashtra, India' },
  ],
} as const;
