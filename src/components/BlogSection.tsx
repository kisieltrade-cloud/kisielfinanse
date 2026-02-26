import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

const TAG_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  strategia:        { color: '#00f5d4', bg: 'rgba(0,245,212,0.08)',   label: 'Strategia' },
  psychologia:      { color: '#b14aed', bg: 'rgba(177,74,237,0.08)',  label: 'Psychologia' },
  analiza:          { color: '#f5c518', bg: 'rgba(245,197,24,0.08)',   label: 'Analiza' },
  'risk management':{ color: '#ff2d78', bg: 'rgba(255,45,120,0.08)',  label: 'Risk Management' },
  edukacja:         { color: '#00f5d4', bg: 'rgba(0,245,212,0.08)',   label: 'Edukacja' },
  rynek:            { color: '#f5c518', bg: 'rgba(245,197,24,0.08)',   label: 'Rynek' },
};

const CARD_GRADIENTS = [
  'radial-gradient(ellipse at top left, rgba(0,245,212,0.07) 0%, transparent 60%)',
  'radial-gradient(ellipse at top right, rgba(177,74,237,0.07) 0%, transparent 60%)',
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
          <div className="section-label">// wiedza i analiza</div>
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
          {/* Decorative chart lines */}
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

          <div className="blog-card-body">
            <div className="blog-card-top">
              <span
                className="blog-tag-v2"
                style={{ color: getTag(featured.tag).color, background: getTag(featured.tag).bg }}
              >
                {featured.tag}
              </span>
              <span className="blog-read-time">{featured.readTime ?? '7 min'}</span>
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
            <div className="blog-card-deco" aria-hidden="true">
              <svg width="100%" height="40" viewBox="0 0 200 40" preserveAspectRatio="none">
                <path d="M0,30 L40,24 L80,28 L120,16 L160,20 L200,8"
                  fill="none" stroke={getTag(post.tag).color}
                  strokeWidth="1.5" strokeOpacity="0.2" />
              </svg>
            </div>

            <div className="blog-card-body">
              <div className="blog-card-top">
                <span
                  className="blog-tag-v2"
                  style={{ color: getTag(post.tag).color, background: getTag(post.tag).bg }}
                >
                  {post.tag}
                </span>
                <span className="blog-read-time">{post.readTime ?? '7 min'}</span>
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
