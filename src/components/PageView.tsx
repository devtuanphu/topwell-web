import Link from '@/components/Link';
import type { Entry, PageContent, Section, SectionContext } from '@/lib/types';
import SectionRenderer from './SectionRenderer';
import PageBanner, { type Crumb } from './PageBanner';
import ArticleSidebar from './sections/ArticleSidebar';
import ArticleHeader from './sections/ArticleHeader';
import ArticleNavigation, { ArticleTags } from './sections/ArticleNavigation';
import ServiceSidebar from './sections/ServiceSidebar';
import { jsonLd, localeUrl } from '@/lib/seo';
import { mediaUrl } from '@/lib/media';

const BANNER_SECTIONS = ['sections.page-hero'];

export default function PageView({
  page,
  kind,
  path,
  context,
}: {
  page: PageContent;
  kind: string;
  path: string;
  context: SectionContext;
}) {
  const copy = context.copy;
  const entry = page as Entry;
  const ctx = { ...context, currentSlug: entry.slug };
  const all = page.sections || [];
  const hero = all.find((s) => BANNER_SECTIONS.includes(s.__component));
  const sections = all.filter((s) => !BANNER_SECTIONS.includes(s.__component));
  const isHome = path === '/';

  const parent: Crumb | undefined =
    kind === 'services'
      ? { label: copy.common.services, href: copy.routes.services }
      : kind === 'projects'
        ? { label: copy.common.projects, href: copy.routes.projects }
        : kind === 'articles'
          ? { label: copy.common.news, href: copy.routes.news }
          : undefined;
  const bannerTitle = hero?.title || page.title;
  const crumbs: Crumb[] = [
    { label: copy.common.home, href: copy.routes.home },
    ...(parent ? [parent] : []),
    { label: kind === 'page' ? bannerTitle : page.title },
  ];

  const breadcrumbs = crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.label,
    item: localeUrl(c.href || path, context.locale),
  }));
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': kind === 'articles' ? 'Article' : kind === 'services' ? 'Service' : 'WebPage',
    name: page.title,
    url: localeUrl(path, context.locale),
    inLanguage: context.locale,
    description: page.seo?.metaDescription,
  };
  if (kind === 'articles')
    Object.assign(schema, {
      headline: page.title,
      datePublished: entry.publishedDate,
      dateModified: entry.updatedAt || entry.publishedDate,
      image: mediaUrl(entry.image),
      author: { '@type': 'Person', name: entry.author },
      publisher: { '@type': 'Organization', name: context.global.title },
    });

  const render = (items: Section[]) =>
    items.map((s, i) => (
      <SectionRenderer key={`${s.__component}-${s.id ?? i}`} section={s} context={ctx} />
    ));

  const isArticlePart = (s: Section) => s.__component.startsWith('sections.article-');
  const inArticleColumn = (s: Section) =>
    isArticlePart(s) || ['sections.faq', 'sections.rich-text'].includes(s.__component);

  return (
    <div className={`page page-${kind} ${isHome ? 'page-home' : ''}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      {!isHome && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: breadcrumbs,
            }),
          }}
        />
      )}
      {!isHome && (
        <PageBanner
          title={kind === 'articles' ? entry.category || copy.common.news : bannerTitle}
          titleTag={kind === 'articles' ? 'p' : 'h1'}
          image={hero?.image || (kind !== 'page' ? entry.bannerImage : undefined) || context.global.bannerImage}
          crumbs={crumbs}
          label={copy.accessibility.breadcrumb}
        />
      )}
      {kind === 'services' ? (
        <div className="service-detail">
          <div className="service-detail-inner">
            <div className="service-main">{render(sections)}</div>
            <ServiceSidebar context={ctx} currentSlug={entry.slug} />
          </div>
        </div>
      ) : kind === 'projects' ? (
        <div className="case-study">
          <div className="case-study-inner">
            <nav className="case-crumb" aria-label={copy.accessibility.breadcrumb}>
              <Link href={copy.routes.projects}>{copy.common.projects}</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{entry.category || page.title}</span>
            </nav>
            <div className="case-body">{render(sections)}</div>
          </div>
        </div>
      ) : kind === 'articles' ? (
        <>
          <div className="article-page">
            <div className="article-page-inner">
              <article className="article-main">
                <ArticleHeader entry={entry} context={ctx} />
                {render(sections.filter((s) => inArticleColumn(s) && s.__component !== 'sections.article-author'))}
                <ArticleTags entry={entry} />
                {render(sections.filter((s) => s.__component === 'sections.article-author'))}
                <ArticleNavigation context={ctx} />
              </article>
              <ArticleSidebar context={ctx} category={entry.category} />
            </div>
          </div>
          {render(sections.filter((s) => !inArticleColumn(s)))}
        </>
      ) : (
        render(sections)
      )}
    </div>
  );
}
