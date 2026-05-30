import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import RevealOnScroll from '@/components/RevealOnScroll';
import GodzinyPracyCalculator from '@/components/GodzinyPracyCalculator';
import CalcRelated from '@/components/CalcRelated';

const BASE_URL = 'https://kisielfinanse.pl';
const URL      = `${BASE_URL}/kalkulator/godziny-pracy`;

export const metadata: Metadata = {
  title: { absolute: 'Ile godzin pracy kosztuje Cię zakup? Kalkulator | KisielFinanse' },
  description: 'Wpisz swoją stawkę godzinową i cenę zakupu — dowiedz się ile godzin (i dni) pracy kosztuje Cię dany produkt. Darmowy kalkulator bez rejestracji.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Ile godzin pracy kosztuje Cię zakup? | KisielFinanse',
    description: 'Przelicz cenę zakupu na godziny swojej pracy. Wpisz stawkę godzinową i cenę — zobaczysz prawdziwy koszt.',
    url: URL,
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ile godzin pracy kosztuje Cię zakup? | KisielFinanse',
    description: 'Przelicz cenę zakupu na godziny swojej pracy.',
    images: ['/og-image.png'],
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Kalkulatory',   item: `${BASE_URL}/kalkulator` },
    { '@type': 'ListItem', position: 3, name: 'Ile godzin pracy?', item: URL },
  ],
};

export default function GodzinyPracyPage() {
  return (
    <>
      <RevealOnScroll />
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />

      <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 24px 0' }}>
          <Breadcrumbs items={[
            { label: 'KisielFinanse', href: '/' },
            { label: 'Kalkulatory',   href: '/kalkulator' },
            { label: 'Ile godzin pracy?' },
          ]} />
        </div>

        <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            letterSpacing: '4px',
            marginBottom: 12,
            lineHeight: 1.05,
          }}>
            ILE GODZIN<br />
            <span style={{ color: '#c9a227' }}>PRACY?</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--muted)',
            lineHeight: 1.8,
            maxWidth: 520,
            marginBottom: 48,
          }}>
            Wpisz swoją stawkę godzinową i cenę zakupu. Zobaczysz ile realnie kosztuje Cię dany przedmiot mierzony Twoim czasem.
          </p>

          <GodzinyPracyCalculator />

          <div style={{
            marginTop: 32,
            padding: '20px 24px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--muted)',
            lineHeight: 1.7,
          }}>
            <strong style={{ color: 'var(--text)' }}>Jak liczymy?</strong><br />
            Godziny pracy = cena ÷ stawka godzinowa netto. Dni robocze = godziny ÷ 8. Tygodnie = godziny ÷ 40.
            Podaj stawkę netto (na rękę), bez podatków i składek.
          </div>
        </div>
      </main>
      <CalcRelated currentPath="/kalkulator/godziny-pracy" />
      <Footer />
    </>
  );
}
