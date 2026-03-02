'use client';

import { useEffect, useState } from 'react';

// ── Google Consent Mode v2 helpers ────────────────────────────────────────────
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

// Ustaw domyślne "denied" zanim załaduje się GA — wymagane przez Google
export function CookieConsentInit() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500,
          });
        `,
      }}
    />
  );
}

// ── Main Banner ───────────────────────────────────────────────────────────────
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cookie_consent');
    if (!saved) {
      // Pokaż banner po chwili
      setTimeout(() => setVisible(true), 800);
    } else {
      // Przywróć zgodę
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
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      padding: '0 16px 16px',
      display: 'flex', justifyContent: 'center',
      animation: 'slideUp 0.35s ease',
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

      <div style={{
        maxWidth: 760, width: '100%',
        background: '#0c1220',
        border: '1px solid #1a2535',
        borderTop: '3px solid #00f5d4',
        padding: '20px 24px',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem',
              color: '#00f5d4', letterSpacing: '3px', marginBottom: 6,
            }}>
              // pliki cookies
            </div>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '0.73rem',
              color: '#8a9ab5', lineHeight: 1.7, margin: 0,
            }}>
              Używamy plików cookies do analizy ruchu (Google Analytics). Dane są anonimizowane
              i nie służą reklamom.{' '}
              <button
                onClick={() => setShowDetails(!showDetails)}
                style={{
                  background: 'none', border: 'none', color: '#00f5d4',
                  fontFamily: 'inherit', fontSize: 'inherit', cursor: 'pointer',
                  padding: 0, textDecoration: 'underline',
                }}
              >
                {showDetails ? 'Zwiń' : 'Szczegóły'}
              </button>
            </p>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
            <button
              onClick={decline}
              style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem',
                letterSpacing: '1px', background: 'none',
                border: '1px solid #1a2535', color: '#8a9ab5',
                padding: '8px 18px', cursor: 'pointer', transition: 'all .2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#3a4a5a')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#1a2535')}
            >
              ODRZUĆ
            </button>
            <button
              onClick={accept}
              style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem',
                letterSpacing: '1px', background: '#00f5d4', color: '#060a10',
                border: '1px solid #00f5d4', padding: '8px 18px',
                cursor: 'pointer', fontWeight: 700, transition: 'all .2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              AKCEPTUJ
            </button>
          </div>
        </div>

        {/* Details */}
        {showDetails && (
          <div style={{
            marginTop: 16, borderTop: '1px solid #1a2535', paddingTop: 16,
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 12,
          }}>
            {[
              { name: 'Niezbędne', desc: 'Działanie strony, preferencje zgody', required: true, color: '#00f5d4' },
              { name: 'Analityczne', desc: 'Google Analytics — anonimowe statystyki ruchu', required: false, color: '#b14aed' },
            ].map(c => (
              <div key={c.name} style={{
                background: '#060a10', border: '1px solid #1a2535',
                padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', marginTop: 5,
                  background: c.color, flexShrink: 0,
                  boxShadow: c.required ? `0 0 8px ${c.color}` : 'none',
                }} />
                <div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem',
                    color: '#e8edf5', letterSpacing: '1px', marginBottom: 3,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    {c.name.toUpperCase()}
                    {c.required && (
                      <span style={{ fontSize: '0.55rem', color: '#3a5a6a', letterSpacing: '1px' }}>
                        WYMAGANE
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#8a9ab5',
                  }}>
                    {c.desc}
                  </div>
                </div>
              </div>
            ))}
            <div style={{
              gridColumn: '1/-1',
              fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', color: '#3a5a6a',
            }}>
              Więcej informacji:{' '}
              <a href="/polityka-prywatnosci" style={{ color: '#00f5d4', textDecoration: 'none' }}>
                Polityka prywatności
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
