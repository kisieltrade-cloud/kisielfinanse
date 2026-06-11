'use client';

import { useState, useMemo } from 'react';

/* ── Składka zdrowotna 2026 (działalność gospodarcza) ─────────────────────────
   Skala:    9%   dochodu, nie mniej niż składka minimalna
   Liniowy:  4,9% dochodu, nie mniej niż składka minimalna
   Ryczałt:  9% od 60% / 100% / 180% przeciętnego wynagrodzenia, wg progu przychodu
   Minimalna = 9% minimalnego wynagrodzenia (4 806 zł) = 432,54 zł
   Podstawa ryczałtu = przeciętne wynagrodzenie w sektorze przedsiębiorstw
   w IV kw. 2025 (z wypłatami z zysku) = 9 228,64 zł (GUS, 22.01.2026).
   Składki ryczałtu 2026: 498,35 / 830,58 / 1495,04 zł.                            */
const MIN_SKLADKA = 432.54;
const PRZECIETNE = 9228.64; // przeciętne wynagrodzenie IV kw. 2025 (GUS) - podstawa ryczałtu 2026
const RYCZALT_I = PRZECIETNE * 0.6 * 0.09;   // przychód do 60 000 zł/rok → 498,35 zł
const RYCZALT_II = PRZECIETNE * 1.0 * 0.09;  // 60 000 - 300 000 zł/rok → 830,58 zł
const RYCZALT_III = PRZECIETNE * 1.8 * 0.09; // powyżej 300 000 zł/rok → 1495,04 zł

type Forma = 'skala' | 'liniowy' | 'ryczalt';

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

export default function SkladkaZdrowotnaCalculator() {
  const [forma, setForma] = useState<Forma>('skala');
  const [kwota, setKwota] = useState('');

  const r = useMemo(() => {
    const v = parseFloat(kwota);

    if (forma === 'ryczalt') {
      // przychód roczny → próg
      if (!v || v < 0) return null;
      let skladka = RYCZALT_I;
      let prog = 'I (do 60 000 zł)';
      if (v > 300000) { skladka = RYCZALT_III; prog = 'III (powyżej 300 000 zł)'; }
      else if (v > 60000) { skladka = RYCZALT_II; prog = 'II (60 000 - 300 000 zł)'; }
      return { skladka, rocznie: skladka * 12, prog, minimum: false };
    }

    if (!v || v <= 0) return null;
    const stawka = forma === 'skala' ? 0.09 : 0.049;
    const wyliczona = v * stawka;
    const skladka = Math.max(wyliczona, MIN_SKLADKA);
    return { skladka, rocznie: skladka * 12, minimum: skladka === MIN_SKLADKA && wyliczona < MIN_SKLADKA, stawka };
  }, [forma, kwota]);

  const FORMY: { key: Forma; label: string }[] = [
    { key: 'skala', label: 'Skala' },
    { key: 'liniowy', label: 'Liniowy' },
    { key: 'ryczalt', label: 'Ryczałt' },
  ];

  const inputLabel = forma === 'ryczalt' ? 'Przychód roczny' : 'Dochód miesięczny';
  const inputHint = forma === 'ryczalt'
    ? 'Roczny przychód decyduje o progu składki.'
    : 'Dochód = przychód minus koszty, miesięcznie.';

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 20, padding: 'clamp(24px, 5vw, 40px)',
    }}>
      {/* Wybór formy */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {FORMY.map(f => (
          <button key={f.key} type="button" onClick={() => setForma(f.key)} style={{
            flex: '1 1 90px', padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '0.5px',
            background: forma === f.key ? 'rgba(46,125,79,0.12)' : 'transparent',
            border: `1px solid ${forma === f.key ? '#2e7d4f' : 'var(--border)'}`,
            color: forma === f.key ? '#2e7d4f' : 'var(--muted)', transition: 'all 0.15s',
          }}>{f.label}</button>
        ))}
      </div>

      <div style={{ marginBottom: 32 }}>
        <Field
          label={inputLabel} value={kwota} onChange={setKwota}
          placeholder={forma === 'ryczalt' ? 'np. 200000' : 'np. 12000'}
          prefix="zł" hint={inputHint}
        />
      </div>

      <div style={{ height: 1, background: 'var(--border)', marginBottom: 32 }} />

      {r ? (
        <>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28,
            padding: '24px 28px', background: 'rgba(46,125,79,0.07)',
            border: '1px solid rgba(46,125,79,0.25)', borderRadius: 16,
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>
                Składka zdrowotna miesięcznie
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 6vw, 3.4rem)', color: '#2e7d4f', letterSpacing: '2px', lineHeight: 1 }}>
                {fmt(r.skladka)} zł
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <Row label="Składka rocznie" value={`${fmt(r.rocznie)} zł`} />
            {forma === 'ryczalt' && 'prog' in r && (
              <Row label="Próg przychodu" value={r.prog as string} />
            )}
            {'minimum' in r && r.minimum && (
              <Row label="Zastosowano składkę minimalną" value={`${fmt(MIN_SKLADKA)} zł`} accent="#2e7d4f" />
            )}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)' }}>
          Wybierz formę i wpisz kwotę, żeby zobaczyć składkę.
        </div>
      )}
    </div>
  );
}
