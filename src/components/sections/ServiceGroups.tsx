import Link from '@/components/Link';
import type { Section, SectionContext } from '@/lib/types';
import { Photo, Icon } from '../ui';
import { UiIcon } from '../icons';

/** Trang Dịch vụ: mỗi nhóm dịch vụ là một thẻ lớn (Figma v3 178:25). */
export default function ServiceGroups({
  section,
  context,
}: {
  section: Section;
  context: SectionContext;
}) {
  const { copy, serviceGroups } = context;
  if (!serviceGroups.length) return null;
  // Đường dẫn khớp với bộ định tuyến ở src/lib/cms.ts (/dich-vu/nhom/<slug>).
  const base = copy.routes.serviceGroupBase || '/dich-vu/nhom/';
  return (
    <section className="service-groups">
      <div className="container service-groups-inner">
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
        <div className="service-group-cards">
          {serviceGroups.map((group) => (
            <article className="service-group-card" key={group.slug}>
              <div className="service-group-media">
                <Photo picture={group.image} />
                {group.badge && (
                  <p className="service-group-rating">
                    <b>{group.badge}</b>
                    {group.badgeNote && <span>{group.badgeNote}</span>}
                  </p>
                )}
              </div>
              <div className="service-group-head">
                <span className="service-group-icon">
                  <Icon picture={group.icon} />
                </span>
                <div>
                  {group.eyebrow && <p className="service-group-eyebrow">{group.eyebrow}</p>}
                  <h3>{group.title}</h3>
                </div>
              </div>
              {group.summary && <p className="service-group-summary">{group.summary}</p>}
              {group.features && group.features.length > 0 && (
                <ul className="service-group-features">
                  {group.features.map((f, i) => (
                    <li key={i}>
                      <span aria-hidden="true" />
                      {f.title}
                    </li>
                  ))}
                </ul>
              )}
              <div className="service-group-action">
                <Link className="service-group-cta" href={`${base}${group.slug}`}>
                  {group.ctaLabel || copy.common.exploreDetail || copy.common.learnMore}
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
