'use client';

import { useState, useRef } from 'react';

interface Props {
  livePrices: Record<string, number | null>;
  liveUsdPln: number | null;
  fetchedAt: string;
}

/* ─── DATA ─────────────────────────────────────────────────────────── */
const HOLDINGS = [
  {
    ticker: 'AMZN', label: 'AMZ', name: 'Amazon.com Inc.',
    buyPrice: 213.89, fallbackPrice: 270.64,
    shares: 20.14, currency: 'USD',
    buyDate: 'Sie 2024 - Kwi 2026',
    note: 'DCA - 800 zł co miesiąc przez 21 miesięcy. Średnia cena kupna $213,89. Razem 20,14 ułamkowych udziałów.',
  },
  {
    ticker: 'PCE', label: 'PCE', name: 'Azoty Police S.A.',
    buyPrice: 7.50, fallbackPrice: 7.82,
    shares: 1173, currency: 'PLN',
    buyDate: '8 Kwi 2026',
    note: 'Zakłady Chemiczne Police - spółka z grupy Azoty. 8 800 zł zainwestowane.',
  },
  {
    ticker: 'EAT', label: 'EAT', name: 'AmRest Holdings SE',
    buyPrice: 10.30, fallbackPrice: 10.36,
    shares: 485, currency: 'PLN',
    buyDate: '15 Maj 2026',
    note: 'Wejście przy wsparciu. Sektor restauracyjny - KFC, Burger King, Pizza Hut w CEE.',
  },
  {
    ticker: 'MDV', label: 'MDV', name: 'Modivo S.A.',
    buyPrice: 88.59, fallbackPrice: 79.60,
    shares: 140, currency: 'PLN',
    buyDate: '9-16 Kwi 2026',
    note: '3 wejścia: 81 szt. po 86 zł (9 kwi), 38 szt. po 91 zł (14 kwi), 21 szt. po 94,20 zł (16 kwi). Średnia 88,59 zł.',
  },
];

const UPDATES = [
  {
    date: '15 Maj 2026',
    icon: 'cart' as const,
    action: 'Kupno AmRest (EAT) - 485 szt. po 10,30 zł, razem 4 995 zł',
    why: 'Kurs po -35% rok do roku, wycena blisko historycznych minimów. Spółka zapowiedziała wejście Taco Bell do Polski w Q4 2026 we współpracy z AmRest - potencjalny katalizator. Zakup kontrariański przy słabych wynikach Q1.',
  },
  {
    date: '9-16 Kwi 2026',
    icon: 'chart' as const,
    action: 'Budowanie pozycji Modivo (MDV) - 140 szt. w 3 transzach, średnia 88,59 zł, razem 12 402 zł',
    why: 'Akcje po -64% rok do roku mimo poprawy wyników - zysk netto wzrósł z 78,5 mln do 118,2 mln PLN kwartał do kwartału. Odpis 155,7 mln PLN na Worldbox wyczyścił bilans. Kupno w transzach bo duża zmienność.',
  },
  {
    date: '8 Kwi 2026',
    icon: 'cart' as const,
    action: 'Kupno Azoty Police (PCE) - 1 173 szt. po 7,50 zł, razem 8 797 zł',
    why: 'Kilka dni po Nadzwyczajnym Walnym Zgromadzeniu (2 kwi 2026). Kurs przy wieloletnich minimach, spółka przeszła restrukturyzację. Producent nawozów i dwutlenku tytanu - zależny od cen gazu, które zaczęły sprzyjać.',
  },
  {
    date: 'Sie 2024 - teraz',
    icon: 'amazon' as const,
    action: 'Amazon DCA - 800 zł co miesiąc, 21 miesięcy, średnia $213,89, łącznie 20,14 udziałów',
    why: 'Regularny DCA w największego sprzedawcę e-commerce na świecie i lidera chmury (AWS). Kupuję niezależnie od ceny co miesiąc - nie próbuję wybierać dołków.',
  },
];

/* ─── LOGOS ─────────────────────────────────────────────────────────── */
function LogoAmazon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="11" fill="#ffffff" stroke="#e2eaf3" strokeWidth="1" />
      <text x="24" y="31" textAnchor="middle" fontFamily="Georgia,serif" fontSize="22" fontWeight="700" fill="#0f1111">a</text>
      <path d="M12 36 Q24 43 36 36" stroke="#ff9900" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M32 36 L36 36 L36 33" stroke="#ff9900" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LogoAzoty() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="11" fill="#1a6b35" />
      <text x="24" y="21" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="7" fontWeight="600" fill="rgba(255,255,255,0.8)" letterSpacing="0.5">GRUPA</text>
      <text x="24" y="32" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="9.5" fontWeight="800" fill="#ffffff" letterSpacing="0.5">AZOTY</text>
    </svg>
  );
}

