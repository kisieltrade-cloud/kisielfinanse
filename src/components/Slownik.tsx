'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { TERMS } from '@/lib/slownik-terms';

const CATEGORIES = ['Wszystkie', 'Ogólne', 'Forex', 'Krypto', 'Futures/Indeksy'];

export default function Slownik() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Wszystkie');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return TERMS.filter(t => {
      const matchCat = category === 'Wszystkie' || t.category === category;
      const q = search.toLowerCase();
      const matchSearch = !q || t.term.toLowerCase().includes(q) || t.short.toLowerCase().includes(q);
      return matchCat && matchSearch;
    }).sort((a, b) => a.term.localeCompare(b.term, 'pl'));
  }, [search, category]);

  return (
    <section className="slownik-section">
      <div className="section-label">// baza wiedzy</div>
      <h1 className="section-title">
        <span aria-hidden="true">SŁOWNIK <span className="gradient-text-cp">TRADERA</span></span>
        <span className="seo-only">Słownik tradingowy — definicje pojęć z Forex, Krypto, Futures | NysethTrading</span>
      </h1>
      <p className="slownik-intro">
        {TERMS.length} pojęć z rynków Forex, krypto i futures. Kliknij hasło żeby rozwinąć pełną definicję.
      </p>

      {/* Controls */}
      <div className="slownik-controls">
        <input
          type="text"
          className="slownik-search"
          placeholder="Szukaj pojęcia..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="slownik-filters">
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`slownik-filter${category === c ? ' active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="slownik-count">
        Wyświetlam <span style={{ color: 'var(--cyan)' }}>{filtered.length}</span> z {TERMS.length} pojęć
      </div>

      {/* Terms list */}
      <div className="slownik-list">
        {filtered.map(t => (
          <div
            key={t.term}
            className={`slownik-item${expanded === t.term ? ' expanded' : ''}`}
            onClick={() => setExpanded(expanded === t.term ? null : t.term)}
          >
            <div className="slownik-item-header">
              <div className="slownik-item-left">
                <span className="slownik-cat-badge">{t.category}</span>
                <Link
                  href={`/slownik/${t.slug}`}
                  onClick={e => e.stopPropagation()}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  <span className="slownik-term">{t.term}</span>
                </Link>
              </div>
              <span className="slownik-arrow">{expanded === t.term ? '−' : '+'}</span>
            </div>
            <p className="slownik-short">{t.short}</p>
            {expanded === t.term && (
              <p className="slownik-full">{t.full}</p>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="slownik-empty">
            Brak wyników dla "<span style={{ color: 'var(--cyan)' }}>{search}</span>"
          </div>
        )}
      </div>
    </section>
  );
}