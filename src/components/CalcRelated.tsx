import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/posts';
import { postUrl } from '@/lib/url';
import { getPublishedRankings, withRankingDate } from '@/lib/rankings';
import NewsletterForm from '@/components/NewsletterForm';

/* ── Ikony liniowe ── */
const IcoChart = ({ c }: { c: string }) => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3,20 10,13 15,17 24,7" /><polyline points="18,7 24,7 24,13" />
  </svg>
);
const IcoCalc = ({ c }: { c: string }) => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="3" width="16" height="22" rx="2.5" /><line x1="9" y1="8" x2="19" y2="8" />
    <circle cx="10" cy="13" r="0.6" fill={c} /><circle cx="14" cy="13" r="0.6" fill={c} /><circle cx="18" cy="13" r="0.6" fill={c} />
    <circle cx="10" cy="17" r="0.6" fill={c} /><circle cx="14" cy="17" r="0.6" fill={c} /><circle cx="18" cy="17" r="0.6" fill={c} />
    <circle cx="10" cy="21" r="0.6" fill={c} /><circle cx="14" cy="21" r="0.6" fill={c} /><circle cx="18" cy="21" r="0.6" fill={c} />
  </svg>
);
const IcoScales = ({ c }: { c: string }) => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <line x1="14" y1="5" x2="14" y2="23" /><line x1="8" y1="23" x2="20" y2="23" /><line x1="14" y1="7" x2="6" y2="10" /><line x1="14" y1="7" x2="22" y2="10" />
    <path d="M3 15 L6 9.5 L9 15 Z" /><path d="M19 15 L22 9.5 L25 15 Z" />
  </svg>
);
const IcoFlame = ({ c }: { c: string }) => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 3 C14 8 18 9 17 13 C20 11 20 8 20 8 C22 11 23 14 23 17 C23 22 19 25 14 25 C9 25 5 22 5 17 C5 13 8 10 10 9 C10 13 12 14 12 14 C11 9 14 6 14 3 Z" fill={c} fillOpacity="0.12" />
  </svg>
);
const IcoBars = ({ c }: { c: string }) => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" stroke={c} strokeWidth="3.4" strokeLinecap="round">
    <line x1="7" y1="22" x2="7" y2="16" /><line x1="14" y1="22" x2="14" y2="11" /><line x1="21" y1="22" x2="21" y2="6" />
  </svg>
);
const IcoTimer = ({ c }: { c: string }) => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="14" cy="16" r="9" /><line x1="14" y1="16" x2="14" y2="11" /><line x1="11" y1="3" x2="17" y2="3" /><line x1="14" y1="3" x2="14" y2="7" /><line x1="22" y1="9" x2="24" y2="7" />
  </svg>
);
const IcoCard = ({ c }: { c: string }) => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="22" height="15" rx="2.5" /><line x1="3" y1="11.5" x2="25" y2="11.5" /><line x1="7" y1="18" x2="12" y2="18" />
  </svg>
);
const IcoHouse = ({ c }: { c: string }) => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 13 L14 5 L23 13" /><path d="M7 12 V23 H21 V12" /><rect x="12" y="17" width="4" height="6" />
  </svg>
);
const IcoHourglass = ({ c }: { c: string }) => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="4" x2="20" y2="4" /><line x1="8" y1="24" x2="20" y2="24" />
    <path d="M9 4 C9 10 14 12 14 14 C14 16 9 18 9 24" /><path d="M19 4 C19 10 14 12 14 14 C14 16 19 18 19 24" />
    <path d="M11 22 C11 18 17 18 17 22 Z" fill={c} stroke="none" />
  </svg>
);
const IcoCompare = ({ c }: { c: string }) => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="16" width="5" height="8" rx="1" /><rect x="11.5" y="11" width="5" height="13" rx="1" /><rect x="19" y="6" width="5" height="18" rx="1" />
  </svg>
);
const IcoTrophy = ({ c }: { c: string }) => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5 H19 V11 C19 15 16 17 14 17 C12 17 9 15 9 11 Z" /><path d="M9 7 H5 V9 C5 11 7 12 9 12" /><path d="M19 7 H23 V9 C23 11 21 12 19 12" /><line x1="14" y1="17" x2="14" y2="21" /><path d="M10 24 H18 L17 21 H11 Z" fill={c} stroke="none" />
  </svg>
);
const IcoSplit = ({ c }: { c: string }) => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="14" cy="14" r="10" /><line x1="14" y1="14" x2="14" y2="4" /><line x1="14" y1="14" x2="22.5" y2="19" />
  </svg>
);
const IcoBond = ({ c }: { c: string }) => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="22" height="14" rx="2" /><circle cx="14" cy="14" r="3" /><line x1="6" y1="10" x2="6" y2="18" /><line x1="22" y1="10" x2="22" y2="18" />
  </svg>
);

