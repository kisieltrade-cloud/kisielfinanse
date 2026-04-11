import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Stats from '@/components/Stats';
import WeeklyResults from '@/components/WeeklyResults';
import EquityCurve from '@/components/EquityCurve';
import RevealOnScroll from '@/components/RevealOnScroll';

export const metadata: Metadata = {
  title: 'Wyniki',
  description: 'Transparentne wyniki tradingowe — tygodniowe i miesięczne statystyki z rachunku własnego. Forex, krypto, futures.',
  keywords: ['wyniki tradingowe', 'transparentny trader', 'forex wyniki', 'equity curve', 'day trading wyniki'],
  alternates: { canonical: 'https://nysethtrading.pl/wyniki' },
  openGraph: {
    title: 'Wyniki Tradingowe — NysethTrading',
    description: 'Transparentne wyniki tradingowe — tygodniowe i miesięczne statystyki z rachunku własnego.',
    url: 'https://nysethtrading.pl/wyniki',
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
