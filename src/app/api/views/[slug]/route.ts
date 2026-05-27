import { NextRequest, NextResponse } from 'next/server';
import { getViews, incrementViews } from '@/lib/redis';

export const runtime = 'nodejs';

interface Params { params: Promise<{ slug: string }> }

// GET /api/views/[slug] — pobierz liczbe wyswietlen
export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  try {
    const views = await getViews(slug);
    return NextResponse.json({ views });
  } catch {
    return NextResponse.json({ views: 0 });
  }
}

// POST /api/views/[slug] — inkrementuj (wywolywane przy wejsciu na artykul)
export async function POST(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  try {
    const views = await incrementViews(slug);
    return NextResponse.json({ views });
  } catch {
    return NextResponse.json({ views: 0 });
  }
}
