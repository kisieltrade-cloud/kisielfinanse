import { toolOg, ogSize, ogContentType } from '@/lib/og-tool';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'Gdzie idą Twoje podatki - kalkulator KisielFinanse';

export default function Image() {
  return toolOg({
    kicker: 'KALKULATOR',
    title: 'Gdzie idą Twoje podatki?',
    subtitle: 'Ile co miesiąc oddajesz państwu i na co to idzie',
    icon: '🧾',
    accent: '#ff2d78',
  });
}
