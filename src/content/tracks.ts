import type { Track } from './types';
import { trackRank } from './projectEvidence';

/**
 * The two recruiter tracks.
 *
 * A hiring reviewer screens for one role, not for a person's whole range. A
 * single blended feed forces them to do the sorting; these two paths do it for
 * them, and each one leads with the evidence that role actually screens on.
 *
 * Only the emphasis changes between tracks — the headline, the standfirst, the
 * featured skills and the project order. The underlying facts, the experience
 * and the contact routes are shared, because they are the same person and the
 * same résumé. Nothing here restates a claim that is not already evidenced in
 * `profile.ts`, `capabilities.ts` or a case study on this site.
 */

export interface TrackDef {
  id: Track;
  /** Palette this track renders in. */
  theme: 'system' | 'world';
  /** The identity line on the split entry page. */
  banner: string;
  /** Role family, spelled out under the banner. */
  roleLine: string;
  /** One sentence of what the role does, for the entry page. */
  tagline: string;
  /** App path, always with a trailing slash. */
  path: string;
  /** Card title on the landing page and the label in the switcher. */
  label: string;
  /** Second line on the card — the role family in plain words. */
  sublabel: string;
  /** Eyebrow above the hero headline. */
  eyebrow: string;
  /** Hero headline for this track. Names the role, the engine and the specialism. */
  headline: string;
  /** Supporting paragraph under the headline. */
  standfirst: string;
  /** Chips under the hero: the tools a reviewer scans for. */
  tools: string[];
  /** Bullets on the landing-page selection card. */
  bullets: string[];
  /** Heading for this track's flagship grid. */
  workHeading: string;
  /** Intro paragraph for the flagship grid. */
  workIntro: string;
  /** Heading for the supporting grid. */
  supportingHeading: string;
  supportingIntro: string;
  /**
   * Present on a track whose work is shown as one unified gallery instead of a
   * flagship grid plus a supporting grid.
   *
   * The environment track uses it because splitting environments from props
   * made the props read as leftovers, when in practice they are the same body
   * of work at a different scale. The technical track keeps the two-grid layout:
   * there, a case study and a published tool are genuinely different kinds of
   * evidence and a reviewer reads them differently.
   */
  gallery?: {
    heading: string;
    intro: string;
    /** Media id for the hero establishing shot. Must exist in the manifest. */
    hero: string;
    /** Short caption naming what the establishing shot actually is. */
    heroCaption: string;
  };
  /**
   * Present on a track presented as a systems workspace rather than a gallery.
   *
   * The technical track uses it: its work is shown as one section of
   * problem-system-result cards, its hero runs a real project scene through the
   * states the engine can show it in, and its primary call to action is the
   * case studies rather than the contact form, because that is what a technical
   * reviewer opens first.
   */
  lab?: {
    heading: string;
    intro: string;
    /** Label on the primary hero action. */
    cta: string;
    /** Ownership line for the hero scene. Non-negotiable: the art is not his. */
    heroCredit: string;
  };
  /** Which capability groups lead on this track, by heading. */
  leadCapabilities: string[];
  seo: { title: string; description: string };
}

