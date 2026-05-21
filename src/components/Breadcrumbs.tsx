'use client';

import Link from 'next/link';

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  items: Crumb[];
}

export default function Breadcrumbs({ items }: Props) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.68rem',
        color: '#3a4a5a',
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
              <span style={{ color: '#1e2d3d', userSelect: 'none' }}>›</span>
            )}
            {crumb.href && !isLast ? (
              <Link
                href={crumb.href}
                style={{
                  color: '#3a4a5a',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#c9a227')}
                onMouseLeave={e => (e.currentTarget.style.color = '#3a4a5a')}
              >
                {crumb.label}
              </Link>
            ) : (
              <span style={{ color: isLast ? '#8a9ab5' : '#3a4a5a' }}>
                {crumb.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
