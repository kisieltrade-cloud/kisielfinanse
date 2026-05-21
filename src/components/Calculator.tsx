'use client';

import { useState, useMemo } from 'react';

type Tab = 'compound' | 'rr';

const fmt = (n: number) => Math.round(n).toLocaleString('pl-PL');

function CompoundChart({ data }: { data: { year: number; total: number; contributions: number }[] }) {
  if (data.length < 2) return null;
  const W = 400, H = 180;
  const pad = { top: 10, right: 10, bottom: 28, left: 10 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;
  const maxVal = Math.max(...data.map(d => d.total));

  const toX = (i: number) => pad.left + (i / (data.length - 1)) * plotW;
  const toY = (val: number) => pad.top + plotH - (val / maxVal) * plotH;

  const totalArea =
    `M${pad.left},${pad.top + plotH} ` +
    data.map((d, i) => `L${toX(i)},${toY(d.total)}`).join(' ') +
    ` L${toX(data.length - 1)},${pad.top + plotH} Z`;

  const contribArea =
    `M${pad.left},${pad.top + plotH} ` +
    data.map((d, i) => `L${toX(i)},${toY(d.contributions)}`).join(' ') +
    ` L${toX(data.length - 1)},${pad.top + plotH} Z`;

  const totalPoints = data.map((d, i) => `${toX(i)},${toY(d.total)}`).join(' ');
  const contribPoints = data.map((d, i) => `${toX(i)},${toY(d.contributions)}`).join(' ');

  const step = data.length > 15 ? 5 : data.length > 7 ? 2 : 1;
  const xLabels = data.filter((_, i) => i === 0 || (i + 1) % step === 0 || i === data.length - 1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="cg-total" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a227" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#c9a227" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="cg-contrib" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8963a" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#e8963a" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={totalArea} fill="url(#cg-total)" />
      <path d={contribArea} fill="url(#cg-contrib)" />
      <polyline points={totalPoints} fill="none" stroke="#c9a227" strokeWidth="2" strokeLinejoin="round" />
      <polyline points={contribPoints} fill="none" stroke="#e8963a" strokeWidth="1.5" strokeDasharray="4,3" strokeLinejoin="round" />
      {xLabels.map((d) => {
        const idx = data.findIndex(dd => dd.year === d.year);
        return (
          <text key={d.year} x={toX(idx)} y={H - 6} textAnchor="middle" fontSize="8" fill="#3a4a5a" fontFamily="monospace">
            {d.year}r
          </text>
        );
      })}
    </svg>
  );
}

const INPUT: React.CSSProperties = {
  background: '#080d14',
  border: '1px solid rgba(201,162,39,0.12)',
  color: '#e8edf5',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.88rem',
  padding: '10px 14px',
  width: '100%',
  outline: 'none',
  boxSizing: 'border-box',
  borderRadius: 0,
};

const LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.58rem',
  letterSpacing: '1.5px',
  color: '#5a6478',
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: 6,
};

