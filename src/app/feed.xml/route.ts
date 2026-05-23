import { getAllPosts } from '@/lib/posts';

const BASE_URL = 'https://kisielfinanse.pl';

export async function GET() {
  const posts = await getAllPosts();

  const items = posts
    .filter((p) => p.published)
    .map((p) => {
      const url = `${BASE_URL}/blog/${p.slug}`;
      const pubDate = p.dateISO ? new Date(p.dateISO).toUTCString() : new Date().toUTCString();
      const desc = p.excerpt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const title = p.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `
    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${desc}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${p.tag}</category>
      ${p.image ? `<enclosure url="${BASE_URL}${p.image}" type="${p.image.endsWith('.png') ? 'image/png' : p.image.endsWith('.webp') ? 'image/webp' : 'image/jpeg'}" length="0" />` : ''}
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>KisielFinanse - Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>Finanse. Wiedza. Wolność. Trading, krypto, oszczędzanie, geopolityka — praktyczna edukacja finansowa bez ściemy.</description>
    <language>pl-PL</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${BASE_URL}/logo.png</url>
      <title>KisielFinanse</title>
      <link>${BASE_URL}</link>
    </image>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
