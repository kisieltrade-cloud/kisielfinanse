import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Image from 'next/image';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ReadingProgress from '@/components/ReadingProgress';
import RelatedPosts from '@/components/RelatedPosts';
import BlogImageLightbox from '@/components/BlogImageLightbox';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { tagToSlug, postUrl } from '@/lib/url';
import { getCategoryBySlug } from '@/lib/categories';
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
import GiscusComments from '@/components/GiscusComments';
import ViewCounter from '@/components/ViewCounter';
import NewsletterForm from '@/components/NewsletterForm';

// Odświeżaj co godzinę — przyszłe artykuły pojawią się automatycznie po dacie publikacji
export const revalidate = 3600;

const BASE_URL = 'https://kisielfinanse.pl';

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

// true = Next.js może renderować artykuły dynamicznie jeśli nie były w buildzie
// (potrzebne dla artykułów zaplanowanych na przyszłość — pojawią się bez pełnego rebuildu)
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    category: tagToSlug(post.tag),
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const canonicalUrl = `${BASE_URL}/${category}/${slug}`;

  // FIX 1+2: jeśli w MDX jest metaTitle → { absolute } pomija globalny template z layout.tsx
  // (bez tego: "Title | KisielFinanse | KisielFinanse")
  // jeśli metaTitle brak → samo post.title → template dopiszuje "| KisielFinanse" raz
  const htmlTitle = post.metaTitle
    ? { absolute: post.metaTitle }
    : post.title;

  // FIX 2: custom metaDescription ma priorytet nad excerpt; obie wersje obcięte do 155 znaków
  const htmlDesc = post.metaDescription
    ? (post.metaDescription.length > 155 ? post.metaDescription.slice(0, 152) + '...' : post.metaDescription)
    : (post.excerpt.length > 155 ? post.excerpt.slice(0, 152) + '...' : post.excerpt);

  // OG/Twitter description może być dłuższy (Facebook akceptuje ~200 znaków)
  const ogDesc = post.metaDescription || post.excerpt;

  // FIX 4: OG image — dodane alt (wymagane przez wiele platform); fallback ma wymiary
  const ogImageUrl = post.image
    ? (post.image.startsWith('http') ? post.image : `${BASE_URL}${post.image}`)
    : `${BASE_URL}/og-image.png`;
  const ogImages = post.image
    ? [{ url: ogImageUrl, alt: post.title }]
    : [{ url: ogImageUrl, width: 1200, height: 630, alt: `KisielFinanse – ${post.title}` }];

  return {
    title: htmlTitle,
    description: htmlDesc,
    keywords: [...(post.keywords ?? []), post.tag.toLowerCase(), 'KisielFinanse', 'finanse', 'edukacja finansowa'],
    authors: [{ name: 'Mateusz Kisiel', url: `${BASE_URL}/o-mnie` }],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.title,   // OG title: sam tytuł artykułu, bez "| KisielFinanse"
      description: ogDesc,
      url: canonicalUrl,
      type: 'article',
      locale: 'pl_PL',
      publishedTime: post.dateISO,
      modifiedTime: post.updatedISO ?? post.dateISO,
      authors: ['Mateusz Kisiel'], // FIX 5: pełne imię i nazwisko
      tags: [post.tag],
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: ogDesc,
    },
  };
}

const TAG_CONFIG: Record<string, { color: string; bg: string }> = {
  trading:     { color: '#c9a227', bg: 'rgba(201,162,39,0.10)'  },
  inwestycje:  { color: '#f5c518', bg: 'rgba(245,197,24,0.10)'  },
  pieniadze:   { color: '#e8963a', bg: 'rgba(232,150,58,0.10)'  },
  psychologia: { color: '#a78bfa', bg: 'rgba(167,139,250,0.10)' },
  gospodarka:  { color: '#ff2d78', bg: 'rgba(255,45,120,0.10)'  },
};

export default async function ArticlePage({ params }: Props) {
  const { category, slug } = await params;
  const [post, allPosts] = await Promise.all([
    getPostBySlug(slug),
    getAllPosts(),
  ]);

  if (!post || !post.published) notFound();

  // Jeśli artykuł należy do innej kategorii — przekieruj na właściwy URL
  const correctCategory = tagToSlug(post.tag);
  if (correctCategory !== category) {
    permanentRedirect(`/${correctCategory}/${slug}`);
  }

  const catConfig = getCategoryBySlug(category);

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
  const t = TAG_CONFIG[category] ?? TAG_CONFIG['trading'];
  const canonicalUrl = `${BASE_URL}/${category}/${slug}`;

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
      sameAs: ['https://kisielfinanse.pl', 'https://x.com/Kisielfinanse'],
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
    url: canonicalUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
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
      { '@type': 'ListItem', position: 2, name: catConfig?.name ?? category, item: `${BASE_URL}/${category}` },
      { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl },
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
            { label: catConfig?.name ?? category, href: `/${category}` },
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
            <span>·</span>
            <ViewCounter slug={slug} increment />
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

        {/* Article body: sticky TOC + content in flex row */}
        <div className="blog-article-layout">
          <div className="blog-article-body">
            {/* Content */}
            <BlogImageLightbox />
            <div
              className="blog-post-content"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            {/* Author */}
            <AuthorBox />

            {/* Newsletter */}
            <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 40px' }}>
              <NewsletterForm />
            </div>

            {/* Share buttons */}
            <ShareButtons title={post.title} url={`/${category}/${slug}`} />

            {/* Comments */}
            <GiscusComments slug={slug} />
          </div>

          {/* TOC sidebar — sticky, ends with article body */}
          {tocItems.length >= 2 && (
            <aside className="blog-toc-aside">
              <TableOfContents items={tocItems} />
            </aside>
          )}
        </div>

        {/* Related posts */}
        <RelatedPosts
          currentSlug={slug}
          currentTag={post.tag}
          allPosts={allPosts}
        />

        {/* Next article bar */}
        {nextPost && nextPost.slug !== slug && (
          <NextArticleBar href={postUrl(nextPost)} title={nextPost.title} />
        )}
      </main>
      <Footer />
    </>
  );
}
