import Link from 'next/link';
import { getAllTags, tagToSlug } from '@/lib/posts';
import { CATEGORIES } from '@/lib/categories';

const ICONS: Record<string, React.ReactNode> = {
  trading: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <polyline points="2,22 8,14 13,18 19,8 26,4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="2" y1="26" x2="26" y2="26" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.35" />
    </svg>
  ),
  inwestycje: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="3" y="16" width="5" height="10" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <rect x="11" y="10" width="5" height="16" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <rect x="19" y="4" width="5" height="22" rx="1" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  pieniadze: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="2" y="7" width="24" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="14" cy="15" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <line x1="2" y1="11" x2="26" y2="11" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
    </svg>
  ),
  psychologia: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 4C9.6 4 6 7.4 6 11.5c0 2.5 1.3 4.8 3.2 6.2V22h9.6v-4.3C20.7 16.3 22 14 22 11.5 22 7.4 18.4 4 14 4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <line x1="11" y1="22" x2="17" y2="22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="12" y1="25" x2="16" y2="25" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  gospodarka: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.8" />
      <ellipse cx="14" cy="14" rx="5" ry="11" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
      <line x1="3" y1="14" x2="25" y2="14" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
      <line x1="5" y1="9" x2="23" y2="9" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
      <line x1="5" y1="19" x2="23" y2="19" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
    </svg>
  ),
};

export default async function CategoriesSection() {
  const tags = await getAllTags();
  const countMap = Object.fromEntries(tags.map((t) => [tagToSlug(t.tag), t.count]));

  return (
    <section className="categories-section">
      <div className="categories-header">
        <p className="categories-eyebrow">przeglądaj tematy</p>
        <h2 className="categories-title">
          CO CIĘ <span className="categories-title-accent">INTERESUJE?</span>
        </h2>
      </div>

      <div className="categories-grid">
        {CATEGORIES.map((cat) => {
          const count = countMap[cat.slug] ?? 0;
          const countLabel =
            count === 0 ? 'wkrótce' :
            count === 1 ? '1 artykuł' :
            count <= 4  ? `${count} artykuły` :
                          `${count} artykułów`;

          return (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="cat-card"
              style={{
                borderTop: `3px solid ${cat.color}`,
                ['--cat-color' as string]: cat.color,
                ['--cat-rgb' as string]: cat.rgb,
              }}
            >
              <div className="cat-icon" style={{ color: cat.color }}>
                {ICONS[cat.slug]}
              </div>
              <div className="cat-name">{cat.name}</div>
              <p className="cat-desc">{cat.desc}</p>
              <div className="cat-footer">
                <span className="cat-count" style={{ color: cat.color }}>{countLabel}</span>
                <span className="cat-arrow" style={{ color: cat.color }}>→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
