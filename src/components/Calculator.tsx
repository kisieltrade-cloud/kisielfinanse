'use client';

import { useState, useMemo, type ReactNode } from 'react';

type Tab = 'compound' | 'rr' | 'fire' | 'etf' | 'dca';
export type { Tab };

const fmt   = (n: number) => Math.round(n).toLocaleString('pl-PL');
const fmtD  = (n: number, d = 2) => n.toLocaleString('pl-PL', { minimumFractionDigits: d, maximumFractionDigits: d });
const short = (n: number) => {
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${Math.round(n / 1_000)}k`;
  return String(Math.round(n));
};

// ─── Pole formularza ─────────────────────────────────────────────
function Field({ label, value, onChange, step, placeholder, hint, min, max }: {
  label: string; value: string; onChange: (v: string) => void;
  step?: string; placeholder?: string; hint?: string; min?: string; max?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{
        fontFamily: 'var(--font-body)', fontSize: '0.85rem',
        color: focused ? '#2e7d4f' : 'var(--muted)',
        display: 'block', marginBottom: 6, transition: 'color 0.15s',
      }}>
        {label}
      </label>
      <input
        type="number" value={value} step={step ?? 'any'} placeholder={placeholder}
        min={min} max={max}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background: 'transparent', border: 'none',
          borderBottom: `1px solid ${focused ? '#2e7d4f' : 'var(--border)'}`,
          color: 'var(--text)', fontFamily: 'var(--font-body)',
          fontSize: '1.1rem', fontWeight: 700,
          padding: '7px 0', width: '100%', outline: 'none',
          boxSizing: 'border-box', transition: 'border-color 0.15s',
        }}
      />
      {hint && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--muted)', marginTop: 4 }}>
          {hint}
        </p>
      )}
    </div>
  );
}

// ─── Toggle ──────────────────────────────────────────────────────
function Toggle({ label, checked, onChange, hint }: {
  label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string;
}) {
  return (
    <div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
        <div
          onClick={() => onChange(!checked)}
          style={{
            width: 36, height: 20, borderRadius: 10, flexShrink: 0,
            background: checked ? '#2e7d4f' : 'var(--border)',
            position: 'relative', transition: 'background 0.2s', cursor: 'pointer',
          }}
        >
          <div style={{
            position: 'absolute', top: 3, left: checked ? 18 : 3,
            width: 14, height: 14, borderRadius: '50%',
            background: '#fff', transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }} />
        </div>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--muted)' }}>
          {label}
        </span>
      </label>
      {hint && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--muted)', marginTop: 4, paddingLeft: 46 }}>{hint}</p>}
    </div>
  );
}

// ─── Wiersz wynikowy ─────────────────────────────────────────────
function Row({ label, value, color, large, sub, icon }: {
  label: string; value: string; color?: string; large?: boolean; sub?: string; icon?: ReactNode;
}) {
  if (icon) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
        padding: '13px 0', borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <span style={{
            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
            background: 'rgba(46,125,79,0.1)', color: '#2e7d4f',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{icon}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text)' }}>{label}</div>
            {sub && <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--muted)', marginTop: 1 }}>{sub}</div>}
          </div>
        </div>
        <span style={{
          fontFamily: 'var(--font-body)', fontWeight: 700,
          fontSize: large ? '1.1rem' : '1rem', color: color ?? 'var(--text)', whiteSpace: 'nowrap',
        }}>
          {value}
        </span>
      </div>
    );
  }
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '10px 0', borderBottom: '1px solid var(--border-subtle)',
    }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--muted)' }}>{label}</span>
      <div style={{ textAlign: 'right' }}>
        <span style={{
          fontFamily: 'var(--font-body)', fontWeight: 600,
          fontSize: large ? '1.05rem' : '0.95rem',
          color: color ?? 'var(--text)',
        }}>
          {value}
        </span>
        {sub && <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--muted)' }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── Ikonki do wierszy wynikowych ────────────────────────────────
const icoStroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const IcoWplaty  = () => <svg width="17" height="17" viewBox="0 0 24 24" {...icoStroke}><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg>;
const IcoZysk    = () => <svg width="17" height="17" viewBox="0 0 24 24" {...icoStroke}><polyline points="3 17 9 11 13 15 21 6"/><polyline points="15 6 21 6 21 12"/></svg>;
const IcoBelka   = () => <svg width="17" height="17" viewBox="0 0 24 24" {...icoStroke}><path d="M12 2 4 6v6c0 4 3 7 8 8 5-1 8-4 8-8V6z"/></svg>;
const IcoRealna  = () => <svg width="17" height="17" viewBox="0 0 24 24" {...icoStroke}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M18.4 5.6l1.4-1.4M4.2 19.8l1.4-1.4"/></svg>;
const IcoMnoznik = () => <svg width="17" height="17" viewBox="0 0 24 24" {...icoStroke}><path d="M12 2 22 12 12 22 2 12z"/></svg>;

// ─── Główna liczba ───────────────────────────────────────────────
function MainResult({ label, value, color = '#2e7d4f', sub }: {
  label: string; value: string; color?: string; sub?: string;
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 8 }}>{label}</p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color, lineHeight: 1, letterSpacing: '0.5px' }}>
        {value}
      </p>
      {sub && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted)', marginTop: 8 }}>{sub}</p>}
    </div>
  );
}

// ─── Wykres liniowy (multi-linia) ────────────────────────────────
function LineChart({ series }: {
  series: { points: { year: number; val: number }[]; color: string; label: string }[];
}) {
  const W = 420, H = 210;
  const padT = 14, padB = 26, padL = 54, padR = 12;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const allVals = series.flatMap(s => s.points.map(p => p.val));
  if (allVals.length < 2) return null;

  const maxVal  = Math.max(...allVals, 1);
  const numPts  = series[0]?.points.length ?? 0;
  const magnitude = Math.pow(10, Math.floor(Math.log10(maxVal)));
  const niceStep  = Math.ceil(maxVal / (magnitude * 4)) * magnitude;
  const niceMax   = niceStep * 4;
  const yTicks    = [0, niceStep, niceStep * 2, niceStep * 3, niceStep * 4];

  const toX = (i: number) => padL + (i / (numPts - 1)) * plotW;
  const toY = (v: number) => padT + plotH - (v / niceMax) * plotH;

  const xStep = numPts > 20 ? 5 : numPts > 10 ? 3 : numPts > 6 ? 2 : 1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        {series.map((s, si) => (
          <linearGradient key={si} id={`lc-fill-${si}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={s.color} stopOpacity="0.12" />
            <stop offset="100%" stopColor={s.color} stopOpacity="0.01" />
          </linearGradient>
        ))}
      </defs>

      {yTicks.map(v => (
        <g key={v}>
          {v > 0 && <line x1={padL} y1={toY(v)} x2={W - padR} y2={toY(v)}
            style={{ stroke: 'var(--border-subtle)' }} strokeWidth="1" />}
          <text x={padL - 7} y={toY(v) + 4} textAnchor="end" fontSize="9"
            style={{ fill: 'var(--muted)' }} fontFamily="system-ui, sans-serif">
            {short(v)}
          </text>
        </g>
      ))}
      <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH}
        style={{ stroke: 'var(--border)' }} strokeWidth="1" />

      {series.map((s, si) => {
        const pts = s.points;
        const linePts = pts.map((p, i) => `${toX(i)},${toY(p.val)}`).join(' ');
        const area = `M${padL},${padT + plotH} ` +
          pts.map((p, i) => `L${toX(i)},${toY(p.val)}`).join(' ') +
          ` L${toX(pts.length - 1)},${padT + plotH} Z`;
        return (
          <g key={si}>
            <path d={area} fill={`url(#lc-fill-${si})`} />
            <polyline points={linePts} fill="none" stroke={s.color} strokeWidth={si === 0 ? 2 : 1.5}
              strokeLinejoin="round" strokeLinecap="round"
              strokeDasharray={si === 1 ? '4 3' : si === 2 ? '2 3' : undefined} />
          </g>
        );
      })}

      {series[0]?.points.map((p, i) => {
        if (i !== 0 && i % xStep !== 0 && i !== numPts - 1) return null;
        return (
          <text key={i} x={toX(i)} y={H - 6} textAnchor="middle" fontSize="9"
            style={{ fill: 'var(--muted)' }} fontFamily="system-ui, sans-serif">
            {p.year}r
          </text>
        );
      })}
    </svg>
  );
}

