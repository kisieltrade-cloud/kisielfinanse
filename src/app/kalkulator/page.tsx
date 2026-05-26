import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import RevealOnScroll from '@/components/RevealOnScroll';

const BASE_URL = 'https://kisielfinanse.pl';

export const metadata: Metadata = {
  title: { absolute: 'Kalkulatory Finansowe - Procent Skladany, FIRE, ETF, Hipoteczny | KisielFinanse' },
  description: 'Darmowe kalkulatory finansowe online: procent skladany, kalkulator FIRE, symulacja ETF vs lokata, risk/reward dla traderow i kalkulator hipoteczny. Bez rejestracji.',
  keywords: [
    'kalkulator finansowy', 'kalkulator procent skladany', 'kalkulator FIRE',
    'kalkulator ETF', 'kalkulator risk reward', 'kalkulator hipoteczny',
    'kalkulatory inwestycyjne', 'wolnosc finansowa kalkulator', 'KisielFinanse kalkulator',
  ],
  alternates: { canonical: `${BASE_URL}/kalkulator` },
  openGraph: {
    title: 'Kalkulatory Finansowe | KisielFinanse',
    description: 'Procent skladany, FIRE, ETF vs lokata, risk/reward i hipoteczny. 5 darmowych kalkulatorow finansowych w jednym miejscu.',
    url: `${BASE_URL}/kalkulator`,
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kalkulatory Finansowe | KisielFinanse',
    description: 'Procent skladany, FIRE, ETF, risk/reward i hipoteczny. Darmowe kalkulatory dla inwestorow i traderow.',
    images: ['/og-image.png'],
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Kalkulatory',   item: `${BASE_URL}/kalkulator` },
  ],
};

const schemaCollectionPage = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Kalkulatory Finansowe KisielFinanse',
  description: 'Darmowe kalkulatory finansowe: procent skladany, FIRE, ETF vs lokata, risk/reward, kalkulator hipoteczny.',
  url: `${BASE_URL}/kalkulator`,
  publisher: {
    '@type': 'Organization',
    name: 'KisielFinanse',
    url: BASE_URL,
  },
};

const CALCS = [
  {
    href: '/kalkulator/procent-skladany',
    label: 'Procent skladany',
    desc: 'Ile urośnie Twoj kapital przy regularnych wplatach i zadanej stopie zwrotu? Sprawdz sile procentu skladanego w liczbach.',
    tag: 'Inwestycje',
    tagColor: '#f5c518',
  },
  {
    href: '/kalkulator/fire',
    label: 'Kalkulator FIRE',
    desc: 'Ile lat zostalo Ci do finansowej niezaleznosci? Wpisz oszczednosci, wplaty i wydatki - kalkulator wyliczy Twoja date FIRE.',
    tag: 'Wolnosc finansowa',
    tagColor: '#e8963a',
  },
  {
    href: '/kalkulator/etf',
    label: 'Symulacja ETF vs lokata',
    desc: 'Porownaj inwestycje w ETF z lokata bankowa. Zobacz roznice w koncowym kapitale po uwzglednieniu podatku Belki.',
    tag: 'Inwestycje',
    tagColor: '#f5c518',
  },
  {
    href: '/kalkulator/risk-reward',
    label: 'Risk / Reward',
    desc: 'Policz stosunek risk/reward, wielkosc pozycji i potencjalny zysk przed kazda transakcja. Zarzadzanie ryzykiem w praktyce.',
    tag: 'Trading',
    tagColor: '#c9a227',
  },
];

export default function KalkulatorPage() {
  return (
    <>
      <RevealOnScroll />
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaCollectionPage) }} />

      <main style={{ paddingTop: '80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 24px 0' }}>
          <Breadcrumbs items={[
            { label: 'KisielFinanse', href: '/' },
            { label: 'Kalkulatory' },
          ]} />
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 0' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            letterSpacing: '4px',
            marginBottom: 12,
            lineHeight: 1.05,
          }}>
            KALKULATORY<br />
            <span style={{ color: '#c9a227' }}>FINANSOWE</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: '#c8d4e8',
            lineHeight: 1.8,
            maxWidth: 560,
            marginBottom: 48,
          }}>
            Darmowe narzedzia do liczenia: procent skladany, kalkulator FIRE,
            symulacja ETF, risk/reward i kredyt hipoteczny. Bez rejestracji.
          </p>

          {/* Siatka kalkulatorow */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: 2,
            marginBottom: 2,
          }}>
            {CALCS.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                style={{
                  display: 'block',
                  background: 'var(--surface)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderTop: `3px solid ${c.tagColor}`,
                  padding: '24px',
                  textDecoration: 'none',
                  transition: 'border-color 0.15s',
                }}
                className="calc-hub-card"
              >
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  color: c.tagColor,
                  letterSpacing: '2px',
                  marginBottom: 10,
                }}>
                  {c.tag.toUpperCase()}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1rem',
                  letterSpacing: '2px',
                  color: 'var(--text)',
                  marginBottom: 10,
                }}>
                  {c.label.toUpperCase()}
                </div>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: '#c8d4e8',
                  lineHeight: 1.75,
                  margin: '0 0 16px',
                }}>
                  {c.desc}
                </p>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: c.tagColor,
                }}>
                  Otworz kalkulator →
                </span>
              </Link>
            ))}

            {/* Kalkulator hipoteczny - wyrozniony */}
            <Link
              href="/kalkulator-hipoteczny"
              style={{
                display: 'block',
                background: 'var(--surface)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderTop: '3px solid #c9a227',
                padding: '24px',
                textDecoration: 'none',
                gridColumn: 'span 2',
              }}
              className="calc-hub-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    color: '#c9a227',
                    letterSpacing: '2px',
                    marginBottom: 10,
                  }}>
                    KREDYTY
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.1rem',
                    letterSpacing: '2px',
                    color: 'var(--text)',
                    marginBottom: 10,
                  }}>
                    KALKULATOR HIPOTECZNY
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: '#c8d4e8',
                    lineHeight: 1.75,
                    margin: '0 0 16px',
                    maxWidth: 520,
                  }}>
                    Oblicz rate miesieczna kredytu hipotecznego, calkownity koszt i porownaj raty rowne z malejacymi. Bez rejestracji.
                  </p>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: '#c9a227',
                  }}>
                    Otworz kalkulator →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
