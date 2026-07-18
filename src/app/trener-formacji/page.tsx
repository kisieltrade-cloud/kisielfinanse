import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import PatternTrainer from '@/components/PatternTrainer';
import NewsletterForm from '@/components/NewsletterForm';

const BASE_URL = 'https://kisielfinanse.pl';
const URL = `${BASE_URL}/trener-formacji`;

export const metadata: Metadata = {
  title: { absolute: 'Trener formacji - ćwicz rozpoznawanie formacji na wykresie' },
  description: 'Interaktywny trening rozpoznawania formacji świecowych i wykresu. Dziesięć wykresów, dwa poziomy trudności, wyjaśnienie po każdej odpowiedzi. Za darmo, bez rejestracji.',
  keywords: ['trener formacji', 'quiz formacje świecowe', 'rozpoznawanie formacji', 'test wiedzy trading', 'formacje świecowe ćwiczenia', 'nauka analizy technicznej'],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Trener formacji tradingowych | KisielFinanse',
    description: 'Sprawdź, czy rozpoznasz młota, objęcie hossy i głowę z ramionami na wykresie. Dziesięć pytań, wyjaśnienie po każdym.',
    url: URL,
    type: 'website',
    locale: 'pl_PL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trener formacji tradingowych | KisielFinanse',
    description: 'Dziesięć wykresów, dwa poziomy trudności. Sprawdź, czy rozpoznasz formacje.',
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Trener formacji', item: URL },
  ],
};

const schemaApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Trener formacji KisielFinanse',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
  url: URL,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'PLN' },
  description: 'Interaktywny trener rozpoznawania formacji świecowych i formacji wykresu, z wyjaśnieniem po każdej odpowiedzi.',
};

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Czym różni się poziom łatwy od trudnego?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Na poziomie łatwym odpowiedzi do wyboru są losowe, więc zwykle wyraźnie się od siebie różnią. Na trudnym trener podstawia formacje z tej samej grupy i o tym samym charakterze sygnału, na przykład objęcie hossy obok gwiazdy porannej. Wtedy liczy się faktyczne czytanie wykresu, a nie eliminacja oczywistych błędnych opcji.',
      },
    },
    {
      '@type': 'Question',
      name: 'Czy wykresy są za każdym razem takie same?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nie. Każde losowanie rysuje formację z drobnymi odchyleniami: inne długości knotów, lekko przesunięte korpusy i szczyty. Proporcje, które decydują o tym, czym formacja jest, pozostają zachowane. Chodzi o to, żebyś uczył się rozpoznawać wzór, a nie zapamiętywał jeden obrazek.',
      },
    },
    {
      '@type': 'Question',
      name: 'Czy sama znajomość formacji wystarczy do tradingu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nie wystarczy. Formacja to tylko przesłanka, która ma sens w kontekście: przy ważnym wsparciu lub oporze, zgodnie z trendem wyższego interwału, z ustalonym stop lossem i wielkością pozycji. Ta sama świeca w środku chaotycznego ruchu bocznego nie znaczy prawie nic. Rozpoznawanie formacji jest jednym z kilku elementów planu tradingowego.',
      },
    },
  ],
};

export default function TrenerFormacjiPage() {
  return (
    <div data-theme="dark" style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }} />

      <main style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 24px 0' }}>
          <Breadcrumbs items={[
            { label: 'KisielFinanse', href: '/' },
            { label: 'Trener formacji' },
          ]} />

          <header style={{ margin: '20px 0 30px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--cyan)', margin: '0 0 14px', fontWeight: 600 }}>
              Trening · price action
            </p>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.06, margin: '0 0 16px', fontWeight: 800 }}>
              Trener formacji
            </h1>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--muted)', margin: 0 }}>
              Czytanie wykresu to umiejętność, która przychodzi z powtórzeń, nie z przeczytania listy formacji.
              Ten trener pokazuje ci wykres, ty nazywasz formację albo mówisz, w którą stronę wychyla.
              Za każdym razem rysuje ją trochę inaczej, żebyś uczył się wzoru, a nie jednego obrazka.
            </p>
          </header>
        </div>

        <div style={{ padding: '0 24px' }}>
          <PatternTrainer />
        </div>

        <section style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 0' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 14px' }}>Jak ćwiczyć, żeby to coś dało</h2>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--muted)', margin: '0 0 14px' }}>
            Zacznij od poziomu łatwego i pytań o nazwę. Gdy regularnie wychodzisz powyżej ośmiu punktów, przełącz
            na poziom trudny, gdzie odpowiedzi są celowo mylące. Formacje, na których się wykładasz, znajdziesz na końcu
            gry razem z rysunkiem, a szerzej opisane w{' '}
            <Link href="/formacje-tradingowe" style={{ color: 'var(--cyan)' }}>encyklopedii formacji</Link>.
          </p>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--muted)', margin: '0 0 14px' }}>
            Pamiętaj o granicy tego ćwiczenia. Tutaj formacja jest wycięta z kontekstu i wyśrodkowana na wykresie,
            a na realnym rynku musisz ją najpierw zauważyć w gąszczu świec. Dlatego kolejnym krokiem jest{' '}
            <Link href="/symulator-tradingu" style={{ color: 'var(--cyan)' }}>symulator tradingu</Link>, gdzie świece
            odsłaniają się po kolei i podejmujesz decyzję, nie znając przyszłości.
          </p>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--muted)', margin: 0 }}>
            Teoria stojąca za tymi obrazkami jest w artykule o{' '}
            <Link href="/trading/swiece-japonskie-jak-czytac-wykres" style={{ color: 'var(--cyan)' }}>świecach japońskich</Link>{' '}
            i o <Link href="/trading/wsparcie-i-opor-jak-wyznaczac-poziomy" style={{ color: 'var(--cyan)' }}>wsparciu i oporze</Link>,
            bo formacja przy ważnym poziomie znaczy dużo więcej niż ta sama formacja w środku ruchu bocznego.
            Całą kolejność nauki rozpisuję w przewodniku{' '}
            <Link href="/naucz-sie-tradowac" style={{ color: 'var(--cyan)' }}>naucz się tradować</Link>, a pozostałe
            narzędzia zebrałem w <Link href="/narzedzia-tradera" style={{ color: 'var(--cyan)' }}>narzędziach tradera</Link>.
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