// ─── Wykres słupkowy ─────────────────────────────────────────────
function BarChart({ bars, colors, legend }: {
  bars: { label: string; values: number[] }[];
  colors: string[];
  legend?: string[];
}) {
  const W = 420, H = 220;
  const padT = 36, padB = 26, padL = 10, padR = 10;
  const plotH = H - padT - padB;
  const plotW = W - padL - padR;

  const max  = Math.max(...bars.flatMap(b => b.values), 1);
  const n    = bars[0]?.values.length ?? 1;
  const colW = plotW / bars.length;
  const bW   = Math.min(22, colW * 0.38 / n);
  const gap  = 3;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH}
        style={{ stroke: 'var(--border-subtle)' }} strokeWidth="1" />

      {bars.map((b, i) => {
        const cx = padL + colW * i + colW / 2;
        const totalW = n * bW + (n - 1) * gap;
        const startX = cx - totalW / 2;
        return (
          <g key={i}>
            {b.values.map((v, vi) => {
              const bH = (v / max) * plotH;
              const bY = padT + plotH - bH;
              const bX = startX + vi * (bW + gap);
              return (
                <g key={vi}>
                  <rect x={bX} y={bY} width={bW} height={bH} fill={colors[vi] ?? '#2e7d4f'} rx={2} />
                  <text x={bX + bW / 2} y={bY - 5} textAnchor="middle" fontSize="9"
                    fill={colors[vi] ?? '#2e7d4f'} fontWeight="600" fontFamily="system-ui, sans-serif">
                    {short(v)}
                  </text>
                </g>
              );
            })}
            <text x={cx} y={H - 7} textAnchor="middle" fontSize="9"
              style={{ fill: 'var(--muted)' }} fontFamily="system-ui, sans-serif">
              {b.label}
            </text>
          </g>
        );
      })}

      {legend && legend.map((l, li) => (
        <g key={li}>
          <rect x={padL + li * 64} y={8} width={9} height={9} fill={colors[li]} rx={2} />
          <text x={padL + li * 64 + 13} y={17} fontSize="9"
            style={{ fill: 'var(--muted)' }} fontFamily="system-ui, sans-serif">{l}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── Pasek R:R ───────────────────────────────────────────────────
function RRBar({ risk, reward }: { risk: number; reward: number }) {
  const total = risk + reward;
  const rPct  = (risk   / total) * 100;
  const rePct = (reward / total) * 100;
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', height: 28, borderRadius: 4, overflow: 'hidden', gap: 2 }}>
        <div style={{
          width: `${rPct}%`, background: 'rgba(255,45,120,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#fff', fontWeight: 700,
        }}>
          {rPct.toFixed(0)}%
        </div>
        <div style={{
          width: `${rePct}%`, background: 'rgba(201,162,39,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#030508', fontWeight: 700,
        }}>
          {rePct.toFixed(0)}%
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#ff2d78' }}>Ryzyko</span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#2e7d4f' }}>Potencjalny zysk</span>
      </div>
    </div>
  );
}

// ─── Kamienie milowe (paski CSS) ─────────────────────────────────
function Milestones({ data }: {
  data: { label: string; value: number; secondary?: number }[];
}) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {data.map(d => (
        <div key={d.label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--muted)' }}>{d.label}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text)', fontWeight: 600 }}>
              {fmt(d.value)} PLN
            </span>
          </div>
          <div style={{ height: 3, background: 'var(--border-subtle)', borderRadius: 99 }}>
            <div style={{
              height: '100%', borderRadius: 99, background: '#2e7d4f',
              width: `${Math.round((d.value / max) * 100)}%`,
              transition: 'width 0.4s ease',
            }} />
          </div>
          {d.secondary !== undefined && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--muted)', marginTop: 3 }}>
              z tego wpłaty: {fmt(d.secondary)} PLN
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function Sep() {
  return <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '4px 0' }} />;
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

  // ── Procent składany ──
  const [principal,   setPrincipal]   = useState('10000');
  const [monthly,     setMonthly]     = useState('500');
  const [rate,        setRate]         = useState('8');
  const [years,       setYears]       = useState('10');
  const [inflation,   setInflation]   = useState('2.5');
  const [belka,       setBelka]       = useState(false);

  // ── Risk / Reward ──
  const [entry,       setEntry]       = useState('');
  const [sl,          setSl]          = useState('');
  const [tp,          setTp]          = useState('');
  const [accountSize, setAccountSize] = useState('10000');
  const [riskPct,     setRiskPct]     = useState('1');
  const [winRate,     setWinRate]     = useState('');

  // ── FIRE ──
  const [fireSavings,   setFireSavings]   = useState('50000');
  const [fireSave,      setFireSave]      = useState('2000');
  const [fireExpenses,  setFireExpenses]  = useState('5000');
  const [fireReturn,    setFireReturn]    = useState('7');
  const [fireInflation, setFireInflation] = useState('2.5');

  // ── ETF vs Lokata ──
  const [etfCapital,  setEtfCapital]  = useState('20000');
  const [etfMonthly,  setEtfMonthly]  = useState('1000');
  const [etfYears,    setEtfYears]    = useState('15');
  const [etfRate,     setEtfRate]     = useState('8');
  const [lokataRate,  setLokataRate]  = useState('5');

  // ── DCA ──
  const [dcaMonthly,  setDcaMonthly]  = useState('500');
  const [dcaYears,    setDcaYears]    = useState('10');
  const [dcaRate,     setDcaRate]     = useState('8');
  const [dcaLump,     setDcaLump]     = useState('0');

  // ──────────────────────────────────────────────────────────────
  // OBLICZENIA
  // ──────────────────────────────────────────────────────────────

  const compound = useMemo(() => {
    const P   = parseFloat(principal) || 0;
    const PMT = parseFloat(monthly)   || 0;
    const r   = (parseFloat(rate)     || 0) / 100 / 12;
    const inf = (parseFloat(inflation)|| 0) / 100;
    const t   = Math.min(Math.max(parseInt(years) || 0, 1), 50);
    const snapYears = [1, 2, 3, 5, 10, 15, 20, 25, 30].filter(y => y <= t);
    if (!snapYears.includes(t)) snapYears.push(t);
    snapYears.sort((a, b) => a - b);

    const byYear: Record<number, { total: number; contrib: number }> = {};
    const nomPts:  { year: number; val: number }[] = [];
    const realPts: { year: number; val: number }[] = [];
    const taxPts:  { year: number; val: number }[] = [];

    let balance = P;
    for (let m = 1; m <= t * 12; m++) {
      balance = balance * (1 + r) + PMT;
      if (m % 12 === 0) {
        const y = m / 12;
        const contrib = P + PMT * m;
        const gains   = balance - contrib;
        const afterTax = belka ? contrib + gains * (1 - 0.19) : balance;
        const real     = balance / Math.pow(1 + inf, y);
        nomPts.push({ year: y, val: balance });
        realPts.push({ year: y, val: real });
        taxPts.push({ year: y, val: afterTax });
        byYear[y] = { total: balance, contrib };
      }
    }
    const totalContrib  = P + PMT * t * 12;
    const gains         = balance - totalContrib;
    const afterTaxFinal = belka ? totalContrib + gains * (1 - 0.19) : balance;
    const realFinal     = balance / Math.pow(1 + inf, t);
    const realAfterTax  = afterTaxFinal / Math.pow(1 + inf, t);

    return { final: balance, totalContrib, interest: gains, afterTaxFinal, realFinal, realAfterTax, byYear, snapYears, nomPts, realPts, taxPts };
  }, [principal, monthly, rate, years, inflation, belka]);

  const rr = useMemo(() => {
    const E  = parseFloat(entry), SL = parseFloat(sl), TP = parseFloat(tp);
    const acc = parseFloat(accountSize) || 0;
    const rp  = parseFloat(riskPct)     || 0;
    const wr  = parseFloat(winRate);
    if (!E || !SL || !TP || SL === E || TP === E) return null;
    const isLong = TP > E;
    if (isLong && SL >= E)  return null;
    if (!isLong && SL <= E) return null;
    const riskPer    = Math.abs(E - SL);
    const rewardPer  = Math.abs(TP - E);
    const ratio      = rewardPer / riskPer;
    const riskAmt    = acc * rp / 100;
    const posSize    = riskAmt / riskPer;
    const profitAmt  = posSize * rewardPer;
    const beWinRate  = 100 / (1 + ratio);       // break-even winrate %
    const hasWR      = !isNaN(wr) && wr > 0 && wr <= 100;
    const ev         = hasWR ? ((wr / 100) * rewardPer - (1 - wr / 100) * riskPer) : null;
    const evAmt      = hasWR && ev !== null ? posSize * ev : null;
    return { riskPer, rewardPer, ratio, riskAmt, profitAmt, posSize, isLong, beWinRate, ev, evAmt, hasWR };
  }, [entry, sl, tp, accountSize, riskPct, winRate]);

  const fire = useMemo(() => {
    const savings = parseFloat(fireSavings)   || 0;
    const save    = parseFloat(fireSave)      || 0;
    const exp     = parseFloat(fireExpenses)  || 0;
    const ret     = (parseFloat(fireReturn)   || 0) / 100;
    const inf     = (parseFloat(fireInflation)|| 0) / 100;
    if (exp <= 0) return null;

    // Inflacja-adjusted target
    const swrOptions = [0.03, 0.035, 0.04, 0.05];
    const targets    = swrOptions.map(swr => ({ swr: swr * 100, target: exp * 12 / swr }));
    const mainTarget = exp * 12 * 25; // 4% rule
    const mr = ret / 12;

    // Time to FIRE (main target, no inflation in this calc - classic)
    let balance = savings, months = 0;
    while (balance < mainTarget && months < 600) { balance = balance * (1 + mr) + save; months++; }

    // Time to each SWR target
    const swrTimes = swrOptions.map(swr => {
      const tgt = exp * 12 / swr;
      let b = savings, m = 0;
      while (b < tgt && m < 600) { b = b * (1 + mr) + save; m++; }
      return { swr: swr * 100, target: tgt, months: m, achieved: b >= tgt };
    });

    // Chart: portfolio growth
    const chartYrs = Math.min(Math.ceil((months || 0) / 12) + 5, 50);
    const chartPts: { year: number; val: number }[] = [];
    const targetLine: { year: number; val: number }[] = [];
    let cb = savings;
    for (let m = 1; m <= chartYrs * 12; m++) {
      cb = cb * (1 + mr) + save;
      if (m % 12 === 0) {
        const y = m / 12;
        chartPts.push({ year: y, val: cb });
        targetLine.push({ year: y, val: mainTarget });
      }
    }

    // Inflation-adjusted monthly passive income
    const monthlyPassive = mainTarget * (ret / 12);
    const realPassive    = monthlyPassive / Math.pow(1 + inf, months / 12);

    return {
      mainTarget, savings,
      achieved: balance >= mainTarget,
      yearsToFire: months / 12,
      monthlyPassive, realPassive,
      swrTimes, targets,
      chartPts, targetLine,
    };
  }, [fireSavings, fireSave, fireExpenses, fireReturn, fireInflation]);

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

  const dca = useMemo(() => {
    const PMT   = parseFloat(dcaMonthly) || 0;
    const t     = Math.min(Math.max(parseInt(dcaYears) || 1, 1), 50);
    const rBase = (parseFloat(dcaRate) || 0) / 100;
    const lump  = parseFloat(dcaLump) || 0;

    // 3 scenariusze: pesymistyczny (rBase-3%), realistyczny (rBase), optymistyczny (rBase+3%)
    const scenarios = [
      { label: `${Math.max(rBase * 100 - 3, 1).toFixed(0)}% (pesymistyczny)`, r: Math.max(rBase - 0.03, 0.01), color: '#ff2d78' },
      { label: `${(rBase * 100).toFixed(0)}% (realistyczny)`,                   r: rBase,                        color: '#2e7d4f' },
      { label: `${(rBase * 100 + 3).toFixed(0)}% (optymistyczny)`,               r: rBase + 0.03,                 color: '#10b981' },
    ];

    // DCA końcowe wartości
    const dcaFinals = scenarios.map(s => {
      const mr = s.r / 12;
      let b = lump;
      for (let m = 1; m <= t * 12; m++) b = b * (1 + mr) + PMT;
      return b;
    });

    // Lump sum (wszystko na start) vs DCA dla realistycznego scenariusza
    const totalInvested = lump + PMT * t * 12;
    const lumpSumFinal  = (lump + PMT * t * 12) * Math.pow(1 + rBase / 12, t * 12);

    // Chart dla realistycznego scenariusza
    const chartPts: { year: number; val: number }[][] = scenarios.map(s => {
      const pts: { year: number; val: number }[] = [];
      const mr = s.r / 12;
      let b = lump;
      for (let m = 1; m <= t * 12; m++) {
        b = b * (1 + mr) + PMT;
        if (m % 12 === 0) pts.push({ year: m / 12, val: b });
      }
      return pts;
    });

    // Koszt zwłoki: co tracisz zaczynając 1, 2, 5 lat później
    const delay = [1, 2, 5].filter(d => d < t).map(d => {
      const mr = rBase / 12;
      let b = lump;
      for (let m = 1; m <= (t - d) * 12; m++) b = b * (1 + mr) + PMT;
      return { delayYears: d, final: b, diff: dcaFinals[1] - b };
    });

    return { dcaFinals, lumpSumFinal, totalInvested, scenarios, chartPts, delay };
  }, [dcaMonthly, dcaYears, dcaRate, dcaLump]);

  // ──────────────────────────────────────────────────────────────

  const TABS: { key: Tab; label: string }[] = [
    { key: 'compound', label: 'Procent składany' },
    { key: 'dca',      label: 'DCA' },
    { key: 'rr',       label: 'Risk / Reward' },
    { key: 'fire',     label: 'FIRE' },
    { key: 'etf',      label: 'ETF vs Lokata' },
  ];

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 80px' }}>

      {/* Zakładki */}
      <div style={{ display: 'flex', marginBottom: 48, borderBottom: '1px solid var(--border-subtle)', overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: tab === t.key ? '2px solid #2e7d4f' : '2px solid transparent',
            color: tab === t.key ? 'var(--text)' : 'var(--muted)',
            fontFamily: 'var(--font-body)', fontSize: '0.92rem',
            fontWeight: tab === t.key ? 600 : 400,
            padding: '10px 18px 12px', marginBottom: -1,
            transition: 'color 0.15s', whiteSpace: 'nowrap',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── PROCENT SKŁADANY ─────────────────────────────────────── */}
      {tab === 'compound' && (
        <>
          <div className="calc-grid">
            {/* Karta wejść */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '26px 26px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Field label="Kapitał startowy (PLN)" value={principal} onChange={setPrincipal} step="1000" />
              <Field label="Miesięczna wpłata (PLN)" value={monthly} onChange={setMonthly} step="100" />
              <Sep />
              <Field label="Roczna stopa zwrotu (%)" value={rate} onChange={setRate} step="0.5"
                hint="Średni roczny wynik S&P 500 (z dywidendami) to ok. 10%." />
              <Field label="Liczba lat" value={years} onChange={setYears} step="1" min="1" max="50" />
              <Sep />
              <Field label="Inflacja roczna (%)" value={inflation} onChange={setInflation} step="0.5"
                hint="Realna wartość pieniądza spada. Historyczna średnia to ok. 2-3%." />
              <Toggle
                label="Uwzględnij podatek Belki (19%)"
                checked={belka}
                onChange={setBelka}
                hint="Podatek od zysku kapitałowego w Polsce."
              />
            </div>

            {/* Panel wyników */}
            <div style={{ background: 'rgba(46,125,79,0.06)', border: '1px solid rgba(46,125,79,0.18)', borderRadius: 16, padding: '26px 26px' }}>
              <MainResult
                label={`Wartość portfela po ${years} latach (nominalna)`}
                value={`${fmt(compound.final)} PLN`}
                sub={`wpłaty: ${fmt(compound.totalContrib)} PLN · zysk: ${fmt(compound.interest)} PLN`}
              />

              <Row icon={<IcoWplaty />}  label="Twoje wpłaty łącznie" value={`${fmt(compound.totalContrib)} PLN`} />
              <Row icon={<IcoZysk />}    label="Zysk z inwestowania"  value={`${fmt(compound.interest)} PLN`} color="#2e7d4f" large />
              {belka && (
                <Row icon={<IcoBelka />} label="Po podatku Belki (19%)" value={`${fmt(compound.afterTaxFinal)} PLN`}
                  color="#6b9c7e" sub={`podatek: ${fmt(compound.interest * 0.19)} PLN`} />
              )}
              <Row icon={<IcoRealna />}  label="Realna wartość (po inflacji)"
                value={`${fmt(belka ? compound.realAfterTax : compound.realFinal)} PLN`}
                sub="siła nabywcza w dzisiejszych złotych" />
              <Row icon={<IcoMnoznik />} label="Mnożnik wpłat"
                value={compound.totalContrib > 0 ? `×${fmtD(compound.final / compound.totalContrib, 1)}` : '-'} />
            </div>
          </div>

          {/* Wykres + kamienie milowe (pełna szerokość) */}
          {compound.nomPts.length >= 2 && (
            <div style={{ marginTop: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 26px' }}>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 10 }}>
                {[
                  { color: '#2e7d4f', label: 'Nominalna' },
                  ...(inflation !== '0' ? [{ color: '#8a94a0', label: 'Realna (po inflacji)' }] : []),
                  ...(belka ? [{ color: '#6b9c7e', label: 'Po podatku Belki' }] : []),
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 20, height: 2, background: s.color }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--muted)' }}>{s.label}</span>
                  </div>
                ))}
              </div>
              <LineChart series={[
                { points: compound.nomPts,  color: '#2e7d4f', label: 'Nominalna' },
                ...(inflation !== '0' ? [{ points: compound.realPts, color: '#8a94a0', label: 'Realna' }] : []),
                ...(belka ? [{ points: compound.taxPts, color: '#6b9c7e', label: 'Po Belce' }] : []),
              ]} />

              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 14 }}>
                  Wartości nominalne w czasie
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
          )}
        </>
      )}

      {/* ── DCA ──────────────────────────────────────────────────── */}
      {tab === 'dca' && (
        <div className="calc-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <Sep />
            <Field label="Miesięczna wpłata (PLN)" value={dcaMonthly} onChange={setDcaMonthly} step="100" />
            <Field label="Kapitał startowy (PLN)" value={dcaLump} onChange={setDcaLump} step="1000" />
            <Sep />
            <Field label="Oczekiwana stopa zwrotu — realistyczna (%)" value={dcaRate} onChange={setDcaRate} step="0.5" />
            <Field label="Horyzont inwestycji (lat)" value={dcaYears} onChange={setDcaYears} step="1" min="1" max="50" />
          </div>

          <div>
            <MainResult
              label={`DCA przez ${dcaYears} lat — scenariusz realistyczny`}
              value={`${fmt(dca.dcaFinals[1])} PLN`}
              sub={`wpłacono: ${fmt(dca.totalInvested)} PLN · zysk: ${fmt(dca.dcaFinals[1] - dca.totalInvested)} PLN`}
            />

            {/* Scenariusze */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
              {dca.scenarios.map((s, i) => (
                <div key={i} style={{
                  background: 'var(--surface)', border: `1px solid ${s.color}33`,
                  padding: '12px', borderTop: `2px solid ${s.color}`,
                }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: s.color, marginBottom: 6, fontWeight: 600 }}>
                    {s.label.split(' ')[0]} %
                  </p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: s.color, lineHeight: 1, margin: '0 0 4px' }}>
                    {fmt(dca.dcaFinals[i])} PLN
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--muted)', margin: 0 }}>
                    +{fmt(dca.dcaFinals[i] - dca.totalInvested)} zysk
                  </p>
                </div>
              ))}
            </div>

            <Row label="Łącznie wpłacono"    value={`${fmt(dca.totalInvested)} PLN`} />
            <Row label="DCA (realistyczny)"   value={`${fmt(dca.dcaFinals[1])} PLN`}  color="#2e7d4f" large />
            <Row
              label={`Lump sum (całość na start przy ${dcaRate}%)`}
              value={`${fmt(dca.lumpSumFinal)} PLN`}
              color={dca.lumpSumFinal > dca.dcaFinals[1] ? '#8a94a0' : 'var(--muted)'}
              sub={dca.lumpSumFinal > dca.dcaFinals[1] ? 'lump sum wypada lepiej' : 'DCA wypada lepiej'}
            />

            {/* Koszt zwłoki */}
            {dca.delay.length > 0 && (
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 12 }}>
                  Koszt zwłoki — ile tracisz zaczynając później
                </p>
                {dca.delay.map(d => (
                  <div key={d.delayYears} style={{
                    display: 'flex', justifyContent: 'space-between', padding: '8px 0',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--muted)' }}>
                      Zaczynasz za {d.delayYears} {d.delayYears === 1 ? 'rok' : 'lata'}
                    </span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: '#ff2d78', fontWeight: 600 }}>
                      -{fmt(d.diff)} PLN
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Wykres 3 scenariuszy */}
            {dca.chartPts[0].length >= 2 && (
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 10 }}>
                  {dca.scenarios.map(s => (
                    <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 20, height: 2, background: s.color }} />
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--muted)' }}>
                        {s.label.split(' ')[0]}%
                      </span>
                    </div>
                  ))}
                </div>
                <LineChart series={dca.scenarios.map((s, i) => ({
                  points: dca.chartPts[i],
                  color: s.color,
                  label: s.label,
                }))} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── RISK / REWARD ────────────────────────────────────────── */}
      {tab === 'rr' && (
        <div className="calc-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <Field label="Cena wejścia"  value={entry} onChange={setEntry} placeholder="np. 100.00" />
            <Field label="Stop Loss"     value={sl}    onChange={setSl}    placeholder="np. 97.50" />
            <Field label="Take Profit"   value={tp}    onChange={setTp}    placeholder="np. 107.50" />
            <Sep />
            <Field label="Wielkość konta (PLN)"     value={accountSize} onChange={setAccountSize} step="1000" />
            <Field label="Ryzyko na transakcję (%)" value={riskPct}     onChange={setRiskPct}     step="0.1"
              hint="Zalecane: 1-2% kapitału na jedną transakcję." />
            <Sep />
            <Field label="Twój winrate (%) — opcjonalnie" value={winRate} onChange={setWinRate}
              placeholder="np. 55" step="1" min="1" max="100"
              hint="Wpisz swój historyczny % wygranych żeby zobaczyć oczekiwaną wartość (EV)." />
          </div>

          <div>
            {rr ? (
              <>
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 8 }}>
                    Stosunek zysku do ryzyka — {rr.isLong ? 'pozycja długa' : 'pozycja krótka'}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-display)', fontSize: '3.8rem', lineHeight: 1,
                    color: rr.ratio >= 2 ? '#2e7d4f' : rr.ratio >= 1 ? '#6b9c7e' : '#ff2d78',
                  }}>
                    1&thinsp;:&thinsp;{rr.ratio.toFixed(2)}
                  </p>
                </div>

                {/* Wizualny pasek R:R */}
                <RRBar risk={rr.riskPer} reward={rr.rewardPer} />

                <Row label="Kwota ryzyka"       value={`${fmt(rr.riskAmt)} PLN`}   color="#ff2d78" />
                <Row label="Potencjalny zysk"   value={`${fmt(rr.profitAmt)} PLN`} color="#2e7d4f" large />
                <Row label="Ryzyko / jednostka" value={rr.riskPer.toFixed(4)} />
                <Row label="Zysk / jednostka"   value={rr.rewardPer.toFixed(4)} />
                <Row label="Wielkość pozycji"   value={`${fmtD(rr.posSize, 2)} jednostek`} />

                {/* Break-even winrate */}
                <div style={{ marginTop: 20, padding: '14px 16px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 4 }}>
                    Break-even winrate — minimalny % wygranych żeby wychodzić na zero
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-display)', fontSize: '2rem', lineHeight: 1,
                    color: rr.beWinRate < 40 ? '#10b981' : rr.beWinRate < 50 ? '#2e7d4f' : '#ff2d78',
                  }}>
                    {rr.beWinRate.toFixed(1)}%
                  </p>
                </div>

                {/* Expected Value (jeśli podano winrate) */}
                {rr.hasWR && rr.ev !== null && rr.evAmt !== null && (
                  <div style={{ marginTop: 12, padding: '14px 16px', background: 'var(--surface)', border: `1px solid ${rr.ev >= 0 ? 'rgba(16,185,129,0.3)' : 'rgba(255,45,120,0.3)'}` }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 4 }}>
                      Oczekiwana wartość (EV) przy winrate {winRate}%
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-display)', fontSize: '1.8rem', lineHeight: 1,
                      color: rr.ev >= 0 ? '#10b981' : '#ff2d78',
                    }}>
                      {rr.ev >= 0 ? '+' : ''}{fmtD(rr.ev, 4)} / jednostkę
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: rr.ev >= 0 ? '#10b981' : '#ff2d78', marginTop: 6, fontWeight: 600 }}>
                      {rr.ev >= 0 ? '+' : ''}{fmt(rr.evAmt)} PLN na tej transakcji
                    </p>
                  </div>
                )}

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
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.8 }}>
                Wpisz cenę wejścia, stop loss i take profit po lewej, żeby zobaczyć wyniki.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── FIRE ─────────────────────────────────────────────────── */}
      {tab === 'fire' && (
        <div className="calc-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <Field label="Obecne oszczędności (PLN)"        value={fireSavings}   onChange={setFireSavings}   step="5000" />
            <Field label="Miesięczne oszczędności (PLN)"    value={fireSave}      onChange={setFireSave}      step="100" />
            <Sep />
            <Field label="Miesięczne wydatki po FIRE (PLN)" value={fireExpenses}  onChange={setFireExpenses}  step="500" />
            <Field label="Oczekiwana stopa zwrotu (%)"      value={fireReturn}    onChange={setFireReturn}    step="0.5" />
            <Field label="Inflacja roczna (%)"              value={fireInflation} onChange={setFireInflation} step="0.5"
              hint="Wpływa na realną wartość pasywnego dochodu." />
          </div>

          <div>
            {fire ? (
              <>
                <MainResult label="Twój cel FIRE (reguła 4%)" value={`${fmt(fire.mainTarget)} PLN`} sub="25× rocznych wydatków" />
                {fire.achieved ? (
                  <MainResult
                    label="Czas do wolności finansowej" color="#10b981"
                    value={fire.yearsToFire < 1
                      ? `${Math.ceil(fire.yearsToFire * 12)} miesięcy`
                      : `${Math.floor(fire.yearsToFire)} lat ${Math.round((fire.yearsToFire % 1) * 12)} mies.`}
                  />
                ) : (
                  <div style={{
                    background: 'rgba(255,45,120,0.05)', border: '1px solid rgba(255,45,120,0.2)',
                    padding: '14px 16px', marginBottom: 24,
                  }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: '#ff2d78', lineHeight: 1.7, margin: 0 }}>
                      Przy tych parametrach FIRE nie jest osiągalny w ciągu 50 lat.<br />
                      Zwiększ miesięczne oszczędności lub stopę zwrotu.
                    </p>
                  </div>
                )}

                <Row label="Już odłożone"            value={`${fmt(fire.savings)} PLN`} />
                <Row label="Brakuje do celu (4%)"    value={`${fmt(Math.max(0, fire.mainTarget - fire.savings))} PLN`} />
                <Row label="Pasywny dochód miesięczny (nominalny)" value={`${fmt(fire.monthlyPassive)} PLN`} color="#10b981" large />
                <Row label="Pasywny dochód (w dzisiejszych złotych)" value={`${fmt(fire.realPassive)} PLN`} color="var(--muted)" />

                {/* Porównanie SWR */}
                <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 12 }}>
                    Porównanie różnych bezpiecznych stóp wypłaty (SWR)
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {fire.swrTimes.map(s => (
                      <div key={s.swr} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '10px 14px',
                        background: s.swr === 4 ? 'rgba(201,162,39,0.05)' : 'var(--surface)',
                        border: `1px solid ${s.swr === 4 ? 'rgba(201,162,39,0.3)' : 'var(--border)'}`,
                      }}>
                        <div>
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: s.swr === 4 ? 700 : 400, color: 'var(--text)' }}>
                            SWR {s.swr}%
                            {s.swr === 4 ? ' ✓' : s.swr === 3 ? ' — konserwatywna' : s.swr === 5 ? ' — agresywna' : ''}
                          </span>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)' }}>
                            cel: {fmt(s.target)} PLN
                          </div>
                        </div>
                        <span style={{
                          fontFamily: 'var(--font-body)', fontSize: '0.92rem', fontWeight: 700,
                          color: s.achieved ? '#10b981' : '#ff2d78',
                        }}>
                          {s.achieved
                            ? `${Math.floor(s.months / 12)}l ${Math.round(s.months % 12)}m`
                            : '> 50 lat'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Wykres wzrostu portfela */}
                {fire.chartPts.length >= 2 && (
                  <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 20, height: 2, background: '#2e7d4f' }} />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--muted)' }}>Portfel</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 20, height: 2, background: '#ff2d78' }} />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--muted)' }}>Cel FIRE (4%)</span>
                      </div>
                    </div>
                    <LineChart series={[
                      { points: fire.chartPts,    color: '#2e7d4f', label: 'Portfel' },
                      { points: fire.targetLine,  color: '#ff2d78', label: 'Cel' },
                    ]} />
                  </div>
                )}
              </>
            ) : (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.8 }}>
                Wpisz miesięczne wydatki po FIRE, żeby obliczyć swój cel.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── ETF vs LOKATA ────────────────────────────────────────── */}
      {tab === 'etf' && (
        <div className="calc-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <Field label="Kapitał startowy (PLN)"         value={etfCapital}  onChange={setEtfCapital}  step="1000" />
            <Field label="Miesięczna wpłata (PLN)"        value={etfMonthly}  onChange={setEtfMonthly}  step="100" />
            <Field label="Liczba lat"                     value={etfYears}    onChange={setEtfYears}    step="1" />
            <Sep />
            <Field label="Roczna stopa zwrotu ETF (%)"   value={etfRate}    onChange={setEtfRate}    step="0.5"
              hint="Np. 7-10% dla szerokiego indeksu globalnego." />
            <Field label="Oprocentowanie lokaty (%)"     value={lokataRate} onChange={setLokataRate} step="0.5" />
          </div>

          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 28 }}>
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#2e7d4f', marginBottom: 6, fontWeight: 600 }}>ETF</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: '#2e7d4f', lineHeight: 1 }}>
                  {fmt(etf.finalETF)} PLN
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--muted)', marginTop: 6 }}>
                  zysk: +{fmt(etf.etfInterest)} PLN
                </p>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#8a94a0', marginBottom: 6, fontWeight: 600 }}>Lokata</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: '#8a94a0', lineHeight: 1 }}>
                  {fmt(etf.finalLok)} PLN
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--muted)', marginTop: 6 }}>
                  zysk: +{fmt(etf.lokInterest)} PLN
                </p>
              </div>
            </div>

            <Row label="Twoje wpłaty łącznie" value={`${fmt(etf.totalContrib)} PLN`} />
            <Row
              label="ETF zarobi więcej o"
              value={`${etf.diff >= 0 ? '+' : ''}${fmt(etf.diff)} PLN`}
              color={etf.diff >= 0 ? '#2e7d4f' : '#ff2d78'}
              large
            />

            {etf.chartYears.length >= 2 && (
              <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
                <BarChart
                  bars={etf.chartYears
                    .filter(y => etf.byYear[y])
                    .map(y => ({ label: `${y}r`, values: [etf.byYear[y].etf, etf.byYear[y].lok] }))}
                  colors={['#2e7d4f', '#8a94a0']}
                  legend={['ETF', 'Lokata']}
                />
              </div>
            )}

            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.76rem', color: 'var(--muted)', lineHeight: 1.65, marginTop: 16 }}>
              Wyniki szacunkowe. Nie uwzględniono podatku Belki (19%), opłat za zarządzanie funduszem ani inflacji.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
