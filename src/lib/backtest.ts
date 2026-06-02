/**
 * Dane do symulatora "Podróż w czasie" — miesięczna historia cen z Yahoo Finance.
 * Pobieramy od 2010-01-01 (lub od startu aktywa) z interwałem miesięcznym.
 * Cache ISR 24h (dane historyczne praktycznie się nie zmieniają).
 */

export interface PricePoint {
  t: number; // unix seconds (początek miesiąca)
  c: number; // cena zamknięcia
}

export interface BacktestAsset {
  key: string;
  label: string;
  sub: string;
  symbol: string;
  accent: string;
}

export const BACKTEST_ASSETS: BacktestAsset[] = [
  { key: 'sp500',  label: 'S&P 500',       sub: '500 spółek USA',     symbol: '^GSPC',  accent: '#3b82f6' },
  { key: 'nasdaq', label: 'NASDAQ-100',    sub: 'technologia USA',    symbol: '^NDX',   accent: '#8b5cf6' },
  { key: 'world',  label: 'Świat',         sub: 'MSCI World',         symbol: 'URTH',   accent: '#22c55e' },
  { key: 'btc',    label: 'Bitcoin',       sub: 'kryptowaluta',       symbol: 'BTC-USD', accent: '#f7931a' },
  { key: 'gold',   label: 'Złoto',         sub: 'metal szlachetny',   symbol: 'GLD',    accent: '#c9a227' },
  { key: 'poland', label: 'Polskie akcje', sub: 'MSCI Poland',        symbol: 'EPOL',   accent: '#ff2d78' },
];

export function getAsset(key: string): BacktestAsset | undefined {
  return BACKTEST_ASSETS.find((a) => a.key === key);
}

export async function getMonthlyPrices(symbol: string): Promise<PricePoint[]> {
  const period1 = 1262304000; // 2010-01-01
  const period2 = Math.floor(Date.now() / 1000);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?period1=${period1}&period2=${period2}&interval=1mo`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; KisielFinanse/1.0)' },
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error('yahoo http ' + res.status);
  const json = await res.json();
  const r = json?.chart?.result?.[0];
  const ts: number[] = r?.timestamp ?? [];
  const closes: (number | null)[] = r?.indicators?.quote?.[0]?.close ?? [];
  const out: PricePoint[] = [];
  for (let i = 0; i < ts.length; i++) {
    const c = closes[i];
    if (typeof c === 'number' && !Number.isNaN(c)) out.push({ t: ts[i], c });
  }
  return out;
}
