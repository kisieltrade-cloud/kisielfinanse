import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';
import TygodnikArchive from '@/components/TygodnikArchive';

export const metadata: Metadata = {
  title: 'Dziennik Tygodniowy',
  description: 'Archiwum tygodniowych wyników tradingowych — każdy tydzień bez wyjątku. Wyniki, liczba transakcji, win rate i komentarz.',
  keywords: ['wyniki tygodniowe trading', 'dziennik tradera', 'transparentny trading', 'archiwum wyników forex'],
  alternates: { canonical: 'https://nysethtrading.pl/tygodnik' },
  openGraph: {
    title: 'Dziennik Tygodniowy — NysethTrading',
    description: 'Archiwum tygodniowych wyników tradingowych — każdy tydzień bez wyjątku.',
    url: 'https://nysethtrading.pl/tygodnik',
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
