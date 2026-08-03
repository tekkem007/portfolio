/**
 * Validates the model assets in public/models against the manifest.
 *
 * Catches the failures that are invisible until a browser tries to load them:
 * a manifest entry pointing at a file that does not exist, a corrupt or
 * misaligned GLB, an asset far over its stated budget, or a stray file nobody
 * references. Run it before committing a new model.
 *
 * Run: npm run models:check
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MODELS_DIR = resolve(ROOT, 'public', 'models');
const MANIFEST = resolve(ROOT, 'src', 'content', 'models.ts');

/** Reads the manifest as text — enough to extract src/budget/id without a TS build. */
async function readManifest() {
  const text = await readFile(MANIFEST, 'utf8');
  const entries = [];
  // Split on top-level entry boundaries; good enough for a hand-maintained file.
  for (const block of text.split(/\n {2}\{\n/).slice(1)) {
    const id = block.match(/id: '([^']+)'/)?.[1];
    const src = block.match(/src: '([^']+)'/)?.[1];
    const status = block.match(/status: '([^']+)'/)?.[1];
    const budgetKb = Number(block.match(/budgetKb: (\d+)/)?.[1] ?? 0) || null;
    const hasFallback = /fallbackImage: '/.test(block);
    const hasDescription = /description:\s*\n?\s*'/.test(block) || /description: '/.test(block);
    if (id && src) entries.push({ id, src, status, budgetKb, hasFallback, hasDescription });
  }
  return entries;
}

/** Parses a GLB header and returns basic stats, or throws if malformed. */
async function inspectGlb(path) {
  const buf = await readFile(path);
  if (buf.length < 20) throw new Error('file too short to be a GLB');
  if (buf.toString('ascii', 0, 4) !== 'glTF') throw new Error('missing glTF magic — not a binary .glb');

  const version = buf.readUInt32LE(4);
  if (version !== 2) throw new Error(`unsupported glTF version ${version}`);

  const declared = buf.readUInt32LE(8);
  if (declared !== buf.length) throw new Error(`declared length ${declared} != actual ${buf.length}`);

  const jsonLen = buf.readUInt32LE(12);
  if (jsonLen % 4 !== 0) throw new Error('JSON chunk is not 4-byte aligned');
  if (buf.readUInt32LE(16) !== 0x4e4f534a) throw new Error('first chunk is not JSON');

  const gltf = JSON.parse(buf.toString('utf8', 20, 20 + jsonLen));

  let triangles = 0;
  let vertices = 0;
  for (const mesh of gltf.meshes ?? []) {
    for (const prim of mesh.primitives ?? []) {
      const posAccessor = gltf.accessors?.[prim.attributes?.POSITION];
      const count = posAccessor?.count ?? 0;
      vertices += count;
      triangles += prim.indices != null ? (gltf.accessors?.[prim.indices]?.count ?? 0) / 3 : count / 3;
    }
  }

  const extensions = gltf.extensionsUsed ?? [];
  return {
    bytes: buf.length,
    meshes: gltf.meshes?.length ?? 0,
    materials: gltf.materials?.length ?? 0,
    textures: gltf.textures?.length ?? 0,
    animations: gltf.animations?.length ?? 0,
    vertices,
    triangles: Math.round(triangles),
    extensions,
    draco: extensions.includes('KHR_draco_mesh_compression'),
    ktx2: extensions.includes('KHR_texture_basisu'),
    meshopt: extensions.includes('EXT_meshopt_compression'),
  };
}

async function main() {
  const entries = await readManifest();
  console.log(`Manifest entries: ${entries.length}\n`);

  let problems = 0;
  const referenced = new Set();

  for (const entry of entries) {
    const file = resolve(ROOT, 'public', entry.src.replace(/^\//, ''));
    referenced.add(entry.src.split('/').pop());
    process.stdout.write(`• ${entry.id} (${entry.status})\n`);

    try {
      await stat(file);
    } catch {
      console.log(`    ERROR  file not found: public${entry.src}`);
      problems += 1;
      continue;
    }

    try {
      const info = await inspectGlb(file);
      const kb = info.bytes / 1024;
      console.log(
        `    ${kb.toFixed(1)} kB · ${info.triangles} tris · ${info.vertices} verts · ` +
          `${info.meshes} mesh · ${info.materials} mat · ${info.textures} tex · ${info.animations} anim`,
      );
      const compression = [info.draco && 'DRACO', info.ktx2 && 'KTX2', info.meshopt && 'meshopt'].filter(Boolean);
      console.log(`    compression: ${compression.length ? compression.join(', ') : 'none'}`);

      if (entry.budgetKb && kb > entry.budgetKb) {
        console.log(`    OVER BUDGET  ${kb.toFixed(1)} kB > ${entry.budgetKb} kB — compress or simplify`);
        problems += 1;
      }
      if (kb > 1024 && compression.length === 0) {
        console.log('    WARNING  over 1 MB with no compression — consider DRACO/meshopt and KTX2');
      }
      if (!entry.hasFallback) {
        console.log('    WARNING  no fallbackImage — devices without WebGL will see nothing');
      }
      if (!entry.hasDescription) {
        console.log('    ERROR  no description — the model has no accessible text equivalent');
        problems += 1;
      }
    } catch (err) {
      console.log(`    ERROR  invalid GLB: ${err.message}`);
      problems += 1;
    }
    console.log('');
  }

  // Unreferenced files quietly inflate the deploy.
  let files = [];
  try {
    files = (await readdir(MODELS_DIR)).filter((f) => /\.(glb|gltf)$/i.test(f));
  } catch {
    files = [];
  }
  const orphans = files.filter((f) => !referenced.has(f));
  if (orphans.length) {
    console.log(`Unreferenced model files (not in the manifest): ${orphans.join(', ')}`);
  }

  console.log(problems === 0 ? 'models:check PASSED' : `models:check FAILED — ${problems} problem(s)`);
  process.exit(problems === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
