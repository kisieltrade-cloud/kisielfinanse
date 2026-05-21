'use client';

import { useState, useEffect } from 'react';
import type { TocItem } from '@/lib/toc';

interface Props {
  items: TocItem[];
}

export default function TableOfContentsMobile({ items }: Props) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const top = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveId(top.target.id);
        }
      },
      { rootMargin: '-80px 0px -55% 0px', threshold: 0 },
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  const activeItem = items.find((i) => i.id === activeId);

  return (
    <div className="toc-mobile">
      <button
        onClick={() => setOpen((o) => !o)}
        className="toc-mobile-btn"
        aria-expanded={open}
      >
        <span style={{ color: '#00f5d4', fontSize: '0.7rem' }}>§</span>
        <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {activeItem ? activeItem.text : 'Spis treści'}
        </span>
        <span style={{
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s',
          fontSize: '0.6rem',
          color: '#3a4a5a',
        }}>▾</span>
      </button>

      {open && (
        <nav className="toc-mobile-dropdown" aria-label="Spis treści">
          <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(item.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      window.history.pushState(null, '', `#${item.id}`);
                      setOpen(false);
                    }}
                    style={{
                      display: 'block',
                      padding: '7px 16px',
                      paddingLeft: item.level === 2 ? 16 : 28,
                      fontFamily: 'var(--font-mono)',
                      fontSize: item.level === 2 ? '0.72rem' : '0.66rem',
                      color: isActive ? '#00f5d4' : item.level === 2 ? '#8a9ab5' : '#5a6478',
                      fontWeight: isActive ? 600 : 400,
                      textDecoration: 'none',
                      borderLeft: isActive ? '2px solid #00f5d4' : '2px solid transparent',
                      transition: 'color 0.15s, border-color 0.15s',
                      lineHeight: 1.4,
                    }}
                  >
                    {item.text}
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      )}
    </div>
  );
}
