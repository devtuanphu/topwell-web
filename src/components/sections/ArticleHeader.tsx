'use client';
import { useState } from 'react';
import { useCopy } from '@/components/SiteCopyProvider';
import type { Entry, SectionContext } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { Photo } from '../ui';
import { UiIcon } from '../icons';

export default function ArticleHeader({ entry }: { entry: Entry; context: SectionContext }) {
  const copy = useCopy();
  const [copied, setCopied] = useState(false);
  const share = (network: 'facebook' | 'linkedin') => {
    const url = encodeURIComponent(window.location.href);
    const target =
      network === 'facebook'
        ? `https://www.facebook.com/sharer/sharer.php?u=${url}`
        : `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    window.open(target, '_blank', 'noopener,noreferrer,width=640,height=560');
  };
  return (
    <header className="article-header">
      <div className="article-meta">
        {entry.category && <span className="article-category">{entry.category}</span>}
        {entry.readingTime && (
          <span>
            <UiIcon name="clock" size={12} />
            {entry.readingTime}
          </span>
        )}
        {entry.publishedDate && (
          <span>
            <UiIcon name="calendarMuted" size={12} />
            <time dateTime={entry.publishedDate}>
              {formatDate(entry.publishedDate, copy.metadata.locale)}
            </time>
          </span>
        )}
      </div>
      <h1>{entry.title}</h1>
      <div className="article-byline">
        <div className="article-author-mini">
          {entry.authorImage && <Photo picture={entry.authorImage} />}
          <div>
            <strong>{entry.author}</strong>
            {entry.authorRole && <span>{entry.authorRole}</span>}
          </div>
        </div>
        <div className="article-share">
          <span>{copy.article.share}</span>
          <button type="button" aria-label="Facebook" onClick={() => share('facebook')}>
            <UiIcon name="facebook" />
          </button>
          <button type="button" aria-label="LinkedIn" onClick={() => share('linkedin')}>
            <UiIcon name="linkedin" />
          </button>
          <button
            type="button"
            aria-label={copied ? copy.article.copied : copy.article.copyLink}
            title={copied ? copy.article.copied : copy.article.copyLink}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              } catch {}
            }}
          >
            <UiIcon name="link" size={12} />
          </button>
        </div>
      </div>
    </header>
  );
}
