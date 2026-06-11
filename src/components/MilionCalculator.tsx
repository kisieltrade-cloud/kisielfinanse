'use client';

import { useState, useMemo } from 'react';

const ACCENT = '#16a34a';
const fmt = (n: number) => Math.round(n).toLocaleString('pl-PL');

// liczba miesięcy do osiągnięcia celu (kapitalizacja miesięczna)
function miesiaceDoCelu(start: number, pmt: number, roczna: number, cel: number): number | null {
  if (start >= cel) return 0;
  const r = roczna / 100 / 12;
  let b = start;
  for (let m = 1; m <= 80 * 12; m++) {
    b = b * (1 + r) + pmt;
    if (b >= cel) return m;
  }
  return null; // ponad 80 lat
}

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

const MIESIACE = ['stycznia','lutego','marca','kwietnia','maja','czerwca','lipca','sierpnia','września','października','listopada','grudnia'];

export default function MilionCalculator() {
  const [start, setStart] = useState('');
  const [pmt, setPmt] = useState('');
  const [stopa, setStopa] = useState('7');
  const [wiek, setWiek] = useState('');
  const [cel, setCel] = useState('1000000');

  const r = useMemo(() => {
    const s = parseFloat(start) || 0;
    const p = parseFloat(pmt) || 0;
    const st = parseFloat(stopa) || 0;
    const c = parseFloat(cel) || 0;
    if (c <= 0 || (p <= 0 && s <= 0)) return null;

    const m = miesiaceDoCelu(s, p, st, c);
    if (m === null) return { tooLong: true as const, cel: c };

    const lata = m / 12;
    const now = new Date();
    const data = new Date(now.getFullYear(), now.getMonth() + m, 1);
    const totalContrib = s + p * m;
    const growth = c - totalContrib;
    const w = parseFloat(wiek);
    const wiekDocelowy = !isNaN(w) && w > 0 ? w + lata : null;

    // o ile szybciej przy +500 zł/mc
    const mFaster = miesiaceDoCelu(s, p + 500, st, c);
    const fasterLata = mFaster !== null ? (m - mFaster) / 12 : null;

    return {
      tooLong: false as const, cel: c, m, lata, data, totalContrib, growth, wiekDocelowy,
      fasterLata, p,
    };
  }, [start, pmt, stopa, wiek, cel]);

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 'clamp(24px, 5vw, 40px)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '22px 28px', marginBottom: 28 }}>
        <Field label="Ile odkładasz miesięcznie" value={pmt} onChange={setPmt} placeholder="np. 1500" prefix="zł" />
        <Field label="Oczekiwana stopa zwrotu" value={stopa} onChange={setStopa} placeholder="7" prefix="% / rok" hint="Historycznie ETF na świat ~7% realnie." />
        <Field label="Masz już odłożone (opcjonalnie)" value={start} onChange={setStart} placeholder="np. 20000" prefix="zł" />
        <Field label="Twój wiek (opcjonalnie)" value={wiek} onChange={setWiek} placeholder="np. 30" prefix="lat" hint="Pokażę, w jakim wieku osiągniesz cel." />
        <Field label="Cel" value={cel} onChange={setCel} placeholder="1000000" prefix="zł" hint="Domyślnie milion. Możesz wpisać własny." />
      </div>

      <div style={{ height: 1, background: 'var(--border)', marginBottom: 32 }} />

      {r ? (
        r.tooLong ? (
          <div style={{ textAlign: 'center', padding: '24px 0', fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.7 }}>
            Przy tych założeniach osiągnięcie {fmt(r.cel)} zł zajmie ponad 80 lat. Zwiększ miesięczną wpłatę albo stopę zwrotu, żeby zobaczyć realny termin.
          </div>
        ) : (
          <>
            {/* Hero */}
            <div style={{ padding: '24px 28px', background: 'rgba(22,163,74,0.07)', border: '1px solid rgba(22,163,74,0.25)', borderRadius: 16, marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
                {fmt(r.cel)} zł uzbierasz za
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 7vw, 3.8rem)', color: ACCENT, letterSpacing: '1px', lineHeight: 1 }}>
                {r.lata < 1 ? `${Math.round(r.m)} mies.` : `${r.lata.toFixed(1).replace('.', ',')} lat`}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text)', marginTop: 8 }}>
                czyli ok. {MIESIACE[r.data.getMonth()]} {r.data.getFullYear()}
                {r.wiekDocelowy ? ` · w wieku ${Math.round(r.wiekDocelowy)} lat` : ''}
              </div>
            </div>

            {/* Insight +500 */}
            {r.fasterLata && r.fasterLata > 0.1 && (
              <div style={{ borderLeft: `3px solid ${ACCENT}`, background: 'rgba(255,255,255,0.02)', padding: '14px 18px', borderRadius: '0 8px 8px 0', marginBottom: 26 }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>
                  Odkładając <strong style={{ color: ACCENT }}>500 zł więcej</strong> miesięcznie ({fmt(r.p + 500)} zł), osiągniesz cel szybciej o <strong style={{ color: ACCENT }}>{r.fasterLata.toFixed(1).replace('.', ',')} roku/lat</strong>.
                </p>
              </div>
            )}

            {/* Rozbicie */}
            <div>
              <Row label="Wpłacisz z własnej kieszeni" value={`${fmt(r.totalContrib)} zł`} />
              <Row label="Dorobią same odsetki (procent składany)" value={`${fmt(r.growth)} zł`} accent={ACCENT} />
              <Row label="Udział odsetek w celu" value={`${Math.round(r.growth / r.cel * 100)}%`} />
            </div>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.7, marginTop: 20 }}>
              Im dłużej trzymasz pieniądze na rynku, tym większą część celu robią za Ciebie odsetki. To cała magia procentu składanego.
            </p>
          </>
        )
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)' }}>
          Wpisz, ile odkładasz miesięcznie, żeby zobaczyć termin.
        </div>
      )}
    </div>
  );
}
