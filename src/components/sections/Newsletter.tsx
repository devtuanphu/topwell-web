'use client';
import { useCopy } from '@/components/SiteCopyProvider';
import Link from '@/components/Link';
import { formFailure, validateField } from '@/lib/form-feedback';
import { useState } from 'react';
import { UiIcon } from '../icons';

export default function Newsletter() {
  const copy = useCopy();
  const [status, setStatus] = useState('');
  const [pending, setPending] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = new FormData(form).get('email');
    setPending(true);
    setStatus('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: copy.newsletter.requestName,
          email,
          subject: copy.newsletter.requestSubject,
          message: copy.newsletter.requestMessage,
          kind: 'newsletter',
          consent: true,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw { cmsMessage: formFailure(result.code, copy) };
      setStatus(copy.newsletter.success);
      form.reset();
    } catch (error) {
      setStatus(
        error && typeof error === 'object' && 'cmsMessage' in error
          ? String(error.cmsMessage)
          : copy.newsletter.failure,
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <section className="newsletter-box">
      <h2>
        <span className="newsletter-icon" aria-hidden="true">
          <UiIcon name="mailDark" />
        </span>
        {copy.newsletter.title}
      </h2>
      <p>{copy.newsletter.description}</p>
      <form
        onSubmit={submit}
        onInvalidCapture={(e) => validateField(e, copy.forms.invalidField)}
        onInputCapture={(e) => validateField(e, '')}
      >
        <label className="sr-only" htmlFor="newsletter-email">
          {copy.newsletter.emailLabel}
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={copy.newsletter.placeholder}
          required
          maxLength={254}
        />
        <button disabled={pending}>
          {pending ? copy.newsletter.pending : copy.newsletter.submit}
        </button>
        <small>
          {copy.newsletter.consent} <Link href={copy.routes.privacy}>{copy.newsletter.privacyLabel}</Link>
          .
        </small>
        <p role="status">{status}</p>
      </form>
    </section>
  );
}
