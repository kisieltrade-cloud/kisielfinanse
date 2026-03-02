import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { TERMS } from '@/lib/slownik-terms';
export const dynamicParams = true;

const BASE_URL = 'https://nysethtrading.pl';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return TERMS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const term = TERMS.find((t) => t.slug && t.slug.trim().toLowerCase() === slug.trim().toLowerCase());
  if (!term) return {};
  return {
    title: `${term.term} — co to jest? | Słownik Tradingowy NysethTrading`,
    description: term.short,
    alternates: { canonical: `${BASE_URL}/slownik/${slug}` },
    openGraph: {
      title: `${term.term} — definicja tradingowa`,
      description: term.short,
      url: `${BASE_URL}/slownik/${slug}`,
    },
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  'Ogólne':          '#00f5d4',
  'Forex':           '#f5c518',
  'Krypto':          '#b14aed',
  'Futures/Indeksy': '#ff2d78',
};

export default async function SlownikTermPage({ params }: Props) {
  const { slug } = params;
  const term = TERMS.find((t) => t.slug && t.slug.trim().toLowerCase() === slug.trim().toLowerCase());
  if (!term) notFound();

  const color = CATEGORY_COLORS[term.category] ?? '#00f5d4';
  const related = TERMS.filter((t) => t.category === term.category && t.slug !== slug).slice(0, 4);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.term,
    description: term.full,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Słownik Tradingowy NysethTrading',
      url: `${BASE_URL}/slownik`,
    },
    url: `${BASE_URL}/slownik/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Nav />
      <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px 120px' }}>

          {/* Breadcrumb */}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', marginBottom: 32, display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link href="/slownik" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Słownik</Link>
            <span>/</span>
            <span style={{ color: color }}>{term.category}</span>
            <span>/</span>
            <span style={{ color: 'var(--text)' }}>{term.term}</span>
          </div>

          {/* Category badge */}
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '2px',
            color: color, background: `${color}18`, border: `1px solid ${color}40`,
            padding: '4px 12px', marginBottom: 20, display: 'inline-block',
          }}>
            {term.category.toUpperCase()}
          </span>

          {/* Term */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            letterSpacing: '3px', margin: '16px 0 24px', color: '#e8edf5', lineHeight: 1.1,
          }}>
            {term.term.toUpperCase()}
          </h1>

          {/* Short */}
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '1rem',
            color: color, lineHeight: 1.7, margin: '0 0 40px',
            borderLeft: `3px solid ${color}`, paddingLeft: 20,
          }}>
            {term.short}
          </p>

          <div style={{ height: 1, background: 'var(--border)', marginBottom: 40 }} />

          {/* Full definition */}
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
            color: '#8a9ab5', lineHeight: 2, marginBottom: 60,
          }}>
            {term.full}
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--cyan)', letterSpacing: '3px', marginBottom: 20 }}>
                // podobne pojęcia
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/slownik/${r.slug}`}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '14px 16px', background: '#0a0f1a', border: '1px solid #0d1a26',
                      textDecoration: 'none',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#e8edf5' }}>{r.term}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back */}
          <div style={{ marginTop: 48 }}>
            <Link href="/slownik" style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '2px',
              color: 'var(--muted)', textDecoration: 'none', border: '1px solid var(--border)',
              padding: '10px 20px', display: 'inline-block',
            }}>
              ← WRÓĆ DO SŁOWNIKA
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}