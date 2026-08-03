/**
 * Sea scene: a glTF buoy floating on animated water, day or night.
 *
 * The physics is the point. A moored buoy is a damped harmonic oscillator: its
 * hull sits below the waterline, so any tilt shifts the centre of buoyancy and
 * produces a restoring moment roughly proportional to the tilt angle, opposed
 * by drag. Nudge one and it swings past upright, overshoots, and settles — it
 * does not snap back. That is what `nudge()` reproduces, and it is why clicking
 * feels like striking something afloat rather than spinning a turntable.
 *
 * Waves are a sum of four directional sines. The vertex shader is generated
 * from the same `WAVES` constant the JavaScript uses, so the buoy rides the
 * exact surface being drawn rather than an approximation of it.
 */

import type * as THREE from 'three';

export type TimeOfDay = 'day' | 'night';

export interface SeaSceneOptions {
  modelUrl: string;
  /** Height on the model, in its own units, that should sit at sea level. */
  waterline: number;
  timeOfDay: TimeOfDay;
  reducedMotion: boolean;
  quality: 'high' | 'medium' | 'low';
}

export interface SeaSceneHandle {
  dispose: () => void;
  setTimeOfDay: (value: TimeOfDay) => void;
  /** Push the buoy. Direction is world space; strength scales the impulse. */
  nudge: (dirX: number, dirZ: number, strength?: number) => void;
  /** Turns a pointer position over the canvas into a push away from that point. */
  nudgeFromPointer: (clientX: number, clientY: number, strength?: number) => void;
}

/** Wave set. The GLSL is generated from this, so the two cannot drift apart. */
const WAVES = [
  { dx: 1.0, dz: 0.35, freq: 0.55, amp: 0.2, speed: 0.85 },
  { dx: -0.6, dz: 0.8, freq: 0.85, amp: 0.12, speed: 1.15 },
  { dx: 0.35, dz: -0.95, freq: 1.45, amp: 0.06, speed: 1.6 },
  { dx: -0.9, dz: -0.25, freq: 2.4, amp: 0.03, speed: 2.1 },
].map((w) => {
  const len = Math.hypot(w.dx, w.dz) || 1;
  return { ...w, dx: w.dx / len, dz: w.dz / len };
});

/** Water height at a point — the JavaScript twin of the shader. */
function waveAt(x: number, z: number, t: number): number {
  let h = 0;
  for (const w of WAVES) h += w.amp * Math.sin((w.dx * x + w.dz * z) * w.freq + t * w.speed);
  return h;
}

/** Analytic surface slope, used to lie the buoy along the water. */
function waveSlope(x: number, z: number, t: number): [number, number] {
  let dx = 0;
  let dz = 0;
  for (const w of WAVES) {
    const c = w.amp * w.freq * Math.cos((w.dx * x + w.dz * z) * w.freq + t * w.speed);
    dx += c * w.dx;
    dz += c * w.dz;
  }
  return [dx, dz];
}

const GLSL_WAVE_FN = `
float waveHeight(vec2 p, float t) {
  float h = 0.0;
${WAVES.map(
  (w) =>
    `  h += ${w.amp.toFixed(4)} * sin((${w.dx.toFixed(4)} * p.x + ${w.dz.toFixed(4)} * p.y) * ${w.freq.toFixed(4)} + t * ${w.speed.toFixed(4)});`,
).join('\n')}
  return h;
}`;

interface Palette {
  zenith: string;
  horizon: string;
  waterDeep: string;
  waterShallow: string;
  sunColour: string;
  sunIntensity: number;
  ambient: string;
  ambientIntensity: number;
  fog: string;
  sunDir: [number, number, number];
  lantern: number;
  stars: number;
}

const DAY: Palette = {
  zenith: '#2d6b9c',
  horizon: '#c3dcec',
  waterDeep: '#0b3350',
  waterShallow: '#2f7fa8',
  sunColour: '#fff1d2',
  sunIntensity: 2.7,
  ambient: '#a6c6de',
  ambientIntensity: 0.9,
  fog: '#b2cee0',
  sunDir: [18, 13, -9],
  lantern: 0,
  stars: 0,
};

