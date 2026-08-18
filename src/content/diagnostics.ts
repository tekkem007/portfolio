/**
 * Diagnostic View: the same work, seen the way the engine shows it.
 *
 * Every state below is an existing capture from that project, already in the
 * media manifest, and **every one was opened and checked against its label
 * before it was listed here** — which is how several of them ended up with
 * different labels than the manifest's alt text originally claimed.
 *
 * Nothing here is a diagnostic rendered for this website. There is no wireframe
 * state for a project with no wireframe capture, and no shader-complexity or
 * lighting-complexity state anywhere, because no such capture exists yet. Those
 * are outstanding requests in `projectEvidence.ts`, not gaps to paper over.
 *
 * A project missing from this map shows its cover image and nothing else. The
 * absence of a diagnostic view is itself accurate.
 */

export interface DiagnosticState {
  /** Media id. Must exist in the manifest. */
  id: string;
  /** Control label. A factual claim about what is on screen. */
  label: string;
  /** What the reviewer is looking at, and why it is worth looking at. */
  note: string;
  /**
   * Captured from the same camera as the first state in the set.
   *
   * This matters enough to be data rather than prose. Someone comparing two
   * frames reads every difference as meaningful, so a state that moved the
   * camera has to say so instead of letting the shift pass as part of the
   * comparison. Editor captures — graphs, tables, Blueprints — are never
   * aligned and never claim to be.
   */
  aligned?: boolean;
}

export interface DiagnosticSet {
  states: DiagnosticState[];
}

export const diagnostics: Record<string, DiagnosticSet> = {
  'time-of-day-system': {
    states: [
      {
        id: 'tod-01',
        label: 'Day',
        note: 'The Day preset applied at runtime — warm sun raking across the rock face.',
        aligned: true,
      },
      {
        id: 'tod-02',
        label: 'Night',
        note: 'Same camera, same level, Night preset. Nothing was re-baked between these two frames — that is the whole point of the system.',
        aligned: true,
      },
      {
        id: 'tod-04',
        label: 'Blend',
        note: 'Five frames stacked along the night-to-day interpolation, showing the controller mid-transition.',
      },
      {
        id: 'tod-03',
        label: 'Preset data',
        note: 'Every field of the FTimeOfDayPreset struct, Day against Night, with the differing rows marked.',
      },
    ],
  },

  'maintenance-hangar': {
    states: [
      {
        id: 'hangar-01',
        label: 'Final',
        note: 'Lit with Lumen and textured from the single 4K trim sheet.',
        aligned: true,
      },
      {
        id: 'hangar-03',
        label: 'Unlit',
        note: 'The same environment with lighting off — the modular kit and the spline-generated transit tube as geometry. Captured from a nearby position rather than the identical camera.',
      },
      {
        id: 'hangar-02',
        label: 'Blueprint',
        note: 'BP_Array: the construction script that reads positions along a spline and instances meshes at them.',
      },
    ],
  },

  'layered-material-system': {
    states: [
      {
        id: 'material-03',
        label: 'Final',
        note: 'The layered material resolved on the mesh, lit in the viewport.',
        aligned: true,
      },
      {
        id: 'material-02',
        label: 'ID mask',
        note: 'The identical camera, unlit: the flat colour regions that decide which layer each part of the mesh receives.',
        aligned: true,
      },
      {
        id: 'material-04',
        label: 'Master material',
        note: 'MM_BaseLayer with its Stats panel open — 152 base-pass instructions, 119 vertex, 2 of 16 texture samplers.',
      },
      {
        id: 'material-01',
        label: 'Layer stack',
        note: 'The material instance an artist actually drives: seven layers, a blend asset and the ID mask parameter.',
      },
    ],
  },
};
