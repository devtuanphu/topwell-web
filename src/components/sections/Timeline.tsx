import type { Section } from '@/lib/types';
import { Heading } from '../ui';
export default function Timeline({ section }: { section: Section }) {
  return (
    <section className="section timeline-section">
      <div className="container">
        <Heading section={section} center />
        <ol className="four-grid timeline">
          {section.cards?.map((c, i) => (
            <li className="timeline-card" key={i}>
              <strong>{c.eyebrow}</strong>
              <h3>{c.title}</h3>
              <p>{c.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
