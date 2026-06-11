import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import RevealOnScroll from '@/components/RevealOnScroll';
import MilionCalculator from '@/components/MilionCalculator';
import CalcRelated from '@/components/CalcRelated';

const BASE_URL = 'https://kisielfinanse.pl';
const URL      = `${BASE_URL}/kalkulator/milion`;

export const metadata: Metadata = {
  title: { absolute: 'Kiedy uzbierasz milion? Kalkulator - jak zostać milionerem' },
  description: 'Wpisz, ile odkładasz miesięcznie, a sprawdzisz, za ile lat i w jakim wieku uzbierasz milion. Zobacz, ile dorobi za Ciebie procent składany. Darmowy kalkulator.',
  keywords: ['jak zostać milionerem', 'kiedy uzbieram milion', 'kalkulator milion', 'procent składany', 'pierwszy milion', 'oszczędzanie na milion', 'KisielFinanse'],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Kiedy uzbierasz milion? | KisielFinanse',
    description: 'Za ile lat i w jakim wieku uzbierasz milion przy Twoich wpłatach? Sprawdź, ile dorobi procent składany.',
    url: URL,
    images: [{ url: '/kalkulator/milion/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kiedy uzbierasz milion? | KisielFinanse',
    description: 'Za ile lat uzbierasz milion przy Twoich wpłatach? Sprawdź.',
    images: ['/kalkulator/milion/opengraph-image'],
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Kalkulatory',   item: `${BASE_URL}/kalkulator` },
    { '@type': 'ListItem', position: 3, name: 'Kiedy uzbierasz milion', item: URL },
  ],
};

const schemaApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kalkulator - kiedy uzbierasz milion',
  url: URL,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  inLanguage: 'pl-PL',
  isAccessibleForFree: true,
  description: 'Oblicz, za ile lat i w jakim wieku uzbierasz milion złotych przy zadanej miesięcznej wpłacie i stopie zwrotu. Kalkulator pokazuje udział procentu składanego w celu.',
  author: { '@type': 'Person', name: 'Mateusz Kisiel', url: `${BASE_URL}/o-mnie` },
  publisher: { '@type': 'Organization', name: 'KisielFinanse', url: BASE_URL },
};

export default function MilionPage() {
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
            { label: 'Kiedy uzbierasz milion' },
          ]} />
        </div>

        <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            letterSpacing: '3px', marginBottom: 12, lineHeight: 1.05,
          }}>
            KIEDY UZBIERASZ<br />
            <span style={{ color: '#c9a227' }}>MILION?</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)',
            lineHeight: 1.8, maxWidth: 560, marginBottom: 48,
          }}>
            Wpisz, ile odkładasz miesięcznie, a zobaczysz za ile lat i w jakim wieku przekroczysz milion. Plus ile z tej kwoty dorobi za Ciebie procent składany.
          </p>

          <MilionCalculator />

          <div style={{
            marginTop: 32, padding: '20px 24px', background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 14,
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.7,
          }}>
            <strong style={{ color: 'var(--text)' }}>Jak liczymy?</strong><br />
            Zakładamy stałą miesięczną wpłatę i stałą roczną stopę zwrotu z kapitalizacją miesięczną. Wynik jest poglądowy i podany w dzisiejszych złotych, bez uwzględnienia inflacji i podatku od zysków (Belka 19%). Realny rynek nie rośnie równo co miesiąc, a podana stopa to założenie, nie gwarancja. Domyślne 7% to historyczny, długoterminowy zwrot szerokiego rynku akcji, nie obietnica.
          </div>
        </div>
      </main>
      <CalcRelated currentPath="/kalkulator/milion" />
      <Footer />
    </>
  );
}
