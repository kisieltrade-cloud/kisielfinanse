import Link from 'next/link';
import Image from 'next/image';

/**
 * Sekcja narzędzi tradingowych na stronie głównej. Trading jest rdzeniem serwisu,
 * więc stoi nad kalkulatorami finansowymi. Klasy mają własny prefiks tt-, żeby sekcja
 * nie zależała od stylów CalcSection, które są wstrzykiwane przez inny komponent.
 */

const TOOLS = [
  {
    href: '/trener-formacji',
    label: 'TRENER FORMACJI',
    desc: 'Sprawdź, czy rozpoznasz formację na wykresie.',
    rgb: '201,162,39',
    img: '/images/blog/covers/chess-strategy.jpg',
  },
  {
    href: '/formacje-tradingowe',
    label: 'ENCYKLOPEDIA FORMACJI',
    desc: '16 formacji narysowanych i wyjaśnionych.',
    rgb: '59,130,246',
    img: '/images/blog/covers/trading-chart2.jpg',
  },
  {
    href: '/kreator-planu-tradingowego',
    label: 'KREATOR PLANU',
    desc: 'Pięć kroków do spisanych zasad handlu.',
    rgb: '34,197,94',
    img: '/images/blog/covers/numbers-paper.jpg',
  },
  {
    href: '/dziennik-tradera',
    label: 'DZIENNIK TRADERA',
    desc: 'Zapisuj transakcje i licz statystyki.',
    rgb: '139,92,246',
    img: '/images/blog/covers/calc-notebook.jpg',
  },
  {
    href: '/kalkulator/wielkosc-pozycji',
    label: 'WIELKOŚĆ POZYCJI',
    desc: 'Ile kupić, żeby ryzykować tylko 1-2%.',
    rgb: '232,150,58',
    img: '/images/blog/covers/calc-pen.jpg',
  },
  {
    href: '/kalkulator/risk-reward',
    label: 'RISK / REWARD',
    desc: 'Oceń relację zysku do ryzyka przed wejściem.',
    rgb: '245,158,11',
    img: '/images/cards/risk-reward.jpg',
  },
];

