'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { PostMeta } from '@/lib/posts';
import { postUrl } from '@/lib/url';

const INTERVAL = 4000;
const FADE_MS  = 250;

const TAG_COLORS: Record<string, { color: string; bg: string }> = {
  strategia:         { color: '#c9a227', bg: 'rgba(201,162,39,0.12)' },
  psychologia:       { color: '#e8963a', bg: 'rgba(232,150,58,0.12)' },
  analiza:           { color: '#f5c518', bg: 'rgba(245,197,24,0.12)' },
  'risk management': { color: '#ff2d78', bg: 'rgba(255,45,120,0.12)' },
  edukacja:          { color: '#c9a227', bg: 'rgba(201,162,39,0.12)' },
  rynek:             { color: '#f5c518', bg: 'rgba(245,197,24,0.12)' },
  finanse:           { color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  krypto:            { color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
};

export default function HeroArticleRotator({ posts }: { posts: PostMeta[] }) {
  const [idx, setIdx]         = useState(0);
  const [visible, setVisible] = useState(true);

  // Effect 1: fire fade-out every INTERVAL ms
  useEffect(() => {
    if (posts.length <= 1) return;
    const id = setInterval(() => setVisible(false), INTERVAL);
    return () => clearInterval(id);
  }, [posts.length]);

  // Effect 2: when visible goes false → swap content → fade back in
  useEffect(() => {
    if (visible) return;
    const id = setTimeout(() => {
      setIdx(i => (i + 1) % posts.length);
      setVisible(true);
    }, FADE_MS);
    return () => clearTimeout(id);
  }, [visible, posts.length]);

  const goTo = useCallback((next: number) => {
    if (next === idx) return;
    setVisible(false);
    setTimeout(() => { setIdx(next); setVisible(true); }, FADE_MS);
  }, [idx]);

  const post = posts[idx];
  if (!post) return null;
  const t    = TAG_COLORS[post.tag?.toLowerCase()] ?? TAG_COLORS['edukacja'];
  const rest = posts.filter((_, i) => i !== idx).slice(0, 2);

  return (
    <div className="hero-chart-wrap">

      {/* Content — fades in/out as one unit */}
      <div style={{
        opacity:    visible ? 1 : 0,
        transition: `opacity ${FADE_MS}ms ease`,
        display:    'flex',
        flexDirection: 'column',
        gap: 8,
      }}>

        {/* Featured card */}
        <Link href={postUrl(post)} style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{ position: 'relative', height: 260, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>

            {post.image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={post.image} alt={post.title}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, rgba(3,5,8,0.92) 0%, ${t.bg} 100%)` }}>
                <svg viewBox="0 0 400 260" preserveAspectRatio="none" style={{ width: '100%', height: '100%', opacity: 0.18 }}>
                  <polyline points="0,200 60,170 120,182 180,130 240,148 300,90 360,108 400,58"
                    fill="none" stroke={t.color} strokeWidth="2.5" />
                  <path d="M0,200 60,170 120,182 180,130 240,148 300,90 360,108 400,58 L400,260 L0,260 Z"
                    fill={t.color} opacity="0.07" />
                </svg>
              </div>
            )}

            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(3,5,8,0.97) 0%, rgba(3,5,8,0.55) 52%, rgba(3,5,8,0.08) 100%)' }} />

            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 18px' }}>
              <span style={{
                display: 'inline-block', marginBottom: 10,
                fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '2px', fontWeight: 700,
                color: t.color, background: t.bg, border: `1px solid ${t.color}55`,
                padding: '3px 9px', borderRadius: 4,
              }}>
                {post.tag.toUpperCase()}
              </span>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 12 }}>
                {post.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: t.color }}>
                  Czytaj artykuł →
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'rgba(255,255,255,0.38)' }}>
                  {post.readTime} czytania
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Two smaller cards */}
        {rest.map((p) => {
          const tc = TAG_COLORS[p.tag?.toLowerCase()] ?? TAG_COLORS['edukacja'];
          return (
            <Link key={p.slug} href={postUrl(p)} style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 12px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8 }}>
                <div style={{ width: 60, height: 60, flexShrink: 0, borderRadius: 6, overflow: 'hidden', background: tc.bg, border: `1px solid ${tc.color}33`, position: 'relative' }}>
                  {p.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg viewBox="0 0 60 60" style={{ width: 34, height: 34, opacity: 0.4 }}>
                        <polyline points="4,46 16,32 28,38 40,20 52,24 58,10"
                          fill="none" stroke={tc.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ marginBottom: 5 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem', letterSpacing: '1.5px', color: tc.color, background: tc.bg, padding: '2px 6px', borderRadius: 3 }}>
                      {p.tag.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.35, marginBottom: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                    {p.title}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--muted)' }}>
                    {p.date} · {p.readTime}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Progress bar */}
      {posts.length > 1 && (
        <div style={{ display: 'flex', gap: 4, marginTop: 14 }}>
          {posts.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Artykuł ${i + 1}`}
              style={{ flex: 1, height: 3, padding: 0, border: 'none', cursor: 'pointer', borderRadius: 2, background: 'rgba(255,255,255,0.12)', position: 'relative', overflow: 'hidden' }}
            >
              {i === idx && (
                <span
                  key={`fill-${idx}`}
                  style={{
                    position: 'absolute', left: 0, top: 0, height: '100%',
                    background: t.color,
                    animation: `hero-progress ${INTERVAL}ms linear forwards`,
                  }}
                />
              )}
              {i < idx && (
                <span style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.45)' }} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
