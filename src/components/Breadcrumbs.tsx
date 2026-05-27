'use client';

import Link from 'next/link';

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  items: Crumb[];
  light?: boolean;
}

export default function Breadcrumbs({ items, light }: Props) {
  const colBase   = light ? '#7a8c7e' : 'var(--muted)';
  const colSep    = light ? '#a8d8ba' : 'var(--muted)';
  const colLast   = light ? '#1a2b1e' : 'var(--text)';
  const colHover  = light ? '#1a5c38' : 'var(--cyan)';

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.68rem',
        color: colBase,
        letterSpacing: '0.5px',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap',
        marginBottom: 24,
      }}
    >
      {items.map((crumb, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {i > 0 && (
              <span style={{ color: colSep, userSelect: 'none' }}>›</span>
            )}
            {crumb.href && !isLast ? (
              <Link
                href={crumb.href}
                style={{
                  color: colBase,
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = colHover)}
                onMouseLeave={e => (e.currentTarget.style.color = colBase)}
              >
                {crumb.label}
              </Link>
            ) : (
              <span style={{ color: isLast ? colLast : colBase }}>
                {crumb.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
