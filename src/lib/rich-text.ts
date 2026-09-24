import 'server-only';
import sanitizeHtml, { type Tag } from 'sanitize-html';
import { localizePath, type Locale } from './i18n';

const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const media = (url: string) => (url.startsWith('/uploads/') ? STRAPI + url : url);

function videoEmbed(url: string) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

/** Cleans CKEditor HTML for the public site: safe tags only, media from Strapi, localized links. */
export function renderRichText(html: string, locale: Locale) {
  return sanitizeHtml(html, {
    allowedTags: [
      'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup',
      'mark', 'span', 'code', 'pre', 'blockquote', 'a', 'ul', 'ol', 'li', 'figure', 'figcaption', 'img',
      'picture', 'source', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup',
      'col', 'iframe', 'div', 'input', 'label',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel', 'title'],
      img: ['src', 'srcset', 'sizes', 'alt', 'width', 'height', 'loading'],
      source: ['srcset', 'sizes', 'type', 'media'],
      iframe: ['src', 'title', 'allow', 'allowfullscreen', 'loading'],
      td: ['colspan', 'rowspan'],
      th: ['colspan', 'rowspan', 'scope'],
      col: ['span'],
      ol: ['start', 'reversed'],
      input: ['type', 'checked', 'disabled'],
      '*': ['class', 'style', 'id'],
    },
    allowedStyles: {
      '*': {
        color: [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/i, /^hsla?\([\d\s.,%]+\)$/i, /^[a-z]+$/i],
        'background-color': [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/i, /^hsla?\([\d\s.,%]+\)$/i, /^[a-z]+$/i],
        'text-align': [/^(left|right|center|justify)$/],
        width: [/^\d+(\.\d+)?(px|%)$/],
        height: [/^\d+(\.\d+)?(px|%)$/],
        'font-size': [/^\d+(\.\d+)?(px|em|rem|%)$/],
        'aspect-ratio': [/^[\d./ ]+$/],
      },
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedIframeHostnames: ['www.youtube-nocookie.com', 'www.youtube.com', 'player.vimeo.com'],
    // Drop unchecked inputs and iframes whose source was not an allowed video host.
    exclusiveFilter: (frame) =>
      (frame.tag === 'input' && frame.attribs.type !== 'checkbox') ||
      (frame.tag === 'iframe' && !frame.attribs.src),
    transformTags: {
      // CKEditor stores videos as <oembed url>; turn them into a privacy-friendly player.
      oembed: (_tag, attribs): Tag => {
        const src = videoEmbed(attribs.url || '');
        return src
          ? { tagName: 'iframe', attribs: { src, title: 'Video', allow: 'encrypted-media; fullscreen', allowfullscreen: 'true', loading: 'lazy' } }
          : { tagName: 'a', attribs: { href: attribs.url || '#' }, text: attribs.url || '' };
      },
      img: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          src: media(attribs.src || ''),
          ...(attribs.srcset
            ? { srcset: attribs.srcset.replace(/(^|,\s*)(\/uploads\/)/g, `$1${STRAPI}$2`) }
            : {}),
          loading: 'lazy',
        },
      }),
      a: (tagName, attribs) => {
        const href = attribs.href || '';
        const external = /^https?:\/\//.test(href);
        return {
          tagName,
          attribs: {
            ...attribs,
            href: href.startsWith('/uploads/') ? media(href) : localizePath(href, locale),
            ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
          },
        };
      },
    },
  });
}
