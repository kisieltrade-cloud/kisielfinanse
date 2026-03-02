'use client';

import { useState } from 'react';

// ─── EDYTUJ TUTAJ CO MIESIĄC ──────────────────────────────────────────────
// Uzupełniaj pct gdy miesiąc się skończy. null = jeszcze nie zakończony.. null = jeszcze nie zakończony.

const STATS_2026 = {
  annualReturn: '—',
  annualReturnNote: "start: marzec 2026",
  winRate: '—',
  winRateNote: 'aktualizowane co tydzień',
  profitFactor: '—',
  profitFactorNote: 'zyski / straty (średnie)',
  maxDrawdown: '—',
  maxDrawdownNote: 'kontrolowane ryzyko',
};

const MONTHLY_2026: Array<{ name: string; pct: number | null; active: boolean }> = [
  { name: 'STY', pct: null, active: false },
  { name: 'LUT', pct: null, active: false },
  { name: 'MAR', pct: null, active: true  }, // ← aktywny miesiąc
  { name: 'KWI', pct: null, active: false },
  { name: 'MAJ', pct: null, active: false },
  { name: 'CZE', pct: null, active: false },
  { name: 'LIP', pct: null, active: false },
  { name: 'SIE', pct: null, active: false },
  { name: 'WRZ', pct: null, active: false },
  { name: 'PAŹ', pct: null, active: false },
  { name: 'LIS', pct: null, active: false },
  { name: 'GRU', pct: null, active: false },
];
// ──────────────────────────────────────────────────────────────────────────

export default function Stats() {
  const months = MONTHLY_2026;
  const completed = months.filter(m => m.pct !== null);
  const maxAbs = completed.length > 0
    ? Math.max(...completed.map(m => Math.abs(m.pct as number)))
    : 1;

  return (
    <section className="wyniki-section" id="wyniki">
      <div className="section-label">// wyniki tradingowe</div>
      <h2 className="section-title reveal">
        TRANSPARENTNE
        <br />
        <span className="gradient-text-cp">STATYSTYKI</span>
      </h2>

      {/* Challenge info banner */}
      <div className="reveal" style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'rgba(0,245,212,0.05)', border: '1px solid rgba(0,245,212,0.15)',
        borderLeft: '3px solid var(--cyan)', padding: '10px 20px',
        fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--cyan)',
        marginBottom: 32, maxWidth: 600,
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--cyan)', display: 'inline-block', boxShadow: '0 0 8px var(--cyan)', flexShrink: 0 }} />
        Challenge start: Marzec 2026 — wyniki aktualizowane co tydzień
      </div>

      {/* KPI cards */}
      <div className="stats-grid reveal">
        {[
          { value: STATS_2026.annualReturn, label: 'Zwrot (2026)', note: STATS_2026.annualReturnNote, color: 'var(--cyan)' },
          { value: STATS_2026.winRate,      label: 'Win Rate',     note: STATS_2026.winRateNote,      color: 'var(--cyan)' },
          { value: STATS_2026.profitFactor, label: 'Profit Factor',note: STATS_2026.profitFactorNote, color: '#f5c518'     },
          { value: STATS_2026.maxDrawdown,  label: 'Max Drawdown', note: STATS_2026.maxDrawdownNote,  color: '#ff2d78'     },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ borderTop: `3px solid ${s.color}22` }}>
            <span className="stat-number" style={{ color: s.value === '—' ? 'var(--muted)' : s.color }}>
              {s.value}
            </span>
            <div className="stat-label">{s.label}</div>
            <div className="stat-delta">{s.note}</div>
          </div>
        ))}
      </div>

      {/* Monthly chart */}
      <div className="monthly-chart reveal">
        <div className="monthly-header">
          <span className="monthly-title">Miesięczne wyniki 2026</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>
            % zwrotu na rachunku
          </span>
        </div>

        <div className="monthly-bars">
          {months.map((m) => (
            <div key={m.name} className="monthly-bar-wrap">
              {/* Value label */}
              <div className="monthly-value" style={{
                color: m.pct === null
                  ? 'transparent'
                  : m.pct >= 0 ? 'var(--cyan)' : '#ff2d78',
              }}>
                {m.pct !== null ? `${m.pct > 0 ? '+' : ''}${m.pct}%` : '—'}
              </div>

              {/* Bar */}
              <div className="monthly-bar-track">
                {m.pct !== null ? (
                  <div
                    className="monthly-bar-fill"
                    style={{
                      height: `${Math.abs(m.pct) / maxAbs * 100}%`,
                      background: m.pct >= 0
                        ? 'linear-gradient(to top, rgba(0,245,212,0.8), rgba(0,245,212,0.2))'
                        : 'linear-gradient(to top, rgba(255,45,120,0.8), rgba(255,45,120,0.2))',
                      alignSelf: 'flex-end',
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: m.active ? '4px' : '2px',
                    background: m.active ? 'rgba(0,245,212,0.3)' : 'rgba(255,255,255,0.06)',
                    alignSelf: 'flex-end', borderRadius: 1,
                  }} />
                )}
              </div>

              {/* Month name */}
              <div className="monthly-name" style={{
                color: m.active ? 'var(--cyan)' : m.pct !== null ? 'var(--muted)' : '#2a3a4a',
              }}>
                {m.name}
                {m.active && <span style={{ display: 'block', fontSize: '0.45rem', letterSpacing: '1px', marginTop: 2 }}>LIVE</span>}
              </div>
            </div>
          ))}
        </div>

        <p className="wyniki-disclaimer">
          * Wyniki historyczne nie gwarantują przyszłych zwrotów. Trading wiąże się z ryzykiem utraty
          kapitału. Dane pokazują wyniki własnego rachunku — nie są to wyniki zarządzanego funduszu.
        </p>
      </div>
    </section>
  );
}
