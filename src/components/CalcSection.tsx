import Link from 'next/link';
import Image from 'next/image';

/* Ikony liniowe (stroke) - styl premium z mockupu */
function IconPie({ color }: { color: string }) {
  return (
    <svg width="54" height="54" viewBox="0 0 56 56" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M25 30 L25 8 A22 22 0 1 0 47 30 Z" />
      <path d="M31 25 L31 6 A22 22 0 0 1 50 25 Z" />
    </svg>
  );
}
function IconBars({ color }: { color: string }) {
  return (
    <svg width="54" height="54" viewBox="0 0 56 56" fill="none" stroke={color} strokeWidth="4.5" strokeLinecap="round">
      <line x1="14" y1="44" x2="14" y2="34" />
      <line x1="24" y1="44" x2="24" y2="26" />
      <line x1="34" y1="44" x2="34" y2="18" />
      <line x1="44" y1="44" x2="44" y2="10" />
    </svg>
  );
}
function IconScales({ color }: { color: string }) {
  return (
    <svg width="54" height="54" viewBox="0 0 56 56" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="28" cy="16" r="3" fill={color} stroke="none" />
      <line x1="28" y1="19" x2="28" y2="22" />
      <line x1="11" y1="22" x2="45" y2="22" />
      <path d="M5 36 L17 36 L11 22 Z" />
      <path d="M39 36 L51 36 L45 22 Z" />
    </svg>
  );
}
function IconShield({ color }: { color: string }) {
  return (
    <svg width="54" height="54" viewBox="0 0 56 56" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M28 7 L45 13 V27 C45 38 37.5 45.5 28 49 C18.5 45.5 11 38 11 27 V13 Z" />
      <path d="M28 21 C30.5 25 33 26.5 31.5 31.5 C31 35 29 37 28 37 C26.5 37 24 35.5 24 31.5 C24 28.5 26 27.5 27 25.5 C27.2 27.5 28 28.5 29 28.5 C30.5 26.5 28 23 28 21 Z" fill={color} stroke="none" />
    </svg>
  );
}
function IconLine({ color }: { color: string }) {
  return (
    <svg width="54" height="54" viewBox="0 0 56 56" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9,38 21,25 31,31 47,14" />
      <circle cx="9" cy="38" r="3.2" fill={color} stroke="none" />
      <circle cx="21" cy="25" r="3.2" fill={color} stroke="none" />
      <circle cx="31" cy="31" r="3.2" fill={color} stroke="none" />
      <circle cx="47" cy="14" r="3.2" fill={color} stroke="none" />
    </svg>
  );
}

function IconWallet({ color }: { color: string }) {
  return (
    <svg width="54" height="54" viewBox="0 0 56 56" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="16" width="38" height="26" rx="4" />
      <line x1="9" y1="24" x2="47" y2="24" />
      <circle cx="39" cy="33" r="2.6" fill={color} stroke="none" />
    </svg>
  );
}
function IconHealth({ color }: { color: string }) {
  return (
    <svg width="54" height="54" viewBox="0 0 56 56" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="11" y="14" width="34" height="30" rx="5" />
      <line x1="28" y1="22" x2="28" y2="36" />
      <line x1="21" y1="29" x2="35" y2="29" />
    </svg>
  );
}
function IconBank({ color }: { color: string }) {
  return (
    <svg width="54" height="54" viewBox="0 0 56 56" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 22 L28 10 L46 22" />
      <line x1="14" y1="25" x2="14" y2="40" />
      <line x1="23" y1="25" x2="23" y2="40" />
      <line x1="33" y1="25" x2="33" y2="40" />
      <line x1="42" y1="25" x2="42" y2="40" />
      <line x1="10" y1="44" x2="46" y2="44" />
    </svg>
  );
}

