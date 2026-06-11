import Link from 'next/link';

const CALCS = [
  { href: '/kalkulator/procent-skladany',  label: 'Procent składany',     icon: '📈', desc: 'Ile urośnie twój kapitał przez lata' },
  { href: '/kalkulator/milion',            label: 'Kiedy milion?',        icon: '🏆', desc: 'Za ile lat odłożysz pierwszy milion' },
  { href: '/kalkulator/emerytura',         label: 'Emerytura z ZUS',      icon: '⏳', desc: 'Ile dostaniesz i jaka luka emerytalna' },
  { href: '/kalkulator/porownaj-pensje',   label: 'Porównaj pensję',      icon: '📊', desc: 'Więcej niż ile % Polaków zarabiasz' },
  { href: '/kalkulator/gdzie-ida-podatki', label: 'Gdzie idą podatki?',   icon: '🧾', desc: 'Ile oddajesz państwu co miesiąc' },
  { href: '/kalkulator/wynagrodzenia',     label: 'Brutto - netto',       icon: '💰', desc: 'Przelicz pensję na rękę' },
  { href: '/kalkulator/skladka-zdrowotna', label: 'Składka zdrowotna',    icon: '🩺', desc: 'Składka na działalności 2026' },
  { href: '/kalkulator/risk-reward',       label: 'Risk / Reward',        icon: '⚖️', desc: 'Oceń czy transakcja ma sens' },
  { href: '/kalkulator/fire',              label: 'Kalkulator FIRE',      icon: '🔥', desc: 'Kiedy możesz przestać pracować' },
  { href: '/kalkulator/etf',               label: 'ETF vs lokata',        icon: '📉', desc: 'Porównaj zwrot z ETF i lokaty' },
  { href: '/kalkulator/godziny-pracy',     label: 'Ile godzin pracy?',    icon: '⏱️', desc: 'Prawdziwy koszt każdego zakupu' },
  { href: '/kalkulator/kredyt-gotowkowy',  label: 'Kredyt gotówkowy',     icon: '💳', desc: 'Rata i całkowity koszt kredytu' },
  { href: '/kalkulator-hipoteczny',        label: 'Kalkulator hipoteczny', icon: '🏠', desc: 'Rata kredytu i harmonogram spłat' },
] as const;

type CalcHref = (typeof CALCS)[number]['href'];

const TAG_MAP: Record<string, CalcHref[]> = {
  trading:     ['/kalkulator/risk-reward', '/kalkulator/procent-skladany', '/kalkulator/etf'],
  inwestycje:  ['/kalkulator/milion', '/kalkulator/etf', '/kalkulator/procent-skladany', '/kalkulator/fire'],
  pieniadze:   ['/kalkulator/porownaj-pensje', '/kalkulator/wynagrodzenia', '/kalkulator/gdzie-ida-podatki', '/kalkulator/milion'],
  psychologia: ['/kalkulator/godziny-pracy', '/kalkulator/milion', '/kalkulator/procent-skladany'],
  gospodarka:  ['/kalkulator/gdzie-ida-podatki', '/kalkulator/wynagrodzenia', '/kalkulator/porownaj-pensje'],
};

