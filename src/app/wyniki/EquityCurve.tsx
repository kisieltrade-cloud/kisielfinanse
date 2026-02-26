'use client';

import { useEffect, useRef, useState } from 'react';

// ─────────────────────────────────────────────────────
// AKTUALIZUJ CO TYDZIEŃ — dodaj nowy punkt na koniec
// Format: { date: 'DD.MM', value: WARTOŚĆ_KONTA }
// Startuj od wartości bazowej np. 10000
// ─────────────────────────────────────────────────────
const EQUITY_DATA = [
  { date: '01.01', value: 10000 },
  { date: '08.01', value: 10420 },
  { date: '15.01', value: 10890 },
  { date: '22.01', value: 10650 },
  { date: '29.01', value: 11240 },
  { date: '05.02', value: 11820 },
  { date: '12.02', value: 12100 },
  { date: '19.02', value: 11780 },
  { date: '26.02', value: 12480 },
];

const START_VALUE = EQUITY_DATA[0].value;
const END_VALUE = EQUITY_DATA[EQUITY_DATA.length - 1].value;
const TOTAL_RETURN = (((END_VALUE - START_VALUE) / START_VALUE) * 100).toFixed(1);
const MAX_DRAWDOWN = '-4.2%'; // aktualizuj ręcznie

