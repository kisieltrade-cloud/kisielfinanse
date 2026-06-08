import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';
import { getPublishedRankings, withRankingDate } from '@/lib/rankings';
import { getCategoryBySlug } from '@/lib/categories';

export const revalidate = 3600;

const BASE_URL = 'https://kisielfinanse.pl';

export const metadata: Metadata = {
  title: { absolute: 'Rankingi produktów finansowych 2026 | KisielFinanse' },
  description:
    'Niezależne rankingi i porównania produktów finansowych: konta osobiste, konta ' +
    'oszczędnościowe, brokerzy. Z jawną metodologią oceny.',
  alternates: { canonical: `${BASE_URL}/ranking` },
  openGraph: {
    title: 'Rankingi produktów finansowych 2026 | KisielFinanse',
    description: 'Niezależne rankingi i porównania produktów finansowych w Polsce.',
    url: `${BASE_URL}/ranking`,
    type: 'website',
    siteName: 'KisielFinanse',
    locale: 'pl_PL',
  },
};

export default function RankingIndex() {
  const rankings = getPublishedRankings();

  return (
    <div data-theme="dark" style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <RevealOnScroll />
      <Nav />
      <main className="rk-main">
        <header className="rk-hero">
          <span className="rk-kicker" style={{ color: '#c9a227' }}>Rankingi</span>
          <h1 className="rk-title">Rankingi produktów finansowych</h1>
          <p className="rk-lead">
            Niezależne porównania kont, brokerów i produktów oszczędnościowych. Oceniamy
            redakcyjnie, według jawnej metodologii.
          </p>
        </header>

        {rankings.length > 0 ? (
          <section className="rk-index-grid">
            {rankings.map((r) => {
              const cat = getCategoryBySlug(r.category);
              return (
                <Link key={r.slug} href={`/ranking/${r.slug}`} className="rk-index-card">
                  <span className="rk-index-kicker" style={{ color: cat?.color ?? '#c9a227' }}>
                    {withRankingDate(r.kicker, r.updated)}
                  </span>
                  <h2>{withRankingDate(r.title, r.updated)}</h2>
                  <p>{r.lead}</p>
                  <span className="rk-index-cta">Zobacz ranking →</span>
                </Link>
              );
            })}
          </section>
        ) : (
          <p className="rk-index-empty">
            Pierwsze rankingi są w przygotowaniu. Wróć wkrótce - albo zapisz się na newsletter,
            żeby dostać je jako pierwszy.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}
