import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const OG_IMAGE = { url: '/og-image.png', width: 1200, height: 630, alt: 'Mateusz Kisiel - KisielFinanse' };

export const metadata: Metadata = {
  title: { absolute: 'Mateusz Kisiel - O mnie | KisielFinanse' },
  description: 'Twórca KisielFinanse. Piszę o zarządzaniu pieniędzmi, inwestowaniu, psychologii finansów i rynkach. Bez kursów za fortunę, bez ściemy.',
  keywords: [
    'Mateusz Kisiel', 'KisielFinanse', 'finanse osobiste', 'edukacja finansowa',
    'inwestowanie', 'zarządzanie pieniędzmi', 'psychologia finansów',
    'wolność finansowa', 'oszczędzanie', 'kim jest Kisiel',
  ],
  alternates: { canonical: 'https://kisielfinanse.pl/o-mnie' },
  openGraph: {
    type: 'profile',
    locale: 'pl_PL',
    title: 'Mateusz Kisiel - Twórca KisielFinanse',
    description: 'Piszę o zarządzaniu pieniędzmi, inwestowaniu, psychologii finansów i rynkach. Praktyczna wiedza bez ściemy.',
    url: 'https://kisielfinanse.pl/o-mnie',
    siteName: 'KisielFinanse',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mateusz Kisiel - KisielFinanse',
    description: 'Zarządzanie pieniędzmi, inwestycje, psychologia finansów. Bez ściemy.',
    images: ['/og-image.png'],
  },
};

// Paleta kolorów - CSS vars dla obsługi dark/light mode
const C = {
  bg:      'var(--bg)',
  surface: 'var(--surface)',
  surface2:'var(--surface2)',
  border:  'var(--border)',
  text:    'var(--text)',
  muted:   'var(--muted)',
  subtle:  'var(--muted)',
  accent:  '#c9a227',
};

const timeline = [
  {
    year: '2017',
    title: 'Pierwsze pieniądze, pierwsze błędy',
    desc: 'Zacząłem od Bitcoina i pierwszego konta inwestycyjnego, bez planu i bez zrozumienia ryzyka. Straciłem pieniądze, ale nauczyłem się czegoś ważniejszego: że w finansach nie ma drogi na skróty i każda decyzja ma konsekwencje.',
    color: '#ff2d78',
  },
  {
    year: '2018-19',
    title: 'Nauka przez własne błędy',
    desc: 'Żadnych gotowych poradników, które naprawdę działają. Analiza własnych transakcji, budżetów, decyzji. Zrozumiałem, że wiedza finansowa to nawyk myślenia o pieniądzach, nie zasób do zebrania.',
    color: '#f5c518',
  },
  {
    year: '2020',
    title: 'Zarządzanie ryzykiem i kapitałem',
    desc: 'Kluczowy przełom: zmieniłem pytanie z "ile mogę zarobić" na "ile mogę stracić i ile mam zachować". Zacząłem traktować pieniądze systemowo: rezerwa awaryjna, poduszki finansowe, podział kapitału na cele. To zmieniło wszystko.',
    color: '#e8963a',
  },
  {
    year: '2021-23',
    title: 'Inwestycje i szerszy kontekst',
    desc: 'Portfel długoterminowy, ETF-y, dywersyfikacja między klasami aktywów. Zacząłem rozumieć powiązania między polityką, geopolityką a rynkami. Pieniądze mają kontekst, a im lepiej go rozumiesz, tym lepsze podejmujesz decyzje.',
    color: '#c9a227',
  },
  {
    year: '2024-25',
    title: 'Psychologia pieniędzy',
    desc: 'Odkryłem, że większość problemów finansowych wynika z głowy, nie z braku wiedzy. Emocje, nawyki, błędy poznawcze, prokrastynacja. Zacząłem traktować psychologię jako osobny obszar do pracy.',
    color: '#a78bfa',
  },
  {
    year: '2026',
    title: 'KisielFinanse',
    desc: 'Miejsce, gdzie zbieram wszystko razem. Inwestycje, oszczędzanie, zarządzanie pieniędzmi, rynki, psychologia finansów. Dla kogoś, kto chce rozumieć pieniądze, a nie tylko je zarabiać.',
    color: '#c9a227',
  },
];

