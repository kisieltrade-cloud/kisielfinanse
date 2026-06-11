import Link from 'next/link';
import Image from 'next/image';

const TOOLS = [
  { href: '/kalkulator/procent-skladany', label: 'PROCENT SKŁADANY', desc: 'Oblicz potencjał wzrostu Twojego kapitału.', rgb: '59,130,246',  img: '/images/cards/procent-skladany.jpg' },
  { href: '/kalkulator/dca',              label: 'DCA',              desc: 'Średnia cena zakupu w czasie.',              rgb: '34,197,94',   img: '/images/cards/dca.jpg'              },
  { href: '/kalkulator/risk-reward',      label: 'RISK / REWARD',    desc: 'Oceń relację zysku do ryzyka.',              rgb: '245,158,11',  img: '/images/cards/risk-reward.jpg'      },
  { href: '/kalkulator/fire',             label: 'FIRE',             desc: 'Sprawdź, kiedy możesz osiągnąć niezależność.', rgb: '239,68,68',   img: '/images/cards/fire.jpg'             },
  { href: '/kalkulator/etf',              label: 'ETF VS LOKATA',    desc: 'Porównaj ETF z lokatą bankową.',             rgb: '139,92,246',  img: '/images/cards/etf.jpg'              },
  { href: '/kalkulator/wynagrodzenia',     label: 'BRUTTO - NETTO',     desc: 'Przelicz pensję brutto na netto.',     rgb: '14,165,164',  img: '/images/cards/wynagrodzenia.jpg'    },
  { href: '/kalkulator/skladka-zdrowotna', label: 'SKŁADKA ZDROWOTNA',  desc: 'Policz składkę na działalności.',      rgb: '46,125,79',   img: '/images/cards/skladka-zdrowotna.jpg' },
  { href: '/kalkulator/zdolnosc-kredytowa', label: 'ZDOLNOŚĆ KREDYTOWA', desc: 'Oszacuj maksymalną kwotę kredytu.',   rgb: '232,150,58',  img: '/images/cards/zdolnosc.jpg'         },
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

        /* ── Karty narzędzi ze zdjęciem (Pozostałe narzędzia) ── */
        .cs2-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }

        .cs2-card {
          position: relative; display: flex; flex-direction: column;
          border-radius: 20px; text-decoration: none; overflow: hidden;
          background: #ffffff; border: 1px solid #e8eaed;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          transition: transform 0.25s cubic-bezier(.2,0,0,1), box-shadow 0.25s, border-color 0.25s;
        }
        [data-theme="dark"] .cs2-card {
          background: #0b0f15; border-color: rgba(255,255,255,0.07);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 12px 34px rgba(0,0,0,0.45);
        }
        .cs2-card:hover {
          transform: translateY(-6px);
          border-color: rgba(var(--acc), 0.45);
          box-shadow: 0 18px 46px rgba(0,0,0,0.14), 0 0 40px rgba(var(--acc), 0.10);
        }
        [data-theme="dark"] .cs2-card:hover {
          box-shadow: 0 18px 46px rgba(0,0,0,0.55), 0 0 46px rgba(var(--acc), 0.16);
        }

        .cs2-photo { position: relative; width: 100%; height: 130px; overflow: hidden; }
        .cs2-photo::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 52%, #ffffff 100%);
        }
        [data-theme="dark"] .cs2-photo::after {
          background: linear-gradient(to bottom, rgba(11,15,21,0.05) 0%, rgba(11,15,21,0.5) 52%, #0b0f15 100%);
        }

        .cs2-num {
          position: absolute; top: 14px; left: 14px; z-index: 2;
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(0,0,0,0.42); color: #fff;
          border: 1px solid rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-body); font-size: 0.74rem; font-weight: 700;
        }

        .cs2-body {
          position: relative; z-index: 2; flex: 1;
          display: flex; flex-direction: column; align-items: center;
          padding: 4px 20px 26px; margin-top: -22px;
        }
        .cs2-title {
          font-family: var(--font-body); font-weight: 700;
          font-size: 1.02rem; letter-spacing: 0.5px; text-transform: uppercase;
          color: #111827; text-align: center; line-height: 1.25; margin: 0 0 10px;
        }
        [data-theme="dark"] .cs2-title { color: #ffffff; }
        .cs2-desc {
          font-family: var(--font-body); font-size: 0.82rem; line-height: 1.55;
          color: #6b7280; text-align: center; margin: 0 0 20px; max-width: 94%;
        }
        [data-theme="dark"] .cs2-desc { color: var(--muted); }
        .cs2-arrow {
          margin-top: auto;
          width: 44px; height: 44px; border-radius: 50%;
          border: 1.5px solid rgba(var(--acc), 0.5);
          color: rgb(var(--acc));
          display: flex; align-items: center; justify-content: center; font-size: 1.1rem;
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
          .cs2-grid      { grid-template-columns: repeat(2, 1fr) !important; }
          .cs-photo      { display: none !important; }
        }
        @media (max-width: 900px) and (min-width: 661px) {
          .cs2-grid      { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1020, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 36, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <h2 className="cs2-head" style={{
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
        <p className="cs2-head" style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 14px' }}>
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
              <p className="cs2-head" style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '0.3px', margin: '0 0 6px', lineHeight: 1.2 }}>
                KREDYT GOTÓWKOWY
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--muted)', margin: '0 0 auto' }}>
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
              <p className="cs2-head" style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '0.3px', margin: '0 0 6px', lineHeight: 1.2 }}>
                KALKULATOR HIPOTECZNY
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--muted)', margin: '0 0 auto' }}>
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
          {TOOLS.map(({ href, label, desc, rgb, img }, i) => (
            <Link key={href} href={href} className="cs2-card" style={{ ['--acc' as string]: rgb }}>
              <div className="cs2-photo">
                <Image src={img} alt={label} fill sizes="(max-width: 660px) 50vw, (max-width: 900px) 33vw, 240px" style={{ objectFit: 'cover' }} />
                <span className="cs2-num">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className="cs2-body">
                <span className="cs2-title">{label}</span>
                <span className="cs2-desc">{desc}</span>
                <span className="cs2-arrow">→</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
