import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Slownik from '@/components/Slownik';
import { TERMS } from '@/lib/slownik-terms';

const BASE_URL = 'https://nysethtrading.pl';

const OG_IMAGE = { url: '/og-image.png', width: 1200, height: 630, alt: 'Słownik Tradingowy — NysethTrading' };

export const metadata: Metadata = {
  title: 'Słownik Tradingowy — Definicje Forex, Krypto, Futures | NysethTrading',
  description:
    'Słownik tradingowy z definicjami pojęć forex, krypto i futures. Price action, liquidity, order block, smart money, scalping i wiele więcej. Praktyczne wyjaśnienia tradera z 9-letnim doświadczeniem.',
  keywords: [
    'słownik tradingowy', 'definicje trading', 'pojęcia forex', 'słownik inwestora',
    'price action definicja', 'liquidity trading', 'order block', 'smart money concept',
    'scalping definicja', 'futures pojęcia', 'co to jest trading', 'słownik krypto',
  ],
  alternates: {
    canonical: `${BASE_URL}/slownik`,
  },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    title: 'Słownik Tradingowy — Forex, Krypto, Futures | NysethTrading',
    description:
      'Baza wiedzy tradera — definicje i wyjaśnienia pojęć rynkowych. Price action, SMC, liquidity i wiele więcej.',
    url: `${BASE_URL}/slownik`,
    siteName: 'NysethTrading',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Słownik Tradingowy — NysethTrading',
    description: 'Definicje pojęć forex, krypto i futures. Price action, liquidity, SMC i wiele więcej.',
    images: ['/og-image.png'],
  },
};

const schemaCollection = {
  '@context': 'https://schema.org',
  '@type': 'DefinedTermSet',
  name: 'Słownik Tradingowy NysethTrading',
  description: 'Baza definicji pojęć tradingowych — forex, krypto, futures. Price action, liquidity, SMC i wiele więcej.',
  url: `${BASE_URL}/slownik`,
  inLanguage: 'pl-PL',
  author: { '@type': 'Person', name: 'Mateusz Nyseth', url: `${BASE_URL}/o-mnie` },
  hasPart: TERMS.map(t => ({
    '@type': 'DefinedTerm',
    name: t.term,
    description: t.short,
    url: `${BASE_URL}/slownik/${t.slug}`,
  })),
};

export default function SlownikPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaCollection) }}
      />
      <Nav />
      <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
        <Slownik />
      </main>
      <Footer />
    </>
  );
}