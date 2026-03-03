import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Zasoby — narzędzia i polecane platformy',
  description: 'Narzędzia, platformy i książki których używam na co dzień. Broker XTB, TradingView, książki o tradingu — sprawdzone przez 9 lat na rynkach.',
};

const resources = [
  {
    category: 'BROKER',
    label: '// gdzie tradeguję',
    items: [
      {
        name: 'XTB',
        desc: 'Broker regulowany przez KNF którego używam od lat. Polski support, platforma xStation, brak prowizji na akcje i ETF. Polecam jako start dla każdego tradera w Polsce.',
        badge: 'Używam na co dzień',
        badgeColor: '#00f5d4',
        link: '#', // ← podmień na link afiliacyjny XTB
        linkLabel: 'Otwórz konto w XTB →',
        note: '* link afiliacyjny — jeśli otworzysz konto przez ten link, otrzymuję prowizję bez dodatkowych kosztów dla Ciebie',
      },
    ],
  },
  {
    category: 'WYKRESY',
    label: '// analiza techniczna',
    items: [
      {
        name: 'TradingView',
        desc: 'Najlepsza platforma do analizy technicznej na rynku. Używam do obserwacji wykresów, rysowania poziomów i screenerów. Plan darmowy wystarczy na start.',
        badge: 'Używam na co dzień',
        badgeColor: '#00f5d4',
        link: '#', // ← podmień na link afiliacyjny TradingView
        linkLabel: 'Wypróbuj TradingView →',
        note: '* link afiliacyjny',
      },
    ],
  },
  {
    category: 'KSIĄŻKI',
    label: '// co czytałem',
    items: [
      {
        name: 'Trading in the Zone — Mark Douglas',
        desc: 'Najlepsza książka o psychologii tradingu jaką czytałem. Jeśli masz problem z emocjami i dyscypliną — to jest pierwsze co powinieneś przeczytać.',
        badge: 'Obowiązkowa lektura',
        badgeColor: '#f5c518',
        link: '#', // ← podmień na link Amazon/Ceneo
        linkLabel: 'Kup na Amazon →',
        note: '* link afiliacyjny Amazon',
      },
      {
        name: 'Market Wizards — Jack D. Schwager',
        desc: 'Wywiady z najlepszymi traderami świata. Każdy ma inny styl, ale wszystkich łączy jedno — dyscyplina i zarządzanie ryzykiem.',
        badge: 'Polecam',
        badgeColor: '#b14aed',
        link: '#', // ← podmień na link Amazon/Ceneo
        linkLabel: 'Kup na Amazon →',
        note: '* link afiliacyjny Amazon',
      },
      {
        name: 'Reminiscences of a Stock Operator — Edwin Lefèvre',
        desc: 'Klasyk z 1923 roku — historia Jesse Livermore. Rynek się zmienia, ale psychologia tradera pozostaje taka sama od 100 lat.',
        badge: 'Klasyk',
        badgeColor: '#b14aed',
        link: '#', // ← podmień na link Amazon/Ceneo
        linkLabel: 'Kup na Amazon →',
        note: '* link afiliacyjny Amazon',
      },
    ],
  },
  {
    category: 'NARZĘDZIA',
    label: '// pozostałe',
    items: [
      {
        name: 'Investing.com',
        desc: 'Kalendarz ekonomiczny którego używam codziennie — sprawdzam przed sesją jakie dane makro są zaplanowane. Darmowy.',
        badge: 'Darmowe',
        badgeColor: '#3a5a6a',
        link: 'https://pl.investing.com/economic-calendar/',
        linkLabel: 'Przejdź do Investing.com →',
        note: null,
      },
      {
        name: 'Myfxbook',
        desc: 'Narzędzie do śledzenia i weryfikacji wyników tradingowych. Planuję podłączyć swoje konto dla pełnej transparentności.',
        badge: 'Wkrótce',
        badgeColor: '#3a5a6a',
        link: 'https://www.myfxbook.com',
        linkLabel: 'Sprawdź Myfxbook →',
        note: null,
      },
    ],
  },
];

