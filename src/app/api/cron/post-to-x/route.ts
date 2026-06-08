import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { TwitterApi } from 'twitter-api-v2';
import { getAllPosts, type PostMeta } from '@/lib/posts';
import { tagToSlug } from '@/lib/url';

// Auto-publikacja nowych artykułów na X (Twitter).
// Wywoływane przez Vercel Cron (patrz vercel.json). Bezpieczne i idempotentne:
//  - bez kluczy X → uśpione (nic nie robi),
//  - dedupe przez Redis (set `x:posted`), więc żaden artykuł nie poleci dwa razy,
//  - okno 36h → przy pierwszym uruchomieniu NIE zalewa całym archiwum,
//  - limit MAX_PER_RUN → ochrona przed spamem i limitami API.

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const BASE_URL = 'https://kisielfinanse.pl';
const POSTED_SET = 'x:posted';
const WINDOW_MS = 36 * 60 * 60 * 1000; // tylko artykuły z ostatnich 36h
const MAX_PER_RUN = 3;

const CAT_HASHTAG: Record<string, string> = {
  trading: '#trading',
  inwestycje: '#inwestycje',
  pieniadze: '#oszczędzanie',
  psychologia: '#psychologia',
  gospodarka: '#gospodarka',
};

function buildTweet(post: PostMeta): string {
  const cat = tagToSlug(post.tag);
  const url = `${BASE_URL}/${cat}/${post.slug}`;
  const tags = [CAT_HASHTAG[cat], '#finanse', '#KisielFinanse'].filter(Boolean).join(' ');
  // X liczy każdy link jako 23 znaki (t.co). Budżet 280: tytuł + 2x"\n\n" + url(23) + tagi.
  const fixed = 23 + 4 + tags.length + 1;
  let title = post.title;
  if (title.length + fixed > 280) title = title.slice(0, 280 - fixed - 1).trimEnd() + '…';
  return `${title}\n\n${url}\n\n${tags}`;
}

export async function GET(req: Request) {
  // 1. Autoryzacja — Vercel Cron dołącza nagłówek Bearer CRON_SECRET (jeśli ustawiony).
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // 2. Klucze X — brak = funkcja uśpiona (bezpieczny deploy bez konfiguracji).
  const appKey = process.env.TWITTER_APP_KEY;
  const appSecret = process.env.TWITTER_APP_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET;
  if (!appKey || !appSecret || !accessToken || !accessSecret) {
    return NextResponse.json({ skipped: 'Brak kluczy X — auto-post uśpiony. Dodaj zmienne TWITTER_* na Vercelu.' });
  }
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return NextResponse.json({ error: 'Brak konfiguracji Redis (UPSTASH_REDIS_REST_*)' }, { status: 500 });
  }

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  // 3. Kandydaci: opublikowane (getAllPosts filtruje published + date<=now), z ostatnich 36h.
  const now = Date.now();
  const posts = await getAllPosts();
  const recent = posts.filter(
    (p) => p.dateISO && now - new Date(p.dateISO).getTime() <= WINDOW_MS,
  );

  // 4. Odrzuć już wrzucone (Redis), najstarsze najpierw, limit na przebieg.
  const fresh: PostMeta[] = [];
  for (const p of recent) {
    const already = await redis.sismember(POSTED_SET, p.slug);
    if (!already) fresh.push(p);
  }
  fresh.sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime());
  const toPost = fresh.slice(0, MAX_PER_RUN);

  if (toPost.length === 0) {
    return NextResponse.json({ posted: 0, note: 'Brak nowych artykułów do wrzucenia.' });
  }

  const client = new TwitterApi({ appKey, appSecret, accessToken, accessSecret });

  const results: { slug: string; ok: boolean; id?: string; error?: string }[] = [];
  for (const p of toPost) {
    try {
      const res = await client.v2.tweet(buildTweet(p));
      await redis.sadd(POSTED_SET, p.slug); // oznacz dopiero po sukcesie
      results.push({ slug: p.slug, ok: true, id: res.data?.id });
    } catch (e) {
      // nie zapisujemy do POSTED_SET → spróbuje ponownie w kolejnym przebiegu
      results.push({ slug: p.slug, ok: false, error: (e as Error).message });
    }
  }

  return NextResponse.json({ posted: results.filter((r) => r.ok).length, results });
}
