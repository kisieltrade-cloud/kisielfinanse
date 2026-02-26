'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/wyniki', label: 'Wyniki' },
    { href: '/o-mnie', label: 'O mnie' },
    { href: '/blog', label: 'Blog' },
    { href: '/wspolpraca', label: 'Współpraca' },
    { href: '/slownik', label: 'Słownik' },
    { href: '/tygodnik', label: 'Tygodnik' },
    { href: '/#newsletter', label: 'Newsletter' },
  ];

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <Image src="/logo.svg" alt="NysethTrading logo" width={32} height={32} />
          NYSETHTRADING
        </Link>

        <ul className="nav-links">
          {links.map(l => (
            <li key={l.href}>
              <Link href={l.href} style={{ color: pathname === l.href ? 'var(--cyan)' : undefined }}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          <button className="nav-cta nav-cta-desktop">Dołącz teraz</button>
          <button
            className={`nav-burger${open ? ' nav-burger-open' : ''}`}
            onClick={() => setOpen(o => !o)}
            aria-label="Menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {open && (
        <div className="mobile-menu">
          <ul className="mobile-menu-links">
            {links.map(l => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="mobile-menu-link"
                  style={{ color: pathname === l.href ? 'var(--cyan)' : undefined }}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <button className="nav-cta" style={{ width: '100%', textAlign: 'center' }}>
            Dołącz teraz
          </button>
        </div>
      )}
    </>
  );
}
