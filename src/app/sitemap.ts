import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { TERMS } from '@/lib/slownik-terms';

const BASE_URL = 'https://nysethtrading.pl';

function getBlogSlugs(): string[] {
  try {
    const dir = path.join(process.cwd(), 'src/content/blog');
    return fs.readdirSync(dir)
      .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
      .map(f => f.replace(/\.mdx?$/, ''));
  } catch {
    return [];
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getBlogSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                           lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/wyniki`,               lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/tygodnik`,             lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/o-mnie`,               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/blog`,                 lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/slownik`,              lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/wspolpraca`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/polityka-prywatnosci`, lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE_URL}/disclaimer`,           lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ];

  const blogPages: MetadataRoute.Sitemap = slugs.map(slug => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const slownikPages: MetadataRoute.Sitemap = TERMS.map(term => ({
    url: `${BASE_URL}/slownik/${term.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages, ...slownikPages];
}
