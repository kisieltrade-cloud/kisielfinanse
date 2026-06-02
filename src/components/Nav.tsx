'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { CATEGORIES } from '@/lib/categories';
import ThemeToggle from '@/components/ThemeToggle';

const MAIN_LINKS = [
  { href: '/o-mnie',  label: 'O mnie' },
];

const UTIL_LINKS = [
  { href: '/wspolpraca', label: 'Współpraca' },
  { href: '/quiz', label: 'Quiz' },
];

const CALC_ITEMS = [
  { href: '/kalkulator/wynagrodzenia',      label: 'Wynagrodzenia brutto-netto', icon: '💰' },
  { href: '/kalkulator/skladka-zdrowotna',  label: 'Składka zdrowotna',          icon: '🩺' },
  { href: '/kalkulator/zdolnosc-kredytowa', label: 'Zdolność kredytowa',         icon: '🏦' },
  { href: '/kalkulator/procent-skladany',   label: 'Procent składany',           icon: '📈' },
  { href: '/kalkulator/dca',                label: 'DCA',                        icon: '🔁' },
  { href: '/kalkulator/risk-reward',        label: 'Risk / Reward',              icon: '⚖️' },
  { href: '/kalkulator/fire',               label: 'Kalkulator FIRE',            icon: '🔥' },
  { href: '/kalkulator/etf',                label: 'Symulacja ETF',              icon: '📊' },
  { href: '/kalkulator/godziny-pracy',      label: 'Ile godzin pracy?',          icon: '⏱️' },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const calcRef = useRef<HTMLLIElement>(null);
  const [eduOpen, setEduOpen] = useState(false);
  const eduRef = useRef<HTMLLIElement>(null);

  useEffect(() => { setOpen(false); setCalcOpen(false); setEduOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // zamknij dropdown kalkulatory po kliknięciu poza nim
  useEffect(() => {
    if (!calcOpen) return;
    const handler = (e: MouseEvent) => {
      if (calcRef.current && !calcRef.current.contains(e.target as Node)) {
        setCalcOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [calcOpen]);

  // zamknij dropdown edukacja po kliknięciu poza nim
  useEffect(() => {
    if (!eduOpen) return;
    const handler = (e: MouseEvent) => {
      if (eduRef.current && !eduRef.current.contains(e.target as Node)) {
        setEduOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [eduOpen]);

  const isActive = (href: string) => pathname === href;
  const isCalcActive = pathname.startsWith('/kalkulator') && pathname !== '/kalkulator-hipoteczny';
  const isLight = pathname === '/';

  return (
    <>
      <nav className="nav">
        {/* Logo */}
        <Link href="/" className="nav-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-k.png" alt="Logo KisielFinanse" style={{ width: 48, height: 48, mixBlendMode: 'screen', display: 'block' }} />
          <span style={{ color: '#ffffff' }}>Kisiel</span><span style={{ color: '#c9a227' }}>Finanse</span>
        </Link>

        {/* Desktop links */}
        <ul className="nav-links">
          {/* Home, O mnie */}
          {MAIN_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                style={{ color: isActive(l.href) ? 'var(--cyan)' : undefined }}
              >
                {l.label}
              </Link>
            </li>
          ))}

          {/* Separator */}
          <li className="nav-sep" aria-hidden="true" />

          {/* Dropdown: Edukacja (kategorie) */}
          <li className="nav-dropdown" ref={eduRef}>
            <button
              className={`nav-dropdown-trigger${pathname === '/blog' ? ' nav-dropdown-trigger--active' : ''}`}
              onClick={() => setEduOpen((v) => !v)}
              aria-expanded={eduOpen}
            >
              Edukacja
              <span className={`nav-dropdown-arrow${eduOpen ? ' nav-dropdown-arrow--open' : ''}`}>▾</span>
            </button>

            {eduOpen && (
              <ul className="nav-dropdown-menu">
                {CATEGORIES.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/${cat.slug}`}
                      className="nav-dropdown-item"
                      onClick={() => setEduOpen(false)}
                    >
                      <span className="nav-dropdown-item-icon" style={{ color: cat.color }}>●</span>
                      {cat.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/blog" className="nav-dropdown-item" onClick={() => setEduOpen(false)}>
                    <span className="nav-dropdown-item-icon">📚</span>
                    Wszystkie artykuły
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Separator */}
          <li className="nav-sep" aria-hidden="true" />

          {/* Kredyt gotówkowy */}
          <li>
            <Link
              href="/kalkulator/kredyt-gotowkowy"
              style={{ color: isActive('/kalkulator/kredyt-gotowkowy') ? 'var(--cyan)' : undefined }}
            >
              Kredyt gotówkowy
            </Link>
          </li>

          {/* Kalkulator hipoteczny — osobny link obok dropdown */}
          <li>
            <Link
              href="/kalkulator-hipoteczny"
              style={{ color: isActive('/kalkulator-hipoteczny') ? 'var(--cyan)' : undefined }}
            >
              Kalkulator hipoteczny
            </Link>
          </li>

          {/* Dropdown: Kalkulatory */}
          <li className="nav-dropdown" ref={calcRef}>
            <button
              className={`nav-dropdown-trigger${pathname === '/kalkulator' ? ' nav-dropdown-trigger--active' : ''}`}
              onClick={() => setCalcOpen((v) => !v)}
              aria-expanded={calcOpen}
            >
              Kalkulatory
              <span className={`nav-dropdown-arrow${calcOpen ? ' nav-dropdown-arrow--open' : ''}`}>▾</span>
            </button>

            {calcOpen && (
              <ul className="nav-dropdown-menu">
                {CALC_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="nav-dropdown-item" onClick={() => setCalcOpen(false)}>
                      <span className="nav-dropdown-item-icon">{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Współpraca */}
          {UTIL_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                style={{ color: isActive(l.href) ? 'var(--cyan)' : undefined }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          <ThemeToggle />
          <button
            className={`nav-burger${open ? ' nav-burger-open' : ''}`}
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="mobile-menu">
          <ul className="mobile-menu-links">
            {MAIN_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="mobile-menu-link"
                  style={{ color: isActive(l.href) ? 'var(--cyan)' : undefined }}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}

            <li className="mobile-menu-section">Edukacja</li>

            {CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/${cat.slug}`}
                  className="mobile-menu-link"
                  style={{ color: isActive(`/${cat.slug}`) ? cat.color : cat.color + 'cc' }}
                  onClick={() => setOpen(false)}
                >
                  {cat.name}
                </Link>
              </li>
            ))}

            <li className="mobile-menu-section">Kalkulatory</li>

            <li>
              <Link
                href="/kalkulator/kredyt-gotowkowy"
                className="mobile-menu-link"
                style={{ color: isActive('/kalkulator/kredyt-gotowkowy') ? 'var(--cyan)' : undefined }}
                onClick={() => setOpen(false)}
              >
                Kredyt gotówkowy
              </Link>
            </li>

            <li>
              <Link
                href="/kalkulator-hipoteczny"
                className="mobile-menu-link"
                style={{ color: isActive('/kalkulator-hipoteczny') ? 'var(--cyan)' : undefined }}
                onClick={() => setOpen(false)}
              >
                Kalkulator hipoteczny
              </Link>
            </li>

            {CALC_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="mobile-menu-link"
                  style={{ color: isActive('/kalkulator') ? 'var(--cyan)' : undefined }}
                  onClick={() => setOpen(false)}
                >
                  {item.icon} {item.label}
                </Link>
              </li>
            ))}

            <li className="mobile-menu-section">Inne</li>

            {UTIL_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="mobile-menu-link"
                  style={{ color: isActive(l.href) ? 'var(--cyan)' : undefined }}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
