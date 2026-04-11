import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const OG_IMAGE = { url: '/og-image.png', width: 1200, height: 630, alt: 'Mateusz Nyseth — Trader z Wrocławia' };

export const metadata: Metadata = {
  title: 'O mnie — Mateusz Nyseth, Trader z Wrocławia z 9-letnim doświadczeniem',
  description: 'Trader z Wrocławia z 9-letnim doświadczeniem. Day trading futures: US100, złoto, surowce, krypto. Bez mentorów, bez kursów — tylko rynek i transparentne wyniki.',
  keywords: [
    'trader wrocław', 'mateusz nyseth', 'nysethtrading', 'day trader polska',
    'trader z doświadczeniem', 'futures trader', 'US100 trader', 'transparentny trader',
    'scalper forex', 'kim jest nyseth',
  ],
  alternates: { canonical: 'https://nysethtrading.pl/o-mnie' },
  openGraph: {
    type: 'profile',
    locale: 'pl_PL',
    title: 'Mateusz Nyseth — Trader z Wrocławia | NysethTrading',
    description: '9 lat na rynkach. Day trading futures, forex i krypto. Transparentne wyniki co tydzień — bez filtrów.',
    url: 'https://nysethtrading.pl/o-mnie',
    siteName: 'NysethTrading',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mateusz Nyseth — Trader z Wrocławia',
    description: '9 lat na rynkach. US100, złoto, krypto. Transparentne wyniki.',
    images: ['/og-image.png'],
  },
};

const timeline = [
  {
    year: '2017',
    title: 'Pierwsze konto, pierwsze straty',
    desc: 'Zacząłem od długoterminowego inwestowania w Bitcoina — wtedy jeszcze nie wiedziałem że to będzie wstęp do aktywnego tradingu. Równolegle pierwszy rachunek forexowy, bez planu, bez zarządzania ryzykiem. Rynek szybko pokazał co o tym myśli.',
    color: '#ff2d78',
  },
  {
    year: '2018–19',
    title: 'Nauka przez ból',
    desc: 'Żadnych kursów, żadnych mentorów. Tylko wykresy, logi transakcji i analiza własnych błędów. Setki godzin przed platformą po godzinach pracy.',
    color: '#f5c518',
  },
  {
    year: '2020',
    title: 'Przełom — zarządzanie ryzykiem',
    desc: 'Zrozumiałem że trading to nie przewidywanie kierunku, a zarządzanie ryzykiem i konsekwencja. Zmieniłem podejście z "ile mogę zarobić" na "ile mogę stracić".',
    color: '#b14aed',
  },
  {
    year: '2021–23',
    title: 'Przejście na futures',
    desc: 'Porzuciłem forex na rzecz US100, złota, surowców i krypto. Wyższy wolumen, lepsza płynność — i Bitcoin który zaczął zachowywać się jak normalny instrument techniczny.',
    color: '#00f5d4',
  },
  {
    year: '2023',
    title: 'Konsekwentne wyniki',
    desc: 'Pierwszy rok gdzie emocje przestały grać rolę. System działa — niezależnie czy tydzień jest zielony czy czerwony.',
    color: '#00f5d4',
  },
  {
    year: '2026',
    title: 'NysethTrading — transparentność',
    desc: 'Postanowiłem pokazać wyniki publicznie. Nie po to żeby chwalić się zyskami, ale żeby udowodnić że konsekwentny, zdyscyplinowany trading jest możliwy — bez kursów i bez ściemy.',
    color: '#00f5d4',
  },
];

const tradingFacts = [
  { label: 'Rynki', value: 'US100 · GOLD · Krypto · Surowce' },
  { label: 'Styl', value: 'Scalping + Day trading' },
  { label: 'Platforma', value: 'XTB / xStation' },
  { label: 'Sesje', value: 'Londyn · Nowy Jork' },
  { label: 'Doświadczenie', value: '9 lat' },
  { label: 'Baza', value: 'Wrocław, Polska' },
];

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'NysethTrading', item: 'https://nysethtrading.pl' },
    { '@type': 'ListItem', position: 2, name: 'O mnie', item: 'https://nysethtrading.pl/o-mnie' },
  ],
};

