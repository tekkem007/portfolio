/**
 * Scroll reveals.
 *
 * GSAP is loaded lazily and only when it will actually be used. The default
 * state of every element is *visible* — the `.will-reveal` class that hides an
 * element is applied by this module immediately before the animation is set up,
 * so a failed import, a blocked script or reduced-motion preference all leave
 * the content plainly on screen.
 *
 * The reveals do one job: give each section a moment of its own as it arrives,
 * so a long page reads as a sequence rather than a wall. Nothing here hijacks
 * the scroll, pins, or changes scroll speed.
 */

let started = false;

export async function initMotion(): Promise<void> {
  if (started) return;
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (targets.length === 0) return;

  started = true;

  try {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
    gsap.registerPlugin(ScrollTrigger);

    // Nothing is hidden until we have proof the animation loop is actually
    // running. GSAP and ScrollTrigger are both driven by requestAnimationFrame,
    // and a frozen frame loop — a throttled background tab, a headless or
    // non-compositing renderer, some assistive tooling — would otherwise leave
    // every revealed section stuck at opacity 0 with no way to recover.
    const ticking = await new Promise<boolean>((resolve) => {
      let settled = false;
      const finish = (value: boolean) => {
        if (settled) return;
        settled = true;
        gsap.ticker.remove(onTick);
        window.clearTimeout(timer);
        resolve(value);
      };
      const onTick = () => finish(true);
      const timer = window.setTimeout(() => finish(false), 400);
      gsap.ticker.add(onTick);
    });

    if (!ticking) {
      started = false;
      return;
    }

    targets.forEach((element) => {
      // Hide only now that we know the animation will run.
      element.classList.add('will-reveal');

      gsap.to(element, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 88%',
          once: true,
        },
        onComplete: () => {
          // Drop the inline transform so it cannot interfere with layout,
          // sticky positioning or focus scrolling afterwards.
          element.classList.remove('will-reveal');
          gsap.set(element, { clearProps: 'opacity,transform' });
        },
      });
    });
    // Images ship with explicit dimensions so layout is stable, but a refresh
    // once everything has loaded costs nothing and absorbs any late shift.
    if (document.readyState !== 'complete') {
      window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    }
  } catch {
    // If GSAP fails to load, remove any hidden state we may have applied.
    targets.forEach((element) => element.classList.remove('will-reveal'));
    started = false;
  }
}

/** Tears reveals down on route change so triggers do not leak between pages. */
export async function resetMotion(): Promise<void> {
  if (!started) return;
  try {
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  } catch {
    /* nothing to clean up */
  }
  started = false;
}

/**
 * Opens the composition mask on any `[data-scene]` element as it arrives.
 *
 * Deliberately separate from `initMotion`: this needs no library, so a slow or
 * blocked GSAP chunk cannot hold up the one transition that gives the gallery
 * its entrance. It also runs once per element and then disconnects, so there is
 * no observer left watching a section that has already been seen.
 */
let sceneObserver: IntersectionObserver | null = null;

export function initScenes(): void {
  if (typeof window === 'undefined') return;
  if (typeof IntersectionObserver !== 'function') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'));
  if (scenes.length === 0) return;

  sceneObserver?.disconnect();
  sceneObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-open');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px' },
  );

  scenes.forEach((scene) => sceneObserver?.observe(scene));
}

/** Tears the scene observer down on route change. */
export function resetScenes(): void {
  sceneObserver?.disconnect();
  sceneObserver = null;
}
