import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import RevealOnScroll from '@/components/RevealOnScroll';
import PodatkiCalculator from '@/components/PodatkiCalculator';
import CalcRelated from '@/components/CalcRelated';

const BASE_URL = 'https://kisielfinanse.pl';
const URL      = `${BASE_URL}/kalkulator/gdzie-ida-podatki`;

export const metadata: Metadata = {
  title: { absolute: 'Gdzie idą Twoje podatki? Ile oddajesz państwu - kalkulator' },
  description: 'Wpisz pensję i zobacz, ile co miesiąc oddajesz państwu w ZUS, składce zdrowotnej i PIT, jaki to klin podatkowy i na co idą publiczne pieniądze. Darmowy kalkulator 2026.',
  keywords: ['ile płacę podatków', 'gdzie idą moje podatki', 'klin podatkowy', 'danina', 'ZUS PIT składka zdrowotna', 'na co idą podatki', 'KisielFinanse'],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Gdzie idą Twoje podatki? | KisielFinanse',
    description: 'Ile co miesiąc oddajesz państwu i na co to idzie? Sprawdź swój klin podatkowy i podział wydatków publicznych.',
    url: URL,
    images: [{ url: '/kalkulator/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gdzie idą Twoje podatki? | KisielFinanse',
    description: 'Ile oddajesz państwu co miesiąc i na co to idzie? Sprawdź.',
    images: ['/kalkulator/opengraph-image'],
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Kalkulatory',   item: `${BASE_URL}/kalkulator` },
    { '@type': 'ListItem', position: 3, name: 'Gdzie idą Twoje podatki', item: URL },
  ],
};

const schemaApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Gdzie idą Twoje podatki - kalkulator klina podatkowego',
  url: URL,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  inLanguage: 'pl-PL',
  isAccessibleForFree: true,
  description: 'Sprawdź, ile co miesiąc oddajesz państwu w składkach ZUS, składce zdrowotnej i podatku PIT, jaki to klin podatkowy oraz na co idą publiczne pieniądze.',
  author: { '@type': 'Person', name: 'Mateusz Kisiel', url: `${BASE_URL}/o-mnie` },
  publisher: { '@type': 'Organization', name: 'KisielFinanse', url: BASE_URL },
};

export default function GdzieIdaPodatkiPage() {
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
            { label: 'Gdzie idą Twoje podatki' },
          ]} />
        </div>

        <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            letterSpacing: '3px', marginBottom: 12, lineHeight: 1.05,
          }}>
            GDZIE IDĄ<br />
            <span style={{ color: '#c9a227' }}>TWOJE PODATKI?</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)',
            lineHeight: 1.8, maxWidth: 560, marginBottom: 48,
          }}>
            Wpisz pensję, a zobaczysz, ile co miesiąc znika na ZUS, zdrowotną i PIT, jaki to klin podatkowy i na co państwo wydaje Twoje pieniądze.
          </p>

          <PodatkiCalculator />

          <div style={{
            marginTop: 32, padding: '20px 24px', background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 14,
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.7,
          }}>
            <strong style={{ color: 'var(--text)' }}>Jak liczymy?</strong><br />
            Składki i podatek liczymy dla umowy o pracę wg stawek 2026 (społeczne pracownika 13,71%, zdrowotna 9%, PIT 12/32%). Klin podatkowy uwzględnia też składki pracodawcy (ok. 20,5% brutto). Podział „na co idzie danina" to poglądowy szacunek struktury wydatków publicznych w oparciu o budżet 2026 (obrona 200 mld, zdrowie 247,8 mld, świadczenia, obsługa długu) - nie jest to dosłowne przypisanie Twojej konkretnej złotówki do wydatku, lecz ilustracja proporcji.
          </div>
        </div>
      </main>
      <CalcRelated currentPath="/kalkulator/gdzie-ida-podatki" />
      <Footer />
    </>
  );
}
