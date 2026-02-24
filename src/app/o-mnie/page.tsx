import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import About from '@/components/About';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';

export const metadata: Metadata = {
  title: 'O mnie',
  description:
    'Nyseth — trader z Wrocławia z 7-letnim doświadczeniem. Zajmuję się day tradingiem na Forexie, krypto i futures. Poznaj moją historię i filozofię tradingu.',
  keywords: ['trader Wrocław', 'day trader Polska', 'forex trader', 'nyseth trading', 'o mnie'],
  openGraph: {
    title: 'O mnie | NysethTrading',
    description: 'Trader z Wrocławia z 7-letnim doświadczeniem. Day trading na Forexie, krypto i futures.',
    url: 'https://nyseth-trading.vercel.app/o-mnie',
  },
};

export default function AboutPage() {
  return (
    <>
      <RevealOnScroll />
      <Nav />
      <main style={{ paddingTop: '80px' }}>
        <About />
      </main>
      <Footer />
    </>
  );
}
