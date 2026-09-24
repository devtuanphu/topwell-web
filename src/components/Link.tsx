'use client';
import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import { DEFAULT_LOCALE, localizePath } from '@/lib/i18n';
import { useLocale } from './SiteCopyProvider';

/** next/link that keeps visitors in their current language. */
export default function Link({ href, prefetch, ...props }: ComponentProps<typeof NextLink>) {
  const locale = useLocale();
  const target = typeof href === 'string' ? localizePath(href, locale) : href;
  // Đường dẫn tiếng Việt không có tiền tố nên proxy phải rewrite sang /vi/...
  // Bản prefetch của những đường dẫn đó khiến router bỏ qua lần điều hướng sau này.
  const rewritten = locale === DEFAULT_LOCALE && typeof target === 'string' && target.startsWith('/');
  return <NextLink href={target} prefetch={prefetch ?? (rewritten ? false : undefined)} {...props} />;
}
