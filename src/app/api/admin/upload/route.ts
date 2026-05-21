import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function slugifyFilename(original: string): string {
  const ext = path.extname(original).toLowerCase();
  const base = path.basename(original, path.extname(original));
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

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), 'public', 'images', 'blog');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const baseName = slugifyFilename(file.name);
  const ext = path.extname(baseName);
  const stem = path.basename(baseName, ext);

  // Avoid collision: append -2, -3, ... if file already exists
  let finalName = baseName;
  let counter = 1;
  while (fs.existsSync(path.join(uploadDir, finalName))) {
    counter += 1;
    finalName = `${stem}-${counter}${ext}`;
  }

  fs.writeFileSync(path.join(uploadDir, finalName), buffer);
  return NextResponse.json({ url: `/images/blog/${finalName}` });
}
