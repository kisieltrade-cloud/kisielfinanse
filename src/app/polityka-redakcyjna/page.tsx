import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: { absolute: 'Polityka redakcyjna - jak tworzymy treści | KisielFinanse' },
  description: 'Jak powstają i są weryfikowane treści w KisielFinanse.pl: kto za nie odpowiada, z jakich źródeł korzystamy (NBP, GUS, ZUS, KNF, Ministerstwo Finansów), jak aktualizujemy dane i jak oznaczamy materiały afiliacyjne.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://kisielfinanse.pl/polityka-redakcyjna' },
  openGraph: {
    title: 'Polityka redakcyjna | KisielFinanse',
    description: 'Jak tworzymy i weryfikujemy treści: źródła, proces weryfikacji, aktualizacje i przejrzystość afiliacji.',
    url: 'https://kisielfinanse.pl/polityka-redakcyjna',
    siteName: 'KisielFinanse',
  },
  twitter: {
    card: 'summary',
    title: 'Polityka redakcyjna | KisielFinanse',
    description: 'Jak tworzymy i weryfikujemy treści finansowe.',
  },
};

const LAST_UPDATE = '30.06.2026';

const schemaPage = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Polityka redakcyjna KisielFinanse',
  url: 'https://kisielfinanse.pl/polityka-redakcyjna',
  inLanguage: 'pl-PL',
  publisher: {
    '@type': 'Organization',
    name: 'KisielFinanse',
    url: 'https://kisielfinanse.pl',
  },
  author: { '@type': 'Person', name: 'Mateusz Kisiel', url: 'https://kisielfinanse.pl/o-mnie' },
};

const sections = [
  {
    title: '1. Kto odpowiada za treści',
    content: `Za treści w serwisie KisielFinanse.pl odpowiada Mateusz Kisiel - twórca portalu, od lat związany z rynkami finansowymi. Każdy artykuł podpisany jest autorem i prowadzi do strony O mnie, gdzie opisuję swoje doświadczenie.

Nie jesteśmy anonimową farmą treści. Za publikowanymi materiałami stoi konkretna osoba, z imienia i nazwiska, dostępna pod adresem kontaktowym.`,
  },
  {
    title: '2. Z jakich źródeł korzystamy',
    content: `Dane liczbowe i fakty opieramy na źródłach pierwotnych, a nie na powtórzeniach z innych blogów czy agregatorów. Podstawowe źródła to:`,
    list: [
      'Narodowy Bank Polski (stopy procentowe, kursy, dane monetarne)',
      'Główny Urząd Statystyczny (inflacja, wynagrodzenia, dane gospodarcze)',
      'Zakład Ubezpieczeń Społecznych (składki, emerytury, waloryzacja)',
      'Ministerstwo Finansów i serwis obligacjeskarbowe.pl (obligacje, podatki)',
      'Komisja Nadzoru Finansowego (regulacje, ostrzeżenia)',
      'Eurostat oraz oficjalne dokumenty i ustawy (akty prawne, dane unijne)',
    ],
  },
  {
    title: '3. Jak weryfikujemy informacje',
    content: `Obowiązuje u nas jedna twarda zasada: dane finansowe weryfikujemy u źródła. Oprocentowanie konta sprawdzamy na oficjalnej stronie banku, stawki obligacji na stronie emitenta, limity podatkowe w aktualnych przepisach.

Wyliczenia w artykułach i kalkulatorach wykonujemy samodzielnie, na jawnych założeniach, które opisujemy przy każdym narzędziu. Jeśli prezentujemy symulację, zaznaczamy, że to projekcja na przyjętych założeniach, a nie gwarancja wyniku.`,
  },
  {
    title: '4. Aktualizacja treści',
    content: `Finanse się zmieniają, więc treści nie są pisane raz na zawsze. Przy każdym artykule widoczna jest data publikacji, a po aktualizacji - również data ostatniej zmiany.

Materiały zależne od bieżących danych (stopy, inflacja, stawki obligacji, limity) przeglądamy cyklicznie i odświeżamy liczby, gdy się zmienią. Jeśli artykuł opisuje stan na konkretny miesiąc, jest to wyraźnie napisane.`,
  },
  {
    title: '5. Niezależność i przejrzystość afiliacji',
    content: `Część serwisu utrzymuje się z afiliacji - gdy założysz produkt z naszego linku, możemy otrzymać wynagrodzenie. To nie wpływa na nasze oceny ani na kolejność w zestawieniach.`,
    list: [
      'Linki afiliacyjne oznaczamy technicznie atrybutem rel="sponsored"',
      'Rankingi opieramy na jawnych kryteriach, nie na wysokości prowizji',
      'Treść redakcyjna jest oddzielona od materiałów reklamowych',
      'Nie polecamy produktów, których sami nie uznalibyśmy za sensowne',
    ],
  },
  {
    title: '6. Charakter edukacyjny treści',
    content: `Wszystkie materiały mają charakter edukacyjny i informacyjny. Nie stanowią doradztwa inwestycyjnego, rekomendacji ani indywidualnej porady finansowej. Decyzje o swoich pieniądzach podejmujesz samodzielnie i na własną odpowiedzialność. Pełne zastrzeżenia znajdziesz w Disclaimerze.`,
  },
  {
    title: '7. Zgłaszanie błędów',
    content: `Jeśli znajdziesz w treści błąd - nieaktualną liczbę, pomyłkę faktograficzną, nieczytelny fragment - napisz do nas. Traktujemy takie zgłoszenia poważnie i poprawiamy treść, gdy uwaga jest zasadna. Rzetelność jest dla nas ważniejsza niż to, żeby mieć rację.`,
  },
];

