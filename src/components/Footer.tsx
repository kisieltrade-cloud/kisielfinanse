import Link from 'next/link';
import { getAllTags } from '@/lib/posts';

/* ── Inline ikony ── */
const IcoLogo = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
    <rect x="3" y="14" width="4" height="13" rx="1" fill="#c9a227" opacity="0.55" />
    <rect x="9" y="9" width="4" height="18" rx="1" fill="#c9a227" opacity="0.8" />
    <rect x="15" y="4" width="4" height="23" rx="1" fill="#c9a227" />
    <rect x="21" y="11" width="4" height="16" rx="1" fill="#e8963a" opacity="0.7" />
  </svg>
);
const IcoCompass = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><polygon points="15.5,8.5 10.5,10.5 8.5,15.5 13.5,13.5" fill="currentColor" stroke="none" />
  </svg>
);
const IcoDoc = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="3" width="14" height="18" rx="2" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" />
  </svg>
);
const IcoScales = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="4" x2="12" y2="20" /><line x1="6" y1="20" x2="18" y2="20" /><line x1="12" y1="6" x2="5" y2="9" /><line x1="12" y1="6" x2="19" y2="9" />
    <path d="M2.5 13 L5 8.5 L7.5 13 Z" /><path d="M16.5 13 L19 8.5 L21.5 13 Z" />
  </svg>
);
const IcoMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3,7 12,13 21,7" />
  </svg>
);
const IcoHandshake = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11 L7 7 L12 10 L16 7 L21 11" /><path d="M7 7 L11 11 L9 13 L6 10" /><path d="M16 7 L13 13 L15 15 L18 12" />
  </svg>
);
const IcoShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 L19 6 V11 C19 16 16 19.5 12 21 C8 19.5 5 16 5 11 V6 Z" /><polyline points="9,12 11,14 15,9.5" />
  </svg>
);
const IcoX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" /></svg>
);
const IcoYouTube = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6Z" /></svg>
);
const IcoInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export default async function Footer() {
  const tags = await getAllTags();
  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* ── Brand ── */}
        <div className="footer-brand">
          <div className="footer-logo-row">
            <IcoLogo />
            <span className="footer-logo">KISIELFINANSE</span>
          </div>
          <p className="footer-tagline">Finanse. Wiedza. Wolność.</p>
          <p className="footer-brand-desc">
            Praktyczna wiedza o finansach, tradingu, krypto i geopolityce.
            Bez ściemy i kursów za fortunę.
          </p>
          <a href="https://x.com/Kisielfinanse" target="_blank" rel="noopener noreferrer" className="footer-x-btn">
            <IcoX /> @Kisielfinanse
          </a>
        </div>

        {/* ── Nawigacja ── */}
        <div className="footer-col">
          <div className="footer-col-title"><IcoCompass /> Nawigacja</div>
          <ul className="footer-col-links">
            <li><Link href="/blog"><span className="fl-chev">›</span> Blog</Link></li>
            <li><Link href="/o-mnie"><span className="fl-chev">›</span> O mnie</Link></li>
            <li><Link href="/quiz"><span className="fl-chev">›</span> Quiz</Link></li>
            <li><Link href="/kalkulator"><span className="fl-chev">›</span> Kalkulatory</Link></li>
            <li><Link href="/kalkulator-hipoteczny"><span className="fl-chev">›</span> Kalkulator hipoteczny</Link></li>
            <li><Link href="/slownik"><span className="fl-chev">›</span> Słownik pojęć</Link></li>
            <li><Link href="/indeks-strachu-i-chciwosci"><span className="fl-chev">›</span> Indeks strachu i chciwości</Link></li>
            <li><Link href="/symulator-inwestycji"><span className="fl-chev">›</span> Symulator inwestycji</Link></li>
            <li><Link href="/wspolpraca"><span className="fl-chev">›</span> Współpraca</Link></li>
          </ul>
        </div>

        {/* ── Tematy ── */}
        <div className="footer-col">
          <div className="footer-col-title"><IcoDoc /> Tematy</div>
          <ul className="footer-col-links">
            {tags.map(({ tag, slug }) => (
              <li key={slug}>
                <Link href={`/${slug}`}>
                  <span className="fl-chev">›</span>
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Prawne ── */}
        <div className="footer-col">
          <div className="footer-col-title"><IcoScales /> Prawne</div>
          <ul className="footer-col-links">
            <li><Link href="/regulamin"><span className="fl-chev">›</span> Regulamin</Link></li>
            <li><Link href="/polityka-prywatnosci"><span className="fl-chev">›</span> Polityka prywatności</Link></li>
            <li><Link href="/disclaimer"><span className="fl-chev">›</span> Disclaimer</Link></li>
          </ul>
        </div>

        {/* ── Kontakt card ── */}
        <div className="footer-contact">
          <div className="footer-contact-head">
            <span className="footer-contact-icon"><IcoMail /></span>
            <span className="footer-contact-title">Kontakt</span>
          </div>
          <p className="footer-contact-text">
            Masz pytania lub chcesz nawiązać współpracę? Napisz do mnie.
          </p>
          <a href="mailto:kisieltrade@gmail.com" className="footer-contact-btn">
            <IcoMail /> kisieltrade@gmail.com
          </a>
          <Link href="/wspolpraca" className="footer-contact-btn">
            <IcoHandshake /> Współpraca reklamowa
          </Link>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <div className="footer-bottom-left">
          <span className="footer-copy">© {new Date().getFullYear()} <span className="gold">KisielFinanse</span></span>
          <span className="footer-shield"><IcoShield /></span>
          <span className="footer-disclaimer-text">
            Trading wiąże się z ryzykiem utraty kapitału. Treści mają charakter edukacyjny
            i nie stanowią doradztwa inwestycyjnego.
          </span>
        </div>
        <div className="footer-socials">
          <a href="https://x.com/Kisielfinanse" target="_blank" rel="noopener noreferrer" aria-label="X"><IcoX /></a>
          <a href="https://www.youtube.com/@Kisielfinanse" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><IcoYouTube /></a>
          <a href="https://www.instagram.com/kisielfinanse" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><IcoInstagram /></a>
        </div>
      </div>
    </footer>
  );
}
