'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface PostRow {
  slug: string;
  title: string;
  date: string;
  published: boolean;
  tag: string;
  excerpt: string;
  image: string;
  readTime: string;
  author: string;
}

const MONO = "'JetBrains Mono', monospace";

export default function DashboardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTag, setFilterTag] = useState('all');

  async function fetchPosts() {
    try {
      const res = await fetch('/api/admin/posts');
      const data = await res.json();
      setPosts(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchPosts(); }, []);

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push("/kf-7q3x-cms");
  }

  async function handleDelete(slug: string, title: string) {
    if (!confirm(`Usunąć artykuł:\n"${title}"?\n\nTej operacji nie można cofnąć.`)) return;
    setDeletingSlug(slug);
    try {
      const res = await fetch(`/api/admin/posts/${slug}`, { method: 'DELETE' });
      if (res.ok) setPosts((prev) => prev.filter((p) => p.slug !== slug));
      else alert('Błąd podczas usuwania');
    } catch {
      alert('Błąd połączenia');
    } finally {
      setDeletingSlug(null);
    }
  }

  const allTags = useMemo(() => {
    const tags = [...new Set(posts.map((p) => p.tag).filter(Boolean))];
    return tags.sort();
  }, [posts]);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'published' && p.published) ||
        (filterStatus === 'draft' && !p.published);
      const matchTag = filterTag === 'all' || p.tag === filterTag;
      return matchSearch && matchStatus && matchTag;
    });
  }, [posts, search, filterStatus, filterTag]);

  const stats = {
    all: posts.length,
    published: posts.filter((p) => p.published).length,
    drafts: posts.filter((p) => !p.published).length,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f1a', fontFamily: MONO }}>

      {/* ── TOP BAR ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(11,15,26,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 32px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '0.62rem', color: '#5a6478', letterSpacing: '3px' }}>
          // KisielFinanse CMS
        </span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/" target="_blank" style={{
            fontSize: '0.6rem', color: '#5a6478', letterSpacing: '1px',
            textDecoration: 'none', padding: '6px 12px',
            border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6,
          }}>
            PODGLĄD STRONY ↗
          </Link>
          <button onClick={handleLogout} style={{
            fontSize: '0.6rem', color: '#ff2d78', letterSpacing: '1px',
            background: 'none', border: '1px solid rgba(255,45,120,0.2)',
            borderRadius: 6, padding: '6px 12px', cursor: 'pointer',
          }}>
            WYLOGUJ
          </button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#e8edf5', margin: 0, fontFamily: 'system-ui, sans-serif', letterSpacing: '-0.5px' }}>
              Artykuły
            </h1>
            <div style={{ fontSize: '0.72rem', color: '#5a6478', marginTop: 4, letterSpacing: '0.5px' }}>
              {loading ? '...' : `${stats.all} artykułów łącznie`}
            </div>
          </div>
          <Link href="/kf-7q3x-cms/nowy" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            color: '#fff', textDecoration: 'none',
            fontSize: '0.78rem', fontWeight: 600, fontFamily: 'system-ui, sans-serif',
            padding: '10px 20px', borderRadius: 8,
            boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
          }}>
            + Nowy artykuł
          </Link>
        </div>

        {/* Stats cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { icon: '📄', label: 'Wszystkich', value: stats.all, color: '#6366f1' },
            { icon: '🌐', label: 'Opublikowanych', value: stats.published, color: '#10b981' },
            { icon: '✏️', label: 'Szkiców', value: stats.drafts, color: '#f59e0b' },
          ].map((s) => (
            <div key={s.label} style={{
              background: '#131929', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12, padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: `${s.color}22`, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', flexShrink: 0,
              }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.7rem', fontWeight: 700, color: '#e8edf5', lineHeight: 1, fontFamily: 'system-ui, sans-serif' }}>
                  {loading ? '-' : s.value}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#5a6478', marginTop: 4, fontFamily: 'system-ui, sans-serif' }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search + filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              color: '#5a6478', fontSize: '0.85rem',
            }}>🔍</span>
            <input
              type="text"
              placeholder="Szukaj po tytule..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px 10px 38px',
                background: '#131929', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8, color: '#e8edf5', fontSize: '0.8rem',
                fontFamily: 'system-ui, sans-serif', outline: 'none',
              }}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '10px 14px', background: '#131929',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
              color: '#e8edf5', fontSize: '0.78rem', fontFamily: 'system-ui, sans-serif',
              cursor: 'pointer', outline: 'none', minWidth: 160,
            }}
          >
            <option value="all">Wszystkie statusy</option>
            <option value="published">Opublikowane</option>
            <option value="draft">Szkice</option>
          </select>
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            style={{
              padding: '10px 14px', background: '#131929',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
              color: '#e8edf5', fontSize: '0.78rem', fontFamily: 'system-ui, sans-serif',
              cursor: 'pointer', outline: 'none', minWidth: 180,
            }}
          >
            <option value="all">Wszystkie kategorie</option>
            {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Article list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {loading ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#5a6478', fontSize: '0.78rem' }}>
              Ładowanie...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              background: '#131929', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12, padding: 48, textAlign: 'center', color: '#5a6478', fontSize: '0.82rem',
              fontFamily: 'system-ui, sans-serif',
            }}>
              {search || filterStatus !== 'all' || filterTag !== 'all'
                ? 'Brak wyników dla podanych filtrów.'
                : 'Brak artykułów. Utwórz pierwszy!'}
            </div>
          ) : filtered.map((post) => (
            <ArticleRow
              key={post.slug}
              post={post}
              onDelete={handleDelete}
              deleting={deletingSlug === post.slug}
            />
          ))}
        </div>

      </div>
    </div>
  );
}

function ArticleRow({
  post, onDelete, deleting,
}: {
  post: PostRow;
  onDelete: (slug: string, title: string) => void;
  deleting: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const fmtDate = (d: string) => {
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return d; }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#161d2e' : '#131929',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12, padding: '16px 20px',
        display: 'flex', gap: 16, alignItems: 'center',
        transition: 'background 0.15s',
      }}
    >
      {/* Thumbnail */}
      <div style={{
        width: 72, height: 72, borderRadius: 8, flexShrink: 0,
        background: '#0b0f1a', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        {post.image ? (
          <Image
            src={post.image} alt={post.title}
            width={72} height={72}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{ fontSize: '1.6rem', opacity: 0.3 }}>📝</span>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Badges */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
          {/* Status */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: '0.65rem', fontFamily: 'system-ui, sans-serif',
            fontWeight: 600, padding: '2px 8px', borderRadius: 20,
            background: post.published ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
            color: post.published ? '#10b981' : '#f59e0b',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: post.published ? '#10b981' : '#f59e0b',
              display: 'inline-block',
            }} />
            {post.published ? 'Opublikowany' : 'Szkic'}
          </span>
          {/* Tag */}
          {post.tag && (
            <span style={{
              fontSize: '0.65rem', fontFamily: 'system-ui, sans-serif',
              fontWeight: 500, padding: '2px 8px', borderRadius: 20,
              background: 'rgba(99,102,241,0.12)', color: '#818cf8',
            }}>
              {post.tag}
            </span>
          )}
        </div>

        {/* Title */}
        <div style={{
          fontSize: '0.95rem', fontWeight: 600, color: '#e8edf5',
          fontFamily: 'system-ui, sans-serif', marginBottom: 4,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {post.title}
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <div style={{
            fontSize: '0.75rem', color: '#5a6478',
            fontFamily: 'system-ui, sans-serif', lineHeight: 1.5,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
            marginBottom: 8,
          }}>
            {post.excerpt}
          </div>
        )}

        {/* Meta */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: '0.68rem', color: '#5a6478', fontFamily: 'system-ui, sans-serif' }}>
          {post.author && <span>👤 {post.author}</span>}
          {post.readTime && <span>🕐 {post.readTime}</span>}
          {post.date && <span>📅 {fmtDate(post.date)}</span>}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <Link href={`/blog/${post.slug}`} target="_blank" style={{
          fontSize: '0.68rem', color: '#5a6478', textDecoration: 'none',
          padding: '7px 14px', borderRadius: 6,
          border: '1px solid rgba(255,255,255,0.06)',
          fontFamily: 'system-ui, sans-serif',
        }}>
          Podgląd ↗
        </Link>
        <Link href={`/kf-7q3x-cms/edytuj/${post.slug}`} style={{
          fontSize: '0.68rem', color: '#00f5d4', textDecoration: 'none',
          padding: '7px 14px', borderRadius: 6,
          border: '1px solid rgba(0,245,212,0.2)',
          background: 'rgba(0,245,212,0.05)',
          fontFamily: 'system-ui, sans-serif',
        }}>
          Edytuj
        </Link>
        <button
          onClick={() => onDelete(post.slug, post.title)}
          disabled={deleting}
          style={{
            fontSize: '0.68rem', color: deleting ? '#5a6478' : '#ff2d78',
            padding: '7px 14px', borderRadius: 6, cursor: deleting ? 'not-allowed' : 'pointer',
            border: `1px solid ${deleting ? 'rgba(255,255,255,0.06)' : 'rgba(255,45,120,0.2)'}`,
            background: deleting ? 'transparent' : 'rgba(255,45,120,0.05)',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {deleting ? '...' : 'Usuń'}
        </button>
      </div>
    </div>
  );
}
