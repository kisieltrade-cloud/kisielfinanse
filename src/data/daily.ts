// ─────────────────────────────────────────────────────────────────
// DAILY_DATA — aktualizuj codziennie używając xtb-importer.html
// Dodawaj nowe wpisy NA GÓRĘ tablicy (najnowszy dzień pierwszy)
// ─────────────────────────────────────────────────────────────────

export interface DayResult {
  date: string;          // 'YYYY-MM-DD'
  dateDisplay: string;   // 'DD.MM.YYYY'
  pnl: number;           // liczba, np. 758.21
  pnlFormatted: string;  // '+758.21 zł'
  returnPct: string;     // '+3.03%'
  trades: number;
  winners: number;
  winRate: string;       // '100%'
  symbols: string;       // 'US100, US500'
  positive: boolean;
}

export const DAILY_DATA: DayResult[] = [
  // → wklej tutaj kod z xtb-importera (sekcja "DANE DZIENNE")
  {
    date: '2026-03-09',
    dateDisplay: '09.03.2026',
    pnl: +758.21,
    pnlFormatted: '+758.21 zł',
    returnPct: '+3.03%',
    trades: 11,
    winners: 11,
    winRate: '100%',
    symbols: 'US100, US500',
    positive: true,
  },
];

// Helper — zwraca dzisiejsze dane (lub null jeśli nie handlowano)
export function getTodayResult(): DayResult | null {
  const today = new Date().toISOString().split('T')[0];
  return DAILY_DATA.find(d => d.date === today) ?? null;
}

// Helper — zwraca ostatni dzień tradingowy
export function getLastResult(): DayResult | null {
  return DAILY_DATA.length > 0 ? DAILY_DATA[0] : null;
}
