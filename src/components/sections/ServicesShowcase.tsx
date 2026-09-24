'use client';
import { useCopy } from '@/components/SiteCopyProvider';
import Link from '@/components/Link';
import type { Section, SectionContext } from '@/lib/types';
import { safeHref } from '@/lib/media';
import { Photo } from '../ui';
import { UiIcon } from '../icons';

export default function ServicesShowcase({
  section,
  context,
}: {
  section: Section;
  context: SectionContext;
}) {
  const copy = useCopy();
  const entries = context.services.filter((x) => x.group === 'industrial').slice(0, 3);
  return (
    <section className="home-services">
      <div className="home-services-band">
        <div className="container">
          <div className="home-services-head">
            {section.eyebrow && (
              <p className="eyebrow-line after dark">
                {section.eyebrow}
                <span aria-hidden="true" />
              </p>
            )}
            {section.title && <h2 className="h2-36">{section.title}</h2>}
          </div>
        </div>
      </div>
      <div className="container home-services-body">
        <div className="home-service-cards">
          {entries.map((s) => (
            <Link className="home-service-card" key={s.slug} href={`${copy.routes.serviceBase}${s.slug}`}>
              <div className="home-service-media">
                <Photo picture={s.image} />
                {s.tag && <span className="home-service-tag">{s.tag}</span>}
                <span className="view-circle" aria-hidden="true">
                  {copy.common.view}
                </span>
              </div>
              <div className="home-service-title">
                <h3>{s.title}</h3>
                <UiIcon name="arrowBlack" size={11} />
              </div>
              <p>{s.summary}</p>
            </Link>
          ))}
        </div>
        <div className="home-services-actions">
          {section.ctaLabel && (
            <Link className="pill dark" href={safeHref(section.ctaHref)}>
              {section.ctaLabel}
            </Link>
          )}
          {section.secondaryLabel && (
            <Link className="pill yellow" href={safeHref(section.secondaryHref)}>
              {section.secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
