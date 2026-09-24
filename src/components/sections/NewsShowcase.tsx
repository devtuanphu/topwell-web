'use client';
import { useCopy } from '@/components/SiteCopyProvider';
import Link from '@/components/Link';
import type { Section, SectionContext } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { safeHref } from '@/lib/media';
import { Photo } from '../ui';
import { UiIcon } from '../icons';

export default function NewsShowcase({
  section,
  context,
}: {
  section: Section;
  context: SectionContext;
}) {
  const copy = useCopy();
  const articles = [...context.articles]
    .sort((a, b) => (b.publishedDate || '').localeCompare(a.publishedDate || ''))
    .slice(0, 3);
  return (
    <section className="home-news">
      <div className="container home-news-inner">
        <header className="home-news-head">
          <div>
            {section.eyebrow && (
              <p className="eyebrow-line after amber">
                {section.eyebrow}
                <span aria-hidden="true" />
              </p>
            )}
            {section.title && <h2 className="h2-48">{section.title}</h2>}
          </div>
          {section.ctaLabel && (
            <Link className="pill dark" href={safeHref(section.ctaHref || copy.routes.news)}>
              {section.ctaLabel}
            </Link>
          )}
        </header>
        <div className="home-news-list">
          {articles.map((a) => (
            <Link className="home-news-card" key={a.slug} href={`${copy.routes.articleBase}${a.slug}`}>
              <div className="home-news-media">
                <Photo picture={a.image} />
                {a.category && <span>{a.category}</span>}
              </div>
              <div className="home-news-text">
                <h3>{a.title}</h3>
                <p>{a.summary}</p>
                <div className="home-news-meta">
                  {a.author && (
                    <span>
                      <UiIcon name="userOrange" />
                      {a.author}
                    </span>
                  )}
                  {a.publishedDate && (
                    <span>
                      <UiIcon name="calendarOrange" />
                      {formatDate(a.publishedDate, copy.metadata.locale)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
