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
  { months: 'Miesiąc 1-2', label: 'TEORIA', desc: 'Czytaj, oglądaj, ucz się. Świece, wsparcia, trend, ryzyko. Otwórz demo, ogarnij platformę.', accent: '#c9a227' },
  { months: 'Miesiąc 3-4', label: 'DEMO', desc: 'Wybierz jedną strategię. Traduj codziennie. Prowadź dziennik. Nie zmieniaj strategii.', accent: '#f5c518' },
  { months: 'Miesiąc 5-6', label: 'OCENA', desc: 'Przejrzyj dziennik. Winrate? Średnie RR? Trzymasz się planu? Jeśli tak - czas na real.', accent: '#e8963a' },
  { months: 'Miesiąc 7+', label: 'REAL', desc: 'Minimalny depozyt. Dalszy dziennik. Dalsze doskonalenie. Maraton, nie sprint.', accent: '#ff2d78' },
];

export default function LearnToTrade() {
  const [openStep, setOpenStep] = useState<number | null>(null);

  return (
    <section className="ltt-section">

      {/* Header */}
      <div className="reveal" style={{ marginBottom: 8 }}>
        <h2 className="ltt-title">
          Naucz się <span className="gold">tradować</span>
        </h2>
        <div className="ltt-accent-bar" />
        <p className="ltt-intro">
          Trading to nie kasyno i nie magiczny przycisk do zarabiania. To umiejętność,
          której można się nauczyć - ale wymaga czasu, dyscypliny i właściwego podejścia.
          Oto mapa drogowa od kompletnego zera do pierwszego świadomego trade&apos;a.
        </p>
      </div>

      {/* Steps */}
      <div className="ltt-steps">
        {STEPS.map((step, i) => {
          const isOpen = openStep === i;
          return (
            <div key={step.num} className={`ltt-item reveal${isOpen ? ' is-open' : ''}`}>
              <button
                className="ltt-step"
                onClick={() => setOpenStep(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span className="ltt-num">{step.num}</span>
                <span className="ltt-divider" aria-hidden="true" />
                <span className="ltt-step-title">{step.title}</span>
                <span className="ltt-summary">{step.summary}</span>
                <span className="ltt-chev" aria-hidden="true">›</span>
              </button>

              <div className="ltt-step-body">
                <div className="ltt-body-inner">
                  <p className="ltt-content">{step.content}</p>
                  <div className="ltt-points">
                    {step.points.map((point, j) => (
                      <div key={j} className="ltt-point">
                        <span className="ltt-point-mark">▸</span>
                        <span className="ltt-point-text">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pułapki */}
      <div className="reveal">
        <h3 className="ltt-h3">
          PUŁAPKI <span className="pink">POCZĄTKUJĄCYCH</span>
        </h3>
        <div className="ltt-warn-list">
          {WARNINGS.map((w, i) => {
            const idx = w.indexOf(' - ');
            const lead = idx === -1 ? w : w.slice(0, idx);
            const rest = idx === -1 ? '' : w.slice(idx);
            return (
              <div key={i} className="ltt-warn">
                <span className="ltt-warn-lead">{lead}</span>
                <span className="ltt-warn-rest">{rest}</span>
              </div>
            );
          })}
        </div>

        <h3 className="ltt-h3">TIMELINE</h3>
        <div className="ltt-tl-list">
          {TIMELINE.map((t, i) => (
            <div key={i} className="ltt-tl-row" style={{ ['--tl-accent' as string]: t.accent }}>
              <div className="ltt-tl-label">
                <span className="ltt-tl-months">{t.months}</span>
                <span className="ltt-tl-stage">{t.label}</span>
              </div>
              <p className="ltt-tl-desc">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom note */}
      <div className="reveal ltt-note">
        <span className="ltt-note-bold">Trading to maraton, nie sprint.</span>{' '}
        Nie ma skrótów, nie ma cheatcodów. Jest natomiast sprawdzona ścieżka:
        <span className="ltt-note-gold">
          nauka → demo → plan → dyscyplina → real → cierpliwość
        </span>
        Większość osób potrzebuje 1-3 lat, żeby osiągnąć stabilność. Ale jeśli
        podejdziesz do tego z właściwą postawą, po kilku miesiącach będziesz dalej niż
        90% ludzi, którzy wrzucili pieniądze na konto w pierwszym tygodniu.
      </div>

      {/* Disclaimer */}
      <p className="ltt-disclaimer">
        Treści publikowane na KisielFinanse.pl mają charakter wyłącznie edukacyjny i nie
        stanowią doradztwa inwestycyjnego. Trading wiąże się z ryzykiem utraty kapitału.
      </p>
    </section>
  );
}
