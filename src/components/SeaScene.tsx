import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { SeaSceneHandle, TimeOfDay } from '../lib/seaScene';
import { href } from '../lib/router';

type Status = 'idle' | 'loading' | 'ready' | 'error' | 'unsupported';

/**
 * Reasons the WebGL scene should not run.
 *
 * Reduced motion is deliberately NOT one of them. The scene is a portfolio
 * asset worth seeing; the correct response to reduced motion is to stop the
 * water animating, not to hide the artwork. That is handled inside the scene.
 */
function blockedReason(): string | null {
  if (typeof window === 'undefined') return null;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (connection?.saveData) return 'Data Saver is on, so the 3D scene was not downloaded.';
  if (connection?.effectiveType && /(^|-)2g$/.test(connection.effectiveType)) {
    return 'The connection is too slow to load the 3D scene.';
  }
  try {
    const probe = document.createElement('canvas');
    if (!(probe.getContext('webgl2') ?? probe.getContext('webgl'))) return 'This browser does not support WebGL.';
  } catch {
    return 'This browser does not support WebGL.';
  }
  return null;
}

let cached: string | null | undefined;
const subscribeNever = () => () => {};
const getClient = () => {
  if (cached === undefined) cached = blockedReason();
  return cached;
};
const getServer = () => null;

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Reduced-motion preference as a subscribed store.
 *
 * Unlike WebGL support this genuinely can change while the page is open — a
 * visitor may flip the OS setting — so it is subscribed rather than cached, and
 * read during render rather than assigned from an effect.
 */
function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function detectQuality(): 'high' | 'medium' | 'low' {
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  if (window.matchMedia('(hover: none)').matches || cores <= 4 || memory <= 4) return 'low';
  if (cores >= 8 && memory >= 8) return 'high';
  return 'medium';
}

/**
 * Interactive sea scene showing the buoy afloat.
 *
 * Accessibility contract:
 * - The canvas is `aria-hidden`; the prose beside it describes the asset and is
 *   always present, so nothing is lost without WebGL.
 * - The day/night control is a real toggle button with `aria-pressed`.
 * - Nudging is reachable three ways: click the water, press the Nudge button,
 *   or use arrow keys once the scene has focus.
 * - Reduced motion stops the waves but keeps the scene and its controls.
 */
