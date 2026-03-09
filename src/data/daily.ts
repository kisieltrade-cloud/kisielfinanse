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
    date: '2026-03-09',
    dateDisplay: '09.03.2026',
    pnl: +1041.30,
    pnlFormatted: '+1041.30 zł',
    returnPct: '+4.17%',
    trades: 16,
    winners: 16,
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
