import { toolOg, ogSize, ogContentType } from '@/lib/og-tool';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'Dług publiczny Polski 2026 - KisielFinanse';

export default function Image() {
  return toolOg({
    kicker: 'ANALIZA',
    title: 'Dług publiczny Polski',
    subtitle: 'Przebiliśmy 60% PKB. Co to znaczy dla twojego portfela?',
    icon: '📉',
    accent: '#ff2d78',
  });
}
