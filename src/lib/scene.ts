/**
 * The hero scene: a modular bay that resolves from blockout to lit geometry.
 *
 * This is the one place Three.js is used, and it earns its place by showing the
 * thing the site is about — a kit of repeated modules, a wireframe blockout, and
 * a two-light setup (warm key against cool fill) resolving into a finished
 * frame. It is not decoration bolted onto a hero image.
 *
 * The whole module is dynamically imported, so `three` never lands in the
 * initial bundle and never blocks first paint. Everything it allocates is
 * released by the returned `dispose()`.
 *
 * Cost: two draw calls. The solid pass is a single InstancedMesh; the blockout
 * pass is one LineSegments over a merged edge buffer.
 */

import type * as THREE from 'three';

export interface SceneHandle {
  dispose: () => void;
}

/** Warm work light and cool fill — the same pairing used in the environment work. */
const KEY_COLOUR = 0xf2a24b;
const FILL_COLOUR = 0x63cfdd;

/** Small deterministic PRNG so the layout is identical on every load. */
function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface ModulePiece {
  position: [number, number, number];
  scale: [number, number, number];
}

/**
 * Lays out a hangar-like bay from a handful of repeated module types — the
 * point being that the whole structure comes from one kit, not bespoke meshes.
 */
function buildKit(): ModulePiece[] {
  const pieces: ModulePiece[] = [];
  const random = mulberry32(20260728);

  const BAYS = 7;
  const BAY_DEPTH = 3.4;
  const HALF_WIDTH = 6.2;

  for (let i = 0; i < BAYS; i += 1) {
    const z = (i - (BAYS - 1) / 2) * BAY_DEPTH;

    for (const side of [-1, 1]) {
      // Vertical truss.
      pieces.push({ position: [side * HALF_WIDTH, 1.9, z], scale: [0.42, 3.8, 0.42] });
      // Bracing partway up.
      pieces.push({ position: [side * HALF_WIDTH, 2.6, z], scale: [0.9, 0.22, 0.6] });
      // Wall panel, alternating depth so the silhouette is not flat.
      const depth = 0.3 + random() * 0.35;
      pieces.push({ position: [side * (HALF_WIDTH + 0.5), 1.7, z], scale: [depth, 3.2, BAY_DEPTH * 0.8] });
    }

    // Overhead beam spanning the bay.
    pieces.push({ position: [0, 3.85, z], scale: [HALF_WIDTH * 2 + 0.5, 0.3, 0.5] });

    // Floor plates, two per bay.
    for (const offset of [-1, 1]) {
      pieces.push({ position: [offset * 3.1, -0.06, z], scale: [5.6, 0.12, BAY_DEPTH * 0.86] });
    }
  }

  // The central maintenance platform — the composition's focal point.
  pieces.push({ position: [0, 0.22, 0], scale: [4.6, 0.44, 5.2] });
  pieces.push({ position: [0, 0.62, 0], scale: [2.2, 0.5, 2.6] });

  // Scattered crates giving the structure a human reference.
  for (let i = 0; i < 14; i += 1) {
    const s = 0.4 + random() * 0.5;
    pieces.push({
      position: [(random() - 0.5) * 11, s / 2, (random() - 0.5) * 20],
      scale: [s, s * (0.7 + random() * 0.6), s],
    });
  }

  return pieces;
}

