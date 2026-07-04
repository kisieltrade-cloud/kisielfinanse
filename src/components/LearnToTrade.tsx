'use client';

import { useEffect, useRef, useState } from 'react';
import { LEARN_FAQ } from '@/lib/learn-trade-faq';

type Step = {
  num: string;
  title: string;
  accent: string;
  summary: string;
  content: string;
  points: string[];
};

const STEPS: Step[] = [
  {
    num: '01',
    title: 'Zrozum rynek',
    accent: '#c9a227',
    summary: 'Wybierz jeden rynek i poznaj go na wylot.',
    content: `Nie próbuj ogarnąć wszystkiego na raz. Wybierz jeden rynek (forex, indeksy, krypto czy akcje) i poznaj go dogłębnie. Ja zaczynałem od EUR/USD i przez pierwsze miesiące nie dotykałem niczego innego. Nie dlatego, że to najlepszy instrument, tylko dlatego, że dobra znajomość jednego rynku jest warta więcej niż powierzchowna znajomość dziesięciu.`,
    points: [
      'Forex: rynek walutowy, 24/5, ogromna płynność, niski próg wejścia',
      'Indeksy: S&P 500, NASDAQ, DAX, czyli kondycja całych gospodarek',
      'Kryptowaluty: Bitcoin, Ethereum. Rynek 24/7, duża zmienność',
      'Akcje: Tesla, Apple, CD Projekt. Więcej researchu, namacalne fundamenty',
    ],
  },
  {
    num: '02',
    title: 'Naucz się czytać wykres',
    accent: '#f5c518',
    summary: 'Price action, nie 15 wskaźników.',
    content: `Nie potrzebujesz 15 wskaźników na ekranie. Potrzebujesz zrozumieć, co mówi Ci sam wykres, czyli czysty price action. RSI, MACD czy Bollinger Bands przyjdą później. Najpierw naucz się czytać wykres bez żadnych dodatków.`,
    points: [
      'Świece japońskie: język rynku. Pin bar, engulfing, doji, zrozum logikę za każdą z nich',
      'Wsparcia i opory: poziomy, na których rynek się zatrzymuje. Jedna z najważniejszych umiejętności',
      'Trend: wyższe szczyty i dołki to wzrost, niższe to spadek. Nie graj pod trend',
    ],
  },
  {
    num: '03',
    title: 'Zarządzanie ryzykiem',
    accent: '#ff2d78',
    summary: 'To oddziela traderów od hazardzistów.',
    content: `Sprowadza się do jednego pytania: ile mogę stracić, jeśli się mylę? Złota zasada brzmi: nie ryzykuj więcej niż 1-2% kapitału na jedną transakcję. Nawet najlepsi traderzy mają winrate 40-60%. Wygrywają nie dlatego, że mają rację częściej, tylko dlatego, że ich zyski są większe od strat.`,
    points: [
      'Stop Loss: zlecenie zamykające pozycję ze stratą. Nie tradujesz bez SL. Nigdy.',
      'Risk/Reward: stosunek zysku do ryzyka. Szukaj setupów minimum 1:2, najlepiej 1:3',
      'Position sizing: ile lotów kupujesz. Liczysz to na podstawie ryzyka i odległości SL',
    ],
  },
  {
    num: '04',
    title: 'Ćwicz na demo',
    accent: '#e8963a',
    summary: 'Minimum 2-3 miesiące przed realem.',
    content: `Nie wpłacaj ani złotówki, dopóki nie potrafisz konsekwentnie realizować planu na koncie demo. Konto demo działa identycznie jak prawdziwe: te same wykresy, ceny i spread. Jedyna różnica to brak emocji. Naucz się platformy, testuj strategię i prowadź dziennik każdej transakcji.`,
    points: [
      'Naucz się obsługi platformy: MetaTrader, cTrader, TradingView',
      'Testuj strategię: prowadź dziennik każdej transakcji wraz z uzasadnieniem',
      'Szukaj powtarzalnych setupów: strategia musi działać dziesiątki razy, a nie raz',
    ],
  },
  {
    num: '05',
    title: 'Stwórz trading plan',
    accent: '#c9a227',
    summary: 'Twoja osobista instrukcja obsługi rynku.',
    content: `Trading plan to Twoja osobista instrukcja obsługi rynku. Bez niego reagujesz emocjonalnie na każdą świecę, a emocje to wróg numer jeden tradera. Zapisz plan, wydrukuj go i przyklej obok monitora.`,
    points: [
      'Rynek i instrument: co tradujesz i dlaczego. Nie "wszystko, co się rusza"',
      'Warunki wejścia: konkretne, mierzalne kryteria. Nie "jak wykres ładnie wygląda"',
      'Zasady psychologiczne: ile transakcji dziennie maksymalnie, co robisz po dwóch stratach z rzędu',
    ],
  },
  {
    num: '06',
    title: 'Psychologia tradingu',
    accent: '#f5c518',
    summary: 'Głowa decyduje o wszystkim.',
    content: `Możesz znać price action, mieć świetną strategię i perfekcyjne zarządzanie ryzykiem, a i tak przegrać, bo głowa Ci nie pozwoli tego realizować. Sam fakt, że rozpoznajesz emocje w chwili, gdy się pojawiają, to już połowa sukcesu.`,
    points: [
      'Strach: zamykasz pozycję za wcześnie, bo boisz się, że zysk zniknie',
      'Chciwość: przesuwasz TP, rynek się odwraca i kończysz na zero',
      'Revenge trading: najszybsza droga do wyzerowania konta',
      'FOMO: wskakujesz bez setupu, "żeby nie przegapić", i lądujesz na samym szczycie',
    ],
  },
  {
    num: '07',
    title: 'Przejdź na real',
    accent: '#ff2d78',
    summary: 'Małymi krokami, z minimalnym depozytem.',
    content: `Zacznij od kwoty, której stratę jesteś w stanie zaakceptować bez stresu. Przez pierwsze miesiące na realu Twoim celem nie jest zarabianie, tylko realizacja planu. Jeśli trzymasz się zasad i kończysz miesiąc na zero, to i tak sukces.`,
    points: [
      'Zacznij od minimalnego depozytu: nie wrzucaj oszczędności życia',
      'Obserwuj różnicę w emocjach: na realu serce bije szybciej i to normalne',
      'Nie zwiększaj pozycji zbyt szybko: najpierw 3-6 miesięcy konsekwentnych wyników',
    ],
  },
];

const WARNINGS: { lead: string; rest: string }[] = [
  { lead: 'Sygnały i grupy "guru"', rest: 'nie uczysz się niczego, tylko stajesz się zależny' },
  { lead: 'Zbyt wiele wskaźników', rest: 'ekran jak kokpit samolotu, a ceny i tak nie widać' },
  { lead: 'Skakanie między strategiami', rest: 'każda ma serię strat, daj jej czas' },
  { lead: 'Porównywanie się z innymi', rest: 'nie wiesz, ile ktoś ryzykował ani czy mówi prawdę' },
  { lead: 'Trading pieniędzmi, których nie możesz stracić', rest: 'to nie podlega negocjacji' },
];

const TIMELINE = [
  { phase: '01', months: 'Miesiąc 1-2', label: 'Teoria', desc: 'Czytaj, oglądaj, ucz się. Świece, wsparcia, trend, ryzyko. Otwórz demo i ogarnij platformę.', accent: '#c9a227' },
  { phase: '02', months: 'Miesiąc 3-4', label: 'Demo', desc: 'Wybierz jedną strategię. Traduj codziennie. Prowadź dziennik. Nie zmieniaj strategii.', accent: '#f5c518' },
  { phase: '03', months: 'Miesiąc 5-6', label: 'Ocena', desc: 'Przejrzyj dziennik. Jaki winrate? Średnie RR? Czy trzymasz się planu? Jeśli tak, czas na real.', accent: '#e8963a' },
  { phase: '04', months: 'Miesiąc 7+', label: 'Real', desc: 'Minimalny depozyt. Dalej prowadź dziennik. Dalej się doskonal. To maraton, nie sprint.', accent: '#ff2d78' },
];

const PATH = ['nauka', 'demo', 'plan', 'dyscyplina', 'real', 'cierpliwość'];

const NEEDS = [
  { k: 'Czas', v: 'Kilka godzin tygodniowo, regularnie. Bez systematycznej praktyki nie ma postępu.' },
  { k: 'Niewielki kapitał', v: 'Na demo zero złotych. Na realu tylko kwota, której stratę zaakceptujesz bez stresu.' },
  { k: 'Broker z kontem demo', v: 'MetaTrader, cTrader albo TradingView. Do nauki platforma jest za darmo.' },
  { k: 'Odporność psychiczna', v: 'Gotowość na serie strat bez rozbijania konta i odgrywania się.' },
];

