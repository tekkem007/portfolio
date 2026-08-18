import { useEffect, useRef, useState } from 'react';
import type { EvidenceItem } from '../content/types';

/**
 * Verified measurements, drawn once.
 *
 * Only entries that are `verified` **and** carry a value reach this component —
 * the same rule the rest of the site uses — so an outstanding measurement is
 * invisible here rather than rendered as a blank or a guess.
 *
 * A value written as "before → after" also gets a pair of bars. The bars are
 * derived from that string and nothing else: no number is introduced here, and
 * if the string does not parse the value is printed exactly as written. Which
 * direction counts as an improvement comes from the measurement itself rather
 * than from guessing at the unit.
 *
 * They animate once, on arrival, then hold. A metric that keeps moving is
 * decoration; a metric that resolves and stops is a result.
 */

interface Delta {
  before: number;
  after: number;
  /**
   * The two numbers exactly as they were published.
   *
   * Both are displayed from these rather than from the parsed values. Going
   * through Number loses the trailing zero in "22.60" and the thousands space
   * in "4 327", and a measurement that renders differently from the way it was
   * recorded is a different measurement. The parsed numbers only drive the bar
   * lengths and the count-up target.
   */
  beforeText: string;
  afterText: string;
  /** Anything trailing the pair — a unit, a percentage in brackets. */
  rest: string;
}

/** "4 327 → 3 790 MB" → before 4327, after 3790, texts kept verbatim. */
function parseDelta(value: string): Delta | null {
  const parts = value.split('→');
  if (parts.length !== 2) return null;
  const beforeText = parts[0].trim();
  const match = parts[1].trim().match(/^([\d\s,.]+)(.*)$/);
  if (!match) return null;
  const afterText = match[1].trim();
  const before = Number(beforeText.replace(/[\s,]/g, ''));
  const after = Number(afterText.replace(/[\s,]/g, ''));
  if (!Number.isFinite(before) || !Number.isFinite(after)) return null;
  return { before, after, beforeText, afterText, rest: match[2].trim() };
}

/**
 * True once the element has *scrolled into* view.
 *
 * Deliberately never true for something already on screen when the page loads.
 * Animating a number the visitor is already reading means showing them the
 * final value, blanking it, and counting back up to the same value — which
 * reads as a glitch, not a reveal. Anything above the fold simply arrives
 * finished, which is also what the server renders and what reduced motion and a
 * failed script both leave in place.
 */
function useScrolledInto<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver !== 'function') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (node.getBoundingClientRect().top < window.innerHeight) return;

    const observer = new IntersectionObserver(
      (entries, self) => {
        if (!entries[0].isIntersecting) return;
        setRun(true);
        self.disconnect();
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, run };
}

/** Matches the precision the number was written with, so 22.60 stays 22.60. */
function decimalsOf(text: string) {
  return text.includes('.') ? text.split('.')[1].length : 0;
}

/**
 * Counts to the value, then hands over to the published string.
 *
 * `shown === null` means "not counting" — the resting state, and the state the
 * server renders — in which the exact text as recorded is displayed. Only the
 * frames in between are formatted from a number.
 */
function Counter({ to, text, run }: { to: number; text: string; run: boolean }) {
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    if (!run) return;

    let frame = 0;
    const start = performance.now();
    const DURATION = 900;
    const decimals = decimalsOf(text);

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      if (t >= 1) {
        // Land on the published string, never on a re-formatted number.
        setShown(null);
        return;
      }
      // Decelerating, so it settles rather than stopping dead.
      setShown(Number((to * (1 - (1 - t) ** 3)).toFixed(decimals)));
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [run, to, text]);

  return <>{shown === null ? text : shown.toFixed(decimalsOf(text))}</>;
}

export function MetricStrip({ facts, compact = false }: { facts: EvidenceItem[]; compact?: boolean }) {
  const shown = facts.filter((f) => f.status === 'verified' && f.value);
  const { ref, run } = useScrolledInto<HTMLDListElement>();
  if (shown.length === 0) return null;

  return (
    <dl className="metrics" data-compact={compact ? '' : undefined} data-run={run ? '' : undefined} ref={ref}>
      {shown.map((fact) => {
        const delta = parseDelta(fact.value!);
        const improved =
          delta && fact.better
            ? fact.better === 'lower'
              ? delta.after < delta.before
              : delta.after > delta.before
            : undefined;
        const scale = delta ? Math.max(delta.before, delta.after) : 1;

        return (
          <div className="metric" key={fact.label} data-improved={improved ? '' : undefined}>
            <dt>{fact.label}</dt>
            <dd>
              {delta ? (
                <>
                  <span className="metric__pair">
                    <span className="metric__before">{delta.beforeText}</span>
                    <span className="metric__arrow" aria-hidden="true">
                      →
                    </span>
                    <span className="metric__after">
                      <Counter to={delta.after} text={delta.afterText} run={run} />
                    </span>
                    {delta.rest && <span className="metric__unit">{delta.rest}</span>}
                  </span>

                  {/* Two bars on one scale. Which is longer is not the point;
                      which is better is, and that comes from the measurement. */}
                  <span className="metric__bars" aria-hidden="true">
                    <span
                      className="metric__bar"
                      style={{ '--w': `${(delta.before / scale) * 100}%` } as React.CSSProperties}
                    />
                    <span
                      className="metric__bar metric__bar--after"
                      style={{ '--w': `${(delta.after / scale) * 100}%` } as React.CSSProperties}
                    />
                  </span>
                </>
              ) : (
                fact.value
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
