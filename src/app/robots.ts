import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/kf-7q3x-cms/',
        '/_next/static/',   // skompilowane czcionki, JS, CSS — nie indeksuj
        '/_next/image/',    // endpoint optymalizacji obrazków
      ],
    },
    sitemap: 'https://kisielfinanse.pl/sitemap.xml',
  };
}
