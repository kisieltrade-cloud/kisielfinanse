'use client';

import { useState } from 'react';
import Link from 'next/link';

const QUESTIONS = [
  {
    q: 'Co to jest podatek Belki?',
    answers: [
      'Podatek od nieruchomości',
      '19% podatek od zysków kapitałowych',
      'Podatek od darowizn powyżej 10 000 zł',
      'VAT na produkty finansowe',
    ],
    correct: 1,
    explain: 'Podatek Belki to 19% podatek od zysków z akcji, ETF-ów, dywidend i odsetek z lokat.',
    link: { label: 'OKI jak uniknąć podatku Belki', href: '/inwestycje/oki-osobiste-konto-inwestycyjne' },
  },
  {
    q: 'ETF to skrót od:',
    answers: [
      'Electronic Trading Fund',
      'Equity Transfer Fee',
      'Exchange Traded Fund',
      'European Trading Framework',
    ],
    correct: 2,
    explain: 'ETF to fundusz notowany na giełdzie. Kupujesz go jak akcję, ale śledzisz cały indeks np. S&P 500.',
    link: { label: 'ETF czym jest i jak zaczac', href: '/inwestycje/etf-czym-jest-jak-zaczac-inwestowac' },
  },
  {
    q: 'Ile wynosi roczny limit wpłat na IKE w 2026?',
    answers: [
      '10 000 zł',
      '20 000 zł',
      '28 260 zł',
      '50 000 zł',
    ],
    correct: 2,
    explain: 'Limit IKE w 2026 wynosi 28 260 zł. Zyski są wolne od podatku Belki pod warunkiem wypłaty po 60. roku życia.',
    link: { label: 'OKI nowe konto inwestycyjne', href: '/inwestycje/oki-osobiste-konto-inwestycyjne' },
  },
  {
    q: 'Co oznacza wskaźnik P/E?',
    answers: [
      'Profit/Expenses - stosunek zysku do kosztów',
      'Price/Earnings - cena akcji do zysku na akcję',
      'Portfolio/Equity - wartość portfela do kapitału własnego',
      'Payment/Entry - koszt wejścia w inwestycję',
    ],
    correct: 1,
    explain: 'P/E to cena akcji podzielona przez zysk na akcję. Im wyższe P/E, tym drożej płacisz za każdą złotówkę zysku spółki.',
    link: { label: 'Analiza fundamentalna', href: '/inwestycje/analiza-fundamentalna-jak-ocenic-wartosc-spolki' },
  },
  {
    q: 'Zasada 50/30/20 w budżecie domowym oznacza:',
    answers: [
      '50% oszczędności, 30% rachunki, 20% jedzenie',
      '50% potrzeby, 30% zachcianki, 20% oszczędności',
      '50% kredyty, 30% inwestycje, 20% życie',
      '50% podatki, 30% ZUS, 20% do dyspozycji',
    ],
    correct: 1,
    explain: '50% na potrzeby (czynsz, jedzenie, rachunki), 30% na zachcianki, 20% na oszczędności. Dobry punkt startowy.',
    link: { label: '5 nawyków które kosztują Cię tysiące', href: '/pieniadze/5-finansowych-nawykow-ktore-kosztuja-cie-tysiace-zlotych-rocznie' },
  },
  {
    q: 'Co to jest stop loss?',
    answers: [
      'Wskaźnik zatrzymania trendu na wykresie',
      'Opłata za wcześniejsze zamknięcie lokaty',
      'Limit dziennych transakcji u brokera',
      'Zlecenie automatycznego zamknięcia pozycji przy określonej stracie',
    ],
    correct: 3,
    explain: 'Stop loss automatycznie zamyka pozycję gdy cena spadnie do ustalonego poziomu. Podstawa zarządzania ryzykiem.',
    link: { label: 'Kalkulator Risk/Reward', href: '/kalkulator/risk-reward' },
  },
  {
    q: 'Inflacja 5% rocznie. Ile będzie warta 1000 zł za 10 lat?',
    answers: [
      'ok. 950 zł',
      'ok. 750 zł',
      'ok. 614 zł',
      'ok. 500 zł',
    ],
    correct: 2,
    explain: '1000 zł / (1,05^10) = ok. 614 zł. Inflacja bez inwestowania zjada oszczędności.',
    link: { label: 'Kalkulator procentu składanego', href: '/kalkulator/procent-skladany' },
  },
  {
    q: 'OKI (Osobiste Konto Inwestycyjne) ruszy w Polsce:',
    answers: [
      '2025',
      '2026',
      '2027',
      '2028',
    ],
    correct: 2,
    explain: 'Rząd przyjął projekt ustawy 5 maja 2026. OKI startuje 1 stycznia 2027. Zwalnia z podatku Belki do 100 000 zł w akcjach i ETF-ach.',
    link: { label: 'OKI co to jest', href: '/inwestycje/oki-osobiste-konto-inwestycyjne' },
  },
  {
    q: 'Procent składany polega na:',
    answers: [
      'Stałe odsetki od początkowego kapitału',
      'Odsetki wypłacane co miesiąc na rachunek',
      'Odsetki od odsetek, zyski są reinwestowane',
      'Działa tylko dla inwestycji powyżej 10 lat',
    ],
    correct: 2,
    explain: 'Procent składany to odsetki od odsetek. 10 000 zł po 30 latach przy 8% rocznie to ponad 100 000 zł.',
    link: { label: 'Kalkulator procentu składanego', href: '/kalkulator/procent-skladany' },
  },
  {
    q: 'Czym jest dywersyfikacja portfela?',
    answers: [
      'Skupieniem kapitału w jednej, najlepszej inwestycji',
      'Regularnym dokupowaniem jednego ETF co miesiąc',
      'Zabezpieczeniem portfela opcjami put',
      'Rozłożeniem inwestycji na różne aktywa, by ograniczyć ryzyko',
    ],
    correct: 3,
    explain: 'Dywersyfikacja to rozłożenie kapitału na różne aktywa i rynki. Słaby wynik jednej inwestycji nie niszczy całego portfela.',
    link: { label: 'ETF jako dywersyfikacja', href: '/inwestycje/etf-czym-jest-jak-zaczac-inwestowac' },
  },
];

