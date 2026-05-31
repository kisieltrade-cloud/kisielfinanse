import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: { absolute: 'Regulamin | KisielFinanse' },
  description: 'Regulamin serwisu KisielFinanse.pl - zasady korzystania z serwisu, zakres usług świadczonych drogą elektroniczną, newsletter, komentarze i prawa użytkownika.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://kisielfinanse.pl/regulamin' },
  openGraph: {
    title: 'Regulamin | KisielFinanse',
    description: 'Zasady korzystania z serwisu KisielFinanse.pl i świadczenia usług drogą elektroniczną.',
    url: 'https://kisielfinanse.pl/regulamin',
    siteName: 'KisielFinanse',
  },
  twitter: {
    card: 'summary',
    title: 'Regulamin | KisielFinanse',
    description: 'Zasady korzystania z serwisu KisielFinanse.pl i świadczenia usług drogą elektroniczną.',
  },
};

const LAST_UPDATE = '31.05.2026';

const sections = [
  {
    title: '1. Postanowienia ogólne',
    content: `Niniejszy regulamin określa zasady korzystania z serwisu internetowego dostępnego pod adresem KisielFinanse.pl oraz zasady świadczenia usług drogą elektroniczną, zgodnie z ustawą z dnia 18 lipca 2002 r. o świadczeniu usług drogą elektroniczną. Użyte w regulaminie pojęcia oznaczają:`,
    list: [
      'Usługodawca - Mateusz Kisielewicz, osoba fizyczna prowadząca serwis pod nazwą KisielFinanse, adres e-mail: kisieltrade@gmail.com',
      'Serwis - strona internetowa dostępna pod adresem KisielFinanse.pl wraz ze wszystkimi podstronami',
      'Użytkownik - każda osoba korzystająca z Serwisu',
      'Konsument - Użytkownik będący osobą fizyczną, dokonujący czynności niezwiązanej bezpośrednio z jego działalnością gospodarczą lub zawodową',
      'Newsletter - usługa polegająca na przesyłaniu drogą elektroniczną informacji na podany przez Użytkownika adres e-mail',
      'Usługi - usługi świadczone drogą elektroniczną opisane w niniejszym regulaminie',
    ],
    extra: 'Rozpoczęcie korzystania z Serwisu oznacza akceptację niniejszego regulaminu. Regulamin jest udostępniany nieodpłatnie i w formie umożliwiającej jego pobranie, utrwalenie i wydrukowanie. Zakazane jest dostarczanie przez Użytkownika treści o charakterze bezprawnym.',
  },
  {
    title: '2. Rodzaj i zakres usług',
    content: `Usługodawca świadczy za pośrednictwem Serwisu następujące usługi nieodpłatne:`,
    list: [
      'Dostęp do treści - artykuły, poradniki, analizy i materiały edukacyjne z zakresu finansów, inwestowania, tradingu i gospodarki',
      'Newsletter - cykliczne przesyłanie informacji na podany przez Użytkownika adres e-mail',
      'Komentarze - możliwość dodawania komentarzy pod treściami za pośrednictwem zewnętrznego systemu Giscus opartego o GitHub Discussions',
      'Kalkulatory i quizy - interaktywne narzędzia obliczeniowe i edukacyjne dostępne w Serwisie',
    ],
    extra: 'Wszystkie usługi świadczone są nieodpłatnie. Usługodawca nie pobiera opłat za dostęp do treści Serwisu ani za korzystanie z dostępnych narzędzi. Umowa o świadczenie usługi dostępu do treści zawierana jest na czas oznaczony z chwilą wejścia do Serwisu i ulega rozwiązaniu z chwilą jego opuszczenia. Umowa o świadczenie usługi newslettera zawierana jest z chwilą zapisu i może zostać rozwiązana w każdej chwili poprzez rezygnację. Korzystanie z usług jest dobrowolne.',
  },
  {
    title: '3. Warunki techniczne korzystania z Serwisu',
    content: `Do prawidłowego korzystania z Serwisu niezbędne jest:`,
    list: [
      'Urządzenie z dostępem do sieci internet',
      'Aktualna przeglądarka internetowa z obsługą języka JavaScript i plików cookies',
      'W przypadku newslettera - aktywne konto poczty elektronicznej',
      'W przypadku komentarzy - aktywne konto w serwisie GitHub',
    ],
    extra: 'W zakresie dozwolonym przez obowiązujące przepisy prawa Usługodawca nie ponosi odpowiedzialności za problemy techniczne lub ograniczenia sprzętowe i programowe po stronie Użytkownika, które uniemożliwiają korzystanie z Serwisu. Korzystanie z sieci internet wiąże się z typowymi zagrożeniami (np. złośliwe oprogramowanie, próby nieuprawnionego dostępu do danych), dlatego zaleca się stosowanie aktualnego oprogramowania zabezpieczającego.',
  },
  {
    title: '4. Newsletter',
    content: `Usługa newslettera polega na przesyłaniu na wskazany przez Użytkownika adres e-mail informacji o nowych treściach, materiałach edukacyjnych oraz informacji od Usługodawcy.`,
    list: [
      'Zapis na newsletter jest dobrowolny i wymaga podania adresu e-mail; dokonanie zapisu jest równoznaczne z wyrażeniem zgody na otrzymywanie informacji drogą elektroniczną',
      'Użytkownik może w każdej chwili i bez podania przyczyny zrezygnować z newslettera, odpowiadając na otrzymaną wiadomość e-mail lub kontaktując się z Usługodawcą pod adresem kisieltrade@gmail.com',
      'Rezygnacja z newslettera jest równoznaczna z rozwiązaniem umowy o świadczenie tej usługi',
    ],
    extra: 'Zasady przetwarzania danych osobowych w związku z usługą newslettera określa Polityka Prywatności dostępna w Serwisie.',
  },
  {
    title: '5. Komentarze i treści Użytkowników',
    content: `Użytkownik korzystający z funkcji komentarzy zobowiązany jest do korzystania z Serwisu w sposób zgodny z prawem i dobrymi obyczajami, a w szczególności do:`,
    list: [
      'Niezamieszczania treści bezprawnych, obraźliwych, wulgarnych, naruszających dobra osobiste lub prawa osób trzecich',
      'Niezamieszczania niezamówionych treści reklamowych (spamu) ani złośliwego oprogramowania',
      'Poszanowania praw autorskich oraz obowiązujących przepisów prawa',
    ],
    extra: 'Usługodawca zastrzega sobie prawo do usuwania komentarzy naruszających regulamin lub przepisy prawa. Komentarze obsługiwane są przez zewnętrzny system Giscus oparty o GitHub Discussions i podlegają również regulaminom oraz politykom prywatności tych usług.',
  },
  {
    title: '6. Charakter treści i wyłączenie odpowiedzialności',
    content: `Treści publikowane w Serwisie mają wyłącznie charakter informacyjny i edukacyjny.`,
    list: [
      'Treści nie stanowią rekomendacji inwestycyjnej, porady inwestycyjnej, prawnej ani podatkowej w rozumieniu obowiązujących przepisów',
      'Treści nie stanowią doradztwa inwestycyjnego ani oferty w rozumieniu Kodeksu cywilnego',
      'Decyzje inwestycyjne Użytkownik podejmuje samodzielnie, na własną odpowiedzialność i ryzyko',
      'Inwestowanie oraz trading wiążą się z ryzykiem utraty części lub całości zainwestowanego kapitału',
    ],
    extra: 'Szczegółowe zastrzeżenia zawiera dokument Disclaimer dostępny w Serwisie. W zakresie dozwolonym przez obowiązujące przepisy prawa Usługodawca nie ponosi odpowiedzialności za skutki decyzji podjętych przez Użytkownika na podstawie treści zamieszczonych w Serwisie. Powyższe nie wyłącza ani nie ogranicza odpowiedzialności Usługodawcy wobec Konsumenta w zakresie, w jakim jej wyłączenie lub ograniczenie jest niedopuszczalne na mocy bezwzględnie obowiązujących przepisów prawa.',
  },
  {
    title: '7. Prawa autorskie i własność intelektualna',
    content: `Wszelkie treści zamieszczone w Serwisie (w szczególności teksty, grafiki, materiały, układ i kompozycja stron) stanowią własność Usługodawcy lub są wykorzystywane na podstawie odpowiednich licencji i podlegają ochronie prawnej.`,
    extra: 'Kopiowanie, rozpowszechnianie lub wykorzystywanie treści w całości lub w części bez zgody Usługodawcy jest zabronione, z wyjątkiem dozwolonego użytku osobistego oraz cytowania z podaniem źródła, zgodnie z przepisami ustawy o prawie autorskim i prawach pokrewnych.',
  },
  {
    title: '8. Reklamacje',
    content: `Użytkownik ma prawo do składania reklamacji dotyczących funkcjonowania Serwisu oraz świadczonych usług.`,
    list: [
      'Reklamacje należy zgłaszać na adres e-mail: kisieltrade@gmail.com',
      'Reklamacja powinna zawierać opis problemu oraz dane kontaktowe umożliwiające udzielenie odpowiedzi',
      'Usługodawca rozpatruje reklamacje w terminie do 14 dni od daty ich otrzymania, a odpowiedź przekazuje na adres e-mail Użytkownika',
    ],
  },
  {
    title: '9. Dane osobowe',
    content: `Zasady przetwarzania danych osobowych Użytkowników, w tym informacje o celach, podstawach prawnych, okresie przechowywania oraz prawach przysługujących osobom, których dane dotyczą, określa Polityka Prywatności dostępna w Serwisie, sporządzona zgodnie z RODO.`,
  },
  {
    title: '10. Pozasądowe rozwiązywanie sporów',
    content: `Użytkownik będący konsumentem ma możliwość skorzystania z pozasądowych sposobów rozpatrywania reklamacji i dochodzenia roszczeń.`,
    extra: 'Informacje o pozasądowych sposobach rozwiązywania sporów dostępne są m.in. u powiatowych (miejskich) rzeczników konsumentów oraz na stronie Urzędu Ochrony Konkurencji i Konsumentów (uokik.gov.pl). Skorzystanie z tych metod ma charakter dobrowolny i wymaga zgody obu stron.',
  },
  {
    title: '11. Postanowienia końcowe',
    content: `W zakresie funkcjonowania Serwisu obowiązują następujące zasady końcowe:`,
    list: [
      'Usługodawca zastrzega sobie prawo do zmiany regulaminu z ważnych przyczyn, w szczególności zmiany przepisów prawa lub zakresu świadczonych usług',
      'O zmianie regulaminu Użytkownicy korzystający z usługi newslettera zostaną poinformowani drogą elektroniczną; zmiana wchodzi w życie po upływie wskazanego terminu, a dalsze korzystanie z usługi po tym terminie oznacza jej akceptację',
      'Aktualna wersja regulaminu jest zawsze dostępna pod adresem KisielFinanse.pl/regulamin',
      'Postanowienia niniejszego regulaminu nie wyłączają ani nie ograniczają praw Konsumenta wynikających z bezwzględnie obowiązujących przepisów prawa',
      'W sprawach nieuregulowanych w niniejszym regulaminie zastosowanie mają przepisy prawa polskiego, w szczególności Kodeksu cywilnego, ustawy o świadczeniu usług drogą elektroniczną oraz ustawy o prawach konsumenta',
    ],
    extra: 'Regulamin obowiązuje od daty ostatniej aktualizacji wskazanej na górze dokumentu.',
  },
];

export default function Regulamin() {
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
            REGULAMIN <span style={{ color: 'var(--cyan)' }}>SERWISU</span>
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
          Niniejszy regulamin określa zasady korzystania z serwisu KisielFinanse.pl oraz warunki
          świadczenia usług drogą elektroniczną. Dokument sporządzono zgodnie z ustawą z dnia
          18 lipca 2002 r. o świadczeniu usług drogą elektroniczną oraz innymi obowiązującymi
          przepisami prawa polskiego.
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
            Kontakt w sprawach regulaminu
          </div>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
            color: 'var(--muted)', lineHeight: 1.8, margin: 0,
          }}>
            W sprawach związanych z regulaminem i funkcjonowaniem Serwisu skontaktuj się:<br />
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
