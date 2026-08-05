import type { Project } from '../content/types';
import { pendingEvidence, publishableEvidence } from '../content/projectEvidence';

/**
 * The scannable fact block a reviewer reads before any prose: what the
 * candidate did, who owns the assets, and whatever has actually been measured.
 *
 * Two rules are enforced here rather than trusted:
 *
 * 1. **Only verified evidence renders publicly.** Anything still awaiting a
 *    real measurement is invisible in production.
 * 2. **Pending items surface during development** as an authoring checklist, so
 *    the outstanding work is impossible to forget and impossible to ship.
 */
export function ProjectFacts({ project }: { project: Project }) {
  const { spec } = project;
  const verified = publishableEvidence(project.slug);
  const pending = import.meta.env.DEV ? pendingEvidence(project.slug) : [];

  if (!spec && verified.length === 0 && pending.length === 0) return null;

  return (
    <div className="facts">
      {spec && (
        <dl className="facts__grid">
          <div>
            <dt>My role</dt>
            <dd>{spec.role}</dd>
          </div>
          <div>
            <dt>Ownership</dt>
            <dd>{spec.ownership}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{spec.status}</dd>
          </div>
          <div>
            <dt>Tools</dt>
            <dd>{project.software.join(', ')}</dd>
          </div>
        </dl>
      )}

      {spec && spec.responsibilities.length > 0 && (
        <div className="facts__block">
          <h2>What I did</h2>
          <ul className="facts__list">
            {spec.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {spec && (
        // Stated on every project: ambiguous asset provenance is the fastest
        // way to lose a reviewer's trust, and the cheapest thing to be clear about.
        <p className="facts__sources">
          <strong>Assets:</strong> {spec.assetSources}
        </p>
      )}

      {verified.length > 0 && (
        <div className="facts__block">
          <h2>Measured</h2>
          <dl className="facts__grid facts__grid--compact">
            {verified.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>
                  {item.value}
                  {item.source && <span className="facts__source"> — {item.source}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {pending.length > 0 && (
        // Development only. Never rendered in a production build.
        <div className="facts__pending">
          <h2>Evidence still to capture ({pending.length}) — dev only</h2>
          <ul>
            {pending.map((item) => (
              <li key={item.label}>
                <strong>{item.label}</strong>
                {item.howToCapture && <span> — {item.howToCapture}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
