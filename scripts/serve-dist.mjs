/**
 * Serves dist/ the way GitHub Pages does, for verifying the production build.
 *
 * Deliberately mimics Pages' behaviour rather than a friendly dev server:
 *  - `/path/` resolves to `/path/index.html`
 *  - `/path` (no trailing slash) 301-redirects to `/path/` if the directory exists
 *  - anything unmatched returns 404 with the contents of 404.html
 *
 * That means a route that works here works on Pages, and a route that only
 * works under a permissive dev server fails here first.
 */
import { createReadStream } from 'node:fs';
import { stat, readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = resolve(ROOT, 'dist');
const PORT = Number(process.env.PORT ?? 4173);

/**
 * The site deploys to a project-site subpath, so dist/ is mounted under that
 * same prefix here. Anything outside it 404s exactly as it would on Pages,
 * which is what catches a stray root-absolute URL before it ships.
 */
const BASE = (process.env.BASE_PATH ?? '/portfolio').replace(/\/$/, '');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

async function statOrNull(path) {
  try {
    return await stat(path);
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  const rawPath = decodeURIComponent(url.pathname);

  // Nudge a bare root hit to the deployed prefix, mirroring how the site is
  // only reachable under /<repo>/ on Pages.
  if (BASE && (rawPath === '/' || rawPath === '')) {
    res.writeHead(302, { location: `${BASE}/` }).end();
    return;
  }

  // Everything outside the base prefix does not exist on a project site.
  if (BASE && !rawPath.startsWith(`${BASE}/`) && rawPath !== BASE) {
    res.writeHead(404, { 'content-type': TYPES['.html'] }).end('Not found (outside base path)');
    return;
  }

  const pathname = BASE ? rawPath.slice(BASE.length) || '/' : rawPath;

  // Block traversal outside dist/.
  const target = resolve(DIST, `.${normalize(pathname)}`);
  if (!target.startsWith(DIST)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  const info = await statOrNull(target);

  if (info?.isDirectory()) {
    if (!rawPath.endsWith('/')) {
      // Redirect using the request path, so the base prefix survives.
      res.writeHead(301, { location: `${rawPath}/` }).end();
      return;
    }
    const index = join(target, 'index.html');
    if (await statOrNull(index)) {
      res.writeHead(200, { 'content-type': TYPES['.html'] });
      createReadStream(index).pipe(res);
      return;
    }
  }

  if (info?.isFile()) {
    res.writeHead(200, { 'content-type': TYPES[extname(target)] ?? 'application/octet-stream' });
    createReadStream(target).pipe(res);
    return;
  }

  const notFound = resolve(DIST, '404.html');
  const body = (await statOrNull(notFound)) ? await readFile(notFound) : 'Not found';
  res.writeHead(404, { 'content-type': TYPES['.html'] }).end(body);
});

server.listen(PORT, () => {
  console.log(`Serving dist/ in GitHub Pages mode → http://localhost:${PORT}${BASE}/`);
});
