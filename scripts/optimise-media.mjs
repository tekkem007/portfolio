/**
 * Turns the downloads in media-src/ into responsive AVIF + WebP + JPEG
 * derivatives under public/media/, and writes src/content/media.generated.json
 * with the real intrinsic dimensions of every output.
 *
 * The app imports that manifest at build time so every <img> ships explicit
 * width/height and cannot cause layout shift.
 */
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { MEDIA, WIDTHS } from './media-manifest.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = resolve(ROOT, 'media-src');
const OUT_DIR = resolve(ROOT, 'public', 'media');

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const available = await readdir(SRC_DIR);

  /** @type {Record<string, unknown>} */
  const manifest = {};

  for (const item of MEDIA) {
    const file = available.find((f) => f.replace(/\.[^.]+$/, '') === item.id);
    if (!file) {
      console.warn(`  ! missing source for ${item.id} — run 'node scripts/fetch-media.mjs' first`);
      continue;
    }

    const input = resolve(SRC_DIR, file);
    const meta = await sharp(input).metadata();
    const naturalWidth = meta.width ?? item.w;
    const naturalHeight = meta.height ?? item.h;
    const aspect = naturalHeight / naturalWidth;

    // Never upscale: cap the generated widths at the source width.
    const widths = WIDTHS.filter((w) => w <= naturalWidth);
    if (widths.length === 0) widths.push(naturalWidth);

    /** @type {{ avif: string[], webp: string[] }} */
    const sources = { avif: [], webp: [] };

    for (const w of widths) {
      const pipeline = sharp(input).resize({ width: w, withoutEnlargement: true });

      await pipeline.clone().avif({ quality: 52, effort: 6 }).toFile(resolve(OUT_DIR, `${item.id}-${w}.avif`));
      await pipeline.clone().webp({ quality: 74 }).toFile(resolve(OUT_DIR, `${item.id}-${w}.webp`));

      sources.avif.push(`/media/${item.id}-${w}.avif ${w}w`);
      sources.webp.push(`/media/${item.id}-${w}.webp ${w}w`);
    }

    // Baseline JPEG so the page still shows something on very old browsers.
    const fallbackWidth = Math.min(1200, naturalWidth);
    await sharp(input)
      .resize({ width: fallbackWidth, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(resolve(OUT_DIR, `${item.id}.jpg`));

    manifest[item.id] = {
      alt: item.alt,
      width: naturalWidth,
      height: naturalHeight,
      aspect: Number(aspect.toFixed(4)),
      fallback: `/media/${item.id}.jpg`,
      avif: sources.avif.join(', '),
      webp: sources.webp.join(', '),
    };

    process.stdout.write(`  optimised ${item.id} (${widths.join('/')})\n`);
  }

  const manifestPath = resolve(ROOT, 'src', 'content', 'media.generated.json');
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(
    `optimise-media: wrote ${Object.keys(manifest).length} entries to src/content/media.generated.json`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
