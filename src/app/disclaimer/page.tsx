import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Disclaimer - Zastrzeżenia Prawne | KisielFinanse',
  description: 'Zastrzeżenia prawne serwisu KisielFinanse.pl. Treści mają charakter wyłącznie edukacyjny i nie stanowią doradztwa inwestycyjnego. Trading wiąże się z ryzykiem.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://kisielfinanse.pl/disclaimer' },
  openGraph: {
    title: 'Disclaimer - Zastrzeżenia Prawne | KisielFinanse',
    description: 'Treści publikowane na stronie mają charakter wyłącznie edukacyjny i nie stanowią doradztwa inwestycyjnego.',
    url: 'https://kisielfinanse.pl/disclaimer',
    siteName: 'KisielFinanse',
  },
  twitter: {
    card: 'summary',
    title: 'Disclaimer | KisielFinanse',
    description: 'Zastrzeżenia prawne. Treści edukacyjne, nie doradztwo inwestycyjne.',
  },
};

const LAST_UPDATE = '03.03.2026';

const sections = [
  {
    title: '1. Charakter publikowanych treści',
    content: `Wszystkie treści publikowane w serwisie KisielFinanse.pl - w tym wyniki tradingowe, analizy rynkowe, opisy strategii, wpisy blogowe, komentarze tygodniowe oraz wszelkie inne materiały - mają charakter wyłącznie informacyjny i edukacyjny.

Żadna treść opublikowana w serwisie nie stanowi:`,
    list: [
      'doradztwa inwestycyjnego w rozumieniu ustawy z dnia 29 lipca 2005 r. o obrocie instrumentami finansowymi',
      'rekomendacji inwestycyjnej w rozumieniu Rozporządzenia MAR (Market Abuse Regulation)',
      'oferty, propozycji ani zachęty do zawarcia jakiejkolwiek transakcji finansowej',
      'gwarancji osiągnięcia zysków ani obietnicy określonych wyników inwestycyjnych',
      'usługi zarządzania aktywami ani usługi doradztwa finansowego',
    ],
  },
  {
    title: '2. Charakter treści edukacyjnych',
    content: `Materiały edukacyjne publikowane w serwisie - w tym analizy rynkowe, opisy strategii, wpisy blogowe oraz wszelkie inne treści - powstają na podstawie własnego doświadczenia autora i mają charakter wyłącznie poglądowy. Należy mieć na uwadze, że:`,
    list: [
      'Opisy strategii i analiz nie stanowią rekomendacji do ich stosowania',
      'Każda transakcja finansowa wiąże się z ryzykiem utraty części lub całości zainwestowanego kapitału',
      'Produkty lewarowane (forex, kontrakty CFD, futures) mogą prowadzić do strat przekraczających zainwestowany kapitał',
      'Skuteczność opisywanych metod może się różnić w zależności od indywidualnych warunków i umiejętności inwestora',
      'Na wyniki inwestycyjne wpływają czynniki takie jak: wielkość rachunku, dyscyplina, zarządzanie ryzykiem, warunki rynkowe oraz psychologia tradera',
    ],
  },
  {
    title: '3. Brak licencji doradcy inwestycyjnego',
    content: `Autor serwisu KisielFinanse.pl nie jest licencjonowanym doradcą inwestycyjnym, maklerem papierów wartościowych ani podmiotem uprawnionym do świadczenia usług doradztwa inwestycyjnego w rozumieniu przepisów prawa polskiego i europejskiego.

Serwis nie posiada zezwolenia Komisji Nadzoru Finansowego (KNF) na prowadzenie działalności w zakresie doradztwa inwestycyjnego ani zarządzania aktywami.`,
  },
  {
    title: '4. Indywidualna odpowiedzialność inwestora',
    content: `Każda decyzja inwestycyjna podejmowana przez użytkownika serwisu jest jego własną, suwerenną decyzją podjętą na jego własne ryzyko i odpowiedzialność. Przed podjęciem jakichkolwiek decyzji inwestycyjnych zalecamy:`,
    list: [
      'Samodzielną analizę rynku i instrumentów finansowych',
      'Konsultację z licencjonowanym doradcą inwestycyjnym',
      'Zapoznanie się z prospektami emisyjnymi i dokumentami KID (Key Information Document)',
      'Ocenę własnej sytuacji finansowej, celów inwestycyjnych i tolerancji na ryzyko',
      'Inwestowanie wyłącznie środków, których ewentualna utrata nie zagrozi Twojej sytuacji finansowej',
    ],
  },
  {
    title: '5. Ryzyko inwestycyjne',
    content: `Handel instrumentami finansowymi, w szczególności instrumentami pochodnymi (forex, CFD, futures, opcje), wiąże się z wysokim poziomem ryzyka. Statystyki branżowe wskazują, że znaczna większość inwestorów detalicznych traci pieniądze na tych instrumentach. Autor serwisu nie ponosi odpowiedzialności za straty finansowe wynikłe z decyzji inwestycyjnych podjętych przez użytkowników serwisu.`,
  },
  {
    title: '6. Linki afiliacyjne i współpraca',
    content: `Serwis może zawierać linki afiliacyjne do brokerów, platform tradingowych i innych usług finansowych. Oznacza to, że autor może otrzymać wynagrodzenie prowizyjne w przypadku skorzystania przez użytkownika z polecanych usług. Każdy taki link jest wyraźnie oznaczony jako link partnerski/afiliacyjny. Fakt otrzymywania wynagrodzenia prowizyjnego nie wpływa na rzetelność prezentowanych treści.`,
  },
  {
    title: '7. Dokładność informacji',
    content: `Autor dokłada starań, aby publikowane treści były rzetelne i aktualne. Jednakże:`,
    list: [
      'Informacje rynkowe mogą ulec dezaktualizacji - rynki finansowe zmieniają się w czasie rzeczywistym',
      'Autor nie gwarantuje kompletności, dokładności ani aktualności żadnej z publikowanych informacji',
      'Wszelkie błędy w prezentowanych danych zostaną poprawione niezwłocznie po ich wykryciu',
      'Autor nie ponosi odpowiedzialności za decyzje podjęte na podstawie nieaktualnych lub błędnych informacji',
    ],
  },
  {
    title: '8. Odbiorcy serwisu',
    content: `Treści publikowane w serwisie przeznaczone są wyłącznie dla pełnoletnich użytkowników z Polski i Unii Europejskiej, posiadających wiedzę na temat rynków finansowych i świadomych ryzyka z nimi związanego. Serwis nie jest skierowany do osób, którym przepisy prawa zabraniają dostępu do treści dotyczących instrumentów finansowych.`,
  },
  {
    title: '9. Podstawa prawna',
    content: `Niniejszy disclaimer sporządzono w oparciu o:`,
    list: [
      'Ustawa z dnia 29 lipca 2005 r. o obrocie instrumentami finansowymi (Dz.U. 2005 nr 183 poz. 1538)',
      'Ustawa z dnia 29 lipca 2005 r. o ofercie publicznej i warunkach wprowadzania instrumentów finansowych do zorganizowanego systemu obrotu (Dz.U. 2005 nr 184 poz. 1539)',
      'Rozporządzenie MAR (UE) nr 596/2014 w sprawie nadużyć na rynku',
      'Dyrektywa MiFID II (2014/65/UE) dotycząca rynków instrumentów finansowych',
    ],
  },
];

