import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import About from '@/components/About';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'O mnie',
  description: 'Trader z Wrocławia z blisko 7-letnim doświadczeniem. Poznaj historię NysethTrading.',
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: '80px' }}>
        <About />
      </main>
      <Footer />
    </>
  );
}