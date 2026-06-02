/**
 * Indeks Strachu i Chciwości — warstwa danych.
 *
 * Krypto: gotowy, realny indeks z alternative.me (0-100).
 * Indeksy giełdowe (WIG20, NASDAQ-100): liczymy własny indeks 0-100 z historii
 *   dziennej (Yahoo Finance) na podstawie czterech podskładowych:
 *     - RSI(14)                         (wykupienie/wyprzedanie)
 *     - momentum względem średniej 125d (trend)
 *     - pozycja w zakresie 52 tygodni   (jak blisko szczytu/dna)
 *     - zwrot z ostatniego miesiąca     (świeży pęd)
 *   Średnia z podskładowych daje wynik 0-100.
 *
 * Wszystko cache'owane przez ISR (revalidate 1h). Przy błędzie źródła zwracamy
 * ok:false, żeby strona nie padała — pojedynczy gauge pokaże "brak danych".
 */

export interface FGResult {
  value: number;     // 0-100
  label: string;     // polska klasyfikacja
  updatedISO: string;
  ok: boolean;
}

export function fgLabel(v: number): string {
  if (v < 25) return 'Skrajny strach';
  if (v < 45) return 'Strach';
  if (v <= 55) return 'Neutralnie';
  if (v <= 74) return 'Chciwość';
  return 'Skrajna chciwość';
}

const clamp = (v: number) => Math.max(0, Math.min(100, v));

function rsi(closes: number[], period = 14): number {
  if (closes.length < period + 1) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const ch = closes[i] - closes[i - 1];
    if (ch >= 0) gains += ch;
    else losses -= ch;
  }
  const avgG = gains / period;
  const avgL = losses / period;
  if (avgL === 0) return 100;
  const rs = avgG / avgL;
  return 100 - 100 / (1 + rs);
}

// ── Wskaźnik liczony z historii dziennej (Yahoo Finance) ────────────────────
// Działa dla każdego symbolu z historią: BTC-USD, EPOL, ^NDX itd.
export async function getIndexFG(symbol: string): Promise<FGResult> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1y&interval=1d`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; KisielFinanse/1.0)' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error('http');
    const json = await res.json();
    const r = json?.chart?.result?.[0];
    const closes: number[] = (r?.indicators?.quote?.[0]?.close ?? []).filter(
      (x: number | null) => typeof x === 'number' && !Number.isNaN(x),
    );
    if (closes.length < 60) throw new Error('insufficient');

    const last = closes[closes.length - 1];

    // 1. RSI
    const rsiScore = rsi(closes);

    // 2. Momentum vs średnia 125-dniowa
    const maWin = closes.slice(-125);
    const ma = maWin.reduce((a, b) => a + b, 0) / maWin.length;
    const momScore = clamp(50 + (last / ma - 1) * 300);

    // 3. Pozycja w zakresie 52 tygodni
    const yr = closes.slice(-252);
    const min = Math.min(...yr);
    const max = Math.max(...yr);
    const rangeScore = max > min ? ((last - min) / (max - min)) * 100 : 50;

    // 4. Zwrot z ostatniego miesiąca (~21 sesji)
    const ago = closes[Math.max(0, closes.length - 22)];
    const monthScore = clamp(50 + (last / ago - 1) * 300);

    const value = clamp(Math.round((rsiScore + momScore + rangeScore + monthScore) / 4));
    const ts = r?.meta?.regularMarketTime ? r.meta.regularMarketTime * 1000 : Date.now();

    return { value, label: fgLabel(value), updatedISO: new Date(ts).toISOString(), ok: true };
  } catch {
    return { value: 50, label: 'Brak danych', updatedISO: '', ok: false };
  }
}

// ── Konfiguracja rynków pokazywanych na stronie ─────────────────────────────
export const FG_MARKETS = [
  { key: 'krypto', title: 'Krypto', subtitle: 'Bitcoin i rynek kryptowalut', symbol: 'BTC-USD', accent: '#f7931a' },
  { key: 'polska', title: 'Polska giełda', subtitle: 'polskie akcje (MSCI Poland)', symbol: 'EPOL', accent: '#ff2d78' },
  { key: 'nasdaq', title: 'USA', subtitle: 'NASDAQ-100 - technologia', symbol: '^NDX', accent: '#5b9bd5' },
] as const;