export default function ZasobyPage() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: 80 }}>

        {/* HERO */}
        <section style={{
          padding: '80px 24px 64px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(0,245,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,212,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
          <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#00f5d4', letterSpacing: '3px', marginBottom: 16 }}>
              // narzędzia i zasoby
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              letterSpacing: '5px', margin: '0 0 24px', lineHeight: 1,
            }}>
              CO <span style={{ color: '#00f5d4' }}>UŻYWAM</span>
            </h1>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
              color: '#8a9ab5', lineHeight: 1.9, maxWidth: 620, margin: 0,
            }}>
              Narzędzia, platformy i książki których używam na co dzień po 9 latach na rynkach.
              Tylko to co faktycznie sprawdziłem — żadnych polecanych rzeczy których sam nie znam.
            </p>

            {/* Affiliate disclaimer */}
            <div style={{
              marginTop: 24, padding: '12px 16px',
              background: 'rgba(245,197,24,0.05)', border: '1px solid rgba(245,197,24,0.15)',
              borderLeft: '3px solid #f5c518',
              fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#8a9ab5', lineHeight: 1.7,
            }}>
              <span style={{ color: '#f5c518' }}>// disclosure</span> — Niektóre linki na tej stronie to linki afiliacyjne.
              Jeśli skorzystasz z polecenia, mogę otrzymać prowizję bez dodatkowych kosztów dla Ciebie.
              Polecam tylko narzędzia których sam używam.
            </div>
          </div>
        </section>

        {/* RESOURCES */}
        {resources.map((section, si) => (
          <section key={si} style={{
            padding: '48px 24px',
            borderTop: '1px solid #0d1a26',
          }}>
            <div style={{ maxWidth: 860, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 32 }}>
                <h2 style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.6rem',
                  letterSpacing: '4px', color: '#e8edf5', margin: 0,
                }}>
                  {section.category}
                </h2>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#3a5a6a', letterSpacing: '2px' }}>
                  {section.label}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {section.items.map((item, ii) => (
                  <div key={ii} style={{
                    background: '#0a0f1a', border: '1px solid #0d1a26',
                    borderLeft: `3px solid ${item.badgeColor}`,
                    padding: '24px 28px',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: 24, alignItems: 'start',
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
                        <span style={{
                          fontFamily: 'var(--font-display)', fontSize: '1.1rem',
                          letterSpacing: '2px', color: '#e8edf5',
                        }}>
                          {item.name}
                        </span>
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                          letterSpacing: '1px', color: item.badgeColor,
                          border: `1px solid ${item.badgeColor}`,
                          padding: '2px 8px',
                          opacity: 0.9,
                        }}>
                          {item.badge}
                        </span>
                      </div>
                      <p style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.73rem',
                        color: '#8a9ab5', lineHeight: 1.8, margin: '0 0 12px',
                      }}>
                        {item.desc}
                      </p>
                      {item.note && (
                        <p style={{
                          fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                          color: '#3a5a6a', margin: 0, lineHeight: 1.6,
                        }}>
                          {item.note}
                        </p>
                      )}
                    </div>

                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                        letterSpacing: '1px', whiteSpace: 'nowrap',
                        background: item.link === '#' ? 'transparent' : '#00f5d4',
                        color: item.link === '#' ? '#3a5a6a' : '#060a10',
                        border: item.link === '#' ? '1px solid #1a2535' : '1px solid #00f5d4',
                        padding: '10px 16px',
                        textDecoration: 'none', fontWeight: 700,
                        opacity: item.link === '#' ? 0.5 : 1,
                        pointerEvents: item.link === '#' ? 'none' : 'auto',
                        display: 'block',
                      }}
                    >
                      {item.link === '#' ? 'WKRÓTCE' : item.linkLabel}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* CTA */}
        <section style={{ padding: '64px 24px 120px', borderTop: '1px solid #0d1a26', textAlign: 'center' }}>
          <div style={{ maxWidth: 500, margin: '0 auto' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#00f5d4', letterSpacing: '3px', marginBottom: 16 }}>
              // masz pytanie?
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#8a9ab5', lineHeight: 1.9, margin: '0 0 24px' }}>
              Używasz czegoś co polecasz i chcesz żebym dodał do listy? Napisz.
            </p>
            <a
              href="mailto:nysethtrading@gmail.com"
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                letterSpacing: '2px', background: 'none', color: '#8a9ab5',
                border: '1px solid #1a2535', padding: '12px 28px',
                textDecoration: 'none',
              }}
            >
              NAPISZ DO MNIE →
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
