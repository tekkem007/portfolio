import { useCallback, useEffect, useRef, useState } from 'react';
import type { DiagnosticState } from '../content/diagnostics';
import { Picture } from './Picture';
import { decodeAll, whenIdle } from '../lib/warm';

/**
 * Switches one project between the views the engine can show it in.
 *
 * A real tab set, not buttons that look like one: arrow keys move between the
 * views, Home and End jump to the ends, and only the selected tab is in the tab
 * order, so a keyboard user tabs past the whole control in one press instead of
 * four. That is the WAI-ARIA tabs pattern, and it is the right one here because
 * each view genuinely is a panel of its own.
 *
 * Server-rendered with the first view already visible and its caption printed,
 * so the page is complete and the evidence is readable before — or without —
 * any JavaScript.
 *
 * Views are mounted as they are visited and then kept, which is what makes the
 * cross-fade possible without downloading anything twice. Nothing is fetched
 * for a view nobody opens.
 */

export function DiagnosticView({
  states,
  sizes,
  priority = false,
  idBase,
}: {
  states: DiagnosticState[];
  sizes: string;
  /** True only for the one view that is the page's LCP candidate. */
  priority?: boolean;
  /** Prefix for the tab/panel ids. Must be unique on the page. */
  idBase: string;
}) {
  const [active, setActive] = useState(0);
  const [visited, setVisited] = useState<number[]>([0]);
  const tabsRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const select = useCallback((next: number) => {
    setActive(next);
    setVisited((seen) => (seen.includes(next) ? seen : [...seen, next]));
  }, []);

  // Once the control is near the viewport and the browser is idle, mount and
  // decode the remaining views. Still lazy — a control nobody scrolls to costs
  // nothing — but a control you *can* press has already loaded what it needs,
  // instead of spending the first press downloading it.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (typeof IntersectionObserver !== 'function') return;

    let cancelIdle: (() => void) | undefined;
    const observer = new IntersectionObserver(
      (entries, self) => {
        if (!entries[0].isIntersecting) return;
        self.disconnect();
        cancelIdle = whenIdle(() => {
          setVisited(states.map((_, i) => i));
          // A frame later the new images exist and can be decoded.
          requestAnimationFrame(() => decodeAll(stageRef.current));
        });
      },
      { rootMargin: '600px 0px' },
    );
    observer.observe(stage);

    return () => {
      observer.disconnect();
      cancelIdle?.();
    };
  }, [states]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = states.length - 1;
    let next: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = active === last ? 0 : active + 1;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = active === 0 ? last : active - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;
    if (next === null) return;
    event.preventDefault();
    select(next);
    // Follow the selection with focus, as the tabs pattern requires.
    tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  const current = states[active];

  return (
    <div className="diag">
      <div className="diag__stage" ref={stageRef}>
        {states.map((state, i) => (
          <div
            key={state.id}
            className="diag__frame"
            data-active={i === active ? '' : undefined}
            id={`${idBase}-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`${idBase}-tab-${i}`}
            // `aria-hidden` rather than the `hidden` attribute, and the reason
            // is measurable rather than stylistic: `hidden` is `display: none`,
            // Chrome does not load lazy images inside a display-none subtree,
            // and the warm-up below therefore did nothing — the first press
            // spent 400 ms fetching. Opacity does the hiding, this does the
            // exposing, and the panels hold no focusable content, so nothing
            // reaches the tab order either way.
            aria-hidden={i === active ? undefined : true}
          >
            {visited.includes(i) && (
              <Picture id={state.id} sizes={sizes} priority={priority && i === 0} />
            )}
          </div>
        ))}

        {current.aligned && active > 0 && (
          <p className="diag__aligned" aria-hidden="true">
            Same camera
          </p>
        )}
      </div>

      <div className="diag__controls">
        <div className="diag__tabs" role="tablist" aria-label="Diagnostic view" ref={tabsRef} onKeyDown={onKeyDown}>
          {states.map((state, i) => (
            <button
              key={state.id}
              type="button"
              role="tab"
              id={`${idBase}-tab-${i}`}
              aria-controls={`${idBase}-panel-${i}`}
              aria-selected={i === active}
              tabIndex={i === active ? 0 : -1}
              className="diag__tab"
              onClick={() => select(i)}
            >
              {state.label}
            </button>
          ))}
        </div>

        {/* The caption is the evidence, so it is live rather than decorative:
            a screen-reader user switching views is told what changed. */}
        <p className="diag__note" aria-live="polite">
          {current.note}
        </p>
      </div>
    </div>
  );
}
