'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">
        <Image src="/logo.svg" alt="NysethTrading logo" width={32} height={32} />
        NYSETHTRADING
      </Link>

      <ul className="nav-links">
        <li><Link href="/" style={{ color: pathname === '/' ? 'var(--cyan)' : undefined }}>Home</Link></li>
        <li><Link href="/wyniki" style={{ color: pathname === '/wyniki' ? 'var(--cyan)' : undefined }}>Wyniki</Link></li>
        <li><Link href="/o-mnie" style={{ color: pathname === '/o-mnie' ? 'var(--cyan)' : undefined }}>O mnie</Link></li>
        <li><Link href="/blog" style={{ color: pathname === '/blog' ? 'var(--cyan)' : undefined }}>Blog</Link></li>
        <li><Link href="/wspolpraca" style={{ color: pathname === '/wspolpraca' ? 'var(--cyan)' : undefined }}>Współpraca</Link></li>
        <li><Link href="/#newsletter">Newsletter</Link></li>
      </ul>

      <button className="nav-cta">Dołącz teraz</button>
    </nav>
  );
}
