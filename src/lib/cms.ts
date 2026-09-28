import 'server-only';
import defaults from '@/data/site-settings.json';
import type { SiteCopy } from '@/components/SiteCopyProvider';
import { cache } from 'react';
import demo from '@/data/demo.json';
import { DEFAULT_LOCALE, type Locale } from './i18n';
import type {
  Entry,
  Global,
  HeaderConfig,
  FooterConfig,
  PageContent,
  SectionContext,
  ServiceGroup,
} from './types';
export const pageRoutes: Record<string, string> = {
  '/': 'home-page',
  '/ve-chung-toi': 'about-page',
  '/dich-vu': 'services-page',
  '/du-an': 'projects-page',
  '/tin-tuc': 'news-page',
  '/lien-he': 'contact-page',
  '/chinh-sach-bao-mat': 'privacy-page',
  '/tieu-chuan-ky-thuat': 'standards-page',
};
export const collectionRoutes: Record<string, 'services' | 'projects' | 'articles'> = {
  'dich-vu': 'services',
  'du-an': 'projects',
  'tin-tuc': 'articles',
};
/** Trang riêng của nhóm dịch vụ: /dich-vu/nhom/<slug>. */
export const SERVICE_GROUP_SEGMENT = 'nhom';
export const demoMode = process.env.USE_DEMO_CONTENT === 'true';
const base = process.env.STRAPI_URL || 'http://localhost:1337';
export const getContent = cache(
  async <T>(type: string, slug?: string, locale: Locale = DEFAULT_LOCALE): Promise<T | null> => {
    if (demoMode) {
      const source =
        type === 'site-settings'
          ? defaults
          : type === 'footer'
            ? demo.footer
            : type === 'header'
              ? demo.header
              : type === 'global'
                ? demo.global
                : type in demo.pages
                  ? demo.pages[type as keyof typeof demo.pages]
                  : demo[type as 'services' | 'projects' | 'articles'];
      return (
        slug && Array.isArray(source) ? source.find((x) => x.slug === slug) || null : source
      ) as T;
    }
    const res = await fetch(
      `${base}/api/site/${encodeURIComponent(type)}${slug ? '/' + encodeURIComponent(slug) : ''}?locale=${locale}`,
      { cache: 'no-store', signal: AbortSignal.timeout(10000) },
    );
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Strapi returned ${res.status} for ${type}`);
    return (await res.json()).data as T;
  },
);
export const getContext = cache(
  async (locale: Locale = DEFAULT_LOCALE): Promise<SectionContext> => {
    const [services, serviceGroups, projects, articles, global, header, copy, footer] =
      await Promise.all([
        getContent<Entry[]>('services', undefined, locale),
        getContent<ServiceGroup[]>('service-groups', undefined, locale),
        getContent<Entry[]>('projects', undefined, locale),
        getContent<Entry[]>('articles', undefined, locale),
        getContent<Global>('global', undefined, locale),
        getContent<HeaderConfig>('header', undefined, locale),
        getContent<SiteCopy>('site-settings', undefined, locale),
        getContent<FooterConfig>('footer', undefined, locale),
      ]);
    if (!global) throw new Error('Publish the Global single type in Strapi.');
    if (!copy || !footer) throw new Error('Publish Site settings and Footer in Strapi.');
    if (!header) throw new Error('Publish the Header single type in Strapi.');
    return {
      locale,
      services: services || [],
      serviceGroups: serviceGroups || [],
      projects: projects || [],
      articles: articles || [],
      global,
      header,
      copy,
      footer,
    };
  },
);
export async function resolvePage(
  path: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<{ page: PageContent | Entry; kind: string } | null> {
  if (pageRoutes[path]) {
    const page = await getContent<PageContent>(pageRoutes[path], undefined, locale);
    return page ? { page, kind: 'page' } : null;
  }
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 3 && parts[0] === 'dich-vu' && parts[1] === SERVICE_GROUP_SEGMENT) {
    const group = await getContent<ServiceGroup>('service-groups', parts[2], locale);
    return group ? { page: group, kind: 'service-groups' } : null;
  }
  const type = collectionRoutes[parts[0]];
  if (parts.length !== 2 || !type) return null;
  const page = await getContent<Entry>(type, parts[1], locale);
  return page ? { page, kind: type } : null;
}
