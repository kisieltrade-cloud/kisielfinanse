import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ReadingProgress from '@/components/ReadingProgress';
import RelatedPosts from '@/components/RelatedPosts';
import BlogImageLightbox from '@/components/BlogImageLightbox';
import { getPostBySlug, getAllSlugs, getAllPosts } from '@/lib/posts';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

const BASE_URL = 'https://nysethtrading.pl';

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
    title: `${post.title} | NysethTrading Blog`,
    description: post.excerpt,
    keywords: ['trading', 'day trading', post.tag.toLowerCase(), 'nysethtrading', 'forex', 'futures'],
    authors: [{ name: 'Mateusz Nyseth', url: `${BASE_URL}/o-mnie` }],
    alternates: { canonical: `${BASE_URL}/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${BASE_URL}/blog/${slug}`,
      type: 'article',
      locale: 'pl_PL',
      publishedTime: post.dateISO,
      modifiedTime: post.dateISO,
      authors: ['Mateusz Nyseth'],
      tags: ['trading', post.tag],
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: ['/og-image.png'],
    },
  };
}

const TAG_CONFIG: Record<string, { color: string; bg: string }> = {
  strategia:         { color: '#00f5d4', bg: 'rgba(0,245,212,0.08)' },
  psychologia:       { color: '#b14aed', bg: 'rgba(177,74,237,0.08)' },
  analiza:           { color: '#f5c518', bg: 'rgba(245,197,24,0.08)' },
  'risk management': { color: '#ff2d78', bg: 'rgba(255,45,120,0.08)' },
  edukacja:          { color: '#00f5d4', bg: 'rgba(0,245,212,0.08)' },
  rynek:             { color: '#f5c518', bg: 'rgba(245,197,24,0.08)' },
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getPostBySlug(slug),
    getAllPosts(),
  ]);

  if (!post || !post.published) notFound();

  const processed = await remark().use(remarkHtml).process(post.content);
  const contentHtml = processed.toString();

  const t = TAG_CONFIG[post.tag?.toLowerCase()] ?? TAG_CONFIG['edukacja'];

  const schemaArticle = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.dateISO,
    dateModified: post.dateISO,
    author: {
      '@type': 'Person',
      name: 'Mateusz Nyseth',
      url: `${BASE_URL}/o-mnie`,
      sameAs: ['https://nysethtrading.pl', 'https://x.com/nysethtrading'],
    },
    publisher: {
      '@type': 'Organization',
      name: 'NysethTrading',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.svg`,
        width: 200,
        height: 60,
      },
    },
    url: `${BASE_URL}/blog/${slug}`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/blog/${slug}` },
    inLanguage: 'pl-PL',
    keywords: ['trading', 'day trading', 'forex', 'krypto', post.tag, 'nysethtrading'],
    articleSection: post.tag,
    image: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/og-image.png`,
      width: 1200,
      height: 630,
    },
  };

  const schemaBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'NysethTrading', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${BASE_URL}/blog/${slug}` },
    ],
  };

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />
      <Nav />
      <main>
        {/* Hero */}
        <div className="blog-post-hero">
          <Link href="/blog" className="back-link">
            ← Wszystkie artykuły
          </Link>

          <span
            className="blog-tag-v2"
            style={{ color: t.color, background: t.bg, marginBottom: 24, display: 'inline-block' }}
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

          <div style={{
            display: 'flex',
            gap: 24,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--muted)',
          }}>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime} czytania</span>
          </div>

          <div style={{
            marginTop: 48,
            height: 2,
            background: `linear-gradient(90deg, ${t.color}, var(--purple), transparent)`,
            opacity: 0.5,
          }} />
        </div>

        {/* Content */}
        <BlogImageLightbox />
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Related posts */}
        <RelatedPosts
          currentSlug={slug}
          currentTag={post.tag}
          allPosts={allPosts}
        />
      </main>
      <Footer />
    </>
  );
}
