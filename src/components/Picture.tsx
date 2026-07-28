import { getMedia } from '../lib/media';

/**
 * `sizes` for media that follows --media-max (covers, galleries, flagship art).
 *
 * These mirror the ultrawide steps in tokens.css. Getting them wrong is not
 * cosmetic: the browser picks a source from this hint before layout, so an
 * under-stated width silently serves a small file that then gets upscaled.
 */
export const MEDIA_SIZES =
  '(min-width: 150rem) 132rem, (min-width: 130rem) 118rem, (min-width: 100rem) 100rem, (min-width: 78rem) 78rem, 100vw';

interface PictureProps {
  /** Key into the generated media manifest. */
  id: string;
  /** Overrides the manifest alt text where the context needs something different. */
  alt?: string;
  /** `sizes` attribute — tells the browser how wide the image renders. */
  sizes?: string;
  /** The hero image of a page should not be lazy-loaded. */
  priority?: boolean;
  className?: string;
}

/**
 * Responsive image.
 *
 * Emits AVIF, then WebP, then a baseline JPEG, always with explicit intrinsic
 * width/height so nothing shifts as images arrive. If the id is unknown the
 * component renders nothing at all, which is the correct behaviour for optional
 * media that has not been generated yet.
 */
export function Picture({ id, alt, sizes = '100vw', priority = false, className }: PictureProps) {
  const media = getMedia(id);
  if (!media) return null;

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={media.avif} sizes={sizes} />
      <source type="image/webp" srcSet={media.webp} sizes={sizes} />
      <img
        src={media.fallback}
        alt={alt ?? media.alt}
        width={media.width}
        height={media.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </picture>
  );
}
