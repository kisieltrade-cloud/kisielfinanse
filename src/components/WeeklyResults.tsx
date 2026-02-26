'use client';

import { useState } from 'react';

// ─────────────────────────────────────────────────────────────
// TUTAJ DODAJESZ SWOJE WYNIKI CO TYDZIEŃ
// Skopiuj ostatni obiekt, zmień dane i zapisz plik → git push
// ─────────────────────────────────────────────────────────────
export const WEEKLY_RESULTS = [
  {
    week: 'Tydzień 8',
    dateRange: '17–21 lut 2025',
    pnl: '+$1,240',
    pct: '+3.1%',
    trades: 12,
    winRate: '75%',
    markets: ['Forex', 'Krypto'],
    highlight: 'Mocny setup na EUR/USD + long BTC po wybiciu',
    positive: true,
  },
  {
    week: 'Tydzień 7',
    dateRange: '10–14 lut 2025',
    pnl: '+$860',
    pct: '+2.2%',
    trades: 9,
    winRate: '67%',
    markets: ['Indeksy', 'Akcje'],
    highlight: 'Dobre wejście na S&P500, NVDA long przy wsparciu',
    positive: true,
  },
  {
    week: 'Tydzień 6',
    dateRange: '3–7 lut 2025',
    pnl: '-$320',
    pct: '-0.8%',
    trades: 11,
    winRate: '45%',
    markets: ['Forex', 'Krypto'],
    highlight: 'Trudny tydzień — rynek bez trendu, za dużo szumu',
    positive: false,
  },
  {
    week: 'Tydzień 5',
    dateRange: '27–31 sty 2025',
    pnl: '+$2,100',
    pct: '+5.4%',
    trades: 8,
    winRate: '88%',
    markets: ['Krypto', 'Indeksy'],
    highlight: 'Najlepszy tydzień — BTC breakout + short NAS100',
    positive: true,
  },
  {
    week: 'Tydzień 4',
    dateRange: '20–24 sty 2025',
    pnl: '+$540',
    pct: '+1.4%',
    trades: 14,
    winRate: '64%',
    markets: ['Forex', 'Akcje'],
    highlight: 'Spokojny tydzień, konsekwentne małe zyski',
    positive: true,
  },
  {
    week: 'Tydzień 3',
    dateRange: '13–17 sty 2025',
    pnl: '-$180',
    pct: '-0.5%',
    trades: 7,
    winRate: '43%',
    markets: ['Forex'],
    highlight: 'News trading — zatrzymałem się po 3 stratach z rzędu',
    positive: false,
  },
  {
    week: 'Tydzień 2',
    dateRange: '6–10 sty 2025',
    pnl: '+$1,580',
    pct: '+4.1%',
    trades: 10,
    winRate: '80%',
    markets: ['Krypto', 'Indeksy', 'Akcje'],
    highlight: 'Świetny początek roku — ETH i DAX zgodnie z planem',
    positive: true,
  },
  {
    week: 'Tydzień 1',
    dateRange: '2–3 sty 2025',
    pnl: '+$420',
    pct: '+1.1%',
    trades: 4,
    winRate: '75%',
    markets: ['Forex', 'Krypto'],
    highlight: 'Krótki tydzień startowy, ostrożne wejścia',
    positive: true,
  },
];

const MARKET_COLORS: Record<string, string> = {
  Forex: 'var(--cyan)',
  Krypto: 'var(--purple)',
  Akcje: 'var(--yellow)',
  Indeksy: 'var(--pink)',
};

