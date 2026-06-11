import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import RevealOnScroll from '@/components/RevealOnScroll';
import EmeryturaCalculator from '@/components/EmeryturaCalculator';
import CalcRelated from '@/components/CalcRelated';

const BASE_URL = 'https://kisielfinanse.pl';
const URL      = `${BASE_URL}/kalkulator/emerytura`;

export const metadata: Metadata = {
  title: { absolute: 'Kalkulator emerytalny 2026 - ile dostaniesz z ZUS' },
  description: 'Oblicz prognozowaną emeryturę z ZUS i sprawdź lukę emerytalną. Zobacz, jaki procent dzisiejszej pensji zostanie Ci na emeryturze i ile dokładać, by żyć godnie. Darmowy kalkulator 2026.',
  keywords: ['kalkulator emerytalny', 'ile dostanę emerytury', 'prognoza emerytury ZUS', 'luka emerytalna', 'stopa zastąpienia', 'emerytura 2026', 'KisielFinanse'],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Kalkulator emerytalny 2026 - ile dostaniesz z ZUS | KisielFinanse',
    description: 'Prognozowana emerytura z ZUS, stopa zastąpienia i luka emerytalna. Sprawdź, ile dokładać, by nie odczuć spadku standardu życia.',
    url: URL,
    images: [{ url: '/kalkulator/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kalkulator emerytalny 2026 - ile dostaniesz z ZUS | KisielFinanse',
    description: 'Prognoza emerytury z ZUS, stopa zastąpienia i luka emerytalna.',
    images: ['/kalkulator/opengraph-image'],
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Kalkulatory',   item: `${BASE_URL}/kalkulator` },
    { '@type': 'ListItem', position: 3, name: 'Kalkulator emerytalny', item: URL },
  ],
};

const schemaApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kalkulator emerytalny 2026 - prognoza emerytury z ZUS',
  url: URL,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  inLanguage: 'pl-PL',
  isAccessibleForFree: true,
  description: 'Oblicz prognozowaną emeryturę z ZUS, stopę zastąpienia oraz lukę emerytalną. Kalkulator pokazuje, jaki procent dzisiejszej pensji netto zostanie Ci na emeryturze i ile odkładać, by ją uzupełnić.',
  author: { '@type': 'Person', name: 'Mateusz Kisiel', url: `${BASE_URL}/o-mnie` },
  publisher: { '@type': 'Organization', name: 'KisielFinanse', url: BASE_URL },
};

export default function EmeryturaPage() {
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
            { label: 'Kalkulator emerytalny' },
          ]} />
        </div>

        <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            letterSpacing: '3px', marginBottom: 12, lineHeight: 1.05,
          }}>
            KALKULATOR<br />
            <span style={{ color: '#c9a227' }}>EMERYTALNY</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)',
            lineHeight: 1.8, maxWidth: 560, marginBottom: 48,
          }}>
            Sprawdź, ile mniej więcej dostaniesz z ZUS i jaki procent dzisiejszej pensji to będzie. Zobaczysz też lukę emerytalną i ile odkładać, by jej nie poczuć.
          </p>

          <EmeryturaCalculator />

          <div style={{
            marginTop: 32, padding: '20px 24px', background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 14,
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.7,
          }}>
            <strong style={{ color: 'var(--text)' }}>Jak liczymy?</strong><br />
            Emeryturę z ZUS liczymy jako zgromadzony kapitał podzielony przez średnie dalsze trwanie życia z tablic GUS 2026 (wiek 60 to 268,9 miesiąca, 65 to 222,7). Kapitał to składka emerytalna 19,52% pensji brutto mnożona przez łączny staż. Wszystko podajemy w dzisiejszych złotych, zakładając, że waloryzacja w ZUS z grubsza nadąża za wzrostem płac. To szacunek poglądowy, a nie wyliczenie ZUS. Realna emerytura zależy od przyszłej waloryzacji, przerw w pracy, zmian przepisów i Twojej dalszej kariery. Osoby z wymaganym stażem (20 lat kobiety, 25 mężczyźni) obejmuje emerytura minimalna.
          </div>
        </div>
      </main>
      <CalcRelated currentPath="/kalkulator/emerytura" />
      <Footer />
    </>
  );
}
