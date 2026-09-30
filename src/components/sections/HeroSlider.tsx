'use client';
import { useCopy } from '@/components/SiteCopyProvider';
import { useEffect, useState } from 'react';
import Link from '@/components/Link';
import type { Section } from '@/lib/types';
import { safeHref } from '@/lib/media';
import { Photo } from '../ui';

// Mỗi banner dừng 4 giây rồi tự chuyển. Sửa được trong CMS (ô Số giây mỗi banner).
const DEFAULT_SLIDE_SECONDS = 4;

export default function HeroSlider({ section }: { section: Section }) {
  const copy = useCopy();
  const slides = section.cards || [];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slideMs = Math.max(2, Number(section.slideSeconds) || DEFAULT_SLIDE_SECONDS) * 1000;
  useEffect(() => {
    // Vẫn tự chuyển khi máy bật "giảm chuyển động"; lúc đó CSS bỏ hiệu ứng trượt (site.css).
    if (paused || slides.length < 2) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % slides.length), slideMs);
    return () => clearTimeout(id);
  }, [index, paused, slides.length, slideMs]);
  if (!slides.length) return null;
  return (
    <section
      className="home-hero"
      aria-label={section.title || copy.accessibility.hero}
      aria-roledescription="carousel"
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <div className="hero-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((s, i) => (
          <div
            className="hero-slide"
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={copy.accessibility.slide.replace('{number}', String(i + 1))}
            aria-hidden={i !== index}
            inert={i !== index}
          >
            <Photo picture={s.image} priority={i === 0} />
            <div className="hero-content">
              {i === 0 ? <h1>{s.title}</h1> : <p className="hero-title">{s.title}</p>}
              {s.description && <p className="hero-text">{s.description}</p>}
              {(s.label || s.secondaryLabel) && (
                <div className="hero-actions">
                  {s.label && (
                    <Link className="hero-button" href={safeHref(s.href)}>
                      {s.label}
                    </Link>
                  )}
                  {s.secondaryLabel && (
                    <Link className="hero-button dark" href={safeHref(s.secondaryHref)}>
                      {s.secondaryLabel}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <>
          <div className="hero-dots">
            {slides.map((_, i) => (
              <button
                type="button"
                key={i}
                aria-label={copy.accessibility.slide.replace('{number}', String(i + 1))}
                aria-current={index === i ? 'true' : undefined}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
