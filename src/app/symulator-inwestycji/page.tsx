import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import TimeTravel from '@/components/TimeTravel';
import NewsletterForm from '@/components/NewsletterForm';

const BASE_URL = 'https://kisielfinanse.pl';
const URL = `${BASE_URL}/symulator-inwestycji`;

export const metadata: Metadata = {
  title: { absolute: 'Ile byś zarobił? Symulator inwestycji' },
  description: 'Ile miałbyś dziś, gdybyś inwestował X zł miesięcznie w S&P 500, Bitcoina czy złoto od 2010 roku? Sprawdź na realnych danych historycznych. Symulator inwestycji.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Ile byś zarobił, gdybyś zaczął inwestować lata temu? | KisielFinanse',
    description: 'Sprawdź na realnych danych: S&P 500, NASDAQ, Bitcoin, złoto, polskie akcje. Symulator inwestycji od KisielFinanse.',
    url: URL,
    images: [{ url: '/symulator-inwestycji/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Podróż w czasie - symulator inwestycji | KisielFinanse',
    description: 'Ile miałbyś dziś, gdybyś zaczął inwestować lata temu? Sprawdź na realnych danych.',
    images: ['/symulator-inwestycji/opengraph-image'],
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Symulator inwestycji', item: URL },
  ],
};

const schemaApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Symulator inwestycji',
  url: URL,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  inLanguage: 'pl-PL',
  isAccessibleForFree: true,
  description: 'Symulator pokazuje, ile miałbyś dziś, gdybyś inwestował określoną kwotę w wybrane aktywo od wybranego roku. Oparty na realnych historycznych danych miesięcznych.',
  publisher: { '@type': 'Organization', name: 'KisielFinanse', url: BASE_URL },
};

export default function SymulatorPage() {
  return (
    <div data-theme="dark" style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaApp) }} />

      <main style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '32px 24px 0' }}>
          <Breadcrumbs items={[
            { label: 'KisielFinanse', href: '/' },
            { label: 'Symulator inwestycji' },
          ]} />

          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.4rem)',
            letterSpacing: '2px', lineHeight: 1.05, margin: '20px 0 12px', color: 'var(--text)',
          }}>
            SYMULATOR INWESTYCJI
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', fontWeight: 700, color: '#c9a227', lineHeight: 1.4, margin: '0 0 12px' }}>
            Ile byś zarobił, gdybyś zaczął inwestować lata temu?
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text)', lineHeight: 1.8, maxWidth: 620, margin: 0 }}>
            Wybierz aktywo, kwotę i rok startu. Liczymy na realnych danych historycznych - i czasem wynik zwala z nóg.
          </p>
        </div>

        <div style={{ maxWidth: 880, margin: '0 auto', padding: '36px 24px 0' }}>
          <TimeTravel />

          <div style={{
            marginTop: 28, padding: '18px 22px', background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 14,
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.7,
          }}>
            <strong style={{ color: 'var(--text)' }}>Jak liczymy?</strong><br />
            Symulacja na realnych miesięcznych cenach zamknięcia (dane Yahoo Finance). W trybie miesięcznym co miesiąc kupujemy aktywo za wpisaną kwotę (uśrednianie ceny zakupu). Wynik jest poglądowy i uproszczony - nie uwzględnia podatków, prowizji ani przeliczeń walutowych (większość aktywów jest notowana w USD). Wyniki historyczne nie gwarantują przyszłych. To narzędzie edukacyjne, nie rekomendacja inwestycyjna.
          </div>

          <div style={{ margin: '48px 0 80px' }}>
            <NewsletterForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
