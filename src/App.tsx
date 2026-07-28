import { useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { CaseStudy } from './pages/CaseStudy';
import { NotFound } from './pages/NotFound';
import { useRouter } from './lib/router';
import { initMotion, resetMotion } from './lib/motion';
import './styles/app.css';

/** Resolves an app path to a page. Routes are prerendered; this only mirrors them. */
function resolve(path: string) {
  if (path === '/') return <Home />;

  const work = path.match(/^\/work\/([a-z0-9-]+)\/$/);
  if (work) return <CaseStudy slug={work[1]} />;

  return <NotFound />;
}

export function App() {
  const { path } = useRouter();

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
