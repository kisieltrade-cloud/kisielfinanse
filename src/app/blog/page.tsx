import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artykuły o tradingu, psychologii rynku, strategiach i zarządzaniu ryzykiem.',
};

const tagClass: Record<string, string> = {
  strategia: 'tag-strategy',
  psychologia: 'tag-psychology',
  analiza: 'tag-analysis',
  'risk management': 'tag-risk',
  rynek: 'tag-rynek',
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <Nav />
      <main>
        <div className="blog-page">
          <div className="section-label">// wiedza i analiza</div>
          <h1 className="section-title">
            WSZYSTKIE
            <br />
            <span className="gradient-text-pp">ARTYKUŁY</span>
          </h1>

          {posts.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
              Brak artykułów. Dodaj pliki .mdx do src/content/blog/
            </p>
          ) : (
            <div className="blog-all-grid">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
                  <span
                    className={`blog-tag ${tagClass[post.tag?.toLowerCase()] ?? 'tag-strategy'}`}
                  >
                    {post.tag}
                  </span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="blog-meta">
                    <span className="blog-date">{post.date}</span>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.65rem',
                          color: 'var(--muted)',
                        }}
                      >
                        {post.readTime}
                      </span>
                      <div className="blog-arrow">↗</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
