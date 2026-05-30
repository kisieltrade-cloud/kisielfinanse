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
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <rect width="52" height="52" rx="12" fill="#fff" stroke="#e8edf3" strokeWidth="1" />
      <text x="26" y="33" textAnchor="middle" fontFamily="Georgia,Times New Roman,serif" fontSize="26" fontWeight="700" fill="#0f1111">a</text>
      <path d="M13 39 Q26 47 39 39" stroke="#ff9900" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M35 39 L39 39 L39 35" stroke="#ff9900" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LogoAzoty() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <rect width="52" height="52" rx="12" fill="#fff" stroke="#e8edf3" strokeWidth="1" />
      <rect x="4" y="4" width="44" height="44" rx="9" fill="#1a6b35" />
      <text x="26" y="23" textAnchor="middle" fontFamily="Arial,Helvetica,sans-serif" fontSize="7.5" fontWeight="600" fill="rgba(255,255,255,0.75)" letterSpacing="0.8">GRUPA</text>
      <text x="26" y="35" textAnchor="middle" fontFamily="Arial,Helvetica,sans-serif" fontSize="10" fontWeight="800" fill="#fff" letterSpacing="0.6">AZOTY</text>
    </svg>
  );
}

function LogoAmrest() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <rect width="52" height="52" rx="12" fill="#fff" stroke="#e8edf3" strokeWidth="1" />
      {/* Phoenix flame shape */}
      <path d="M22 38 C20 32 18 26 22 20 C24 16 26 14 26 14 C26 14 28 16 30 20 C34 26 32 32 30 38" fill="#e05a1c" opacity="0.15" />
      <path d="M26 14 C26 14 24 17 22 21 C20 26 21 30 23 34" stroke="#e05a1c" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M26 14 C26 14 28 17 30 21 C32 26 31 30 29 34" stroke="#e05a1c" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M23 34 C24 36 25 37.5 26 38 C27 37.5 28 36 29 34" stroke="#e05a1c" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x="26" y="46" textAnchor="middle" fontFamily="Arial,Helvetica,sans-serif" fontSize="6.5" fontWeight="700" fill="#333" letterSpacing="0.3">AmRest</text>
    </svg>
  );
}

function LogoModivo() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <rect width="52" height="52" rx="12" fill="#fff" stroke="#e8edf3" strokeWidth="1" />
      <text x="26" y="29" textAnchor="middle" fontFamily="Arial,Helvetica,sans-serif" fontSize="9" fontWeight="800" fill="#0a0a0a" letterSpacing="1.8">MODIVO</text>
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
function IcoTrend({ color = '#16a34a', size = 18 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
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
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M1 1.5H3L5 10.5H12L14 4.5H4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="13" r="1.1" fill="currentColor" />
      <circle cx="11" cy="13" r="1.1" fill="currentColor" />
    </svg>
  );
}

function IcoChartLine() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M1 11 L5 6.5 L8.5 9.5 L13 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="5" cy="6.5" r="1.2" fill="currentColor" />
      <circle cx="8.5" cy="9.5" r="1.2" fill="currentColor" />
      <circle cx="13" cy="3" r="1.2" fill="currentColor" />
    </svg>
  );
}

