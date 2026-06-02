import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import RevealOnScroll from '@/components/RevealOnScroll';
import NewsletterForm from '@/components/NewsletterForm';

const BASE_URL = 'https://kisielfinanse.pl';

export const metadata: Metadata = {
  title: { absolute: 'Kalkulatory finansowe - FIRE, ETF, procent składany' },
  description: 'Darmowe kalkulatory finansowe: procent składany, FIRE, ETF vs lokata, risk/reward, kredyt gotówkowy i hipoteczny. Bez rejestracji.',
  keywords: ['kalkulator finansowy', 'kalkulator procent skladany', 'kalkulator FIRE', 'kalkulator ETF', 'kalkulator risk reward', 'kalkulator hipoteczny'],
  alternates: { canonical: `${BASE_URL}/kalkulator` },
  openGraph: {
    title: 'Kalkulatory Finansowe | KisielFinanse',
    description: 'Procent składany, FIRE, ETF vs lokata, risk/reward, kredyt gotówkowy i hipoteczny.',
    url: `${BASE_URL}/kalkulator`,
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kalkulatory Finansowe | KisielFinanse',
    description: 'Procent składany, FIRE, ETF, risk/reward, kredyt gotówkowy i hipoteczny.',
    images: ['/og-image.png'],
  },
};

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'KisielFinanse', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Kalkulatory', item: `${BASE_URL}/kalkulator` },
  ],
};

function IconChart({ color }: { color: string }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <rect x="4"  y="34" width="11" height="18" rx="3" fill={color} opacity="0.5" />
      <rect x="19" y="24" width="11" height="28" rx="3" fill={color} opacity="0.75" />
      <rect x="34" y="12" width="11" height="40" rx="3" fill={color} />
      <polyline points="9,32 24,22 39,10" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="39" cy="10" r="3.5" fill={color} />
    </svg>
  );
}
function IconRefresh({ color }: { color: string }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <path d="M46 28C46 38 38 46 28 46C18 46 10 38 10 28C10 18 18 10 28 10C34 10 39 12.5 42.5 17" stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <polyline points="42,8 43,18 33,17" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
function IconScales({ color }: { color: string }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <line x1="28" y1="8" x2="28" y2="48" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="48" x2="44" y2="48" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="28" y1="16" x2="12" y2="23" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="28" y1="16" x2="44" y2="23" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="12" cy="30" rx="5" ry="7" fill={color} opacity="0.85" />
      <ellipse cx="44" cy="32" rx="5" ry="7" fill={color} opacity="0.55" />
    </svg>
  );
}
function IconFlame({ color }: { color: string }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <path d="M28 6C28 6 36 16 34 23C38 18 40 12 40 12C40 12 48 20 48 31C48 41 39 49 28 49C17 49 8 41 8 31C8 22 15 16 18 14C18 21 22 25 22 25C20 18 28 6 28 6Z" fill={color} opacity="0.7" />
      <path d="M28 34C28 34 32 30 30 26C33 28 33 33 33 33C33 33 37 29 37 25C39 27 40 30 40 33C40 40 34.5 45 28 45C21.5 45 16 40 16 33C16 29 18 26 20 24C19 28 22 31 22 31C20 27 28 18 28 34Z" fill={color} />
    </svg>
  );
}
function IconPie({ color }: { color: string }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <path d="M28 10 A18 18 0 0 1 46 28 L28 28Z" fill={color} />
      <path d="M46 28 A18 18 0 0 1 28 46 L28 28Z" fill={color} opacity="0.7" />
      <path d="M28 46 A18 18 0 1 1 28 10 L28 28Z" fill={color} opacity="0.35" />
    </svg>
  );
}

function IconClock({ color }: { color: string }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="18" stroke={color} strokeWidth="3" fill="none" />
      <line x1="28" y1="16" x2="28" y2="28" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="28" y1="28" x2="36" y2="35" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <circle cx="28" cy="28" r="3" fill={color} />
    </svg>
  );
}