export default function WeeklyResults() {
  const [expanded, setExpanded] = useState<number | null>(0);
  const [filter, setFilter] = useState<string>('Wszystkie');

  const markets = ['Wszystkie', 'Forex', 'Krypto', 'Akcje', 'Indeksy'];

  const filtered =
    filter === 'Wszystkie'
      ? WEEKLY_RESULTS
      : WEEKLY_RESULTS.filter((r) => r.markets.includes(filter));

  // Summary stats
  const totalPnl = WEEKLY_RESULTS.reduce((sum, r) => {
    const val = parseFloat(r.pnl.replace(/[^0-9.-]/g, '')) * (r.positive ? 1 : -1);
    return sum + val;
  }, 0);
  const greenWeeks = WEEKLY_RESULTS.filter((r) => r.positive).length;
  const totalTrades = WEEKLY_RESULTS.reduce((sum, r) => sum + r.trades, 0);

  return (
    <section className="weekly-section" id="wyniki-tygodniowe">
      <div className="section-label">// tygodniowy dziennik</div>
      <h2 className="section-title reveal">
        <span aria-hidden="true">WYNIKI<br /><span className="gradient-text-cp">TYGODNIOWE</span></span>
        <span className="seo-only">Wyniki tradingowe tygodniowe — Forex, Krypto, Futures | NysethTrading</span>
      </h2>

      {/* Summary bar */}
      <div className="weekly-summary reveal">
        <div className="weekly-summary-item">
          <span className="weekly-summary-num" style={{ color: 'var(--cyan)' }}>
            +${totalPnl.toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </span>
          <span className="weekly-summary-label">Łączny P&L (2025)</span>
        </div>
        <div className="weekly-summary-divider" />
        <div className="weekly-summary-item">
          <span className="weekly-summary-num" style={{ color: 'var(--cyan)' }}>
            {greenWeeks}/{WEEKLY_RESULTS.length}
          </span>
          <span className="weekly-summary-label">Zielonych tygodni</span>
        </div>
        <div className="weekly-summary-divider" />
        <div className="weekly-summary-item">
          <span className="weekly-summary-num" style={{ color: 'var(--cyan)' }}>
            {totalTrades}
          </span>
          <span className="weekly-summary-label">Łączna liczba transakcji</span>
        </div>
        <div className="weekly-summary-divider" />
        <div className="weekly-summary-item">
          <span className="weekly-summary-num" style={{ color: 'var(--yellow)' }}>
            {Math.round((greenWeeks / WEEKLY_RESULTS.length) * 100)}%
          </span>
          <span className="weekly-summary-label">Skuteczność tygodni</span>
        </div>
      </div>

      {/* Market filter */}
      <div className="weekly-filters reveal">
        {markets.map((m) => (
          <button
            key={m}
            className={`chart-filter-btn${filter === m ? ' active' : ''}`}
            onClick={() => setFilter(m)}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Results list */}
      <div className="weekly-list reveal">
        {filtered.map((result, i) => (
          <div
            key={i}
            className={`weekly-row${expanded === i ? ' weekly-row-open' : ''}`}
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            {/* Row header */}
            <div className="weekly-row-header">
              <div className="weekly-row-left">
                <div
                  className="weekly-indicator"
                  style={{ background: result.positive ? 'var(--cyan)' : 'var(--pink)' }}
                />
                <div>
                  <div className="weekly-week">{result.week}</div>
                  <div className="weekly-date">{result.dateRange}</div>
                </div>
              </div>

              <div className="weekly-row-markets">
                {result.markets.map((m) => (
                  <span
                    key={m}
                    className="weekly-market-tag"
                    style={{ borderColor: MARKET_COLORS[m], color: MARKET_COLORS[m] }}
                  >
                    {m}
                  </span>
                ))}
              </div>

              <div className="weekly-row-stats">
                <div className="weekly-stat">
                  <span className="weekly-stat-val">{result.trades}</span>
                  <span className="weekly-stat-label">Transakcji</span>
                </div>
                <div className="weekly-stat">
                  <span className="weekly-stat-val">{result.winRate}</span>
                  <span className="weekly-stat-label">Win Rate</span>
                </div>
              </div>

              <div className="weekly-row-right">
                <div
                  className="weekly-pct"
                  style={{ color: result.positive ? 'var(--cyan)' : 'var(--pink)' }}
                >
                  {result.pct}
                </div>
                <div
                  className="weekly-pnl"
                  style={{ color: result.positive ? 'var(--cyan)' : 'var(--pink)' }}
                >
                  {result.pnl}
                </div>
              </div>

              <div className="weekly-chevron">{expanded === i ? '↑' : '↓'}</div>
            </div>

            {/* Expanded detail */}
            {expanded === i && (
              <div className="weekly-row-detail">
                <div className="weekly-highlight">
                  <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    Komentarz tygodnia
                  </span>
                  <p style={{ marginTop: 8, color: 'var(--text)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                    {result.highlight}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <p
        style={{
          marginTop: 24,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          color: 'var(--muted)',
          lineHeight: 1.6,
        }}
      >
        * Wyniki własnego rachunku. Trading wiąże się z ryzykiem utraty kapitału.
        Dane mają charakter informacyjny i nie stanowią doradztwa inwestycyjnego.
      </p>
    </section>
  );
}
