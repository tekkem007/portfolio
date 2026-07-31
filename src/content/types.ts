/**
 * Content model for the portfolio.
 *
 * Editing guidance lives in README.md. The important rule encoded here is
 * `Evidence`: every project carries the source its claims come from, and only
 * `verified` material is written as an unconditional statement in the UI.
 */

/** Where a project's claims come from. */
export type Evidence =
  /** Published by Vishnu himself (ArtStation write-up, résumé, public repo). */
  | 'verified'
  /** Reasonable reading of verified material; phrased tentatively in the UI. */
  | 'inferred';

/** Which half of the design system a piece of work belongs to. */
export type Domain = 'worlds' | 'systems';

/** Was this personal practice, employed work, freelance, or study? */
export type Ownership = 'personal' | 'professional' | 'freelance' | 'study';

export interface MediaRef {
  /** Key into public/media/manifest.json. */
  id: string;
  /** Optional caption rendered beneath the image. */
  caption?: string;
}

export interface CaseStudySection {
  heading: string;
  body: string[];
}

export interface VideoRef {
  /** Basename in public/media, without the .mp4 extension. */
  id: string;
  /** Media-manifest id used as the poster frame. */
  poster: string;
  width: number;
  height: number;
  /** Rendered as the caption AND as the accessible description of the clip. */
  description: string;
  caption?: string;
}

export interface Project {
  slug: string;
  title: string;
  /** One sentence, used on cards and in meta descriptions. */
  summary: string;
  domain: Domain;
  ownership: Ownership;
  evidence: Evidence;
  /** Year or range shown on the card. */
  year: string;
  /** Software actually listed on the source post. */
  software: string[];
  /** Short technique tags. */
  tags: string[];
  /** Hero image id; must exist in the media manifest. */
  cover: string;
  /** Canonical external link, if the work is published somewhere. */
  externalUrl?: string;
  externalLabel?: string;
  /** Present only on flagship projects that get their own page. */
  caseStudy?: {
    /** Rendered as a short standfirst under the title. */
    standfirst: string;
    role: string;
    /** Explicit individual-vs-team statement. Required — no ambiguity allowed. */
    contribution: string;
    sections: CaseStudySection[];
    gallery: MediaRef[];
    /** Optional self-hosted clip, shown above the gallery. */
    video?: VideoRef;
  };
}

export interface Role {
  title: string;
  organisation: string;
  location: string;
  period: string;
  /** Most recent role first; drives the "current" badge. */
  current?: boolean;
  points: string[];
}

export interface CapabilityGroup {
  heading: string;
  domain: Domain;
  items: { label: string; detail?: string }[];
}
