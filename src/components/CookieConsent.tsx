'use client';

import { useEffect, useState } from 'react';

// ── Google Consent Mode v2 ─────────────────────────────────────────────────────
function gtag(...args: unknown[]) {
  if (typeof window === 'undefined') return;
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push(args);
}

function setConsent(analytics: boolean) {
  gtag('consent', 'update', {
    analytics_storage: analytics ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}

export function CookieConsentInit() {
  return (
    <script dangerouslySetInnerHTML={{ __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        wait_for_update: 500,
      });
    `}} />
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────────
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cookie_consent');
    if (!saved) {
      setTimeout(() => setVisible(true), 400);
    } else {
      setConsent(saved === 'granted');
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'granted');
    setConsent(true);
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookie_consent', 'denied');
    setConsent(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .cookie-btn-decline:hover { border-color: #3a4a5a !important; color: #e8edf5 !important; }
        .cookie-btn-accept:hover  { opacity: 0.85; }
      `}</style>

      {/* Overlay — blokuje całą stronę */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background: 'rgba(6, 10, 16, 0.85)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.3s ease',
      }} />

      {/* Modal — centrum ekranu */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        width: 'min(520px, calc(100vw - 32px))',
        background: '#0c1220',
        border: '1px solid #1a2535',
        borderTop: '3px solid #00f5d4',
        boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,245,212,0.06)',
        animation: 'modalIn 0.35s ease',
      }}>

        {/* Label */}
        <div style={{
          padding: '20px 24px 0',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.58rem', color: '#00f5d4', letterSpacing: '3px',
        }}>
          // cookies / prywatność
        </div>

        {/* Body */}
        <div style={{ padding: '14px 24px 20px' }}>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '1.8rem', letterSpacing: '4px',
            color: '#e8edf5', margin: '0 0 14px',
          }}>
            PLIKI <span style={{ color: '#00f5d4' }}>COOKIES</span>
          </h2>

          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.73rem', color: '#8a9ab5',
            lineHeight: 1.8, margin: '0 0 20px',
          }}>
            Używamy plików cookies do analizy ruchu na stronie (Google Analytics).
            Dane są anonimizowane i nie służą celom reklamowym. Możesz zaakceptować
            lub odrzucić zbieranie danych analitycznych — serwis działa w obu przypadkach.
          </p>

          {/* Details toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.62rem', letterSpacing: '1px',
              background: 'none', border: 'none',
              color: '#3a5a6a', cursor: 'pointer',
              padding: 0, marginBottom: showDetails ? 16 : 20,
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'color .2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#00f5d4')}
            onMouseLeave={e => (e.currentTarget.style.color = '#3a5a6a')}
          >
            <span style={{ fontSize: '0.7rem' }}>{showDetails ? '▲' : '▼'}</span>
            {showDetails ? 'UKRYJ SZCZEGÓŁY' : 'POKAŻ SZCZEGÓŁY'}
          </button>

          {/* Cookie categories */}
          {showDetails && (
            <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                {
                  name: 'Niezbędne',
                  desc: 'Działanie strony i zapamiętanie Twojego wyboru dotyczącego cookies.',
                  required: true,
                  color: '#00f5d4',
                },
                {
                  name: 'Analityczne',
                  desc: 'Google Analytics — anonimowe dane o ruchu (odwiedziny, źródła, podstrony). Bez śledzenia tożsamości.',
                  required: false,
                  color: '#b14aed',
                },
              ].map(c => (
                <div key={c.name} style={{
                  background: '#060a10', border: '1px solid #1a2535',
                  padding: '10px 14px', display: 'flex', gap: 12, alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                    background: c.color,
                    boxShadow: c.required ? `0 0 8px ${c.color}` : 'none',
                  }} />
                  <div>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.62rem', letterSpacing: '1px',
                      color: '#e8edf5', marginBottom: 3,
                      display: 'flex', gap: 8, alignItems: 'center',
                    }}>
                      {c.name.toUpperCase()}
                      {c.required && (
                        <span style={{ fontSize: '0.52rem', color: '#3a5a6a' }}>ZAWSZE AKTYWNE</span>
                      )}
                    </div>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.62rem', color: '#8a9ab5', lineHeight: 1.7,
                    }}>
                      {c.desc}
                    </div>
                  </div>
                </div>
              ))}
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.6rem', color: '#3a5a6a', paddingLeft: 2,
              }}>
                Więcej:{' '}
                <a href="/polityka-prywatnosci" style={{ color: '#00f5d4', textDecoration: 'none' }}>
                  Polityka prywatności
                </a>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="cookie-btn-decline"
              onClick={decline}
              style={{
                flex: 1,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.72rem', letterSpacing: '2px',
                background: 'none', border: '1px solid #1a2535',
                color: '#8a9ab5', padding: '12px',
                cursor: 'pointer', transition: 'all .2s',
              }}
            >
              ODRZUĆ
            </button>
            <button
              className="cookie-btn-accept"
              onClick={accept}
              style={{
                flex: 2,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.72rem', letterSpacing: '2px', fontWeight: 700,
                background: '#00f5d4', border: '1px solid #00f5d4',
                color: '#060a10', padding: '12px',
                cursor: 'pointer', transition: 'opacity .2s',
              }}
            >
              AKCEPTUJ
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
