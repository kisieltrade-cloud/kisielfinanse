import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import RevealOnScroll from '@/components/RevealOnScroll';
import PorownajPensjeCalculator from '@/components/PorownajPensjeCalculator';
import CalcRelated from '@/components/CalcRelated';

const BASE_URL = 'https://kisielfinanse.pl';
const URL      = `${BASE_URL}/kalkulator/porownaj-pensje`;

export const metadata: Metadata = {
  title: { absolute: 'Porównaj swoją pensję - ile zarabiasz na tle Polski 2026' },
  description: 'Wpisz wynagrodzenie i sprawdź, więcej niż ile procent Polaków zarabiasz. Twoja pozycja na tle mediany i średniej krajowej, oparta na danych GUS. Darmowy kalkulator.',
  keywords: ['porównaj pensję', 'ile zarabiam na tle Polski', 'mediana wynagrodzeń', 'średnia krajowa', 'percentyl zarobków', 'ile zarabia Polak', 'KisielFinanse'],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Porównaj swoją pensję na tle Polski | KisielFinanse',
    description: 'Więcej niż ile procent pracujących zarabiasz? Twoja pozycja na tle mediany i średniej krajowej, dane GUS.',
    url: URL,
    images: [{ url: '/kalkulator/porownaj-pensje/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Porównaj swoją pensję na tle Polski | KisielFinanse',
    description: 'Więcej niż ile procent Polaków zarabiasz? Sprawdź swój percentyl.',
    images: ['/kalkulator/porownaj-pensje/opengraph-image'],
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Kalkulatory',   item: `${BASE_URL}/kalkulator` },
    { '@type': 'ListItem', position: 3, name: 'Porównaj swoją pensję', item: URL },
  ],
};

const schemaApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Porównaj swoją pensję na tle Polski',
  url: URL,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  inLanguage: 'pl-PL',
  isAccessibleForFree: true,
  description: 'Sprawdź, więcej niż ile procent pracujących w Polsce zarabiasz. Kalkulator pokazuje Twój percentyl oraz pozycję względem mediany i średniej krajowej na podstawie danych GUS.',
  author: { '@type': 'Person', name: 'Mateusz Kisiel', url: `${BASE_URL}/o-mnie` },
  publisher: { '@type': 'Organization', name: 'KisielFinanse', url: BASE_URL },
};

export default function PorownajPensjePage() {
  return (
    <>
      <RevealOnScroll />
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaApp) }} />

      <main data-theme="light" style={{ paddingTop: '80px', minHeight: '100vh', background: '#f1ece1', color: 'var(--text)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 24px 0' }}>
          <Breadcrumbs items={[
            { label: 'KisielFinanse', href: '/' },
            { label: 'Kalkulatory',   href: '/kalkulator' },
            { label: 'Porównaj pensję' },
          ]} />
        </div>

        <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            letterSpacing: '3px', marginBottom: 12, lineHeight: 1.05,
          }}>
            PORÓWNAJ<br />
            <span style={{ color: '#c9a227' }}>SWOJĄ PENSJĘ</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)',
            lineHeight: 1.8, maxWidth: 560, marginBottom: 48,
          }}>
            Wpisz, ile zarabiasz, a zobaczysz więcej niż ile procent pracujących w Polsce to jest. Plus Twoja pozycja względem mediany i średniej krajowej.
          </p>

          <PorownajPensjeCalculator />

          <div style={{
            marginTop: 32, padding: '20px 24px', background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 14,
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.7,
          }}>
            <strong style={{ color: 'var(--text)' }}>Skąd te liczby?</strong><br />
            Rozkład wynagrodzeń liczymy z danych GUS o strukturze wynagrodzeń 2025 (brutto): pierwszy decyl ok. 4 666 zł, mediana ok. 7 300 zł, dziewiąty decyl ok. 16 290 zł, średnia ok. 8 900 zł. Percentyl szacujemy interpolacją między tymi punktami, więc wynik jest poglądowy. Dane dotyczą gospodarki narodowej, a stawki różnią się mocno między branżami i regionami.
          </div>
        </div>
      </main>
      <CalcRelated currentPath="/kalkulator/porownaj-pensje" />
      <Footer />
    </>
  );
}
