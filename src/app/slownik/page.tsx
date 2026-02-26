import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';
import Slownik from '@/components/Slownik';

export const metadata: Metadata = {
  title: 'Słownik Tradingowy',
  description: 'Kompletny słownik pojęć tradingowych — Forex, krypto, futures, indeksy. Definicje SL, TP, RR, drawdown, equity curve i wielu innych.',
  keywords: ['słownik tradingowy', 'pojęcia trading', 'definicje forex', 'co to pip', 'co to drawdown', 'co to stop loss', 'słownik krypto'],
};

export default function SlownikPage() {
  return (
    <>
      <RevealOnScroll />
      <Nav />
      <main style={{ paddingTop: '80px' }}>
        <Slownik />
      </main>
      <Footer />
    </>
  );
}
