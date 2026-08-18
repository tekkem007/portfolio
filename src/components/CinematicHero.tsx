import { useEffect, useRef } from 'react';
import { Picture } from './Picture';
import type { CinemaHandle } from '../lib/cinema';

/**
 * The environment track's establishing shot.
 *
 * Replaces the WebGL blockout scene on this track. The blockout reads as
 * pipeline evidence, which is the technical track's argument; here the argument
 * is the work itself, so the hero is the strongest finished environment image
 * with the page composed over it.
 *
 * Three depth plates — the image, a haze band, and a foreground vignette with
 * drifting motes — separate slightly on scroll. That is as far as the multiplane
 * goes with one flattened render; see README for what a true separated version
 * would need.
 *
 * The image is eager and high priority on purpose: it is the largest thing on
 * the page and therefore the LCP element, so hiding it behind lazy loading would
 * only move the same bytes later.
 */

/** Motes are decorative and fixed in number — enough to read as air, not snow. */
const MOTES = [0, 1, 2, 3, 4, 5, 6, 7];

export function CinematicHero({ id, caption }: { id: string; caption: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let handle: CinemaHandle | null = null;
    let cancelled = false;

    // Deferred past first paint: the hero is complete and readable without it,
    // and the scroll wiring should never be on the critical path.
    import('../lib/cinema')
      .then(({ initCinema }) => {
        if (cancelled || !rootRef.current) return;
        handle = initCinema(rootRef.current);
      })
      .catch(() => {
        /* A static hero is an acceptable hero. */
      });

    return () => {
      cancelled = true;
      handle?.destroy();
    };
  }, []);

  return (
    <div className="cinema" ref={rootRef}>
      <div className="cinema__plate cinema__plate--back" data-depth="0.18" aria-hidden="true">
        <div className="cinema__drift">
          <Picture
            id={id}
            alt=""
            priority
            sizes="100vw"
            className="cinema__image"
          />
        </div>
      </div>

      <div className="cinema__plate cinema__plate--mid" data-depth="0.34" aria-hidden="true" />

      <div className="cinema__plate cinema__plate--fore" data-depth="0.62" aria-hidden="true">
        <div className="cinema__motes">
          {MOTES.map((i) => (
            <span key={i} style={{ ['--i' as string]: i }} />
          ))}
        </div>
      </div>

      <div className="cinema__veil" aria-hidden="true" />
      <p className="cinema__caption">{caption}</p>
    </div>
  );
}
