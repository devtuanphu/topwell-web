import type { MetadataRoute } from 'next';
import { getContent, pageRoutes, collectionRoutes, SERVICE_GROUP_SEGMENT } from '@/lib/cms';
import type { Entry, PageContent, ServiceGroup } from '@/lib/types';
import { LOCALES } from '@/lib/i18n';
import { languageAlternates, localeUrl } from '@/lib/seo';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [];
  const add = (path: string, updatedAt: string | undefined, priority: number) => {
    for (const { code } of LOCALES)
      urls.push({
        url: localeUrl(path, code),
        lastModified: updatedAt,
        changeFrequency: priority === 0.6 ? 'monthly' : 'weekly',
        priority,
        alternates: { languages: languageAlternates(path) },
      });
  };
  for (const [path, type] of Object.entries(pageRoutes)) {
    const p = await getContent<PageContent>(type);
    if (p && !p.seo?.noIndex) add(path, p.updatedAt, path === '/' ? 1 : 0.8);
  }
  for (const [route, type] of Object.entries(collectionRoutes))
    for (const p of (await getContent<Entry[]>(type)) || [])
      if (!p.seo?.noIndex) add(`/${route}/${p.slug}`, p.updatedAt, 0.6);
  for (const g of (await getContent<ServiceGroup[]>('service-groups')) || [])
    if (!g.seo?.noIndex) add(`/dich-vu/${SERVICE_GROUP_SEGMENT}/${g.slug}`, g.updatedAt, 0.7);
  return urls;
}
