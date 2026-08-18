import { href, Link } from '../lib/router';
import { HeroScene } from '../components/HeroScene';
import { SeaScene } from '../components/SeaScene';
import { ProjectCard } from '../components/ProjectCard';
import { profile, education } from '../content/profile';
import { archivedForTrack, flagshipsForTrack, supportingForTrack } from '../content/projects';
import { roles, leadership } from '../content/experience';
import { capabilities, familiarity, learning, tools } from '../content/capabilities';
import { tracks, otherTrack } from '../content/tracks';
import type { Track as TrackId } from '../content/types';

/**
 * One recruiter track.
 *
 * Both tracks render from this component, so the two paths cannot drift apart
 * structurally — only their content does. What changes per track: the hero copy,
 * which projects appear and in what order, the order of the capability groups,
 * and whether the tooling sections are shown at all. What stays shared:
 * experience, education, availability and contact, because those are the same
 * person either way.
 */
export function Track({ track }: { track: TrackId }) {
  const def = tracks[track];
  const other = otherTrack(track);
  const flagships = flagshipsForTrack(track);
  const supporting = supportingForTrack(track);
  const archived = archivedForTrack(track);

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

  return (
    <>
      <section className="hero" data-domain={track === 'technical-art' ? 'systems' : 'worlds'} aria-labelledby="hero-title">
        <HeroScene />
        <div className="shell hero__inner">
          <p className="eyebrow">{def.eyebrow}</p>
          <h1 id="hero-title">{def.headline}</h1>
          <p className="hero__standfirst">{def.standfirst}</p>
          <div className="hero__meta">
            <span>{profile.location}</span>
            {def.tools.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </div>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#work">
              Selected work <span className="btn__arrow">↓</span>
            </a>
            <a className="btn" href="#contact">
              Get in touch
            </a>
          </div>
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
      <section className="section" id="work" aria-labelledby="work-title">
        <div className="shell shell--media">
          <div className="section-head">
            <p className="eyebrow">Selected work</p>
            <h2 id="work-title">{def.workHeading}</h2>
            <p>{def.workIntro}</p>
          </div>

          <div className="work-grid">
            {flagships.map((project) => (
              <ProjectCard key={project.slug} project={project} flagship />
            ))}
          </div>
        </div>
      </section>

      {/* --- Experience -------------------------------------------------- */}
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

      {/* --- Supporting work --------------------------------------------- */}
      {(supporting.length > 0 || archived.length > 0) && (
        <section className="section" id="more-work" aria-labelledby="more-work-title">
          <div className="shell shell--media">
            <div className="section-head">
              <p className="eyebrow">{def.supportingHeading}</p>
              <h2 id="more-work-title">{def.supportingHeading}</h2>
              <p>{def.supportingIntro}</p>
            </div>

            <div className="work-grid">
              {supporting.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>

            {archived.length > 0 && (
              <details className="archive">
                <summary>Earlier work ({archived.length}) — 2022 studies</summary>
                <div className="archive__grid">
                  {archived.map((project) => (
                    <article className="archive__item" key={project.slug}>
                      <h3>
                        {project.externalUrl ? (
                          <a href={project.externalUrl} target="_blank" rel="noopener noreferrer">
                            {project.title}
                          </a>
                        ) : (
                          project.title
                        )}
                      </h3>
                      <p>
                        {project.year} · {project.software.join(', ')}
                      </p>
                    </article>
                  ))}
                </div>
              </details>
            )}
          </div>
        </section>
      )}

      {showToolSections && <SeaScene />}

      {/* --- Capabilities ------------------------------------------------ */}
      <section className="section" id="capabilities" aria-labelledby="capabilities-title">
        <div className="shell shell--media">
          <div className="section-head">
            <p className="eyebrow">Capabilities</p>
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

      {/* --- Tools ------------------------------------------------------- */}
      {showToolSections && (
        <section className="section" id="tools" aria-labelledby="tools-title" data-domain="systems">
          <div className="shell">
            <div className="section-head">
              <p className="eyebrow">Tools & software</p>
              <h2 id="tools-title">Small things I build to speed up the work</h2>
              <p>
                Public, inspectable, and modest by design. These are here as evidence of implementation capability, not
                as a claim to software engineering.
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
      )}

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
            <a
              className="btn btn--primary"
              href={href(profile.resume.path)}
              download={profile.resume.filename}
            >
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
