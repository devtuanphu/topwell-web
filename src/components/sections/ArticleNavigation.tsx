'use client';
import { useCopy } from '@/components/SiteCopyProvider';
import Link from '@/components/Link';
import type { Entry, SectionContext } from '@/lib/types';

export function ArticleTags({ entry }: { entry: Entry }) {
  const copy = useCopy();
  const tags = (entry.tags || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  if (!tags.length) return null;
  return (
    <div className="article-tags">
      <span>{copy.article.tagsLabel}</span>
      {tags.map((tag) => (
        <Link key={tag} href={`${copy.routes.news}?tag=${encodeURIComponent(tag)}`}>
          #{tag.replace(/\s+/g, '')}
        </Link>
      ))}
    </div>
  );
}

export default function ArticleNavigation({ context }: { context: SectionContext }) {
  const copy = useCopy();
  const index = context.articles.findIndex((article) => article.slug === context.currentSlug);
  const previous = index > 0 ? context.articles[index - 1] : undefined;
  const next = index >= 0 ? context.articles[index + 1] : undefined;
  if (!previous && !next) return null;
  return (
    <nav className="article-navigation" aria-label={copy.accessibility.articleNavigation}>
      {previous ? (
        <Link href={`${copy.routes.articleBase}${previous.slug}`}>
          <small>← {copy.article.previousLabel}</small>
          <span>{previous.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link className="next" href={`${copy.routes.articleBase}${next.slug}`}>
          <small>{copy.article.nextLabel} →</small>
          <span>{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
