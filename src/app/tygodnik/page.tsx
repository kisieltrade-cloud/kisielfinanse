import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';
import TygodnikArchive from '@/components/TygodnikArchive';

const OG_IMAGE = { url: '/og-image.png', width: 1200, height: 630, alt: 'Dziennik Tygodniowy — NysethTrading' };

export const metadata: Metadata = {
  title: 'Dziennik Tygodniowy — Archiwum Wyników Trading 2026 | NysethTrading',
  description: 'Archiwum tygodniowych wyników tradingowych 2026 — każdy tydzień bez wyjątku. Win rate, liczba transakcji, P&L i komentarz tradera. 5/5 zielonych tygodni.',
  keywords: [
    'wyniki tygodniowe trading', 'dziennik tradera', 'transparentny trading',
    'archiwum wyników forex', 'tygodniowe wyniki day trading', 'challenge tradingowy tygodnie',
    'win rate tygodniowy', 'dziennik inwestora',
  ],
  alternates: { canonical: 'https://nysethtrading.pl/tygodnik' },
  openGraph: {
    title: 'Dziennik Tygodniowy — Archiwum Wyników 2026 | NysethTrading',
    description: '5/5 zielonych tygodni. Każdy tydzień — wyniki, transakcje, win rate i komentarz. Pełna transparentność.',
    url: 'https://nysethtrading.pl/tygodnik',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dziennik Tygodniowy — NysethTrading',
    description: '5/5 zielonych tygodni. Archiwum wyników tradingowych 2026.',
    images: ['/og-image.png'],
  },
};

export default function TygodnikPage() {
  return (
    <>
      <RevealOnScroll />
      <Nav />
      <main style={{ paddingTop: '80px' }}>
        <TygodnikArchive />
      </main>
      <Footer />
    </>
  );
}
