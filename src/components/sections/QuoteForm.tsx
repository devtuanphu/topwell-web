'use client';
import { useCopy } from '@/components/SiteCopyProvider';
import Link from '@/components/Link';
import type { Section, SectionContext } from '@/lib/types';
import { validateField } from '@/lib/form-feedback';
import { Photo, Icon } from '../ui';
import { UiIcon } from '../icons';
import DatePicker from '../DatePicker';
import { useInquiry } from './ContactForm';

export default function QuoteForm({ section, context }: { section: Section; context: SectionContext }) {
  const copy = useCopy();
  const { status, message, submit } = useInquiry('quote');
  return (
    <section className="quote-section" id="quote">
      <div className="container quote-inner">
        <header className="quote-head">
          {section.eyebrow && (
            <p className="eyebrow-line after amber">
              {section.eyebrow}
              <span aria-hidden="true" />
            </p>
          )}
          {section.title && <h2 className="h2-48">{section.title}</h2>}
        </header>
        <div className="quote-top">
          {section.image && <Photo picture={section.image} className="quote-image" />}
          <form
            className="quote-form"
            onSubmit={(e) => submit(e)}
            onInvalidCapture={(e) => validateField(e, copy.forms.invalidField)}
            onInputCapture={(e) => validateField(e, '')}
          >
            <div className="quote-row">
              <input className="quote-field" name="name" required maxLength={100} autoComplete="name" placeholder={copy.forms.quoteName} aria-label={copy.forms.name} />
              <input className="quote-field" name="email" type="email" required maxLength={254} autoComplete="email" placeholder={copy.forms.quoteEmail} aria-label={copy.forms.email} />
              <input className="quote-field" name="company" maxLength={200} autoComplete="organization" placeholder={copy.forms.quoteCompany} aria-label={copy.forms.quoteCompany} />
            </div>
            <div className="quote-row">
              <label className="quote-select">
                <span className="sr-only">{copy.forms.quoteService}</span>
                <select name="service" defaultValue="">
                  <option value="">{copy.forms.quoteService}</option>
                  {context.services.map((s) => (
                    <option key={s.slug} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                </select>
                <UiIcon name="selectChevron" />
              </label>
              <DatePicker name="preferredDate" placeholder={copy.forms.quoteDate} locale={copy.metadata.locale} />
              <button type="submit" className="quote-submit" disabled={status === 'pending'}>
                {status === 'pending' ? copy.forms.pending : section.ctaLabel || copy.forms.submit}
              </button>
            </div>
            <label className="honeypot" aria-hidden="true">
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
            <p className="quote-notice">
              {copy.forms.privacyNotice} <Link href={copy.routes.privacy}>{copy.forms.privacyLabel}</Link>.
            </p>
            <p className={`form-message ${status}`} role="status" aria-live="polite">
              {message}
            </p>
          </form>
        </div>
        <div className="why-card">
          <div className="why-panel">
            {section.panelEyebrow && <p className="why-kicker">{section.panelEyebrow}</p>}
            {section.panelTitle && <h3>{section.panelTitle}</h3>}
            {section.panelText && <p>{section.panelText}</p>}
          </div>
          <div className="why-features">
            {section.cards?.map((c, i) => (
              <div key={i}>
                <span className="why-icon">
                  <Icon picture={c.icon} />
                </span>
                <h4>{c.title}</h4>
                <p>{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
