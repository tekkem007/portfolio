import { getMedia } from '../lib/media';
import { href } from '../lib/router';
import type { VideoRef } from '../content/types';

/**
 * Self-hosted case-study clip.
 *
 * Design notes, all deliberate:
 *
 * - **Native `<video controls>`, no custom player.** The browser's own controls
 *   are keyboard-operable, screen-reader labelled and familiar. A bespoke player
 *   would have to re-earn all of that.
 * - **`preload="none"` with a poster.** The clip is 2.4 MB. Nobody should pay
 *   for it while scrolling past; the poster is an image they already have.
 * - **No autoplay.** The file carries an audio track, so autoplaying it would be
 *   intrusive, and autoplay also fights `prefers-reduced-motion`. Playback is
 *   always a deliberate act by the visitor.
 * - **`playsInline`** stops iOS Safari hijacking into fullscreen.
 *
 * The description is rendered as visible caption text, which doubles as the
 * accessible description — so the clip's content is available to someone who
 * cannot or does not want to play it.
 */
export function VideoClip({ video }: { video: VideoRef }) {
  const poster = getMedia(video.poster);

  return (
    <figure className="clip" data-reveal="">
      <div className="clip__frame">
        <video
          className="clip__video"
          controls
          preload="none"
          playsInline
          width={video.width}
          height={video.height}
          poster={poster?.fallback}
          aria-label={video.description}
        >
          <source src={href(`/media/${video.id}.mp4`)} type="video/mp4" />
          {/* Shown only if the browser cannot play MP4 at all. */}
          <p>
            Your browser cannot play this video.{' '}
            <a href={href(`/media/${video.id}.mp4`)} download>
              Download the clip
            </a>{' '}
            instead.
          </p>
        </video>
      </div>
      <figcaption>{video.caption ?? video.description}</figcaption>
    </figure>
  );
}