function LogoAmrest() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="11" fill="#fff" stroke="#e2eaf3" strokeWidth="1" />
      <path d="M14 34 L24 14 L34 34" stroke="#e05a1c" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.5 27 L30.5 27" stroke="#e05a1c" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="11.5" r="3" fill="#e05a1c" />
    </svg>
  );
}

function LogoModivo() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="11" fill="#fff" stroke="#e2eaf3" strokeWidth="1" />
      <text x="24" y="27" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="8.5" fontWeight="800" fill="#0a0a0a" letterSpacing="1.5">MODIVO</text>
    </svg>
  );
}

const LOGOS: Record<string, () => React.JSX.Element> = {
  AMZN: LogoAmazon,
  PCE:  LogoAzoty,
  EAT:  LogoAmrest,
  MDV:  LogoModivo,
};

/* ─── ICONS ─────────────────────────────────────────────────────────── */
function IcoTrend({ color = '#16a34a' }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M2 13 L6 8 L10 11 L16 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 4 H16 V7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IcoDatabase() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <ellipse cx="9" cy="5" rx="6" ry="2.5" stroke="#6366f1" strokeWidth="1.5" />
      <path d="M3 5v4c0 1.38 2.69 2.5 6 2.5s6-1.12 6-2.5V5" stroke="#6366f1" strokeWidth="1.5" />
      <path d="M3 9v4c0 1.38 2.69 2.5 6 2.5s6-1.12 6-2.5V9" stroke="#6366f1" strokeWidth="1.5" />
    </svg>
  );
}

function IcoCart() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1 1.5H3.2L5 11H13L15 4.5H4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="13.5" r="1.2" fill="currentColor" />
      <circle cx="12" cy="13.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function IcoChartLine() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1 12 L5 7 L9 10 L13 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="5" cy="7" r="1.3" fill="currentColor" />
      <circle cx="9" cy="10" r="1.3" fill="currentColor" />
      <circle cx="13" cy="3" r="1.3" fill="currentColor" />
    </svg>
  );
}

