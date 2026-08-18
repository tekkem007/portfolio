import type { Project } from '../content/types';
import { systemBriefs } from '../content/systemBriefs';
import { diagnostics } from '../content/diagnostics';
import { Link } from '../lib/router';
import { Picture } from './Picture';
import { DiagnosticView } from './DiagnosticView';
import { MetricStrip } from './MetricStrip';

/**
 * One entry in "Selected Technical Art & Real-Time Work".
 *
 * The card answers a reviewer's four questions in the order they ask them:
 * what was the problem, what did you build, what did it cost, and can I see it.
 * That order is fixed across every card, so the page can be read down a column
 * rather than piece by piece.
 *
 * Two things are deliberately absent when the evidence is. A project with no
 * measured result shows no metric strip rather than an empty one, and a project
 * with no genuine diagnostic captures shows its cover image rather than a
 * control with one tab. Both absences are accurate and both are visible.
 */

const MEDIA_SIZES = '(min-width: 68rem) 46vw, 100vw';

export function SystemCard({ project, lead = false }: { project: Project; lead?: boolean }) {
  const brief = systemBriefs[project.slug];
  const diagnostic = diagnostics[project.slug];
  const verified = (project.facts ?? []).filter((f) => f.status === 'verified' && f.value);
  const hasPage = Boolean(project.caseStudy);

  return (
    <article className="syscard" data-lead={lead ? '' : undefined} data-reveal="">
      <div className="syscard__media">
        {diagnostic ? (
          <DiagnosticView
            states={diagnostic.states}
            sizes={MEDIA_SIZES}
            priority={lead}
            idBase={`diag-${project.slug}`}
          />
        ) : (
          <Picture id={project.cover} sizes={MEDIA_SIZES} priority={lead} />
        )}
      </div>

      <div className="syscard__body">
        <div className="syscard__head">
          {brief && <p className="syscard__category">{brief.category}</p>}
          <h3 className="syscard__title">
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
          {brief && <p className="syscard__engine">{brief.engine}</p>}
        </div>

        {brief ? (
          <dl className="psr">
            <div className="psr__row" data-stage="problem">
              <dt>Problem</dt>
              <dd>{brief.problem}</dd>
            </div>
            <div className="psr__row" data-stage="constraints">
              <dt>Constraints</dt>
              <dd>{brief.constraints}</dd>
            </div>
            <div className="psr__row" data-stage="system">
              <dt>System</dt>
              <dd>{brief.system}</dd>
            </div>
            <div className="psr__row" data-stage="result">
              <dt>Result</dt>
              <dd>{brief.result}</dd>
            </div>
          </dl>
        ) : (
          <p className="syscard__summary">{project.summary}</p>
        )}

        {/* Release facts stand in for the brief on work that ships as something
            you can run, where "which engine built it" is not a fact this site
            can state. */}
        {project.release && (
          <dl className="syscard__release">
            <div>
              <dt>Genre</dt>
              <dd>{project.release.genre}</dd>
            </div>
            <div>
              <dt>Platform</dt>
              <dd>{project.release.platform}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{project.release.status}</dd>
            </div>
            <div>
              <dt>AI disclosure</dt>
              <dd>{project.release.aiDisclosure}</dd>
            </div>
          </dl>
        )}

        {verified.length > 0 && (
          <div className="syscard__metrics">
            <p className="syscard__metrics-head">Measured</p>
            <MetricStrip facts={verified} compact={!lead} />
          </div>
        )}

        {project.spec && <p className="syscard__role">{project.spec.role}</p>}

        {brief?.lesson && (
          <p className="syscard__lesson">
            <span>What it taught</span> {brief.lesson}
          </p>
        )}

        <p className="syscard__actions">
          {hasPage ? (
            <Link className="btn btn--primary" to={`/work/${project.slug}/`}>
              Read the case study <span className="btn__arrow">→</span>
            </Link>
          ) : project.externalUrl ? (
            <a className="btn" href={project.externalUrl} target="_blank" rel="noopener noreferrer">
              {project.externalCta ?? 'View'} <span className="btn__arrow">↗</span>
            </a>
          ) : null}
        </p>
      </div>
    </article>
  );
}
