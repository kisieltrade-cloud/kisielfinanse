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

    const headingEls = items
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (headingEls.length === 0) return;

    const handleScroll = () => {
      const offset = 140;
      let currentId = headingEls[0].id;
      for (const el of headingEls) {
        if (el.getBoundingClientRect().top <= offset) {
          currentId = el.id;
        }
      }
      setActiveId(currentId);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
        <span style={{ color: '#c9a227', fontSize: '0.7rem' }}>§</span>
        <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {activeItem ? activeItem.text : 'Spis treści'}
        </span>
        <span style={{
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s',
          fontSize: '0.6rem',
          color: 'var(--muted)',
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
                      color: isActive ? 'var(--cyan)' : item.level === 2 ? 'var(--text)' : 'var(--muted)',
                      fontWeight: isActive ? 600 : 400,
                      textDecoration: 'none',
                      borderLeft: isActive ? '2px solid #c9a227' : '2px solid transparent',
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
