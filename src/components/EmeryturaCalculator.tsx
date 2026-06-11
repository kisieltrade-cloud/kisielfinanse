'use client';

import { useState, useMemo } from 'react';

/* ── Parametry 2026 ───────────────────────────────────────────────────────────
   Składka emerytalna: 19,52% podstawy (9,76% pracownik + 9,76% pracodawca).
   Emerytura ZUS = zgromadzony kapitał / średnie dalsze trwanie życia (miesiące).
   Tablice GUS 2026 (od 1.04.2026, unisex): wiek 60 → 268,9 mc, 65 → 222,7 mc.
   Model uproszczony: liczymy w dzisiejszych złotych, zakładając że waloryzacja
   kapitału w ZUS mniej więcej nadąża za wzrostem wynagrodzeń (ujęcie realne).   */
const SKLADKA_EMERYTALNA = 0.1952;
const DOCELOWA_STOPA = 0.70; // przyzwoita emerytura ≈ 70% ostatniej pensji netto
const REAL_RETURN = 0.035;   // realny zwrot dodatkowych oszczędności (IKE/IKZE/ETF)

// Średnie dalsze trwanie życia w miesiącach wg wieku (interpolacja tablicy GUS 2026)
function dalszeTrwanie(wiek: number): number {
  const slope = (222.7 - 268.9) / (65 - 60); // -9,24 mc na rok
  return Math.min(330, Math.max(140, 268.9 + slope * (wiek - 60)));
}

// Brutto → netto (umowa o pracę 2026), uproszczone na potrzeby stopy zastąpienia
function bruttoNaNetto(b: number): number {
  const spoleczne = b * 0.1371;
  const zdrowotna = (b - spoleczne) * 0.09;
  const podst = Math.round(b - spoleczne - 250);
  const pit = podst <= 10000 ? podst * 0.12 : 10000 * 0.12 + (podst - 10000) * 0.32;
  const zaliczka = Math.max(0, Math.round(pit - 300));
  return b - spoleczne - zdrowotna - zaliczka;
}

