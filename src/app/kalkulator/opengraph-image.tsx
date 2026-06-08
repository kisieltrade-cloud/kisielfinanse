import { toolOg, ogSize, ogContentType } from '@/lib/og-tool';

export const runtime = 'nodejs';
export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'Kalkulatory finansowe - KisielFinanse';

// Obejmuje stronę /kalkulator oraz wszystkie podstrony /kalkulator/* (dziedziczenie OG).
export default function Image() {
  return toolOg({
    kicker: 'KALKULATORY',
    title: 'Kalkulatory finansowe',
    subtitle: 'Procent składany, kredyt, ETF, FIRE i więcej',
    icon: '🧮',
    accent: '#2e7d4f',
  });
}
