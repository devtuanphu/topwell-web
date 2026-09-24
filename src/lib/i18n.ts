// Site languages. Vietnamese is served without a prefix; English and Chinese use /en and /zh.
export const LOCALES = [
  { code: 'vi', label: 'Tiếng Việt', short: 'VI', hreflang: 'vi-VN' },
  { code: 'en', label: 'English', short: 'EN', hreflang: 'en-US' },
  { code: 'zh', label: '中文', short: '中文', hreflang: 'zh-CN' },
] as const;
export type Locale = (typeof LOCALES)[number]['code'];
export const DEFAULT_LOCALE: Locale = 'vi';
export const LOCALE_COOKIE = 'site_lang';

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.some((l) => l.code === value);
}

/** Removes a locale prefix: `/en/du-an` → `/du-an`. */
export function stripLocale(pathname: string) {
  const [, first, ...rest] = pathname.split('/');
  return isLocale(first) ? `/${rest.join('/')}` : pathname || '/';
}

/** Adds the locale prefix to an internal path; external links and anchors are returned as-is. */
export function localizePath(href: string, locale: Locale) {
  if (!/^\/(?!\/)/.test(href)) return href;
  const clean = stripLocale(href);
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`;
}
