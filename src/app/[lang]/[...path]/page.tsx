import { notFound } from 'next/navigation';
import { getContext, resolvePage, pageRoutes, collectionRoutes, getContent } from '@/lib/cms';
import { LOCALES, isLocale } from '@/lib/i18n';
import type { Entry } from '@/lib/types';
import { makeMetadata } from '@/lib/seo';
import PageView from '@/components/PageView';
type Props = { params: Promise<{ lang: string; path: string[] }> };
export async function generateStaticParams() {
  const params: { lang: string; path: string[] }[] = [];
  for (const { code } of LOCALES) {
    for (const p of Object.keys(pageRoutes).filter((p) => p !== '/'))
      params.push({ lang: code, path: p.slice(1).split('/') });
    for (const [route, type] of Object.entries(collectionRoutes))
      for (const item of (await getContent<Entry[]>(type, undefined, code)) || [])
        params.push({ lang: code, path: [route, item.slug] });
  }
  return params;
}
export async function generateMetadata({ params }: Props) {
  const { lang, path: parts } = await params;
  if (!isLocale(lang)) return {};
  const path = '/' + parts.join('/');
  const result = await resolvePage(path, lang);
  return result
    ? makeMetadata(result.page, path, lang)
    : { title: '404', robots: { index: false } };
}
export default async function ContentPage({ params }: Props) {
  const { lang, path: parts } = await params;
  if (!isLocale(lang)) notFound();
  const path = '/' + parts.join('/');
  const [result, context] = await Promise.all([resolvePage(path, lang), getContext(lang)]);
  if (!result) notFound();
  return <PageView {...result} path={path} context={context} />;
}
