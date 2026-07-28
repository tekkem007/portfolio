import { renderToString } from 'react-dom/server';
import { App } from './App';
import { Router } from './lib/router';

/**
 * Server entry used only at build time by scripts/prerender.mjs.
 *
 * Renders a single route to a static HTML string, which the prerender script
 * injects into the Vite-built template to produce a real index.html per route.
 */
export function render(path: string): string {
  return renderToString(
    <Router initialPath={path}>
      <App />
    </Router>,
  );
}

export { routeManifest } from './routes';
