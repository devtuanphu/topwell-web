'use client';
import { useEffect, useRef, useState } from 'react';
import type { Section } from '@/lib/types';
import { safeHref } from '@/lib/media';
import { Photo, Button, Icon } from '../ui';
import { useCopy } from '../SiteCopyProvider';

export function embedUrl(url: string) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return { kind: 'iframe' as const, src: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0` };
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return { kind: 'iframe' as const, src: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1` };
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) return { kind: 'video' as const, src: url };
  if (/\.pdf(\?|$)/i.test(url)) return { kind: 'iframe' as const, src: url };
  return null;
}

export function MediaDialog({
  url,
  title,
  onClose,
}: {
  url: string;
  title: string;
  onClose: () => void;
}) {
  const copy = useCopy();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  const media = embedUrl(url);
  return (
    <dialog ref={ref} className="media-dialog" aria-label={title} onClose={onClose} onClick={(e) => e.target === ref.current && ref.current?.close()}>
      <button className="media-close" type="button" onClick={() => ref.current?.close()} aria-label={copy.about.close}>
        ×
      </button>
      {media?.kind === 'video' ? (
        <video src={media.src} controls autoPlay playsInline />
      ) : media ? (
        <iframe src={media.src} title={title} allow="autoplay; encrypted-media; fullscreen" allowFullScreen />
      ) : null}
    </dialog>
  );
}

export default function VideoCta({ section }: { section: Section }) {
  const copy = useCopy();
  const [open, setOpen] = useState(false);
  const url = section.videoUrl ? safeHref(section.videoUrl) : '';
  const playable = url && embedUrl(url);
  if (section.variant === 'steps')
    return (
      <section className="process-video">
        <div className="container process-inner">
          <header className="process-head">
            {section.eyebrow && <p className="process-eyebrow">{section.eyebrow}</p>}
            {section.title && <h2>{section.title}</h2>}
            {section.description && <p>{section.description}</p>}
          </header>
          <div className="process-media">
            <Photo picture={section.image} />
            {!url ? (
              <span className="process-play" aria-hidden="true">
                <span className="triangle" />
                <span>{copy.accessibility.play}</span>
              </span>
            ) : (
              <button
                type="button"
                className="process-play"
                aria-label={section.videoLabel || copy.accessibility.play}
                onClick={() => (playable ? setOpen(true) : window.open(url, '_blank', 'noopener'))}
              >
                <span className="triangle" aria-hidden="true" />
                <span>{copy.accessibility.play}</span>
              </button>
            )}
          </div>
          {section.cards && section.cards.length > 0 && (
            <ol className="process-steps">
              {section.cards.map((c, i) => (
                <li key={i}>
                  <span className="process-icon">
                    <Icon picture={c.icon} />
                    <b>{String(i + 1).padStart(2, '0')}</b>
                  </span>
                  <h3>{c.title}</h3>
                  <p>{c.description}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
        {open && playable && (
          <MediaDialog url={url} title={section.videoLabel || section.title || ''} onClose={() => setOpen(false)} />
        )}
      </section>
    );
  return (
    <section className="video-cta">
      <Photo picture={section.image} />
      <div className="video-cta-inner">
        {!section.videoUrl ? (
          <span className="play-button" aria-hidden="true">
            <span />
          </span>
        ) : (
          playable ? (
            <button
              type="button"
              className="play-button"
              aria-label={section.videoLabel || copy.accessibility.play}
              onClick={() => setOpen(true)}
            >
              <span aria-hidden="true" />
            </button>
          ) : (
            <a
              className="play-button"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={section.videoLabel || copy.accessibility.play}
            >
              <span aria-hidden="true" />
            </a>
          )
        )}
        {section.eyebrow && <p className="video-eyebrow">{section.eyebrow}</p>}
        {section.title && <h2>{section.title}</h2>}
        {section.description && <p className="video-text">{section.description}</p>}
        {section.ctaLabel && <Button href={section.ctaHref}>{section.ctaLabel}</Button>}
      </div>
      {open && playable && (
        <MediaDialog url={url} title={section.videoLabel || section.title || ''} onClose={() => setOpen(false)} />
      )}
    </section>
  );
}
