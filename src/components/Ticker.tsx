'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface TickerItem {
  symbol: string;
  price: string;
  change: number;
  positive: boolean;
  noChange?: boolean;
}

interface ApiResponse {
  tickers: TickerItem[];
  updatedAt: string;
  error?: boolean;
}

const FALLBACK: TickerItem[] = [
  { symbol: 'BTC/USDT', price: '98,421.00', change: 2.34,  positive: true  },
  { symbol: 'ETH/USDT', price: '3,742.50',  change: -0.87, positive: false },
  { symbol: 'SOL/USDT', price: '187.32',    change: 1.12,  positive: true  },
  { symbol: 'NAS100',   price: '21,847.00', change: 0.54,  positive: true  },
  { symbol: 'S&P500',   price: '5,962.00',  change: 0.31,  positive: true  },
  { symbol: 'GOLD',     price: '2,631.40',  change: -0.22, positive: false },
  { symbol: 'OIL',      price: '74.12',     change: 1.05,  positive: true  },
  { symbol: 'EUR/USD',  price: '1.0821',    change: 0,     positive: true,  noChange: true },
  { symbol: 'GBP/USD',  price: '1.2643',    change: 0,     positive: true,  noChange: true },
  { symbol: 'USD/PLN',  price: '4.0731',    change: 0,     positive: true,  noChange: true },
];

export default function Ticker() {
  const [tickers, setTickers] = useState<TickerItem[]>(FALLBACK);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const trackRef = useRef<HTMLDivElement>(null);

  const fetchTickers = useCallback(async () => {
    try {
      const res = await fetch('/api/trading', { cache: 'no-store' });
      if (!res.ok) return;
      const data: ApiResponse = await res.json();
      if (data.tickers?.length) {
        setTickers(data.tickers);
        setLastUpdate(new Date(data.updatedAt).toLocaleTimeString('pl-PL'));
        // Restart animation after data update for smooth loop
        if (trackRef.current) {
          trackRef.current.style.animation = 'none';
          void trackRef.current.offsetWidth; // reflow
          trackRef.current.style.animation = '';
        }
      }
    } catch {
      // keep fallback
    }
  }, []);

  useEffect(() => {
    fetchTickers();
    const interval = setInterval(fetchTickers, 30_000);
    return () => clearInterval(interval);
  }, [fetchTickers]);

  // 4x duplication for seamless loop on all screen sizes
  const items = [...tickers, ...tickers, ...tickers, ...tickers];

  return (
    <div className="ticker" title={lastUpdate ? `Ostatnia aktualizacja: ${lastUpdate}` : 'Dane przykładowe'}>
      <div className="ticker-track" ref={trackRef}>
        {items.map((t, i) => (
          <div key={i} className="ticker-item">
            <span className="ticker-sym">{t.symbol}</span>
            {!t.noChange && t.price !== '—' && (
              <span className={t.positive ? 'ticker-up' : 'ticker-dn'}>
                {t.positive ? '+' : ''}{t.change.toFixed(2)}%
              </span>
            )}
            <span className={t.price === '—' ? 'ticker-dash' : ''}>{t.price}</span>
            <span className="ticker-sep">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}
