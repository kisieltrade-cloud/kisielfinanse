import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import RevealOnScroll from '@/components/RevealOnScroll';
import CashLoanCalculator from '@/components/CashLoanCalculator';
import CalcRelated from '@/components/CalcRelated';

const BASE_URL = 'https://kisielfinanse.pl';
const URL      = `${BASE_URL}/kalkulator/kredyt-gotowkowy`;

export const metadata: Metadata = {
  title: { absolute: 'Kalkulator kredytu gotówkowego - rata i RRSO | KisielFinanse' },
  description: 'Darmowy kalkulator kredytu gotówkowego. Oblicz ratę miesięczną i RRSO z uwzględnieniem prowizji i ubezpieczenia. Sprawdź prawdziwy koszt kredytu przed podpisaniem umowy.',
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

      <main style={{ paddingTop: '80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 24px 0' }}>
          <Breadcrumbs items={[
            { label: 'KisielFinanse', href: '/' },
            { label: 'Kalkulatory',   href: '/kalkulator' },
            { label: 'Kredyt gotówkowy' },
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
            KREDYT<br />
            <span style={{ color: '#c9a227' }}>GOTÓWKOWY</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--muted)',
            lineHeight: 1.8,
            maxWidth: 560,
            marginBottom: 48,
          }}>
            Rata miesięczna i RRSO z uwzględnieniem prowizji i ubezpieczenia.
            Sprawdź prawdziwy koszt kredytu zanim podpiszesz umowę.
          </p>
        </div>

        <CashLoanCalculator />
      </main>
      <CalcRelated currentPath="/kalkulator/kredyt-gotowkowy" />
      <Footer />
    </>
  );
}
