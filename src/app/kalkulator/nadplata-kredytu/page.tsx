import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import RevealOnScroll from '@/components/RevealOnScroll';
import NadplataCalculator from '@/components/NadplataCalculator';
import CalcRelated from '@/components/CalcRelated';

const BASE_URL = 'https://kisielfinanse.pl';
const URL      = `${BASE_URL}/kalkulator/nadplata-kredytu`;

export const metadata: Metadata = {
  title: { absolute: 'Kalkulator nadpłaty kredytu - ile zaoszczędzisz' },
  description: 'Policz, ile zaoszczędzisz na odsetkach i o ile skrócisz kredyt dzięki nadpłacie. Nadpłata jednorazowa lub miesięczna, skrócenie okresu albo niższa rata. Bez rejestracji.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Kalkulator nadpłaty kredytu | KisielFinanse',
    description: 'Sprawdź oszczędność na odsetkach i skrócenie okresu przy nadpłacie kredytu.',
    url: URL,
    images: [{ url: '/kalkulator/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kalkulator nadpłaty kredytu | KisielFinanse',
    description: 'Ile oszczędzisz na odsetkach dzięki nadpłacie? Policz w 10 sekund.',
    images: ['/kalkulator/opengraph-image'],
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Kalkulatory',   item: `${BASE_URL}/kalkulator` },
    { '@type': 'ListItem', position: 3, name: 'Kalkulator nadpłaty kredytu', item: URL },
  ],
};

const schemaApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kalkulator nadpłaty kredytu',
  url: URL,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  inLanguage: 'pl-PL',
  isAccessibleForFree: true,
  description: 'Oblicz oszczędność na odsetkach i skrócenie okresu kredytu po nadpłacie - jednorazowej lub miesięcznej, ze skróceniem okresu albo obniżeniem raty.',
  author: { '@type': 'Person', name: 'Mateusz Kisiel', url: `${BASE_URL}/o-mnie` },
  publisher: { '@type': 'Organization', name: 'KisielFinanse', url: BASE_URL },
};

export default function NadplataPage() {
  return (
    <>
      <RevealOnScroll />
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaApp) }} />

      <main style={{ paddingTop: '80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 40px' }}>
          <Breadcrumbs items={[
            { label: 'KisielFinanse', href: '/' },
            { label: 'Kalkulatory',   href: '/kalkulator' },
            { label: 'Kalkulator nadpłaty kredytu' },
          ]} />

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            letterSpacing: '3px', marginTop: 18, marginBottom: 14, lineHeight: 1.05,
          }}>
            KALKULATOR<br />
            <span style={{ color: '#2e7d4f' }}>NADPŁATY KREDYTU</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)',
            lineHeight: 1.8, maxWidth: 580, margin: 0,
          }}>
            Wpisz dane kredytu i kwotę nadpłaty. Kalkulator policzy, ile zaoszczędzisz na odsetkach i o ile skrócisz kredyt - przy nadpłacie jednorazowej lub miesięcznej dopłacie.
          </p>
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 8px' }}>
          <NadplataCalculator />
        </div>

        <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 24px 80px' }}>
          <div style={{
            padding: '20px 24px', background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 14,
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.7,
          }}>
            <strong style={{ color: 'var(--text)' }}>Jak liczymy?</strong><br />
            Kalkulator zakłada ratę annuitową (równą) i stałe oprocentowanie przez pozostały okres. Przy nadpłacie ze skróceniem okresu rata zostaje bez zmian, a kredyt kończy się szybciej. Przy obniżeniu raty okres zostaje bez zmian, a maleje miesięczna płatność. To wyliczenie orientacyjne - realny harmonogram, opłaty i ewentualne koszty nadpłaty określa umowa z bankiem.
          </div>
        </div>
      </main>
      <CalcRelated currentPath="/kalkulator/nadplata-kredytu" />
      <Footer />
    </>
  );
}
