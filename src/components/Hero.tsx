import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import HeroArticleRotator from '@/components/HeroArticleRotator';
import AnimatedCounter from '@/components/AnimatedCounter';


export default async function Hero() {
  const allPosts = await getAllPosts();
  const recentPosts = allPosts.filter((p) => p.published).slice(0, 6);
  return (
    <section className="hero" id="home" style={{ overflow: 'hidden', position: 'relative' }}>

      {/* ── Layer 1: grid ── */}
      <div className="hero-grid" />

      {/* ── Layer 2: hero background image ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-bg.png"
          alt=""
          aria-hidden="true"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center right',
            position: 'absolute', inset: 0,
            opacity: 0.55,
          }}
        />
        {/* Gradient overlay: dark left (tekst czytelny) → fade → bg right */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(3,5,8,0.97) 0%, rgba(3,5,8,0.88) 35%, rgba(3,5,8,0.55) 58%, var(--bg) 78%, var(--bg) 100%)',
          zIndex: 2,
        }} />
        {/* Bottom fade */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, transparent 60%, var(--bg) 100%)',
          zIndex: 3,
        }} />
      </div>

      {/* ── Layer 3: glow accents ── */}
      <div className="hero-glow-1" style={{ zIndex: 1 }} />
      <div className="hero-glow-2" style={{ zIndex: 1 }} />

      {/* ── LEFT COLUMN ── */}
      <div className="hero-content" style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

        {/* Headline */}
        <div style={{ marginBottom: 28 }} aria-hidden="true">
          {['FINANSE.', 'WIEDZA.', 'WOLNOŚĆ.'].map((word, i) => (
            <div key={word} style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.2rem, 7vw, 5.6rem)',
              fontWeight: 800,
              lineHeight: 0.92,
              letterSpacing: '-2px',
              color: i === 1 ? 'transparent' : 'var(--text)',
              backgroundImage: i === 1
                ? 'linear-gradient(90deg, #00f5d4, #7c3aed)'
                : 'none',
              WebkitBackgroundClip: i === 1 ? 'text' : undefined,
              backgroundClip: i === 1 ? 'text' : undefined,
              marginBottom: 6,
            }}>
              {word}
            </div>
          ))}
        </div>

        {/* Visually hidden H1 for SEO */}
        <h1 className="seo-only">
          KisielFinanse - Edukacja finansowa | Trading, Krypto, Oszczędzanie
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

        {/* Mini stats */}
        <div className="hero-mini-stats">
          <div className="hero-mini-stat">
            <span className="hero-mini-val"><AnimatedCounter target={9} /></span>
            <span className="hero-mini-label">Lat doświadczenia</span>
          </div>
        </div>
      </div>

      <HeroArticleRotator posts={recentPosts} />

    </section>
  );
}
