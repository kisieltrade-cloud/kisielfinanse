import Link from 'next/link';
import Image from 'next/image';
import AnimatedCounter from '@/components/AnimatedCounter';
import HeroArticles from '@/components/HeroArticles';

function IcoStar() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" stroke="#c9a227" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="19,4.5 23.1,14 33.4,14.7 25.9,22 28.3,32.1 19,26.8 9.7,32.1 12.1,22 4.6,14.7 14.9,14" />
    </svg>
  );
}

export default async function Hero() {
  return (
    <section className="hero" id="home" style={{ overflow: 'hidden', position: 'relative' }}>

      {/* ── Layer 1: grid ── */}
      <div className="hero-grid" />



      {/* ── Layer 2: laptop/phone — dekoracja (next/image, ukryta na mobile dla LCP) ── */}
      <div className="hero-laptop-deco" style={{
        position: 'absolute',
        top: '50%', left: '24%',
        transform: 'translate(-50%, -50%)',
        width: '42%',
        pointerEvents: 'none', zIndex: 0,
      }}>
        <Image
          src="/hero-laptop.png"
          alt=""
          aria-hidden="true"
          width={1536}
          height={1024}
          sizes="(max-width: 900px) 1px, 45vw"
          style={{
            width: '100%',
            height: 'auto',
            opacity: 0.45,
            display: 'block',
            maskImage: 'radial-gradient(ellipse 85% 80% at 50% 50%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 85% 80% at 50% 50%, black 40%, transparent 100%)',
          }}
        />
      </div>

      {/* ── Layer 3: glow accents ── */}
      <div className="hero-glow-1" style={{ zIndex: 1 }} />
      <div className="hero-glow-2" style={{ zIndex: 1 }} />

      {/* ── LEFT COLUMN ── */}
      <div className="hero-content" style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

        {/* Headline — H1 widoczny dla użytkownika i Google */}
        <h1 style={{ marginBottom: 28, fontStyle: 'normal' }}>
          {['FINANSE.', 'WIEDZA.', 'WOLNOŚĆ.'].map((word, i) => (
            <span key={word} style={{
              display: 'block',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.2rem, 7vw, 5.6rem)',
              fontWeight: 800,
              lineHeight: 0.92,
              letterSpacing: '-2px',
              color: i === 1 ? 'transparent' : 'var(--text)',
              backgroundImage: i === 1
                ? 'linear-gradient(90deg, #c9a227, #e8963a)'
                : 'none',
              WebkitBackgroundClip: i === 1 ? 'text' : undefined,
              backgroundClip: i === 1 ? 'text' : undefined,
              marginBottom: 6,
            }}>
              {word}
            </span>
          ))}
        </h1>

        <p className="hero-desc">
          Świat się zmienia, rynki reagują, pieniądze się poruszają. Trading,
          krypto, oszczędzanie, geopolityka - tu znajdziesz wiedzę, która
          naprawdę robi różnicę. Bo wolność finansowa zaczyna się od rozumienia.
        </p>

        <div className="hero-actions">
          <Link href="/blog" className="btn-primary">
            ZACZNIJ SIĘ UCZYĆ
          </Link>
          <Link href="/o-mnie" className="btn-ghost">
            O MNIE →
          </Link>
        </div>

        {/* Mini stat cards */}
        <style>{`
          .hsc-row {
            display: flex;
            gap: 14px;
            margin-top: 36px;
            animation: fadeInUp 0.8s 0.6s ease both;
            flex-wrap: wrap;
          }
          .hsc-card {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 22px 22px 20px;
            border-radius: 18px;
            overflow: hidden;
            min-width: 148px;
            background:
              radial-gradient(135% 90% at 50% -10%, rgba(var(--hsc), 0.20), transparent 58%),
              linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0) 42%),
              #0b0f15;
            border: 1px solid rgba(255,255,255,0.07);
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 12px 34px rgba(0,0,0,0.5);
            transition: transform 0.25s cubic-bezier(.2,0,0,1), box-shadow 0.25s, border-color 0.25s;
          }
          .hsc-card::before {
            content: '';
            position: absolute;
            top: 0; left: 14%; right: 14%; height: 1px;
            background: linear-gradient(90deg, transparent, rgb(var(--hsc)), transparent);
            opacity: 0.9;
          }
          .hsc-card:hover {
            transform: translateY(-5px);
            border-color: rgba(var(--hsc), 0.35);
            box-shadow: 0 18px 46px rgba(0,0,0,0.55), 0 0 46px rgba(var(--hsc), 0.14);
          }
          .hsc-badge {
            position: absolute; top: 13px; left: 13px;
            width: 30px; height: 30px; border-radius: 50%;
            background: rgba(var(--hsc), 0.14);
            color: rgb(var(--hsc));
            display: flex; align-items: center; justify-content: center;
            font-family: var(--font-body); font-size: 0.68rem; font-weight: 700;
          }
          .hsc-icon {
            margin: 20px 0 12px;
            filter: drop-shadow(0 0 12px rgba(var(--hsc), 0.45));
          }
          .hsc-val {
            font-family: var(--font-display);
            font-size: 2.8rem;
            font-weight: 800;
            color: rgb(var(--hsc));
            line-height: 1;
            letter-spacing: -1px;
            margin-bottom: 8px;
          }
          .hsc-label {
            font-family: var(--font-mono);
            font-size: 0.56rem;
            color: var(--muted);
            letter-spacing: 1.8px;
            text-transform: uppercase;
            text-align: center;
            line-height: 1.5;
          }
        `}</style>
        <div className="hsc-row">
          <div className="hsc-card" style={{ ['--hsc' as string]: '201,162,39' }}>
            <span className="hsc-badge">01</span>
            <span className="hsc-icon"><IcoStar /></span>
            <span className="hsc-val"><AnimatedCounter target={9} /></span>
            <span className="hsc-label">Lat<br/>doświadczenia</span>
          </div>
        </div>
      </div>

      <HeroArticles />

    </section>
  );
}
