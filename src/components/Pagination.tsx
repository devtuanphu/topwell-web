'use client';
import { useCopy } from '@/components/SiteCopyProvider';
import { UiIcon } from './icons';

/** Rút gọn danh sách số trang: 1 … 4 5 6 … 12 */
function pageList(count: number, page: number) {
  if (count <= 5) return Array.from({ length: count }, (_, i) => i + 1);
  const pages = new Set([1, count, page, page - 1, page + 1].filter((p) => p >= 1 && p <= count));
  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  sorted.forEach((p, i) => {
    if (i && p - sorted[i - 1] > 1) out.push('…');
    out.push(p);
  });
  return out;
}

/** Thanh chuyển trang. Chỉ hiển thị khi nội dung nhiều hơn một trang. */
export default function Pagination({
  count,
  current,
  onChange,
  variant,
}: {
  count: number;
  current: number;
  onChange: (page: number) => void;
  /** `labelled` là kiểu của trang Dịch vụ: nút lùi/tiến có chữ (Figma 208:288). */
  variant?: 'labelled';
}) {
  const copy = useCopy();
  if (count <= 1) return null;
  const labelled = variant === 'labelled';
  return (
    <nav
      className={`pagination${labelled ? ' labelled' : ''}`}
      aria-label={copy.accessibility.pagination}
    >
      <button
        type="button"
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
        aria-label={labelled ? undefined : copy.common.previous}
      >
        <UiIcon name="chevronLeft" />
        {labelled && <span>{copy.common.previous}</span>}
      </button>
      {pageList(count, current).map((p, i) =>
        p === '…' ? (
          <span className="ellipsis" key={`e${i}`}>
            ...
          </span>
        ) : (
          <button
            type="button"
            key={p}
            aria-current={current === p ? 'page' : undefined}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        disabled={current === count}
        onClick={() => onChange(current + 1)}
        aria-label={labelled ? undefined : copy.common.next}
      >
        {labelled && <span>{copy.common.next}</span>}
        <UiIcon name="chevronRight" />
      </button>
    </nav>
  );
}
