import Link from '@/components/Link';
import type { Entry, Section, SectionContext } from '@/lib/types';
import { Photo, Icon } from '../ui';
import { UiIcon } from '../icons';
import { pathOf } from '@/lib/tree';

/**
 * Thẻ lớn cho từng mục dịch vụ (Figma 178:25). Dùng ở trang Dịch vụ để liệt kê các mục
 * gốc, và ở trang cha để liệt kê mục con của chính nó.
 */
export default function ServiceCards({
  section,
  context,
  entries,
}: {
  section: Section;
  context: SectionContext;
  entries: Entry[];
}) {
  const { copy, services } = context;
  if (!entries.length) return null;
  return (
    <section className="service-groups">
      <div className="container service-groups-inner">
        {(section.eyebrow || section.title || section.description) && (
          <header className="center-heading narrow">
            {section.eyebrow && (
              <p className="dot-badge">
                <span aria-hidden="true" />
                {section.eyebrow}
              </p>
            )}
            {section.title && <h2>{section.title}</h2>}
            {section.description && <p>{section.description}</p>}
          </header>
        )}
        <div className="service-group-cards">
          {entries.map((entry) => (
            <article className="service-group-card" key={entry.slug}>
              <div className="service-group-media">
                <Photo picture={entry.image} />
                {entry.badge && (
                  <p className="service-group-rating">
                    <b>{entry.badge}</b>
                    {entry.badgeNote && <span>{entry.badgeNote}</span>}
                  </p>
                )}
              </div>
              <div className="service-group-head">
                <span className="service-group-icon">
                  <Icon picture={entry.icon} />
                </span>
                <div>
                  {entry.eyebrow && <p className="service-group-eyebrow">{entry.eyebrow}</p>}
                  <h3>{entry.title}</h3>
                </div>
              </div>
              {entry.summary && <p className="service-group-summary">{entry.summary}</p>}
              {entry.features && entry.features.length > 0 && (
                <ul className="service-group-features">
                  {entry.features.map((f, i) => (
                    <li key={i}>
                      <span aria-hidden="true" />
                      {f.title}
                    </li>
                  ))}
                </ul>
              )}
              <div className="service-group-action">
                <Link
                  className="service-group-cta"
                  href={`${copy.routes.serviceBase}${pathOf(entry, services)}`}
                >
                  {entry.ctaLabel || copy.common.exploreDetail || copy.common.learnMore}
                  <UiIcon name="arrowSmall" size={12} className="arrow" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
