import type { Section } from '@/lib/types';

/** Dải số liệu nền tối trên trang nhóm dịch vụ (Figma v3 196:3379). */
export default function MetricsStrip({ section }: { section: Section }) {
  const cards = section.cards || [];
  if (!cards.length) return null;
  return (
    <section className="metrics-strip-section">
      <div className="container">
        <dl className="metrics-strip">
          {cards.map((c, i) => (
            <div key={i}>
              <dt>{c.title}</dt>
              <dd>
                <strong>{c.eyebrow}</strong>
                {c.description && <span>{c.description}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
