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
    </aside>
  );
}
