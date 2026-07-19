import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import TradeJournal from '@/components/TradeJournal';
import NewsletterForm from '@/components/NewsletterForm';

const BASE_URL = 'https://kisielfinanse.pl';
const URL = `${BASE_URL}/dziennik-tradera`;

export const metadata: Metadata = {
  title: { absolute: 'Dziennik tradera online - zapisuj transakcje i licz statystyki' },
  description: 'Darmowy dziennik tradera w przeglądarce. Zapisujesz transakcje, a narzędzie liczy profit factor, średni wynik w R, maksymalne obsunięcie i pokazuje, ile kosztuje cię łamanie własnego planu.',
  keywords: ['dziennik tradera', 'dziennik transakcji', 'dziennik tradingowy online', 'statystyki tradera', 'profit factor kalkulator', 'krzywa kapitału', 'jak prowadzić dziennik tradingowy'],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Dziennik tradera online | KisielFinanse',
    description: 'Zapisuj transakcje i zobacz, co naprawdę mówią twoje dane: profit factor, średnie R, obsunięcie i koszt łamania planu.',
    url: URL,
    type: 'website',
    locale: 'pl_PL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dziennik tradera online | KisielFinanse',
    description: 'Darmowy dziennik transakcji ze statystykami. Bez rejestracji, dane zostają w twojej przeglądarce.',
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Dziennik tradera', item: URL },
  ],
};

const schemaApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Dziennik tradera KisielFinanse',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  url: URL,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'PLN' },
  description: 'Interaktywny dziennik transakcji, który liczy trafność, profit factor, średni wynik w R, maksymalne obsunięcie i porównuje transakcje zgodne z planem z tymi zawartymi wbrew niemu.',
};