export function SeaScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<SeaSceneHandle | null>(null);
  const [loadState, setLoadState] = useState<Status>('idle');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');

  const blocked = useSyncExternalStore(subscribeNever, getClient, getServer);
  const reduced = useSyncExternalStore(subscribeReducedMotion, prefersReducedMotion, () => false);
  const status: Status = blocked ? 'unsupported' : loadState;
  const reason = blocked ?? loadError;

  useEffect(() => {
    if (blocked) return;

    let cancelled = false;
    let started = false;

    const begin = () => {
      if (started || cancelled) return;
      started = true;
      observer.disconnect();
      window.clearTimeout(timer);
      setLoadState('loading');

      import('../lib/seaScene')
        .then(({ createSeaScene }) => {
          if (cancelled || !containerRef.current) return null;
          return createSeaScene(containerRef.current, {
            modelUrl: href('/models/buoy.glb'),
            // The hull is widest below this height, so the buoy sits low and
            // stable rather than perched on the surface.
            waterline: 0.42,
            timeOfDay: 'day',
            reducedMotion: prefersReducedMotion(),
            quality: detectQuality(),
          });
        })
        .then((created) => {
          if (cancelled) {
            created?.dispose();
            return;
          }
          if (!created) return;
          handleRef.current = created;
          setLoadState('ready');
        })
        .catch((err) => {
          if (cancelled) return;
          console.error('[sea] failed to load', err);
          setLoadError('The 3D scene could not be loaded.');
          setLoadState('error');
        });
    };

    const observer = new IntersectionObserver(([e]) => e.isIntersecting && begin(), { rootMargin: '300px 0px' });
    if (containerRef.current) observer.observe(containerRef.current);

    // IntersectionObserver delivery rides the frame lifecycle; measure directly
    // as a backstop so a throttled loop cannot leave this pending forever.
    const timer = window.setTimeout(() => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect && rect.top < window.innerHeight * 2.5 && rect.bottom > -window.innerHeight) begin();
    }, 2500);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.clearTimeout(timer);
      handleRef.current?.dispose();
      handleRef.current = null;
    };
  }, [blocked]);

  const toggleTime = useCallback(() => {
    setTimeOfDay((current) => {
      const next: TimeOfDay = current === 'day' ? 'night' : 'day';
      handleRef.current?.setTimeOfDay(next);
      return next;
    });
  }, []);

  const onPointerDown = useCallback((event: React.PointerEvent) => {
    handleRef.current?.nudgeFromPointer(event.clientX, event.clientY, 1);
  }, []);

  // Cycles direction so repeated presses do not simply reinforce one axis.
  const nudgeCount = useRef(0);
  const nudgeButton = useCallback(() => {
    const angle = (nudgeCount.current += 1) * 2.4;
    handleRef.current?.nudge(Math.cos(angle), Math.sin(angle), 1);
  }, []);

  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    const h = handleRef.current;
    if (!h) return;
    const map: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const dir = map[event.key];
    if (!dir) return;
    h.nudge(dir[0], dir[1], 1);
    event.preventDefault();
  }, []);

  const live = status === 'ready';

  return (
    <section className="sea section" id="buoy" aria-labelledby="sea-title" data-domain="worlds" data-status={status}>
      <div className="shell shell--media sea__inner">
        <div className="sea__text">
          <p className="eyebrow">Real-time</p>
          <h2 id="sea-title">A buoy, afloat</h2>
          <p>
            My buoy model placed in a real-time sea. The water is a sum of four directional waves evaluated on the GPU,
            and the buoy reads that same wave function to find its height and the slope beneath it — so it rides the
            surface actually being drawn.
          </p>
          <p>
            Push it and it behaves like a moored buoy rather than a prop on a turntable: the submerged hull generates a
            restoring moment proportional to its tilt, so it swings past upright, overshoots, and settles.
          </p>

          <div className="sea__controls">
            <button type="button" className="btn" onClick={toggleTime} aria-pressed={timeOfDay === 'night'}>
              {timeOfDay === 'night' ? 'Night' : 'Day'}
              <span className="btn__meta" aria-hidden="true">
                toggle
              </span>
            </button>
            <button type="button" className="btn" onClick={nudgeButton} disabled={!live}>
              Nudge the buoy
            </button>
          </div>

          {live && (
            <p className="sea__hint">
              Click the water to push it from that side. With the scene focused, arrow keys nudge it too.
            </p>
          )}
          {reduced && live && (
            <p className="sea__hint">Reduced motion is on, so the swell is paused — nudges still play out.</p>
          )}
          {(status === 'unsupported' || status === 'error') && reason && <p className="sea__hint">{reason}</p>}

          <p className="model__download">
            <a href={href('/models/buoy.glb')} download>
              Download the buoy model (glTF binary, 315&nbsp;kB)
            </a>
          </p>
        </div>

        <div
          className="sea__stage"
          data-live={live}
          tabIndex={live ? 0 : -1}
          role={live ? 'application' : undefined}
          aria-label={live ? 'Buoy at sea. Click or use arrow keys to push the buoy.' : undefined}
          onPointerDown={live ? onPointerDown : undefined}
          onKeyDown={onKeyDown}
        >
          <div className="sea__canvas" ref={containerRef} aria-hidden="true" />
          {status === 'loading' && (
            <p className="sea__state" role="status">
              Loading the scene…
            </p>
          )}
          {(status === 'unsupported' || status === 'error') && (
            <p className="sea__state">{reason ?? '3D scene unavailable.'}</p>
          )}
        </div>
      </div>
    </section>
  );
}