const GREEN = { bg: '#dfe7d2', ic: '#5f7a4a' };
const GOLD  = { bg: '#ece0c6', ic: '#b3892f' };
const PEACH = { bg: '#f3ddcf', ic: '#d9633a' };
const LILAC = { bg: '#e6dced', ic: '#8b6db0' };

const ALL_CALCS = [
  { href: '/kalkulator/procent-skladany', label: 'Procent składany',     desc: 'Oblicz, jak procent składany wpływa na Twoje inwestycje.', Icon: IcoChart,  col: GREEN },
  { href: '/kalkulator/dca',              label: 'DCA',                   desc: 'Sprawdź efekty strategii systematycznego inwestowania.',   Icon: IcoCalc,   col: GREEN },
  { href: '/kalkulator/risk-reward',      label: 'Risk / Reward',         desc: 'Oceń stosunek zysku do ryzyka w inwestycji.',              Icon: IcoScales, col: GOLD  },
  { href: '/kalkulator/wielkosc-pozycji', label: 'Wielkość pozycji',      desc: 'Policz, ile kupić, żeby ryzykować tylko 1-2% kapitału.',    Icon: IcoScales, col: GOLD  },
  { href: '/kalkulator/fire',             label: 'Kalkulator FIRE',       desc: 'Sprawdź, kiedy możesz osiągnąć niezależność finansową.',   Icon: IcoFlame,  col: PEACH },
  { href: '/kalkulator/etf',              label: 'ETF vs Lokata',         desc: 'Porównaj potencjalne zyski ETF-ów i lokat bankowych.',     Icon: IcoBars,   col: GREEN },
  { href: '/kalkulator/godziny-pracy',    label: 'Ile godzin pracy?',     desc: 'Zobacz, ile godzin pracy potrzeba na różne cele.',         Icon: IcoTimer,  col: LILAC },
  { href: '/kalkulator/kredyt-gotowkowy', label: 'Kredyt gotówkowy',      desc: 'Oblicz ratę i RRSO kredytu gotówkowego.',                  Icon: IcoCard,   col: GREEN },
  { href: '/kalkulator/wynagrodzenia',    label: 'Wynagrodzenia brutto-netto', desc: 'Przelicz pensję brutto na netto ze składkami i podatkiem.', Icon: IcoCalc, col: GOLD  },
  { href: '/kalkulator/emerytura',        label: 'Kalkulator emerytalny', desc: 'Prognoza emerytury z ZUS, stopa zastąpienia i luka emerytalna.', Icon: IcoHourglass, col: LILAC },
  { href: '/kalkulator/porownaj-pensje',  label: 'Porównaj swoją pensję', desc: 'Sprawdź, więcej niż ile procent Polaków zarabiasz.', Icon: IcoCompare, col: GOLD },
  { href: '/kalkulator/milion',           label: 'Kiedy uzbierasz milion?', desc: 'Za ile lat odłożysz milion i ile dorobi procent składany.', Icon: IcoTrophy, col: GREEN },
  { href: '/kalkulator/gdzie-ida-podatki', label: 'Gdzie idą Twoje podatki?', desc: 'Ile oddajesz państwu i na co idą publiczne pieniądze.', Icon: IcoSplit, col: PEACH },
  { href: '/kalkulator/skladka-zdrowotna', label: 'Składka zdrowotna 2026', desc: 'Policz składkę zdrowotną na skali, liniowym i ryczałcie.', Icon: IcoScales, col: GREEN },
  { href: '/kalkulator-hipoteczny',       label: 'Kalkulator hipoteczny', desc: 'Oblicz ratę kredytu i całkowity koszt nieruchomości.',     Icon: IcoHouse,  col: GREEN },
  { href: '/kalkulator/zdolnosc-kredytowa', label: 'Zdolność kredytowa',  desc: 'Oszacuj maksymalną kwotę kredytu hipotecznego.',           Icon: IcoCard,   col: GOLD  },
  { href: '/kalkulator/odsetki-obligacje', label: 'Odsetki od obligacji', desc: 'Policz zysk netto z obligacji EDO, COI, TOS, ROR i DOR.',   Icon: IcoBond,   col: GREEN },
  { href: '/kalkulator/nadplata-kredytu',  label: 'Nadpłata kredytu',     desc: 'Sprawdź, ile zaoszczędzisz na odsetkach przy nadpłacie.',   Icon: IcoHouse,  col: PEACH },
];

