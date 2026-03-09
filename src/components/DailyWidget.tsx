'use client';

import Link from 'next/link';
import { getLastResult } from '@/data/daily';

export default function DailyWidget() {
  const day = getLastResult();

  // Brak danych — widget ukryty
  if (!day) return null;

  const today = new Date().toISOString().split('T')[0];
  const isToday = day.date === today;

  return (
    <div className="daily-widget reveal">
      <div className="daily-widget-header">
        <span className="daily-widget-label">
          // {day.dateDisplay}
        </span>
        <span
          className="daily-widget-badge"
          style={{ color: day.positive ? 'var(--cyan)' : 'var(--pink)', borderColor: day.positive ? 'var(--cyan)' : 'var(--pink)' }}
        >
          {isToday ? 'LIVE' : 'LAST SESSION'}
        </span>
      </div>

      <div className="daily-widget-stats">
        <div className="daily-widget-stat daily-widget-stat-main">
          <span
            className="daily-widget-val"
            style={{ color: day.positive ? 'var(--cyan)' : 'var(--pink)' }}
          >
            {day.pnlFormatted}
          </span>
          <span className="daily-widget-key">P&amp;L</span>
        </div>

        <div className="daily-widget-divider" />

        <div className="daily-widget-stat">
          <span
            className="daily-widget-val"
            style={{ color: day.positive ? 'var(--cyan)' : 'var(--pink)' }}
          >
            {day.returnPct}
          </span>
          <span className="daily-widget-key">Zwrot</span>
        </div>

        <div className="daily-widget-divider" />

        <div className="daily-widget-stat">
          <span className="daily-widget-val">{day.trades}</span>
          <span className="daily-widget-key">Transakcji</span>
        </div>

        <div className="daily-widget-divider" />

        <div className="daily-widget-stat">
          <span
            className="daily-widget-val"
            style={{ color: parseInt(day.winRate) >= 50 ? 'var(--cyan)' : 'var(--pink)' }}
          >
            {day.winRate}
          </span>
          <span className="daily-widget-key">Win Rate</span>
        </div>
      </div>

      <div className="daily-widget-footer">
        <span className="daily-widget-symbols">{day.symbols}</span>
        <Link href="/tygodnik" className="daily-widget-link">
          historia wyników →
        </Link>
      </div>
    </div>
  );
}
