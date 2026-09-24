'use client';
import { useCopy } from '@/components/SiteCopyProvider';
import Link from '@/components/Link';
import type { SectionContext } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { safeHref } from '@/lib/media';
import { Photo } from '../ui';
import { UiIcon } from '../icons';
import Newsletter from './Newsletter';

export default function ArticleSidebar({
  context,
  category,
}: {
  context: SectionContext;
  category: string;
}) {
  const copy = useCopy();
  const categories = [...new Set(context.articles.map((article) => article.category))];
  const current = context.articles.find((a) => a.slug === context.currentSlug);
  const recent = [
    ...(current ? [current] : []),
    ...context.articles.filter((a) => a.slug !== context.currentSlug),
  ].slice(0, 3);
  const phone = context.global.supportPhone || context.global.phone;
  return (
    <aside className="article-aside">
      <section className="aside-box category-box">
        <h2>{copy.sidebar.categoriesTitle}</h2>
        <div className="category-list">
          {categories.map((name) => {
            const count = context.articles.filter((a) => a.category === name).length;
            return (
              <Link
                key={name}
                aria-current={name === category ? 'true' : undefined}
                href={`${copy.routes.news}?category=${encodeURIComponent(name)}`}
              >
                <span>{name}</span>
                <small>{String(count).padStart(2, '0')}</small>
              </Link>
            );
          })}
        </div>
        <Link className="category-all" href={copy.routes.news}>
          <UiIcon name="arrowLeftDark" size={14} />
          {copy.sidebar.viewAllArticles}
        </Link>
      </section>
      <section className="aside-box recent-box">
        <h2>{copy.sidebar.recentTitle}</h2>
        <div className="recent-rows">
          {recent.map((a) => (
            <Link
              key={a.slug}
              href={`${copy.routes.articleBase}${a.slug}`}
              aria-current={a.slug === context.currentSlug ? 'page' : undefined}
            >
              <Photo picture={a.image} />
              <span>
                <strong>{a.title}</strong>
                <time dateTime={a.publishedDate}>
                  {formatDate(a.publishedDate, copy.metadata.locale)}
                </time>
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="consult-card">
        <div className="consult-media">
          <Photo picture={context.global.supportImage} />
          <span className="online-badge">
            <i aria-hidden="true" />
            {copy.sidebar.onlineLabel}
          </span>
        </div>
        <div className="consult-body">
          <h2>{copy.sidebar.articleTitle}</h2>
          <p>{copy.sidebar.consultText}</p>
          <a className="consult-phone" href={`tel:${phone.replace(/[^+0-9]/g, '')}`}>
            <small>{copy.sidebar.hotlineLabel}</small>
            <strong>{phone}</strong>
          </a>
          <Link className="consult-cta" href={safeHref(copy.sidebar.articleHref)}>
            {copy.sidebar.articleLabel}
          </Link>
        </div>
      </section>
      <Newsletter />
    </aside>
  );
}
