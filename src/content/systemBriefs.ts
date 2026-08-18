/**
 * Problem → System → Result, for the technical track.
 *
 * A technical-art reviewer is screening for one thing: did this person identify
 * a real production problem, build something that addressed it, and can they
 * show what it cost. The case studies already answer that, but they answer it
 * in prose, several hundred words in. This is the same answer in the order a
 * reviewer reads it.
 *
 * **Every line here is a restatement of that project's own case study on this
 * site.** Nothing is summarised from outside it, nothing is inferred, and no
 * number appears here that is not already in the evidence ledger as `verified`.
 * Where a project has no measured result, `result` says so in those words —
 * see `projectEvidence.ts` for what is outstanding and how to capture it.
 */

export interface SystemBrief {
  /** Category chip. Describes the kind of technical work, not the subject. */
  category: string;
  /** The production problem or goal, as the case study states it. */
  problem: string;
  /** What made it hard — budget, hardware, ownership, existing content. */
  constraints: string;
  /** What was actually built. */
  system: string;
  /** What changed, with measured numbers only where they exist. */
  result: string;
  /** Engine and version, restated from the project's own software list. */
  engine: string;
  /** One thing worth knowing that the work itself taught. Optional. */
  lesson?: string;
}

/**
 * Not every entry has one, and that is deliberate.
 *
 * LASTLINE has no case study, its store page names no engine or toolchain, and
 * its own project entry keeps `software` empty for exactly that reason. Writing
 * a problem-and-system paragraph for it would mean inventing one, so it has no
 * brief and its card falls back to the release facts it can actually support.
 */
export const systemBriefs: Record<string, SystemBrief> = {
  'time-of-day-system': {
    category: 'Lighting Pipeline',
    problem:
      'The level shipped lit exactly one way: baked, static, night. A second time of day was not a slider, it was a second bake — and the project was running DX11 with Shader Model 5, so Lumen and Virtual Shadow Maps were not disabled, they were unavailable.',
    constraints:
      'A third-party environment used as-is, in a project holding around thirty other baked levels that all had to keep working. The pack’s candle Blueprint carried a shadow-casting point light, and there were 132 instances of it.',
    system:
      'Moved to DX12 and Shader Model 6, enabled Virtual Shadow Maps, set the sun, sky and every local light to Movable with the sky light on Real-Time Capture, and took the baked lighting data out of the content directory. On top of that, a C++ actor holding two instances of one struct: a preset describes an entire look — sun angle, colour, intensity, volumetric scattering, sky, fog, grade, lamp multipliers and particle visibility — and the controller applies or interpolates between them at runtime.',
    result:
      '143 dynamic shadow casters down to 11. 1.1 GB of baked lighting data removed. 49 standalone lights and 264 inside Blueprints converted to Movable. Frame time before and after has not been captured.',
    engine: 'Unreal Engine 5.4 · C++ · Movie Render Queue',
    lesson:
      'Three bugs were worth writing down, and the most expensive was measurement rather than code: the editor viewport applies physical camera exposure and Movie Render Queue does not, so every value tuned by eye was about ten stops out when rendered.',
  },

  'performance-audit': {
    category: 'Optimisation',
    problem:
      'Optimising your own environment proves very little — if the frame gets faster and you also control the art, nobody can tell whether the win came from engineering or from quietly deleting half the foliage. The goal was a measured optimisation pass where that ambiguity is impossible.',
    constraints:
      'A third-party scene, none of it authored here, so every millisecond had to come from engineering. Measured at 2560×1440 native, Epic scalability, on an RTX 3060.',
    system:
      'A benchmark harness built before any optimisation, then tested against itself before its numbers were trusted. Profiling identified the cost as the scalability preset rather than the scene: at Epic, ShadowQuality@3 sets the directional virtual-shadow-map LOD bias to −1.5, and the scene’s directional light carried a ShadowResolutionScale of 8.0 on top of it.',
    result:
      '32.99 → 44.37 average FPS, a 34.7% improvement. Frame time 30.45 → 22.60 ms, GPU time 29.60 → 21.76 ms, 1% lows 31.87 → 41.91, VRAM 4 327 → 3 790 MB. Every camera improved and the worst baseline camera improved most. The 90 FPS target was not reached.',
    engine: 'Unreal Engine 5.8 · PowerShell · Python',
    lesson:
      'Two hypotheses died on contact with the data. Switching Lumen to software tracing was expected to be cheaper on a mid-range card and was 5.9% slower, so it was reverted.',
  },

  'layered-material-system': {
    category: 'Materials & Shaders',
    problem:
      'Changing how an asset looks meant a round trip to Substance 3D Painter — re-texture, re-bake, re-import — and that loop gets slower the more assets share a look, because one art-direction change fans out across every texture set in the environment.',
    constraints:
      'It had to be drivable by an artist who does not want to open a material graph, and it had to cost less memory than the texture sets it replaces, not more.',
    system:
      'One master material blending several material layers — base wood grains, painted metals, emissive trims — resolved inside a single material instance. An ID map assigns material properties to regions of a mesh, so the handle and the panel are addressable independently within one material. The parameters that actually get adjusted in practice are exposed on the instance: colour tint, roughness and metallic scalars, and static switches for optional features such as surface wear.',
    result:
      'Retexturing becomes a dropdown rather than a round trip, and shared tiling textures plus channel-packed masks carry the detail instead of unique bakes. No measured numbers yet: shader instruction count, texture sets replaced, texture memory and a shader-complexity capture are all outstanding.',
    engine: 'Unreal Engine 5 · Substance 3D Painter',
    lesson: 'A system nobody else can drive is not a system.',
  },

  'maintenance-hangar': {
    category: 'Environment Systems',
    problem:
      'A hangar has to read as enormous and as functional, and those goals fight: the scale that makes a space impressive is exactly what makes it repetitive and expensive to texture, and a big open volume gives the viewer no obvious route through it.',
    constraints:
      'Industrial scale without the texture budget that usually implies. Work in progress — the images show the environment mid-development.',
    system:
      'A modular kit rather than a single environment: structural trusses, floor gridding and wall panels that snap to a consistent grid. A single 4K trim sheet in place of unique bakes per beam and panel. Lumen lighting used navigationally, picking out the central maintenance platform first. And a Blueprint that instances and deforms static meshes along a 3D spline for the transit tube, recalculating segment count, orientation and spacing as the spline points move.',
    result:
      'One 4K trim sheet and one material ID across the environment. Triangle count, draw calls and frame time have not been captured.',
    engine: 'Unreal Engine 5 · Blender · Substance 3D Painter',
    lesson:
      'Scale is only legible against something already familiar — the cones, crates and terminals are placed to make the trusses read as massive.',
  },

};
