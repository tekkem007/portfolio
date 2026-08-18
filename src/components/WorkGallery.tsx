import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Project, WorkGroup } from '../content/types';
import { galleryCounts } from '../content/projects';
import { GalleryCard } from './GalleryCard';

type Filter = 'all' | WorkGroup;

/**
 * "Selected Environment & Prop Work" — one collection, two ways in.
 *
 * The filter does not reorder anything: rank already decides the order, so
 * filtering only ever removes cards and closes the gaps. That is what makes the
 * rearrangement safe to animate — every surviving card moves in a straight line
 * to a position it was always going to occupy, so there is no flying, no
 * scaling and nothing for the eye to lose track of.
 *
 * Scroll position is never touched and focus is never moved: the filter buttons
 * are not remounted, so the button you pressed still has focus afterwards.
 */

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'environment', label: 'Environments' },
  { id: 'prop', label: 'Props' },
];

/** Below this many entries a filter is noise rather than navigation. */
const MIN_ITEMS_FOR_FILTERS = 6;
/** And a filter that hides almost nothing is not worth a control either. */
const MIN_PER_GROUP = 2;

export function WorkGallery({
  heading,
  intro,
  items,
  archived = [],
}: {
  heading: string;
  intro: string;
  items: Project[];
  /** Older studies, listed collapsed inside this section rather than given one
      of their own — a second heading is exactly the split this merge removes. */
  archived?: Project[];
}) {
  const [filter, setFilter] = useState<Filter>('all');
  const gridRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  /** Where the filter control sat in the viewport when it was pressed. */
  const anchor = useRef<number | null>(null);
  /** Card rects captured immediately before a filter change, keyed by slug. */
  const previous = useRef<Map<string, DOMRect> | null>(null);

  const counts = useMemo(() => galleryCounts(items), [items]);

  const showFilters =
    items.length >= MIN_ITEMS_FOR_FILTERS &&
    counts.environment >= MIN_PER_GROUP &&
    counts.prop >= MIN_PER_GROUP;

  const visible = useMemo(
    () => (filter === 'all' ? items : items.filter((p) => p.category?.group === filter)),
    [filter, items],
  );

  const change = useCallback((next: Filter) => {
    // The control the visitor just pressed must not move under their cursor.
    // Removing cards changes the height of the document, and if that shortens
    // it past the current scroll position the browser clamps the scroll and
    // everything slides. Recording where the control sat lets us put it back.
    anchor.current = filterRef.current?.getBoundingClientRect().top ?? null;

    // Read every card's position before React re-renders. This is the "first"
    // half of a FLIP: after the DOM updates we know where each survivor was and
    // where it ended up, and can play the difference backwards.
    const grid = gridRef.current;
    if (grid && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const map = new Map<string, DOMRect>();
      grid.querySelectorAll<HTMLElement>('[data-slug]').forEach((el) => {
        map.set(el.dataset.slug!, el.getBoundingClientRect());
      });
      previous.current = map;
    }
    setFilter(next);
  }, []);

  useLayoutEffect(() => {
    // Put the filter control back where it was, before anything is animated.
    const anchored = anchor.current;
    anchor.current = null;
    let scrolled = 0;
    if (anchored !== null && filterRef.current) {
      const drift = filterRef.current.getBoundingClientRect().top - anchored;
      if (Math.abs(drift) > 1) {
        const from = window.scrollY;
        window.scrollBy(0, drift);
        // The browser clamps at the ends of the document, so what actually
        // happened is not necessarily what was asked for.
        scrolled = window.scrollY - from;
      }
    }

    const before = previous.current;
    previous.current = null;
    const grid = gridRef.current;
    if (!before || !grid) return;
    if (typeof Element === 'undefined' || !Element.prototype.animate) return;

    grid.querySelectorAll<HTMLElement>('[data-slug]').forEach((el) => {
      const slug = el.dataset.slug!;
      const from = before.get(slug);
      const to = el.getBoundingClientRect();

      if (!from) {
        // Newly shown: it fades up a little rather than appearing hard.
        el.animate(
          [
            { opacity: 0, transform: 'translateY(12px)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 320, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' },
        );
        return;
      }

      // `from` was measured before the anchor scroll and `to` after it, so the
      // scroll has to come out of the delta or every card animates by it.
      const dx = from.left - to.left;
      const dy = from.top - to.top - scrolled;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;

      el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], {
        duration: 420,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      });
    });
  }, [filter]);

  return (
    <section className="section section--gallery" id="work" aria-labelledby="work-title">
      {/* Signature transition 2: a composition mask that opens as the section
          arrives, so entering the gallery reads as a cut to a new scene rather
          than more of the same page. Decorative; the section is fully readable
          without it. */}
      <div className="sig-mask" aria-hidden="true" data-scene="" />

      <div className="shell shell--media">
        <div className="section-head">
          <p className="eyebrow">Selected work</p>
          <h2 id="work-title">{heading}</h2>
          <p>{intro}</p>
        </div>

        {showFilters && (
          <div className="gfilter" ref={filterRef}>
            <div className="gfilter__set" role="group" aria-label="Filter by kind of work">
              {FILTERS.map(({ id, label }) => {
                const count = id === 'all' ? items.length : id === 'environment' ? counts.environment : counts.prop;
                return (
                  <button
                    key={id}
                    type="button"
                    className="gfilter__btn"
                    aria-pressed={filter === id}
                    onClick={() => change(id)}
                  >
                    {label} <span className="gfilter__count">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Screen readers get the result of the filter, which is otherwise
                only visible as cards silently disappearing. */}
            <p className="visually-hidden" role="status">
              Showing {visible.length} of {items.length} projects
            </p>
          </div>
        )}

        <div className="gallery-grid" ref={gridRef}>
          {visible.map((project) => (
            <div
              className="gallery-grid__cell"
              data-slug={project.slug}
              data-group={project.category?.group}
              key={project.slug}
            >
              <GalleryCard project={project} />
            </div>
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
                    {project.category ? `${project.category.label} · ` : ''}
                    {project.year} · {project.software.join(', ')}
                  </p>
                </article>
              ))}
            </div>
          </details>
        )}
      </div>
    </section>
  );
}
