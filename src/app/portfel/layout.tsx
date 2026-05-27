import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export default function PortfelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
