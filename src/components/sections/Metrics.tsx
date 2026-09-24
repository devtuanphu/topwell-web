import type { Section } from '@/lib/types';
import { Icon } from '../ui';
export default function Metrics({ section }: { section: Section }) {
  return (
    <section className="section metrics-section">
      <div className="container metrics-grid">
        {section.cards?.map((c, i) => (
          <div className="metric-card" key={c.title}>
            <span className="metric-icon">
              <Icon picture={c.icon} />
            </span>
            <strong>{c.title}</strong>
            <h3>{c.description}</h3>
            {c.label && <p>{c.label}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
