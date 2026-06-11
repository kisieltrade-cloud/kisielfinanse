import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import NewsletterForm from '@/components/NewsletterForm';
import DlugPubliczny from '@/components/DlugPubliczny';

const BASE_URL = 'https://kisielfinanse.pl';
const URL = `${BASE_URL}/dlug-publiczny-polski`;

// Data publikacji (jak artykuly: strona "wychodzi" w tym terminie).
// Przed ta data trasa zwraca 404 i nie ma jej w sitemap.
export const PUBLISH_AT = new Date('2026-06-20T00:00:00+02:00');

// ISR co godzine - po dacie publikacji strona pojawi sie automatycznie.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: 'Dług publiczny Polski 2026 - ile wynosi i co znaczy dla ciebie' },
  description: 'Dług publiczny Polski przekroczył 60% PKB. Ile dokładnie wynosi, ile kosztuje jego obsługa i jak rosnące zadłużenie państwa wpływa na twoje podatki, kredyt i oszczędności. Wykresy, dane, fakty.',
  keywords: ['dług publiczny Polski', 'dług do PKB', 'zadłużenie Polski 2026', 'koszt obsługi długu', 'deficyt budżetowy', 'KisielFinanse'],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Dług publiczny Polski 2026 - co znaczy dla twojego portfela',
    description: 'Polska przebiła unijny próg 60% PKB. Obsługa długu to 115 mld zł rocznie. Wyjaśniamy, co to oznacza dla twoich pieniędzy.',
    url: URL,
    type: 'article',
    locale: 'pl_PL',
    images: [{ url: '/dlug-publiczny-polski/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dług publiczny Polski 2026 | KisielFinanse',
    description: 'Polska przebiła próg 60% PKB. Co rosnący dług znaczy dla twojego portfela.',
    images: ['/dlug-publiczny-polski/opengraph-image'],
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Dług publiczny Polski', item: URL },
      ],
    },
    {
      '@type': 'Article',
      headline: 'Dług publiczny Polski 2026 - ile wynosi i co znaczy dla ciebie',
      description: 'Analiza zadłużenia Polski: relacja długu do PKB, koszt obsługi, prognozy i wpływ na finanse osobiste.',
      author: { '@type': 'Person', name: 'Mateusz Kisiel', url: `${BASE_URL}/o-mnie` },
      publisher: { '@type': 'Organization', name: 'KisielFinanse', url: BASE_URL },
      datePublished: '2026-06-20',
      mainEntityOfPage: URL,
      inLanguage: 'pl-PL',
    },
  ],
};

export default function DlugPublicznyPage() {
  if (new Date() < PUBLISH_AT) notFound();

  return (
    <div data-theme="dark" style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <main style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '32px 24px 0' }}>
          <Breadcrumbs items={[
            { label: 'KisielFinanse', href: '/' },
            { label: 'Dług publiczny Polski' },
          ]} />

          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '3px',
            textTransform: 'uppercase', color: '#ff2d78', margin: '20px 0 14px',
          }}>
            Analiza gospodarcza · czerwiec 2026
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.1rem, 5.5vw, 3.6rem)',
            letterSpacing: '1.5px', lineHeight: 1.04, margin: '0 0 18px',
            color: 'var(--text)',
          }}>
            DŁUG PUBLICZNY POLSKI PRZEBIŁ 60% PKB.<br />CO TO ZNACZY DLA TWOJEGO PORTFELA?
          </h1>

          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '1.08rem', color: 'var(--muted)',
            lineHeight: 1.8, maxWidth: 660, margin: 0,
          }}>
            Po raz pierwszy w historii III RP Polska przekroczyła unijny próg 60 procent PKB. Sama obsługa długu kosztuje nas już 115 miliardów złotych rocznie, więcej niż wszystkie największe programy społeczne razem wzięte. Rozkładamy to na czynniki pierwsze.
          </p>
        </div>

        <div style={{ maxWidth: 880, margin: '0 auto', padding: '48px 24px 0' }}>
          <DlugPubliczny />

          <div style={{ margin: '56px 0 80px' }}>
            <NewsletterForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
