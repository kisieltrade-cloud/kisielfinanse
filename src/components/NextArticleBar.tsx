'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Props {
  slug: string;
  title: string;
}

export default function NextArticleBar({ slug, title }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setVisible(scrolled > 0.8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      transform: visible ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      background: 'rgba(8,13,20,0.97)',
      borderTop: '1px solid rgba(0,245,212,0.18)',
      backdropFilter: 'blur(12px)',
      padding: '14px 24px',
    }}>
      <div style={{
        maxWidth: 860,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            letterSpacing: '2px',
            color: '#00f5d4',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}>
            Następny artykuł
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.88rem',
            color: '#e8edf5',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {title}
          </div>
        </div>

        <Link
          href={`/blog/${slug}`}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            letterSpacing: '1.5px',
            color: '#060a10',
            background: '#00f5d4',
            padding: '10px 22px',
            textDecoration: 'none',
            fontWeight: 700,
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          Czytaj →
        </Link>
      </div>
    </div>
  );
}
