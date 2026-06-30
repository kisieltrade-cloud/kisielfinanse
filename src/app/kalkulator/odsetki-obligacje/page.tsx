import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import RevealOnScroll from '@/components/RevealOnScroll';
import ObligacjeCalculator from '@/components/ObligacjeCalculator';
import CalcRelated from '@/components/CalcRelated';

const BASE_URL = 'https://kisielfinanse.pl';
const URL      = `${BASE_URL}/kalkulator/odsetki-obligacje`;

export const metadata: Metadata = {
  title: { absolute: 'Kalkulator obligacji skarbowych 2026 - EDO, COI, TOS' },
  description: 'Policz odsetki od obligacji skarbowych: EDO, COI, TOS, ROR, DOR. Zysk netto po podatku Belki, rozbicie rok po roku. Stawki z oferty lipiec 2026. Bez rejestracji.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Kalkulator obligacji skarbowych 2026 | KisielFinanse',
    description: 'Oblicz odsetki i zysk netto z obligacji EDO, COI, TOS, ROR i DOR po podatku Belki.',
    url: URL,
    images: [{ url: '/kalkulator/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kalkulator obligacji skarbowych 2026 | KisielFinanse',
    description: 'Ile zarobisz na obligacjach EDO, COI, TOS? Policz odsetki netto po podatku Belki.',
    images: ['/kalkulator/opengraph-image'],
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Kalkulatory',   item: `${BASE_URL}/kalkulator` },
    { '@type': 'ListItem', position: 3, name: 'Kalkulator obligacji skarbowych', item: URL },
  ],
};

const schemaApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kalkulator obligacji skarbowych 2026',
  url: URL,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  inLanguage: 'pl-PL',
  isAccessibleForFree: true,
  description: 'Oblicz odsetki od detalicznych obligacji skarbowych (EDO, COI, TOS, ROR, DOR) z uwzględnieniem kapitalizacji, indeksacji inflacją i podatku Belki. Stawki z oferty lipiec 2026.',
  author: { '@type': 'Person', name: 'Mateusz Kisiel', url: `${BASE_URL}/o-mnie` },
  publisher: { '@type': 'Organization', name: 'KisielFinanse', url: BASE_URL },
};

export default function ObligacjePage() {
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
            { label: 'Kalkulator obligacji skarbowych' },
          ]} />

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            letterSpacing: '3px', marginTop: 18, marginBottom: 14, lineHeight: 1.05,
          }}>
            KALKULATOR<br />
            <span style={{ color: '#2e7d4f' }}>OBLIGACJI SKARBOWYCH</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)',
            lineHeight: 1.8, maxWidth: 580, margin: 0,
          }}>
            Wybierz rodzaj obligacji i wpisz kwotę. Kalkulator policzy odsetki brutto, podatek Belki i realny zysk netto - z kapitalizacją (EDO, TOS) lub wypłatą odsetek (COI, ROR, DOR) i indeksacją inflacją.
          </p>
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 8px' }}>
          <ObligacjeCalculator />
        </div>

        <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 24px 80px' }}>
          <div style={{
            padding: '20px 24px', background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 14,
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.7,
          }}>
            <strong style={{ color: 'var(--text)' }}>Jak liczymy?</strong><br />
            Oprocentowanie I roku jest stałe i wynika z oferty Ministerstwa Finansów na lipiec 2026 (OTS 2,00%, ROR 4,00%, DOR 4,15%, TOS 4,40%, COI 4,75%, EDO 5,35%). Obligacje zmienne (ROR, DOR) po pierwszym okresie oprocentowane są wg stopy referencyjnej NBP (3,75%) powiększonej o marżę, a indeksowane (COI, EDO) wg inflacji powiększonej o marżę - dlatego ich wynik zależy od przyjętej inflacji. Podatek Belki (19%) liczymy od pełnych odsetek. To wyliczenie orientacyjne - aktualne stawki i pełny regulamin sprawdzisz na obligacjeskarbowe.pl.
          </div>
        </div>
      </main>
      <CalcRelated currentPath="/kalkulator/odsetki-obligacje" />
      <Footer />
    </>
  );
}
