/**
 * Warms the images behind a switchable control.
 *
 * The problem this solves is measurable: a control that cross-fades to an image
 * the browser has not decoded yet does not respond in 200 ms, it responds when
 * the decode finishes. On the hero panel that measured 744 ms for the first
 * Day→Night press, and it is not a CPU cost — throttling the CPU sixfold barely
 * moved it, because the wait is decode and paint, not script.
 *
 * So the alternates are fetched and decoded once the browser is idle and the
 * control is somewhere near the viewport. Nothing is pulled forward into the
 * critical path, nothing downloads for a control the visitor never scrolls to,
 * and by the time one can be pressed its images are already resident.
 *
 * `decode()` is the part that matters. An image can be fully downloaded and
 * still cost a frame the first time it is painted; decoding it off the main
 * thread in advance is what makes the switch immediate.
 */

/** Runs `task` when the browser is next idle, or after `fallback` ms. */
export function whenIdle(task: () => void, fallback = 1500): () => void {
  if (typeof window === 'undefined') return () => {};

  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    task();
  };

  // Safari has no requestIdleCallback, and environments that throttle the frame
  // loop can leave one pending indefinitely — so it is raced against a timer
  // rather than trusted on its own.
  const idle =
    typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(run, { timeout: fallback }) : undefined;
  const timer = window.setTimeout(run, fallback);

  return () => {
    done = true;
    if (idle !== undefined) window.cancelIdleCallback(idle);
    window.clearTimeout(timer);
  };
}

/** Decodes every image inside `root`, ignoring any that are not ready. */
export function decodeAll(root: HTMLElement | null): void {
  if (!root) return;
  root.querySelectorAll('img').forEach((img) => {
    // A rejected decode is not a failure worth reporting: it only means the
    // image is not available yet, and the control still works without it.
    img.decode?.().catch(() => {});
  });
}
