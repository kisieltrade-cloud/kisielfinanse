'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/kalkulator-hipoteczny',        label: 'Kredyt hipoteczny', icon: '🏠' },
  { href: '/kalkulator/kredyt-gotowkowy',  label: 'Kredyt gotówkowy',  icon: '💵' },
];

export default function CreditNav() {
  const pathname = usePathname();

  return (
    <div style={{
      maxWidth: 900, margin: '0 auto',
      padding: '24px 24px 0',
      display: 'flex', gap: 6,
    }}>
      {ITEMS.map(item => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '10px 22px', borderRadius: 10,
              fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.15s',
              background: active
                ? 'linear-gradient(135deg, #a07c15 0%, #c9a227 100%)'
                : 'var(--surface)',
              color: active ? '#fff' : 'var(--muted)',
              border: active
                ? '1px solid transparent'
                : '1px solid var(--border)',
              boxShadow: active
                ? '0 4px 16px rgba(201,162,39,0.35)'
                : 'none',
            }}
          >
            <span style={{ fontSize: '0.95rem' }}>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
