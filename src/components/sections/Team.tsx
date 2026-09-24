import type { Section } from '@/lib/types';
import { Photo, Icon } from '../ui';
export default function Team({ section }: { section: Section }) {
  return (
    <section className="team-section">
      <div className="container team-inner">
        <header className="mono-head">
          {section.eyebrow && <p className="mono-eyebrow-amber">{section.eyebrow}</p>}
          {section.title && <h2>{section.title}</h2>}
          {section.description && <p>{section.description}</p>}
        </header>
        <div className="team-grid">
          {section.cards?.map((c) => (
            <article className="team-card" key={c.title}>
              <div className="team-photo">
                <Photo picture={c.image} />
                {c.eyebrow && <span className="team-tag">{c.eyebrow}</span>}
              </div>
              <div className="team-body">
                <h3>{c.title}</h3>
                {c.label && <p className="team-role">{c.label}</p>}
                {c.description && <p className="team-bio">{c.description}</p>}
                {c.tags && (
                  <div className="team-meta">
                    <span>{c.tags}</span>
                    <Icon picture={c.icon} />
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
