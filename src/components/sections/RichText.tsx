import type { Section, SectionContext } from '@/lib/types';
import { renderRichText } from '@/lib/rich-text';

export default function RichText({ section, context }: { section: Section; context: SectionContext }) {
  if (!section.content) return null;
  return (
    <section
      className="rich-text ck-content"
      dangerouslySetInnerHTML={{ __html: renderRichText(section.content, context.locale) }}
    />
  );
}
