import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import NewsletterForm from '@/components/NewsletterForm';
import FinancialCalendar from '@/components/FinancialCalendar';
import { CAL_EVENTS_2026, CAL_RECURRING, CAL_CATEGORIES } from '@/lib/calendar-2026';

const BASE_URL = 'https://kisielfinanse.pl';
const URL = `${BASE_URL}/finansowy-kalendarz-2026`;

// Daty są stałe, ale „najbliższe wydarzenie" i wyszarzenie przeszłych zależą od
// bieżącej daty - dlatego odświeżamy raz na godzinę (ISR).
export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: 'Finansowy kalendarz 2026 - terminy RPP, podatki, ZUS, KSeF' },
  description:
    'Najważniejsze daty finansowe 2026: posiedzenia RPP, terminy podatkowe (PIT, VAT, CIT), ' +
    'składki ZUS, KSeF, waloryzacja emerytur i płaca minimalna. Wszystko w jednym miejscu.',
  keywords: [
    'kalendarz finansowy 2026',
    'terminy podatkowe 2026',
    'posiedzenia RPP 2026',
    'KSeF 2026 terminy',
    'waloryzacja emerytur 2026',
    'terminy ZUS 2026',
    'ważne daty finansowe 2026',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Finansowy kalendarz 2026 | KisielFinanse',
    description: 'Posiedzenia RPP, terminy podatkowe, ZUS, KSeF, waloryzacje - wszystkie ważne daty 2026 w jednym miejscu.',
    url: URL,
    type: 'website',
    siteName: 'KisielFinanse',
    locale: 'pl_PL',
    images: [{ url: '/finansowy-kalendarz-2026/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Finansowy kalendarz 2026 | KisielFinanse',
    description: 'Wszystkie ważne daty finansowe 2026: RPP, podatki, ZUS, KSeF, emerytury.',
    images: ['/finansowy-kalendarz-2026/opengraph-image'],
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Finansowy kalendarz 2026', item: URL },
  ],
};

const catMap = Object.fromEntries(CAL_CATEGORIES.map((c) => [c.id, c]));

export default function CalendarPage() {
  const todayISO = new Date().toISOString().slice(0, 10);

  return (
    <div data-theme="dark" style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
      <style>{`.fc-related-link:hover span:last-child{text-decoration:underline;text-underline-offset:4px}`}</style>

      <main style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 22px 0' }}>
          <Breadcrumbs items={[
            { label: 'KisielFinanse', href: '/' },
            { label: 'Finansowy kalendarz 2026' },
          ]} />

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            letterSpacing: '1.5px', lineHeight: 1.06, margin: '20px 0 14px',
            color: 'var(--text)',
          }}>
            FINANSOWY KALENDARZ 2026
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'var(--text)',
            lineHeight: 1.75, maxWidth: 640, margin: '0 0 8px',
          }}>
            Wszystkie ważne daty w jednym miejscu: decyzje RPP o stopach, terminy podatkowe i ZUS,
            kolejne etapy KSeF, waloryzacja emerytur i moment ustalenia płacy minimalnej na 2027.
            Filtruj po kategorii i sprawdź, co Cię czeka najbliżej.
          </p>

          <FinancialCalendar events={CAL_EVENTS_2026} todayISO={todayISO} />

          {/* Terminy powtarzalne co miesiąc */}
          <section style={{ marginTop: 56, marginBottom: 8 }}>
            <h2 style={{
              fontFamily: 'var(--font-serif, Georgia), serif', fontSize: '1.7rem', fontWeight: 800,
              margin: '0 0 6px', color: 'var(--text)', letterSpacing: '-0.01em',
            }}>
              Terminy co miesiąc
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.97rem', margin: '0 0 10px', lineHeight: 1.6 }}>
              Te obowiązki wracają regularnie przez cały rok - warto je mieć z tyłu głowy.
            </p>
            <div>
              {CAL_RECURRING.map((r, i) => {
                const cat = catMap[r.category];
                return (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '200px 1fr', gap: 22, alignItems: 'baseline',
                    padding: '18px 0', borderBottom: '1px solid var(--border)',
                  }}>
                    <span style={{ fontWeight: 800, color: `rgb(${cat.rgb})`, fontSize: '1rem', lineHeight: 1.4 }}>
                      {r.title}
                    </span>
                    <span style={{ color: 'var(--muted)', fontSize: '0.96rem', lineHeight: 1.6, maxWidth: '62ch' }}>
                      {r.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Powiązane poradniki */}
          <section style={{ marginTop: 56 }}>
            <h2 style={{
              fontFamily: 'var(--font-serif, Georgia), serif', fontSize: '1.7rem', fontWeight: 800,
              margin: '0 0 10px', color: 'var(--text)', letterSpacing: '-0.01em',
            }}>
              Powiązane poradniki
            </h2>
            <div>
              {[
                { label: 'Stopy procentowe i decyzje RPP - co oznaczają dla Twojej raty', href: '/gospodarka/stopy-procentowe-czerwiec-2026-decyzja-rpp' },
                { label: 'Obniżki stóp procentowych NBP - co oznaczają', href: '/gospodarka/obnizki-stop-procentowych-nbp-2026-co-oznacza' },
                { label: 'Waloryzacja emerytur 2026 - o ile wzrosną świadczenia', href: '/pieniadze/waloryzacja-emerytur-2026-zus' },
                { label: 'Składka zdrowotna 2026 - ile zapłaci działalność', href: '/gospodarka/skladka-zdrowotna-2026-dzialalnosc-ile-zaplacisz' },
                { label: 'Kwota wolna i progi podatkowe 2026', href: '/pieniadze/kwota-wolna-progi-podatkowe-2026' },
              ].map((a) => (
                <Link key={a.href} href={a.href} className="fc-related-link" style={{
                  display: 'flex', alignItems: 'baseline', gap: 14, padding: '16px 0',
                  borderBottom: '1px solid var(--border)',
                  color: 'var(--text)', textDecoration: 'none', fontSize: '1rem', lineHeight: 1.5,
                }}>
                  <span style={{ color: 'var(--gold, #c9a227)', fontWeight: 800, flex: '0 0 auto' }}>&rarr;</span>
                  <span>{a.label}</span>
                </Link>
              ))}
            </div>
          </section>

          <p style={{
            marginTop: 28, padding: '16px 20px', background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 14,
            fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.6,
          }}>
            Daty decyzyjne RPP wg harmonogramu NBP, terminy KSeF i podatkowe wg Ministerstwa Finansów.
            Daty wypłat świadczeń (np. 13. i 14. emerytura) bywają ustalane rozporządzeniem i mogą się
            nieznacznie różnić. Zawsze potwierdź szczegóły w oficjalnym źródle.
          </p>

          <div style={{ margin: '48px 0 80px' }}>
            <NewsletterForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
