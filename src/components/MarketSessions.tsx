'use client';

import { useEffect, useState } from 'react';

interface Session {
  name: string;
  city: string;
  timezone: string;
  open: number;
  close: number;
  color: string;
}

const SESSIONS: Session[] = [
  { name: 'Sydney',    city: 'SYDNEY',    timezone: 'Australia/Sydney',  open: 21, close: 6,  color: '#f5c518' },
  { name: 'Tokio',     city: 'TOKIO',     timezone: 'Asia/Tokyo',        open: 0,  close: 9,  color: '#b14aed' },
  { name: 'Londyn',    city: 'LONDYN',    timezone: 'Europe/London',     open: 8,  close: 17, color: '#00f5d4' },
  { name: 'Nowy Jork', city: 'NOWY JORK', timezone: 'America/New_York',  open: 13, close: 22, color: '#ff2d78' },
];

function isOpen(s: Session, utcH: number, utcM: number) {
  const now = utcH * 60 + utcM;
  if (s.open < s.close) return now >= s.open * 60 && now < s.close * 60;
  return now >= s.open * 60 || now < s.close * 60;
}

function minsUntil(target: number, utcH: number, utcM: number) {
  let diff = target * 60 - (utcH * 60 + utcM);
  if (diff < 0) diff += 1440;
  return diff;
}

function fmt(mins: number) {
  const h = Math.floor(mins / 60), m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function localTime(tz: string) {
  return new Date().toLocaleTimeString('pl-PL', { timeZone: tz, hour: '2-digit', minute: '2-digit' });
}

export default function MarketSessions() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const H = now.getUTCHours(), M = now.getUTCMinutes();
  const openSessions = SESSIONS.filter(s => isOpen(s, H, M));
  const overlap = openSessions.length >= 2;
  const utcTime = now.toLocaleTimeString('pl-PL', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <>
      <style>{`
        .ms-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
        }
        .ms-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .ms-utc { text-align: right; }
        @media (max-width: 768px) {
          .ms-grid { grid-template-columns: repeat(2, 1fr); }
          .ms-header { flex-direction: column; align-items: flex-start; }
          .ms-utc { text-align: left; }
        }
        @media (max-width: 400px) {
          .ms-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <section style={{ padding: '80px 0', borderTop: '1px solid #1a2535' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

          {/* Header */}
          <div className="ms-header">
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#00f5d4', letterSpacing: '3px', marginBottom: 8 }}>
                // live market clock
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,3rem)', letterSpacing: '3px', lineHeight: 1, margin: 0, color: '#e8edf5' }}>
                SESJE <span style={{ background: 'linear-gradient(135deg,#00f5d4,#b14aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>RYNKOWE</span>
              </h2>
            </div>
            <div className="ms-utc">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#00f5d4', letterSpacing: '2px', marginBottom: 4 }}>// UTC</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3vw,2.2rem)', letterSpacing: '3px', color: '#e8edf5', lineHeight: 1 }}>
                {utcTime}
              </div>
            </div>
          </div>

          {/* Overlap banner */}
          {overlap && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(0,245,212,0.06)', border: '1px solid rgba(0,245,212,0.2)',
              borderLeft: '3px solid #00f5d4', padding: '10px 16px',
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#00f5d4', marginBottom: 16,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00f5d4', flexShrink: 0, boxShadow: '0 0 8px #00f5d4', display: 'inline-block' }} />
              Nakładanie: {openSessions.map(s => s.name).join(' + ')} — najwyższa płynność
            </div>
          )}

          {/* Cards */}
          <div className="ms-grid">
            {SESSIONS.map(s => {
              const open = isOpen(s, H, M);
              const totalMins = s.open < s.close ? (s.close - s.open) * 60 : (24 - s.open + s.close) * 60;
              const minsLeft = open ? minsUntil(s.close, H, M) : 0;
              const progress = open ? Math.round((1 - minsLeft / totalMins) * 100) : 0;
              const minsToOpen = !open ? minsUntil(s.open, H, M) : 0;

              return (
                <div key={s.name} style={{
                  background: open ? '#0d1525' : '#080d14',
                  borderTop: `3px solid ${open ? s.color : '#1a2535'}`,
                  padding: '24px 20px',
                  display: 'flex', flexDirection: 'column', gap: 8,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                      background: open ? s.color : '#2a3a4a',
                      boxShadow: open ? `0 0 8px ${s.color}88` : 'none',
                      display: 'inline-block',
                    }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '2px', fontWeight: 700, color: open ? s.color : '#2a3a4a' }}>
                      {open ? 'OTWARTA' : 'ZAMKNIĘTA'}
                    </span>
                  </div>

                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem,2.5vw,1.5rem)', letterSpacing: '2px', lineHeight: 1, color: open ? s.color : '#2a3a4a', marginTop: 4 }}>
                    {s.city}
                  </div>

                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2rem)', letterSpacing: '4px', color: '#e8edf5', lineHeight: 1 }}>
                    {localTime(s.timezone)}
                  </div>

                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#3a4a5a' }}>
                    {String(s.open).padStart(2,'0')}:00 — {String(s.close).padStart(2,'0')}:00 UTC
                  </div>

                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', marginTop: 2 }}>
                    {open
                      ? <span style={{ color: '#8a9ab5' }}>Zamknięcie za <strong style={{ color: '#00f5d4' }}>{fmt(minsLeft)}</strong></span>
                      : <span style={{ color: '#8a9ab5' }}>Otwarcie za <strong style={{ color: '#e8edf5' }}>{fmt(minsToOpen)}</strong></span>
                    }
                  </div>

                  <div style={{ height: 2, background: '#1a2535', marginTop: 6, overflow: 'hidden' }}>
                    {open && <div style={{ height: '100%', width: `${progress}%`, background: s.color, transition: 'width 1s linear' }} />}
                  </div>
                </div>
              );
            })}
          </div>

          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#2a3a4a', marginTop: 12, lineHeight: 1.6 }}>
            Godziny podane w UTC. W czasie letnim (DST): Londyn 07:00–16:00 UTC, Nowy Jork 12:00–21:00 UTC.
          </p>
        </div>
      </section>
    </>
  );
}
