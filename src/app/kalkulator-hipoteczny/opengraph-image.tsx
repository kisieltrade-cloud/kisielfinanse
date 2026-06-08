import { toolOg, ogSize, ogContentType } from '@/lib/og-tool';

export const runtime = 'nodejs';
export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'Kalkulator hipoteczny - KisielFinanse';

export default function Image() {
  return toolOg({
    kicker: 'KALKULATOR',
    title: 'Kalkulator hipoteczny',
    subtitle: 'Policz ratę i zdolność kredytową',
    icon: '🏠',
    accent: '#2e7d4f',
  });
}
