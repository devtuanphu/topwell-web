'use client';
import { useCopy } from '@/components/SiteCopyProvider';
import Link from '@/components/Link';
import { useRef } from 'react';
import type { Section, SectionContext } from '@/lib/types';
import { Photo } from '../ui';
import { UiIcon } from '../icons';

export default function ProjectsShowcase({
  section,
  context,
}: {
  section: Section;
  context: SectionContext;
}) {
  const copy = useCopy();
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const projects = context.projects
    .filter((p) => p.featured)
    .sort((a, b) => (a.homeOrder || 0) - (b.homeOrder || 0));
  return (
    <section className="home-projects">
      <div className="container home-projects-inner">
        <header className="section-head">
          {section.eyebrow && (
            <p className="eyebrow-line after">
              {section.eyebrow}
              <span aria-hidden="true" />
            </p>
          )}
          {section.title && <h2 className="h2-36">{section.title}</h2>}
        </header>
        <div
          className="project-track"
          ref={track}
          onPointerDown={(e) => {
            if (e.pointerType !== 'mouse' || !track.current) return;
            drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false };
          }}
          onPointerMove={(e) => {
            if (!drag.current || !track.current) return;
            const dx = e.clientX - drag.current.x;
            if (Math.abs(dx) > 4) drag.current.moved = true;
            track.current.scrollLeft = drag.current.left - dx;
          }}
          onPointerUp={() => setTimeout(() => (drag.current = null))}
          onPointerLeave={() => (drag.current = null)}
          onClickCapture={(e) => {
            if (drag.current?.moved) e.preventDefault();
          }}
        >
          {projects.map((p, i) => (
            <Link
              className="showcase-card"
              key={p.slug}
              href={`${copy.routes.projectBase}${p.slug}`}
              draggable={false}
            >
              <div className="showcase-media">
                <Photo picture={p.homeImage || p.image} />
                {(p.homeCategory || p.category) && (
                  <span className={`showcase-tag ${i % 2 ? 'yellow' : ''}`}>
                    {p.homeCategory || p.category}
                  </span>
                )}
              </div>
              <div className="showcase-body">
                <p className="showcase-kicker">{p.category}</p>
                <h3>{p.homeTitle || p.title}</h3>
                <p>{p.homeSummary || p.summary}</p>
                {p.tags && (
                  <div className="showcase-chips">
                    {p.tags
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                  </div>
                )}
              </div>
              <span className="showcase-link">
                {copy.common.viewProject}
                <UiIcon name="arrowTiny" size={9} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
