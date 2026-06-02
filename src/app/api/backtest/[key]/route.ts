import { NextRequest, NextResponse } from 'next/server';
import { getAsset, getMonthlyPrices } from '@/lib/backtest';

export const runtime = 'nodejs';
export const revalidate = 86400;

export async function GET(_req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const asset = getAsset(key);
  if (!asset) {
    return NextResponse.json({ error: 'Nieznane aktywo.' }, { status: 404 });
  }
  try {
    const prices = await getMonthlyPrices(asset.symbol);
    return NextResponse.json({ prices });
  } catch {
    return NextResponse.json({ error: 'Dane chwilowo niedostępne.', prices: [] }, { status: 502 });
  }
}
