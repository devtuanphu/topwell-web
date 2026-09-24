import type { Section } from '@/lib/types';
import { Photo } from '../ui';
export default function ArticleAuthor({ section }: { section: Section }) {
  return (
    <section className="article-author">
      <Photo picture={section.image} />
      <div>
        <p className="article-author-name">
          <strong>{section.title}</strong>
          {section.eyebrow && <span>{section.eyebrow}</span>}
        </p>
        {section.role && <p className="article-author-role">{section.role}</p>}
        {section.description && <p className="article-author-bio">{section.description}</p>}
      </div>
    </section>
  );
}
