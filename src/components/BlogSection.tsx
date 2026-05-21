import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import ReadTimeRing from '@/components/ReadTimeRing';

const TAG_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  strategia:        { color: '#c9a227', bg: 'rgba(201,162,39,0.08)',   label: 'Strategia' },
  psychologia:      { color: '#e8963a', bg: 'rgba(232,150,58,0.08)',  label: 'Psychologia' },
  analiza:          { color: '#f5c518', bg: 'rgba(245,197,24,0.08)',   label: 'Analiza' },
  'risk management':{ color: '#ff2d78', bg: 'rgba(255,45,120,0.08)',  label: 'Risk Management' },
  edukacja:         { color: '#c9a227', bg: 'rgba(201,162,39,0.08)',   label: 'Edukacja' },
  rynek:            { color: '#f5c518', bg: 'rgba(245,197,24,0.08)',   label: 'Rynek' },
};

const CARD_GRADIENTS = [
  'radial-gradient(ellipse at top left, rgba(201,162,39,0.07) 0%, transparent 60%)',
  'radial-gradient(ellipse at top right, rgba(232,150,58,0.07) 0%, transparent 60%)',
  'radial-gradient(ellipse at bottom left, rgba(255,45,120,0.06) 0%, transparent 60%)',
];

export default async function BlogSection() {
  const posts = await getAllPosts();
  const featured = posts[0];
  const rest = posts.slice(1, 3);

  if (!featured) return null;

  const getTag = (tag: string) =>
    TAG_CONFIG[tag?.toLowerCase()] ?? TAG_CONFIG['edukacja'];

  return (
    <section className="blog-section" id="blog">
      <div className="blog-header">
        <div>
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            OSTATNIE
            <br />
            <span className="gradient-text-pp">ARTYKUŁY</span>
          </h2>
        </div>
        <Link href="/blog" className="blog-view-all">
          Wszystkie artykuły →
        </Link>
      </div>

      <div className="blog-grid stagger-wrap">

        {/* FEATURED CARD */}
        <Link
          href={`/blog/${featured.slug}`}
          className="blog-card blog-card-feat"
          data-stagger
          style={{ background: `var(--bg) ${CARD_GRADIENTS[0]}` }}
        >
          {/* Cover image or decorative chart lines */}
          {featured.image ? (
            <div style={{ width: '100%', height: 180, overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.image}
                alt={featured.title}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          ) : (
            <div className="blog-card-deco" aria-hidden="true">
              <svg width="100%" height="60" viewBox="0 0 300 60" preserveAspectRatio="none">
                <path d="M0,45 L50,38 L100,42 L150,28 L200,32 L250,18 L300,10"
                  fill="none" stroke={getTag(featured.tag).color}
                  strokeWidth="1.5" strokeOpacity="0.25" />
                <path d="M0,55 L60,48 L120,52 L180,38 L240,35 L300,25"
                  fill="none" stroke={getTag(featured.tag).color}
                  strokeWidth="1" strokeOpacity="0.12" />
              </svg>
            </div>
          )}

          <div className="blog-card-body">
            <div className="blog-card-top">
              <span
                className="blog-tag-v2"
                style={{ color: getTag(featured.tag).color, background: getTag(featured.tag).bg }}
              >
                {featured.tag}
              </span>
              <ReadTimeRing readTime={featured.readTime ?? '7 min'} />
            </div>

            <h3 className="blog-card-title">{featured.title}</h3>
            <p className="blog-card-excerpt">{featured.excerpt}</p>

            <div className="blog-meta">
              <span className="blog-date">{featured.date}</span>
              <div className="blog-cta-link" style={{ color: getTag(featured.tag).color }}>
                Czytaj artykuł →
              </div>
            </div>
          </div>
        </Link>

        {/* SIDE CARDS */}
        {rest.map((post, i) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="blog-card"
            data-stagger
            style={{ background: `var(--bg) ${CARD_GRADIENTS[i + 1]}` }}
          >
            {post.image ? (
              <div style={{ width: '100%', height: 140, overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            ) : (
              <div className="blog-card-deco" aria-hidden="true">
                <svg width="100%" height="40" viewBox="0 0 200 40" preserveAspectRatio="none">
                  <path d="M0,30 L40,24 L80,28 L120,16 L160,20 L200,8"
                    fill="none" stroke={getTag(post.tag).color}
                    strokeWidth="1.5" strokeOpacity="0.2" />
                </svg>
              </div>
            )}

            <div className="blog-card-body">
              <div className="blog-card-top">
                <span
                  className="blog-tag-v2"
                  style={{ color: getTag(post.tag).color, background: getTag(post.tag).bg }}
                >
                  {post.tag}
                </span>
                <ReadTimeRing readTime={post.readTime ?? '7 min'} />
              </div>

              <h3 className="blog-card-title" style={{ fontSize: '1.15rem' }}>{post.title}</h3>
              <p className="blog-card-excerpt">{post.excerpt}</p>

              <div className="blog-meta">
                <span className="blog-date">{post.date}</span>
                <div className="blog-arrow">↗</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
