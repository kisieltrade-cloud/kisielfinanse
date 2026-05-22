import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Polityka Prywatności | KisielFinanse',
  description: 'Polityka prywatności serwisu KisielFinanse.pl — informacje o przetwarzaniu danych osobowych, plikach cookies i prawach użytkownika zgodnie z RODO.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://kisielfinanse.pl/polityka-prywatnosci' },
  openGraph: {
    title: 'Polityka Prywatności | KisielFinanse',
    description: 'Informacje o przetwarzaniu danych osobowych, plikach cookies i prawach użytkownika zgodnie z RODO.',
    url: 'https://kisielfinanse.pl/polityka-prywatnosci',
    siteName: 'KisielFinanse',
  },
  twitter: {
    card: 'summary',
    title: 'Polityka Prywatności | KisielFinanse',
    description: 'Informacje o przetwarzaniu danych osobowych i plikach cookies (RODO).',
  },
};

const LAST_UPDATE = '21.05.2026';

const sections = [
  {
    title: '1. Administrator danych',
    content: `Administratorem danych osobowych zbieranych za pośrednictwem serwisu KisielFinanse.pl jest osoba fizyczna prowadząca serwis pod nazwą KisielFinanse (imię i nazwisko dostępne na żądanie), adres e-mail: kisieltrade@gmail.com.`,
  },
  {
    title: '2. Jakie dane zbieramy',
    content: `Serwis może zbierać następujące dane:`,
    list: [
      'Dane analityczne - anonimowe dane o ruchu na stronie (liczba odwiedzin, źródła ruchu, przeglądane podstrony)',
      'Dane techniczne - adres IP, typ przeglądarki, system operacyjny - przetwarzane automatycznie przez serwery hostingowe',
      'Dane kontaktowe - adres e-mail wyłącznie w przypadku dobrowolnego kontaktu z administratorem',
    ],
  },
  {
    title: '3. Cel i podstawa przetwarzania danych',
    content: `Dane przetwarzane są w następujących celach:`,
    list: [
      'Analiza ruchu i optymalizacja serwisu - na podstawie prawnie uzasadnionego interesu administratora (art. 6 ust. 1 lit. f RODO)',
      'Obsługa zapytań kontaktowych - na podstawie prawnie uzasadnionego interesu administratora',
    ],
  },
  {
    title: '4. Odbiorcy danych',
    content: `Dane osobowe mogą być przekazywane następującym kategoriom odbiorców:`,
    list: [
      'Dostawcy usług hostingowych — przetwarzający dane w imieniu administratora na podstawie umowy powierzenia',
      'Dostawcy narzędzi analitycznych (np. Google LLC) — wyłącznie w przypadku ich wdrożenia i po uzyskaniu zgody użytkownika',
      'Organy publiczne — wyłącznie gdy obowiązek przekazania danych wynika z przepisów prawa',
    ],
    extra: 'Administrator nie sprzedaje danych osobowych podmiotom trzecim ani nie udostępnia ich w celach marketingowych bez zgody użytkownika.',
  },
  {
    title: '5. Pliki cookies',
    content: `Serwis korzysta z plików cookies (ciasteczka) - małych plików tekstowych zapisywanych na Twoim urządzeniu. Cookies używane są do:`,
    list: [
      'Zapewnienia prawidłowego działania serwisu (cookies niezbędne)',
      'Analizy ruchu i statystyk (cookies analityczne - Google Analytics)',
      'Zapamiętywania preferencji użytkownika',
    ],
    extra: 'Możesz zarządzać plikami cookies w ustawieniach swojej przeglądarki. Wyłączenie cookies analitycznych nie wpłynie na działanie serwisu.',
  },
  {
    title: '6. Narzędzia analityczne',
    content: `Serwis może korzystać z narzędzi analitycznych stron trzecich (np. Google Analytics) w celu analizy ruchu i optymalizacji treści. W przypadku wdrożenia takich narzędzi, dane o korzystaniu z serwisu (w tym zanonimizowany adres IP) mogą być przekazywane do dostawców tych usług. Użytkownicy zostaną poinformowani o wdrożeniu konkretnych narzędzi poprzez aktualizację niniejszej polityki. Możesz zarządzać ustawieniami cookies w swojej przeglądarce, aby ograniczyć zbieranie danych analitycznych.`,
  },
  {
    title: '7. Okres przechowywania danych',
    content: `Dane przechowywane są przez następujące okresy:`,
    list: [
      'Dane analityczne - zgodnie z ustawieniami wdrożonego narzędzia analitycznego',
      'Dane kontaktowe (e-mail) - przez czas niezbędny do obsługi zapytania, nie dłużej niż 3 lata',
    ],
  },
  {
    title: '8. Twoje prawa',
    content: `Zgodnie z RODO przysługują Ci następujące prawa:`,
    list: [
      'Prawo dostępu do danych - możesz zażądać informacji o przetwarzanych danych',
      'Prawo do sprostowania - możesz żądać poprawienia nieprawidłowych danych',
      'Prawo do usunięcia - możesz żądać usunięcia danych ("prawo do bycia zapomnianym")',
      'Prawo do ograniczenia przetwarzania - możesz żądać ograniczenia przetwarzania danych',
      'Prawo do przenoszenia danych - możesz otrzymać dane w ustrukturyzowanym formacie',
      'Prawo do sprzeciwu - możesz sprzeciwić się przetwarzaniu danych opartemu na prawnie uzasadnionym interesie',
      'Prawo do cofnięcia zgody - w zakresie danych przetwarzanych na podstawie zgody',
    ],
    extra: 'Aby skorzystać z powyższych praw, skontaktuj się pod adresem: kisieltrade@gmail.com. Masz również prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (UODO), ul. Stawki 2, 00-193 Warszawa.',
  },
  {
    title: '9. Bezpieczeństwo danych',
    content: `Stosujemy odpowiednie środki techniczne i organizacyjne w celu ochrony danych przed nieuprawnionym dostępem, utratą lub zniszczeniem. Serwis korzysta z protokołu HTTPS (szyfrowane połączenie SSL/TLS).`,
  },
  {
    title: '10. Linki do zewnętrznych serwisów',
    content: `Serwis może zawierać linki do zewnętrznych stron internetowych. Niniejsza polityka prywatności dotyczy wyłącznie serwisu KisielFinanse.pl. Administrator nie ponosi odpowiedzialności za polityki prywatności innych serwisów.`,
  },
  {
    title: '11. Zmiany polityki prywatności',
    content: `Administrator zastrzega sobie prawo do zmiany niniejszej polityki prywatności. Aktualna wersja polityki jest zawsze dostępna pod adresem KisielFinanse.pl/polityka-prywatnosci. W przypadku istotnych zmian data ostatniej aktualizacji widoczna na górze dokumentu zostanie zaktualizowana.`,
  },
];

