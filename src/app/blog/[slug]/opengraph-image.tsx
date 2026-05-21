import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/lib/posts';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const TAG_COLORS: Record<string, string> = {
  strategia: '#00f5d4',
  psychologia: '#b14aed',
  analiza: '#f5c518',
  'risk management': '#ff2d78',
  edukacja: '#00f5d4',
  rynek: '#f5c518',
  krypto: '#f5a623',
  oszczędzanie: '#00f5d4',
  geopolityka: '#ff2d78',
  trading: '#00f5d4',
  finanse: '#b14aed',
};

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const title = post?.title ?? 'KisielFinanse';
  const tag = post?.tag ?? 'Edukacja';
  const date = post?.date ?? '';
  const tagColor = TAG_COLORS[tag.toLowerCase()] ?? '#00f5d4';
  const fontSize = title.length > 70 ? 48 : title.length > 50 ? 58 : title.length > 35 ? 68 : 78;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#030508',
          display: 'flex',
          flexDirection: 'column',
          padding: '64px 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            display: 'flex',
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            top: -180,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, ${tagColor}28 0%, transparent 65%)`,
            display: 'flex',
          }}
        />

        {/* Tag pill */}
        <div
          style={{
            display: 'flex',
            marginBottom: 36,
          }}
        >
          <div
            style={{
              background: `${tagColor}18`,
              border: `1px solid ${tagColor}55`,
              color: tagColor,
              padding: '8px 20px',
              fontSize: 17,
              fontFamily: 'monospace',
              letterSpacing: 4,
              display: 'flex',
            }}
          >
            {tag.toUpperCase()}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize,
            fontWeight: 900,
            color: '#e8edf5',
            lineHeight: 1.15,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            paddingTop: 24,
            marginTop: 24,
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: tagColor,
              fontFamily: 'monospace',
              letterSpacing: 3,
              display: 'flex',
            }}
          >
            KisielFinanse
          </div>
          <div
            style={{
              fontSize: 18,
              color: '#3a4a5a',
              fontFamily: 'monospace',
              display: 'flex',
            }}
          >
            {date}
          </div>
        </div>

        {/* Bottom gradient line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${tagColor}, #b14aed)`,
            display: 'flex',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
