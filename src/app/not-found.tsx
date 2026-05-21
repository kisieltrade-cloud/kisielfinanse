import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '404 - Strona nie znaleziona | KisielFinanse',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Nav />
      <main style={{
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        padding: '40px 24px',
        paddingTop: '72px',
      }}>
        <div style={{ textAlign: 'center', maxWidth: 520 }}>
          {/* 404 number */}
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(5rem, 20vw, 9rem)',
            fontWeight: 700,
            color: 'transparent',
            backgroundImage: 'linear-gradient(135deg, #c9a227, #e8963a)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            lineHeight: 1,
            marginBottom: 8,
          }}>
            404
          </div>

          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            color: '#5a6478',
            letterSpacing: '3px',
            marginBottom: 32,
          }}>
            STRONA NIE ZNALEZIONA
          </div>

          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '1rem',
            color: '#a0a8bc',
            lineHeight: 1.7,
            marginBottom: 40,
          }}>
            Strona, której szukasz, nie istnieje lub została przeniesiona.
            Wróć na stronę główną albo sprawdź artykuły na blogu.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 24px', borderRadius: 8,
                background: 'linear-gradient(135deg, #c9a227, #b8921f)',
                color: '#030508', fontFamily: 'system-ui, sans-serif',
                fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none',
              }}
            >
              ← Strona główna
            </Link>
            <Link
              href="/blog"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 24px', borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)',
                color: '#e8edf5', fontFamily: 'system-ui, sans-serif',
                fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none',
              }}
            >
              Blog →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
