import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';
import BlogList from '@/components/BlogList';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getAllTags, getPostsByTag } from '@/lib/posts';

const BASE_URL = 'https://kisielfinanse.pl';

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map(({ slug }) => ({ tag: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag: tagSlug } = await params;
  const result = await getPostsByTag(tagSlug);
  if (!result) return {};

  const { tag } = result;
  const capitalized = tag.charAt(0).toUpperCase() + tag.slice(1);

  return {
    title: `${capitalized} - Artykuły | KisielFinanse`,
    description: `Artykuły o tematyce ${tag} na KisielFinanse. Praktyczna wiedza finansowa bez ściemy.`,
    keywords: [tag, 'KisielFinanse', 'edukacja finansowa', `blog ${tag}`, `artykuły ${tag}`],
    alternates: { canonical: `${BASE_URL}/blog/tag/${tagSlug}` },
    openGraph: {
      title: `${capitalized} | KisielFinanse`,
      description: `Artykuły o ${tag} — praktyczna edukacja finansowa.`,
      url: `${BASE_URL}/blog/tag/${tagSlug}`,
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
  };
}

export default async function TagPage({ params }: Props) {
  const { tag: tagSlug } = await params;
  const result = await getPostsByTag(tagSlug);
  if (!result) notFound();

  const { posts, tag } = result;
  const capitalized = tag.charAt(0).toUpperCase() + tag.slice(1);

  const schemaBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog',          item: `${BASE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: capitalized,     item: `${BASE_URL}/blog/tag/${tagSlug}` },
    ],
  };

  return (
    <>
      <RevealOnScroll />
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />
      <main>
        <div className="blog-page">
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 0' }}>
            <Breadcrumbs items={[
              { label: 'KisielFinanse', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: capitalized },
            ]} />
          </div>

          <h1 className="section-title reveal">
            {capitalized.toUpperCase()}
            <br />
            <span className="gradient-text-pp">— {posts.length} {posts.length === 1 ? 'artykuł' : posts.length < 5 ? 'artykuły' : 'artykułów'}</span>
          </h1>

          <BlogList posts={posts} />
        </div>
      </main>
      <Footer />
    </>
  );
}
