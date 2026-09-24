import type { Section } from '@/lib/types';
import { Photo } from '../ui';
import { UiIcon } from '../icons';
export default function ServiceIntro({ section }: { section: Section }) {
  const [lead, ...rest] = (section.description || '').split(/\n{2,}/);
  return (
    <section className="service-intro">
      {section.image && (
        <div className="service-hero-image">
          <Photo picture={section.image} priority />
        </div>
      )}
      <div className="service-intro-text">
        {section.title && <h2>{section.title}</h2>}
        {lead && <p>{lead}</p>}
      </div>
      {section.quote && (
        <div className="service-quote">
          <span className="service-quote-icon">
            <UiIcon name="quote" size={24} />
          </span>
          <blockquote>{section.quote}</blockquote>
        </div>
      )}
      {rest.map((p, i) => (
        <p className="service-text" key={i}>
          {p}
        </p>
      ))}
      {section.images && section.images.length > 0 && (
        <div className="service-images">
          {section.images.map((img, i) => (
            <Photo key={i} picture={img} />
          ))}
        </div>
      )}
      {section.body &&
        section.body
          .split(/\n{2,}/)
          .filter(Boolean)
          .map((p, i) => (
            <p className="service-text" key={`b${i}`}>
              {p}
            </p>
          ))}
    </section>
  );
}
