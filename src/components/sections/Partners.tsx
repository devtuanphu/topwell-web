'use client';
import { useCopy } from '@/components/SiteCopyProvider';
import { useRef } from 'react';
import type { Section } from '@/lib/types';
import { mediaUrl, safeHref } from '@/lib/media';
import { Highlight } from '../ui';

export default function Partners({ section }: { section: Section }) {
  const copy = useCopy();
  const cards = section.cards || [];
  const viewport = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const loop = [...cards, ...cards];
  return (
    <section className="partners-section">
      <div className="container partners-inner">
        <header className="partners-head">
          {section.eyebrow && (
            <p className="lined-eyebrow small">
              <span aria-hidden="true" />
              {section.eyebrow}
              <span aria-hidden="true" />
            </p>
          )}
          {section.title && (
            <h2 className="h2-36">
              <Highlight text={section.title} phrase={section.highlight} />
            </h2>
          )}
          {section.description && <p>{section.description}</p>}
        </header>
        <div
          className="partners-viewport"
          ref={viewport}
          role="region"
          aria-label={copy.accessibility.partners}
          tabIndex={0}
          onPointerDown={(e) => {
            if (!viewport.current) return;
            drag.current = { x: e.clientX, left: viewport.current.scrollLeft };
            viewport.current.classList.add('dragging');
          }}
          onPointerMove={(e) => {
            if (!drag.current || !viewport.current) return;
            viewport.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
          }}
          onPointerUp={() => {
            drag.current = null;
            viewport.current?.classList.remove('dragging');
          }}
          onPointerLeave={() => {
            drag.current = null;
            viewport.current?.classList.remove('dragging');
          }}
        >
          <div className="partners-track">
            {loop.map((c, i) => {
              const logo = (
                <>
                  {c.icon && <img src={mediaUrl(c.icon)} width={24} height={24} alt="" />}
                  {c.image ? <img className="partner-logo" src={mediaUrl(c.image)} alt={c.title} /> : <strong>{c.title}</strong>}
                </>
              );
              const hidden = i >= cards.length;
              return c.href ? (
                <a key={i} className="partner-card" href={safeHref(c.href)} target="_blank" rel="noopener noreferrer" aria-hidden={hidden || undefined} tabIndex={hidden ? -1 : undefined} draggable={false}>
                  {logo}
                </a>
              ) : (
                <div key={i} className="partner-card" aria-hidden={hidden || undefined}>
                  {logo}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
