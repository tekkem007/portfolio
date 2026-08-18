import { useEffect, useRef, useState } from 'react';
import { Picture } from './Picture';
import { decodeAll, whenIdle } from '../lib/warm';

/**
 * The hero's project scene, shown as a panel rather than a backdrop.
 *
 * Two real frames from the Time of Day case study: the same camera, the same
 * level, the Day and Night presets, with nothing re-baked between them. That is
 * the entire claim the system makes, so the hero is not decoration — it is the
 * shortest demonstration of the thing this page is about.
 *
 * A panel and not a full-bleed background for two reasons. The frames are
 * roughly 2.5:1, so filling a tall hero would crop away most of the
 * composition and leave a texture. And a framed, labelled, switchable viewport
 * is what the page is claiming to be about; a darkened photograph behind text
 * is what every other portfolio does.
 *
 * It advances on its own, slowly, and stops the moment anyone takes an
 * interest: the two labelled controls select a state directly and end the
 * cycle. Off screen, in a hidden tab, or under reduced motion it never runs.
 *
 * Both frames render from the start rather than swapping in, so a switch costs
 * nothing and the first change cannot flash an unloaded image.
 */

const STATES = [
  { id: 'tod-01', label: 'Day' },
  { id: 'tod-02', label: 'Night' },
] as const;

/** Long enough to read as a lighting change rather than a slideshow. */
const DWELL = 7000;

export function SystemHero({ credit }: { credit: string }) {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (held) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = rootRef.current;
    if (!root) return;

    let timer = 0;
    let onScreen = true;

    const tick = () => {
      if (!document.hidden && onScreen) setActive((i) => (i + 1) % STATES.length);
      timer = window.setTimeout(tick, DWELL);
    };
    timer = window.setTimeout(tick, DWELL);

    // A timer firing into a hidden or scrolled-past panel is wasted work and
    // wasted battery. The observer stops it advancing rather than merely
    // hiding the result.
    const observer =
      typeof IntersectionObserver === 'function'
        ? new IntersectionObserver(([entry]) => {
            onScreen = entry.isIntersecting;
          })
        : null;
    observer?.observe(root);

    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [held]);

  // Both frames are in the markup from the start, but the second is lazy and
  // therefore undecoded — which turned the first press into a 744 ms wait.
  // Decoding it once the browser is idle makes the switch immediate without
  // putting a second image on the critical path.
  useEffect(() => whenIdle(() => decodeAll(rootRef.current)), []);

  const choose = (index: number) => {
    setActive(index);
    setHeld(true);
  };

  return (
    // `held` is set only by a press, so the same attribute that stops the cycle
    // also selects the faster transition: an ambient change should drift, a
    // change someone asked for should answer.
    <figure className="syspanel" data-pressed={held ? '' : undefined} ref={rootRef}>
      <div className="syspanel__bar">
        <span className="syspanel__title">Time of Day · runtime preset</span>
        <div className="syspanel__states" role="group" aria-label="Lighting preset">
          {STATES.map((state, i) => (
            <button
              key={state.id}
              type="button"
              className="syspanel__state"
              aria-pressed={i === active}
              onClick={() => choose(i)}
            >
              {state.label}
            </button>
          ))}
        </div>
      </div>

      <div className="syspanel__stage">
        {STATES.map((state, i) => (
          <div className="syspanel__frame" key={state.id} data-active={i === active ? '' : undefined}>
            <Picture id={state.id} alt="" priority={i === 0} sizes="(min-width: 68rem) 44vw, 92vw" />
          </div>
        ))}
        <div className="syspanel__grid" aria-hidden="true" />
        <p className="syspanel__flag" aria-hidden="true">
          Same camera · no re-bake
        </p>
      </div>

      <figcaption className="syspanel__credit">{credit}</figcaption>
    </figure>
  );
}
