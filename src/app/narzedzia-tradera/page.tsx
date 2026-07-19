import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import NewsletterForm from '@/components/NewsletterForm';

const BASE_URL = 'https://kisielfinanse.pl';
const URL = `${BASE_URL}/narzedzia-tradera`;

export const metadata: Metadata = {
  title: { absolute: 'Narzędzia tradera - symulator, kalkulatory, formacje' },
  description: 'Wszystkie narzędzia dla tradera w jednym miejscu: symulator tradingu, trener formacji, kreator planu tradingowego, encyklopedia formacji, kalkulator wielkości pozycji i Risk/Reward oraz dziennik transakcji. Za darmo, bez rejestracji.',
  keywords: ['narzędzia tradera', 'symulator tradingu', 'trener formacji', 'plan tradingowy', 'kalkulator wielkości pozycji', 'encyklopedia formacji', 'kalkulator risk reward', 'dziennik transakcji'],
  alternates: { canonical: URL },
  openGraph: {
    title: 'Narzędzia tradera | KisielFinanse',
    description: 'Symulator, encyklopedia formacji, kalkulatory ryzyka i dziennik transakcji. Wszystko w jednym miejscu.',
    url: URL,
    type: 'website',
    locale: 'pl_PL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Narzędzia tradera | KisielFinanse',
    description: 'Symulator, formacje, kalkulatory ryzyka i dziennik. Za darmo.',
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Narzędzia tradera', item: URL },
  ],
};

const TOOLS = [
  { href: '/symulator-tradingu', emoji: '🎮', name: 'Symulator tradingu', desc: 'Otwieraj pozycje long i short na wykresie, odsłaniaj świece i ćwicz decyzje bez ryzyka. Tryb wyzwania podsumowuje serię 10 transakcji: trafność, profit factor, seria strat.', tag: 'Ćwicz' },
  { href: '/formacje-tradingowe', emoji: '📊', name: 'Encyklopedia formacji', desc: '16 formacji świecowych i wykresu, każda narysowana i wyjaśniona: byczy czy niedźwiedzi, odwrócenie czy kontynuacja, jak grać.', tag: 'Referencja' },
  { href: '/trener-formacji', emoji: '🎯', name: 'Trener formacji', desc: 'Sprawdź, czy rozpoznasz formację na wykresie. Dziesięć pytań, dwa poziomy trudności, wyjaśnienie po każdej odpowiedzi.', tag: 'Ćwicz' },
  { href: '/kalkulator/wielkosc-pozycji', emoji: '📐', name: 'Kalkulator wielkości pozycji', desc: 'Kapitał + ryzyko% + stop loss → ile jednostek kupić, żeby ryzykować tylko 1-2% konta. Podstawa zarządzania ryzykiem.', tag: 'Licz' },
  { href: '/kreator-planu-tradingowego', emoji: '📋', name: 'Kreator planu tradingowego', desc: 'Pięć kroków i masz spisany plan: ryzyko na transakcję, warunki wejścia, stop loss i limity strat. Z policzonymi kwotami, do wydruku lub PDF.', tag: 'Zaplanuj' },
  { href: '/kalkulator/risk-reward', emoji: '⚖️', name: 'Kalkulator Risk/Reward', desc: 'Oceń, czy potencjalny zysk jest wart ryzykowanej kwoty, zanim wejdziesz w pozycję.', tag: 'Licz' },
  { href: '/dziennik-tradera', emoji: '📓', name: 'Dziennik tradera', desc: 'Zapisuj transakcje, a narzędzie policzy profit factor, średnie R, obsunięcie i pokaże osobno, ile zarabiają transakcje zgodne z planem, a ile te wbrew niemu.', tag: 'Analizuj' },
  { href: '/naucz-sie-tradowac', emoji: '🎓', name: 'Naucz się tradować', desc: 'Pełna mapa nauki od zera do pierwszego trade’a, quiz formacji i dziennik transakcji w Excelu do pobrania.', tag: 'Ucz się' },
];

export default function NarzedziaTraderaPage() {
  return (
    <div data-theme="dark" style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />

      <main style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 24px 0' }}>
          <Breadcrumbs items={[
            { label: 'KisielFinanse', href: '/' },
            { label: 'Narzędzia tradera' },
          ]} />

          <header style={{ margin: '20px 0 34px', maxWidth: 680 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--cyan)', margin: '0 0 14px', fontWeight: 600 }}>
              Wszystko w jednym miejscu
            </p>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.06, margin: '0 0 16px', fontWeight: 800 }}>
              Narzędzia tradera
            </h1>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--muted)', margin: 0 }}>
              Zestaw, którego realnie używasz na drodze od nauki do konsekwentnego tradingu: ćwicz decyzje na
              symulatorze, rozpoznawaj setupy w encyklopedii formacji, licz ryzyko przed wejściem i prowadź dziennik.
              Wszystko za darmo i bez rejestracji.
            </p>
          </header>

          <div className="nt-grid">
            {TOOLS.map((t) => (
              <Link key={t.href} href={t.href} className="nt-card">
                <span className="nt-emoji" aria-hidden="true">{t.emoji}</span>
                <span className="nt-tag">{t.tag}</span>
                <span className="nt-name">{t.name}</span>
                <span className="nt-desc">{t.desc}</span>
                <span className="nt-go" aria-hidden="true">Otwórz →</span>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 24px 80px' }}>
          <NewsletterForm />
        </div>
      </main>
      <Footer />

      <style>{`
        .nt-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        .nt-card { position: relative; display: flex; flex-direction: column; gap: 8px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 22px; text-decoration: none; color: var(--text); transition: border-color .15s ease, transform .15s ease; }
        .nt-card:hover { border-color: var(--cyan); transform: translateY(-2px); }
        .nt-emoji { font-size: 1.8rem; line-height: 1; }
        .nt-tag { position: absolute; top: 18px; right: 18px; font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--cyan); border: 1px solid var(--border); border-radius: 999px; padding: 3px 9px; }
        .nt-name { font-size: 1.12rem; font-weight: 800; margin-top: 4px; }
        .nt-desc { font-size: 0.9rem; line-height: 1.6; color: var(--muted); }
        .nt-go { font-size: 0.85rem; font-weight: 700; color: var(--cyan); margin-top: 6px; }
      `}</style>
    </div>
  );
}
