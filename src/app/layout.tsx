import type { Metadata } from 'next';
import './globals.css';

const BASE_URL = 'https://nyseth-trading.vercel.app';

export const metadata: Metadata = {
  title: {
    template: '%s | NysethTrading',
    default: 'NysethTrading — Trade Smarter, Live Freer',
  },
  description:
    'Transparentne wyniki tradingowe, analiza rynkowa i strategie, które działają. Dołącz do społeczności poważnych traderów.',
  keywords: ['trading', 'forex', 'krypto', 'strategie', 'analiza rynkowa', 'wyniki'],
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: BASE_URL,
    siteName: 'NysethTrading',
    title: 'NysethTrading — Trade Smarter, Live Freer',
    description: 'Transparentne wyniki tradingowe, analiza rynkowa i strategie, które działają.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NysethTrading',
    description: 'Transparentne wyniki tradingowe i analiza rynkowa.',
  },
};

const schemaWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NysethTrading',
  url: BASE_URL,
  description: 'Transparentne wyniki tradingowe — Forex, Krypto, Futures.',
  inLanguage: 'pl',
  author: {
    '@type': 'Person',
    name: 'Nyseth',
    description: 'Trader z Wrocławia z 7-letnim doświadczeniem na rynkach Forex, krypto i futures.',
    knowsAbout: ['Forex trading', 'Cryptocurrency trading', 'Futures trading', 'Day trading'],
    url: `${BASE_URL}/o-mnie`,
  },
};

const schemaPerson = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Nyseth',
  url: `${BASE_URL}/o-mnie`,
  description: 'Trader z Wrocławia z 7-letnim doświadczeniem na rynkach Forex, krypto i futures.',
  knowsAbout: ['Forex', 'Cryptocurrency', 'Futures', 'Day Trading', 'Technical Analysis'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaPerson) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
