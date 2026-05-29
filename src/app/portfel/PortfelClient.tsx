'use client';

import { useState } from 'react';

const C = {
  white:  'var(--surface)',
  bg:     'var(--bg)',
  text:   'var(--text)',
  sub:    'var(--muted)',
  label:  'var(--muted)',
  border: 'var(--border)',
  gold:   '#c9a227',
  green:  '#16a34a',
  red:    '#dc2626',
  blue:   '#2563eb',
};

/* ── DANE PORTFELA ────────────────────────────────────────────────── */
const HOLDINGS = [
  {
    ticker: 'AMZN',
    name: 'Amazon.com Inc.',
    type: 'Akcje',
    buyDate: 'Sie 2024 - Kwi 2026',
    buyPrice: 213.89,
    currentPrice: 265.29,
    shares: 20.14,
    currency: 'USD',
    broker: 'NASDAQ',
    note: 'DCA - 800 zł co miesiąc przez 21 miesięcy. Średnia cena kupna $213,89. Razem 20,14 ułamkowych udziałów.',
  },
  {
    ticker: 'PCE',
    name: 'Azoty Police S.A.',
    type: 'Akcje',
    buyDate: '8 Kwi 2026',
    buyPrice: 7.50,
    currentPrice: 7.82,
    shares: 1173,
    currency: 'PLN',
    broker: 'GPW',
    note: 'Zakłady Chemiczne Police - spółka z grupy Azoty. 8 800 zł zainwestowane.',
  },
  {
    ticker: 'EAT',
    name: 'AmRest Holdings SE',
    type: 'Akcje',
    buyDate: '15 Maj 2026',
    buyPrice: 10.30,
    currentPrice: 10.60,
    shares: 485,
    currency: 'PLN',
    broker: 'GPW',
    note: 'Wejście przy wsparciu. Sektor restauracyjny - KFC, Burger King, Pizza Hut w CEE.',
  },
  {
    ticker: 'MDV',
    name: 'Modivo S.A.',
    type: 'Akcje',
    buyDate: '9-16 Kwi 2026',
    buyPrice: 88.59,
    currentPrice: 80.68,
    shares: 140,
    currency: 'PLN',
    broker: 'GPW',
    note: '3 wejścia: 81 szt. po 86 zł (9 kwi), 38 szt. po 91 zł (14 kwi), 21 szt. po 94,20 zł (16 kwi). Średnia 88,59 zł.',
  },
];

const UPDATES = [
  {
    date: '15 Maj 2026',
    action: 'Kupno AmRest (EAT) - 485 szt. po 10,30 zł, razem 4 995 zł',
    why: 'Kurs po -35% rok do roku, wycena blisko historycznych minimów. Spółka zapowiedziała wejście Taco Bell do Polski w Q4 2026 we współpracy z AmRest - potencjalny katalizator. Zakup kontrariański przy słabych wynikach Q1.',
  },
  {
    date: '9-16 Kwi 2026',
    action: 'Budowanie pozycji Modivo (MDV) - 140 szt. w 3 transzach, średnia 88,59 zł, razem 12 402 zł',
    why: 'Akcje po -64% rok do roku mimo poprawy wyników - zysk netto wzrósł z 78,5 mln do 118,2 mln PLN kwartał do kwartału. Odpis 155,7 mln PLN na Worldbox wyczyścił bilans. Kupno w transzach bo duża zmienność.',
  },
  {
    date: '8 Kwi 2026',
    action: 'Kupno Azoty Police (PCE) - 1 173 szt. po 7,50 zł, razem 8 797 zł',
    why: 'Kilka dni po Nadzwyczajnym Walnym Zgromadzeniu (2 kwi 2026). Kurs przy wieloletnich minimach, spółka przeszła restrukturyzację. Producent nawozów i dwutlenku tytanu - zależny od cen gazu, które zaczęły sprzyjać.',
  },
  {
    date: 'Sie 2024 - teraz',
    action: 'Amazon DCA - 800 zł co miesiąc, 21 miesięcy, średnia $213,89, łącznie 20,14 udziałów',
    why: 'Regularny DCA w największego sprzedawcę e-commerce na świecie i lidera chmury (AWS). Kupuję niezależnie od ceny co miesiąc - nie próbuję wybierać dołków.',
  },
];