const ACCENT = '#2f80b5';
const fmt = (n: number) =>
  n.toLocaleString('pl-PL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

function Field({ label, value, onChange, placeholder, prefix, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; prefix?: string; hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{
        fontFamily: 'var(--font-body)', fontSize: '0.85rem',
        color: focused ? ACCENT : 'var(--muted)',
        display: 'block', marginBottom: 6, transition: 'color 0.15s',
      }}>{label}</label>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 8,
        borderBottom: `1px solid ${focused ? ACCENT : 'var(--border)'}`,
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

export default function EmeryturaCalculator() {
  const [plec, setPlec] = useState<'k' | 'm'>('k');
  const [wiek, setWiek] = useState('35');
  const [brutto, setBrutto] = useState('');
  const [staz, setStaz] = useState('');
  const [wiekEmer, setWiekEmer] = useState('60');

  function zmienPlec(p: 'k' | 'm') {
    setPlec(p);
    setWiekEmer(p === 'k' ? '60' : '65');
  }

  const r = useMemo(() => {
    const b = parseFloat(brutto);
    const w = parseFloat(wiek);
    const we = parseFloat(wiekEmer);
    const st = parseFloat(staz) || 0;
    if (!b || b <= 0 || !w || w <= 0 || !we || we <= w) return null;

    const netto = bruttoNaNetto(b);
    const skladkaRoczna = b * 12 * SKLADKA_EMERYTALNA;
    const przyszleLata = we - w;
    const lacznyStaz = st + przyszleLata;
    const kapital = skladkaRoczna * lacznyStaz;
    const dalej = dalszeTrwanie(we);
    const emerytura = kapital / dalej;

    const stopa = (emerytura / netto) * 100;
    const docelowa = DOCELOWA_STOPA * netto;
    const luka = Math.max(0, docelowa - emerytura);

    // ile odkładać miesięcznie, by zniwelować lukę (FV renty, realny zwrot)
    const kapitalPotrzebny = luka * dalej; // wypłata luki przez okres emerytury (0% realnie w fazie wypłat)
    const i = REAL_RETURN / 12;
    const N = przyszleLata * 12;
    const ileDokladac = luka > 0 && N > 0
      ? kapitalPotrzebny * i / (Math.pow(1 + i, N) - 1)
      : 0;

    return { netto, emerytura, lacznyStaz, kapital, dalej, stopa, docelowa, luka, ileDokladac, przyszleLata };
  }, [brutto, wiek, wiekEmer, staz, plec]);

  // werdykt stopy zastąpienia
  const verdict = r
    ? r.stopa < 40
      ? { col: '#ef4444', txt: 'Niska. Sama emerytura z ZUS mocno obniży Twój standard życia.' }
      : r.stopa < 55
        ? { col: '#e8963a', txt: 'Przeciętna. Warto dołożyć własne oszczędności, by nie odczuć spadku.' }
        : { col: '#2e7d4f', txt: 'Przyzwoita jak na ZUS. Dodatkowe oszczędności i tak dadzą komfort.' }
    : null;

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 20, padding: 'clamp(24px, 5vw, 40px)',
    }}>
      {/* Płeć */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 26 }}>
        {([['k', 'Kobieta'], ['m', 'Mężczyzna']] as const).map(([key, label]) => (
          <button key={key} type="button" onClick={() => zmienPlec(key)} style={{
            flex: 1, padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '0.5px',
            background: plec === key ? 'rgba(47,128,181,0.12)' : 'transparent',
            border: `1px solid ${plec === key ? ACCENT : 'var(--border)'}`,
            color: plec === key ? ACCENT : 'var(--muted)', transition: 'all 0.15s',
          }}>{label}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '22px 28px', marginBottom: 28 }}>
        <Field label="Twój wiek" value={wiek} onChange={setWiek} placeholder="np. 35" prefix="lat" />
        <Field label="Wynagrodzenie brutto (mies.)" value={brutto} onChange={setBrutto} placeholder="np. 8000" prefix="zł" hint="Umowa o pracę." />
        <Field label="Lata już przepracowane" value={staz} onChange={setStaz} placeholder="np. 10" prefix="lat" hint="Dotychczasowy staż składkowy." />
        <Field label="Wiek przejścia na emeryturę" value={wiekEmer} onChange={setWiekEmer} placeholder="60" prefix="lat" hint="Domyślnie 60 (K) / 65 (M)." />
      </div>

      <div style={{ height: 1, background: 'var(--border)', marginBottom: 32 }} />

      {r ? (
        <>
          {/* Hero: prognozowana emerytura */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '8px 24px', marginBottom: 28,
            padding: '24px 28px', background: 'rgba(47,128,181,0.07)',
            border: '1px solid rgba(47,128,181,0.25)', borderRadius: 16,
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>
                Prognozowana emerytura z ZUS
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 6vw, 3.4rem)', color: ACCENT, letterSpacing: '2px', lineHeight: 1 }}>
                {fmt(r.emerytura)} zł
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--muted)', marginTop: 6 }}>
                miesięcznie, w dzisiejszych złotych (brutto)
              </div>
            </div>
          </div>

          {/* Stopa zastąpienia */}
          {verdict && (
            <div style={{
              borderLeft: `3px solid ${verdict.col}`, background: 'rgba(255,255,255,0.02)',
              padding: '14px 18px', borderRadius: '0 8px 8px 0', marginBottom: 26,
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: verdict.col, letterSpacing: '1px', lineHeight: 1 }}>
                  {r.stopa.toFixed(0)}%
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>
                  Twojej dzisiejszej pensji netto
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--muted)', margin: '8px 0 0', lineHeight: 1.6 }}>
                {verdict.txt}
              </p>
            </div>
          )}

          {/* Rozbicie */}
          <div style={{ marginBottom: 28 }}>
            <Row label="Łączny staż składkowy" value={`${r.lacznyStaz.toFixed(0)} lat`} />
            <Row label="Zgromadzony kapitał (szac.)" value={`${fmt(r.kapital)} zł`} />
            <Row label="Średnie dalsze trwanie życia" value={`${r.dalej.toFixed(0)} mies.`} />
            <Row label="Dzisiejsza pensja netto" value={`${fmt(r.netto)} zł`} />
          </div>

          {/* Luka emerytalna */}
          <div style={{
            background: 'var(--surface)', border: `1px solid ${r.luka > 0 ? 'rgba(239,68,68,0.3)' : 'rgba(46,125,79,0.3)'}`,
            borderRadius: 14, padding: '20px 24px',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>
              Luka emerytalna
            </div>
            {r.luka > 0 ? (
              <>
                <Row label={`Docelowa emerytura (${Math.round(DOCELOWA_STOPA * 100)}% netto)`} value={`${fmt(r.docelowa)} zł`} />
                <Row label="Brakuje miesięcznie" value={`- ${fmt(r.luka)} zł`} accent="#ef4444" />
                {r.ileDokladac > 0 && (
                  <div style={{ marginTop: 16, padding: '14px 18px', background: 'rgba(47,128,181,0.08)', borderRadius: 10 }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.6 }}>
                      Aby zniwelować lukę, odkładaj dodatkowo{' '}
                      <strong style={{ color: ACCENT }}>{fmt(r.ileDokladac)} zł miesięcznie</strong>{' '}
                      przez {r.przyszleLata.toFixed(0)} lat (przy realnym zwrocie 3,5% w skali roku, np. na IKE/IKZE).
                    </span>
                  </div>
                )}
              </>
            ) : (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: '#2e7d4f', margin: 0, lineHeight: 1.6 }}>
                Twoja prognozowana emerytura osiąga już docelowe {Math.round(DOCELOWA_STOPA * 100)}% pensji netto. Dodatkowe oszczędności dadzą po prostu większy komfort.
              </p>
            )}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)' }}>
          Uzupełnij wiek i pensję brutto, żeby zobaczyć prognozę.
        </div>
      )}
    </div>
  );
}