const pillars = [
  {
    num: '01',
    title: 'Pieniądze i inwestycje',
    desc: 'Oszczędzanie, ETF-y, IKE, IKZE, OKI, kredyty, konta. Codzienne finanse i budowanie kapitału długoterminowo. Konkretne decyzje, nie teoria.',
    color: '#f5c518',
  },
  {
    num: '02',
    title: 'Psychologia i głowa',
    desc: 'Większość błędów finansowych nie pochodzi z braku wiedzy, tylko z emocji. FOMO, prokrastynacja, awersja do strat. I jak z tym pracować w praktyce.',
    color: '#a78bfa',
  },
  {
    num: '03',
    title: 'Rynki i gospodarka',
    desc: 'Trading, geopolityka, makroekonomia, banki centralne. Jak rozumieć świat finansów i co z tego wynika dla Twojego portfela.',
    color: '#c9a227',
  },
];

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: 'https://kisielfinanse.pl' },
    { '@type': 'ListItem', position: 2, name: 'O mnie',        item: 'https://kisielfinanse.pl/o-mnie' },
  ],
};

const schemaPerson = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Mateusz Kisiel',
  alternateName: 'KisielFinanse',
  url: 'https://kisielfinanse.pl/o-mnie',
  jobTitle: 'Twórca portalu KisielFinanse',
  description: 'Twórca KisielFinanse. 9 lat na rynkach finansowych. Pisze o tradingu, krypto, oszczędzaniu i wolności finansowej.',
  knowsAbout: ['Trading', 'Forex', 'Futures', 'Kryptowaluty', 'Finanse osobiste', 'Oszczędzanie', 'Inwestowanie', 'Geopolityka', 'Zarządzanie ryzykiem'],
  address: { '@type': 'PostalAddress', addressLocality: 'Wrocław', addressCountry: 'PL' },
  sameAs: ['https://kisielfinanse.pl', 'https://x.com/Kisielfinanse'],
};

