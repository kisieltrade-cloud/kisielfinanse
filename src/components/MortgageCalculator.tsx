'use client';

import { useState, useMemo } from 'react';

const fmt   = (n: number) => Math.round(n).toLocaleString('pl-PL');
const short = (n: number) => {
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)} M`;
  if (n >= 1_000)     return `${Math.round(n / 1_000)} k`;
  return String(Math.round(n));
};

// ─── Pole formularza ─────────────────────────────────────────────
function Field({ label, value, onChange, step, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  step?: string; hint?: string;
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
        type="number" value={value} step={step ?? 'any'}
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

// ─── Dwie linie — saldo zadłużenia ───────────────────────────────
function BalanceChart({ points }: {
  points: { year: number; annuity: number; decreasing: number }[];
}) {
  const W = 420, H = 210;
  const padT = 14, padB = 26, padL = 56, padR = 12;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  if (points.length < 2) return null;

  const maxVal = Math.max(...points.flatMap(p => [p.annuity, p.decreasing]), 1);
  const magnitude = Math.pow(10, Math.floor(Math.log10(maxVal)));
  const niceStep  = Math.ceil(maxVal / (magnitude * 4)) * magnitude;
  const niceMax   = niceStep * 4;
  const yTicks    = [0, niceStep, niceStep * 2, niceStep * 3, niceStep * 4];

  const toX = (i: number) => padL + (i / (points.length - 1)) * plotW;
  const toY = (v: number) => padT + plotH - (v / niceMax) * plotH;

  const annuityPts   = points.map((p, i) => `${toX(i)},${toY(p.annuity)}`).join(' ');
  const decreasingPts = points.map((p, i) => `${toX(i)},${toY(p.decreasing)}`).join(' ');

  const xStep = points.length > 20 ? 5 : points.length > 10 ? 3 : 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* Linie pomocnicze + osi Y */}
      {yTicks.map(v => (
        <g key={v}>
          {v > 0 && (
            <line x1={padL} y1={toY(v)} x2={W - padR} y2={toY(v)}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          )}
          <text x={padL - 7} y={toY(v) + 4}
            textAnchor="end" fontSize="9" fill="#4a5a6a"
            fontFamily="system-ui, sans-serif">
            {short(v)}
          </text>
        </g>
      ))}

      {/* Linia bazowa */}
      <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH}
        stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

      {/* Raty równe — złoty */}
      <polyline points={annuityPts} fill="none"
        stroke="#c9a227" strokeWidth="2"
        strokeLinejoin="round" strokeLinecap="round" />

      {/* Raty malejące — niebieski */}
      <polyline points={decreasingPts} fill="none"
        stroke="#4a9eff" strokeWidth="2" strokeDasharray="5,3"
        strokeLinejoin="round" strokeLinecap="round" />

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

      {/* Legenda */}
      <rect x={padL} y={5} width={10} height={3} fill="#c9a227" rx={1} />
      <text x={padL + 14} y={11} fontSize="9" fill="#c8d4e8" fontFamily="system-ui, sans-serif">Raty równe</text>
      <line x1={padL + 72} y1={7} x2={padL + 82} y2={7}
        stroke="#4a9eff" strokeWidth="2" strokeDasharray="4,2" />
      <text x={padL + 86} y={11} fontSize="9" fill="#c8d4e8" fontFamily="system-ui, sans-serif">Raty malejące</text>
    </svg>
  );
}

// ─── GŁÓWNY KOMPONENT ────────────────────────────────────────────
export default function MortgageCalculator() {
  const [amount, setAmount] = useState('450000');
  const [rate,   setRate]   = useState('7.5');
  const [term,   setTerm]   = useState('25');

  const calc = useMemo(() => {
    const P    = parseFloat(amount) || 0;
    const ann  = parseFloat(rate)   || 0;
    const yrs  = Math.max(1, Math.min(parseInt(term) || 1, 35));
    const r    = ann / 100 / 12;
    const n    = yrs * 12;

    // Raty równe (annuity)
    const M = r > 0
      ? P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      : P / n;
    const annuityTotal    = M * n;
    const annuityInterest = annuityTotal - P;

    // Raty malejące
    const principalPart = P / n;
    let decInterest = 0, decFirst = 0, decLast = 0;
    let decBal = P, annBal = P;
    const chartPoints: { year: number; annuity: number; decreasing: number }[] = [];

    for (let i = 0; i < n; i++) {
      const intPart = decBal * r;
      const payment = principalPart + intPart;
      if (i === 0)     decFirst = payment;
      if (i === n - 1) decLast  = payment;
      decInterest += intPart;
      decBal -= principalPart;
      annBal  = annBal * (1 + r) - M;

      if ((i + 1) % 12 === 0) {
        chartPoints.push({
          year:       (i + 1) / 12,
          annuity:    Math.max(0, annBal),
          decreasing: Math.max(0, decBal),
        });
      }
    }

    const saving = annuityInterest - decInterest;

    return {
      P, M, annuityTotal, annuityInterest,
      decFirst, decLast,
      decInterest, decTotal: P + decInterest,
      saving, chartPoints, yrs,
    };
  }, [amount, rate, term]);

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 80px' }}>
      <div className="calc-grid">

        {/* ── Lewa: inputs ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Field
            label="Kwota kredytu (PLN)"
            value={amount}
            onChange={setAmount}
            step="10000"
          />
          <Field
            label="Oprocentowanie roczne (%)"
            value={rate}
            onChange={setRate}
            step="0.1"
            hint="Oprocentowanie = stopa referencyjna (WIBOR/WIRON) + marża banku. Dziś typowo 7–8%."
          />
          <Field
            label="Okres kredytowania (lata)"
            value={term}
            onChange={setTerm}
            step="1"
            hint="Maksymalny okres kredytu hipotecznego w Polsce to 35 lat."
          />

          {/* Pigułka z info o ratach */}
          <div style={{
            padding: '14px 16px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 4,
          }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: '#c8d4e8', lineHeight: 1.75, margin: 0 }}>
              <strong style={{ color: '#c9a227' }}>Raty równe</strong> — stała kwota przez cały okres. Wygodne, ale łącznie płacisz więcej odsetek.<br />
              <strong style={{ color: '#4a9eff' }}>Raty malejące</strong> — pierwsza rata wyższa, potem spada. Łącznie taniej, ale wymaga większej zdolności kredytowej na start.
            </p>
          </div>
        </div>

        {/* ── Prawa: wyniki ── */}
        <div>

          {/* Rata miesięczna — główny wynik */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: '#c8d4e8', marginBottom: 8 }}>
              Rata miesięczna (raty równe)
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: '#c9a227', lineHeight: 1 }}>
              {fmt(calc.M)} PLN
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#c8d4e8', marginTop: 8 }}>
              stała kwota przez {calc.yrs} {calc.yrs === 1 ? 'rok' : calc.yrs < 5 ? 'lata' : 'lat'}
            </p>
          </div>

          <Row label="Kwota kredytu"    value={`${fmt(calc.P)} PLN`} />
          <Row label="Łączne odsetki"   value={`${fmt(calc.annuityInterest)} PLN`} color="#ff2d78" large />
          <Row label="Całkowity koszt"  value={`${fmt(calc.annuityTotal)} PLN`} />

          {/* Raty malejące */}
          <div style={{
            marginTop: 24, padding: '16px 20px',
            background: 'rgba(74,158,255,0.04)',
            border: '1px solid rgba(74,158,255,0.15)',
            borderLeft: '3px solid #4a9eff',
          }}>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.82rem',
              color: '#4a9eff', fontWeight: 600, marginBottom: 12,
            }}>
              Raty malejące — porównanie
            </p>
            <Row label="Pierwsza rata"             value={`${fmt(calc.decFirst)} PLN`} />
            <Row label="Ostatnia rata"             value={`${fmt(calc.decLast)} PLN`} />
            <Row label="Łączne odsetki"            value={`${fmt(calc.decInterest)} PLN`} />
            <Row
              label="Oszczędność na odsetkach"
              value={`${calc.saving >= 0 ? '+' : ''}${fmt(calc.saving)} PLN`}
              color="#c9a227"
              large
            />
          </div>

          {/* Wykres salda */}
          {calc.chartPoints.length >= 2 && (
            <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#c8d4e8', marginBottom: 12 }}>
                Pozostały dług w czasie (PLN)
              </p>
              <BalanceChart points={calc.chartPoints} />
            </div>
          )}

          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.75rem',
            color: '#3a4a5a', lineHeight: 1.65, marginTop: 20,
          }}>
            Kalkulator pokazuje wyłącznie ratę kapitałowo-odsetkową przy stałym oprocentowaniu.
            Nie uwzględnia prowizji bankowej, ubezpieczenia nieruchomości, opłat za wycenę
            ani zmienności stóp procentowych (WIBOR/WIRON).
          </p>
        </div>
      </div>
    </div>
  );
}
