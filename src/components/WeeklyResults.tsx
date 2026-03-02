'use client';

import { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TUTAJ DODAJESZ SWOJE WYNIKI CO TYDZIEŃ
// Skopiuj blok poniżej, uzupełnij danymi i zapisz → git push
//
// Przykład:
// {
//   week: 'Tydzień 1',
//   dateRange: '3–7 mar 2026',
//   pnl: '+1 240 zł',
//   pct: '+2.4%',
//   trades: 8,
//   winRate: '75%',
//   markets: ['Forex', 'Krypto'],   // Forex | Krypto | Akcje | Indeksy
//   highlight: 'Twój komentarz do tygodnia',
//   positive: true,
// },
// ─────────────────────────────────────────────────────────────────────────────

export const WEEKLY_RESULTS: Array<{
  week: string;
  dateRange: string;
  pnl: string;
  pct: string;
  trades: number;
  winRate: string;
  markets: string[];
  highlight: string;
  positive: boolean;
}> = [
  // ← Dodaj tutaj pierwszy tydzień gdy będzie gotowy
];

// ─── Podsumowanie — wyliczane automatycznie ──────────────────────────────────
function calcSummary() {
  if (WEEKLY_RESULTS.length === 0) return null;
  const greenWeeks = WEEKLY_RESULTS.filter(w => w.positive).length;
  const totalTrades = WEEKLY_RESULTS.reduce((s, w) => s + w.trades, 0);
  return { greenWeeks, totalWeeks: WEEKLY_RESULTS.length, totalTrades };
}

const MARKET_COLORS: Record<string, string> = {
  Forex:   '#00f5d4',
  Krypto:  '#b14aed',
  Akcje:   '#f5c518',
  Indeksy: '#ff2d78',
};

export default function WeeklyResults() {
  const [filter, setFilter] = useState<'Wszystkie' | 'Forex' | 'Krypto' | 'Akcje' | 'Indeksy'>('Wszystkie');
  const [expanded, setExpanded] = useState<string | null>(null);
  const summary = calcSummary();

  const filtered = filter === 'Wszystkie'
    ? WEEKLY_RESULTS
    : WEEKLY_RESULTS.filter(w => w.markets.includes(filter));

  return (
    <section className="weekly-section" id="wyniki-tygodniowe">
      <div className="section-label">// archiwum tygodniowe</div>
      <h2 className="section-title reveal">
        WYNIKI
        <br />
        <span className="gradient-text-cp">TYGODNIOWE</span>
      </h2>

      {/* Summary cards */}
      <div className="weekly-summary reveal">
        {summary ? (
          <>
            <div className="weekly-sum-card">
              <div className="weekly-sum-label">ŁĄCZNA LICZBA TRANSAKCJI</div>
              <div className="weekly-sum-value">{summary.totalTrades}</div>
            </div>
            <div className="weekly-sum-card">
              <div className="weekly-sum-label">ZIELONYCH TYGODNI</div>
              <div className="weekly-sum-value" style={{ color: 'var(--cyan)' }}>
                {summary.greenWeeks}/{summary.totalWeeks}
              </div>
            </div>
            <div className="weekly-sum-card">
              <div className="weekly-sum-label">SKUTECZNOŚĆ TYGODNI</div>
              <div className="weekly-sum-value" style={{ color: '#f5c518' }}>
                {Math.round(summary.greenWeeks / summary.totalWeeks * 100)}%
              </div>
            </div>
          </>
        ) : (
          <div style={{
            gridColumn: '1 / -1',
            fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
            color: 'var(--muted)', padding: '32px 0', textAlign: 'center',
          }}>
            // challenge startuje w marcu 2026 — pierwsze wyniki pojawią się po zamknięciu tygodnia
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="weekly-filters reveal">
        {(['Wszystkie', 'Forex', 'Krypto', 'Akcje', 'Indeksy'] as const).map(f => (
          <button
            key={f}
            className={`weekly-filter-btn${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
            style={filter === f && f !== 'Wszystkie' ? { borderColor: MARKET_COLORS[f], color: MARKET_COLORS[f] } : {}}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Weekly list */}
      <div className="weekly-list reveal">
        {filtered.length === 0 ? (
          <div style={{
            padding: '60px 32px', textAlign: 'center',
            fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)',
            border: '1px solid var(--border)',
          }}>
            {WEEKLY_RESULTS.length === 0
              ? '// Brak wyników — challenge startuje w marcu 2026'
              : `// Brak wyników dla kategorii "${filter}"`
            }
          </div>
        ) : (
          filtered.map((w) => (
            <div key={w.week} className={`weekly-row${expanded === w.week ? ' expanded' : ''}`}>
              <div
                className="weekly-row-main"
                onClick={() => setExpanded(expanded === w.week ? null : w.week)}
              >
                <div className="weekly-row-left">
                  <div className="weekly-row-accent" style={{ background: w.positive ? 'var(--cyan)' : '#ff2d78' }} />
                  <div>
                    <div className="weekly-week-name">{w.week}</div>
                    <div className="weekly-date">{w.dateRange}</div>
                  </div>
                  <div className="weekly-markets">
                    {w.markets.map(m => (
                      <span key={m} className="market-tag" style={{ borderColor: MARKET_COLORS[m], color: MARKET_COLORS[m] }}>{m.toUpperCase()}</span>
                    ))}
                  </div>
                </div>
                <div className="weekly-row-right">
                  <span className="weekly-trades">{w.trades} <span>transakcji</span></span>
                  <span className="weekly-winrate">{w.winRate} <span>win rate</span></span>
                  <span className={`weekly-pct${w.positive ? ' positive' : ' negative'}`}>
                    {w.pct}
                    <span className="weekly-pnl">{w.pnl}</span>
                  </span>
                  <span className="weekly-expand">{expanded === w.week ? '−' : '+'}</span>
                </div>
              </div>
              {expanded === w.week && (
                <div className="weekly-detail">
                  <span className="weekly-detail-label">// komentarz tygodnia</span>
                  <p>{w.highlight}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
