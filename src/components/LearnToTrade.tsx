'use client';

import { useState } from 'react';

const STEPS = [
  {
    num: '01',
    title: 'Zrozum rynek',
    accent: '#c9a227',
    summary: 'Wybierz jeden rynek i poznaj go na wylot.',
    content: `Nie próbuj ogarnąć wszystkiego na raz. Wybierz jeden rynek - forex, indeksy, krypto czy akcje - i poznaj go dogłębnie. Ja zaczynałem od EUR/USD i przez pierwsze miesiące nie dotykałem niczego innego. Nie dlatego, że to najlepszy instrument, ale dlatego, że dogłębna znajomość jednego rynku jest warta więcej niż powierzchowna znajomość dziesięciu.`,
    points: [
      'Forex - rynek walutowy, 24/5, ogromna płynność, niski próg wejścia',
      'Indeksy - S&P 500, NASDAQ, DAX - kondycja całych gospodarek',
      'Kryptowaluty - Bitcoin, Ethereum. Rynek 24/7, duża zmienność',
      'Akcje - Tesla, Apple, CD Projekt. Więcej researchu, namacalne fundamenty',
    ],
  },
  {
    num: '02',
    title: 'Naucz się czytać wykres',
    accent: '#f5c518',
    summary: 'Price action, nie 15 wskaźników.',
    content: `Nie potrzebujesz 15 wskaźników na ekranie. Potrzebujesz zrozumieć co mówi Ci sam wykres - czysty price action. RSI, MACD, Bollinger Bands - to przyjdzie później. Najpierw naucz się czytać wykres bez żadnych dodatków.`,
    points: [
      'Świece japońskie - język rynku. Pin bar, engulfing, doji - zrozum logikę za nimi',
      'Wsparcia i opory - poziomy gdzie rynek się zatrzymuje. Jedna z najpotężniejszych umiejętności',
      'Trend - wyższe szczyty i dołki = wzrost, niższe = spadek. Nie graj pod trend',
    ],
  },
  {
    num: '03',
    title: 'Zarządzanie ryzykiem',
    accent: '#ff2d78',
    summary: 'To oddziela traderów od hazardzistów.',
    content: `Sprowadza się do jednego pytania: ile mogę stracić, jeśli się mylę? Złota zasada - nie ryzykuj więcej niż 1-2% kapitału na jedną transakcję. Nawet najlepsi traderzy mają winrate 40-60%. Wygrywają nie dlatego, że mają rację częściej - ale dlatego, że ich zyski są większe od strat.`,
    points: [
      'Stop Loss - zlecenie zamykające pozycję ze stratą. Nie tragujesz bez SL. Nigdy.',
      'Risk/Reward - stosunek zysku do ryzyka. Szukaj setupów minimum 1:2, najlepiej 1:3',
      'Position sizing - ile lotów kupujesz. Obliczasz na podstawie ryzyka i odległości SL',
    ],
  },
  {
    num: '04',
    title: 'Ćwicz na demo',
    accent: '#e8963a',
    summary: 'Minimum 2-3 miesiące przed realem.',
    content: `Nie wpłacaj ani złotówki, dopóki nie potrafisz konsekwentnie realizować planu na koncie demo. Konto demo działa identycznie jak prawdziwe - te same wykresy, ceny, spread. Jedyna różnica to brak emocji. Naucz się platformy, testuj strategię, prowadź dziennik każdej transakcji.`,
    points: [
      'Naucz się obsługi platformy - MetaTrader, cTrader, TradingView',
      'Testuj strategię - prowadź dziennik każdej transakcji z uzasadnieniem',
      'Szukaj powtarzalnych setupów - strategia musi działać dziesiątki razy, nie raz',
    ],
  },
  {
    num: '05',
    title: 'Stwórz trading plan',
    accent: '#c9a227',
    summary: 'Twoja osobista instrukcja obsługi rynku.',
    content: `Trading plan to Twoja osobista instrukcja obsługi rynku. Bez niego reagujesz emocjonalnie na każdą świecę - a emocje to wróg numer jeden tradera. Zapisz plan, wydrukuj go, przyklej obok monitora.`,
    points: [
      'Rynek i instrument - co tragujesz i dlaczego. Nie "wszystko co się rusza"',
      'Warunki wejścia - konkretne, mierzalne kryteria. Nie "jak wykres ładnie wygląda"',
      'Zasady psychologiczne - ile transakcji dziennie max, co po 2 stratach z rzędu',
    ],
  },
  {
    num: '06',
    title: 'Psychologia tradingu',
    accent: '#f5c518',
    summary: 'Głowa decyduje o wszystkim.',
    content: `Możesz znać price action, mieć świetną strategię i perfekcyjne zarządzanie ryzykiem - a i tak przegrać, bo głowa Ci nie pozwoli tego realizować. Sam fakt, że rozpoznajesz emocje w momencie kiedy się pojawiają, to już połowa sukcesu.`,
    points: [
      'Strach - zamykasz pozycję za wcześnie, bo boisz się że zysk zniknie',
      'Chciwość - przesuwasz TP, rynek się odwraca, kończysz na zero',
      'Revenge trading - najszybsza droga do wyzerowania konta',
      'FOMO - wskakujesz bez setupu "żeby nie przegapić". Wchodzisz na szczycie',
    ],
  },
  {
    num: '07',
    title: 'Przejdź na real',
    accent: '#ff2d78',
    summary: 'Małymi krokami, z minimalnym depozytem.',
    content: `Zacznij od kwoty, której stratę jesteś w stanie zaakceptować bez stresu. Przez pierwsze miesiące na realu Twoim celem nie jest zarabianie - Twoim celem jest realizacja planu. Jeśli trzymasz się zasad i kończysz miesiąc na zero - to sukces.`,
    points: [
      'Zacznij od minimalnego depozytu - nie wrzucaj oszczędności życia',
      'Obserwuj różnicę w emocjach - na realu serce bije szybciej. To normalne',
      'Nie zwiększaj pozycji zbyt szybko - min. 3-6 miesięcy konsekwentnych wyników',
    ],
  },
];

