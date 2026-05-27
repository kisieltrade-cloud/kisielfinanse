'use client';

import { useState } from 'react';
import Link from 'next/link';

const QUESTIONS = [
  {
    q: 'Masz 10 000 zł. Co robisz?',
    answers: [
      { text: 'Otwieram konto u brokera i zaczynam tradować', type: 0 },
      { text: 'Kupuję akcje spółek które rozumiem', type: 1 },
      { text: 'Kupuję ETF na MSCI World i zapominam na 20 lat', type: 2 },
      { text: 'Wkładam na lokatę lub konto oszczędnościowe', type: 3 },
    ],
  },
  {
    q: 'Rynek spadł 20% w miesiąc. Co robisz?',
    answers: [
      { text: 'Szukam okazji, short albo czekam na odbicie', type: 0 },
      { text: 'Dokupuję taniej', type: 1 },
      { text: 'Nic nie robię', type: 2 },
      { text: 'Zaczynam myśleć o wyjściu', type: 3 },
    ],
  },
  {
    q: 'Ile czasu dziennie chcesz poświęcać na finanse?',
    answers: [
      { text: '2+ godziny, siedzę na wykresach', type: 0 },
      { text: 'Pół godziny tygodniowo, sprawdzam spółki', type: 1 },
      { text: 'Raz w miesiącu, rzut oka i tyle', type: 2 },
      { text: 'Jak najmniej', type: 3 },
    ],
  },
  {
    q: 'Jaki roczny zwrot Ci wystarczy?',
    answers: [
      { text: '30%+, inaczej po co', type: 0 },
      { text: '15-25%, powyżej rynku', type: 1 },
      { text: '8-12%, tyle co rynek', type: 2 },
      { text: '4-6%, spokojnie i bezpiecznie', type: 3 },
    ],
  },
  {
    q: 'Straciłeś 10% portfela. Co czujesz?',
    answers: [
      { text: 'Ok, sprawdzam co poszło nie tak i jadę dalej', type: 0 },
      { text: 'Boli, ale trzymam, nic się nie zmieniło', type: 1 },
      { text: 'Nie patrzę na krótki termin', type: 2 },
      { text: 'Niedobrze mi z tego', type: 3 },
    ],
  },
  {
    q: 'Co Cię interesuje?',
    answers: [
      { text: 'Wykresy, świece, poziomy', type: 0 },
      { text: 'Wyniki spółek, P/E, przewagi', type: 1 },
      { text: 'ETF-y, koszty TER, alokacja', type: 2 },
      { text: 'Lokaty, oprocentowanie, bezpieczeństwo', type: 3 },
    ],
  },
  {
    q: 'Na ile inwestujesz?',
    answers: [
      { text: 'Dni, tygodnie', type: 0 },
      { text: '3-10 lat', type: 1 },
      { text: '10-30 lat', type: 2 },
      { text: '1-3 lata', type: 3 },
    ],
  },
];

const RESULTS = [
  {
    type: 0,
    label: 'Agresywny Trader',
    emoji: '⚡',
    color: '#ff2d78',
    desc: 'Siedzisz na wykresach, śledzisz rynek i akceptujesz duże ryzyko. Day trading i swing trading to Twoje środowisko.',
    links: [
      { label: 'Jak zacząć trading od zera', href: '/trading/jak-zaczac-trading-od-zera' },
      { label: 'Fibonacci w tradingu', href: '/trading/fibonacci-w-tradingu-kompletny-przewodnik' },
      { label: 'Kalkulator Risk/Reward', href: '/kalkulator/risk-reward' },
    ],
  },
  {
    type: 1,
    label: 'Inwestor Wzrostowy',
    emoji: '📈',
    color: '#c9a227',
    desc: 'Analizujesz spółki, patrzysz na fundamenty i inwestujesz na kilka lat. Wiesz co kupujesz i dlaczego.',
    links: [
      { label: 'Analiza fundamentalna', href: '/inwestycje/analiza-fundamentalna-jak-ocenic-wartosc-spolki' },
      { label: 'ETF jak zacząć', href: '/inwestycje/etf-czym-jest-jak-zaczac-inwestowac' },
      { label: 'OKI nowe konto inwestycyjne', href: '/inwestycje/oki-osobiste-konto-inwestycyjne' },
    ],
  },
  {
    type: 2,
    label: 'Pasywny Inwestor ETF',
    emoji: '🌱',
    color: '#22c55e',
    desc: 'Kupujesz rynek, minimalizujesz koszty i nie ruszasz tego latami. Proste i skuteczne.',
    links: [
      { label: 'ETF czym jest i jak zacząć', href: '/inwestycje/etf-czym-jest-jak-zaczac-inwestowac' },
      { label: 'Procent składany w praktyce', href: '/trading/procent-skladany-w-tradingu-futures' },
      { label: 'Kalkulator FIRE', href: '/kalkulator/fire' },
    ],
  },
  {
    type: 3,
    label: 'Konserwatywny Oszczędzający',
    emoji: '🏦',
    color: '#a78bfa',
    desc: 'Bezpieczeństwo ważniejsze niż zysk. Lokaty i konta oszczędnościowe to Twoje miejsce.',
    links: [
      { label: 'Poduszka finansowa 2026', href: '/pieniadze/poduszka-finansowa-2026-ile-powinienes-miec-odlozone' },
      { label: 'Konto oszczędnościowe 2026', href: '/pieniadze/konto-oszczednosciowe-2026-czy-twoje-pieniadze-sa-bezpieczne' },
      { label: 'Kalkulator hipoteczny', href: '/kalkulator-hipoteczny' },
    ],
  },
];