export default function OMnie() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: '80px' }}>

      {/* Schema.org BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />

      {/* Schema.org Person — E-E-A-T sygnał dla Google */}
      <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Mateusz Nyseth',
      alternateName: 'NysethTrading',
      url: 'https://nysethtrading.pl/o-mnie',
      jobTitle: 'Day Trader',
      description: 'Trader z Wrocławia z 9-letnim doświadczeniem. Specjalizacja: day trading futures, forex i krypto. Autor transparentnego dziennika wyników tradingowych.',
      knowsAbout: ['Day Trading', 'Forex', 'Futures', 'Kryptowaluty', 'Zarządzanie ryzykiem', 'US100', 'Gold'],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Wrocław',
        addressCountry: 'PL',
      },
      sameAs: [
        'https://nysethtrading.pl',
        'https://x.com/nysethtrading',
        'https://twitter.com/nysethtrading',
      ],
    })}}
  />

  {/* ── HERO ── */}
        <section style={{
          minHeight: '70vh', display: 'flex', alignItems: 'center',
          padding: '120px 24px 80px', position: 'relative', overflow: 'hidden',
        }}>
          {/* bg grid */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage: 'linear-gradient(rgba(0,245,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,212,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
          {/* glow */}
          <div style={{
            position: 'absolute', top: '20%', right: '10%',
            width: 500, height: 500, borderRadius: '50%', zIndex: 0,
            background: 'radial-gradient(circle, rgba(0,245,212,0.06) 0%, transparent 70%)',
          }} />

          <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 64, alignItems: 'center' }}>

              {/* Left */}
              <div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                  color: '#00f5d4', letterSpacing: '3px', marginBottom: 16,
                }}>
                  // kim jestem
                </div>

                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                  letterSpacing: '6px', margin: '0 0 8px',
                  lineHeight: 1, color: '#e8edf5',
                }}>
                  MATEUSZ
                </h1>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                  letterSpacing: '6px', margin: '0 0 32px',
                  lineHeight: 1, color: '#00f5d4',
                }}>
                  NYSETH
                </h1>

                <p style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
                  color: '#8a9ab5', lineHeight: 1.9, maxWidth: 560,
                  margin: '0 0 32px',
                }}>
                  9 lat na rynkach. Zaczynałem bez mentorów, bez kursów — tylko rynek
                  jako nauczyciel. Dziś gram futures: <span style={{ color: '#f5c518' }}>US100</span>,{' '}
                  <span style={{ color: '#f5c518' }}>złoto</span>, surowce i <span style={{ color: '#f5c518' }}>krypto</span>. Wyniki publikuję
                  co tydzień — bez filtrów, bo transparentność to jedyna uczciwa forma
                  obecności w tej branży.
                </p>

                <div style={{ display: 'flex', gap: 12 }}>
                  <Link href="/wyniki" style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                    letterSpacing: '2px', background: '#00f5d4', color: '#060a10',
                    border: '1px solid #00f5d4', padding: '12px 24px',
                    textDecoration: 'none', fontWeight: 700, transition: 'opacity .2s',
                  }}>
                    WYNIKI →
                  </Link>
                  <Link href="/wspolpraca" style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                    letterSpacing: '2px', background: 'none', color: '#8a9ab5',
                    border: '1px solid #1a2535', padding: '12px 24px',
                    textDecoration: 'none', transition: 'all .2s',
                  }}>
                    WSPÓŁPRACA
                  </Link>
                </div>
              </div>

              {/* Right — facts card */}
              <div style={{
                background: '#0c1220', border: '1px solid #1a2535',
                borderTop: '3px solid #00f5d4', padding: '24px',
                minWidth: 260,
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                  color: '#00f5d4', letterSpacing: '3px', marginBottom: 20,
                }}>
                  // profil tradera
                </div>
                {tradingFacts.map((f, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', gap: 16,
                    padding: '10px 0',
                    borderBottom: i < tradingFacts.length - 1 ? '1px solid #0d1a26' : 'none',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                      color: '#3a5a6a', letterSpacing: '1px',
                    }}>
                      {f.label.toUpperCase()}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                      color: '#e8edf5', textAlign: 'right',
                    }}>
                      {f.value}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ── FILOZOFIA ── */}
        <section style={{
          padding: '80px 24px',
          borderTop: '1px solid #0d1a26',
          background: 'linear-gradient(180deg, transparent, rgba(0,245,212,0.02), transparent)',
        }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
              color: '#00f5d4', letterSpacing: '3px', marginBottom: 16,
            }}>
              // filozofia
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 2,
            }}>
              {[
                {
                  num: '01',
                  title: 'Ryzyko przed zyskiem',
                  desc: 'Każdą transakcję zaczynam od pytania "ile mogę stracić" — nie "ile mogę zarobić". Zarządzanie ryzykiem to jedyna rzecz na którą mam pełną kontrolę.',
                  color: '#00f5d4',
                },
                {
                  num: '02',
                  title: 'System, nie intuicja',
                  desc: 'Trading oparty na emocjach to hazard. Mój edge pochodzi z powtarzalnego systemu z udokumentowanym backtestem — nie z "czucia rynku".',
                  color: '#b14aed',
                },
                {
                  num: '03',
                  title: 'Transparentność bez wyjątków',
                  desc: 'Złe tygodnie publikuję tak samo jak dobre. Trader który pokazuje tylko zyski nie jest transparentny — jest influencerem.',
                  color: '#f5c518',
                },
              ].map((p, i) => (
                <div key={i} style={{
                  background: '#0a0f1a', border: '1px solid #0d1a26',
                  borderLeft: `3px solid ${p.color}`,
                  padding: '28px 24px',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '2.5rem',
                    color: '#1a2535', letterSpacing: '4px', marginBottom: 12,
                  }}>
                    {p.num}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '1rem',
                    letterSpacing: '2px', color: '#e8edf5', marginBottom: 12,
                  }}>
                    {p.title.toUpperCase()}
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.73rem',
                    color: '#8a9ab5', lineHeight: 1.8, margin: 0,
                  }}>
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section style={{ padding: '80px 24px', borderTop: '1px solid #0d1a26' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
              color: '#00f5d4', letterSpacing: '3px', marginBottom: 8,
            }}>
              // historia
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              letterSpacing: '4px', margin: '0 0 48px', color: '#e8edf5',
            }}>
              9 LAT NA <span style={{ color: '#00f5d4' }}>RYNKACH</span>
            </h2>

            <div style={{ position: 'relative' }}>
              {/* vertical line */}
              <div style={{
                position: 'absolute', left: 56, top: 0, bottom: 0,
                width: 1, background: '#0d1a26',
              }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {timeline.map((t, i) => (
                  <div key={i} style={{
                    display: 'grid',
                    gridTemplateColumns: '112px 1fr',
                    gap: 24,
                    paddingBottom: i < timeline.length - 1 ? 36 : 0,
                    position: 'relative',
                  }}>
                    {/* Year */}
                    <div style={{ textAlign: 'right', paddingRight: 24, paddingTop: 2 }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                        color: t.color, letterSpacing: '1px',
                      }}>
                        {t.year}
                      </span>
                    </div>

                    {/* dot */}
                    <div style={{
                      position: 'absolute', left: 50, top: 6,
                      width: 13, height: 13, borderRadius: '50%',
                      background: t.color,
                      boxShadow: `0 0 12px ${t.color}`,
                      border: '2px solid #060a10',
                    }} />

                    {/* Content */}
                    <div>
                      <div style={{
                        fontFamily: 'var(--font-display)', fontSize: '0.95rem',
                        letterSpacing: '2px', color: '#e8edf5', marginBottom: 8,
                      }}>
                        {t.title.toUpperCase()}
                      </div>
                      <p style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.73rem',
                        color: '#8a9ab5', lineHeight: 1.8, margin: 0,
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

        {/* ── CTA ── */}
        <section style={{
          padding: '80px 24px 120px',
          borderTop: '1px solid #0d1a26',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
              color: '#00f5d4', letterSpacing: '3px', marginBottom: 16,
            }}>
              // śledź wyniki
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              letterSpacing: '4px', margin: '0 0 16px', color: '#e8edf5',
            }}>
              ŻADNYCH TAJEMNIC.
            </h2>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
              color: '#8a9ab5', lineHeight: 1.8, margin: '0 0 32px',
            }}>
              Każdy tydzień — zyski i straty — opublikowany bez edycji.
              Sprawdź wyniki i oceń sam.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/wyniki" style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                letterSpacing: '2px', background: '#00f5d4', color: '#060a10',
                border: '1px solid #00f5d4', padding: '14px 32px',
                textDecoration: 'none', fontWeight: 700,
              }}>
                WYNIKI TRADINGOWE →
              </Link>
              <Link href="/blog" style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                letterSpacing: '2px', background: 'none', color: '#8a9ab5',
                border: '1px solid #1a2535', padding: '14px 32px',
                textDecoration: 'none',
              }}>
                BLOG
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
