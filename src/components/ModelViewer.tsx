import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { ModelEntry } from '../content/models';
import type { ModelViewerHandle } from '../lib/modelViewer';
import { Picture } from './Picture';
import { href } from '../lib/router';

type Status = 'idle' | 'loading' | 'ready' | 'error' | 'unsupported';

/**
 * Decides whether WebGL model viewing should be attempted at all.
 * Returns a reason string when it should not, so the UI can say something
 * truthful instead of silently showing a still.
 */
function unsupportedReason(): string | null {
  // Only ever called on the client; SSR is handled by getServerReason.
  if (typeof window === 'undefined') return null;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'Reduced motion is enabled, so the interactive view is turned off.';
  }
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (connection?.saveData) return 'Data Saver is on, so the 3D model was not downloaded.';
  if (connection?.effectiveType && /(^|-)2g$/.test(connection.effectiveType)) {
    return 'Connection is too slow to download the 3D model.';
  }
  try {
    const probe = document.createElement('canvas');
    if (!(probe.getContext('webgl2') ?? probe.getContext('webgl'))) {
      return 'This browser does not support WebGL.';
    }
  } catch {
    return 'This browser does not support WebGL.';
  }
  return null;
}

/**
 * Capability detection, exposed as an external store.
 *
 * The answer depends on browser APIs that do not exist during prerendering, so
 * it cannot be computed in a state initialiser without a hydration mismatch —
 * and computing it in an effect would mean setting state from an effect body.
 * `useSyncExternalStore` is the sanctioned way to read a browser-only value:
 * the server snapshot renders the neutral state, and the client corrects it on
 * hydration.
 *
 * The result is cached because `getSnapshot` may be called repeatedly and must
 * be cheap and stable.
 */
let cachedReason: string | null | undefined;

function subscribeNever() {
  // The answer cannot change without a reload, so there is nothing to subscribe to.
  return () => {};
}

function getClientReason(): string | null {
  if (cachedReason === undefined) cachedReason = unsupportedReason();
  return cachedReason;
}

function getServerReason(): string | null {
  return null;
}

/**
 * Manifest-driven 3D viewer.
 *
 * Accessibility contract:
 * - The canvas is `aria-hidden`; the entry's `description` is the text
 *   equivalent and is always rendered, whether or not WebGL runs.
 * - Every camera action has a keyboard control, exposed as real buttons.
 * - Hotspots are buttons in the DOM, reachable by Tab, whose text is readable
 *   even if projection never runs.
 * - Nothing here is required to understand the case study.
 */
