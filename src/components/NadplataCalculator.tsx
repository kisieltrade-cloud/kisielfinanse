'use client';

import { useState, useMemo } from 'react';

/* ── Kalkulator nadpłaty kredytu ───────────────────────────────────────────────
   Liczy oszczędność na odsetkach i skrócenie okresu po nadpłacie.
   Rata annuitowa: rata = P*r / (1 - (1+r)^-N), r = oprocentowanie/12, N = mies.
   - Jednorazowa nadpłata + skrócenie okresu: rata bez zmian, mniej rat.
   - Jednorazowa nadpłata + niższa rata: okres bez zmian, mniejsza rata.
   - Miesięczna nadpłata + skrócenie okresu: rata + dopłata, mniej rat.            */

type Tryb = 'jednorazowa' | 'miesieczna';
type Cel = 'skroc' | 'rata';

const fmt = (n: number) =>
  n.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmt0 = (n: number) => Math.round(n).toLocaleString('pl-PL');

function okresLabel(mies: number): string {
  const lata = Math.floor(mies / 12);
  const m = Math.round(mies % 12);
  if (lata === 0) return `${m} mies.`;
  if (m === 0) return `${lata} ${lata === 1 ? 'rok' : lata < 5 ? 'lata' : 'lat'}`;
  return `${lata} ${lata === 1 ? 'rok' : lata < 5 ? 'lata' : 'lat'} ${m} mies.`;
}

interface Result {
  rata: number;
  odsetkiBaza: number;
  odsetkiPo: number;
  oszczednosc: number;
  tryb: Tryb;
  cel: Cel;
  nowaRata?: number;
  obnizkaRaty?: number;
  nowyOkresMies?: number;
  skrocenieMies?: number;
}

function oblicz(P: number, oprocent: number, lata: number, nadplata: number, tryb: Tryb, cel: Cel): Result | null {
  if (!P || P <= 0 || !oprocent || oprocent <= 0 || !lata || lata <= 0) return null;
  const r = oprocent / 100 / 12;
  const N = Math.round(lata * 12);
  const rata = P * r / (1 - Math.pow(1 + r, -N));
  const odsetkiBaza = rata * N - P;

  if (!nadplata || nadplata <= 0) {
    return { rata, odsetkiBaza, odsetkiPo: odsetkiBaza, oszczednosc: 0, tryb, cel };
  }

  if (tryb === 'jednorazowa') {
    const newP = P - nadplata;
    if (newP <= 0) {
      // Nadpłata >= kapitał: kredyt spłacony od razu
      return { rata, odsetkiBaza, odsetkiPo: 0, oszczednosc: odsetkiBaza, tryb, cel, nowyOkresMies: 0, skrocenieMies: N };
    }
    if (cel === 'skroc') {
      const n = -Math.log(1 - (newP * r) / rata) / Math.log(1 + r);
      const odsetkiPo = rata * n - newP;
      return {
        rata, odsetkiBaza, odsetkiPo, oszczednosc: odsetkiBaza - odsetkiPo, tryb, cel,
        nowyOkresMies: n, skrocenieMies: N - n,
      };
    } else {
      const nowaRata = newP * r / (1 - Math.pow(1 + r, -N));
      const odsetkiPo = nowaRata * N - newP;
      return {
        rata, odsetkiBaza, odsetkiPo, oszczednosc: odsetkiBaza - odsetkiPo, tryb, cel,
        nowaRata, obnizkaRaty: rata - nowaRata,
      };
    }
  }

  // miesięczna nadpłata + skrócenie okresu
  const nowaRata = rata + nadplata;
  const n = -Math.log(1 - (P * r) / nowaRata) / Math.log(1 + r);
  const odsetkiPo = nowaRata * n - P;
  return {
    rata, odsetkiBaza, odsetkiPo, oszczednosc: odsetkiBaza - odsetkiPo, tryb, cel: 'skroc',
    nowaRata, nowyOkresMies: n, skrocenieMies: N - n,
  };
}

