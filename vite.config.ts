import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Deployed as a GitHub Pages *project site* at
 * https://tekkem007.github.io/portfolio/, so everything is served from the
 * /portfolio/ prefix rather than the domain root.
 *
 * `base` is the single source of truth for that prefix: every asset URL and
 * internal link is derived from import.meta.env.BASE_URL. If the repository is
 * ever renamed, change this value, `SITE_URL` in src/content/profile.ts, the
 * paths in public/site.webmanifest, and the Sitemap line in public/robots.txt.
 */
export default defineConfig({
  base: '/portfolio/',
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
