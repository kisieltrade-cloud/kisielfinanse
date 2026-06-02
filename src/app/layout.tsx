import type { Metadata } from 'next';
import { Syne, JetBrains_Mono, Bebas_Neue, Inter, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import CookieConsent from '@/components/CookieConsent';
import { CookieConsentInit } from '@/components/CookieConsentInit';
import SchemaOrg from '@/components/SchemaOrg';

/* ─── Fonty - hostowane lokalnie przez Next.js (zero render-blocking) ─── */
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

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-playfair',
});

const BASE_URL = 'https://kisielfinanse.pl';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    template: '%s | KisielFinanse',
    default: 'KisielFinanse - Finanse. Wiedza. Wolność.',
  },
  description:
    'Trading, krypto, oszczędzanie, geopolityka - edukacja finansowa bez ściemy. KisielFinanse to wiedza, która naprawdę robi różnicę.',
  keywords: [
    'trading', 'forex', 'krypto', 'finanse osobiste', 'oszczędzanie',
    'edukacja finansowa', 'analiza rynkowa', 'geopolityka',
    'wolność finansowa', 'inwestowanie', 'day trading',
  ],

  // Canonical i alternatywy językowe
  alternates: {
    canonical: BASE_URL,
    languages: { 'pl-PL': BASE_URL },
    types: { 'application/rss+xml': `${BASE_URL}/feed.xml` },
  },

  // Ikony — Next.js generuje <link> tagi automatycznie (wiarygodniejsze dla Google)
  // favicon-96.png: 96×96px — powyżej wymaganego przez Google minimum 48×48px
  icons: {
    icon: [
      { url: '/favicon.ico',     sizes: '32x32',   type: 'image/x-icon' },
      { url: '/favicon-48.png',  sizes: '48x48',   type: 'image/png' },
      { url: '/favicon-96.png',  sizes: '96x96',   type: 'image/png' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      { rel: 'mask-icon', url: '/favicon-96.png' },
    ],
  },

  // PWA manifest
  manifest: '/site.webmanifest',

  // Open Graph - podgląd przy udostępnianiu w social media
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: BASE_URL,
    siteName: 'KisielFinanse',
    title: 'KisielFinanse - Finanse. Wiedza. Wolność.',
    description:
      'Trading, krypto, oszczędzanie, geopolityka - edukacja finansowa bez ściemy. Wiedza, która naprawdę robi różnicę.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KisielFinanse - Finanse. Wiedza. Wolność.',
      },
    ],
  },

  // Twitter/X Card
  twitter: {
    card: 'summary_large_image',
    site: '@KisielFinanse',
    creator: '@KisielFinanse',
    title: 'KisielFinanse - Finanse. Wiedza. Wolność.',
    description: 'Trading, krypto, oszczędzanie, geopolityka - edukacja finansowa bez ściemy.',
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
    <html lang="pl" className={`${syne.variable} ${jetbrains.variable} ${bebas.variable} ${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Schemat kolorów: strona sama steruje motywem (data-theme), wyłącza auto-dark przeglądarki */}
        <meta name="color-scheme" content="light dark" />

        {/* Consent Mode v2 - musi być PRZED tagiem GA */}
        <CookieConsentInit />

        {/* Schema.org JSON-LD */}
        <SchemaOrg />
      </head>
      <body>
        {children}
        <CookieConsent />

        {/* Google Analytics - ładowane po interakcji, nie blokuje renderowania */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-G52114VC2V"
          strategy="afterInteractive"
        />
        <Script id="ga-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-G52114VC2V', { anonymize_ip: true });
          `}
        </Script>
      </body>
    </html>
  );
}
