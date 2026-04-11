import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Stats from '@/components/Stats';
import WeeklyResults from '@/components/WeeklyResults';
import EquityCurve from '@/components/EquityCurve';
import RevealOnScroll from '@/components/RevealOnScroll';

const BASE_URL = 'https://nysethtrading.pl';
const OG_IMAGE = { url: '/og-image.png', width: 1200, height: 630, alt: 'Wyniki Tradingowe — NysethTrading' };

export const metadata: Metadata = {
  title: 'Wyniki Tradingowe 2026 — Equity Curve, Win Rate, Statystyki | NysethTrading',
  description: 'Transparentne wyniki tradingowe 2026 — equity curve, tygodniowe i miesięczne statystyki z rachunku własnego. Win rate 91%, profit factor 10.87. Forex, krypto, futures.',
  keywords: [
    'wyniki tradingowe 2026', 'transparentny trader', 'equity curve', 'win rate trading',
    'profit factor', 'day trading wyniki', 'forex wyniki', 'challenge tradingowy wyniki',
    'statystyki tradingowe', 'US100 wyniki',
  ],
  alternates: { canonical: `${BASE_URL}/wyniki` },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    title: 'Wyniki Tradingowe 2026 — NysethTrading',
    description: 'Equity curve, win rate 91%, profit factor 10.87 — transparentne wyniki z rachunku własnego. Bez selekcji, bez retuszu.',
    url: `${BASE_URL}/wyniki`,
    siteName: 'NysethTrading',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wyniki Tradingowe 2026 — NysethTrading',
    description: 'Win rate 91%, profit factor 10.87. Transparentne wyniki każdego tygodnia.',
    images: ['/og-image.png'],
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'NysethTrading', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Wyniki Tradingowe', item: `${BASE_URL}/wyniki` },
  ],
};

export default function WynikiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />
      <RevealOnScroll />
      <Nav />
      <main style={{ paddingTop: '80px' }}>
        <Stats />
        <EquityCurve />
        <WeeklyResults />
      </main>
      <Footer />
    </>
  );
}
