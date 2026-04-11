import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Wspolpraca from '@/components/Wspolpraca';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';

export const metadata: Metadata = {
  title: 'Współpraca',
  description:
    'Współpraca z NysethTrading — giełdy krypto, sponsoring, afiliacja. Trader z 9-letnim doświadczeniem, transparentne wyniki, aktywna społeczność.',
  keywords: ['współpraca trading', 'sponsoring trader', 'afiliacja krypto', 'partner giełda krypto'],
  alternates: { canonical: 'https://nysethtrading.pl/wspolpraca' },
  openGraph: {
    title: 'Współpraca | NysethTrading',
    description: 'Giełdy krypto, sponsoring, afiliacja — nawiąż współpracę z aktywnym traderem.',
    url: 'https://nysethtrading.pl/wspolpraca',
  },
};

export default function WspolpracaPage() {
  return (
    <>
      <RevealOnScroll />
      <Nav />
      <main style={{ paddingTop: '80px' }}>
        <Wspolpraca />
      </main>
      <Footer />
    </>
  );
}
