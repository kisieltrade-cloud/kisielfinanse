import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-grid" />
      <div className="hero-glow-1" />
      <div className="hero-glow-2" />

      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          AKTYWNY TRADER · TRANSPARENTNE WYNIKI
        </div>

        <h1 className="hero-h1">
          <span className="hero-h1-line1">TRADE</span>
          <span className="hero-h1-line2">SMARTER</span>
        </h1>

        <p className="hero-desc">
          Analiza rynkowa, strategie, które działają — i transparentne wyniki bez owijania w bawełnę.
          Dołącz do społeczności, która traktuje trading poważnie.
        </p>

        <div className="hero-actions">
          <Link href="#wyniki" className="btn-primary">
            Zobacz wyniki
          </Link>
          <Link href="/blog" className="btn-ghost">
            Blog <span>→</span>
          </Link>
        </div>
      </div>

      {/* Hero equity chart (decorative SVG) */}
      <div className="hero-chart">
        <svg width="400" height="260" viewBox="0 0 400 260">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00f5d4" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00f5d4" stopOpacity="0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <line x1="0" y1="65"  x2="400" y2="65"  stroke="rgba(0,245,212,0.07)" strokeWidth="1" />
          <line x1="0" y1="130" x2="400" y2="130" stroke="rgba(0,245,212,0.07)" strokeWidth="1" />
          <line x1="0" y1="195" x2="400" y2="195" stroke="rgba(0,245,212,0.07)" strokeWidth="1" />

          <path
            d="M0,195 L40,175 L80,162 L120,140 L160,118 L200,98 L240,80 L280,90 L320,60 L360,40 L400,22 L400,260 L0,260 Z"
            fill="url(#chartGrad)"
          />
          <path
            d="M0,195 L40,175 L80,162 L120,140 L160,118 L200,98 L240,80 L280,90 L320,60 L360,40 L400,22"
            fill="none"
            stroke="#00f5d4"
            strokeWidth="2.5"
            filter="url(#glow)"
          />

          <circle cx="400" cy="22" r="5" fill="#00f5d4" filter="url(#glow)" />
          <circle cx="400" cy="22" r="11" fill="rgba(0,245,212,0.15)" />

          <text x="8"   y="252" fill="rgba(90,100,120,0.8)" fontFamily="JetBrains Mono, monospace" fontSize="9">STY</text>
          <text x="128" y="252" fill="rgba(90,100,120,0.8)" fontFamily="JetBrains Mono, monospace" fontSize="9">MAJ</text>
          <text x="248" y="252" fill="rgba(90,100,120,0.8)" fontFamily="JetBrains Mono, monospace" fontSize="9">WRZ</text>
          <text x="370" y="252" fill="rgba(90,100,120,0.8)" fontFamily="JetBrains Mono, monospace" fontSize="9">STY</text>

          <text x="370" y="18" fill="#00f5d4" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="500">+183%</text>

          <rect x="0" y="0" width="400" height="260" fill="none" stroke="rgba(0,245,212,0.14)" strokeWidth="1" />
        </svg>
      </div>
    </section>
  );
}