export default function QuizTypInwestora() {
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState([0, 0, 0, 0]);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const result = RESULTS[scores.indexOf(Math.max(...scores))];

  function choose(type: number) {
    if (selected !== null) return;
    setSelected(type);
    const next = [...scores];
    next[type]++;
    setScores(next);
    setTimeout(() => {
      if (current + 1 >= QUESTIONS.length) {
        setDone(true);
      } else {
        setCurrent(c => c + 1);
        setSelected(null);
      }
    }, 600);
  }

  function restart() {
    setCurrent(0);
    setScores([0, 0, 0, 0]);
    setSelected(null);
    setDone(false);
  }

  const progress = ((current) / QUESTIONS.length) * 100;

  const C = { bg: '#f4f6f8', white: '#ffffff', text: '#1a2230', muted: '#1a2230', border: '#dde3ea', gold: '#b8960a' };

  return (
    <main style={{ minHeight: '80vh', padding: '120px 24px 80px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', background: C.white, borderRadius: 16, padding: '40px 36px', border: `1px solid ${C.border}` }}>

        {!done ? (
          <>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: C.text, marginBottom: 8, lineHeight: 1.1 }}>
              Jakim typem inwestora jesteś?
            </h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: C.muted }}>
                {current + 1} / {QUESTIONS.length}
              </span>
            </div>

            <div style={{ height: 4, background: C.border, borderRadius: 2, marginBottom: 36, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: C.gold, borderRadius: 2, transition: 'width 0.4s ease' }} />
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: C.text, marginBottom: 28, lineHeight: 1.3 }}>
              {QUESTIONS[current].q}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {QUESTIONS[current].answers.map((a, i) => {
                const isSelected = selected === a.type;
                return (
                  <button
                    key={i}
                    onClick={() => choose(a.type)}
                    disabled={selected !== null}
                    style={{
                      background: isSelected ? '#fef9ec' : C.white,
                      border: `2px solid ${isSelected ? C.gold : C.border}`,
                      borderRadius: 10,
                      padding: '15px 20px',
                      textAlign: 'left',
                      cursor: selected !== null ? 'default' : 'pointer',
                      color: isSelected ? C.gold : C.text,
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      lineHeight: 1.5,
                      transition: 'all 0.15s',
                      fontWeight: isSelected ? 600 : 400,
                    }}
                    onMouseEnter={e => {
                      if (selected === null) {
                        (e.currentTarget as HTMLElement).style.borderColor = C.gold;
                        (e.currentTarget as HTMLElement).style.background = '#fef9ec';
                      }
                    }}
                    onMouseLeave={e => {
                      if (selected === null) {
                        (e.currentTarget as HTMLElement).style.borderColor = C.border;
                        (e.currentTarget as HTMLElement).style.background = C.white;
                      }
                    }}
                  >
                    {a.text}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '3px', color: C.gold, textTransform: 'uppercase', marginBottom: 24 }}>
              TWOJ WYNIK
            </p>

            <div style={{
              background: C.white,
              border: `2px solid ${result.color}`,
              borderRadius: 16,
              padding: '36px 32px',
              marginBottom: 28,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: 5, height: '100%', background: result.color }} />
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{result.emoji}</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: result.color, marginBottom: 12, letterSpacing: 1 }}>
                {result.label.toUpperCase()}
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: C.text, lineHeight: 1.75, margin: 0 }}>
                {result.desc}
              </p>
            </div>

            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '2px', color: C.muted, textTransform: 'uppercase', marginBottom: 12 }}>
              Polecane artykuly
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 36 }}>
              {result.links.map((l, i) => (
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
                Zrob jeszcze raz
              </button>
              <Link href="/quiz/wiedza" style={{
                background: C.gold,
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
                Sprawdz wiedze
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
