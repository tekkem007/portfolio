import manifest from '../content/media.generated.json';

/**
 * Media lookup backed by the build-time manifest written by
 * `scripts/optimise-media.mjs`.
 *
 * Every entry carries the real intrinsic dimensions of the source image, so
 * components can always emit width/height and reserve layout space before the
 * bytes arrive. Missing entries resolve to `null` rather than throwing — a
 * broken or not-yet-generated image degrades to no figure at all instead of
 * taking the page down.
 */

export interface MediaEntry {
  alt: string;
  width: number;
  height: number;
  aspect: number;
  fallback: string;
  avif: string;
  webp: string;
}

const MEDIA = manifest as Record<string, MediaEntry>;

/** Prefixes a manifest path with Vite's configured base. */
function withBase(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  return `${base.replace(/\/$/, '')}${path}`;
}

export function getMedia(id: string): MediaEntry | null {
  const entry = MEDIA[id];
  if (!entry) {
    if (import.meta.env.DEV) {
      console.warn(`[media] no manifest entry for "${id}" — run \`npm run media\``);
    }
    return null;
  }
  return {
    ...entry,
    fallback: withBase(entry.fallback),
    avif: entry.avif.replace(/\/media\//g, `${withBase('/media')}/`),
    webp: entry.webp.replace(/\/media\//g, `${withBase('/media')}/`),
  };
}

export function hasMedia(id: string): boolean {
  return id in MEDIA;
}
