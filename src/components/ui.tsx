import Image from 'next/image';
import Link from '@/components/Link';
import type { Picture, Section } from '@/lib/types';
import { mediaUrl, safeHref } from '@/lib/media';
export function Photo({
  picture,
  className = '',
  priority = false,
}: {
  picture?: Picture;
  className?: string;
  priority?: boolean;
}) {
  const src = mediaUrl(picture);
  if (!src) return null;
  return (
    <div className={`photo ${className}`}>
      <Image
        src={src}
        alt={picture?.alt || ''}
        fill
        sizes="(max-width: 700px) 100vw, (max-width: 1024px) 60vw, 800px"
        priority={priority}
        unoptimized={src.endsWith('.svg') || src.includes('/uploads/')}
      />
    </div>
  );
}
export function Icon({ picture }: { picture?: Picture }) {
  const src = mediaUrl(picture);
  return src ? (
    <img className="icon" src={src} width={24} height={24} alt="" />
  ) : (
    <span aria-hidden="true">↗</span>
  );
}
export function Button({
  href,
  children,
  outline = false,
}: {
  href?: string;
  children: React.ReactNode;
  outline?: boolean;
}) {
  return (
    <Link className={`button ${outline ? 'outline' : ''}`} href={safeHref(href)}>
      {children}
      <span aria-hidden="true">→</span>
    </Link>
  );
}
export function Heading({ section, center = false }: { section: Section; center?: boolean }) {
  return (
    <div className={`section-heading ${center ? 'center' : ''}`}>
      <div>
        {section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}
        {section.title && (
          <h2>
            <Highlight text={section.title} phrase={section.highlight} />
          </h2>
        )}
        {section.description && <p className="section-description">{section.description}</p>}
      </div>
      {section.ctaLabel && (
        <Button href={section.ctaHref} outline>
          {section.ctaLabel}
        </Button>
      )}
    </div>
  );
}

export function Highlight({ text, phrase }: { text: string; phrase?: string }) {
  if (!phrase || !text.includes(phrase)) return <>{text}</>;
  const index = text.indexOf(phrase);
  return (
    <>
      {text.slice(0, index)}
      <mark>{phrase}</mark>
      {text.slice(index + phrase.length)}
    </>
  );
}
