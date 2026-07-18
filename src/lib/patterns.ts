export type Candle = [number, number, number, number];
export type Bias = 'byczy' | 'niedzwiedzi' | 'neutralny';
export type Kind = 'odwrocenie' | 'kontynuacja' | 'niepewnosc';
export type Group = 'swiecowe' | 'wykresu';

export type Pattern = {
  name: string;
  en: string;
  group: Group;
  bias: Bias;
  kind: Kind;
  strength: 1 | 2 | 3;
  desc: string;
  play: string;
  candles?: Candle[];
  line?: number[];
  neck?: number;
};

export const PATTERNS: Pattern[] = [
  // ── Świecowe ──
  {
    name: 'Młot', en: 'Hammer', group: 'swiecowe', bias: 'byczy', kind: 'odwrocenie', strength: 2,
    desc: 'Mały korpus u góry i długi dolny knot po spadkach. Sprzedający próbowali zejść niżej, ale zostali odparci.',
    play: 'Sygnał możliwego odwrócenia w górę. Wchodzisz po potwierdzeniu, ze stopem pod dołkiem knota.',
    candles: [[112, 113, 110, 110.5], [110.5, 111, 108, 108.5], [108.5, 109, 106, 106.6], [106.6, 107, 103.4, 106.8]],
  },
  {
    name: 'Spadająca gwiazda', en: 'Shooting star', group: 'swiecowe', bias: 'niedzwiedzi', kind: 'odwrocenie', strength: 2,
    desc: 'Mały korpus na dole i długi górny knot po wzrostach. Kupujący sięgnęli wyżej, ale zostali odrzuceni.',
    play: 'Zapowiada możliwy zwrot w dół. Stop nad szczytem knota, cel w stronę najbliższego wsparcia.',
    candles: [[100, 101, 99.5, 100.8], [100.8, 102, 100.4, 101.6], [101.6, 103, 101.2, 102.6], [102.6, 105.2, 102.4, 102.8]],
  },
  {
    name: 'Doji', en: 'Doji', group: 'swiecowe', bias: 'neutralny', kind: 'niepewnosc', strength: 1,
    desc: 'Otwarcie i zamknięcie niemal równe, korpus prawie zanika. Obraz równowagi i niezdecydowania.',
    play: 'Sam w sobie nie jest sygnałem wejścia. Po długim ruchu ostrzega, że dotychczasowa strona traci impet.',
    candles: [[100, 101, 99.6, 100.7], [100.7, 102, 100.4, 101.6], [101.6, 102.7, 100.6, 101.62]],
  },
  {
    name: 'Objęcie hossy', en: 'Bullish engulfing', group: 'swiecowe', bias: 'byczy', kind: 'odwrocenie', strength: 3,
    desc: 'Duża zielona świeca w całości obejmuje korpus poprzedniej czerwonej, po spadkach.',
    play: 'Jeden z mocniejszych sygnałów odwrócenia w górę. Wejście po zamknięciu świecy, stop pod dołkiem.',
    candles: [[104, 104.3, 102.2, 102.4], [102.4, 102.6, 100.8, 101.0], [101.0, 101.2, 100.4, 100.5], [100.4, 103.3, 100.2, 103.0]],
  },
  {
    name: 'Objęcie bessy', en: 'Bearish engulfing', group: 'swiecowe', bias: 'niedzwiedzi', kind: 'odwrocenie', strength: 3,
    desc: 'Duża czerwona świeca pochłania poprzednią zieloną, po serii wzrostów.',
    play: 'Mocny sygnał zwrotu w dół. Stop nad szczytem formacji, cel w stronę wsparcia.',
    candles: [[100, 101, 99.7, 100.9], [100.9, 102, 100.6, 101.8], [101.55, 102.0, 101.45, 101.85], [101.9, 102.0, 100.1, 100.3]],
  },
  {
    name: 'Gwiazda poranna', en: 'Morning star', group: 'swiecowe', bias: 'byczy', kind: 'odwrocenie', strength: 3,
    desc: 'Trzy świece na dnie: długa czerwona, mała świeca niezdecydowania, długa zielona.',
    play: 'Przewaga przechodzi od sprzedających do kupujących. Silny sygnał odwrócenia po spadkach.',
    candles: [[104, 104.3, 102.6, 102.8], [102.4, 102.7, 101.9, 102.1], [102.3, 104.6, 102.1, 104.3]],
  },
  {
    name: 'Gwiazda wieczorna', en: 'Evening star', group: 'swiecowe', bias: 'niedzwiedzi', kind: 'odwrocenie', strength: 3,
    desc: 'Trzy świece na szczycie: długa zielona, mała świeca, długa czerwona. Odbicie gwiazdy porannej.',
    play: 'Zapowiada spadki po wzrostach. Wejście short po potwierdzeniu, stop nad szczytem.',
    candles: [[100, 101.6, 99.9, 101.5], [101.9, 102.3, 101.7, 102.0], [101.7, 101.9, 99.7, 99.9]],
  },
  {
    name: 'Harami', en: 'Harami', group: 'swiecowe', bias: 'neutralny', kind: 'odwrocenie', strength: 1,
    desc: 'Mała świeca zamknięta wewnątrz korpusu poprzedniej, dużej. Nagłe wyhamowanie ruchu.',
    play: 'Wczesne ostrzeżenie przed zwrotem. Wymaga potwierdzenia kolejną świecą lub reakcją na poziomie.',
    candles: [[105, 105.2, 101.4, 101.7], [102.4, 103.0, 102.1, 102.7]],
  },
  {
    name: 'Marubozu', en: 'Marubozu', group: 'swiecowe', bias: 'byczy', kind: 'kontynuacja', strength: 2,
    desc: 'Świeca bez knotów, sam korpus. Pełna dominacja jednej strony od otwarcia do zamknięcia.',
    play: 'Potwierdza siłę ruchu. Zielona marubozu wspiera kontynuację wzrostów, czerwona spadków.',
    candles: [[98, 98.6, 97.6, 98.2], [98.2, 101.5, 98.15, 101.45], [101.45, 102.2, 101.3, 102.0]],
  },
  // ── Wykresu ──
  {
    name: 'Głowa z ramionami', en: 'Head and shoulders', group: 'wykresu', bias: 'niedzwiedzi', kind: 'odwrocenie', strength: 3,
    desc: 'Trzy szczyty: środkowy najwyższy (głowa), dwa boczne niżej (ramiona). Klasyczne odwrócenie szczytu.',
    play: 'Sygnał aktywuje przełamanie linii szyi. Zasięg w przybliżeniu równy odległości głowy od tej linii.',
    line: [2.6, 5.4, 3.8, 7.6, 3.9, 5.5, 2.4], neck: 4.0,
  },
  {
    name: 'Odwrócona głowa z ramionami', en: 'Inverse H&S', group: 'wykresu', bias: 'byczy', kind: 'odwrocenie', strength: 3,
    desc: 'Lustrzane odbicie głowy z ramionami na dnie. Środkowy dołek najgłębszy.',
    play: 'Wybicie ponad linię szyi zapowiada wzrosty. Jedno z pewniejszych odwróceń po spadkach.',
    line: [7.4, 4.6, 6.2, 2.4, 6.1, 4.5, 7.6], neck: 6.0,
  },
  {
    name: 'Podwójny szczyt', en: 'Double top', group: 'wykresu', bias: 'niedzwiedzi', kind: 'odwrocenie', strength: 2,
    desc: 'Dwa szczyty na podobnym poziomie z dołkiem między nimi. Rynek dwa razy nie dał rady wyżej.',
    play: 'Aktywacja po przełamaniu linii szyi (dołka między szczytami). Zasięg równy wysokości formacji.',
    line: [2.8, 7.2, 4.6, 7.1, 2.6], neck: 4.6,
  },
  {
    name: 'Podwójne dno', en: 'Double bottom', group: 'wykresu', bias: 'byczy', kind: 'odwrocenie', strength: 2,
    desc: 'Dwa dołki na podobnym poziomie. Rynek dwa razy obronił wsparcie.',
    play: 'Wybicie ponad opór między dołkami potwierdza odwrócenie trendu spadkowego.',
    line: [7.2, 2.8, 5.4, 2.9, 7.5], neck: 5.4,
  },
  {
    name: 'Trójkąt symetryczny', en: 'Symmetrical triangle', group: 'wykresu', bias: 'neutralny', kind: 'kontynuacja', strength: 2,
    desc: 'Coraz niższe szczyty i coraz wyższe dołki. Zmienność się zawęża, energia się kumuluje.',
    play: 'Grasz wybicie w kierunku dominującego trendu, po potwierdzeniu zamknięciem poza trójkątem.',
    line: [2, 8, 3.4, 6.8, 4.4, 5.8, 4.9, 5.3],
  },
  {
    name: 'Flaga byka', en: 'Bull flag', group: 'wykresu', bias: 'byczy', kind: 'kontynuacja', strength: 2,
    desc: 'Dynamiczny wzrost (maszt), potem wąska, lekko opadająca konsolidacja. Pauza przed dalszym ruchem.',
    play: 'Wybicie górą z flagi potwierdza kontynuację. Zasięg często zbliżony do długości masztu.',
    line: [1.2, 2.2, 8.0, 7.2, 7.7, 6.9, 7.5, 9.6],
  },
  {
    name: 'Flaga niedźwiedzia', en: 'Bear flag', group: 'wykresu', bias: 'niedzwiedzi', kind: 'kontynuacja', strength: 2,
    desc: 'Gwałtowny spadek, potem wąska, lekko rosnąca konsolidacja. Odpoczynek przed dalszymi spadkami.',
    play: 'Wybicie dołem z flagi potwierdza kontynuację spadków. Stop nad górną krawędzią flagi.',
    line: [8.8, 7.8, 2.0, 2.9, 2.4, 3.1, 2.6, 0.6],
  },
];

export const BIAS_LABEL: Record<Bias, string> = {
  byczy: 'Byczy',
  niedzwiedzi: 'Niedźwiedzi',
  neutralny: 'Neutralny',
};

export const KIND_LABEL: Record<Kind, string> = {
  odwrocenie: 'Odwrócenie',
  kontynuacja: 'Kontynuacja',
  niepewnosc: 'Niepewność',
};