const WARNINGS = [
  'Sygnały i grupy "guru" - nie uczysz się nic, stajesz się zależny',
  'Zbyt wiele wskaźników - ekran jak kokpit samolotu, a nie widzisz ceny',
  'Skakanie między strategiami - każda ma serie strat, daj jej czas',
  'Porównywanie się z innymi - nie wiesz ile ktoś ryzykował ani czy mówi prawdę',
  'Trading pieniędzmi na które nie możesz sobie pozwolić - to nie jest negocjowalne',
];

const TIMELINE = [
  { months: 'Miesiąc 1–2', label: 'TEORIA', desc: 'Czytaj, oglądaj, ucz się. Świece, wsparcia, trend, ryzyko. Otwórz demo, ogarnij platformę.', accent: '#c9a227' },
  { months: 'Miesiąc 3–4', label: 'DEMO', desc: 'Wybierz jedną strategię. Traduj codziennie. Prowadź dziennik. Nie zmieniaj strategii.', accent: '#f5c518' },
  { months: 'Miesiąc 5–6', label: 'OCENA', desc: 'Przejrzyj dziennik. Winrate? Średnie RR? Trzymasz się planu? Jeśli tak - czas na real.', accent: '#e8963a' },
  { months: 'Miesiąc 7+', label: 'REAL', desc: 'Minimalny depozyt. Dalszy dziennik. Dalsze doskonalenie. Maraton, nie sprint.', accent: '#ff2d78' },
];

