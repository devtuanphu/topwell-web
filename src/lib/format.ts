/**
 * Ngày theo ngôn ngữ trang. `full` là cách viết của thẻ tin trong Figma (87:303, 171:955):
 * "Ngày 17 tháng 5 năm 2026" ở tiếng Việt; các ngôn ngữ khác dùng dạng dài chuẩn.
 */
export function formatDate(
  value?: string,
  locale = 'en-US',
  style: 'default' | 'full' = 'default',
) {
  if (!value) return '';
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  if (style === 'full' && locale.startsWith('vi'))
    return `Ngày ${date.getUTCDate()} tháng ${date.getUTCMonth() + 1} năm ${date.getUTCFullYear()}`;
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
