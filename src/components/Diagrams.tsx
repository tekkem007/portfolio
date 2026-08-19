/**
 * Technical diagrams for the flagship case studies.
 *
 * Hard rule for this file: a diagram may only restate something Vishnu wrote in
 * his own published breakdown. It must not infer, elaborate, or fill gaps —
 * if he did not say which kit piece maps to which trim strip, the diagram does
 * not draw that mapping.
 *
 * Each diagram is inline SVG so it inherits the page's colour tokens and scales
 * with the layout, and each carries <title>/<desc> so it is not a mystery to a
 * screen reader.
 */

const LABEL = 'diagram__label';
const BODY = 'diagram__body';
const STRONG = 'diagram__strong';

function TrimSheetDiagram() {
  return (
    <svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="trim-t trim-d">
      <title id="trim-t">Trim sheet allocation</title>
      <desc id="trim-d">
        A single 4K trim sheet containing four kinds of strip — corrugated metal, cable bundles, bolted seams and
        non-directional grunge. Modular kit pieces are unwrapped to specific coordinates on that one sheet, so the
        environment resolves to a single material ID, with deferred decals layered on top.
      </desc>

      <text x="0" y="14" className={LABEL}>
        One 4K trim sheet · Substance 3D Painter
      </text>
      <rect x="0" y="26" width="250" height="232" className="diagram__box" rx="3" />
      <rect x="0" y="26" width="250" height="58" fill="var(--worlds)" opacity="0.16" />
      <rect x="0" y="84" width="250" height="58" fill="var(--systems)" opacity="0.13" />
      <rect x="0" y="142" width="250" height="58" fill="var(--worlds)" opacity="0.09" />
      <rect x="0" y="200" width="250" height="58" fill="var(--systems)" opacity="0.07" />
      <line x1="0" y1="84" x2="250" y2="84" stroke="var(--line-strong)" />
      <line x1="0" y1="142" x2="250" y2="142" stroke="var(--line-strong)" />
      <line x1="0" y1="200" x2="250" y2="200" stroke="var(--line-strong)" />
      <text x="12" y="60" className={BODY}>
        Corrugated metal
      </text>
      <text x="12" y="118" className={BODY}>
        Cable bundles
      </text>
      <text x="12" y="176" className={BODY}>
        Bolted seams
      </text>
      <text x="12" y="234" className={BODY}>
        Non-directional grunge
      </text>

      {/*
        One grouped connector, not per-strip leader lines: the write-up says kit
        pieces are unwrapped to specific coordinates on the sheet, but never says
        which piece uses which strip. Drawing that would invent detail.
      */}
      <path d="M250 142 C 310 142, 330 142, 386 142" fill="none" stroke="var(--accent)" strokeWidth="1.2" opacity="0.8" />
      <path d="M378 137 L 388 142 L 378 147" fill="none" stroke="var(--accent)" strokeWidth="1.2" opacity="0.8" />
      <text x="258" y="132" className={LABEL}>
        unwrapped to
      </text>
      <text x="258" y="160" className={LABEL}>
        fixed coordinates
      </text>

      <text x="396" y="14" className={LABEL}>
        Modular kit
      </text>
      <rect x="396" y="60" width="334" height="52" className="diagram__box" rx="3" />
      <text x="412" y="82" className={STRONG}>
        Structural trusses · floor gridding · wall panels
      </text>
      <text x="412" y="101" className={LABEL}>
        consistent texel density across the environment
      </text>

      <rect x="396" y="126" width="334" height="46" className="diagram__box" rx="3" />
      <text x="412" y="146" className={STRONG}>
        Example pieces named in the breakdown
      </text>
      <text x="412" y="164" className={BODY}>
        Yellow crane supports · ceiling trusses
      </text>

      <rect x="396" y="186" width="334" height="42" className="diagram__box" rx="3" stroke="var(--accent)" />
      <text x="412" y="212" className={STRONG}>
        → one material ID
      </text>

      <rect x="396" y="240" width="334" height="42" className="diagram__box" rx="3" strokeDasharray="3 3" />
      <text x="412" y="266" className={BODY}>
        + deferred decals — floor markings, safety warnings
      </text>
    </svg>
  );
}

