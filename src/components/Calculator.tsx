'use client';

import { useState, useMemo } from 'react';

type Tab = 'compound' | 'rr' | 'fire' | 'etf';
export type { Tab };

const fmt   = (n: number) => Math.round(n).toLocaleString('pl-PL');
const short = (n: number) => {
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${Math.round(n / 1_000)}k`;
  return String(Math.round(n));
};

// ─── Pole formularza ─────────────────────────────────────────────
function Field({ label, value, onChange, step, placeholder, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  step?: string; placeholder?: string; hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{
        fontFamily: 'var(--font-body)', fontSize: '0.85rem',
        color: focused ? '#c9a227' : '#c8d4e8',
        display: 'block', marginBottom: 6, transition: 'color 0.15s',
      }}>
        {label}
      </label>
      <input
        type="number" value={value} step={step ?? 'any'} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background: 'transparent', border: 'none',
          borderBottom: `1px solid ${focused ? '#c9a227' : 'rgba(255,255,255,0.1)'}`,
          color: '#e8edf5', fontFamily: 'var(--font-body)',
          fontSize: '1.1rem', fontWeight: 500,
          padding: '7px 0', width: '100%', outline: 'none',
          boxSizing: 'border-box', transition: 'border-color 0.15s',
        }}
      />
      {hint && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#3a4a5a', marginTop: 4 }}>
          {hint}
        </p>
      )}
    </div>
  );
}

// ─── Wiersz wynikowy ─────────────────────────────────────────────
function Row({ label, value, color, large }: {
  label: string; value: string; color?: string; large?: boolean;
}) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: '#c8d4e8' }}>{label}</span>
      <span style={{
        fontFamily: 'var(--font-body)', fontWeight: 600,
        fontSize: large ? '1.05rem' : '0.95rem',
        color: color ?? '#e8edf5',
      }}>
        {value}
      </span>
    </div>
  );
}

// ─── Główna liczba ───────────────────────────────────────────────
function MainResult({ label, value, color = '#c9a227', sub }: {
  label: string; value: string; color?: string; sub?: string;
}) {
  return (
    <div style={{ marginBottom: 32 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: '#c8d4e8', marginBottom: 8 }}>{label}</p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color, lineHeight: 1, letterSpacing: '0.5px' }}>
        {value}
      </p>
      {sub && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#c8d4e8', marginTop: 8 }}>{sub}</p>}
    </div>
  );
}

// ─── Wykres liniowy (procent składany) ───────────────────────────
// Prosta linia + oś Y z kwotami + delikatny fill
function LineChart({ points }: {
  points: { year: number; total: number }[];
}) {
  const W = 420, H = 210;
  const padT = 14, padB = 26, padL = 50, padR = 12;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  if (points.length < 2) return null;

  const maxVal = Math.max(...points.map(p => p.total), 1);

  // ładna skala osi Y: zaokrąglamy do miłych liczb
  const magnitude = Math.pow(10, Math.floor(Math.log10(maxVal)));
  const niceStep  = Math.ceil(maxVal / (magnitude * 4)) * magnitude;
  const niceMax   = niceStep * 4;
  const yTicks    = [0, niceStep, niceStep * 2, niceStep * 3, niceStep * 4];

  const toX = (i: number) => padL + (i / (points.length - 1)) * plotW;
  const toY = (v: number) => padT + plotH - (v / niceMax) * plotH;

  const linePts = points.map((p, i) => `${toX(i)},${toY(p.total)}`).join(' ');
  const area    = `M${padL},${padT + plotH} `
    + points.map((p, i) => `L${toX(i)},${toY(p.total)}`).join(' ')
    + ` L${toX(points.length - 1)},${padT + plotH} Z`;

  // etykiety na osi X — co ile lat
  const xStep = points.length > 20 ? 5 : points.length > 10 ? 3 : points.length > 6 ? 2 : 1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="lc-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#c9a227" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#c9a227" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {/* Poziome linie pomocnicze + etykiety osi Y */}
      {yTicks.map(v => (
        <g key={v}>
          {v > 0 && (
            <line
              x1={padL} y1={toY(v)} x2={W - padR} y2={toY(v)}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1"
            />
          )}
          <text
            x={padL - 7} y={toY(v) + 4}
            textAnchor="end" fontSize="9" fill="#4a5a6a"
            fontFamily="system-ui, sans-serif"
          >
            {short(v)}
          </text>
        </g>
      ))}

      {/* Linia bazowa */}
      <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH}
        stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

      {/* Fill */}
      <path d={area} fill="url(#lc-fill)" />

      {/* Linia */}
      <polyline
        points={linePts} fill="none"
        stroke="#c9a227" strokeWidth="2"
        strokeLinejoin="round" strokeLinecap="round"
      />

      {/* Kropki na kluczowych punktach */}
      {points.filter((_, i) => i === 0 || i === points.length - 1 || i % xStep === 0).map((p, _, arr) => {
        const i = points.indexOf(p);
        return (
          <circle key={i} cx={toX(i)} cy={toY(p.total)} r={2.5}
            fill="#c9a227" stroke="#030508" strokeWidth="1.5" />
        );
      })}

      {/* Etykiety osi X */}
      {points.map((p, i) => {
        if (i !== 0 && i % xStep !== 0 && i !== points.length - 1) return null;
        return (
          <text key={i} x={toX(i)} y={H - 6}
            textAnchor="middle" fontSize="9" fill="#4a5a6a"
            fontFamily="system-ui, sans-serif">
            {p.year}r
          </text>
        );
      })}
    </svg>
  );
}

// ─── Wykres słupkowy (ETF vs Lokata) ────────────────────────────
// Każdy rok: dwie kolumny obok siebie. Czytelne etykiety.
function CompareChart({ bars }: {
  bars: { year: string; etf: number; lok: number }[];
}) {
  const W = 420, H = 220;
  const padT = 36, padB = 26, padL = 10, padR = 10;
  const plotH = H - padT - padB;
  const plotW = W - padL - padR;

  const max   = Math.max(...bars.flatMap(b => [b.etf, b.lok]), 1);
  const colW  = plotW / bars.length;
  const barW  = Math.min(28, colW * 0.38);
  const gap   = 4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* Linia bazowa */}
      <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH}
        stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

      {bars.map((b, i) => {
        const cx   = padL + colW * i + colW / 2;
        const etfH = (b.etf / max) * plotH;
        const lokH = (b.lok / max) * plotH;
        const etfY = padT + plotH - etfH;
        const lokY = padT + plotH - lokH;

        return (
          <g key={i}>
            {/* ETF */}
            <rect x={cx - barW - gap / 2} y={etfY} width={barW} height={etfH} fill="#c9a227" rx={3} />
            {/* Lokata */}
            <rect x={cx + gap / 2}        y={lokY} width={barW} height={lokH} fill="#4a9eff" rx={3} />

            {/* Kwota ETF */}
            <text
              x={cx - barW / 2 - gap / 2} y={etfY - 6}
              textAnchor="middle" fontSize="10" fill="#c9a227" fontWeight="600"
              fontFamily="system-ui, sans-serif"
            >
              {short(b.etf)}
            </text>
            {/* Kwota Lokata */}
            <text
              x={cx + barW / 2 + gap / 2} y={lokY - 6}
              textAnchor="middle" fontSize="10" fill="#4a9eff" fontWeight="600"
              fontFamily="system-ui, sans-serif"
            >
              {short(b.lok)}
            </text>

            {/* Rok */}
            <text x={cx} y={H - 7}
              textAnchor="middle" fontSize="10" fill="#c8d4e8"
              fontFamily="system-ui, sans-serif">
              {b.year}
            </text>
          </g>
        );
      })}

      {/* Legenda */}
      <rect x={padL} y={8} width={10} height={10} fill="#c9a227" rx={2} />
      <text x={padL + 14} y={17} fontSize="10" fill="#c8d4e8" fontFamily="system-ui, sans-serif">ETF</text>
      <rect x={padL + 48} y={8} width={10} height={10} fill="#4a9eff" rx={2} />
      <text x={padL + 62} y={17} fontSize="10" fill="#c8d4e8" fontFamily="system-ui, sans-serif">Lokata</text>
    </svg>
  );
}

// ─── Kamienie milowe (paski CSS) ────────────────────────────────
function Milestones({ data }: {
  data: { label: string; value: number; secondary?: number }[];
}) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {data.map(d => (
        <div key={d.label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#c8d4e8' }}>{d.label}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: '#e8edf5', fontWeight: 600 }}>
              {fmt(d.value)} PLN
            </span>
          </div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 99 }}>
            <div style={{
              height: '100%', borderRadius: 99, background: '#c9a227',
              width: `${Math.round((d.value / max) * 100)}%`,
              transition: 'width 0.4s ease',
            }} />
          </div>
          {d.secondary !== undefined && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#3a4a5a', marginTop: 3 }}>
              z tego wpłaty: {fmt(d.secondary)} PLN
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function Sep() {
  return <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', margin: '4px 0' }} />;
}

function pickYears(max: number, n = 5): number[] {
  const pool = [1, 2, 3, 5, 7, 10, 15, 20, 25, 30, 40, 50].filter(y => y <= max);
  if (!pool.includes(max)) pool.push(max);
  if (pool.length <= n) return pool;
  const step = Math.ceil((pool.length - 2) / (n - 2));
  const out  = [pool[0]];
  for (let i = step; i < pool.length - 1; i += step) out.push(pool[i]);
  out.push(pool[pool.length - 1]);
  return [...new Set(out)].sort((a, b) => a - b);
}

// ─── GŁÓWNY KOMPONENT ────────────────────────────────────────────
export default function Calculator({ initialTab = 'compound' }: { initialTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);

  const [principal, setPrincipal] = useState('10000');
  const [monthly,   setMonthly]   = useState('500');
  const [rate,      setRate]       = useState('8');
  const [years,     setYears]     = useState('10');

  const [entry,       setEntry]       = useState('');
  const [sl,          setSl]          = useState('');
  const [tp,          setTp]          = useState('');
  const [accountSize, setAccountSize] = useState('10000');
  const [riskPct,     setRiskPct]     = useState('1');

  const [fireSavings,         setFireSavings]         = useState('50000');
  const [fireMonthlySave,     setFireMonthlySave]     = useState('2000');
  const [fireMonthlyExpenses, setFireMonthlyExpenses] = useState('5000');
  const [fireReturn,          setFireReturn]           = useState('7');

  const [etfCapital,  setEtfCapital]  = useState('20000');
  const [etfMonthly,  setEtfMonthly]  = useState('1000');
  const [etfYears,    setEtfYears]    = useState('15');
  const [etfRate,     setEtfRate]     = useState('8');
  const [lokataRate,  setLokataRate]  = useState('5');

  // ── Obliczenia ──────────────────────────────────────────────────

  const compound = useMemo(() => {
    const P   = parseFloat(principal) || 0;
    const PMT = parseFloat(monthly)   || 0;
    const r   = (parseFloat(rate)     || 0) / 100 / 12;
    const t   = Math.min(Math.max(parseInt(years) || 0, 1), 50);
    const snapYears = [1, 2, 3, 5, 10, 15, 20, 25, 30].filter(y => y <= t);
    if (!snapYears.includes(t)) snapYears.push(t);
    snapYears.sort((a, b) => a - b);

    const byYear: Record<number, { total: number; contrib: number }> = {};
    const linePoints: { year: number; total: number }[] = [];

    let balance = P;
    for (let m = 1; m <= t * 12; m++) {
      balance = balance * (1 + r) + PMT;
      if (m % 12 === 0) {
        const y = m / 12;
        linePoints.push({ year: y, total: balance });
        byYear[y] = { total: balance, contrib: P + PMT * m };
      }
    }
    const totalContrib = P + PMT * t * 12;
    return { final: balance, totalContrib, interest: balance - totalContrib, byYear, snapYears, linePoints };
  }, [principal, monthly, rate, years]);

  const rr = useMemo(() => {
    const E = parseFloat(entry), SL = parseFloat(sl), TP = parseFloat(tp);
    const acc = parseFloat(accountSize) || 0;
    const rp  = parseFloat(riskPct)     || 0;
    if (!E || !SL || !TP || SL === E || TP === E) return null;
    const isLong = TP > E;
    if (isLong && SL >= E)  return null;
    if (!isLong && SL <= E) return null;
    const riskPer   = Math.abs(E - SL);
    const rewardPer = Math.abs(TP - E);
    const ratio     = rewardPer / riskPer;
    const riskAmt   = acc * rp / 100;
    const posSize   = riskAmt / riskPer;
    return { riskPer, rewardPer, ratio, riskAmt, profitAmt: posSize * rewardPer, posSize, isLong };
  }, [entry, sl, tp, accountSize, riskPct]);

  const fire = useMemo(() => {
    const savings = parseFloat(fireSavings)         || 0;
    const save    = parseFloat(fireMonthlySave)     || 0;
    const exp     = parseFloat(fireMonthlyExpenses) || 0;
    const ret     = (parseFloat(fireReturn)         || 0) / 100;
    if (exp <= 0) return null;
    const target = exp * 12 * 25;
    const mr = ret / 12;
    let balance = savings, months = 0;
    while (balance < target && months < 600) { balance = balance * (1 + mr) + save; months++; }
    return {
      target, savings,
      achieved: balance >= target,
      yearsToFire: months / 12,
      monthlyPassive: target * (ret / 12),
    };
  }, [fireSavings, fireMonthlySave, fireMonthlyExpenses, fireReturn]);

  const etf = useMemo(() => {
    const P   = parseFloat(etfCapital)  || 0;
    const PMT = parseFloat(etfMonthly)  || 0;
    const t   = Math.min(Math.max(parseInt(etfYears) || 1, 1), 50);
    const rE  = (parseFloat(etfRate)    || 0) / 100 / 12;
    const rL  = (parseFloat(lokataRate) || 0) / 100 / 12;
    const chartYears = pickYears(t, 5);
    const byYear: Record<number, { etf: number; lok: number }> = {};
    let bE = P, bL = P;
    for (let m = 1; m <= t * 12; m++) {
      bE = bE * (1 + rE) + PMT;
      bL = bL * (1 + rL) + PMT;
      const y = m / 12;
      if (chartYears.includes(y)) byYear[y] = { etf: bE, lok: bL };
    }
    const totalContrib = P + PMT * t * 12;
    return {
      finalETF: bE, finalLok: bL, diff: bE - bL, totalContrib,
      etfInterest: bE - totalContrib, lokInterest: bL - totalContrib,
      chartYears, byYear,
    };
  }, [etfCapital, etfMonthly, etfYears, etfRate, lokataRate]);

  const TABS: { key: Tab; label: string }[] = [
    { key: 'compound', label: 'Procent składany' },
    { key: 'rr',       label: 'Risk / Reward' },
    { key: 'fire',     label: 'FIRE' },
    { key: 'etf',      label: 'ETF vs Lokata' },
  ];

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 80px' }}>

      {/* Zakładki */}
      <div style={{ display: 'flex', marginBottom: 48, borderBottom: '1px solid rgba(255,255,255,0.07)', overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: tab === t.key ? '2px solid #c9a227' : '2px solid transparent',
            color: tab === t.key ? '#ffffff' : '#c8d4e8',
            fontFamily: 'var(--font-body)', fontSize: '0.92rem',
            fontWeight: tab === t.key ? 600 : 400,
            padding: '10px 18px 12px', marginBottom: -1,
            transition: 'color 0.15s', whiteSpace: 'nowrap',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── PROCENT SKŁADANY ── */}
      {tab === 'compound' && (
        <div className="calc-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <Field label="Kapitał startowy (PLN)" value={principal} onChange={setPrincipal} step="1000" />
            <Field label="Miesięczna wpłata (PLN)" value={monthly} onChange={setMonthly} step="100" />
            <Sep />
            <Field label="Roczna stopa zwrotu (%)" value={rate} onChange={setRate} step="0.5"
              hint="Średni roczny wynik S&P 500 (z dywidendami) to ok. 10%." />
            <Field label="Liczba lat" value={years} onChange={setYears} step="1" />
          </div>

          <div>
            <MainResult
              label={`Wartość portfela po ${years} latach`}
              value={`${fmt(compound.final)} PLN`}
              sub={`z czego Twoje wpłaty to ${fmt(compound.totalContrib)} PLN`}
            />
            <Row label="Twoje wpłaty"        value={`${fmt(compound.totalContrib)} PLN`} />
            <Row label="Zysk z inwestowania" value={`${fmt(compound.interest)} PLN`} color="#c9a227" large />
            <Row
              label="Odsetki / wpłaty"
              value={compound.totalContrib > 0
                ? `${((compound.interest / compound.totalContrib) * 100).toFixed(0)}%`
                : '-'}
            />

            {/* Wykres liniowy */}
            {compound.linePoints.length >= 2 && (
              <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#c8d4e8', marginBottom: 12 }}>
                  Wzrost wartości portfela (PLN)
                </p>
                <LineChart points={compound.linePoints} />
              </div>
            )}

            {/* Kamienie milowe */}
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#c8d4e8', marginBottom: 14 }}>
                Szczegółowe wartości
              </p>
              <Milestones
                data={compound.snapYears
                  .filter(y => compound.byYear[y])
                  .map(y => ({
                    label: `Po ${y} ${y === 1 ? 'roku' : 'latach'}`,
                    value: compound.byYear[y].total,
                    secondary: compound.byYear[y].contrib,
                  }))}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── RISK / REWARD ── */}
      {tab === 'rr' && (
        <div className="calc-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <Field label="Cena wejścia" value={entry} onChange={setEntry} placeholder="np. 100.00" />
            <Field label="Stop Loss"    value={sl}    onChange={setSl}    placeholder="np. 97.50" />
            <Field label="Take Profit"  value={tp}    onChange={setTp}    placeholder="np. 107.50" />
            <Sep />
            <Field label="Wielkość konta (PLN)"     value={accountSize} onChange={setAccountSize} step="1000" />
            <Field label="Ryzyko na transakcję (%)" value={riskPct}     onChange={setRiskPct}     step="0.1"
              hint="Zalecane: 1–2% kapitału na jedną transakcję." />
          </div>

          <div>
            {rr ? (
              <>
                <div style={{ marginBottom: 32 }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: '#c8d4e8', marginBottom: 8 }}>
                    Stosunek zysku do ryzyka - {rr.isLong ? 'pozycja długa' : 'pozycja krótka'}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-display)', fontSize: '3.8rem', lineHeight: 1,
                    color: rr.ratio >= 2 ? '#c9a227' : rr.ratio >= 1 ? '#f5c518' : '#ff2d78',
                  }}>
                    1&thinsp;:&thinsp;{rr.ratio.toFixed(2)}
                  </p>
                </div>
                <Row label="Kwota ryzyka"       value={`${fmt(rr.riskAmt)} PLN`}   color="#ff2d78" />
                <Row label="Potencjalny zysk"   value={`${fmt(rr.profitAmt)} PLN`} color="#c9a227" large />
                <Row label="Ryzyko / jednostka" value={rr.riskPer.toFixed(4)} />
                <Row label="Zysk / jednostka"   value={rr.rewardPer.toFixed(4)} />
                <Row label="Wielkość pozycji"   value={`${rr.posSize.toFixed(2)} jednostek`} />
                {rr.ratio < 1 && (
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: '#ff2d78',
                    lineHeight: 1.65, marginTop: 20, paddingLeft: 12,
                    borderLeft: '2px solid rgba(255,45,120,0.4)',
                  }}>
                    Ryzykujesz więcej niż możesz zyskać. Przesuń take profit lub stop loss.
                  </p>
                )}
              </>
            ) : (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: '#3a4a5a', lineHeight: 1.8 }}>
                Wpisz cenę wejścia, stop loss i take profit po lewej, żeby zobaczyć wyniki.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── FIRE ── */}
      {tab === 'fire' && (
        <div className="calc-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: '#c8d4e8', lineHeight: 1.7,
              paddingLeft: 12, borderLeft: '2px solid rgba(201,162,39,0.3)',
            }}>
              Reguła 4% - Twój cel to 25x rocznych wydatków. Portfel tej wielkości powinien finansować Twoje życie bez uszczuplania kapitału.
            </p>
            <Field label="Obecne oszczędności (PLN)"        value={fireSavings}         onChange={setFireSavings}         step="5000" />
            <Field label="Miesięczne oszczędności (PLN)"    value={fireMonthlySave}     onChange={setFireMonthlySave}     step="100" />
            <Sep />
            <Field label="Miesięczne wydatki po FIRE (PLN)" value={fireMonthlyExpenses} onChange={setFireMonthlyExpenses} step="500" />
            <Field label="Oczekiwana stopa zwrotu (%)"      value={fireReturn}           onChange={setFireReturn}         step="0.5" />
          </div>

          <div>
            {fire ? (
              <>
                <MainResult label="Twój cel FIRE" value={`${fmt(fire.target)} PLN`} sub="25× rocznych wydatków (reguła 4%)" />
                {fire.achieved ? (
                  <MainResult
                    label="Czas do wolności finansowej" color="#00d4aa"
                    value={fire.yearsToFire < 1
                      ? `${Math.ceil(fire.yearsToFire * 12)} miesięcy`
                      : `${Math.floor(fire.yearsToFire)} lat ${Math.round((fire.yearsToFire % 1) * 12)} mies.`}
                  />
                ) : (
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: '#ff2d78',
                    lineHeight: 1.65, marginBottom: 24, paddingLeft: 12,
                    borderLeft: '2px solid rgba(255,45,120,0.4)',
                  }}>
                    Przy tych parametrach FIRE nie jest osiągalny w ciągu 50 lat.<br />
                    Zwiększ miesięczne oszczędności lub stopę zwrotu.
                  </p>
                )}
                <Row label="Już odłożone"           value={`${fmt(fire.savings)} PLN`} />
                <Row label="Brakuje do celu"        value={`${fmt(Math.max(0, fire.target - fire.savings))} PLN`} />
                <Row label="Pasywny dochód po FIRE" value={`${fmt(fire.monthlyPassive)} PLN / mies.`} color="#00d4aa" large />
              </>
            ) : (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: '#3a4a5a', lineHeight: 1.8 }}>
                Wpisz miesięczne wydatki po FIRE, żeby obliczyć swój cel.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── ETF vs LOKATA ── */}
      {tab === 'etf' && (
        <div className="calc-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <Field label="Kapitał startowy (PLN)"         value={etfCapital}  onChange={setEtfCapital}  step="1000" />
            <Field label="Miesięczna wpłata (PLN)"        value={etfMonthly}  onChange={setEtfMonthly}  step="100" />
            <Field label="Liczba lat"                     value={etfYears}    onChange={setEtfYears}    step="1" />
            <Sep />
            <Field label="Roczna stopa zwrotu ETF (%)"   value={etfRate}    onChange={setEtfRate}    step="0.5"
              hint="Np. 7–10% dla szerokiego indeksu globalnego." />
            <Field label="Oprocentowanie lokaty (%)"     value={lokataRate} onChange={setLokataRate} step="0.5" />
          </div>

          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 28 }}>
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#c9a227', marginBottom: 6, fontWeight: 600 }}>ETF</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: '#c9a227', lineHeight: 1 }}>
                  {fmt(etf.finalETF)} PLN
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: '#c8d4e8', marginTop: 6 }}>
                  zysk: +{fmt(etf.etfInterest)} PLN
                </p>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#4a9eff', marginBottom: 6, fontWeight: 600 }}>Lokata</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: '#4a9eff', lineHeight: 1 }}>
                  {fmt(etf.finalLok)} PLN
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: '#c8d4e8', marginTop: 6 }}>
                  zysk: +{fmt(etf.lokInterest)} PLN
                </p>
              </div>
            </div>

            <Row label="Twoje wpłaty łącznie" value={`${fmt(etf.totalContrib)} PLN`} />
            <Row
              label="ETF zarobi więcej o"
              value={`${etf.diff >= 0 ? '+' : ''}${fmt(etf.diff)} PLN`}
              color={etf.diff >= 0 ? '#c9a227' : '#ff2d78'}
              large
            />

            {/* Wykres porównawczy */}
            {etf.chartYears.length >= 2 && (
              <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <CompareChart
                  bars={etf.chartYears
                    .filter(y => etf.byYear[y])
                    .map(y => ({ year: `${y}r`, etf: etf.byYear[y].etf, lok: etf.byYear[y].lok }))}
                />
              </div>
            )}

            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.76rem', color: '#3a4a5a', lineHeight: 1.65, marginTop: 16 }}>
              Wyniki szacunkowe. Nie uwzględniono podatku Belki (19%), opłat za zarządzanie funduszem ani inflacji.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
