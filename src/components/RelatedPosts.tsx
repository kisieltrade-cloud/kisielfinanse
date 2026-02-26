import Link from 'next/link';
import { PostMeta } from '@/lib/posts';

const TAG_CONFIG: Record<string, { color: string; bg: string }> = {
  strategia:         { color: '#00f5d4', bg: 'rgba(0,245,212,0.08)' },
  psychologia:       { color: '#b14aed', bg: 'rgba(177,74,237,0.08)' },
  analiza:           { color: '#f5c518', bg: 'rgba(245,197,24,0.08)' },
  'risk management': { color: '#ff2d78', bg: 'rgba(255,45,120,0.08)' },
  edukacja:          { color: '#00f5d4', bg: 'rgba(0,245,212,0.08)' },
  rynek:             { color: '#f5c518', bg: 'rgba(245,197,24,0.08)' },
};

const getTag = (tag: string) =>
  TAG_CONFIG[tag?.toLowerCase()] ?? { color: '#00f5d4', bg: 'rgba(0,245,212,0.08)' };

interface Props {
  currentSlug: string;
  currentTag: string;
  allPosts: PostMeta[];
}

export default function RelatedPosts({ currentSlug, currentTag, allPosts }: Props) {
  // First: same tag, then: any other posts — max 3
  const sameTag = allPosts.filter(p => p.slug !== currentSlug && p.tag === currentTag);
  const others  = allPosts.filter(p => p.slug !== currentSlug && p.tag !== currentTag);
  const related = [...sameTag, ...others].slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="related-section">
      <div className="related-header">
        <div className="section-label">// czytaj dalej</div>
        <h2 className="related-title">
          POWIĄZANE <span style={{ color: 'var(--cyan)' }}>ARTYKUŁY</span>
        </h2>
      </div>

      <div className="related-grid">
        {related.map((post) => {
          const t = getTag(post.tag);
          return (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="related-card">
              <div className="related-card-accent" style={{ background: t.color }} />
              <div className="related-card-body">
                <div className="related-card-top">
                  <span
                    className="blog-tag-v2"
                    style={{ color: t.color, background: t.bg }}
                  >
                    {post.tag}
                  </span>
                  <span className="blog-read-time">{post.readTime ?? '7 min'}</span>
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
