'use client';
import { useState } from 'react';
import type { Section } from '@/lib/types';
import { UiIcon } from '../icons';
export default function Faq({ section }: { section: Section }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="faq-list">
      {section.title && <h2 className="sr-only">{section.title}</h2>}
      {section.cards?.map((c, i) => {
        const isOpen = open === i;
        const id = `faq-${section.id || 0}-${i}`;
        return (
          <div className={`faq-item ${isOpen ? 'open' : ''}`} key={i}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span>{c.title}</span>
                <span className="faq-toggle" aria-hidden="true">
                  <UiIcon name={isOpen ? 'chevronAmber' : 'chevronDark'} size={16} />
                </span>
              </button>
            </h3>
            <div className="faq-panel" id={id} role="region" hidden={!isOpen}>
              <p>{c.description}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
