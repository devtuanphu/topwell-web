'use client';
import { useCopy } from '@/components/SiteCopyProvider';
import { formFailure, validateField } from '@/lib/form-feedback';
import { useState } from 'react';
import Link from '@/components/Link';
import type { Section, Global, FooterConfig } from '@/lib/types';
import { mediaUrl, safeHref } from '@/lib/media';
import { Photo } from '../ui';

export function useInquiry(kind: 'contact' | 'quote') {
  const copy = useCopy();
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  async function submit(e: React.FormEvent<HTMLFormElement>, extra: Record<string, string> = {}) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const fields = Object.fromEntries(
      [...fd.entries()].filter(([, v]) => typeof v === 'string') as [string, string][],
    );
    setStatus('pending');
    setMessage('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, ...extra, kind, consent: true }),
      });
      const result = await res.json();
      if (!res.ok) throw { cmsMessage: formFailure(result.code, copy) };
      setStatus('success');
      setMessage(kind === 'quote' ? copy.forms.quoteSuccess : copy.forms.success);
      form.reset();
    } catch (error) {
      setStatus('error');
      setMessage(
        error && typeof error === 'object' && 'cmsMessage' in error
          ? String(error.cmsMessage)
          : copy.forms.failure,
      );
    }
  }
  return { status, message, submit };
}

export default function ContactForm({
  section,
  global,
  footer,
}: {
  section: Section;
  global: Global;
  footer?: FooterConfig;
}) {
  const copy = useCopy();
  const { status, message, submit } = useInquiry('contact');
  const topics = section.cards || [];
  return (
    <section className="contact-page">
      <div className="container">
        <header className="contact-intro">
          <div className="contact-intro-left">
            <span className="badge-24" aria-hidden="true">
              24<small>h</small>
            </span>
            <div>
              {section.eyebrow && <p className="contact-eyebrow">{section.eyebrow}</p>}
              {section.title && <h2>{section.title}</h2>}
            </div>
          </div>
          {section.description && <p className="contact-intro-text">{section.description}</p>}
        </header>
        <div className="contact-card">
          <form
            id="contact-form"
            className="contact-form"
            onSubmit={(e) => {
              const picked = [...e.currentTarget.querySelectorAll<HTMLInputElement>('input[name="topic"]:checked')]
                .map((x) => x.value)
                .join(', ');
              submit(e, { topics: picked });
            }}
            onInvalidCapture={(e) => validateField(e, copy.forms.invalidField)}
            onInputCapture={(e) => validateField(e, '')}
          >
            <label className="sr-only" htmlFor="cf-name">
              {copy.forms.name}
            </label>
            <input id="cf-name" name="name" autoComplete="name" required maxLength={100} placeholder={copy.forms.nameShort} />
            <label className="sr-only" htmlFor="cf-phone">
              {copy.forms.phone}
            </label>
            <input
              id="cf-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              pattern="[+0-9()./ \-]{6,40}"
              maxLength={40}
              placeholder={copy.forms.phonePlaceholder}
            />
            <label className="sr-only" htmlFor="cf-email">
              {copy.forms.email}
            </label>
            <input
              id="cf-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              placeholder={copy.forms.emailShort}
            />
            <label className="sr-only" htmlFor="cf-message">
              {copy.forms.message}
            </label>
            <textarea
              id="cf-message"
              name="message"
              required
              minLength={10}
              maxLength={5000}
              rows={6}
              placeholder={copy.forms.messageShort}
            />
            <label className="honeypot" aria-hidden="true">
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
            {topics.length > 0 && (
              <fieldset className="topic-group">
                <legend>{copy.forms.topicsTitle}</legend>
                <div>
                  {topics.map((t) => (
                    <label key={t.title}>
                      <input type="checkbox" name="topic" value={t.title} />
                      <span>{t.title}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
            <div className="contact-submit">
              <button type="submit" disabled={status === 'pending'}>
                {status === 'pending' ? copy.forms.pending : copy.forms.submit}
              </button>
              <small>
                {copy.forms.privacyNotice} <Link href={copy.routes.privacy}>{copy.forms.privacyLabel}</Link>.
              </small>
            </div>
            <p className={`form-message ${status}`} role="status" aria-live="polite">
              {message}
            </p>
          </form>
          <div className="contact-panel">
            <div>
              {section.panelTitle && <h3>{section.panelTitle}</h3>}
              {section.panelText && <p>{section.panelText}</p>}
            </div>
            {section.image && (
              <div className="contact-panel-photo">
                <Photo picture={section.image} />
              </div>
            )}
            <div>
              {section.requestTitle && <h4>{section.requestTitle}</h4>}
              {section.requestText && <p>{section.requestText}</p>}
              {footer?.socialLinks && footer.socialLinks.length > 0 && (
                <div className="contact-socials">
                  {footer.socialLinks.map((s) =>
                    s.href ? (
                      <a key={s.title} href={safeHref(s.href)} target="_blank" rel="noopener noreferrer" aria-label={s.title}>
                        {s.icon ? <img src={mediaUrl(s.icon)} width={16} height={16} alt="" /> : s.eyebrow || s.title[0]}
                      </a>
                    ) : (
                      <span key={s.title} aria-label={s.title} role="img">
                        {s.icon ? <img src={mediaUrl(s.icon)} width={16} height={16} alt="" /> : s.eyebrow || s.title[0]}
                      </span>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <span hidden>{global.email}</span>
    </section>
  );
}
