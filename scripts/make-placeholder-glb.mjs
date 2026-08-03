/**
 * Generates a valid, self-contained placeholder GLB so the model pipeline can
 * be exercised end to end before any real artwork exists.
 *
 * This is NOT artwork and must never be presented as Vishnu's work. It is a
 * deliberately plain modular wall panel — the simplest thing that still proves
 * the loader, transforms, framing, lighting presets, materials and disposal all
 * behave. Manifest entries that point at it are marked `status: 'placeholder'`
 * and are excluded from production builds.
 *
 * Writes: public/models/placeholder-panel.glb
 *
 * Run: node scripts/make-placeholder-glb.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(ROOT, 'public', 'models');
const OUT = resolve(OUT_DIR, 'placeholder-panel.glb');

/** Six faces of a unit box, as [corner, edgeU, edgeV] in local space. */
const FACES = [
  { o: [1, 0, 0], u: [0, 0, -1], v: [0, 1, 0], n: [1, 0, 0] },
  { o: [-1, 0, 0], u: [0, 0, 1], v: [0, 1, 0], n: [-1, 0, 0] },
  { o: [0, 1, 0], u: [1, 0, 0], v: [0, 0, -1], n: [0, 1, 0] },
  { o: [0, -1, 0], u: [1, 0, 0], v: [0, 0, 1], n: [0, -1, 0] },
  { o: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0], n: [0, 0, 1] },
  { o: [0, 0, -1], u: [-1, 0, 0], v: [0, 1, 0], n: [0, 0, -1] },
];

/**
 * Emits a flat-shaded box as loose triangles.
 * Non-indexed keeps the generator trivial; the asset is tiny either way.
 */
function box(positions, normals, center, size) {
  const [cx, cy, cz] = center;
  const [sx, sy, sz] = size;
  const half = [sx / 2, sy / 2, sz / 2];

  for (const face of FACES) {
    // Face centre, then two in-plane half-edges.
    const fc = [cx + face.o[0] * half[0], cy + face.o[1] * half[1], cz + face.o[2] * half[2]];
    const eu = [face.u[0] * half[0], face.u[1] * half[1], face.u[2] * half[2]];
    const ev = [face.v[0] * half[0], face.v[1] * half[1], face.v[2] * half[2]];

    const corner = (su, sv) => [fc[0] + eu[0] * su + ev[0] * sv, fc[1] + eu[1] * su + ev[1] * sv, fc[2] + eu[2] * su + ev[2] * sv];

    const a = corner(-1, -1);
    const b = corner(1, -1);
    const c = corner(1, 1);
    const d = corner(-1, 1);

    for (const tri of [[a, b, c], [a, c, d]]) {
      for (const p of tri) {
        positions.push(p[0], p[1], p[2]);
        normals.push(face.n[0], face.n[1], face.n[2]);
      }
    }
  }
}

function buildGeometry() {
  const positions = [];
  const normals = [];

  // Main panel: 2 m wide, 3 m tall, 0.18 m thick, sitting on the origin plane.
  box(positions, normals, [0, 1.5, 0], [2, 3, 0.18]);

  // Recessed centre band — reads as a modular kit piece rather than a cube.
  box(positions, normals, [0, 1.5, 0.06], [1.6, 2.2, 0.1]);

  // Corner bolts.
  const bolt = 0.14;
  for (const x of [-0.82, 0.82]) {
    for (const y of [0.28, 2.72]) {
      box(positions, normals, [x, y, 0.11], [bolt, bolt, 0.08]);
    }
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
  };
}

/** Pads a buffer to a 4-byte boundary with the supplied fill byte. */
function pad(buf, fill) {
  const remainder = buf.length % 4;
  if (remainder === 0) return buf;
  return Buffer.concat([buf, Buffer.alloc(4 - remainder, fill)]);
}

async function main() {
  const { positions, normals } = buildGeometry();
  const count = positions.length / 3;

  const posBytes = Buffer.from(positions.buffer, positions.byteOffset, positions.byteLength);
  const nrmBytes = Buffer.from(normals.buffer, normals.byteOffset, normals.byteLength);
  const bin = Buffer.concat([posBytes, nrmBytes]);

  // POSITION accessors require min/max.
  let min = [Infinity, Infinity, Infinity];
  let max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < positions.length; i += 3) {
    for (let axis = 0; axis < 3; axis += 1) {
      min[axis] = Math.min(min[axis], positions[i + axis]);
      max[axis] = Math.max(max[axis], positions[i + axis]);
    }
  }

  const gltf = {
    asset: {
      version: '2.0',
      generator: 'portfolio placeholder generator — NOT ARTWORK, replace with a real export',
    },
    scene: 0,
    scenes: [{ nodes: [0], name: 'PlaceholderScene' }],
    nodes: [{ mesh: 0, name: 'PlaceholderPanel' }],
    meshes: [
      {
        name: 'PlaceholderPanel',
        primitives: [{ attributes: { POSITION: 0, NORMAL: 1 }, material: 0, mode: 4 }],
      },
    ],
    materials: [
      {
        name: 'PlaceholderMaterial',
        pbrMetallicRoughness: {
          // Neutral grey; the site's lighting presets supply the colour.
          baseColorFactor: [0.42, 0.45, 0.49, 1],
          metallicFactor: 0.15,
          roughnessFactor: 0.72,
        },
        doubleSided: false,
      },
    ],
    accessors: [
      {
        bufferView: 0,
        componentType: 5126, // FLOAT
        count,
        type: 'VEC3',
        min: min.map((v) => Number(v.toFixed(6))),
        max: max.map((v) => Number(v.toFixed(6))),
        name: 'POSITION',
      },
      { bufferView: 1, componentType: 5126, count, type: 'VEC3', name: 'NORMAL' },
    ],
    bufferViews: [
      { buffer: 0, byteOffset: 0, byteLength: posBytes.length, target: 34962 },
      { buffer: 0, byteOffset: posBytes.length, byteLength: nrmBytes.length, target: 34962 },
    ],
    buffers: [{ byteLength: bin.length }],
  };

  const jsonChunk = pad(Buffer.from(JSON.stringify(gltf), 'utf8'), 0x20); // pad with spaces
  const binChunk = pad(bin, 0x00);

  const header = Buffer.alloc(12);
  header.write('glTF', 0, 'ascii');
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonChunk.length + 8 + binChunk.length, 8);

  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(jsonChunk.length, 0);
  jsonHeader.writeUInt32LE(0x4e4f534a, 4); // 'JSON'

  const binHeader = Buffer.alloc(8);
  binHeader.writeUInt32LE(binChunk.length, 0);
  binHeader.writeUInt32LE(0x004e4942, 4); // 'BIN\0'

  const glb = Buffer.concat([header, jsonHeader, jsonChunk, binHeader, binChunk]);

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT, glb);

  console.log(
    `placeholder GLB: ${(glb.length / 1024).toFixed(1)} kB, ${count} vertices, ${count / 3} triangles → public/models/placeholder-panel.glb`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
