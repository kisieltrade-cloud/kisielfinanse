import Link from 'next/link';
import Image from 'next/image';
import { PostMeta, tagToSlug } from '@/lib/posts';
import { postUrl } from '@/lib/url';
import ReadTimeRing from '@/components/ReadTimeRing';

const TAG_CONFIG: Record<string, { color: string; bg: string }> = {
  trading:     { color: '#c9a227', bg: 'rgba(201,162,39,0.10)'  },
  inwestycje:  { color: '#f5c518', bg: 'rgba(245,197,24,0.10)'  },
  pieniadze:   { color: '#e8963a', bg: 'rgba(232,150,58,0.10)'  },
  psychologia: { color: '#a78bfa', bg: 'rgba(167,139,250,0.10)' },
  gospodarka:  { color: '#ff2d78', bg: 'rgba(255,45,120,0.10)'  },
};

const getTag = (tag: string) =>
  TAG_CONFIG[tagToSlug(tag)] ?? { color: '#c9a227', bg: 'rgba(201,162,39,0.10)' };

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
          PRZECZYTAJ <span style={{ color: 'var(--cyan)' }}>TEŻ</span>
        </h2>
      </div>

      <div className="related-grid">
        {related.map((post) => {
          const t = getTag(post.tag);
          return (
            <Link key={post.slug} href={postUrl(post)} className="related-card">
              {post.image ? (
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'top' }}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
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
