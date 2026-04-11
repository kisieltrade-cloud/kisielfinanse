import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Stats from '@/components/Stats';
import WeeklyResults from '@/components/WeeklyResults';
import EquityCurve from '@/components/EquityCurve';
import RevealOnScroll from '@/components/RevealOnScroll';

const OG_IMAGE = { url: '/og-image.png', width: 1200, height: 630, alt: 'Wyniki Tradingowe — NysethTrading' };

export const metadata: Metadata = {
  title: 'Wyniki Tradingowe 2026 — Equity Curve, Win Rate, Statystyki | NysethTrading',
  description: 'Transparentne wyniki tradingowe 2026 — equity curve, tygodniowe i miesięczne statystyki z rachunku własnego. Win rate 91%, profit factor 10.87. Forex, krypto, futures.',
  keywords: [
    'wyniki tradingowe 2026', 'transparentny trader', 'equity curve', 'win rate trading',
    'profit factor', 'day trading wyniki', 'forex wyniki', 'challenge tradingowy wyniki',
    'statystyki tradingowe', 'US100 wyniki',
  ],
  alternates: { canonical: 'https://nysethtrading.pl/wyniki' },
  openGraph: {
    title: 'Wyniki Tradingowe 2026 — NysethTrading',
    description: 'Equity curve, win rate 91%, profit factor 10.87 — transparentne wyniki z rachunku własnego. Bez selekcji, bez retuszu.',
    url: 'https://nysethtrading.pl/wyniki',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wyniki Tradingowe 2026 — NysethTrading',
    description: 'Win rate 91%, profit factor 10.87. Transparentne wyniki każdego tygodnia.',
    images: ['/og-image.png'],
  },
};

export default function WynikiPage() {
  return (
    <>
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
