import type { Project } from '../content/types';
import { SystemCard } from './SystemCard';

/**
 * "Selected Technical Art & Real-Time Work".
 *
 * One section rather than the four the theme brief proposes — Optimisation,
 * Tools, Materials, Engine Workflows — because there is exactly one project
 * behind each of those headings. Four sections of one would look like a
 * structure with the contents missing. The categories still exist; they are
 * chips on the cards, which is where a reviewer can use them.
 *
 * Filters are omitted for the same reason. A control offering five ways to
 * narrow five projects is furniture.
 */

export function SystemGallery({ heading, intro, items }: { heading: string; intro: string; items: Project[] }) {
  return (
    <section className="section section--lab" id="work" aria-labelledby="work-title">
      {/* The rule that draws itself as the section arrives. Decorative: it adds
          a line that would not otherwise be there, so ignoring it loses nothing. */}
      <div className="sys-rule" aria-hidden="true" data-scene="" />

      <div className="shell shell--media">
        <div className="section-head">
          <p className="eyebrow">Selected work</p>
          <h2 id="work-title">{heading}</h2>
          <p>{intro}</p>
        </div>

        <div className="sys-grid">
          {items.map((project, i) => (
            <SystemCard key={project.slug} project={project} lead={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
