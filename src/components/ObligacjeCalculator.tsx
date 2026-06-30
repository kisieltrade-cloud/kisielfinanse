'use client';

import { useState, useMemo } from 'react';

/* ── Kalkulator odsetek od obligacji skarbowych ───────────────────────────────
   Oferta detalicznych obligacji skarbowych - lipiec 2026 (Ministerstwo Finansów).
   Stopa referencyjna NBP = 3,75% (lipiec 2026). Podatek Belki 19% od odsetek.

   Mechanika oprocentowania (I rok stały, potem wg typu):
   - OTS  3-mies.  stałe 2,00% (odsetki na koniec)
   - ROR  1-roczna I miesiąc 4,00%, potem stopa ref. NBP; odsetki co miesiąc
   - DOR  2-letnia I miesiąc 4,15%, potem ref. NBP + 0,10%; odsetki co miesiąc
   - TOS  3-letnia stałe 4,40%, kapitalizacja roczna (odsetki dopisywane)
   - COI  4-letnia I rok 4,75%, potem inflacja + 1,50%; odsetki wypłacane co rok
   - EDO  10-letnia I rok 5,35%, potem inflacja + 2,00%; kapitalizacja roczna
   - ROS  6-letnia rodzinna I rok 5,75%, potem inflacja + 2,00%; kapitalizacja
   - ROD  12-letnia rodzinna I rok 6,05%, potem inflacja + 2,50%; kapitalizacja

   Obligacje indeksowane inflacją (COI/EDO/ROS/ROD) w latach kolejnych zależą od
   inflacji - kalkulator przyjmuje wartość zakładaną przez użytkownika.            */

const REF_NBP = 0.0375; // stopa referencyjna NBP, lipiec 2026
const BELKA = 0.19;

type Mech = 'staly' | 'miesieczny' | 'indeks-wyplata' | 'indeks-kapitalizacja' | 'staly-kapitalizacja';

interface Bond {
  key: string;
  name: string;        // krótka nazwa, np. EDO
  label: string;       // pełny opis
  lata: number;        // okres w latach (OTS = 0.25)
  pierwszyRok: number; // oprocentowanie I roku / okresu
  marza: number;       // marża ponad inflację (indeksowane) lub ponad ref. NBP (miesięczne)
  mech: Mech;
  indeks: boolean;     // czy lata kolejne zależą od inflacji
}

const BONDS: Bond[] = [
  { key: 'OTS', name: 'OTS', label: '3-miesięczna, stałe 2,00%',         lata: 0.25, pierwszyRok: 0.02,   marza: 0,      mech: 'staly',                indeks: false },
  { key: 'ROR', name: 'ROR', label: '1-roczna, zmienne wg stopy NBP',    lata: 1,    pierwszyRok: 0.04,   marza: 0,      mech: 'miesieczny',           indeks: false },
  { key: 'DOR', name: 'DOR', label: '2-letnia, zmienne wg stopy NBP',    lata: 2,    pierwszyRok: 0.0415, marza: 0.001,  mech: 'miesieczny',           indeks: false },
  { key: 'TOS', name: 'TOS', label: '3-letnia, stałe 4,40%',             lata: 3,    pierwszyRok: 0.044,  marza: 0,      mech: 'staly-kapitalizacja',  indeks: false },
  { key: 'COI', name: 'COI', label: '4-letnia, indeksowana inflacją',    lata: 4,    pierwszyRok: 0.0475, marza: 0.015,  mech: 'indeks-wyplata',       indeks: true  },
  { key: 'EDO', name: 'EDO', label: '10-letnia, indeksowana inflacją',   lata: 10,   pierwszyRok: 0.0535, marza: 0.02,   mech: 'indeks-kapitalizacja', indeks: true  },
];

const fmt = (n: number) =>
  n.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmt0 = (n: number) =>
  n.toLocaleString('pl-PL', { maximumFractionDigits: 0 });
const pct = (n: number) =>
  (n * 100).toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

interface YearRow { rok: string; rate: number; odsetki: number }
interface Result {
  liczba: number;
  kapital: number;
  odsetkiBrutto: number;
  podatek: number;
  odsetkiNetto: number;
  wartoscNetto: number;
  zyskNettoPct: number;
  rocznieNetto: number;
  rows: YearRow[];
  kapitalizacja: boolean;
}

