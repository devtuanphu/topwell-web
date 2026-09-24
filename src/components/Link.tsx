'use client';
import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import { localizePath } from '@/lib/i18n';
import { useLocale } from './SiteCopyProvider';

/**
 * next/link giữ khách ở đúng ngôn ngữ đang xem.
 *
 * Mặc định tắt prefetch: nội dung luôn lấy mới từ CMS (`cache: 'no-store'`) nên bản
 * prefetch gần như vô dụng, trong khi header và footer có hàng chục link — hàng prefetch
 * đó làm lần điều hướng kế tiếp phải chờ, và với đường dẫn tiếng Việt (được proxy rewrite
 * sang /vi/...) còn khiến router bỏ qua luôn lần điều hướng.
 */
export default function Link({ href, prefetch = false, ...props }: ComponentProps<typeof NextLink>) {
  const locale = useLocale();
  return (
    <NextLink
      href={typeof href === 'string' ? localizePath(href, locale) : href}
      prefetch={prefetch}
      {...props}
    />
  );
}
