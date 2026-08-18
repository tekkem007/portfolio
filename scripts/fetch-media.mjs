/**
 * Downloads the source images listed in media-manifest.mjs into media-src/.
 *
 * Run via `npm run media`. Downloads are skipped when the file already exists,
 * so re-running is cheap. media-src/ is gitignored — only the optimised
 * derivatives in public/media/ are committed.
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MEDIA, VIDEOS } from './media-manifest.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = resolve(ROOT, 'media-src');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await mkdir(SRC_DIR, { recursive: true });

  let downloaded = 0;
  let skipped = 0;

  for (const item of MEDIA) {
    // Generated entries have no URL to fetch: a script in this repo produces
    // them, and `npm run media` runs those generators before this step.
    if (item.generated) {
      skipped += 1;
      continue;
    }

    // `local` entries are files placed into media-src/ by hand rather than
    // downloaded — work that has not been published anywhere public yet, so
    // there is no URL to fetch. Their `src` records where the published copy
    // will live; drop the flag once it does.
    if (item.local) {
      skipped += 1;
      continue;
    }

    const ext = new URL(item.src).pathname.split('.').pop() ?? 'jpg';
    const dest = resolve(SRC_DIR, `${item.id}.${ext}`);

    if (await exists(dest)) {
      skipped += 1;
      continue;
    }

    const res = await fetch(item.src, { headers: { 'user-agent': UA } });
    if (!res.ok) {
      throw new Error(`Failed to download ${item.id}: HTTP ${res.status} ${item.src}`);
    }
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    downloaded += 1;
    process.stdout.write(`  downloaded ${item.id}\n`);
  }

  // Videos go straight into public/media: there is no derivative step for them,
  // so the downloaded file IS the shipped file.
  const VIDEO_DIR = resolve(ROOT, 'public', 'media');
  await mkdir(VIDEO_DIR, { recursive: true });

  for (const video of VIDEOS) {
    if (video.local) {
      skipped += 1;
      continue;
    }
    const dest = resolve(VIDEO_DIR, `${video.id}.mp4`);
    if (await exists(dest)) {
      skipped += 1;
      continue;
    }
    const res = await fetch(video.src, { headers: { 'user-agent': UA } });
    if (!res.ok) {
      throw new Error(`Failed to download video ${video.id}: HTTP ${res.status} ${video.src}`);
    }
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    downloaded += 1;
    process.stdout.write(`  downloaded ${video.id}.mp4\n`);
  }

  console.log(`fetch-media: ${downloaded} downloaded, ${skipped} already present.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