/**
 * Night is lit to stay *legible*, not literal. A physically dark sea renders as
 * an almost black rectangle — measured at mean luma 5/255, where the buoy is
 * invisible and the asset stops being a portfolio piece. Moonlight, a brighter
 * horizon and full specular give the water a visible glitter path to read the
 * silhouette against.
 */
const NIGHT: Palette = {
  zenith: '#0a1424',
  horizon: '#33557a',
  waterDeep: '#0a1524',
  waterShallow: '#204564',
  sunColour: '#d4e2ff',
  sunIntensity: 1.8,
  ambient: '#4d6b90',
  ambientIntensity: 0.8,
  fog: '#1b2d43',
  sunDir: [-14, 9, -12],
  lantern: 1,
  stars: 1,
};

const SEGMENTS = { high: 128, medium: 96, low: 64 } as const;
const PIXEL_RATIO = { high: 1.75, medium: 1.5, low: 1 } as const;

export async function createSeaScene(container: HTMLElement, options: SeaSceneOptions): Promise<SeaSceneHandle> {
  const three = (await import('three')) as typeof THREE;
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');

  const scene = new three.Scene();
  const camera = new three.PerspectiveCamera(42, container.clientWidth / container.clientHeight || 1, 0.1, 600);
  camera.position.set(0.4, 1.7, 5.4);
  camera.lookAt(0, 0.55, 0);

  const renderer = new three.WebGLRenderer({ antialias: options.quality !== 'low', alpha: false });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, PIXEL_RATIO[options.quality]));
  renderer.toneMapping = three.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  container.appendChild(renderer.domElement);

  // `mix` is animated 0 (day) → 1 (night) so a toggle cross-fades the whole
  // scene instead of cutting, which would be jarring inside a dark page.
  let mix = options.timeOfDay === 'night' ? 1 : 0;
  let mixTarget = mix;

  const colour = (hex: string) => new three.Color(hex);
  const dayC = {
    zenith: colour(DAY.zenith),
    horizon: colour(DAY.horizon),
    deep: colour(DAY.waterDeep),
    shallow: colour(DAY.waterShallow),
    sun: colour(DAY.sunColour),
    ambient: colour(DAY.ambient),
    fog: colour(DAY.fog),
  };
  const nightC = {
    zenith: colour(NIGHT.zenith),
    horizon: colour(NIGHT.horizon),
    deep: colour(NIGHT.waterDeep),
    shallow: colour(NIGHT.waterShallow),
    sun: colour(NIGHT.sunColour),
    ambient: colour(NIGHT.ambient),
    fog: colour(NIGHT.fog),
  };

  const scratch = new three.Color();
  const lerpC = (a: THREE.Color, b: THREE.Color) => scratch.copy(a).lerp(b, mix).clone();

  scene.fog = new three.Fog(dayC.fog.getHex(), 24, 150);

  // --- Sky dome -----------------------------------------------------------
  const skyGeo = new three.SphereGeometry(260, 32, 16);
  const skyMat = new three.ShaderMaterial({
    side: three.BackSide,
    depthWrite: false,
    uniforms: {
      uZenith: { value: dayC.zenith.clone() },
      uHorizon: { value: dayC.horizon.clone() },
    },
    vertexShader: `
      varying vec3 vPos;
      void main() {
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      varying vec3 vPos;
      uniform vec3 uZenith;
      uniform vec3 uHorizon;
      void main() {
        float h = clamp(normalize(vPos).y * 1.6 + 0.12, 0.0, 1.0);
        gl_FragColor = vec4(mix(uHorizon, uZenith, pow(h, 0.75)), 1.0);
      }`,
  });
  const sky = new three.Mesh(skyGeo, skyMat);
  scene.add(sky);

  // --- Stars (night only) -------------------------------------------------
  const starCount = options.quality === 'low' ? 260 : 700;
  const starPos = new Float32Array(starCount * 3);
  // Deterministic placement so the sky is identical on every visit.
  let seed = 8123;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  for (let i = 0; i < starCount; i += 1) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(rand() * 0.85 + 0.08); // upper hemisphere only
    const r = 240;
    starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = r * Math.cos(phi);
    starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const starGeo = new three.BufferGeometry();
  starGeo.setAttribute('position', new three.BufferAttribute(starPos, 3));
  const starMat = new three.PointsMaterial({
    color: 0xdfe8ff,
    size: 1.15,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const stars = new three.Points(starGeo, starMat);
  scene.add(stars);

  // --- Water --------------------------------------------------------------
  const seg = SEGMENTS[options.quality];
  const waterGeo = new three.PlaneGeometry(300, 300, seg, seg);
  waterGeo.rotateX(-Math.PI / 2);

  const waterMat = new three.ShaderMaterial({
    fog: true,
    uniforms: {
      uTime: { value: 0 },
      uDeep: { value: dayC.deep.clone() },
      uShallow: { value: dayC.shallow.clone() },
      uSunDir: { value: new three.Vector3(...DAY.sunDir).normalize() },
      uSunColour: { value: dayC.sun.clone() },
      uSpecular: { value: 1 },
      fogColor: { value: dayC.fog.clone() },
      fogNear: { value: 24 },
      fogFar: { value: 150 },
    },
    vertexShader: `
      uniform float uTime;
      varying vec3 vWorld;
      varying vec3 vNormal;
      varying float vFogDepth;
      ${GLSL_WAVE_FN}
      void main() {
        vec3 p = position;
        p.y = waveHeight(p.xz, uTime);
        // Central finite differences give a normal from the same function that
        // displaced the vertex, so lighting matches the visible surface.
        float e = 0.35;
        float hx = waveHeight(p.xz + vec2(e, 0.0), uTime) - waveHeight(p.xz - vec2(e, 0.0), uTime);
        float hz = waveHeight(p.xz + vec2(0.0, e), uTime) - waveHeight(p.xz - vec2(0.0, e), uTime);
        vNormal = normalize(vec3(-hx, 2.0 * e, -hz));
        vec4 world = modelMatrix * vec4(p, 1.0);
        vWorld = world.xyz;
        vec4 viewPos = viewMatrix * world;
        vFogDepth = -viewPos.z;
        gl_Position = projectionMatrix * viewPos;
      }`,
    fragmentShader: `
      uniform vec3 uDeep;
      uniform vec3 uShallow;
      uniform vec3 uSunDir;
      uniform vec3 uSunColour;
      uniform float uSpecular;
      uniform vec3 fogColor;
      uniform float fogNear;
      uniform float fogFar;
      varying vec3 vWorld;
      varying vec3 vNormal;
      varying float vFogDepth;
      void main() {
        vec3 n = normalize(vNormal);
        vec3 viewDir = normalize(cameraPosition - vWorld);
        // Fresnel: glancing angles show sky, steep angles show depth.
        float fres = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);
        vec3 base = mix(uDeep, uShallow, clamp(fres * 1.6 + n.y * 0.25, 0.0, 1.0));
        vec3 h = normalize(uSunDir + viewDir);
        float spec = pow(max(dot(n, h), 0.0), 110.0) * uSpecular;
        vec3 col = base + uSunColour * spec;
        float fogFactor = smoothstep(fogNear, fogFar, vFogDepth);
        gl_FragColor = vec4(mix(col, fogColor, fogFactor), 1.0);
      }`,
  });
  const water = new three.Mesh(waterGeo, waterMat);
  scene.add(water);

  // --- Lighting -----------------------------------------------------------
  const ambient = new three.AmbientLight(dayC.ambient.getHex(), DAY.ambientIntensity);
  scene.add(ambient);
  const sun = new three.DirectionalLight(dayC.sun.getHex(), DAY.sunIntensity);
  sun.position.set(...DAY.sunDir);
  scene.add(sun);
  // Bounce from the water, so the buoy's underside is never pure black.
  const bounce = new three.DirectionalLight(0x3f6f8f, 0.35);
  bounce.position.set(0, -4, 2);
  scene.add(bounce);

  // --- Buoy ---------------------------------------------------------------
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(options.modelUrl);
  const buoy = gltf.scene;

  // Drop the model so the requested waterline height sits at sea level.
  buoy.position.y = -options.waterline;

  // The lantern is the top of the model; it earns its keep at night.
  const bounds = new three.Box3().setFromObject(buoy);
  const lantern = new three.PointLight(0xffc266, 0, 9, 2);
  lantern.position.set(0, bounds.max.y - 0.12, 0);

  const rig = new three.Group();
  rig.add(buoy);
  rig.add(lantern);
  scene.add(rig);

  // --- Buoy dynamics ------------------------------------------------------
  // Underdamped by design: omega0 = sqrt(14) ~= 3.7 rad/s (period ~1.7 s) with
  // damping ratio ~0.21, which is roughly how a small navigation buoy settles.
  const TILT_K = 14;
  const TILT_C = 1.6;
  const HEAVE_K = 26;
  const HEAVE_C = 4.2;
  const MAX_LEAN = 0.55;

  let leanX = 0;
  let leanZ = 0;
  let leanVX = 0;
  let leanVZ = 0;
  let heave = 0;
  let heaveV = 0;

  function step(dt: number, t: number) {
    const surface = waveAt(0, 0, t);
    const [slopeX, slopeZ] = waveSlope(0, 0, t);

    // A floating body aligns its up-axis with the surface normal.
    const targetLeanX = -slopeX;
    const targetLeanZ = -slopeZ;

    leanVX += (TILT_K * (targetLeanX - leanX) - TILT_C * leanVX) * dt;
    leanVZ += (TILT_K * (targetLeanZ - leanZ) - TILT_C * leanVZ) * dt;
    leanX += leanVX * dt;
    leanZ += leanVZ * dt;
    leanX = Math.max(-MAX_LEAN, Math.min(MAX_LEAN, leanX));
    leanZ = Math.max(-MAX_LEAN, Math.min(MAX_LEAN, leanZ));

    heaveV += (HEAVE_K * (surface - heave) - HEAVE_C * heaveV) * dt;
    heave += heaveV * dt;

    rig.position.y = heave;
    // Leaning toward +X is a negative rotation about Z; toward +Z is positive
    // about X. Small-angle approximation is fine at these magnitudes.
    rig.rotation.x = leanZ;
    rig.rotation.z = -leanX;
  }

  function nudge(dirX: number, dirZ: number, strength = 1) {
    const len = Math.hypot(dirX, dirZ) || 1;
    const s = Math.max(0, Math.min(2, strength));
    leanVX += (dirX / len) * 2.6 * s;
    leanVZ += (dirZ / len) * 2.6 * s;
    // A real strike pushes the hull down as well as over.
    heaveV -= 0.9 * s;

    // Integrate and draw one frame straight away. The settle itself needs the
    // frame loop, but the *first* response must not depend on it — otherwise a
    // throttled loop makes the buoy feel unresponsive to the click that just
    // happened. Harmless when the loop is healthy: one extra step of 1/60 s.
    step(1 / 60, clock);
    render();
  }

  const raycaster = new three.Raycaster();
  const pointer = new three.Vector2();
  const plane = new three.Plane(new three.Vector3(0, 1, 0), 0);
  const hit = new three.Vector3();

  function nudgeFromPointer(clientX: number, clientY: number, strength = 1) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    if (!raycaster.ray.intersectPlane(plane, hit)) {
      nudge(0, 1, strength);
      return;
    }
    // Push away from where the surface was struck.
    nudge(-hit.x, -hit.z, strength);
  }

  // --- Day / night --------------------------------------------------------
  function applyMix() {
    skyMat.uniforms.uZenith.value.copy(lerpC(dayC.zenith, nightC.zenith));
    skyMat.uniforms.uHorizon.value.copy(lerpC(dayC.horizon, nightC.horizon));
    waterMat.uniforms.uDeep.value.copy(lerpC(dayC.deep, nightC.deep));
    waterMat.uniforms.uShallow.value.copy(lerpC(dayC.shallow, nightC.shallow));
    waterMat.uniforms.uSunColour.value.copy(lerpC(dayC.sun, nightC.sun));
    // Specular is kept high at night: the moon's glitter path on the water is
    // what makes the buoy's silhouette readable after dark.
    waterMat.uniforms.uSpecular.value = 1 + mix * 0.55;

    const fogCol = lerpC(dayC.fog, nightC.fog);
    (scene.fog as THREE.Fog).color.copy(fogCol);
    waterMat.uniforms.fogColor.value.copy(fogCol);

    ambient.color.copy(lerpC(dayC.ambient, nightC.ambient));
    ambient.intensity = DAY.ambientIntensity + (NIGHT.ambientIntensity - DAY.ambientIntensity) * mix;
    sun.color.copy(lerpC(dayC.sun, nightC.sun));
    sun.intensity = DAY.sunIntensity + (NIGHT.sunIntensity - DAY.sunIntensity) * mix;
    sun.position.set(
      DAY.sunDir[0] + (NIGHT.sunDir[0] - DAY.sunDir[0]) * mix,
      DAY.sunDir[1] + (NIGHT.sunDir[1] - DAY.sunDir[1]) * mix,
      DAY.sunDir[2] + (NIGHT.sunDir[2] - DAY.sunDir[2]) * mix,
    );
    waterMat.uniforms.uSunDir.value.copy(sun.position).normalize();

    starMat.opacity = mix;
    // The lantern is the reason night mode exists: a navigation buoy lights up.
    lantern.intensity = mix * 11;
  }
  applyMix();

  // --- Loop ---------------------------------------------------------------
  let frame = 0;
  let running = false;
  let onScreen = false;
  let pageVisible = document.visibilityState === 'visible';
  let last = performance.now();
  let clock = 0;
  /** Backstop so a stalled frame loop cannot strand a day/night change. */
  let fadeGuard = 0;

  function render() {
    renderer.render(scene, camera);
  }

  function tick() {
    frame = requestAnimationFrame(tick);
    const now = performance.now();
    // Clamped so a backgrounded tab cannot resume with a huge integration step.
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (!options.reducedMotion) {
      clock += dt;
      waterMat.uniforms.uTime.value = clock;
      step(dt, clock);
    } else {
      // Still settle an explicit nudge, but never move on its own.
      step(dt, 0);
    }

    if (Math.abs(mixTarget - mix) > 0.001) {
      mix += (mixTarget - mix) * Math.min(1, dt * 3.2);
      applyMix();
    }
    render();
  }

  function sync() {
    const should = onScreen && pageVisible;
    if (should === running) return;
    running = should;
    if (running) {
      last = performance.now();
      tick();
    } else {
      cancelAnimationFrame(frame);
    }
  }

  const onResize = () => {
    if (!container.clientWidth || !container.clientHeight) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    render();
  };
  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(container);

  const intersection = new IntersectionObserver(
    ([e]) => {
      onScreen = e.isIntersecting;
      sync();
    },
    { threshold: 0 },
  );
  intersection.observe(container);

  const onVisibility = () => {
    pageVisible = document.visibilityState === 'visible';
    sync();
  };
  document.addEventListener('visibilitychange', onVisibility);

  // Reduced motion still needs a frame when a nudge is applied, so the loop is
  // allowed to run; it simply does not advance wave time.
  onResize();
  step(0.016, 0);
  render();
  onScreen = true;
  sync();

  return {
    dispose() {
      running = false;
      cancelAnimationFrame(frame);
      window.clearTimeout(fadeGuard);
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);

      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        const kill = (m: THREE.Material) => {
          for (const value of Object.values(m as unknown as Record<string, unknown>)) {
            if (value && typeof value === 'object' && 'isTexture' in value) (value as THREE.Texture).dispose();
          }
          m.dispose();
        };
        if (Array.isArray(material)) material.forEach(kill);
        else if (material) kill(material);
      });
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
    setTimeOfDay(value) {
      mixTarget = value === 'night' ? 1 : 0;

      if (options.reducedMotion) {
        // No cross-fade when motion is reduced: switch immediately.
        mix = mixTarget;
        applyMix();
        render();
        return;
      }

      // The cross-fade is advanced by the frame loop. If that loop is throttled
      // or frozen — a background tab, a non-compositing renderer, aggressive
      // power saving — the toggle would appear to do nothing at all. Settle it
      // directly if the fade has not converged shortly after being asked to.
      window.clearTimeout(fadeGuard);
      fadeGuard = window.setTimeout(() => {
        if (Math.abs(mixTarget - mix) > 0.01) {
          mix = mixTarget;
          applyMix();
          render();
        }
      }, 700);
    },
    nudge,
    nudgeFromPointer,
  };
}
