import type { Metadata } from 'next';
import Image from 'next/image';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import RevealOnScroll from '@/components/RevealOnScroll';
import MortgageCalculator from '@/components/MortgageCalculator';

const BASE_URL = 'https://kisielfinanse.pl';

export const metadata: Metadata = {
  title: { absolute: 'Kalkulator Hipoteczny 2026 - Oblicz Ratę Kredytu | KisielFinanse' },
  description:
    'Darmowy kalkulator hipoteczny online. Oblicz ratę kredytu, całkowity koszt i porównaj raty równe z malejącymi. Bez rejestracji.',
  keywords: [
    'kalkulator hipoteczny',
    'kalkulator kredytu hipotecznego',
    'kalkulator raty kredytu',
    'ile wyniesie rata kredytu hipotecznego',
    'raty równe czy malejące',
    'kalkulator raty hipotecznej',
    'kalkulator kredytu mieszkaniowego',
    'oblicz ratę kredytu',
    'kalkulator hipoteczny online',
  ],
  alternates: { canonical: `${BASE_URL}/kalkulator-hipoteczny` },
  openGraph: {
    title: 'Kalkulator Hipoteczny 2026 | KisielFinanse',
    description: 'Oblicz ratę kredytu hipotecznego. Raty równe vs malejące, wykres spłaty, całkowity koszt kredytu.',
    url: `${BASE_URL}/kalkulator-hipoteczny`,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Kalkulator Hipoteczny KisielFinanse' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kalkulator Hipoteczny | KisielFinanse',
    description: 'Oblicz ratę kredytu hipotecznego - raty równe vs malejące. Darmowy kalkulator online.',
    images: ['/og-image.png'],
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse',           item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Kalkulator hipoteczny',   item: `${BASE_URL}/kalkulator-hipoteczny` },
  ],
};

const schemaApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kalkulator Hipoteczny KisielFinanse',
  url: `${BASE_URL}/kalkulator-hipoteczny`,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  inLanguage: 'pl-PL',
  isAccessibleForFree: true,
  description:
    'Darmowy kalkulator hipoteczny: oblicz ratę miesięczną, całkowity koszt kredytu i porównaj raty równe z ratami malejącymi.',
  author: {
    '@type': 'Person',
    name: 'Mateusz Kisiel',
    url: `${BASE_URL}/o-mnie`,
  },
  publisher: {
    '@type': 'Organization',
    name: 'KisielFinanse',
    url: BASE_URL,
  },
  featureList: [
    'Obliczanie raty miesięcznej kredytu hipotecznego',
    'Porównanie rat równych i rat malejących',
    'Wykres spłaty zadłużenia w czasie',
    'Obliczanie całkowitego kosztu kredytu',
  ],
};

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Jak obliczyć ratę kredytu hipotecznego?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ratę kredytu hipotecznego oblicza się ze wzoru: M = P × [r(1+r)^n] / [(1+r)^n - 1], gdzie P to kwota kredytu, r to miesięczna stopa procentowa (oprocentowanie roczne podzielone przez 12), a n to liczba miesięcy. Nasz kalkulator hipoteczny wykonuje to obliczenie automatycznie.',
      },
    },
    {
      '@type': 'Question',
      name: 'Raty równe czy raty malejące - co wybrać?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Raty malejące są tańsze łącznie - płacisz mniej odsetek przez cały okres kredytowania. Raty równe mają niższą pierwszą ratę i są łatwiejsze w budżetowaniu. Wybór zależy od Twojej zdolności kredytowej i preferencji: jeśli możesz pozwolić sobie na wyższe raty na początku, raty malejące opłacają się bardziej.',
      },
    },
    {
      '@type': 'Question',
      name: 'Jakie jest aktualne oprocentowanie kredytu hipotecznego?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oprocentowanie kredytu hipotecznego w Polsce składa się ze stopy referencyjnej (WIBOR lub WIRON) plus marży banku. W 2026 roku typowe oprocentowanie wynosi 7–8%. Przy stopie NBP 5,75% i typowej marży 2,0–2,5%, całkowite oprocentowanie oscyluje wokół 7,5–8% w zależności od banku i profilu kredytobiorcy.',
      },
    },
    {
      '@type': 'Question',
      name: 'Na ile lat można wziąć kredyt hipoteczny w Polsce?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Maksymalny okres kredytu hipotecznego w Polsce to 35 lat. Rekomendacje KNF wskazują, żeby nie przekraczać 25 lat - przy dłuższym okresie rata jest niższa, ale łączny koszt odsetek znacznie wyższy. Większość banków wymaga też, żeby kredyt zakończył się przed 70–75 rokiem życia kredytobiorcy.',
      },
    },
    {
      '@type': 'Question',
      name: 'Co wchodzi w całkowity koszt kredytu hipotecznego?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Całkowity koszt kredytu to suma: raty kapitałowo-odsetkowe przez cały okres + prowizja bankowa (zwykle 0–2% kwoty) + ubezpieczenie nieruchomości + ubezpieczenie na życie (często wymagane) + opłata za wycenę nieruchomości + koszty notarialne. Nasz kalkulator hipoteczny pokazuje wyłącznie raty kapitałowo-odsetkowe.',
      },
    },
  ],
};

