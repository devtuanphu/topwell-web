import type { Section } from '@/lib/types';
import { UiIcon } from '../icons';
export function ProjectSplitHead({ section }: { section: Section }) {
  return (
    <div className="project-split-head">
      <h2>{section.title}</h2>
      {section.eyebrow && <p className="mono-eyebrow">{section.eyebrow}</p>}
    </div>
  );
}
export function CheckList({ section, strong = false }: { section: Section; strong?: boolean }) {
  if (!section.cards?.length) return null;
  return (
    <ul className="project-checklist">
      {section.cards.map((c, i) => (
        <li key={i}>
          <UiIcon name="check" size={20} />
          <span>
            {strong && c.description ? (
              <>
                <strong>{c.title}</strong> {c.description}
              </>
            ) : (
              c.title
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}
export default function ProjectSplit({
  section,
  strong = false,
}: {
  section: Section;
  strong?: boolean;
}) {
  return (
    <section className="project-split">
      <ProjectSplitHead section={section} />
      <div className="project-split-body">
        {section.description && <p>{section.description}</p>}
        <CheckList section={section} strong={strong} />
      </div>
    </section>
  );
}
