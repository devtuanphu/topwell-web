import Link from '@/components/Link';
import type { Section, SectionContext } from '@/lib/types';
import { safeHref } from '@/lib/media';
import { UiIcon } from '../icons';

/** Dải kêu gọi nền tối cuối trang dịch vụ và dự án (Figma 244:1544 ConsultationSection). */
export default function CtaBar({
  section,
  context,
}: {
  section: Section;
  context: SectionContext;
}) {
  const phone = context.global.phone;
  return (
    <section className="cta-bar-section">
      <div className="container">
        <div className="cta-bar">
          <div className="cta-bar-text">
            {section.eyebrow && <p className="cta-bar-eyebrow">{section.eyebrow}</p>}
            {section.title && <h2>{section.title}</h2>}
            {section.description && <p className="cta-bar-desc">{section.description}</p>}
          </div>
          <div className="cta-bar-actions">
            {phone && (
              <a className="cta-bar-phone" href={`tel:${phone.replace(/[^+0-9]/g, '')}`}>
                <UiIcon name="phoneDark" size={16} />
                <span>
                  {section.phoneLabel} {phone}
                </span>
              </a>
            )}
            {section.ctaLabel && (
              <Link className="cta-bar-button" href={safeHref(section.ctaHref)}>
                {section.ctaLabel}
                <UiIcon name="arrowSmall" size={16} className="arrow" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
