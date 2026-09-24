'use client';
import { useCopy } from '@/components/SiteCopyProvider';
export default function ErrorPage({ reset }: { reset: () => void }) {
  const copy = useCopy();
  return (
    <div className="container empty-state">
      <h1>{copy.system.errorTitle}</h1>
      <p>{copy.system.errorDescription}</p>
      <button className="button" onClick={reset}>
        {copy.system.retry}
      </button>
    </div>
  );
}
