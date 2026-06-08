import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { GLOSSARY, getTermBySlug } from '@/lib/glossary';
import { articlesForTerm } from '@/lib/glossary-articles';

const BASE_URL = 'https://kisielfinanse.pl';
const ACCENT = '#c9a227';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return GLOSSARY.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const term = getTermBySlug(slug);
  if (!term) return {};
  const title = `${term.term} - co to jest? Definicja`;
  return {
    title: { absolute: `${title} | KisielFinanse` },
    description: term.short.length > 155 ? term.short.slice(0, 152) + '...' : term.short,
    robots: { index: true, follow: true },
    alternates: { canonical: `${BASE_URL}/slownik/${slug}` },
    openGraph: {
      title: `${title} | KisielFinanse`,
      description: term.short,
      url: `${BASE_URL}/slownik/${slug}`,
      siteName: 'KisielFinanse',
      images: [{ url: '/slownik/opengraph-image', width: 1200, height: 630, alt: `${term.term} - słownik finansowy KisielFinanse` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | KisielFinanse`,
      description: term.short,
      images: ['/slownik/opengraph-image'],
    },
  };
}

export default async function TermPage({ params }: Props) {
  const { slug } = await params;
  const term = getTermBySlug(slug);
  if (!term) notFound();

  const related = (term.related ?? [])
    .map((s) => getTermBySlug(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const relatedArticles = await articlesForTerm(term.aliases);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.term,
    description: term.short,
    inDefinedTermSet: `${BASE_URL}/slownik`,
    url: `${BASE_URL}/slownik/${slug}`,
  };

  return (
    <>
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '80px 24px 120px' }}>

        {/* Breadcrumb */}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', marginBottom: 28 }}>
          <Link href="/slownik" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Słownik</Link>
          <span style={{ margin: '0 8px', color: 'var(--border)' }}>/</span>
          <span style={{ color: ACCENT }}>{term.term}</span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 5vw, 3rem)',
          letterSpacing: '2px', margin: '0 0 20px', color: 'var(--text)',
        }}>
          {term.term}
        </h1>

        {/* Definicja (lead) */}
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'var(--text)',
          lineHeight: 1.7, margin: '0 0 28px', paddingLeft: 16, borderLeft: `3px solid ${ACCENT}`,
        }}>
          {term.short}
        </p>

        {/* Rozwinięcie */}
        {term.body.map((p, i) => (
          <p key={i} style={{
            fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--muted)',
            lineHeight: 1.85, margin: '0 0 18px',
          }}>
            {p}
          </p>
        ))}

        {/* Powiązany kalkulator */}
        {term.calc && (
          <div style={{ marginTop: 28 }}>
            <Link href={term.calc.href} style={{
              display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: '0.74rem',
              letterSpacing: '1px', color: '#030508', background: ACCENT,
              padding: '10px 20px', textDecoration: 'none', fontWeight: 700,
            }}>
              {term.calc.label} →
            </Link>
          </div>
        )}

        {/* Powiązane pojęcia */}
        {related.length > 0 && (
          <div style={{ marginTop: 48, borderTop: '1px solid var(--border)', paddingTop: 28 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '2px',
              color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 14,
            }}>
              Powiązane pojęcia
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {related.map((r) => (
                <Link key={r.slug} href={`/slownik/${r.slug}`} style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text)',
                  border: '1px solid var(--border)', padding: '6px 14px', textDecoration: 'none',
                }}>
                  {r.term}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Artykuły na ten temat */}
        {relatedArticles.length > 0 && (
          <div style={{ marginTop: 48, borderTop: '1px solid var(--border)', paddingTop: 28 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '2px',
              color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 14,
            }}>
              Artykuły na ten temat
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {relatedArticles.map((a) => (
                <li key={a.slug}>
                  <Link href={a.url} style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text)',
                    textDecoration: 'none', display: 'inline-flex', alignItems: 'baseline', gap: 8,
                  }}>
                    <span style={{ color: ACCENT }}>→</span>
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ marginTop: 48 }}>
          <Link href="/slownik" style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', textDecoration: 'none',
          }}>
            ← Wróć do słownika
          </Link>
        </div>

      </main>
      <Footer />
    </>
  );
}
