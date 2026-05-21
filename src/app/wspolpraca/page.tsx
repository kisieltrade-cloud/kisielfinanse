import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Breadcrumbs from '@/components/Breadcrumbs';
import Wspolpraca from '@/components/Wspolpraca';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';

const OG_IMAGE = { url: '/og-image.png', width: 1200, height: 630, alt: 'Współpraca - KisielFinanse' };

export const metadata: Metadata = {
  title: 'Współpraca - Sponsoring, Afiliacja, Partnerstwo | KisielFinanse',
  description:
    'Współpraca z KisielFinanse - edukacja o rynkach finansowych. Giełdy krypto, platformy tradingowe, sponsoring, afiliacja. Skontaktuj się.',
  keywords: [
    'współpraca trading', 'sponsoring portal tradingowy', 'afiliacja krypto', 'partner giełda krypto',
    'współpraca portal edukacyjny', 'partnerstwo forex', 'reklama portal tradingowy',
  ],
  alternates: { canonical: 'https://kisielfinanse.pl/wspolpraca' },
  openGraph: {
    title: 'Współpraca - KisielFinanse',
    description: 'Edukacja o rynkach finansowych. Giełdy krypto, platformy tradingowe, sponsoring, afiliacja.',
    url: 'https://kisielfinanse.pl/wspolpraca',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Współpraca - KisielFinanse',
    description: 'Sponsoring, afiliacja, partnerstwo. Edukacja o Forexie, krypto i futures.',
    images: ['/og-image.png'],
  },
};

export default function WspolpracaPage() {
  return (
    <>
      <RevealOnScroll />
      <Nav />
      <main style={{ paddingTop: '80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 0' }}>
          <Breadcrumbs items={[
            { label: 'KisielFinanse', href: '/' },
            { label: 'Współpraca' },
          ]} />
        </div>
        <Wspolpraca />
      </main>
      <Footer />
    </>
  );
}
