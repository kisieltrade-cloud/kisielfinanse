import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | NysethTrading',
    default: 'NysethTrading — Transparentny Trading na Żywo',
  },
  description:
    'Trader z Wrocławia z 7-letnim doświadczeniem. Transparentne wyniki tygodniowe, day trading na Forexie, krypto i futures. Dołącz i śledź moje wyniki na żywo.',
  keywords: [
    'trading', 'forex', 'krypto', 'bitcoin', 'day trading', 'futures',
    'wyniki tradingowe', 'trader Polska', 'NAS100', 'S&P500',
    'transparentny trader', 'nauka tradingu',
  ],
  authors: [{ name: 'Nyseth' }],
  creator: 'Nyseth',
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: 'https://nyseth-trading.vercel.app',
    siteName: 'NysethTrading',
    title: 'NysethTrading — Transparentny Trading na Żywo',
    description:
      'Trader z Wrocławia z 7-letnim doświadczeniem. Wyniki tygodniowe, day trading na Forexie, krypto i futures.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NysethTrading — Transparentny Trading na Żywo',
    description:
      'Wyniki tygodniowe, day trading na Forexie, krypto i futures. Bez filtrów.',
  },
  robots: {
    index: true,
    follow: true,
  },
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
        <link rel="shortcut icon" href="/favicon.svg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
