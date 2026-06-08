import React from 'react';
import Image from 'next/image';
import { getProvider } from '@/lib/providers';

// Logo dostawcy. Jeśli w providers.ts ustawiono `logoImg`, renderuje plik;
// w przeciwnym razie czysty monogram z koloru marki (spójny, premium placeholder,
// trywialny do podmiany na prawdziwe logo bez zmian w stronach rankingu).

interface Props {
  id: string;
  size?: number;       // px (kwadrat) — gdy brak width/height
  width?: number;      // px — prostokątny obszar (lepszy dla logotypów-wordmarków)
  height?: number;     // px
  rounded?: number;    // promień zaokrąglenia
}

export default function BankLogo({ id, size = 44, width, height, rounded = 12 }: Props) {
  const p = getProvider(id);
  const w = width ?? size;
  const h = height ?? size;
  if (!p) {
    return (
      <span
        className="bank-logo bank-logo--empty"
        style={{ width: w, height: h, borderRadius: rounded }}
        aria-hidden="true"
      />
    );
  }

  if (p.logoImg) {
    return (
      <span
        className="bank-logo bank-logo--img"
        style={{ width: w, height: h, borderRadius: rounded }}
      >
        <Image src={p.logoImg} alt={`${p.name} logo`} fill sizes={`${w}px`} style={{ objectFit: 'contain' }} />
      </span>
    );
  }

  // Monogram: kolor marki + skrót. Rozmiar fontu skalowany do długości tekstu.
  const len = p.logoText.length;
  const fontPx = Math.round(Math.min(w, h) * (len <= 1 ? 0.5 : len === 2 ? 0.38 : 0.3));

  return (
    <span
      className="bank-logo bank-logo--mono"
      title={p.name}
      style={{
        width: w,
        height: h,
        borderRadius: rounded,
        background: p.brand,
        fontSize: fontPx,
      }}
      aria-label={`${p.name} logo`}
    >
      <span>{p.logoText}</span>
    </span>
  );
}
