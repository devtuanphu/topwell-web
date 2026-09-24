import type { Section } from '@/lib/types';
export default function FeatureGrid({ section }: { section: Section }) {
  return (
    <section className="detail-section">
      <h2 className="sr-only">{section.title}</h2>
      <div className="feature-grid">
        {section.cards?.map((c, i) => (
          <article className="feature-card" key={i}>
            <p className="eyebrow">{c.eyebrow}</p>
            <h3>{c.title}</h3>
            <p>{c.description}</p>
            {c.tags && (
              <div className="tags">
                {c.tags.split(',').map((t) => (
                  <span key={t}>{t.trim()}</span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
