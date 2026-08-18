import { useEffect, useState, useSyncExternalStore } from 'react';
import { Link, useRouter, href } from '../lib/router';
import { profile } from '../content/profile';
import { trackList, tracks, otherTrack } from '../content/tracks';
import { trackRank } from '../content/projectEvidence';
import type { Track } from '../content/types';

const NAV = [
  { label: 'Work', hash: '#work' },
  { label: 'Capabilities', hash: '#capabilities' },
  { label: 'Experience', hash: '#experience' },
  { label: 'About', hash: '#about' },
];

const STORE_KEY = 'vt:track';

/** The track a case study belongs to. A project on both resolves to the first. */
function trackForSlug(slug: string): Track | null {
  const hit = trackList.find((t) => trackRank[t.id][slug] !== undefined);
  return hit ? hit.id : null;
}

/** Reads the remembered track without tearing during hydration. */
function readStoredTrack(): Track | null {
  try {
    return window.sessionStorage.getItem(STORE_KEY) as Track | null;
  } catch {
    return null;
  }
}

function subscribeStorage(onChange: () => void) {
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
}

/**
 * Which track the header should navigate back into.
 *
 * On a track page it is that track. On a case study it is the track the project
 * belongs to — except that a project shown on both tracks would always send the
 * visitor to the first one, which is wrong for anyone who arrived from the
 * other. So the chosen track is remembered for the session and preferred when
 * the project is actually on it.
 *
 * The stored value is read through useSyncExternalStore with a null server
 * snapshot, so the prerendered HTML and the first client render agree and the
 * preference only takes effect once hydrated.
 */
function useActiveTrack(path: string): Track | null {
  const onTrack = trackList.find((t) => t.path === path);
  const work = path.match(/^\/work\/([a-z0-9-]+)\/$/);
  const derived = onTrack ? onTrack.id : work ? trackForSlug(work[1]) : null;

  const stored = useSyncExternalStore(subscribeStorage, readStoredTrack, () => null);

  // Remember the choice for the rest of the session. A write, not a state
  // update — the value this component renders from is derived below.
  useEffect(() => {
    if (!onTrack) return;
    try {
      window.sessionStorage.setItem(STORE_KEY, onTrack.id);
    } catch {
      /* private mode — the derived fallback is still correct */
    }
  }, [onTrack]);

  if (onTrack) return onTrack.id;
  if (stored && work && trackRank[stored]?.[work[1]] !== undefined) return stored;
  return derived;
}

export function Header() {
  const { path } = useRouter();
  const active = useActiveTrack(path);
  const onTrackPage = trackList.some((t) => t.path === path);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Section anchors resolve against the active track page. From a case study
  // they have to jump back to it first, otherwise the anchor points at a page
  // that has no such section.
  const base = active ? href(tracks[active].path) : '';
  const anchor = (hash: string) => (onTrackPage ? hash : `${base}${hash}`);

  return (
    <header className="site-header" data-scrolled={scrolled}>
      <div className="shell site-header__inner">
        <Link to="/" className="wordmark" aria-label={`${profile.name} — choose a portfolio`}>
          <b>Vishnu Vardhan Tekkem</b>
          <span>{active ? tracks[active].label : profile.shortRole}</span>
        </Link>

        {active && (
          <nav className="site-nav" aria-label="Primary">
            <ul className="site-nav__links">
              {NAV.map((item) => (
                <li key={item.hash}>
                  <a href={anchor(item.hash)}>{item.label}</a>
                </li>
              ))}
            </ul>

            {/* Present on every track and case-study page so a reviewer who
                picked the wrong path can correct it without going back. */}
            <Link
              className="track-switch"
              to={otherTrack(active).path}
              title={`Switch to the ${otherTrack(active).label.toLowerCase()} portfolio`}
            >
              <span className="track-switch__label">Switch portfolio</span>
              <span className="track-switch__to">{otherTrack(active).label}</span>
            </Link>

            <a className="btn" href={anchor('#contact')}>
              Get in touch
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
