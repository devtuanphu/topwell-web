'use client';
import { useCopy } from '@/components/SiteCopyProvider';
import Link from '@/components/Link';
export default function NotFound() {
  const copy = useCopy();
  return (
    <div className="container empty-state">
      <p className="eyebrow">{copy.system.notFoundCode}</p>
      <h1>{copy.system.notFoundTitle}</h1>
      <p>{copy.system.notFoundDescription}</p>
      <Link className="button" href={copy.routes.home}>
        {copy.system.homeLabel}
      </Link>
    </div>
  );
}
