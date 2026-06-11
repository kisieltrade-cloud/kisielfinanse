import Link from 'next/link';
import { getPublishedRankings, withRankingDate } from '@/lib/rankings';

// Sekcja na stronie głównej kierująca ruch do rankingów afiliacyjnych (money pages).
// Pokazuje tylko opublikowane rankingi — uśpiona, gdy żaden nie jest published.
export default function HomeRanking() {
  const rankings = getPublishedRankings();
  if (rankings.length === 0) return null;

  const main = rankings[0];
  const rest = rankings.slice(1, 4);

  return (
    <section style={{ background: 'var(--bg)', padding: 'clamp(20px, 4vw, 40px) 0 clamp(48px, 7vw, 80px)' }}>
      <style>{`
        .hr-wrap { max-width: 1020px; margin: 0 auto; padding: 0 24px; }
        .hr-eyebrow { font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 3px; text-transform: uppercase; color: #c9a227; margin: 0 0 18px; }
        .hr-main {
          position: relative; display: block; overflow: hidden;
          border-radius: 22px; text-decoration: none;
          background:
            radial-gradient(120% 130% at 85% -10%, rgba(201,162,39,0.18), transparent 55%),
            linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0) 40%),
            #0b0f15;
          border: 1px solid rgba(201,162,39,0.28);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 18px 50px rgba(0,0,0,0.5);
          transition: transform 0.25s cubic-bezier(.2,0,0,1), box-shadow 0.25s, border-color 0.25s;
        }
        .hr-main:hover { transform: translateY(-4px); border-color: rgba(201,162,39,0.5); box-shadow: 0 22px 60px rgba(0,0,0,0.6), 0 0 50px rgba(201,162,39,0.12); }
        .hr-main-inner { display: flex; flex-wrap: wrap; gap: 20px; align-items: center; justify-content: space-between; padding: clamp(26px, 4vw, 40px); }
        .hr-badge { display: inline-block; font-family: var(--font-mono); font-size: 0.66rem; letter-spacing: 2px; text-transform: uppercase; color: #0b0f15; background: #c9a227; font-weight: 800; padding: 5px 12px; border-radius: 20px; margin-bottom: 16px; }
        .hr-kicker { font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin: 0 0 8px; }
        .hr-title { font-family: var(--font-body); font-weight: 800; font-size: clamp(1.4rem, 3vw, 2rem); color: #fff; line-height: 1.15; margin: 0 0 12px; letter-spacing: -0.3px; max-width: 560px; }
        .hr-lead { font-family: var(--font-body); font-size: 0.92rem; line-height: 1.6; color: var(--muted); margin: 0; max-width: 540px; }
        .hr-cta { flex-shrink: 0; display: inline-flex; align-items: center; gap: 10px; font-family: var(--font-body); font-weight: 700; font-size: 0.95rem; color: #0b0f15; background: linear-gradient(180deg, #e0bd49, #c9a227); padding: 15px 26px; border-radius: 12px; box-shadow: inset 0 1px 0 rgba(255,255,255,0.4), 0 8px 22px rgba(201,162,39,0.3); }
        .hr-more { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 16px; }
        .hr-more-card { display: block; text-decoration: none; padding: 18px 20px; border-radius: 14px; background: var(--surface); border: 1px solid rgba(255,255,255,0.07); transition: transform 0.2s, border-color 0.2s; }
        .hr-more-card:hover { transform: translateY(-3px); border-color: rgba(201,162,39,0.4); }
        .hr-more-title { font-family: var(--font-body); font-weight: 700; font-size: 0.95rem; color: #fff; margin: 6px 0 0; }
        @media (max-width: 720px) {
          .hr-main-inner { flex-direction: column; align-items: flex-start; }
          .hr-cta { width: 100%; justify-content: center; }
          .hr-more { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="hr-wrap">
        <p className="hr-eyebrow">Rankingi i porównania</p>

        <Link href={`/ranking/${main.slug}`} className="hr-main">
          <div className="hr-main-inner">
            <div>
              <span className="hr-badge">Premia do 1300 zł</span>
              <p className="hr-kicker">{withRankingDate(main.kicker, main.updated)}</p>
              <h3 className="hr-title">{withRankingDate(main.title, main.updated)}</h3>
              <p className="hr-lead">{main.lead}</p>
            </div>
            <span className="hr-cta">Zobacz ranking →</span>
          </div>
        </Link>

        {rest.length > 0 && (
          <div className="hr-more">
            {rest.map((r) => (
              <Link key={r.slug} href={`/ranking/${r.slug}`} className="hr-more-card">
                <p className="hr-kicker" style={{ margin: 0 }}>{withRankingDate(r.kicker, r.updated)}</p>
                <p className="hr-more-title">{withRankingDate(r.title, r.updated)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
