import { toolOg, ogSize, ogContentType } from '@/lib/og-tool';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'Kiedy uzbierasz milion - kalkulator KisielFinanse';

export default function Image() {
  return toolOg({
    kicker: 'KALKULATOR',
    title: 'Kiedy uzbierasz milion?',
    subtitle: 'Ile odkładać i za ile lat odłożysz pierwszy milion',
    icon: '🏆',
    accent: '#16a34a',
  });
}
