import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getPostBySlug, getAllSlugs } from '@/lib/posts';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

const tagClass: Record<string, string> = {
  strategia: 'tag-strategy',
  psychologia: 'tag-psychology',
  analiza: 'tag-analysis',
  'risk management': 'tag-risk',
  rynek: 'tag-rynek',
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.published) notFound();

  // Convert markdown to HTML
  const processed = await remark().use(remarkHtml).process(post.content);
  const contentHtml = processed.toString();

  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <div className="blog-post-hero">
          <Link
            href="/blog"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              letterSpacing: '1px',
              marginBottom: 32,
              transition: 'color 0.2s',
            }}
            className="back-link"
          >
            ← Wszystkie artykuły
          </Link>

          <span
            className={`blog-tag ${tagClass[post.tag?.toLowerCase()] ?? 'tag-strategy'}`}
            style={{ marginBottom: 20, display: 'block' }}
          >
            {post.tag}
          </span>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              letterSpacing: '1px',
              lineHeight: 1.05,
              marginBottom: 24,
            }}
          >
            {post.title}
          </h1>

          <div
            style={{
              display: 'flex',
              gap: 24,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--muted)',
            }}
          >
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime} czytania</span>
          </div>

          {/* Divider */}
          <div
            style={{
              marginTop: 48,
              height: 1,
              background: 'linear-gradient(90deg, var(--cyan), var(--purple), transparent)',
              opacity: 0.3,
            }}
          />
        </div>

        {/* Content */}
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </main>
      <Footer />
    </>
  );
}
