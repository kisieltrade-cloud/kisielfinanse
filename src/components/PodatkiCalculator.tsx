'use client';

import { useState, useMemo } from 'react';

const ACCENT = '#ff2d78';
const fmt = (n: number) => Math.round(n).toLocaleString('pl-PL');

// Składki pracownika 13,71%, zdrowotna 9%, PIT 12/32, KUP 250, kwota zmn. 300, próg 10000/mc
// Narzut pracodawcy ~20,48% (emer. 9,76 + rent. 6,5 + wypadk. 1,67 + FP 2,45 + FGŚP 0,10)
const NARZUT_PRACODAWCY = 0.0976 + 0.065 + 0.0167 + 0.0245 + 0.001;

// Szacunkowa struktura wydatków sektora finansów publicznych (ujęcie poglądowe 2026)
const WYDATKI: { nazwa: string; udzial: number; kolor: string }[] = [
  { nazwa: 'Emerytury i renty',            udzial: 0.32, kolor: '#ff2d78' },
  { nazwa: 'Ochrona zdrowia',              udzial: 0.16, kolor: '#3b82f6' },
  { nazwa: 'Edukacja i nauka',             udzial: 0.10, kolor: '#22c55e' },
  { nazwa: 'Obrona narodowa',              udzial: 0.09, kolor: '#6b7280' },
  { nazwa: 'Świadczenia społeczne (800+)', udzial: 0.07, kolor: '#e8963a' },
  { nazwa: 'Obsługa długu publicznego',    udzial: 0.06, kolor: '#dc2626' },
  { nazwa: 'Bezpieczeństwo i sądy',        udzial: 0.06, kolor: '#8b5cf6' },
  { nazwa: 'Infrastruktura i transport',   udzial: 0.06, kolor: '#0ea5a4' },
  { nazwa: 'Administracja',                udzial: 0.04, kolor: '#a16207' },
  { nazwa: 'Pozostałe',                    udzial: 0.04, kolor: '#94a3b8' },
];

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

export default function PodatkiCalculator() {
  const [brutto, setBrutto] = useState('');

  const r = useMemo(() => {
    const b = parseFloat(brutto);
    if (!b || b <= 0) return null;

    const spoleczne = b * 0.1371;
    const zdrowotna = (b - spoleczne) * 0.09;
    const podst = Math.round(b - spoleczne - 250);
    const pit = podst <= 10000 ? podst * 0.12 : 10000 * 0.12 + (podst - 10000) * 0.32;
    const zaliczka = Math.max(0, Math.round(pit - 300));
    const netto = b - spoleczne - zdrowotna - zaliczka;

    const daninaPracownik = spoleczne + zdrowotna + zaliczka;
    const narzutPracodawcy = b * NARZUT_PRACODAWCY;
    const kosztPracodawcy = b + narzutPracodawcy;
    const daninaTotal = daninaPracownik + narzutPracodawcy;
    const klin = (daninaTotal / kosztPracodawcy) * 100;
    const procBrutto = (daninaPracownik / b) * 100;

    return { b, spoleczne, zdrowotna, zaliczka, netto, daninaPracownik, daninaTotal, kosztPracodawcy, klin, procBrutto };
  }, [brutto]);

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 'clamp(24px, 5vw, 40px)' }}>
      <div style={{ marginBottom: 32 }}>
        <Field label="Twoje wynagrodzenie brutto (miesięcznie)" value={brutto} onChange={setBrutto} placeholder="np. 8000" prefix="zł" hint="Umowa o pracę." />
      </div>

      <div style={{ height: 1, background: 'var(--border)', marginBottom: 32 }} />

      {r ? (
        <>
          {/* Hero */}
          <div style={{ padding: '24px 28px', background: 'rgba(255,45,120,0.07)', border: '1px solid rgba(255,45,120,0.25)', borderRadius: 16, marginBottom: 24 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
              Co miesiąc oddajesz państwu
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 7vw, 3.8rem)', color: ACCENT, letterSpacing: '1px', lineHeight: 1 }}>
              {fmt(r.daninaPracownik)} zł
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text)', marginTop: 8 }}>
              to {r.procBrutto.toFixed(0)}% Twojego brutto · rocznie {fmt(r.daninaPracownik * 12)} zł
            </div>
          </div>

          {/* Klin podatkowy */}
          <div style={{ borderLeft: `3px solid ${ACCENT}`, background: 'rgba(255,255,255,0.02)', padding: '14px 18px', borderRadius: '0 8px 8px 0', marginBottom: 26 }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>
              Razem ze składkami pracodawcy Twoja praca kosztuje <strong>{fmt(r.kosztPracodawcy)} zł</strong>, a do państwa trafia <strong style={{ color: ACCENT }}>{fmt(r.daninaTotal)} zł</strong> miesięcznie. To klin podatkowy <strong style={{ color: ACCENT }}>{r.klin.toFixed(0)}%</strong>.
            </p>
          </div>

          {/* Co sklada sie na danine */}
          <div style={{ marginBottom: 30 }}>
            <Row label="Składki społeczne ZUS (emerytalne, rentowe, chorobowe)" value={`${fmt(r.spoleczne)} zł`} />
            <Row label="Składka zdrowotna (NFZ)" value={`${fmt(r.zdrowotna)} zł`} />
            <Row label="Zaliczka na PIT" value={`${fmt(r.zaliczka)} zł`} />
            <Row label="Zostaje Ci na rękę" value={`${fmt(r.netto)} zł`} accent="#2e7d4f" />
          </div>

          {/* Na co ida publiczne pieniadze */}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>
            Na co idzie Twoja danina ({fmt(r.daninaPracownik)} zł/mies.)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {WYDATKI.map((w) => (
              <div key={w.nazwa}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.86rem', color: 'var(--text)' }}>{w.nazwa}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--muted)' }}>
                    {fmt(r.daninaPracownik * w.udzial)} zł · {Math.round(w.udzial * 100)}%
                  </span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                  <div style={{ width: `${w.udzial / WYDATKI[0].udzial * 100}%`, height: '100%', background: w.kolor, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)' }}>
          Wpisz wynagrodzenie brutto, żeby zobaczyć, ile oddajesz państwu.
        </div>
      )}
    </div>
  );
}
