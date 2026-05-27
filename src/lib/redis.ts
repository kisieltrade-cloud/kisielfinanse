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
