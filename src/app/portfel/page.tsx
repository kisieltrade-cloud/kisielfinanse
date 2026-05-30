import type { Metadata } from 'next';
import PortfelClient from './PortfelClient';

export const revalidate = 3600;

const BASE_URL = 'https://kisielfinanse.pl';

export const metadata: Metadata = {
  title: { absolute: 'Mój portfel inwestycyjny | KisielFinanse' },
  description:
    'Transparentny portfel inwestycyjny Mateusza Kisiela. Amazon DCA, GPW — co kupuję, kiedy, za ile i dlaczego. Aktualizowany co miesiąc.',
  keywords: [
    'portfel inwestycyjny', 'mój portfel', 'transparentny portfel',
    'inwestycje akcje', 'Amazon akcje', 'GPW inwestycje', 'KisielFinanse portfel',
  ],
  alternates: { canonical: `${BASE_URL}/portfel` },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: `${BASE_URL}/portfel`,
    siteName: 'KisielFinanse',
    title: 'Mój portfel inwestycyjny | KisielFinanse',
    description:
      'Transparentny portfel — Amazon DCA, spółki GPW. Co kupuję, kiedy i dlaczego. Bez ściemy.',
    images: [
      { url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Portfel inwestycyjny KisielFinanse' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mój portfel inwestycyjny | KisielFinanse',
    description: 'Transparentny portfel — co kupuję, kiedy i dlaczego. Bez ściemy.',
    images: [`${BASE_URL}/og-image.png`],
  },
};

async function fetchYahoo(symbol: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; KisielFinanse/1.0)',
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
    return typeof price === 'number' ? price : null;
  } catch {
    return null;
  }
}

export default async function PortfelPage() {
  const [amzn, pce, eat, mdv, usdpln] = await Promise.all([
    fetchYahoo('AMZN'),
    fetchYahoo('PCE.WA'),
    fetchYahoo('EAT.WA'),
    fetchYahoo('MDV.WA'),
    fetchYahoo('USDPLN=X'),
  ]);

  const schemaBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Mój portfel inwestycyjny', item: `${BASE_URL}/portfel` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
      <PortfelClient
        livePrices={{ AMZN: amzn, PCE: pce, EAT: eat, MDV: mdv }}
        liveUsdPln={usdpln}
        fetchedAt={new Date().toISOString()}
      />
    </>
  );
}
