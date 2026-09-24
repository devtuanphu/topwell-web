import type { Section } from '@/lib/types';
import { Photo } from '../ui';
import { UiIcon } from '../icons';

function Quote({ text }: { text: string }) {
  const [quote, author] = text.split(/\s+[—–-]\s+(?=[^”"]*$)/);
  return (
    <blockquote className="article-quote">
      <UiIcon name="quoteMark" size={26} />
      <div>
        <p>{quote.trim()}</p>
        {author && <cite>— {author.trim()}</cite>}
      </div>
    </blockquote>
  );
}

export function Paragraphs({ text }: { text?: string }) {
  return (
    <>
      {text
        ?.split(/\n\s*\n/)
        .filter(Boolean)
        .map((paragraph, index) =>
          /^[“"]/.test(paragraph.trim()) ? (
            <Quote key={index} text={paragraph.trim()} />
          ) : (
            <p key={index}>{paragraph}</p>
          ),
        )}
    </>
  );
}

export default function ArticleBody({ section }: { section: Section }) {
  return (
    <section className="article-body">
      {section.description && <p className="article-sapo">{section.description}</p>}
      {section.image && (
        <figure className="article-figure">
          <div className="article-figure-media">
            <Photo picture={section.image} priority />
            {(section.imageTag || section.imageNote) && (
              <div className="article-figure-overlay">
                {section.imageTag && <span>{section.imageTag}</span>}
                {section.imageNote && <p>{section.imageNote}</p>}
              </div>
            )}
          </div>
          {section.imageCaption && <figcaption>{section.imageCaption}</figcaption>}
        </figure>
      )}
      <div className="article-prose">
        {section.cards?.map((c, i) => (
          <section key={i} id={`section-${i + 1}`}>
            <h2>{c.title}</h2>
            <Paragraphs text={c.description} />
          </section>
        ))}
      </div>
    </section>
  );
}
