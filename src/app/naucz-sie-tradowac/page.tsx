import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import LearnToTrade from '@/components/LearnToTrade';
import NewsletterForm from '@/components/NewsletterForm';

const BASE_URL = 'https://kisielfinanse.pl';
const URL = `${BASE_URL}/naucz-sie-tradowac`;

export const metadata: Metadata = {
  title: { absolute: 'Naucz się tradować - mapa drogowa od zera' },
  description: 'Jak zacząć trading od zera: 7 kroków od wyboru rynku po pierwszy realny trade, pułapki początkujących i realny harmonogram nauki. Bez obietnic szybkiego bogacenia.',
  keywords: ['nauka tradingu', 'jak zacząć trading', 'trading od zera', 'price action', 'zarządzanie ryzykiem', 'trading plan', 'KisielFinanse'],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Naucz się tradować - mapa drogowa od zera | KisielFinanse',
    description: 'Trading to umiejętność, nie magiczny przycisk. 7 kroków, pułapki początkujących i realny timeline nauki.',
    url: URL,
    type: 'article',
    locale: 'pl_PL',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Naucz się tradować - KisielFinanse' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Naucz się tradować - mapa drogowa od zera | KisielFinanse',
    description: 'Trading to umiejętność, nie magiczny przycisk. 7 kroków i realny timeline nauki.',
    images: ['/og-image.png'],
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Naucz się tradować', item: URL },
  ],
};

export default function NauczSieTradowacPage() {
  return (
    <div data-theme="dark" style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />

      <main style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px 0' }}>
          <Breadcrumbs items={[
            { label: 'KisielFinanse', href: '/' },
            { label: 'Naucz się tradować' },
          ]} />
        </div>

        <LearnToTrade />

        <div style={{ maxWidth: 700, margin: '0 auto', padding: '8px 24px 80px' }}>
          <NewsletterForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
