'use client';
import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import { localizePath } from '@/lib/i18n';
import { useLocale } from './SiteCopyProvider';

/** next/link that keeps visitors in their current language. */
export default function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
  const locale = useLocale();
  return <NextLink href={typeof href === 'string' ? localizePath(href, locale) : href} {...props} />;
}
