import type { Entry, Section } from './types';

/**
 * Dịch vụ và Dự án xếp theo cây cha – con. Đường dẫn của một mục là chuỗi slug từ gốc,
 * ví dụ `thiet-bi-va-giai-phap/thiet-bi`. Cây dựng từ danh sách đã tải sẵn nên không
 * phát sinh thêm truy vấn.
 */
export function pathOf(entry: Entry, all: Entry[]): string {
  const bySlug = new Map(all.map((e) => [e.slug, e]));
  const parts: string[] = [];
  let node: Entry | undefined = entry;
  const seen = new Set<string>();
  while (node && !seen.has(node.slug)) {
    seen.add(node.slug);
    parts.unshift(node.slug);
    node = node.parent ? bySlug.get(node.parent.slug) : undefined;
  }
  return parts.join('/');
}

/** Tìm mục theo chuỗi slug trong URL. */
export function findByPath(segments: string[], all: Entry[]): Entry | undefined {
  if (!segments.length) return undefined;
  const leaf = all.find((e) => e.slug === segments[segments.length - 1]);
  return leaf && pathOf(leaf, all) === segments.join('/') ? leaf : undefined;
}

/** Danh sách mục con trực tiếp, theo thứ tự biên tập viên đặt. */
export function childrenOf(entry: Entry | undefined, all: Entry[]): Entry[] {
  return all.filter((e) => (entry ? e.parent?.slug === entry.slug : !e.parent));
}

/** Chuỗi tổ tiên từ gốc tới ngay trên mục hiện tại. */
export function ancestorsOf(entry: Entry, all: Entry[]): Entry[] {
  const bySlug = new Map(all.map((e) => [e.slug, e]));
  const chain: Entry[] = [];
  const seen = new Set<string>([entry.slug]);
  let node = entry.parent ? bySlug.get(entry.parent.slug) : undefined;
  while (node && !seen.has(node.slug)) {
    seen.add(node.slug);
    chain.unshift(node);
    node = node.parent ? bySlug.get(node.parent.slug) : undefined;
  }
  return chain;
}

/**
 * Danh sách hiển thị của khối Dịch vụ hoặc Dự án theo lựa chọn trong CMS:
 * `roots` mục gốc, `children` mục con của trang hiện tại, `parent` mục con của một mục chỉ định.
 */
export function pickEntries(section: Section, all: Entry[], current?: Entry) {
  const source = section.source || (current ? 'children' : 'roots');
  const anchor =
    source === 'parent'
      ? all.find((e) => e.slug === section.parentSlug)
      : source === 'children'
        ? current
        : undefined;
  const list = source === 'roots' ? childrenOf(undefined, all) : childrenOf(anchor, all);
  return section.limit ? list.slice(0, section.limit) : list;
}
