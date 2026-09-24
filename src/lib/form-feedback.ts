import type { SiteCopy } from '@/components/SiteCopyProvider';
export function formFailure(code: string | undefined, copy: SiteCopy) {
  switch (code) {
    case 'INVALID_ORIGIN':
      return copy.forms.invalidOrigin;
    case 'CONTENT_TOO_LONG':
      return copy.forms.tooLong;
    case 'INVALID_INPUT':
      return copy.forms.invalid;
    case 'RATE_LIMITED':
      return copy.forms.rateLimit;
    default:
      return copy.forms.failure;
  }
}
export function validateField(event: React.FormEvent<HTMLFormElement>, message: string) {
  const field = event.target;
  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)
    field.setCustomValidity(message);
}
