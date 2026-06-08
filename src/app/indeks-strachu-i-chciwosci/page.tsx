import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import FearGreedGauge from '@/components/FearGreedGauge';
import NewsletterForm from '@/components/NewsletterForm';
import { getIndexFG } from '@/lib/fear-greed';

const BASE_URL = 'https://kisielfinanse.pl';
const URL = `${BASE_URL}/indeks-strachu-i-chciwosci`;

// Dane odświeżane co godzinę (ISR)
export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: 'Indeks Strachu i Chciwości 2026 - GPW, NASDAQ, krypto' },
  description: 'Aktualny indeks strachu i chciwości dla polskiej giełdy, NASDAQ-100 i kryptowalut. Sprawdź nastroje na rynku jednym rzutem oka. Dane aktualizowane co godzinę.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Indeks Strachu i Chciwości - GPW, NASDAQ, krypto | KisielFinanse',
    description: 'Nastroje na rynku jednym rzutem oka. WIG20, NASDAQ-100 i kryptowaluty. Dane aktualizowane co godzinę.',
    url: URL,
    images: [{ url: '/indeks-strachu-i-chciwosci/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Indeks Strachu i Chciwości | KisielFinanse',
    description: 'Nastroje na rynku: WIG20, NASDAQ-100, krypto. Dane na żywo.',
    images: ['/indeks-strachu-i-chciwosci/opengraph-image'],
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Indeks Strachu i Chciwości', item: URL },
  ],
};

export default async function FearGreedPage() {
  const [krypto, polska, nasdaq] = await Promise.all([
    getIndexFG('BTC-USD'),
    getIndexFG('EPOL'),
    getIndexFG('^NDX'),
  ]);

  return (
    <div data-theme="dark" style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />

      <main style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px 0' }}>
          <Breadcrumbs items={[
            { label: 'KisielFinanse', href: '/' },
            { label: 'Indeks Strachu i Chciwości' },
          ]} />

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.4rem)',
            letterSpacing: '2px', lineHeight: 1.05, margin: '20px 0 14px',
            color: 'var(--text)',
          }}>
            INDEKS STRACHU I CHCIWOŚCI
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text)',
            lineHeight: 1.8, maxWidth: 620, margin: 0,
          }}>
            Nastroje na rynku jednym rzutem oka. Gdy wskaźnik świeci na czerwono, większość się boi. Gdy na zielono, na rynku panuje chciwość. Najlepsze okazje historycznie pojawiały się w skrajnym strachu, a najgorsze decyzje w euforii.
          </p>
        </div>

        {/* Wskaźniki */}
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
            <FearGreedGauge title="Krypto" subtitle="Bitcoin i rynek kryptowalut" data={krypto} accent="#f7931a" />
            <FearGreedGauge title="Polska giełda" subtitle="polskie akcje (MSCI Poland)" data={polska} accent="#ff2d78" />
            <FearGreedGauge title="USA" subtitle="NASDAQ-100 - technologia" data={nasdaq} accent="#5b9bd5" />
          </div>
        </div>

        {/* Jak czytać */}
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px 0' }}>
          <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.3px', marginBottom: 18, color: 'var(--text)' }}>
            Jak czytać ten wskaźnik
          </h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {[
              { z: '0-24', t: 'Skrajny strach', c: '#e0524d', d: 'Inwestorzy panikują, ceny często poniżej wartości. Historycznie obszar okazji dla cierpliwych.' },
              { z: '25-44', t: 'Strach', c: '#e0863a', d: 'Przewaga obaw i ostrożności. Rynek nerwowy, ale bez paniki.' },
              { z: '45-55', t: 'Neutralnie', c: '#e0c947', d: 'Równowaga między strachem a chciwością. Brak wyraźnego sygnału.' },
              { z: '56-74', t: 'Chciwość', c: '#7bb85f', d: 'Optymizm rośnie, kapitał napływa. Warto zachować czujność.' },
              { z: '75-100', t: 'Skrajna chciwość', c: '#3fb96b', d: 'Euforia i FOMO. Historycznie obszar, w którym łatwo o szczyt i bolesną korektę.' },
            ].map((r) => (
              <div key={r.z} style={{ display: 'flex', alignItems: 'baseline', gap: 14, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', minWidth: 56 }}>{r.z}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', fontWeight: 700, color: r.c, minWidth: 130 }}>{r.t}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.6 }}>{r.d}</span>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 28, padding: '18px 22px', background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 14,
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.7,
          }}>
            <strong style={{ color: 'var(--text)' }}>Jak liczymy?</strong><br />
            Nasz autorski wskaźnik dla każdego rynku liczymy z danych dziennych jako średnią czterech składowych: RSI, momentum względem średniej 125-dniowej, pozycja w zakresie 52 tygodni oraz zwrot z ostatniego miesiąca. Krypto liczymy z ceny Bitcoina, polskie akcje z indeksu MSCI Poland, a USA z NASDAQ-100. Dane aktualizowane co godzinę. To narzędzie edukacyjne, nie sygnał kupna ani sprzedaży.
          </div>

          <div style={{ margin: '48px 0 80px' }}>
            <NewsletterForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
