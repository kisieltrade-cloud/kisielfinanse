import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Ticker from '@/components/Ticker';
import Stats from '@/components/Stats';
import WeeklyResults from '@/components/WeeklyResults';
import BlogSection from '@/components/BlogSection';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';
import About from '@/components/About';

export default function HomePage() {
  return (
    <>
      <RevealOnScroll />
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Stats />
        <Stats />
        <WeeklyResults />
        <BlogSection />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
