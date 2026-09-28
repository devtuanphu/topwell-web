import type { Section } from '@/lib/types';

/** Quy trình 4 bước trên trang nhóm dịch vụ (Figma v3 196:3319). */
export default function ProcessSteps({ section }: { section: Section }) {
  const cards = section.cards || [];
  if (!cards.length) return null;
  return (
    <section className="process-steps-section">
      <div className="container process-steps-inner">
        <header className="center-heading narrow">
          {section.eyebrow && <p className="process-steps-eyebrow">{section.eyebrow}</p>}
          {section.title && <h2>{section.title}</h2>}
          {section.description && <p>{section.description}</p>}
        </header>
        <ol className="process-steps-grid">
          {cards.map((c, i) => (
            <li className="process-step-card" key={i}>
              <b>{String(i + 1).padStart(2, '0')}</b>
              {c.eyebrow && <p className="process-step-stage">{c.eyebrow}</p>}
              <h3>{c.title}</h3>
              {c.description && <p className="process-step-text">{c.description}</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