export default function Disclaimer() {
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
            DIS<span style={{ color: 'var(--pink)' }}>CLAIMER</span>
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

        {/* Warning box */}
        <div style={{
          background: 'rgba(255,45,120,0.06)', border: '1px solid rgba(255,45,120,0.2)',
          borderLeft: '3px solid var(--pink)', padding: '16px 20px',
          fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#e8a0b0',
          lineHeight: 1.8, marginBottom: 48,
        }}>
          ⚠ Wyniki historyczne nie gwarantują przyszłych zwrotów. Trading instrumentami finansowymi,
          w szczególności lewarowanymi (forex, CFD, futures), wiąże się z wysokim ryzykiem utraty
          kapitału. Treści publikowane w serwisie mają charakter wyłącznie edukacyjny i nie stanowią
          doradztwa inwestycyjnego ani rekomendacji inwestycyjnych.
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
                      <span style={{ position: 'absolute', left: 0, color: 'var(--pink)' }}>→</span>
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
          border: '1px solid var(--border)', borderTop: '3px solid var(--pink)',
          padding: '24px 28px',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
            color: 'var(--muted)', lineHeight: 1.8, margin: 0,
          }}>
            W przypadku pytań dotyczących niniejszego disclaimera skontaktuj się:<br />
            <a href="mailto:kisieltrade@gmail.com" style={{ color: 'var(--pink)', textDecoration: 'none' }}>
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
            ← Powrót do strony głównej
          </Link>
        </div>

      </main>
      <Footer />
    </>
  );
}
