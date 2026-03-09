'use client';

// ─── EDYTUJ TUTAJ CO MIESIĄC ──────────────────────────────────────────────
const START_BALANCE = 25000;

const STATS_2026 = {
  annualReturn: '+4.17%',
  annualReturnNote: 'start: marzec 2026',
  winRate: '100%',
  winRateNote: 'tydzień 01 (16 transakcji)',
  profitFactor: '∞',
  profitFactorNote: '16 winów / 0 strat',
  maxDrawdown: '0 zł (0%)',
  maxDrawdownNote: 'brak strat na zamkniętych',
};

const MONTHLY_2026: Array<{ name: string; pct: number | null; amount: number | null; active: boolean }> = [
  { name: 'STY', pct: null,  amount: null,    active: false },
  { name: 'LUT', pct: null,  amount: null,    active: false },
  { name: 'MAR', pct: 4.17,  amount: 1041.30, active: true  }, // ← aktywny miesiąc
  { name: 'KWI', pct: null,  amount: null,    active: false },
  { name: 'MAJ', pct: null,  amount: null,    active: false },
  { name: 'CZE', pct: null,  amount: null,    active: false },
  { name: 'LIP', pct: null,  amount: null,    active: false },
  { name: 'SIE', pct: null,  amount: null,    active: false },
  { name: 'WRZ', pct: null,  amount: null,    active: false },
  { name: 'PAŹ', pct: null,  amount: null,    active: false },
  { name: 'LIS', pct: null,  amount: null,    active: false },
  { name: 'GRU', pct: null,  amount: null,    active: false },
];

// ─── AKTUALNA DATA AKTUALIZACJI ──────────────────────────────────────────
const LAST_UPDATE = '09.03.2026';
const TRADED_INSTRUMENTS = 'US100, US500';
// ──────────────────────────────────────────────────────────────────────────

export default function Stats() {
  const completed = MONTHLY_2026.filter(m => m.pct !== null);
  const maxAbs = completed.length > 0
    ? Math.max(...completed.map(m => Math.abs(m.pct as number)))
    : 1;

  // Oblicz totale
  const totalPnl = completed.reduce((sum, m) => sum + (m.amount ?? 0), 0);
  const totalPct = ((totalPnl / START_BALANCE) * 100).toFixed(2);
  const totalTrades = 16; // ← aktualizuj wraz z danymi
  const totalWinRate = '100%';

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
          <div key={i} className="stat-card" style={{ borderTop: `3px solid ${s.color}` }}>
            <span className="stat-number" style={{
              background: 'none',
              WebkitTextFillColor: s.value === '—' ? 'var(--muted)' : s.color,
              color: s.value === '—' ? 'var(--muted)' : s.color,
            }}>
              {s.value}
            </span>
            <div className="stat-label">{s.label}</div>
            <div className="stat-delta">{s.note}</div>
          </div>
        ))}
      </div>

      {/* Monthly chart */}
      <div className="monthly-chart-section reveal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>Miesięczne wyniki 2026</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>% zwrotu na rachunku</span>
        </div>

        <div className="monthly-grid">
          {MONTHLY_2026.map((m) => (
            <div key={m.name} className="month-bar-wrap">
              {/* Value — % i kwota */}
              <div className="month-pct" style={{
                color: m.pct === null ? 'transparent' : m.pct >= 0 ? 'var(--cyan)' : 'var(--pink)',
                minHeight: '2.4em',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}>
                {m.pct !== null && (
                  <>
                    <span>{m.pct > 0 ? '+' : ''}{m.pct}%</span>
                    <span style={{
                      fontSize: '0.55rem',
                      opacity: 0.7,
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {m.amount !== null ? `${m.amount > 0 ? '+' : ''}${m.amount.toLocaleString('pl-PL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} zł` : ''}
                    </span>
                  </>
                )}
              </div>

              {/* Bar */}
              <div className="month-bar-track">
                {m.pct !== null ? (
                  <div
                    className={`month-bar ${m.pct >= 0 ? 'month-bar-pos' : 'month-bar-neg'}`}
                    style={{ height: `${Math.abs(m.pct) / maxAbs * 100}%` }}
                  />
                ) : (
                  <div style={{
                    width: '70%', height: m.active ? '3px' : '1px',
                    background: m.active ? 'rgba(0,245,212,0.4)' : 'rgba(255,255,255,0.06)',
                  }} />
                )}
              </div>

              {/* Name */}
              <div className="month-name" style={{
                color: m.active ? 'var(--cyan)' : m.pct !== null ? 'var(--muted)' : '#2a3a4a',
              }}>
                {m.name}
                {m.active && (
                  <span style={{ display: 'block', fontSize: '0.45rem', letterSpacing: '1px', marginTop: 2, color: 'var(--cyan)' }}>
                    LIVE
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="wyniki-disclaimer" style={{ marginTop: 24 }}>
          * Wyniki historyczne nie gwarantują przyszłych zwrotów. Trading wiąże się z ryzykiem utraty
          kapitału. Dane pokazują wyniki własnego rachunku — nie są to wyniki zarządzanego funduszu.
        </p>
      </div>

      {/* Daily summary — data zamiast "dzisiaj" */}
      <div className="reveal" style={{
        marginTop: 48,
        background: 'rgba(0,245,212,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 4,
        padding: '24px 32px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '2px' }}>
            // {LAST_UPDATE}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '2px',
            color: 'var(--cyan)', border: '1px solid rgba(0,245,212,0.3)',
            padding: '2px 10px', borderRadius: 2,
          }}>
            LIVE
          </span>
        </div>

        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'baseline' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--cyan)', letterSpacing: '1px', fontWeight: 700 }}>
              +{totalPnl.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '2px', marginTop: 4 }}>P&L</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--cyan)', letterSpacing: '1px', fontWeight: 700 }}>
              +{totalPct}%
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '2px', marginTop: 4 }}>ZWROT</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--text)', letterSpacing: '1px', fontWeight: 700 }}>
              {totalTrades}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '2px', marginTop: 4 }}>TRANSAKCJI</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--text)', letterSpacing: '1px', fontWeight: 700 }}>
              {totalWinRate}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '2px', marginTop: 4 }}>WIN RATE</div>
          </div>
        </div>

        <div style={{ marginTop: 16, fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#2a3a4a', letterSpacing: '1px' }}>
          {TRADED_INSTRUMENTS}
        </div>
      </div>
    </section>
  );
}
