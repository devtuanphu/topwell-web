import type { Section } from '@/lib/types';
export default function Commitments({ section }: { section: Section }) {
  return (
    <section className="detail-section commitments">
      <h2>{section.title}</h2>
      <p>{section.description}</p>
      <div className="four-grid">
        {section.cards?.map((c, i) => (
          <article key={i}>
            <h3>{c.title}</h3>
            <p>{c.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
