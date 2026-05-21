'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PostMeta } from '@/lib/posts';
import ReadTimeRing from '@/components/ReadTimeRing';

const TAG_CONFIG: Record<string, { color: string; bg: string }> = {
  strategia:         { color: '#00f5d4', bg: 'rgba(0,245,212,0.08)' },
  psychologia:       { color: '#b14aed', bg: 'rgba(177,74,237,0.08)' },
  analiza:           { color: '#f5c518', bg: 'rgba(245,197,24,0.08)' },
  'risk management': { color: '#ff2d78', bg: 'rgba(255,45,120,0.08)' },
  edukacja:          { color: '#00f5d4', bg: 'rgba(0,245,212,0.08)' },
  rynek:             { color: '#f5c518', bg: 'rgba(245,197,24,0.08)' },
  krypto:            { color: '#f5a623', bg: 'rgba(245,166,35,0.08)' },
  oszczędzanie:      { color: '#00f5d4', bg: 'rgba(0,245,212,0.08)' },
  geopolityka:       { color: '#ff2d78', bg: 'rgba(255,45,120,0.08)' },
  trading:           { color: '#00f5d4', bg: 'rgba(0,245,212,0.08)' },
  finanse:           { color: '#b14aed', bg: 'rgba(177,74,237,0.08)' },
};

const getTag = (tag: string) =>
  TAG_CONFIG[tag?.toLowerCase()] ?? { color: '#00f5d4', bg: 'rgba(0,245,212,0.08)' };

interface Props {
  posts: PostMeta[];
}

export default function BlogList({ posts }: Props) {
  const [active, setActive] = useState('Wszystkie');

  // Collect unique tags
  const tags = ['Wszystkie', ...Array.from(new Set(posts.map(p => p.tag))).sort()];

  const filtered = active === 'Wszystkie'
    ? posts
    : posts.filter(p => p.tag === active);

  return (
    <>
      {/* Tag filters */}
      <div className="blog-filters">
        {tags.map(tag => (
          <button
            key={tag}
            className={`blog-filter-btn${active === tag ? ' active' : ''}`}
            onClick={() => setActive(tag)}
            style={active === tag && tag !== 'Wszystkie' ? {
              color: getTag(tag).color,
              borderColor: getTag(tag).color,
              background: getTag(tag).bg,
            } : {}}
          >
            {tag}
            {tag !== 'Wszystkie' && (
              <span className="blog-filter-count">
                {posts.filter(p => p.tag === tag).length}
              </span>
            )}
          </button>
        ))}
        <span className="blog-filter-total">
          {filtered.length} {filtered.length === 1 ? 'artykuł' : 'artykułów'}
        </span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', padding: '40px 0' }}>
          Brak artykułów w tej kategorii.
        </p>
      ) : (
        <div className="blog-all-grid">
          {filtered.map((post, i) => {
            const t = getTag(post.tag);
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="blog-card blog-card-v2"
                style={{
                  animationDelay: `${i * 60}ms`,
                  background: `var(--bg)`,
                }}
              >
                {/* Top gradient accent */}
                <div
                  className="blog-card-accent"
                  style={{ background: `linear-gradient(90deg, ${t.color}22, transparent)` }}
                />

                {/* Cover image or deco chart line */}
                {post.image ? (
                  <div style={{ width: '100%', height: 160, overflow: 'hidden', borderRadius: '12px 12px 0 0', marginBottom: 0 }}>
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
                      <path
                        d={`M0,32 L40,${24 + (i % 3) * 4} L80,${28 - (i % 2) * 6} L120,${16 + (i % 4) * 3} L160,${20 - (i % 3) * 4} L200,${8 + (i % 2) * 6}`}
                        fill="none"
                        stroke={t.color}
                        strokeWidth="1.5"
                        strokeOpacity="0.2"
                      />
                    </svg>
                  </div>
                )}

                <div className="blog-card-body">
                  <div className="blog-card-top">
                    <span
                      className="blog-tag-v2"
                      style={{ color: t.color, background: t.bg }}
                    >
                      {post.tag}
                    </span>
                    <ReadTimeRing readTime={post.readTime ?? '7 min'} />
                  </div>

                  <h3 className="blog-card-title" style={{ fontSize: '1.2rem' }}>
                    {post.title}
                  </h3>
                  <p className="blog-card-excerpt">{post.excerpt}</p>

                  <div className="blog-meta">
                    <span className="blog-date">{post.date}</span>
                    <div className="blog-arrow" style={{ borderColor: `${t.color}44`, color: t.color }}>↗</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
