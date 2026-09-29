import type { Section } from '@/lib/types';
import { Photo } from '../ui';
export default function ProjectOverview({ section }: { section: Section }) {
  return (
    <section className="project-overview">
      {section.image && (
        <div className="project-hero-card">
          <Photo picture={section.image} priority />
        </div>
      )}
      {section.description && <p className="project-lead">{section.description}</p>}
    </section>
  );
}