export default function PolitykaRedakcyjna() {
  return (
    <>
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaPage) }} />
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '80px 24px 120px' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            letterSpacing: '4px', margin: '0 0 16px', color: 'var(--text)',
          }}>
            POLITYKA <span style={{ color: '#2e7d4f' }}>REDAKCYJNA</span>
          </h1>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)',
            display: 'flex', gap: 24, flexWrap: 'wrap',
          }}>
            <span>Serwis: KisielFinanse.pl</span>
            <span style={{ color: 'var(--border)' }}>|</span>
            <span>Ostatnia aktualizacja: {LAST_UPDATE}</span>
          </div>
        </div>

        {/* Intro box */}
        <div style={{
          background: 'rgba(46,125,79,0.06)', border: '1px solid rgba(46,125,79,0.2)',
          borderLeft: '3px solid #2e7d4f', padding: '16px 20px',
          fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text)',
          lineHeight: 1.8, marginBottom: 48,
        }}>
          Ta strona opisuje, jak powstają treści w KisielFinanse.pl: kto za nie odpowiada, skąd
          bierzemy dane, jak je weryfikujemy i jak oddzielamy materiały redakcyjne od afiliacyjnych.
          Wierzymy, że w finansach przejrzystość jest częścią rzetelności.
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {sections.map((s, i) => (
            <div key={i} style={{ borderTop: '1px solid var(--border)', paddingTop: 32 }}>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: '1.1rem',
                letterSpacing: '2px', color: 'var(--text)', margin: '0 0 16px',
              }}>
                {s.title}
              </h2>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                color: 'var(--muted)', lineHeight: 1.9, margin: '0 0 12px',
                whiteSpace: 'pre-line',
              }}>
                {s.content}
              </p>
              {s.list && (
                <ul style={{ margin: '12px 0', padding: 0 }}>
                  {s.list.map((item, j) => (
                    <li key={j} style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                      color: 'var(--muted)', lineHeight: 1.9, marginBottom: 4,
                      listStyleType: 'none', paddingLeft: 20, position: 'relative',
                    }}>
                      <span style={{ position: 'absolute', left: 0, color: '#2e7d4f' }}>→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Contact box */}
        <div style={{
          marginTop: 64, background: 'var(--surface)',
          border: '1px solid var(--border)', borderTop: '3px solid #2e7d4f',
          padding: '24px 28px',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
            color: 'var(--muted)', lineHeight: 1.8, margin: 0,
          }}>
            Masz pytanie o nasze zasady redakcyjne albo chcesz zgłosić błąd?<br />
            <a href="mailto:kisieltrade@gmail.com" style={{ color: '#2e7d4f', textDecoration: 'none' }}>
              kisieltrade@gmail.com
            </a>
          </p>
        </div>

        {/* Back link */}
        <div style={{ marginTop: 48 }}>
          <Link href="/" style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
            color: 'var(--muted)', textDecoration: 'none',
          }}>
            ← Powrót na stronę główną
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
