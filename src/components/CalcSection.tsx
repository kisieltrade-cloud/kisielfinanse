import Link from 'next/link';
import Image from 'next/image';

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

const TOOLS = [
  { href: '/kalkulator/procent-skladany', label: 'PROCENT SKŁADANY', accent: '#3b82f6', Icon: IconChart   },
  { href: '/kalkulator/dca',              label: 'DCA',               accent: '#22c55e', Icon: IconRefresh },
  { href: '/kalkulator/risk-reward',      label: 'RISK / REWARD',     accent: '#f59e0b', Icon: IconScales  },
  { href: '/kalkulator/fire',             label: 'FIRE',              accent: '#ef4444', Icon: IconFlame   },
  { href: '/kalkulator/etf',             label: 'ETF VS LOKATA',     accent: '#8b5cf6', Icon: IconPie     },
];

export default function CalcSection() {
  return (
    <section style={{ background: 'var(--bg)', padding: 'clamp(48px, 7vw, 88px) 0' }}>
      <style>{`
        .cs-feat {
          display: flex; overflow: hidden;
          border-radius: 20px; min-height: 240px;
          position: relative; text-decoration: none; color: inherit;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07), 0 8px 32px rgba(0,0,0,0.05);
          border: 1px solid #e8eaed;
          transition: transform 0.22s cubic-bezier(.2,0,.0,1), box-shadow 0.22s;
        }
        [data-theme="dark"] .cs-feat { border-color: rgba(255,255,255,0.06); box-shadow: 0 2px 12px rgba(0,0,0,0.3); }
        .cs-feat:hover { transform: translateY(-5px); box-shadow: 0 8px 32px rgba(0,0,0,0.13), 0 20px 60px rgba(0,0,0,0.08); }
        .cs-feat:hover .cs-arrow { transform: scale(1.08); }
        .cs-arrow { transition: transform 0.2s; }

        .cs-card { background: #ffffff; }
        [data-theme="dark"] .cs-card { background: var(--surface); }

        .cs-fade { background: linear-gradient(to right, #ffffff 0%, transparent 40%); }
        [data-theme="dark"] .cs-fade { background: linear-gradient(to right, #080d14 0%, transparent 40%); }

        .cs-tool {
          display: flex; flex-direction: column; align-items: center;
          padding: 24px 16px 20px; min-height: 210px;
          border-radius: 18px; text-decoration: none; color: inherit;
          position: relative; background: #ffffff;
          border: 1px solid #e8eaed;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04);
          transition: transform 0.2s cubic-bezier(.2,0,.0,1), box-shadow 0.2s;
        }
        [data-theme="dark"] .cs-tool { background: var(--surface); border-color: rgba(255,255,255,0.06); }
        .cs-tool:hover { transform: translateY(-4px); box-shadow: 0 8px 28px rgba(0,0,0,0.12), 0 16px 48px rgba(0,0,0,0.07); }

        .cs-t-text { color: #111827; }
        [data-theme="dark"] .cs-t-text { color: var(--text); }
        .cs-t-sub  { color: #6b7280; }
        [data-theme="dark"] .cs-t-sub  { color: var(--muted); }

        .cs-tarrow { border: 1.5px solid #d1d5db; color: #9ca3af; }
        [data-theme="dark"] .cs-tarrow { border-color: rgba(255,255,255,0.12); color: var(--muted); }

        @media (max-width: 660px) {
          .cs-feat-grid  { grid-template-columns: 1fr !important; }
          .cs-tools-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .cs-photo      { display: none !important; }
        }
        @media (max-width: 900px) and (min-width: 661px) {
          .cs-tools-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1020, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 36, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <h2 className="cs-t-text" style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.3px',
            margin: 0,
            lineHeight: 1.1,
          }}>
            Kalkulatory finansowe
          </h2>
          <Link href="/kalkulator" style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
            color: '#c9a227', textDecoration: 'none', letterSpacing: '1px',
            fontWeight: 700, whiteSpace: 'nowrap',
          }}>
            Wszystkie narzędzia →
          </Link>
        </div>

        {/* Label */}
        <p className="cs-t-text" style={{
          fontFamily: 'var(--font-body)', fontSize: '0.85rem',
          fontWeight: 700, margin: '0 0 14px',
        }}>
          Najpopularniejsze kalkulatory
        </p>

        {/* Featured */}
        <div className="cs-feat-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>

          <Link href="/kalkulator/kredyt-gotowkowy" className="cs-feat cs-card">
            <div style={{ flex: 1, padding: '32px 28px 28px', display: 'flex', flexDirection: 'column' }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%', background: 'rgba(59,130,246,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6', marginBottom: 20,
              }}>01</div>
              <p className="cs-t-text" style={{ fontFamily: 'var(--font-body)', fontSize: '1.15rem', fontWeight: 800, letterSpacing: '0.3px', margin: '0 0 6px', lineHeight: 1.2 }}>
                KREDYT GOTÓWKOWY
              </p>
              <p className="cs-t-sub" style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', margin: '0 0 auto' }}>
                Rata i RRSO z prowizją
              </p>
              <div style={{ paddingTop: 24 }}>
                <div className="cs-arrow" style={{ width: 42, height: 42, borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color: '#fff' }}>→</div>
              </div>
            </div>
            <div className="cs-photo" style={{ width: '44%', flexShrink: 0, position: 'relative' }}>
              <Image src="/images/blog/covers/zloty-counting.jpg" alt="Kredyt gotówkowy" fill sizes="240px" style={{ objectFit: 'cover', objectPosition: 'center' }} />
              <div className="cs-fade" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
            </div>
          </Link>

          <Link href="/kalkulator-hipoteczny" className="cs-feat cs-card">
            <div style={{ flex: 1, padding: '32px 28px 28px', display: 'flex', flexDirection: 'column' }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%', background: 'rgba(34,197,94,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700, color: '#22c55e', marginBottom: 20,
              }}>02</div>
              <p className="cs-t-text" style={{ fontFamily: 'var(--font-body)', fontSize: '1.15rem', fontWeight: 800, letterSpacing: '0.3px', margin: '0 0 6px', lineHeight: 1.2 }}>
                KALKULATOR HIPOTECZNY
              </p>
              <p className="cs-t-sub" style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', margin: '0 0 auto' }}>
                Rata i zdolność kredytowa
              </p>
              <div style={{ paddingTop: 24 }}>
                <div className="cs-arrow" style={{ width: 42, height: 42, borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color: '#fff' }}>→</div>
              </div>
            </div>
            <div className="cs-photo" style={{ width: '44%', flexShrink: 0, position: 'relative' }}>
              <Image src="/images/kalkulator-hipoteczny/dom.png" alt="Kalkulator hipoteczny" fill sizes="240px" style={{ objectFit: 'cover', objectPosition: 'center 60%' }} />
              <div className="cs-fade" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
            </div>
          </Link>

        </div>

        {/* Label */}
        <p className="cs-t-text" style={{
          fontFamily: 'var(--font-body)', fontSize: '0.85rem',
          fontWeight: 700, margin: '0 0 14px',
        }}>
          Pozostałe narzędzia
        </p>

        {/* Tools */}
        <div className="cs-tools-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
          {TOOLS.map(({ href, label, accent, Icon }, i) => (
            <Link key={href} href={href} className="cs-tool">
              <div style={{
                position: 'absolute', top: 14, left: 14,
                width: 28, height: 28, borderRadius: '50%', background: `${accent}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 700, color: accent,
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ marginTop: 20, marginBottom: 14 }}>
                <Icon color={accent} />
              </div>
              <p className="cs-t-text" style={{
                fontFamily: 'var(--font-body)', fontSize: '0.73rem', fontWeight: 700,
                letterSpacing: '0.4px', textAlign: 'center', margin: '0 0 10px',
                lineHeight: 1.3, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {label}
              </p>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: accent, marginBottom: 14 }} />
              <div className="cs-tarrow" style={{
                width: 34, height: 34, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem',
              }}>→</div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