const SLUG_KEYWORDS: Array<[string, CalcHref]> = [
  ['kredyt-hipoteczny',  '/kalkulator-hipoteczny'],
  ['hipoteczn',         '/kalkulator-hipoteczny'],
  ['najem-czy-kupno',   '/kalkulator-hipoteczny'],
  ['stale-czy-zmienne', '/kalkulator-hipoteczny'],
  ['kredyt-gotowkow',   '/kalkulator/kredyt-gotowkowy'],
  ['procent-skladany',  '/kalkulator/procent-skladany'],
  ['dca',               '/kalkulator/procent-skladany'],
  ['inwestowani',       '/kalkulator/milion'],
  ['milion',            '/kalkulator/milion'],
  ['oszczedz',          '/kalkulator/milion'],
  ['etf',               '/kalkulator/etf'],
  ['lokata',            '/kalkulator/etf'],
  ['obligacj',          '/kalkulator/etf'],
  ['fire',              '/kalkulator/fire'],
  ['ike',               '/kalkulator/emerytura'],
  ['ikze',              '/kalkulator/emerytura'],
  ['ppk',               '/kalkulator/emerytura'],
  ['emerytur',          '/kalkulator/emerytura'],
  ['zus',               '/kalkulator/emerytura'],
  ['waloryzacj',        '/kalkulator/emerytura'],
  ['zarabia',           '/kalkulator/porownaj-pensje'],
  ['pensj',             '/kalkulator/porownaj-pensje'],
  ['mediana',           '/kalkulator/porownaj-pensje'],
  ['srednia-krajowa',   '/kalkulator/porownaj-pensje'],
  ['wynagrodzeni',      '/kalkulator/wynagrodzenia'],
  ['placa-minimalna',   '/kalkulator/wynagrodzenia'],
  ['brutto',            '/kalkulator/wynagrodzenia'],
  ['netto',             '/kalkulator/wynagrodzenia'],
  ['podatek',           '/kalkulator/gdzie-ida-podatki'],
  ['podatk',            '/kalkulator/gdzie-ida-podatki'],
  ['kwota-wolna',       '/kalkulator/gdzie-ida-podatki'],
  ['skladka-zdrowotn',  '/kalkulator/skladka-zdrowotna'],
  ['dzialalnosc',       '/kalkulator/skladka-zdrowotna'],
  ['risk-reward',       '/kalkulator/risk-reward'],
  ['fibonacci',         '/kalkulator/risk-reward'],
  ['trading',           '/kalkulator/risk-reward'],
  ['strategi',          '/kalkulator/risk-reward'],
  ['godziny-pracy',     '/kalkulator/godziny-pracy'],
  ['budzet',            '/kalkulator/godziny-pracy'],
  ['nawyk',             '/kalkulator/godziny-pracy'],
  ['wydajem',           '/kalkulator/godziny-pracy'],
  ['poduszka',          '/kalkulator/milion'],
];

function tagToKey(tag: string): string {
  return tag.toLowerCase()
    .replace(/ą/g,'a').replace(/ć/g,'c').replace(/ę/g,'e')
    .replace(/ł/g,'l').replace(/ń/g,'n').replace(/ó/g,'o')
    .replace(/ś/g,'s').replace(/ź/g,'z').replace(/ż/g,'z');
}

function getCalcs(tag: string, slug: string): typeof CALCS[number][] {
  const key = tagToKey(tag);
  const hrefs = new Set<CalcHref>(TAG_MAP[key] ?? []);

  for (const [kw, href] of SLUG_KEYWORDS) {
    if (slug.includes(kw)) hrefs.add(href);
  }

  // nie pokazuj kalkulatora który jest bieżącą stroną
  hrefs.delete(`/kalkulator/${slug}` as CalcHref);

  return CALCS.filter(c => hrefs.has(c.href)).slice(0, 3);
}

interface Props {
  tag: string;
  slug: string;
}

export default function RelatedCalcs({ tag, slug }: Props) {
  const calcs = getCalcs(tag, slug);
  if (calcs.length === 0) return null;

  return (
    <div style={{
      maxWidth: 860,
      margin: '0 auto',
      padding: '0 24px 48px',
    }}>
      <div style={{
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: 32,
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          fontWeight: 700,
          color: 'var(--muted)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginBottom: 16,
        }}>
          Przydatne kalkulatory
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
        }}>
          {calcs.map(c => (
            <Link
              key={c.href}
              href={c.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 18px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                textDecoration: 'none',
                color: 'var(--text)',
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              <span style={{ fontSize: '1.4rem', flexShrink: 0, lineHeight: 1 }}>{c.icon}</span>
              <div style={{ minWidth: 0 }}>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  margin: '0 0 2px',
                  color: 'var(--text)',
                }}>
                  {c.label}
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.72rem',
                  color: 'var(--muted)',
                  margin: 0,
                }}>
                  {c.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
