import { toolOg, ogSize, ogContentType } from '@/lib/og-tool';

export const runtime = 'nodejs';
export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'Słownik pojęć finansowych - KisielFinanse';

// Obejmuje /slownik oraz wszystkie hasła /slownik/* (dziedziczenie OG).
export default function Image() {
  return toolOg({
    kicker: 'SŁOWNIK',
    title: 'Słownik finansowy',
    subtitle: 'Pojęcia z inwestowania i finansów prosto wyjaśnione',
    icon: '📖',
    accent: '#c9a227',
  });
}
