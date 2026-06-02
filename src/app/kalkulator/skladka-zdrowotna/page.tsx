import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import RevealOnScroll from '@/components/RevealOnScroll';
import SkladkaZdrowotnaCalculator from '@/components/SkladkaZdrowotnaCalculator';
import CalcRelated from '@/components/CalcRelated';

const BASE_URL = 'https://kisielfinanse.pl';
const URL      = `${BASE_URL}/kalkulator/skladka-zdrowotna`;

export const metadata: Metadata = {
  title: { absolute: 'Kalkulator składki zdrowotnej 2026 (działalność)' },
  description: 'Policz składkę zdrowotną na działalności w 2026 roku: skala, podatek liniowy i ryczałt. Wpisz dochód lub przychód i sprawdź miesięczną oraz roczną składkę. Darmowy kalkulator.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Kalkulator składki zdrowotnej 2026 | KisielFinanse',
    description: 'Składka zdrowotna dla przedsiębiorcy: skala, liniowy, ryczałt. Policz, ile zapłacisz miesięcznie i rocznie.',
    url: URL,
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kalkulator składki zdrowotnej 2026 | KisielFinanse',
    description: 'Policz składkę zdrowotną na skali, liniowym i ryczałcie.',
    images: ['/og-image.png'],
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Kalkulatory',   item: `${BASE_URL}/kalkulator` },
    { '@type': 'ListItem', position: 3, name: 'Kalkulator składki zdrowotnej', item: URL },
  ],
};

const schemaApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kalkulator składki zdrowotnej 2026',
  url: URL,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  inLanguage: 'pl-PL',
  isAccessibleForFree: true,
  description: 'Oblicz składkę zdrowotną dla jednoosobowej działalności w 2026 roku na zasadach ogólnych, podatku liniowym i ryczałcie. Kalkulator pokazuje składkę miesięczną i roczną.',
  author: { '@type': 'Person', name: 'Mateusz Kisiel', url: `${BASE_URL}/o-mnie` },
  publisher: { '@type': 'Organization', name: 'KisielFinanse', url: BASE_URL },
};

export default function SkladkaZdrowotnaPage() {
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
            { label: 'Kalkulator składki zdrowotnej' },
          ]} />
        </div>

        <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            letterSpacing: '3px', marginBottom: 12, lineHeight: 1.05,
          }}>
            SKŁADKA<br />
            <span style={{ color: '#2e7d4f' }}>ZDROWOTNA 2026</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)',
            lineHeight: 1.8, maxWidth: 560, marginBottom: 48,
          }}>
            Wybierz formę opodatkowania i wpisz dochód lub przychód. Zobaczysz, ile wyniesie Twoja składka zdrowotna miesięcznie i w skali roku.
          </p>

          <SkladkaZdrowotnaCalculator />

          <div style={{
            marginTop: 32, padding: '20px 24px', background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 14,
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.7,
          }}>
            <strong style={{ color: 'var(--text)' }}>Jak liczymy?</strong><br />
            Stawki 2026. Skala: 9% dochodu, nie mniej niż składka minimalna 432,54 zł. Liniowy: 4,9% dochodu, też nie mniej niż minimum. Ryczałt: 9% od 60%, 100% lub 180% przeciętnego wynagrodzenia, zależnie od progu rocznego przychodu (do 60 tys., 60-300 tys., powyżej 300 tys.). Wartości ryczałtu są orientacyjne i zależą od ogłoszonej podstawy na 2026 rok. Wynik nie uwzględnia rocznego rozliczenia składki.
          </div>
        </div>
      </main>
      <CalcRelated currentPath="/kalkulator/skladka-zdrowotna" />
      <Footer />
    </>
  );
}
