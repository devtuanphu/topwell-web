import Link from '@/components/Link';
import type { SectionContext } from '@/lib/types';
import { safeHref } from '@/lib/media';
import { Photo } from '../ui';
import { UiIcon } from '../icons';

export default function ServiceSidebar({
  context,
  currentSlug,
}: {
  context: SectionContext;
  currentSlug?: string;
}) {
  const { copy, global } = context;
  const current = context.services.find((s) => s.slug === currentSlug);
  const list = context.services.filter((s) => !current || s.group === current.group);
  const tel = (v: string) => `tel:${v.replace(/[^+0-9]/g, '')}`;
  return (
    <aside className="service-aside">
      <nav className="aside-card service-menu" aria-label={copy.sidebar.servicesTitle}>
        {list.map((s) => {
          const active = s.slug === currentSlug;
          return (
            <Link
              key={s.slug}
              href={`${copy.routes.serviceBase}${s.slug}`}
              aria-current={active ? 'page' : undefined}
            >
              <span>{s.title}</span>
              <UiIcon name={active ? 'arrowAmber' : 'arrowMuted'} size={9} />
            </Link>
          );
        })}
      </nav>
      {global.promo && (
        <div className="promo-card">
          <div className="promo-top">
            {global.promo.eyebrow && (
              <p className="promo-eyebrow">
                <span aria-hidden="true" />
                {global.promo.eyebrow}
              </p>
            )}
            <h2>{global.promo.title}</h2>
          </div>
          <div className="promo-media">
            <Photo picture={global.promo.image} />
            {global.promo.label && (
              <Link className="promo-cta" href={safeHref(global.promo.href)}>
                {global.promo.label}
              </Link>
            )}
          </div>
        </div>
      )}
      {global.workingHours && global.workingHours.length > 0 && (
        <div className="aside-card info-card">
          <h2>{copy.sidebar.hoursTitle}</h2>
          <dl className="hours-list">
            {global.workingHours.map((h, i) => (
              <div key={i}>
                <dt>{h.title}</dt>
                <dd>{h.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      <div className="aside-card info-card">
        <h2>{copy.sidebar.contactTitle}</h2>
        <div className="touch-list">
          <div>
            <span className="touch-icon">
              <UiIcon name="mail" size={20} />
            </span>
            <div>
              <a href={`mailto:${global.email}`}>{global.email}</a>
              {global.supportEmail && (
                <a className="sub" href={`mailto:${global.supportEmail}`}>
                  {global.supportEmail}
                </a>
              )}
            </div>
          </div>
          <div>
            <span className="touch-icon">
              <UiIcon name="phone" size={20} />
            </span>
            <div>
              <a href={tel(global.phone)}>{global.phone}</a>
              {global.supportPhone && (
                <a className="sub" href={tel(global.supportPhone)}>
                  {global.supportPhone}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