const LEVELS = [
  {
    min: 0, max: 3, label: 'Nowicjusz', emoji: '🌱', color: '#a78bfa',
    desc: 'Dobry start. Zacznij od tych artykułów:',
    links: [
      { label: 'Jak zacząć trading od zera', href: '/trading/jak-zaczac-trading-od-zera' },
      { label: 'ETF czym jest i jak zacząć', href: '/inwestycje/etf-czym-jest-jak-zaczac-inwestowac' },
      { label: 'Poduszka finansowa 2026', href: '/pieniadze/poduszka-finansowa-2026-ile-powinienes-miec-odlozone' },
    ],
  },
  {
    min: 4, max: 6, label: 'Sredniozaawansowany', emoji: '📊', color: '#c9a227',
    desc: 'Znasz podstawy. Uzupełnij wiedzę:',
    links: [
      { label: 'Analiza fundamentalna', href: '/inwestycje/analiza-fundamentalna-jak-ocenic-wartosc-spolki' },
      { label: 'OKI nowe konto inwestycyjne', href: '/inwestycje/oki-osobiste-konto-inwestycyjne' },
      { label: 'Strategie tradingowe', href: '/trading/strategie-tradingowe-ktore-naprawde-dzialaja' },
    ],
  },
  {
    min: 7, max: 8, label: 'Zaawansowany', emoji: '🎯', color: '#22c55e',
    desc: 'Solidna wiedza. Czas na praktykę:',
    links: [
      { label: 'Kalkulator Risk/Reward', href: '/kalkulator/risk-reward' },
      { label: 'Kalkulator FIRE', href: '/kalkulator/fire' },
      { label: 'Fibonacci w tradingu', href: '/trading/fibonacci-w-tradingu-kompletny-przewodnik' },
    ],
  },
  {
    min: 9, max: 10, label: 'Ekspert', emoji: '🏆', color: '#ff2d78',
    desc: 'Doskonały wynik. Dla uzupełnienia:',
    links: [
      { label: 'Psychologia tradingu', href: '/psychologia/psychologia-tradingu-jak-kontrolowac-emocje' },
      { label: 'AI bron geopolityczna', href: '/gospodarka/ai-bron-geopolityczna-wyscig-chipow' },
      { label: 'OKI osobiste konto inwestycyjne', href: '/inwestycje/oki-osobiste-konto-inwestycyjne' },
    ],
  },
];

