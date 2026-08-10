/**
 * Generates the GPU frame-time chart used by the performance-audit case study.
 *
 * This is the one image on the site that is NOT downloaded from a public URL,
 * because it is not a photograph or a render — it is a plot of measured data.
 * The numbers below are transcribed from the audit's own CsvProfiler output
 * (`PerformanceAudit/Iterations/Iteration_16_definitive/gpu_pass_deltas.csv`),
 * which averaged 2 400-frame captures across five fixed camera positions.
 *
 * Keeping it as a script rather than a committed binary means the chart can
 * never drift from the numbers quoted in the case-study prose: both come from
 * this file, and changing a number here changes the picture.
 *
 * The scene being measured is Epic's free Windmill Valley sample content, not
 * artwork by the site owner. Nothing in this chart depicts third-party art.
 *
 * Run via `npm run media` (or `node scripts/make-perf-chart.mjs`).
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(ROOT, 'media-src');
const OUT = resolve(OUT_DIR, 'perf-audit-passes.png');

/** Mean GPU milliseconds per pass, averaged over all five benchmark cameras. */
const PASSES = [
  { name: 'TemporalSuperResolution', before: 5.834, after: 3.697 },
  { name: 'ShadowDepths', before: 3.7, after: 2.631 },
  { name: 'RenderDeferredLighting', before: 3.574, after: 0.961 },
  { name: 'Basepass', before: 2.833, after: 2.805 },
  { name: 'RenderVelocities', before: 2.648, after: 0.051 },
  { name: 'ShadowProjection', before: 2.613, after: 3.091 },
  { name: 'Translucency', before: 1.327, after: 0.421 },
  { name: 'RayTracingScene', before: 0.853, after: 0.845 },
  { name: 'TranslucentLighting', before: 0.818, after: 0.163 },
  { name: 'Postprocessing', before: 0.759, after: 0.782 },
  { name: 'NaniteVisBuffer', before: 0.678, after: 0.646 },
  { name: 'Prepass', before: 0.192, after: 2.01 },
];

const W = 1760;
const H = 900;
const PAD_L = 300;
// Right padding has to hold the "before → after (delta)" label that sits past
// the longest bar, not just the axis.
const PAD_R = 360;
const TOP = 168;
const ROW = 52;
const BAR = 17;

const INK = '#e8eaef';
const MUTED = '#8b93a3';
const GRID = '#2a2f3a';
const BEFORE = '#6b7280';
const AFTER = '#4ea1ff';
const WORSE = '#ff8a6b';

const maxMs = Math.max(...PASSES.flatMap((p) => [p.before, p.after]));
const plotW = W - PAD_L - PAD_R;
const scale = (ms) => (ms / maxMs) * plotW;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

let body = '';

// vertical grid + axis labels
for (let ms = 0; ms <= Math.ceil(maxMs); ms += 1) {
  const x = PAD_L + scale(ms);
  body += `<line x1="${x}" y1="${TOP - 16}" x2="${x}" y2="${TOP + PASSES.length * ROW - 18}" stroke="${GRID}" stroke-width="1"/>`;
  body += `<text x="${x}" y="${TOP + PASSES.length * ROW + 4}" fill="${MUTED}" font-size="18" font-family="Consolas, monospace" text-anchor="middle">${ms}</text>`;
}
body += `<text x="${PAD_L + plotW / 2}" y="${TOP + PASSES.length * ROW + 34}" fill="${MUTED}" font-size="18" font-family="Consolas, monospace" text-anchor="middle">GPU milliseconds per frame</text>`;

PASSES.forEach((p, i) => {
  const y = TOP + i * ROW;
  const improved = p.after < p.before;
  const afterColour = improved ? AFTER : WORSE;

  body += `<text x="${PAD_L - 18}" y="${y + 15}" fill="${INK}" font-size="19" font-family="Consolas, monospace" text-anchor="end">${esc(p.name)}</text>`;
  body += `<rect x="${PAD_L}" y="${y}" width="${scale(p.before).toFixed(1)}" height="${BAR}" fill="${BEFORE}" rx="2"/>`;
  body += `<rect x="${PAD_L}" y="${y + BAR + 3}" width="${scale(p.after).toFixed(1)}" height="${BAR}" fill="${afterColour}" rx="2"/>`;

  const delta = p.after - p.before;
  const sign = delta > 0 ? '+' : '';
  const label = `${p.before.toFixed(2)} → ${p.after.toFixed(2)}  (${sign}${delta.toFixed(2)})`;
  body += `<text x="${PAD_L + Math.max(scale(p.before), scale(p.after)) + 14}" y="${y + 24}" fill="${improved ? MUTED : WORSE}" font-size="17" font-family="Consolas, monospace">${esc(label)}</text>`;
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#14161b"/>
  <text x="56" y="62" fill="${INK}" font-size="34" font-family="Consolas, monospace" font-weight="bold">GPU frame time by pass — before and after</text>
  <text x="56" y="96" fill="${MUTED}" font-size="20" font-family="Consolas, monospace">2560×1440 native · Epic scalability · RTX 3060 · mean of 5 fixed cameras, 2400-frame captures</text>
  <text x="56" y="126" fill="${MUTED}" font-size="20" font-family="Consolas, monospace">Frame 30.45 → 22.60 ms   ·   GPU 29.60 → 21.76 ms   ·   32.99 → 44.37 FPS   ·   VRAM 4327 → 3790 MB</text>
  <rect x="${W - 420}" y="44" width="26" height="14" fill="${BEFORE}" rx="2"/>
  <text x="${W - 384}" y="57" fill="${MUTED}" font-size="18" font-family="Consolas, monospace">before</text>
  <rect x="${W - 270}" y="44" width="26" height="14" fill="${AFTER}" rx="2"/>
  <text x="${W - 234}" y="57" fill="${MUTED}" font-size="18" font-family="Consolas, monospace">after</text>
  ${body}
  <text x="56" y="${H - 44}" fill="${MUTED}" font-size="17" font-family="Consolas, monospace">Two passes rose, shown in orange. Suppressing vertex-deformation velocity relocates work into the depth prepass rather than</text>
  <text x="56" y="${H - 22}" fill="${MUTED}" font-size="17" font-family="Consolas, monospace">deleting it, and coarser virtual-shadow-map pages make SMRT ray marching work harder per pixel.</text>
</svg>`;

await mkdir(OUT_DIR, { recursive: true });
await sharp(Buffer.from(svg)).png().toFile(OUT);
await writeFile(resolve(OUT_DIR, 'perf-audit-passes.svg'), svg);
console.log(`make-perf-chart: wrote ${OUT} (${W}×${H})`);
