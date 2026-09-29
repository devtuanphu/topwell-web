'use client';
import Link from '@/components/Link';
import type { Card, SectionContext } from '@/lib/types';
import { safeHref } from '@/lib/media';
import { Photo } from '../ui';
import Newsletter from './Newsletter';

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

/**
 * Cột phải trang Tin tức. Thiết kế mới chỉ còn thẻ hỗ trợ tư vấn và ô đăng ký bản tin
 * (Figma 171:1099, 172:1120); tìm kiếm dùng ô trên đầu trang, lọc theo chủ đề và từ khóa
 * dùng liên kết trong bài viết.
 */
export default function NewsSidebar({ promo }: { context: SectionContext; promo?: Card }) {
  return (
    <aside className="news-aside">
      {promo && (
        <div className="news-promo">
          <div className="news-promo-photo">
            <Photo picture={promo.image} />
            {promo.eyebrow && (
              <p className="news-promo-badge">
                <span aria-hidden="true" />
                {promo.eyebrow}
              </p>
            )}
          </div>
          <div className="news-promo-body">
            {promo.title && <h3>{promo.title}</h3>}
            {promo.description && <p className="news-promo-desc">{promo.description}</p>}
            {(promo.tags || promo.highlight) && (
              <div className="news-promo-hotline">
                {promo.tags && <span>{promo.tags}</span>}
                {promo.highlight && <strong>{promo.highlight}</strong>}
              </div>
            )}
            {promo.label && <Link href={safeHref(promo.href)}>{promo.label}</Link>}
          </div>
        </div>
      )}
      <Newsletter />
    </aside>
  );
}
