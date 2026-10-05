import type { Entry, PageContent, Section, SectionContext } from '@/lib/types';
import { ancestorsOf, childrenOf, pathOf } from '@/lib/tree';
import SectionRenderer from './SectionRenderer';
import PageBanner, { type Crumb } from './PageBanner';
import ArticleSidebar from './sections/ArticleSidebar';
import ArticleHeader from './sections/ArticleHeader';
import ArticleNavigation, { ArticleTags } from './sections/ArticleNavigation';
import ServiceSidebar from './sections/ServiceSidebar';
import RichText from './sections/RichText';
import { jsonLd, localeUrl } from '@/lib/seo';
import { mediaUrl } from '@/lib/media';
import { splitBlockMarkers } from '@/lib/rich-text';

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
  const tree = kind === 'services' ? context.services : kind === 'projects' ? context.projects : [];
  const node = tree.find((e) => e.slug === entry.slug);
  const ctx = { ...context, currentSlug: entry.slug };
  const all = page.sections || [];
  // Mục có mục con dùng layout trang cha, mục không có mục con dùng layout trang chi tiết,
  // nên cây 2 cấp hay 3 cấp đều tự đúng layout (Dịch vụ › Thiết bị và giải pháp › Thiết bị).
  const hasChildren = Boolean(node && childrenOf(node, tree).length);
  const listComponent = kind === 'services' ? 'sections.services' : 'sections.projects';
  const hero = all.find((s) => BANNER_SECTIONS.includes(s.__component));
  const body = all.filter((s) => !BANNER_SECTIONS.includes(s.__component));
  // Trang cha luôn có lưới mục con; biên tập viên chưa thêm khối danh sách thì tự thêm.
  const sections =
    hasChildren && !body.some((s) => s.__component === listComponent)
      ? [{ __component: listComponent, source: 'children' } as Section, ...body]
      : body;
  // Ở trang cha, các khối hồ sơ dự án (tổng quan, thách thức…) nằm trong khung chi tiết bên dưới.
  const isCaseBlock = (s: Section) => s.__component.startsWith('sections.project-');
  const isHome = path === '/';

  const base: Crumb | undefined =
    kind === 'services'
      ? { label: copy.common.services, href: copy.routes.services }
      : kind === 'projects'
        ? { label: copy.common.projects, href: copy.routes.projects }
        : kind === 'articles'
          ? { label: copy.common.news, href: copy.routes.news }
          : undefined;
  const collectionBase = kind === 'services' ? copy.routes.serviceBase : copy.routes.projectBase;
  // Mỗi mục cha trong cây là một bậc của đường dẫn.
  const ancestors: Crumb[] = node
    ? ancestorsOf(node, tree).map((a) => ({
        label: a.title,
        href: `${collectionBase}${pathOf(a, tree)}`,
      }))
    : [];
  const bannerTitle = hero?.title || page.title;
  const crumbs: Crumb[] = [
    { label: copy.common.home, href: copy.routes.home },
    ...(base ? [base] : []),
    ...ancestors,
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
  // Nội dung chính bài viết: đoạn HTML xen với khối được gọi bằng [[khoi-N]] (N theo thứ tự trong
  // CMS). Khối không được gọi giữ vị trí mặc định ở cuối bài.
  const contentParts = kind === 'articles' && entry.content ? splitBlockMarkers(entry.content) : [];
  const placed = new Set(
    contentParts.flatMap((p) =>
      typeof p === 'number' && sections.includes(all[p - 1]) ? [all[p - 1]] : [],
    ),
  );
  const rest = sections.filter((s) => !placed.has(s));
  const articleContent = contentParts.map((p, i) =>
    typeof p === 'string' ? (
      <RichText
        key={`content-${i}`}
        section={{ __component: 'sections.rich-text', content: p } as Section}
        context={ctx}
      />
    ) : placed.has(all[p - 1]) ? (
      <SectionRenderer key={`content-${i}`} section={all[p - 1]} context={ctx} />
    ) : null,
  );

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
          image={
            hero?.image ||
            (kind !== 'page' ? entry.bannerImage : undefined) ||
            context.global.bannerImage
          }
          crumbs={crumbs}
          label={copy.accessibility.breadcrumb}
        />
      )}
      {/* Trang có khối danh sách mục con dùng layout trang cha (rộng hết khung);
          các trang còn lại dùng layout chi tiết có menu cùng cấp bên phải. */}
      {kind === 'services' && hasChildren ? (
        render(sections)
      ) : kind === 'services' ? (
        <div className="service-detail">
          <div className="service-detail-inner">
            <div className="service-main">{render(sections)}</div>
            <ServiceSidebar context={ctx} currentSlug={entry.slug} />
          </div>
        </div>
      ) : kind === 'projects' && hasChildren ? (
        <>
          {render(sections.filter((s) => !isCaseBlock(s) && s.__component === listComponent))}
          {sections.some(isCaseBlock) && (
            <div className="case-study">
              <div className="case-study-inner">
                <div className="case-body">{render(sections.filter(isCaseBlock))}</div>
              </div>
            </div>
          )}
          {render(sections.filter((s) => !isCaseBlock(s) && s.__component !== listComponent))}
        </>
      ) : kind === 'projects' ? (
        <>
          <div className="case-study">
            <div className="case-study-inner">
              <div className="case-body">{render(sections.filter(isCaseBlock))}</div>
            </div>
          </div>
          {/* Dải kêu gọi và các khối chung khác rộng hết khung như Figma 212:277. */}
          {render(sections.filter((s) => !isCaseBlock(s)))}
        </>
      ) : kind === 'articles' ? (
        <>
          <div className="article-page">
            <div className="article-page-inner">
              <article className="article-main">
                <ArticleHeader entry={entry} context={ctx} />
                {articleContent}
                {render(
                  rest.filter(
                    (s) => inArticleColumn(s) && s.__component !== 'sections.article-author',
                  ),
                )}
                <ArticleTags entry={entry} />
                {render(rest.filter((s) => s.__component === 'sections.article-author'))}
                <ArticleNavigation context={ctx} />
              </article>
              <ArticleSidebar context={ctx} category={entry.category} />
            </div>
          </div>
          {render(rest.filter((s) => !inArticleColumn(s)))}
        </>
      ) : (
        render(sections)
      )}
    </div>
  );
}
