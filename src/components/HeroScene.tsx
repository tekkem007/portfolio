import { useEffect, useRef, useState } from 'react';
import type { SceneHandle } from '../lib/scene';

/**
 * Decides whether the WebGL hero should run at all, and loads it only if so.
 *
 * The scene is a bonus, never a dependency. It is skipped when the visitor
 * prefers reduced motion, when WebGL is unavailable, on small viewports, on
 * low-core devices, and when the browser reports a metered connection. In every
 * one of those cases the CSS fallback wash renders instead and the page is
 * visually complete.
 */
function shouldRenderScene(): boolean {
  if (typeof window === 'undefined') return false;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;

  // Phones get the fallback: the scene is a wide composition and the battery
  // cost is not worth it on a viewport that crops it anyway.
  if (window.matchMedia('(max-width: 48rem)').matches) return false;

  // Coarse pointers with no hover are tablets/touch laptops in tablet mode.
  if (window.matchMedia('(hover: none)').matches) return false;

  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return false;

  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection;
  if (connection?.saveData) return false;
  if (connection?.effectiveType && /(^|-)2g$/.test(connection.effectiveType)) return false;

  // Finally, confirm a context can actually be created.
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') ?? probe.getContext('webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!shouldRenderScene()) return;

    let scene: SceneHandle | undefined;
    let cancelled = false;

    // Wait for the browser to go idle so the scene never competes with first
    // paint or with the hero text becoming readable.
    //
    // The idle callback is raced against a plain timer rather than trusted on
    // its own: Safari does not implement it at all, and environments that
    // throttle the frame loop (background tabs, some remote/headless renderers)
    // can leave an idle callback pending indefinitely even when a `timeout` is
    // supplied. Whichever fires first wins; `loaded` makes it idempotent.
    let loaded = false;
    const supportsIdle = typeof window.requestIdleCallback === 'function';
    const idleHandle = supportsIdle ? window.requestIdleCallback(load, { timeout: 1200 }) : undefined;
    const timerHandle = window.setTimeout(load, 1200);

    function load() {
      if (loaded) return;
      loaded = true;
      if (cancelled || !containerRef.current) return;
      import('../lib/scene')
        .then(({ createScene }) => {
          if (cancelled || !containerRef.current) return;
          return createScene(containerRef.current);
        })
        .then((created) => {
          if (cancelled) {
            created?.dispose();
            return;
          }
          scene = created;
          if (created) setActive(true);
        })
        .catch(() => {
          // A failed scene is not a failed page — the fallback stays.
          setActive(false);
        });
    }

    return () => {
      cancelled = true;
      if (idleHandle !== undefined) window.cancelIdleCallback(idleHandle);
      window.clearTimeout(timerHandle);
      scene?.dispose();
    };
  }, []);

  return (
    <>
      {/* Always rendered, so there is never a blank frame while the scene loads. */}
      <div className="hero__fallback" aria-hidden="true" style={active ? { opacity: 0 } : undefined} />
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__canvas" ref={containerRef} aria-hidden="true" />
      <div className="hero__veil" aria-hidden="true" />
      {active && <p className="hero__scene-note">Live blockout → lit geometry</p>}
    </>
  );
}
