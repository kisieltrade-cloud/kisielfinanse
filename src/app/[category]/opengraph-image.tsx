import { ImageResponse } from 'next/og';
import { getCategoryBySlug } from '@/lib/categories';
import { getPostsByTag } from '@/lib/posts';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const CATEGORY_ICONS: Record<string, string> = {
  trading:     '📈',
  inwestycje:  '💼',
  pieniadze:   '💰',
  psychologia: '🧠',
  gospodarka:  '🌍',
};

export default async function Image({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const config = getCategoryBySlug(slug);

  const name  = config?.name  ?? 'KisielFinanse';
  const desc  = config?.desc  ?? 'Edukacja finansowa';
  const color = config?.color ?? '#c9a227';
  const icon  = CATEGORY_ICONS[slug] ?? '📊';

  const result = await getPostsByTag(slug).catch(() => null);
  const count  = result?.posts?.filter(p => p.published).length ?? 0;
  const countLabel =
    count === 0 ? '' :
    count === 1 ? '1 artykuł' :
    count <= 4  ? `${count} artykuły` :
                  `${count} artykułów`;

  // Split desc into max 2 lines at ~50 chars
  const words = desc.split(', ');
  const line1Words: string[] = [];
  const line2Words: string[] = [];
  let line1Len = 0;
  for (const w of words) {
    if (line1Len + w.length <= 48) {
      line1Words.push(w);
      line1Len += w.length + 2;
    } else {
      line2Words.push(w);
    }
  }
  const descLine1 = line1Words.join(', ');
  const descLine2 = line2Words.join(', ');

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          background: '#030508',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* ── Grid background ── */}
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `linear-gradient(${hexToRgba(color, 0.05)} 1px, transparent 1px), linear-gradient(90deg, ${hexToRgba(color, 0.05)} 1px, transparent 1px)`,
            backgroundSize: '72px 72px',
            display: 'flex',
          }}
        />

        {/* ── Glow top-right ── */}
        <div
          style={{
            position: 'absolute', top: -250, right: -180,
            width: 750, height: 750, borderRadius: '50%',
            background: `radial-gradient(ellipse, ${hexToRgba(color, 0.22)} 0%, transparent 60%)`,
            display: 'flex',
          }}
        />

        {/* ── Glow bottom-left ── */}
        <div
          style={{
            position: 'absolute', bottom: -200, left: -120,
            width: 600, height: 600, borderRadius: '50%',
            background: `radial-gradient(ellipse, ${hexToRgba(color, 0.1)} 0%, transparent 60%)`,
            display: 'flex',
          }}
        />

        {/* ── Color stripe left ── */}
        <div
          style={{
            position: 'absolute', top: 0, left: 0,
            width: 6, height: '100%',
            background: color,
            display: 'flex',
          }}
        />

        {/* ── Bottom gradient bar ── */}
        <div
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${color} 0%, ${hexToRgba(color, 0.3)} 60%, transparent 100%)`,
            display: 'flex',
          }}
        />

        {/* ── Main content ── */}
        <div
          style={{
            display: 'flex', flexDirection: 'column',
            flex: 1, padding: '56px 80px 56px 96px',
            position: 'relative', zIndex: 2,
          }}
        >
          {/* Top row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              <div
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: hexToRgba(color, 0.15),
                  border: `1.5px solid ${hexToRgba(color, 0.4)}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 900, color: color,
                  fontFamily: 'monospace',
                }}
              >
                K
              </div>
              <span
                style={{
                  fontFamily: 'monospace', fontSize: 15, fontWeight: 700,
                  color: '#8a9ab5', letterSpacing: 4,
                }}
              >
                KISIELFINANSE.PL
              </span>
            </div>

            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: hexToRgba(color, 0.1),
                border: `1px solid ${hexToRgba(color, 0.25)}`,
                padding: '7px 18px',
              }}
            >
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span
                style={{
                  fontFamily: 'monospace', fontSize: 12,
                  color: color, letterSpacing: 4, fontWeight: 700,
                }}
              >
                KATEGORIA
              </span>
            </div>
          </div>

          {/* Category name — hero */}
          <div
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontSize: name.length > 10 ? 88 : 108,
                fontWeight: 900,
                lineHeight: 0.9,
                color: '#f0f4fa',
                letterSpacing: -3,
                fontFamily: 'sans-serif',
                display: 'flex',
                marginBottom: 28,
              }}
            >
              {name.toUpperCase()}
            </div>

            {/* Accent line */}
            <div
              style={{
                width: 80, height: 4,
                background: color,
                marginBottom: 28,
                display: 'flex',
              }}
            />

            {/* Description lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div
                style={{
                  fontFamily: 'monospace', fontSize: 22,
                  color: '#6b7a90', lineHeight: 1.4,
                  display: 'flex',
                }}
              >
                {descLine1}
              </div>
              {descLine2 && (
                <div
                  style={{
                    fontFamily: 'monospace', fontSize: 22,
                    color: '#6b7a90', lineHeight: 1.4,
                    display: 'flex',
                  }}
                >
                  {descLine2}
                </div>
              )}
            </div>
          </div>

          {/* Bottom row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div
              style={{
                fontFamily: 'monospace', fontSize: 14,
                color: '#374151', letterSpacing: 3,
                display: 'flex',
              }}
            >
              Edukacja finansowa bez ściemy
            </div>

            {countLabel ? (
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: hexToRgba(color, 0.08),
                  border: `1px solid ${hexToRgba(color, 0.2)}`,
                  padding: '8px 20px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'monospace', fontSize: 22,
                    fontWeight: 700, color: color,
                  }}
                >
                  {count}
                </span>
                <span
                  style={{
                    fontFamily: 'monospace', fontSize: 13,
                    color: '#6b7a90', letterSpacing: 2,
                  }}
                >
                  {count === 1 ? 'ARTYKUŁ' : 'ARTYKUŁÓW'}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