const TYPE_COLOR: Record<string, string> = {
  'ETF':       C.blue,
  'Akcje':     C.gold,
  'Obligacje': '#7c3aed',
};

export default function PortfelClient() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const EUR_PLN = 4.22;
  const USD_PLN = 3.88;

  function toPLN(value: number, currency: string) {
    if (currency === 'EUR') return value * EUR_PLN;
    if (currency === 'USD') return value * USD_PLN;
    return value;
  }

  const holdings = HOLDINGS.map((h) => {
    const invested  = toPLN(h.buyPrice * h.shares, h.currency);
    const current   = toPLN(h.currentPrice * h.shares, h.currency);
    const pnl       = current - invested;
    const pnlPct    = ((h.currentPrice - h.buyPrice) / h.buyPrice) * 100;
    return { ...h, invested, current, pnl, pnlPct };
  });

  const totalInvested = holdings.reduce((s, h) => s + h.invested, 0);
  const totalCurrent  = holdings.reduce((s, h) => s + h.current, 0);
  const totalPnl      = totalCurrent - totalInvested;
  const totalPnlPct   = (totalPnl / totalInvested) * 100;

  const fmt = (n: number) =>
    n.toLocaleString('pl-PL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const byType: Record<string, number> = {};
  holdings.forEach((h) => {
    byType[h.type] = (byType[h.type] ?? 0) + h.current;
  });

  return (
    <main style={{ minHeight: '80vh', padding: '120px 24px 80px', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* Header */}
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', letterSpacing: '3px', color: C.gold, textTransform: 'uppercase', marginBottom: 12 }}>
          Transparentność
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: C.text, marginBottom: 12, lineHeight: 1.1 }}>
          Mój portfel
        </h1>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: C.text, marginBottom: 48, lineHeight: 1.7, maxWidth: 560 }}>
          Pełna transparentność - co kupuję, kiedy, za ile i dlaczego. Bez ściemy.
          Aktualizuję co miesiąc.
        </p>

        {/* Statystyki */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Wartość portfela', value: `${fmt(totalCurrent)} PLN`, sub: null },
            { label: 'Zainwestowano',    value: `${fmt(totalInvested)} PLN`, sub: null },
            { label: 'Zysk / strata',   value: `${totalPnl >= 0 ? '+' : ''}${fmt(totalPnl)} PLN`, sub: `${totalPnlPct >= 0 ? '+' : ''}${totalPnlPct.toFixed(1)}%`, color: totalPnl >= 0 ? C.green : C.red },
          ].map((s, i) => (
            <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.58rem', letterSpacing: '2px', color: C.text, textTransform: 'uppercase', marginBottom: 8 }}>
                {s.label}
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', color: s.color ?? C.text, margin: 0, lineHeight: 1 }}>
                {s.value}
              </p>
              {s.sub && (
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', color: s.color, margin: '4px 0 0', fontWeight: 700 }}>
                  {s.sub}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Alokacja */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px 24px', marginBottom: 32 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.58rem', letterSpacing: '2px', color: C.text, textTransform: 'uppercase', marginBottom: 16 }}>
            Alokacja
          </p>
          <div style={{ display: 'flex', gap: 4, height: 10, borderRadius: 8, overflow: 'hidden', marginBottom: 14 }}>
            {Object.entries(byType).map(([type, val]) => (
              <div key={type} style={{ flex: val / totalCurrent, background: TYPE_COLOR[type], borderRadius: 4 }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {Object.entries(byType).map(([type, val]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: TYPE_COLOR[type], flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: C.text }}>
                  {type} <span style={{ fontWeight: 700 }}>{((val / totalCurrent) * 100).toFixed(0)}%</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pozycje */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', marginBottom: 32 }}>
          <div style={{ padding: '22px 28px', borderBottom: `1px solid ${C.border}` }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: C.text, margin: 0 }}>
              Pozycje
            </p>
          </div>

          {holdings.map((h, i) => {
            const isOpen = expanded === h.ticker;
            return (
              <div key={h.ticker}>
                <div
                  onClick={() => setExpanded(isOpen ? null : h.ticker)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto auto',
                    alignItems: 'center',
                    gap: 20,
                    padding: '20px 28px',
                    borderBottom: i < holdings.length - 1 || isOpen ? `1px solid ${C.border}` : 'none',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    background: isOpen ? 'var(--surface2)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (!isOpen) (e.currentTarget as HTMLElement).style.background = 'var(--surface2)'; }}
                  onMouseLeave={e => { if (!isOpen) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  {/* Lewa strona */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                    <div style={{
                      width: 46, height: 46, borderRadius: 10, flexShrink: 0,
                      background: TYPE_COLOR[h.type] + '20',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontSize: '0.7rem', fontWeight: 700,
                      color: TYPE_COLOR[h.type],
                    }}>
                      {h.type === 'ETF' ? 'ETF' : h.type === 'Obligacje' ? 'OBL' : h.ticker.slice(0, 3)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: C.text, margin: '0 0 2px' }}>
                        {h.ticker}
                      </p>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.88rem', color: C.text, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {h.name}
                      </p>
                    </div>
                  </div>

                  {/* Data / sztuki */}
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.88rem', fontWeight: 600, color: C.text, margin: '0 0 2px' }}>{h.buyDate}</p>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: C.text, margin: 0 }}>{h.shares} szt.</p>
                  </div>

                  {/* Wartość */}
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, color: C.text, margin: '0 0 2px' }}>
                      {fmt(h.current)} PLN
                    </p>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', color: C.text, margin: 0 }}>
                      zainw. {fmt(h.invested)}
                    </p>
                  </div>

                  {/* P&L */}
                  <div style={{ textAlign: 'right', minWidth: 80 }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: h.pnl >= 0 ? C.green : C.red, margin: '0 0 2px' }}>
                      {h.pnlPct >= 0 ? '+' : ''}{h.pnlPct.toFixed(1)}%
                    </p>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', fontWeight: 600, color: h.pnl >= 0 ? C.green : C.red, margin: 0 }}>
                      {h.pnl >= 0 ? '+' : ''}{fmt(h.pnl)} PLN
                    </p>
                  </div>
                </div>

                {/* Rozwinięcie */}
                {isOpen && (
                  <div style={{ padding: '20px 28px 24px', background: 'var(--surface2)', borderBottom: i < holdings.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: C.text, margin: '0 0 18px', lineHeight: 1.7 }}>
                      {h.note}
                    </p>
                    <div style={{ display: 'flex', gap: 36, flexWrap: 'wrap' }}>
                      {[
                        { k: 'Data kupna', v: h.buyDate },
                        { k: 'Cena kupna', v: `${h.buyPrice} ${h.currency}` },
                        { k: 'Giełda', v: h.broker },
                        { k: 'Waluta', v: h.currency },
                      ].map(({ k, v }) => (
                        <div key={k}>
                          <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.78rem', color: C.text, margin: '0 0 3px' }}>{k}</p>
                          <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, color: C.text, margin: 0 }}>{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Dziennik zmian */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', marginBottom: 48 }}>
          <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${C.border}` }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: C.text, margin: 0 }}>
              Dziennik zmian
            </p>
          </div>
          {UPDATES.map((u, i) => (
            <div key={i} style={{
              padding: '22px 24px',
              borderBottom: i < UPDATES.length - 1 ? `1px solid ${C.border}` : 'none',
            }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, color: C.gold, margin: '0 0 8px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                {u.date}
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: C.text, margin: '0 0 10px', lineHeight: 1.3 }}>
                {u.action}
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.88rem', color: C.text, margin: 0, lineHeight: 1.6 }}>
                {u.why}
              </p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', color: C.text, lineHeight: 1.7, textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
          To nie jest rekomendacja inwestycyjna. Pokazuję co sam robię - każdy podejmuje własne decyzje.
        </p>

      </div>
    </main>
  );
}
