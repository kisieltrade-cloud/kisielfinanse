import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/lib/categories';

// Zdjęcia kart kategorii (naturalne, zlewają się z tłem przez gradientowy fade)
const TOPIC_IMG: Record<string, string> = {
  trading: '/images/cards/trading.jpg',
  inwestycje: '/images/cards/inwestycje.jpg',
  pieniadze: '/images/cards/pieniadze.jpg',
  psychologia: '/images/cards/psychologia.jpg',
  gospodarka: '/images/cards/gospodarka.jpg',
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
            <div className="topic-photo">
              <Image
                src={TOPIC_IMG[cat.slug] ?? '/images/blog/covers/finance-graph.jpg'}
                alt={cat.name}
                fill
                sizes="(max-width: 620px) 50vw, (max-width: 1000px) 33vw, 210px"
                style={{ objectFit: 'cover' }}
              />
              <span className="topic-num">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <div className="topic-body">
              <span className="topic-name">{cat.name}</span>
              <span className="topic-desc">{CARD_DESC[cat.slug] ?? cat.desc}</span>
              <span className="topic-arrow">→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
