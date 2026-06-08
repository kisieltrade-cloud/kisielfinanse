import { NextRequest, NextResponse } from 'next/server';
import { resolveTarget } from '@/lib/providers';
import { trackAffiliateClick } from '@/lib/redis';

// Warstwa wyjścia afiliacyjnego.
// /go/[partner]?src=ranking-konta-osobiste
//  → zlicza kliknięcie w Redis (pomiar konwersji)
//  → 302 redirect na realny link partnerski (lub homepage banku jako fallback)
// Dzięki temu surowy link afiliacyjny NIE jest w HTML, da się go podmienić bez
// deployu treści, a my wiemy które rankingi/banki konwertują.

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ partner: string }> },
) {
  const { partner } = await ctx.params;
  const target = resolveTarget(partner);

  if (!target) {
    // Nieznany partner lub brak skonfigurowanego celu — wróć na ranking.
    return NextResponse.redirect(new URL('/ranking', req.url), 302);
  }

  const src = req.nextUrl.searchParams.get('src') ?? undefined;
  // Pomiar nie blokuje przekierowania (await jest szybki na Upstash REST).
  await trackAffiliateClick(partner, src);

  return NextResponse.redirect(target, 302);
}
