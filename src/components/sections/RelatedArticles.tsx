'use client';
import { useCopy } from '@/components/SiteCopyProvider';
import Link from '@/components/Link';
import type { Section, SectionContext } from '@/lib/types';
import { Heading, Photo } from '../ui';
export default function RelatedArticles({
  section,
  context,
}: {
  section: Section;
  context: SectionContext;
}) {
  const copy = useCopy();
  return (
    <section className="section container related-articles">
      <Heading section={section} />
      <div className="three-grid">
        {context.articles
          .filter((x) => x.slug !== context.currentSlug)
          .slice(0, 3)
          .map((a) => (
            <Link className="news-card" key={a.slug} href={`${copy.routes.articleBase}${a.slug}`}>
              <Photo picture={a.image} />
              <div className="card-body">
                <p className="eyebrow">{a.category}</p>
                <h3>{a.title}</h3>
                <p>{a.summary}</p>
                <span className="text-link">{copy.common.readMore}</span>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
}
