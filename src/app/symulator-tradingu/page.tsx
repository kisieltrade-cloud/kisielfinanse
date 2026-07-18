import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import TradingSimulator from '@/components/TradingSimulator';
import NewsletterForm from '@/components/NewsletterForm';

const BASE_URL = 'https://kisielfinanse.pl';
const URL = `${BASE_URL}/symulator-tradingu`;

export const metadata: Metadata = {
  title: { absolute: 'Symulator tradingu - ćwicz na wykresie bez ryzyka' },
  description: 'Darmowy symulator tradingu w przeglądarce. Otwieraj pozycje long i short, ustawiaj stop loss i take profit, odsłaniaj świece i patrz, jak radzą sobie Twoje decyzje. Tryb wyzwania podsumowuje serię 10 transakcji: trafność, profit factor, seria strat. Ćwicz cały proces bez ryzykowania pieniędzy.',
  keywords: ['symulator tradingu', 'symulator giełdy', 'paper trading', 'trening tradera', 'ćwiczenie tradingu', 'stop loss take profit', 'gra tradingowa'],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Symulator tradingu - ćwicz na wykresie bez ryzyka | KisielFinanse',
    description: 'Long, short, zamknij pozycję i sprawdź wynik. Trenuj decyzje tradera na świecach, bez ryzykowania złotówki.',
    url: URL,
    type: 'website',
    locale: 'pl_PL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Symulator tradingu - ćwicz bez ryzyka | KisielFinanse',
    description: 'Otwieraj pozycje, odsłaniaj świece, patrz na wynik. Trening tradera w przeglądarce.',
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Symulator tradingu', item: URL },
  ],
};

const schemaApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Symulator tradingu KisielFinanse',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'PLN' },
  description: 'Symulator paper-trading do ćwiczenia decyzji tradingowych na wykresie świecowym, bez ryzykowania realnych pieniędzy.',
};

export default function SymulatorTradinguPage() {
  return (
    <div data-theme="dark" style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaApp) }} />

      <main style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '28px 24px 0' }}>
          <Breadcrumbs items={[
            { label: 'KisielFinanse', href: '/' },
            { label: 'Symulator tradingu' },
          ]} />

          <header style={{ margin: '20px 0 28px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--cyan)', margin: '0 0 14px', fontWeight: 600 }}>
              Trening · bez ryzyka
            </p>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.05, margin: '0 0 16px', fontWeight: 800 }}>
              Symulator tradingu
            </h1>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--muted)', margin: 0, maxWidth: 640 }}>
              Otwieraj pozycje long i short, odsłaniaj kolejne świece i patrz, jak radzą sobie Twoje decyzje.
              Cała mechanika prawdziwego tradingu, tylko bez ryzykowania złotówki. Idealne miejsce, żeby oswoić
              się z wchodzeniem z sygnałem i wychodzeniem z planem.
            </p>
          </header>
        </div>

        <div style={{ padding: '0 24px' }}>
          <TradingSimulator />
        </div>

        <section style={{ maxWidth: 820, margin: '0 auto', padding: '40px 24px 0' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 14px' }}>Jak z tego wycisnąć maksimum</h2>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--muted)', margin: '0 0 14px' }}>
            Symulator to sandbox: wykres jest generowany losowo, więc nie da się go &bdquo;wykuć na pamięć&rdquo;. Chodzi o proces, nie o wynik pojedynczej rundy.
            Zanim klikniesz long albo short, zadaj sobie pytanie, które zadaje sobie każdy trader: co widzę na wykresie i gdzie postawiłbym stop loss.
            Ucz się czytać ruch z <Link href="/trading/swiece-japonskie-jak-czytac-wykres" style={{ color: 'var(--cyan)' }}>świec japońskich</Link> i reagować na
            poziomach <Link href="/trading/wsparcie-i-opor-jak-wyznaczac-poziomy" style={{ color: 'var(--cyan)' }}>wsparcia i oporu</Link>.
          </p>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--muted)', margin: '0 0 14px' }}>
            Pojedyncza transakcja niczego nie dowodzi, bo o jej wyniku decyduje przypadek. Dlatego symulator ma tryb wyzwania:
            seria dziesięciu transakcji na kolejnych wykresach, po której dostajesz trafność, profit factor i najdłuższą serię strat.
            Dopiero taki zestaw pokazuje, czy zarabiasz systemem, czy jednym udanym wejściem. Seria kończy się wcześniej, gdy strata
            przekroczy 10% kapitału, tak samo jak limit obsunięcia w planie tradingowym.
          </p>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--muted)', margin: 0 }}>
            Gdy oswoisz decyzje, przenieś je do realnego planu. Zasady, według których ustawiasz tu stop lossa i take profit,
            spiszesz w <Link href="/kreator-planu-tradingowego" style={{ color: 'var(--cyan)' }}>kreatorze planu tradingowego</Link>.
            Pełna mapa nauki jest w przewodniku{' '}
            <Link href="/naucz-sie-tradowac" style={{ color: 'var(--cyan)' }}>naucz się tradować</Link>, a stosunek zysku do ryzyka policzysz w{' '}
            <Link href="/kalkulator/risk-reward" style={{ color: 'var(--cyan)' }}>kalkulatorze Risk/Reward</Link>.
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
