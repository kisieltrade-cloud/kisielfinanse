import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/kf-7q3x-cms/',
        '/ebook/', // lead magnet — dostępny tylko mailem dla subskrybentów, nie indeksować
        // /_next/static/ i /_next/image/ celowo NIE są blokowane —
        // Googlebot musi mieć dostęp do JS/CSS/fontów żeby wyrenderować stronę.
        // Google nie indeksuje tych plików jako stron — blokowanie tylko szkodzi SEO.
      ],
    },
    sitemap: 'https://kisielfinanse.pl/sitemap.xml',
  };
}
