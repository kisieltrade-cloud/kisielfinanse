import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { TERMS } from '@/lib/slownik-terms';

const BASE_URL = 'https://nysethtrading.pl';

// Daty statycznych stron — aktualizuj ręcznie gdy zmienia się treść
const STATIC_DATES: Record<string, string> = {
  '/':                        '2026-04-07', // aktualizowane co tydzień (wyniki)
  '/wyniki':                  '2026-04-07', // aktualizowane co tydzień
  '/tygodnik':                '2026-04-07', // aktualizowane co tydzień
  '/o-mnie':                  '2026-03-01',
  '/blog':                    '2026-04-14', // zmienia się gdy pojawia się nowy post
  '/slownik':                 '2026-03-01',
  '/wspolpraca':              '2026-03-01',
  '/zasoby':                  '2026-03-01',
  '/polityka-prywatnosci':    '2026-03-01',
  '/disclaimer':              '2026-03-01',
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                           lastModified: STATIC_DATES['/'],                     changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/wyniki`,               lastModified: STATIC_DATES['/wyniki'],               changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/tygodnik`,             lastModified: STATIC_DATES['/tygodnik'],             changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/o-mnie`,               lastModified: STATIC_DATES['/o-mnie'],               changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/blog`,                 lastModified: STATIC_DATES['/blog'],                 changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/slownik`,              lastModified: STATIC_DATES['/slownik'],              changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/wspolpraca`,           lastModified: STATIC_DATES['/wspolpraca'],           changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/zasoby`,               lastModified: STATIC_DATES['/zasoby'],               changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/polityka-prywatnosci`, lastModified: STATIC_DATES['/polityka-prywatnosci'], changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE_URL}/disclaimer`,           lastModified: STATIC_DATES['/disclaimer'],           changeFrequency: 'yearly',  priority: 0.3 },
  ];

  // Blog — używamy rzeczywistych dat z frontmatter
  const blogPages: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.dateISO || new Date().toISOString().split('T')[0],
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Słownik — rzadko się zmienia
  const slownikPages: MetadataRoute.Sitemap = TERMS.map(term => ({
    url: `${BASE_URL}/slownik/${term.slug}`,
    lastModified: STATIC_DATES['/slownik'],
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages, ...slownikPages];
}
