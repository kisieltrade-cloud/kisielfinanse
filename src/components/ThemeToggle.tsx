'use client';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // Inicjalizacja: zapisany wybór ma priorytet; bez wyboru — podążamy za systemem
  // (nie ustawiamy atrybutu, żeby zadziałał @media prefers-color-scheme w CSS).
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      setDark(true);
    } else if (saved === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      setDark(false);
    } else {
      const prefersDark = typeof window !== 'undefined'
        && window.matchMedia
        && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDark(!!prefersDark);
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    // Jawny wybór nadpisuje preferencję systemu
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Tryb jasny' : 'Tryb ciemny'}
      title={dark ? 'Tryb jasny' : 'Tryb ciemny'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        background: 'none',
        border: '1px solid rgba(255,255,255,0.15)',
        cursor: 'pointer',
        color: '#c9a227',
        fontSize: '1rem',
        transition: 'border-color 0.2s, color 0.2s',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,162,39,0.5)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)';
      }}
    >
      {dark ? '☀' : '🌙'}
    </button>
  );
}
