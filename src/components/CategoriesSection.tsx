import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';

const ICONS: Record<string, React.ReactNode> = {
  trading: (
    <svg width="50" height="50" viewBox="0 0 28 28" fill="none">
      <polyline points="2,22 8,14 13,18 19,8 26,4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="2" y1="26" x2="26" y2="26" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.35" />
    </svg>
  ),
  inwestycje: (
    <svg width="50" height="50" viewBox="0 0 28 28" fill="none">
      <rect x="3" y="16" width="5" height="10" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <rect x="11" y="10" width="5" height="16" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <rect x="19" y="4" width="5" height="22" rx="1" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  pieniadze: (
    <svg width="50" height="50" viewBox="0 0 28 28" fill="none">
      <rect x="2" y="7" width="24" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="14" cy="15" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <line x1="2" y1="11" x2="26" y2="11" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
    </svg>
  ),
  psychologia: (
    <svg width="50" height="50" viewBox="0 0 28 28" fill="none">
      <path d="M14 4C9.6 4 6 7.4 6 11.5c0 2.5 1.3 4.8 3.2 6.2V22h9.6v-4.3C20.7 16.3 22 14 22 11.5 22 7.4 18.4 4 14 4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <line x1="11" y1="22" x2="17" y2="22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="12" y1="25" x2="16" y2="25" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  gospodarka: (
    <svg width="50" height="50" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.8" />
      <ellipse cx="14" cy="14" rx="5" ry="11" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
      <line x1="3" y1="14" x2="25" y2="14" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
      <line x1="5" y1="9" x2="23" y2="9" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
      <line x1="5" y1="19" x2="23" y2="19" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
    </svg>
  ),
};

// Krótkie opisy kart - dopasowane do mockupu (osobne od cat.desc używanego na stronach kategorii)
const CARD_DESC: Record<string, string> = {
  trading: 'Strategie, analiza techniczna, zarządzanie ryzykiem.',
  inwestycje: 'ETF, akcje, portfele, analizy fundamentalne.',
  pieniadze: 'Konta bankowe, kredyty, BIK, ranking i oszczędzanie.',
  psychologia: 'Emocje, błędy poznawcze, mindset tradera i inwestora.',
  gospodarka: 'Makroekonomia, geopolityka, trendy globalne.',
};

export default function CategoriesSection() {
  return (
    <section className="topics-section">
      <div className="section-divider">
        <span>Przeglądaj tematy</span>
      </div>

      <div className="topics-grid">
        {CATEGORIES.map((cat, i) => (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className="topic-card"
            style={{ ['--cat-rgb' as string]: cat.rgb }}
          >
            <span className="topic-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="topic-icon" style={{ color: cat.color }}>
              {ICONS[cat.slug]}
            </span>
            <span className="topic-name">{cat.name}</span>
            <span className="topic-desc">{CARD_DESC[cat.slug] ?? cat.desc}</span>
            <span className="topic-arrow">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
