'use client';
import { useCopy } from '@/components/SiteCopyProvider';
import Link from '@/components/Link';
import { useEffect, useMemo, useState } from 'react';
import type { Entry, Section, SectionContext } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { Photo } from '../ui';
import { UiIcon } from '../icons';
import NewsSidebar from './NewsSidebar';
import NewsShowcase from './NewsShowcase';

const PER_PAGE = 6;

function pageList(count: number, page: number) {
  if (count <= 5) return Array.from({ length: count }, (_, i) => i + 1);
  const pages = new Set([1, count, page, page - 1, page + 1].filter((p) => p >= 1 && p <= count));
  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  sorted.forEach((p, i) => {
    if (i && p - sorted[i - 1] > 1) out.push('…');
    out.push(p);
  });
  return out;
}

export function NewsCard({ article }: { article: Entry }) {
  const copy = useCopy();
  const href = `${copy.routes.articleBase}${article.slug}`;
  return (
    <article className="news-card">
      <Link href={href} className="news-card-media" tabIndex={-1} aria-hidden="true">
        <Photo picture={article.image} />
        {article.category && <span className="news-badge">{article.category}</span>}
      </Link>
      <div className="news-card-body">
        <div className="news-card-meta">
          {article.author && (
            <span>
              <UiIcon name="userAmber" size={14} />
              {article.author}
            </span>
          )}
          {article.publishedDate && (
            <span>
              <UiIcon name="calendarAmber" size={14} />
              <time dateTime={article.publishedDate}>
                {formatDate(article.publishedDate, copy.metadata.locale)}
              </time>
            </span>
          )}
        </div>
        <h2>
          <Link href={href}>{article.title}</Link>
        </h2>
        <p>{article.summary}</p>
        <Link href={href} className="read-more-button">
          {copy.common.readMore}
          <UiIcon name="arrowThinAmber" size={8} />
        </Link>
      </div>
    </article>
  );
}

export default function News({ section, context }: { section: Section; context: SectionContext }) {
  const copy = useCopy();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCategory(params.get('category') || '');
    setQuery(params.get('q') || '');
    setTag(params.get('tag') || '');
  }, []);
  const locale = copy.metadata.locale;
  const articles = useMemo(() => {
    const q = query.trim().toLocaleLowerCase(locale);
    return context.articles.filter(
      (x) =>
        (!q || `${x.title} ${x.summary}`.toLocaleLowerCase(locale).includes(q)) &&
        (!category || x.category === category) &&
        (!tag ||
          (x.tags || '')
            .split(',')
            .map((t) => t.trim())
            .includes(tag)),
    );
  }, [context.articles, query, category, tag, locale]);
  if (section.variant === 'rows') return <NewsShowcase section={section} context={context} />;
  const count = Math.max(1, Math.ceil(articles.length / PER_PAGE));
  const current = Math.min(page, count);
  const entries = articles.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const go = (p: number) => {
    setPage(p);
    document.getElementById('news-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const filter = category || tag;
  return (
    <section className="news-listing">
      <div className="news-layout">
        <div className="news-main" id="news-list">
          {section.title && <h2 className="sr-only">{section.title}</h2>}
          {filter && (
            <p className="news-filter" role="status">
              {copy.common.category}: <strong>{filter}</strong>
              <button
                type="button"
                onClick={() => {
                  setCategory('');
                  setTag('');
                  setPage(1);
                }}
              >
                {copy.common.all}
              </button>
            </p>
          )}
          <div className="news-grid">
            {entries.map((a) => (
              <NewsCard article={a} key={a.slug} />
            ))}
          </div>
          {entries.length === 0 && (
            <p className="news-empty" role="status">
              {copy.common.noResults}
            </p>
          )}
          {count > 1 && (
            <nav className="pagination" aria-label={copy.accessibility.pagination}>
              <button
                type="button"
                disabled={current === 1}
                onClick={() => go(current - 1)}
                aria-label={copy.common.previous}
              >
                <UiIcon name="chevronLeft" />
              </button>
              {pageList(count, current).map((p, i) =>
                p === '…' ? (
                  <span className="ellipsis" key={`e${i}`}>
                    ...
                  </span>
                ) : (
                  <button
                    type="button"
                    key={p}
                    aria-current={current === p ? 'page' : undefined}
                    onClick={() => go(p)}
                  >
                    {p}
                  </button>
                ),
              )}
              <button
                type="button"
                disabled={current === count}
                onClick={() => go(current + 1)}
                aria-label={copy.common.next}
              >
                <UiIcon name="chevronRight" />
              </button>
            </nav>
          )}
        </div>
        <NewsSidebar
          context={context}
          promo={section.promo}
          query={query}
          onSearch={(q) => {
            setQuery(q);
            setPage(1);
          }}
          onTag={(t) => {
            setTag(t);
            setCategory('');
            setPage(1);
          }}
          activeTag={tag}
        />
      </div>
    </section>
  );
}
