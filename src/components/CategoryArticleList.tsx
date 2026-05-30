'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PostMeta } from '@/lib/posts';
import { postUrl } from '@/lib/url';

const TAG_CONFIG: Record<string, { color: string; bg: string }> = {
  trading:     { color: '#c9a227', bg: 'rgba(201,162,39,0.10)' },
  inwestycje:  { color: '#f5c518', bg: 'rgba(245,197,24,0.10)' },
  pieniadze:   { color: '#e8963a', bg: 'rgba(232,150,58,0.10)' },
  psychologia: { color: '#a78bfa', bg: 'rgba(167,139,250,0.10)' },
  gospodarka:  { color: '#ff2d78', bg: 'rgba(255,45,120,0.10)' },
};

function slugifyTag(tag: string) {
  return tag.toLowerCase()
    .replace(/ą/g,'a').replace(/ć/g,'c').replace(/ę/g,'e')
    .replace(/ł/g,'l').replace(/ń/g,'n').replace(/ó/g,'o')
    .replace(/ś/g,'s').replace(/ź/g,'z').replace(/ż/g,'z')
    .replace(/\s+/g,'-');
}

const getTag = (tag: string) =>
  TAG_CONFIG[slugifyTag(tag)] ?? { color: '#c9a227', bg: 'rgba(201,162,39,0.10)' };

interface Props {
  posts: PostMeta[];
  categoryColor: string;
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export default function CategoryArticleList({ posts, categoryColor }: Props) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const filtered = posts.filter(p => {
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      (p.excerpt ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Filter bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 20,
        borderBottom: '2px solid var(--border-subtle)',
        marginBottom: 4,
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.92rem',
            fontWeight: 700,
            color: 'var(--text)',
            borderBottom: `2px solid ${categoryColor}`,
            paddingBottom: 2,
          }}>
            Wszystkie
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--muted)',
          }}>
            {filtered.length} {filtered.length === 1 ? 'artykuł' : filtered.length < 5 ? 'artykuły' : 'artykułów'}
          </span>
        </div>

        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          padding: '7px 12px',
          minWidth: 180,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="search"
            placeholder="szukaj..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text)',
              width: '100%',
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}>
              ×
            </button>
          )}
        </div>
      </div>

      {/* Article list */}
      {filtered.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', padding: '40px 0' }}>
          Brak wyników dla &bdquo;{query}&rdquo;.
        </p>
      ) : (
        <div className="cat-list">
          {filtered.map(post => {
            const t = getTag(post.tag);
            return (
              <Link key={post.slug} href={postUrl(post)} className="cat-list-card">
                {/* Image */}
                <div className="cat-list-img">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                      sizes="180px"
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${t.color}22, ${t.color}08)` }} />
                  )}
                </div>

                {/* Body */}
                <div className="cat-list-body">
                  <div className="cat-list-meta">
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      color: t.color,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}>
                      {post.tag}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>
                      <ClockIcon />
                      {post.readTime ?? '7 min'}
                    </span>
                  </div>

                  <h3 className="cat-list-title">{post.title}</h3>
                  <p className="cat-list-excerpt">{post.excerpt}</p>

                  <div className="cat-list-footer">
                    <span className="cat-list-date">{post.date}</span>
                    <span className="cat-list-arrow" style={{ borderColor: `${t.color}44`, color: t.color }}>↗</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
