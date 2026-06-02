import Link from 'next/link';
import type { Pillar } from '@/lib/pillars';

/* Strona-filar: długi przewodnik po kategorii z linkami do artykułów klastra.
   Renderowany na /[category] gdy istnieje wpis w PILLARS. */
export default function PillarGuide({ pillar, color }: { pillar: Pillar; color: string }) {
  return (
    <section style={{ maxWidth: 860, margin: '0 auto', padding: '8px 24px 56px' }}>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
        letterSpacing: '1px', lineHeight: 1.15, marginBottom: 20,
      }}>
        {pillar.heading}
      </h2>

      {/* Wstęp */}
      {pillar.intro.map((p, i) => (
        <p key={i} style={{
          fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text)',
          lineHeight: 1.8, marginBottom: 16,
        }}>{p}</p>
      ))}

      {/* Mini-spis sekcji */}
      <nav style={{
        margin: '24px 0 36px', padding: '18px 22px',
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14,
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '1px',
          textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12,
        }}>W tym przewodniku</p>
        <ol style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 8 }}>
          {pillar.sections.map((s, i) => (
            <li key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', lineHeight: 1.5 }}>
              <a href={`#sekcja-${i}`} style={{ color: 'var(--text)' }}>{s.title}</a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Sekcje */}
      {pillar.sections.map((s, i) => (
        <div key={i} id={`sekcja-${i}`} style={{ marginBottom: 36, scrollMarginTop: 90 }}>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 2.6vw, 1.6rem)',
            letterSpacing: '0.5px', marginBottom: 12,
            borderLeft: `3px solid ${color}`, paddingLeft: 14,
          }}>
            {s.title}
          </h3>
          {s.body.map((p, j) => (
            <p key={j} style={{
              fontFamily: 'var(--font-body)', fontSize: '0.97rem', color: 'var(--text)',
              lineHeight: 1.8, marginBottom: 14,
            }}>{p}</p>
          ))}
          {s.links && s.links.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 6 }}>
              {s.links.map((l, k) => (
                <Link key={k} href={l.href} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  fontFamily: 'var(--font-mono)', fontSize: '0.74rem',
                  padding: '7px 13px', borderRadius: 20,
                  background: `${color}14`, border: `1px solid ${color}40`, color,
                }}>
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
        <div style={{ marginTop: 48, borderTop: '1px solid var(--border)', paddingTop: 36 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
            letterSpacing: '1px', marginBottom: 20,
          }}>
            Najczęstsze pytania
          </h2>
          {pillar.faq.map((f, i) => (
            <details key={i} style={{
              borderBottom: '1px solid var(--border)', padding: '14px 0',
            }}>
              <summary style={{
                cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.97rem',
                fontWeight: 700, color: 'var(--text)', listStyle: 'none',
              }}>
                {f.q}
              </summary>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--muted)',
                lineHeight: 1.8, marginTop: 10, marginBottom: 0,
              }}>{f.a}</p>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
