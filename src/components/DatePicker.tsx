'use client';
import { useEffect, useRef, useState } from 'react';
import { UiIcon } from './icons';
import { useCopy } from './SiteCopyProvider';

const pad = (n: number) => String(n).padStart(2, '0');
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export default function DatePicker({
  name,
  placeholder,
  locale,
}: {
  name: string;
  placeholder: string;
  locale: string;
}) {
  const copy = useCopy();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);
  useEffect(() => {
    const form = root.current?.closest('form');
    const reset = () => setValue('');
    form?.addEventListener('reset', reset);
    return () => form?.removeEventListener('reset', reset);
  }, []);
  const monthLabel = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(month);
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(new Date(2024, 0, i + 1)),
  );
  const offset = (month.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const label = value
    ? new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(`${value}T00:00:00`))
    : '';
  return (
    <div className="date-picker" ref={root}>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        className={`quote-field date-trigger ${value ? 'has-value' : ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span>{label || placeholder}</span>
        <UiIcon name="selectChevron" />
      </button>
      {open && (
        <div className="calendar" role="dialog" aria-label={placeholder}>
          <div className="calendar-head">
            <button
              type="button"
              aria-label={copy.common.previous}
              disabled={month <= new Date(today.getFullYear(), today.getMonth(), 1)}
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            >
              ‹
            </button>
            <strong>{monthLabel}</strong>
            <button
              type="button"
              aria-label={copy.common.next}
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            >
              ›
            </button>
          </div>
          <div className="calendar-grid">
            {weekdays.map((w, i) => (
              <span key={`w${i}`} className="weekday">
                {w}
              </span>
            ))}
            {cells.map((d, i) => {
              if (!d) return <span key={`b${i}`} />;
              const date = new Date(month.getFullYear(), month.getMonth(), d);
              const key = iso(date);
              const past = date < today;
              return (
                <button
                  type="button"
                  key={key}
                  disabled={past}
                  aria-pressed={value === key}
                  className={key === iso(today) ? 'today' : undefined}
                  onClick={() => {
                    setValue(key);
                    setOpen(false);
                  }}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
