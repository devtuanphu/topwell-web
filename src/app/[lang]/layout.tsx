import type { Metadata } from 'next';
import '@fontsource-variable/inter';
import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/jetbrains-mono';
import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/500.css';
import '@fontsource/be-vietnam-pro/600.css';
import '@fontsource/be-vietnam-pro/700.css';
import '@fontsource/be-vietnam-pro/800.css';
import '../site.css';
import '../styles/projects.css';
import '../styles/services.css';
import '../styles/home.css';
import '../styles/about.css';
import '../styles/news.css';
import '../styles/contact.css';
import '../styles/responsive.css';
import { notFound } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import { getContext } from '@/lib/cms';
import { LOCALES, isLocale } from '@/lib/i18n';
import { siteUrl, jsonLd } from '@/lib/seo';
import SiteCopyProvider from '@/components/SiteCopyProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
export function generateStaticParams() {
  return LOCALES.map((l) => ({ lang: l.code }));
}
type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { copy, header } = await getContext(lang);
  return {
    title: copy.metadata.defaultTitle,
    description: copy.metadata.description,
    metadataBase: new URL(siteUrl),
    icons: { icon: new URL(header.logo.url, process.env.NEXT_PUBLIC_STRAPI_URL || siteUrl).href },
    openGraph: {
      siteName: copy.metadata.siteName,
      locale: copy.metadata.openGraphLocale,
      alternateLocale: LOCALES.filter((l) => l.code !== lang).map((l) => l.hreflang.replace('-', '_')),
      type: 'website',
    },
  };
}
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const context = await getContext(lang);
  return (
    <html lang={lang} data-scroll-behavior="smooth">
      <body>
        <NextTopLoader color="#f1df57" height={3} showSpinner={false} shadow="0 0 10px #f1df57,0 0 5px #f1df57" />
        <SiteCopyProvider value={context.copy} locale={lang}>
          <a className="skip-link" href="#main-content">
            {context.copy.accessibility.skip}
          </a>
          <Header config={context.header} services={context.services} projects={context.projects} />
          <main id="main-content">{children}</main>
          <Footer context={context} />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: jsonLd({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: context.global.title,
                url: new URL(lang === 'vi' ? '/' : `/${lang}`, siteUrl).href,
                email: context.global.email,
                description: context.global.description,
              }),
            }}
          />
        </SiteCopyProvider>
      </body>
    </html>
  );
}
