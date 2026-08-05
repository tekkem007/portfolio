/**
 * Case-study templates for work that does not exist yet.
 *
 * These are **authoring scaffolds, not content**. They are exported for use in
 * documentation and are deliberately NOT imported by any page, so nothing here
 * can reach the public build and imply a capability the portfolio cannot
 * demonstrate. The audit was explicit: do not present as an automotive or VFX
 * specialist until relevant work exists.
 *
 * To publish one: do the work, capture the evidence each `prompts` line asks
 * for, then write a real entry in `projects.ts` and its facts in
 * `projectEvidence.ts`. Delete the template's use here — do not "fill it in"
 * and ship it, because the section list is a checklist of what to *make*, not
 * a form to complete.
 */

export interface CaseStudyTemplate {
  id: string;
  title: string;
  /** Which role this piece would unlock. */
  unlocks: string;
  /** Why the portfolio currently fails for that role. */
  gap: string;
  /** Section headings the finished case study should carry. */
  sections: string[];
  /** The specific captures required. Each becomes an EvidenceItem. */
  evidence: { label: string; howToCapture: string }[];
  /** What a recruiter should conclude after reading it. */
  takeaway: string;
  /** Rough effort, so it can be scheduled honestly. */
  effort: string;
}

export const automotiveTemplate: CaseStudyTemplate = {
  id: 'automotive-hero',
  title: 'Automotive hero scene',
  unlocks: 'Automotive Visualisation Artist',
  gap: 'The portfolio currently contains zero automotive work — no vehicle, no car paint, no configurator.',
  sections: [
    'The brief and the constraints',
    'CAD preparation and mesh cleanup',
    'Car-paint material: base, metallic flake, clearcoat',
    'Studio lighting and reflection strategy',
    'Real-time optimisation for the target hardware',
    'Configurator: variants, paint and wheel swapping',
    'Measured results',
    'What I would do differently',
  ],
  evidence: [
    {
      label: 'Source mesh vs optimised mesh',
      howToCapture: 'Triangle counts before and after retopology/decimation, with wireframes of both.',
    },
    {
      label: 'Car-paint material cost',
      howToCapture: 'Material Editor → Stats: instruction count for the paint master and each variant instance.',
    },
    {
      label: 'Frame time',
      howToCapture: '`stat unit` at a stated resolution and GPU, in the final lighting setup.',
    },
    { label: 'Draw calls', howToCapture: '`stat RHI` — DrawPrimitive calls for the full configurator scene.' },
    {
      label: 'Reflection setup',
      howToCapture: 'Note which of Lumen / reflection captures / planar reflections was used and why.',
    },
    { label: 'Texture memory', howToCapture: 'Window → Statistics → Texture Stats for the vehicle alone.' },
  ],
  takeaway: 'He can take CAD data to a real-time configurator that holds a frame budget.',
  effort: '3–4 weeks. The largest single gap on the roadmap — only start it if targeting automotive.',
};

export const vfxTemplate: CaseStudyTemplate = {
  id: 'realtime-vfx',
  title: 'Real-time VFX system',
  unlocks: 'Real-time VFX / Virtual Production Artist',
  gap: 'The portfolio currently contains zero Niagara, particle, simulation or Sequencer work.',
  sections: [
    'What the effect has to sell',
    'Niagara system architecture: emitters and modules',
    'GPU vs CPU simulation, and why',
    'Art direction: timing, silhouette, colour over life',
    'Integration into the environment',
    'Sequencer shot and camera',
    'GPU cost and scalability settings',
    'Measured results',
  ],
  evidence: [
    { label: 'Particle counts', howToCapture: 'Niagara debugger: peak active particles per emitter.' },
    {
      label: 'GPU cost of the system',
      howToCapture: 'GPU Visualizer (Ctrl+Shift+,) — isolate the Niagara pass in ms.',
    },
    {
      label: 'Scalability behaviour',
      howToCapture: 'Record the effect at Low / Medium / Epic scalability with the cost at each.',
    },
    { label: 'Emitter graph', howToCapture: 'Screenshot the Niagara system and one emitter module stack.' },
    { label: 'Sequencer shot', howToCapture: 'Export a short clip; state resolution, frame rate and render path.' },
  ],
  takeaway: 'He can build and cost a Niagara system, not just place someone else’s.',
  effort: '1–2 weeks for one system done properly. Highest unlock per hour of the two.',
};

export const caseStudyTemplates: CaseStudyTemplate[] = [automotiveTemplate, vfxTemplate];
