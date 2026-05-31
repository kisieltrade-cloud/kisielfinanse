import { MetadataRoute } from 'next';
import { getAllPosts, tagToSlug } from '@/lib/posts';
import { postUrl } from '@/lib/url';
import { CATEGORIES } from '@/lib/categories';
import { CALCULATOR_SLUGS } from '@/lib/calculators';
import { GLOSSARY } from '@/lib/glossary';

const BASE_URL = 'https://kisielfinanse.pl';

// ISR — sitemap regeneruje się automatycznie co 30 minut.
// Po dodaniu nowego artykułu pojawi się w sitemapie w ciągu max 30 minut.
// Google jest pingowany natychmiast po publikacji przez CMS.
export const revalidate = 1800;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  // Najnowszy post w całym serwisie (do lastModified strony głównej i /blog)
  const latestPostDate = posts[0]?.dateISO ? new Date(posts[0].dateISO) : new Date();

  // Najnowszy post dla danej kategorii (dokładniejszy lastModified)
  const categoryLatestDate = (slug: string): Date => {
    const found = posts.find((p) => tagToSlug(p.tag) === slug);
    return found?.dateISO ? new Date(found.dateISO) : latestPostDate;
  };

  // ── Strony statyczne ────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: latestPostDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: latestPostDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/o-mnie`,
      lastModified: new Date('2026-05-21'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/wspolpraca`,
      lastModified: new Date('2026-05-21'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/quiz`,
      lastModified: new Date('2026-05-21'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/quiz/typ-inwestora`,
      lastModified: new Date('2026-05-21'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/quiz/wiedza`,
      lastModified: new Date('2026-05-21'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/kalkulator`,
      lastModified: new Date('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...CALCULATOR_SLUGS.map((slug) => ({
      url: `${BASE_URL}/kalkulator/${slug}`,
      lastModified: new Date('2026-05-26'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    {
      url: `${BASE_URL}/kalkulator-hipoteczny`,
      lastModified: new Date('2026-05-26'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/disclaimer`,
      lastModified: new Date('2026-05-21'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/polityka-prywatnosci`,
      lastModified: new Date('2026-05-21'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/regulamin`,
      lastModified: new Date('2026-05-31'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // ── Strony kategorii (5 × najwyższy priorytet po stronie głównej) ───────────
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/${cat.slug}`,
    lastModified: categoryLatestDate(cat.slug),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // ── Artykuły blogowe ────────────────────────────────────────────────────────
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}${postUrl(post)}`,
    // Jeśli post był aktualizowany, używamy daty aktualizacji
    lastModified: post.updatedISO
      ? new Date(post.updatedISO)
      : post.dateISO
      ? new Date(post.dateISO)
      : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // ── Słownik pojęć ───────────────────────────────────────────────────────────
  const glossaryPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/slownik`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    ...GLOSSARY.map((t) => ({
      url: `${BASE_URL}/slownik/${t.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ];

  return [...staticPages, ...categoryPages, ...blogPages, ...glossaryPages];
}
