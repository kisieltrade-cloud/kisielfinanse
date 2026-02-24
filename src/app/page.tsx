import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Ticker from '@/components/Ticker';
import WeeklyResults from '@/components/WeeklyResults';
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
        <WeeklyResults />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