export default function OMnie() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: '80px', background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 0' }}>
          <Breadcrumbs items={[
            { label: 'KisielFinanse', href: '/' },
            { label: 'O mnie' },
          ]} />
        </div>

        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaPerson) }} />

        {/* ── HERO ──────────────────────────────────────────── */}
        <section style={{
          minHeight: '70vh', display: 'flex', alignItems: 'center',
          padding: '100px 24px 80px', position: 'relative', overflow: 'hidden',
          background: C.bg,
        }}>
          {/* Grid tło */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage: 'linear-gradient(rgba(201,162,39,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
          <div style={{
            position: 'absolute', top: '20%', right: '10%',
            width: 500, height: 500, borderRadius: '50%', zIndex: 0,
            background: 'radial-gradient(circle, rgba(201,162,39,0.07) 0%, transparent 70%)',
          }} />

          <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
            <div className="about-hero-grid">

              <div>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                  letterSpacing: '6px', margin: '0 0 32px',
                  lineHeight: 1,
                }}>
                  <span style={{ color: C.text, display: 'block', marginBottom: 8 }}>MATEUSZ</span>
                  <span style={{ color: C.accent, display: 'block' }}>KISIEL</span>
                </h1>

                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
                  color: C.text,
                  lineHeight: 1.85,
                  maxWidth: 520,
                  margin: '0 0 12px',
                  fontWeight: 500,
                }}>
                  Przez lata uczyłem się jak działają pieniądze. Od pierwszych błędów
                  inwestycyjnych, przez aktywny trading, po zarządzanie majątkiem
                  i planowanie długoterminowe. Każdy etap kosztował mnie coś konkretnego.
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
                  color: C.text,
                  lineHeight: 1.85,
                  maxWidth: 520,
                  margin: '0 0 32px',
                  fontWeight: 500,
                }}>
                  KisielFinanse to miejsce, gdzie zbieram tę wiedzę: inwestycje,
                  oszczędzanie, psychologia pieniędzy, rynki, codzienne finanse.{' '}
                  <span style={{ color: C.accent, fontWeight: 700 }}>Bez kursów za fortunę.</span>
                </p>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <Link href="/" style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                    letterSpacing: '2px', background: C.accent, color: '#060a10',
                    border: `1px solid ${C.accent}`, padding: '12px 24px',
                    textDecoration: 'none', fontWeight: 700,
                  }}>
                    ZACZNIJ CZYTAĆ →
                  </Link>
                  <a
                    href="https://x.com/Kisielfinanse"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                      letterSpacing: '2px', background: 'none', color: C.text,
                      border: `1px solid ${C.border}`, padding: '12px 24px',
                      textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
                      fontWeight: 600,
                    }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    @KISIELFINANSE
                  </a>
                </div>
              </div>

              {/* Zdjęcie */}
              <div style={{ position: 'relative', width: 300, flexShrink: 0 }}>
                <div style={{
                  position: 'absolute', inset: -8,
                  border: '1px solid rgba(201,162,39,0.25)',
                  pointerEvents: 'none', zIndex: 1,
                }} />
                <Image
                  src="/images/profile.png"
                  alt="Mateusz Kisiel - KisielFinanse"
                  width={300}
                  height={400}
                  priority
                  style={{
                    width: '100%', height: 'auto', display: 'block',
                    objectFit: 'cover',
                    filter: 'grayscale(10%) contrast(1.05)',
                    border: `1px solid ${C.border}`,
                  }}
                />
              </div>

            </div>
          </div>
        </section>

        {/* ── O CO MI CHODZI ────────────────────────────────── */}
        <section style={{
          padding: '80px 24px',
          borderTop: `1px solid ${C.border}`,
          background: C.surface,
        }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              letterSpacing: '4px', margin: '0 0 40px', color: C.text,
            }}>
              O CO MI <span style={{ color: C.accent }}>CHODZI</span>
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 2,
            }}>
              {pillars.map((p) => (
                <div key={p.num} style={{
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderLeft: `3px solid ${p.color}`,
                  padding: '28px 24px',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '2.5rem',
                    color: '#d8e2ef', letterSpacing: '4px', marginBottom: 12,
                  }}>
                    {p.num}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '1rem',
                    letterSpacing: '2px', color: C.text, marginBottom: 12,
                    fontWeight: 700,
                  }}>
                    {p.title.toUpperCase()}
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                    color: C.muted, lineHeight: 1.8, margin: 0, fontWeight: 500,
                  }}>
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TIMELINE ──────────────────────────────────────── */}
        <section style={{ padding: '80px 24px', borderTop: `1px solid ${C.border}`, background: C.bg }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              letterSpacing: '4px', margin: '0 0 48px', color: C.text,
            }}>
              9 LAT NA <span style={{ color: C.accent }}>RYNKACH</span>
            </h2>

            <div style={{ position: 'relative' }}>
              {/* Linia pionowa */}
              <div style={{
                position: 'absolute', left: 100, top: 0, bottom: 0,
                width: 1, background: C.border,
              }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {timeline.map((t, i) => (
                  <div key={i} style={{
                    display: 'grid',
                    gridTemplateColumns: '88px 24px 1fr',
                    gap: '0 16px',
                    paddingBottom: i < timeline.length - 1 ? 36 : 0,
                    alignItems: 'start',
                  }}>
                    <div style={{ textAlign: 'right', paddingTop: 2 }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                        color: t.color, letterSpacing: '1px', whiteSpace: 'nowrap',
                        fontWeight: 700,
                      }}>
                        {t.year}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 4 }}>
                      <div style={{
                        width: 13, height: 13, borderRadius: '50%',
                        background: t.color,
                        boxShadow: `0 0 10px ${t.color}55`,
                        border: `2px solid ${C.bg}`,
                        flexShrink: 0,
                      }} />
                    </div>

                    <div>
                      <div style={{
                        fontFamily: 'var(--font-display)', fontSize: '0.95rem',
                        letterSpacing: '2px', color: C.text, marginBottom: 8,
                        fontWeight: 700,
                      }}>
                        {t.title.toUpperCase()}
                      </div>
                      <p style={{
                        fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                        color: C.muted, lineHeight: 1.8, margin: 0, fontWeight: 500,
                      }}>
                        {t.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CO ZNAJDZIESZ NA KISIELFINANSE ────────────────── */}
        <section style={{
          padding: '80px 24px',
          borderTop: `1px solid ${C.border}`,
          background: C.surface,
        }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              letterSpacing: '4px', margin: '0 0 24px', color: C.text,
            }}>
              CO ZNAJDZIESZ <span style={{ color: C.accent }}>TUTAJ</span>
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '1rem',
              color: C.muted, lineHeight: 1.85, margin: '0 0 40px', maxWidth: 640,
              fontWeight: 500,
            }}>
              Piszę o finansach tak, jak sam chciałbym to czytać. Bez
              lania wody, bez clickbaitowych tytułów, bez treści pisanych pod
              algorytm. Każdy artykuł powstaje z konkretnego powodu: bo temat
              jest ważny albo sam przez niego przechodziłem.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { href: '/trading',     label: 'Trading',     color: '#c9a227', desc: 'Strategie, analiza, zarządzanie ryzykiem' },
                { href: '/inwestycje',  label: 'Inwestycje',  color: '#f5c518', desc: 'ETF-y, portfel długoterminowy, OKI' },
                { href: '/pieniadze',   label: 'Pieniądze',   color: '#e8963a', desc: 'Kredyty, konta, codzienne finanse' },
                { href: '/psychologia', label: 'Psychologia', color: '#a78bfa', desc: 'Błędy poznawcze, emocje, mindset' },
                { href: '/gospodarka',  label: 'Gospodarka',  color: '#ff2d78', desc: 'Makroekonomia, geopolityka, globalne trendy' },
              ].map((cat) => (
                <Link key={cat.href} href={cat.href} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 20px',
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderLeft: `3px solid ${cat.color}`,
                  textDecoration: 'none',
                  transition: 'background 0.15s',
                }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '2px', color: cat.color, fontWeight: 700 }}>{cat.label.toUpperCase()}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: C.muted, marginLeft: 16, fontWeight: 500 }}>{cat.desc}</span>
                  </div>
                  <span style={{ color: cat.color, opacity: 0.7, fontWeight: 700 }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────── */}
        <section style={{
          padding: '80px 24px 120px',
          borderTop: `1px solid ${C.border}`,
          textAlign: 'center',
          background: C.bg,
        }}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              letterSpacing: '4px', margin: '0 0 16px', color: C.text,
            }}>
              FINANSE BEZ ŚCIEMY.
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.95rem',
              color: C.muted, lineHeight: 1.85, margin: '0 0 32px',
              fontWeight: 500,
            }}>
              Inwestycje, oszczędzanie, zarządzanie pieniędzmi, psychologia finansów.
              Tylko to, co naprawdę działa.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/" style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                letterSpacing: '2px', background: C.accent, color: '#060a10',
                border: `1px solid ${C.accent}`, padding: '14px 32px',
                textDecoration: 'none', fontWeight: 700,
              }}>
                ARTYKUŁY →
              </Link>
              <Link href="/wspolpraca" style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                letterSpacing: '2px', background: 'none', color: C.text,
                border: `1px solid ${C.border}`, padding: '14px 32px',
                textDecoration: 'none', fontWeight: 600,
              }}>
                WSPÓŁPRACA
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