export default function PolitykaPrywatnosci() {
  return (
    <>
      <Nav />
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '80px 24px 120px' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            letterSpacing: '4px', margin: '0 0 16px', color: 'var(--text)',
          }}>
            POLITYKA <span style={{ color: 'var(--cyan)' }}>PRYWATNOŚCI</span>
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

        {/* Intro */}
        <div style={{
          background: 'rgba(201,162,39,0.04)', border: '1px solid rgba(201,162,39,0.12)',
          borderLeft: '3px solid var(--cyan)', padding: '16px 20px',
          fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)',
          lineHeight: 1.8, marginBottom: 48,
        }}>
          Niniejsza polityka prywatności określa zasady przetwarzania i ochrony danych osobowych
          użytkowników serwisu KisielFinanse.pl. Dokument sporządzono zgodnie z Rozporządzeniem
          Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. (RODO)
          oraz ustawą o świadczeniu usług drogą elektroniczną.
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {sections.map((s, i) => (
            <div key={i} style={{
              borderTop: '1px solid var(--border)', paddingTop: 32,
            }}>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: '1.1rem',
                letterSpacing: '2px', color: 'var(--text)', margin: '0 0 16px',
              }}>
                {s.title}
              </h2>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                color: 'var(--muted)', lineHeight: 1.9, margin: '0 0 12px',
              }}>
                {s.content}
              </p>
              {s.list && (
                <ul style={{ margin: '12px 0', padding: '0 0 0 20px' }}>
                  {s.list.map((item, j) => (
                    <li key={j} style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                      color: 'var(--muted)', lineHeight: 1.9, marginBottom: 4,
                      listStyleType: 'none', paddingLeft: 16, position: 'relative',
                    }}>
                      <span style={{
                        position: 'absolute', left: 0, color: 'var(--cyan)',
                      }}>→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {s.extra && (
                <p style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                  color: 'var(--muted)', lineHeight: 1.9, marginTop: 12,
                }}>
                  {s.extra}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Contact box */}
        <div style={{
          marginTop: 64, background: 'var(--surface)',
          border: '1px solid var(--border)', borderTop: '3px solid var(--cyan)',
          padding: '24px 28px',
        }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: '0.72rem',
            color: 'var(--muted)', fontWeight: 600, marginBottom: 10,
          }}>
            Kontakt w sprawach danych osobowych
          </div>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
            color: 'var(--muted)', lineHeight: 1.8, margin: 0,
          }}>
            W sprawach związanych z przetwarzaniem danych osobowych skontaktuj się:<br />
            <a href="mailto:kisieltrade@gmail.com" style={{ color: 'var(--cyan)', textDecoration: 'none' }}>
              kisieltrade@gmail.com
            </a>
          </p>
        </div>

        {/* Back link */}
        <div style={{ marginTop: 48 }}>
          <Link href="/" style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
            color: 'var(--muted)', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            ← Powrót do strony głównej
          </Link>
        </div>

      </main>
      <Footer />
    </>
  );
}
