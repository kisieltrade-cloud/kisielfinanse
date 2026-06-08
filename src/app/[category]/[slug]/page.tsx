import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
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
import remarkGlossary from '@/lib/remark-glossary';
import TableOfContents from '@/components/TableOfContents';
import TableOfContentsMobile from '@/components/TableOfContentsMobile';
import { extractTocItems, slugifyHeading } from '@/lib/toc';
import ShareButtons from '@/components/ShareButtons';
import ReadTimeRing from '@/components/ReadTimeRing';
import Breadcrumbs from '@/components/Breadcrumbs';
import AuthorBox from '@/components/AuthorBox';
import NextArticleBar from '@/components/NextArticleBar';
import NewsletterForm from '@/components/NewsletterForm';
import RelatedCalcs from '@/components/RelatedCalcs';
import Comments from '@/components/Comments';

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
      title: post.metaTitle ?? post.title,
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

  const processed = await remark().use(remarkGfm).use(remarkGlossary).use(remarkHtml, { sanitize: false }).process(post.content);
  const rawHtml = processed.toString();

  const contentHtml = rawHtml.replace(
    /<h([2-4])>(.*?)<\/h\1>/gi,
    (_, level, inner) => `<h${level} id="${slugifyHeading(inner)}">${inner}</h${level}>`,
  );

  // Kafelki "Przeczytaj też" wstawiane między sekcje (po 2. i 5. nagłówku H2).
  // Najpierw artykuły z tej samej kategorii, potem pozostałe; bez bieżącego.
  const sameTag = published.filter((p) => p.tag === post.tag && p.slug !== slug);
  const otherTag = published.filter((p) => p.tag !== post.tag && p.slug !== slug);
  const suggestions = [...sameTag, ...otherTag].slice(0, 2);

  const calloutHtml = (p: typeof published[number]) =>
    `<aside class="inline-related"><span class="inline-related-label">Przeczytaj też</span>` +
    `<a href="${postUrl(p)}" class="inline-related-link"><span>${p.title}</span>` +
    `<span class="inline-related-arrow" aria-hidden="true">&#8594;</span></a></aside>`;

  let h2seen = 0;
  const contentWithRelated = contentHtml.replace(/<h2\b/gi, (m) => {
    h2seen += 1;
    if (h2seen === 2 && suggestions[0]) return calloutHtml(suggestions[0]) + m;
    if (h2seen === 5 && suggestions[1]) return calloutHtml(suggestions[1]) + m;
    return m;
  });

  const tocItems = extractTocItems(post.content);
  const t = TAG_CONFIG[category] ?? TAG_CONFIG['trading'];
  const canonicalUrl = `${BASE_URL}/${category}/${slug}`;
  const updatedDisplay = post.updatedISO
    ? new Date(post.updatedISO).toLocaleDateString('pl-PL', { day: '2-digit', month: 'long', year: 'numeric' })
    : null;

  // Artykuły o inwestowaniu/oszczędzaniu dostają kontekstowy callout do symulatora
  const investThemed =
    post.tag === 'Inwestycje' ||
    /procent-skladany|dca|etf|inwestow|dywersyfik|fire|ike|ppk|obligacj|lokat|oszczed|poduszka/.test(slug);

  // Newsy mają datę z godziną (np. 2026-06-09T10:00) — oznaczamy je jako NewsArticle,
  // co jest mocniejszym sygnałem pod Google News/Discover. Materiały evergreen
  // (sama data YYYY-MM-DD) zostają BlogPosting.
  const isNews = post.dateISO.includes('T');
  const schemaArticle = {
    '@context': 'https://schema.org',
    '@type': isNews ? 'NewsArticle' : 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.dateISO,
    dateModified: post.updatedISO ?? post.dateISO,
    author: {
      '@type': 'Person',
      name: 'Mateusz Kisiel',
      url: `${BASE_URL}/o-mnie`,
      sameAs: [
        'https://x.com/Kisielfinanse',
        'https://www.youtube.com/@Kisielfinanse',
        'https://www.instagram.com/kisielfinanse',
      ],
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
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--muted)',
          }}>
            <Link href="/o-mnie" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 700 }}>
              Mateusz Kisiel
            </Link>
            <span>·</span>
            <span>{post.date}</span>
            {updatedDisplay && (
              <>
                <span>·</span>
                <span style={{ color: t.color }}>Zaktualizowano {updatedDisplay}</span>
              </>
            )}
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
              aspectRatio: '16 / 9',
              borderRadius: 12,
              overflow: 'hidden',
              border: '1px solid var(--border)',
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
              dangerouslySetInnerHTML={{ __html: contentWithRelated }}
            />
          </div>

          {/* TOC sidebar — sticky through entire article text */}
          {tocItems.length >= 2 && (
            <aside className="blog-toc-aside">
              <TableOfContents items={tocItems} />
            </aside>
          )}
        </div>

        {/* Sprawdź również: symulator — w artykułach inwestycyjnych */}
        {investThemed && (
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 40px' }}>
            <Link href="/symulator-inwestycji" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
              padding: '18px 22px', borderRadius: 14, textDecoration: 'none',
              background: 'rgba(201,162,39,0.06)', border: '1px solid rgba(201,162,39,0.25)', borderLeft: '3px solid #c9a227',
            }}>
              <span>
                <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#c9a227', marginBottom: 6 }}>
                  Sprawdź również
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
                  Symulator inwestycji - ile byś zarobił, inwestując regularnie?
                </span>
              </span>
              <span style={{ color: '#c9a227', fontSize: '1.3rem', flexShrink: 0 }} aria-hidden="true">→</span>
            </Link>
          </div>
        )}

        {/* Komentarze — od razu pod treścią artykułu */}
        <Comments slug={slug} />

        {/* Powiązane kalkulatory */}
        <RelatedCalcs tag={post.tag} slug={slug} />

        {/* Related posts — zaraz po tresci, przed autorem i komentarzami */}
        <RelatedPosts
          currentSlug={slug}
          currentTag={post.tag}
          allPosts={allPosts}
        />

        {/* Author, newsletter, comments — outside flex layout so TOC stays sticky above */}
        <AuthorBox />

        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 40px' }}>
          <NewsletterForm />
        </div>

        <ShareButtons title={post.title} url={`/${category}/${slug}`} />

        {/* Next article bar */}
        {nextPost && nextPost.slug !== slug && (
          <NextArticleBar href={postUrl(nextPost)} title={nextPost.title} />
        )}
      </main>
      <Footer />
    </>
  );
}
