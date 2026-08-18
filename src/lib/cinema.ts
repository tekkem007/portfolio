/**
 * The hero's camera.
 *
 * Three things happen here, all of them optional and all of them off by
 * default: the depth plates separate slightly as the page scrolls, the
 * background plate drifts, and both stop the moment the visitor is doing
 * something or the hero leaves the screen.
 *
 * There is no animation loop. Scroll events schedule one frame each and nothing
 * is scheduled while the page is still, so an idle tab costs nothing. The drift
 * is a CSS animation, which means the compositor owns it and pausing is a class
 * change rather than a JavaScript timer.
 *
 * Everything degrades to a plain, complete hero: the markup is fully styled
 * before this module ever runs, and every early return below leaves it that way.
 */

export interface CinemaHandle {
  destroy(): void;
}

/** How far each plate moves per pixel of scroll. Foreground moves most. */
const DEPTH_ATTR = 'data-depth';

/** Interaction stops the drift; it resumes this long after things go quiet. */
const RESUME_DELAY = 1400;

export function initCinema(root: HTMLElement): CinemaHandle | null {
  if (typeof window === 'undefined') return null;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches) return null;

  const plates = Array.from(root.querySelectorAll<HTMLElement>(`[${DEPTH_ATTR}]`));
  if (plates.length === 0) return null;

  let onScreen = true;
  let frame = 0;
  let resumeTimer = 0;
  let destroyed = false;

  // --- Parallax ----------------------------------------------------------
  //
  // Only ever writes `transform`, and only to the plate wrappers. The drift
  // animation lives on a child element so the two never fight over the same
  // property.
  const apply = () => {
    frame = 0;
    if (destroyed) return;
    const progress = Math.min(1, Math.max(0, window.scrollY / root.offsetHeight));
    for (const plate of plates) {
      const depth = Number(plate.getAttribute(DEPTH_ATTR)) || 0;
      plate.style.transform = `translate3d(0, ${(progress * depth * 100).toFixed(2)}px, 0)`;
    }
  };

  const onScroll = () => {
    if (!onScreen || frame) return;
    frame = window.requestAnimationFrame(apply);
    hold();
  };

  // --- Hold ---------------------------------------------------------------
  //
  // "Quiet camera movement followed by decisive transitions" only reads as
  // intentional if the camera stops when the visitor takes over. Any scroll,
  // pointer or focus activity in the hero parks the drift; it picks up again
  // once things have been still for a moment.
  const hold = () => {
    root.classList.add('is-held');
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(() => {
      if (!destroyed && onScreen) root.classList.remove('is-held');
    }, RESUME_DELAY);
  };

  // --- Off-screen and background tabs -------------------------------------
  const observer =
    typeof IntersectionObserver === 'function'
      ? new IntersectionObserver(
          ([entry]) => {
            onScreen = entry.isIntersecting;
            root.classList.toggle('is-offscreen', !onScreen);
            if (onScreen) apply();
          },
          { rootMargin: '0px' },
        )
      : null;
  observer?.observe(root);

  const onVisibility = () => {
    root.classList.toggle('is-offscreen', document.hidden || !onScreen);
  };

  // Turning reduced motion on mid-session should take effect immediately, not
  // at the next reload.
  const onReduceChange = () => {
    if (reduce.matches) destroy();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  root.addEventListener('pointermove', hold, { passive: true });
  root.addEventListener('focusin', hold);
  document.addEventListener('visibilitychange', onVisibility);
  reduce.addEventListener('change', onReduceChange);

  root.classList.add('is-live');
  apply();

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    if (frame) window.cancelAnimationFrame(frame);
    window.clearTimeout(resumeTimer);
    window.removeEventListener('scroll', onScroll);
    root.removeEventListener('pointermove', hold);
    root.removeEventListener('focusin', hold);
    document.removeEventListener('visibilitychange', onVisibility);
    reduce.removeEventListener('change', onReduceChange);
    observer?.disconnect();
    root.classList.remove('is-live', 'is-held', 'is-offscreen');
    for (const plate of plates) plate.style.transform = '';
  }

  return { destroy };
}
