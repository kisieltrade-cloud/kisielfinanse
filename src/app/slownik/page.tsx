import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Slownik from '@/components/Slownik';

const BASE_URL = 'https://nysethtrading.pl';

export const metadata: Metadata = {
  title: 'Słownik Tradingowy — Forex, Krypto, Futures | NysethTrading',
  description:
    'Słownik tradingowy NysethTrading. Definicje pojęć z Forex, krypto i futures — price action, liquidity, order block i wiele więcej.',
  alternates: {
    canonical: `${BASE_URL}/slownik`,
  },
  openGraph: {
    title: 'Słownik Tradingowy | NysethTrading',
    description:
      'Baza wiedzy tradera — definicje i wyjaśnienia pojęć rynkowych.',
    url: `${BASE_URL}/slownik`,
  },
};

export default function SlownikPage() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
        <Slownik />
      </main>
      <Footer />
    </>
  );
}