import { useState } from 'react';
import type { Project } from '../content/types';
import { projectDetailShots } from '../content/projectEvidence';
import { Link } from '../lib/router';
import { Picture } from './Picture';

/**
 * A card in the unified environment/prop gallery.
 *
 * Deliberately a separate component from `ProjectCard` rather than a variant of
 * it: the technical track renders the original untouched, so nothing here can
 * change that page by accident.
 *
 * Environments get the wide editorial treatment — establishing image, room to
 * read. Props get a tighter product-style frame. Both carry the same facts in
 * the same order, so a reviewer scanning the column reads title, category,
 * role, tools, outcome every time regardless of the size of the card.
 */

const SIZE_SIZES: Record<'wide' | 'standard', string> = {
  // Wide cards put the image in roughly half of a --media-max shell.
  wide: '(min-width: 62rem) 46vw, 100vw',
  // Props go three-up above 62rem, two-up on tablets, full width on phones.
  standard: '(min-width: 100rem) 24vw, (min-width: 62rem) 30vw, (min-width: 46rem) 45vw, 100vw',
};

export function GalleryCard({ project }: { project: Project }) {
  const size = project.category?.group === 'environment' ? 'wide' : 'standard';
  const detail = projectDetailShots[project.slug];

  // The reveal image is only mounted once the visitor has actually reached for
  // the card. Rendering it upfront at opacity 0 would still download it, which
  // would roughly double the gallery's image weight to serve an effect most
  // visitors never trigger.
  const [armed, setArmed] = useState(false);
  const arm = () => setArmed(true);

  const hasPage = Boolean(project.caseStudy);
  const href = hasPage ? `/work/${project.slug}/` : undefined;

  return (
    <article
      className="gcard"
      data-size={size}
      data-group={project.category?.group}
      data-reveal=""
      onPointerEnter={detail ? arm : undefined}
      onFocusCapture={detail ? arm : undefined}
    >
      <div className="gcard__media">
        <Picture id={project.cover} sizes={SIZE_SIZES[size]} />

        {/* The second image is real project media — an alternate angle, a
            detail, a breakdown sheet, or the same shot under the other lighting
            preset. It is decorative here because the card already states what
            the project is; the caption names what is being shown. */}
        {detail && armed && (
          <div className="gcard__detail" aria-hidden="true">
            <Picture id={detail.id} alt="" sizes={SIZE_SIZES[size]} />
          </div>
        )}
        {detail && (
          <span className="gcard__detail-label" aria-hidden="true">
            {detail.label}
          </span>
        )}

        {/* Signature transition 1: a single warm pass across the image on
            interaction. Runs once, never loops, and is purely decorative. */}
        <span className="sig-sweep" aria-hidden="true" />
      </div>

      <div className="gcard__body">
        {project.category && <p className="gcard__category">{project.category.label}</p>}

        <h3 className="gcard__title">
          {href ? (
            <Link to={href}>{project.title}</Link>
          ) : project.externalUrl ? (
            <a href={project.externalUrl} target="_blank" rel="noopener noreferrer">
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </h3>

        <p className="gcard__summary">{project.summary}</p>

        <dl className="gcard__spec">
          {project.spec && (
            <div>
              <dt>Role</dt>
              <dd>{project.spec.role}</dd>
            </div>
          )}
          <div>
            <dt>Tools</dt>
            <dd>{project.software.join(', ')}</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd>{project.year}</dd>
          </div>
        </dl>

        <span className="gcard__cta" aria-hidden="true">
          {hasPage ? (
            <>
              Read the case study <span className="btn__arrow">→</span>
            </>
          ) : project.externalUrl ? (
            <>
              {project.externalCta ?? 'ArtStation'} <span className="btn__arrow">↗</span>
            </>
          ) : null}
        </span>
      </div>
    </article>
  );
}
