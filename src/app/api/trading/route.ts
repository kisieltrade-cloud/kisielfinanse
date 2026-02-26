import { NextResponse } from 'next/server';

export const revalidate = 30;

const CRYPTO_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];

const INDEX_SYMBOLS = [
  { yahoo: 'NQ=F',  label: 'NAS100' },
  { yahoo: 'ES=F',  label: 'S&P500' },
  { yahoo: 'GC=F',  label: 'GOLD' },
  { yahoo: 'CL=F',  label: 'OIL' },
];

async function fetchIndices() {
  const symbols = INDEX_SYMBOLS.map(s => s.yahoo).join(',');
  const url = `https://query1.finance.yahoo.com/v8/finance/quote?symbols=${symbols}`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    const data = await res.json();
    const results = data?.quoteResponse?.result ?? [];
    if (!results.length) return null;

    return results.map((q: { regularMarketPrice?: number; regularMarketChangePercent?: number }, i: number) => {
      const price = q.regularMarketPrice ?? 0;
      const pct = q.regularMarketChangePercent ?? 0;
      const label = INDEX_SYMBOLS[i]?.label ?? 'INDEX';
      return {
        symbol: label,
        price: price > 0
          ? price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : '—',
        change: Math.round(pct * 100) / 100,
        positive: pct >= 0,
      };
    });
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const [cryptoRes, forexRes] = await Promise.allSettled([
      fetch(
        `https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(CRYPTO_SYMBOLS)}`,
        { next: { revalidate: 30 } }
      ),
      fetch('https://open.er-api.com/v6/latest/USD', { next: { revalidate: 3600 } }),
    ]);

    let crypto: object[] = [];
    if (cryptoRes.status === 'fulfilled' && cryptoRes.value.ok) {
      const cryptoData = await cryptoRes.value.json();
      crypto = cryptoData.map((t: { symbol: string; lastPrice: string; priceChangePercent: string }) => {
        const pct = parseFloat(t.priceChangePercent);
        const price = parseFloat(t.lastPrice);
        const sym = t.symbol.replace('USDT', '');
        return {
          symbol: `${sym}/USDT`,
          price: price > 1000
            ? price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : price.toFixed(3),
          change: Math.round(pct * 100) / 100,
          positive: pct >= 0,
        };
      });
    }

    let forex: object[] = [];
    if (forexRes.status === 'fulfilled' && forexRes.value.ok) {
      const d = await forexRes.value.json();
      const rates: Record<string, number> = d.rates ?? {};
      const fxPairs = [
        { symbol: 'EUR/USD', base: 'EUR', quote: 'USD' },
        { symbol: 'GBP/USD', base: 'GBP', quote: 'USD' },
        { symbol: 'USD/PLN', base: 'USD', quote: 'PLN' },
      ];
      forex = fxPairs.map((pair) => {
        let price = 0;
        if (pair.base === 'USD') price = rates[pair.quote] || 0;
        else if (pair.quote === 'USD') price = 1 / (rates[pair.base] || 1);
        return {
          symbol: pair.symbol,
          price: price > 0 ? price.toFixed(4) : '—',
          change: 0,
          positive: true,
          noChange: true,
        };
      });
    }

    const indices = await fetchIndices() ?? INDEX_SYMBOLS.map(s => ({
      symbol: s.label, price: '—', change: 0, positive: true,
    }));

    return NextResponse.json({
      tickers: [...crypto, ...indices, ...forex],
      updatedAt: new Date().toISOString(),
    });

  } catch (err) {
    console.error('Trading API error:', err);
    return NextResponse.json({
      tickers: [
        { symbol: 'BTC/USDT', price: '—', change: 0, positive: true },
        { symbol: 'ETH/USDT', price: '—', change: 0, positive: true },
        { symbol: 'NAS100',   price: '—', change: 0, positive: true },
        { symbol: 'S&P500',   price: '—', change: 0, positive: true },
        { symbol: 'EUR/USD',  price: '—', change: 0, positive: true, noChange: true },
      ],
      updatedAt: new Date().toISOString(),
      error: true,
    });
  }
}
