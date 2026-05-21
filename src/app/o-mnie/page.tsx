import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const OG_IMAGE = { url: '/og-image.png', width: 1200, height: 630, alt: 'Mateusz Kisiel - KisielFinanse' };

export const metadata: Metadata = {
  title: 'Mateusz Kisiel - Trader i twórca KisielFinanse',
  description: 'Twórca KisielFinanse. 9 lat na rynkach finansowych - trading, krypto, inwestowanie. Portal o finansach osobistych, rynkach i wolności finansowej. Bez ściemy.',
  keywords: [
    'Mateusz Kisiel', 'KisielFinanse', 'finanse osobiste', 'edukacja finansowa',
    'trading wrocław', 'kryptowaluty', 'inwestowanie', 'wolność finansowa',
    'rynki finansowe', 'oszczędzanie', 'kim jest Kisiel',
  ],
  alternates: { canonical: 'https://kisielfinanse.pl/o-mnie' },
  openGraph: {
    type: 'profile',
    locale: 'pl_PL',
    title: 'Mateusz Kisiel - Twórca KisielFinanse',
    description: '9 lat na rynkach. Portal o finansach, tradingu, krypto i wolności finansowej. Praktyczna wiedza bez ściemy.',
    url: 'https://kisielfinanse.pl/o-mnie',
    siteName: 'KisielFinanse',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mateusz Kisiel - KisielFinanse',
    description: '9 lat na rynkach. Finanse, trading, krypto i wolność finansowa.',
    images: ['/og-image.png'],
  },
};

const timeline = [
  {
    year: '2017',
    title: 'Pierwsze konto, pierwsze straty',
    desc: 'Zacząłem od Bitcoina i pierwszego rachunku forexowego - bez planu, bez zarządzania ryzykiem. Rynek szybko pokazał co o tym myśli. Ale to właśnie te pierwsze straty nauczyły mnie więcej niż jakikolwiek kurs.',
    color: '#ff2d78',
  },
  {
    year: '2018-19',
    title: 'Nauka przez ból',
    desc: 'Żadnych mentorów, żadnych kursów. Tylko wykresy, logi transakcji i analiza własnych błędów. Setki godzin przed platformą po godzinach pracy. Zrozumiałem, że jedynym skutecznym nauczycielem jest sam rynek.',
    color: '#f5c518',
  },
  {
    year: '2020',
    title: 'Przełom - zarządzanie ryzykiem',
    desc: 'Kluczowe odkrycie: trading to nie przewidywanie kierunku, a zarządzanie ryzykiem i konsekwencja. Zmieniłem podejście z "ile mogę zarobić" na "ile mogę stracić". To był punkt zwrotny.',
    color: '#e8963a',
  },
  {
    year: '2021-23',
    title: 'Rynki, krypto i szerszy obraz',
    desc: 'Rozszerzyłem działalność na futures (US100, złoto, surowce) i kryptowaluty. Zacząłem też głębiej rozumieć powiązania między polityką, geopolityką a rynkami finansowymi. Pieniądze mają kontekst.',
    color: '#c9a227',
  },
  {
    year: '2024-25',
    title: 'Finanse szerzej niż trading',
    desc: 'Zrozumiałem, że wolność finansowa to nie tylko trading. To oszczędzanie, inwestowanie, rozumienie świata, w którym żyjemy. Zacząłem systematyzować wiedzę z wielu obszarów finansów.',
    color: '#60a5fa',
  },
  {
    year: '2026',
    title: 'KisielFinanse - finanse bez granic',
    desc: 'Stworzyłem KisielFinanse jako portal o finansach w szerokim sensie. Trading, krypto, oszczędzanie, sytuacje na świecie, wolność finansowa - miejsce, gdzie każdy znajdzie coś dla siebie.',
    color: '#c9a227',
  },
];

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: 'https://kisielfinanse.pl' },
    { '@type': 'ListItem', position: 2, name: 'O mnie', item: 'https://kisielfinanse.pl/o-mnie' },
  ],
};

