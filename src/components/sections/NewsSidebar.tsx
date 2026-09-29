'use client';
import Link from '@/components/Link';
import type { Card, SectionContext } from '@/lib/types';
import { safeHref } from '@/lib/media';
import { Photo } from '../ui';
import { UiIcon } from '../icons';
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
      <Newsletter />
    </aside>
  );
}
