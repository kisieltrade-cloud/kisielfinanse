import { toolOg, ogSize, ogContentType } from '@/lib/og-tool';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'Kalkulator emerytalny - ile dostaniesz z ZUS | KisielFinanse';

export default function Image() {
  return toolOg({
    kicker: 'KALKULATOR',
    title: 'Ile dostaniesz z ZUS?',
    subtitle: 'Prognoza emerytury, stopa zastąpienia i luka emerytalna',
    icon: '⏳',
    accent: '#2f80b5',
  });
}
