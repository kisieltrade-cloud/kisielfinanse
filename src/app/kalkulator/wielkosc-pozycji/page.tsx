import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import PositionSizeCalculator from '@/components/PositionSizeCalculator';
import CalcRelated from '@/components/CalcRelated';

const BASE_URL = 'https://kisielfinanse.pl';
const URL = `${BASE_URL}/kalkulator/wielkosc-pozycji`;

export const metadata: Metadata = {
  title: { absolute: 'Kalkulator wielkości pozycji - ile lotów kupić' },
  description: 'Policz wielkość pozycji na podstawie kapitału, ryzyka i stop lossa. Kalkulator position sizing dla tradera: ile jednostek kupić, żeby ryzykować tylko 1-2% kapitału. Bez rejestracji.',
  keywords: ['kalkulator wielkości pozycji', 'position sizing', 'ile lotów kupić', 'zarządzanie ryzykiem trading', 'wielkość pozycji trading', 'kalkulator ryzyka trading'],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Kalkulator wielkości pozycji | KisielFinanse',
    description: 'Ile kupić, żeby ryzykować tylko 1-2% kapitału? Policz wielkość pozycji z ryzyka i stop lossa.',
    url: URL,
    images: [{ url: '/kalkulator/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kalkulator wielkości pozycji | KisielFinanse',
    description: 'Position sizing w 10 sekund: kapitał + ryzyko% + stop loss → ile jednostek kupić.',
    images: ['/kalkulator/opengraph-image'],
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Kalkulatory', item: `${BASE_URL}/kalkulator` },
    { '@type': 'ListItem', position: 3, name: 'Kalkulator wielkości pozycji', item: URL },
  ],
};

const schemaApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kalkulator wielkości pozycji KisielFinanse',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'PLN' },
  description: 'Kalkulator position sizing: liczy wielkość pozycji z kapitału, ryzyka procentowego i odległości do stop lossa.',
};

export default function WielkoscPozycjiPage() {
  return (
    <>
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaApp) }} />

      <main style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 24px 0' }}>
          <Breadcrumbs items={[
            { label: 'KisielFinanse', href: '/' },
            { label: 'Kalkulatory', href: '/kalkulator' },
            { label: 'Wielkość pozycji' },
          ]} />

          <header style={{ margin: '20px 0 28px', maxWidth: 640 }}>
            <h1 style={{ fontSize: 'clamp(1.9rem, 4.5vw, 2.7rem)', lineHeight: 1.08, margin: '0 0 14px', fontWeight: 800 }}>
              Kalkulator wielkości pozycji
            </h1>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--muted)', margin: 0 }}>
              Najważniejsza liczba w tradingu, o której początkujący zwykle nie myślą: ile właściwie kupić.
              Podaj kapitał, ile procent chcesz zaryzykować oraz cenę wejścia i stop lossa, a kalkulator policzy
              wielkość pozycji tak, żeby strata na stop lossie była dokładnie taka, jak zakładasz.
            </p>
          </header>
        </div>

        <div style={{ padding: '0 24px' }}>
          <PositionSizeCalculator />
        </div>

        <div style={{ marginTop: 40 }}>
          <CalcRelated currentPath="/kalkulator/wielkosc-pozycji" />
        </div>
      </main>
      <Footer />
    </>
  );
}
