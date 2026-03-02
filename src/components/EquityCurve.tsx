'use client';

import { useEffect, useRef, useState } from 'react';

// ─────────────────────────────────────────────────────
// AKTUALIZUJ CO TYDZIEŃ — dodaj nowy punkt na koniec
// Format: { date: 'DD.MM', value: WARTOŚĆ_KONTA }
// Startuj od wartości bazowej (np. 50000 jeśli tyle wpłacasz)
// ─────────────────────────────────────────────────────
const EQUITY_DATA: Array<{ date: string; value: number }> = [
  { date: '03.03', value: 50000 }, // ← punkt startowy, zmień na rzeczywistą kwotę
  // Kolejne tygodnie dodawaj tu np.:
  // { date: '10.03', value: 51240 },
  // { date: '17.03', value: 52100 },
];

const START_VALUE = EQUITY_DATA[0].value;
const END_VALUE   = EQUITY_DATA[EQUITY_DATA.length - 1].value;
const HAS_DATA    = EQUITY_DATA.length > 1;

export default function EquityCurve() {
  const pathRef  = useRef<SVGPathElement>(null);
  const [tooltip, setTooltip] = useState<{
    x: number; y: number; date: string; value: number; pct: string;
  } | null>(null);

  const W = 900, H = 300, PAD = 40;

  const values = EQUITY_DATA.map(d => d.value);
  const minV   = Math.min(...values) * 0.995;
  const maxV   = Math.max(...values) * 1.005;
  const toX    = (i: number) => PAD + (i / Math.max(EQUITY_DATA.length - 1, 1)) * (W - PAD * 2);
  const toY    = (v: number) => PAD + ((maxV - v) / (maxV - minV + 0.001)) * (H - PAD * 2);

  const linePath = EQUITY_DATA.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(d.value)}`).join(' ');
  const fillPath = `${linePath} L${toX(EQUITY_DATA.length - 1)},${H - PAD} L${toX(0)},${H - PAD} Z`;

  useEffect(() => {
    const el = pathRef.current;
    if (!el || !HAS_DATA) return;
    const len = el.getTotalLength();
    el.style.strokeDasharray = `${len}`;
    el.style.strokeDashoffset = `${len}`;
    el.style.transition = 'stroke-dashoffset 2s ease 0.3s';
    requestAnimationFrame(() => { if (el) el.style.strokeDashoffset = '0'; });
  }, []);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!HAS_DATA) return;
    const rect   = e.currentTarget.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * W;
    let closest = 0, minDist = Infinity;
    EQUITY_DATA.forEach((_, i) => {
      const dist = Math.abs(toX(i) - mouseX);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    const d   = EQUITY_DATA[closest];
    const pct = (((d.value - START_VALUE) / START_VALUE) * 100).toFixed(2);
    setTooltip({ x: toX(closest), y: toY(d.value), date: d.date, value: d.value, pct });
  };

  const totalReturn    = (((END_VALUE - START_VALUE) / START_VALUE) * 100).toFixed(2);
  const isPositive     = END_VALUE >= START_VALUE;

  return (
    <section className="equity-section">
      <div className="section-label">// equity curve 2026</div>
      <h2 className="section-title reveal">
        <span aria-hidden="true">WZROST <span className="gradient-text-cp">KAPITAŁU</span></span>
      </h2>

      {/* Stats row */}
      <div className="equity-meta reveal" style={{ display: 'flex', gap: 32, marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '2px', marginBottom: 4 }}>START KAPITAŁU</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text)', letterSpacing: '2px' }}>
            {START_VALUE.toLocaleString('pl-PL')} zł
          </div>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '2px', marginBottom: 4 }}>AKTUALNIE</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: HAS_DATA ? (isPositive ? 'var(--cyan)' : '#ff2d78') : 'var(--muted)', letterSpacing: '2px' }}>
            {HAS_DATA ? `${END_VALUE.toLocaleString('pl-PL')} zł` : '—'}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '2px', marginBottom: 4 }}>ZWROT</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: HAS_DATA ? (isPositive ? 'var(--cyan)' : '#ff2d78') : 'var(--muted)', letterSpacing: '2px' }}>
            {HAS_DATA ? `${isPositive ? '+' : ''}${totalReturn}%` : '—'}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="equity-chart-wrap reveal" style={{ position: 'relative' }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', height: 'auto', display: 'block', cursor: HAS_DATA ? 'crosshair' : 'default' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTooltip(null)}
        >
          <defs>
            <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00f5d4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#00f5d4" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map(p => (
            <line key={p}
              x1={PAD} y1={PAD + p * (H - PAD * 2)}
              x2={W - PAD} y2={PAD + p * (H - PAD * 2)}
              stroke="#1a2535" strokeWidth="1"
            />
          ))}

          {HAS_DATA ? (
            <>
              <path d={fillPath} fill="url(#eqGrad)" />
              <path ref={pathRef} d={linePath} fill="none" stroke="#00f5d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Dots */}
              {EQUITY_DATA.map((d, i) => (
                <circle key={i} cx={toX(i)} cy={toY(d.value)} r="3" fill="#00f5d4" opacity="0.7" />
              ))}
            </>
          ) : (
            <>
              {/* Empty state — flat line at start */}
              <line x1={PAD} y1={H / 2} x2={W - PAD} y2={H / 2} stroke="#1a2535" strokeWidth="1.5" strokeDasharray="6,4" />
              <circle cx={PAD} cy={H / 2} r="5" fill="#00f5d4" opacity="0.5" />
              <text x={W / 2} y={H / 2 - 20} textAnchor="middle" fill="#3a4a5a" fontSize="12" fontFamily="monospace">
                // dane pojawią się po pierwszym tygodniu
              </text>
            </>
          )}

          {/* Tooltip */}
          {tooltip && HAS_DATA && (
            <>
              <line x1={tooltip.x} y1={PAD} x2={tooltip.x} y2={H - PAD} stroke="#00f5d4" strokeWidth="1" strokeOpacity="0.4" />
              <circle cx={tooltip.x} cy={tooltip.y} r="5" fill="#00f5d4" stroke="#060a10" strokeWidth="2" />
              <rect x={Math.min(tooltip.x + 10, W - 160)} y={tooltip.y - 40} width="150" height="50" rx="2" fill="#0c1220" stroke="#1a2535" />
              <text x={Math.min(tooltip.x + 20, W - 150)} y={tooltip.y - 22} fill="#8a9ab5" fontSize="10" fontFamily="monospace">{tooltip.date}</text>
              <text x={Math.min(tooltip.x + 20, W - 150)} y={tooltip.y - 8} fill="#e8edf5" fontSize="11" fontFamily="monospace" fontWeight="bold">
                {Number(tooltip.value).toLocaleString('pl-PL')} zł
              </text>
              <text x={Math.min(tooltip.x + 20, W - 150)} y={tooltip.y + 6} fill={parseFloat(tooltip.pct) >= 0 ? '#00f5d4' : '#ff2d78'} fontSize="10" fontFamily="monospace">
                {parseFloat(tooltip.pct) >= 0 ? '+' : ''}{tooltip.pct}% od startu
              </text>
            </>
          )}
        </svg>
      </div>
    </section>
  );
}
