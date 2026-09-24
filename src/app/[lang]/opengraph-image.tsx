import { ImageResponse } from 'next/og';
import { getContext } from '@/lib/cms';
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { copy } = await getContext(isLocale(lang) ? lang : DEFAULT_LOCALE);
  return new ImageResponse(
    (
      <div
        style={{
          background: '#101827',
          color: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '80px',
          justifyContent: 'center',
        }}
      >
        <div style={{ color: '#f1df57', fontSize: 32, marginBottom: 40 }}>
          {copy.metadata.siteName}
        </div>
        <div style={{ fontSize: 62, fontWeight: 800 }}>{copy.metadata.ogLineOne}</div>
        <div style={{ fontSize: 62, fontWeight: 800 }}>{copy.metadata.ogLineTwo}</div>
        <div style={{ marginTop: 40, fontSize: 26, color: '#cbd5e1' }}>
          {copy.metadata.ogTagline}
        </div>
      </div>
    ),
    size,
  );
}
