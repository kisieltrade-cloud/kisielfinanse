import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/lib/posts';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const TAG_COLOR: Record<string, string> = {
  strategia:         '#c9a227',
  psychologia:       '#b14aed',
  analiza:           '#f5c518',
  'risk management': '#ff2d78',
  edukacja:          '#00f5d4',
  rynek:             '#f5c518',
  finanse:           '#b14aed',
  geopolityka:       '#ff2d78',
  krypto:            '#f5a623',
  trading:           '#c9a227',
  oszczędzanie:      '#c9a227',
};

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const title   = post?.title   ?? 'KisielFinanse';
  const tag     = post?.tag     ?? 'Blog';
  const excerpt = post?.excerpt ?? '';
  const color   = TAG_COLOR[tag.toLowerCase()] ?? '#c9a227';

  // Dynamiczny rozmiar fontu zależnie od długości tytułu
  const fontSize =
    title.length > 80 ? 42 :
    title.length > 60 ? 52 :
    title.length > 40 ? 62 : 72;

  const shortExcerpt = excerpt.length > 115 ? excerpt.slice(0, 112) + '…' : excerpt;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          background: '#030508',
          padding: '64px 80px 60px 88px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid overlay — kolor dopasowany do tagu */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(${hexToRgba(color, 0.04)} 1px, transparent 1px), linear-gradient(90deg, ${hexToRgba(color, 0.04)} 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            display: 'flex',
          }}
        />

        {/* Glow top-right w kolorze tagu */}
        <div
          style={{
            position: 'absolute',
            top: -220,
            right: -160,
            width: 620,
            height: 620,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, ${hexToRgba(color, 0.16)} 0%, transparent 65%)`,
            display: 'flex',
          }}
        />

        {/* Pionowy pasek akcentujący po lewej */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 5,
            height: '100%',
            background: color,
            display: 'flex',
          }}
        />

        {/* Górny rząd: tag badge + nazwa strony */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 48,
          }}
        >
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 15,
              fontWeight: 700,
              color: color,
              background: hexToRgba(color, 0.12),
              padding: '7px 18px',
              letterSpacing: 4,
              display: 'flex',
            }}
          >
            {tag.toUpperCase()}
          </div>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 15,
              color: '#374151',
              letterSpacing: 5,
              display: 'flex',
            }}
          >
            KISIELFINANSE.PL
          </div>
        </div>

        {/* Tytuł artykułu */}
        <div
          style={{
            fontSize,
            fontWeight: 900,
            lineHeight: 1.1,
            color: '#e8edf5',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {title}
        </div>

        {/* Zajawka */}
        {shortExcerpt && (
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 18,
              color: '#4b5563',
              lineHeight: 1.55,
              display: 'flex',
              marginTop: 24,
            }}
          >
            {shortExcerpt}
          </div>
        )}

        {/* Gradient bar na dole */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${color} 0%, transparent 75%)`,
            display: 'flex',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
