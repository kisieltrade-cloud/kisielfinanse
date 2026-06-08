import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';
import CategoryArticleList from '@/components/CategoryArticleList';
import NewsletterForm from '@/components/NewsletterForm';
import { getPostsByTag } from '@/lib/posts';
import { CATEGORIES, getCategoryBySlug } from '@/lib/categories';
import { getPillar } from '@/lib/pillars';
import PillarGuide from '@/components/PillarGuide';
import { getPublishedRankings, withRankingDate } from '@/lib/rankings';

// Odświeżaj co godzinę — nowe artykuły pojawią się automatycznie po dacie publikacji
export const revalidate = 3600;

const BASE_URL = 'https://kisielfinanse.pl';

export const dynamicParams = false;

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const config = getCategoryBySlug(slug);
  if (!config) return {};

  // config.metaTitle już zawiera "| KisielFinanse" → { absolute } zapobiega podwójnemu suffixowi
  // np. "Strategie tradingowe i day trading | KisielFinanse" (nie "... | KF | KF")
  return {
    title: { absolute: config.metaTitle },
    description: config.metaDesc,
    // Słowa kluczowe: nazwa kategorii + tematy z desc (oddzielone przecinkami) + universalia
    keywords: [
      config.name,
      ...config.desc.split(',').map((s) => s.trim()),
      'KisielFinanse',
      'edukacja finansowa',
      'finanse osobiste',
    ],
    alternates: { canonical: `${BASE_URL}/${slug}` },
    openGraph: {
      title: config.metaTitle,
      description: config.metaDesc,
      url: `${BASE_URL}/${slug}`,
      type: 'website',
      siteName: 'KisielFinanse',
      locale: 'pl_PL',
      images: [{ url: `${BASE_URL}/${slug}/opengraph-image`, width: 1200, height: 630, alt: config.metaTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: config.metaTitle,
      description: config.metaDesc,
      images: [`${BASE_URL}/${slug}/opengraph-image`],
    },
  };
}

const HERO_IMAGES: Record<string, string> = {
  trading:     '/images/blog/covers/trading-chart2.jpg',
  inwestycje:  '/images/blog/covers/finance-graph.jpg',
  pieniadze:   '/images/blog/covers/coins-gold.jpg',
  psychologia: '/images/blog/covers/chess-strategy.jpg',
  gospodarka:  '/images/blog/covers/bank-building.jpg',
};

const CAT_ICONS: Record<string, React.ReactNode> = {
  trading: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
    </svg>
  ),
  inwestycje: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-9-9"/><path d="M21 3v9h-9"/>
    </svg>
  ),
  pieniadze: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
    </svg>
  ),
  psychologia: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a8 8 0 0 1 8 8c0 3-1.5 5.5-4 7l-4 5-4-5C5.5 15.5 4 13 4 10a8 8 0 0 1 8-8z"/>
    </svg>
  ),
  gospodarka: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
};

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const config = getCategoryBySlug(slug);
  if (!config) notFound();

  const result = await getPostsByTag(slug);
  const posts = result?.posts ?? [];
  const otherCats = CATEGORIES.filter(c => c.slug !== slug);
  const heroImg = HERO_IMAGES[slug] ?? '/images/blog/covers/finance-graph.jpg';
  const pillar = getPillar(slug);
  // Rankingi przypisane do tej kategorii (tylko opublikowane → uśpione do publikacji).
  const categoryRankings = getPublishedRankings().filter((r) => r.category === slug);

  const schemaFaq = pillar && pillar.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pillar.faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  } : null;

  const schemaBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: config.name, item: `${BASE_URL}/${slug}` },
    ],
  };

  const schemaCollectionPage = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: config.metaTitle,
    description: config.metaDesc,
    url: `${BASE_URL}/${slug}`,
    publisher: { '@type': 'Organization', name: 'KisielFinanse', url: BASE_URL },
  };

  return (
    <div data-theme="dark" style={{ background: 'var(--bg)', minHeight: '100vh', ['--cat-rgb' as string]: config.rgb }}>
      <RevealOnScroll />
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaCollectionPage) }} />
      {schemaFaq && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }} />}

      <main>
        {/* ── HERO ── */}
        <div className="cat-hero">
          <div className="cat-hero-inner">
            {/* Text */}
            <div>
              <span className="cat-hero-label" style={{ color: config.color }}>Kategoria</span>
              <h1 className="cat-hero-title">{config.name}</h1>
              <p className="cat-hero-sub">{config.desc}</p>
              <p className="cat-hero-desc">{config.longDesc}</p>
            </div>
            {/* Image */}
            <div className="cat-hero-imgwrap">
              <Image
                src={heroImg}
                alt={config.name}
                fill
                priority
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                sizes="420px"
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #030508 0%, transparent 40%)' }} />
            </div>
          </div>
        </div>

        {/* ── PILLAR GUIDE (przewodnik klastra) ── */}
        {pillar && <PillarGuide pillar={pillar} />}

        {/* ── BODY ── */}
        <div className="cat-body">
          {/* Rankingi w tej kategorii (uśpione dopóki brak opublikowanych) */}
          {categoryRankings.length > 0 && (
            <section style={{ marginBottom: 56 }}>
              <p className="cat-other-label" style={{ color: config.color }}>Rankingi i porównania</p>
              <div className="rk-index-grid" style={{ margin: '18px 0 0' }}>
                {categoryRankings.map((rk) => (
                  <Link key={rk.slug} href={`/ranking/${rk.slug}`} className="rk-index-card">
                    <span className="rk-index-kicker" style={{ color: config.color }}>{withRankingDate(rk.kicker, rk.updated)}</span>
                    <h2 style={{ fontSize: '1.2rem' }}>{withRankingDate(rk.title, rk.updated)}</h2>
                    <p>{rk.lead}</p>
                    <span className="rk-index-cta">Zobacz ranking →</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {posts.length > 0 ? (
            <CategoryArticleList posts={posts} categoryColor={config.color} />
          ) : (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.8, padding: '40px 0' }}>
              Artykuły z tej kategorii są w przygotowaniu. Wróć wkrótce.
            </p>
          )}

          {/* Inne tematy — siatka kart */}
          <div style={{ marginTop: 64, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="cat-other-label">Inne tematy</p>
            <div className="cat-other-grid">
              {otherCats.map(c => (
                <Link key={c.slug} href={`/${c.slug}`} className="cat-other-item">
                  <span className="cat-other-icon" style={{ background: `${c.color}18`, color: c.color }}>
                    {CAT_ICONS[c.slug]}
                  </span>
                  <div>
                    <span className="cat-other-name">{c.name}</span>
                    <span className="cat-other-desc">{c.desc}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div style={{ maxWidth: 620, margin: '52px auto 0' }}>
            <NewsletterForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
