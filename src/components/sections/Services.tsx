'use client';
import { useCopy } from '@/components/SiteCopyProvider';
import Link from '@/components/Link';
import type { Section, SectionContext } from '@/lib/types';
import { Photo, Icon } from '../ui';
import { UiIcon } from '../icons';
import ServicesShowcase from './ServicesShowcase';

export default function Services({
  section,
  context,
}: {
  section: Section;
  context: SectionContext;
}) {
  const copy = useCopy();
  if (section.variant === 'compact' || section.variant === 'featured')
    return <ServicesShowcase section={section} context={context} />;
  const entries = context.services.filter((x) => x.group === 'logistics');
  return (
    <section className="services-listing">
      <div className="container services-listing-inner">
        <header className="center-heading narrow">
          {section.eyebrow && <p className="pill-badge">{section.eyebrow}</p>}
          {section.title && <h2 className="h2-sm">{section.title}</h2>}
        </header>
        <div className="service-grid">
          {entries.map((s) => (
            <Link className="service-card" href={`${copy.routes.serviceBase}${s.slug}`} key={s.slug}>
              <Photo picture={s.image} />
              <div className="service-card-body">
                <span className="service-icon">
                  <Icon picture={s.icon} />
                </span>
                <h3>{s.title}</h3>
                <p>{s.summary}</p>
                <span className="service-card-cta">
                  {copy.common.viewService}
                  <UiIcon name="arrowSmall" size={9} className="arrow" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
