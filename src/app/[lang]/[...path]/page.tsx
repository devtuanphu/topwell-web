import { notFound, permanentRedirect } from 'next/navigation';
import { getContext, resolvePage, pageRoutes, collectionRoutes, getContent } from '@/lib/cms';
import { LOCALES, isLocale, localizePath } from '@/lib/i18n';
import { pathOf } from '@/lib/tree';
import type { Entry } from '@/lib/types';
import { makeMetadata } from '@/lib/seo';
import PageView from '@/components/PageView';
type Props = { params: Promise<{ lang: string; path: string[] }> };
export async function generateStaticParams() {
  const params: { lang: string; path: string[] }[] = [];
  for (const { code } of LOCALES) {
    for (const p of Object.keys(pageRoutes).filter((p) => p !== '/'))
      params.push({ lang: code, path: p.slice(1).split('/') });
    for (const [route, type] of Object.entries(collectionRoutes)) {
      const all = (await getContent<Entry[]>(type, undefined, code)) || [];
      for (const item of all)
        params.push({
          lang: code,
          path: [route, ...(type === 'articles' ? [item.slug] : pathOf(item, all).split('/'))],
        });
    }
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
/** Đường dẫn một cấp cũ (/dich-vu/<slug>) chuyển vĩnh viễn sang đường dẫn đầy đủ trong cây. */
// Đường dẫn của cây Dịch vụ / Dự án trước khi dựng lại theo Figma V1, chuyển 308 sang trang mới.
const LEGACY: Record<string, string> = {
  'dich-vu/production-lines': 'dich-vu/thiet-bi-va-giai-phap/day-chuyen-san-xuat',
  'dich-vu/machinery': 'dich-vu/thiet-bi-va-giai-phap/thiet-bi',
  'dich-vu/spare-parts-molds': 'dich-vu/phu-tung-va-linh-kien/cung-cap-phu-tung-thay-the',
  'dich-vu/technical-services': 'dich-vu/phu-tung-va-linh-kien/ho-tro-ky-thuat-giai-phap-linh-kien',
  'du-an/kho-thong-minh-asrs': 'du-an/oulide-ada-smart-warehouse',
  'du-an/khuon-ep-nhua-y-te': 'du-an/tongjun-environmental-new-materials',
};
const LEGACY_SECTIONS: Record<string, string> = {
  'dich-vu/logistics-va-chuoi-cung-ung': 'dich-vu',
  'du-an/tu-dong-hoa-day-chuyen-fdi': 'du-an',
  'du-an/trung-tam-gia-cong-5-truc': 'du-an',
  'du-an/hieu-chuan-laser': 'du-an',
  'du-an/co-khi-phu-pvd': 'du-an',
};

async function treeRedirect(parts: string[], lang: (typeof LOCALES)[number]['code']) {
  const key = parts.join('/');
  // Đường dẫn cũ, kể cả dạng đầy đủ /dich-vu/<mục gốc cũ>/<mục con cũ>.
  const legacy = LEGACY[key] || LEGACY[`${parts[0]}/${parts[parts.length - 1]}`];
  if (legacy) return `/${legacy}`;
  const section = LEGACY_SECTIONS[`${parts[0]}/${parts[1]}`];
  if (section) return `/${section}`;
  const type = collectionRoutes[parts[0]];
  if (parts.length !== 2 || !type || type === 'articles') return null;
  const all = (await getContent<Entry[]>(type, undefined, lang)) || [];
  const match = all.find((e) => e.slug === parts[1]);
  const full = match && pathOf(match, all);
  return full && full !== parts[1] ? `/${parts[0]}/${full}` : null;
}
export default async function ContentPage({ params }: Props) {
  const { lang, path: parts } = await params;
  if (!isLocale(lang)) notFound();
  const path = '/' + parts.join('/');
  const [result, context] = await Promise.all([resolvePage(path, lang), getContext(lang)]);
  if (!result) {
    const moved = await treeRedirect(parts, lang);
    if (moved) permanentRedirect(localizePath(moved, lang));
    notFound();
  }
  return <PageView {...result} path={path} context={context} />;
}
