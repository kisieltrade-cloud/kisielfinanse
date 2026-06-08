'use client';

import React, { useEffect, useState } from 'react';

// Przyklejony pasek konwersji: pokazuje się po przewinięciu poza spotlight
// zwycięzcy i znika u samego dołu (przy stopce). Czysto kliencki, lekki.

interface Props {
  name: string;
  score: number;
  goHref: string;
  ctaLabel: string;
  badge?: string;
}

export default function RankingStickyCTA({ name, score, goHref, ctaLabel, badge }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      // Pokaż po zejściu poniżej ~600px i ukryj w ostatnich 600px (stopka).
      setShow(y > 600 && y < max - 600);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`rk-sticky${show ? ' rk-sticky--on' : ''}`} aria-hidden={!show}>
      <div className="rk-sticky-inner">
        <div className="rk-sticky-info">
          <span className="rk-sticky-rank">#1</span>
          <div className="rk-sticky-text">
            <strong>{name}</strong>
            <span>
              {badge ? `${badge} · ` : ''}ocena {score.toFixed(1)}/5
            </span>
          </div>
        </div>
        <a
          href={goHref}
          className="rk-cta rk-cta--glow"
          rel="sponsored nofollow noopener"
          target="_blank"
          tabIndex={show ? 0 : -1}
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  );
}
