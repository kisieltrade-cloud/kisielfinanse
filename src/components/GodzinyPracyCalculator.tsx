'use client';

import { useState, useMemo } from 'react';

const fmt = (n: number, d = 1) =>
  n.toLocaleString('pl-PL', { minimumFractionDigits: d, maximumFractionDigits: d });

function Field({
  label, value, onChange, placeholder, prefix, hint,
}: {
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
      }}>
        {label}
      </label>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 8,
        borderBottom: `1px solid ${focused ? '#c9a227' : 'var(--border)'}`,
        transition: 'border-color 0.15s', paddingBottom: 7,
      }}>
        <input
          type="number" value={value} placeholder={placeholder} min="0"
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            background: 'transparent', border: 'none',
            color: 'var(--text)', fontFamily: 'var(--font-body)',
            fontSize: '1.1rem', fontWeight: 700,
            width: '100%', outline: 'none',
          }}
        />
        {prefix && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)', flexShrink: 0 }}>
            {prefix}
          </span>
        )}
      </div>
      {hint && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--muted)', marginTop: 4 }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function StatBox({ label, value, sub, accent }: {
  label: string; value: string; sub?: string; accent?: string;
}) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${accent ? accent + '33' : 'var(--border)'}`,
      borderRadius: 16,
      padding: '20px 24px',
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
        {label}
      </span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: accent ?? 'var(--text)', letterSpacing: '1px', lineHeight: 1.1 }}>
        {value}
      </span>
      {sub && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
          {sub}
        </span>
      )}
    </div>
  );
}

function contextMessage(hours: number): string {
  if (hours < 1)   return 'Niemal nic — zarobisz to w mniej niż godzinę.';
  if (hours < 4)   return 'Kilka godzin roboty — warto się zastanowić.';
  if (hours < 8)   return 'Prawie cały dzień roboczy.';
  if (hours < 16)  return 'Ponad dwa dni siedzenia za biurkiem.';
  if (hours < 40)  return 'Cały tydzień roboty — przemyśl to dobrze.';
  if (hours < 80)  return 'Dwa tygodnie pracy. Czy naprawdę tego potrzebujesz?';
  if (hours < 160) return 'Ponad miesiąc pracy. To poważna decyzja.';
  return 'Kilka miesięcy pracy. Upewnij się, że to masz przemyślane.';
}

export default function GodzinyPracyCalculator() {
  const [stawka, setStawka] = useState('');
  const [cena, setCena] = useState('');
  const [pensja, setPensja] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const s = parseFloat(stawka);
    const c = parseFloat(cena);
    if (!s || !c || s <= 0 || c <= 0) return null;
    const hours = c / s;
    const days  = hours / 8;
    const weeks = hours / 40;
    const p   = parseFloat(pensja);
    const pct = p > 0 ? (c / p) * 100 : null;
    return { hours, days, weeks, pct };
  }, [stawka, cena, pensja]);

  function handleCopy() {
    if (!result) return;
    const c = parseFloat(cena);
    const text = `Zakup za ${c.toLocaleString('pl-PL')} zł kosztuje mnie ${fmt(result.hours)} godzin pracy (${fmt(result.days)} dni roboczych).\nSprawdź swój wynik: kisielfinanse.pl/kalkulator/godziny-pracy`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      padding: 'clamp(24px, 5vw, 40px)',
    }}>
      {/* Inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px 32px', marginBottom: 32 }}>
        <Field
          label="Twoja stawka godzinowa netto"
          value={stawka} onChange={setStawka}
          placeholder="np. 45" prefix="zł/h"
          hint="Ile zarabiasz na rękę za godzinę pracy?"
        />
        <Field
          label="Cena zakupu"
          value={cena} onChange={setCena}
          placeholder="np. 4999" prefix="zł"
          hint="Pełna cena produktu lub usługi."
        />
      </div>
      <div style={{ marginBottom: 36 }}>
        <Field
          label="Miesięczna pensja netto (opcjonalnie)"
          value={pensja} onChange={setPensja}
          placeholder="np. 7500" prefix="zł"
          hint="Podaj żeby zobaczyć jaki % wypłaty stanowi ten zakup."
        />
      </div>

      <div style={{ height: 1, background: 'var(--border)', marginBottom: 32 }} />

      {result ? (
        <>
          {/* Hero result */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28,
            padding: '24px 28px',
            background: 'rgba(201,162,39,0.07)',
            border: '1px solid rgba(201,162,39,0.25)',
            borderRadius: 16,
          }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="18" stroke="#c9a227" strokeWidth="3" fill="none" />
              <line x1="24" y1="14" x2="24" y2="24" stroke="#c9a227" strokeWidth="3" strokeLinecap="round" />
              <line x1="24" y1="24" x2="31" y2="30" stroke="#c9a227" strokeWidth="3" strokeLinecap="round" />
              <circle cx="24" cy="24" r="2.5" fill="#c9a227" />
            </svg>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 6vw, 3.8rem)', color: '#c9a227', letterSpacing: '3px', lineHeight: 1 }}>
                {fmt(result.hours, result.hours < 10 ? 1 : 0)} h
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', marginTop: 6 }}>
                {contextMessage(result.hours)}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: result.pct !== null ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)', gap: 12, marginBottom: 28 }}>
            <StatBox label="Dni robocze"     value={`${fmt(result.days,  result.days  < 10 ? 1 : 0)} dni`}  sub="przy 8h dziennie"       accent="#3b82f6" />
            <StatBox label="Tygodnie pracy"  value={`${fmt(result.weeks, result.weeks < 10 ? 1 : 0)} tyg.`} sub="przy 40h tygodniowo"     accent="#8b5cf6" />
            {result.pct !== null && (
              <StatBox label="% miesięcznej pensji" value={`${fmt(result.pct, 1)}%`} sub="Twojego wynagrodzenia" accent="#ef4444" />
            )}
          </div>

          <button
            onClick={handleCopy}
            style={{
              background: copied ? 'rgba(34,197,94,0.15)' : 'transparent',
              border: `1px solid ${copied ? '#22c55e' : 'var(--border)'}`,
              borderRadius: 10, padding: '10px 20px',
              color: copied ? '#22c55e' : 'var(--muted)',
              fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
              cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.5px',
            }}
          >
            {copied ? '✓ Skopiowano!' : 'Skopiuj wynik'}
          </button>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)' }}>
          Wpisz stawkę i cenę, żeby zobaczyć wynik.
        </div>
      )}
    </div>
  );
}