function IconWallet({ color }: { color: string }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <rect x="8" y="14" width="40" height="30" rx="5" stroke={color} strokeWidth="3" fill="none" />
      <line x1="8" y1="23" x2="48" y2="23" stroke={color} strokeWidth="3" />
      <circle cx="40" cy="34" r="3.5" fill={color} />
    </svg>
  );
}
function IconHealth({ color }: { color: string }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <rect x="10" y="14" width="36" height="30" rx="6" stroke={color} strokeWidth="3" fill="none" />
      <line x1="28" y1="22" x2="28" y2="36" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
      <line x1="21" y1="29" x2="35" y2="29" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

const TOOLS = [
  { href: '/kalkulator/wynagrodzenia',    label: 'BRUTTO - NETTO',      accent: '#10b981', Icon: IconWallet  },
  { href: '/kalkulator/skladka-zdrowotna', label: 'SKŁADKA ZDROWOTNA',  accent: '#2e7d4f', Icon: IconHealth  },
  { href: '/kalkulator/zdolnosc-kredytowa', label: 'ZDOLNOŚĆ KREDYTOWA', accent: '#e8963a', Icon: IconScales  },
  { href: '/kalkulator/procent-skladany', label: 'PROCENT SKŁADANY',   accent: '#3b82f6', Icon: IconChart   },
  { href: '/kalkulator/dca',              label: 'DCA',                 accent: '#22c55e', Icon: IconRefresh },
  { href: '/kalkulator/risk-reward',      label: 'RISK / REWARD',       accent: '#f59e0b', Icon: IconScales  },
  { href: '/kalkulator/fire',             label: 'FIRE',                accent: '#ef4444', Icon: IconFlame   },
  { href: '/kalkulator/etf',             label: 'ETF VS LOKATA',       accent: '#8b5cf6', Icon: IconPie     },
  { href: '/kalkulator/godziny-pracy',   label: 'ILE GODZIN PRACY?',   accent: '#c9a227', Icon: IconClock   },
];

export default function KalkulatorPage() {
  return (
    <>
      <RevealOnScroll />
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />

      <style>{`
        /* ── light mode ───────────────────────────── */
        .kf-page    { background: #f0f2f5; }
        .kf-card    { background: #ffffff; border: 1px solid #e8eaed; }
        .kf-section { color: #111827; }
        .kf-title   { color: #111827; }
        .kf-sub     { color: #6b7280; }
        .kf-photo-fade { background: linear-gradient(to right, #ffffff 0%, transparent 40%); }
        .kf-tool-arrow { border-color: #d1d5db; color: #9ca3af; }

        /* ── dark mode ────────────────────────────── */
        [data-theme="dark"] .kf-page    { background: var(--bg); }
        [data-theme="dark"] .kf-card    { background: var(--surface); border: 1px solid rgba(255,255,255,0.06); }
        [data-theme="dark"] .kf-section { color: var(--text); }
        [data-theme="dark"] .kf-title   { color: var(--text); }
        [data-theme="dark"] .kf-sub     { color: var(--muted); }
        [data-theme="dark"] .kf-photo-fade { background: linear-gradient(to right, #080d14 0%, transparent 40%); }
        [data-theme="dark"] .kf-tool-arrow { border-color: rgba(255,255,255,0.12); color: var(--muted); }

        /* ── featured card ────────────────────────── */
        .kf-feat {
          display: flex;
          overflow: hidden;
          border-radius: 20px;
          min-height: 240px;
          position: relative;
          text-decoration: none;
          color: inherit;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07), 0 8px 32px rgba(0,0,0,0.05);
          transition: transform 0.22s cubic-bezier(.2,0,.0,1), box-shadow 0.22s;
        }
        .kf-feat:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.13), 0 20px 60px rgba(0,0,0,0.08);
        }
        .kf-feat:hover .kf-arrow-btn { transform: scale(1.08); }
        .kf-arrow-btn { transition: transform 0.2s; }

        /* ── tool card ────────────────────────────── */
        .kf-tool {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px 16px 20px;
          min-height: 210px;
          border-radius: 18px;
          text-decoration: none;
          color: inherit;
          position: relative;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04);
          transition: transform 0.2s cubic-bezier(.2,0,.0,1), box-shadow 0.2s;
        }
        .kf-tool:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.12), 0 16px 48px rgba(0,0,0,0.07);
        }

        @media (max-width: 660px) {
          .kf-feat-grid  { grid-template-columns: 1fr !important; }
          .kf-tools-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .kf-photo-wrap { display: none !important; }
        }
        @media (max-width: 900px) and (min-width: 661px) {
          .kf-tools-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>

      <main className="kf-page" style={{ paddingTop: '80px', minHeight: '100vh' }}>
        <div style={{ maxWidth: 1020, margin: '0 auto', padding: '28px 28px 0' }}>
          <Breadcrumbs items={[
            { label: 'KisielFinanse', href: '/' },
            { label: 'Kalkulatory' },
          ]} />
        </div>

        <div style={{ maxWidth: 1020, margin: '0 auto', padding: '36px 28px 80px' }}>

          {/* ── Header ──────────────────────────── */}
          <div style={{ marginBottom: 40 }}>
            <h1 className="kf-title" style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1.9rem, 4vw, 2.8rem)',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              margin: '0 0 10px',
              lineHeight: 1.1,
            }}>
              Kalkulatory finansowe
            </h1>
          </div>

          {/* ── Sekcja featured ─────────────────── */}
          <p className="kf-section" style={{
            fontFamily: 'var(--font-body)', fontSize: '0.88rem',
            fontWeight: 700, margin: '0 0 16px',
          }}>
            Najpopularniejsze kalkulatory
          </p>

          <div
            className="kf-feat-grid"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 44 }}
          >
            {/* Kredyt gotówkowy */}
            <Link href="/kalkulator/kredyt-gotowkowy" className="kf-feat kf-card">
              {/* Treść */}
              <div style={{ flex: 1, padding: '32px 28px 28px', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'rgba(59,130,246,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700,
                  color: '#3b82f6', marginBottom: 20,
                }}>
                  01
                </div>
                <p className="kf-title" style={{
                  fontFamily: 'var(--font-body)', fontSize: '1.15rem',
                  fontWeight: 800, letterSpacing: '0.3px',
                  margin: '0 0 6px', lineHeight: 1.2,
                }}>
                  KREDYT GOTÓWKOWY
                </p>
                <p className="kf-sub" style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.82rem',
                  margin: '0 0 auto',
                }}>
                  Rata i RRSO z prowizją
                </p>
                <div style={{ paddingTop: 24 }}>
                  <div className="kf-arrow-btn" style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: '#3b82f6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', color: '#fff',
                  }}>→</div>
                </div>
              </div>
              {/* Zdjęcie */}
              <div className="kf-photo-wrap" style={{
                width: '44%', flexShrink: 0, position: 'relative',
              }}>
                <Image
                  src="/images/blog/covers/zloty-counting.jpg"
                  alt="Kredyt gotówkowy"
                  fill
                  sizes="240px"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
                {/* Fade od lewej */}
                <div className="kf-photo-fade" style={{
                  position: 'absolute', inset: 0,
                  pointerEvents: 'none',
                }} />
              </div>
            </Link>

            {/* Kalkulator hipoteczny */}
            <Link href="/kalkulator-hipoteczny" className="kf-feat kf-card">
              <div style={{ flex: 1, padding: '32px 28px 28px', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'rgba(34,197,94,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700,
                  color: '#22c55e', marginBottom: 20,
                }}>
                  02
                </div>
                <p className="kf-title" style={{
                  fontFamily: 'var(--font-body)', fontSize: '1.15rem',
                  fontWeight: 800, letterSpacing: '0.3px',
                  margin: '0 0 6px', lineHeight: 1.2,
                }}>
                  KALKULATOR HIPOTECZNY
                </p>
                <p className="kf-sub" style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.82rem',
                  margin: '0 0 auto',
                }}>
                  Rata i zdolność kredytowa
                </p>
                <div style={{ paddingTop: 24 }}>
                  <div className="kf-arrow-btn" style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: '#22c55e',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', color: '#fff',
                  }}>→</div>
                </div>
              </div>
              <div className="kf-photo-wrap" style={{
                width: '44%', flexShrink: 0, position: 'relative',
              }}>
                <Image
                  src="/images/kalkulator-hipoteczny/dom.png"
                  alt="Kalkulator hipoteczny"
                  fill
                  sizes="240px"
                  style={{ objectFit: 'cover', objectPosition: 'center 60%' }}
                />
                <div className="kf-photo-fade" style={{
                  position: 'absolute', inset: 0,
                  pointerEvents: 'none',
                }} />
              </div>
            </Link>
          </div>

          {/* ── Sekcja pozostałe ─────────────────── */}
          <p className="kf-section" style={{
            fontFamily: 'var(--font-body)', fontSize: '0.88rem',
            fontWeight: 700, margin: '0 0 16px',
          }}>
            Pozostałe narzędzia
          </p>

          <div
            className="kf-tools-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 72 }}
          >
            {TOOLS.map(({ href, label, accent, Icon }, i) => (
              <Link key={href} href={href} className="kf-tool kf-card">
                {/* Numer */}
                <div style={{
                  position: 'absolute', top: 14, left: 14,
                  width: 28, height: 28, borderRadius: '50%',
                  background: `${accent}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 700,
                  color: accent,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Ikona */}
                <div style={{ marginTop: 20, marginBottom: 14 }}>
                  <Icon color={accent} />
                </div>

                {/* Tytuł */}
                <p className="kf-title" style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.73rem',
                  fontWeight: 700,
                  letterSpacing: '0.4px',
                  textAlign: 'center',
                  margin: '0 0 10px',
                  lineHeight: 1.3,
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {label}
                </p>

                {/* Dot */}
                <div style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: accent, marginBottom: 14,
                }} />

                {/* Arrow circle */}
                <div className="kf-tool-arrow" style={{
                  width: 34, height: 34, borderRadius: '50%',
                  border: '1.5px solid',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.95rem',
                }}>
                  →
                </div>
              </Link>
            ))}
          </div>

          {/* ── Newsletter ──────────────────────── */}
          <div style={{ maxWidth: 540 }}>
            <NewsletterForm />
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
