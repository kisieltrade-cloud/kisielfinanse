import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Polityka Prywatności',
  description: 'Polityka prywatności serwisu NysethTrading.pl — informacje o przetwarzaniu danych osobowych.',
  robots: { index: true, follow: true },
};

const LAST_UPDATE = '03.03.2026';

const sections = [
  {
    title: '1. Administrator danych',
    content: `Administratorem danych osobowych zbieranych za pośrednictwem serwisu nysethtrading.pl jest osoba fizyczna prowadząca serwis pod nazwą NysethTrading (imię i nazwisko dostępne na żądanie), adres e-mail: nysethtrading@gmail.com.`,
  },
  {
    title: '2. Jakie dane zbieramy',
    content: `Serwis może zbierać następujące dane:`,
    list: [
      'Adres e-mail — wyłącznie w przypadku dobrowolnego zapisu do newslettera',
      'Dane analityczne — anonimowe dane o ruchu na stronie (liczba odwiedzin, źródła ruchu, przeglądane podstrony) zbierane przez Google Analytics',
      'Dane techniczne — adres IP, typ przeglądarki, system operacyjny — przetwarzane automatycznie przez serwery hostingowe',
    ],
  },
  {
    title: '3. Cel i podstawa przetwarzania danych',
    content: `Dane przetwarzane są w następujących celach:`,
    list: [
      'Wysyłka newslettera — na podstawie wyrażonej zgody (art. 6 ust. 1 lit. a RODO)',
      'Analiza ruchu i optymalizacja serwisu — na podstawie prawnie uzasadnionego interesu administratora (art. 6 ust. 1 lit. f RODO)',
      'Obsługa zapytań kontaktowych — na podstawie prawnie uzasadnionego interesu administratora',
    ],
  },
  {
    title: '4. Newsletter',
    content: `Zapis do newslettera jest całkowicie dobrowolny. Podając adres e-mail, wyrażasz zgodę na otrzymywanie wiadomości dotyczących wyników tradingowych, analiz rynkowych i treści edukacyjnych. Zgodę możesz wycofać w dowolnym momencie, klikając link rezygnacji zawarty w każdej wiadomości lub pisząc na adres nysethtrading@gmail.com. Wycofanie zgody nie wpływa na zgodność z prawem przetwarzania dokonanego przed jej wycofaniem.`,
  },
  {
    title: '5. Pliki cookies',
    content: `Serwis korzysta z plików cookies (ciasteczka) — małych plików tekstowych zapisywanych na Twoim urządzeniu. Cookies używane są do:`,
    list: [
      'Zapewnienia prawidłowego działania serwisu (cookies niezbędne)',
      'Analizy ruchu i statystyk (cookies analityczne — Google Analytics)',
      'Zapamiętywania preferencji użytkownika',
    ],
    extra: 'Możesz zarządzać plikami cookies w ustawieniach swojej przeglądarki. Wyłączenie cookies analitycznych nie wpłynie na działanie serwisu.',
  },
  {
    title: '6. Google Analytics',
    content: `Serwis korzysta z Google Analytics — usługi analizy oglądalności świadczonej przez Google LLC. Google Analytics używa plików cookies do analizy korzystania z serwisu. Dane generowane przez cookies (w tym adres IP) są przekazywane do serwerów Google. Korzystamy z funkcji anonimizacji IP — ostatni oktet adresu IP jest usuwany przed przekazaniem danych. Więcej informacji: https://policies.google.com/privacy`,
  },
  {
    title: '7. Okres przechowywania danych',
    content: `Dane przechowywane są przez następujące okresy:`,
    list: [
      'Adresy e-mail (newsletter) — do momentu wypisania się z newslettera',
      'Dane analityczne Google Analytics — 26 miesięcy (domyślne ustawienie)',
      'Dane kontaktowe — przez czas niezbędny do obsługi zapytania, nie dłużej niż 3 lata',
    ],
  },
  {
    title: '8. Twoje prawa',
    content: `Zgodnie z RODO przysługują Ci następujące prawa:`,
    list: [
      'Prawo dostępu do danych — możesz zażądać informacji o przetwarzanych danych',
      'Prawo do sprostowania — możesz żądać poprawienia nieprawidłowych danych',
      'Prawo do usunięcia — możesz żądać usunięcia danych ("prawo do bycia zapomnianym")',
      'Prawo do ograniczenia przetwarzania — możesz żądać ograniczenia przetwarzania danych',
      'Prawo do przenoszenia danych — możesz otrzymać dane w ustrukturyzowanym formacie',
      'Prawo do sprzeciwu — możesz sprzeciwić się przetwarzaniu danych opartemu na prawnie uzasadnionym interesie',
      'Prawo do cofnięcia zgody — w zakresie danych przetwarzanych na podstawie zgody',
    ],
    extra: 'Aby skorzystać z powyższych praw, skontaktuj się pod adresem: nysethtrading@gmail.com. Masz również prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (UODO), ul. Stawki 2, 00-193 Warszawa.',
  },
  {
    title: '9. Bezpieczeństwo danych',
    content: `Stosujemy odpowiednie środki techniczne i organizacyjne w celu ochrony danych przed nieuprawnionym dostępem, utratą lub zniszczeniem. Serwis korzysta z protokołu HTTPS (szyfrowane połączenie SSL/TLS).`,
  },
  {
    title: '10. Linki do zewnętrznych serwisów',
    content: `Serwis może zawierać linki do zewnętrznych stron internetowych. Niniejsza polityka prywatności dotyczy wyłącznie serwisu nysethtrading.pl. Administrator nie ponosi odpowiedzialności za polityki prywatności innych serwisów.`,
  },
  {
    title: '11. Zmiany polityki prywatności',
    content: `Administrator zastrzega sobie prawo do zmiany niniejszej polityki prywatności. O istotnych zmianach użytkownicy zapisani do newslettera zostaną powiadomieni drogą e-mail. Aktualna wersja polityki jest zawsze dostępna pod adresem nysethtrading.pl/polityka-prywatnosci.`,
  },
];

export default function PolitykaPrywatnosci() {
  return (
    <>
      <Nav />
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '80px 24px 120px' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
            color: 'var(--cyan)', letterSpacing: '3px', marginBottom: 12,
          }}>
            // dokument prawny
          </div>
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
            <span>Serwis: nysethtrading.pl</span>
            <span style={{ color: 'var(--border)' }}>|</span>
            <span>Ostatnia aktualizacja: {LAST_UPDATE}</span>
          </div>
        </div>

        {/* Intro */}
        <div style={{
          background: 'rgba(0,245,212,0.04)', border: '1px solid rgba(0,245,212,0.12)',
          borderLeft: '3px solid var(--cyan)', padding: '16px 20px',
          fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)',
          lineHeight: 1.8, marginBottom: 48,
        }}>
          Niniejsza polityka prywatności określa zasady przetwarzania i ochrony danych osobowych
          użytkowników serwisu nysethtrading.pl. Dokument sporządzono zgodnie z Rozporządzeniem
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
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
            color: 'var(--cyan)', letterSpacing: '3px', marginBottom: 12,
          }}>
            // kontakt w sprawach danych osobowych
          </div>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
            color: 'var(--muted)', lineHeight: 1.8, margin: 0,
          }}>
            W sprawach związanych z przetwarzaniem danych osobowych skontaktuj się:<br />
            <a href="mailto:nysethtrading@gmail.com" style={{ color: 'var(--cyan)', textDecoration: 'none' }}>
              nysethtrading@gmail.com
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
