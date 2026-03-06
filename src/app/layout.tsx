import type { Metadata } from 'next';
import { Syne, JetBrains_Mono, Bebas_Neue } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import CookieConsent, { CookieConsentInit } from '@/components/CookieConsent';
import SchemaOrg from '@/components/SchemaOrg';

/* ─── Fonty — hostowane lokalnie przez Next.js (zero render-blocking) ─── */
const syne = Syne({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
  variable: '--font-syne',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500'],
  display: 'swap',
  variable: '--font-jetbrains',
});

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-bebas',
});

const BASE_URL = 'https://nysethtrading.pl';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    template: '%s | NysethTrading',
    default: 'NysethTrading — Transparentne Wyniki Tradingowe',
  },
  description:
    'Transparentne wyniki tradingowe, tygodniowe statystyki i strategie forex/krypto. Bez ściemy — tylko rzeczywiste wyniki z własnego rachunku.',
  keywords: [
    'trading', 'forex', 'krypto', 'wyniki tradingowe', 'strategie tradingowe',
    'transparentny trader', 'analiza rynkowa', 'challenge tradingowy',
    'profit factor', 'win rate', 'XTB', 'day trading',
  ],

  // Canonical i alternatywy językowe
  alternates: {
    canonical: BASE_URL,
    languages: { 'pl-PL': BASE_URL },
  },

  // Open Graph — podgląd przy udostępnianiu w social media
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: BASE_URL,
    siteName: 'NysethTrading',
    title: 'NysethTrading — Transparentne Wyniki Tradingowe',
    description:
      'Transparentne wyniki tradingowe, tygodniowe statystyki i strategie forex/krypto. Bez ściemy — tylko rzeczywiste wyniki.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NysethTrading — Transparentne Wyniki Tradingowe',
      },
    ],
  },

  // Twitter/X Card
  twitter: {
    card: 'summary_large_image',
    site: '@nysethtrading',
    creator: '@nysethtrading',
    title: 'NysethTrading — Transparentne Wyniki Tradingowe',
    description: 'Transparentne wyniki tradingowe i analiza rynkowa. Forex, krypto, bez ściemy.',
    images: ['/og-image.png'],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${syne.variable} ${jetbrains.variable} ${bebas.variable}`}>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />

        {/* Consent Mode v2 — musi być PRZED tagiem GA */}
        <CookieConsentInit />

        {/* Schema.org JSON-LD */}
        <SchemaOrg />
      </head>
      <body>
        {children}
        <CookieConsent />

        {/* Google Analytics — ładowane po interakcji, nie blokuje renderowania */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RV480KYSX0"
          strategy="afterInteractive"
        />
        <Script id="ga-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RV480KYSX0', { anonymize_ip: true });
          `}
        </Script>
      </body>
    </html>
  );
}
