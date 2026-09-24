import type { Picture } from './types';
export function mediaUrl(picture?: Picture): string {
  const url = picture?.media?.url || picture?.localPath || '';
  if (url.startsWith('/uploads/'))
    return `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${url}`;
  return url;
}
export function safeHref(href?: string) {
  return href &&
    (/^\/(?!\/)/.test(href) ||
      /^#[\w-]+$/.test(href) ||
      /^https?:\/\//.test(href) ||
      /^mailto:/.test(href) ||
      /^tel:[+0-9(). -]+$/.test(href))
    ? href
    : '/lien-he';
}
