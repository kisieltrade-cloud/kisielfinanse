'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

const CHART_POINTS = [
  195, 188, 178, 170, 162, 158, 150, 145, 155, 148,
  138, 130, 125, 118, 122, 112, 105, 98, 90, 95,
  85, 78, 82, 72, 65, 58, 62, 50, 42, 35,
];

function buildPath(points: number[], w: number, h: number) {
  const step = w / (points.length - 1);
  return points.map((y, i) => `${i === 0 ? 'M' : 'L'}${i * step},${y}`).join(' ');
}

function buildFill(points: number[], w: number, h: number) {
  const step = w / (points.length - 1);
  const line = points.map((y, i) => `${i * step},${y}`).join(' L');
  return `M0,${points[0]} L${line} L${w},${h} L0,${h} Z`;
}

export default function Hero() {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!pathRef.current) return;
    const len = pathRef.current.getTotalLength();
    pathRef.current.style.strokeDasharray = `${len}`;
    pathRef.current.style.strokeDashoffset = `${len}`;
    pathRef.current.style.transition = 'stroke-dashoffset 2s ease 0.5s';
    requestAnimationFrame(() => {
      if (pathRef.current) pathRef.current.style.strokeDashoffset = '0';
    });
  }, []);

  const W = 560, H = 220;
  const linePath = buildPath(CHART_POINTS, W, H);
  const fillPath = buildFill(CHART_POINTS, W, H);

  return (
    <section className="hero" id="home">
      <div className="hero-grid" />
      <div className="hero-glow-1" />
      <div className="hero-glow-2" />

      {/* LEFT COLUMN */}
      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          AKTYWNY TRADER · TRANSPARENTNE WYNIKI
        </div>

    <div className="hero-h1-wrapper">
  <div className="hero-h1" aria-hidden="true">
    <span className="hero-h1-line1">TRADE</span>
    <span className="hero-h1-line2">SMARTER</span>
  </div>
  <h1 className="seo-only">
    NysethTrading — Transparentne Wyniki Tradingowe | Day Trading Forex i Krypto
  </h1>
</div>

        <p className="hero-desc">
          Trader z Wrocławia z 9-letnim doświadczeniem. Zajmuję się day tradingiem
          na Forexie, krypto i futures. Wyniki publikuję co tydzień — bez filtrów.
        </p>

        <div className="hero-actions">
          <Link href="/wyniki" className="btn-primary">
            ZOBACZ WYNIKI
          </Link>
          <Link href="/o-mnie" className="btn-ghost">
            O MNIE →
          </Link>
        </div>

        {/* MINI STATS */}
        <div className="hero-mini-stats">
          <div className="hero-mini-stat">
            <span className="hero-mini-val">9</span>
            <span className="hero-mini-label">Lat doświadczenia</span>
          </div>
          <div className="hero-mini-divider" />
          <div className="hero-mini-stat">
            <span className="hero-mini-val">1000+</span>
            <span className="hero-mini-label">Zamkniętych pozycji</span>
          </div>
          <div className="hero-mini-divider" />
          <div className="hero-mini-stat">
            <span className="hero-mini-val" style={{ color: 'var(--yellow)' }}>Forex</span>
            <span className="hero-mini-label">Krypto · Futures</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN — CHART */}
      <div className="hero-chart-wrap">
        <div className="hero-chart-header">
          <div>
            <div className="hero-chart-label">// equity curve 2026</div>
            <div className="hero-chart-title">NysethTrading</div>
          </div>
          <div className="hero-chart-badge" style={{ fontSize: '0.62rem', letterSpacing: '1px', color: 'var(--muted)', border: '1px solid var(--border)', padding: '5px 12px', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
            // akt. 03.03.2026
          </div>
        </div>

        <svg
          width="100%"
          viewBox={`0 0 ${W} ${H + 30}`}
          style={{ display: 'block' }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00f5d4" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#00f5d4" stopOpacity="0" />
            </linearGradient>
            <filter id="glowLine">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {[55, 110, 165].map(y => (
            <line key={y} x1="0" y1={y} x2={W} y2={y}
              stroke="rgba(0,245,212,0.06)" strokeWidth="1" />
          ))}

          {/* Fill */}
          <path d={fillPath} fill="url(#fillGrad)" />

          {/* Line */}
          <path
            ref={pathRef}
            d={linePath}
            fill="none"
            stroke="#00f5d4"
            strokeWidth="2.5"
            filter="url(#glowLine)"
          />

          {/* End dot */}
          <circle cx={W} cy={CHART_POINTS[CHART_POINTS.length - 1]} r="5"
            fill="#00f5d4" filter="url(#glowLine)" />
          <circle cx={W} cy={CHART_POINTS[CHART_POINTS.length - 1]} r="12"
            fill="rgba(0,245,212,0.12)" />

          {/* X axis labels */}
          {['STY', 'LUT', 'MAR', 'KWI', 'MAJ'].map((m, i) => (
            <text key={m}
              x={i * (W / 4)}
              y={H + 22}
              fill="rgba(90,100,120,0.7)"
              fontFamily="JetBrains Mono, monospace"
              fontSize="9"
            >{m}</text>
          ))}

          {/* P&L label */}
          <rect x={W - 100} y={CHART_POINTS[CHART_POINTS.length - 1] - 30}
            width={96} height={22} fill="rgba(0,245,212,0.1)"
            stroke="rgba(0,245,212,0.3)" strokeWidth="1" rx="2" />
          <text
            x={W - 52} y={CHART_POINTS[CHART_POINTS.length - 1] - 14}
            fill="#00f5d4"
            fontFamily="JetBrains Mono, monospace"
            fontSize="11"
            fontWeight="600"
            textAnchor="middle"
          >03.03.2026</text>
        </svg>

        {/* Chart footer stats */}
        <div className="hero-chart-stats">
          <div className="hero-chart-stat">
            <span className="hero-chart-stat-val" style={{ color: 'var(--cyan)' }}>—</span>
            <span className="hero-chart-stat-label">P&amp;L 2026</span>
          </div>
          <div className="hero-chart-stat">
            <span className="hero-chart-stat-val">—</span>
            <span className="hero-chart-stat-label">Zielone tygodnie</span>
          </div>
          <div className="hero-chart-stat">
            <span className="hero-chart-stat-val" style={{ color: 'var(--yellow)' }}>co tydzień</span>
            <span className="hero-chart-stat-label">Aktualizacja</span>
          </div>
        </div>
      </div>
    </section>
  );
}
