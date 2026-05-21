import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'KisielFinanse - Finanse. Wiedza. Wolność.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: '#030508',
          padding: '80px 100px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,245,212,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,212,0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            display: 'flex',
          }}
        />

        {/* Glow top-right */}
        <div
          style={{
            position: 'absolute',
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(177,74,237,0.2) 0%, transparent 65%)',
            display: 'flex',
          }}
        />

        {/* Glow bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: -150,
            left: -100,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(0,245,212,0.12) 0%, transparent 65%)',
            display: 'flex',
          }}
        />

        {/* Top label */}
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: 18,
            color: '#00f5d4',
            letterSpacing: 6,
            marginBottom: 32,
            display: 'flex',
          }}
        >
          KISIELFINANSE.PL
        </div>

        {/* Main headline */}
        <div
          style={{
            fontSize: 110,
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: 8,
            marginBottom: 40,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span style={{ color: '#e8edf5' }}>FINANSE.</span>
          <span
            style={{
              background: 'linear-gradient(90deg, #00f5d4, #b14aed)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            WIEDZA.
          </span>
          <span style={{ color: '#e8edf5' }}>WOLNOŚĆ.</span>
        </div>

        {/* Subline */}
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: 22,
            color: '#5a6a80',
            letterSpacing: 2,
            display: 'flex',
          }}
        >
          Trading · Krypto · Oszczędzanie · Geopolityka
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #00f5d4, #b14aed)',
            display: 'flex',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
