import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import DailyWidget from '@/components/DailyWidget';
import BlogSection from '@/components/BlogSection';
import FAQ from '@/components/FAQ';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';

const OG_IMAGE = { url: '/og-image.png', width: 1200, height: 630, alt: 'NysethTrading — Transparentne Wyniki Tradingowe' };

export const metadata: Metadata = {
  title: 'NysethTrading — Transparentne Wyniki Tradingowe | Day Trading Forex i Krypto',
  description: 'Trader z Wrocławia z 9-letnim doświadczeniem. Transparentne wyniki tradingowe — tygodniowe statystyki, equity curve, win rate. Forex, futures, krypto. Bez ściemy.',
  keywords: [
    'trading', 'day trading', 'forex', 'krypto', 'futures', 'US100', 'NAS100',
    'wyniki tradingowe', 'transparentny trader', 'scalping', 'zarządzanie ryzykiem',
    'challenge tradingowy', 'equity curve', 'win rate', 'profit factor',
    'trader wrocław', 'nysethtrading',
  ],
  alternates: { canonical: 'https://nysethtrading.pl' },
  openGraph: {
    type: 'website',
    url: 'https://nysethtrading.pl',
    title: 'NysethTrading — Transparentne Wyniki Tradingowe',
    description: 'Trader z Wrocławia z 9-letnim doświadczeniem. Wyniki publikowane co tydzień — bez filtrów.',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NysethTrading — Transparentne Wyniki Tradingowe',
    description: 'Trader z Wrocławia. Wyniki co tydzień — bez filtrów. Forex, futures, krypto.',
    images: ['/og-image.png'],
  },
};

/* ─── Lazy load — ładowane dopiero gdy potrzebne (zmniejsza initial JS bundle) ─── */
const Ticker = dynamic(() => import('@/components/Ticker'));
const MarketSessions = dynamic(() => import('@/components/MarketSessions'));
const WeeklyResults = dynamic(() => import('@/components/WeeklyResults'));

export default function HomePage() {
  return (
    <>
      <RevealOnScroll />
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Stats />
        <DailyWidget />
        <WeeklyResults />
        <MarketSessions />
        <BlogSection />
        <FAQ />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