export async function createScene(container: HTMLElement): Promise<SceneHandle> {
  const three = (await import('three')) as typeof THREE;

  const scene = new three.Scene();
  scene.background = new three.Color(0x0a0c0f);
  scene.fog = new three.Fog(0x0a0c0f, 16, 46);

  const camera = new three.PerspectiveCamera(38, container.clientWidth / container.clientHeight || 1, 0.1, 100);

  const renderer = new three.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
  renderer.setSize(container.clientWidth, container.clientHeight);
  // Cap the pixel ratio: this is a background, not a product shot.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  container.appendChild(renderer.domElement);

  const pieces = buildKit();
  const boxGeometry = new three.BoxGeometry(1, 1, 1);

  // --- Solid pass: one InstancedMesh, one draw call -----------------------
  const solidMaterial = new three.MeshStandardMaterial({
    color: 0x2a3038,
    roughness: 0.72,
    metalness: 0.22,
    transparent: true,
    opacity: 0,
  });

  const solid = new three.InstancedMesh(boxGeometry, solidMaterial, pieces.length);
  const dummy = new three.Object3D();
  pieces.forEach((piece, index) => {
    dummy.position.set(...piece.position);
    dummy.scale.set(...piece.scale);
    dummy.updateMatrix();
    solid.setMatrixAt(index, dummy.matrix);
  });
  solid.instanceMatrix.needsUpdate = true;
  scene.add(solid);

  // --- Blockout pass: merged edge buffer, one draw call -------------------
  // The wireframe is generated from the same unit cube the solid pass uses, so
  // the blockout and the finished geometry are provably identical shapes.
  const edges = new three.EdgesGeometry(boxGeometry);
  const unit = edges.attributes.position.array as ArrayLike<number>;
  const merged = new Float32Array(unit.length * pieces.length);

  pieces.forEach((piece, pieceIndex) => {
    const offset = pieceIndex * unit.length;
    const [px, py, pz] = piece.position;
    const [sx, sy, sz] = piece.scale;
    for (let i = 0; i < unit.length; i += 3) {
      merged[offset + i] = unit[i] * sx + px;
      merged[offset + i + 1] = unit[i + 1] * sy + py;
      merged[offset + i + 2] = unit[i + 2] * sz + pz;
    }
  });

  const wireGeometry = new three.BufferGeometry();
  wireGeometry.setAttribute('position', new three.BufferAttribute(merged, 3));

  const wireMaterial = new three.LineBasicMaterial({
    color: FILL_COLOUR,
    transparent: true,
    opacity: 0.5,
  });
  scene.add(new three.LineSegments(wireGeometry, wireMaterial));

  // --- Lighting -----------------------------------------------------------
  scene.add(new three.AmbientLight(0x8fa4bb, 0.35));

  const key = new three.DirectionalLight(KEY_COLOUR, 2.1);
  key.position.set(5, 9, 3);
  scene.add(key);

  const fill = new three.DirectionalLight(FILL_COLOUR, 0.75);
  fill.position.set(-8, 4, -6);
  scene.add(fill);

  // The warm pool over the maintenance platform, matching the environment work.
  const platformLight = new three.PointLight(KEY_COLOUR, 22, 14, 2);
  platformLight.position.set(0, 3.1, 0);
  scene.add(platformLight);

  // --- Loop ---------------------------------------------------------------
  let frame = 0;
  let running = false;
  let visible = true;
  let onScreen = true;
  const start = performance.now();

  // Pointer parallax, clamped hard so it reads as a nudge, not a camera rig.
  let pointerX = 0;
  let pointerY = 0;
  const onPointerMove = (event: PointerEvent) => {
    pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
    pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  const onResize = () => {
    if (!container.clientWidth || !container.clientHeight) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(container);

  function tick() {
    frame = requestAnimationFrame(tick);

    const elapsed = (performance.now() - start) / 1000;

    // Blockout resolves into lit geometry over the first few seconds.
    const reveal = three.MathUtils.clamp((elapsed - 0.35) / 2.6, 0, 1);
    const eased = reveal * reveal * (3 - 2 * reveal);
    solidMaterial.opacity = eased;
    wireMaterial.opacity = 0.5 * (1 - eased) + 0.05 * eased;

    // Slow orbit, plus the clamped pointer nudge.
    const angle = 0.12 + elapsed * 0.028;
    const radius = 16.4;
    camera.position.x = Math.sin(angle) * radius + pointerX * 0.7;
    camera.position.z = Math.cos(angle) * radius;
    camera.position.y = 5.2 - pointerY * 0.35;
    camera.lookAt(0, 1.5, 0);

    platformLight.intensity = 20 + Math.sin(elapsed * 1.6) * 2;

    renderer.render(scene, camera);
  }

  /** Renders only while the hero is on screen and the tab is focused. */
  function sync() {
    const shouldRun = visible && onScreen;
    if (shouldRun === running) return;
    running = shouldRun;
    if (running) tick();
    else cancelAnimationFrame(frame);
  }

  const intersection = new IntersectionObserver(
    ([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    },
    { threshold: 0 },
  );
  intersection.observe(container);

  const onVisibilityChange = () => {
    visible = document.visibilityState === 'visible';
    sync();
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  onResize();
  sync();

  return {
    dispose() {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      resizeObserver.disconnect();
      intersection.disconnect();

      wireGeometry.dispose();
      edges.dispose();
      boxGeometry.dispose();
      solidMaterial.dispose();
      wireMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