function Field({ label, value, onChange, placeholder, prefix, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; prefix?: string; hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{
        fontFamily: 'var(--font-body)', fontSize: '0.85rem',
        color: focused ? '#2e7d4f' : 'var(--muted)',
        display: 'block', marginBottom: 6, transition: 'color 0.15s',
      }}>{label}</label>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 8,
        borderBottom: `1px solid ${focused ? '#2e7d4f' : 'var(--border)'}`,
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

export default function NadplataCalculator() {
  const [kwota, setKwota] = useState('');
  const [oprocent, setOprocent] = useState('');
  const [lata, setLata] = useState('');
  const [nadplata, setNadplata] = useState('');
  const [tryb, setTryb] = useState<Tryb>('jednorazowa');
  const [cel, setCel] = useState<Cel>('skroc');

  const r = useMemo(
    () => oblicz(parseFloat(kwota), parseFloat(oprocent), parseFloat(lata), parseFloat(nadplata), tryb, cel),
    [kwota, oprocent, lata, nadplata, tryb, cel],
  );

  const TRYBY: { key: Tryb; label: string }[] = [
    { key: 'jednorazowa', label: 'Nadpłata jednorazowa' },
    { key: 'miesieczna', label: 'Dopłata co miesiąc' },
  ];

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 20, padding: 'clamp(24px, 5vw, 40px)',
    }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {TRYBY.map(t => (
          <button key={t.key} type="button" onClick={() => setTryb(t.key)} style={{
            flex: '1 1 140px', padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '0.74rem', letterSpacing: '0.3px',
            background: tryb === t.key ? 'rgba(46,125,79,0.12)' : 'transparent',
            border: `1px solid ${tryb === t.key ? '#2e7d4f' : 'var(--border)'}`,
            color: tryb === t.key ? '#2e7d4f' : 'var(--muted)', transition: 'all 0.15s',
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 22, marginBottom: 22 }}>
        <Field label="Pozostały kapitał kredytu" value={kwota} onChange={setKwota} placeholder="np. 300000" prefix="zł" />
        <Field label="Oprocentowanie" value={oprocent} onChange={setOprocent} placeholder="np. 6.5" prefix="%" />
        <Field label="Pozostały okres" value={lata} onChange={setLata} placeholder="np. 25" prefix="lat" />
        <Field
          label={tryb === 'jednorazowa' ? 'Kwota nadpłaty' : 'Dopłata miesięczna'}
          value={nadplata} onChange={setNadplata}
          placeholder={tryb === 'jednorazowa' ? 'np. 30000' : 'np. 500'} prefix="zł"
        />
      </div>

      {tryb === 'jednorazowa' && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          {([['skroc', 'Skróć okres'], ['rata', 'Zmniejsz ratę']] as [Cel, string][]).map(([k, l]) => (
            <button key={k} type="button" onClick={() => setCel(k)} style={{
              flex: '1 1 120px', padding: '9px 12px', borderRadius: 10, cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: '0.74rem',
              background: cel === k ? 'rgba(46,125,79,0.1)' : 'transparent',
              border: `1px solid ${cel === k ? '#2e7d4f' : 'var(--border)'}`,
              color: cel === k ? '#2e7d4f' : 'var(--muted)', transition: 'all 0.15s',
            }}>{l}</button>
          ))}
        </div>
      )}

      <div style={{ height: 1, background: 'var(--border)', marginBottom: 32 }} />

      {r ? (
        <>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-end',
            marginBottom: 28, padding: '24px 28px', background: 'rgba(46,125,79,0.07)',
            border: '1px solid rgba(46,125,79,0.25)', borderRadius: 16,
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>
                {r.cel === 'rata' && r.tryb === 'jednorazowa' ? 'Niższa rata o' : 'Oszczędność na odsetkach'}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 6vw, 3.4rem)', color: '#2e7d4f', letterSpacing: '2px', lineHeight: 1 }}>
                {r.cel === 'rata' && r.tryb === 'jednorazowa' && r.obnizkaRaty != null
                  ? `${fmt0(r.obnizkaRaty)} zł/mc`
                  : `${fmt0(r.oszczednosc)} zł`}
              </div>
            </div>
            {r.skrocenieMies != null && r.skrocenieMies > 0 && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                krócej o {okresLabel(r.skrocenieMies)}<br />
                oszczędność {fmt0(r.oszczednosc)} zł
              </div>
            )}
          </div>

          <div>
            <Row label="Rata bez nadpłaty" value={`${fmt(r.rata)} zł`} />
            {r.nowaRata != null && r.tryb === 'miesieczna' && (
              <Row label="Rata z dopłatą" value={`${fmt(r.nowaRata)} zł`} accent="#2e7d4f" />
            )}
            {r.nowaRata != null && r.cel === 'rata' && (
              <Row label="Nowa rata" value={`${fmt(r.nowaRata)} zł`} accent="#2e7d4f" />
            )}
            <Row label="Odsetki bez nadpłaty" value={`${fmt0(r.odsetkiBaza)} zł`} />
            <Row label="Odsetki po nadpłacie" value={`${fmt0(r.odsetkiPo)} zł`} />
            <Row label="Zaoszczędzone odsetki" value={`${fmt0(r.oszczednosc)} zł`} accent="#2e7d4f" />
            {r.nowyOkresMies != null && (
              <Row label="Nowy okres kredytu" value={okresLabel(r.nowyOkresMies)} />
            )}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)' }}>
          Wpisz dane kredytu i kwotę nadpłaty, żeby zobaczyć oszczędność.
        </div>
      )}
    </div>
  );
}
