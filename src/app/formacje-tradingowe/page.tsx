import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import PatternEncyclopedia from '@/components/PatternEncyclopedia';
import NewsletterForm from '@/components/NewsletterForm';

const BASE_URL = 'https://kisielfinanse.pl';
const URL = `${BASE_URL}/formacje-tradingowe`;

export const metadata: Metadata = {
  title: { absolute: 'Formacje świecowe i wykresu - encyklopedia tradera' },
  description: 'Encyklopedia formacji tradingowych: świece japońskie (młot, doji, objęcie hossy) i formacje wykresu (głowa z ramionami, podwójny szczyt, flagi). Każda narysowana, z opisem i wskazówką jak grać.',
  keywords: ['formacje świecowe', 'formacje wykresu', 'formacje tradingowe', 'głowa z ramionami', 'podwójny szczyt', 'flaga byka', 'objęcie hossy', 'młot doji'],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Formacje świecowe i wykresu - encyklopedia tradera | KisielFinanse',
    description: 'Wszystkie ważne formacje w jednym miejscu, narysowane i wyjaśnione: świecowe i wykresu, odwrócenia i kontynuacje.',
    url: URL,
    type: 'website',
    locale: 'pl_PL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Encyklopedia formacji tradingowych | KisielFinanse',
    description: 'Świece i formacje wykresu, narysowane i wyjaśnione. Jak je rozpoznać i jak grać.',
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Formacje tradingowe', item: URL },
  ],
};

export default function FormacjeTradingowePage() {
  return (
    <div data-theme="dark" style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />

      <main style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px 0' }}>
          <Breadcrumbs items={[
            { label: 'KisielFinanse', href: '/' },
            { label: 'Formacje tradingowe' },
          ]} />

          <header style={{ margin: '20px 0 30px', maxWidth: 720 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--cyan)', margin: '0 0 14px', fontWeight: 600 }}>
              Encyklopedia · price action
            </p>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.06, margin: '0 0 16px', fontWeight: 800 }}>
              Formacje świecowe i wykresu
            </h1>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--muted)', margin: 0 }}>
              Najważniejsze formacje, które realnie widać na wykresie, w jednym miejscu. Każda jest narysowana,
              opisana i oznaczona: byczy czy niedźwiedzi, odwrócenie czy kontynuacja, jak silny sygnał daje i jak ją grać.
              Filtruj i ucz się rozpoznawać je na pierwszy rzut oka.
            </p>
          </header>
        </div>

        <div style={{ padding: '0 24px' }}>
          <PatternEncyclopedia />
        </div>

        <section style={{ maxWidth: 720, margin: '0 auto', padding: '44px 24px 0' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 14px' }}>Jak używać formacji</h2>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--muted)', margin: '0 0 14px' }}>
            Formacja to nie magiczny znak, tylko zapis walki kupujących ze sprzedającymi. Działa najlepiej w kontekście:
            ta sama formacja przy ważnym <Link href="/trading/wsparcie-i-opor-jak-wyznaczac-poziomy" style={{ color: 'var(--cyan)' }}>wsparciu lub oporze</Link> znaczy
            dużo, a w środku chaotycznego ruchu prawie nic. Podstawy czytania wykresu rozkładam w artykule o{' '}
            <Link href="/trading/swiece-japonskie-jak-czytac-wykres" style={{ color: 'var(--cyan)' }}>świecach japońskich</Link>.
          </p>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--muted)', margin: 0 }}>
            Rozpoznawanie formacji poćwiczysz na żywym wykresie w{' '}
            <Link href="/symulator-tradingu" style={{ color: 'var(--cyan)' }}>symulatorze tradingu</Link>, a całą drogę nauki
            znajdziesz w przewodniku <Link href="/naucz-sie-tradowac" style={{ color: 'var(--cyan)' }}>naucz się tradować</Link>.
          </p>
        </section>

        <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px 80px' }}>
          <NewsletterForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