const TOOLS = [
  { href: '/kalkulator/procent-skladany', label: 'PROCENT SKŁADANY', desc: 'Oblicz potencjał wzrostu Twojego kapitału.', accent: '#3b82f6', rgb: '59,130,246',  Icon: IconPie    },
  { href: '/kalkulator/dca',              label: 'DCA',              desc: 'Średnia cena zakupu w czasie.',              accent: '#22c55e', rgb: '34,197,94',   Icon: IconBars   },
  { href: '/kalkulator/risk-reward',      label: 'RISK / REWARD',    desc: 'Oceń relację zysku do ryzyka.',              accent: '#f59e0b', rgb: '245,158,11',  Icon: IconScales },
  { href: '/kalkulator/fire',             label: 'FIRE',             desc: 'Sprawdź, kiedy możesz osiągnąć niezależność.', accent: '#ef4444', rgb: '239,68,68',   Icon: IconShield },
  { href: '/kalkulator/etf',              label: 'ETF VS LOKATA',    desc: 'Porównaj ETF z lokatą bankową.',             accent: '#8b5cf6', rgb: '139,92,246',  Icon: IconLine   },
  { href: '/kalkulator/wynagrodzenia',     label: 'BRUTTO - NETTO',     desc: 'Przelicz pensję brutto na netto.',     accent: '#0ea5a4', rgb: '14,165,164',  Icon: IconWallet },
  { href: '/kalkulator/skladka-zdrowotna', label: 'SKŁADKA ZDROWOTNA',  desc: 'Policz składkę na działalności.',      accent: '#2e7d4f', rgb: '46,125,79',   Icon: IconHealth },
  { href: '/kalkulator/zdolnosc-kredytowa', label: 'ZDOLNOŚĆ KREDYTOWA', desc: 'Oszacuj maksymalną kwotę kredytu.',   accent: '#e8963a', rgb: '232,150,58',  Icon: IconBank   },
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

        /* ── Premium tool cards (Pozostałe narzędzia) ── */
        .cs2-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }

        .cs2-card {
          position: relative;
          display: flex; flex-direction: column; align-items: center;
          padding: 30px 20px 30px;
          border-radius: 20px;
          text-decoration: none;
          overflow: hidden;
          background:
            radial-gradient(135% 95% at 50% -12%, rgba(var(--acc), 0.10), transparent 60%),
            #ffffff;
          border: 1px solid #e8eaed;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          transition: transform 0.25s cubic-bezier(.2,0,0,1), box-shadow 0.25s, border-color 0.25s;
        }
        [data-theme="dark"] .cs2-card {
          background:
            radial-gradient(135% 95% at 50% -12%, rgba(var(--acc), 0.18), transparent 58%),
            linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0) 42%),
            #0b0f15;
          border-color: rgba(255,255,255,0.07);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 12px 34px rgba(0,0,0,0.45);
        }
        .cs2-card::before {
          content: ''; position: absolute; top: 0; left: 16%; right: 16%; height: 1px;
          background: linear-gradient(90deg, transparent, rgb(var(--acc)), transparent);
          opacity: 0.85;
        }
        .cs2-card:hover {
          transform: translateY(-6px);
          border-color: rgba(var(--acc), 0.45);
          box-shadow: 0 18px 46px rgba(0,0,0,0.14), 0 0 40px rgba(var(--acc), 0.10);
        }
        [data-theme="dark"] .cs2-card:hover {
          box-shadow: 0 18px 46px rgba(0,0,0,0.55), 0 0 46px rgba(var(--acc), 0.16);
        }

        .cs2-num {
          position: absolute; top: 18px; left: 18px;
          width: 38px; height: 38px; border-radius: 50%;
          background: rgba(var(--acc), 0.13);
          color: rgb(var(--acc));
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-body); font-size: 0.8rem; font-weight: 700;
        }
        .cs2-icon {
          margin: 28px 0 20px;
          filter: drop-shadow(0 0 10px rgba(var(--acc), 0.35));
        }
        .cs2-title {
          font-family: var(--font-body); font-weight: 700;
          font-size: 1.08rem; letter-spacing: 0.5px; text-transform: uppercase;
          color: #111827; text-align: center; line-height: 1.25; margin: 0 0 12px;
        }
        [data-theme="dark"] .cs2-title { color: #ffffff; }
        .cs2-desc {
          font-family: var(--font-body); font-size: 0.82rem; line-height: 1.55;
          color: #6b7280; text-align: center; margin: 0 0 22px; max-width: 92%;
        }
        [data-theme="dark"] .cs2-desc { color: var(--muted); }
        .cs2-arrow {
          margin-top: auto;
          width: 46px; height: 46px; border-radius: 50%;
          border: 1.5px solid rgba(var(--acc), 0.5);
          color: rgb(var(--acc));
          display: flex; align-items: center; justify-content: center; font-size: 1.15rem;
          transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .cs2-card:hover .cs2-arrow {
          background: rgba(var(--acc), 0.12);
          box-shadow: 0 0 22px rgba(var(--acc), 0.25);
          transform: scale(1.06);
        }

        .cs2-head {
          font-family: var(--font-body); font-weight: 700;
          font-size: clamp(1.3rem, 2.4vw, 1.7rem); letter-spacing: -0.3px;
          margin: 0 0 26px; color: #111827;
        }
        [data-theme="dark"] .cs2-head { color: #ffffff; }

        @media (max-width: 660px) {
          .cs-feat-grid  { grid-template-columns: 1fr !important; }
          .cs-tools-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .cs2-grid      { grid-template-columns: repeat(2, 1fr) !important; }
          .cs-photo      { display: none !important; }
        }
        @media (max-width: 900px) and (min-width: 661px) {
          .cs-tools-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .cs2-grid      { grid-template-columns: repeat(3, 1fr) !important; }
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

        {/* Heading */}
        <h3 className="cs2-head">Pozostałe narzędzia</h3>

        {/* Tools */}
        <div className="cs2-grid">
          {TOOLS.map(({ href, label, desc, rgb, accent, Icon }, i) => (
            <Link key={href} href={href} className="cs2-card" style={{ ['--acc' as string]: rgb }}>
              <span className="cs2-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="cs2-icon">
                <Icon color={accent} />
              </span>
              <span className="cs2-title">{label}</span>
              <span className="cs2-desc">{desc}</span>
              <span className="cs2-arrow">→</span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
