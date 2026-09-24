'use client';
import Link from '@/components/Link';
import { useState } from 'react';
import { useCopy } from '@/components/SiteCopyProvider';
import type { Card, SectionContext } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { safeHref } from '@/lib/media';
import { Photo } from '../ui';
import { UiIcon } from '../icons';

export function articleTags(context: SectionContext) {
  const tags = new Map<string, number>();
  context.articles.forEach((a) =>
    (a.tags || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .forEach((t) => tags.set(t, (tags.get(t) || 0) + 1)),
  );
  return [...tags.keys()];
}

export default function NewsSidebar({
  context,
  promo,
  query,
  onSearch,
  onTag,
  activeTag,
}: {
  context: SectionContext;
  promo?: Card;
  query: string;
  onSearch: (q: string) => void;
  onTag: (tag: string) => void;
  activeTag: string;
}) {
  const copy = useCopy();
  const [value, setValue] = useState(query);
  const recent = [...context.articles]
    .sort((a, b) => (b.publishedDate || '').localeCompare(a.publishedDate || ''))
    .slice(0, 3);
  const gallery = context.articles.filter((a) => a.image).slice(0, 6);
  const tags = articleTags(context);
  return (
    <aside className="news-aside">
      <form
        className="news-search"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(value);
        }}
      >
        <input
          type="search"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (!e.target.value) onSearch('');
          }}
          placeholder={copy.common.searchPlaceholder}
          aria-label={copy.common.search}
        />
        <button type="submit" aria-label={copy.common.search}>
          <UiIcon name="search" size={20} />
        </button>
      </form>
      <section className="news-widget">
        <h2>{copy.sidebar.recentPostsTitle}</h2>
        <div className="recent-list">
          {recent.map((a) => (
            <Link key={a.slug} href={`${copy.routes.articleBase}${a.slug}`}>
              <Photo picture={a.image} />
              <span>
                <time dateTime={a.publishedDate}>
                  {formatDate(a.publishedDate, copy.metadata.locale)}
                </time>
                <strong>{a.title}</strong>
              </span>
            </Link>
          ))}
        </div>
      </section>
      {gallery.length > 0 && (
        <section className="news-widget">
          <h2>{copy.sidebar.instagramTitle}</h2>
          <div className="insta-grid">
            {gallery.map((a) => (
              <Link key={a.slug} href={`${copy.routes.articleBase}${a.slug}`} aria-label={a.title}>
                <Photo picture={a.image} />
              </Link>
            ))}
          </div>
        </section>
      )}
      {tags.length > 0 && (
        <section className="news-widget">
          <h2>{copy.sidebar.tagsTitle}</h2>
          <div className="tag-chips">
            {tags.map((t) => (
              <button
                type="button"
                key={t}
                aria-pressed={activeTag === t}
                onClick={() => onTag(activeTag === t ? '' : t)}
              >
                {t}
              </button>
            ))}
          </div>
        </section>
      )}
      {promo && (
        <div className="news-promo">
          <Photo picture={promo.image} />
          <div className="news-promo-top">
            {promo.eyebrow && <span className="news-promo-name">{promo.eyebrow}</span>}
            {promo.description && <span className="news-promo-role">{promo.description}</span>}
          </div>
          <div className="news-promo-bottom">
            <p>{promo.title}</p>
            {promo.label && (
              <Link href={safeHref(promo.href)}>
                {promo.label}
                <UiIcon name="arrowDark" size={14} />
              </Link>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