export function ModelViewer({ entry }: { entry: ModelEntry }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<ModelViewerHandle | null>(null);
  const [loadState, setLoadState] = useState<Status>('idle');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [spots, setSpots] = useState<Record<string, { x: number; y: number; visible: boolean }>>({});

  const blocked = useSyncExternalStore(subscribeNever, getClientReason, getServerReason);

  // Capability refusal outranks load progress: if WebGL is unavailable there is
  // nothing to load, and the reason should be shown instead.
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
      window.clearTimeout(fallbackTimer);
      setLoadState('loading');

      Promise.all([import('../lib/modelViewer'), Promise.resolve()])
        .then(async ([mod]) => {
          if (cancelled || !containerRef.current) return null;
          const quality = mod.detectQuality();
          return mod.createModelViewer(containerRef.current, entry, import.meta.env.BASE_URL, quality);
        })
        .then((created) => {
          if (cancelled) {
            created?.dispose();
            return;
          }
          if (!created) return;
          handleRef.current = created;
          created.onHotspotMove(setSpots);
          setLoadState('ready');
        })
        .catch((err) => {
          if (cancelled) return;
          console.error('[model] failed to load', entry.id, err);
          setLoadError('The 3D model could not be loaded.');
          setLoadState('error');
        });
    };

    // Load only when the viewer is near the viewport — a model far down a long
    // page should not compete with anything above it.
    const observer = new IntersectionObserver(([e]) => e.isIntersecting && begin(), { rootMargin: '300px 0px' });
    if (containerRef.current) observer.observe(containerRef.current);

    // IntersectionObserver delivery rides the frame lifecycle, so a throttled
    // loop could leave it pending forever. Measure directly as a backstop.
    const fallbackTimer = window.setTimeout(() => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect && rect.top < window.innerHeight * 2.5 && rect.bottom > -window.innerHeight) begin();
    }, 2500);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.clearTimeout(fallbackTimer);
      handleRef.current?.dispose();
      handleRef.current = null;
    };
  }, [entry, blocked]);

  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    const h = handleRef.current;
    if (!h) return;
    const step = event.shiftKey ? 15 : 6;
    switch (event.key) {
      case 'ArrowLeft':
        h.rotateBy(-step, 0);
        break;
      case 'ArrowRight':
        h.rotateBy(step, 0);
        break;
      case 'ArrowUp':
        h.rotateBy(0, step);
        break;
      case 'ArrowDown':
        h.rotateBy(0, -step);
        break;
      case '+':
      case '=':
        h.zoomBy(0.88);
        break;
      case '-':
      case '_':
        h.zoomBy(1.14);
        break;
      case '0':
        h.resetView();
        break;
      default:
        return;
    }
    event.preventDefault();
  }, []);

  const interactive = status === 'ready' && entry.interaction === 'orbit';

  return (
    <section className="model" aria-labelledby={`model-${entry.id}`} data-status={status}>
      <div className="model__text">
        <p className="eyebrow">
          {entry.status === 'placeholder' ? 'Pipeline placeholder' : 'Interactive model'}
        </p>
        <h3 id={`model-${entry.id}`}>{entry.title}</h3>
        {/* The description is the accessible equivalent of the canvas and is
            always present, in every state. */}
        <p>{entry.description}</p>

        {entry.hotspots && entry.hotspots.length > 0 && (
          <ul className="model__legend">
            {entry.hotspots.map((hotspot) => (
              <li key={hotspot.id}>
                <strong>{hotspot.label}</strong> — {hotspot.description}
              </li>
            ))}
          </ul>
        )}

        {interactive && (
          <p className="model__hint">
            Drag to orbit. With the viewer focused: arrow keys rotate, <kbd>+</kbd>/<kbd>−</kbd> zoom, <kbd>0</kbd>{' '}
            resets. Scrolling always moves the page.
          </p>
        )}
        {(status === 'unsupported' || status === 'error') && reason && <p className="model__hint">{reason}</p>}
        {entry.credits && <p className="model__credits">{entry.credits}</p>}
        <p className="model__download">
          <a href={`${href(entry.src)}`} download>
            Download the model (glTF binary)
          </a>
        </p>
      </div>

      <figure className="model__stage-wrap">
        <div
          className="model__stage"
          data-interactive={interactive}
          // Focusable so keyboard users can reach the camera controls.
          tabIndex={interactive ? 0 : -1}
          role={interactive ? 'application' : undefined}
          aria-label={interactive ? `${entry.title}. Interactive 3D view. Use arrow keys to rotate.` : undefined}
          onKeyDown={onKeyDown}
        >
          {/* Fallback still: shown until the model is ready, and permanently
              whenever WebGL is unavailable or the load failed. */}
          {status !== 'ready' && entry.fallbackImage && (
            <div className="model__fallback">
              <Picture id={entry.fallbackImage} sizes="(min-width: 62rem) 50vw, 100vw" />
            </div>
          )}
          {status === 'loading' && (
            <p className="model__state" role="status">
              Loading model…
            </p>
          )}
          {status !== 'ready' && !entry.fallbackImage && status !== 'loading' && (
            <p className="model__state">{reason ?? '3D view unavailable.'}</p>
          )}

          <div className="model__canvas" ref={containerRef} aria-hidden="true" />

          {status === 'ready' &&
            entry.hotspots?.map((hotspot) => {
              const pos = spots[hotspot.id];
              if (!pos?.visible) return null;
              return (
                <button
                  key={hotspot.id}
                  type="button"
                  className="model__hotspot"
                  style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
                  aria-expanded={activeHotspot === hotspot.id}
                  onClick={() => setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)}
                >
                  <span className="visually-hidden">{hotspot.label}: </span>
                  <span aria-hidden="true">+</span>
                  {activeHotspot === hotspot.id && <span className="model__tip">{hotspot.description}</span>}
                </button>
              );
            })}
        </div>
        {entry.status === 'placeholder' && (
          <figcaption className="model__warning">
            Placeholder geometry — pipeline verification only, not portfolio artwork. Replace via{' '}
            <code>src/content/models.ts</code>.
          </figcaption>
        )}
      </figure>
    </section>
  );
}
