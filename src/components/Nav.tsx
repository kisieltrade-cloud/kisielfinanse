'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CATEGORIES } from '@/lib/categories';

const MAIN_LINKS = [
  { href: '/',           label: 'Home' },
  { href: '/o-mnie',     label: 'O mnie' },
];

const UTIL_LINKS = [
  { href: '/kalkulator', label: 'Kalkulator' },
  { href: '/wspolpraca', label: 'Współpraca' },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav className="nav">
        {/* Logo */}
        <Link href="/" className="nav-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-k.png" alt="" style={{ width: 48, height: 48, mixBlendMode: 'screen', display: 'block' }} />
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

          {/* 5 kategorii z labelką nad grupą */}
          <li className="nav-cat-group">
            <span className="nav-cat-label">Artykuły</span>
            <ul className="nav-cat-items">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${cat.slug}`}
                    className="nav-cat-link"
                    style={{
                      color: isActive(`/${cat.slug}`) ? cat.color : undefined,
                      ['--cat-color' as string]: cat.color,
                    }}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {/* Separator */}
          <li className="nav-sep" aria-hidden="true" />

          {/* Kalkulator, Współpraca */}
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

            <li className="mobile-menu-section">Kategorie</li>

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
