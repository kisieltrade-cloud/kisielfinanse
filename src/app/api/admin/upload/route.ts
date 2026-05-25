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

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'Brak pliku' }, { status: 400 });

  const articleSlug = (formData.get('slug') as string | null)?.trim() ?? '';
  const safeName = slugifyFilename(file.name);

  // Folder structure: blog/<article-slug>/<filename> or blog/<filename>
  const blobPath = articleSlug
    ? `blog/${articleSlug}/${safeName}`
    : `blog/${safeName}`;

  const blob = await put(blobPath, file, {
    access: 'public',
    addRandomSuffix: true, // prevents collisions, e.g. blog/foto-abc123.jpg
  });

  return NextResponse.json({ url: blob.url });
}
