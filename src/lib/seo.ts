import type { Metadata } from 'next';
import type { Entry, PageContent } from './types';
import { mediaUrl } from './media';
import { DEFAULT_LOCALE, LOCALES, localizePath, type Locale } from './i18n';
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3100';
/** Absolute URL of a page path in the given language. */
export function localeUrl(path: string, locale: Locale) {
  return new URL(localizePath(path, locale), siteUrl).href;
}
/** hreflang alternates for every language, plus x-default (Vietnamese). */
export function languageAlternates(path: string) {
  return {
    ...Object.fromEntries(LOCALES.map((l) => [l.hreflang, localeUrl(path, l.code)])),
    'x-default': localeUrl(path, DEFAULT_LOCALE),
  };
}
export function makeMetadata(page: PageContent, path: string, locale: Locale = DEFAULT_LOCALE): Metadata {
  const seo = page.seo || {};
  const image = mediaUrl(
    seo.shareImage ||
      ('image' in page ? (page as Entry).image : page.sections.find((s) => s.image)?.image),
  );
  const canonical = seo.canonicalUrl || localeUrl(path, locale);
  const title = seo.metaTitle || page.title;
  const description =
    seo.metaDescription || ('summary' in page ? String(page.summary) : page.title);
  return {
    title,
    description,
    keywords: seo.keywords,
    alternates: { canonical, languages: languageAlternates(path) },
    robots: { index: !seo.noIndex, follow: !seo.noIndex },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: image
        ? [{ url: new URL(image, siteUrl).href, alt: page.title }]
        : [{ url: localizePath('/opengraph-image', locale) }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [new URL(image, siteUrl).href] : [localizePath('/opengraph-image', locale)],
    },
  };
}
export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