export default function KalkulatorHipotecznyPage() {
  return (
    <>
      <RevealOnScroll />
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }}
      />

      <main style={{ paddingTop: '80px' }}>

        {/* ── Hero z zdjęciem domu ─────────────────────────────── */}
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: 320 }}>
          <Image
            src="/images/kalkulator-hipoteczny/dom.png"
            alt="Dom - kalkulator hipoteczny"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 60%' }}
          />
          {/* Gradient overlay - ciemny po lewej, lekki po prawej */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(8,12,18,0.92) 0%, rgba(8,12,18,0.7) 55%, rgba(8,12,18,0.25) 100%)',
          }} />

          {/* Treść na zdjęciu */}
          <div style={{
            position: 'relative', zIndex: 1,
            maxWidth: 900, margin: '0 auto',
            padding: '32px 24px 48px',
          }}>
            <Breadcrumbs items={[
              { label: 'KisielFinanse', href: '/' },
              { label: 'Kalkulator hipoteczny' },
            ]} />

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              letterSpacing: '4px',
              marginBottom: 14,
              lineHeight: 1.05,
            }}>
              KALKULATOR<br />
              <span style={{ color: '#c9a227' }}>HIPOTECZNY</span>
            </h1>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--muted)',
              fontWeight: 700,
              lineHeight: 1.8,
              maxWidth: 480,
              margin: 0,
            }}>
              Oblicz ratę miesięczną, całkowity koszt i porównaj
              raty równe z malejącymi. Bez rejestracji, bez reklam.
            </p>
          </div>
        </div>

        <MortgageCalculator />

        {/* Sekcja FAQ - widoczna dla użytkowników */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 48 }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              letterSpacing: '3px',
              marginBottom: 32,
              color: 'var(--text)',
            }}>
              CZĘSTO <span style={{ color: '#c9a227' }}>PYTANE</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                {
                  q: 'Raty równe czy raty malejące - co wybrać?',
                  a: 'Raty malejące są tańsze łącznie - płacisz mniej odsetek przez cały okres kredytowania. Raty równe mają niższą pierwszą ratę i są wygodniejsze w budżetowaniu. Jeśli możesz pozwolić sobie na wyższe raty na początku - raty malejące się bardziej opłacają. Kalkulator wyżej pokazuje ile dokładnie zaoszczędzisz.',
                },
                {
                  q: 'Jakie jest aktualne oprocentowanie kredytu hipotecznego?',
                  a: 'Oprocentowanie = stopa referencyjna (WIBOR/WIRON) + marża banku. W 2026 roku typowo 7–8%. Wpisz aktualne oprocentowanie z oferty Twojego banku - kalkulator przeliczy ratę na bieżąco.',
                },
                {
                  q: 'Na ile lat można wziąć kredyt hipoteczny?',
                  a: 'Maksymalny okres to 35 lat. Rekomendacje KNF: nie przekraczaj 25 lat. Dłuższy okres = niższa rata, ale znacznie wyższy łączny koszt odsetek. Większość banków wymaga też, żeby kredyt zakończył się przed 70–75 rokiem życia kredytobiorcy.',
                },
                {
                  q: 'Co nie jest uwzględnione w tym kalkulatorze?',
                  a: 'Kalkulator pokazuje wyłącznie ratę kapitałowo-odsetkową przy stałym oprocentowaniu. Nie uwzględnia: prowizji bankowej (0–2%), ubezpieczenia nieruchomości, ubezpieczenia na życie, wyceny nieruchomości, kosztów notarialnych ani zmienności stóp procentowych (WIBOR/WIRON). Całkowity koszt kredytu będzie wyższy.',
                },
                {
                  q: 'Jak zmiana stóp procentowych wpływa na ratę?',
                  a: 'Przy kredycie ze zmiennym oprocentowaniem (WIBOR/WIRON), każda zmiana stóp NBP przekłada się na zmianę Twojej raty. Obniżka stóp o 1% przy kredycie 400 000 zł na 25 lat to ok. 200 zł mniej raty miesięcznie. Zmień oprocentowanie w kalkulatorze, żeby zobaczyć jak wygląda Twoja rata przy różnych scenariuszach.',
                },
              ].map((item, i) => (
                <div key={i} style={{
                  borderBottom: '1px solid var(--border)',
                  padding: '20px 0',
                }}>
                  <h3 style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: 10,
                  }}>
                    {item.q}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    color: 'var(--muted)',
                    lineHeight: 1.8,
                    margin: 0,
                    fontWeight: 700,
                  }}>
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Link do pozostałych kalkulatorów */}
          <div style={{
            marginTop: 48,
            padding: '20px 24px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}>
            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text)', fontWeight: 600, marginBottom: 4 }}>
                Więcej kalkulatorów finansowych
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 700, margin: 0 }}>
                Procent składany · Risk/Reward · FIRE · ETF vs Lokata
              </p>
            </div>
            <a
              href="/kalkulator"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 6,
                border: '1px solid rgba(201,162,39,0.3)',
                color: '#c9a227', fontFamily: 'var(--font-body)',
                fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none',
              }}
            >
              Kalkulator finansowy →
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