export default function LearnToTrade() {
  const [openStep, setOpenStep] = useState<number | null>(null);

  return (
    <section
      style={{
        padding: 'clamp(60px, 10vw, 120px) 24px',
        maxWidth: 960,
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div className="reveal" style={{ marginBottom: 56 }}>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
            letterSpacing: '3px',
            margin: '0 0 20px',
            color: 'var(--text)',
            lineHeight: 1.15,
          }}
        >
          NAUCZ SIĘ{' '}
          <span style={{ color: '#c9a227' }}>TRADOWAĆ</span>
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            color: 'var(--muted)',
            lineHeight: 1.8,
            maxWidth: 640,
          }}
        >
          Trading to nie kasyno i nie magiczny przycisk do zarabiania. To umiejętność,
          której można się nauczyć - ale wymaga czasu, dyscypliny i właściwego podejścia.
          Oto mapa drogowa od kompletnego zera do pierwszego świadomego trade&apos;a.
        </p>
      </div>

      {/* Steps accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {STEPS.map((step, i) => {
          const isOpen = openStep === i;
          return (
            <div
              key={step.num}
              className="reveal"
              style={{
                background: isOpen
                  ? `rgba(${hexToRgb(step.accent)}, 0.04)`
                  : 'rgba(255,255,255,0.015)',
                border: `1px solid ${isOpen ? `rgba(${hexToRgb(step.accent)}, 0.2)` : 'rgba(255,255,255,0.04)'}`,
                borderLeft: `3px solid ${isOpen ? step.accent : 'rgba(255,255,255,0.06)'}`,
                transition: 'all 0.3s ease',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setOpenStep(isOpen ? null : i)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '20px 24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  textAlign: 'left',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    color: step.accent,
                    opacity: isOpen ? 1 : 0.5,
                    minWidth: 24,
                    transition: 'opacity 0.3s',
                  }}
                >
                  {step.num}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
                    letterSpacing: '2px',
                    color: isOpen ? step.accent : 'var(--text)',
                    flex: 1,
                    transition: 'color 0.3s',
                    textTransform: 'uppercase',
                  }}
                >
                  {step.title}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    color: 'var(--muted)',
                    display: isOpen ? 'none' : 'block',
                  }}
                >
                  {step.summary}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: step.accent,
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s',
                  }}
                >
                  +
                </span>
              </button>

              <div
                style={{
                  maxHeight: isOpen ? 600 : 0,
                  opacity: isOpen ? 1 : 0,
                  transition: 'max-height 0.4s ease, opacity 0.3s ease',
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '0 24px 24px 64px' }}>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      color: 'var(--muted)',
                      lineHeight: 1.85,
                      margin: '0 0 16px',
                    }}
                  >
                    {step.content}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {step.points.map((point, j) => (
                      <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span
                          style={{
                            color: step.accent,
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.55rem',
                            marginTop: 5,
                            opacity: 0.6,
                          }}
                        >
                          ▸
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.72rem',
                            color: 'var(--muted)',
                            lineHeight: 1.7,
                          }}
                        >
                          {point}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Czego unikać */}
      <div className="reveal" style={{ marginTop: 64 }}>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
            letterSpacing: '2px',
            color: 'var(--text)',
            margin: '0 0 20px',
          }}
        >
          PUŁAPKI <span style={{ color: '#ff2d78' }}>POCZĄTKUJĄCYCH</span>
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 48 }}>
          {WARNINGS.map((w, i) => (
            <div key={i} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              padding: '12px 18px',
              background: 'rgba(255,45,120,0.03)',
              border: '1px solid rgba(255,45,120,0.08)',
              borderLeft: '3px solid rgba(255,45,120,0.4)',
            }}>
              <span style={{ color: '#ff2d78', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', marginTop: 3, flexShrink: 0 }}>✗</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.7 }}>{w}</span>
            </div>
          ))}
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
            letterSpacing: '2px',
            color: 'var(--text)',
            margin: '0 0 24px',
          }}
        >
          TIMELINE
        </h3>
        <div style={{ display: 'grid', gap: 12 }}>
          {TIMELINE.map((t, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: 20,
                alignItems: 'start',
                padding: '16px 20px',
                background: 'rgba(255,255,255,0.015)',
                border: '1px solid rgba(255,255,255,0.04)',
                borderLeft: `3px solid ${t.accent}`,
              }}
            >
              <div style={{ minWidth: 100 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', marginBottom: 4 }}>
                  {t.months}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', letterSpacing: '2px', color: t.accent }}>
                  {t.label}
                </div>
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom note */}
      <div className="reveal" style={{ marginTop: 56 }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--muted)',
            lineHeight: 1.85,
            padding: '24px',
            background: 'rgba(201,162,39,0.03)',
            border: '1px solid rgba(201,162,39,0.1)',
            borderLeft: '3px solid #c9a227',
          }}
        >
          Trading to maraton, nie sprint. Nie ma skrótów, nie ma cheatcodów.
          Jest natomiast sprawdzona ścieżka:{' '}
          <span style={{ color: '#c9a227' }}>
            nauka → demo → plan → dyscyplina → real → cierpliwość
          </span>
          . Większość osób potrzebuje 1-3 lat, żeby osiągnąć stabilność. Ale jeśli
          podejdziesz do tego z właściwą postawą, po kilku miesiącach będziesz dalej niż
          90% ludzi, którzy wrzucili pieniądze na konto w pierwszym tygodniu.
        </div>
      </div>

      {/* Disclaimer */}
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          color: 'rgba(255,255,255,0.2)',
          textAlign: 'center',
          marginTop: 48,
          lineHeight: 1.6,
        }}
      >
        Treści publikowane na KisielFinanse.pl mają charakter wyłącznie edukacyjny i nie
        stanowią doradztwa inwestycyjnego. Trading wiąże się z ryzykiem utraty kapitału.
      </p>
    </section>
  );
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
