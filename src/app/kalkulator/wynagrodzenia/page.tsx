import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import RevealOnScroll from '@/components/RevealOnScroll';
import WynagrodzeniaCalculator from '@/components/WynagrodzeniaCalculator';
import CalcRelated from '@/components/CalcRelated';

const BASE_URL = 'https://kisielfinanse.pl';
const URL      = `${BASE_URL}/kalkulator/wynagrodzenia`;

export const metadata: Metadata = {
  title: { absolute: 'Kalkulator wynagrodzeń brutto-netto 2026' },
  description: 'Przelicz wynagrodzenie brutto na netto (umowa o pracę 2026). Zobacz składki ZUS, składkę zdrowotną, zaliczkę PIT, PPK i koszt pracodawcy. Darmowy kalkulator bez rejestracji.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Kalkulator wynagrodzeń brutto-netto 2026 | KisielFinanse',
    description: 'Ile zostaje na rękę z umowy o pracę? Przelicz brutto na netto ze składkami ZUS, zdrowotną, PIT i PPK.',
    url: URL,
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kalkulator wynagrodzeń brutto-netto 2026 | KisielFinanse',
    description: 'Przelicz brutto na netto z pełnym rozbiciem składek i podatku.',
    images: ['/og-image.png'],
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Kalkulatory',   item: `${BASE_URL}/kalkulator` },
    { '@type': 'ListItem', position: 3, name: 'Kalkulator wynagrodzeń', item: URL },
  ],
};

const schemaApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kalkulator wynagrodzeń brutto-netto 2026',
  url: URL,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  inLanguage: 'pl-PL',
  isAccessibleForFree: true,
  description: 'Przelicz wynagrodzenie brutto na netto dla umowy o pracę w 2026 roku. Kalkulator pokazuje składki społeczne ZUS, składkę zdrowotną, zaliczkę na PIT, wpłatę PPK oraz całkowity koszt pracodawcy.',
  author: { '@type': 'Person', name: 'Mateusz Kisiel', url: `${BASE_URL}/o-mnie` },
  publisher: { '@type': 'Organization', name: 'KisielFinanse', url: BASE_URL },
};

export default function WynagrodzeniaPage() {
  return (
    <>
      <RevealOnScroll />
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaApp) }} />

      <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 24px 0' }}>
          <Breadcrumbs items={[
            { label: 'KisielFinanse', href: '/' },
            { label: 'Kalkulatory',   href: '/kalkulator' },
            { label: 'Kalkulator wynagrodzeń' },
          ]} />
        </div>

        <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            letterSpacing: '3px', marginBottom: 12, lineHeight: 1.05,
          }}>
            KALKULATOR<br />
            <span style={{ color: '#c9a227' }}>BRUTTO-NETTO</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)',
            lineHeight: 1.8, maxWidth: 560, marginBottom: 48,
          }}>
            Wpisz wynagrodzenie brutto z umowy o pracę. Zobaczysz, ile zostaje na rękę, ile zabierają składki ZUS, zdrowotna i podatek oraz ile naprawdę kosztujesz pracodawcę.
          </p>

          <WynagrodzeniaCalculator />

          <div style={{
            marginTop: 32, padding: '20px 24px', background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 14,
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.7,
          }}>
            <strong style={{ color: 'var(--text)' }}>Jak liczymy?</strong><br />
            Umowa o pracę, stawki 2026. Składki społeczne pracownika 13,71% (emerytalna 9,76% + rentowa 1,5% + chorobowa 2,45%). Składka zdrowotna 9% od podstawy (brutto minus składki społeczne), bez odliczenia od podatku. Koszty uzyskania 250 zł, kwota zmniejszająca 300 zł/mies (złożony PIT-2). PIT 12% do progu 120 000 zł rocznie i 32% powyżej. Wynik jest orientacyjny i nie uwzględnia indywidualnych ulg ani nietypowych sytuacji.
          </div>
        </div>
      </main>
      <CalcRelated currentPath="/kalkulator/wynagrodzenia" />
      <Footer />
    </>
  );
}
