'use client';

import { useState } from 'react';

// ─────────────────────────────────────────────────────
// AKTUALIZUJ CO TYDZIEŃ — dodaj nowy wpis na górę tablicy
// ─────────────────────────────────────────────────────
const WEEKLY_DATA = [
  // → dodawaj nowe tygodnie na górze tej tablicy (co piątek)
  {
    week: 'Tydzień 05',
    dates: '05.04 – 07.04.2026',
    result: '+3.97%',
    pnl: '+5 082 zł',
    trades: 56,
    winRate: '100%',
    comment: 'Tydzień skrócony — dane do wtorku 07.04. Silny ruch na US100, 100% win rate. Tydzień nadal w toku.',
    positive: true,
  },
  {
    week: 'Tydzień 04',
    dates: '30.03 – 03.04.2026',
    result: '+11.82%',
    pnl: '+13 522 zł',
    trades: 109,
    winRate: '100%',
    comment: 'Środa 02.04 najsilniejsza sesja tygodnia — ponad 8 600 zł przy 100% win rate. Dodatkowy instrument US30 i OIL.WTI. Każda sesja tygodnia zamknięta na plusie.',
    positive: true,
  },
  {
    week: 'Tydzień 03',
    dates: '23.03 – 27.03.2026',
    result: '+43.81%',
    pnl: '+34 844 zł',
    trades: 651,
    winRate: '90%',
    comment: 'Najlepszy tydzień miesiąca. Poniedziałek 23.03 przyniósł ponad 12 700 zł w jednym dniu. Każda sesja zamknięta na plusie.',
    positive: true,
  },
  {
    week: 'Tydzień 02',
    dates: '15.03 – 20.03.2026',
    result: '+35.64%',
    pnl: '+20 899 zł',
    trades: 1019,
    winRate: '88%',
    comment: 'Środa 18.03 z DE40 jako dodatkowym instrumentem. Czwartek 19.03 rekordowy dzień tygodnia — ponad 8 100 zł. Dobra płynność przez cały tydzień.',
    positive: true,
  },
  {
    week: 'Tydzień 01',
    dates: '09.03 – 13.03.2026',
    result: '+17.28%',
    pnl: '+8 641 zł',
    trades: 323,
    winRate: '99%',
    comment: 'Pierwszy tydzień challange\'u. Start 09.03 z wynikiem 100% win rate. Środa 11.03 i czwartek 12.03 najsilniejsze sesje tygodnia.',
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
