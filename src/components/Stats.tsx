'use client';

import { useState, useEffect, useRef } from 'react';

const STATS = {
  annualReturn: 183,
  annualReturnSuffix: '%',
  annualReturnPrefix: '+',
  annualReturnDecimals: 0,
  annualReturnDelta: 'vs +67% rok wcześniej',
  winRate: 68.4,
  winRateSuffix: '%',
  winRateDecimals: 1,
  winRateDelta: 'z 847 zamkniętych pozycji',
  profitFactor: 2.87,
  profitFactorSuffix: '',
  profitFactorDecimals: 2,
  profitFactorDelta: 'zyski / straty (średnie)',
  maxDrawdown: 8.2,
  maxDrawdownSuffix: '%',
  maxDrawdownPrefix: '-',
  maxDrawdownDecimals: 1,
  maxDrawdownDelta: 'kontrolowane ryzyko',
};

const MONTHLY_DATA: Record<string, Array<{ name: string; pct: number }>> = {
  '2024': [
    { name: 'STY', pct: 8.4 }, { name: 'LUT', pct: 12.1 }, { name: 'MAR', pct: -3.2 },
    { name: 'KWI', pct: 15.7 }, { name: 'MAJ', pct: 6.3 }, { name: 'CZE', pct: -1.8 },
    { name: 'LIP', pct: 22.4 }, { name: 'SIE', pct: 9.1 }, { name: 'WRZ', pct: -4.5 },
    { name: 'PAŹ', pct: 18.9 }, { name: 'LIS', pct: 11.2 }, { name: 'GRU', pct: 14.6 },
  ],
  '2023': [
    { name: 'STY', pct: 5.1 }, { name: 'LUT', pct: 8.3 }, { name: 'MAR', pct: -2.1 },
    { name: 'KWI', pct: 7.4 }, { name: 'MAJ', pct: 3.8 }, { name: 'CZE', pct: -0.9 },
    { name: 'LIP', pct: 11.2 }, { name: 'SIE', pct: 4.7 }, { name: 'WRZ', pct: -6.1 },
    { name: 'PAŹ', pct: 9.8 }, { name: 'LIS', pct: 7.6 }, { name: 'GRU', pct: 10.4 },
  ],
};

// ── Animated counter hook ─────────────────────────────────────────────────
function useCountUp(target: number, decimals: number, started: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration, decimals]);
  return value;
}

// ── Single animated stat card ─────────────────────────────────────────────
function StatCard({
  label, target, prefix = '', suffix = '', decimals = 0, delta, color, delay = 0
}: {
  label: string; target: number; prefix?: string; suffix?: string;
  decimals?: number; delta: string; color: string; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const animated = useCountUp(target, decimals, started);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const display = decimals > 0
    ? animated.toFixed(decimals)
    : Math.round(animated).toLocaleString('pl-PL');

  return (
    <div
      ref={ref}
      className="stat-card reveal"
      style={{ transitionDelay: `${delay}ms`, borderTop: `3px solid ${color}` }}
    >
      <span className="stat-number" style={{ color }}>
        {prefix}{display}{suffix}
      </span>
      <div className="stat-label">{label}</div>
      <div className="stat-delta">{delta}</div>
    </div>
  );
}

export default function Stats() {
  const [year, setYear] = useState<'2024' | '2023'>('2024');
  const months = MONTHLY_DATA[year];
  const maxAbs = Math.max(...months.map((m) => Math.abs(m.pct)));

  return (
    <section className="wyniki-section" id="wyniki">
      <div className="section-label">// wyniki tradingowe</div>
      <h2 className="section-title reveal">
        TRANSPARENTNE
        <br />
        <span className="gradient-text-cp">STATYSTYKI</span>
      </h2>

      <div className="stats-grid">
        <StatCard
          label="Zwrot roczny (2024)" target={STATS.annualReturn}
          prefix={STATS.annualReturnPrefix} suffix={STATS.annualReturnSuffix}
          decimals={STATS.annualReturnDecimals} delta={STATS.annualReturnDelta}
          color="var(--cyan)" delay={0}
        />
        <StatCard
          label="Win Rate" target={STATS.winRate}
          suffix={STATS.winRateSuffix} decimals={STATS.winRateDecimals}
          delta={STATS.winRateDelta} color="var(--purple)" delay={80}
        />
        <StatCard
          label="Profit Factor" target={STATS.profitFactor}
          suffix={STATS.profitFactorSuffix} decimals={STATS.profitFactorDecimals}
          delta={STATS.profitFactorDelta} color="var(--yellow)" delay={160}
        />
        <StatCard
          label="Max Drawdown" target={STATS.maxDrawdown}
          prefix={STATS.maxDrawdownPrefix} suffix={STATS.maxDrawdownSuffix}
          decimals={STATS.maxDrawdownDecimals} delta={STATS.maxDrawdownDelta}
          color="var(--pink)" delay={240}
        />
      </div>

      {/* Monthly chart */}
      <div className="chart-panel reveal">
        <div className="chart-header">
          <div>
            <div className="chart-title">Miesięczne wyniki {year}</div>
            <div className="chart-sub">% zwrotu na rachunku · dane własne</div>
          </div>
          <div className="chart-filters">
            {(['2024', '2023'] as const).map((y) => (
              <button
                key={y}
                className={`chart-filter-btn${year === y ? ' active' : ''}`}
                onClick={() => setYear(y)}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
        <div className="monthly-grid">
          {months.map((m) => {
            const pos = m.pct >= 0;
            const h = (Math.abs(m.pct) / maxAbs) * 80;
            return (
              <div key={m.name} className="month-bar-wrap">
                <div className="month-pct" style={{ color: pos ? 'var(--cyan)' : 'var(--pink)' }}>
                  {pos ? '+' : ''}{m.pct}%
                </div>
                <div className="month-bar-track">
                  <div className={`month-bar ${pos ? 'month-bar-pos' : 'month-bar-neg'}`}
                    style={{ height: `${h}px` }} />
                </div>
                <div className="month-name">{m.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      <p style={{
        marginTop: 20, fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
        color: 'var(--muted)', lineHeight: 1.6, maxWidth: 600,
      }}>
        * Wyniki historyczne nie gwarantują przyszłych zwrotów. Trading wiąże się z ryzykiem utraty kapitału.
        Dane pokazują wyniki własnego rachunku — nie są to wyniki zarządzanego funduszu.
      </p>
    </section>
  );
}
