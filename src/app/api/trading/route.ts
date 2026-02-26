import { NextResponse } from 'next/server';

export const revalidate = 30;

const CRYPTO_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];

// Statyczne wartości dla indeksów — aktualizowane co jakiś czas ręcznie
// lub można podpiąć płatne API (Alpha Vantage, Twelve Data)
const STATIC_INDICES = [
  { symbol: 'NAS100', price: '—', change: 0, positive: true },
  { symbol: 'S&P500', price: '—', change: 0, positive: true },
  { symbol: 'GOLD',   price: '—', change: 0, positive: true },
  { symbol: 'OIL',    price: '—', change: 0, positive: true },
];

export async function GET() {
  try {
    const [cryptoRes, forexRes] = await Promise.allSettled([
      fetch(
        `https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(CRYPTO_SYMBOLS)}`,
        { next: { revalidate: 30 } }
      ),
      fetch('https://open.er-api.com/v6/latest/USD', { next: { revalidate: 3600 } }),
    ]);

    // Crypto — Binance działa zawsze
    let crypto: object[] = [];
    if (cryptoRes.status === 'fulfilled' && cryptoRes.value.ok) {
      const d = await cryptoRes.value.json();
      crypto = d.map((t: { symbol: string; lastPrice: string; priceChangePercent: string }) => {
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

    // Forex — open.er-api działa zawsze
    let forex: object[] = [];
    if (forexRes.status === 'fulfilled' && forexRes.value.ok) {
      const d = await forexRes.value.json();
      const rates: Record<string, number> = d.rates ?? {};
      forex = [
        { symbol: 'EUR/USD', base: 'EUR', quote: 'USD' },
        { symbol: 'GBP/USD', base: 'GBP', quote: 'USD' },
        { symbol: 'USD/PLN', base: 'USD', quote: 'PLN' },
      ].map((pair) => {
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

    return NextResponse.json({
      tickers: [...crypto, ...STATIC_INDICES, ...forex],
      updatedAt: new Date().toISOString(),
    });

  } catch (err) {
    console.error('Trading API error:', err);
    return NextResponse.json({
      tickers: [
        { symbol: 'BTC/USDT', price: '—', change: 0, positive: true },
        { symbol: 'ETH/USDT', price: '—', change: 0, positive: true },
        { symbol: 'EUR/USD',  price: '—', change: 0, positive: true, noChange: true },
      ],
      updatedAt: new Date().toISOString(),
      error: true,
    });
  }
}
