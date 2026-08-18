import { href, Link } from '../lib/router';
import { HeroScene } from '../components/HeroScene';
import { CinematicHero } from '../components/CinematicHero';
import { SystemHero } from '../components/SystemHero';
import { WorkGallery } from '../components/WorkGallery';
import { SystemGallery } from '../components/SystemGallery';
import { SeaScene } from '../components/SeaScene';
import { profile, education } from '../content/profile';
import { archivedForTrack, galleryForTrack } from '../content/projects';
import { roles, leadership } from '../content/experience';
import { capabilities, familiarity, learning, tools } from '../content/capabilities';
import { tracks, otherTrack } from '../content/tracks';
import type { Track as TrackId } from '../content/types';

/**
 * One recruiter track.
 *
 * Both tracks render from this component, so the two paths cannot drift apart
 * structurally — only their content and their presentation do. What changes per
 * track: the hero, how the work is shown, the order of the capability groups,
 * and whether the tooling sections appear at all. What stays shared: experience,
 * education, availability and contact, because those are the same person either
 * way.
 *
 * The two presentations are selected by which config a track carries rather
 * than by testing its id in a dozen places:
 *
 *   `gallery` — one collection of environments and props, shown as work.
 *   `lab`     — problem, system and result, shown as evidence.
 *
 * Section order differs between them deliberately. A reviewer screening for
 * environment art wants the work and then the person who made it; one screening
 * for technical art wants the systems, then the tooling, then the skills, and
 * reads employment history after all of it.
 */