const STATS = [
  { n: '90%', d: 'początkujących traci pieniądze w pierwszym roku', href: '/trading/dlaczego-90-procent-traderow-traci' },
  { n: '1-2%', d: 'maksymalne ryzyko, jakie bierzesz na jedną transakcję', href: '/kalkulator/risk-reward' },
  { n: '40-60%', d: 'winrate, który wystarcza, gdy zyski biją straty', href: '' },
];

const MYTHS = [
  { myth: 'Trading to szybkie i łatwe pieniądze', truth: 'To umiejętność budowana miesiącami. Pierwszy rok zwykle służy nauce, nie zarabianiu.' },
  { myth: 'Im więcej wskaźników, tym lepsze decyzje', truth: 'Najczęściej odwrotnie. Czysty wykres i kilka poziomów biją kokpit pełen wskaźników.' },
  { myth: 'Wystarczy kupić sygnały od kogoś, kto umie', truth: 'Sygnały uzależniają i niczego nie uczą. Bez własnego planu nie powtórzysz wyniku.' },
  { myth: 'Większy depozyt to większe zyski', truth: 'Większy depozyt to większe ryzyko. Bez kontroli straty znikają szybciej, nie wolniej.' },
  { myth: 'Dobry trader ma rację w większości transakcji', truth: 'Wystarczy 40-60% trafień, jeśli zyski biją straty. Liczy się przewaga, nie skuteczność.' },
];

// "Sprawdź się": wykres świecowy + formacja, zgadnij dalszy ciąg
type Candle = [number, number, number, number]; // [open, high, low, close]
type Scenario = {
  instrument: string; tf: string; setup: string;
  level?: { price: number; label: string };
  candles: Candle[]; outcome: Candle[]; dir: 'up' | 'down';
  question: string; options: { t: string; ok?: boolean }[];
  formation: string; outcomeText: string; lesson: string;
};

const SCENARIOS: Scenario[] = [
  {
    instrument: 'US100', tf: 'interwał H1',
    setup: 'Trend spadkowy dochodzi do wsparcia. Po serii czerwonych świec pojawia się duża zielona świeca, która w całości obejmuje poprzednią.',
    level: { price: 19360, label: 'wsparcie' },
    candles: [[19780,19820,19700,19720],[19720,19740,19620,19640],[19640,19660,19560,19580],[19580,19600,19500,19520],[19520,19540,19440,19460],[19460,19480,19380,19400],[19400,19420,19360,19380],[19370,19560,19355,19540]],
    outcome: [[19540,19620,19520,19600],[19600,19660,19580,19640],[19640,19720,19620,19700],[19700,19760,19680,19740],[19740,19810,19720,19785]],
    dir: 'up',
    question: 'Co stało się dalej?',
    options: [
      { t: 'Odbicie i wzrost', ok: true },
      { t: 'Przebicie wsparcia i dalszy spadek' },
      { t: 'Cena stoi w miejscu' },
    ],
    formation: 'Objęcie hossy (bullish engulfing) przy wsparciu',
    outcomeText: 'Cena odbiła od wsparcia i ruszyła w górę. Świeca objęcia hossy zapowiedziała odwrócenie.',
    lesson: 'Duża świeca objęcia hossy przy ważnym wsparciu to jeden z mocniejszych sygnałów odwrócenia. Wchodzisz po potwierdzeniu, ze stop lossem pod dołkiem.',
  },
  {
    instrument: 'GER40', tf: 'interwał H4',
    setup: 'Cena rośnie i dochodzi do oporu, który wcześniej kilka razy zawracał notowania. Tym razem długa zielona świeca wybija ponad ten poziom.',
    level: { price: 18600, label: 'opór' },
    candles: [[18000,18060,17980,18050],[18050,18160,18030,18140],[18140,18250,18120,18230],[18230,18380,18210,18360],[18360,18520,18340,18500],[18500,18600,18470,18560],[18560,18760,18550,18720]],
    outcome: [[18720,18740,18560,18580],[18580,18620,18480,18500],[18500,18540,18400,18420],[18420,18460,18320,18340],[18340,18380,18250,18280]],
    dir: 'down',
    question: 'Co stało się dalej?',
    options: [
      { t: 'Kontynuacja wzrostu' },
      { t: 'Fałszywe wybicie i powrót pod opór', ok: true },
      { t: 'Spokojna konsolidacja' },
    ],
    formation: 'Fałszywe wybicie (bull trap)',
    outcomeText: 'To było fałszywe wybicie. Cena wróciła pod opór i ruszyła w dół, łapiąc kupujących w pułapkę.',
    lesson: 'Wybicie na pojedynczej, długiej świecy bez potwierdzenia często okazuje się pułapką. Poczekaj na zamknięcie powyżej oporu i retest poziomu.',
  },
  {
    instrument: 'US500', tf: 'interwał D1',
    setup: 'Cena dwa razy dochodzi do tego samego oporu i za każdym razem zawraca. Powstają dwa szczyty na podobnym poziomie, a notowania wracają do linii szyi.',
    level: { price: 5400, label: 'linia szyi' },
    candles: [[5380,5420,5370,5410],[5410,5500,5400,5485],[5485,5605,5475,5590],[5590,5610,5500,5520],[5520,5560,5395,5410],[5410,5470,5400,5460],[5460,5600,5450,5585],[5585,5600,5500,5520]],
    outcome: [[5520,5530,5395,5405],[5405,5415,5300,5320],[5320,5340,5220,5240],[5240,5260,5150,5170],[5170,5190,5090,5110]],
    dir: 'down',
    question: 'Co stało się dalej?',
    options: [
      { t: 'Trzeci szczyt i wybicie górą' },
      { t: 'Przełamanie linii szyi i spadek', ok: true },
      { t: 'Ruch w bok' },
    ],
    formation: 'Podwójny szczyt (double top)',
    outcomeText: 'Cena przełamała linię szyi i ruszyła w dół. Podwójny szczyt potwierdził odwrócenie trendu.',
    lesson: 'Podwójny szczyt to klasyczna formacja odwrócenia. Sygnał aktywuje się po przełamaniu linii szyi, a zasięg ruchu w przybliżeniu odpowiada wysokości formacji.',
  },
  {
    instrument: 'BTC/USD', tf: 'interwał H4',
    setup: 'Po mocnym, dynamicznym wzroście cena wchodzi w wąską, lekko opadającą konsolidację. Świece robią się małe, a notowania spokojnie schodzą w bok.',
    candles: [[58000,59500,57800,59200],[59200,62000,59000,61800],[61800,65500,61500,65000],[65000,72000,64800,71000],[71000,71500,68500,69000],[69000,70000,67500,68000],[68000,69500,67000,69200],[69200,70000,67800,68500]],
    outcome: [[68500,74000,68000,73000],[73000,78000,72500,77000],[77000,83000,76500,82000],[82000,87000,81000,86000],[86000,90000,85000,89000]],
    dir: 'up',
    question: 'Co stało się dalej?',
    options: [
      { t: 'Kontynuacja wzrostu', ok: true },
      { t: 'Odwrócenie i głęboki spadek' },
      { t: 'Długa stagnacja' },
    ],
    formation: 'Flaga byka (bull flag)',
    outcomeText: 'Cena wybiła z flagi górą i kontynuowała trend wzrostowy.',
    lesson: 'Flaga w trendzie wzrostowym to zwykle pauza przed dalszym ruchem w kierunku trendu. Wybicie górą potwierdza kontynuację.',
  },
  {
    instrument: 'US30', tf: 'interwał H4',
    setup: 'Powstają trzy szczyty: środkowy najwyższy, dwa boczne niżej i na podobnym poziomie. Cena znów schodzi do linii łączącej dołki między szczytami.',
    level: { price: 42600, label: 'linia szyi' },
    candles: [[42600,42700,42550,42650],[42650,43250,42620,43180],[43180,43230,42600,42650],[42650,43650,42620,43580],[43580,43620,42600,42660],[42660,43230,42640,43180],[43180,43220,42650,42700],[42700,42760,42560,42620]],
    outcome: [[42620,42660,42400,42420],[42420,42460,42150,42180],[42180,42220,41950,41980],[41980,42010,41750,41780],[41780,41820,41600,41640]],
    dir: 'down',
    question: 'Co stało się dalej?',
    options: [
      { t: 'Wybicie na nowy szczyt' },
      { t: 'Przełamanie linii szyi i spadek', ok: true },
      { t: 'Ruch w bok' },
    ],
    formation: 'Głowa z ramionami (head and shoulders)',
    outcomeText: 'Cena przełamała linię szyi i ruszyła w dół. Formacja głowy z ramionami potwierdziła odwrócenie trendu.',
    lesson: 'Głowa z ramionami to jedna z najpopularniejszych formacji odwrócenia szczytu. Sygnał aktywuje przełamanie linii szyi, a zasięg w przybliżeniu odpowiada odległości od głowy do tej linii.',
  },
  {
    instrument: 'UK100', tf: 'interwał D1',
    setup: 'Po trendzie spadkowym cena dwa razy odbija się od tego samego dna, a między dołkami tworzy lokalny opór. Notowania znów podchodzą pod ten poziom.',
    level: { price: 8205, label: 'opór' },
    candles: [[8280,8300,8230,8250],[8250,8270,8140,8160],[8160,8180,8010,8030],[8030,8210,8020,8195],[8195,8215,8090,8110],[8110,8130,8005,8025],[8025,8160,8015,8150],[8150,8210,8130,8200]],
    outcome: [[8200,8320,8190,8300],[8300,8420,8280,8400],[8400,8520,8380,8500],[8500,8600,8470,8580],[8580,8660,8550,8640]],
    dir: 'up',
    question: 'Co stało się dalej?',
    options: [
      { t: 'Trzeci dołek i dalszy spadek' },
      { t: 'Wybicie ponad opór i wzrost', ok: true },
      { t: 'Ruch w bok' },
    ],
    formation: 'Podwójne dno (double bottom)',
    outcomeText: 'Cena wybiła ponad opór i ruszyła w górę. Podwójne dno potwierdziło odwrócenie trendu spadkowego.',
    lesson: 'Podwójne dno to lustrzane odbicie podwójnego szczytu, formacja odwrócenia po spadkach. Potwierdzeniem jest wybicie ponad opór łączący odbicie między dołkami.',
  },
];

