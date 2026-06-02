import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// ── Views ──────────────────────────────────────────────
export async function getViews(slug: string): Promise<number> {
  const v = await redis.get<number>(`views:${slug}`);
  return v ?? 0;
}

export async function incrementViews(slug: string): Promise<number> {
  return await redis.incr(`views:${slug}`);
}

export async function getManyViews(slugs: string[]): Promise<Record<string, number>> {
  if (slugs.length === 0) return {};
  const keys = slugs.map(s => `views:${s}` as const);
  const values = await redis.mget<number[]>(...keys);
  return Object.fromEntries(slugs.map((s, i) => [s, values[i] ?? 0]));
}

// ── Newsletter subscribers ─────────────────────────────
export async function addSubscriber(email: string): Promise<'ok' | 'exists'> {
  const added = await redis.sadd('newsletter:subscribers', email);
  return added === 1 ? 'ok' : 'exists';
}

export async function getSubscriberCount(): Promise<number> {
  return await redis.scard('newsletter:subscribers');
}

export async function isSubscribed(email: string): Promise<boolean> {
  return (await redis.sismember('newsletter:subscribers', email)) === 1;
}

// ── Komentarze ─────────────────────────────────────────
export interface StoredComment {
  id: string;
  name: string;
  text: string;
  ts: number;
  email: string; // przechowywany, NIE zwracany publicznie
}
export type PublicComment = Omit<StoredComment, 'email'>;

export async function addComment(slug: string, c: StoredComment): Promise<void> {
  await redis.lpush(`comments:${slug}`, JSON.stringify(c)); // najnowszy na górze
  await redis.ltrim(`comments:${slug}`, 0, 499);            // limit 500 na artykuł
}

export async function getComments(slug: string): Promise<PublicComment[]> {
  const raw = await redis.lrange(`comments:${slug}`, 0, 199);
  const out: PublicComment[] = [];
  for (const item of raw as unknown[]) {
    try {
      const c = (typeof item === 'string' ? JSON.parse(item) : item) as StoredComment;
      if (c && c.id) out.push({ id: c.id, name: c.name, text: c.text, ts: c.ts });
    } catch { /* pomiń uszkodzony wpis */ }
  }
  return out;
}

// Zwraca true jeśli wolno komentować (i ustawia cooldown 30s na e-mail).
export async function commentAllowed(email: string): Promise<boolean> {
  const res = await redis.set(`commentcd:${email}`, '1', { nx: true, ex: 30 });
  return res === 'OK';
}
