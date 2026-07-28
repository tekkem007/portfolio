import type { Project } from '../content/types';
import { Link } from '../lib/router';
import { Picture } from './Picture';

const OWNERSHIP_LABEL: Record<Project['ownership'], string> = {
  personal: 'Personal project',
  professional: 'Professional work',
  freelance: 'Freelance',
  study: 'Study',
};

export function ProjectCard({ project, flagship = false }: { project: Project; flagship?: boolean }) {
  const hasPage = Boolean(project.caseStudy);

  return (
    <article
      className={`card${flagship ? ' card--flagship' : ''}`}
      data-domain={project.domain}
      // The reveal script targets these; see lib/motion.ts.
      data-reveal=""
    >
      <div className="card__media">
        <Picture
          id={project.cover}
          priority={flagship}
          sizes={flagship ? '(min-width: 62rem) 55vw, 100vw' : '(min-width: 46rem) 45vw, 100vw'}
        />
      </div>

      <div className="card__body">
        <h3 className="card__title">
          {hasPage ? (
            <Link to={`/work/${project.slug}/`}>{project.title}</Link>
          ) : project.externalUrl ? (
            <a href={project.externalUrl} target="_blank" rel="noopener noreferrer">
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </h3>

        <p className="card__summary">{project.summary}</p>

        <div className="card__meta">
          <span className="ownership">
            {OWNERSHIP_LABEL[project.ownership]} · {project.year}
          </span>
        </div>

        <div className="card__tags">
          {project.software.map((item) => (
            <span className="tag" key={item}>
              {item}
            </span>
          ))}
        </div>

        {flagship && (
          <>
            <div className="card__tags">
              {project.tags.map((tag) => (
                <span className="tag tag--accent" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <span className="card__cta" aria-hidden="true">
              Read the case study <span className="btn__arrow">→</span>
            </span>
          </>
        )}

        {!flagship && project.externalUrl && (
          <span className="card__cta" aria-hidden="true">
            ArtStation <span className="btn__arrow">↗</span>
          </span>
        )}
      </div>
    </article>
  );
}
