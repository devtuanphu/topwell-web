import Link from '@/components/Link';
import type { Section } from '@/lib/types';
import { safeHref } from '@/lib/media';
import { Photo, Icon, Highlight } from '../ui';
import { UiIcon } from '../icons';
import CompanyProfile from './CompanyProfile';

export default function About({ section }: { section: Section }) {
  if (section.variant === 'company') return <CompanyProfile section={section} />;
  const [tall, ...rest] = [section.image, ...(section.images || [])].filter(Boolean);
  return (
    <section className="home-about">
      <div className="home-about-grid">
        <div className="home-about-left">
          <div className="eyebrow-block">
            {section.eyebrow && (
              <p className="eyebrow-line before">
                <span aria-hidden="true" />
                {section.eyebrow}
              </p>
            )}
            {section.title && (
              <h2 className="h2-48">
                <Highlight text={section.title} phrase={section.highlight} />
              </h2>
            )}
          </div>
          <div className="about-collage">
            {tall && <Photo picture={tall} className="tall" />}
            <div className="stack">
              {rest.slice(0, 2).map((p, i) => (
                <Photo key={i} picture={p} />
              ))}
            </div>
            {section.badges && section.badges.length > 0 && (
              <div className="about-badge">
                {section.badges.map((b, i) => (
                  <div key={i}>
                    <Icon picture={b.icon} />
                    <span>{b.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="home-about-right">
          {section.description && <p className="about-intro">{section.description}</p>}
          <div className="about-items">
            {section.cards?.map((c, i) => (
              <div className="about-item" key={i}>
                <span className="about-item-icon">
                  <Icon picture={c.icon} />
                </span>
                <div>
                  <h3>{c.title}</h3>
                  <p>{c.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="about-cta">
            {section.ctaLabel && (
              <Link className="pill dark" href={safeHref(section.ctaHref)}>
                {section.ctaLabel}
                <UiIcon name="arrowLongWhite" size={18} />
              </Link>
            )}
            {section.contactTitle && (
              <div className="about-contact">
                <span className="about-phone">
                  <UiIcon name="phoneDark" size={20} />
                </span>
                <div>
                  <strong>{section.contactTitle}</strong>
                  {section.contactText && <small>{section.contactText}</small>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
