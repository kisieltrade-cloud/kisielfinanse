import dynamic from 'next/dynamic';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import BlogSection from '@/components/BlogSection';
import FAQ from '@/components/FAQ';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';

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
