import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';
import BlogList from '@/components/BlogList';
import { getAllPosts } from '@/lib/posts';

const OG_IMAGE = { url: '/og-image.png', width: 1200, height: 630, alt: 'Blog Tradingowy — NysethTrading' };

export const metadata: Metadata = {
  title: 'Blog Tradingowy — Strategie, Psychologia, Analiza Rynku | NysethTrading',
  description: 'Artykuły o day tradingu, psychologii rynku, strategiach i zarządzaniu ryzykiem. Praktyczna wiedza tradera z 9-letnim doświadczeniem. Forex, futures, krypto.',
  keywords: [
    'blog tradingowy', 'artykuły trading', 'psychologia tradingu', 'strategie forex',
    'zarządzanie ryzykiem trading', 'day trading poradnik', 'scalping artykuły',
    'analiza techniczna blog', 'edukacja trading', 'jak zacząć trading',
  ],
  alternates: { canonical: 'https://nysethtrading.pl/blog' },
  openGraph: {
    title: 'Blog Tradingowy — Strategie, Psychologia, Analiza | NysethTrading',
    description: 'Praktyczna wiedza tradera z 9-letnim doświadczeniem. Strategie, psychologia, zarządzanie ryzykiem.',
    url: 'https://nysethtrading.pl/blog',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Tradingowy — NysethTrading',
    description: 'Strategie, psychologia, analiza rynku. Praktyczna wiedza bez ściemy.',
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
          <div className="section-label reveal">// wiedza i analiza</div>
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
