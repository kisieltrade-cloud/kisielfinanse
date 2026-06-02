import Link from 'next/link';
import type { Pillar } from '@/lib/pillars';

/* Strona-filar: długi przewodnik po kategorii z linkami do artykułów klastra.
   Premium dark look (spójny ze stroną główną). Kolor akcentu z --cat-rgb
   ustawianego na wrapperze strony kategorii. */
export default function PillarGuide({ pillar }: { pillar: Pillar }) {
  return (
    <section className="pillar-wrap">
      <h2 className="pillar-heading">{pillar.heading}</h2>

      {pillar.intro.map((p, i) => (
        <p key={i} className="pillar-intro">{p}</p>
      ))}

      {/* Mini-spis sekcji */}
      <nav className="pillar-nav">
        <p className="pillar-nav-label">W tym przewodniku</p>
        <ol>
          {pillar.sections.map((s, i) => (
            <li key={i}><a href={`#sekcja-${i}`}>{s.title}</a></li>
          ))}
        </ol>
      </nav>

      {/* Sekcje */}
      {pillar.sections.map((s, i) => (
        <div key={i} id={`sekcja-${i}`} className="pillar-section">
          <h3>{s.title}</h3>
          {s.body.map((p, j) => <p key={j}>{p}</p>)}
          {s.links && s.links.length > 0 && (
            <div className="pillar-links">
              {s.links.map((l, k) => (
                <Link key={k} href={l.href} className="pillar-chip">
                  {l.label}
                  <span aria-hidden>→</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* FAQ */}
      {pillar.faq.length > 0 && (
        <div className="pillar-faq">
          <h2>Najczęstsze pytania</h2>
          {pillar.faq.map((f, i) => (
            <details key={i}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
