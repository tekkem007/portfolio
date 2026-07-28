import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import { Router, toAppPath } from './lib/router';

/**
 * Client entry.
 *
 * Every route ships as prerendered HTML, so the normal path here is hydration.
 * `createRoot` is only used if the container is somehow empty (for example when
 * running `vite dev`, which serves the raw template).
 */
const container = document.getElementById('root');

if (container) {
  const path = toAppPath(window.location.pathname);

  const tree = (
    <StrictMode>
      <Router initialPath={path}>
        <App />
      </Router>
    </StrictMode>
  );

  if (container.hasChildNodes()) {
    hydrateRoot(container, tree);
  } else {
    createRoot(container).render(tree);
  }
}
