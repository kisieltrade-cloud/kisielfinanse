// Odświeżaj co godzinę — nowe artykuły pojawią się automatycznie po dacie publikacji
export const revalidate = 3600;

import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import CategoriesSection from '@/components/CategoriesSection';
import LearnToTrade from '@/components/LearnToTrade';
import BlogSection from '@/components/BlogSection';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';

const OG_IMAGE = { url: '/og-image.png', width: 1200, height: 630, alt: 'KisielFinanse - Edukacja tradingowa' };

export const metadata: Metadata = {
  title: { absolute: 'KisielFinanse – Finanse. Wiedza. Wolność.' },
  description: 'Trader z Wrocławia z 9-letnim doświadczeniem. Praktyczna wiedza o day tradingu - Forex, krypto, futures. Bez ściemy, bez kursów za fortunę.',
  keywords: [
    'trading', 'day trading', 'forex', 'krypto', 'futures', 'US100', 'NAS100',
    'edukacja tradingowa', 'nauka tradingu', 'scalping', 'zarządzanie ryzykiem',
    'price action', 'trader wrocław', 'KisielFinanse',
  ],
  alternates: { canonical: 'https://kisielfinanse.pl' },
  openGraph: {
    type: 'website',
    url: 'https://kisielfinanse.pl',
    title: 'KisielFinanse - Edukacja tradingowa',
    description: 'Trader z Wrocławia z 9-letnim doświadczeniem. Praktyczna wiedza o day tradingu - bez ściemy.',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KisielFinanse - Edukacja tradingowa',
    description: 'Trader z Wrocławia. Forex, futures, krypto. Praktyczna wiedza bez ściemy.',
    images: ['/og-image.png'],
  },
};

export default function HomePage() {
  return (
    <>
      <RevealOnScroll />
      <Nav />
      <main>
        <Hero />
        <CategoriesSection />
        <LearnToTrade />
        <BlogSection />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
