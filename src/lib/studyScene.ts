/**
 * Case-study study scenes.
 *
 * Each flagship project gets a small, literal demonstration of the technique
 * its write-up describes — not decoration:
 *
 *   'kit'      a modular kit assembling from repeated modules (Maintenance Hangar)
 *   'material' one mesh cycling through material layers (Layered Material System)
 *   'lighting' a form under a warm key and cool fill (The Silent Gate)
 *
 * This module imports `three` exactly as the hero scene does, so Rollup gives
 * them the same chunk: on a case-study page the library is downloaded once and
 * shared, and if the visitor never reaches a scene it is never downloaded at all.
 */

import type * as THREE from 'three';

export type StudyVariant = 'kit' | 'material' | 'lighting';

export interface StudyHandle {
  dispose: () => void;
}

const WARM = 0xf2a24b;
const COOL = 0x63cfdd;

export async function createStudy(container: HTMLElement, variant: StudyVariant): Promise<StudyHandle> {
  const three = (await import('three')) as typeof THREE;

  const scene = new three.Scene();
  scene.background = null;

  const camera = new three.PerspectiveCamera(34, container.clientWidth / container.clientHeight || 1, 0.1, 100);
  camera.position.set(0, 2.4, 9);
  camera.lookAt(0, 0.6, 0);

  const renderer = new three.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  container.appendChild(renderer.domElement);

  scene.add(new three.AmbientLight(0x8fa4bb, 0.45));
  const key = new three.DirectionalLight(WARM, 2.0);
  key.position.set(5, 6, 4);
  scene.add(key);
  const fill = new three.DirectionalLight(COOL, 0.8);
  fill.position.set(-6, 3, -4);
  scene.add(fill);

  const group = new three.Group();
  scene.add(group);

  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposables.push(item);
    return item;
  };

  // --- Variant construction ------------------------------------------------

  /** Modules that snap together on a shared grid — the kit idea, literally. */
  function buildKit() {
    const geo = track(new three.BoxGeometry(1, 1, 1));
    const mat = track(
      new three.MeshStandardMaterial({ color: 0x2f353d, roughness: 0.65, metalness: 0.25 }),
    );
    const pieces: [number, number, number, number, number, number][] = [];
    for (let i = 0; i < 5; i += 1) {
      const z = (i - 2) * 1.9;
      pieces.push([-3.1, 1.1, z, 0.32, 2.6, 0.32]);
      pieces.push([3.1, 1.1, z, 0.32, 2.6, 0.32]);
      pieces.push([0, 2.5, z, 6.6, 0.24, 0.34]);
      pieces.push([0, -0.1, z, 6.2, 0.16, 1.6]);
    }
    const mesh = new three.InstancedMesh(geo, mat, pieces.length);
    const dummy = new three.Object3D();
    pieces.forEach((p, i) => {
      dummy.position.set(p[0], p[1], p[2]);
      dummy.scale.set(p[3], p[4], p[5]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    group.add(mesh);

    const edges = track(new three.EdgesGeometry(geo));
    const lineMat = track(new three.LineBasicMaterial({ color: COOL, transparent: true, opacity: 0.22 }));
    const unit = edges.attributes.position.array as ArrayLike<number>;
    const merged = new Float32Array(unit.length * pieces.length);
    pieces.forEach((p, pi) => {
      const off = pi * unit.length;
      for (let i = 0; i < unit.length; i += 3) {
        merged[off + i] = unit[i] * p[3] + p[0];
        merged[off + i + 1] = unit[i + 1] * p[4] + p[1];
        merged[off + i + 2] = unit[i + 2] * p[5] + p[2];
      }
    });
    const wireGeo = track(new three.BufferGeometry());
    wireGeo.setAttribute('position', new three.BufferAttribute(merged, 3));
    group.add(new three.LineSegments(wireGeo, lineMat));
    return { update: () => {} };
  }

  /**
   * One mesh, three material treatments, cross-fading in turn — the point the
   * layered-material write-up makes: the mesh never changes, the layer does.
   */
  function buildMaterial() {
    const geo = track(new three.TorusKnotGeometry(1.5, 0.5, 160, 24));
    const layers = [
      { color: 0x8a5a34, roughness: 0.82, metalness: 0.0 }, // wood
      { color: 0x9aa3ad, roughness: 0.32, metalness: 0.9 }, // painted metal
      { color: 0x1d2a30, roughness: 0.5, metalness: 0.2, emissive: COOL }, // emissive trim
    ];
    const meshes = layers.map((layer) => {
      const mat = track(
        new three.MeshStandardMaterial({
          color: layer.color,
          roughness: layer.roughness,
          metalness: layer.metalness,
          emissive: layer.emissive ?? 0x000000,
          emissiveIntensity: layer.emissive ? 0.7 : 0,
          transparent: true,
          opacity: 0,
        }),
      );
      const mesh = new three.Mesh(geo, mat);
      mesh.position.y = 0.7;
      group.add(mesh);
      return mat;
    });

    return {
      update(elapsed: number) {
        // 3.4s per layer, with a short cross-fade between them.
        const period = 3.4;
        const phase = (elapsed / period) % layers.length;
        meshes.forEach((mat, index) => {
          let d = Math.abs(phase - index);
          d = Math.min(d, layers.length - d);
          mat.opacity = Math.max(0, 1 - d);
        });
      },
    };
  }

  /** A simple form under two orbiting lights — the dual-lighting setup. */
  function buildLighting() {
    const geo = track(new three.IcosahedronGeometry(1.7, 0));
    const mat = track(new three.MeshStandardMaterial({ color: 0x39424c, roughness: 0.78, metalness: 0.08, flatShading: true }));
    const mesh = new three.Mesh(geo, mat);
    mesh.position.y = 0.8;
    group.add(mesh);

    const floorGeo = track(new three.CircleGeometry(4.4, 48));
    const floorMat = track(new three.MeshStandardMaterial({ color: 0x181d23, roughness: 1 }));
    const floor = new three.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.9;
    group.add(floor);

    return {
      update(elapsed: number) {
        // The two lights orbit in opposition, so the warm/cool split is always
        // legible rather than washing into a single direction.
        key.position.set(Math.sin(elapsed * 0.35) * 6, 5, Math.cos(elapsed * 0.35) * 6);
        fill.position.set(Math.sin(elapsed * 0.35 + Math.PI) * 6, 3, Math.cos(elapsed * 0.35 + Math.PI) * 6);
      },
    };
  }

  const built = variant === 'kit' ? buildKit() : variant === 'material' ? buildMaterial() : buildLighting();

  // --- Loop ---------------------------------------------------------------
  let frame = 0;
  let running = false;
  let visible = document.visibilityState === 'visible';
  let onScreen = false;
  const start = performance.now();

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
    group.rotation.y = elapsed * 0.16;
    built.update?.(elapsed);
    renderer.render(scene, camera);
  }

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
  // Render one frame immediately so the panel is never blank before scroll.
  renderer.render(scene, camera);
  sync();

  return {
    dispose() {
      running = false;
      cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      resizeObserver.disconnect();
      intersection.disconnect();
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
