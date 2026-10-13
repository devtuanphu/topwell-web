'use client';
import { useCopy } from '@/components/SiteCopyProvider';
import { useEffect, useRef, useState } from 'react';
import Link from '@/components/Link';
import type { Section } from '@/lib/types';
import { safeHref, mediaUrl } from '@/lib/media';

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
  // Hero cao đúng bằng slide đang hiện (theo chiều cao ảnh của từng slide), không lấy ảnh cao nhất.
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [heroHeight, setHeroHeight] = useState<number>();
  useEffect(() => {
    const el = slideRefs.current[index];
    if (!el || typeof ResizeObserver === 'undefined') return;
    const update = () => setHeroHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [index, slides.length]);
  if (!slides.length) return null;
  return (
    <section
      className="home-hero"
      style={heroHeight ? { height: heroHeight } : undefined}
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
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={copy.accessibility.slide.replace('{number}', String(i + 1))}
            aria-hidden={i !== index}
            inert={i !== index}
          >
            {/* Ảnh theo chiều cao tự nhiên để hero cao đúng bằng ảnh (không khung, không dải đen). */}
            {s.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="hero-photo"
                src={mediaUrl(s.image)}
                alt={s.image.alt || ''}
                fetchPriority={i === 0 ? 'high' : undefined}
              />
            )}
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
