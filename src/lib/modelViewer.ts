/**
 * Reusable glTF model viewer.
 *
 * One engine, driven entirely by a manifest entry — no per-model code. It
 * handles loading, decompression, framing, lighting presets, interaction,
 * quality tiers, visibility-based rendering and full GPU teardown.
 *
 * Deliberate constraints:
 *
 * - **The wheel is never bound.** Scroll always belongs to the page. Zoom is
 *   available from the keyboard instead, so the model can never trap a reader.
 * - **No post-processing.** It would cost more than it returns at this size.
 * - **`three` is dynamically imported**, sharing the chunk the hero already
 *   loads, so a case study with a model downloads no second copy of the library.
 * - **DRACO and KTX2 are wired but lazy.** They are only fetched if a file
 *   actually uses them, so an uncompressed GLB pays nothing for the capability.
 */

import type * as THREE from 'three';
import type { ModelEntry, QualityTier } from '../content/models';

export interface ModelViewerHandle {
  dispose: () => void;
  /** Screen-space hotspot positions, recomputed each frame. */
  onHotspotMove: (cb: (positions: Record<string, { x: number; y: number; visible: boolean }>) => void) => void;
  /** Keyboard-driven camera nudges, so the viewer is operable without a pointer. */
  rotateBy: (deltaAzimuthDeg: number, deltaElevationDeg: number) => void;
  zoomBy: (factor: number) => void;
  resetView: () => void;
}

export interface QualitySettings {
  maxPixelRatio: number;
  antialias: boolean;
  shadows: boolean;
}

/** Chosen once, from what the device actually reports. */
export function detectQuality(): QualityTier {
  if (typeof window === 'undefined') return 'low';
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const coarse = window.matchMedia('(hover: none)').matches;

  if (coarse || cores <= 4 || memory <= 4) return 'low';
  if (cores >= 8 && memory >= 8 && window.devicePixelRatio <= 2) return 'high';
  return 'medium';
}

const QUALITY: Record<QualityTier, QualitySettings> = {
  high: { maxPixelRatio: 1.75, antialias: true, shadows: true },
  medium: { maxPixelRatio: 1.5, antialias: true, shadows: false },
  low: { maxPixelRatio: 1, antialias: false, shadows: false },
};

const WARM = 0xf2a24b;
const COOL = 0x63cfdd;

const DEG = Math.PI / 180;

