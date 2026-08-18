import { useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Landing } from './pages/Landing';
import { Track } from './pages/Track';
import { CaseStudy } from './pages/CaseStudy';
import { NotFound } from './pages/NotFound';
import { useRouter } from './lib/router';
import { trackForPath } from './content/tracks';
import { routeManifest } from './routes';
import { initMotion, resetMotion } from './lib/motion';
import './styles/app.css';

/** Resolves an app path to a page. Routes are prerendered; this only mirrors them. */
function resolve(path: string) {
  if (path === '/') return <Landing />;

  const track = trackForPath(path);
  if (track) return <Track track={track.id} />;

  const work = path.match(/^\/work\/([a-z0-9-]+)\/$/);
  if (work) return <CaseStudy slug={work[1]} />;

  return <NotFound />;
}

export function App() {
  const { path } = useRouter();

  // Client-side navigation replaces the page without reloading it, so the head
  // has to be updated by hand. Without this the title and description stay on
  // whichever route was server-rendered first, which misreports the page to
  // screen readers announcing the route change and to anything reading the tab.
  useEffect(() => {
    const route = routeManifest.find((r) => r.path === path);
    if (!route) return;
    document.title = route.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', route.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', route.canonical);
  }, [path]);

  useEffect(() => {
    let cancelled = false;
    // Defer reveals past first paint; they are an enhancement, not layout.
    const id = window.setTimeout(() => {
      if (!cancelled) void initMotion();
    }, 60);

    return () => {
      cancelled = true;
      window.clearTimeout(id);
      void resetMotion();
    };
  }, [path]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      {/* tabIndex -1 lets the router move focus here on navigation without
          adding the element to the tab order. */}
      <main id="main" tabIndex={-1}>
        {resolve(path)}
      </main>
      <Footer />
    </>
  );
}
