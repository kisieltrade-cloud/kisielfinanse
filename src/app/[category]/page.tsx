import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';
import BlogList from '@/components/BlogList';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getPostsByTag } from '@/lib/posts';
import { CATEGORIES, getCategoryBySlug } from '@/lib/categories';

// Odświeżaj co godzinę — nowe artykuły pojawią się automatycznie po dacie publikacji
export const revalidate = 3600;

const BASE_URL = 'https://kisielfinanse.pl';

export const dynamicParams = false;

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const config = getCategoryBySlug(slug);
  if (!config) return {};

  return {
    title: config.metaTitle,
    description: config.metaDesc,
    alternates: { canonical: `${BASE_URL}/${slug}` },
    openGraph: {
      title: config.metaTitle,
      description: config.metaDesc,
      url: `${BASE_URL}/${slug}`,
      type: 'website',
      siteName: 'KisielFinanse',
      locale: 'pl_PL',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: config.metaTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: config.metaTitle,
      description: config.metaDesc,
      images: ['/og-image.png'],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const config = getCategoryBySlug(slug);
  if (!config) notFound();

  const result = await getPostsByTag(slug);
  const posts = result?.posts ?? [];

  const countLabel =
    posts.length === 0 ? 'Artykuły wkrótce' :
    posts.length === 1 ? '1 artykuł' :
    posts.length <= 4  ? `${posts.length} artykuły` :
                         `${posts.length} artykułów`;

  const schemaBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: config.name, item: `${BASE_URL}/${slug}` },
    ],
  };

  const schemaCollectionPage = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: config.metaTitle,
    description: config.metaDesc,
    url: `${BASE_URL}/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'KisielFinanse',
      url: BASE_URL,
    },
  };

  return (
    <>
      <RevealOnScroll />
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaCollectionPage) }}
      />

      <main>
        <div className="blog-page">

          {/* Breadcrumbs */}
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 0' }}>
            <Breadcrumbs items={[
              { label: 'KisielFinanse', href: '/' },
              { label: config.name },
            ]} />
          </div>

          {/* Category hero */}
          <div
            className="reveal"
            style={{
              maxWidth: 1100,
              margin: '0 auto',
              padding: 'clamp(40px, 6vw, 72px) 24px clamp(32px, 4vw, 48px)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                color: config.color,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginBottom: 16,
                padding: '4px 10px',
                border: `1px solid ${config.color}`,
                opacity: 0.8,
              }}
            >
              kategoria
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.4rem, 7vw, 5rem)',
                letterSpacing: '4px',
                margin: '0 0 20px',
                color: config.color,
                lineHeight: 1,
                textTransform: 'uppercase',
              }}
            >
              {config.name}
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(0.78rem, 1.5vw, 0.92rem)',
                color: 'var(--muted)',
                lineHeight: 1.85,
                maxWidth: 680,
                margin: '0 0 24px',
              }}
            >
              {config.longDesc}
            </p>

            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'var(--muted)',
                letterSpacing: '1px',
              }}
            >
              {countLabel}
            </span>
          </div>

          {/* Article list or empty state */}
          {posts.length > 0 ? (
            <BlogList posts={posts} />
          ) : (
            <div
              className="reveal"
              style={{
                maxWidth: 1100,
                margin: '64px auto',
                padding: '0 24px',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  color: 'var(--muted)',
                  lineHeight: 1.8,
                }}
              >
                Artykuły z tej kategorii są w przygotowaniu.
                <br />
                Wróć wkrótce — lub sprawdź inne tematy.
              </p>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
