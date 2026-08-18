/**
 * Turns the SPA build into real static HTML — one index.html per route.
 *
 * Why this exists: GitHub Pages serves files, not routes. Prerendering means
 * https://tekkem007.github.io/work/maintenance-hangar/ is an actual file on
 * disk, so a direct hit, a hard refresh, a crawler and a JavaScript-disabled
 * browser all get complete HTML with no redirect shim and no hash in the URL.
 *
 * Runs after `vite build` and `vite build --ssr`, both of which the npm
 * `build` script invokes first.
 */
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = resolve(ROOT, 'dist');
const SSR_ENTRY = resolve(ROOT, 'dist-ssr', 'entry-server.js');

/** Minimal HTML entity escaping for values interpolated into attributes. */
function escapeAttr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** JSON-LD must not be able to break out of its script element. */
function escapeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

/**
 * Preload links for the fonts used above the fold.
 *
 * Fonts referenced from a stylesheet are only discovered after the CSS has been
 * fetched and parsed, so the heading and body text swap late and LCP suffers.
 * Preloading starts them in parallel with the stylesheet instead. Only the two
 * families that render immediately are preloaded; JetBrains Mono is small-label
 * decoration and can arrive whenever it likes.
 */
async function fontPreloads(base) {
  let files = [];
  try {
    files = await readdir(resolve(DIST, 'assets'));
  } catch {
    return '';
  }
  const wanted = ['space-grotesk', 'inter-latin'];
  return files
    .filter((f) => f.endsWith('.woff2') && wanted.some((w) => f.startsWith(w)))
    .map(
      (f) =>
        `<link rel="preload" as="font" type="font/woff2" crossorigin href="${base}assets/${f}" />`,
    )
    .join('\n    ');
}

function buildHead(route) {
  const tags = [
    `<title>${escapeAttr(route.title)}</title>`,
    `<meta name="description" content="${escapeAttr(route.description)}" />`,
    `<link rel="canonical" href="${escapeAttr(route.canonical)}" />`,

    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Vishnu Vardhan Tekkem" />`,
    `<meta property="og:title" content="${escapeAttr(route.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(route.description)}" />`,
    `<meta property="og:url" content="${escapeAttr(route.canonical)}" />`,
    `<meta property="og:image" content="${escapeAttr(route.image)}" />`,
    `<meta property="og:image:alt" content="${escapeAttr(route.title)}" />`,

    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(route.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(route.image)}" />`,

    `<script type="application/ld+json">${escapeJsonLd(route.jsonLd)}</script>`,
  ];

  if (route.noIndex) {
    tags.unshift('<meta name="robots" content="noindex" />');
  }

  return tags.join('\n    ');
}

async function main() {
  const template = await readFile(resolve(DIST, 'index.html'), 'utf8');
  const { render, routeManifest } = await import(pathToFileURL(SSR_ENTRY).href);

  // Derived from the built stylesheet link so it tracks Vite's `base` rather
  // than hardcoding the project-site prefix in a second place.
  const cssHref = template.match(/href="([^"]*)assets\/index-[^"]*\.css"/);
  const assetBase = cssHref ? cssHref[1] : '/';
  const preloads = await fontPreloads(assetBase);

  for (const route of routeManifest) {
    const appHtml = render(route.path);
    const html = template
      .replace('<!--app-head-->', `${preloads}\n    ${buildHead(route)}`)
      .replace('<!--app-html-->', appHtml)
      .replace(
        '<html lang="en">',
        `<html lang="en" data-route="${escapeAttr(route.path)}"${
          route.theme ? ` data-theme="${escapeAttr(route.theme)}"` : ''
        }>`,
      );

    const outFile = resolve(DIST, route.file);
    await mkdir(dirname(outFile), { recursive: true });
    await writeFile(outFile, html, 'utf8');
    process.stdout.write(`  prerendered ${route.file}\n`);
  }

  // Sitemap covering every indexable route.
  const indexable = routeManifest.filter((route) => !route.noIndex);
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...indexable.map((route) => `  <url><loc>${route.canonical}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');
  await writeFile(resolve(DIST, 'sitemap.xml'), sitemap, 'utf8');

  // .nojekyll stops GitHub Pages running the output through Jekyll, which would
  // otherwise drop any file or directory beginning with an underscore.
  await writeFile(resolve(DIST, '.nojekyll'), '', 'utf8');

  console.log(`prerender: ${routeManifest.length} routes, sitemap.xml and .nojekyll written.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
