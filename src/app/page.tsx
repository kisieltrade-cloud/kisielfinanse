// Odświeżaj co godzinę — nowe artykuły pojawią się automatycznie po dacie publikacji
export const revalidate = 3600;

import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import CategoriesSection from '@/components/CategoriesSection';
import CalcSection from '@/components/CalcSection';
import HomeRanking from '@/components/HomeRanking';
import BlogSection from '@/components/BlogSection';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';
import NewsletterForm from '@/components/NewsletterForm';

const OG_IMAGE = { url: '/og-image.png', width: 1200, height: 630, alt: 'KisielFinanse - Finanse. Wiedza. Wolnosc.' };

export const metadata: Metadata = {
  title: { absolute: 'KisielFinanse - Finanse. Wiedza. Wolność.' },
  description: 'Praktyczna wiedza o finansach osobistych, inwestowaniu i tradingu. Kalkulatory, artykuły i portfel inwestycyjny. Bez ściemy, bez kursów za fortunę.',
  keywords: [
    'finanse osobiste', 'inwestowanie', 'trading', 'ETF', 'oszczędzanie',
    'kalkulator finansowy', 'portfel inwestycyjny', 'edukacja finansowa',
    'forex', 'krypto', 'IKE', 'IKZE', 'KisielFinanse',
  ],
  alternates: { canonical: 'https://kisielfinanse.pl' },
  openGraph: {
    type: 'website',
    url: 'https://kisielfinanse.pl',
    title: 'KisielFinanse - Finanse. Wiedza. Wolność.',
    description: 'Praktyczna wiedza o finansach osobistych, inwestowaniu i tradingu. Bez ściemy, bez kursów za fortunę.',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KisielFinanse - Finanse. Wiedza. Wolność.',
    description: 'Praktyczna wiedza o finansach osobistych, inwestowaniu i tradingu. Bez ściemy.',
    images: ['/og-image.png'],
  },
};

export default function HomePage() {
  return (
    <div data-theme="dark" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <RevealOnScroll />
      <Nav />
      <main>
        <Hero />
        <CalcSection />
        <HomeRanking />
        <CategoriesSection />
        <BlogSection />
        <FAQ />
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px 80px' }}>
          <NewsletterForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