// Wymiary wykresu świecowego (oś cen po prawej, wolumen i oś czasu na dole)
const CC_W = 720, CC_H = 340, CC_PADX = 14, CC_PADTOP = 18, CC_PADBOT = 36, CC_AXIS = 66;

function fmtPrice(p: number): string {
  return Math.round(p).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
function niceStep(range: number, target: number): number {
  const raw = range / target;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10;
  return step * mag;
}
function timeLabels(tf: string, n: number): string[] {
  const out: string[] = [];
  if (tf.includes('D1')) {
    const base = new Date(2026, 4, 4);
    for (let i = 0; i < n; i++) {
      const d = new Date(base); d.setDate(base.getDate() + i);
      out.push(`${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`);
    }
  } else {
    const stepH = tf.includes('H4') ? 4 : 1;
    let h = 8;
    for (let i = 0; i < n; i++) { out.push(`${String(((h % 24) + 24) % 24).padStart(2, '0')}:00`); h += stepH; }
  }
  return out;
}
function scoreComment(n: number, total: number): string {
  const r = n / total;
  if (r === 1) return 'Komplet. Masz oko do wykresu.';
  if (r >= 0.66) return 'Mocny wynik. Brakuje tylko szlifu.';
  if (r >= 0.34) return 'Nieźle, ale rynek lubi zaskakiwać.';
  return 'Dlatego najpierw demo. Wróć tu po przejściu kroków.';
}

const GLOSSARY = [
  { t: 'Price action', d: 'Czytanie samego wykresu, bez wskaźników. Świece, poziomy i struktura ruchu.' },
  { t: 'Spread', d: 'Różnica między ceną kupna a sprzedaży. Twój koszt wejścia w pozycję.' },
  { t: 'Lot', d: 'Jednostka wielkości pozycji. Decyduje, ile zarabiasz lub tracisz na ruchu ceny.' },
  { t: 'Pip', d: 'Najmniejszy standardowy ruch ceny na danym instrumencie.' },
  { t: 'Stop Loss (SL)', d: 'Zlecenie, które zamyka stratną pozycję na z góry ustalonym poziomie.' },
  { t: 'Take Profit (TP)', d: 'Zlecenie, które realizuje zysk na zaplanowanej wcześniej cenie.' },
  { t: 'Dźwignia', d: 'Zwiększa ekspozycję ponad wpłacony kapitał. Powiększa zysk, ale i stratę.' },
  { t: 'Wolumen', d: 'Liczba transakcji w danym czasie. Pokazuje, jak mocny jest ruch.' },
];

const READS = [
  { t: 'Świece japońskie - jak czytać wykres', s: 'Budowa świecy i najważniejsze formacje', href: '/trading/swiece-japonskie-jak-czytac-wykres' },
  { t: 'Wsparcie i opór - jak wyznaczać poziomy', s: 'Gdzie rynek reaguje i jak z tego korzystać', href: '/trading/wsparcie-i-opor-jak-wyznaczac-poziomy' },
  { t: 'Trend i linia trendu', s: 'Jak rozpoznać kierunek rynku i grać z nim', href: '/trading/trend-i-linia-trendu' },
  { t: 'Encyklopedia formacji', s: 'Świece i formacje wykresu, narysowane i wyjaśnione', href: '/formacje-tradingowe' },
  { t: 'Narzędzia tradera', s: 'Symulator, kalkulatory i dziennik w jednym miejscu', href: '/narzedzia-tradera' },
  { t: 'Jak zacząć trading od zera', s: 'Kompletny przewodnik dla początkujących', href: '/trading/jak-zaczac-trading-od-zera' },
  { t: 'Dlaczego 90% traderów traci', s: 'Najczęstsze błędy i jak ich uniknąć', href: '/trading/dlaczego-90-procent-traderow-traci' },
  { t: 'Psychologia tradingu', s: 'Jak kontrolować emocje przy wykresie', href: '/psychologia/psychologia-tradingu-jak-kontrolowac-emocje' },
  { t: 'Strategie, które działają', s: 'Moje podejście po 9 latach na rynkach', href: '/trading/strategie-tradingowe-ktore-naprawde-dzialaja' },
  { t: 'Fibonacci w tradingu', s: 'Kompletny przewodnik od A do Z', href: '/trading/fibonacci-w-tradingu-kompletny-przewodnik' },
  { t: 'Kalkulator Risk/Reward', s: 'Policz stosunek zysku do ryzyka', href: '/kalkulator/risk-reward' },
];


export default function LearnToTrade() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reveals = Array.from(root.querySelectorAll<HTMLElement>('[data-r]'));
    const reveal = (el: Element) => el.classList.add('is-in');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let io: IntersectionObserver | null = null;
    let fallback = 0;
    let cancelFallback: (() => void) | null = null;

    if (reduce) {
      reveals.forEach(reveal);
    } else {
      root.classList.add('lt3--ready');
      const vh = window.innerHeight || 800;
      reveals.forEach((el) => {
        if (el.getBoundingClientRect().top < vh * 1.25) {
          el.style.transition = 'none';
          reveal(el);
          requestAnimationFrame(() => (el.style.transition = ''));
        }
      });
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) reveal(e.target); }),
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
      );
      reveals.forEach((el) => { if (!el.classList.contains('is-in')) io!.observe(el); });
      fallback = window.setTimeout(() => reveals.forEach(reveal), 3000);
      cancelFallback = () => { window.clearTimeout(fallback); window.removeEventListener('scroll', cancelFallback!); };
      window.addEventListener('scroll', cancelFallback, { passive: true, once: true });
    }

    // ── Progress + aktywny krok + delikatny parallax numerów ──
    const journey = root.querySelector<HTMLElement>('.lt3-journey');
    const steps = Array.from(root.querySelectorAll<HTMLElement>('.lt3-step'));
    const nums = steps.map((s) => s.querySelector<HTMLElement>('.lt3-no'));
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const vh = window.innerHeight || 800;
        const mid = vh * 0.5;
        if (journey) {
          const rect = journey.getBoundingClientRect();
          const total = rect.height - vh * 0.6;
          const passed = Math.min(Math.max(vh * 0.5 - rect.top, 0), Math.max(total, 1));
          setProgress(total > 0 ? Math.min(passed / total, 1) : 0);
        }
        let best = 0, bestDist = Infinity;
        steps.forEach((s, i) => {
          const r = s.getBoundingClientRect();
          const c = r.top + r.height / 2;
          const d = Math.abs(c - mid);
          if (d < bestDist) { bestDist = d; best = i; }
          if (!reduce && nums[i]) {
            const off = Math.max(-60, Math.min(60, (mid - c) * 0.08));
            nums[i]!.style.transform = `translateY(${off.toFixed(1)}px)`;
          }
        });
        setActive(best);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      io?.disconnect();
      if (fallback) window.clearTimeout(fallback);
      if (cancelFallback) window.removeEventListener('scroll', cancelFallback);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="lt3" ref={rootRef}>
      <style>{CSS}</style>

      {/* ───────── HERO ───────── */}
      <header className="lt3-hero">
        <svg className="lt3-hero-chart" viewBox="0 0 1200 300" preserveAspectRatio="none" aria-hidden="true">
          <path pathLength={1} d="M0,260 L100,238 L200,264 L300,205 L400,226 L500,168 L600,198 L700,128 L800,152 L900,96 L1000,122 L1100,58 L1200,28" />
          <circle className="lt3-hero-chart-dot" cx="1200" cy="28" r="5" />
        </svg>
        <div className="lt3-hero-inner">
          <p className="lt3-eyebrow lt3-rise" data-r><span>Przewodnik · od zera do pierwszego trade&apos;a</span></p>
          <h1 className="lt3-h1 lt3-rise" data-r>
            <span>Naucz się <em>tradować</em></span>
          </h1>
          <p className="lt3-lead lt3-rise" data-r style={{ transitionDelay: '120ms' }}>
            <span>
              Trading to nie kasyno i nie magiczny przycisk do zarabiania. To umiejętność,
              której można się nauczyć, ale wymaga czasu i dyscypliny. Poniżej cała mapa drogowa,
              od kompletnego zera do pierwszego świadomego trade&apos;a.
            </span>
          </p>
          <div className="lt3-meta lt3-rise" data-r style={{ transitionDelay: '220ms' }}>
            <span><b>7</b> kroków</span>
            <span><b>6+</b> miesięcy nauki</span>
            <span>bez obietnic szybkiego bogacenia</span>
          </div>
          <p className="lt3-byline" data-r style={{ transitionDelay: '320ms' }}>
            <a href="/o-mnie">Mateusz Kisiel</a> · 9 lat na rynkach finansowych
          </p>
        </div>
      </header>

      {/* ───────── CZEGO POTRZEBUJESZ ───────── */}
      <section className="lt3-block">
        <header className="lt3-block-head" data-r>
          <p className="lt3-eyebrow"><span>Zanim zaczniesz</span></p>
          <h2 className="lt3-block-title">Czego <em>potrzebujesz</em></h2>
        </header>
        <div className="lt3-needs-grid">
          {NEEDS.map((n, i) => (
            <div key={i} className="lt3-need" data-r style={{ transitionDelay: `${i * 70}ms` }}>
              <span className="lt3-need-no">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="lt3-need-k">{n.k}</h3>
              <p className="lt3-need-v">{n.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── JOURNEY ───────── */}
      <div className="lt3-journey">
        <aside className="lt3-index" aria-hidden="true">
          <div className="lt3-index-rail">
            <span className="lt3-index-fill" style={{ transform: `scaleY(${progress})` }} />
          </div>
          <ol className="lt3-index-list">
            {STEPS.map((s, i) => (
              <li
                key={s.num}
                className={`lt3-index-item${i === active ? ' is-active' : ''}`}
                style={{ ['--a' as string]: s.accent }}
              >
                <span className="lt3-index-no">{s.num}</span>
                <span className="lt3-index-title">{s.title}</span>
              </li>
            ))}
          </ol>
        </aside>

        <div className="lt3-steps">
          {STEPS.map((s) => (
            <article key={s.num} className="lt3-step" style={{ ['--a' as string]: s.accent }}>
              <div className="lt3-step-aside">
                <span className="lt3-no" aria-hidden="true">{s.num}</span>
              </div>
              <div className="lt3-step-main">
                <p className="lt3-step-eyebrow lt3-rise" data-r><span>Krok {s.num}</span></p>
                <h2 className="lt3-step-title lt3-rise" data-r><span>{s.title}</span></h2>
                <p className="lt3-step-sum lt3-rise" data-r style={{ transitionDelay: '60ms' }}><span>{s.summary}</span></p>
                <p className="lt3-step-body" data-r style={{ transitionDelay: '90ms' }}>{s.content}</p>
                <ul className="lt3-points" data-r style={{ transitionDelay: '140ms' }}>
                  {s.points.map((p, j) => (
                    <li key={j} className="lt3-point">
                      <span className="lt3-tick" aria-hidden="true" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* ───────── SPRAWDŹ SIĘ ───────── */}
      <SelfTest />

      {/* ───────── REALITY CHECK ───────── */}
      <section className="lt3-block">
        <header className="lt3-block-head" data-r>
          <p className="lt3-eyebrow"><span>Reality check</span></p>
          <h2 className="lt3-block-title">Liczby, których <em>nie zignorujesz</em></h2>
        </header>
        <div className="lt3-stats">
          {STATS.map((s, i) => {
            const inner = (
              <>
                <span className="lt3-stat-n">{s.n}</span>
                <span className="lt3-stat-d">{s.d}</span>
              </>
            );
            return s.href ? (
              <a key={i} href={s.href} className="lt3-stat lt3-stat-link" data-r style={{ transitionDelay: `${i * 90}ms` }}>{inner}</a>
            ) : (
              <div key={i} className="lt3-stat" data-r style={{ transitionDelay: `${i * 90}ms` }}>{inner}</div>
            );
          })}
        </div>
      </section>

      {/* ───────── PUŁAPKI ───────── */}
      <section className="lt3-block">
        <header className="lt3-block-head" data-r>
          <p className="lt3-eyebrow lt3-eyebrow-pink"><span>Uważaj</span></p>
          <h2 className="lt3-block-title">Pułapki <em className="lt3-pink">początkujących</em></h2>
        </header>
        <ol className="lt3-traps">
          {WARNINGS.map((w, i) => (
            <li key={i} className="lt3-trap" data-r style={{ transitionDelay: `${i * 60}ms` }}>
              <span className="lt3-trap-no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <p><b>{w.lead}.</b> {w.rest}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ───────── TIMELINE ───────── */}
      <section className="lt3-block">
        <header className="lt3-block-head" data-r>
          <p className="lt3-eyebrow"><span>Realny harmonogram</span></p>
          <h2 className="lt3-block-title">Jak to wygląda <em>w czasie</em></h2>
        </header>
        <div className="lt3-phases">
          {TIMELINE.map((t, i) => (
            <div key={i} className="lt3-phase" data-r style={{ ['--a' as string]: t.accent, transitionDelay: `${i * 80}ms` }}>
              <span className="lt3-phase-no" aria-hidden="true">{t.phase}</span>
              <span className="lt3-phase-months">{t.months}</span>
              <h3 className="lt3-phase-label">{t.label}</h3>
              <p className="lt3-phase-desc">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── MIT KONTRA RZECZYWISTOŚĆ ───────── */}
      <section className="lt3-block">
        <header className="lt3-block-head" data-r>
          <p className="lt3-eyebrow"><span>Bez ściemy</span></p>
          <h2 className="lt3-block-title">Mit kontra <em>rzeczywistość</em></h2>
        </header>
        <div className="lt3-myths">
          {MYTHS.map((m, i) => (
            <div key={i} className="lt3-myth" data-r style={{ transitionDelay: `${i * 60}ms` }}>
              <div className="lt3-myth-col">
                <span className="lt3-myth-tag is-myth">Mit</span>
                <p className="lt3-myth-text lt3-myth-myth">{m.myth}</p>
              </div>
              <div className="lt3-myth-col">
                <span className="lt3-myth-tag is-fact">Rzeczywistość</span>
                <p className="lt3-myth-text lt3-myth-fact">{m.truth}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── SŁOWNIK W PIGUŁCE ───────── */}
      <section className="lt3-block">
        <header className="lt3-block-head" data-r>
          <p className="lt3-eyebrow"><span>Język rynku</span></p>
          <h2 className="lt3-block-title">Słownik tradera <em>w pigułce</em></h2>
        </header>
        <div className="lt3-gloss">
          {GLOSSARY.map((g, i) => (
            <div key={i} className="lt3-gloss-item" data-r style={{ transitionDelay: `${i * 40}ms` }}>
              <span className="lt3-gloss-t">{g.t}</span>
              <span className="lt3-gloss-d">{g.d}</span>
            </div>
          ))}
        </div>
        <a href="/slownik" className="lt3-gloss-more" data-r>Pełny słownik pojęć →</a>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="lt3-block">
        <header className="lt3-block-head" data-r>
          <p className="lt3-eyebrow"><span>Najczęstsze pytania</span></p>
          <h2 className="lt3-block-title">Zanim <em>zapytasz</em></h2>
        </header>
        <div className="lt3-faq">
          {LEARN_FAQ.map((f, i) => (
            <details key={i} className="lt3-faq-item" data-r style={{ transitionDelay: `${i * 40}ms` }}>
              <summary className="lt3-faq-q">
                <span>{f.q}</span>
                <span className="lt3-faq-plus" aria-hidden="true">+</span>
              </summary>
              <p className="lt3-faq-a">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ───────── CZYTAJ DALEJ ───────── */}
      <section className="lt3-block">
        <header className="lt3-block-head" data-r>
          <p className="lt3-eyebrow"><span>Pogłęb temat</span></p>
          <h2 className="lt3-block-title">Czytaj <em>dalej</em></h2>
        </header>
        <div className="lt3-reads">
          {READS.map((r, i) => (
            <a key={i} href={r.href} className="lt3-read" data-r style={{ transitionDelay: `${i * 50}ms` }}>
              <span className="lt3-read-t">{r.t}</span>
              <span className="lt3-read-s">{r.s}</span>
              <span className="lt3-read-arrow" aria-hidden="true">→</span>
            </a>
          ))}
        </div>
      </section>

      {/* ───────── ZAMKNIĘCIE ───────── */}
      <section className="lt3-close">
        <p className="lt3-close-big lt3-rise" data-r><span>Trading to maraton, nie sprint.</span></p>
        <p className="lt3-close-text" data-r style={{ transitionDelay: '80ms' }}>
          Nie ma skrótów ani cheatcodów. Jest za to sprawdzona ścieżka.
        </p>
        <div className="lt3-path" data-r style={{ transitionDelay: '140ms' }}>
          {PATH.map((w, i) => (
            <span key={w} className="lt3-path-item">
              <span className="lt3-path-w">{w}</span>
              {i < PATH.length - 1 && <span className="lt3-path-sep" aria-hidden="true">→</span>}
            </span>
          ))}
        </div>
        <p className="lt3-close-text" data-r style={{ transitionDelay: '180ms' }}>
          Większość osób potrzebuje 1-3 lat, żeby osiągnąć stabilność. Ale jeśli podejdziesz
          do tego z właściwą postawą, po kilku miesiącach będziesz dalej niż 90% ludzi, którzy
          wrzucili pieniądze na konto w pierwszym tygodniu.
        </p>
        <div className="lt3-cta-row" data-r style={{ transitionDelay: '240ms' }}>
          <a href="/kalkulator/risk-reward" className="lt3-cta">Policz swoje Risk/Reward</a>
          <a href="/trading" className="lt3-cta lt3-cta-ghost">Więcej o tradingu</a>
        </div>
      </section>

      <p className="lt3-disclaimer">
        Treści publikowane na KisielFinanse.pl mają charakter wyłącznie edukacyjny i nie
        stanowią doradztwa inwestycyjnego. Trading wiąże się z ryzykiem utraty kapitału.
      </p>
    </div>
  );
}

function SelfTest() {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const answered = Object.keys(picked).length;
  const correct = SCENARIOS.reduce((acc, s, i) => acc + (picked[i] === s.options.findIndex((o) => o.ok) ? 1 : 0), 0);
  const allDone = answered === SCENARIOS.length;

  return (
    <section className="lt3-block">
      <header className="lt3-block-head" data-r>
        <p className="lt3-eyebrow"><span>Sprawdź się</span></p>
        <h2 className="lt3-block-title">Co będzie <em>dalej?</em></h2>
        <p className="lt3-test-intro">
          Sześć wykresów, sześć formacji świecowych. Widzisz świece do momentu decyzji.
          Zgadnij dalszy ciąg, kliknij odpowiedź, a wykres dorysuje, co stało się naprawdę.
        </p>
      </header>

      <div className="lt3-tests">
        {SCENARIOS.map((s, si) => {
          const sel = picked[si];
          const revealed = sel !== undefined;
          const correctIdx = s.options.findIndex((o) => o.ok);
          const all = [...s.candles, ...s.outcome];
          let min = Infinity, max = -Infinity, maxVol = 0;
          all.forEach((c) => { if (c[2] < min) min = c[2]; if (c[1] > max) max = c[1]; const v = c[1] - c[2]; if (v > maxVol) maxVol = v; });
          const padV = (max - min) * 0.08; min -= padV; max += padV;
          const plotR = CC_W - CC_AXIS;
          const plotW = plotR - CC_PADX;
          const plotH = CC_H - CC_PADTOP - CC_PADBOT;
          const volH = plotH * 0.18;
          const gapPV = 12;
          const priceH = plotH - volH - gapPV;
          const volBase = CC_PADTOP + priceH + gapPV + volH;
          const n = all.length;
          const step = plotW / n;
          const bw = Math.max(step * 0.62, 4);
          const cx = (i: number) => CC_PADX + (i + 0.5) * step;
          const yy = (p: number) => CC_PADTOP + (1 - (p - min) / (max - min)) * priceH;
          const splitX = CC_PADX + s.candles.length * step;
          const gstep = niceStep(max - min, 4);
          const ticks: number[] = [];
          for (let t = Math.ceil(min / gstep) * gstep; t <= max; t += gstep) ticks.push(t);
          const times = timeLabels(s.tf, n);
          const tStep = Math.ceil(n / 6);
          const lastC = revealed ? s.outcome[s.outcome.length - 1] : s.candles[s.candles.length - 1];
          const lastClose = lastC[3];
          const lastUp = lastC[3] >= lastC[0];
          const renderCandle = (c: Candle, i: number) => {
            const up = c[3] >= c[0];
            const col = up ? '#16a34a' : '#ef4453';
            const yO = yy(c[0]), yC = yy(c[3]);
            const top = Math.min(yO, yC);
            const h = Math.max(Math.abs(yO - yC), 1.6);
            return (
              <g key={i}>
                <line x1={cx(i)} x2={cx(i)} y1={yy(c[1])} y2={yy(c[2])} stroke={col} strokeWidth={1.2} />
                <rect x={cx(i) - bw / 2} y={top} width={bw} height={h} fill={col} rx={0.5} />
              </g>
            );
          };
          const renderVol = (c: Candle, i: number) => {
            const up = c[3] >= c[0];
            const h = Math.max(((c[1] - c[2]) / maxVol) * volH, 1);
            return <rect key={`v${i}`} x={cx(i) - bw / 2} y={volBase - h} width={bw} height={h} fill={up ? '#16a34a' : '#ef4453'} opacity={0.3} />;
          };
          return (
            <div key={si} className="lt3-test" data-r>
              <div className="lt3-test-chart">
                <div className="lt3-cc-wrap">
                  <svg viewBox={`0 0 ${CC_W} ${CC_H}`} role="img" aria-label={`Wykres świecowy ${s.instrument} ${s.tf}`}>
                    {/* siatka + oś cen */}
                    {ticks.map((t, ti) => (
                      <g key={ti}>
                        <line className="lt3-cc-grid" x1={CC_PADX} x2={plotR} y1={yy(t)} y2={yy(t)} />
                        <text className="lt3-cc-axis" x={plotR + 7} y={yy(t)} dominantBaseline="middle">{fmtPrice(t)}</text>
                      </g>
                    ))}
                    {/* poziom formacji */}
                    {s.level && (
                      <g>
                        <line className="lt3-cc-level" x1={CC_PADX} x2={plotR} y1={yy(s.level.price)} y2={yy(s.level.price)} />
                        <text className="lt3-cc-level-t" x={CC_PADX + 4} y={yy(s.level.price) - 5}>{s.level.label}</text>
                      </g>
                    )}
                    {/* wolumen (setup) */}
                    {s.candles.map((c, i) => renderVol(c, i))}
                    {/* świece (setup) */}
                    {s.candles.map((c, i) => renderCandle(c, i))}
                    {/* linia podziału "teraz" */}
                    <line className="lt3-cc-div" x1={splitX} x2={splitX} y1={CC_PADTOP} y2={volBase} />
                    <text className="lt3-cc-now" x={splitX} y={CC_PADTOP + 10} textAnchor="middle">teraz</text>
                    {/* świece + wolumen (dalszy ciąg, odsłaniane) */}
                    <g className={`lt3-cc-after${revealed ? ' is-rev' : ''}`}>
                      {s.outcome.map((c, i) => renderVol(c, s.candles.length + i))}
                      {s.outcome.map((c, i) => renderCandle(c, s.candles.length + i))}
                    </g>
                    {/* tag ostatniej ceny */}
                    <line className="lt3-cc-last" x1={CC_PADX} x2={plotR} y1={yy(lastClose)} y2={yy(lastClose)} />
                    <rect x={plotR} y={yy(lastClose) - 9} width={CC_AXIS} height={18} fill={lastUp ? '#16a34a' : '#ef4453'} rx={1} />
                    <text className="lt3-cc-last-t" x={plotR + CC_AXIS / 2} y={yy(lastClose)} textAnchor="middle" dominantBaseline="middle">{fmtPrice(lastClose)}</text>
                    {/* oś czasu */}
                    {times.map((t, i) => (i % tStep === 0 ? <text key={`t${i}`} className="lt3-cc-time" x={cx(i)} y={CC_H - 10} textAnchor="middle">{t}</text> : null))}
                    {/* legenda OHLC */}
                    <text className="lt3-cc-legend" x={CC_PADX + 2} y={CC_PADTOP + 11}>
                      {s.instrument}{'   '}O {fmtPrice(lastC[0])} H {fmtPrice(lastC[1])} L {fmtPrice(lastC[2])} C <tspan fill={lastUp ? '#16a34a' : '#ef4453'}>{fmtPrice(lastC[3])}</tspan>
                    </text>
                    {/* znak zapytania w strefie ukrytej */}
                    {!revealed && (
                      <text className="lt3-cc-q" x={(splitX + plotR) / 2} y={CC_PADTOP + priceH / 2} textAnchor="middle" dominantBaseline="middle">?</text>
                    )}
                  </svg>
                </div>
                <span className="lt3-test-tag">{s.instrument} · {s.tf}</span>
              </div>

              <div className="lt3-test-body">
                <p className="lt3-test-setup">{s.setup}</p>
                <p className="lt3-test-q">{s.question}</p>
                <div className="lt3-test-opts">
                  {s.options.map((o, oi) => {
                    let cls = 'lt3-opt';
                    if (revealed) {
                      if (oi === correctIdx) cls += ' is-correct';
                      else if (oi === sel) cls += ' is-wrong';
                    }
                    return (
                      <button
                        key={oi}
                        className={cls}
                        disabled={revealed}
                        onClick={() => setPicked((p) => ({ ...p, [si]: oi }))}
                      >
                        {o.t}
                      </button>
                    );
                  })}
                </div>
                {revealed && (
                  <div className="lt3-test-reveal">
                    <p className="lt3-test-verdict">{sel === correctIdx ? 'Dobrze.' : 'Niestety, nie tym razem.'}</p>
                    <p className="lt3-test-outcome">{s.outcomeText}</p>
                    <p className="lt3-test-lesson"><b>Formacja:</b> {s.formation}. {s.lesson}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {allDone && (
        <div className="lt3-score">
          <span className="lt3-score-n">{correct}/{SCENARIOS.length}</span>
          <p className="lt3-score-t">{scoreComment(correct, SCENARIOS.length)}</p>
        </div>
      )}
    </section>
  );
}

const CSS = `
.lt3 {
  --gold: #c9a227;
  --pink: #ff2d78;
  --hair: rgba(255,255,255,0.10);
  --hair-soft: rgba(255,255,255,0.055);
  font-family: var(--font-body);
  color: var(--text);
}
[data-theme="light"] .lt3 { --hair: rgba(0,0,0,0.12); --hair-soft: rgba(0,0,0,0.06); }

/* ===== Rising-lines reveal ===== */
.lt3-rise { overflow: hidden; }
.lt3-rise > span { display: block; }
.lt3--ready .lt3-rise > span {
  transform: translateY(115%);
  transition: transform 1s cubic-bezier(.16,1,.3,1);
}
.lt3--ready .lt3-rise.is-in > span { transform: translateY(0); }

/* Fade-up reveal (akapity, listy) */
.lt3--ready [data-r]:not(.lt3-rise) {
  opacity: 0; transform: translateY(22px);
  transition: opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1);
}
.lt3--ready [data-r]:not(.lt3-rise).is-in { opacity: 1; transform: none; }

/* ===== HERO ===== */
.lt3-hero { position: relative; overflow: hidden; padding: clamp(40px, 9vw, 120px) 24px clamp(34px, 5vw, 56px); }
.lt3-hero-chart {
  position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0;
  pointer-events: none; opacity: 0.18;
}
.lt3-hero-chart path {
  fill: none; stroke: var(--gold); stroke-width: 1.5;
  vector-effect: non-scaling-stroke; stroke-linejoin: round; stroke-linecap: round;
  stroke-dasharray: 1; stroke-dashoffset: 1;
  animation: lt3-drawline 2.4s cubic-bezier(.16,1,.3,1) .3s forwards;
}
.lt3-hero-chart-dot {
  fill: var(--gold); opacity: 0;
  animation: lt3-dotin .5s ease 2.5s forwards;
}
@keyframes lt3-drawline { to { stroke-dashoffset: 0; } }
@keyframes lt3-dotin { to { opacity: 1; } }
.lt3-hero-inner { position: relative; z-index: 1; max-width: 1120px; margin: 0 auto; }
.lt3-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.72rem; letter-spacing: 0.24em; text-transform: uppercase;
  color: var(--muted); margin: 0 0 clamp(18px, 3vw, 30px); font-weight: 600;
}
.lt3-eyebrow-pink span, .lt3-eyebrow-pink { color: var(--pink); }
.lt3-h1 {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: clamp(2.9rem, 9.5vw, 7rem);
  line-height: 0.98; letter-spacing: -0.02em;
  margin: 0; color: var(--text);
}
.lt3-h1 em { font-style: italic; color: var(--gold); }
.lt3-lead {
  font-family: var(--font-serif);
  font-size: clamp(1.1rem, 2.3vw, 1.5rem); line-height: 1.55;
  color: var(--muted); max-width: 660px; margin: clamp(24px, 4vw, 40px) 0 0; font-weight: 400;
}
.lt3-meta {
  display: flex; flex-wrap: wrap; gap: clamp(20px, 4vw, 44px);
  margin-top: clamp(28px, 4vw, 44px);
  font-family: var(--font-mono); font-size: 0.78rem; letter-spacing: 0.05em;
  color: var(--muted); text-transform: uppercase;
}
.lt3-meta b { color: var(--text); font-weight: 700; font-family: var(--font-body); font-size: 0.95rem; }

/* ===== JOURNEY ===== */
.lt3-journey {
  max-width: 1120px; margin: 0 auto; padding: 0 24px;
  display: grid; grid-template-columns: 210px 1fr; gap: clamp(28px, 5vw, 80px);
  align-items: start;
}

/* Sticky index */
.lt3-index { position: sticky; top: 120px; align-self: start; padding-top: 8px; padding-left: 16px; }
.lt3-index-rail { position: absolute; left: 0; top: 14px; bottom: 14px; width: 1px; background: var(--hair); }
.lt3-index-fill { position: absolute; inset: 0; transform-origin: top; background: var(--gold); transition: transform .12s linear; }
.lt3-index-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 16px; }
.lt3-index-item { display: grid; grid-template-columns: auto 1fr; gap: 12px; align-items: baseline; opacity: 0.35; transition: opacity .35s; }
.lt3-index-item.is-active { opacity: 1; }
.lt3-index-no { font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.05em; color: var(--muted); }
.lt3-index-item.is-active .lt3-index-no { color: var(--a); }
.lt3-index-title { font-size: 0.82rem; line-height: 1.3; color: var(--muted); }
.lt3-index-item.is-active .lt3-index-title { color: var(--text); }

/* Steps */
.lt3-steps { min-width: 0; }
.lt3-step {
  display: grid; grid-template-columns: clamp(96px, 11vw, 180px) 1fr;
  gap: clamp(18px, 4vw, 56px);
  padding: clamp(44px, 7vw, 96px) 0;
  border-top: 1px solid var(--hair);
}
.lt3-step:first-child { border-top: none; padding-top: clamp(24px, 4vw, 44px); }
.lt3-step-aside { position: relative; }
.lt3-no {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(3.6rem, 9vw, 8.4rem); line-height: 0.8; font-weight: 400;
  color: transparent;
  -webkit-text-stroke: 1.4px color-mix(in srgb, var(--a) 60%, transparent);
  will-change: transform;
}
.lt3-step-main { min-width: 0; max-width: 680px; }
.lt3-step-eyebrow {
  font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--a); margin: 0 0 14px; font-weight: 600;
}
.lt3-step-title {
  font-family: var(--font-serif); font-weight: 500;
  font-size: clamp(1.7rem, 4vw, 2.9rem); line-height: 1.08; letter-spacing: -0.015em;
  margin: 0 0 10px; color: var(--text);
}
.lt3-step-sum {
  font-family: var(--font-serif); font-style: italic;
  font-size: clamp(1.05rem, 2vw, 1.3rem); color: var(--muted); margin: 0 0 22px; line-height: 1.4;
}
.lt3-step-body {
  font-size: clamp(0.95rem, 1.6vw, 1.05rem); line-height: 1.85; color: var(--text);
  margin: 0; opacity: 0.92; max-width: 62ch;
}
.lt3-points { list-style: none; margin: 26px 0 0; padding: 0; }
.lt3-point {
  display: grid; grid-template-columns: 26px 1fr; align-items: start;
  gap: 4px; padding: 14px 0; border-top: 1px solid var(--hair-soft);
  font-size: clamp(0.9rem, 1.5vw, 1rem); line-height: 1.6; color: var(--muted);
}
.lt3-tick { width: 14px; height: 1px; margin-top: 12px; background: var(--a); }

/* ===== BLOCKS ===== */
.lt3-block { max-width: 1120px; margin: 0 auto; padding: clamp(56px, 9vw, 120px) 24px 0; }
.lt3-block-head { margin-bottom: clamp(30px, 5vw, 52px); }
.lt3-block-title {
  font-family: var(--font-serif); font-weight: 500;
  font-size: clamp(2rem, 5.5vw, 3.4rem); line-height: 1.04; letter-spacing: -0.015em;
  margin: 12px 0 0; color: var(--text);
}
.lt3-block-title em { font-style: italic; color: var(--gold); }
.lt3-pink { color: var(--pink); }

/* Pułapki */
.lt3-traps { list-style: none; margin: 0; padding: 0; }
.lt3-trap {
  display: grid; grid-template-columns: clamp(48px, 7vw, 88px) 1fr; align-items: baseline;
  gap: clamp(12px, 3vw, 32px);
  padding: clamp(20px, 3vw, 30px) 0; border-top: 1px solid var(--hair);
}
.lt3-trap:last-child { border-bottom: 1px solid var(--hair); }
.lt3-trap-no { font-family: var(--font-mono); font-size: 0.8rem; color: var(--pink); letter-spacing: 0.05em; }
.lt3-trap p { margin: 0; font-size: clamp(1rem, 1.9vw, 1.22rem); line-height: 1.5; color: var(--muted); }
.lt3-trap b { color: var(--text); font-weight: 600; }

/* Timeline */
.lt3-phases { display: grid; grid-template-columns: repeat(4, 1fr); gap: clamp(20px, 3vw, 40px); }
.lt3-phase { border-top: 2px solid var(--a); padding-top: 20px; }
.lt3-phase-no {
  font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.1em; color: var(--a); display: block;
}
.lt3-phase-months {
  font-family: var(--font-mono); font-size: 0.68rem; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--muted); display: block; margin-top: 6px;
}
.lt3-phase-label {
  font-family: var(--font-display); font-size: clamp(1.6rem, 4vw, 2.4rem); letter-spacing: 0.02em;
  color: var(--text); font-weight: 400; margin: 8px 0 12px;
}
.lt3-phase-desc { font-size: clamp(0.85rem, 1.5vw, 0.95rem); line-height: 1.6; color: var(--muted); margin: 0; }

/* ===== ZAMKNIĘCIE ===== */
.lt3-close {
  max-width: 880px; margin: clamp(60px, 9vw, 130px) auto 0; padding: clamp(48px, 7vw, 90px) 24px 0;
  border-top: 1px solid var(--hair); text-align: left;
}
.lt3-close-big {
  font-family: var(--font-serif); font-weight: 500;
  font-size: clamp(1.9rem, 5vw, 3.2rem); line-height: 1.1; letter-spacing: -0.02em;
  color: var(--text); margin: 0 0 20px;
}
.lt3-close-text {
  font-size: clamp(1rem, 1.8vw, 1.15rem); line-height: 1.75; color: var(--muted);
  max-width: 62ch; margin: 0 0 22px;
}
.lt3-path { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 2px; margin: 4px 0 30px; }
.lt3-path-item { display: inline-flex; align-items: center; }
.lt3-path-w {
  font-family: var(--font-mono); font-size: clamp(0.82rem, 1.6vw, 1rem); font-weight: 600;
  color: var(--gold); letter-spacing: 0.02em;
}
.lt3-path-sep { color: var(--muted); opacity: 0.5; margin: 0 12px; }
.lt3-cta-row { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 34px; }
.lt3-cta {
  display: inline-flex; align-items: center; padding: 14px 28px; border-radius: 2px;
  font-weight: 700; font-size: 0.95rem; text-decoration: none;
  background: var(--gold); color: #1a1407; transition: opacity .2s, transform .2s;
}
.lt3-cta:hover { transform: translateY(-2px); opacity: 0.92; }
.lt3-cta-ghost { background: transparent; color: var(--text); border: 1px solid var(--hair); }
.lt3-cta-ghost:hover { border-color: var(--gold); }

.lt3-disclaimer {
  font-family: var(--font-mono); font-size: 0.62rem; color: var(--muted);
  max-width: 880px; margin: clamp(48px, 6vw, 70px) auto 0; padding: 0 24px;
  line-height: 1.6; font-weight: 600;
}

/* ===== Byline ===== */
.lt3-byline {
  font-family: var(--font-mono); font-size: 0.75rem; letter-spacing: 0.04em;
  color: var(--muted); margin: clamp(22px, 3vw, 32px) 0 0;
}
.lt3-byline a { color: var(--text); text-decoration: none; border-bottom: 1px solid var(--gold); padding-bottom: 1px; }
.lt3-byline a:hover { color: var(--gold); }

/* ===== Czego potrzebujesz ===== */
.lt3-needs-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: clamp(20px, 3vw, 44px); }
.lt3-need { border-top: 1px solid var(--hair); padding-top: 18px; }
.lt3-need-no { font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.1em; color: var(--gold); }
.lt3-need-k {
  font-family: var(--font-serif); font-weight: 500; font-size: clamp(1.2rem, 2.2vw, 1.55rem);
  margin: 12px 0 12px; color: var(--text); line-height: 1.15;
}
.lt3-need-v { font-size: clamp(0.85rem, 1.5vw, 0.96rem); line-height: 1.6; color: var(--muted); margin: 0; }

/* ===== Reality check ===== */
.lt3-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(24px, 4vw, 56px); }
.lt3-stat { position: relative; padding-top: 22px; display: block; text-decoration: none; }
/* linijka domyślnie widoczna (no-JS / boty); chowa się tylko gdy JS gotowy, wraca przy reveal */
.lt3-stat::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--gold);
  transform-origin: left; transition: transform .8s cubic-bezier(.16,1,.3,1) .05s;
}
.lt3--ready .lt3-stat::before { transform: scaleX(0); }
.lt3--ready .lt3-stat.is-in::before { transform: scaleX(1); }
.lt3-stat-n {
  font-family: var(--font-display); font-size: clamp(3.2rem, 8vw, 6rem); line-height: 0.85;
  color: var(--text); display: block; transition: color .25s;
}
.lt3--ready .lt3-stat-n { clip-path: inset(0 0 110% 0); transition: clip-path 1s cubic-bezier(.16,1,.3,1) .15s; }
.lt3--ready .lt3-stat.is-in .lt3-stat-n { clip-path: inset(0 0 -8% 0); }
.lt3-stat-d {
  font-size: clamp(0.86rem, 1.5vw, 1rem); line-height: 1.5; color: var(--muted);
  display: block; margin-top: 16px; max-width: 32ch;
}
.lt3-stat-link:hover .lt3-stat-n { color: var(--gold); }
.lt3-stat-link:hover .lt3-stat-d { color: var(--text); }

/* ===== FAQ ===== */
.lt3-faq { border-top: 1px solid var(--hair); }
.lt3-faq-item { border-bottom: 1px solid var(--hair); }
.lt3-faq-q {
  list-style: none; cursor: pointer;
  display: flex; justify-content: space-between; align-items: baseline; gap: 24px;
  padding: clamp(20px, 2.6vw, 30px) 0;
  font-family: var(--font-serif); font-weight: 500;
  font-size: clamp(1.1rem, 2vw, 1.45rem); color: var(--text); line-height: 1.25;
}
.lt3-faq-q::-webkit-details-marker { display: none; }
.lt3-faq-plus {
  font-family: var(--font-body); color: var(--gold); font-size: 1.5rem; line-height: 1;
  flex-shrink: 0; transition: transform .3s cubic-bezier(.16,1,.3,1);
}
.lt3-faq-item[open] .lt3-faq-plus { transform: rotate(45deg); }
.lt3-faq-a {
  margin: 0; padding: 0 48px clamp(24px, 2.8vw, 32px) 0;
  font-size: clamp(0.95rem, 1.6vw, 1.06rem); line-height: 1.78; color: var(--muted); max-width: 72ch;
}

/* ===== Sprawdź się ===== */
.lt3-test-intro { font-size: clamp(0.95rem, 1.7vw, 1.08rem); line-height: 1.7; color: var(--muted); max-width: 60ch; margin: 16px 0 0; }
.lt3-tests { display: flex; flex-direction: column; }
.lt3-test { padding: clamp(32px, 4.5vw, 56px) 0; border-top: 1px solid var(--hair); }
.lt3-test-chart { max-width: 780px; margin: 0 0 clamp(20px, 3vw, 30px); }
.lt3-test-body { max-width: 780px; }
.lt3-cc-wrap { border: 1px solid var(--hair); border-radius: 6px; background: rgba(255,255,255,0.02); padding: 6px 8px; }
[data-theme="light"] .lt3-cc-wrap { background: rgba(0,0,0,0.02); }
.lt3-test-chart svg { width: 100%; height: auto; display: block; }
.lt3-cc-grid { stroke: var(--hair-soft); stroke-width: 1; }
.lt3-cc-level { stroke: var(--gold); stroke-width: 1; stroke-dasharray: 4 4; opacity: 0.65; }
.lt3-cc-level-t { fill: var(--gold); font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.05em; text-transform: uppercase; opacity: 0.85; }
.lt3-cc-div { stroke: var(--hair); stroke-width: 1; stroke-dasharray: 2 3; }
.lt3-cc-after { opacity: 0; clip-path: inset(0 100% 0 0); transition: clip-path 1.15s cubic-bezier(.16,1,.3,1), opacity .15s ease; }
.lt3-cc-after.is-rev { opacity: 1; clip-path: inset(0 -3% 0 0); }
.lt3-cc-q { fill: var(--muted); font-family: var(--font-mono); font-size: 26px; font-weight: 600; opacity: 0.45; }
.lt3-cc-axis { fill: var(--muted); font-family: var(--font-mono); font-size: 11px; opacity: 0.7; }
.lt3-cc-now { fill: var(--muted); font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.55; }
.lt3-cc-last { stroke: var(--muted); stroke-width: 1; stroke-dasharray: 2 3; opacity: 0.5; }
.lt3-cc-last-t { fill: #0b0f15; font-family: var(--font-mono); font-size: 11px; font-weight: 700; }
.lt3-cc-time { fill: var(--muted); font-family: var(--font-mono); font-size: 10px; opacity: 0.6; }
.lt3-cc-legend { fill: var(--muted); font-family: var(--font-mono); font-size: 11px; opacity: 0.85; }
.lt3-score { margin-top: clamp(28px, 4vw, 44px); padding-top: clamp(22px, 3vw, 30px); border-top: 1px solid var(--hair); display: flex; align-items: baseline; gap: clamp(16px, 3vw, 28px); flex-wrap: wrap; }
.lt3-score-n { font-family: var(--font-display); font-size: clamp(2.4rem, 6vw, 3.8rem); color: var(--gold); line-height: 1; }
.lt3-score-t { font-family: var(--font-serif); font-size: clamp(1.1rem, 2.2vw, 1.45rem); color: var(--text); margin: 0; }
.lt3-test-tag { font-family: var(--font-mono); font-size: 0.66rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-top: 12px; display: block; }
.lt3-test-setup { font-size: clamp(0.95rem, 1.7vw, 1.08rem); line-height: 1.7; color: var(--text); margin: 0 0 18px; max-width: 60ch; }
.lt3-test-q { font-family: var(--font-serif); font-style: italic; font-size: clamp(1.05rem, 1.9vw, 1.25rem); color: var(--muted); margin: 0 0 16px; }
.lt3-test-opts { display: flex; flex-direction: column; gap: 10px; max-width: 560px; }
.lt3-opt {
  text-align: left; background: transparent; border: 1px solid var(--hair); color: var(--text);
  padding: 14px 18px; border-radius: 2px; cursor: pointer; font-size: clamp(0.9rem, 1.5vw, 0.98rem);
  font-family: var(--font-body); transition: border-color .2s, background .2s, transform .15s; line-height: 1.4;
}
.lt3-opt:hover:not(:disabled) { border-color: var(--gold); transform: translateX(3px); }
.lt3-opt:disabled { cursor: default; }
.lt3-opt.is-correct { border-color: #16a34a; color: var(--text); background: rgba(22,163,74,0.12); }
.lt3-opt.is-wrong { border-color: var(--pink); color: var(--muted); opacity: 0.65; }
.lt3-test-reveal { margin-top: 20px; border-left: 2px solid var(--gold); padding-left: 18px; max-width: 60ch; }
.lt3-test-verdict { font-family: var(--font-serif); font-weight: 500; font-size: clamp(1.1rem, 2vw, 1.3rem); color: var(--text); margin: 0 0 10px; }
.lt3-test-outcome { font-size: clamp(0.92rem, 1.6vw, 1rem); line-height: 1.7; color: var(--muted); margin: 0 0 12px; }
.lt3-test-lesson { font-size: clamp(0.9rem, 1.5vw, 0.96rem); line-height: 1.6; color: var(--text); margin: 0; }
.lt3-test-lesson b { color: var(--gold); }

/* ===== Mit kontra rzeczywistość ===== */
.lt3-myths { border-top: 1px solid var(--hair); }
.lt3-myth {
  display: grid; grid-template-columns: 1fr 1fr; gap: clamp(18px, 4vw, 64px);
  padding: clamp(22px, 3vw, 36px) 0; border-bottom: 1px solid var(--hair);
}
.lt3-myth-tag {
  font-family: var(--font-mono); font-size: 0.64rem; letter-spacing: 0.2em; text-transform: uppercase;
  display: block; margin-bottom: 10px; font-weight: 600;
}
.lt3-myth-tag.is-myth { color: var(--pink); }
.lt3-myth-tag.is-fact { color: var(--gold); }
.lt3-myth-text { margin: 0; font-size: clamp(0.95rem, 1.7vw, 1.12rem); line-height: 1.5; }
.lt3-myth-myth { color: var(--muted); }
.lt3-myth-fact { color: var(--text); }

/* ===== Słownik w pigułce ===== */
.lt3-gloss { display: grid; grid-template-columns: 1fr 1fr; gap: 0 clamp(24px, 5vw, 64px); }
.lt3-gloss-item { display: grid; grid-template-columns: minmax(120px, 0.42fr) 1fr; gap: 16px; align-items: baseline; padding: 16px 0; border-top: 1px solid var(--hair-soft); }
.lt3-gloss-t { font-family: var(--font-mono); font-size: 0.82rem; letter-spacing: 0.02em; color: var(--gold); font-weight: 600; }
.lt3-gloss-d { font-size: clamp(0.86rem, 1.5vw, 0.96rem); line-height: 1.55; color: var(--muted); }
.lt3-gloss-more { display: inline-block; margin-top: clamp(22px, 3vw, 32px); font-family: var(--font-mono); font-size: 0.8rem; letter-spacing: 0.04em; color: var(--text); text-decoration: none; border-bottom: 1px solid var(--gold); padding-bottom: 2px; transition: color .2s; }
.lt3-gloss-more:hover { color: var(--gold); }

/* ===== Czytaj dalej ===== */
.lt3-reads { border-top: 1px solid var(--hair); }
.lt3-read {
  display: grid; grid-template-columns: 1fr auto; align-items: baseline; gap: 6px 24px;
  padding: clamp(18px, 2.4vw, 28px) 0; border-bottom: 1px solid var(--hair);
  text-decoration: none; transition: padding-left .25s cubic-bezier(.16,1,.3,1);
}
.lt3-read:hover { padding-left: 12px; }
.lt3-read-t { grid-column: 1; font-family: var(--font-serif); font-weight: 500; font-size: clamp(1.1rem, 2vw, 1.45rem); color: var(--text); line-height: 1.2; }
.lt3-read-s { grid-column: 1; font-size: 0.85rem; color: var(--muted); }
.lt3-read-arrow { grid-column: 2; grid-row: 1 / span 2; align-self: center; color: var(--gold); font-size: 1.3rem; transition: transform .25s; }
.lt3-read:hover .lt3-read-arrow { transform: translateX(7px); }

/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .lt3-journey { grid-template-columns: 1fr; gap: 0; }
  .lt3-index { display: none; }
}
@media (max-width: 760px) {
  .lt3-step { grid-template-columns: 1fr; gap: 6px; }
  .lt3-step-aside { margin-bottom: 4px; }
  .lt3-no { font-size: clamp(3rem, 16vw, 5rem); }
  .lt3-phases { grid-template-columns: 1fr 1fr; gap: 32px 22px; }
  .lt3-needs-grid { grid-template-columns: 1fr 1fr; gap: 26px 20px; }
  .lt3-stats { grid-template-columns: 1fr; gap: 28px; }
  .lt3-myth { grid-template-columns: 1fr; gap: 14px; }
  .lt3-myth-col + .lt3-myth-col { border-top: 1px solid var(--hair-soft); padding-top: 14px; }
  .lt3-test-chart { max-width: 100%; }
  .lt3-gloss { grid-template-columns: 1fr; gap: 0; }
}
@media (max-width: 460px) {
  .lt3-phases { grid-template-columns: 1fr; }
  .lt3-needs-grid { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .lt3-no { transform: none !important; }
  .lt3-hero-chart path { animation: none; stroke-dashoffset: 0; }
  .lt3-hero-chart-dot { animation: none; opacity: 1; }
  .lt3--ready .lt3-stat-n { clip-path: none; }
  .lt3--ready .lt3-stat::before { transform: scaleX(1); }
  .lt3-cc-after { transition: none; }
  .lt3-cc-after.is-rev { clip-path: inset(0 -3% 0 0); opacity: 1; }
}
`;
