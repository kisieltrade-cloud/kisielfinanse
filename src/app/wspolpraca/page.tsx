import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Wspolpraca from '@/components/Wspolpraca';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';

const OG_IMAGE = { url: '/og-image.png', width: 1200, height: 630, alt: 'Współpraca — NysethTrading' };

export const metadata: Metadata = {
  title: 'Współpraca — Sponsoring, Afiliacja, Partnerstwo | NysethTrading',
  description:
    'Współpraca z NysethTrading — giełdy krypto, platformy tradingowe, sponsoring, afiliacja. Trader z 9-letnim doświadczeniem, transparentne wyniki, aktywna społeczność. Skontaktuj się.',
  keywords: [
    'współpraca trading', 'sponsoring trader', 'afiliacja krypto', 'partner giełda krypto',
    'współpraca influencer trading', 'partnerstwo broker forex', 'reklama blog tradingowy',
  ],
  alternates: { canonical: 'https://nysethtrading.pl/wspolpraca' },
  openGraph: {
    title: 'Współpraca — Sponsoring i Partnerstwo | NysethTrading',
    description: 'Giełdy krypto, platformy tradingowe, sponsoring, afiliacja — nawiąż współpracę z aktywnym traderem z udokumentowanymi wynikami.',
    url: 'https://nysethtrading.pl/wspolpraca',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Współpraca — NysethTrading',
    description: 'Sponsoring, afiliacja, partnerstwo. Trader z 9-letnim doświadczeniem i transparentnymi wynikami.',
    images: ['/og-image.png'],
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
