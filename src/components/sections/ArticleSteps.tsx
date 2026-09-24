import type { Section } from '@/lib/types';
export default function ArticleSteps({ section }: { section: Section }) {
  return (
    <section className="article-prose" id="process">
      <h2>{section.title}</h2>
      {section.description && <p>{section.description}</p>}
      <ol className="article-steps">
        {section.cards?.map((c, i) => (
          <li key={i}>
            <span className="step-number">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3>{c.title}</h3>
              <p>{c.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
