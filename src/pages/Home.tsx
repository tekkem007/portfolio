import { href } from '../lib/router';
import { HeroScene } from '../components/HeroScene';
import { ProjectCard } from '../components/ProjectCard';
import { profile, education } from '../content/profile';
import { projects } from '../content/projects';
import { roles, leadership } from '../content/experience';
import { capabilities, familiarity, tools } from '../content/capabilities';

const flagships = projects.filter((p) => p.caseStudy);
const supporting = projects.filter((p) => !p.caseStudy);

export function Home() {
  return (
    <>
      <section className="hero" data-domain="worlds" aria-labelledby="hero-title">
        <HeroScene />
        <div className="shell hero__inner">
          <p className="eyebrow">{profile.role}</p>
          <h1 id="hero-title">{profile.headline}</h1>
          <p className="hero__standfirst">{profile.standfirst}</p>
          <div className="hero__meta">
            <span>{profile.location}</span>
            <span>Unreal Engine 5</span>
            <span>Blender</span>
            <span>Substance 3D Painter</span>
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

      {/* --- The two disciplines, stated plainly ------------------------- */}
      <section className="section section--tight" aria-labelledby="disciplines-title">
        <div className="shell shell--media">
          <h2 id="disciplines-title" className="visually-hidden">
            What I do
          </h2>
          <div className="duality">
            <div className="duality__pane" data-domain="worlds" data-reveal="">
              <p className="eyebrow">Real-time worlds</p>
              <h3>Environments that hold their budget</h3>
              <p>
                Modular kits, PBR texturing and Unreal Engine 5 lighting — built with trim sheets, virtual textures and
                draw-call reduction so the art survives contact with a frame budget.
              </p>
              <div className="duality__list">
                {['Modular kits', 'Lumen & baked lighting', 'Trim sheets', 'Draw-call reduction'].map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="duality__pane" data-domain="systems" data-reveal="">
              <p className="eyebrow">Intelligent systems</p>
              <h3>Systems that keep a team moving</h3>
              <p>
                Material systems other artists can drive, small pipeline tools that delete repetitive steps, and
                AI-assisted prototypes that put a concept in front of people quickly.
              </p>
              <div className="duality__list">
                {['Layered materials', 'ID masking', 'Pipeline tooling', 'AI-assisted prototyping'].map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Selected work ----------------------------------------------- */}
      <section className="section" id="work" aria-labelledby="work-title">
        <div className="shell shell--media">
          <div className="section-head">
            <p className="eyebrow">Selected work</p>
            <h2 id="work-title">Three projects, in depth</h2>
            <p>
              Each of these has a full breakdown: what the problem was, the decision I made, and what it cost. Everything
              below is personal work — my own from concept to final frame.
            </p>
          </div>

          <div className="work-grid">
            {flagships.map((project) => (
              <ProjectCard key={project.slug} project={project} flagship />
            ))}
          </div>
        </div>
      </section>

      {/* --- Supporting work --------------------------------------------- */}
      <section className="section" id="more-work" aria-labelledby="more-work-title">
        <div className="shell shell--media">
          <div className="section-head">
            <p className="eyebrow">Props & studies</p>
            <h2 id="more-work-title">Assets, materials and studies</h2>
            <p>
              Hard-surface props, weathering studies and product visualisation — the practice that feeds the
              environments. Each links to its full breakdown on ArtStation.
            </p>
          </div>

          <div className="work-grid">
            {supporting.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* --- Capabilities ------------------------------------------------ */}
      {/* A grid of short items rather than prose, so it takes the wider cap.
          Tools, About and Contact deliberately stay at --page-max: they are
          text-led, and widening them would cost readability for no gain. */}
      <section className="section" id="capabilities" aria-labelledby="capabilities-title">
        <div className="shell shell--media">
          <div className="section-head">
            <p className="eyebrow">Capabilities</p>
            <h2 id="capabilities-title">What I actually do</h2>
            <p>Listed at the depth I can defend in a portfolio review — nothing aspirational.</p>
          </div>

          <div className="cap-grid">
            {capabilities.map((group) => (
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
        </div>
      </section>

      {/* --- Tools ------------------------------------------------------- */}
      <section className="section" id="tools" aria-labelledby="tools-title" data-domain="systems">
        <div className="shell">
          <div className="section-head">
            <p className="eyebrow">Tools & software</p>
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

      {/* --- Experience -------------------------------------------------- */}
      <section className="section section--railed" id="experience" aria-labelledby="experience-title">
        <div className="shell">
          {/* On wide screens this holds the left edge while the roles scroll
              past it, so the reclaimed margin carries the section label. */}
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
