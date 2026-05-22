import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/kf-7q3x-cms/'],
    },
    sitemap: 'https://kisielfinanse.pl/sitemap.xml',
  };
}
