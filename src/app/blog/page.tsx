import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';
import BlogList from '@/components/BlogList';
import NewsletterForm from '@/components/NewsletterForm';
import { getAllPosts } from '@/lib/posts';

const BASE_URL = 'https://kisielfinanse.pl';

// Odswiezaj co godzine - artykuly z przyszla data pojawia sie automatycznie
export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: 'Blog Finansowy - Trading, Inwestycje, Finanse' },
  description: 'Artykuly o tradingu, krypto, oszczedzaniu i geopolityce finansowej. Praktyczna wiedza bez sciemy - finanse ktore naprawde robia roznice.',
  keywords: [
    'edukacja finansowa', 'blog finansowy', 'trading artykuly', 'krypto poradnik',
    'oszczedzanie inwestowanie', 'geopolityka finanse', 'psychologia pieniedzy',
    'analiza rynku', 'wolnosc finansowa', 'jak inwestowac',
  ],
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    title: 'Blog Finansowy - Trading, Krypto, Oszczedzanie | KisielFinanse',
    description: 'Artykuly o tradingu, krypto, oszczedzaniu i geopolityce. Finanse bez sciemy.',
    url: `${BASE_URL}/blog`,
    siteName: 'KisielFinanse',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Blog Finansowy - KisielFinanse' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Finansowy - KisielFinanse',
    description: 'Trading, krypto, oszczedzanie, geopolityka. Finanse bez sciemy.',
    images: ['/og-image.png'],
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Blog',          item: `${BASE_URL}/blog` },
  ],
};

const schemaBlog = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Blog Finansowy KisielFinanse',
  description: 'Artykuly o tradingu, inwestycjach, oszczedzaniu i geopolityce finansowej.',
  url: `${BASE_URL}/blog`,
  inLanguage: 'pl-PL',
  publisher: {
    '@type': 'Organization',
    name: 'KisielFinanse',
    url: BASE_URL,
  },
  author: {
    '@type': 'Person',
    name: 'Mateusz Kisiel',
    url: `${BASE_URL}/o-mnie`,
  },
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const [posts, sp] = await Promise.all([getAllPosts(), searchParams]);
  const initialQuery = typeof sp.q === 'string' ? sp.q : '';

  return (
    <>
      <RevealOnScroll />
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBlog) }} />
      <main>
        <div className="blog-page">
          <h1 className="section-title reveal">
            BLOG<br />
            <span className="gradient-text-pp">FINANSOWY</span>
          </h1>
          <BlogList posts={posts} initialQuery={initialQuery} />

          {/* Newsletter pod lista artykulow */}
          <div style={{ maxWidth: 680, margin: '60px auto 80px', padding: '0 24px' }}>
            <NewsletterForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