/* ─── DONUT CHART ────────────────────────────────────────────────────── */
function DonutChart({ pct = 100, color = '#2563eb', size = 68 }: { pct?: number; color?: string; size?: number }) {
  const cx = size / 2;
  const r  = size * 0.36;
  const sw = size * 0.12;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="#dde3ed" strokeWidth={sw} />
      <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cx})`} />
    </svg>
  );
}

/* ─── HERO CHART SVG ────────────────────────────────────────────────── */
function HeroChart() {
  return (
    <div style={{ flexShrink: 0, width: 220, opacity: 0.9 }}>
      <svg viewBox="0 0 240 170" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
        <defs>
          <linearGradient id="hg1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hg2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dde3ed" />
            <stop offset="100%" stopColor="#c8d0dc" />
          </linearGradient>
        </defs>
        {/* Platform 3D base */}
        <ellipse cx="120" cy="155" rx="108" ry="13" fill="#c8d0dc" opacity="0.5" />
        <rect x="18" y="38" width="204" height="112" rx="6" fill="url(#hg2)" opacity="0.35" />
        <rect x="18" y="38" width="204" height="6" rx="3" fill="#dde3ed" opacity="0.6" />
        {/* Grid */}
        {[60, 82, 104, 126].map(y => (
          <line key={y} x1="32" y1={y} x2="210" y2={y} stroke="#c8d0dc" strokeWidth="0.6" opacity="0.7" />
        ))}
        {/* Area */}
        <path d="M32,118 C52,110 72,102 92,88 C112,72 132,78 152,58 C167,43 188,34 210,24 L210,140 L32,140 Z" fill="url(#hg1)" />
        {/* Line */}
        <path d="M32,118 C52,110 72,102 92,88 C112,72 132,78 152,58 C167,43 188,34 210,24"
          stroke="#10b981" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        {/* End dot with glow */}
        <circle cx="210" cy="24" r="5.5" fill="#10b981" opacity="0.25" />
        <circle cx="210" cy="24" r="3.5" fill="#10b981" />
      </svg>
    </div>
  );
}

/* ─── MAIN ───────────────────────────────────────────────────────────── */
export default function PortfelClient({ livePrices, liveUsdPln, fetchedAt }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const USD_PLN = liveUsdPln ?? 3.8850;

  function toPLN(val: number, cur: string) {
    if (cur === 'USD') return val * USD_PLN;
    if (cur === 'EUR') return val * 4.22;
    return val;
  }

  const holdings = HOLDINGS.map(h => {
    const currentPrice = livePrices[h.ticker] ?? h.fallbackPrice;
    const invested = toPLN(h.buyPrice * h.shares, h.currency);
    const current  = toPLN(currentPrice * h.shares, h.currency);
    const pnl      = current - invested;
    const pnlPct   = ((currentPrice - h.buyPrice) / h.buyPrice) * 100;
    return { ...h, currentPrice, invested, current, pnl, pnlPct };
  });

  const totalInvested = holdings.reduce((s, h) => s + h.invested, 0);
  const totalCurrent  = holdings.reduce((s, h) => s + h.current, 0);
  const totalPnl      = totalCurrent - totalInvested;
  const totalPnlPct   = (totalPnl / totalInvested) * 100;

  const fmt      = (n: number) => n.toLocaleString('pl-PL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmtPrice = (n: number, d = 2) => n.toLocaleString('pl-PL', { minimumFractionDigits: d, maximumFractionDigits: d });

  const pnlColor = (v: number) => (v >= 0 ? '#16a34a' : '#dc2626');

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '100px 20px 80px' }}>

        {/* ── SUB-HEADER ── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 28, paddingBottom: 18,
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 13 L6 8 L10 11 L16 4" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 4 H16 V7" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>
              Portfel inwestycyjny
            </span>
          </div>
          {liveUsdPln && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
              USD/PLN:&nbsp;<span style={{ color: 'var(--text)', fontWeight: 700 }}>{fmtPrice(USD_PLN, 4)}</span>
              <span style={{ margin: '0 4px', opacity: 0.35 }}>·</span>
              Kursy odświeżane co godzinę
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ marginLeft: 3 }}>
                <path d="M11 6.5C11 9 9 11 6.5 11C4 11 2 9 2 6.5C2 4 4 2 6.5 2C8 2 9.3 2.7 10.1 3.8" stroke="var(--muted)" strokeWidth="1.3" strokeLinecap="round" />
                <path d="M9.5 2 L11 3.5 L9.5 5" stroke="var(--muted)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>

        {/* ── HERO ── */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 20,
          padding: 'clamp(28px, 4vw, 44px) clamp(28px, 5vw, 52px)',
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 24,
          overflow: 'hidden',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              color: 'var(--text)',
              lineHeight: 1.0,
              margin: '0 0 14px',
              letterSpacing: '-0.5px',
            }}>
              Transparentność
            </h1>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--text)',
              margin: '0 0 10px',
            }}>
              Mój portfel
            </p>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.88rem',
              color: 'var(--muted)',
              margin: 0,
              lineHeight: 1.65,
              maxWidth: 340,
            }}>
              Pełna transparentność - co kupuję, kiedy, za ile i dlaczego. Bez ściemy.
            </p>
          </div>
          <HeroChart />
        </div>

        {/* ── STATS 4 CARDS ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          marginBottom: 28,
        }}>
          {/* Wartość portfela */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '18px 20px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--muted)', margin: '0 0 10px' }}>
              Wartość portfela
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 2vw, 1.45rem)', fontWeight: 700, color: 'var(--text)', margin: '0 0 16px', lineHeight: 1.1 }}>
              {fmt(totalCurrent)}&nbsp;PLN
            </p>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(22,163,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IcoTrend color="#16a34a" />
            </div>
          </div>

          {/* Zainwestowano */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '18px 20px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--muted)', margin: '0 0 10px' }}>
              Zainwestowano
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 2vw, 1.45rem)', fontWeight: 700, color: 'var(--text)', margin: '0 0 16px', lineHeight: 1.1 }}>
              {fmt(totalInvested)}&nbsp;PLN
            </p>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IcoDatabase />
            </div>
          </div>

          {/* Zysk / strata */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '18px 20px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--muted)', margin: '0 0 10px' }}>
              Zysk / strata
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 2vw, 1.45rem)', fontWeight: 700, color: pnlColor(totalPnl), margin: '0 0 4px', lineHeight: 1.1 }}>
              {totalPnl >= 0 ? '+' : ''}{fmt(totalPnl)}&nbsp;PLN
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 700, color: pnlColor(totalPnl), margin: '0 0 12px' }}>
              {totalPnlPct >= 0 ? '+' : ''}{totalPnlPct.toFixed(1)}%
            </p>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: totalPnl >= 0 ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IcoTrend color={pnlColor(totalPnl)} />
            </div>
          </div>

          {/* Alokacja */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--muted)', margin: '0 0 10px' }}>
                Alokacja
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                Akcje 100%
              </p>
            </div>
            <div style={{ alignSelf: 'flex-end', marginTop: 8 }}>
              <DonutChart pct={100} color="#2563eb" size={66} />
            </div>
          </div>
        </div>

        {/* ── POZYCJE ── */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 16, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ padding: '18px 26px', borderBottom: '1px solid var(--border-subtle)' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
              Pozycje
            </p>
          </div>

          {holdings.map((h, i) => {
            const Logo = LOGOS[h.ticker];
            const isExp = expanded === h.ticker;
            const isLast = i === holdings.length - 1;
            const usingLive = livePrices[h.ticker] != null;
            return (
              <div key={h.ticker}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setExpanded(isExp ? null : h.ticker)}
                  onKeyDown={e => e.key === 'Enter' && setExpanded(isExp ? null : h.ticker)}
                  onMouseEnter={e => { if (!isExp) (e.currentTarget as HTMLElement).style.background = 'var(--surface2)'; }}
                  onMouseLeave={e => { if (!isExp) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto auto auto',
                    alignItems: 'center',
                    gap: 14,
                    padding: '16px 26px',
                    borderBottom: (!isLast || isExp) ? '1px solid var(--border-subtle)' : 'none',
                    cursor: 'pointer',
                    background: isExp ? 'var(--surface2)' : 'transparent',
                    outline: 'none',
                    userSelect: 'none',
                  }}
                >
                  {/* Logo + name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 13, minWidth: 0 }}>
                    {Logo && <Logo />}
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 2px', lineHeight: 1.2 }}>
                        {h.label}
                      </p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--muted)', margin: '0 0 1px' }}>
                        {h.ticker}
                      </p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--muted)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>
                        {h.name}
                      </p>
                    </div>
                  </div>

                  {/* Kurs */}
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 3px' }}>
                      {fmtPrice(h.currentPrice)}&nbsp;{h.currency}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--muted)', margin: 0 }}>
                      kupno: {fmtPrice(h.buyPrice)}&nbsp;{h.currency}
                    </p>
                  </div>

                  {/* Wartość */}
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 3px' }}>
                      {fmt(h.current)}&nbsp;PLN
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--muted)', margin: 0 }}>
                      zainw. {fmt(h.invested)}
                    </p>
                  </div>

                  {/* P&L */}
                  <div style={{ textAlign: 'right', minWidth: 78 }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, color: pnlColor(h.pnl), margin: '0 0 3px' }}>
                      {h.pnlPct >= 0 ? '+' : ''}{h.pnlPct.toFixed(1)}%
                    </p>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.76rem', fontWeight: 600, color: pnlColor(h.pnl), margin: 0 }}>
                      {h.pnl >= 0 ? '+' : ''}{fmt(h.pnl)}&nbsp;PLN
                    </p>
                  </div>

                  {/* Chevron */}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, transition: 'transform 0.2s', transform: isExp ? 'rotate(180deg)' : 'none' }}>
                    <path d="M3 5 L7 9 L11 5" stroke="var(--muted)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Expanded */}
                {isExp && (
                  <div style={{
                    padding: '18px 26px 22px',
                    background: 'var(--surface2)',
                    borderBottom: !isLast ? '1px solid var(--border-subtle)' : 'none',
                  }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--muted)', margin: '0 0 18px', lineHeight: 1.7 }}>
                      {h.note}
                    </p>
                    <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
                      {[
                        ['Data kupna',    h.buyDate],
                        ['Cena kupna',    `${fmtPrice(h.buyPrice)} ${h.currency}`],
                        ['Kurs aktualny', `${fmtPrice(h.currentPrice)} ${h.currency}${usingLive ? ' ●' : ''}`],
                        ['Waluta',        h.currency],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 3px' }}>{k}</p>
                          <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, color: k === 'Kurs aktualny' && usingLive ? '#16a34a' : 'var(--text)', margin: 0 }}>{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── DZIENNIK ZMIAN ── */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 20px' }}>
            Dziennik zmian
          </p>

          <div style={{ position: 'relative', paddingLeft: 48 }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute', left: 15, top: 6, bottom: 6,
              width: 2, background: 'var(--border-subtle)',
            }} />

            {UPDATES.map((u, i) => {
              const iconBg = u.icon === 'chart' ? 'rgba(99,102,241,0.12)' : 'rgba(22,163,74,0.12)';
              const iconColor = u.icon === 'chart' ? '#6366f1' : '#16a34a';
              return (
                <div key={i} style={{ position: 'relative', marginBottom: i < UPDATES.length - 1 ? 32 : 0 }}>
                  {/* Icon bubble */}
                  <div style={{
                    position: 'absolute', left: -48, top: 2,
                    width: 32, height: 32, borderRadius: '50%',
                    background: u.icon === 'amazon' ? '#fff' : iconBg,
                    border: `2px solid ${u.icon === 'amazon' ? '#e2eaf3' : iconColor + '33'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: iconColor,
                    boxShadow: '0 0 0 4px var(--bg)',
                  }}>
                    {u.icon === 'cart'   && <IcoCart />}
                    {u.icon === 'chart'  && <IcoChartLine />}
                    {u.icon === 'amazon' && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <text x="8" y="12" textAnchor="middle" fontFamily="Georgia,serif" fontSize="13" fontWeight="700" fill="#0f1111">a</text>
                      </svg>
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', margin: '0 0 6px', letterSpacing: '0.3px' }}>
                      {u.date}
                    </p>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 8px', lineHeight: 1.3 }}>
                      {u.action}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.83rem', color: 'var(--muted)', margin: 0, lineHeight: 1.65 }}>
                      {u.why}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── DISCLAIMER ── */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.76rem',
          color: 'var(--muted)',
          lineHeight: 1.6,
          textAlign: 'center',
          maxWidth: 500,
          margin: '0 auto 64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="7" cy="7" r="6" stroke="var(--muted)" strokeWidth="1.2" />
            <path d="M7 6.5 V10" stroke="var(--muted)" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="7" cy="4.5" r="0.7" fill="var(--muted)" />
          </svg>
          To nie jest rekomendacja inwestycyjna. Pokazuję co sam robię - każdy podejmuje własne decyzje.
        </p>

        {/* ── NEWSLETTER ── */}
        <PortfelNewsletter />

      </div>
    </div>
  );
}

