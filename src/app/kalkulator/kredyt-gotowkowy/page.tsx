import type { Metadata } from 'next';
import Image from 'next/image';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';
import CashLoanCalculator from '@/components/CashLoanCalculator';
import CalcRelated from '@/components/CalcRelated';

const BASE_URL = 'https://kisielfinanse.pl';
const URL      = `${BASE_URL}/kalkulator/kredyt-gotowkowy`;

export const metadata: Metadata = {
  title: { absolute: 'Kalkulator kredytu gotówkowego - rata i RRSO | KisielFinanse' },
  description: 'Kalkulator kredytu gotówkowego - oblicz ratę miesięczną i RRSO z prowizją i ubezpieczeniem. Sprawdź prawdziwy koszt przed podpisaniem umowy.',
  keywords: [
    'kalkulator kredytu gotówkowego', 'kredyt gotówkowy kalkulator',
    'rata kredytu gotówkowego', 'RRSO kalkulator', 'koszt kredytu',
    'prowizja kredyt', 'kalkulator raty', 'KisielFinanse kalkulator',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Kalkulator kredytu gotówkowego | KisielFinanse',
    description: 'Oblicz ratę i RRSO kredytu gotówkowego z prowizją i ubezpieczeniem. Sprawdź prawdziwy koszt przed podpisaniem umowy.',
    url: URL,
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kalkulator kredytu gotówkowego | KisielFinanse',
    description: 'Rata i RRSO kredytu gotówkowego z prowizją i ubezpieczeniem.',
    images: ['/og-image.png'],
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Kalkulatory',   item: `${BASE_URL}/kalkulator` },
    { '@type': 'ListItem', position: 3, name: 'Kredyt gotówkowy', item: URL },
  ],
};

const schemaApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kalkulator kredytu gotówkowego',
  url: URL,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  inLanguage: 'pl-PL',
  isAccessibleForFree: true,
  description: 'Kalkulator raty i RRSO kredytu gotówkowego z prowizją i ubezpieczeniem.',
  author: { '@type': 'Person', name: 'Mateusz Kisiel', url: `${BASE_URL}/o-mnie` },
  publisher: { '@type': 'Organization', name: 'KisielFinanse', url: BASE_URL },
};

export default function KredytGotowkowyPage() {
  return (
    <>
      <RevealOnScroll />
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaApp) }} />

      <main style={{ paddingTop: 64 }}>
        <style>{`
          .kg-hero { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: center; }
          @media (max-width: 760px) { .kg-hero { grid-template-columns: 1fr; gap: 20px; } }
        `}</style>
        <div style={{ background: '#f4f1ea' }}>
          <div className="kg-hero" style={{ maxWidth: 1040, margin: '0 auto', padding: '48px 24px 8px' }}>
            <div>
              <p style={{
                fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 700,
                color: '#2f6b4f', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 14px',
              }}>
                Kredyt gotówkowy
              </p>
              <h1 style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontWeight: 400,
                fontSize: 'clamp(2.6rem, 7vw, 4.6rem)',
                letterSpacing: '-1px',
                lineHeight: 1.02,
                color: '#1a2230',
                margin: '0 0 22px',
              }}>
                Kredyt<br />gotówkowy
              </h1>
              <p style={{
                fontFamily: 'var(--font-ui)', fontSize: '1rem', color: '#5d6b7a',
                lineHeight: 1.7, maxWidth: 480, margin: 0,
              }}>
                Rata miesięczna i RRSO z uwzględnieniem prowizji i ubezpieczenia.
                Sprawdź prawdziwy koszt kredytu zanim podpiszesz umowę.
              </p>
            </div>
            <div style={{ justifySelf: 'end', width: '100%', maxWidth: 520 }}>
              <Image
                src="/images/kredyt-gotowkowy-hero-v2.png"
                alt="Kalkulator z wyświetlaczem 15,1% obok rośliny i książek na biurku"
                width={1536}
                height={1024}
                priority
                sizes="(max-width: 760px) 100vw, 520px"
                style={{ width: '100%', height: 'auto', borderRadius: 14 }}
              />
            </div>
          </div>

          <CashLoanCalculator />
        </div>
      </main>
      <CalcRelated currentPath="/kalkulator/kredyt-gotowkowy" />
      <Footer />
    </>
  );
}
