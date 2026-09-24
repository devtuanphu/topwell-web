'use client';
import { useCopy } from '@/components/SiteCopyProvider';
import type { Section } from '@/lib/types';
import { Button, Highlight } from '../ui';

export default function ArticleCta({ section }: { section: Section }) {
  const copy = useCopy();
  return (
    <section className="article-cta">
      <div className="container article-cta-grid">
        <div>
          <p className="eyebrow">{section.eyebrow || copy.cta.articleEyebrow}</p>
          <h2>
            <Highlight text={section.title || ''} phrase={section.highlight} />
          </h2>
          <p>{section.description}</p>
          <div className="cta-metrics">
            {section.cards?.map((card) => (
              <div key={card.title}>
                <strong>{card.title}</strong>
                <span>{card.description}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="article-cta-action">
          <Button href={section.ctaHref}>{section.ctaLabel}</Button>
        </div>
      </div>
    </section>
  );
}
