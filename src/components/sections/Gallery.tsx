'use client';
import { useCopy } from '@/components/SiteCopyProvider';
import type { Section } from '@/lib/types';
import { Photo } from '../ui';
export default function Gallery({ section }: { section: Section }) {
  const copy = useCopy();
  const cards = section.cards || [];
  const loop = cards.length > 2 ? [...cards, ...cards] : cards;
  return (
    <section className="gallery-section" aria-label={section.title || copy.accessibility.gallery}>
      <div className="container gallery-inner">
        <header className="center-heading narrow">
          {section.eyebrow && <p className="pill-badge">{section.eyebrow}</p>}
          {section.title && <h2 className="h2-sm">{section.title}</h2>}
          {section.description && <p className="center-sub">{section.description}</p>}
        </header>
        <div className="gallery-card">
          <div className={`gallery-track ${cards.length > 2 ? 'is-marquee' : ''}`}>
            {loop.map((c, i) => (
              <figure key={i} aria-hidden={i >= cards.length ? true : undefined}>
                <Photo picture={c.image} />
                {c.title && <figcaption>{c.title}</figcaption>}
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
