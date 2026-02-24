'use client';

import { useEffect, useState, useCallback } from 'react';

interface Ticker {
  symbol: string;
  price: string;
  change: number;
  positive: boolean;
  noChange?: boolean;
  static?: boolean;
}

interface ApiResponse {
  tickers: Ticker[];
  updatedAt: string;
  error?: boolean;
}

// Fallback demo data while loading
const FALLBACK: Ticker[] = [
  { symbol: 'BTC/USDT', price: '98,421.00', change: 2.34, positive: true },
  { symbol: 'ETH/USDT', price: '3,742.50', change: -0.87, positive: false },
  { symbol: 'SOL/USDT', price: '187.32', change: 1.12, positive: true },
  { symbol: 'EUR/USD', price: '1.0821', change: 0, positive: true, noChange: true },
  { symbol: 'USD/PLN', price: '4.0731', change: 0, positive: true, noChange: true },
  { symbol: 'GBP/USD', price: '1.2643', change: 0, positive: true, noChange: true },
];

export default function Ticker() {
  const [tickers, setTickers] = useState<Ticker[]>(FALLBACK);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchTickers = useCallback(async () => {
    try {
      const res = await fetch('/api/trading', { cache: 'no-store' });
      if (!res.ok) return;
      const data: ApiResponse = await res.json();
      if (data.tickers?.length) {
        setTickers(data.tickers);
        setLastUpdate(new Date(data.updatedAt).toLocaleTimeString('pl-PL'));
      }
    } catch {
      // keep existing data on error
    }
  }, []);

  useEffect(() => {
    fetchTickers();
    const interval = setInterval(fetchTickers, 30_000);
    return () => clearInterval(interval);
  }, [fetchTickers]);

  // Duplicate for seamless loop
  const items = [...tickers, ...tickers];

  return (
    <div className="ticker" title={lastUpdate ? `Ostatnia aktualizacja: ${lastUpdate}` : ''}>
      <div className="ticker-track">
        {items.map((t, i) => (
          <div key={i} className="ticker-item">
            <span className="ticker-sym">{t.symbol}</span>
            {!t.noChange && !t.static && (
              <span className={t.positive ? 'ticker-up' : 'ticker-dn'}>
                {t.positive ? '+' : ''}{t.change.toFixed(2)}%
              </span>
            )}
            <span>{t.price}</span>
            <span className="ticker-sep">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}
