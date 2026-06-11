'use client';

import { useState, useMemo } from 'react';

/* ── Rozkład wynagrodzeń brutto w Polsce (GUS, struktura wynagrodzeń 2025) ─────
   Kotwice (brutto miesięcznie → percentyl): D1=4666, mediana ~7300, D9=16290,
   średnia ~8900 (mean > mediana, prawostronna asymetria). Percentyl liczymy
   interpolacją log-liniową między kotwicami.                                    */
const ANCHORS: [number, number][] = [
  [4300, 4], [4666, 10], [5400, 22], [6200, 35], [7300, 50],
  [8900, 64], [10500, 75], [13000, 84], [16290, 90],
  [21000, 95], [30000, 98], [45000, 99.3],
];
const MEDIANA = 7300;
const SREDNIA = 8900;
const ACCENT = '#6366f1';

function percentyl(brutto: number): number {
  if (brutto <= ANCHORS[0][0]) return 2;
  const last = ANCHORS[ANCHORS.length - 1];
  if (brutto >= last[0]) return 99.6;
  for (let i = 1; i < ANCHORS.length; i++) {
    const [x1, p1] = ANCHORS[i - 1];
    const [x2, p2] = ANCHORS[i];
    if (brutto <= x2) {
      const t = (Math.log(brutto) - Math.log(x1)) / (Math.log(x2) - Math.log(x1));
      return p1 + t * (p2 - p1);
    }
  }
  return 99;
}

function bruttoNaNetto(b: number): number {
  const spoleczne = b * 0.1371;
  const zdrowotna = (b - spoleczne) * 0.09;
  const podst = Math.round(b - spoleczne - 250);
  const pit = podst <= 10000 ? podst * 0.12 : 10000 * 0.12 + (podst - 10000) * 0.32;
  const zaliczka = Math.max(0, Math.round(pit - 300));
  return b - spoleczne - zdrowotna - zaliczka;
}

const fmt = (n: number) => Math.round(n).toLocaleString('pl-PL');

function Field({ label, value, onChange, placeholder, prefix, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; prefix?: string; hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: focused ? ACCENT : 'var(--muted)', display: 'block', marginBottom: 6, transition: 'color 0.15s' }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, borderBottom: `1px solid ${focused ? ACCENT : 'var(--border)'}`, transition: 'border-color 0.15s', paddingBottom: 7 }}>
        <input type="number" value={value} placeholder={placeholder} min="0" onChange={e => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '1.1rem', fontWeight: 700, width: '100%', outline: 'none' }} />
        {prefix && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)', flexShrink: 0 }}>{prefix}</span>}
      </div>
      {hint && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--muted)', marginTop: 4 }}>{hint}</p>}
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--muted)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', fontWeight: 600, color: accent ?? 'var(--text)' }}>{value}</span>
    </div>
  );
}

export default function PorownajPensjeCalculator() {
  const [brutto, setBrutto] = useState('');

  const r = useMemo(() => {
    const b = parseFloat(brutto);
    if (!b || b <= 0) return null;
    const p = percentyl(b);
    const lepiejNiz = Math.min(99.6, Math.max(1, p));
    const netto = bruttoNaNetto(b);
    const vsMediana = (b / MEDIANA - 1) * 100;
    const vsSrednia = (b / SREDNIA - 1) * 100;
    return { b, p: lepiejNiz, netto, vsMediana, vsSrednia };
  }, [brutto]);

  const verdict = r
    ? r.p >= 90 ? { col: '#2e7d4f', txt: 'Jesteś w top 10% zarabiających w Polsce.' }
    : r.p >= 75 ? { col: '#2e7d4f', txt: 'Wyraźnie powyżej średniej krajowej.' }
    : r.p >= 50 ? { col: ACCENT, txt: 'Powyżej mediany - zarabiasz lepiej niż połowa pracujących.' }
    : r.p >= 25 ? { col: '#e8963a', txt: 'W dolnej połowie, ale blisko środka. Jest pole do negocjacji.' }
    : { col: '#ef4444', txt: 'Poniżej krajowej mediany. Warto poznać stawki rynkowe w swojej branży.' }
    : null;

  const markerPct = r ? r.p : 0;

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 'clamp(24px, 5vw, 40px)' }}>
      <div style={{ marginBottom: 32 }}>
        <Field label="Twoje wynagrodzenie brutto (miesięcznie)" value={brutto} onChange={setBrutto} placeholder="np. 8000" prefix="zł" hint="Kwota brutto z umowy o pracę. Dane GUS są w ujęciu brutto." />
      </div>

      <div style={{ height: 1, background: 'var(--border)', marginBottom: 32 }} />

      {r ? (
        <>
          {/* Hero: percentyl */}
          <div style={{ padding: '24px 28px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 16, marginBottom: 24 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
              Zarabiasz więcej niż
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem, 8vw, 4rem)', color: ACCENT, letterSpacing: '2px', lineHeight: 1 }}>
              {r.p.toFixed(0)}%
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text)', marginTop: 6 }}>
              pracujących w Polsce
            </div>
          </div>

          {/* Pasek rozkładu */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ position: 'relative', height: 12, borderRadius: 6, background: 'linear-gradient(90deg, #ef4444, #e8963a, #6366f1, #2e7d4f)', marginBottom: 8 }}>
              <div style={{ position: 'absolute', top: -5, left: `calc(${markerPct}% - 11px)`, width: 22, height: 22, borderRadius: '50%', background: '#fff', border: `3px solid ${ACCENT}`, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--muted)' }}>
              <span>najniższe</span><span>mediana</span><span>najwyższe</span>
            </div>
          </div>

          {/* Werdykt */}
          {verdict && (
            <div style={{ borderLeft: `3px solid ${verdict.col}`, background: 'rgba(255,255,255,0.02)', padding: '14px 18px', borderRadius: '0 8px 8px 0', marginBottom: 26 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>{verdict.txt}</p>
            </div>
          )}

          {/* Rozbicie */}
          <div>
            <Row label="Twoje brutto" value={`${fmt(r.b)} zł`} />
            <Row label="To na rękę (netto)" value={`${fmt(r.netto)} zł`} accent={ACCENT} />
            <Row label="Mediana krajowa (brutto)" value={`${fmt(MEDIANA)} zł`} />
            <Row label="Zarabiasz vs mediana" value={`${r.vsMediana >= 0 ? '+' : ''}${r.vsMediana.toFixed(0)}%`} accent={r.vsMediana >= 0 ? '#2e7d4f' : '#ef4444'} />
            <Row label="Średnia krajowa (brutto)" value={`${fmt(SREDNIA)} zł`} />
            <Row label="Zarabiasz vs średnia" value={`${r.vsSrednia >= 0 ? '+' : ''}${r.vsSrednia.toFixed(0)}%`} accent={r.vsSrednia >= 0 ? '#2e7d4f' : '#ef4444'} />
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)' }}>
          Wpisz wynagrodzenie brutto, żeby zobaczyć swoją pozycję.
        </div>
      )}
    </div>
  );
}
