import { ImageResponse } from 'next/og';

// Wspólny, brandowany szablon OG dla stron narzędziowych (kalkulatory, słownik,
// symulator, indeks). Dzięki temu udostępnienie dowolnego narzędzia w social
// pokazuje spójną kartę zamiast ogólnego og-image.png.

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function toolOg(opts: {
  kicker: string;       // etykieta w prawym górnym rogu, np. "KALKULATOR"
  title: string;        // główny nagłówek karty
  subtitle?: string;    // jednolinijkowy opis pod tytułem
  icon?: string;        // emoji
  accent?: string;      // kolor akcentu (hex)
}) {
  const { kicker, title, subtitle, icon = '📊', accent = '#2e7d4f' } = opts;
  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: 'flex', background: '#030508', position: 'relative', overflow: 'hidden' }}>
        {/* siatka */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex',
          backgroundImage: `linear-gradient(${hexToRgba(accent, 0.05)} 1px, transparent 1px), linear-gradient(90deg, ${hexToRgba(accent, 0.05)} 1px, transparent 1px)`,
          backgroundSize: '72px 72px' }} />
        {/* poświata */}
        <div style={{ position: 'absolute', top: -250, right: -180, width: 750, height: 750, borderRadius: '50%', display: 'flex',
          background: `radial-gradient(ellipse, ${hexToRgba(accent, 0.22)} 0%, transparent 60%)` }} />
        <div style={{ position: 'absolute', bottom: -200, left: -120, width: 600, height: 600, borderRadius: '50%', display: 'flex',
          background: `radial-gradient(ellipse, ${hexToRgba(accent, 0.10)} 0%, transparent 60%)` }} />
        {/* pasek z lewej */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: 6, height: '100%', background: accent, display: 'flex' }} />
        {/* dolny pasek */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, display: 'flex',
          background: `linear-gradient(90deg, ${accent} 0%, ${hexToRgba(accent, 0.3)} 60%, transparent 100%)` }} />

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '56px 80px 56px 96px', position: 'relative', zIndex: 2 }}>
          {/* górny wiersz */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: hexToRgba(accent, 0.15),
                border: `1.5px solid ${hexToRgba(accent, 0.4)}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 900, color: accent, fontFamily: 'monospace' }}>K</div>
              <span style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 700, color: '#8a9ab5', letterSpacing: 4 }}>KISIELFINANSE.PL</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: hexToRgba(accent, 0.1),
              border: `1px solid ${hexToRgba(accent, 0.25)}`, padding: '7px 18px' }}>
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span style={{ fontFamily: 'monospace', fontSize: 12, color: accent, letterSpacing: 4, fontWeight: 700 }}>{kicker}</span>
            </div>
          </div>
          {/* tytuł */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: title.length > 22 ? 70 : 92, fontWeight: 900, lineHeight: 0.98, color: '#f0f4fa',
              letterSpacing: -2, fontFamily: 'sans-serif', display: 'flex', marginBottom: 26 }}>{title}</div>
            <div style={{ width: 80, height: 4, background: accent, marginBottom: 26, display: 'flex' }} />
            {subtitle && (
              <div style={{ fontFamily: 'monospace', fontSize: 22, color: '#6b7a90', lineHeight: 1.4, display: 'flex' }}>{subtitle}</div>
            )}
          </div>
          {/* dolny wiersz */}
          <div style={{ fontFamily: 'monospace', fontSize: 14, color: '#374151', letterSpacing: 3, display: 'flex' }}>
            Edukacja finansowa bez ściemy
          </div>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