export default async function CalcRelated({ currentPath }: { currentPath: string }) {
  const posts = await getAllPosts();
  const related = posts.slice(0, 3);
  const otherCalcs = ALL_CALCS.filter(c => c.href !== currentPath);
  const ranking = getPublishedRankings()[0];

  return (
    <>
      {/* ── Inne kalkulatory ── */}
      <section className="kalk-related">
        <div className="kalk-related-inner">
          <h2 className="kalk-related-title">Inne kalkulatory</h2>
          <p className="kalk-related-sub">Przydatne narzędzia do planowania i analizy inwestycji.</p>

          <div className="kalk-cards">
            {otherCalcs.map(({ href, label, desc, Icon, col }) => (
              <Link key={href} href={href} className="kalk-card">
                <span className="kalk-ico" style={{ background: col.bg }}>
                  <Icon c={col.ic} />
                </span>
                <h3 className="kalk-card-title">{label}</h3>
                <p className="kalk-card-desc">{desc}</p>
              </Link>
            ))}
          </div>

          {ranking && (
            <Link href={`/ranking/${ranking.slug}`} style={{
              display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between',
              marginTop: 22, padding: '22px 26px', borderRadius: 16, textDecoration: 'none',
              background: 'linear-gradient(180deg, #fffdf6, #fbf4e2)', border: '1px solid rgba(201,162,39,0.4)',
              boxShadow: '0 6px 22px rgba(201,162,39,0.12)',
            }}>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fff', background: '#c9a227', fontWeight: 800, padding: '3px 10px', borderRadius: 16, marginBottom: 8 }}>
                  Premia do 1300 zł
                </span>
                <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '1.02rem', color: '#1a1a2e', lineHeight: 1.3 }}>
                  {withRankingDate(ranking.title, ranking.updated)}
                </span>
              </span>
              <span style={{ flexShrink: 0, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.9rem', color: '#0b0f15', background: 'linear-gradient(180deg, #e0bd49, #c9a227)', padding: '12px 22px', borderRadius: 11, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)' }}>
                Zobacz ranking →
              </span>
            </Link>
          )}
        </div>
      </section>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '56px 24px 80px' }}>
        {/* ── Newsletter ── */}
        <div style={{ marginBottom: 56 }}>
          <NewsletterForm />
        </div>

        {/* ── Polecane artykuły ── */}
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700,
          color: 'var(--muted)', letterSpacing: '2px', textTransform: 'uppercase',
          marginBottom: 16,
        }}>
          Polecane artykuły
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 16,
        }}>
          {related.map(post => (
            <Link key={post.slug} href={postUrl(post)} style={{
              display: 'flex', flexDirection: 'column',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              overflow: 'hidden',
              textDecoration: 'none',
              color: 'var(--text)',
              transition: 'transform 0.18s, border-color 0.18s',
            }}>
              {post.image && (
                <div style={{ position: 'relative', height: 140, flexShrink: 0 }}>
                  <Image
                    src={post.image} alt={post.title} fill
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    sizes="(max-width: 640px) 100vw, 300px"
                  />
                </div>
              )}
              <div style={{ padding: '14px 16px 18px' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                  color: '#c9a227', textTransform: 'uppercase', letterSpacing: '1px',
                }}>
                  {post.tag}
                </span>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                  fontWeight: 700, margin: '6px 0 0', lineHeight: 1.35,
                  color: 'var(--text)',
                }}>
                  {post.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
