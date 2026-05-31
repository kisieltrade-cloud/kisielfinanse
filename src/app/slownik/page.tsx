import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getAllTermsSorted } from '@/lib/glossary';

const BASE_URL = 'https://kisielfinanse.pl';
const ACCENT = '#c9a227';

export const metadata: Metadata = {
  title: { absolute: 'Słownik pojęć finansowych | KisielFinanse' },
  description: 'Słownik pojęć finansowych: ETF, IKE, IKZE, podatek Belki, WIBOR, dywersyfikacja, procent składany i więcej. Krótkie, zrozumiałe definicje bez żargonu.',
  robots: { index: true, follow: true },
  alternates: { canonical: `${BASE_URL}/slownik` },
  openGraph: {
    title: 'Słownik pojęć finansowych | KisielFinanse',
    description: 'Krótkie, zrozumiałe definicje pojęć z finansów i inwestowania.',
    url: `${BASE_URL}/slownik`,
    siteName: 'KisielFinanse',
  },
};

export default function SlownikPage() {
  const terms = getAllTermsSorted();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Słownik pojęć finansowych KisielFinanse',
    url: `${BASE_URL}/slownik`,
    hasDefinedTerm: terms.map((t) => ({
      '@type': 'DefinedTerm',
      name: t.term,
      description: t.short,
      url: `${BASE_URL}/slownik/${t.slug}`,
    })),
  };

  return (
    <>
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main style={{ maxWidth: 980, margin: '0 auto', padding: '80px 24px 120px' }}>

        <div style={{ marginBottom: 40 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            letterSpacing: '4px', margin: '0 0 16px', color: 'var(--text)',
          }}>
            SŁOWNIK <span style={{ color: ACCENT }}>POJĘĆ</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--muted)',
            lineHeight: 1.8, maxWidth: 640, margin: 0,
          }}>
            Krótkie, zrozumiałe definicje pojęć z finansów i inwestowania. Bez żargonu i bez ściemy.
            Hasła pojawiają się też automatycznie jako linki w artykułach.
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16,
        }}>
          {terms.map((t) => (
            <Link key={t.slug} href={`/slownik/${t.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{
                height: '100%', background: 'var(--surface)', border: '1px solid var(--border)',
                borderLeft: `3px solid ${ACCENT}`, padding: '18px 20px',
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.15rem', letterSpacing: '1px',
                  color: 'var(--text)', marginBottom: 8,
                }}>
                  {t.term}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--muted)',
                  lineHeight: 1.7,
                }}>
                  {t.short}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 48 }}>
          <Link href="/" style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', textDecoration: 'none',
          }}>
            ← Powrót do strony głównej
          </Link>
        </div>

      </main>
      <Footer />
    </>
  );
}
