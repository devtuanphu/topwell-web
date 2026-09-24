'use client';
import { useCopy } from '@/components/SiteCopyProvider';
import type { Section } from '@/lib/types';
export default function ArticleComparison({ section }: { section: Section }) {
  const copy = useCopy();
  const checklist = (section.checklist || '')
    .split('\n')
    .map((x) => x.trim())
    .filter(Boolean);
  return (
    <section className="article-prose" id="standards">
      <h2>{section.title}</h2>
      {section.description && <p>{section.description}</p>}
      <div className="table-scroll" tabIndex={0} role="region" aria-label={copy.accessibility.comparison}>
        <table className="article-table">
          <thead>
            <tr>
              <th scope="col">{copy.article.comparisonItem}</th>
              <th scope="col">{copy.article.comparisonReference}</th>
              <th scope="col">{copy.article.comparisonTarget}</th>
            </tr>
          </thead>
          <tbody>
            {section.cards?.map((c, i) => (
              <tr key={i}>
                <th scope="row">{c.title}</th>
                <td>{c.description}</td>
                <td>{c.eyebrow}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {checklist.length > 0 && (
        <>
          {section.checklistTitle && <h3 className="checklist-title">{section.checklistTitle}</h3>}
          <ul className="article-checklist" aria-label={copy.accessibility.checklist}>
            {checklist.map((item) => (
              <li key={item}>
                <span aria-hidden="true">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
