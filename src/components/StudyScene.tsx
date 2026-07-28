import { useEffect, useRef, useState } from 'react';
import type { Project } from '../content/types';
import type { StudyHandle, StudyVariant } from '../lib/studyScene';

/**
 * Which demonstration belongs to which case study, and what it is showing.
 *
 * The caption is not optional: an abstract rotating object beside a technical
 * write-up is meaningless unless the page says what it represents. It also
 * gives the panel an accessible text equivalent, so nothing is lost when the
 * canvas does not render.
 */
const STUDIES: Record<string, { variant: StudyVariant; title: string; caption: string }> = {
  'maintenance-hangar': {
    variant: 'kit',
    title: 'The kit, assembled',
    caption:
      'Five bays built from four repeated module types — truss, brace, beam, floor plate. The wireframe is the same geometry as the solid pass, which is the point of a modular kit: one set of parts, consistent texel density, arbitrary length.',
  },
  'layered-material-system': {
    variant: 'material',
    title: 'One mesh, three layers',
    caption:
      'The same geometry cycling through wood, painted metal and emissive trim. Nothing about the mesh changes between states — only which material layer the mask assigns to it.',
  },
  'the-silent-gate': {
    variant: 'lighting',
    title: 'Warm key, cool fill',
    caption:
      'Two opposed lights orbiting a single form. The warm key reads as the entryway torches, the cool fill as ambient mountain shadow — the split that carries the composition.',
  },
};

/**
 * Gate for the study canvas. Deliberately stricter than the hero: this sits
 * inside reading content, so it must never compete with the text or cost
 * battery on a device that gains little from it.
 */
function shouldRender(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (window.matchMedia('(max-width: 60rem)').matches) return false;
  if (window.matchMedia('(hover: none)').matches) return false;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return false;

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return false;

  try {
    const probe = document.createElement('canvas');
    return Boolean(probe.getContext('webgl2') ?? probe.getContext('webgl'));
  } catch {
    return false;
  }
}

export function StudyScene({ project }: { project: Project }) {
  const study = STUDIES[project.slug];
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!study || !shouldRender()) return;

    let handle: StudyHandle | undefined;
    let cancelled = false;
    let loaded = false;

    // Only build the scene once the panel is near the viewport: on a 7,000px
    // page there is no reason to compile shaders for something far below.
    const start = () => {
      if (loaded || cancelled) return;
      loaded = true;
      observer.disconnect();
      window.clearTimeout(fallback);

      import('../lib/studyScene')
        .then(({ createStudy }) => {
          if (cancelled || !containerRef.current) return;
          return createStudy(containerRef.current, study.variant);
        })
        .then((created) => {
          if (cancelled) {
            created?.dispose();
            return;
          }
          handle = created;
          if (created) setActive(true);
        })
        .catch(() => setActive(false));
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
      },
      { rootMargin: '200px 0px' },
    );

    if (containerRef.current) observer.observe(containerRef.current);

    // IntersectionObserver callbacks are delivered as part of the frame
    // lifecycle, so a throttled or frozen frame loop can leave them pending
    // indefinitely. Fall back to a direct measurement rather than letting the
    // panel silently never load — but still only start if it is actually near
    // the viewport, so this never becomes an unconditional eager load.
    const fallback = window.setTimeout(() => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect && rect.top < window.innerHeight * 2 && rect.bottom > -window.innerHeight) start();
    }, 2500);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.clearTimeout(fallback);
      handle?.dispose();
    };
  }, [study]);

  if (!study) return null;

  return (
    <section className="section study" aria-labelledby={`study-${project.slug}`} data-domain={project.domain}>
      <div className="shell study__inner">
        <div className="study__text">
          <p className="eyebrow">Demonstration</p>
          <h2 id={`study-${project.slug}`}>{study.title}</h2>
          <p>{study.caption}</p>
          {!active && <p className="study__note">Shown as a live 3D view on larger screens with motion enabled.</p>}
        </div>
        {/* aria-hidden: the caption above is the accessible equivalent, and the
            canvas itself carries no information a screen reader could use. */}
        <div className="study__stage" ref={containerRef} aria-hidden="true" data-active={active} />
      </div>
    </section>
  );
}