export default function QuizWiedza() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  const score = answers.filter(Boolean).length;
  const level = LEVELS.find(l => score >= l.min && score <= l.max) ?? LEVELS[0];
  const q = QUESTIONS[current];

  function choose(i: number) {
    if (selected !== null) return;
    setSelected(i);
    const isCorrect = i === q.correct;
    setAnswers(prev => [...prev, isCorrect]);
  }

  function next() {
    if (current + 1 >= QUESTIONS.length) {
      setDone(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
    }
  }

  function restart() {
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setDone(false);
  }

  const progress = (current / QUESTIONS.length) * 100;
  const C = { bg: '#f4f6f8', white: '#ffffff', text: '#1a2230', muted: '#1a2230', border: '#dde3ea', blue: '#2563eb' };

  return (
    <main style={{ minHeight: '80vh', padding: '120px 24px 80px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', background: C.white, borderRadius: 16, padding: '40px 36px', border: `1px solid ${C.border}` }}>

        {!done ? (
          <>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: C.text, marginBottom: 8, lineHeight: 1.1 }}>
              Quiz - Wiedza Finansowa
            </h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: C.muted }}>
                {current + 1} / {QUESTIONS.length}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
                {answers.filter(Boolean).length} pkt
              </span>
            </div>

            <div style={{ height: 4, background: C.border, borderRadius: 2, marginBottom: 36, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: C.blue, borderRadius: 2, transition: 'width 0.4s ease' }} />
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: C.text, marginBottom: 28, lineHeight: 1.3 }}>
              {q.q}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {q.answers.map((a, i) => {
                const isSelected = selected === i;
                const isCorrect = i === q.correct;
                const showResult = selected !== null;

                let bg = C.white;
                let border = C.border;
                let color = C.text;

                if (showResult && isCorrect) { bg = '#f0fdf4'; border = '#16a34a'; color = '#15803d'; }
                else if (showResult && isSelected && !isCorrect) { bg = '#fff1f2'; border = '#e11d48'; color = '#be123c'; }

                return (
                  <button
                    key={i}
                    onClick={() => choose(i)}
                    disabled={selected !== null}
                    style={{
                      background: bg,
                      border: `2px solid ${border}`,
                      borderRadius: 10,
                      padding: '15px 20px',
                      textAlign: 'left',
                      cursor: selected !== null ? 'default' : 'pointer',
                      color,
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      lineHeight: 1.5,
                      transition: 'all 0.15s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      fontWeight: showResult && (isCorrect || isSelected) ? 600 : 400,
                    }}
                    onMouseEnter={e => {
                      if (selected === null) {
                        (e.currentTarget as HTMLElement).style.borderColor = C.blue;
                        (e.currentTarget as HTMLElement).style.background = '#eff6ff';
                      }
                    }}
                    onMouseLeave={e => {
                      if (selected === null) {
                        (e.currentTarget as HTMLElement).style.borderColor = C.border;
                        (e.currentTarget as HTMLElement).style.background = C.white;
                      }
                    }}
                  >
                    {showResult && isCorrect && <span style={{ color: '#16a34a' }}>✓</span>}
                    {showResult && isSelected && !isCorrect && <span style={{ color: '#e11d48' }}>✗</span>}
                    {a}
                  </button>
                );
              })}
            </div>

            {selected !== null && (
              <div style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: '20px 24px',
                marginBottom: 20,
              }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: C.text, lineHeight: 1.7, margin: '0 0 10px' }}>
                  {q.explain}
                </p>
                <Link href={q.link.href} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: C.blue, letterSpacing: '0.5px' }}>
                  {q.link.label}
                </Link>
              </div>
            )}

            {selected !== null && (
              <button onClick={next} style={{
                background: C.blue,
                border: 'none',
                borderRadius: 8,
                padding: '12px 28px',
                color: '#ffffff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '1px',
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}>
                {current + 1 >= QUESTIONS.length ? 'Sprawdz wynik' : 'Nastepne pytanie'}
              </button>
            )}
          </>
        ) : (
          /* Result */
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '3px', color: C.blue, textTransform: 'uppercase', marginBottom: 24 }}>
              TWOJ WYNIK
            </p>

            <div style={{
              background: C.white,
              border: `2px solid ${level.color}`,
              borderRadius: 16,
              padding: '36px 32px',
              marginBottom: 28,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: 5, height: '100%', background: level.color }} />
              <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{level.emoji}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', color: level.color, lineHeight: 1, marginBottom: 8 }}>
                {score}/10
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', color: C.text, marginBottom: 12, letterSpacing: 1 }}>
                {level.label.toUpperCase()}
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: C.text, lineHeight: 1.75, margin: 0 }}>
                {level.desc}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
              {level.links.map((l, i) => (
                <Link key={i} href={l.href} style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.92rem',
                  color: C.text,
                  textDecoration: 'none',
                  padding: '13px 16px',
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  background: C.white,
                  display: 'block',
                }}>
                  {l.label}
                </Link>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 6, marginBottom: 32, flexWrap: 'wrap' }}>
              {answers.map((correct, i) => (
                <div key={i} style={{
                  width: 36, height: 36,
                  borderRadius: 8,
                  background: correct ? '#f0fdf4' : '#fff1f2',
                  border: `1px solid ${correct ? '#16a34a' : '#e11d48'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                  color: correct ? '#15803d' : '#be123c',
                  fontWeight: 600,
                }}>
                  {i + 1}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={restart} style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: '11px 24px',
                color: C.text,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '1px',
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}>
                Sprobuj ponownie
              </button>
              <Link href="/quiz/typ-inwestora" style={{
                background: '#b8960a',
                borderRadius: 8,
                padding: '11px 24px',
                color: '#ffffff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '1px',
                textDecoration: 'none',
                display: 'inline-block',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}>
                Sprawdz typ inwestora
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
