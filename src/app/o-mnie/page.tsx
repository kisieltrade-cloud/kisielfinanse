import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

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
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Mateusz Kisiel - KisielFinanse' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mateusz Kisiel - KisielFinanse',
    description: 'Zarządzanie pieniędzmi, inwestycje, psychologia finansów. Bez ściemy.',
    images: ['/og-image.png'],
  },
};

/* ─── DATA ──────────────────────────────────────────────────────────── */
const pillars = [
  {
    num: '01',
    icon: 'trend',
    title: 'Pieniądze\ni inwestycje',
    desc: 'Oszczędzanie, ETF-y, IKE, IKZE, OKI, kredyty, konta. Codzienne finanse i budowanie kapitału długoterminowo. Konkretne decyzje, nie teoria.',
    color: '#f5c518',
  },
  {
    num: '02',
    icon: 'brain',
    title: 'Psychologia\ni głowa',
    desc: 'Większość błędów finansowych nie pochodzi z braku wiedzy, tylko z emocji. FOMO, prokrastynacja, awersja do strat. I jak z tym pracować w praktyce.',
    color: '#a78bfa',
  },
  {
    num: '03',
    icon: 'globe',
    title: 'Rynki\ni gospodarka',
    desc: 'Trading, geopolityka, makroekonomia, banki centralne. Jak rozumieć świat finansów i co z tego wynika dla Twojego portfela.',
    color: '#c9a227',
  },
];

const timeline = [
  {
    year: '2017',
    title: 'Pierwsze pieniądze, pierwsze błędy',
    desc: 'Zacząłem od Bitcoina i pierwszego konta inwestycyjnego, bez planu i bez zrozumienia ryzyka. Straciłem pieniądze, ale nauczyłem się czegoś ważniejszego: że w finansach nie ma drogi na skróty i każda decyzja ma konsekwencje.',
  },
  {
    year: '2018-19',
    title: 'Nauka przez własne błędy',
    desc: 'Żadnych gotowych poradników, które naprawdę działają. Analiza własnych transakcji, budżetów, decyzji. Zrozumiałem, że wiedza finansowa to nawyk myślenia o pieniądzach, nie zasób do zebrania.',
  },
  {
    year: '2020',
    title: 'Zarządzanie ryzykiem i kapitałem',
    desc: 'Kluczowy przełom: zmieniłem pytanie z "ile mogę zarobić" na "ile mogę stracić i ile mam zachować". Zacząłem traktować pieniądze systemowo: rezerwa awaryjna, poduszki finansowe, podział kapitału na cele. To zmieniło wszystko.',
  },
  {
    year: '2021-23',
    title: 'Inwestycje i szerszy kontekst',
    desc: 'Portfel długoterminowy, ETF-y, dywersyfikacja między klasami aktywów. Zacząłem rozumieć powiązania między polityką, geopolityką a rynkami. Pieniądze mają kontekst, a im lepiej go rozumiesz, tym lepsze podejmujesz decyzje.',
  },
  {
    year: '2024-25',
    title: 'Psychologia pieniędzy',
    desc: 'Odkryłem, że większość problemów finansowych wynika z głowy, nie z braku wiedzy. Emocje, nawyki, błędy poznawcze, prokrastynacja. Zacząłem traktować psychologię jako osobny obszar do pracy.',
  },
  {
    year: '2026',
    title: 'KisielFinanse',
    desc: 'Miejsce, gdzie zbieram wszystko razem. Inwestycje, oszczędzanie, zarządzanie pieniędzmi, rynki, psychologia finansów. Dla kogoś, kto chce rozumieć pieniądze, a nie tylko je zarabiać.',
  },
];

const categories = [
  { href: '/trading',     label: 'Trading',     desc: 'Strategie, analiza, zarządzanie ryzykiem', img: '/images/blog/covers/trading-chart.jpg',    color: '#c9a227' },
  { href: '/inwestycje',  label: 'Inwestycje',  desc: 'ETF-y, portfel długoterminowy, OKI',        img: '/images/blog/covers/financial-screen.jpg', color: '#f5c518' },
  { href: '/pieniadze',   label: 'Pieniądze',   desc: 'Kredyty, konta, codzienne finanse',          img: '/images/blog/covers/calculator-money.jpg', color: '#e8963a' },
  { href: '/psychologia', label: 'Psychologia', desc: 'Błędy poznawcze, emocje, mindset',           img: '/images/blog/covers/chess-strategy.jpg',   color: '#a78bfa' },
  { href: '/gospodarka',  label: 'Gospodarka',  desc: 'Makroekonomia, geopolityka, globalne trendy', img: '/images/blog/covers/gold-circuit.jpg',    color: '#ff2d78' },
];

