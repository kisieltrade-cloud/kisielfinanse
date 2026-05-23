import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ReadingProgress from '@/components/ReadingProgress';
import RelatedPosts from '@/components/RelatedPosts';
import BlogImageLightbox from '@/components/BlogImageLightbox';
import { getPostBySlug, getAllSlugs, getAllPosts } from '@/lib/posts';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import TableOfContents from '@/components/TableOfContents';
import TableOfContentsMobile from '@/components/TableOfContentsMobile';
import { extractTocItems, slugifyHeading } from '@/lib/toc';
import ShareButtons from '@/components/ShareButtons';
import ReadTimeRing from '@/components/ReadTimeRing';
import Breadcrumbs from '@/components/Breadcrumbs';
import AuthorBox from '@/components/AuthorBox';
import NextArticleBar from '@/components/NextArticleBar';

const BASE_URL = 'https://kisielfinanse.pl';

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
    title: `${post.title} | KisielFinanse Blog`,
    description: post.excerpt.length > 155 ? post.excerpt.slice(0, 152) + '...' : post.excerpt,
    keywords: [...(post.keywords ?? []), post.tag.toLowerCase(), 'KisielFinanse', 'finanse', 'edukacja finansowa'],
    authors: [{ name: 'Mateusz Kisiel', url: `${BASE_URL}/o-mnie` }],
    alternates: { canonical: `${BASE_URL}/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${BASE_URL}/blog/${slug}`,
      type: 'article',
      locale: 'pl_PL',
      publishedTime: post.dateISO,
      modifiedTime: post.updatedISO ?? post.dateISO,
      authors: ['Mateusz'],
      tags: [post.tag],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
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
  krypto:            { color: '#f5a623', bg: 'rgba(245,166,35,0.08)' },
  oszczędzanie:      { color: '#00f5d4', bg: 'rgba(0,245,212,0.08)' },
  geopolityka:       { color: '#ff2d78', bg: 'rgba(255,45,120,0.08)' },
  trading:           { color: '#00f5d4', bg: 'rgba(0,245,212,0.08)' },
  finanse:           { color: '#b14aed', bg: 'rgba(177,74,237,0.08)' },
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getPostBySlug(slug),
    getAllPosts(),
  ]);

  if (!post || !post.published) notFound();

  const published = allPosts.filter(p => p.published);
  const currentIndex = published.findIndex(p => p.slug === slug);
  const nextPost = published[(currentIndex + 1) % published.length];

  const processed = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(post.content);
  const rawHtml = processed.toString();

  const contentHtml = rawHtml.replace(
    /<h([2-4])>(.*?)<\/h\1>/gi,
    (_, level, inner) => `<h${level} id="${slugifyHeading(inner)}">${inner}</h${level}>`,
  );

  const tocItems = extractTocItems(post.content);

  const t = TAG_CONFIG[post.tag?.toLowerCase()] ?? TAG_CONFIG['edukacja'];

  const schemaArticle = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.dateISO,
    dateModified: post.updatedISO ?? post.dateISO,
    author: {
      '@type': 'Person',
      name: 'Mateusz Kisiel',
      url: `${BASE_URL}/o-mnie`,
      sameAs: ['https://kisielfinanse.pl', 'https://x.com/KisielFinanse'],
    },
    publisher: {
      '@type': 'Organization',
      name: 'KisielFinanse',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
        width: 200,
        height: 60,
      },
    },
    url: `${BASE_URL}/blog/${slug}`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/blog/${slug}` },
    inLanguage: 'pl-PL',
    keywords: [...(post.keywords ?? []), post.tag, 'KisielFinanse', 'finanse', 'edukacja finansowa'].join(', '),
    articleSection: post.tag,
    image: post.image
      ? { '@type': 'ImageObject', url: post.image.startsWith('http') ? post.image : `${BASE_URL}${post.image}` }
      : { '@type': 'ImageObject', url: `${BASE_URL}/og-image.png`, width: 1200, height: 630 },
  };

  const schemaBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${BASE_URL}/blog/${slug}` },
    ],
  };

  const schemaFaq = post.faq && post.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  } : null;

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
      {schemaFaq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }}
        />
      )}
      <Nav />
      <main>
        {/* Hero */}
        <div className="blog-post-hero">
          <Breadcrumbs items={[
            { label: 'KisielFinanse', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: post.title },
          ]} />

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
            <ReadTimeRing readTime={post.readTime} size={38} />
          </div>

          <div style={{
            marginTop: 48,
            height: 2,
            background: `linear-gradient(90deg, ${t.color}, var(--purple), transparent)`,
            opacity: 0.5,
          }} />
        </div>

        {/* Cover image */}
        {post.image && (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 40px' }}>
            <div style={{
              position: 'relative',
              width: '100%',
              height: 460,
              borderRadius: 12,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 860px) 100vw, 860px"
              />
            </div>
          </div>
        )}

        {/* Mobile TOC */}
        {tocItems.length >= 2 && (
          <TableOfContentsMobile items={tocItems} />
        )}

        {/* Content */}
        <BlogImageLightbox />
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Author */}
        <AuthorBox />

        {/* Share buttons */}
        <ShareButtons title={post.title} slug={slug} />

        {/* TOC sidebar */}
        {tocItems.length >= 2 && (
          <aside className="blog-toc-aside">
            <TableOfContents items={tocItems} />
          </aside>
        )}

        {/* Related posts */}
        <RelatedPosts
          currentSlug={slug}
          currentTag={post.tag}
          allPosts={allPosts}
        />

        {/* Next article bar */}
        {nextPost && nextPost.slug !== slug && (
          <NextArticleBar slug={nextPost.slug} title={nextPost.title} />
        )}
      </main>
      <Footer />
    </>
  );
}
