import { ImageResponse } from 'next/og';
import { getCategoryBySlug } from '@/lib/categories';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default async function Image({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const config = getCategoryBySlug(slug);

  const name   = config?.name    ?? 'KisielFinanse';
  const desc   = config?.desc    ?? 'Edukacja finansowa';
  const color  = config?.color   ?? '#c9a227';

  const shortDesc = desc.length > 100 ? desc.slice(0, 97) + '…' : desc;

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
        {/* Grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(${hexToRgba(color, 0.04)} 1px, transparent 1px), linear-gradient(90deg, ${hexToRgba(color, 0.04)} 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            display: 'flex',
          }}
        />

        {/* Glow top-right */}
        <div
          style={{
            position: 'absolute',
            top: -200,
            right: -140,
            width: 680,
            height: 680,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, ${hexToRgba(color, 0.2)} 0%, transparent 65%)`,
            display: 'flex',
          }}
        />

        {/* Glow bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: -180,
            left: -100,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, ${hexToRgba(color, 0.08)} 0%, transparent 65%)`,
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

        {/* Górny rząd: label + kisielfinanse.pl */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 60,
          }}
        >
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 13,
              fontWeight: 700,
              color: color,
              background: hexToRgba(color, 0.1),
              padding: '6px 16px',
              letterSpacing: 5,
              display: 'flex',
            }}
          >
            KISIELFINANSE.PL
          </div>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 13,
              color: '#374151',
              letterSpacing: 4,
              display: 'flex',
            }}
          >
            KATEGORIA
          </div>
        </div>

        {/* Nazwa kategorii — duży tekst */}
        <div
          style={{
            fontSize: 100,
            fontWeight: 900,
            lineHeight: 0.95,
            color: '#e8edf5',
            letterSpacing: -2,
            display: 'flex',
            flex: 1,
            alignItems: 'center',
          }}
        >
          {name.toUpperCase()}
        </div>

        {/* Opis kategorii */}
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: 20,
            color: '#6b7280',
            lineHeight: 1.5,
            display: 'flex',
            marginTop: 28,
            maxWidth: 780,
          }}
        >
          {shortDesc}
        </div>

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
