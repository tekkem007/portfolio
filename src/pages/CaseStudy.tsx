import { Picture, MEDIA_SIZES } from '../components/Picture';
import { CaseStudyRail, slugifyHeading } from '../components/CaseStudyRail';
import { Diagram } from '../components/Diagrams';
import { StudyScene } from '../components/StudyScene';
import { VideoClip } from '../components/VideoClip';
import { Link } from '../lib/router';
import { getProject, flagshipProjects } from '../content/projects';
import type { Project } from '../content/types';

const OWNERSHIP_LABEL: Record<Project['ownership'], string> = {
  personal: 'Personal project',
  professional: 'Professional work',
  freelance: 'Freelance',
  study: 'Study',
};

export function CaseStudy({ slug }: { slug: string }) {
  const project = getProject(slug);

  if (!project?.caseStudy) {
    return (
      <div className="shell notfound">
        <h1>Case study not found</h1>
        <p>That project does not have a written breakdown.</p>
        <Link className="btn" to="/">
          Back to the portfolio
        </Link>
      </div>
    );
  }

  const { caseStudy } = project;
  const others = flagshipProjects.filter((p) => p.slug !== project.slug);

  return (
    <>
      <section className="cs-hero" data-domain={project.domain}>
        <div className="shell cs-hero__inner">
          <Link className="backlink" to="/#work">
            <span aria-hidden="true">←</span> All work
          </Link>
          <p className="eyebrow">{OWNERSHIP_LABEL[project.ownership]}</p>
          <h1>{project.title}</h1>
          <p className="cs-hero__standfirst">{caseStudy.standfirst}</p>

          {/* Ownership is stated explicitly on every case study — a reviewer
              should never have to guess what was mine and what was a team's. */}
          <p className="ownership-note">
            <strong>Ownership:</strong> {caseStudy.contribution}
          </p>
        </div>
      </section>

      {/* The cover runs to media width: on a large display this is the first
          thing worth looking at, and it should not be letterboxed by the text
          column. */}
      <div className="shell shell--media cs-cover">
        <figure className="figure">
          <Picture id={project.cover} priority sizes={MEDIA_SIZES} />
        </figure>
      </div>

      <section className="section cs-body" data-domain={project.domain}>
        <div className="shell">
          <CaseStudyRail project={project} headings={caseStudy.sections.map((s) => s.heading)} />

          <div className="cs-content">
            <div className="prose">
              {caseStudy.sections.map((section) => (
                <section key={section.heading} id={slugifyHeading(section.heading)} data-reveal="">
                  <h2>{section.heading}</h2>
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              ))}
            </div>

            <Diagram slug={project.slug} />
          </div>
        </div>
      </section>

      <StudyScene project={project} />

      <section className="section" aria-labelledby="gallery-title" data-domain={project.domain}>
        <div className="shell shell--media">
          <div className="section-head">
            <p className="eyebrow">Gallery</p>
            <h2 id="gallery-title">The work</h2>
          </div>

          <div className="gallery">
            {caseStudy.video && <VideoClip video={caseStudy.video} />}
            {caseStudy.gallery.map((item) => (
              <figure className="figure" key={item.id} data-reveal="">
                <Picture id={item.id} sizes={MEDIA_SIZES} />
                {item.caption && <figcaption>{item.caption}</figcaption>}
              </figure>
            ))}
          </div>

          {project.externalUrl && (
            <p style={{ marginTop: 'var(--sp-6)' }}>
              <a className="btn" href={project.externalUrl} target="_blank" rel="noopener noreferrer">
                {project.externalLabel ?? 'View on ArtStation'} <span className="btn__arrow">↗</span>
              </a>
            </p>
          )}
        </div>
      </section>

      {others.length > 0 && (
        <section className="section" aria-labelledby="next-title">
          <div className="shell">
            <div className="section-head">
              <p className="eyebrow">Next</p>
              <h2 id="next-title">More breakdowns</h2>
            </div>
            <ul className="work-grid">
              {others.map((other) => (
                <li key={other.slug}>
                  <article className="card" data-domain={other.domain}>
                    <div className="card__media">
                      <Picture id={other.cover} sizes="(min-width: 46rem) 45vw, 100vw" />
                    </div>
                    <div className="card__body">
                      <h3 className="card__title">
                        <Link to={`/work/${other.slug}/`}>{other.title}</Link>
                      </h3>
                      <p className="card__summary">{other.summary}</p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
