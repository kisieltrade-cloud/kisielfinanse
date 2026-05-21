'use client';

import { useEffect, useRef } from 'react';

interface Props {
  slug: string;
}

// Configure at https://giscus.app — fill in your repo details below
const GISCUS_REPO = 'TWOJ_USERNAME/TWOJE_REPO';       // np. 'kisielfinanse/kisielfinanse.pl'
const GISCUS_REPO_ID = 'REPO_ID_Z_GISCUS';             // z kreatora na giscus.app
const GISCUS_CATEGORY = 'General';                      // nazwa kategorii Discussions
const GISCUS_CATEGORY_ID = 'CATEGORY_ID_Z_GISCUS';     // z kreatora na giscus.app

export default function GiscusComments({ slug }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
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

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 60px' }}>
      <div style={{
        borderTop: '1px solid rgba(0,245,212,0.12)',
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
          color: '#00f5d4',
          textTransform: 'uppercase',
        }}>
          Komentarze
        </div>
        <div style={{ flex: 1, height: 1, background: 'rgba(0,245,212,0.08)' }} />
      </div>
      <div ref={ref} />
    </div>
  );
}
