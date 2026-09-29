'use client';
import { useCopy } from '@/components/SiteCopyProvider';
import { useState } from 'react';
import Link from '@/components/Link';
import type { Section, SectionContext } from '@/lib/types';
import { Photo, Icon } from '../ui';
import { UiIcon } from '../icons';
import Pagination from '../Pagination';
import ServicesShowcase from './ServicesShowcase';
import ServiceCards, { pickEntries } from './ServiceCards';
import { pathOf } from '@/lib/tree';

const PER_PAGE = 6;

export default function Services({
  section,
  context,
}: {
  section: Section;
  context: SectionContext;
}) {
  const copy = useCopy();
  const [page, setPage] = useState(1);
  if (section.variant === 'compact' || section.variant === 'featured')
    return <ServicesShowcase section={section} context={context} />;
  const node = context.services.find((x) => x.slug === context.currentSlug);
  if (section.variant === 'groups')
    return (
      <ServiceCards
        section={section}
        context={context}
        entries={pickEntries(section, context.services, node)}
      />
    );
  // Trang cha liệt kê mục con của chính nó; trang Dịch vụ liệt kê các mục gốc.
  const all = pickEntries({ ...section, limit: undefined }, context.services, node);
  const count = Math.max(1, Math.ceil(all.length / PER_PAGE));
  const current = Math.min(page, count);
  const entries = all.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  return (
    <section className="services-listing">
      <div className="container services-listing-inner" id="service-list">
        <header className="center-heading narrow">
          {section.eyebrow && <p className="pill-badge">{section.eyebrow}</p>}
          {section.title && <h2 className="h2-sm">{section.title}</h2>}
        </header>
        <div className="service-grid">
          {entries.map((s) => (
            <Link
              className="service-card"
              href={`${copy.routes.serviceBase}${pathOf(s, context.services)}`}
              key={s.slug}
            >
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
        <Pagination
          count={count}
          current={current}
          onChange={(p) => {
            setPage(p);
            document
              .getElementById('service-list')
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />
      </div>
    </section>
  );
}
