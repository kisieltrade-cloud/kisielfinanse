import Link from 'next/link';
import { getAllPosts, tagToSlug } from '@/lib/posts';

const TAG_CONFIG: Record<string, { color: string; bg: string }> = {
  trading:     { color: '#c9a227', bg: 'rgba(201,162,39,0.15)'  },
  inwestycje:  { color: '#f5c518', bg: 'rgba(245,197,24,0.15)'  },
  pieniadze:   { color: '#e8963a', bg: 'rgba(232,150,58,0.15)'  },
  psychologia: { color: '#a78bfa', bg: 'rgba(167,139,250,0.15)' },
  gospodarka:  { color: '#ff2d78', bg: 'rgba(255,45,120,0.15)'  },
};

const FALLBACK_GRAD: Record<string, string> = {
  trading:     'linear-gradient(135deg, #0d0a00 0%, #2a1f00 100%)',
  inwestycje:  'linear-gradient(135deg, #0d0c00 0%, #2a2500 100%)',
  pieniadze:   'linear-gradient(135deg, #0d0800 0%, #2a1500 100%)',
  psychologia: 'linear-gradient(135deg, #0a0814 0%, #1a1530 100%)',
  gospodarka:  'linear-gradient(135deg, #14000a 0%, #300020 100%)',
};

function getTag(tag: string) {
  return TAG_CONFIG[tagToSlug(tag)] ?? TAG_CONFIG['trading'];
}
function getFallback(tag: string) {
  return FALLBACK_GRAD[tagToSlug(tag)] ?? FALLBACK_GRAD['trading'];
}

export default async function HeroArticles() {
  const posts = await getAllPosts();
  const hero = posts[0];
  const cards = posts.slice(1, 4);

  if (!hero) return null;

  const ht = getTag(hero.tag);

  return (
    <div className="hero-articles">

      {/* ── BIG HERO CARD ── */}
      <Link href={`/blog/${hero.slug}`} className="hero-art-feat">
        {/* Background */}
        {hero.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hero.image} alt={hero.title} className="hero-art-feat-bg" />
        ) : (
          <div className="hero-art-feat-bg" style={{ background: getFallback(hero.tag) }}>
            <svg viewBox="0 0 600 280" preserveAspectRatio="none"
              style={{ width: '100%', height: '100%', opacity: 0.15 }}>
              <polyline points="0,220 90,170 180,195 280,120 370,145 460,75 560,95 600,40"
                fill="none" stroke={ht.color} strokeWidth="2.5" />
              <path d="M0,220 90,170 180,195 280,120 370,145 460,75 560,95 600,40 L600,280 L0,280 Z"
                fill={ht.color} opacity="0.07" />
            </svg>
          </div>
        )}

        {/* Overlay */}
        <div className="hero-art-feat-overlay" />

        {/* Content */}
        <div className="hero-art-feat-content">
          <div className="hero-art-feat-top">
            <span className="hero-art-tag"
              style={{ color: ht.color, background: ht.bg, borderColor: ht.color + '55' }}>
              {hero.tag.toUpperCase()}
            </span>
            <span className="hero-art-author">
              <span className="hero-art-dot" style={{ background: ht.color }} />
              {hero.author ?? 'Mateusz'}
            </span>
          </div>
          <h3 className="hero-art-feat-title">{hero.title}</h3>
          <span className="hero-art-date">{hero.date}</span>
        </div>
      </Link>

      {/* ── SMALLER CARDS ── */}
      {cards.length > 0 && (
        <div className="hero-art-cards">
          {cards.map((post) => {
            const t = getTag(post.tag);
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="hero-art-card">
                {/* Thumbnail */}
                <div className="hero-art-card-thumb">
                  {post.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.image} alt={post.title} className="hero-art-card-img" />
                  ) : (
                    <div className="hero-art-card-img" style={{ background: getFallback(post.tag) }}>
                      <svg viewBox="0 0 120 80" style={{ width: '100%', height: '100%', opacity: 0.2 }}>
                        <polyline points="0,60 24,44 48,52 72,28 96,36 120,10"
                          fill="none" stroke={t.color} strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}
                </div>
                {/* Text */}
                <div className="hero-art-card-body">
                  <span className="hero-art-card-author">
                    <span className="hero-art-dot" style={{ background: t.color }} />
                    {post.author ?? 'Mateusz'}
                  </span>
                  <p className="hero-art-card-title">{post.title}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
