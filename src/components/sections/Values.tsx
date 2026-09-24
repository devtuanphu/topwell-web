import Link from '@/components/Link';
import type { Section } from '@/lib/types';
import { safeHref } from '@/lib/media';
import { Icon } from '../ui';

export default function Values({ section }: { section: Section }) {
  return (
    <section className="values-section">
      <div className="container values-inner">
        <header className="mono-head">
          {section.eyebrow && <p className="mono-eyebrow-amber">{section.eyebrow}</p>}
          {section.title && <h2>{section.title}</h2>}
          {section.description && <p>{section.description}</p>}
        </header>
        <div className="values-cards">
          {section.cards?.map((c, i) => {
            const lines = (c.description || '').split('\n').filter(Boolean);
            const list = lines.length > 1;
            const link = c.label && (
              <>
                <span>{c.label}</span>
                {c.image && <Icon picture={c.image} />}
              </>
            );
            return (
              <article className={`value-card ${i === 1 ? 'featured' : ''}`} key={i}>
                <div>
                  <span className="value-icon">
                    <Icon picture={c.icon} />
                  </span>
                  {c.eyebrow && <p className="value-label">{c.eyebrow}</p>}
                  <h3>{c.title}</h3>
                  {list ? (
                    <ul>
                      {lines.map((line) => {
                        const [lead, ...rest] = line.split(':');
                        return (
                          <li key={line}>
                            {rest.length ? (
                              <>
                                <strong>{lead}:</strong>
                                {rest.join(':')}
                              </>
                            ) : (
                              line
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p>{c.description}</p>
                  )}
                </div>
                {link &&
                  (c.href ? (
                    <Link className="value-link" href={safeHref(c.href)}>
                      {link}
                    </Link>
                  ) : (
                    <p className="value-link">{link}</p>
                  ))}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
