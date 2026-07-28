import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Deployed as a GitHub Pages *user site* (tekkem007.github.io), so the site is
 * served from the domain root and needs no base prefix.
 *
 * If this is ever moved to a project site (tekkem007.github.io/<repo>/), change
 * `base` to '/<repo>/' — every asset URL and internal link is derived from
 * import.meta.env.BASE_URL, so that single change is sufficient.
 */
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    // Three.js is dynamically imported by the hero, so Rollup already splits it
    // into its own chunk. Raising the warning limit keeps the build output quiet
    // about that intentional chunk.
    chunkSizeWarningLimit: 700,
  },
});
