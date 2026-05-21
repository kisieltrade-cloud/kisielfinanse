'use client';
import Link from 'next/link';
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

  const links: { href: string; label: string; ebook: boolean; edukacja?: boolean }[] = [
    { href: '/',             label: 'Home',        ebook: false },
    { href: '/o-mnie',       label: 'O mnie',      ebook: false },
    { href: '/blog',         label: 'Edukacja',    ebook: false, edukacja: true },
    { href: '/kalkulator',   label: 'Kalkulator',  ebook: false },
    { href: '/wspolpraca',   label: 'Współpraca',  ebook: false },
  ];

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-k.png" alt="" style={{ width: 48, height: 48, mixBlendMode: 'screen', display: 'block' }} />
          <span style={{ color: '#ffffff' }}>Kisiel</span><span style={{ color: '#c9a227' }}>Finanse</span>
        </Link>
        <ul className="nav-links">
          {links.map(l => (
            <li key={l.href}>
              <Link
                href={l.href}
                style={l.ebook ? {
                  color: '#f5a623',
                  border: '1px solid rgba(245,166,35,0.6)',
                  padding: '4px 10px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  background: 'rgba(245,166,35,0.08)',
                } : l.edukacja ? {
                  color: '#e8963a',
                  fontWeight: 600,
                  letterSpacing: '1px',
                  textShadow: '0 0 10px rgba(232,150,58,0.4)',
                } : {
                  color: pathname === l.href ? 'var(--cyan)' : undefined,
                }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav-right">
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
                  style={l.ebook ? {
                    color: '#f5a623',
                    fontWeight: 700,
                  } : l.edukacja ? {
                    color: '#e8963a',
                    fontWeight: 600,
                    textShadow: '0 0 10px rgba(232,150,58,0.4)',
                  } : {
                    color: pathname === l.href ? 'var(--cyan)' : undefined,
                  }}
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
