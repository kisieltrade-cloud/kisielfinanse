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
  // Etykieta po lewej (domyślnie "#1" dla rankingu). Na stronie pojedynczego konta
  // przekazujemy np. gwiazdkę zamiast mylącej pozycji rankingowej.
  rankLabel?: string;
  // Nadpisuje dolny wiersz "badge · ocena X/5" (np. "Premia do 1000 zł").
  subtitle?: string;
}

export default function RankingStickyCTA({ name, score, goHref, ctaLabel, badge, rankLabel = '#1', subtitle }: Props) {
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
          <span className="rk-sticky-rank">{rankLabel}</span>
          <div className="rk-sticky-text">
            <strong>{name}</strong>
            <span>
              {subtitle ?? `${badge ? `${badge} · ` : ''}ocena ${score.toFixed(1)}/5`}
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
