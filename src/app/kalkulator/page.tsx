import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Calculator from '@/components/Calculator';
import Breadcrumbs from '@/components/Breadcrumbs';
import RevealOnScroll from '@/components/RevealOnScroll';

export const metadata: Metadata = {
  title: 'Kalkulator Finansowy - Procent Składany i Risk/Reward | KisielFinanse',
  description: 'Darmowy kalkulator finansowy: procent składany (kapitał startowy, wpłaty, stopa zwrotu) oraz risk/reward dla traderów. Oblicz wielkość pozycji i potencjalny zysk.',
  keywords: [
    'kalkulator procent składany', 'kalkulator risk reward', 'kalkulator inwestycji',
    'kalkulator trading', 'wielkość pozycji', 'zarządzanie ryzykiem kalkulator',
    'kalkulator oszczędności', 'compound interest calculator', 'KisielFinanse kalkulator',
  ],
  alternates: { canonical: 'https://kisielfinanse.pl/kalkulator' },
  openGraph: {
    title: 'Kalkulator Finansowy | KisielFinanse',
    description: 'Procent składany i Risk/Reward w jednym miejscu. Oblicz swój potencjał inwestycyjny.',
    url: 'https://kisielfinanse.pl/kalkulator',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kalkulator Finansowy | KisielFinanse',
    description: 'Procent składany i Risk/Reward. Darmowy kalkulator dla inwestorów i traderów.',
    images: ['/og-image.png'],
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: 'https://kisielfinanse.pl' },
    { '@type': 'ListItem', position: 2, name: 'Kalkulator',    item: 'https://kisielfinanse.pl/kalkulator' },
  ],
};

const schemaApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kalkulator Finansowy KisielFinanse',
  url: 'https://kisielfinanse.pl/kalkulator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  inLanguage: 'pl-PL',
  isAccessibleForFree: true,
  description: 'Darmowy kalkulator finansowy: procent składany oraz risk/reward dla traderów i inwestorów.',
  author: {
    '@type': 'Person',
    name: 'Mateusz Kisiel',
    url: 'https://kisielfinanse.pl/o-mnie',
  },
  publisher: {
    '@type': 'Organization',
    name: 'KisielFinanse',
    url: 'https://kisielfinanse.pl',
  },
  featureList: [
    'Kalkulator procentu składanego',
    'Kalkulator risk/reward',
    'Interaktywny wykres wzrostu kapitału',
  ],
};

export default function KalkulatorPage() {
  return (
    <>
      <RevealOnScroll />
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaApp) }}
      />
      <main style={{ paddingTop: '80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 24px 0' }}>
          <Breadcrumbs items={[
            { label: 'KisielFinanse', href: '/' },
            { label: 'Kalkulator' },
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
            KALKULATOR<br />
            <span style={{ color: '#c9a227' }}>FINANSOWY</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: '#8a9ab5',
            lineHeight: 1.8,
            maxWidth: 560,
            marginBottom: 48,
          }}>
            Sprawdź ile urośnie Twój kapitał dzięki procentowi składanemu lub policz
            stosunek risk/reward przed otwarciem pozycji.
          </p>
        </div>

        <Calculator />
      </main>
      <Footer />
    </>
  );
}
