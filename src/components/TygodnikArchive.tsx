'use client';

import { useState } from 'react';

// ─────────────────────────────────────────────────────
// AKTUALIZUJ CO TYDZIEŃ — dodaj nowy wpis na górę tablicy
// ─────────────────────────────────────────────────────
const WEEKLY_DATA = [
  // → dodawaj nowe tygodnie na górze tej tablicy (co piątek)
  {
    week: 'Tydzień 01',
    dates: '09.03 – 14.03.2026',
    result: '+4.17%',
    pnl: '+1 041 zł',
    trades: 16,
    winRate: '100%',
    comment: '',
    positive: true,
  },
];

export default function TygodnikArchive() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [year, setYear] = useState('2026');

  const positive = WEEKLY_DATA.filter(w => w.positive).length;
  const negative = WEEKLY_DATA.filter(w => !w.positive).length;

  return (
    <section className="tygodnik-section">
      <div className="section-label">// archiwum wyników</div>
      <h1 className="section-title reveal">
        <span aria-hidden="true">DZIENNIK <span className="gradient-text-cp">TYGODNIOWY</span></span>
        <span className="seo-only">Archiwum tygodniowych wyników tradingowych 2026 | NysethTrading</span>
      </h1>
      <p className="tygodnik-intro reveal">
        Każdy tydzień bez wyjątków — zyski i straty. Pełna transparentność od pierwszego tygodnia 2026.
      </p>

      {/* Year selector */}
      <div className="tygodnik-year-nav reveal">
        {['2026'].map(y => (
          <button
            key={y}
            className={`tygodnik-year-btn${year === y ? ' active' : ''}`}
            onClick={() => setYear(y)}
          >
            {y}
          </button>
        ))}
      </div>

      {/* Summary bar */}
      <div className="tygodnik-summary reveal">
        <div className="tygodnik-sum-stat">
          <span className="tygodnik-sum-val">{WEEKLY_DATA.length}</span>
          <span className="tygodnik-sum-label">Tygodni</span>
        </div>
        <div className="tygodnik-sum-divider" />
        <div className="tygodnik-sum-stat">
          <span className="tygodnik-sum-val" style={{ color: 'var(--cyan)' }}>{positive}</span>
          <span className="tygodnik-sum-label">Zielonych</span>
        </div>
        <div className="tygodnik-sum-divider" />
        <div className="tygodnik-sum-stat">
          <span className="tygodnik-sum-val" style={{ color: 'var(--pink)' }}>{negative}</span>
          <span className="tygodnik-sum-label">Czerwonych</span>
        </div>
        <div className="tygodnik-sum-divider" />
        <div className="tygodnik-sum-stat">
          <span className="tygodnik-sum-val" style={{ color: 'var(--cyan)' }}>
            {WEEKLY_DATA.reduce((s, w) => s + parseFloat(w.result), 0).toFixed(1)}%
          </span>
          <span className="tygodnik-sum-label">Łącznie {year}</span>
        </div>
      </div>

      {/* Table */}
      <div className="tygodnik-table-wrap reveal">
        {/* Header */}
        <div className="tygodnik-row tygodnik-head">
          <div className="tygodnik-col tygodnik-col-week">Tydzień</div>
          <div className="tygodnik-col tygodnik-col-result">Wynik</div>
          <div className="tygodnik-col tygodnik-col-pnl">P&L</div>
          <div className="tygodnik-col tygodnik-col-trades">Transakcje</div>
          <div className="tygodnik-col tygodnik-col-wr">Win Rate</div>
          <div className="tygodnik-col tygodnik-col-expand" />
        </div>

        {/* Rows */}
        {WEEKLY_DATA.map((w) => (
          <div key={w.week}>
            <div
              className={`tygodnik-row${expanded === w.week ? ' tygodnik-row-open' : ''}`}
              onClick={() => setExpanded(expanded === w.week ? null : w.week)}
            >
              <div className="tygodnik-col tygodnik-col-week">
                <span className="tygodnik-week-label">{w.week}</span>
                <span className="tygodnik-dates">{w.dates}</span>
              </div>
              <div className="tygodnik-col tygodnik-col-result">
                <span
                  className="tygodnik-result"
                  style={{ color: w.positive ? 'var(--cyan)' : 'var(--pink)' }}
                >
                  {w.result}
                </span>
              </div>
              <div className="tygodnik-col tygodnik-col-pnl">
                <span
                  className="tygodnik-pnl"
                  style={{ color: w.positive ? 'var(--cyan)' : 'var(--pink)' }}
                >
                  {w.pnl}
                </span>
              </div>
              <div className="tygodnik-col tygodnik-col-trades">
                <span className="tygodnik-trades">{w.trades}</span>
              </div>
              <div className="tygodnik-col tygodnik-col-wr">
                <span className="tygodnik-wr">{w.winRate}</span>
              </div>
              <div className="tygodnik-col tygodnik-col-expand">
                <span className="tygodnik-expand-icon">
                  {expanded === w.week ? '−' : '+'}
                </span>
              </div>
            </div>

            {/* Expanded comment */}
            {expanded === w.week && (
              <div className="tygodnik-comment">
                <div className="tygodnik-comment-label">// komentarz</div>
                <p className="tygodnik-comment-text">{w.comment}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="tygodnik-disclaimer">
        * Wyniki pokazują zmiany procentowe na rachunku własnym. Dane aktualizowane co poniedziałek.
        Trading wiąże się z ryzykiem utraty kapitału.
      </p>
    </section>
  );
}
