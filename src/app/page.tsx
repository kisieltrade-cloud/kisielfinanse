import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Ticker from '@/components/Ticker';
import Stats from '@/components/Stats';
import WeeklyResults from '@/components/WeeklyResults';
import BlogSection from '@/components/BlogSection';
import FAQ from '@/components/FAQ';
import MarketSessions from '@/components/MarketSessions';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';

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
