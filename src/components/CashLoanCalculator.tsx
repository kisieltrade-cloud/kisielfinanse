'use client';

import { useState, useMemo, useEffect, useRef } from 'react';

// ─── paleta (zieleń wg mockupu) ───────────────────────────────────
const C = {
  green:    '#2f6b4f',
  greenD:   '#1e4d38',
  greenL:   '#8fc4a6',
  greenBg:  'rgba(47,107,79,0.08)',
  panel:    '#101a24',
  panelCard:'#1b2733',
  panelLine:'rgba(255,255,255,0.09)',
  panelMuted:'#8a98a6',
  bg:       'var(--calc-section)',
  white:    '#ffffff',
  text:     '#1a2230',
  muted:    '#5d6b7a',
  border:   '#e6e2da',
  inputBd:  '#d6d2c8',
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
    <div style={{ marginBottom: 26 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.95rem', color: C.text, fontWeight: 600 }}>
          {label}
        </span>
        <span style={{
          fontFamily: 'var(--font-ui)', fontSize: '0.92rem', fontWeight: 700, color: C.text,
          background: C.white, padding: '8px 16px', borderRadius: 10,
          border: `1px solid ${C.inputBd}`, whiteSpace: 'nowrap',
        }}>
          {displayValue}
        </span>
      </div>
      <input
        type="range" className="cash-slider"
        min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          width: '100%', height: 6,
          background: `linear-gradient(to right, ${C.green} ${pct}%, #dfe5e0 ${pct}%)`,
          borderRadius: 4, outline: 'none', cursor: 'pointer',
          WebkitAppearance: 'none', appearance: 'none',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: C.muted }}>{minLabel}</span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: C.muted }}>{maxLabel}</span>
      </div>
    </div>
  );
}

// ─── wiersz na ciemnym panelu ─────────────────────────────────────
function PanelRow({ label, value, sub, valueRight }: { label: string; value: string; sub?: string; valueRight?: boolean }) {
  return (
    <div style={{ paddingTop: 18, marginTop: 18, borderTop: `1px solid ${C.panelLine}` }}>
      {valueRight ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: C.panelMuted, letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</span>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 700, color: C.white }}>{value}</span>
        </div>
      ) : (
        <>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: C.panelMuted, letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px' }}>{label}</p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1.5rem', fontWeight: 700, color: C.white, margin: 0, lineHeight: 1.1 }}>{value}</p>
        </>
      )}
      {sub && <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: C.panelMuted, margin: '4px 0 0' }}>{sub}</p>}
    </div>
  );
}

