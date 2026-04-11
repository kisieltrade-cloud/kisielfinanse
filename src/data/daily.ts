// ─────────────────────────────────────────────────────────────────
// DAILY_DATA — aktualizuj codziennie używając xtb-importer.html
// Dodawaj nowe wpisy NA GÓRĘ tablicy (najnowszy dzień pierwszy)
// ─────────────────────────────────────────────────────────────────

export interface DayResult {
  date: string;
  dateDisplay: string;
  pnl: number;
  pnlFormatted: string;
  returnPct: string;
  trades: number;
  winners: number;
  winRate: string;
  symbols: string;
  positive: boolean;
}

export const DAILY_DATA: DayResult[] = [
  {
    date: '2026-03-27',
    dateDisplay: '27.03.2026',
    pnl: +2602.78,
    pnlFormatted: '+2602.78 zł',
    returnPct: '+3.00%',
    trades: 15,
    winners: 15,
    winRate: '100%',
    symbols: 'US100',
    positive: true,
  },
  {
    date: '2026-03-26',
    dateDisplay: '26.03.2026',
    pnl: +4841.07,
    pnlFormatted: '+4841.07 zł',
    returnPct: '+5.91%',
    trades: 119,
    winners: 119,
    winRate: '100%',
    symbols: 'US100',
    positive: true,
  },
  {
    date: '2026-03-25',
    dateDisplay: '25.03.2026',
    pnl: +5825.23,
    pnlFormatted: '+5825.23 zł',
    returnPct: '+7.65%',
    trades: 130,
    winners: 130,
    winRate: '100%',
    symbols: 'US100',
    positive: true,
  },
  {
    date: '2026-03-24',
    dateDisplay: '24.03.2026',
    pnl: +8855.70,
    pnlFormatted: '+8855.70 zł',
    returnPct: '+13.17%',
    trades: 183,
    winners: 155,
    winRate: '85%',
    symbols: 'US100',
    positive: true,
  },
  {
    date: '2026-03-23',
    dateDisplay: '23.03.2026',
    pnl: +12718.79,
    pnlFormatted: '+12718.79 zł',
    returnPct: '+23.32%',
    trades: 204,
    winners: 165,
    winRate: '81%',
    symbols: 'US100',
    positive: true,
  },
  {
    date: '2026-03-20',
    dateDisplay: '20.03.2026',
    pnl: +2729.96,
    pnlFormatted: '+2729.96 zł',
    returnPct: '+5.27%',
    trades: 119,
    winners: 118,
    winRate: '99%',
    symbols: 'US100',
    positive: true,
  },
  {
    date: '2026-03-19',
    dateDisplay: '19.03.2026',
    pnl: +8104.60,
    pnlFormatted: '+8104.60 zł',
    returnPct: '+18.54%',
    trades: 387,
    winners: 337,
    winRate: '87%',
    symbols: 'US100',
    positive: true,
  },
  {
    date: '2026-03-18',
    dateDisplay: '18.03.2026',
    pnl: +2952.72,
    pnlFormatted: '+2952.72 zł',
    returnPct: '+7.25%',
    trades: 248,
    winners: 190,
    winRate: '77%',
    symbols: 'US100, DE40',
    positive: true,
  },
  {
    date: '2026-03-17',
    dateDisplay: '17.03.2026',
    pnl: +1877.31,
    pnlFormatted: '+1877.31 zł',
    returnPct: '+4.83%',
    trades: 50,
    winners: 50,
    winRate: '100%',
    symbols: 'US100',
    positive: true,
  },
  {
    date: '2026-03-16',
    dateDisplay: '16.03.2026',
    pnl: +4381.79,
    pnlFormatted: '+4381.79 zł',
    returnPct: '+12.70%',
    trades: 183,
    winners: 165,
    winRate: '90%',
    symbols: 'US100',
    positive: true,
  },
  {
    date: '2026-03-15',
    dateDisplay: '15.03.2026',
    pnl: +852.14,
    pnlFormatted: '+852.14 zł',
    returnPct: '+2.53%',
    trades: 32,
    winners: 32,
    winRate: '100%',
    symbols: 'US100',
    positive: true,
  },
  {
    date: '2026-03-13',
    dateDisplay: '13.03.2026',
    pnl: +1726.57,
    pnlFormatted: '+1726.57 zł',
    returnPct: '+5.41%',
    trades: 61,
    winners: 57,
    winRate: '93%',
    symbols: 'US100',
    positive: true,
  },
  {
    date: '2026-03-12',
    dateDisplay: '12.03.2026',
    pnl: +1859.34,
    pnlFormatted: '+1859.34 zł',
    returnPct: '+6.19%',
    trades: 122,
    winners: 122,
    winRate: '100%',
    symbols: 'US100',
    positive: true,
  },
  {
    date: '2026-03-11',
    dateDisplay: '11.03.2026',
    pnl: +2564.39,
    pnlFormatted: '+2564.39 zł',
    returnPct: '+9.33%',
    trades: 84,
    winners: 84,
    winRate: '100%',
    symbols: 'US100',
    positive: true,
  },
  {
    date: '2026-03-10',
    dateDisplay: '10.03.2026',
    pnl: +863.78,
    pnlFormatted: '+863.78 zł',
    returnPct: '+3.24%',
    trades: 30,
    winners: 30,
    winRate: '100%',
    symbols: 'US100',
    positive: true,
  },
  {
    date: '2026-03-09',
    dateDisplay: '09.03.2026',
    pnl: +1627.21,
    pnlFormatted: '+1627.21 zł',
    returnPct: '+6.51%',
    trades: 26,
    winners: 26,
    winRate: '100%',
    symbols: 'US100, US500',
    positive: true,
  },
];

export function getTodayResult(): DayResult | null {
  const today = new Date().toISOString().split('T')[0];
  return DAILY_DATA.find(d => d.date === today) ?? null;
}

export function getLastResult(): DayResult | null {
  return DAILY_DATA.length > 0 ? DAILY_DATA[0] : null;
}
