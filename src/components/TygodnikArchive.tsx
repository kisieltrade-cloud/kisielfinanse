'use client';

import { useState } from 'react';

// ─────────────────────────────────────────────────────
// AKTUALIZUJ CO TYDZIEŃ — dodaj nowy wpis na górę tablicy
// ─────────────────────────────────────────────────────
const WEEKLY_DATA = [
  {
    week: 'Tydzień 08',
    dates: '17.02 – 21.02.2026',
    result: '+3.2%',
    pnl: '+1 248 zł',
    trades: 12,
    winRate: '75%',
    comment: 'Bardzo dobry tydzień. NAS100 w silnym trendzie, większość setupów zadziałała zgodnie z planem. Jeden fałszywy sygnał na EURUSD który zatrzymał na SL.',
    positive: true,
  },
  {
    week: 'Tydzień 07',
    dates: '10.02 – 14.02.2026',
    result: '-1.4%',
    pnl: '-546 zł',
    trades: 9,
    winRate: '44%',
    comment: 'Trudny tydzień. Rynek chodził w konsolidacji bez wyraźnego kierunku. Dwa razy wchodziłem zbyt wcześnie przed wybiciem. Stop lossy zadziałały jak powinny.',
    positive: false,
  },
  {
    week: 'Tydzień 06',
    dates: '03.02 – 07.02.2026',
    result: '+5.1%',
    pnl: '+1 989 zł',
    trades: 14,
    winRate: '71%',
    comment: 'Najlepszy tydzień w tym roku. Mocny ruch na BTC po danych makro, złapałem większość trendu. S&P500 dał czysty setup na odbicie od EMA50.',
    positive: true,
  },
  {
    week: 'Tydzień 05',
    dates: '27.01 – 31.01.2026',
    result: '+2.8%',
    pnl: '+1 092 zł',
    trades: 11,
    winRate: '64%',
    comment: 'Solidny tydzień bez większych zaskoczeń. Głównie grałem trend na NAS100. Unikałem wejść w czwartek przez dane NFP — dobra decyzja, zmienność była za duża.',
    positive: true,
  },
  {
    week: 'Tydzień 04',
    dates: '20.01 – 24.01.2026',
    result: '+1.6%',
    pnl: '+624 zł',
    trades: 8,
    winRate: '63%',
    comment: 'Spokojny tydzień, mała aktywność. Rynek bez wyraźnych setupów przez pierwsze 3 dni, wchodziłem tylko czwartek i piątek. Lepiej nie handlować niż wymuszać transakcje.',
    positive: true,
  },
  {
    week: 'Tydzień 03',
    dates: '13.01 – 17.01.2026',
    result: '-2.1%',
    pnl: '-819 zł',
    trades: 13,
    winRate: '38%',
    comment: 'Zły tydzień — za dużo transakcji, za mało cierpliwości. Złamałem własną zasadę i wszedłem w 3 setupy które nie spełniały moich kryteriów. Lekcja na przyszłość.',
    positive: false,
  },
  {
    week: 'Tydzień 02',
    dates: '06.01 – 10.01.2026',
    result: '+4.3%',
    pnl: '+1 677 zł',
    trades: 10,
    winRate: '70%',
    comment: 'Mocny start roku. Krypto w silnym uptrend, BTC i ETH dały czyste setupy na pullback. Jeden duży winner na GBPUSD który zrekompensował 3 drobne straty.',
    positive: true,
  },
  {
    week: 'Tydzień 01',
    dates: '02.01 – 03.01.2026',
    result: '+1.1%',
    pnl: '+429 zł',
    trades: 5,
    winRate: '60%',
    comment: 'Skrócony tydzień — tylko 2 dni handlowe. Nowy rok, świeży start. Handlowałem bardzo ostrożnie, testując jak rynek zachowuje się po przerwie świątecznej.',
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
