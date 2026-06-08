import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';
import NewsletterForm from '@/components/NewsletterForm';
import AuthorBox from '@/components/AuthorBox';
import BankLogo from '@/components/BankLogo';
import RankingStickyCTA from '@/components/RankingStickyCTA';
import RankingPicker from '@/components/RankingPicker';
import { getAllRankings, getRankingBySlug, resolveRanking, withRankingDate } from '@/lib/rankings';
import { getCategoryBySlug } from '@/lib/categories';
import { goUrl } from '@/lib/providers';

export const revalidate = 3600;
export const dynamicParams = false;

const BASE_URL = 'https://kisielfinanse.pl';

export async function generateStaticParams() {
  return getAllRankings().map((r) => ({ slug: r.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const r = getRankingBySlug(slug);
  if (!r) return {};
  const url = `${BASE_URL}/ranking/${r.slug}`;
  const metaTitle = withRankingDate(r.metaTitle, r.updated);
  const metaDesc = withRankingDate(r.metaDesc, r.updated);
  return {
    title: { absolute: metaTitle },
    description: metaDesc,
    keywords: r.keywords,
    alternates: { canonical: url },
    robots: r.published ? undefined : { index: false, follow: false },
    // Obraz OG generuje automatycznie opengraph-image.tsx (brandowany, per ranking).
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url,
      type: 'article',
      siteName: 'KisielFinanse',
      locale: 'pl_PL',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDesc,
    },
  };
}

// Gwiazdkowa ocena 0-5 (SVG, bez zależności)
function Stars({ score, size }: { score: number; size?: number }) {
  const pct = Math.max(0, Math.min(100, (score / 5) * 100));
  return (
    <span
      className="rk-stars"
      style={size ? ({ fontSize: `${size}rem` } as React.CSSProperties) : undefined}
      aria-label={`Ocena ${score.toFixed(1)} na 5`}
      title={`${score.toFixed(1)} / 5`}
    >
      <span className="rk-stars-bg">★★★★★</span>
      <span className="rk-stars-fg" style={{ width: `${pct}%` }}>★★★★★</span>
    </span>
  );
}

function formatPlDate(iso: string): string {
  const months = [
    'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
    'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia',
  ];
  const d = new Date(iso);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}


export default async function RankingPage({ params }: Props) {
  const { slug } = await params;
  const raw = getRankingBySlug(slug);
  if (!raw) notFound();
  const r = resolveRanking(raw); // ocena + kolejność wyliczone z ocen cząstkowych

  const cat = getCategoryBySlug(r.category);
  const accent = cat?.color ?? '#c9a227';
  const accentRgb = cat?.rgb ?? '201,162,39';
  const url = `${BASE_URL}/ranking/${r.slug}`;
  const winner = r.picks.find((p) => p.rank === 1) ?? r.picks[0];
  const goHref = (providerId: string) => `${goUrl(providerId)}?src=ranking-${r.slug}`;
  const CTA_LABEL = 'Złóż wniosek'; // jednolite CTA na całym rankingu
  const titleD = withRankingDate(r.title, r.updated);
  const kickerD = withRankingDate(r.kicker, r.updated);

  // ── Schema.org ──────────────────────────────────────────────────────────────
  const schemaItemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: titleD,
    description: withRankingDate(r.metaDesc, r.updated),
    url,
    numberOfItems: r.picks.length,
    itemListElement: r.picks.map((p) => ({
      '@type': 'ListItem',
      position: p.rank,
      name: p.name,
      item: {
        '@type': 'FinancialProduct',
        name: p.name,
        provider: { '@type': 'Organization', name: p.provider },
        review: {
          '@type': 'Review',
          reviewRating: { '@type': 'Rating', ratingValue: p.score, bestRating: 5 },
          author: { '@type': 'Person', name: 'Mateusz Kisiel' },
          publisher: { '@type': 'Organization', name: 'KisielFinanse' },
        },
      },
    })),
  };

  const schemaBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Rankingi', item: `${BASE_URL}/ranking` },
      { '@type': 'ListItem', position: 3, name: titleD, item: url },
    ],
  };

  const schemaFaq = r.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: r.faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  } : null;

  return (
    <div
      data-theme="dark"
      className="rk-root"
      style={{
        background: 'var(--bg)',
        color: 'var(--text)',
        minHeight: '100vh',
        ['--cat-rgb' as string]: accentRgb,
        ['--rk-accent' as string]: accent,
      }}
    >
      <RevealOnScroll />
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaItemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
      {schemaFaq && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }} />}

      {winner && (
        <RankingStickyCTA
          name={winner.name}
          score={winner.score}
          goHref={goHref(winner.providerId)}
          ctaLabel={CTA_LABEL}
          badge={winner.badge}
        />
      )}

      <main className="rk-main">
        {/* ── HERO ── */}
        <header className="rk-hero">
          <div className="rk-hero-glow" aria-hidden="true" />
          <nav className="rk-crumbs" aria-label="Okruszki">
            <Link href="/">KisielFinanse</Link>
            <span>/</span>
            <Link href="/ranking">Rankingi</Link>
            {cat && (<><span>/</span><Link href={`/${cat.slug}`}>{cat.name}</Link></>)}
          </nav>
          <span className="rk-kicker">{kickerD}</span>
          <h1 className="rk-title">{titleD}</h1>
          <p className="rk-lead">{r.lead}</p>
          <div className="rk-stats">
            <span className="rk-stat"><strong>{r.picks.length}</strong> produktów w teście</span>
            <span className="rk-stat">Zaktualizowano <strong>{formatPlDate(r.updated)}</strong></span>
            <span className="rk-stat rk-stat-fresh">
              <span className="rk-fresh-ico" aria-hidden="true" />
              Aktualizowane co miesiąc
            </span>
          </div>
        </header>

        {/* ── SPOTLIGHT ZWYCIĘZCY ── */}
        {winner && (
          <aside className="rk-spotlight">
            <div className="rk-spotlight-glow" aria-hidden="true" />
            <div className="rk-spotlight-rank">
              <BankLogo id={winner.providerId} width={116} height={64} rounded={16} />
              <span className="rk-spotlight-hash">#1</span>
              <span className="rk-spotlight-label">Nasz wybór</span>
            </div>
            <div className="rk-spotlight-main">
              {winner.badge && <span className="rk-spotlight-badge">{winner.badge}</span>}
              <h2 className="rk-spotlight-name">{winner.name}</h2>
              <p className="rk-spotlight-text">{winner.highlight}</p>
              <div className="rk-spotlight-rating">
                <Stars score={winner.score} size={1.15} />
                <span className="rk-spotlight-score">{winner.score.toFixed(1)}<small>/5</small></span>
              </div>
            </div>
            <div className="rk-spotlight-cta">
              <a
                href={goHref(winner.providerId)}
                className="rk-cta rk-cta--glow"
                rel="sponsored nofollow noopener"
                target="_blank"
              >
                {CTA_LABEL}
              </a>
              <a href={`#${winner.slug}`} className="rk-spotlight-more">Czytaj recenzję</a>
            </div>
          </aside>
        )}

        {/* ── TABELA PORÓWNAWCZA ── */}
        <section className="rk-tablewrap" aria-label="Tabela porównawcza">
          <div className="rk-section-head">
            <span className="rk-eyebrow">Zestawienie</span>
            <h2 className="rk-h2">Porównanie w skrócie</h2>
          </div>
          <div className="rk-tablescroll">
            <table className="rk-table">
              <thead>
                <tr>
                  <th className="rk-th-name">Produkt</th>
                  <th>Ocena</th>
                  {r.fields.map((f) => <th key={f.id}>{f.label}</th>)}
                  <th aria-label="Akcja"></th>
                </tr>
              </thead>
              <tbody>
                {r.picks.map((p) => (
                  <tr key={p.slug} className={p.rank === 1 ? 'rk-tr-top' : undefined}>
                    <td className="rk-td-name">
                      <a href={`#${p.slug}`}>
                        <span className="rk-rank">{p.rank}</span>
                        <BankLogo id={p.providerId} width={88} height={48} rounded={11} />
                        <span className="rk-td-names">
                          <strong>{p.name}</strong>
                        </span>
                      </a>
                    </td>
                    <td data-label="Ocena">
                      <span className="rk-td-rating">
                        <Stars score={p.score} />
                        <span className="rk-score-num">{p.score.toFixed(1)}</span>
                      </span>
                    </td>
                    {r.fields.map((f) => <td key={f.id} data-label={f.label}>{p.specs[f.id] ?? '-'}</td>)}
                    <td className="rk-td-action">
                      <a
                        href={goHref(p.providerId)}
                        className="rk-cta rk-cta--xs"
                        rel="sponsored nofollow noopener"
                        target="_blank"
                      >
                        {CTA_LABEL}
                      </a>
                      <Link href={`/konto/${p.slug}`} className="rk-td-more">Czytaj więcej</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="rk-tablenote">
            * Darmowe wypłaty z bankomatów i zerowe opłaty obowiązują zwykle po spełnieniu miesięcznych
            warunków (wpływ na konto, płatności kartą). Kwoty premii to wartości maksymalne, zależne od
            spełnienia warunków promocji i mogące się zmieniać. Sprawdź aktualny regulamin i tabelę opłat u banku.
          </p>
        </section>

        {/* ── SEGMENTY "Najlepsze konto dla..." ── */}
        {r.segments && r.segments.length > 0 && (
          <section className="rk-segs" aria-label="Najlepsze konto dla...">
            <div className="rk-section-head">
              <span className="rk-eyebrow">Najlepsze konto dla...</span>
              <h2 className="rk-h2">Zależnie od tego, czego szukasz</h2>
            </div>
            <div className="rk-segs-grid">
              {r.segments.map((seg) => {
                const sp = r.picks.find((p) => p.slug === seg.slug);
                if (!sp) return null;
                return (
                  <Link key={seg.slug} href={`/konto/${seg.slug}`} className="rk-seg">
                    <div className="rk-seg-top">
                      <BankLogo id={sp.providerId} width={70} height={42} rounded={10} />
                      <span className="rk-seg-label">{seg.label}</span>
                    </div>
                    <strong className="rk-seg-name">{sp.name}</strong>
                    <span className="rk-seg-reason">{seg.reason}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── TL;DR "W skrócie" ── */}
        {r.summary && r.summary.length > 0 && (
          <section className="rk-tldr" aria-label="Najważniejsze w skrócie">
            <span className="rk-tldr-title">Najważniejsze w skrócie</span>
            <ul>
              {r.summary.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </section>
        )}

        {/* ── INTRO ── */}
        <section className="rk-intro">
          {r.intro.map((p, i) => <p key={i}>{p}</p>)}
        </section>

        {/* ── INTERAKTYWNY DOBIERACZ ── */}
        {r.pickerCriteria && r.pickerCriteria.length > 0 && (
          <RankingPicker
            rankingSlug={r.slug}
            criteria={r.pickerCriteria}
            items={r.picks.map((p) => ({
              name: p.name,
              slug: p.slug,
              providerId: p.providerId,
              ctaLabel: CTA_LABEL,
              score: p.score,
              scores: p.scores ?? [],
            }))}
          />
        )}

        {/* ── KARTY / SZCZEGÓŁOWE OMÓWIENIE ── */}
        <section className="rk-cards">
          <div className="rk-section-head">
            <span className="rk-eyebrow">Szczegóły</span>
            <h2 className="rk-h2">Recenzje krok po kroku</h2>
          </div>
          {r.picks.map((p) => (
            <article key={p.slug} id={p.slug} className={`rk-card${p.rank === 1 ? ' rk-card--top' : ''}`}>
              <span className="rk-card-watermark" aria-hidden="true">{p.rank}</span>
              <div className="rk-card-top">
                <div className="rk-card-id">
                  <span className="rk-card-rank">{p.rank}</span>
                  <BankLogo id={p.providerId} width={108} height={58} rounded={14} />
                  <div className="rk-card-titles">
                    <h3>{p.name}</h3>
                    <span className="rk-card-provider">{p.provider}</span>
                  </div>
                </div>
                <div className="rk-card-meta">
                  {p.badge && <span className="rk-badge">{p.badge}</span>}
                  <div className="rk-card-rating">
                    <Stars score={p.score} />
                    <span className="rk-score-big">{p.score.toFixed(1)}<small>/5</small></span>
                  </div>
                </div>
              </div>

              <p className="rk-card-highlight">{p.highlight}</p>

              {p.scores && p.scores.length > 0 && (
                <div className="rk-subscores">
                  {p.scores.map((s) => (
                    <div key={s.label} className="rk-subscore">
                      <span className="rk-subscore-label">{s.label}</span>
                      <span className="rk-subscore-bar">
                        <span style={{ width: `${(s.value / 5) * 100}%` }} />
                      </span>
                      <span className="rk-subscore-val">{s.value.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="rk-card-body">
                {p.cardSections && p.cardSections.length > 0
                  ? p.cardSections.map((s, i) => (
                      <div key={i} className="rk-card-sec">
                        <h4 className="rk-card-sec-title">{s.title}</h4>
                        {s.body.map((par, j) => <p key={j}>{par}</p>)}
                      </div>
                    ))
                  : p.body.map((par, i) => <p key={i}>{par}</p>)}
              </div>

              <div className="rk-card-foot">
                <div className="rk-card-foot-left">
                  <Link href={`/konto/${p.slug}`} className="rk-card-review">Czytaj więcej →</Link>
                </div>
                <a
                  href={goHref(p.providerId)}
                  className="rk-cta rk-cta--glow"
                  rel="sponsored nofollow noopener"
                  target="_blank"
                >
                  {CTA_LABEL}
                </a>
              </div>
            </article>
          ))}
        </section>

        {/* ── WERDYKT KOŃCOWY ── */}
        {r.verdict && r.verdict.length > 0 && winner && (
          <section className="rk-verdict-box">
            <div className="rk-verdict-glow" aria-hidden="true" />
            <div className="rk-section-head">
              <span className="rk-eyebrow">Podsumowanie</span>
              <h2 className="rk-h2">Które konto wybrać?</h2>
            </div>
            {r.verdict.map((p, i) => <p key={i}>{p}</p>)}
            <div className="rk-verdict-cta">
              <BankLogo id={winner.providerId} size={42} rounded={11} />
              <div className="rk-verdict-cta-text">
                <span className="rk-verdict-cta-label">Nasz wybór #1</span>
                <strong>{winner.name}</strong>
              </div>
              <a
                href={goHref(winner.providerId)}
                className="rk-cta rk-cta--glow"
                rel="sponsored nofollow noopener"
                target="_blank"
              >
                {CTA_LABEL}
              </a>
            </div>
          </section>
        )}

        {/* ── METODOLOGIA ── */}
        <section className="rk-method">
          <div className="rk-section-head">
            <span className="rk-eyebrow">Transparentność</span>
            <h2 className="rk-h2">Jak tworzymy ten ranking</h2>
          </div>
          {r.methodology.map((p, i) => <p key={i}>{p}</p>)}
          {r.changelog && r.changelog.length > 0 && (
            <div className="rk-changelog">
              <span className="rk-changelog-title">Historia aktualizacji</span>
              <ul>
                {r.changelog.map((c, i) => (
                  <li key={i}>
                    <time dateTime={c.date}>{formatPlDate(c.date)}</time>
                    <span>{c.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="rk-method-author">
            Autor zestawienia: <Link href="/o-mnie">Mateusz Kisiel</Link> · KisielFinanse
          </p>
        </section>

        {/* ── FAQ ── */}
        {r.faq.length > 0 && (
          <section className="rk-faq">
            <div className="rk-section-head">
              <span className="rk-eyebrow">FAQ</span>
              <h2 className="rk-h2">Najczęstsze pytania</h2>
            </div>
            <div className="rk-faq-list">
              {r.faq.map((f, i) => (
                <details key={i} className="rk-faq-item" open>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ── POWIĄZANE PORADNIKI (linkowanie wewnętrzne) ── */}
        {r.relatedArticles && r.relatedArticles.length > 0 && (
          <section className="rk-related">
            <div className="rk-section-head">
              <span className="rk-eyebrow">Czytaj dalej</span>
              <h2 className="rk-h2">Powiązane poradniki</h2>
            </div>
            <div className="rk-related-grid">
              {r.relatedArticles.map((a) => (
                <Link key={a.href} href={a.href} className="rk-related-card">
                  <span className="rk-related-arrow" aria-hidden="true">→</span>
                  <span>{a.label}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── AUTOR (E-E-A-T) ── */}
        <AuthorBox />

        {/* ── Newsletter ── */}
        <div className="rk-newsletter">
          <NewsletterForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