export default function EquityCurve() {
  const pathRef = useRef<SVGPathElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; value: number; pct: string } | null>(null);

  const W = 900, H = 300, PAD = 40;

  const values = EQUITY_DATA.map(d => d.value);
  const minV = Math.min(...values) * 0.995;
  const maxV = Math.max(...values) * 1.005;

  const toX = (i: number) => PAD + (i / (EQUITY_DATA.length - 1)) * (W - PAD * 2);
  const toY = (v: number) => PAD + ((maxV - v) / (maxV - minV)) * (H - PAD * 2);

  const linePath = EQUITY_DATA.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(d.value)}`).join(' ');
  const fillPath = `${linePath} L${toX(EQUITY_DATA.length - 1)},${H - PAD} L${toX(0)},${H - PAD} Z`;

  // Animate line draw
  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const len = el.getTotalLength();
    el.style.strokeDasharray = `${len}`;
    el.style.strokeDashoffset = `${len}`;
    el.style.transition = 'stroke-dashoffset 2s ease 0.3s';
    requestAnimationFrame(() => {
      if (el) el.style.strokeDashoffset = '0';
    });
  }, []);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * W;
    let closest = 0;
    let minDist = Infinity;
    EQUITY_DATA.forEach((_, i) => {
      const dist = Math.abs(toX(i) - mouseX);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    const d = EQUITY_DATA[closest];
    const pct = (((d.value - START_VALUE) / START_VALUE) * 100).toFixed(1);
    setTooltip({
      x: toX(closest),
      y: toY(d.value),
      date: d.date,
      value: d.value,
      pct: pct,
    });
  };

  return (
    <section className="equity-section">
      <div className="section-label">// equity curve 2026</div>
      <h2 className="section-title reveal">
        <span aria-hidden="true">WZROST <span className="gradient-text-cp">KAPITAŁU</span></span>
        <span className="seo-only">Equity curve — wzrost kapitału tradingowego 2026 | NysethTrading</span>
      </h2>

      {/* Summary cards */}
      <div className="equity-cards reveal">
        <div className="equity-card">
          <span className="equity-card-val" style={{ color: 'var(--cyan)' }}>
            +{TOTAL_RETURN}%
          </span>
          <span className="equity-card-label">Zwrot od startu 2026</span>
        </div>
        <div className="equity-card">
          <span className="equity-card-val">
            {EQUITY_DATA.length - 1}
          </span>
          <span className="equity-card-label">Tygodni danych</span>
        </div>
        <div className="equity-card">
          <span className="equity-card-val" style={{ color: 'var(--pink)' }}>
            {MAX_DRAWDOWN}
          </span>
          <span className="equity-card-label">Max Drawdown</span>
        </div>
        <div className="equity-card">
          <span className="equity-card-val" style={{ color: 'var(--yellow)' }}>
            {END_VALUE.toLocaleString('pl-PL')}
          </span>
          <span className="equity-card-label">Wartość konta (jednostki)</span>
        </div>
      </div>

      {/* Chart */}
      <div className="equity-chart-wrap reveal">
        <svg
          width="100%"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          style={{ display: 'block', cursor: 'crosshair' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTooltip(null)}
        >
          <defs>
            <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00f5d4" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00f5d4" stopOpacity="0" />
            </linearGradient>
            <filter id="eqGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((t) => {
            const y = PAD + t * (H - PAD * 2);
            const v = maxV - t * (maxV - minV);
            return (
              <g key={t}>
                <line x1={PAD} y1={y} x2={W - PAD} y2={y}
                  stroke="rgba(0,245,212,0.06)" strokeWidth="1" />
                <text x={PAD - 6} y={y + 4}
                  fill="rgba(90,100,120,0.7)"
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="8"
                  textAnchor="end">
                  {Math.round(v).toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* X axis dates */}
          {EQUITY_DATA.map((d, i) => (
            i % 2 === 0 && (
              <text key={i}
                x={toX(i)} y={H - PAD + 16}
                fill="rgba(90,100,120,0.7)"
                fontFamily="JetBrains Mono, monospace"
                fontSize="8"
                textAnchor="middle">
                {d.date}
              </text>
            )
          ))}

          {/* Fill */}
          <path d={fillPath} fill="url(#eqFill)" />

          {/* Line */}
          <path
            ref={pathRef}
            d={linePath}
            fill="none"
            stroke="#00f5d4"
            strokeWidth="2.5"
            filter="url(#eqGlow)"
          />

          {/* Data points */}
          {EQUITY_DATA.map((d, i) => (
            <circle key={i}
              cx={toX(i)} cy={toY(d.value)}
              r="3.5"
              fill={d.value >= START_VALUE ? '#00f5d4' : '#ff2d78'}
              opacity="0.8"
            />
          ))}

          {/* Tooltip */}
          {tooltip && (
            <g>
              <line
                x1={tooltip.x} y1={PAD}
                x2={tooltip.x} y2={H - PAD}
                stroke="rgba(0,245,212,0.3)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <circle cx={tooltip.x} cy={tooltip.y} r="6"
                fill="#00f5d4" filter="url(#eqGlow)" />
              <rect
                x={tooltip.x > W / 2 ? tooltip.x - 110 : tooltip.x + 12}
                y={tooltip.y - 30}
                width={98} height={50}
                fill="var(--surface2)"
                stroke="rgba(0,245,212,0.3)"
                strokeWidth="1"
                rx="2"
              />
              <text
                x={tooltip.x > W / 2 ? tooltip.x - 61 : tooltip.x + 61}
                y={tooltip.y - 12}
                fill="#00f5d4"
                fontFamily="JetBrains Mono, monospace"
                fontSize="10"
                fontWeight="600"
                textAnchor="middle"
              >
                {tooltip.date} · {Number(tooltip.pct) >= 0 ? '+' : ''}{tooltip.pct}%
              </text>
              <text
                x={tooltip.x > W / 2 ? tooltip.x - 61 : tooltip.x + 61}
                y={tooltip.y + 6}
                fill="rgba(232,237,245,0.7)"
                fontFamily="JetBrains Mono, monospace"
                fontSize="9"
                textAnchor="middle"
              >
                {tooltip.value.toLocaleString('pl-PL')}
              </text>
            </g>
          )}
        </svg>
      </div>

      <p className="equity-disclaimer">
        * Wartości pokazują wzrost jednostkowy względem startu 2026 = 10 000.
        Dane aktualizowane co tydzień. Trading wiąże się z ryzykiem utraty kapitału.
      </p>
    </section>
  );
}
