'use client';

import { useEffect, useState, useCallback } from 'react';

interface TickerItem {
  symbol: string;
  price: string;
  change: number;
  positive: boolean;
}

const FALLBACK: TickerItem[] = [
  { symbol: 'BTC/USDT', price: '98,421.00', change: 2.34,  positive: true  },
  { symbol: 'ETH/USDT', price: '3,742.50',  change: -0.87, positive: false },
  { symbol: 'SOL/USDT', price: '187.32',    change: 1.12,  positive: true  },
  { symbol: 'BNB/USDT', price: '612.40',    change: 0.45,  positive: true  },
  { symbol: 'XRP/USDT', price: '0.6234',    change: -1.23, positive: false },
  { symbol: 'DOGE/USDT',price: '0.1821',    change: 3.11,  positive: true  },
];

const CRYPTO_SYMBOLS = ['BTCUSDT','ETHUSDT','SOLUSDT','BNBUSDT','XRPUSDT','DOGEUSDT'];

export default function Ticker() {
  const [tickers, setTickers] = useState<TickerItem[]>(FALLBACK);

  const fetchTickers = useCallback(async () => {
    try {
      const res = await fetch(
        `https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(CRYPTO_SYMBOLS)}`,
        { cache: 'no-store' }
      );
      if (!res.ok) return;
      const data = await res.json();
      const mapped: TickerItem[] = data.map((t: { symbol: string; lastPrice: string; priceChangePercent: string }) => {
        const pct = parseFloat(t.priceChangePercent);
        const price = parseFloat(t.lastPrice);
        const sym = t.symbol.replace('USDT', '');
        return {
          symbol: `${sym}/USDT`,
          price: price > 100
            ? price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : price.toFixed(4),
          change: Math.round(pct * 100) / 100,
          positive: pct >= 0,
        };
      });
      if (mapped.length) setTickers(mapped);
    } catch {
      // keep fallback
    }
  }, []);

  useEffect(() => {
    fetchTickers();
    const interval = setInterval(fetchTickers, 30_000);
    return () => clearInterval(interval);
  }, [fetchTickers]);

  // 3x duplication — enough for any screen width
  const items = [...tickers, ...tickers, ...tickers];

  return (
    <div className="ticker">
      <div className="ticker-track">
        {items.map((t, i) => (
          <div key={i} className="ticker-item">
            <span className="ticker-sym">{t.symbol}</span>
            <span className={t.positive ? 'ticker-up' : 'ticker-dn'}>
              {t.positive ? '+' : ''}{t.change.toFixed(2)}%
            </span>
            <span>{t.price}</span>
            <span className="ticker-sep">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}
