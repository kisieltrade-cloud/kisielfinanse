import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';
import BlogList from '@/components/BlogList';
import { getAllPosts } from '@/lib/posts';

const OG_IMAGE = { url: '/og-image.png', width: 1200, height: 630, alt: 'Blog Tradingowy - KisielFinanse' };

export const metadata: Metadata = {
  title: 'Blog Finansowy - Trading, Krypto, Oszczędzanie | KisielFinanse',
  description: 'Artykuły o tradingu, krypto, oszczędzaniu i geopolityce finansowej. Praktyczna wiedza bez ściemy - finanse które naprawdę robią różnicę.',
  keywords: [
    'edukacja finansowa', 'blog finansowy', 'trading artykuły', 'krypto poradnik',
    'oszczędzanie inwestowanie', 'geopolityka finanse', 'psychologia pieniędzy',
    'analiza rynku', 'wolność finansowa', 'jak inwestować',
  ],
  alternates: { canonical: 'https://kisielfinanse.pl/blog' },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    title: 'Blog Finansowy - Trading, Krypto, Oszczędzanie | KisielFinanse',
    description: 'Artykuły o tradingu, krypto, oszczędzaniu i geopolityce. Finanse bez ściemy.',
    url: 'https://kisielfinanse.pl/blog',
    siteName: 'KisielFinanse',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Edukacja Finansowa - KisielFinanse',
    description: 'Trading, krypto, oszczędzanie, geopolityka. Finanse bez ściemy.',
    images: ['/og-image.png'],
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <RevealOnScroll />
      <Nav />
      <main>
        <div className="blog-page">
          <h1 className="section-title reveal">
            WSZYSTKIE
            <br />
            <span className="gradient-text-pp">ARTYKUŁY</span>
          </h1>
          <BlogList posts={posts} />
        </div>
      </main>
      <Footer />
    </>
  );
}
