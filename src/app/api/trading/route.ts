import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 30; // refresh every 30s

interface BinanceTicker {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
}

interface ForexRate {
  rates: Record<string, number>;
}

const CRYPTO_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];

export async function GET() {
  try {
    // Fetch crypto data from Binance (free, no key needed)
    const cryptoRes = await fetch(
      `https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(CRYPTO_SYMBOLS)}`,
      { next: { revalidate: 30 } }
    );

    let cryptoData: BinanceTicker[] = [];
    if (cryptoRes.ok) {
      cryptoData = await cryptoRes.json();
    }

    // Fetch forex rates (exchangerate-api free tier)
    // You can replace with your preferred provider
    const forexRes = await fetch(
      'https://open.er-api.com/v6/latest/USD',
      { next: { revalidate: 3600 } } // hourly for forex
    );

    let forexData: ForexRate = { rates: {} };
    if (forexRes.ok) {
      forexData = await forexRes.json();
    }

    // Format crypto
    const crypto = cryptoData.map((t) => {
      const pct = parseFloat(t.priceChangePercent);
      const price = parseFloat(t.lastPrice);
      const sym = t.symbol.replace('USDT', '');
      return {
        symbol: `${sym}/USDT`,
        price: price > 1000 ? price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : price.toFixed(4),
        change: pct,
        positive: pct >= 0,
      };
    });

    // Format forex
    const fxPairs = [
      { symbol: 'EUR/USD', base: 'EUR', quote: 'USD' },
      { symbol: 'USD/PLN', base: 'USD', quote: 'PLN' },
      { symbol: 'GBP/USD', base: 'GBP', quote: 'USD' },
    ];

    const forex = fxPairs.map((pair) => {
      const rates = forexData.rates;
      let price = 0;
      if (pair.base === 'USD') {
        price = rates[pair.quote] || 0;
      } else if (pair.quote === 'USD') {
        price = 1 / (rates[pair.base] || 1);
      }
      return {
        symbol: pair.symbol,
        price: price.toFixed(4),
        change: 0, // free forex APIs don't give % change
        positive: true,
        noChange: true,
      };
    });

    // Static commodities/indices (update with paid API key if needed)
    const extras = [
      { symbol: 'S&P 500', price: '—', change: 0, positive: true, static: true },
      { symbol: 'GOLD', price: '—', change: 0, positive: true, static: true },
    ];

    return NextResponse.json({
      tickers: [...crypto, ...forex, ...extras],
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Trading API error:', err);
    // Return fallback data
    return NextResponse.json({
      tickers: [
        { symbol: 'BTC/USDT', price: '—', change: 0, positive: true },
        { symbol: 'ETH/USDT', price: '—', change: 0, positive: true },
        { symbol: 'EUR/USD', price: '—', change: 0, positive: true, noChange: true },
        { symbol: 'USD/PLN', price: '—', change: 0, positive: true, noChange: true },
      ],
      updatedAt: new Date().toISOString(),
      error: true,
    });
  }
}
