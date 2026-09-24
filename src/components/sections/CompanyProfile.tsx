import type { Section } from '@/lib/types';
import { mediaUrl } from '@/lib/media';
import { Photo, Icon } from '../ui';

export default function CompanyProfile({ section }: { section: Section }) {
  return (
    <section className="company-profile">
      <div className="container company-grid">
        <div className="company-media">
          <div className="ship-circle">
            <Photo picture={section.image} />
            {section.rating && (
              <span className="rating-pill">
                <span className="stars" aria-hidden="true">
                  ★★★★★
                </span>
                {section.rating}
              </span>
            )}
          </div>
        </div>
        <div className="company-text">
          {section.eyebrow && (
            <p className="mono-badge amber">
              <span
                className="mono-badge-icon"
                aria-hidden="true"
                style={section.eyebrowIcon ? { backgroundImage: `url(${mediaUrl(section.eyebrowIcon)})` } : undefined}
              />
              {section.eyebrow}
              <span className="mono-badge-line" aria-hidden="true" />
            </p>
          )}
          <div className="company-title">
            {section.logo && (
              <img className="company-logo" src={mediaUrl(section.logo)} alt={section.logo.alt} />
            )}
            {section.title && <h2>{section.title}</h2>}
          </div>
          {section.description && <p className="company-desc">{section.description}</p>}
          <div className="company-features">
            {section.cards?.map((c, i) => (
              <div className="company-feature" key={i}>
                <span className="company-feature-icon">
                  <Icon picture={c.icon} />
                </span>
                <div>
                  <h3>{c.title}</h3>
                  <p>{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
