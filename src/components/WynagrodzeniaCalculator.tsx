'use client';

import { useState, useMemo } from 'react';

/* ── Stawki 2026 (umowa o pracę) ──────────────────────────────────────────────
   Składki pracownika: emerytalna 9,76% + rentowa 1,5% + chorobowa 2,45% = 13,71%
   Zdrowotna: 9% od podstawy (brutto - składki społeczne), bez odliczenia od PIT
   KUP podstawowe: 250 zł, kwota zmniejszająca: 300 zł/mies (PIT-2)
   PIT: 12% do progu, 32% powyżej (próg 120 000 zł/rok = 10 000 zł/mies)
   PPK: pracownik 2%, pracodawca 1,5% (część pracodawcy doliczana do podstawy PIT)        */
const SKL_SPOLECZNE = 0.0976 + 0.015 + 0.0245; // 13,71%
const ZDROWOTNA = 0.09;
const KUP = 250;
const KWOTA_ZMNIEJSZ = 300;
const PROG_MIES = 10000; // 120 000 / 12
// Narzuty pracodawcy: emer. 9,76% + rent. 6,5% + wypadk. 1,67% + FP 2,45% + FGŚP 0,10%
const NARZUT_PRACODAWCY = 0.0976 + 0.065 + 0.0167 + 0.0245 + 0.001;

const fmt = (n: number) =>
  n.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function Field({ label, value, onChange, placeholder, prefix, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; prefix?: string; hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{
        fontFamily: 'var(--font-body)', fontSize: '0.85rem',
        color: focused ? '#c9a227' : 'var(--muted)',
        display: 'block', marginBottom: 6, transition: 'color 0.15s',
      }}>{label}</label>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 8,
        borderBottom: `1px solid ${focused ? '#c9a227' : 'var(--border)'}`,
        transition: 'border-color 0.15s', paddingBottom: 7,
      }}>
        <input
          type="number" value={value} placeholder={placeholder} min="0"
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            background: 'transparent', border: 'none', color: 'var(--text)',
            fontFamily: 'var(--font-body)', fontSize: '1.1rem', fontWeight: 700,
            width: '100%', outline: 'none',
          }}
        />
        {prefix && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)', flexShrink: 0 }}>{prefix}</span>}
      </div>
      {hint && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--muted)', marginTop: 4 }}>{hint}</p>}
    </div>
  );
}

function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} type="button" style={{
      display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
      background: 'transparent', border: 'none', padding: 0,
    }}>
      <span style={{
        width: 38, height: 22, borderRadius: 12, flexShrink: 0,
        background: on ? '#c9a227' : 'var(--border)', position: 'relative',
        transition: 'background 0.2s',
      }}>
        <span style={{
          position: 'absolute', top: 2, left: on ? 18 : 2, width: 18, height: 18,
          borderRadius: '50%', background: '#fff', transition: 'left 0.2s',
        }} />
      </span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text)' }}>{label}</span>
    </button>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '11px 0', borderBottom: '1px solid var(--border)',
    }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--muted)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', fontWeight: 600, color: accent ?? 'var(--text)' }}>{value}</span>
    </div>
  );
}

export default function WynagrodzeniaCalculator() {
  const [brutto, setBrutto] = useState('');
  const [ppk, setPpk] = useState(false);
  const [mlody, setMlody] = useState(false);

  const r = useMemo(() => {
    const b = parseFloat(brutto);
    if (!b || b <= 0) return null;

    const spoleczne = b * SKL_SPOLECZNE;
    const podstZdrow = b - spoleczne;
    const zdrowotna = podstZdrow * ZDROWOTNA;
    const ppkPrac = ppk ? b * 0.02 : 0;
    const ppkPracodawca = ppk ? b * 0.015 : 0;

    const podstawaOpod = Math.round(b - spoleczne - KUP + ppkPracodawca);
    let zaliczka = 0;
    if (!mlody) {
      const pit = podstawaOpod <= PROG_MIES
        ? podstawaOpod * 0.12
        : PROG_MIES * 0.12 + (podstawaOpod - PROG_MIES) * 0.32;
      zaliczka = Math.max(0, Math.round(pit - KWOTA_ZMNIEJSZ));
    }

    const netto = b - spoleczne - zdrowotna - zaliczka - ppkPrac;
    const kosztPracodawcy = b + b * NARZUT_PRACODAWCY + ppkPracodawca;

    return { b, spoleczne, zdrowotna, zaliczka, ppkPrac, netto, kosztPracodawcy };
  }, [brutto, ppk, mlody]);

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 20, padding: 'clamp(24px, 5vw, 40px)',
    }}>
      <div style={{ marginBottom: 28 }}>
        <Field
          label="Wynagrodzenie brutto (miesięcznie)"
          value={brutto} onChange={setBrutto}
          placeholder="np. 8000" prefix="zł"
          hint="Kwota brutto z umowy o pracę."
        />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 28px', marginBottom: 32 }}>
        <Toggle label="PPK (2%)" on={ppk} onClick={() => setPpk(v => !v)} />
        <Toggle label="Ulga dla młodych (do 26 lat)" on={mlody} onClick={() => setMlody(v => !v)} />
      </div>

      <div style={{ height: 1, background: 'var(--border)', marginBottom: 32 }} />

      {r ? (
        <>
          {/* Hero: netto */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28,
            padding: '24px 28px', background: 'rgba(201,162,39,0.07)',
            border: '1px solid rgba(201,162,39,0.25)', borderRadius: 16,
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>
                Na rękę (netto)
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 6vw, 3.4rem)', color: '#c9a227', letterSpacing: '2px', lineHeight: 1 }}>
                {fmt(r.netto)} zł
              </div>
            </div>
          </div>

          {/* Rozbicie */}
          <div style={{ marginBottom: 28 }}>
            <Row label="Wynagrodzenie brutto" value={`${fmt(r.b)} zł`} />
            <Row label="Składki społeczne (13,71%)" value={`- ${fmt(r.spoleczne)} zł`} accent="#ef4444" />
            <Row label="Składka zdrowotna (9%)" value={`- ${fmt(r.zdrowotna)} zł`} accent="#ef4444" />
            <Row label="Zaliczka na PIT" value={`- ${fmt(r.zaliczka)} zł`} accent="#ef4444" />
            {r.ppkPrac > 0 && <Row label="Wpłata PPK (2%)" value={`- ${fmt(r.ppkPrac)} zł`} accent="#ef4444" />}
            <Row label="Netto na rękę" value={`${fmt(r.netto)} zł`} accent="#c9a227" />
          </div>

          {/* Koszt pracodawcy */}
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '18px 22px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8,
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Całkowity koszt pracodawcy
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>
                brutto + składki pracodawcy (ok. 20%)
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--text)', letterSpacing: '1px' }}>
              {fmt(r.kosztPracodawcy)} zł
            </div>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)' }}>
          Wpisz kwotę brutto, żeby zobaczyć wynagrodzenie netto.
        </div>
      )}
    </div>
  );
}
