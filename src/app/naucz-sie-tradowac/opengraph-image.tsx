import { toolOg, ogSize, ogContentType } from '@/lib/og-tool';

export const runtime = 'nodejs';
export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'Naucz się tradować - mapa drogowa od zera | KisielFinanse';

export default function Image() {
  return toolOg({
    kicker: 'PRZEWODNIK',
    title: 'Naucz się tradować',
    subtitle: '7 kroków od zera, formacje i realny harmonogram nauki',
    icon: '📈',
    accent: '#c9a227',
  });
}
