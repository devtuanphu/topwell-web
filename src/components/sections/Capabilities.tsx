import type { Section } from '@/lib/types';
export default function Capabilities({ section }: { section: Section }) {
  return (
    <section className="capabilities">
      <div className="container capabilities-inner">
        <header className="section-head">
          {section.eyebrow && (
            <p className="eyebrow-line after">
              {section.eyebrow}
              <span aria-hidden="true" />
            </p>
          )}
          {section.title && <h2 className="h2-36">{section.title}</h2>}
        </header>
        <div className="capability-grid">
          {section.cards?.map((c, i) => (
            <article className="capability-card" key={i}>
              <span className="capability-number">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
