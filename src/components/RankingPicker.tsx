'use client';

import React, { useState } from 'react';
import { getProvider } from '@/lib/providers';

// Interaktywny dobieracz konta: użytkownik klika, co jest dla niego najważniejsze,
// a my od razu pokazujemy najlepiej dopasowane konto + CTA (prosto do banku).
// Zwiększa zaangażowanie, czas na stronie i konwersję.

export interface PickerItem {
  name: string;
  slug: string;
  providerId: string;
  ctaLabel: string;
  score: number;
  scores: { label: string; value: number }[];
}

interface Props {
  items: PickerItem[];
  rankingSlug: string;
  criteria: { key: string; label: string }[];
}

function bestFor(items: PickerItem[], key: string): PickerItem | undefined {
  if (items.length === 0) return undefined;
  if (key === '__overall') {
    return [...items].sort((a, b) => b.score - a.score)[0];
  }
  const val = (it: PickerItem) => it.scores.find((s) => s.label === key)?.value ?? 0;
  return [...items].sort((a, b) => val(b) - val(a) || b.score - a.score)[0];
}

function Mono({ providerId, size = 40 }: { providerId: string; size?: number }) {
  const p = getProvider(providerId);
  if (!p) return null;
  const len = p.logoText.length;
  const fontPx = Math.round(size * (len <= 1 ? 0.5 : len === 2 ? 0.38 : 0.3));
  return (
    <span
      className="bank-logo bank-logo--mono"
      style={{ width: size, height: size, borderRadius: 11, background: p.brand, fontSize: fontPx }}
      aria-label={`${p.name} logo`}
    >
      <span>{p.logoText}</span>
    </span>
  );
}

export default function RankingPicker({ items, rankingSlug, criteria }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const result = active ? bestFor(items, active) : undefined;
  const activeLabel = criteria.find((c) => c.key === active)?.label ?? '';
  const statValue = (it: PickerItem) =>
    active && active !== '__overall' ? it.scores.find((s) => s.label === active)?.value : it.score;

  return (
    <section className="rk-picker" aria-label="Dobierz konto dla siebie">
      <div className="rk-picker-glow" aria-hidden="true" />
      <div className="rk-picker-head">
        <span className="rk-eyebrow">Dobierz w 1 kliknięciu</span>
        <h2 className="rk-h2">Co jest dla Ciebie najważniejsze?</h2>
      </div>

      <div className="rk-picker-opts" role="group">
        {criteria.map((c) => (
          <button
            key={c.key}
            type="button"
            className={`rk-picker-opt${active === c.key ? ' rk-picker-opt--on' : ''}`}
            onClick={() => setActive(c.key)}
            aria-pressed={active === c.key}
          >
            {c.label}
          </button>
        ))}
      </div>

      {result && (
        <div className="rk-picker-result" role="status">
          <Mono providerId={result.providerId} size={46} />
          <div className="rk-picker-result-text">
            <span className="rk-picker-result-label">
              {active === '__overall' ? 'Najlepsze ogólnie' : `Najlepsze pod kątem: ${activeLabel.toLowerCase()}`}
            </span>
            <strong>{result.name}</strong>
            <span className="rk-picker-result-score">
              Ocena {(statValue(result) ?? result.score).toFixed(1)}/5
            </span>
          </div>
          <div className="rk-picker-result-cta">
            <a
              href={`/go/${result.providerId}?src=picker-${rankingSlug}`}
              className="rk-cta rk-cta--glow"
              rel="sponsored nofollow noopener"
              target="_blank"
            >
              {result.ctaLabel} →
            </a>
            <a href={`/konto/${result.slug}`} className="rk-picker-more">Czytaj więcej</a>
          </div>
        </div>
      )}
    </section>
  );
}
