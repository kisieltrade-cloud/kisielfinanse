import { toolOg, ogSize, ogContentType } from '@/lib/og-tool';

export const runtime = 'nodejs';
export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'Indeks strachu i chciwości - KisielFinanse';

export default function Image() {
  return toolOg({
    kicker: 'NARZĘDZIE',
    title: 'Indeks strachu i chciwości',
    subtitle: 'Nastroje na rynkach: krypto, Polska, USA',
    icon: '🧭',
    accent: '#c9a227',
  });
}