const FAQ = [
  {
    q: 'Czy moje transakcje trafiają na wasz serwer?',
    a: 'Nie. Dziennik zapisuje dane wyłącznie w pamięci twojej przeglądarki, w tak zwanym localStorage. Nic nie jest wysyłane ani nigdzie przechowywane poza twoim urządzeniem. Oznacza to również, że wyczyszczenie danych przeglądarki usuwa dziennik i że nie zobaczysz go na innym komputerze, dlatego dostępny jest eksport do pliku CSV.',
  },
  {
    q: 'Co wpisać w pole ryzyko?',
    a: 'Kwotę, którą stracisz, jeżeli cena dojdzie do stop lossa, czyli zaplanowaną stratę na tej transakcji. Dzięki temu narzędzie może przeliczyć wynik na wielokrotność ryzyka, czyli R. Transakcja zamknięta z zyskiem równym podwójnemu ryzyku to wynik 2 R, niezależnie od tego, czy handlujesz kwotami rzędu stu, czy dziesięciu tysięcy złotych.',
  },
  {
    q: 'Czym jest wynik w R i dlaczego jest ważniejszy od złotówek?',
    a: 'R to wynik transakcji podzielony przez kwotę, którą na niej ryzykowałeś. Złotówki zależą od wielkości konta i pozycji, więc nie da się po nich porównywać transakcji z różnych okresów. R porównywać można, bo mierzy sam efekt decyzji. Średnie R powyżej zera oznacza, że twoje podejście zarabia w przeliczeniu na jednostkę ryzyka.',
  },
  {
    q: 'Po co zaznaczać, czy transakcja była zgodna z planem?',
    a: 'Bo to jedyny sposób, żeby oddzielić jakość strategii od jakości jej wykonania. Jeżeli transakcje zgodne z planem zarabiają, a te improwizowane tracą, to nie potrzebujesz nowej strategii, tylko dyscypliny. Bez tego rozróżnienia większość osób zmienia działające podejście, bo wyniki psuły transakcje, których w ogóle nie powinno być.',
  },
  {
    q: 'Ile transakcji trzeba zapisać, żeby statystyki coś znaczyły?',
    a: 'Kilkanaście to za mało i narzędzie mówi to wprost. Przy takiej próbce o wyniku decyduje przypadek. Sensowne wnioski zaczynają się od kilkudziesięciu transakcji, najlepiej z okresów o różnym charakterze rynku, żeby test obejmował także warunki, w których twoja strategia sobie nie radzi.',
  },
];

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function DziennikTraderaPage() {
  return (
    <div data-theme="dark" style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }} />

      <main style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 24px 0' }}>
          <Breadcrumbs items={[
            { label: 'KisielFinanse', href: '/' },
            { label: 'Dziennik tradera' },
          ]} />

          <header style={{ margin: '20px 0 30px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--cyan)', margin: '0 0 14px', fontWeight: 600 }}>
              Narzędzie · statystyki
            </p>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.06, margin: '0 0 16px', fontWeight: 800 }}>
              Dziennik tradera
            </h1>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--muted)', margin: 0 }}>
              Zapisuj transakcje, a narzędzie policzy to, czego nie widać w zestawieniu od brokera: profit factor,
              średni wynik w przeliczeniu na ryzyko, maksymalne obsunięcie i najdłuższą serię strat. Osobno pokaże,
              ile zarabiają transakcje zgodne z twoim planem, a ile te zawarte wbrew niemu. Wszystko zostaje
              w twojej przeglądarce, bez rejestracji.
            </p>
          </header>
        </div>

        <div style={{ padding: '0 24px' }}>
          <TradeJournal />
        </div>

        <section style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 0' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 14px' }}>Dlaczego dziennik zmienia więcej niż kolejny wskaźnik</h2>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--muted)', margin: '0 0 14px' }}>
            Bez zapisu każda seria strat wygląda jak dowód, że strategia przestała działać, a każda dobra passa
            jak dowód talentu. Dopiero kilkadziesiąt wpisów pokazuje, które z tych wrażeń miało pokrycie
            w liczbach. Najczęstsze odkrycie jest niewygodne: strategia była w porządku, a wynik psuły transakcje
            zawarte poza jej regułami.
          </p>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--muted)', margin: '0 0 14px' }}>
            Dlatego to narzędzie kładzie nacisk na jedno pole, którego nie ma w typowym arkuszu: znacznik
            zgodności z planem. Reszta liczb jest standardowa, ale ta jedna kolumna odpowiada na pytanie,
            czy potrzebujesz nowej metody, czy tylko trzymania się starej. Więcej o samym nawyku piszę
            w artykule o{' '}
            <Link href="/trading/dziennik-tradera-jak-prowadzic" style={{ color: 'var(--cyan)' }}>prowadzeniu dziennika tradera</Link>,
            a o metrykach w tekście o{' '}
            <Link href="/trading/jak-testowac-strategie-tradingowa-backtest" style={{ color: 'var(--cyan)' }}>testowaniu strategii</Link>.
          </p>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--muted)', margin: 0 }}>
            Zasady, według których oceniasz zgodność z planem, ułożysz w{' '}
            <Link href="/kreator-planu-tradingowego" style={{ color: 'var(--cyan)' }}>kreatorze planu tradingowego</Link>,
            wielkość pozycji policzysz w{' '}
            <Link href="/kalkulator/wielkosc-pozycji" style={{ color: 'var(--cyan)' }}>kalkulatorze wielkości pozycji</Link>,
            a pierwsze transakcje do dziennika możesz wygenerować bez ryzyka w{' '}
            <Link href="/symulator-tradingu" style={{ color: 'var(--cyan)' }}>symulatorze tradingu</Link>.
            Komplet narzędzi znajdziesz w <Link href="/narzedzia-tradera" style={{ color: 'var(--cyan)' }}>narzędziach tradera</Link>.
          </p>
        </section>

        <section style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 0' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 18px' }}>Pytania i odpowiedzi</h2>
          {FAQ.map((f) => (
            <div key={f.q} style={{ borderTop: '1px solid var(--border)', padding: '16px 0' }}>
              <h3 style={{ fontSize: '1.02rem', fontWeight: 700, margin: '0 0 8px' }}>{f.q}</h3>
              <p style={{ fontSize: '0.96rem', lineHeight: 1.7, color: 'var(--muted)', margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </section>

        <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px 80px' }}>
          <NewsletterForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
