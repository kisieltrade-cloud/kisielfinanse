import type { FGResult } from '@/lib/fear-greed';

export default function FearGreedGauge({
  title,
  subtitle,
  data,
  accent,
}: {
  title: string;
  subtitle: string;
  data: FGResult;
  accent: string;
}) {
  const cx = 120;
  const cy = 128;
  const R = 100;
  const v = data.ok ? data.value : 50;

  // Kąt igły: 0 -> 180° (lewo), 100 -> 0° (prawo)
  const theta = ((180 - v * 1.8) * Math.PI) / 180;
  const nx = cx + (R - 26) * Math.cos(theta);
  const ny = cy - (R - 26) * Math.sin(theta);

  const gradId = `fg-grad-${title.replace(/[^a-z0-9]/gi, '')}`;

  const valColor = !data.ok
    ? 'var(--muted)'
    : v < 45
    ? '#e0524d'
    : v <= 55
    ? '#e0c947'
    : '#3fb96b';

  const updated = data.ok && data.updatedISO
    ? new Date(data.updatedISO).toLocaleString('pl-PL', {
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
      })
    : null;

  return (
    <div style={{
      position: 'relative',
      background:
        `radial-gradient(130% 90% at 50% -10%, ${accent}1f, transparent 60%), #0b0f15`,
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 20,
      padding: '26px 24px 24px',
      overflow: 'hidden',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 12px 34px rgba(0,0,0,0.45)',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: '16%', right: '16%', height: 1,
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: 0.7,
      }} />

      <div style={{ textAlign: 'center', marginBottom: 6 }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text)', margin: 0, letterSpacing: '0.3px' }}>
          {title}
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: 'var(--muted)', margin: '4px 0 0', letterSpacing: '0.5px' }}>
          {subtitle}
        </p>
      </div>

      <svg viewBox="0 0 240 150" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e0524d" />
            <stop offset="50%" stopColor="#e0c947" />
            <stop offset="100%" stopColor="#3fb96b" />
          </linearGradient>
        </defs>

        {/* Łuk tła */}
        <path
          d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={16}
          strokeLinecap="round"
          opacity={data.ok ? 1 : 0.25}
        />

        {/* Igła */}
        {data.ok && (
          <>
            <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#ffffff" strokeWidth={3} strokeLinecap="round" />
            <circle cx={cx} cy={cy} r={7} fill="#ffffff" />
            <circle cx={cx} cy={cy} r={3} fill="#0b0f15" />
          </>
        )}

        {/* Etykiety skali */}
        <text x={cx - R} y={cy + 20} fill="var(--muted)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">Strach</text>
        <text x={cx + R} y={cy + 20} fill="var(--muted)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">Chciwość</text>
      </svg>

      <div style={{ textAlign: 'center', marginTop: -6 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', fontWeight: 800, color: valColor, lineHeight: 1 }}>
          {data.ok ? data.value : '--'}
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', fontWeight: 700, color: valColor, marginTop: 4 }}>
          {data.label}
        </div>
        {updated && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', marginTop: 8 }}>
            aktualizacja {updated}
          </div>
        )}
      </div>
    </div>
  );
}