const principles = [
  { t: 'Piszę o tym, przez co sam przeszedłem', d: 'Bez teorii z drugiej ręki. Każdy temat albo sam przerabiałem, albo dokopuję się do danych i źródeł, zanim cokolwiek opublikuję.' },
  { t: 'Liczby przed opiniami', d: 'Konkretne kwoty, stawki i przykłady zamiast ogólników. Jeśli coś twierdzę, pokazuję, skąd to się bierze.' },
  { t: 'Bez kursów za fortunę i clickbaitu', d: 'Nie sprzedaję magicznych systemów ani treści pisanych pod algorytm. Jeśli coś jest ryzykowne albo czegoś nie wiem, mówię to wprost.' },
  { t: 'To nie są porady inwestycyjne', d: 'Dzielę się wiedzą i własnym doświadczeniem, ale decyzje finansowe podejmujesz sam. Treści mają charakter edukacyjny.' },
];

const faqItems = [
  { q: 'Kim jest Mateusz Kisiel?', a: 'Twórca portalu KisielFinanse. Od 2017 roku uczę się rynków i finansów na własnych decyzjach i błędach. Piszę o inwestowaniu, oszczędzaniu, psychologii pieniędzy i gospodarce z perspektywy kogoś, kto sam przez to przechodził.' },
  { q: 'Czy KisielFinanse to porady inwestycyjne?', a: 'Nie. Treści mają charakter edukacyjny i informacyjny. Pokazuję mechanizmy i własne podejście, ale decyzje finansowe podejmujesz na własną odpowiedzialność.' },
  { q: 'Czego nie znajdziesz na KisielFinanse?', a: 'Magicznych systemów „zawsze działających", kursów za fortunę ani treści pisanych pod clickbait. Jeśli coś jest ryzykowne albo niepewne, piszę to wprost.' },
  { q: 'O czym piszesz najczęściej?', a: 'O finansach osobistych, inwestowaniu w ETF-y, oszczędzaniu, kredytach i podatkach, a także o psychologii pieniędzy i tym, jak gospodarka wpływa na portfel zwykłego człowieka.' },
];

/* ─── SCHEMA ────────────────────────────────────────────────────────── */
const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: 'https://kisielfinanse.pl' },
    { '@type': 'ListItem', position: 2, name: 'O mnie', item: 'https://kisielfinanse.pl/o-mnie' },
  ],
};

const PERSON = {
  '@type': 'Person',
  '@id': 'https://kisielfinanse.pl/#mateusz-kisiel',
  name: 'Mateusz Kisiel',
  alternateName: 'KisielFinanse',
  url: 'https://kisielfinanse.pl/o-mnie',
  image: 'https://kisielfinanse.pl/images/profile.png',
  jobTitle: 'Twórca portalu KisielFinanse',
  description: 'Twórca KisielFinanse. Od 2017 roku uczę się rynków i finansów na własnych decyzjach. Piszę o inwestowaniu, oszczędzaniu, psychologii pieniędzy i gospodarce.',
  knowsAbout: ['Finanse osobiste', 'Inwestowanie', 'ETF', 'Trading', 'Forex', 'Futures', 'Kryptowaluty', 'Oszczędzanie', 'Kredyty', 'Podatki', 'Psychologia finansów', 'Geopolityka', 'Zarządzanie ryzykiem'],
  address: { '@type': 'PostalAddress', addressLocality: 'Wrocław', addressCountry: 'PL' },
  worksFor: { '@type': 'Organization', name: 'KisielFinanse', url: 'https://kisielfinanse.pl' },
  sameAs: [
    'https://x.com/Kisielfinanse',
    'https://www.youtube.com/@Kisielfinanse',
    'https://www.instagram.com/kisielfinanse',
  ],
};

const schemaProfilePage = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url: 'https://kisielfinanse.pl/o-mnie',
  name: 'Mateusz Kisiel - O mnie',
  mainEntity: PERSON,
};

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