export default function OMnie() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: '80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 0' }}>
          <Breadcrumbs items={[
            { label: 'KisielFinanse', href: '/' },
            { label: 'O mnie' },
          ]} />
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Mateusz Kisiel',
            alternateName: 'KisielFinanse',
            url: 'https://kisielfinanse.pl/o-mnie',
            jobTitle: 'Twórca portalu KisielFinanse',
            description: 'Twórca KisielFinanse. 9 lat na rynkach finansowych. Pisze o tradingu, krypto, oszczędzaniu i wolności finansowej.',
            knowsAbout: ['Trading', 'Forex', 'Futures', 'Kryptowaluty', 'Finanse osobiste', 'Oszczędzanie', 'Inwestowanie', 'Geopolityka', 'Zarządzanie ryzykiem'],
            address: { '@type': 'PostalAddress', addressLocality: 'Wrocław', addressCountry: 'PL' },
            sameAs: ['https://kisielfinanse.pl', 'https://x.com/KisielFinanse'],
          })}}
        />

        {/* ── HERO ── */}
        <section style={{
          minHeight: '70vh', display: 'flex', alignItems: 'center',
          padding: '120px 24px 80px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage: 'linear-gradient(rgba(201,162,39,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
          <div style={{
            position: 'absolute', top: '20%', right: '10%',
            width: 500, height: 500, borderRadius: '50%', zIndex: 0,
            background: 'radial-gradient(circle, rgba(201,162,39,0.06) 0%, transparent 70%)',
          }} />

          <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 64, alignItems: 'center' }}>

              <div>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                  letterSpacing: '6px', margin: '0 0 32px',
                  lineHeight: 1,
                }}>
                  <span style={{ color: '#e8edf5', display: 'block', marginBottom: 8 }}>MATEUSZ</span>
                  <span style={{ color: '#c9a227', display: 'block' }}>KISIEL</span>
                </h1>

                <p style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
                  color: '#8a9ab5', lineHeight: 1.9, maxWidth: 560,
                  margin: '0 0 32px',
                }}>
                  9 lat na rynkach nauczyło mnie jednego: pieniądze rządzą się prawami,
                  które{' '}<span style={{ color: '#e8edf5' }}>każdy może zrozumieć</span>.
                  Trading, krypto, oszczędzanie, geopolityka - wszystko jest ze sobą
                  połączone. Tworzę <span style={{ color: '#c9a227' }}>KisielFinanse</span>,
                  żeby tę wiedzę przekazać praktycznie - bez kursów za fortunę,
                  bez obietnic i bez ściemy.
                </p>

                <div style={{ display: 'flex', gap: 12 }}>
                  <Link href="/blog" style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                    letterSpacing: '2px', background: '#c9a227', color: '#060a10',
                    border: '1px solid #c9a227', padding: '12px 24px',
                    textDecoration: 'none', fontWeight: 700,
                  }}>
                    ZACZNIJ CZYTAĆ →
                  </Link>
                  <Link href="/wspolpraca" style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                    letterSpacing: '2px', background: 'none', color: '#8a9ab5',
                    border: '1px solid #1a2535', padding: '12px 24px',
                    textDecoration: 'none',
                  }}>
                    WSPÓŁPRACA
                  </Link>
                </div>
              </div>

              <div style={{ position: 'relative', width: 320, flexShrink: 0 }}>
                <div style={{
                  position: 'absolute', inset: -8,
                  border: '1px solid rgba(201,162,39,0.15)',
                  pointerEvents: 'none', zIndex: 1,
                }} />
                <Image
                  src="/images/profile.png"
                  alt="Mateusz Kisiel - KisielFinanse"
                  width={320}
                  height={430}
                  priority
                  style={{
                    width: '100%', height: 'auto', display: 'block',
                    objectFit: 'cover',
                    filter: 'grayscale(10%) contrast(1.05)',
                    border: '1px solid #1a2535',
                  }}
                />
              </div>

            </div>
          </div>
        </section>

        {/* ── FILOZOFIA ── */}
        <section style={{
          padding: '80px 24px',
          borderTop: '1px solid #0d1a26',
          background: 'linear-gradient(180deg, transparent, rgba(201,162,39,0.02), transparent)',
        }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 2,
            }}>
              {[
                {
                  num: '01',
                  title: 'Trading i rynki',
                  desc: 'Forex, krypto, futures, akcje - jak naprawdę działają rynki finansowe, jak czytać wykresy, zarządzać ryzykiem i nie dać się emocjom. Wiedza z 9 lat praktyki.',
                  color: '#c9a227',
                },
                {
                  num: '02',
                  title: 'Finanse i wolność',
                  desc: 'Oszczędzanie, inwestowanie, budowanie kapitału - droga do finansowej niezależności. Bo wolność finansowa to nie lottery, to świadome decyzje podejmowane każdego dnia.',
                  color: '#e8963a',
                },
                {
                  num: '03',
                  title: 'Świat i pieniądze',
                  desc: 'Geopolityka, inflacja, banki centralne, krypto i technologia - jak to wszystko wpływa na Twój portfel. Kontekst, którego brakuje w większości miejsc finansowych.',
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
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              letterSpacing: '4px', margin: '0 0 48px', color: '#e8edf5',
            }}>
              9 LAT NA <span style={{ color: '#c9a227' }}>RYNKACH</span>
            </h2>

            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 100, top: 0, bottom: 0,
                width: 1, background: '#0d1a26',
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
                      }}>
                        {t.year}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 4 }}>
                      <div style={{
                        width: 13, height: 13, borderRadius: '50%',
                        background: t.color,
                        boxShadow: `0 0 12px ${t.color}`,
                        border: '2px solid #060a10',
                        flexShrink: 0,
                      }} />
                    </div>

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
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              letterSpacing: '4px', margin: '0 0 16px', color: '#e8edf5',
            }}>
              FINANSE BEZ ŚCIEMY.
            </h2>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
              color: '#8a9ab5', lineHeight: 1.8, margin: '0 0 32px',
            }}>
              Trading, krypto, oszczędzanie, wolność finansowa. Bez kursów za
              fortunę, bez obietnic i bez lania wody. Tylko to, co naprawdę działa.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/blog" style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                letterSpacing: '2px', background: '#c9a227', color: '#060a10',
                border: '1px solid #c9a227', padding: '14px 32px',
                textDecoration: 'none', fontWeight: 700,
              }}>
                PRZEJDŹ DO ARTYKUŁÓW →
              </Link>
              <Link href="/wspolpraca" style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                letterSpacing: '2px', background: 'none', color: '#8a9ab5',
                border: '1px solid #1a2535', padding: '14px 32px',
                textDecoration: 'none',
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
