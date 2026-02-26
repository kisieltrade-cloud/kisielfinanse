'use client';

import { useEffect, useState } from 'react';

interface Session {
  name: string;
  city: string;
  timezone: string;
  open: number;  // hour in UTC
  close: number; // hour in UTC
  color: string;
}

const SESSIONS: Session[] = [
  { name: 'Sydney',  city: 'SYDNEY',  timezone: 'Australia/Sydney',   open: 21, close: 6,  color: '#f5c518' },
  { name: 'Tokio',   city: 'TOKIO',   timezone: 'Asia/Tokyo',         open: 0,  close: 9,  color: '#b14aed' },
  { name: 'Londyn',  city: 'LONDYN',  timezone: 'Europe/London',      open: 8,  close: 17, color: '#00f5d4' },
  { name: 'Nowy Jork', city: 'NOWY JORK', timezone: 'America/New_York', open: 13, close: 22, color: '#ff2d78' },
];

function isSessionOpen(session: Session, utcHour: number, utcMin: number): boolean {
  const nowMins = utcHour * 60 + utcMin;
  if (session.open < session.close) {
    return nowMins >= session.open * 60 && nowMins < session.close * 60;
  } else {
    // crosses midnight (Sydney)
    return nowMins >= session.open * 60 || nowMins < session.close * 60;
  }
}

function minsUntil(targetHour: number, utcHour: number, utcMin: number): number {
  const nowMins = utcHour * 60 + utcMin;
  const targetMins = targetHour * 60;
  let diff = targetMins - nowMins;
  if (diff < 0) diff += 24 * 60;
  return diff;
}

function formatCountdown(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function getLocalTime(timezone: string): string {
  return new Date().toLocaleTimeString('pl-PL', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MarketSessions() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const utcHour = now.getUTCHours();
  const utcMin = now.getUTCMinutes();

  const openSessions = SESSIONS.filter(s => isSessionOpen(s, utcHour, utcMin));
  const isOverlap = openSessions.length >= 2;

  return (
    <section className="sessions-section">
      <div className="sessions-inner">
        <div className="sessions-header">
          <div>
            <div className="section-label">// live market clock</div>
            <h2 className="section-title reveal">
              <span aria-hidden="true">SESJE <span className="gradient-text-cp">RYNKOWE</span></span>
              <span className="seo-only">Godziny sesji rynkowych Forex — Londyn, Nowy Jork, Tokio, Sydney</span>
            </h2>
          </div>
          <div className="sessions-utc reveal">
            <div className="sessions-utc-label">// UTC</div>
            <div className="sessions-utc-time">
              {now.toLocaleTimeString('pl-PL', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Overlap indicator */}
        {isOverlap && (
          <div className="sessions-overlap reveal">
            <span className="sessions-overlap-dot" />
            Nakładanie sesji: {openSessions.map(s => s.name).join(' + ')} — najwyższa płynność
          </div>
        )}

        {/* Session cards */}
        <div className="sessions-grid reveal">
          {SESSIONS.map((session) => {
            const open = isSessionOpen(session, utcHour, utcMin);
            const minsToClose = open ? minsUntil(session.close, utcHour, utcMin) : 0;
            const minsToOpen  = !open ? minsUntil(session.open, utcHour, utcMin) : 0;
            const localTime = getLocalTime(session.timezone);

            return (
              <div
                key={session.name}
                className={`session-card${open ? ' session-open' : ''}`}
                style={{ borderTop: `3px solid ${open ? session.color : 'var(--border)'}` }}
              >
                {/* Status dot */}
                <div className="session-card-top">
                  <div
                    className={`session-dot${open ? ' session-dot-active' : ''}`}
                    style={{ background: open ? session.color : 'var(--muted)' }}
                  />
                  <span className="session-status" style={{ color: open ? session.color : 'var(--muted)' }}>
                    {open ? 'OTWARTA' : 'ZAMKNIĘTA'}
                  </span>
                </div>

                {/* City name */}
                <div className="session-city" style={{ color: open ? session.color : 'var(--muted)' }}>
                  {session.city}
                </div>

                {/* Local time */}
                <div className="session-local-time">{localTime}</div>

                {/* Hours */}
                <div className="session-hours">
                  {String(session.open).padStart(2,'0')}:00 — {String(session.close).padStart(2,'0')}:00 UTC
                </div>

                {/* Countdown */}
                <div className="session-countdown">
                  {open ? (
                    <span style={{ color: 'var(--cyan)' }}>
                      Zamknięcie za <strong>{formatCountdown(minsToClose)}</strong>
                    </span>
                  ) : (
                    <span style={{ color: 'var(--muted)' }}>
                      Otwarcie za <strong style={{ color: 'var(--text)' }}>{formatCountdown(minsToOpen)}</strong>
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                {open && (
                  <div className="session-progress-wrap">
                    <div
                      className="session-progress-bar"
                      style={{
                        width: `${100 - (minsToClose / (
                          session.open < session.close
                            ? (session.close - session.open)
                            : (24 - session.open + session.close)
                        ) / 60 * 100)}%`,
                        background: session.color,
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="sessions-note">
          Godziny podane w UTC. W czasie letnim (DST) sesja londyńska: 07:00–16:00 UTC, nowojorska: 12:00–21:00 UTC.
        </p>
      </div>
    </section>
  );
}
