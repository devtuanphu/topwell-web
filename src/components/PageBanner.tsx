import Link from '@/components/Link';
import type { Picture } from '@/lib/types';
import { safeHref } from '@/lib/media';
import { Photo } from './ui';

export type Crumb = { label: string; href?: string };

export default function PageBanner({
  title,
  image,
  crumbs,
  label,
  titleTag = 'h1',
}: {
  title: string;
  image?: Picture;
  crumbs: Crumb[];
  label: string;
  titleTag?: 'h1' | 'p';
}) {
  const Title = titleTag;
  return (
    <section className="page-banner">
      <Photo picture={image} priority />
      <div className="container">
        <Title className={titleTag === 'p' ? 'h1' : undefined}>{title}</Title>
        <nav className="breadcrumb" aria-label={label}>
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1;
            return (
              <span key={`${c.label}-${i}`} style={{ display: 'contents' }}>
                {last || !c.href ? (
                  <span aria-current={last ? 'page' : undefined}>{c.label}</span>
                ) : (
                  <Link href={safeHref(c.href)}>{c.label}</Link>
                )}
                {!last && (
                  <span className="sep" aria-hidden="true">
                    /
                  </span>
                )}
              </span>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
