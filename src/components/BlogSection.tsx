import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, tagToSlug } from '@/lib/posts';
import { postUrl } from '@/lib/url';
import ReadTimeRing from '@/components/ReadTimeRing';

const TAG_CONFIG: Record<string, { color: string; bg: string }> = {
  trading:    { color: '#c9a227', bg: 'rgba(201,162,39,0.15)'  },
  inwestycje: { color: '#f5c518', bg: 'rgba(245,197,24,0.15)'  },
  pieniadze:  { color: '#e8963a', bg: 'rgba(232,150,58,0.15)'  },
  psychologia:{ color: '#a78bfa', bg: 'rgba(167,139,250,0.15)' },
  gospodarka: { color: '#ff2d78', bg: 'rgba(255,45,120,0.15)'  },
};

const FALLBACK_GRADIENTS: Record<string, string> = {
  trading:    'linear-gradient(135deg, #0d0a00 0%, #2a1f00 50%, #1a1200 100%)',
  inwestycje: 'linear-gradient(135deg, #0d0c00 0%, #2a2500 50%, #1a1800 100%)',
  pieniadze:  'linear-gradient(135deg, #0d0800 0%, #2a1500 50%, #1a0e00 100%)',
  psychologia:'linear-gradient(135deg, #0a0814 0%, #1a1530 50%, #100d20 100%)',
  gospodarka: 'linear-gradient(135deg, #14000a 0%, #300020 50%, #200015 100%)',
};

function getTag(tag: string) {
  return TAG_CONFIG[tagToSlug(tag)] ?? TAG_CONFIG['trading'];
}

function getFallbackGradient(tag: string) {
  return FALLBACK_GRADIENTS[tagToSlug(tag)] ?? FALLBACK_GRADIENTS['trading'];
}

export default async function BlogSection() {
  const posts = await getAllPosts();
  const hero = posts[0];
  const cards = posts.slice(1, 4);

  if (!hero) return null;

  const heroTag = getTag(hero.tag);

  return (
    <section className="news-section" id="blog">

      {/* Section header */}
      <div className="news-section-header">
        <h2 className="news-section-title">
          OSTATNIE <span style={{ color: '#c9a227' }}>ARTYKUŁY</span>
        </h2>
        <Link href="/blog" className="news-view-all">
          Wszystkie artykuły →
        </Link>
      </div>

      {/* ── HERO CARD ── */}
      <Link href={postUrl(hero)} className="news-hero">

        {/* Background */}
        {hero.image ? (
          <Image
            src={hero.image}
            alt={hero.title}
            fill
            priority
            className="news-hero-bg"
            style={{ objectFit: 'cover', objectPosition: 'top' }}
            sizes="(max-width: 768px) 100vw, 900px"
          />
        ) : (
          <div
            className="news-hero-bg"
            style={{ background: getFallbackGradient(hero.tag) }}
          >
            {/* SVG chart decoration for no-image fallback */}
            <svg
              viewBox="0 0 1200 480"
              preserveAspectRatio="none"
              style={{ width: '100%', height: '100%', opacity: 0.12 }}
            >
              <polyline
                points="0,380 150,310 300,340 480,230 640,270 800,160 960,190 1100,90 1200,50"
                fill="none"
                stroke={heroTag.color}
                strokeWidth="3"
              />
              <path
                d="M0,380 150,310 300,340 480,230 640,270 800,160 960,190 1100,90 1200,50 L1200,480 L0,480 Z"
                fill={heroTag.color}
                opacity="0.08"
              />
            </svg>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="news-hero-overlay" />

        {/* Content */}
        <div className="news-hero-content">
          <div className="news-hero-meta-top">
            <span
              className="news-tag-chip"
              style={{ color: heroTag.color, background: heroTag.bg, borderColor: heroTag.color + '55' }}
            >
              {hero.tag.toUpperCase()}
            </span>
            <span className="news-hero-author">
              <Image
                src="/images/profile.png"
                alt="Mateusz"
                width={40}
                height={40}
                className="news-author-avatar"
              />
              {hero.author ?? 'Mateusz'}
            </span>
          </div>

          <h2 className="news-hero-title">{hero.title}</h2>

          <div className="news-hero-bottom">
            <span className="news-hero-date">{hero.date}</span>
            <ReadTimeRing readTime={hero.readTime ?? '7 min'} />
          </div>
        </div>
      </Link>

      {/* ── SMALLER CARDS ── */}
      {cards.length > 0 && (
        <div className="news-cards-grid">
          {cards.map((post) => {
            const t = getTag(post.tag);
            return (
              <Link key={post.slug} href={postUrl(post)} className="news-card">

                {/* Thumbnail */}
                <div className="news-card-thumb">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="news-card-thumb-img"
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                    />
                  ) : (
                    <div
                      className="news-card-thumb-fallback"
                      style={{ background: getFallbackGradient(post.tag) }}
                    >
                      <svg viewBox="0 0 300 180" style={{ width: '100%', height: '100%', opacity: 0.2 }}>
                        <polyline
                          points="0,140 60,110 120,125 180,80 240,95 300,40"
                          fill="none"
                          stroke={t.color}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  )}
                  <span
                    className="news-card-tag"
                    style={{ color: '#ffffff', background: 'rgba(0,0,0,0.55)', border: 'none' }}
                  >
                    {post.tag}
                  </span>
                </div>

                {/* Text */}
                <div className="news-card-body">
                  <span className="news-card-author">
                    <Image
                      src="/images/profile.png"
                      alt="Mateusz"
                      width={36}
                      height={36}
                      className="news-author-avatar"
                    />
                    {post.author ?? 'Mateusz'}
                  </span>
                  <h3 className="news-card-title">{post.title}</h3>
                  <div className="news-card-footer">
                    <span className="news-card-date">{post.date}</span>
                    <ReadTimeRing readTime={post.readTime ?? '7 min'} />
                  </div>
                </div>

              </Link>
            );
          })}
        </div>
      )}

    </section>
  );
}
