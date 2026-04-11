import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';
import BlogList from '@/components/BlogList';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artykuły o tradingu, psychologii rynku, strategiach i zarządzaniu ryzykiem.',
  keywords: ['blog tradingowy', 'artykuły trading', 'psychologia tradingu', 'strategie forex'],
  alternates: { canonical: 'https://nysethtrading.pl/blog' },
  openGraph: {
    title: 'Blog — NysethTrading',
    description: 'Artykuły o tradingu, psychologii rynku, strategiach i zarządzaniu ryzykiem.',
    url: 'https://nysethtrading.pl/blog',
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
