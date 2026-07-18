import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import TradingPlanBuilder from '@/components/TradingPlanBuilder';
import NewsletterForm from '@/components/NewsletterForm';

const BASE_URL = 'https://kisielfinanse.pl';
const URL = `${BASE_URL}/kreator-planu-tradingowego`;

export const metadata: Metadata = {
  title: { absolute: 'Kreator planu tradingowego - zbuduj własny plan w 5 krokach' },
  description: 'Zbuduj swój plan tradingowy krok po kroku: rynek, ryzyko na transakcję, warunki wejścia, stop loss i limity strat. Narzędzie liczy kwoty za ciebie, a gotowy plan wydrukujesz lub zapiszesz jako PDF.',
  keywords: ['plan tradingowy', 'jak napisać plan tradingowy', 'kreator planu tradingowego', 'zasady tradingu', 'zarządzanie ryzykiem trading', 'dzienny limit straty', 'szablon planu tradingowego'],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Kreator planu tradingowego | KisielFinanse',
    description: 'Pięć kroków i masz spisany plan: ryzyko, warunki wejścia, stop loss, limity strat. Do wydruku lub PDF.',
    url: URL,
    type: 'website',
    locale: 'pl_PL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kreator planu tradingowego | KisielFinanse',
    description: 'Zbuduj własny plan tradingowy w 5 krokach. Za darmo, bez rejestracji.',
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Kreator planu tradingowego', item: URL },
  ],
};

const schemaApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kreator planu tradingowego KisielFinanse',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  url: URL,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'PLN' },
  description: 'Interaktywny kreator, który przeprowadza przez pięć kroków budowy planu tradingowego i wylicza kwoty ryzyka oraz limity strat.',
};

const schemaHowTo = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Jak zbudować plan tradingowy w pięciu krokach',
  description: 'Kolejne decyzje, które składają się na kompletny plan tradingowy: rynek i styl, ryzyko, warunki wejścia, wyjście oraz zasady dyscypliny.',
  step: [
    { '@type': 'HowToStep', position: 1, name: 'Wybierz rynek i styl', text: 'Zdecyduj, na czym handlujesz i w jakim horyzoncie. Styl musi pasować do tego, ile realnie masz czasu przed wykresem.' },
    { '@type': 'HowToStep', position: 2, name: 'Ustal ryzyko i limity', text: 'Określ ryzyko na jedną transakcję jako procent kapitału, zwykle około 1 procent, oraz dzienny i tygodniowy limit straty.' },
    { '@type': 'HowToStep', position: 3, name: 'Opisz warunki wejścia', text: 'Wypisz warunki, które muszą być spełnione razem, zanim otworzysz pozycję. Im konkretniej, tym łatwiej ocenić, czy trzymałeś się planu.' },
    { '@type': 'HowToStep', position: 4, name: 'Zaplanuj wyjście', text: 'Ustal, gdzie stawiasz stop loss w oparciu o strukturę wykresu i jaki minimalny stosunek zysku do ryzyka akceptujesz.' },
    { '@type': 'HowToStep', position: 5, name: 'Spisz zasady i rutynę', text: 'Zdefiniuj sytuacje, w których nie handlujesz, oraz rutynę przed sesją, po transakcji i na koniec tygodnia.' },
  ],
};

export default function KreatorPlanuPage() {
  return (
    <div data-theme="dark" style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaHowTo) }} />

      <main style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 24px 0' }}>
          <Breadcrumbs items={[
            { label: 'KisielFinanse', href: '/' },
            { label: 'Kreator planu tradingowego' },
          ]} />

          <header style={{ margin: '20px 0 30px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--cyan)', margin: '0 0 14px', fontWeight: 600 }}>
              Narzędzie · dyscyplina
            </p>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.06, margin: '0 0 16px', fontWeight: 800 }}>
              Kreator planu tradingowego
            </h1>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--muted)', margin: 0 }}>
              Większość osób traci nie dlatego, że nie zna formacji, tylko dlatego, że handluje bez spisanych zasad.
              Przejdź przez pięć kroków, a dostaniesz gotowy plan z policzonymi kwotami: ile ryzykujesz na transakcję,
              gdzie kończy się twój dzień i jakiej skuteczności potrzebujesz przy swoim R/R. Plan wydrukujesz,
              zapiszesz jako PDF albo skopiujesz do dziennika.
            </p>
          </header>
        </div>

        <div style={{ padding: '0 24px' }}>
          <TradingPlanBuilder />
        </div>

        <section style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 0' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 14px' }}>Dlaczego plan w ogóle działa</h2>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--muted)', margin: '0 0 14px' }}>
            Plan nie sprawia, że przestajesz tracić. Sprawia, że twoje straty są policzone z góry, a decyzje podejmujesz
            wtedy, gdy jesteś spokojny, a nie w środku ruchu ceny. Bez spisanych zasad nie da się nawet stwierdzić,
            czy strategia nie działa, czy po prostu jej nie przestrzegałeś.
          </p>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--muted)', margin: '0 0 14px' }}>
            Najważniejsze liczby w tym kreatorze to ryzyko na transakcję i dzienny limit straty. Przy ryzyku 1 procent
            i limicie 3 procent masz trzy stratne transakcje pod rząd, zanim zamkniesz platformę. To wygląda surowo,
            dopóki nie zobaczysz, jak wygląda konto po dniu, w którym ktoś próbował odrobić stratę większą pozycją.
            Szerzej piszę o tym w artykule o{' '}
            <Link href="/trading/jak-zbudowac-plan-tradingowy" style={{ color: 'var(--cyan)' }}>budowaniu planu tradingowego</Link>{' '}
            oraz w tekstach o{' '}
            <Link href="/trading/stop-loss-i-take-profit" style={{ color: 'var(--cyan)' }}>stop lossie i take proficie</Link>.
          </p>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--muted)', margin: 0 }}>
            Gdy plan jest gotowy, policz wielkość pozycji w{' '}
            <Link href="/kalkulator/wielkosc-pozycji" style={{ color: 'var(--cyan)' }}>kalkulatorze wielkości pozycji</Link>,
            przećwicz rozpoznawanie setupów w <Link href="/trener-formacji" style={{ color: 'var(--cyan)' }}>trenerze formacji</Link>{' '}
            i sprawdź go bez ryzyka w <Link href="/symulator-tradingu" style={{ color: 'var(--cyan)' }}>symulatorze tradingu</Link>.
            Wszystkie narzędzia są zebrane w <Link href="/narzedzia-tradera" style={{ color: 'var(--cyan)' }}>narzędziach tradera</Link>.
          </p>
        </section>

        <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px 80px' }}>
          <NewsletterForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
