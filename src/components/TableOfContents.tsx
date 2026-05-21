'use client';

import { useState, useEffect } from 'react';
import type { TocItem } from '@/lib/toc';

export type { TocItem };

interface Props {
  items: TocItem[];
}

export default function TableOfContents({ items }: Props) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // pick the topmost visible heading
          const topEntry = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveId(topEntry.target.id);
        }
      },
      { rootMargin: '-80px 0px -55% 0px', threshold: 0 }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav aria-label="Spis treści" style={{ width: '100%' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
      }}>
        <div style={{ width: 3, height: 16, background: 'var(--cyan)', borderRadius: 2, flexShrink: 0 }} />
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.58rem', letterSpacing: '3px', color: '#5a6478',
        }}>
          SPIS TREŚCI
        </span>
      </div>

      <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {items.map((item) => {
          const isActive = activeId === item.id;
          const isH2 = item.level === 2;
          const isH3 = item.level === 3;

          return (
            <li key={item.id} style={{ position: 'relative' }}>
              {/* Active indicator bar */}
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: 2, borderRadius: 1,
                background: isActive ? 'var(--cyan)' : 'transparent',
                transition: 'background 0.2s',
              }} />

              <a
                href={`#${item.id}`}
                style={{
                  display: 'block',
                  paddingLeft: isH2 ? 14 : isH3 ? 26 : 38,
                  paddingTop: isH2 ? 6 : 4,
                  paddingBottom: isH2 ? 6 : 4,
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: isH2 ? '0.8rem' : '0.74rem',
                  fontWeight: isH2 ? (isActive ? 600 : 500) : 400,
                  color: isActive ? 'var(--cyan)' : isH2 ? '#8892a4' : '#5a6478',
                  textDecoration: 'none',
                  lineHeight: 1.4,
                  transition: 'color 0.2s',
                  borderLeft: '2px solid rgba(255,255,255,0.05)',
                  marginLeft: 0,
                }}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(item.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  window.history.pushState(null, '', `#${item.id}`);
                }}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
