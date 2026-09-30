import type { Section } from '@/lib/types';

/**
 * Chữ viết tắt lấy hai từ đầu của tên sau danh xưng, như Figma 194:2117:
 * "Ông Toru Shinohara" → "TS", "Ông Nguyễn Văn Tuấn" → "NV".
 */
function initials(name = '') {
  const words = name
    .replace(/^(Ông|Bà|Anh|Chị|Mr\.?|Ms\.?|Mrs\.?)\s+/i, '')
    .split(/\s+/)
    .filter(Boolean);
  return (
    words
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || '★'
  );
}

/** Đánh giá khách hàng ở trang Dịch vụ (Figma 194:2117). */
export default function Testimonials({ section }: { section: Section }) {
  const cards = section.cards || [];
  if (!cards.length && !section.title) return null;
  return (
    <section className="testimonials-section">
      <div className="container testimonials-inner">
        <div className="testimonials-head">
          <div className="testimonials-intro">
            {section.eyebrow && <p className="testimonials-eyebrow">{section.eyebrow}</p>}
            {section.title && <h2>{section.title}</h2>}
            {section.description && <p className="testimonials-desc">{section.description}</p>}
          </div>
          {(section.score || section.statusTitle) && (
            <div className="testimonials-score">
              {section.score && (
                <div className="testimonials-score-value">
                  <p>
                    <strong>{section.score}</strong>
                    <span aria-hidden="true">★</span>
                  </p>
                  {section.scoreLabel && <small>{section.scoreLabel}</small>}
                </div>
              )}
              {section.statusTitle && (
                <div className="testimonials-status">
                  <p>
                    <span aria-hidden="true" />
                    {section.statusTitle}
                  </p>
                  {section.statusNote && <small>{section.statusNote}</small>}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="testimonials-cards">
          {cards.map((card, i) => (
            <article className="testimonial-card" key={i}>
              <div className="testimonial-top">
                <span className="testimonial-stars" aria-hidden="true">
                  ★★★★★
                </span>
                {card.tags && <span className="testimonial-tag">{card.tags}</span>}
              </div>
              {card.description && <p className="testimonial-quote">{card.description}</p>}
              <div className="testimonial-author">
                <span className={`testimonial-avatar tone-${i % 3}`} aria-hidden="true">
                  {initials(card.title)}
                </span>
                <div>
                  <strong>{card.title}</strong>
                  {card.eyebrow && <small>{card.eyebrow}</small>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