function oblicz(bond: Bond, kwota: number, inflacja: number): Result | null {
  if (!kwota || kwota < 100) return null;
  const liczba = Math.floor(kwota / 100);
  const K = liczba * 100; // obligacje sprzedawane po 100 zł
  if (K < 100) return null;

  const rows: YearRow[] = [];
  let odsetkiBrutto = 0;
  let kapitalizacja = false;

  if (bond.mech === 'staly') {
    // OTS - 3 miesiące, stałe
    const od = K * bond.pierwszyRok * bond.lata;
    odsetkiBrutto = od;
    rows.push({ rok: '3 miesiące', rate: bond.pierwszyRok, odsetki: od });
  } else if (bond.mech === 'miesieczny') {
    // ROR / DOR - I miesiąc stały, kolejne wg stopy ref. NBP (+ marża)
    const miesiace = Math.round(bond.lata * 12);
    const stawkaPozniej = REF_NBP + bond.marza;
    const m1 = K * bond.pierwszyRok / 12;
    const mReszta = K * stawkaPozniej / 12 * (miesiace - 1);
    odsetkiBrutto = m1 + mReszta;
    rows.push({ rok: '1. miesiąc', rate: bond.pierwszyRok, odsetki: m1 });
    rows.push({ rok: `pozostałe ${miesiace - 1} mies.`, rate: stawkaPozniej, odsetki: mReszta });
  } else if (bond.mech === 'staly-kapitalizacja') {
    // TOS - stałe z kapitalizacją roczną
    kapitalizacja = true;
    let base = K;
    for (let y = 1; y <= bond.lata; y++) {
      const od = base * bond.pierwszyRok;
      rows.push({ rok: `Rok ${y}`, rate: bond.pierwszyRok, odsetki: od });
      base += od;
      odsetkiBrutto += od;
    }
  } else if (bond.mech === 'indeks-wyplata') {
    // COI - I rok stały (wypłata), kolejne inflacja + marża (wypłata, bez kapitalizacji)
    const od1 = K * bond.pierwszyRok;
    rows.push({ rok: 'Rok 1', rate: bond.pierwszyRok, odsetki: od1 });
    odsetkiBrutto += od1;
    const rate = inflacja + bond.marza;
    for (let y = 2; y <= bond.lata; y++) {
      const od = K * rate;
      rows.push({ rok: `Rok ${y}`, rate, odsetki: od });
      odsetkiBrutto += od;
    }
  } else {
    // EDO / ROS / ROD - I rok stały, kolejne inflacja + marża, kapitalizacja roczna
    kapitalizacja = true;
    let base = K;
    const od1 = base * bond.pierwszyRok;
    rows.push({ rok: 'Rok 1', rate: bond.pierwszyRok, odsetki: od1 });
    base += od1;
    odsetkiBrutto += od1;
    const rate = inflacja + bond.marza;
    for (let y = 2; y <= bond.lata; y++) {
      const od = base * rate;
      rows.push({ rok: `Rok ${y}`, rate, odsetki: od });
      base += od;
      odsetkiBrutto += od;
    }
  }

  const podatek = odsetkiBrutto * BELKA;
  const odsetkiNetto = odsetkiBrutto - podatek;
  const wartoscNetto = K + odsetkiNetto;
  const zyskNettoPct = odsetkiNetto / K;
  const rocznieNetto = odsetkiNetto / bond.lata;

  return {
    liczba, kapital: K, odsetkiBrutto, podatek, odsetkiNetto,
    wartoscNetto, zyskNettoPct, rocznieNetto, rows, kapitalizacja,
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

export default function ObligacjeCalculator() {
  const [bondKey, setBondKey] = useState('EDO');
  const [kwota, setKwota] = useState('');
  const [inflacja, setInflacja] = useState('3');

  const bond = BONDS.find(b => b.key === bondKey)!;
  const inflVal = (parseFloat(inflacja) || 0) / 100;

  const r = useMemo(
    () => oblicz(bond, parseFloat(kwota), inflVal),
    [bond, kwota, inflVal],
  );

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 20, padding: 'clamp(24px, 5vw, 40px)',
    }}>
      {/* Wybór obligacji */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 10,
        }}>Rodzaj obligacji</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(96px, 1fr))', gap: 8 }}>
          {BONDS.map(b => (
            <button key={b.key} type="button" onClick={() => setBondKey(b.key)} style={{
              padding: '12px 10px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
              background: bondKey === b.key ? 'rgba(46,125,79,0.12)' : 'transparent',
              border: `1px solid ${bondKey === b.key ? '#2e7d4f' : 'var(--border)'}`,
              transition: 'all 0.15s',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', letterSpacing: '1px', color: bondKey === b.key ? '#2e7d4f' : 'var(--text)' }}>{b.name}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', marginTop: 3, lineHeight: 1.3 }}>{b.lata < 1 ? '3 mies.' : `${b.lata} ${b.lata === 1 ? 'rok' : b.lata < 5 ? 'lata' : 'lat'}`}</div>
            </button>
          ))}
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--muted)', marginTop: 10 }}>{bond.label}</p>
      </div>

      <div style={{ marginBottom: bond.indeks ? 22 : 32 }}>
        <Field
          label="Kwota inwestycji" value={kwota} onChange={setKwota}
          placeholder="np. 10000" prefix="zł"
          hint="Obligacje sprzedawane są po 100 zł - kwota zaokrąglana w dół."
        />
      </div>

      {bond.indeks && (
        <div style={{ marginBottom: 32 }}>
          <Field
            label="Zakładana inflacja (lata kolejne)" value={inflacja} onChange={setInflacja}
            placeholder="np. 3" prefix="%"
            hint={`Oprocentowanie po I roku = inflacja + ${pct(bond.marza)} pkt proc. marży.`}
          />
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
                Odsetki netto za cały okres
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 6vw, 3.4rem)', color: '#2e7d4f', letterSpacing: '2px', lineHeight: 1 }}>
                {fmt(r.odsetkiNetto)} zł
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.6 }}>
              zysk netto {pct(r.zyskNettoPct)}%<br />
              wartość na koniec {fmt(r.wartoscNetto)} zł
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Row label={`Kapitał (${fmt0(r.liczba)} obligacji × 100 zł)`} value={`${fmt(r.kapital)} zł`} />
            <Row label="Odsetki brutto" value={`${fmt(r.odsetkiBrutto)} zł`} />
            <Row label="Podatek Belki (19%)" value={`- ${fmt(r.podatek)} zł`} accent="#c0392b" />
            <Row label="Odsetki netto" value={`${fmt(r.odsetkiNetto)} zł`} accent="#2e7d4f" />
            <Row label="Średnio rocznie netto" value={`${fmt(r.rocznieNetto)} zł`} />
            <Row label="Do wypłaty na koniec (netto)" value={`${fmt(r.wartoscNetto)} zł`} accent="#2e7d4f" />
          </div>

          {/* Rozbicie na lata */}
          <details style={{ marginTop: 4 }}>
            <summary style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#2e7d4f',
              cursor: 'pointer', padding: '8px 0', letterSpacing: '0.5px',
            }}>
              Pokaż rozbicie odsetek {bond.lata >= 1 ? 'rok po roku' : 'okresowo'}
            </summary>
            <div style={{ marginTop: 8 }}>
              {r.rows.map((row, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  padding: '8px 0', borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--muted)' }}>{row.rok}</span>
                  <span style={{ display: 'flex', gap: 14 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--muted)' }}>{pct(row.rate)}%</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text)', minWidth: 78, textAlign: 'right' }}>{fmt(row.odsetki)} zł</span>
                  </span>
                </div>
              ))}
              {r.kapitalizacja && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.74rem', color: 'var(--muted)', marginTop: 8 }}>
                  Odsetki są kapitalizowane - co roku dopisywane do kapitału i pracują dalej. Podatek pobierany dopiero przy wykupie.
                </p>
              )}
            </div>
          </details>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)' }}>
          Wybierz obligację i wpisz kwotę, żeby zobaczyć odsetki.
        </div>
      )}
    </div>
  );
}
