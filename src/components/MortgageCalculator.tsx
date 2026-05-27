'use client';

import { useState, useMemo, useEffect, useRef } from 'react';

// ─── Kolory ───────────────────────────────────────────────────────
// Kalkulator hipoteczny zawsze używa białych paneli (frosted glass),
// więc kolory tekstu są stałe (ciemne), bez CSS vars.
const C = {
  dark:   '#1a5c38',
  mid:    '#2d7a4f',
  bright: '#3aaa6a',
  light:  '#a8d8ba',
  vlight: 'rgba(58,170,106,0.07)',
  bg:     'var(--bg)',      // tło strony adaptuje się do motywu
  white:  '#ffffff',        // stały biały panel
  text:   '#1a2230',        // stały ciemny tekst (na białych panelach)
  muted:  '#4a5a6a',        // stały szary tekst (na białych panelach)
  border: '#e2e8f0',        // stały jasny obramowanie
  red:    '#d64045',
  gold:   '#b8860b',
};

const fmt = (n: number) => Math.round(n).toLocaleString('pl-PL');
const fmtK = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2).replace('.', ',')} M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)} tys.`;
  return String(Math.round(n));
};

// ─── Count-up hook ────────────────────────────────────────────────
function useCountUp(target: number, duration = 350) {
  const [val, setVal] = useState(target);
  const ref = useRef({ from: target, raf: 0 });

  useEffect(() => {
    const from = ref.current.from;
    if (from === target) return;
    cancelAnimationFrame(ref.current.raf);
    const t0 = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - t0) / duration, 1);
      const ease = 1 - (1 - progress) ** 3;
      const next = Math.round(from + (target - from) * ease);
      ref.current.from = next;
      setVal(next);
      if (progress < 1) ref.current.raf = requestAnimationFrame(tick);
    };
    ref.current.raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current.raf);
  }, [target, duration]);

  return val;
}

// ─── Suwak ────────────────────────────────────────────────────────
function SliderRow({ label, value, displayValue, min, max, step, onChange, minLabel, maxLabel }: {
  label: string; value: number; displayValue: string;
  min: number; max: number; step: number;
  onChange: (v: number) => void;
  minLabel: string; maxLabel: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: C.muted, fontWeight: 700, letterSpacing: '0.3px' }}>
          {label}
        </span>
        <span style={{
          fontFamily: 'var(--font-ui)', fontSize: '0.88rem', fontWeight: 700,
          color: C.dark, background: C.vlight,
          padding: '3px 12px', borderRadius: 20,
          border: `1px solid rgba(26,92,56,0.15)`,
          transition: 'all 0.15s',
        }}>
          {displayValue}
        </span>
      </div>
      <div style={{ position: 'relative' }}>
        <input
          type="range" className="mtg-slider"
          min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            width: '100%', height: 8,
            background: `linear-gradient(to right, ${C.dark} ${pct}%, rgba(26,92,56,0.12) ${pct}%)`,
            borderRadius: 4, outline: 'none', cursor: 'pointer',
            WebkitAppearance: 'none', appearance: 'none',
            transition: 'background 0.05s',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: C.border }}>{minLabel}</span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: C.border }}>{maxLabel}</span>
      </div>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────
function StatCard({ label, value, color, sub }: { label: string; value: string; color?: string; sub?: string }) {
  return (
    <div style={{
      background: C.white,
      borderRadius: 12,
      padding: '14px 16px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      border: `1px solid rgba(220,232,223,0.8)`,
      transition: 'box-shadow 0.2s, transform 0.2s',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: C.muted, marginBottom: 5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </p>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 700, color: color ?? C.text, margin: 0, lineHeight: 1.2 }}>
        {value}
      </p>
      {sub && (
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: C.muted, margin: '3px 0 0', lineHeight: 1.3 }}>{sub}</p>
      )}
    </div>
  );
}

// ─── Donut chart ──────────────────────────────────────────────────
function DonutChart({ capitalPct, interestPct, totalPLN }: { capitalPct: number; interestPct: number; totalPLN: number }) {
  const R = 52, cx = 68, cy = 68;
  const circ = 2 * Math.PI * R;
  const capDash = (capitalPct / 100) * circ;
  const intDash = (interestPct / 100) * circ;

  return (
    <svg viewBox="0 0 136 136" style={{ width: 126, height: 126, flexShrink: 0, overflow: 'visible' }}>
      <defs>
        <linearGradient id="capGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={C.dark} />
          <stop offset="100%" stopColor={C.mid} />
        </linearGradient>
        <linearGradient id="intGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={C.light} />
          <stop offset="100%" stopColor="#c8ebd8" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Track */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.vlight} strokeWidth={14} />

      {/* Interest arc */}
      <circle cx={cx} cy={cy} r={R} fill="none"
        stroke="url(#intGrad)" strokeWidth={14}
        strokeDasharray={`${intDash} ${circ - intDash}`}
        strokeDashoffset={-capDash}
        transform={`rotate(-90 ${cx} ${cy})`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.5s cubic-bezier(0.4,0,0.2,1)' }}
      />

      {/* Capital arc */}
      <circle cx={cx} cy={cy} r={R} fill="none"
        stroke="url(#capGrad)" strokeWidth={14}
        strokeDasharray={`${capDash > 4 ? capDash - 2 : capDash} ${circ}`}
        transform={`rotate(-90 ${cx} ${cy})`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.5s cubic-bezier(0.4,0,0.2,1)' }}
      />

      {/* Center */}
      <text x={cx} y={cy - 8} textAnchor="middle"
        fontSize="10" fill={C.muted} fontFamily="system-ui,sans-serif" fontWeight="700">
        Kapitał
      </text>
      <text x={cx} y={cy + 8} textAnchor="middle"
        fontSize="15" fontWeight="700" fill={C.text} fontFamily="system-ui,sans-serif">
        {capitalPct.toFixed(0)}%
      </text>
      <text x={cx} y={cy + 22} textAnchor="middle"
        fontSize="9" fill={C.muted} fontFamily="system-ui,sans-serif">
        {fmtK(totalPLN * capitalPct / 100)}
      </text>
    </svg>
  );
}

// ─── Wykres słupkowy ──────────────────────────────────────────────
function AmortChart({ bars }: { bars: { capital: number; interest: number }[] }) {
  const W = 300, H = 140;
  const padB = 26, padT = 10, padL = 8, padR = 8;
  const plotW = W - padL - padR;
  const plotH = H - padB - padT;
  const n = bars.length;
  const gap = 6;
  const barW = (plotW - gap * (n - 1)) / n;
  const maxVal = Math.max(...bars.map(b => b.capital + b.interest), 1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="capBar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.mid} />
          <stop offset="100%" stopColor={C.dark} />
        </linearGradient>
        <linearGradient id="intBar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8ebd8" />
          <stop offset="100%" stopColor={C.light} />
        </linearGradient>
      </defs>
      {bars.map((b, i) => {
        const total = b.capital + b.interest;
        const totalH = (total / maxVal) * plotH;
        const capH = (b.capital / maxVal) * plotH;
        const intH = totalH - capH;
        const x = padL + i * (barW + gap);
        const base = padT + plotH;
        return (
          <g key={i} style={{ cursor: 'default' }}>
            <rect x={x} y={base - totalH} width={barW} height={intH}
              fill="url(#intBar)" rx={4} />
            <rect x={x} y={base - capH} width={barW} height={capH}
              fill="url(#capBar)" rx={4} />
            <text x={x + barW / 2} y={H - 8}
              textAnchor="middle" fontSize="9" fill={C.muted}
              fontFamily="system-ui,sans-serif" fontWeight="700">
              {i + 1}r
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── GŁÓWNY KOMPONENT ─────────────────────────────────────────────
export default function MortgageCalculator() {
  const [propVal,  setPropVal]  = useState(600000);
  const [downPct,  setDownPct]  = useState(20);
  const [term,     setTerm]     = useState(25);
  const [rate,     setRate]     = useState(7.5);
  const [malejace, setMalejace] = useState(false);
  const [arrowHover, setArrowHover] = useState(false);

  const calc = useMemo(() => {
    const down = propVal * downPct / 100;
    const P    = propVal - down;
    const r    = rate / 100 / 12;
    const n    = term * 12;

    const M = r > 0
      ? P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      : P / n;
    const annuityTotal    = M * n;
    const annuityInterest = annuityTotal - P;

    const principalPart = P / n;
    let decInterest = 0, decFirst = 0, decLast = 0;
    let decBal = P;
    for (let i = 0; i < n; i++) {
      const intPart = decBal * r;
      if (i === 0) decFirst = principalPart + intPart;
      if (i === n - 1) decLast = principalPart + intPart;
      decInterest += intPart;
      decBal -= principalPart;
    }
    const decTotal = P + decInterest;
    const saving = annuityInterest - decInterest;

    const activeM        = malejace ? decFirst : M;
    const activeInterest = malejace ? decInterest : annuityInterest;
    const activeTotal    = malejace ? decTotal : annuityTotal;
    const capitalPct     = (P / activeTotal) * 100;
    const interestPct    = 100 - capitalPct;

    // Amort - pierwsze 5 lat
    const amortBars: { capital: number; interest: number }[] = [];
    let bal = P;
    for (let yr = 0; yr < Math.min(5, term); yr++) {
      let yc = 0, yi = 0;
      for (let mo = 0; mo < 12; mo++) {
        const ip = bal * r;
        const cp = malejace ? principalPart : Math.max(0, M - ip);
        yc += cp; yi += ip;
        bal = Math.max(0, bal - cp);
      }
      amortBars.push({ capital: yc, interest: yi });
    }

    return { P, down, M, activeM, activeInterest, activeTotal, annuityInterest, decInterest, decFirst, decLast, saving, capitalPct, interestPct, amortBars, n };
  }, [propVal, downPct, term, rate, malejace]);

  const displayM = useCountUp(Math.round(calc.activeM));
  const displayInterest = useCountUp(Math.round(calc.activeInterest));
  const displayTotal = useCountUp(Math.round(calc.activeTotal));
  const displaySaving = useCountUp(Math.round(calc.saving));

  return (
    <>
      <style>{`
        .mtg-slider { -webkit-appearance: none; appearance: none; border: none; display: block; }
        .mtg-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 22px; height: 22px; border-radius: 50%;
          background: ${C.white}; border: 3px solid ${C.dark};
          box-shadow: 0 0 0 4px rgba(26,92,56,0.12), 0 2px 8px rgba(26,92,56,0.3);
          cursor: pointer; margin-top: -7px;
          transition: box-shadow 0.15s, transform 0.15s;
        }
        .mtg-slider:hover::-webkit-slider-thumb,
        .mtg-slider:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 7px rgba(26,92,56,0.15), 0 2px 12px rgba(26,92,56,0.4);
          transform: scale(1.1);
        }
        .mtg-slider::-moz-range-thumb {
          width: 22px; height: 22px; border-radius: 50%;
          background: ${C.white}; border: 3px solid ${C.dark};
          box-shadow: 0 0 0 4px rgba(26,92,56,0.12), 0 2px 8px rgba(26,92,56,0.3);
          cursor: pointer; transition: box-shadow 0.15s;
        }
        .mtg-slider::-webkit-slider-runnable-track { height: 8px; border-radius: 4px; border: none; }
        .mtg-slider::-moz-range-track { height: 8px; border-radius: 4px; border: none; }
        .mtg-slider { transition: none; }

        .mtg-toggle { position: relative; display: inline-block; width: 44px; height: 24px; }
        .mtg-toggle input { opacity: 0; width: 0; height: 0; }
        .mtg-toggle-track {
          position: absolute; inset: 0; border-radius: 24px;
          background: ${C.border}; cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
        }
        .mtg-toggle input:checked + .mtg-toggle-track {
          background: ${C.dark};
          box-shadow: 0 0 0 3px rgba(26,92,56,0.15);
        }
        .mtg-toggle-track::before {
          content: ''; position: absolute;
          width: 18px; height: 18px; border-radius: 50%;
          background: ${C.white}; bottom: 3px; left: 3px;
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        .mtg-toggle input:checked + .mtg-toggle-track::before { transform: translateX(20px); }

        .mtg-grid {
          display: grid;
          grid-template-columns: minmax(0,1fr) minmax(0,1fr);
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 780px) {
          .mtg-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{
        position: 'relative',
        background: C.bg,
        padding: '48px 0 64px',
        overflow: 'hidden',
      }}>
        {/* Gradient blobs w tle */}
        <div style={{
          position: 'absolute', width: 600, height: 600,
          right: -150, top: -200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,216,186,0.4) 0%, transparent 65%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400,
          left: -100, bottom: -100, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26,92,56,0.12) 0%, transparent 65%)',
          filter: 'blur(50px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 300, height: 300,
          left: '40%', top: '20%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,216,186,0.2) 0%, transparent 65%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <div className="mtg-grid">

            {/* ── LEWA: Suwaki ───────────────────────────────── */}
            <div style={{
              background: 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: 18,
              padding: '28px 26px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.9) inset',
              border: '1px solid rgba(255,255,255,0.9)',
            }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: C.dark, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 24 }}>
                Parametry kredytu
              </p>

              <SliderRow label="Wartość nieruchomości" value={propVal} displayValue={`${fmtK(propVal)} PLN`}
                min={100000} max={2000000} step={10000} onChange={setPropVal} minLabel="100 tys." maxLabel="2 M" />
              <SliderRow label="Wkład własny" value={downPct} displayValue={`${downPct}% · ${fmtK(propVal * downPct / 100)} PLN`}
                min={0} max={80} step={1} onChange={setDownPct} minLabel="0%" maxLabel="80%" />
              <SliderRow label="Okres kredytowania" value={term} displayValue={`${term} lat`}
                min={5} max={35} step={1} onChange={setTerm} minLabel="5 lat" maxLabel="35 lat" />
              <SliderRow label="Oprocentowanie roczne" value={rate} displayValue={`${rate.toFixed(2)}%`}
                min={3} max={15} step={0.05} onChange={v => setRate(Math.round(v * 20) / 20)} minLabel="3%" maxLabel="15%" />

              {/* Toggle */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 0 0', borderTop: `1px solid ${C.border}`, marginTop: 4,
              }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', fontWeight: 600, color: C.text, marginBottom: 2 }}>
                    Raty malejące
                  </p>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: C.muted, margin: 0 }}>
                    {malejace ? `Pierwsza: ${fmt(calc.decFirst)} PLN, ostatnia: ${fmt(calc.decLast)} PLN` : 'Stała rata przez cały okres'}
                  </p>
                </div>
                <label className="mtg-toggle">
                  <input type="checkbox" checked={malejace} onChange={e => setMalejace(e.target.checked)} />
                  <span className="mtg-toggle-track" />
                </label>
              </div>

              {/* Kwota kredytu */}
              <div style={{
                marginTop: 18, padding: '12px 16px',
                background: `linear-gradient(135deg, ${C.vlight}, rgba(168,216,186,0.3))`,
                borderRadius: 10,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                border: `1px solid rgba(26,92,56,0.1)`,
              }}>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: C.muted, fontWeight: 500 }}>
                  Kwota kredytu
                </span>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '1.05rem', fontWeight: 800, color: C.dark }}>
                  {fmt(calc.P)} PLN
                </span>
              </div>

              {/* Oszczędność hint */}
              {!malejace && calc.saving > 0 && (
                <div style={{
                  marginTop: 10, padding: '10px 14px',
                  background: 'rgba(26,92,56,0.04)',
                  borderRadius: 8, borderLeft: `3px solid ${C.dark}`,
                  cursor: 'pointer',
                }}
                  onClick={() => setMalejace(true)}
                >
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: C.muted, margin: 0 }}>
                    💡 Przy ratach malejących zaoszczędzisz{' '}
                    <strong style={{ color: C.dark }}>{fmt(calc.saving)} PLN</strong>
                    {' '}na odsetkach. Kliknij, by sprawdzić.
                  </p>
                </div>
              )}
            </div>

            {/* ── PRAWA: Wyniki ───────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Główna rata */}
              <div style={{
                background: 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: 18,
                padding: '28px 26px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.9) inset',
                border: '1px solid rgba(255,255,255,0.9)',
              }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: C.muted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>
                  {malejace ? 'Pierwsza rata miesięczna' : 'Miesięczna rata'}
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(3.5rem, 8vw, 5rem)',
                    lineHeight: 1,
                    background: `linear-gradient(135deg, ${C.dark} 0%, ${C.bright} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '2px',
                  }}>
                    {fmt(displayM)}
                  </span>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '1.1rem', fontWeight: 600, color: C.muted }}>PLN</span>
                </div>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: C.muted }}>
                  stała rata przez {term} {term === 1 ? 'rok' : term < 5 ? 'lata' : 'lat'}
                </p>
              </div>

              {/* Stat cards 2×2 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <StatCard label="Łączne odsetki" value={`${fmt(displayInterest)} PLN`} color={C.red} />
                <StatCard label="Całkowity koszt" value={`${fmt(displayTotal)} PLN`} color={C.text} />
                <StatCard label="Wkład własny" value={`${fmt(propVal * downPct / 100)} PLN`} color={C.dark} sub={`${downPct}% wartości`} />
                <StatCard
                  label={malejace ? 'Oszczędność vs równe' : 'Oszczędność na malejących'}
                  value={`${fmt(displaySaving)} PLN`}
                  color={C.gold}
                  sub="na odsetkach"
                />
              </div>

              {/* Struktura kosztów */}
              <div style={{
                background: 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: 18,
                padding: '20px 22px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.9) inset',
                border: '1px solid rgba(255,255,255,0.9)',
              }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: C.dark, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 }}>
                  Struktura kosztów
                </p>
                <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                  <DonutChart capitalPct={calc.capitalPct} interestPct={calc.interestPct} totalPLN={calc.activeTotal} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { color: C.dark, label: 'Kapitał', val: fmt(calc.P) + ' PLN', pct: calc.capitalPct.toFixed(0) + '%' },
                      { color: C.light, label: 'Odsetki', val: fmt(calc.activeInterest) + ' PLN', pct: calc.interestPct.toFixed(0) + '%' },
                    ].map(item => (
                      <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: item.color, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: C.muted }}>{item.label}</span>
                            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: C.muted }}>{item.pct}</span>
                          </div>
                          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', fontWeight: 700, color: C.text, margin: 0 }}>
                            {item.val}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Harmonogram - pełna szerokość ─────────────────── */}
          <div style={{
            marginTop: 24,
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 18,
            padding: '24px 28px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.9) inset',
            border: '1px solid rgba(255,255,255,0.9)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: C.dark, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 2 }}>
                  Harmonogram spłat
                </p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: C.muted, margin: 0 }}>
                  Pierwsze {Math.min(5, term)} lata - roczne sumy kapitału i odsetek
                </p>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                {[{ color: C.dark, label: 'Kapitał' }, { color: C.light, label: 'Odsetki' }].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: C.muted }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <AmortChart bars={calc.amortBars} />
          </div>

          {/* CTA */}
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
            <a
              href="/kalkulator"
              onMouseEnter={() => setArrowHover(true)}
              onMouseLeave={() => setArrowHover(false)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '13px 28px', borderRadius: 12,
                background: `linear-gradient(135deg, ${C.dark} 0%, ${C.mid} 100%)`,
                color: C.white, fontFamily: 'var(--font-ui)',
                fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none',
                boxShadow: arrowHover
                  ? `0 8px 30px rgba(26,92,56,0.4), 0 0 0 4px rgba(26,92,56,0.12)`
                  : `0 4px 16px rgba(26,92,56,0.25)`,
                transition: 'box-shadow 0.2s, transform 0.2s',
                transform: arrowHover ? 'translateY(-2px)' : 'none',
                letterSpacing: '0.2px',
              }}
            >
              Więcej kalkulatorów finansowych
              <span style={{
                display: 'inline-block',
                transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                transform: arrowHover ? 'translateX(5px)' : 'translateX(0)',
              }}>→</span>
            </a>
          </div>

          {/* Disclaimer */}
          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: '0.7rem',
            color: C.muted, lineHeight: 1.6, marginTop: 20, textAlign: 'center',
          }}>
            Kalkulator pokazuje wyłącznie ratę kapitałowo-odsetkową przy stałym oprocentowaniu.
            Nie uwzględnia prowizji bankowej, ubezpieczenia nieruchomości ani zmienności stóp procentowych.
          </p>
        </div>
      </div>
    </>
  );
}
