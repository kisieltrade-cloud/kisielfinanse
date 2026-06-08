import { ImageResponse } from 'next/og';
import { getRankingBySlug, rankingMonthYear } from '@/lib/rankings';
import { getCategoryBySlug } from '@/lib/categories';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Ranking | KisielFinanse';

// Dynamiczny obraz do udostępnień (social CTR): brandowana karta rankingu
// z tytułem, miesiącem i kolorem kategorii — zamiast generycznego zdjęcia.
export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = getRankingBySlug(slug);
  const cat = r ? getCategoryBySlug(r.category) : undefined;
  const accent = cat?.color ?? '#c9a227';
  const fresh = r ? rankingMonthYear(r.updated) : '';
  const headline = r
    ? r.title.replace(/\{DATE\}/g, fresh).replace(/\s*-\s*.*$/, '') // ucięcie po myślniku
    : 'Ranking';
  const count = r?.picks.length ?? 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#06080c',
          padding: '70px 90px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: 'absolute', inset: 0, display: 'flex',
            backgroundImage:
              `linear-gradient(${accent}0a 1px, transparent 1px), linear-gradient(90deg, ${accent}0a 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
        {/* Glow */}
        <div
          style={{
            position: 'absolute', top: -220, right: -180, width: 640, height: 640, borderRadius: '50%',
            background: `radial-gradient(ellipse, ${accent}3a 0%, transparent 65%)`, display: 'flex',
          }}
        />

        {/* Top row: brand + kicker */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 22, color: '#7e8aa0', letterSpacing: 6, display: 'flex' }}>
            KISIELFINANSE.PL
          </div>
          <div
            style={{
              display: 'flex', alignItems: 'center',
              fontFamily: 'monospace', fontSize: 20, color: accent, letterSpacing: 4,
              border: `1px solid ${accent}66`, borderRadius: 100, padding: '10px 22px',
              background: `${accent}1a`,
            }}
          >
            RANKING · {fresh.toUpperCase()}
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 82, fontWeight: 800, lineHeight: 1.02, color: '#f2f5fa',
              letterSpacing: -1, display: 'flex', maxWidth: 1000,
            }}
          >
            {headline}
          </div>
          <div
            style={{
              marginTop: 22, height: 6, width: 150, borderRadius: 4,
              background: `linear-gradient(90deg, ${accent}, transparent)`, display: 'flex',
            }}
          />
        </div>

        {/* Bottom row: meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: 26, color: '#aeb9cc' }}>
            <span style={{ color: accent, fontWeight: 800, marginRight: 10 }}>{count}</span> produktów porównanych
          </div>
          <div style={{ width: 6, height: 6, borderRadius: 3, background: accent, display: 'flex' }} />
          <div style={{ display: 'flex', fontSize: 26, color: '#aeb9cc' }}>Niezależna ocena redakcyjna</div>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 6,
            background: `linear-gradient(90deg, ${accent}, transparent)`, display: 'flex',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