export function Track({ track }: { track: TrackId }) {
  const def = tracks[track];
  const other = otherTrack(track);
  const archived = archivedForTrack(track);

  const gallery = def.gallery;
  const lab = def.lab;
  const work = galleryForTrack(track);

  // Capability groups reordered so the ones this reviewer screens on come
  // first. Nothing is hidden — a technical reviewer still sees the art skills,
  // just below the engine ones.
  const caps = [...capabilities].sort(
    (a, b) =>
      (def.leadCapabilities.indexOf(a.heading) + 1 || 99) - (def.leadCapabilities.indexOf(b.heading) + 1 || 99),
  );

  // The tooling and interactive sections are implementation evidence, which is
  // what the technical track is screened on. On the environment track they would
  // push the art further down the page for no gain.
  const showToolSections = track === 'technical-art';

  // --- Shared blocks -----------------------------------------------------
  //
  // Built once and placed by each ordering below, so the two tracks cannot end
  // up with two subtly different versions of the same section.

  const experienceSection = (
    <section className="section section--railed" id="experience" aria-labelledby="experience-title">
      <div className="shell">
        <div className="section-head">
          <p className="eyebrow">Experience</p>
          <h2 id="experience-title">{leadership.heading}</h2>
        </div>

        <div className="railed__body">
          <div className="railed__intro">
            {leadership.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <dl className="factgrid" data-domain="worlds">
            {leadership.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="timeline">
            {roles.map((role) => (
              <div className="timeline__row" key={`${role.title}-${role.period}`} data-reveal="">
                <div className="timeline__when">
                  {role.current && <span className="badge-now">Current</span>}
                  <span>{role.period}</span>
                  <span>{role.location}</span>
                </div>
                <div className="timeline__role">
                  <h3>{role.title}</h3>
                  <p className="timeline__org">{role.organisation}</p>
                  <ul className="timeline__points">
                    {role.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  const capabilitiesSection = (
    <section className="section" id="capabilities" aria-labelledby="capabilities-title">
      <div className="shell shell--media">
        <div className="section-head">
          <p className="eyebrow">{lab ? 'Technical skills' : 'Capabilities'}</p>
          <h2 id="capabilities-title">What I actually do</h2>
          <p>Listed at the depth I can defend in a portfolio review — nothing aspirational.</p>
        </div>

        <div className="cap-grid">
          {caps.map((group) => (
            <div className="cap" key={group.heading} data-domain={group.domain} data-reveal="">
              <h3>{group.heading}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item.label}>
                    <strong>{item.label}</strong>
                    {item.detail && <span>{item.detail}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="familiarity" data-domain="systems">
          <h3>{familiarity.heading}</h3>
          {familiarity.items.map((item) => (
            <p key={item.label}>
              <strong style={{ fontWeight: 500 }}>{item.label}</strong> — {item.detail}
            </p>
          ))}
          <p className="familiarity__note">{familiarity.note}</p>
        </div>

        <div className="familiarity" data-domain="systems">
          <h3>{learning.heading}</h3>
          {learning.items.map((item) => (
            <p key={item.label}>
              <strong style={{ fontWeight: 500 }}>{item.label}</strong> — {item.detail}
            </p>
          ))}
          <p className="familiarity__note">{learning.note}</p>
        </div>
      </div>
    </section>
  );

  const toolsSection = showToolSections ? (
    <section className="section" id="tools" aria-labelledby="tools-title" data-domain="systems">
      <div className="shell">
        <div className="section-head">
          <p className="eyebrow">Tools, Blueprints &amp; workflows</p>
          <h2 id="tools-title">Small things I build to speed up the work</h2>
          <p>
            Public, inspectable, and modest by design. These are here as evidence of implementation capability, not as
            a claim to software engineering.
          </p>
        </div>

        <div className="tool-grid">
          {tools.map((tool) => (
            <article className="tool" key={tool.name} data-reveal="">
              <h3>{tool.name}</h3>
              <p>{tool.summary}</p>
              <p className="tool__contribution">{tool.contribution}</p>
              <div className="card__tags">
                {tool.stack.map((s) => (
                  <span className="tag" key={s}>
                    {s}
                  </span>
                ))}
              </div>
              <a className="btn" href={tool.repo} target="_blank" rel="noopener noreferrer">
                View repository <span className="btn__arrow">↗</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  ) : null;

  return (
    <>
      <section
        className="hero"
        data-domain={track === 'technical-art' ? 'systems' : 'worlds'}
        data-cinema={gallery ? '' : undefined}
        data-lab={lab ? '' : undefined}
        aria-labelledby="hero-title"
      >
        {gallery ? <CinematicHero id={gallery.hero} caption={gallery.heroCaption} /> : null}
        {lab ? <div className="hero__rule" aria-hidden="true" /> : null}
        {!gallery && !lab ? <HeroScene /> : null}

        {/* The technical hero is two columns: the claim, and the scene that
            backs it. The environment hero is one column over an image. */}
        <div className={`shell hero__inner${lab ? ' hero__inner--split' : ''}`}>
          <div className={lab ? 'hero__copy' : undefined}>
          <p className="eyebrow">{lab ? def.banner : def.eyebrow}</p>
          <h1 id="hero-title">{def.headline}</h1>
          {lab && <p className="hero__role">{def.roleLine}</p>}
          <p className="hero__standfirst">{def.standfirst}</p>
          <div className="hero__meta">
            <span>{profile.location}</span>
            {def.tools.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </div>
          <div className="hero__actions">
            {lab ? (
              <>
                <a className="btn btn--primary" href="#work">
                  {lab.cta} <span className="btn__arrow">↓</span>
                </a>
                <a className="btn" href={href(profile.resume.path)} download={profile.resume.filename}>
                  {profile.resume.label}
                  <span className="btn__meta">{profile.resume.meta}</span>
                  <span className="btn__arrow btn__arrow--down" aria-hidden="true">
                    ↓
                  </span>
                </a>
              </>
            ) : (
              <>
                <a className="btn btn--primary" href="#work">
                  Selected work <span className="btn__arrow">↓</span>
                </a>
                <a className="btn" href="#contact">
                  Get in touch
                </a>
              </>
            )}
          </div>
          </div>

          {lab && <SystemHero credit={lab.heroCredit} />}
        </div>
      </section>

      {/* --- What this track covers -------------------------------------- */}
      <section className="section section--tight" aria-labelledby="focus-title">
        <div className="shell shell--media">
          <div className="section-head">
            <p className="eyebrow">{def.label}</p>
            <h2 id="focus-title">What this covers</h2>
          </div>
          <ul className="focus-list">
            {def.bullets.map((bullet) => (
              <li key={bullet} data-reveal="">
                {bullet}
              </li>
            ))}
          </ul>
          <p className="focus-switch">
            Screening for {other.label.toLowerCase()} work instead?{' '}
            <Link to={other.path}>See the {other.label.toLowerCase()} portfolio →</Link>
          </p>
        </div>
      </section>

      {/* --- Selected work ----------------------------------------------- */}
      {lab ? (
        <SystemGallery heading={lab.heading} intro={lab.intro} items={work} />
      ) : gallery ? (
        <WorkGallery heading={gallery.heading} intro={gallery.intro} items={work} archived={archived} />
      ) : null}

      {/* Technical: systems, then tooling, then skills, then history. */}
      {lab && toolsSection}
      {lab && showToolSections && <SeaScene />}
      {lab && capabilitiesSection}

      {experienceSection}

      {/* Environment: the work, then the person who made it. */}
      {!lab && capabilitiesSection}

      {/* --- About ------------------------------------------------------- */}
      <section className="section" id="about" aria-labelledby="about-title">
        <div className="shell about">
          <div className="about__body">
            <p className="eyebrow">About</p>
            <h2 id="about-title">{profile.name}</h2>
            {profile.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <aside className="about__aside">
            <div>
              <h3>Education</h3>
              <ul>
                {education.map((item) => (
                  <li key={item.qualification}>
                    <b>{item.qualification}</b>
                    <span>
                      {item.institution} · {item.year}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Based in</h3>
              <ul>
                <li>
                  <b>{profile.location}</b>
                  <span>Open to on-site, hybrid and remote</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* --- Contact ----------------------------------------------------- */}
      <section className="section" id="contact" aria-labelledby="contact-title" data-domain="systems">
        <div className="shell contact">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <p className="eyebrow">Contact</p>
            <h2 id="contact-title">Let's talk about the work</h2>
          </div>

          <p className="contact__availability">{profile.availability}</p>

          <a className="contact__mail" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>

          <div className="contact__links">
            <a className="btn btn--primary" href={href(profile.resume.path)} download={profile.resume.filename}>
              {profile.resume.label}
              <span className="btn__meta">{profile.resume.meta}</span>
              <span className="btn__arrow btn__arrow--down" aria-hidden="true">
                ↓
              </span>
            </a>
            <a className="btn" href={profile.links.artstation} target="_blank" rel="noopener noreferrer">
              ArtStation <span className="btn__arrow">↗</span>
            </a>
            <a className="btn" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn <span className="btn__arrow">↗</span>
            </a>
            <a className="btn" href={profile.links.github} target="_blank" rel="noopener noreferrer">
              GitHub <span className="btn__arrow">↗</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
