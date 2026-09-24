import type { Section } from '@/lib/types';
import { Photo } from '../ui';
export default function PageHero({ section }: { section: Section }) {
  return (
    <section className={`page-hero ${section.variant || ''}`}>
      {section.image && <Photo picture={section.image} priority />}
      <div className="container">
        <h1>{section.title}</h1>
        {section.description && <p>{section.description}</p>}
      </div>
    </section>
  );
}
