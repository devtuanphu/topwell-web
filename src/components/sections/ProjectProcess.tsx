import type { Section } from '@/lib/types';
import { Photo } from '../ui';
import { ProjectSplitHead } from './ProjectSplit';
export default function ProjectProcess({ section }: { section: Section }) {
  return (
    <section className="project-split project-process">
      <ProjectSplitHead section={section} />
      <div className="project-split-body">{section.description && <p>{section.description}</p>}</div>
      {section.cards && section.cards.length > 0 && (
        <div className="process-shots">
          {section.cards.map((c, i) => (
            <figure key={i}>
              <Photo picture={c.image} />
              <figcaption>{c.title}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
