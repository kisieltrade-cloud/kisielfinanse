'use client';

import { useEffect, useState } from 'react';

interface Props {
  slug: string;
  increment?: boolean; // true tylko na stronie artykulu
}

export default function ViewCounter({ slug, increment = false }: Props) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const method = increment ? 'POST' : 'GET';
    fetch(`/api/views/${slug}`, { method })
      .then(r => r.json())
      .then(d => setViews(d.views ?? 0))
      .catch(() => setViews(null));
  }, [slug, increment]);

  if (views === null) return null;

  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '0.7rem',
      color: 'var(--muted)',
      letterSpacing: '0.5px',
    }}>
      {views.toLocaleString('pl-PL')} {views === 1 ? 'wyswietlenie' : 'wyswietlen'}
    </span>
  );
}
