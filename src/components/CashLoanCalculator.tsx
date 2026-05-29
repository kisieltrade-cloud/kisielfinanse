'use client';

import { useState, useMemo, useEffect, useRef } from 'react';

const C = {
  gold:   '#c9a227',
  goldD:  '#a07c15',
  goldL:  '#e8c96a',
  goldBg: 'rgba(201,162,39,0.07)',
  bg:     'var(--bg)',
  white:  '#ffffff',
  text:   '#1a2230',
  muted:  '#4a5a6a',
  border: '#e2e8f0',
  red:    '#d64045',
  green:  '#1a7a4f',
};

const fmt  = (n: number) => Math.round(n).toLocaleString('pl-PL');
const fmtD = (n: number, d = 1) =>
  n.toLocaleString('pl-PL', { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtK = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2).replace('.', ',')} M`;
  if (n >= 1_000)     return `${Math.round(n / 1_000)} tys.`;
  return String(Math.round(n));
};

// ─── count-up ─────────────────────────────────────────────────────
function useCountUp(target: number, duration = 350) {
  const [val, setVal] = useState(target);
  const ref = useRef({ from: target, raf: 0 });
  useEffect(() => {
    const from = ref.current.from;
    if (from === target) return;
    cancelAnimationFrame(ref.current.raf);
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const e = 1 - (1 - p) ** 3;
      const v = Math.round(from + (target - from) * e);
      ref.current.from = v;
      setVal(v);
      if (p < 1) ref.current.raf = requestAnimationFrame(tick);
    };
    ref.current.raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current.raf);
  }, [target, duration]);
  return val;
}

// ─── suwak ────────────────────────────────────────────────────────
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
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: C.muted, fontWeight: 700 }}>
          {label}
        </span>
        <span style={{
          fontFamily: 'var(--font-ui)', fontSize: '0.88rem', fontWeight: 700,
          color: C.goldD, background: C.goldBg,
          padding: '3px 12px', borderRadius: 20,
          border: `1px solid rgba(201,162,39,0.2)`,
        }}>
          {displayValue}
        </span>
      </div>
      <input
        type="range" className="cash-slider"
        min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          width: '100%', height: 8,
          background: `linear-gradient(to right, ${C.gold} ${pct}%, rgba(201,162,39,0.15) ${pct}%)`,
          borderRadius: 4, outline: 'none', cursor: 'pointer',
          WebkitAppearance: 'none', appearance: 'none',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: C.border }}>{minLabel}</span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: C.border }}>{maxLabel}</span>
      </div>
    </div>
  );
}

// ─── karta stat ───────────────────────────────────────────────────
function StatCard({ label, value, color, sub }: { label: string; value: string; color?: string; sub?: string }) {
  return (
    <div style={{
      background: C.white, borderRadius: 12, padding: '14px 16px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      border: `1px solid rgba(220,220,200,0.8)`,
    }}>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: C.muted, marginBottom: 5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </p>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 700, color: color ?? C.text, margin: 0, lineHeight: 1.2 }}>
        {value}
      </p>
      {sub && <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: C.muted, margin: '3px 0 0' }}>{sub}</p>}
    </div>
  );
}

// ─── poziomy pasek kosztów ────────────────────────────────────────
function CostBar({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  if (total <= 0) return null;
  return (
    <div>
      <div style={{ display: 'flex', height: 20, borderRadius: 6, overflow: 'hidden', gap: 2 }}>
        {segments.map((s, i) => {
          const pct = (s.value / total) * 100;
          if (pct < 0.5) return null;
          return (
            <div key={i} style={{
              width: `${pct}%`, background: s.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#fff', fontWeight: 700,
              minWidth: pct > 8 ? 'auto' : 0,
              overflow: 'hidden',
            }}>
              {pct > 8 ? `${pct.toFixed(0)}%` : ''}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: 10 }}>
        {segments.filter(s => s.value > 0).map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: C.muted }}>
              {s.label}: <strong style={{ color: C.text }}>{fmt(s.value)} PLN</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BISECTION dla RRSO ───────────────────────────────────────────
function calcRRSO(netKwota: number, rata: number, n: number): number {
  if (netKwota <= 0 || rata <= 0 || n <= 0) return 0;
  let lo = 0.00001, hi = 0.9;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const pv  = rata * (1 - Math.pow(1 + mid, -n)) / mid;
    if (pv > netKwota) lo = mid; else hi = mid;
  }
  return (Math.pow(1 + (lo + hi) / 2, 12) - 1) * 100;
}

// ─── GŁÓWNY KOMPONENT ─────────────────────────────────────────────
export default function CashLoanCalculator() {
  const [kwota,       setKwota]       = useState(20000);
  const [okres,       setOkres]       = useState(36);
  const [nomRate,     setNomRate]     = useState(12);
  const [prowizja,    setProwizja]    = useState(3);
  const [ubezpOn,     setUbezpOn]     = useState(false);
  const [ubezp,       setUbezp]       = useState(2);
  const [malejace,    setMalejace]    = useState(false);
  const [arrowHover,  setArrowHover]  = useState(false);

  const calc = useMemo(() => {
    const r       = nomRate / 100 / 12;
    const n       = okres;
    const prowPLN = kwota * prowizja / 100;
    const netKwota = kwota - prowPLN;

    // Rata równa (annuity)
    const rataRowna = r > 0
      ? kwota * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
      : kwota / n;

    // Rata malejąca — pierwsza i ostatnia
    const kapPart   = kwota / n;
    const decFirst  = kapPart + kwota * r;
    const decLast   = kapPart + kapPart * r;
    let   decInt    = 0;
    let   decBal    = kwota;
    for (let i = 0; i < n; i++) { decInt += decBal * r; decBal -= kapPart; }
    const decTotal  = kwota + decInt;

    const rata         = malejace ? decFirst : rataRowna;
    const totalOdsetki = malejace ? decInt : (rataRowna * n - kwota);
    const totalSplata  = malejace ? decTotal : rataRowna * n;

    // Ubezpieczenie — % rocznie od kwoty (uproszczenie)
    const ubezpMies    = ubezpOn ? (kwota * ubezp / 100 / 12) : 0;
    const ubezpTotal   = ubezpMies * n;
    const totalMies    = rata + ubezpMies;
    const totalKoszt   = totalOdsetki + prowPLN + ubezpTotal;
    const totalWszystko = totalSplata + prowPLN + ubezpTotal;

    // RRSO
    const rrso = calcRRSO(netKwota, totalMies, n);

    return {
      rata, rataRowna, decFirst, decLast,
      totalOdsetki, totalSplata, prowPLN,
      ubezpMies, ubezpTotal,
      totalMies, totalKoszt, totalWszystko,
      rrso, kwota, n,
      savingVsRowne: rataRowna * n - (malejace ? decTotal : rataRowna * n),
    };
  }, [kwota, okres, nomRate, prowizja, ubezpOn, ubezp, malejace]);

  const displayRata    = useCountUp(Math.round(calc.rata));
  const displayRRSO    = useCountUp(Math.round(calc.rrso * 10) / 10);
  const displayTotal   = useCountUp(Math.round(calc.totalWszystko));
  const displayKoszt   = useCountUp(Math.round(calc.totalKoszt));

  const rrsoColor = calc.rrso <= nomRate + 1 ? C.green
    : calc.rrso <= nomRate + 8 ? C.goldD
    : C.red;

  return (
    <>
      <style>{`
        .cash-slider { -webkit-appearance: none; appearance: none; border: none; display: block; }
        .cash-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 22px; height: 22px; border-radius: 50%;
          background: ${C.white}; border: 3px solid ${C.gold};
          box-shadow: 0 0 0 4px rgba(201,162,39,0.15), 0 2px 8px rgba(201,162,39,0.3);
          cursor: pointer; margin-top: -7px;
          transition: box-shadow 0.15s, transform 0.15s;
        }
        .cash-slider:hover::-webkit-slider-thumb {
          box-shadow: 0 0 0 7px rgba(201,162,39,0.18), 0 2px 12px rgba(201,162,39,0.4);
          transform: scale(1.1);
        }
        .cash-slider::-moz-range-thumb {
          width: 22px; height: 22px; border-radius: 50%;
          background: ${C.white}; border: 3px solid ${C.gold};
          box-shadow: 0 0 0 4px rgba(201,162,39,0.15);
          cursor: pointer;
        }
        .cash-slider::-webkit-slider-runnable-track { height: 8px; border-radius: 4px; border: none; }
        .cash-slider::-moz-range-track { height: 8px; border-radius: 4px; border: none; }

        .cash-toggle { position: relative; display: inline-block; width: 44px; height: 24px; }
        .cash-toggle input { opacity: 0; width: 0; height: 0; }
        .cash-toggle-track {
          position: absolute; inset: 0; border-radius: 24px;
          background: ${C.border}; cursor: pointer;
          transition: background 0.2s;
        }
        .cash-toggle input:checked + .cash-toggle-track { background: ${C.gold}; }
        .cash-toggle-track::before {
          content: ''; position: absolute;
          width: 18px; height: 18px; border-radius: 50%;
          background: ${C.white}; bottom: 3px; left: 3px;
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        .cash-toggle input:checked + .cash-toggle-track::before { transform: translateX(20px); }

        .cash-grid {
          display: grid;
          grid-template-columns: minmax(0,1fr) minmax(0,1fr);
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 780px) {
          .cash-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{ position: 'relative', background: C.bg, padding: '48px 0 64px', overflow: 'hidden' }}>

        {/* Gradient blobs */}
        <div style={{
          position: 'absolute', width: 600, height: 600, right: -200, top: -200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,162,39,0.18) 0%, transparent 65%)',
          filter: 'blur(50px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400, left: -100, bottom: -100, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,162,39,0.08) 0%, transparent 65%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <div className="cash-grid">

            {/* ── LEWA: Suwaki ─────────────────────────────────── */}
            <div style={{
              background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)', borderRadius: 18, padding: '28px 26px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.07), 0 1px 0 rgba(255,255,255,0.9) inset',
              border: '1px solid rgba(255,255,255,0.9)',
            }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: C.goldD, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 24 }}>
                Parametry kredytu
              </p>

              <SliderRow label="Kwota kredytu" value={kwota} displayValue={`${fmtK(kwota)} PLN`}
                min={1000} max={200000} step={1000} onChange={setKwota} minLabel="1 tys." maxLabel="200 tys." />
              <SliderRow label="Okres kredytowania" value={okres} displayValue={`${okres} mies.`}
                min={3} max={120} step={1} onChange={setOkres} minLabel="3 mies." maxLabel="10 lat" />
              <SliderRow label="Oprocentowanie nominalne" value={nomRate} displayValue={`${fmtD(nomRate)}%`}
                min={1} max={30} step={0.1} onChange={v => setNomRate(Math.round(v * 10) / 10)} minLabel="1%" maxLabel="30%" />

              <div style={{ height: 1, background: C.border, margin: '8px 0 22px' }} />

              <SliderRow label="Prowizja" value={prowizja} displayValue={prowizja === 0 ? 'brak' : `${fmtD(prowizja)}% · ${fmt(kwota * prowizja / 100)} PLN`}
                min={0} max={20} step={0.5} onChange={v => setProwizja(Math.round(v * 2) / 2)} minLabel="0%" maxLabel="20%" />

              {/* Ubezpieczenie toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px 0 0', borderTop: `1px solid ${C.border}`, marginTop: 4 }}>
                <div style={{ flex: 1, marginRight: 16 }}>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', fontWeight: 600, color: C.text, marginBottom: 2 }}>
                    Ubezpieczenie kredytu
                  </p>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: C.muted, margin: 0 }}>
                    {ubezpOn ? `${fmtD(ubezp)}% rocznie · ${fmt(kwota * ubezp / 100 / 12)} PLN/mies.` : 'Nie uwzględnione w wyliczeniu'}
                  </p>
                </div>
                <label className="cash-toggle">
                  <input type="checkbox" checked={ubezpOn} onChange={e => setUbezpOn(e.target.checked)} />
                  <span className="cash-toggle-track" />
                </label>
              </div>

              {ubezpOn && (
                <div style={{ marginTop: 14 }}>
                  <SliderRow label="Stawka ubezpieczenia (% rocznie)" value={ubezp} displayValue={`${fmtD(ubezp)}%`}
                    min={0.5} max={5} step={0.1} onChange={v => setUbezp(Math.round(v * 10) / 10)} minLabel="0,5%" maxLabel="5%" />
                </div>
              )}

              {/* Toggle raty malejące */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px 0 0', borderTop: `1px solid ${C.border}`, marginTop: ubezpOn ? 4 : 18 }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', fontWeight: 600, color: C.text, marginBottom: 2 }}>
                    Raty malejące
                  </p>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: C.muted, margin: 0 }}>
                    {malejace
                      ? `Pierwsza: ${fmt(calc.decFirst)} PLN, ostatnia: ${fmt(calc.decLast)} PLN`
                      : 'Stała rata przez cały okres'}
                  </p>
                </div>
                <label className="cash-toggle">
                  <input type="checkbox" checked={malejace} onChange={e => setMalejace(e.target.checked)} />
                  <span className="cash-toggle-track" />
                </label>
              </div>

              {/* Kwota netto */}
              <div style={{
                marginTop: 16, padding: '12px 16px',
                background: C.goldBg, borderRadius: 10,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                border: `1px solid rgba(201,162,39,0.18)`,
              }}>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: C.muted }}>
                  Kwota po potrąceniu prowizji
                </span>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '1.05rem', fontWeight: 800, color: C.goldD }}>
                  {fmt(kwota - calc.prowPLN)} PLN
                </span>
              </div>
            </div>

            {/* ── PRAWA: Wyniki ─────────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Rata hero */}
              <div style={{
                background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)', borderRadius: 18, padding: '28px 26px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.07), 0 1px 0 rgba(255,255,255,0.9) inset',
                border: '1px solid rgba(255,255,255,0.9)',
              }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: C.muted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>
                  {malejace ? 'Pierwsza rata miesięczna' : 'Miesięczna rata'}
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(3.2rem, 7vw, 4.8rem)', lineHeight: 1,
                    background: `linear-gradient(135deg, ${C.goldD} 0%, ${C.gold} 60%, ${C.goldL} 100%)`,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text', letterSpacing: '1px',
                  }}>
                    {fmt(displayRata)}
                  </span>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '1.1rem', fontWeight: 600, color: C.muted }}>PLN</span>
                </div>
                {ubezpOn && (
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: C.muted }}>
                    z ubezpieczeniem: {fmt(calc.totalMies)} PLN/mies.
                  </p>
                )}
              </div>

              {/* RRSO card — wyróżniona */}
              <div style={{
                background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)', borderRadius: 18, padding: '20px 26px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                border: `1.5px solid ${rrsoColor === C.red ? 'rgba(214,64,69,0.3)' : rrsoColor === C.goldD ? 'rgba(201,162,39,0.3)' : 'rgba(26,122,79,0.2)'}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: C.muted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>
                      RRSO
                    </p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', lineHeight: 1, color: rrsoColor }}>
                        {fmtD(calc.rrso, 1)}%
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: C.muted, marginBottom: 4 }}>
                      Nominalne
                    </p>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1.1rem', fontWeight: 700, color: C.text }}>
                      {fmtD(nomRate, 1)}%
                    </p>
                  </div>
                </div>

                {/* Pasek różnicy */}
                {calc.rrso > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', background: 'rgba(201,162,39,0.12)' }}>
                      <div style={{ width: `${Math.min((nomRate / calc.rrso) * 100, 100)}%`, background: C.gold, borderRadius: 3 }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', color: C.muted }}>nominalne {fmtD(nomRate, 1)}%</span>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', color: rrsoColor }}>RRSO {fmtD(calc.rrso, 1)}%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Stat cards 2×2 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <StatCard label="Łącznie do spłaty" value={`${fmt(displayTotal)} PLN`} color={C.text} />
                <StatCard label="Całkowity koszt" value={`${fmt(displayKoszt)} PLN`} color={C.red}
                  sub="odsetki + prowizja + ubezp." />
                <StatCard label="Odsetki" value={`${fmt(Math.round(calc.totalOdsetki))} PLN`} color={C.goldD} />
                <StatCard label="Prowizja + ubezp."
                  value={`${fmt(Math.round(calc.prowPLN + calc.ubezpTotal))} PLN`}
                  color={C.red}
                  sub={`${fmtD((calc.prowPLN + calc.ubezpTotal) / kwota * 100, 1)}% kwoty`}
                />
              </div>

              {/* Struktura kosztów */}
              <div style={{
                background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)', borderRadius: 18, padding: '20px 22px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                border: '1px solid rgba(255,255,255,0.9)',
              }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: C.goldD, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 14 }}>
                  Struktura kosztów
                </p>
                <CostBar segments={[
                  { label: 'Kapitał',       value: kwota,                            color: C.goldD },
                  { label: 'Odsetki',       value: Math.round(calc.totalOdsetki),    color: '#e8963a' },
                  { label: 'Prowizja',      value: Math.round(calc.prowPLN),         color: C.red },
                  ...(ubezpOn ? [{ label: 'Ubezpieczenie', value: Math.round(calc.ubezpTotal), color: '#6366f1' }] : []),
                ]} />
              </div>
            </div>
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
                background: `linear-gradient(135deg, ${C.goldD} 0%, ${C.gold} 100%)`,
                color: C.white, fontFamily: 'var(--font-ui)',
                fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none',
                boxShadow: arrowHover
                  ? `0 8px 30px rgba(201,162,39,0.5), 0 0 0 4px rgba(201,162,39,0.12)`
                  : `0 4px 16px rgba(201,162,39,0.3)`,
                transition: 'box-shadow 0.2s, transform 0.2s',
                transform: arrowHover ? 'translateY(-2px)' : 'none',
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

          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: C.muted, lineHeight: 1.6, marginTop: 20, textAlign: 'center' }}>
            Kalkulator pokazuje ratę przy stałym oprocentowaniu. RRSO obliczone zgodnie z metodą IRR (art. 5 pkt 12 ustawy o kredycie konsumenckim).
            Ubezpieczenie liczone jako stały % kwoty kredytu (uproszczenie). Nie zastępuje oferty bankowej.
          </p>
        </div>
      </div>
    </>
  );
}
