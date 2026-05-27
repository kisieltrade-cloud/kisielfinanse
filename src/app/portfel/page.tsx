'use client';

import { useState } from 'react';

const C = {
  white:  '#ffffff',
  bg:     '#f7f8fa',
  text:   '#1a2230',
  sub:    '#3d4f63',
  label:  '#8a9ab0',
  border: '#e2e8f0',
  gold:   '#b8960a',
  green:  '#16a34a',
  red:    '#dc2626',
  blue:   '#2563eb',
};

/* ── DANE PORTFELA ────────────────────────────────────────────────── */
const HOLDINGS = [
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
    note: 'Wejscie przy wsparciu. Sektor restauracyjny - KFC, Burger King, Pizza Hut w CEE.',
  },
];

const UPDATES = [
  {
    date: '15 Maj 2026',
    text: 'Kupno 485 akcji AmRest po 10,30 zł. Laczna kwota 4995,50 zł.',
  },
];

const TYPE_COLOR: Record<string, string> = {
  'ETF':       C.blue,
  'Akcje':     C.gold,
  'Obligacje': '#7c3aed',
};

export default function PortfelPage() {
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
    <main style={{ minHeight: '80vh', padding: '120px 24px 80px', background: '#f7f8fa' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* Header */}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '3px', color: C.gold, textTransform: 'uppercase', marginBottom: 12 }}>
          Transparentnosc
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: C.text, marginBottom: 12, lineHeight: 1.1 }}>
          Mój portfel
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: C.sub, marginBottom: 48, lineHeight: 1.7, maxWidth: 560 }}>
          Pelna transparentnosc - co kupuje, kiedy, za ile i dlaczego. Bez sciemy.
          Aktualizuje co miesiac.
        </p>

        {/* Statystyki */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Wartość portfela', value: `${fmt(totalCurrent)} PLN`, sub: null },
            { label: 'Zainwestowano',    value: `${fmt(totalInvested)} PLN`, sub: null },
            { label: 'Zysk / strata',   value: `${totalPnl >= 0 ? '+' : ''}${fmt(totalPnl)} PLN`, sub: `${totalPnlPct >= 0 ? '+' : ''}${totalPnlPct.toFixed(1)}%`, color: totalPnl >= 0 ? C.green : C.red },
          ].map((s, i) => (
            <div key={i} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '2px', color: C.label, textTransform: 'uppercase', marginBottom: 8 }}>
                {s.label}
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', color: s.color ?? C.text, margin: 0, lineHeight: 1 }}>
                {s.value}
              </p>
              {s.sub && (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: s.color, margin: '4px 0 0', fontWeight: 700 }}>
                  {s.sub}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Alokacja */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px 24px', marginBottom: 32 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '2px', color: C.label, textTransform: 'uppercase', marginBottom: 16 }}>
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
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: C.text }}>
                  {type} <span style={{ fontWeight: 700 }}>{((val / totalCurrent) * 100).toFixed(0)}%</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pozycje */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', marginBottom: 32 }}>
          <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${C.border}` }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '2px', color: C.label, textTransform: 'uppercase', margin: 0 }}>
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
                    gap: 16,
                    padding: '16px 24px',
                    borderBottom: i < holdings.length - 1 || isOpen ? `1px solid ${C.border}` : 'none',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    background: isOpen ? '#f0f4f8' : 'transparent',
                  }}
                  onMouseEnter={e => { if (!isOpen) (e.currentTarget as HTMLElement).style.background = '#f8fafc'; }}
                  onMouseLeave={e => { if (!isOpen) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  {/* Lewa strona */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                      background: TYPE_COLOR[h.type] + '20',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700,
                      color: TYPE_COLOR[h.type],
                    }}>
                      {h.type === 'ETF' ? 'ETF' : h.type === 'Akcje' ? 'PL' : 'OBL'}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: C.text, margin: 0 }}>
                        {h.ticker}
                      </p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: C.sub, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {h.name}
                      </p>
                    </div>
                  </div>

                  {/* Data / sztuki */}
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: C.sub, margin: 0 }}>{h.buyDate}</p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: C.text, margin: 0, fontWeight: 600 }}>{h.shares} szt.</p>
                  </div>

                  {/* Wartość */}
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: C.text, margin: 0, fontWeight: 700 }}>
                      {fmt(h.current)} PLN
                    </p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: C.sub, margin: 0 }}>
                      zainw. {fmt(h.invested)}
                    </p>
                  </div>

                  {/* P&L */}
                  <div style={{ textAlign: 'right', minWidth: 64 }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700, color: h.pnl >= 0 ? C.green : C.red, margin: 0 }}>
                      {h.pnlPct >= 0 ? '+' : ''}{h.pnlPct.toFixed(1)}%
                    </p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: h.pnl >= 0 ? C.green : C.red, margin: 0, fontWeight: 600 }}>
                      {h.pnl >= 0 ? '+' : ''}{fmt(h.pnl)} PLN
                    </p>
                  </div>
                </div>

                {/* Rozwinięcie */}
                {isOpen && (
                  <div style={{ padding: '16px 24px 18px', background: '#f0f4f8', borderBottom: i < holdings.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '1.5px', color: C.label, textTransform: 'uppercase', marginBottom: 8 }}>
                      Dlaczego
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: C.text, margin: '0 0 12px', lineHeight: 1.7 }}>
                      {h.note}
                    </p>
                    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                      {[
                        { k: 'Broker', v: h.broker },
                        { k: 'Waluta', v: h.currency },
                        { k: 'Cena kupna', v: `${h.buyPrice} ${h.currency}` },
                      ].map(({ k, v }) => (
                        <span key={k} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: C.sub }}>
                          {k}: <span style={{ color: C.text, fontWeight: 700 }}>{v}</span>
                        </span>
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
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '2px', color: C.label, textTransform: 'uppercase', margin: 0 }}>
              Dziennik zmian
            </p>
          </div>
          {UPDATES.map((u, i) => (
            <div key={i} style={{
              padding: '18px 24px',
              borderBottom: i < UPDATES.length - 1 ? `1px solid ${C.border}` : 'none',
              display: 'grid',
              gridTemplateColumns: '90px 1fr',
              gap: 16,
              alignItems: 'start',
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: C.gold, paddingTop: 2, fontWeight: 700 }}>
                {u.date}
              </span>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: C.text, margin: 0, lineHeight: 1.7 }}>
                {u.text}
              </p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: C.sub, lineHeight: 1.7, textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
          To nie jest rekomendacja inwestycyjna. Pokazuję co sam robię - każdy podejmuje własne decyzje.
        </p>

      </div>
    </main>
  );
}
