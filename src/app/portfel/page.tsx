import type { Metadata } from 'next';
import PortfelClient from './PortfelClient';

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

export default function PortfelPage() {
  return <PortfelClient />;
}
