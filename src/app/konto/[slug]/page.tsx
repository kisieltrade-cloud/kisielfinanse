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
import { getAllPickSlugs, findPick, rankingMonthYear } from '@/lib/rankings';
import { getCategoryBySlug } from '@/lib/categories';
import { goUrl } from '@/lib/providers';

export const revalidate = 3600;
export const dynamicParams = false;

const BASE_URL = 'https://kisielfinanse.pl';

export async function generateStaticParams() {
  return getAllPickSlugs().map((slug) => ({ slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const found = findPick(slug);
  if (!found) return {};
  const { pick, ranking } = found;
  const fresh = rankingMonthYear(ranking.updated);
  const url = `${BASE_URL}/konto/${slug}`;
  const bonus = pick.review?.bonus;
  const title = bonus
    ? `${pick.name} - premia ${bonus.amount}: jak odebrać (${fresh})`
    : `${pick.name} - opłaty, warunki i szczegóły oferty ${fresh} | KisielFinanse`;
  const desc = bonus
    ? `${pick.name}: premia ${bonus.amount} za założenie konta. Jak odebrać krok po kroku, ` +
      `jakie warunki spełnić i na jakie haczyki w regulaminie uważać, żeby nie stracić bonusu.`
    : `${pick.name} (${pick.provider}): ${pick.highlight} Opłaty, zalety, wady i najważniejsze ` +
      `parametry oferty w jednym miejscu.`;
  return {
    title: { absolute: title },
    description: desc,
    alternates: { canonical: url },
    robots: ranking.published ? undefined : { index: false, follow: false },
    openGraph: {
      title,
      description: desc,
      url,
      type: 'article',
      siteName: 'KisielFinanse',
      locale: 'pl_PL',
    },
    twitter: { card: 'summary_large_image', title, description: desc },
  };
}

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

// Pasek pilności: data 'YYYY-MM-DD' → "Promocja do 30 czerwca 2026"; wolny tekst
// przepisujemy 1:1; brak deadline → ogólne "Oferta czasowa".
function urgencyLabel(deadline?: string): string {
  if (!deadline) return 'Oferta czasowa - sprawdź aktualny regulamin';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline)) return deadline;
  const months = [
    'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
    'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia',
  ];
  const d = new Date(deadline);
  return `Promocja do ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default async function AccountPage({ params }: Props) {
  const { slug } = await params;
  const found = findPick(slug);
  if (!found) notFound();
  const { pick, ranking } = found;

  const cat = getCategoryBySlug(ranking.category);
  const accent = cat?.color ?? '#c9a227';
  const accentRgb = cat?.rgb ?? '201,162,39';
  const url = `${BASE_URL}/konto/${slug}`;
  const fresh = rankingMonthYear(ranking.updated);
  const rankingTitle = ranking.title.replace(/\{DATE\}/g, fresh);
  const goHref = `${goUrl(pick.providerId)}?src=konto-${slug}`;
  const intro = pick.review?.intro ?? pick.body;
  const sections = pick.review?.sections ?? [];
  const faq = pick.review?.faq ?? [];
  const bonus = pick.review?.bonus;
  const steps = pick.review?.steps ?? [];
  const proof = pick.review?.proof ?? [];
  const ctaLabel = bonus ? 'Załóż i odbierz premię' : 'Złóż wniosek';

  // ── Schema.org: produkt finansowy (opis usługi) ───────────────────────────────
  // UWAGA: NIE dodajemy aggregateRating/review do produktu zewnętrznego (konto banku).
  // Google traktuje ocenę gwiazdkową cudzego produktu jako self-serving i odrzuca ją
  // ("nieprawidłowy typ obiektu w polu parent_node"). Gwiazdki zostają tylko wizualnie.
  const schemaProduct = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: pick.name,
    description: pick.highlight,
    brand: { '@type': 'Brand', name: pick.provider },
    url,
  };

  const schemaBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Rankingi', item: `${BASE_URL}/ranking` },
      { '@type': 'ListItem', position: 3, name: rankingTitle, item: `${BASE_URL}/ranking/${ranking.slug}` },
      { '@type': 'ListItem', position: 4, name: pick.name, item: url },
    ],
  };

  const schemaFaq = faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaProduct) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
      {schemaFaq && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }} />}

      <RankingStickyCTA
        name={pick.name}
        score={pick.score}
        goHref={goHref}
        ctaLabel={ctaLabel}
        rankLabel="★"
        subtitle={bonus ? `Premia ${bonus.amount}` : undefined}
        badge={pick.badge}
      />

      <main className="rk-main">
        {/* ── HERO ── */}
        <header className="rk-hero">
          <div className="rk-hero-glow" aria-hidden="true" />
          <nav className="rk-crumbs" aria-label="Okruszki">
            <Link href="/">KisielFinanse</Link>
            <span>/</span>
            <Link href="/ranking">Rankingi</Link>
            <span>/</span>
            <Link href={`/ranking/${ranking.slug}`}>{rankingTitle}</Link>
          </nav>

          <div className="rv-head">
            <BankLogo id={pick.providerId} size={72} rounded={18} />
            <div className="rv-head-text">
              <span className="rk-kicker">{bonus ? `Promocja · ${fresh}` : `Szczegóły oferty · ${fresh}`}</span>
              <h1 className="rk-title">{pick.name}</h1>
              <span className="rv-provider">{pick.provider}</span>
            </div>
          </div>

          {/* ── BLOK PREMII (prowadzi kwotą, nie funkcją) ── */}
          {bonus && (
            <div className="rv-bonus">
              <div className="rv-bonus-glow" aria-hidden="true" />
              <div className="rv-bonus-main">
                <span className="rv-bonus-amount">{bonus.amount}</span>
                <span className="rv-bonus-label">premia za założenie konta</span>
              </div>
              {bonus.sub && <p className="rv-bonus-sub">{bonus.sub}</p>}
              <div className="rv-bonus-foot">
                <span className="rv-urgency">{urgencyLabel(bonus.deadline)}</span>
                <a href={goHref} className="rk-cta rk-cta--glow" rel="sponsored nofollow noopener" target="_blank">
                  {ctaLabel}
                </a>
              </div>
            </div>
          )}

          <div className="rv-hero-bar">
            <div className="rv-hero-rating">
              <Stars score={pick.score} size={1.2} />
              <span className="rk-spotlight-score">{pick.score.toFixed(1)}<small>/5</small></span>
              {pick.badge && <span className="rk-badge">{pick.badge}</span>}
            </div>
            <a href={goHref} className="rk-cta rk-cta--glow" rel="sponsored nofollow noopener" target="_blank">
              {ctaLabel}
            </a>
          </div>
        </header>


        {/* ── WSTĘP ── */}
        <section className="rk-intro">
          <p className="rk-card-highlight" style={{ marginTop: 0 }}>{pick.highlight}</p>
          {intro.map((p, i) => <p key={i}>{p}</p>)}
        </section>

        {/* ── OCENY CZĄSTKOWE ── */}
        {pick.scores && pick.scores.length > 0 && (
          <div className="rk-subscores" style={{ margin: '8px 0 36px' }}>
            {pick.scores.map((s) => (
              <div key={s.label} className="rk-subscore">
                <span className="rk-subscore-label">{s.label}</span>
                <span className="rk-subscore-bar"><span style={{ width: `${(s.value / 5) * 100}%` }} /></span>
                <span className="rk-subscore-val">{s.value.toFixed(1)}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── PARAMETRY ── */}
        <section className="rv-specs">
          <div className="rk-section-head">
            <span className="rk-eyebrow">Parametry</span>
            <h2 className="rk-h2">Najważniejsze liczby</h2>
          </div>
          <dl className="rv-specs-grid">
            {ranking.fields.map((f) => (
              <div key={f.id} className="rv-spec">
                <dt>{f.label}</dt>
                <dd>{pick.specs[f.id] ?? '-'}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── JAK ODEBRAĆ PREMIĘ KROK PO KROKU ── */}
        {steps.length > 0 && (
          <section className="rv-steps-wrap">
            <div className="rk-section-head">
              <span className="rk-eyebrow">Krok po kroku</span>
              <h2 className="rk-h2">Jak odebrać premię {pick.name}</h2>
            </div>
            <ol className="rv-steps">
              {steps.map((s, i) => (
                <li key={i} className="rv-step">
                  <span className="rv-step-num">{i + 1}</span>
                  <span className="rv-step-text">{s}</span>
                </li>
              ))}
            </ol>
            {bonus && (
              <a href={goHref} className="rk-cta rk-cta--glow rv-steps-cta" rel="sponsored nofollow noopener" target="_blank">
                {ctaLabel}
              </a>
            )}
          </section>
        )}

        {/* ── DOWÓD PIERWSZEJ RĘKI (E-E-A-T) ── */}
        {proof.length > 0 && (
          <section className="rv-proof">
            <span className="rv-proof-label">Sprawdzone przeze mnie</span>
            {proof.map((p, i) => <p key={i}>{p}</p>)}
          </section>
        )}

        {/* ── SEKCJE OPISOWE ── */}
        {sections.length > 0 && (
          <section className="rk-card-body" style={{ margin: '8px 0 40px' }}>
            {sections.map((s, i) => (
              <div key={i} style={{ marginBottom: 28 }}>
                <h2 className="rk-h2" style={{ fontSize: '1.4rem', marginBottom: 12 }}>{s.title}</h2>
                {s.body.map((par, j) => <p key={j}>{par}</p>)}
              </div>
            ))}
          </section>
        )}

        {/* ── PODSUMOWANIE + CTA BOX ── */}
        <section className="rk-verdict-box">
          <div className="rk-verdict-glow" aria-hidden="true" />
          <h2 className="rk-h2" style={{ fontSize: '1.35rem', margin: '0 0 10px' }}>
            Czy warto założyć {pick.name}?
          </h2>
          {pick.highlight && <p style={{ margin: '0 0 4px' }}>{pick.highlight}</p>}
          <div className="rv-verdict-facts">
            {ranking.fields.slice(0, 3).map((f) => (
              <div key={f.id} className="rv-verdict-fact">
                <span>{f.label}</span>
                <strong>{pick.specs[f.id] ?? '-'}</strong>
              </div>
            ))}
          </div>
          <div className="rk-verdict-cta">
            <BankLogo id={pick.providerId} size={46} rounded={12} />
            <div className="rk-verdict-cta-text">
              <span className="rk-verdict-cta-label">Ocena {pick.score.toFixed(1)}/5</span>
              <strong>{pick.name}</strong>
            </div>
            <a href={goHref} className="rk-cta rk-cta--glow" rel="sponsored nofollow noopener" target="_blank">
              {ctaLabel}
            </a>
          </div>
          <p className="rv-verdict-note">
            Link afiliacyjny: dostajemy prowizję od banku, a Twoje warunki pozostają bez zmian.
          </p>
        </section>

        {/* ── FAQ ── */}
        {faq.length > 0 && (
          <section className="rk-faq">
            <div className="rk-section-head">
              <span className="rk-eyebrow">FAQ</span>
              <h2 className="rk-h2">Najczęstsze pytania o {pick.name}</h2>
            </div>
            <div className="rk-faq-list">
              {faq.map((f, i) => (
                <details key={i} className="rk-faq-item" open>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ── POWRÓT DO RANKINGU ── */}
        <Link href={`/ranking/${ranking.slug}`} className="rv-back">
          ← Wróć do rankingu: {rankingTitle}
        </Link>

        {/* ── AUTOR ── */}
        <AuthorBox />

        <div className="rk-newsletter">
          <NewsletterForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
