import { toolOg, ogSize, ogContentType } from '@/lib/og-tool';

export const runtime = 'nodejs';
export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'Symulator inwestycji - KisielFinanse';

export default function Image() {
  return toolOg({
    kicker: 'NARZĘDZIE',
    title: 'Symulator inwestycji',
    subtitle: 'Ile byś zarobił, inwestując regularnie?',
    icon: '📈',
    accent: '#2e7d4f',
  });
}
