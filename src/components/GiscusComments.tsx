'use client';

import { useEffect, useRef } from 'react';

interface Props {
  slug: string;
}

// Skonfiguruj na https://giscus.app, a następnie dodaj zmienne w Vercel:
// NEXT_PUBLIC_GISCUS_REPO, NEXT_PUBLIC_GISCUS_REPO_ID,
// NEXT_PUBLIC_GISCUS_CATEGORY, NEXT_PUBLIC_GISCUS_CATEGORY_ID
const GISCUS_REPO        = process.env.NEXT_PUBLIC_GISCUS_REPO ?? 'kisieltrade-cloud/kisielfinanse';
const GISCUS_REPO_ID     = process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? 'R_kgDOSkS0-A';
const GISCUS_CATEGORY    = process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? 'General';
const GISCUS_CATEGORY_ID = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? 'DIC_kwDOSkS0-M4C9vBH';

const isConfigured = true;

export default function GiscusComments({ slug }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !isConfigured) return;
    ref.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', GISCUS_REPO);
    script.setAttribute('data-repo-id', GISCUS_REPO_ID);
    script.setAttribute('data-category', GISCUS_CATEGORY);
    script.setAttribute('data-category-id', GISCUS_CATEGORY_ID);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', 'dark');
    script.setAttribute('data-lang', 'pl');
    script.setAttribute('data-loading', 'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;
    ref.current.appendChild(script);
  }, [slug]);

  if (!isConfigured) return null;

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 60px' }}>
      <div style={{
        borderTop: '1px solid rgba(201,162,39,0.12)',
        paddingTop: 40,
        marginBottom: 32,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          letterSpacing: '2px',
          color: '#c9a227',
          textTransform: 'uppercase',
        }}>
          Komentarze
        </div>
        <div style={{ flex: 1, height: 1, background: 'rgba(201,162,39,0.08)' }} />
      </div>
      <div ref={ref} />
    </div>
  );
}
