import { notFound } from 'next/navigation';
import { getContext, resolvePage } from '@/lib/cms';
import { isLocale } from '@/lib/i18n';
import { makeMetadata } from '@/lib/seo';
import PageView from '@/components/PageView';
type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const result = await resolvePage('/', lang);
  return result ? makeMetadata(result.page, '/', lang) : {};
}
export default async function Home({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const [result, context] = await Promise.all([resolvePage('/', lang), getContext(lang)]);
  if (!result) notFound();
  return <PageView {...result} path="/" context={context} />;
}
