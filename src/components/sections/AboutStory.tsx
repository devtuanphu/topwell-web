'use client';
import { useCopy } from '@/components/SiteCopyProvider';
import { useRef, useEffect } from 'react';
import type { Section } from '@/lib/types';
import { Photo, Button } from '../ui';
export default function AboutStory({ story, label }: { story: Section; label?: string }) {
  const copy = useCopy();
  const ref = useRef<HTMLDialogElement>(null);
  const previousOverflow = useRef('');
  function close() {
    ref.current?.close();
    document.body.style.overflow = previousOverflow.current;
  }
  function open() {
    previousOverflow.current = document.body.style.overflow;
    ref.current?.showModal();
    document.body.style.overflow = 'hidden';
  }
  useEffect(
    () => () => {
      if (ref.current?.open) document.body.style.overflow = previousOverflow.current;
    },
    [],
  );
  return (
    <>
      <button className="button" onClick={open}>
        {label || copy.about.readStory} →
      </button>
      <dialog
        ref={ref}
        className="story-dialog"
        aria-labelledby="story-title"
        onClose={() => {
          document.body.style.overflow = previousOverflow.current;
        }}
        onClick={(e) => {
          if (e.target === ref.current) {
            const r = ref.current.getBoundingClientRect();
            if (
              e.clientX < r.left ||
              e.clientX > r.right ||
              e.clientY < r.top ||
              e.clientY > r.bottom
            )
              close();
          }
        }}
      >
        <button
          autoFocus
          className="dialog-close"
          aria-label={copy.accessibility.closeStory}
          onClick={close}
        >
          ×
        </button>
        <div className="story-content">
          <p className="eyebrow">
            {story.eyebrow} · {copy.about.readingTime}
          </p>
          <h2 id="story-title">{story.title}</h2>
          <p className="story-intro">{story.description}</p>
          <Photo picture={story.image} />
          {story.cards?.map((c, i) => (
            <section key={i}>
              <h3>{c.title}</h3>
              <p>{c.description}</p>
            </section>
          ))}
          <div className="story-actions">
            <button className="button outline" onClick={close}>
              {copy.about.close}
            </button>
            <span onClick={close}>
              <Button href={copy.about.storyContactHref}>{copy.about.storyContact}</Button>
            </span>
          </div>
        </div>
      </dialog>
    </>
  );
}
