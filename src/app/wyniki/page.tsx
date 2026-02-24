import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Stats from '@/components/Stats';
import WeeklyResults from '@/components/WeeklyResults';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';

export const metadata: Metadata = {
  title: 'Wyniki',
  description:
    'Transparentne wyniki tradingowe — tygodniowe i miesięczne statystyki z rachunku własnego. Forex, krypto, futures. Bez owijania w bawełnę.',
  keywords: ['wyniki tradingowe', 'transparentny trader', 'forex wyniki', 'krypto trading wyniki', 'day trading statystyki'],
  openGraph: {
    title: 'Wyniki Tradingowe | NysethTrading',
    description: 'Tygodniowe i miesięczne wyniki z rachunku własnego. Forex, krypto, futures — bez filtrów.',
    url: 'https://nyseth-trading.vercel.app/wyniki',
  },
};

export default function WynikiPage() {
  return (
    <>
      <RevealOnScroll />
      <Nav />
      <main style={{ paddingTop: '80px' }}>
        <Stats />
        <WeeklyResults />
      </main>
      <Footer />
    </>
  );
}