function LayeredMaterialDiagram() {
  return (
    <svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="mat-t mat-d">
      <title id="mat-t">ID mask driving layered materials</title>
      <desc id="mat-d">
        An ID mask texture and a set of material layers — wood grain, painted metal, emissive trim — both feed a master
        material. It produces a material instance exposing colour tint, roughness and metallic scalars, and static
        switches for optional surface wear, so a layer can be swapped per mesh region without re-baking.
      </desc>

      <text x="0" y="14" className={LABEL}>
        Inputs
      </text>
      <rect x="0" y="28" width="180" height="96" className="diagram__box" rx="3" />
      <text x="14" y="50" className={STRONG}>
        ID_Mask
      </text>
      <rect x="14" y="62" width="46" height="44" fill="#c0392b" opacity="0.6" />
      <rect x="64" y="62" width="46" height="44" fill="#27ae60" opacity="0.6" />
      <rect x="114" y="62" width="46" height="44" fill="#2980b9" opacity="0.6" />

      <rect x="0" y="146" width="180" height="126" className="diagram__box" rx="3" />
      <text x="14" y="168" className={STRONG}>
        Material layers
      </text>
      <text x="14" y="192" className={BODY}>
        Wood grain
      </text>
      <text x="14" y="216" className={BODY}>
        Painted metal
      </text>
      <text x="14" y="240" className={BODY}>
        Emissive trim
      </text>
      <text x="14" y="262" className={LABEL}>
        shared tiling textures
      </text>

      <path d="M180 76 C 220 76, 232 130, 268 140" fill="none" stroke="var(--accent)" strokeWidth="1.2" />
      <path d="M180 208 C 220 208, 232 165, 268 156" fill="none" stroke="var(--accent)" strokeWidth="1.2" />

      <rect x="268" y="108" width="180" height="80" className="diagram__box" rx="3" stroke="var(--accent)" />
      <text x="282" y="140" className={STRONG}>
        Master material
      </text>
      <text x="282" y="162" className={BODY}>
        blends layers
      </text>

      <path d="M448 148 L 494 148" fill="none" stroke="var(--accent)" strokeWidth="1.2" />
      <path d="M486 143 L 496 148 L 486 153" fill="none" stroke="var(--accent)" strokeWidth="1.2" />

      <rect x="504" y="76" width="226" height="144" className="diagram__box" rx="3" />
      <text x="518" y="100" className={STRONG}>
        Material instance
      </text>
      <text x="518" y="126" className={BODY}>
        Colour tint
      </text>
      <text x="518" y="148" className={BODY}>
        Roughness · Metallic
      </text>
      <text x="518" y="170" className={BODY}>
        Static switches — surface wear
      </text>
      <text x="518" y="200" className={LABEL}>
        channel-packed masks
      </text>

      <text x="0" y="294" className={LABEL}>
        Swap a layer per mesh region — no re-bake, without leaving the engine
      </text>
    </svg>
  );
}

function DualLightingDiagram() {
  return (
    <svg viewBox="0 0 760 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="light-t light-d">
      <title id="light-t">Dual lighting as the eye path</title>
      <desc id="light-d">
        A wide cinematic frame in which cool ambient shadow is punctured by a warm, high-contrast pool of lamplight at
        the circular door. The eye travels from the foreground grass along the rock pathing to that focal point, while
        the palette desaturates with distance.
      </desc>

      <defs>
        <linearGradient id="lg-cool" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--systems)" stopOpacity="0.05" />
          <stop offset="1" stopColor="var(--systems)" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="lg-warm">
          <stop offset="0" stopColor="var(--worlds)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--worlds)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <text x="0" y="14" className={LABEL}>
        Wide-angle cinematic framing
      </text>
      <rect x="0" y="26" width="760" height="196" className="diagram__box" rx="3" />
      <rect x="1" y="27" width="758" height="194" fill="url(#lg-cool)" />
      <ellipse cx="560" cy="130" rx="150" ry="92" fill="url(#lg-warm)" />

      <path
        d="M20 200 C 180 196, 300 176, 420 152 C 480 140, 520 134, 545 131"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="1.1"
        opacity="0.45"
        strokeDasharray="5 4"
      />
      <path d="M537 127 L 547 131 L 537 136" fill="none" stroke="var(--ink)" strokeWidth="1.1" opacity="0.7" />

      <circle cx="560" cy="130" r="30" fill="none" stroke="var(--worlds)" strokeWidth="1.6" />
      <circle cx="560" cy="130" r="16" fill="none" stroke="var(--worlds)" strokeWidth="1" opacity="0.7" />
      <text x="600" y="126" className={STRONG}>
        Circular door
      </text>
      <text x="600" y="145" className={LABEL}>
        focal point
      </text>

      <text x="24" y="186" className={STRONG}>
        Foreground grass
      </text>
      <text x="24" y="60" className={LABEL}>
        Cool ambient — moonlight on rock
      </text>
      <text x="452" y="60" className={LABEL}>
        Warm, high contrast — door lamps
      </text>

      <text x="0" y="248" className={BODY}>
        Foreground palette vibrant → desaturates with distance
      </text>
      <text x="0" y="272" className={BODY}>
        Rock pathing and the central tree carry the eye from the grass to the rock face
      </text>
    </svg>
  );
}

interface DiagramEntry {
  title: string;
  caption: string;
  render: () => React.ReactElement;
}

/** Slug → diagram. A project without an entry simply gets no diagram. */
export const DIAGRAMS: Record<string, DiagramEntry> = {
  'maintenance-hangar': {
    title: 'One sheet, one material ID',
    caption:
      'How the trim sheet is allocated. The kit is unwrapped to fixed coordinates on a single 4K sheet, so detail reads as bespoke while the environment stays on one material ID.',
    render: TrimSheetDiagram,
  },
  'layered-material-system': {
    title: 'How a layer gets assigned',
    caption:
      'The mask and the layer set both feed the master material; the instance exposes only the parameters worth adjusting. The mesh never changes — the assignment does.',
    render: LayeredMaterialDiagram,
  },
  'time-of-day-system': {
    title: 'Where the eye goes',
    caption:
      'What the night preset is built around. The brightest, highest-contrast point in the frame is also the narrative focal point, which is why the door needs no signposting \u2014 and why the lamp multipliers rise at night rather than the sun.',
    render: DualLightingDiagram,
  },
};

export function Diagram({ slug }: { slug: string }) {
  const entry = DIAGRAMS[slug];
  if (!entry) return null;
  const Render = entry.render;

  return (
    <figure className="diagram" data-reveal="">
      <figcaption className="diagram__caption">
        <p className="eyebrow">Breakdown</p>
        <h2>{entry.title}</h2>
        <p>{entry.caption}</p>
      </figcaption>
      <div className="diagram__stage">
        <Render />
      </div>
    </figure>
  );
}
