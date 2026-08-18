import { useState } from 'react';
import { Link, href } from '../lib/router';
import { profile } from '../content/profile';
import { trackList } from '../content/tracks';
import { flagshipsForTrack } from '../content/projects';
import type { Track } from '../content/types';

/**
 * The split entry.
 *
 * Two full-height halves, each carrying its own palette, so the choice is made
 * by looking rather than by reading. Hover, focus or touch previews an identity;
 * the whole half is one link, so the target is enormous on every input device
 * and reachable in a single Tab from the skip link.
 *
 * Deliberately: neither side is preselected, neither is visually secondary, and
 * the preview only changes emphasis — both halves stay legible at all times, so
 * a keyboard user tabbing through never loses the side they are not on.
 */
export function Landing() {
  const [preview, setPreview] = useState<Track | null>(null);

  return (
    <section className="split" data-preview={preview ?? 'none'} aria-labelledby="landing-title">
      {/* The introduction sits above the seam. It is not inside either half, so
          it never reads as belonging to one identity more than the other. */}
      <div className="split__intro">
        <p className="split__name" id="landing-title">
          {profile.name}
        </p>
        <p className="split__claim">I build real-time systems and the worlds they bring to life.</p>
        <p className="split__prompt">Choose what you want to explore.</p>
      </div>

      <ul className="split__halves">
        {trackList.map((track) => (
          <li key={track.id} data-theme={track.theme}>
            <Link
              className="half"
              to={track.path}
              onMouseEnter={() => setPreview(track.id)}
              onMouseLeave={() => setPreview(null)}
              onFocus={() => setPreview(track.id)}
              onBlur={() => setPreview(null)}
              onTouchStart={() => setPreview(track.id)}
            >
              <span className="half__banner">{track.banner}</span>
              <span className="half__role">{track.roleLine}</span>
              <span className="half__tagline">{track.tagline}</span>

              <span className="half__bullets">
                {track.bullets.slice(0, 4).map((bullet) => (
                  <span key={bullet}>{bullet}</span>
                ))}
              </span>

              <span className="half__enter">
                {flagshipsForTrack(track.id).length} case studies
                <span className="half__arrow" aria-hidden="true">
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Contact routes live on the entry page too: a reviewer who already knows
          what they want should not have to enter a track to find the résumé. */}
      <div className="split__actions">
        <a className="btn" href={href(profile.resume.path)} download={profile.resume.filename}>
          {profile.resume.label}
          <span className="btn__meta">{profile.resume.meta}</span>
        </a>
        <a className="btn" href={`mailto:${profile.email}`}>
          Email
        </a>
        <a className="btn" href={profile.links.artstation} target="_blank" rel="noopener noreferrer">
          ArtStation <span className="btn__arrow">↗</span>
        </a>
        <a className="btn" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn <span className="btn__arrow">↗</span>
        </a>
      </div>
    </section>
  );
}
