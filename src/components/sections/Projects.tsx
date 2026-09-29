'use client';
import { useCopy } from '@/components/SiteCopyProvider';
import Link from '@/components/Link';
import { useState } from 'react';
import type { Section, SectionContext } from '@/lib/types';
import { childrenOf, pathOf } from '@/lib/tree';
import { formatDate } from '@/lib/format';
import { Photo } from '../ui';
import { UiIcon } from '../icons';
import ProjectsShowcase from './ProjectsShowcase';

export default function Projects({
  section,
  context,
}: {
  section: Section;
  context: SectionContext;
}) {
  const copy = useCopy();
  const [limit, setLimit] = useState(6);
  if (section.variant === 'featured')
    return <ProjectsShowcase section={section} context={context} />;
  // Trang Dự án liệt kê các mục gốc; mục con hiện trong trang cha tương ứng.
  const entries = childrenOf(undefined, context.projects);
  return (
    <section className="projects-listing">
      <div className="projects-listing-inner">
        <header className="center-heading narrow">
          {section.eyebrow && (
            <p className="dot-badge">
              <span aria-hidden="true" />
              {section.eyebrow}
            </p>
          )}
          {section.title && <h2>{section.title}</h2>}
          {section.description && <p>{section.description}</p>}
        </header>
        <div className="project-rows">
          {entries.slice(0, limit).map((p) => (
            <Link
              className="project-row"
              key={p.slug}
              href={`${copy.routes.projectBase}${pathOf(p, context.projects)}`}
            >
              <div className="project-row-media">
                <Photo picture={p.image} />
              </div>
              <div className="project-row-body">
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
                <div className="post-meta">
                  {p.author && (
                    <span>
                      <span className="meta-avatar">
                        <UiIcon name="user" size={14} />
                      </span>
                      {p.author}
                    </span>
                  )}
                  {(p.publishedDate || p.year) && (
                    <span>
                      <UiIcon name="calendar" />
                      {p.publishedDate ? formatDate(p.publishedDate, copy.metadata.locale) : p.year}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        {limit < entries.length && (
          <button className="button outline load-more" onClick={() => setLimit((n) => n + 6)}>
            {copy.common.loadMore}
          </button>
        )}
      </div>
    </section>
  );
}
