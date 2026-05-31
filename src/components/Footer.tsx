import Link from 'next/link';
import { getAllTags } from '@/lib/posts';

export default async function Footer() {
  const tags = await getAllTags();
  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* ── Col 1: Brand ── */}
        <div className="footer-brand">
          <div className="footer-logo">KisielFinanse</div>
          <p className="footer-tagline">
            Finanse. Wiedza. Wolność.
          </p>
          <p className="footer-brand-desc">
            Praktyczna wiedza o finansach, tradingu, krypto i geopolityce.
            Bez ściemy i kursów za fortunę.
          </p>
          <a
            href="https://x.com/Kisielfinanse"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social"
          >
            𝕏 @Kisielfinanse
          </a>
        </div>

        {/* ── Col 2: Nawigacja ── */}
        <div className="footer-col">
          <div className="footer-col-title">Nawigacja</div>
          <ul className="footer-col-links">
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/o-mnie">O mnie</Link></li>
            <li><Link href="/portfel">Portfel inwestycyjny</Link></li>
            <li><Link href="/quiz">Quiz</Link></li>
            <li><Link href="/kalkulator">Kalkulatory</Link></li>
            <li><Link href="/kalkulator-hipoteczny">Kalkulator hipoteczny</Link></li>
            <li><Link href="/wspolpraca">Współpraca</Link></li>
          </ul>
        </div>

        {/* ── Col 3: Tematy ── */}
        <div className="footer-col">
          <div className="footer-col-title">Tematy</div>
          <ul className="footer-col-links">
            {tags.map(({ tag, slug, count }) => (
              <li key={slug}>
                <Link href={`/${slug}`}>
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  <span style={{ color: '#8a9ab5', marginLeft: 6, fontSize: '0.62rem' }}>({count})</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Col 4: Kontakt + Legal ── */}
        <div className="footer-col">
          <div className="footer-col-title">Kontakt</div>
          <ul className="footer-col-links" style={{ marginBottom: 28 }}>
            <li>
              <a href="mailto:kisieltrade@gmail.com">
                kisieltrade@gmail.com
              </a>
            </li>
            <li><Link href="/wspolpraca">Współpraca reklamowa</Link></li>
          </ul>

          <div className="footer-col-title">Prawne</div>
          <ul className="footer-col-links">
            <li><Link href="/regulamin">Regulamin</Link></li>
            <li><Link href="/polityka-prywatnosci">Polityka prywatności</Link></li>
            <li><Link href="/disclaimer">Disclaimer</Link></li>
          </ul>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <span className="footer-copy">© {new Date().getFullYear()} KisielFinanse</span>
        <span className="footer-disclaimer-text">
          Trading wiąże się z ryzykiem utraty kapitału. Treści mają charakter edukacyjny
          i nie stanowią doradztwa inwestycyjnego.
        </span>
      </div>
    </footer>
  );
}