/* ─── ICONS ─────────────────────────────────────────────────────────── */
function IconTrend() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M3 16 L8 10 L12 13 L19 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 5 H19 V9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconBrain() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 18V10M7 7C7 5.3 8.3 4 10 4C10.6 4 11.1 4.2 11.5 4.5C11.9 4.2 12.4 4 13 4C14.7 4 16 5.3 16 7C16 8 15.5 8.9 14.7 9.4C15.5 9.9 16 10.8 16 12C16 13.7 14.7 15 13 15H9C7.3 15 6 13.7 6 12C6 10.8 6.5 9.9 7.3 9.4C6.5 8.9 6 8 6 7H7Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 11 H19 M11 3 C9 6 8 8.5 8 11 C8 13.5 9 16 11 19 M11 3 C13 6 14 8.5 14 11 C14 13.5 13 16 11 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* ─── SECTION DIVIDER ───────────────────────────────────────────────── */
function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 48 }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,162,39,0.3))' }} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '4px', color: 'var(--cyan)', whiteSpace: 'nowrap', opacity: 0.8 }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(201,162,39,0.3))' }} />
    </div>
  );
}

export default function OMnie() {
  return (
    <div data-theme="dark" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Nav />

      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaProfilePage) }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }} />

      <main>

        {/* ══ 1. HERO ══════════════════════════════════════════════════ */}
        <section style={{ position: 'relative', paddingTop: 80, borderBottom: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          {/* Background image */}
          <Image
            src="/images/o-mnie-hero.jpg"
            alt="Mateusz Kisiel - twórca KisielFinanse"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
            sizes="100vw"
          />
          {/* Dark overlay for readability */}
          <div style={{ position: 'absolute', inset: 0, background: 'var(--omnie-overlay)', zIndex: 1 }} />

          <div className="omnie-hero" style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>

            {/* Left — text */}
            <div style={{ padding: 'clamp(48px, 6vw, 80px) clamp(24px, 5vw, 72px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h1 style={{ margin: '0 0 24px', lineHeight: 1 }}>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                  color: '#c9a227',
                  letterSpacing: '6px',
                  display: 'block',
                  marginBottom: 4,
                }}>
                  MATEUSZ
                </span>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(4rem, 9vw, 7.5rem)',
                  color: 'var(--text)',
                  letterSpacing: '4px',
                  display: 'block',
                  lineHeight: 0.95,
                }}>
                  KISIEL
                </span>
              </h1>

              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.88rem, 1.4vw, 1rem)', color: 'var(--muted)', lineHeight: 1.8, maxWidth: 460, margin: '0 0 14px' }}>
                Przez lata uczyłem się jak działają pieniądze. Od pierwszych błędów inwestycyjnych, przez aktywny trading, po zarządzanie majątkiem i planowanie długoterminowe. Każdy etap kosztował mnie coś konkretnego.
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.88rem, 1.4vw, 1rem)', color: 'var(--muted)', lineHeight: 1.8, maxWidth: 460, margin: '0 0 36px' }}>
                KisielFinanse to miejsce, gdzie zbieram tę wiedzę: inwestycje, oszczędzanie, psychologia pieniędzy, rynki, codzienne finanse. Bez kursów za fortunę.
              </p>

              <div style={{ marginBottom: 40 }}>
                <Link href="/" style={{
                  display: 'inline-block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  letterSpacing: '2px',
                  fontWeight: 700,
                  color: '#c9a227',
                  border: '1px solid #c9a227',
                  padding: '13px 26px',
                  textDecoration: 'none',
                }}>
                  ZACZNIJ CZYTAĆ →
                </Link>
              </div>

              {/* Social links */}
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <a
                  href="https://instagram.com/kisielfinanse"
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '1.5px', color: 'var(--muted)', textDecoration: 'none' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  @KISIELFINANSE
                </a>
                <a
                  href="https://youtube.com/@kisielfinanse"
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '1.5px', color: 'var(--muted)', textDecoration: 'none' }}
                >
                  <svg width="16" height="12" viewBox="0 0 24 17" fill="currentColor">
                    <path d="M23.5 2.5C23.2 1.4 22.3.5 21.2.2 19.4 0 12 0 12 0S4.6 0 2.8.2C1.7.5.8 1.4.5 2.5 0 4.3 0 8.5 0 8.5s0 4.2.5 6c.3 1.1 1.2 2 2.3 2.3C4.6 17 12 17 12 17s7.4 0 9.2-.2c1.1-.3 2-.8 2.3-2.3.5-1.8.5-6 .5-6s0-4.2-.5-6zM9.75 12V5l6.5 3.5L9.75 12z"/>
                  </svg>
                  Mateusz Kisiel - KisielFinanse
                </a>
              </div>
            </div>

            {/* Right — photo */}
            <div className="omnie-hero-photo" style={{ position: 'relative', overflow: 'hidden' }}>
              <Image
                src="/images/profile.png"
                alt="Mateusz Kisiel"
                fill
                priority
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                sizes="460px"
              />
              {/* Left fade */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to right, var(--bg) 0%, transparent 42%)',
                zIndex: 1,
              }} />
              {/* Bottom fade */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, var(--bg) 0%, transparent 50%)',
                zIndex: 1,
              }} />
            </div>

          </div>
        </section>

        {/* ══ 2. OBSZARY WIEDZY ════════════════════════════════════════ */}
        <section style={{ background: 'var(--surface)', padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 40px)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <SectionLabel label="OBSZARY WIEDZY" />

            <div className="omnie-pillars">
              {pillars.map((p) => (
                <div key={p.num} style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 14,
                  padding: '28px 26px',
                }}>
                  {/* Number */}
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--border)', letterSpacing: '3px', display: 'block', marginBottom: 16 }}>
                    {p.num}
                  </span>

                  {/* Icon + title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                      background: p.color + '18',
                      border: `1px solid ${p.color}35`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: p.color,
                    }}>
                      {p.icon === 'trend' && <IconTrend />}
                      {p.icon === 'brain' && <IconBrain />}
                      {p.icon === 'globe' && <IconGlobe />}
                    </div>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '1.5px', margin: 0, lineHeight: 1.25, textTransform: 'uppercase', whiteSpace: 'pre-line' }}>
                      {p.title}
                    </p>
                  </div>

                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.75, margin: 0 }}>
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 3. 9 LAT NA RYNKACH — HORIZONTAL TIMELINE ═══════════════ */}
        <section style={{ background: 'var(--bg)', padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 40px)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <SectionLabel label="9 LAT NA RYNKACH" />

            <div className="omnie-timeline">
              {/* Horizontal connecting line at dot level */}
              <div style={{
                position: 'absolute',
                left: 0, right: 0,
                top: 30,
                height: 1,
                background: 'var(--border-subtle)',
                pointerEvents: 'none',
              }} />

              {timeline.map((t, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  {/* Year */}
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#c9a227',
                    margin: '0 0 10px',
                    letterSpacing: '0.5px',
                    lineHeight: 1,
                  }}>
                    {t.year}
                  </p>

                  {/* Dot */}
                  <div style={{
                    width: 10, height: 10,
                    borderRadius: '50%',
                    background: '#c9a227',
                    boxShadow: '0 0 6px rgba(201,162,39,0.5)',
                    marginBottom: 20,
                    position: 'relative', zIndex: 2,
                  }} />

                  {/* Title */}
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--text)',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    lineHeight: 1.35,
                    margin: '0 0 10px',
                  }}>
                    {t.title}
                  </p>

                  {/* Description */}
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    color: 'var(--muted)',
                    lineHeight: 1.7,
                    margin: 0,
                  }}>
                    {t.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 4. CO ZNAJDZIESZ TUTAJ ═══════════════════════════════════ */}
        <section style={{ background: 'var(--surface)', padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 40px)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <SectionLabel label="CO ZNAJDZIESZ TUTAJ" />

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.88rem, 1.4vw, 1rem)',
              color: 'var(--muted)',
              lineHeight: 1.8,
              textAlign: 'center',
              maxWidth: 680,
              margin: '0 auto 40px',
            }}>
              Piszę o finansach tak, jak sam chciałbym to czytać. Bez lania wody, bez clickbaitowych tytułów, bez treści pisanych pod algorytm. Każdy artykuł powstaje z konkretnego powodu: bo temat jest ważny albo sam przez niego przechodziłem.
            </p>

            <div className="omnie-categories">
              {categories.map((cat) => (
                <Link key={cat.href} href={cat.href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    position: 'relative',
                    height: 280,
                    borderRadius: 12,
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}>
                    <Image
                      src={cat.img}
                      alt={cat.label}
                      fill
                      style={{ objectFit: 'cover', filter: 'brightness(0.38)' }}
                      sizes="(max-width: 960px) 33vw, 20vw"
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.90) 35%, rgba(0,0,0,0.1) 100%)',
                    }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 18px' }}>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 6px' }}>
                        {cat.label}
                      </p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 12px', lineHeight: 1.4 }}>
                        {cat.desc}
                      </p>
                      <span style={{ color: cat.color, fontSize: '1rem' }}>→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ══ JAK TWORZĘ TREŚCI (E-E-A-T) ══════════════════════════════ */}
        <section style={{ background: 'var(--bg)', padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 40px)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ maxWidth: 1040, margin: '0 auto' }}>
            <SectionLabel label="JAK TWORZĘ TREŚCI" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
              {principles.map((p, i) => (
                <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '26px 24px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#c9a227', letterSpacing: '2px', display: 'block', marginBottom: 14 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 10px', lineHeight: 1.3 }}>
                    {p.t}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.75, margin: 0 }}>
                    {p.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FAQ O AUTORZE ════════════════════════════════════════════ */}
        <section style={{ background: 'var(--surface)', padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 40px)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <SectionLabel label="CZĘSTE PYTANIA" />
            {faqItems.map((f, i) => (
              <details key={i} style={{ borderBottom: '1px solid var(--border-subtle)', padding: '18px 0' }}>
                <summary style={{ cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '0.5px', listStyle: 'none' }}>
                  {f.q}
                </summary>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.8, margin: '12px 0 0' }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ══ 5. FINANSE BEZ ŚCIEMY — 3-COLUMN CTA ════════════════════ */}
        <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 60px)' }}>
          {/* Background image */}
          <Image
            src="/images/o-mnie-cta.jpg"
            alt="KisielFinanse - finanse osobiste, inwestowanie i trading"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
            sizes="100vw"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(3,5,8,0.82)', zIndex: 1 }} />

          <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <div className="omnie-cta-grid">

              {/* Left */}
              <div>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  color: '#ffffff',
                  letterSpacing: '3px',
                  margin: '0 0 16px',
                  lineHeight: 1.1,
                }}>
                  FINANSE BEZ ŚCIEMY.
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, margin: '0 0 28px', maxWidth: 300 }}>
                  Inwestycje, oszczędzanie, zarządzanie pieniędzmi, psychologia finansów. Tylko to, co naprawdę działa.
                </p>
                <Link href="/" style={{
                  display: 'inline-block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  letterSpacing: '2px',
                  fontWeight: 700,
                  color: '#c9a227',
                  border: '1px solid #c9a227',
                  padding: '13px 26px',
                  textDecoration: 'none',
                }}>
                  ARTYKUŁY →
                </Link>
              </div>

              {/* Center — KF brand */}
              <div className="omnie-cta-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'relative', textAlign: 'center' }}>
                  <div style={{
                    position: 'absolute', inset: -40,
                    background: 'radial-gradient(circle, rgba(201,162,39,0.08) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }} />
                  <div style={{
                    width: 120, height: 120,
                    border: '1px solid var(--border)',
                    borderRadius: 20,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px',
                    background: 'var(--surface)',
                    position: 'relative',
                  }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: '#c9a227', letterSpacing: '3px' }}>
                      KF
                    </span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '3px', color: 'rgba(255,255,255,0.3)' }}>
                    KISIELFINANSE.PL
                  </p>
                </div>
              </div>

              {/* Right — WSPÓŁPRACA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div style={{
                  width: 52, height: 52,
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M7 8C7 5.8 8.8 4 11 4C13.2 4 15 5.8 15 8C15 10.2 13.2 12 11 12C8.8 12 7 10.2 7 8Z" stroke="var(--muted)" strokeWidth="1.5" />
                    <path d="M4 18C4 15.8 7.1 14 11 14C14.9 14 18 15.8 18 18" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <Link href="/wspolpraca" style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                  color: '#ffffff',
                  letterSpacing: '2px',
                  textDecoration: 'none',
                  display: 'block',
                  marginBottom: 8,
                }}>
                  WSPÓŁPRACA
                </Link>
                <Link href="/wspolpraca" style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.4)',
                  textDecoration: 'none',
                }}>
                  →
                </Link>
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
