import { NextResponse } from 'next/server';

export const revalidate = 30;

const CRYPTO_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];

// Stooq symbols — darmowe API bez klucza
const STOOQ_INDICES = [
  { stooq: '^ndx',  label: 'NAS100' },
  { stooq: '^spx',  label: 'S&P500' },
  { stooq: 'gc.f',  label: 'GOLD' },
  { stooq: 'cl.f',  label: 'OIL' },
];

async function fetchIndices() {
  const symbols = STOOQ_INDICES.map(s => s.stooq).join(',');
  const url = `https://stooq.com/q/l/?s=${encodeURIComponent(symbols)}&f=sd2t2ohlcv&h&e=json`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;

    const data = await res.json();
    const symbols_data: Array<{
      Symbol: string;
      Open: string;
      Close: string;
    }> = data?.symbols ?? [];

    if (!symbols_data.length) return null;

    return symbols_data.map((q, i) => {
      const close = parseFloat(q.Close);
      const open = parseFloat(q.Open);
      const pct = open > 0 ? ((close - open) / open) * 100 : 0;
      const label = STOOQ_INDICES[i]?.label ?? q.Symbol;

      return {
        symbol: label,
        price: close > 0
          ? close.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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

    // Crypto
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

    // Forex
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

    // Indices via Stooq
    const indices = await fetchIndices() ?? STOOQ_INDICES.map(s => ({
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