// ─── donut struktury kosztów ──────────────────────────────────────
function Donut({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  if (total <= 0) return null;
  const R = 42, SW = 14, CIRC = 2 * Math.PI * R;
  let offset = 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
      <svg width={108} height={108} viewBox="0 0 108 108" style={{ flexShrink: 0, transform: 'rotate(-90deg)' }}>
        <circle cx={54} cy={54} r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={SW} />
        {segments.map((s, i) => {
          const frac = s.value / total;
          if (frac <= 0) return null;
          const dash = frac * CIRC;
          const el = (
            <circle key={i} cx={54} cy={54} r={R} fill="none" stroke={s.color} strokeWidth={SW}
              strokeDasharray={`${dash} ${CIRC - dash}`} strokeDashoffset={-offset} strokeLinecap="butt" />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, minWidth: 0 }}>
        {segments.filter(s => s.value > 0).map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 700, color: C.white, width: 38 }}>
              {Math.round((s.value / total) * 100)}%
            </span>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: C.panelMuted }}>
              {s.label}: {fmt(s.value)} PLN
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const InfoIcon = () => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 16, height: 16, borderRadius: '50%', border: `1px solid ${C.panelMuted}`,
    color: C.panelMuted, fontSize: '0.6rem', fontWeight: 700, fontFamily: 'var(--font-ui)', flexShrink: 0,
  }}>i</span>
);

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
  const [kwota,    setKwota]    = useState(20000);
  const [okres,    setOkres]    = useState(36);
  const [nomRate,  setNomRate]  = useState(12);
  const [prowizja, setProwizja] = useState(0);
  const [ubezp,    setUbezp]    = useState(0); // 0 = brak; inaczej % rocznie
  const [malejace, setMalejace] = useState(false);

  const ubezpOn = ubezp > 0;

  const calc = useMemo(() => {
    const r        = nomRate / 100 / 12;
    const n        = okres;
    const prowPLN  = kwota * prowizja / 100;
    const netKwota = kwota - prowPLN;

    const rataRowna = r > 0
      ? kwota * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
      : kwota / n;

    const kapPart  = kwota / n;
    const decFirst = kapPart + kwota * r;
    const decLast  = kapPart + kapPart * r;
    let   decInt   = 0;
    let   decBal   = kwota;
    for (let i = 0; i < n; i++) { decInt += decBal * r; decBal -= kapPart; }
    const decTotal = kwota + decInt;

    const rata         = malejace ? decFirst : rataRowna;
    const totalOdsetki = malejace ? decInt : (rataRowna * n - kwota);
    const totalSplata  = malejace ? decTotal : rataRowna * n;

    const ubezpMies     = ubezpOn ? (kwota * ubezp / 100 / 12) : 0;
    const ubezpTotal    = ubezpMies * n;
    const totalMies     = rata + ubezpMies;
    const totalKoszt    = totalOdsetki + prowPLN + ubezpTotal;
    const totalWszystko = totalSplata + prowPLN + ubezpTotal;
    const rrso = calcRRSO(netKwota, totalMies, n);

    return {
      rata, decFirst, decLast, totalOdsetki, totalSplata,
      prowPLN, ubezpMies, ubezpTotal, totalMies, totalKoszt, totalWszystko,
      rrso, netKwota, n,
    };
  }, [kwota, okres, nomRate, prowizja, ubezp, ubezpOn, malejace]);

  const displayRata  = useCountUp(Math.round(calc.totalMies));
  const displayNet   = useCountUp(Math.round(calc.netKwota));
  const displayTotal = useCountUp(Math.round(calc.totalWszystko));
  const displayKoszt = useCountUp(Math.round(calc.totalKoszt));

  return (
    <>
      <style>{`
        .cash-slider { -webkit-appearance: none; appearance: none; border: none; display: block; }
        .cash-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 20px; height: 20px; border-radius: 50%;
          background: ${C.white}; border: 4px solid ${C.green};
          box-shadow: 0 2px 6px rgba(0,0,0,0.18);
          cursor: pointer; margin-top: -7px;
          transition: transform 0.12s;
        }
        .cash-slider:hover::-webkit-slider-thumb { transform: scale(1.12); }
        .cash-slider::-moz-range-thumb {
          width: 20px; height: 20px; border-radius: 50%;
          background: ${C.white}; border: 4px solid ${C.green}; cursor: pointer;
        }
        .cash-slider::-webkit-slider-runnable-track { height: 6px; border-radius: 4px; border: none; }
        .cash-slider::-moz-range-track { height: 6px; border-radius: 4px; border: none; }

        .cash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: start; }
        @media (max-width: 860px) { .cash-grid { grid-template-columns: 1fr; } }

        .cash-select {
          width: 100%; box-sizing: border-box; appearance: none; -webkit-appearance: none;
          background: ${C.white}; border: 1px solid ${C.inputBd}; border-radius: 10px;
          padding: 13px 40px 13px 16px; font-family: var(--font-ui); font-size: 0.9rem; color: ${C.text};
          cursor: pointer; outline: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%235d6b7a' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 14px center;
        }
        .cash-radio {
          flex: 1; display: flex; align-items: center; gap: 12px; cursor: pointer;
          padding: 15px 18px; border-radius: 12px; background: ${C.white};
          border: 1px solid ${C.inputBd}; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .cash-radio.active { border-color: ${C.green}; box-shadow: 0 0 0 1px ${C.green}; }
        .cash-radio-dot {
          width: 20px; height: 20px; border-radius: 50%; border: 2px solid ${C.inputBd};
          flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: border-color 0.15s;
        }
        .cash-radio.active .cash-radio-dot { border-color: ${C.green}; }
        .cash-radio.active .cash-radio-dot::after {
          content: ''; width: 10px; height: 10px; border-radius: 50%; background: ${C.green};
        }
      `}</style>

      <div style={{ background: C.bg, padding: '8px 0 56px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '0 24px' }}>
          <div className="cash-grid">

            {/* ── LEWA: parametry ─────────────────────────────────── */}
            <div style={{
              background: C.white, borderRadius: 16, padding: '30px 30px 34px',
              border: `1px solid ${C.border}`, boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
            }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.74rem', fontWeight: 700, color: C.muted, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 28 }}>
                Parametry kredytu
              </p>

              <SliderRow label="Kwota kredytu" value={kwota} displayValue={`${fmtK(kwota)} PLN`}
                min={1000} max={200000} step={1000} onChange={setKwota} minLabel="1 tys." maxLabel="200 tys." />
              <SliderRow label="Okres kredytowania" value={okres} displayValue={`${okres} mies.`}
                min={3} max={120} step={1} onChange={setOkres} minLabel="3 mies." maxLabel="10 lat" />
              <SliderRow label="Oprocentowanie nominalne" value={nomRate} displayValue={`${fmtD(nomRate)}%`}
                min={1} max={30} step={0.1} onChange={v => setNomRate(Math.round(v * 10) / 10)} minLabel="1%" maxLabel="30%" />
              <SliderRow label="Prowizja" value={prowizja}
                displayValue={prowizja === 0 ? 'brak' : `${fmtD(prowizja)}% · ${fmt(kwota * prowizja / 100)} PLN`}
                min={0} max={20} step={0.5} onChange={v => setProwizja(Math.round(v * 2) / 2)} minLabel="0%" maxLabel="20%" />

              {/* Ubezpieczenie — dropdown */}
              <div style={{ marginBottom: 22 }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.95rem', color: C.text, fontWeight: 600, marginBottom: 12 }}>
                  Ubezpieczenie kredytu
                </label>
                <select className="cash-select" value={ubezp} onChange={e => setUbezp(Number(e.target.value))}>
                  <option value={0}>Nie uwzględnione w wyliczeniu</option>
                  <option value={1}>1% rocznie</option>
                  <option value={2}>2% rocznie</option>
                  <option value={3}>3% rocznie</option>
                  <option value={5}>5% rocznie</option>
                </select>
                {ubezpOn && (
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: C.muted, margin: '8px 0 0' }}>
                    {fmt(calc.ubezpMies)} PLN/mies.
                  </p>
                )}
              </div>

              {/* Radio: typ rat */}
              <div style={{ display: 'flex', gap: 14 }}>
                <div className={`cash-radio${malejace ? ' active' : ''}`} onClick={() => setMalejace(true)} role="radio" aria-checked={malejace} tabIndex={0}>
                  <span className="cash-radio-dot" />
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', color: C.text }}>Raty malejące</span>
                </div>
                <div className={`cash-radio${!malejace ? ' active' : ''}`} onClick={() => setMalejace(false)} role="radio" aria-checked={!malejace} tabIndex={0}>
                  <span className="cash-radio-dot" />
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', color: C.text }}>Stała rata przez cały okres</span>
                </div>
              </div>
            </div>

            {/* ── PRAWA: ciemny panel wyników ─────────────────────── */}
            <div style={{
              background: C.panel, borderRadius: 16, padding: '28px 30px 32px',
              boxShadow: '0 16px 50px rgba(16,26,36,0.25)',
            }}>
              {/* Kwota po potrąceniu prowizji */}
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: C.panelMuted, letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 8px' }}>
                Kwota po potrąceniu prowizji
              </p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1.7rem', fontWeight: 800, color: C.greenL, margin: 0, lineHeight: 1 }}>
                {fmt(displayNet)} <span style={{ fontSize: '0.95rem', fontWeight: 600, color: C.panelMuted }}>PLN</span>
              </p>

              {/* Miesięczna rata */}
              <div style={{ paddingTop: 22, marginTop: 22, borderTop: `1px solid ${C.panelLine}` }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: C.panelMuted, letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px' }}>
                  Miesięczna rata{malejace ? ' (pierwsza)' : ''}
                </p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '3rem', fontWeight: 800, color: C.white, margin: 0, lineHeight: 1 }}>
                  {fmt(displayRata)} <span style={{ fontSize: '1.1rem', fontWeight: 600, color: C.panelMuted }}>PLN</span>
                </p>
              </div>

              {/* RRSO */}
              <div style={{ paddingTop: 18, marginTop: 18 }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: C.panelMuted, letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 4px' }}>
                  RRSO
                </p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '2rem', fontWeight: 800, color: C.greenL, margin: 0, lineHeight: 1 }}>
                  {fmtD(calc.rrso, 1)}%
                </p>
              </div>

              {/* Dwie podkarty */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 18 }}>
                {[
                  { lbl: 'Nominalne', val: `${fmtD(nomRate, 1)}%`, sub: 'nominalne' },
                  { lbl: 'RRSO', val: `${fmtD(calc.rrso, 1)}%`, sub: 'rzeczywiste' },
                ].map((c, i) => (
                  <div key={i} style={{ background: C.panelCard, borderRadius: 12, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.74rem', color: C.panelMuted }}>{c.lbl}</span>
                      <InfoIcon />
                    </div>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1.3rem', fontWeight: 700, color: C.white, margin: 0 }}>{c.val}</p>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: C.panelMuted, margin: '2px 0 0' }}>{c.sub}</p>
                  </div>
                ))}
              </div>

              <PanelRow label="Łącznie do spłaty" value={`${fmt(displayTotal)} PLN`} />
              <PanelRow label="Całkowity koszt" value={`${fmt(displayKoszt)} PLN`} sub="odsetki + prowizja + ubezp." />
              <PanelRow label="Odsetki" value={`${fmt(calc.totalOdsetki)} PLN`} valueRight />
              <PanelRow label="Prowizja + ubezp."
                value={`${fmt(calc.prowPLN + calc.ubezpTotal)} PLN`}
                sub={`${fmtD((calc.prowPLN + calc.ubezpTotal) / kwota * 100, 1)}% kwoty`} valueRight />

              {/* Struktura kosztów */}
              <div style={{ paddingTop: 20, marginTop: 18, borderTop: `1px solid ${C.panelLine}` }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: C.panelMuted, letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 16px' }}>
                  Struktura kosztów
                </p>
                <Donut segments={[
                  { label: 'Kapitał',  value: kwota,                         color: C.green },
                  { label: 'Odsetki',  value: Math.round(calc.totalOdsetki), color: C.greenL },
                  { label: 'Prowizja', value: Math.round(calc.prowPLN),      color: '#cfe3d6' },
                  ...(ubezpOn ? [{ label: 'Ubezpieczenie', value: Math.round(calc.ubezpTotal), color: '#b8d4c2' }] : []),
                ]} />
              </div>
            </div>
          </div>

          {/* Info box */}
          <div style={{
            marginTop: 22, display: 'flex', gap: 14, alignItems: 'flex-start',
            background: '#ecebe4', borderRadius: 12, padding: '18px 22px', maxWidth: 506,
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 22, height: 22, borderRadius: '50%', border: `1.5px solid ${C.muted}`,
              color: C.muted, fontSize: '0.7rem', fontWeight: 700, fontFamily: 'var(--font-ui)', flexShrink: 0, marginTop: 1,
            }}>i</span>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: C.muted, lineHeight: 1.7, margin: 0 }}>
              Kalkulator pokazuje ratę przy stałym oprocentowaniu. RRSO obliczone zgodnie z metodą IRR
              (art. 5 pkt 12 ustawy o kredycie konsumenckim). Ubezpieczenie liczone jako stały % kwoty
              kredytu (uproszczenie). Wyliczenia mają charakter wyłącznie poglądowy i szacunkowy i nie stanowią
              oferty w rozumieniu art. 66 § 1 Kodeksu cywilnego, doradztwa finansowego ani rekomendacji.
              Wiążące warunki określa umowa kredytu i formularz informacyjny przekazany przez kredytodawcę
              zgodnie z ustawą o kredycie konsumenckim.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
