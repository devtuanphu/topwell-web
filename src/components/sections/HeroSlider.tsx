'use client';
import { useCopy } from '@/components/SiteCopyProvider';
import { useEffect, useState } from 'react';
import Link from '@/components/Link';
import type { Section } from '@/lib/types';
import { safeHref } from '@/lib/media';
import { Photo, Highlight } from '../ui';
import { UiIcon } from '../icons';

const SLIDE_MS = 5000;

export default function HeroSlider({ section }: { section: Section }) {
  const copy = useCopy();
  const slides = section.cards || [];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const fn = () => setReduced(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  useEffect(() => {
    if (paused || reduced || slides.length < 2) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => clearTimeout(id);
  }, [index, paused, reduced, slides.length]);
  if (!slides.length) return null;
  const stats = section.stats || [];
  return (
    <section
      className="home-hero"
      aria-label={copy.accessibility.hero}
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
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
              {s.eyebrow && <p className="hero-eyebrow">{s.eyebrow}</p>}
              {i === 0 ? (
                <h1>
                  <Highlight text={s.title} phrase={s.highlight} />
                </h1>
              ) : (
                <p className="hero-title">
                  <Highlight text={s.title} phrase={s.highlight} />
                </p>
              )}
              {s.description && <p className="hero-text">{s.description}</p>}
              {s.label && (
                <Link className="hero-button" href={safeHref(s.href)}>
                  {s.label} <span aria-hidden="true">→</span>
                </Link>
              )}
              {stats.length > 0 && (
                <dl className="hero-stats">
                  {stats.map((st) => (
                    <div key={st.title}>
                      <dt>{st.title}</dt>
                      <dd>{st.description}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <>
          <button
            type="button"
            className="hero-arrow prev"
            aria-label={copy.accessibility.previousSlide}
            onClick={() => setIndex((index - 1 + slides.length) % slides.length)}
          >
            <UiIcon name="heroPrev" size={24} />
          </button>
          <button
            type="button"
            className="hero-arrow next"
            aria-label={copy.accessibility.nextSlide}
            onClick={() => setIndex((index + 1) % slides.length)}
          >
            <UiIcon name="heroNext" size={24} />
          </button>
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
