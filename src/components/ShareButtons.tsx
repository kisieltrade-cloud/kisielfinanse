'use client';

import { useState } from 'react';

interface Props {
  title: string;
  slug: string;
}

const BASE_URL = 'https://kisielfinanse.pl';

export default function ShareButtons({ title, slug }: Props) {
  const [copied, setCopied] = useState(false);

  const pageUrl = `${BASE_URL}/blog/${slug}`;
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(title);

  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=KisielFinanse`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = pageUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const btnStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    borderRadius: 8,
    fontSize: '0.78rem',
    fontFamily: 'system-ui, sans-serif',
    fontWeight: 500,
    cursor: 'pointer',
    textDecoration: 'none',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
    color: '#a0a8bc',
    transition: 'all 0.15s',
  };

  return (
    <div style={{
      maxWidth: 860,
      margin: '0 auto',
      padding: '32px 24px 0',
      borderTop: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {/* X / Twitter */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...btnStyle }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(29,161,242,0.1)';
            e.currentTarget.style.borderColor = 'rgba(29,161,242,0.3)';
            e.currentTarget.style.color = '#1da1f2';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = '#a0a8bc';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          X / Twitter
        </a>

        {/* Facebook */}
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...btnStyle }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(24,119,242,0.1)';
            e.currentTarget.style.borderColor = 'rgba(24,119,242,0.3)';
            e.currentTarget.style.color = '#1877f2';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = '#a0a8bc';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook
        </a>

        {/* Copy link */}
        <button
          onClick={handleCopy}
          style={{
            ...btnStyle,
            ...(copied ? {
              background: 'rgba(16,185,129,0.1)',
              borderColor: 'rgba(16,185,129,0.3)',
              color: '#10b981',
            } : {}),
          }}
          onMouseEnter={(e) => {
            if (!copied) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = '#e8edf5';
            }
          }}
          onMouseLeave={(e) => {
            if (!copied) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.color = '#a0a8bc';
            }
          }}
        >
          {copied ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Skopiowano!
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Kopiuj link
            </>
          )}
        </button>
      </div>
    </div>
  );
}