export const tracks: Record<Track, TrackDef> = {
  'technical-art': {
    id: 'technical-art',
    theme: 'system',
    banner: 'Build the System',
    roleLine: 'Technical Artist & Game Engine Artist',
    tagline: 'Building efficient real-time environments, materials and workflows in Unreal Engine.',
    path: '/technical-art/',
    label: 'Technical Artist',
    sublabel: 'Game Engine Artist',
    eyebrow: 'Technical Art · Unreal Engine 5',
    headline: 'I keep Unreal Engine scenes inside their frame budget — and I measure what they cost.',
    standfirst:
      'Profiling and optimisation, lighting-pipeline conversions, layered material systems other artists can drive, and small C++ and Blueprint tools that take repetitive steps out of the art pipeline. Most recently a measured 34.7% GPU frame-time reduction at native 1440p, and a baked-to-Lumen conversion that cut a level from 143 dynamic shadow casters to 11.',
    tools: ['Unreal Engine 5', 'C++ & Blueprints', 'CsvProfiler', 'Substance 3D Painter'],
    bullets: [
      'Unreal Engine 5 production',
      'Materials, shaders & layered material systems',
      'Blueprints, C++ tooling & pipeline automation',
      'GPU profiling & frame-budget analysis',
      'Lumen, baked lighting & Virtual Shadow Maps',
      'Modular systems & efficient scene construction',
    ],
    lab: {
      heading: 'Selected Technical Art & Real-Time Work',
      intro:
        'Four systems and one playable prototype, each stated as the problem it addresses, the thing built to address it, and what that measurably changed. Where a number has not been captured yet, the card says so rather than rounding it off.',
      cta: 'View technical case studies',
      heroCredit:
        'Time of Day system — environment by Polyart Studio; the lighting conversion, presets and C++ controller are mine.',
    },
    workHeading: 'Systems, measured',
    workIntro:
      'Each of these has a full breakdown: the constraint, the decision I made, what it cost, and how I know. Where a project runs on assets I did not author, the case study says so in its first line — the art is a fixed variable and the technical work is the contribution.',
    supportingHeading: 'Tools and playable work',
    supportingIntro:
      'Smaller pieces that show implementation rather than art direction — a published Blender add-on, a playable browser prototype, and this site.',
    leadCapabilities: ['Unreal Engine 5', 'AI-assisted prototyping', 'Production & leadership', 'Environment art'],
    seo: {
      title: 'Vishnu Vardhan Tekkem — Technical Artist, Unreal Engine 5',
      description:
        'Technical art portfolio: GPU profiling and optimisation, baked-to-Lumen lighting conversions, layered material systems, and C++ and Blueprint tooling in Unreal Engine 5. Measured results, with the method shown.',
    },
  },

  'environment-art': {
    id: 'environment-art',
    theme: 'world',
    banner: 'Build the World',
    roleLine: '3D Environment Artist & 3D Artist',
    tagline: 'Creating atmospheric environments, believable assets and visually compelling real-time worlds.',
    path: '/environment-art/',
    label: '3D Environment Artist',
    sublabel: '3D Artist',
    eyebrow: 'Environment Art · Unreal Engine 5',
    headline: 'I build stylised environments and props, from blockout to final lighting.',
    standfirst:
      'Modular kits and hard-surface props modelled in Blender, textured in Substance 3D Painter, then assembled and lit in Unreal Engine 5. Trim sheets, channel-packed masks and texel-density discipline, because the constraints are where art direction and real-time budgets actually meet.',
    tools: ['Blender', 'Substance 3D Painter', 'Unreal Engine 5', 'ZBrush', 'Marmoset Toolbag'],
    bullets: [
      'Environment design & visual storytelling',
      'Modelling, sculpting & clean topology',
      'UVs, baking & PBR texturing',
      'Modular kits, trim sheets & reusable props',
      'Lighting, composition & mood',
      'Scene assembly, set dressing & scale',
    ],
    workHeading: 'Environments and assets',
    workIntro:
      'Modular environment work and the prop practice that feeds it. Every piece here is personal work, modelled and textured by me unless a breakdown states otherwise.',
    supportingHeading: 'Earlier studies',
    supportingIntro: 'Older practice pieces, kept for completeness.',
    gallery: {
      heading: 'Selected Environment & Prop Work',
      intro:
        'Environments, the modular kits and materials that build them, and the prop practice that feeds both — in one place, strongest first. Every piece is personal or study work, modelled and textured by me unless the card says otherwise.',
      hero: 'hangar-01',
      heroCaption: 'Maintenance Hangar — Unreal Engine 5, work in progress',
    },
    leadCapabilities: ['Environment art', 'Unreal Engine 5', 'Production & leadership', 'AI-assisted prototyping'],
    seo: {
      title: 'Vishnu Vardhan Tekkem — 3D Environment Artist, Unreal Engine 5',
      description:
        'Environment art portfolio: stylised and low-poly environments, modular kits, hard-surface props, PBR texturing and real-time lighting in Unreal Engine 5, Blender and Substance 3D Painter.',
    },
  },
};

export const trackList: TrackDef[] = [tracks['technical-art'], tracks['environment-art']];

/** Resolves an app path to a track, or null when the path is not a track page. */
export function trackForPath(path: string): TrackDef | null {
  return trackList.find((t) => t.path === path) ?? null;
}

/** The other track — used by the switcher. */
export function otherTrack(id: Track): TrackDef {
  return id === 'technical-art' ? tracks['environment-art'] : tracks['technical-art'];
}

/** The palette a track renders in. */
export function themeForTrack(id: Track): 'system' | 'world' {
  return tracks[id].theme;
}

/**
 * The palette a case study renders in.
 *
 * A project on both tracks resolves to the first, which is the same rule the
 * header uses for its back-link, so the theme and the navigation agree.
 */
export function themeForSlug(slug: string): 'system' | 'world' | null {
  const hit = trackList.find((t) => trackRank[t.id][slug] !== undefined);
  return hit ? themeForTrack(hit.id) : null;
}
