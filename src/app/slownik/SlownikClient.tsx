'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

const ACCENT = '#c9a227';

interface TermLite {
  slug: string;
  term: string;
  short: string;
}

export default function SlownikClient({ terms }: { terms: TermLite[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return terms;
    return terms.filter(
      (t) => t.term.toLowerCase().includes(q) || t.short.toLowerCase().includes(q),
    );
  }, [query, terms]);

  // Grupowanie po pierwszej literze (terms są już posortowane alfabetycznie)
  const groups = useMemo(() => {
    const map = new Map<string, TermLite[]>();
    for (const t of filtered) {
      const letter = t.term.charAt(0).toUpperCase();
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(t);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Szukaj pojęcia..."
        style={{
          width: '100%', boxSizing: 'border-box', background: 'var(--surface)',
          border: '1px solid var(--border)', color: 'var(--text)', padding: '12px 16px',
          fontFamily: 'var(--font-mono)', fontSize: '0.85rem', marginBottom: 12, outline: 'none',
        }}
      />
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', marginBottom: 32,
      }}>
        {filtered.length} {filtered.length === 1 ? 'pojęcie' : 'pojęć'}
      </div>

      {groups.length === 0 && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)' }}>
          Brak wyników dla „{query}”.
        </p>
      )}

      {groups.map(([letter, items]) => (
        <div key={letter} style={{ marginBottom: 36 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: ACCENT,
            letterSpacing: '2px', marginBottom: 14, borderBottom: '1px solid var(--border)', paddingBottom: 6,
          }}>
            {letter}
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14,
          }}>
            {items.map((t) => (
              <Link key={t.slug} href={`/slownik/${t.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  height: '100%', background: 'var(--surface)', border: '1px solid var(--border)',
                  borderLeft: `3px solid ${ACCENT}`, padding: '16px 18px',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.05rem', letterSpacing: '1px',
                    color: 'var(--text)', marginBottom: 8,
                  }}>
                    {t.term}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.6,
                  }}>
                    {t.short}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