export async function createModelViewer(
  container: HTMLElement,
  entry: ModelEntry,
  baseUrl: string,
  quality: QualityTier,
): Promise<ModelViewerHandle> {
  const three = (await import('three')) as typeof THREE;
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');

  const settings = QUALITY[quality];

  const scene = new three.Scene();
  const camera = new three.PerspectiveCamera(38, container.clientWidth / container.clientHeight || 1, 0.01, 500);

  const renderer = new three.WebGLRenderer({
    antialias: settings.antialias,
    alpha: true,
    powerPreference: quality === 'high' ? 'high-performance' : 'low-power',
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, settings.maxPixelRatio));
  renderer.toneMapping = three.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  container.appendChild(renderer.domElement);

  // --- Lighting presets --------------------------------------------------
  const root = new three.Group();
  scene.add(root);

  function applyLighting(preset: ModelEntry['lighting']) {
    const rigs = {
      worlds: { key: WARM, keyI: 2.6, fill: COOL, fillI: 0.9, ambient: 0x8fa4bb, ambientI: 0.4 },
      systems: { key: COOL, keyI: 2.4, fill: 0xa8b6c4, fillI: 0.8, ambient: 0x7f93a8, ambientI: 0.45 },
      studio: { key: 0xffffff, keyI: 2.2, fill: 0xdfe7ef, fillI: 1.0, ambient: 0xffffff, ambientI: 0.5 },
    } as const;
    const rig = rigs[preset];

    scene.add(new three.AmbientLight(rig.ambient, rig.ambientI));

    const key = new three.DirectionalLight(rig.key, rig.keyI);
    key.position.set(4, 6, 5);
    key.castShadow = settings.shadows;
    scene.add(key);

    // Front-left, not behind-left: the default camera sits front-right, so a
    // fill placed behind the subject lights only faces nobody can see. The
    // warm/cool split is the point of the preset, so it has to land on a
    // visible surface.
    const fill = new three.DirectionalLight(rig.fill, rig.fillI);
    fill.position.set(-6, 2, 3.5);
    scene.add(fill);

    // A dim rim from behind separates the silhouette from a dark page.
    const rim = new three.DirectionalLight(0xffffff, 0.5);
    rim.position.set(0, 3, -6);
    scene.add(rim);
  }
  applyLighting(entry.lighting);

  // --- Load ---------------------------------------------------------------
  const loader = new GLTFLoader();

  // Decoders are attached lazily: constructing them is cheap, but the decoder
  // binaries are only fetched when a file actually needs them.
  try {
    const { DRACOLoader } = await import('three/examples/jsm/loaders/DRACOLoader.js');
    const draco = new DRACOLoader();
    draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    loader.setDRACOLoader(draco);
  } catch {
    // Decoder unavailable: uncompressed assets still load normally.
  }

  const url = `${baseUrl.replace(/\/$/, '')}${entry.src}`;
  const gltf = await loader.loadAsync(url);
  const model = gltf.scene;

  // --- Transform ----------------------------------------------------------
  const t = entry.transform ?? {};
  if (t.scale) model.scale.setScalar(t.scale);
  if (t.rotationY) model.rotation.y = t.rotationY * DEG;
  if (t.position) model.position.set(...t.position);
  root.add(model);

  // --- Framing ------------------------------------------------------------
  // Fit from the actual bounds, so a model of any size arrives framed without
  // hand-tuned magic numbers per asset.
  const boundingBox = new three.Box3().setFromObject(model);
  const sphere = boundingBox.getBoundingSphere(new three.Sphere());
  const centre = entry.camera?.target ? new three.Vector3(...entry.camera.target) : sphere.center.clone();

  const camCfg = entry.camera ?? {};
  let azimuth = (camCfg.azimuth ?? 25) * DEG;
  let elevation = (camCfg.elevation ?? 12) * DEG;
  const baseDistance = sphere.radius * (camCfg.distance ?? 2.2);
  let distance = baseDistance;

  camera.near = Math.max(0.01, sphere.radius / 100);
  camera.far = sphere.radius * 40;
  camera.updateProjectionMatrix();

  function placeCamera() {
    const clampedElevation = Math.max(-1.2, Math.min(1.35, elevation));
    camera.position.set(
      centre.x + Math.sin(azimuth) * Math.cos(clampedElevation) * distance,
      centre.y + Math.sin(clampedElevation) * distance,
      centre.z + Math.cos(azimuth) * Math.cos(clampedElevation) * distance,
    );
    camera.lookAt(centre);
  }
  placeCamera();

  /**
   * Renders one frame immediately.
   *
   * Only `turntable` models actually animate. For `orbit` and `static` the
   * image changes solely in response to input, so a continuous rAF loop would
   * re-render an identical frame ~60 times a second for as long as the viewer
   * is on screen. Everything that moves the camera calls this instead, which
   * makes an idle viewer cost nothing and — importantly — keeps the keyboard
   * and pointer controls correct even when the loop is not running.
   */
  function renderOnce() {
    renderer.render(scene, camera);
    updateHotspots();
  }

  // --- Interaction --------------------------------------------------------
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  const canvas = renderer.domElement;
  canvas.style.touchAction = 'pan-y'; // vertical page scroll always wins on touch

  const onPointerDown = (event: PointerEvent) => {
    if (entry.interaction !== 'orbit') return;
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent) => {
    if (!dragging) return;
    azimuth -= (event.clientX - lastX) * 0.008;
    elevation += (event.clientY - lastY) * 0.006;
    lastX = event.clientX;
    lastY = event.clientY;
    placeCamera();
    renderOnce();
  };
  const onPointerUp = (event: PointerEvent) => {
    dragging = false;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  };

  if (entry.interaction === 'orbit') {
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
  }

  // --- Hotspot projection --------------------------------------------------
  let hotspotCb: ((p: Record<string, { x: number; y: number; visible: boolean }>) => void) | null = null;
  const projected = new three.Vector3();

  function updateHotspots() {
    if (!hotspotCb || !entry.hotspots?.length) return;
    const out: Record<string, { x: number; y: number; visible: boolean }> = {};
    for (const hotspot of entry.hotspots) {
      projected.set(...hotspot.position);
      model.localToWorld(projected);
      projected.project(camera);
      out[hotspot.id] = {
        x: (projected.x * 0.5 + 0.5) * container.clientWidth,
        y: (-projected.y * 0.5 + 0.5) * container.clientHeight,
        visible: projected.z < 1,
      };
    }
    hotspotCb(out);
  }

  // --- Loop ---------------------------------------------------------------
  let frame = 0;
  let running = false;
  let onScreen = false;
  let visible = document.visibilityState === 'visible';
  const start = performance.now();

  const onResize = () => {
    if (!container.clientWidth || !container.clientHeight) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    placeCamera();
    renderOnce();
  };
  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(container);

  function tick() {
    frame = requestAnimationFrame(tick);
    if (entry.interaction === 'turntable' && !dragging) {
      azimuth = ((performance.now() - start) / 1000) * 0.18;
      placeCamera();
    }
    renderer.render(scene, camera);
    updateHotspots();
  }

  function sync() {
    // Static and orbit models repaint on demand, so they never start a loop.
    const shouldRun = onScreen && visible && entry.interaction === 'turntable';
    if (shouldRun === running) return;
    running = shouldRun;
    if (running) tick();
    else cancelAnimationFrame(frame);
  }

  const intersection = new IntersectionObserver(
    ([e]) => {
      onScreen = e.isIntersecting;
      sync();
    },
    { threshold: 0 },
  );
  intersection.observe(container);

  const onVisibility = () => {
    visible = document.visibilityState === 'visible';
    sync();
  };
  document.addEventListener('visibilitychange', onVisibility);

  onResize();
  // Paint immediately so the panel is never blank behind the fade-in.
  renderOnce();
  sync();

  return {
    dispose() {
      running = false;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);

      // Release every GPU resource the glTF brought with it.
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach(disposeMaterial);
        else if (material) disposeMaterial(material);
      });
      renderer.dispose();
      // dispose() frees Three's own caches but leaves the WebGL context alive
      // until garbage collection. Browsers cap simultaneous contexts (~16), and
      // this viewer can mount and unmount on every route change, so the context
      // is released explicitly rather than left to the collector.
      renderer.forceContextLoss();
      renderer.domElement.remove();

      function disposeMaterial(material: THREE.Material) {
        for (const value of Object.values(material as unknown as Record<string, unknown>)) {
          if (value && typeof value === 'object' && 'isTexture' in value) {
            (value as THREE.Texture).dispose();
          }
        }
        material.dispose();
      }
    },
    onHotspotMove(cb) {
      hotspotCb = cb;
      updateHotspots();
    },
    rotateBy(dAz, dEl) {
      azimuth += dAz * DEG;
      elevation += dEl * DEG;
      placeCamera();
      renderOnce();
    },
    zoomBy(factor) {
      distance = Math.max(baseDistance * 0.5, Math.min(baseDistance * 2.5, distance * factor));
      placeCamera();
      renderOnce();
    },
    resetView() {
      azimuth = (camCfg.azimuth ?? 25) * DEG;
      elevation = (camCfg.elevation ?? 12) * DEG;
      distance = baseDistance;
      placeCamera();
      renderOnce();
    },
  };
}
