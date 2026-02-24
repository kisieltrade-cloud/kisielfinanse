import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export default async function BlogSection() {
  const posts = await getAllPosts();
  const featured = posts[0];
  const rest = posts.slice(1, 3);

  if (!featured) return null;

  const tagClass: Record<string, string> = {
    strategia: 'tag-strategy',
    psychologia: 'tag-psychology',
    analiza: 'tag-analysis',
    'risk management': 'tag-risk',
    rynek: 'tag-rynek',
  };

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

      <div className="blog-grid">
        {/* Featured */}
        <Link href={`/blog/${featured.slug}`} className="blog-card blog-card-feat">
          <span
            className={`blog-tag ${tagClass[featured.tag?.toLowerCase() ?? ''] ?? 'tag-strategy'}`}
          >
            {featured.tag}
          </span>
          <h3>{featured.title}</h3>
          <p>{featured.excerpt}</p>
          <div className="blog-meta">
            <span className="blog-date">{featured.date}</span>
            <div className="blog-arrow">↗</div>
          </div>
        </Link>

        {/* Side posts */}
        {rest.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
            <span
              className={`blog-tag ${tagClass[post.tag?.toLowerCase() ?? ''] ?? 'tag-strategy'}`}
            >
              {post.tag}
            </span>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <div className="blog-meta">
              <span className="blog-date">{post.date}</span>
              <div className="blog-arrow">↗</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
