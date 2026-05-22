import Link from 'next/link';
import { PostMeta } from '@/lib/posts';
import ReadTimeRing from '@/components/ReadTimeRing';

const TAG_CONFIG: Record<string, { color: string; bg: string }> = {
  strategia:         { color: '#c9a227', bg: 'rgba(201,162,39,0.08)' },
  psychologia:       { color: '#b14aed', bg: 'rgba(177,74,237,0.08)' },
  analiza:           { color: '#f5c518', bg: 'rgba(245,197,24,0.08)' },
  'risk management': { color: '#ff2d78', bg: 'rgba(255,45,120,0.08)' },
  edukacja:          { color: '#00f5d4', bg: 'rgba(0,245,212,0.08)' },
  rynek:             { color: '#f5c518', bg: 'rgba(245,197,24,0.08)' },
  finanse:           { color: '#b14aed', bg: 'rgba(177,74,237,0.08)' },
  geopolityka:       { color: '#ff2d78', bg: 'rgba(255,45,120,0.08)' },
  krypto:            { color: '#f5a623', bg: 'rgba(245,166,35,0.08)' },
  trading:           { color: '#c9a227', bg: 'rgba(201,162,39,0.08)' },
  oszczędzanie:      { color: '#c9a227', bg: 'rgba(201,162,39,0.08)' },
};

const getTag = (tag: string) =>
  TAG_CONFIG[tag?.toLowerCase()] ?? { color: '#c9a227', bg: 'rgba(201,162,39,0.08)' };

interface Props {
  currentSlug: string;
  currentTag: string;
  allPosts: PostMeta[];
}

export default function RelatedPosts({ currentSlug, currentTag, allPosts }: Props) {
  // First: same tag, then: any other posts - max 3
  const sameTag = allPosts.filter(p => p.slug !== currentSlug && p.tag === currentTag);
  const others  = allPosts.filter(p => p.slug !== currentSlug && p.tag !== currentTag);
  const related = [...sameTag, ...others].slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="related-section">
      <div className="related-header">
        <h2 className="related-title">
          POWIĄZANE <span style={{ color: 'var(--cyan)' }}>ARTYKUŁY</span>
        </h2>
      </div>

      <div className="related-grid">
        {related.map((post) => {
          const t = getTag(post.tag);
          return (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="related-card">
              {post.image ? (
                <div style={{ width: '100%', height: 120, overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              ) : (
                <div className="related-card-accent" style={{ background: t.color }} />
              )}
              <div className="related-card-body">
                <div className="related-card-top">
                  <span
                    className="blog-tag-v2"
                    style={{ color: t.color, background: t.bg }}
                  >
                    {post.tag}
                  </span>
                  <ReadTimeRing readTime={post.readTime ?? '7 min'} size={28} />
                </div>
                <h3 className="related-card-title">{post.title}</h3>
                <p className="related-card-excerpt">{post.excerpt}</p>
                <div className="blog-meta" style={{ marginTop: 'auto' }}>
                  <span className="blog-date">{post.date}</span>
                  <div className="blog-arrow" style={{ borderColor: `${t.color}44`, color: t.color }}>↗</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
