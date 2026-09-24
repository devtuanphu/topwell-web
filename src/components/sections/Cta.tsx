'use client';
import Link from '@/components/Link';
import type { Section } from '@/lib/types';
import { mediaUrl, safeHref } from '@/lib/media';
import { Photo, Highlight } from '../ui';
import ArticleCta from './ArticleCta';

export default function Cta({ section }: { section: Section }) {
  if (section.variant === 'article') return <ArticleCta section={section} />;
  const tel = section.supportValue?.replace(/[^+0-9]/g, '');
  return (
    <section className="industrial-cta">
      <Photo picture={section.image} />
      <div className="container industrial-cta-grid">
        <div className="industrial-cta-text">
          {section.eyebrow && (
            <p className="cta-eyebrow">
              <span aria-hidden="true" />
              {section.eyebrow}
            </p>
          )}
          {section.title && (
            <h2>
              <Highlight text={section.title} phrase={section.highlight} />
            </h2>
          )}
          {section.description && <p className="cta-lead">{section.description}</p>}
          <div className="cta-actions">
            {section.ctaLabel && (
              <Link className="cta-primary" href={safeHref(section.ctaHref)}>
                {section.ctaLabel} <span aria-hidden="true">→</span>
              </Link>
            )}
            {section.supportValue && (
              <a className="cta-support" href={tel ? `tel:${tel}` : undefined}>
                <span className="cta-support-icon" aria-hidden="true">
                  <img src={mediaUrl(section.supportIcon) || '/figma-v2/963abffd4857f43b039ec7564d50316f6104d7b3.svg'} width={20} height={23} alt="" />
                </span>
                <span>
                  <small>{section.supportLabel}</small>
                  <strong>{section.supportValue}</strong>
                </span>
              </a>
            )}
          </div>
        </div>
        {section.panelTitle && (
          <aside className="cta-panel">
            <h3>
              <img src={mediaUrl(section.panelIcon) || '/figma-v2/67d2714143f939c1b282be733fcd5293e88828fa.svg'} width={20} height={18} alt="" />
              {section.panelTitle}
            </h3>
            {section.panelText && <p>{section.panelText}</p>}
            {section.cards && section.cards.length > 0 && (
              <dl>
                {section.cards.map((c) => (
                  <div key={c.title}>
                    <dt>{c.title}</dt>
                    <dd>{c.description}</dd>
                  </div>
                ))}
              </dl>
            )}
            {section.panelLabel && (
              <Link className="cta-panel-button" href={safeHref(section.panelHref)}>
                {section.panelLabel}
              </Link>
            )}
          </aside>
        )}
      </div>
    </section>
  );
}
