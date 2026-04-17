'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleCta = () => {
    if (pathname === '/') {
      document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/#newsletter');
    }
  };

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const links: { href: string; label: string; ebook: boolean; edukacja?: boolean }[] = [
    { href: '/',            label: 'Home',        ebook: false },
    { href: '/wyniki',      label: 'Wyniki',       ebook: false },
    { href: '/o-mnie',      label: 'O mnie',       ebook: false },
    { href: '/blog',        label: 'Edukacja',     ebook: false, edukacja: true },
    { href: '/wspolpraca',  label: 'Współpraca',   ebook: false },
    { href: '/slownik',     label: 'Słownik',      ebook: false },
    { href: '/tygodnik',    label: 'Tygodnik',     ebook: false },
    { href: '/zasoby',      label: 'Zasoby',       ebook: false },
    { href: '/ebook',       label: '★ E-book',     ebook: true  },
    { href: '/#newsletter', label: 'Newsletter',   ebook: false },
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
                  color: '#b14aed',
                  fontWeight: 600,
                  letterSpacing: '1px',
                  textShadow: '0 0 10px rgba(177,74,237,0.4)',
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
          <button className="nav-cta nav-cta-desktop" onClick={handleCta}>Dołącz teraz</button>
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
                    color: '#b14aed',
                    fontWeight: 600,
                    textShadow: '0 0 10px rgba(177,74,237,0.4)',
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
          <button className="nav-cta" style={{ width: '100%', textAlign: 'center' }} onClick={() => { setOpen(false); handleCta(); }}>
            Dołącz teraz
          </button>
        </div>
      )}
    </>
  );
}