/* ─── NEWSLETTER ─────────────────────────────────────────────────────── */
function PortfelNewsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? 'ok' : 'error');
      if (res.ok) setEmail('');
    } catch {
      setState('error');
    }
  }

  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: '#0a0d12', borderRadius: 20,
      padding: 'clamp(36px, 6vw, 56px) clamp(28px, 5vw, 56px)',
    }}>
      <div style={{ position: 'absolute', top: -80, right: -60, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,162,39,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -40, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,162,39,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {state === 'ok' ? (
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', letterSpacing: '2px', color: '#c9a227', margin: '0 0 8px' }}>GOTOWE.</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Sprawdź skrzynkę - wysłałem maila powitalnego.</p>
        </div>
      ) : (
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '3px', color: '#c9a227', textTransform: 'uppercase', margin: '0 0 16px' }}>
            Newsletter
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', letterSpacing: '1px', color: '#ffffff', lineHeight: 1.2, margin: '0 0 10px' }}>
            Chcesz wiedzieć z pierwszej ręki<br />co kupuję i jak traduje?
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', margin: '0 0 32px', lineHeight: 1.7 }}>
            Piszę kiedy mam coś wartego wysłania. Bez spamu.
          </p>
          <form onSubmit={submit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              ref={inputRef}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="twoj@email.pl"
              required
              disabled={state === 'loading'}
              style={{ flex: '1 1 220px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '14px 18px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#ffffff', outline: 'none' }}
            />
            <button
              type="submit"
              disabled={state === 'loading'}
              style={{ flex: '0 0 auto', background: '#c9a227', border: 'none', borderRadius: 10, padding: '14px 28px', fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 700, color: '#030508', cursor: state === 'loading' ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', opacity: state === 'loading' ? 0.6 : 1, transition: 'opacity 0.15s' }}
            >
              {state === 'loading' ? '...' : 'Zapisz się'}
            </button>
          </form>
          {state === 'error' && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#f87171', marginTop: 10 }}>
              Coś poszło nie tak. Spróbuj ponownie.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
