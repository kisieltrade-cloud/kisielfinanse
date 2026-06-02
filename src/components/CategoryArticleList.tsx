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
      {/* Header: tytuł sekcji + licznik + szukaj */}
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        gap: 16, flexWrap: 'wrap', marginBottom: 28,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <h2 style={{
            fontFamily: 'var(--font-body)', fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            fontWeight: 800, letterSpacing: '-0.3px', margin: 0, lineHeight: 1.1, color: 'var(--text)',
          }}>
            Artykuły
          </h2>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)' }}>
            {filtered.length}
          </span>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 30, padding: '8px 14px', minWidth: 190,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ color: 'var(--muted)', flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="search" placeholder="szukaj w kategorii..." value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text)', width: '100%' }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}>×</button>
          )}
        </div>
      </div>

      {/* Siatka kart — identyczna ze stroną główną */}
      {filtered.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', padding: '40px 0' }}>
          Brak wyników dla &bdquo;{query}&rdquo;.
        </p>
      ) : (
        <div className="news-cards-grid">
          {filtered.map(post => {
            const t = getTag(post.tag);
            return (
              <Link key={post.slug} href={postUrl(post)} className="news-card">
                <div className="news-card-thumb">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="news-card-thumb-img"
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                      sizes="(max-width: 700px) 100vw, (max-width: 1024px) 50vw, 320px"
                    />
                  ) : (
                    <div className="news-card-thumb-fallback" style={{ background: `linear-gradient(135deg, ${t.color}33, ${t.color}0a)` }} />
                  )}
                  <span className="news-card-tag" style={{ color: t.color, background: t.bg, borderColor: t.color + '55' }}>
                    {post.tag}
                  </span>
                </div>
                <div className="news-card-body">
                  <h3 className="news-card-title">{post.title}</h3>
                  <div className="news-card-footer">
                    <span className="news-card-date">{post.date}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', fontWeight: 700, color: categoryColor }}>
                      {post.readTime ?? '7 min'}
                    </span>
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
