import { useEffect, useState } from 'react';
import type { Project } from '../content/types';

export function slugifyHeading(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

interface RailProps {
  project: Project;
  /** Section headings, in document order. */
  headings: string[];
}

/**
 * The case-study metadata rail.
 *
 * On wide screens this occupies the left margin that was previously empty,
 * holding the project's facts and a section index that tracks reading position.
 * Below the ultrawide breakpoint it collapses back into normal flow above the
 * prose, so narrow screens are unaffected.
 *
 * The index is a real <nav> of real anchor links: it works with keyboard, with
 * JavaScript disabled, and with the scroll-spy highlighting absent. The
 * highlight is decoration on top of working navigation, not the mechanism.
 */
export function CaseStudyRail({ project, headings }: RailProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const ids = headings.map(slugifyHeading);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    // IntersectionObserver rather than a scroll handler tied to the animation
    // loop: it keeps working when the frame loop is throttled, and costs
    // nothing while the page is idle.
    const observer = new IntersectionObserver(
      (entries) => {
        // Choose the entry nearest the top of the viewport among those visible.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      // A band across the upper part of the viewport, so the highlight changes
      // when a section reaches reading position rather than when it first peeks in.
      { rootMargin: '-12% 0px -70% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [headings]);

  return (
    <aside className="cs-rail" aria-label="Project details">
      <dl className="cs-rail__facts">
        <div>
          <dt>Year</dt>
          <dd>{project.year}</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>{project.caseStudy?.role}</dd>
        </div>
        <div>
          <dt>Software</dt>
          <dd>{project.software.join(', ')}</dd>
        </div>
        <div>
          <dt>Focus</dt>
          <dd>
            <span className="cs-rail__tags">
              {project.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </span>
          </dd>
        </div>
      </dl>

      <nav className="cs-rail__index" aria-label="Sections">
        <p className="cs-rail__index-title">Contents</p>
        <ol>
          {headings.map((heading) => {
            const id = slugifyHeading(heading);
            const current = id === activeId;
            return (
              <li key={id}>
                <a href={`#${id}`} aria-current={current ? 'true' : undefined} data-active={current}>
                  {heading}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </aside>
  );
}
