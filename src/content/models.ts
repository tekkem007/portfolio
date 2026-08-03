/**
 * 3D model manifest.
 *
 * This file is the ONLY place a model is configured. Adding, replacing or
 * removing a model means editing this array — never a component. See
 * MODEL_GUIDE.md for the Blender export steps and the field-by-field reference.
 *
 * Publication rule
 * ----------------
 * Entries marked `status: 'placeholder'` are pipeline scaffolding, not artwork.
 * `publishedModels` filters them out of production builds, so generated stand-in
 * geometry can never appear on the live portfolio and be mistaken for Vishnu's
 * work. They still render during `npm run dev` so the pipeline stays testable.
 */

export type QualityTier = 'high' | 'medium' | 'low';

/** Named lighting rigs, matching the site's two-accent design language. */
export type LightingPreset =
  /** Warm key + cool fill — the "real-time worlds" identity. */
  | 'worlds'
  /** Cool key + neutral fill — the "intelligent systems" identity. */
  | 'systems'
  /** Neutral three-point, for product-style prop shots. */
  | 'studio';

export type Interaction =
  /** Drag to orbit. Wheel is deliberately NOT bound, so page scroll never fights the model. */
  | 'orbit'
  /** Slow automatic rotation, no input. */
  | 'turntable'
  /** Fixed camera. */
  | 'static';

export interface ModelHotspot {
  id: string;
  /** Short visible label. */
  label: string;
  /** Sentence explaining what this part demonstrates. */
  description: string;
  /** Local-space anchor point on the model. */
  position: [number, number, number];
}

export interface ModelTransform {
  position?: [number, number, number];
  /** Degrees, applied around Y. Use this to correct export orientation. */
  rotationY?: number;
  /** Uniform scale. Prefer fixing scale in Blender; this is an escape hatch. */
  scale?: number;
}

export interface ModelCamera {
  /** Horizontal angle in degrees; 0 looks along +Z. */
  azimuth?: number;
  /** Vertical angle in degrees above the horizon. */
  elevation?: number;
  /**
   * Distance as a multiple of the model's bounding sphere radius.
   * 2.2 frames the subject with comfortable margin; lower crops in.
   */
  distance?: number;
  /** Look-at point in local space. Defaults to the bounding-box centre. */
  target?: [number, number, number];
}

export interface ModelEntry {
  id: string;
  /** `placeholder` entries never ship to production. */
  status: 'placeholder' | 'final';
  /** Heading shown beside the viewer. */
  title: string;
  /**
   * Accessible description. This is the text equivalent of the model and is
   * REQUIRED — the canvas itself conveys nothing to assistive technology.
   */
  description: string;
  /** Path under public/, without the base prefix. */
  src: string;
  /**
   * Media-manifest id used as the poster and as the no-WebGL fallback.
   * Strongly recommended: without it, unsupported devices get nothing.
   */
  fallbackImage?: string;
  /** Case-study slug this model belongs to. */
  projectSlug?: string;
  transform?: ModelTransform;
  camera?: ModelCamera;
  lighting: LightingPreset;
  interaction: Interaction;
  hotspots?: ModelHotspot[];
  /** Attribution, if the asset is not wholly the owner's work. */
  credits?: string;
  /** Expected transfer size; used by `npm run models:check` to catch bloat. */
  budgetKb?: number;
}

export const models: ModelEntry[] = [
  {
    id: 'placeholder-panel',
    status: 'placeholder',
    title: 'Modular panel (placeholder geometry)',
    description:
      'Placeholder geometry used to verify the model pipeline: a modular wall panel with a recessed centre band and four corner bolts. This is generated stand-in geometry, not portfolio artwork.',
    src: '/models/placeholder-panel.glb',
    // Real project still, so a no-WebGL device sees the environment rather than
    // an empty frame. Replace alongside the model.
    fallbackImage: 'hangar-03',
    projectSlug: 'maintenance-hangar',
    transform: { rotationY: -18 },
    camera: { azimuth: 28, elevation: 14, distance: 2.4 },
    lighting: 'worlds',
    interaction: 'orbit',
    hotspots: [
      {
        id: 'trim',
        label: 'Trim band',
        description: 'Recessed band — the region that would be unwrapped to a trim-sheet strip.',
        position: [0, 1.5, 0.12],
      },
      {
        id: 'bolt',
        label: 'Corner fixing',
        description: 'Repeated fixing detail, shared across every piece in a modular kit.',
        position: [0.82, 2.72, 0.16],
      },
    ],
    budgetKb: 64,
  },
];

/**
 * Models eligible for the current build.
 *
 * Placeholders survive only in development, so the deployed site never shows
 * generated geometry alongside real work.
 */
export const publishedModels: ModelEntry[] = models.filter(
  (model) => model.status === 'final' || import.meta.env.DEV,
);

export function getModelForProject(slug: string): ModelEntry | undefined {
  return publishedModels.find((model) => model.projectSlug === slug);
}