export default function Calculator() {
  const [tab, setTab] = useState<Tab>('compound');

  const [principal, setPrincipal] = useState('10000');
  const [monthly, setMonthly] = useState('500');
  const [rate, setRate] = useState('8');
  const [years, setYears] = useState('10');

  const [entry, setEntry] = useState('');
  const [sl, setSl] = useState('');
  const [tp, setTp] = useState('');
  const [accountSize, setAccountSize] = useState('10000');
  const [riskPct, setRiskPct] = useState('1');

  const compound = useMemo(() => {
    const P = parseFloat(principal) || 0;
    const PMT = parseFloat(monthly) || 0;
    const r = (parseFloat(rate) || 0) / 100 / 12;
    const t = Math.min(Math.max(parseInt(years) || 0, 1), 50);
    const months = t * 12;

    const yearlyData: { year: number; total: number; contributions: number }[] = [];
    let balance = P;
    for (let m = 1; m <= months; m++) {
      balance = balance * (1 + r) + PMT;
      if (m % 12 === 0) {
        yearlyData.push({ year: m / 12, total: balance, contributions: P + PMT * m });
      }
    }
    const totalContributions = P + PMT * months;
    return { final: balance, totalContributions, totalInterest: balance - totalContributions, yearlyData };
  }, [principal, monthly, rate, years]);

  const rr = useMemo(() => {
    const E = parseFloat(entry), SL = parseFloat(sl), TP = parseFloat(tp);
    const acc = parseFloat(accountSize) || 0;
    const rp = parseFloat(riskPct) || 0;
    if (!E || !SL || !TP || SL === E || TP === E) return null;
    const isLong = TP > E;
    if (isLong && SL >= E) return null;
    if (!isLong && SL <= E) return null;
    const riskPer = Math.abs(E - SL);
    const rewardPer = Math.abs(TP - E);
    const ratio = rewardPer / riskPer;
    const riskAmt = acc * rp / 100;
    const posSize = riskAmt / riskPer;
    const profitAmt = posSize * rewardPer;
    return { riskPer, rewardPer, ratio, riskAmt, profitAmt, posSize, isLong };
  }, [entry, sl, tp, accountSize, riskPct]);

  const tabBtn = (key: Tab, label: string) => (
    <button
      onClick={() => setTab(key)}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        borderBottom: tab === key ? '2px solid #c9a227' : '2px solid transparent',
        color: tab === key ? '#c9a227' : '#5a6478',
        fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
        letterSpacing: '1.5px', textTransform: 'uppercase',
        padding: '12px 28px 14px', marginBottom: -1,
        transition: 'color 0.2s',
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
      <div style={{ display: 'flex', gap: 2, marginBottom: 40, borderBottom: '1px solid rgba(201,162,39,0.1)' }}>
        {tabBtn('compound', 'Procent składany')}
        {tabBtn('rr', 'Risk / Reward')}
      </div>

      {/* ── COMPOUND ── */}
      {tab === 'compound' && (
        <div className="calc-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {([
              ['Kapitał startowy (PLN)', principal, setPrincipal, '0'],
              ['Miesięczna wpłata (PLN)', monthly, setMonthly, '0'],
              ['Roczna stopa zwrotu (%)', rate, setRate, '0.1'],
              ['Liczba lat', years, setYears, '1'],
            ] as [string, string, (v: string) => void, string][]).map(([lbl, val, set, step]) => (
              <div key={lbl}>
                <label style={LABEL}>{lbl}</label>
                <input style={INPUT} type="number" value={val} step={step} onChange={e => set(e.target.value)} />
              </div>
            ))}
          </div>

          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '2px', color: '#5a6478', textTransform: 'uppercase', marginBottom: 8 }}>
                Końcowa wartość po {years} latach
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: '#c9a227', letterSpacing: '2px', lineHeight: 1 }}>
                {fmt(compound.final)} PLN
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'Twoje wpłaty', val: `${fmt(compound.totalContributions)} PLN`, color: '#e8963a' },
                { label: 'Zysk z odsetek', val: `${fmt(compound.totalInterest)} PLN`, color: '#c9a227' },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ background: '#080d14', borderLeft: `3px solid ${color}`, border: `1px solid ${color}22`, padding: '12px 14px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#5a6478', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color, fontWeight: 600 }}>{val}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#080d14', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 6, padding: '14px 12px 8px' }}>
              <CompoundChart data={compound.yearlyData} />
              <div style={{ display: 'flex', gap: 16, paddingLeft: 4, marginTop: 4 }}>
                {[['#c9a227', 'Łącznie', false], ['#e8963a', 'Wpłaty', true]].map(([c, lbl, dashed]) => (
                  <div key={lbl as string} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="18" height="8"><line x1="0" y1="4" x2="18" y2="4" stroke={c as string} strokeWidth="2" strokeDasharray={dashed ? '4,3' : undefined} /></svg>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#5a6478' }}>{lbl as string}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── RISK/REWARD ── */}
      {tab === 'rr' && (
        <div className="calc-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {([
              ['Cena wejścia', entry, setEntry, 'np. 100.00'],
              ['Stop Loss', sl, setSl, 'np. 97.50'],
              ['Take Profit', tp, setTp, 'np. 107.50'],
            ] as [string, string, (v: string) => void, string][]).map(([lbl, val, set, ph]) => (
              <div key={lbl}>
                <label style={LABEL}>{lbl}</label>
                <input style={INPUT} type="number" value={val} placeholder={ph} step="any" onChange={e => set(e.target.value)} />
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 20 }}>
              <label style={LABEL}>Wielkość konta (PLN)</label>
              <input style={INPUT} type="number" value={accountSize} onChange={e => setAccountSize(e.target.value)} />
            </div>
            <div>
              <label style={LABEL}>Ryzyko na transakcję (%)</label>
              <input style={INPUT} type="number" value={riskPct} step="0.1" min="0.1" max="100" onChange={e => setRiskPct(e.target.value)} />
            </div>
          </div>

          <div>
            {rr ? (
              <>
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '2px', color: '#5a6478', textTransform: 'uppercase', marginBottom: 8 }}>
                    Risk / Reward Ratio
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '3rem', letterSpacing: '2px', lineHeight: 1,
                    color: rr.ratio >= 2 ? '#c9a227' : rr.ratio >= 1 ? '#f5c518' : '#ff2d78',
                  }}>
                    1 : {rr.ratio.toFixed(2)}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#5a6478', marginTop: 6 }}>
                    {rr.isLong ? 'Pozycja długa (Long)' : 'Pozycja krótka (Short)'}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {([
                    ['Ryzyko na jednostkę', rr.riskPer.toFixed(4), '#ff2d78'],
                    ['Zysk na jednostkę', rr.rewardPer.toFixed(4), '#c9a227'],
                    ['Kwota ryzyka', `${fmt(rr.riskAmt)} PLN`, '#ff2d78'],
                    ['Potencjalny zysk', `${fmt(rr.profitAmt)} PLN`, '#c9a227'],
                    ['Wielkość pozycji', `${rr.posSize.toFixed(2)} jedn.`, '#e8963a'],
                  ] as [string, string, string][]).map(([lbl, val, color]) => (
                    <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#080d14', border: '1px solid rgba(255,255,255,0.04)', padding: '10px 14px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#5a6478' }}>{lbl}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color, fontWeight: 600 }}>{val}</span>
                    </div>
                  ))}
                </div>

                {rr.ratio < 1 && (
                  <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(255,45,120,0.06)', border: '1px solid rgba(255,45,120,0.2)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#ff2d78', lineHeight: 1.6 }}>
                    ⚠ R:R poniżej 1:1 — ryzykujesz więcej niż możesz zyskać.
                  </div>
                )}
              </>
            ) : (
              <div style={{ color: '#3a4a5a', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', lineHeight: 2 }}>
                Wpisz cenę wejścia, stop loss i take profit<br />
                żeby zobaczyć wyniki.<br />
                <span style={{ color: '#1e2d3d', fontSize: '0.65rem' }}>
                  SL musi być poniżej ceny wejścia (long) lub powyżej (short).
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
