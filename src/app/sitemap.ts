import { MetadataRoute } from 'next';
import { getAllPosts, getAllTags } from '@/lib/posts';

const BASE_URL = 'https://kisielfinanse.pl';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                              lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/blog`,                    lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/o-mnie`,                  lastModified: new Date('2026-05-21'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/wspolpraca`,              lastModified: new Date('2026-05-21'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/kalkulator`,             lastModified: new Date('2026-05-21'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/disclaimer`,              lastModified: new Date('2026-05-21'), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE_URL}/polityka-prywatnosci`,    lastModified: new Date('2026-05-21'), changeFrequency: 'yearly',  priority: 0.3 },
  ];

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.dateISO ? new Date(post.dateISO) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const tagPages: MetadataRoute.Sitemap = tags.map(({ slug }) => ({
    url: `${BASE_URL}/blog/tag/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages, ...tagPages];
}
