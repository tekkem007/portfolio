/**
 * Serves dist/ the way GitHub Pages does, for verifying the production build.
 *
 * Deliberately mimics Pages' behaviour rather than a friendly dev server:
 *  - `/path/` resolves to `/path/index.html`
 *  - `/path` (no trailing slash) 301-redirects to `/path/` if the directory exists
 *  - anything unmatched returns 404 with the contents of 404.html
 *  - text responses are gzipped, as Pages does
 *
 * That last one matters for benchmarking. Without it Lighthouse reports a large
 * "enable text compression" opportunity that does not exist in production, and
 * every local score reads 12-15 points below the deployed site — which makes
 * local before/after comparisons of anything CSS- or JS-sized meaningless.
 *
 * That means a route that works here works on Pages, and a route that only
 * works under a permissive dev server fails here first.
 */
import { createReadStream } from 'node:fs';
import { stat, readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createGzip } from 'node:zlib';
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
  '.woff2': 'font/woff2',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.ktx2': 'image/ktx2',
  '.bin': 'application/octet-stream',
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

/** Text formats Pages compresses. Images and fonts are already compressed. */
const COMPRESSIBLE = new Set([
  'text/html; charset=utf-8',
  'text/javascript; charset=utf-8',
  'text/css; charset=utf-8',
  'application/json; charset=utf-8',
  'image/svg+xml',
  'application/xml; charset=utf-8',
  'text/plain; charset=utf-8',
]);

/**
 * Streams a file, gzipping it when the client asked and the type benefits.
 *
 * content-length is dropped for compressed responses: the byte count is only
 * known after compression, and chunked is what a real CDN sends anyway.
 */
function sendFile(req, res, path, type, size) {
  const wantsGzip = /\bgzip\b/.test(req.headers['accept-encoding'] ?? '');
  const shouldGzip = wantsGzip && COMPRESSIBLE.has(type);

  const headers = { 'content-type': type, 'accept-ranges': 'bytes', vary: 'accept-encoding' };
  if (shouldGzip) headers['content-encoding'] = 'gzip';
  else if (size !== undefined) headers['content-length'] = size;

  res.writeHead(200, headers);
  const stream = createReadStream(path);
  if (shouldGzip) stream.pipe(createGzip()).pipe(res);
  else stream.pipe(res);
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
      sendFile(req, res, index, TYPES['.html']);
      return;
    }
  }

  if (info?.isFile()) {
    const type = TYPES[extname(target)] ?? 'application/octet-stream';

    // Range support. GitHub Pages serves byte ranges, and video seeking depends
    // on it — without this, local playback can only stream from the start and
    // the preview stops being an honest rehearsal of production.
    const range = req.headers.range;
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (match) {
        const size = info.size;
        const start = match[1] ? Number(match[1]) : 0;
        const end = match[2] ? Number(match[2]) : size - 1;

        if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= size) {
          res.writeHead(416, { 'content-range': `bytes */${size}` }).end();
          return;
        }

        res.writeHead(206, {
          'content-type': type,
          'content-range': `bytes ${start}-${end}/${size}`,
          'accept-ranges': 'bytes',
          'content-length': end - start + 1,
        });
        createReadStream(target, { start, end }).pipe(res);
        return;
      }
    }

    sendFile(req, res, target, type, info.size);
    return;
  }

  const notFound = resolve(DIST, '404.html');
  const body = (await statOrNull(notFound)) ? await readFile(notFound) : 'Not found';
  res.writeHead(404, { 'content-type': TYPES['.html'] }).end(body);
});

server.listen(PORT, () => {
  console.log(`Serving dist/ in GitHub Pages mode → http://localhost:${PORT}${BASE}/`);
});
