'use client';
import { useCopy } from '@/components/SiteCopyProvider';
import { formFailure, validateField } from '@/lib/form-feedback';
import { useState } from 'react';
import type { Section, Global } from '@/lib/types';

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

// Figma 146:8739: thẻ liên hệ chỉ còn biểu mẫu, rộng hết 12 cột (bỏ cột giới thiệu bên phải).
export default function ContactForm({ section, global }: { section: Section; global: Global }) {
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
              const picked = [
                ...e.currentTarget.querySelectorAll<HTMLInputElement>(
                  'input[name="topic"]:checked',
                ),
              ]
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
            <input
              id="cf-name"
              name="name"
              autoComplete="name"
              required
              maxLength={100}
              placeholder={copy.forms.nameShort}
            />
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
            </div>
            <p className={`form-message ${status}`} role="status" aria-live="polite">
              {message}
            </p>
          </form>
        </div>
      </div>
      <span hidden>{global.email}</span>
    </section>
  );
}
