'use client';
import { useState } from 'react';
import { useLocale } from '@/components/SiteCopyProvider';
import { localizePath } from '@/lib/i18n';
import type { Section } from '@/lib/types';
import { mediaUrl, safeHref } from '@/lib/media';
import { Photo, Highlight } from '../ui';
import { MediaDialog, embedUrl } from './VideoCta';

function Emphasis({ text }: { text: string }) {
  // **word** in CMS text renders as emphasised copy (Figma: SemiBold #1e293b).
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
        part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part,
      )}
    </>
  );
}

export default function AboutHero({ section }: { section: Section }) {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const href = section.ctaHref ? localizePath(safeHref(section.ctaHref), locale) : '';
  const media = href && /youtu|vimeo|\.(mp4|webm)(\?|$)/i.test(href) ? embedUrl(href) : null;
  const external = /^https?:|\.pdf(\?|$)/i.test(href);
  const [big, pill, small] = [section.image, ...(section.images || [])];
  return (
    <section className="about-hero">
      <div className="container about-hero-grid">
        <div className="about-hero-text">
          {section.eyebrow && (
            <p className="mono-badge">
              <span
                className="mono-badge-icon"
                aria-hidden="true"
                style={section.eyebrowIcon ? { backgroundImage: `url(${mediaUrl(section.eyebrowIcon)})` } : undefined}
              />
              {section.eyebrow}
              <span className="mono-badge-line" aria-hidden="true" />
            </p>
          )}
          {section.title && (
            <h2>
              <Highlight text={section.title} phrase={section.highlight} />
            </h2>
          )}
          {section.description && (
            <p className="about-hero-lead">
              <Emphasis text={section.description} />
            </p>
          )}
          {section.ctaLabel &&
            (media ? (
              <button type="button" className="see-more" onClick={() => setOpen(true)}>
                {section.ctaLabel}
                <span aria-hidden="true">→</span>
              </button>
            ) : (
              <a
                className="see-more"
                href={href || '#'}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {section.ctaLabel}
                <span aria-hidden="true">→</span>
              </a>
            ))}
        </div>
        <div className="about-hero-collage">
          {big && <Photo picture={big} priority className="collage-big" />}
          {pill && <Photo picture={pill} className="collage-pill" />}
          {small && <Photo picture={small} className="collage-small" />}
        </div>
      </div>
      {open && media && <MediaDialog url={href} title={section.ctaLabel || ''} onClose={() => setOpen(false)} />}
    </section>
  );
}