/* ─── DONUT CHART ────────────────────────────────────────────────────── */
function DonutChart({ pct = 100, color = '#2563eb', size = 72 }: { pct?: number; color?: string; size?: number }) {
  const cx = size / 2;
  const r  = size * 0.37;
  const sw = size * 0.13;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="#dde3ed" strokeWidth={sw} />
      <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cx})`} />
    </svg>
  );
}

/* ─── HERO CHART - 3D PLATFORM ──────────────────────────────────────── */
function HeroChart() {
  return (
    <div className="portfel-hero-chart" style={{ flexShrink: 0, width: 'clamp(160px, 25vw, 240px)' }}>
      <svg viewBox="0 0 260 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <clipPath id="platClip">
            <rect x="20" y="30" width="220" height="110" rx="10" />
          </clipPath>
        </defs>

        {/* Shadow under platform */}
        <ellipse cx="130" cy="172" rx="105" ry="11" fill="#c8d0dc" opacity="0.45" />

        {/* Platform bottom edge (3D depth) */}
        <path d="M20 128 L20 145 Q20 152 28 152 L232 152 Q240 152 240 145 L240 128 Z" fill="#d4dce8" />

        {/* Platform main surface */}
        <rect x="20" y="30" width="220" height="100" rx="10" fill="#f2f5f9" />

        {/* Subtle inner border on top surface */}
        <rect x="20" y="30" width="220" height="100" rx="10" fill="none" stroke="#e0e8f0" strokeWidth="1" />

        {/* Grid lines */}
        <line x1="35" y1="60" x2="245" y2="60" stroke="#dde3ed" strokeWidth="0.6" clipPath="url(#platClip)" />
        <line x1="35" y1="83" x2="245" y2="83" stroke="#dde3ed" strokeWidth="0.6" clipPath="url(#platClip)" />
        <line x1="35" y1="106" x2="245" y2="106" stroke="#dde3ed" strokeWidth="0.6" clipPath="url(#platClip)" />

        {/* Area fill */}
        <path d="M35,115 C55,106 75,95 95,80 C115,65 133,72 153,52 C168,37 192,30 228,22 L228,130 L35,130 Z"
          fill="url(#areaGrad)" clipPath="url(#platClip)" />

        {/* Chart line */}
        <path d="M35,115 C55,106 75,95 95,80 C115,65 133,72 153,52 C168,37 192,30 228,22"
          stroke="#10b981" strokeWidth="2.8" fill="none" strokeLinecap="round" clipPath="url(#platClip)" />

        {/* End dot */}
        <circle cx="228" cy="22" r="6" fill="#10b981" opacity="0.2" clipPath="url(#platClip)" />
        <circle cx="228" cy="22" r="3.5" fill="#10b981" clipPath="url(#platClip)" />
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

  const fmt = (n: number) =>
    n.toLocaleString('pl-PL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmtPrice = (n: number, d = 2) =>
    n.toLocaleString('pl-PL', { minimumFractionDigits: d, maximumFractionDigits: d });

  const pnlColor = (v: number) => (v >= 0 ? '#16a34a' : '#dc2626');

  const cardStyle: React.CSSProperties = {
    background: 'var(--surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 14,
    padding: '18px 20px',
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '100px 20px 80px' }}>

        {/* ── SUB-HEADER ── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 24, paddingBottom: 16,
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
              <path d="M1.5 12.5 L5.5 7.5 L9.5 10.5 L15.5 3.5" stroke="var(--cyan)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12.5 3.5 H15.5 V6.5" stroke="var(--cyan)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>
              Portfel inwestycyjny
            </span>
          </div>
          {liveUsdPln && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
              USD/PLN:&nbsp;<span style={{ color: 'var(--text)', fontWeight: 700 }}>{fmtPrice(USD_PLN, 4)}</span>
              <span style={{ opacity: 0.35, margin: '0 2px' }}>·</span>
              Kursy odświeżane co godzinę
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ marginLeft: 2 }}>
                <path d="M11 6.5C11 9 9 11 6.5 11C4 11 2 9 2 6.5C2 4 4 2 6.5 2C8.2 2 9.6 2.9 10.4 4.2" stroke="var(--muted)" strokeWidth="1.3" strokeLinecap="round" />
                <path d="M9 2 L11 4 L9 6" stroke="var(--muted)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
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
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 32,
          overflow: 'hidden',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 7vw, 5.2rem)',
              color: 'var(--text)',
              lineHeight: 1.0,
              margin: '0 0 16px',
              letterSpacing: '-0.5px',
            }}>
              Mój portfel inwestycyjny
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
              maxWidth: 300,
            }}>
              Pełna transparentność - co kupuję, kiedy,<br />za ile i dlaczego. Bez ściemy.
            </p>
          </div>
          <HeroChart />
        </div>

        {/* ── STATS 4 CARDS ── */}
        <div className="portfel-stats-grid">

          {/* Wartość portfela */}
          <div style={cardStyle}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--muted)', margin: '0 0 8px' }}>
              Wartość portfela
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.05rem, 2.2vw, 1.55rem)', fontWeight: 700, color: 'var(--text)', margin: '0 0 20px', lineHeight: 1.1 }}>
              {fmt(totalCurrent)}&nbsp;PLN
            </p>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(22,163,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IcoTrend color="#16a34a" />
            </div>
          </div>

          {/* Zainwestowano */}
          <div style={cardStyle}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--muted)', margin: '0 0 8px' }}>
              Zainwestowano
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.05rem, 2.2vw, 1.55rem)', fontWeight: 700, color: 'var(--text)', margin: '0 0 20px', lineHeight: 1.1 }}>
              {fmt(totalInvested)}&nbsp;PLN
            </p>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IcoDatabase />
            </div>
          </div>

          {/* Zysk / strata */}
          <div style={cardStyle}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--muted)', margin: '0 0 8px' }}>
              Zysk / strata
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.05rem, 2.2vw, 1.55rem)', fontWeight: 700, color: pnlColor(totalPnl), margin: '0 0 4px', lineHeight: 1.1 }}>
              {totalPnl >= 0 ? '+' : ''}{fmt(totalPnl)}&nbsp;PLN
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 700, color: pnlColor(totalPnl), margin: '0 0 16px' }}>
              {totalPnlPct >= 0 ? '+' : ''}{totalPnlPct.toFixed(1)}%
            </p>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: totalPnl >= 0 ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IcoTrend color={pnlColor(totalPnl)} />
            </div>
          </div>

          {/* Alokacja */}
          <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--muted)', margin: '0 0 8px' }}>
              Alokacja
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
              Akcje 100%
            </p>
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', marginTop: 8 }}>
              <DonutChart pct={100} color="#2563eb" size={72} />
            </div>
          </div>
        </div>

        {/* ── POZYCJE ── */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 16, overflow: 'hidden', marginBottom: 32 }}>
          <div style={{ padding: '18px 28px', borderBottom: '1px solid var(--border-subtle)' }}>
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
                  className="portfel-pos-row"
                  style={{
                    borderBottom: (!isLast || isExp) ? '1px solid var(--border-subtle)' : 'none',
                    cursor: 'pointer',
                    background: isExp ? 'var(--surface2)' : 'transparent',
                    outline: 'none',
                    userSelect: 'none',
                    transition: 'background 0.1s',
                  }}
                >
                  {/* Logo + name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
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
                  <div className="portfel-pos-kurs" style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 4px' }}>
                      {fmtPrice(h.currentPrice)}&nbsp;{h.currency}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--muted)', margin: 0 }}>
                      kupno: {fmtPrice(h.buyPrice)}&nbsp;{h.currency}
                    </p>
                  </div>

                  {/* Wartość */}
                  <div className="portfel-pos-val" style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.92rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 4px' }}>
                      {fmt(h.current)}&nbsp;PLN
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--muted)', margin: 0 }}>
                      zainw. {fmt(h.invested)}
                    </p>
                  </div>

                  {/* P&L */}
                  <div style={{ textAlign: 'right', minWidth: 82 }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.98rem', fontWeight: 700, color: pnlColor(h.pnl), margin: '0 0 4px' }}>
                      {h.pnlPct >= 0 ? '+' : ''}{h.pnlPct.toFixed(1)}%
                    </p>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.76rem', fontWeight: 700, color: pnlColor(h.pnl), margin: 0 }}>
                      {h.pnl >= 0 ? '+' : ''}{fmt(h.pnl)}&nbsp;PLN
                    </p>
                  </div>

                  {/* Chevron */}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, transition: 'transform 0.18s', transform: isExp ? 'rotate(180deg)' : 'none' }}>
                    <path d="M3 5 L7 9 L11 5" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Expanded */}
                {isExp && (
                  <div style={{
                    padding: '18px 28px 22px',
                    background: 'var(--surface2)',
                    borderBottom: !isLast ? '1px solid var(--border-subtle)' : 'none',
                  }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--muted)', margin: '0 0 18px', lineHeight: 1.7 }}>
                      {h.note}
                    </p>
                    <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
                      {([
                        ['Data kupna',    h.buyDate],
                        ['Cena kupna',    `${fmtPrice(h.buyPrice)} ${h.currency}`],
                        ['Kurs aktualny', `${fmtPrice(h.currentPrice)} ${h.currency}${usingLive ? ' ●' : ''}`],
                        ['Waluta',        h.currency],
                      ] as [string, string][]).map(([k, v]) => (
                        <div key={k}>
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 3px' }}>{k}</p>
                          <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.92rem', fontWeight: 700, color: k === 'Kurs aktualny' && usingLive ? '#16a34a' : 'var(--text)', margin: 0 }}>{v}</p>
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
        <div style={{ marginBottom: 52 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 24px' }}>
            Dziennik zmian
          </p>

          {/* Timeline wrapper */}
          <div style={{ position: 'relative' }}>
            {/* Vertical line - positioned to align with icon centers */}
            <div style={{
              position: 'absolute',
              left: 15,
              top: 16,
              bottom: 16,
              width: 2,
              background: 'var(--border-subtle)',
              borderRadius: 1,
            }} />

            {UPDATES.map((u, i) => {
              const isCart = u.icon === 'cart';
              const isAmazon = u.icon === 'amazon';
              const iconBg   = isCart ? 'rgba(22,163,74,0.12)' : isAmazon ? '#fff' : 'rgba(99,102,241,0.12)';
              const iconClr  = isCart ? '#16a34a' : isAmazon ? '#0f1111' : '#6366f1';
              const iconBorder = isAmazon ? '1.5px solid #e8edf3' : `1.5px solid ${isCart ? '#16a34a33' : '#6366f133'}`;

              return (
                <div key={i} style={{
                  display: 'flex',
                  gap: 0,
                  alignItems: 'flex-start',
                  marginBottom: i < UPDATES.length - 1 ? 32 : 0,
                  position: 'relative',
                }}>
                  {/* Icon circle */}
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: iconBg,
                    border: iconBorder,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: iconClr,
                    zIndex: 1,
                    boxShadow: '0 0 0 4px var(--bg)',
                  }}>
                    {isCart && <IcoCart />}
                    {u.icon === 'chart' && <IcoChartLine />}
                    {isAmazon && (
                      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                        <text x="8.5" y="13" textAnchor="middle" fontFamily="Georgia,serif" fontSize="14" fontWeight="700" fill="#0f1111">a</text>
                      </svg>
                    )}
                  </div>

                  {/* Date column - fixed width */}
                  <div style={{
                    width: 118, flexShrink: 0,
                    paddingLeft: 14, paddingTop: 6,
                  }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.4 }}>
                      {u.date}
                    </span>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, paddingTop: 2 }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 8px', lineHeight: 1.35 }}>
                      {u.action}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--muted)', margin: 0, lineHeight: 1.65 }}>
                      {u.why}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── DISCLAIMER ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          maxWidth: 520, margin: '0 auto 64px',
        }}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="7.5" cy="7.5" r="6.5" stroke="var(--muted)" strokeWidth="1.1" />
            <path d="M7.5 7 V10.5" stroke="var(--muted)" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="7.5" cy="5" r="0.75" fill="var(--muted)" />
          </svg>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
            To nie jest rekomendacja inwestycyjna. Pokazuję co sam robię - każdy podejmuje własne decyzje.
          </p>
        </div>

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
