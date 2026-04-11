// ─────────────────────────────────────────────────────────────────
// WEEKLY_DATA — aktualizuj co tydzień (co piątek/poniedziałek)
// Dodawaj nowe wpisy NA GÓRĘ tablicy (najnowszy tydzień pierwszy)
// ─────────────────────────────────────────────────────────────────

export interface WeekResult {
  week: string;
  dates: string;
  result: string;
  pnl: string;
  trades: number;
  winRate: string;
  markets: string[];
  comment: string;
  positive: boolean;
}

export const WEEKLY_DATA: WeekResult[] = [
  {
    week: 'Tydzień 05',
    dates: '05.04 – 07.04.2026',
    result: '+3.97%',
    pnl: '+5 082 zł',
    trades: 56,
    winRate: '100%',
    markets: ['Indeksy'],
    comment: 'Tydzień skrócony — dane do wtorku 07.04. Silny ruch na US100, 100% win rate. Tydzień nadal w toku.',
    positive: true,
  },
  {
    week: 'Tydzień 04',
    dates: '30.03 – 03.04.2026',
    result: '+11.82%',
    pnl: '+13 522 zł',
    trades: 109,
    winRate: '100%',
    markets: ['Indeksy'],
    comment: 'Środa 02.04 najsilniejsza sesja tygodnia — ponad 8 600 zł przy 100% win rate. Dodatkowy instrument US30 i OIL.WTI. Każda sesja tygodnia zamknięta na plusie.',
    positive: true,
  },
  {
    week: 'Tydzień 03',
    dates: '23.03 – 27.03.2026',
    result: '+43.81%',
    pnl: '+34 844 zł',
    trades: 651,
    winRate: '90%',
    markets: ['Indeksy'],
    comment: 'Najlepszy tydzień miesiąca. Poniedziałek 23.03 przyniósł ponad 12 700 zł w jednym dniu. Każda sesja zamknięta na plusie.',
    positive: true,
  },
  {
    week: 'Tydzień 02',
    dates: '15.03 – 20.03.2026',
    result: '+35.64%',
    pnl: '+20 899 zł',
    trades: 1019,
    winRate: '88%',
    markets: ['Indeksy'],
    comment: 'Środa 18.03 z DE40 jako dodatkowym instrumentem. Czwartek 19.03 rekordowy dzień tygodnia — ponad 8 100 zł. Dobra płynność przez cały tydzień.',
    positive: true,
  },
  {
    week: 'Tydzień 01',
    dates: '09.03 – 13.03.2026',
    result: '+17.28%',
    pnl: '+8 641 zł',
    trades: 323,
    winRate: '99%',
    markets: ['Indeksy'],
    comment: "Pierwszy tydzień challenge'u. Start 09.03 z wynikiem 100% win rate. Środa 11.03 i czwartek 12.03 najsilniejsze sesje tygodnia.",
    positive: true,
  },
];
