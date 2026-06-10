import { toolOg, ogSize, ogContentType } from '@/lib/og-tool';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'Finansowy kalendarz 2026 - KisielFinanse';

export default function Image() {
  return toolOg({
    kicker: 'KALENDARZ',
    title: 'Finansowy kalendarz 2026',
    subtitle: 'RPP, podatki, ZUS, KSeF, emerytury - wszystkie daty',
    icon: '📅',
    accent: '#c9a227',
  });
}
