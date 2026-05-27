import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const dynamic = 'force-dynamic';

function slugifyFilename(original: string): string {
  const ext = original.slice(original.lastIndexOf('.')).toLowerCase();
  const base = original.slice(0, original.lastIndexOf('.'));
  const slug = base
    .toLowerCase()
    .replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e')
    .replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o')
    .replace(/ś/g, 's').replace(/ź/g, 'z').replace(/ż/g, 'z')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug}${ext}`;
}

function isAuthorized(req: NextRequest): boolean {
  const cookie = req.cookies.get('admin_session')?.value ?? '';
  const expected = process.env.ADMIN_PASSWORD ?? '';
  return expected.length > 0 && cookie === expected;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'BLOB_READ_WRITE_TOKEN nie jest ustawiony w środowisku Vercel' },
      { status: 500 },
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Nieprawidłowe dane formularza' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'Brak pliku' }, { status: 400 });

  const articleSlug = (formData.get('slug') as string | null)?.trim() ?? '';
  const safeName = slugifyFilename(file.name);
  const blobPath = articleSlug ? `blog/${articleSlug}/${safeName}` : `blog/${safeName}`;

  try {
    const blob = await put(blobPath, file, {
      access: 'public',
      addRandomSuffix: true,
    });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Nieznany błąd Vercel Blob';
    console.error('[upload] Vercel Blob error:', message);
    return NextResponse.json({ error: `Błąd uploadu: ${message}` }, { status: 500 });
  }
}
