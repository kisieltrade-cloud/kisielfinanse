import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Stats from '@/components/Stats';
import WeeklyResults from '@/components/WeeklyResults';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Wyniki',
  description: 'Transparentne wyniki tradingowe — miesięczne i tygodniowe statystyki NysethTrading.',
};

export default function WynikiPage() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: '80px' }}>
        <Stats />
        <WeeklyResults />
      </main>
      <Footer />
    </>
  );
}
