'use client';

import { useState } from 'react';

// ─── Data ────────────────────────────────────────────────────────────────────
// Edit this file to update your trading stats.
// In future: fetch from a private Google Sheet or Supabase table.

const STATS = {
  annualReturn: '+183%',
  annualReturnDelta: 'vs +67% rok wcześniej',
  winRate: '68.4%',
  winRateDelta: 'z 847 zamkniętych pozycji',
  profitFactor: '2.87',
  profitFactorDelta: 'zyski / straty (średnie)',
  maxDrawdown: '-8.2%',
  maxDrawdownDelta: 'kontrolowane ryzyko',
};

const MONTHLY_DATA: Record<string, Array<{ name: string; pct: number }>> = {
  '2024': [
    { name: 'STY', pct: 8.4 },
    { name: 'LUT', pct: 12.1 },
    { name: 'MAR', pct: -3.2 },
    { name: 'KWI', pct: 15.7 },
    { name: 'MAJ', pct: 6.3 },
    { name: 'CZE', pct: -1.8 },
    { name: 'LIP', pct: 22.4 },
    { name: 'SIE', pct: 9.1 },
    { name: 'WRZ', pct: -4.5 },
    { name: 'PAŹ', pct: 18.9 },
    { name: 'LIS', pct: 11.2 },
    { name: 'GRU', pct: 14.6 },
  ],
  '2023': [
    { name: 'STY', pct: 5.1 },
    { name: 'LUT', pct: 8.3 },
    { name: 'MAR', pct: -2.1 },
    { name: 'KWI', pct: 7.4 },
    { name: 'MAJ', pct: 3.8 },
    { name: 'CZE', pct: -0.9 },
    { name: 'LIP', pct: 11.2 },
    { name: 'SIE', pct: 4.7 },
    { name: 'WRZ', pct: -6.1 },
    { name: 'PAŹ', pct: 9.8 },
    { name: 'LIS', pct: 7.6 },
    { name: 'GRU', pct: 10.4 },
  ],
};

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

      {/* KPI cards */}
      <div className="stats-grid reveal">
        <div className="stat-card">
          <span className="stat-number">{STATS.annualReturn}</span>
          <div className="stat-label">Zwrot roczny (2024)</div>
          <div className="stat-delta">↑ {STATS.annualReturnDelta}</div>
        </div>
        <div className="stat-card">
          <span className="stat-number">{STATS.winRate}</span>
          <div className="stat-label">Win Rate</div>
          <div className="stat-delta">{STATS.winRateDelta}</div>
        </div>
        <div className="stat-card">
          <span className="stat-number">{STATS.profitFactor}</span>
          <div className="stat-label">Profit Factor</div>
          <div className="stat-delta">{STATS.profitFactorDelta}</div>
        </div>
        <div className="stat-card">
          <span className="stat-number">{STATS.maxDrawdown}</span>
          <div className="stat-label">Max Drawdown</div>
          <div className="stat-delta">{STATS.maxDrawdownDelta}</div>
        </div>
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
                <div
                  className="month-pct"
                  style={{ color: pos ? 'var(--cyan)' : 'var(--pink)' }}
                >
                  {pos ? '+' : ''}
                  {m.pct}%
                </div>
                <div className="month-bar-track">
                  <div
                    className={`month-bar ${pos ? 'month-bar-pos' : 'month-bar-neg'}`}
                    style={{ height: `${h}px` }}
                  />
                </div>
                <div className="month-name">{m.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      <p
        style={{
          marginTop: 20,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--muted)',
          lineHeight: 1.6,
          maxWidth: 600,
        }}
      >
        * Wyniki historyczne nie gwarantują przyszłych zwrotów. Trading wiąże się z ryzykiem utraty kapitału.
        Dane pokazują wyniki własnego rachunku — nie są to wyniki zarządzanego funduszu.
      </p>
    </section>
  );
}
