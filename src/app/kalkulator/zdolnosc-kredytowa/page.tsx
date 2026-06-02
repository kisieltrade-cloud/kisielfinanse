import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import RevealOnScroll from '@/components/RevealOnScroll';
import MortgageCalculator from '@/components/MortgageCalculator';
import CalcRelated from '@/components/CalcRelated';

const BASE_URL = 'https://kisielfinanse.pl';
const URL      = `${BASE_URL}/kalkulator/zdolnosc-kredytowa`;

export const metadata: Metadata = {
  title: { absolute: 'Kalkulator zdolności kredytowej 2026' },
  description: 'Sprawdź swoją zdolność kredytową w 2026 roku. Wpisz dochód i zobowiązania, a kalkulator oszacuje maksymalną kwotę kredytu hipotecznego. Darmowo, bez rejestracji.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Kalkulator zdolności kredytowej 2026 | KisielFinanse',
    description: 'Oszacuj maksymalną kwotę kredytu hipotecznego na podstawie dochodu i zobowiązań.',
    url: URL,
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kalkulator zdolności kredytowej 2026 | KisielFinanse',
    description: 'Ile kredytu możesz dostać? Sprawdź swoją zdolność kredytową.',
    images: ['/og-image.png'],
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Kalkulatory',   item: `${BASE_URL}/kalkulator` },
    { '@type': 'ListItem', position: 3, name: 'Kalkulator zdolności kredytowej', item: URL },
  ],
};

const schemaApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kalkulator zdolności kredytowej 2026',
  url: URL,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  inLanguage: 'pl-PL',
  isAccessibleForFree: true,
  description: 'Oszacuj zdolność kredytową na podstawie miesięcznego dochodu i istniejących zobowiązań. Kalkulator pokazuje przybliżoną maksymalną kwotę kredytu hipotecznego dla różnych okresów.',
  author: { '@type': 'Person', name: 'Mateusz Kisiel', url: `${BASE_URL}/o-mnie` },
  publisher: { '@type': 'Organization', name: 'KisielFinanse', url: BASE_URL },
};

export default function ZdolnoscKredytowaPage() {
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
            { label: 'Kalkulator zdolności kredytowej' },
          ]} />

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            letterSpacing: '3px', marginTop: 18, marginBottom: 14, lineHeight: 1.05,
          }}>
            KALKULATOR<br />
            <span style={{ color: '#c9a227' }}>ZDOLNOŚCI KREDYTOWEJ</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)',
            lineHeight: 1.8, maxWidth: 560, margin: 0,
          }}>
            Wpisz miesięczny dochód i istniejące zobowiązania. Kalkulator oszacuje, na jaką maksymalną kwotę kredytu hipotecznego możesz liczyć przy różnych okresach spłaty.
          </p>
        </div>

        <MortgageCalculator initialTab="zdolnosc" />

        <div style={{
          maxWidth: 860, margin: '0 auto', padding: '0 24px 80px',
        }}>
          <div style={{
            padding: '20px 24px', background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 14,
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.7,
          }}>
            <strong style={{ color: 'var(--text)' }}>Jak liczymy?</strong><br />
            Szacunek oparty na metodzie DTI (relacja zobowiązań do dochodu) z buforem stopy procentowej zgodnym z Rekomendacją S KNF. To orientacyjny wynik, a nie decyzja kredytowa - realną zdolność wyliczy bank na podstawie pełnej analizy dochodów, formy zatrudnienia i historii w BIK.
          </div>
        </div>
      </main>
      <CalcRelated currentPath="/kalkulator/zdolnosc-kredytowa" />
      <Footer />
    </>
  );
}
