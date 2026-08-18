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

/**
 * Which recruiter track a piece of work is shown on.
 *
 * Separate from `Domain`, which is a visual-system concept. This one is about
 * who the work is being shown to: a technical-art reviewer and an environment-art
 * reviewer screen for different evidence, and most projects are strong evidence
 * for exactly one of them. Membership and per-track ordering live in
 * `projectEvidence.ts` so hiring-value decisions stay in one reviewable file.
 */
export type Track = 'technical-art' | 'environment-art';

/** Which half of the design system a piece of work belongs to. */
export type Domain = 'worlds' | 'systems';

/**
 * Which filter an entry answers to in the unified environment/prop gallery.
 *
 * Two values, not one per label. The control offers All / Environments / Props,
 * and a material study of environment surfacing belongs under Environments even
 * though its own label says something more precise than "Environment".
 */
export type WorkGroup = 'environment' | 'prop';

export interface WorkCategory {
  /** Shown on the card. Describes the work accurately rather than flattening it. */
  label: string;
  group: WorkGroup;
}

/** Was this personal practice, employed work, freelance, or study? */
export type Ownership = 'personal' | 'professional' | 'freelance' | 'study';

/**
 * A single measurable, checkable fact about a project.
 *
 * This type exists to make "never invent a number" structural rather than a
 * promise. A fact reaches the public build **only** when `status` is
 * `'verified'` AND `value` is set. Anything else is an outstanding request:
 * visible during `npm run dev` as an authoring checklist, invisible in
 * production, and impossible to publish by accident.
 *
 * Triangle counts, frame times, draw calls, team sizes, shipped titles and
 * percentages must all come through here.
 */
export interface EvidenceItem {
  label: string;
  /** Only ever set from data the owner supplied or a file that was measured. */
  value?: string;
  status: 'verified' | 'awaiting-owner';
  /** Exactly how to capture it, so the request is actionable rather than vague. */
  howToCapture?: string;
  /** Where a verified value came from — a file, a capture, or the owner. */
  source?: string;
}

/** Scannable header facts a recruiter reads before any prose. */
export interface ProjectSpec {
  /** What the candidate personally did. */
  role: string;
  /** Personal / professional / freelance / study, stated plainly. */
  ownership: string;
  /** Shipped, ongoing, work in progress, study. */
  status: string;
  /** Concrete responsibilities, not adjectives. */
  responsibilities: string[];
  /**
   * Where the assets came from. Required on every project — ownership ambiguity
   * is the fastest way to lose a reviewer's trust.
   */
  assetSources: string;
}

/**
 * Store-page facts for playable work.
 *
 * Present only on a project that is published as something you can run, where
 * "which software built it" is not the fact a reviewer is looking for. Every
 * value is restated from the project's own public store page — none of it is
 * inferred here, and none of it comes from the private source project.
 */
export interface ReleaseFacts {
  /** The store page's own genre classification. */
  genre: string;
  /** What it runs on, as the store page states it. */
  platform: string;
  /** Development status, as the store page states it. */
  status: string;
  /**
   * The store page's AI-generation disclosure, restated rather than softened.
   * Required whenever the store page carries one: dropping it on the way to the
   * portfolio would be a material omission, not a stylistic choice.
   */
  aiDisclosure: string;
}

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
  /** Full button label on a case-study page. Defaults to 'View on ArtStation'. */
  externalLabel?: string;
  /**
   * Short call-to-action on a work-grid card — 'ArtStation', 'Play on itch.io'.
   * Defaults to 'ArtStation', which is where every art piece is published; set
   * it explicitly for anything that lives somewhere else.
   */
  externalCta?: string;
  /**
   * Ranking for the work grid. Lower sorts first. Set by hiring value — the
   * strongest Unreal environment and technical-art evidence leads.
   * Supplied by `projectRank` in `projectEvidence.ts`.
   */
  rank?: number;
  /**
   * Older work kept for completeness but shown in a collapsed "Earlier work"
   * list, so a 2022 study cannot sit beside 2026 work and set the standard.
   */
  archived?: boolean;
  /**
   * Category and filter group for the unified gallery. Supplied by
   * `projectCategories` in `projectEvidence.ts`; absent on projects that are
   * only shown on the technical track, which has no gallery.
   */
  category?: WorkCategory;
  /** Scannable header facts. Required on published projects. */
  spec?: ProjectSpec;
  /** Store-page facts. Present only on work that is published as playable. */
  release?: ReleaseFacts;
  /**
   * Measurable facts. Only verified entries render publicly.
   * Named `facts` to avoid colliding with `evidence`, which classifies the
   * project's *prose* as verified or inferred.
   */
  facts?: EvidenceItem[];
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