export default function TradingToolsSection() {
  return (
    <section style={{ background: 'var(--bg)', padding: 'clamp(48px, 7vw, 88px) 0 0' }}>
      <style>{`
        .tt-feat {
          display: flex; overflow: hidden;
          border-radius: 20px; min-height: 240px;
          position: relative; text-decoration: none; color: inherit;
          background: #ffffff; border: 1px solid #e8eaed;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07), 0 8px 32px rgba(0,0,0,0.05);
          transition: transform 0.22s cubic-bezier(.2,0,.0,1), box-shadow 0.22s;
        }
        [data-theme="dark"] .tt-feat {
          background: var(--surface);
          border-color: rgba(255,255,255,0.06);
          box-shadow: 0 2px 12px rgba(0,0,0,0.3);
        }
        .tt-feat:hover { transform: translateY(-5px); box-shadow: 0 8px 32px rgba(0,0,0,0.13), 0 20px 60px rgba(0,0,0,0.08); }
        .tt-feat:hover .tt-arrow { transform: scale(1.08); }
        .tt-arrow { transition: transform 0.2s; }

        .tt-fade { background: linear-gradient(to right, #ffffff 0%, transparent 40%); }
        [data-theme="dark"] .tt-fade { background: linear-gradient(to right, #080d14 0%, transparent 40%); }

        .tt-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }

        .tt-card {
          position: relative; display: flex; flex-direction: column;
          border-radius: 20px; text-decoration: none; overflow: hidden;
          background: #ffffff; border: 1px solid #e8eaed;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          transition: transform 0.25s cubic-bezier(.2,0,0,1), box-shadow 0.25s, border-color 0.25s;
        }
        [data-theme="dark"] .tt-card {
          background: #0b0f15; border-color: rgba(255,255,255,0.07);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 12px 34px rgba(0,0,0,0.45);
        }
        .tt-card:hover {
          transform: translateY(-6px);
          border-color: rgba(var(--acc), 0.45);
          box-shadow: 0 18px 46px rgba(0,0,0,0.14), 0 0 40px rgba(var(--acc), 0.10);
        }
        [data-theme="dark"] .tt-card:hover {
          box-shadow: 0 18px 46px rgba(0,0,0,0.55), 0 0 46px rgba(var(--acc), 0.16);
        }

        .tt-photo { position: relative; width: 100%; height: 130px; overflow: hidden; }
        .tt-photo::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 52%, #ffffff 100%);
        }
        [data-theme="dark"] .tt-photo::after {
          background: linear-gradient(to bottom, rgba(11,15,21,0.05) 0%, rgba(11,15,21,0.5) 52%, #0b0f15 100%);
        }

        .tt-body {
          position: relative; z-index: 2; flex: 1;
          display: flex; flex-direction: column; align-items: center;
          padding: 4px 20px 26px; margin-top: -22px;
        }
        .tt-title {
          font-family: var(--font-body); font-weight: 700;
          font-size: 1.02rem; letter-spacing: 0.5px; text-transform: uppercase;
          color: #111827; text-align: center; line-height: 1.25; margin: 0 0 10px;
        }
        [data-theme="dark"] .tt-title { color: #ffffff; }
        .tt-desc {
          font-family: var(--font-body); font-size: 0.82rem; line-height: 1.55;
          color: #6b7280; text-align: center; margin: 0 0 20px; max-width: 94%;
        }
        [data-theme="dark"] .tt-desc { color: var(--muted); }
        .tt-circle {
          margin-top: auto;
          width: 44px; height: 44px; border-radius: 50%;
          border: 1.5px solid rgba(var(--acc), 0.5);
          color: rgb(var(--acc));
          display: flex; align-items: center; justify-content: center; font-size: 1.1rem;
          transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .tt-card:hover .tt-circle {
          background: rgba(var(--acc), 0.12);
          box-shadow: 0 0 22px rgba(var(--acc), 0.25);
          transform: scale(1.06);
        }

        .tt-head { font-family: var(--font-body); font-weight: 700; color: #111827; }
        [data-theme="dark"] .tt-head { color: #ffffff; }

        @media (max-width: 660px) {
          .tt-feat-grid { grid-template-columns: 1fr !important; }
          .tt-grid      { grid-template-columns: repeat(2, 1fr) !important; }
          .tt-featphoto { display: none !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1020, margin: '0 auto', padding: '0 24px' }}>

        <div style={{ marginBottom: 36, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <h2 className="tt-head" style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.3px',
            margin: 0,
            lineHeight: 1.1,
          }}>
            Warsztat tradera
          </h2>
          <Link href="/narzedzia-tradera" style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
            color: '#c9a227', textDecoration: 'none', letterSpacing: '1px',
            fontWeight: 700, whiteSpace: 'nowrap',
          }}>
            Wszystkie narzędzia →
          </Link>
        </div>

        <p className="tt-head" style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 14px' }}>
          Zacznij tutaj
        </p>

        <div className="tt-feat-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>

          <Link href="/naucz-sie-tradowac" className="tt-feat">
            <div style={{ flex: 1, padding: '32px 28px 28px', display: 'flex', flexDirection: 'column' }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%', background: 'rgba(201,162,39,0.14)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700, color: '#c9a227', marginBottom: 20,
              }}>01</div>
              <p className="tt-head" style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '0.3px', margin: '0 0 6px', lineHeight: 1.2 }}>
                NAUCZ SIĘ TRADOWAĆ
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--muted)', margin: '0 0 auto' }}>
                Mapa nauki od zera do pierwszej transakcji
              </p>
              <div style={{ paddingTop: 24 }}>
                <div className="tt-arrow" style={{ width: 42, height: 42, borderRadius: '50%', background: '#c9a227', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color: '#0a0a0a' }}>→</div>
              </div>
            </div>
            <div className="tt-featphoto" style={{ width: '44%', flexShrink: 0, position: 'relative' }}>
              <Image src="/images/blog/covers/trading-tablet.jpg" alt="Nauka tradingu" fill sizes="240px" style={{ objectFit: 'cover', objectPosition: 'center' }} />
              <div className="tt-fade" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
            </div>
          </Link>

          <Link href="/symulator-tradingu" className="tt-feat">
            <div style={{ flex: 1, padding: '32px 28px 28px', display: 'flex', flexDirection: 'column' }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%', background: 'rgba(59,130,246,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6', marginBottom: 20,
              }}>02</div>
              <p className="tt-head" style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '0.3px', margin: '0 0 6px', lineHeight: 1.2 }}>
                SYMULATOR TRADINGU
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--muted)', margin: '0 0 auto' }}>
                Handluj na świecach bez ryzyka
              </p>
              <div style={{ paddingTop: 24 }}>
                <div className="tt-arrow" style={{ width: 42, height: 42, borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color: '#fff' }}>→</div>
              </div>
            </div>
            <div className="tt-featphoto" style={{ width: '44%', flexShrink: 0, position: 'relative' }}>
              <Image src="/images/blog/covers/trading-chart.jpg" alt="Symulator tradingu" fill sizes="240px" style={{ objectFit: 'cover', objectPosition: 'center' }} />
              <div className="tt-fade" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
            </div>
          </Link>

        </div>

        <h3 className="tt-head" style={{ fontSize: 'clamp(1.3rem, 2.4vw, 1.7rem)', letterSpacing: '-0.3px', margin: '0 0 26px' }}>
          Ćwicz i licz ryzyko
        </h3>

        <div className="tt-grid">
          {TOOLS.map((t) => (
            <Link key={t.href} href={t.href} className="tt-card" style={{ ['--acc' as string]: t.rgb }}>
              <div className="tt-photo">
                <Image src={t.img} alt="" fill sizes="(max-width: 660px) 50vw, 320px" style={{ objectFit: 'cover' }} />
              </div>
              <div className="tt-body">
                <p className="tt-title">{t.label}</p>
                <p className="tt-desc">{t.desc}</p>
                <div className="tt-circle">→</div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
