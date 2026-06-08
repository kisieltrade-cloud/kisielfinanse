import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Calculator, { type Tab } from '@/components/Calculator';
import CalcRelated from '@/components/CalcRelated';
import Breadcrumbs from '@/components/Breadcrumbs';
import RevealOnScroll from '@/components/RevealOnScroll';

// ── Konfiguracja zakładek ─────────────────────────────────────────
// Metadane SEO per kalkulator (jedno źródło prawdy). Hero (tytuł/opis/zdjęcie)
// żyje w komponencie Calculator (TAB_META). Każdy slug = osobna, indeksowana strona.
const TABS: Record<string, {
  tab: Tab;
  metaTitle: string;
  metaDesc: string;
  breadcrumb: string;
}> = {
  'procent-skladany': {
    tab: 'compound',
    metaTitle: 'Kalkulator procentu składanego - ile urośnie kapitał?',
    metaDesc: 'Darmowy kalkulator procentu składanego. Wpisz kapitał startowy, miesięczną wpłatę i stopę zwrotu - zobaczysz ile będziesz mieć za 10, 20 lub 30 lat.',
    breadcrumb: 'Procent składany',
  },
  'dca': {
    tab: 'dca',
    metaTitle: 'Kalkulator DCA - uśrednianie ceny zakupu | KisielFinanse',
    metaDesc: 'Kalkulator DCA (Dollar Cost Averaging). Zobacz jak regularne, równe wpłaty budują kapitał niezależnie od wahań rynku i ile zyskujesz względem jednorazowej wpłaty.',
    breadcrumb: 'DCA',
  },
  'risk-reward': {
    tab: 'rr',
    metaTitle: 'Kalkulator Risk/Reward i wielkości pozycji | KisielFinanse',
    metaDesc: 'Darmowy kalkulator risk/reward dla traderów. Wpisz entry, stop loss i take profit - kalkulator wyliczy R:R, wielkość pozycji i potencjalny zysk.',
    breadcrumb: 'Risk / Reward',
  },
  'fire': {
    tab: 'fire',
    metaTitle: 'Kalkulator FIRE - kiedy osiągniesz wolność finansową?',
    metaDesc: 'Oblicz swoją datę FIRE (Financial Independence, Retire Early). Kalkulator uwzględnia obecne oszczędności, miesięczne wpłaty, stopę zwrotu i regułę 4%.',
    breadcrumb: 'Kalkulator FIRE',
  },
  'etf': {
    tab: 'etf',
    metaTitle: 'Kalkulator ETF vs lokata - co się bardziej opłaca?',
    metaDesc: 'Symulacja inwestycji w ETF versus lokata bankowa. Oblicz końcowy kapitał po podatku Belki i sprawdź, ile tracisz trzymając pieniądze na lokacie.',
    breadcrumb: 'Symulacja ETF',
  },
};

export function generateStaticParams() {
  return Object.keys(TABS).map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const cfg = TABS[slug];
  if (!cfg) return {};
  const url = `https://kisielfinanse.pl/kalkulator/${slug}`;
  return {
    title: { absolute: cfg.metaTitle },
    description: cfg.metaDesc,
    alternates: { canonical: url },
    openGraph: {
      title: cfg.metaTitle,
      description: cfg.metaDesc,
      url,
      images: [{ url: '/kalkulator/opengraph-image', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: cfg.metaTitle,
      description: cfg.metaDesc,
      images: ['/kalkulator/opengraph-image'],
    },
  };
}

export default async function KalkulatorSlugPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const cfg = TABS[slug];
  if (!cfg) notFound();

  const url = `https://kisielfinanse.pl/kalkulator/${slug}`;

  const schemaBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: 'https://kisielfinanse.pl' },
      { '@type': 'ListItem', position: 2, name: 'Kalkulatory',   item: 'https://kisielfinanse.pl/kalkulator' },
      { '@type': 'ListItem', position: 3, name: cfg.breadcrumb,  item: url },
    ],
  };

  const schemaApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: cfg.metaTitle,
    url,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    inLanguage: 'pl-PL',
    isAccessibleForFree: true,
    description: cfg.metaDesc,
    author: { '@type': 'Person', name: 'Mateusz Kisiel', url: 'https://kisielfinanse.pl/o-mnie' },
    publisher: { '@type': 'Organization', name: 'KisielFinanse', url: 'https://kisielfinanse.pl' },
  };

  return (
    <>
      <RevealOnScroll />
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaApp) }} />

      <main style={{ paddingTop: '80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 24px 0' }}>
          <Breadcrumbs items={[
            { label: 'KisielFinanse', href: '/' },
            { label: 'Kalkulatory',   href: '/kalkulator' },
            { label: cfg.breadcrumb },
          ]} />
        </div>

        <Calculator initialTab={cfg.tab} />
      </main>
      <CalcRelated currentPath={`/kalkulator/${slug}`} />
      <Footer />
    </>
  );
}
