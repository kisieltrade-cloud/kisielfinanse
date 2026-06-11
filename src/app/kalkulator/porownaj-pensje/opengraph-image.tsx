import { toolOg, ogSize, ogContentType } from '@/lib/og-tool';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'Porównaj swoją pensję na tle Polski - KisielFinanse';

export default function Image() {
  return toolOg({
    kicker: 'KALKULATOR',
    title: 'Porównaj swoją pensję',
    subtitle: 'Więcej niż ile procent Polaków zarabiasz?',
    icon: '📊',
    accent: '#6366f1',
  });
}
