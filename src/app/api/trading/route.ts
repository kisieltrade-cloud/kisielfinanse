import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 30;

interface BinanceTicker {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
}

interface YahooQuote {
  regularMarketPrice: number;
  regularMarketChangePercent: number;
  shortName: string;
}

interface YahooResponse {
  quoteResponse: {
    result: YahooQuote[];
  };
}

const CRYPTO_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];

// Yahoo Finance symbols for indices
const INDEX_SYMBOLS = [
  { yahoo: 'NQ=F',  label: 'NAS100' },
  { yahoo: 'ES=F',  label: 'S&P500' },
  { yahoo: 'GC=F',  label: 'GOLD' },
  { yahoo: 'CL=F',  label: 'OIL' },
];

export async function GET() {
  try {
    const [cryptoRes, forexRes, indicesRes] = await Promise.allSettled([
      // Crypto — Binance
      fetch(
        `https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(CRYPTO_SYMBOLS)}`,
        { next: { revalidate: 30 } }
      ),
      // Forex — open.er-api
      fetch('https://open.er-api.com/v6/latest/USD', { next: { revalidate: 3600 } }),
      // Indices — Yahoo Finance
      fetch(
        `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${INDEX_SYMBOLS.map(s => s.yahoo).join(',')}&fields=regularMarketPrice,regularMarketChangePercent,shortName`,
        {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          next: { revalidate: 60 },
        }
      ),
    ]);

    // ── Crypto ───────────────────────────────────────────────────────────
    let cryptoData: BinanceTicker[] = [];
    if (cryptoRes.status === 'fulfilled' && cryptoRes.value.ok) {
      cryptoData = await cryptoRes.value.json();
    }

    const crypto = cryptoData.map((t) => {
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

    // ── Forex ─────────────────────────────────────────────────────────────
    let forexRates: Record<string, number> = {};
    if (forexRes.status === 'fulfilled' && forexRes.value.ok) {
      const d = await forexRes.value.json();
      forexRates = d.rates ?? {};
    }

    const fxPairs = [
      { symbol: 'EUR/USD', base: 'EUR', quote: 'USD' },
      { symbol: 'GBP/USD', base: 'GBP', quote: 'USD' },
      { symbol: 'USD/PLN', base: 'USD', quote: 'PLN' },
    ];

    const forex = fxPairs.map((pair) => {
      let price = 0;
      if (pair.base === 'USD') price = forexRates[pair.quote] || 0;
      else if (pair.quote === 'USD') price = 1 / (forexRates[pair.base] || 1);
      return {
        symbol: pair.symbol,
        price: price > 0 ? price.toFixed(4) : '—',
        change: 0,
        positive: true,
        noChange: true,
      };
    });

    // ── Indices (Yahoo Finance) ───────────────────────────────────────────
    let indices: { symbol: string; price: string; change: number; positive: boolean }[] = [];

    if (indicesRes.status === 'fulfilled' && indicesRes.value.ok) {
      const yahooData: YahooResponse = await indicesRes.value.json();
      const results = yahooData?.quoteResponse?.result ?? [];
      indices = results.map((q, i) => {
        const pct = q.regularMarketChangePercent;
        const price = q.regularMarketPrice;
        const label = INDEX_SYMBOLS[i]?.label ?? 'INDEX';
        return {
          symbol: label,
          price: price > 1000
            ? price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : price.toFixed(2),
          change: Math.round(pct * 100) / 100,
          positive: pct >= 0,
        };
      });
    } else {
      // Static fallback for indices
      indices = INDEX_SYMBOLS.map(s => ({
        symbol: s.label,
        price: '—',
        change: 0,
        positive: true,
      }));
    }

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
