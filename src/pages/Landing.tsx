import { Link, href } from '../lib/router';
import { profile } from '../content/profile';
import { trackList } from '../content/tracks';
import { flagshipsForTrack } from '../content/projects';

/**
 * The entry page.
 *
 * A hiring reviewer arrives screening for one role. Asking which one, once, is
 * faster for them than making them filter a blended feed themselves — and it
 * means neither discipline has to be compressed into the other's page.
 *
 * Deliberately: no track is preselected, neither card is visually secondary, and
 * both are real links to real prerendered URLs, so a direct link or a refresh
 * lands correctly and the choice survives being shared.
 */
export function Landing() {
  return (
    <>
      <section className="landing" aria-labelledby="landing-title">
        <div className="shell landing__inner">
          <p className="eyebrow">{profile.location}</p>
          <h1 id="landing-title" className="landing__name">
            {profile.name}
          </h1>
          <p className="landing__intro">
            Unreal Engine artist working across environment art and technical art. Four-plus years in 3D, currently
            leading 3D production at Analyzer Tensor Technologies in Pune.
          </p>

          <h2 className="landing__question">What would you like to explore?</h2>

          <ul className="chooser">
            {trackList.map((track) => (
              <li key={track.id}>
                <Link className="chooser__card" to={track.path} data-track={track.id}>
                  <span className="chooser__label">{track.label}</span>
                  <span className="chooser__sublabel">{track.sublabel}</span>
                  <span className="chooser__bullets">
                    {track.bullets.map((bullet) => (
                      <span key={bullet}>{bullet}</span>
                    ))}
                  </span>
                  <span className="chooser__meta">
                    {flagshipsForTrack(track.id).length} case studies
                    <span className="chooser__arrow" aria-hidden="true">
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <p className="landing__note">
            Both paths share the same experience, résumé and contact details — only the work shown and the order it is
            shown in change. You can switch at any point from the header.
          </p>

          <div className="landing__actions">
            <a className="btn" href={href(profile.resume.path)} download={profile.resume.filename}>
              {profile.resume.label}
              <span className="btn__meta">{profile.resume.meta}</span>
            </a>
            <a className="btn" href={`mailto:${profile.email}`}>
              Email me
            </a>
            <a className="btn" href={profile.links.artstation} target="_blank" rel="noopener noreferrer">
              ArtStation <span className="btn__arrow">↗</span>
            </a>
            <a className="btn" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn <span className="btn__arrow">↗</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
