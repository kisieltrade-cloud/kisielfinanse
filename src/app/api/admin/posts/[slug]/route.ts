import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const dynamic = 'force-dynamic';

const POSTS_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

function findFile(slug: string): string | null {
  for (const ext of ['.mdx', '.md']) {
    const p = path.join(POSTS_DIR, `${slug}${ext}`);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const filePath = findFile(slug);
  if (!filePath) return NextResponse.json({ error: 'Nie znaleziono' }, { status: 404 });
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return NextResponse.json({ ...data, slug, content });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const filePath = findFile(slug);
  if (!filePath) return NextResponse.json({ error: 'Nie znaleziono' }, { status: 404 });

  const body = await req.json();
  const {
    title, excerpt, date, tag, readTime, published,
    content, metaTitle, metaDescription, author, image, gallery, keywords,
  } = body as {
    title?: string; excerpt?: string; date?: string; tag?: string;
    readTime?: string; published?: boolean; content?: string;
    metaTitle?: string; metaDescription?: string; author?: string;
    image?: string; gallery?: string[]; keywords?: string[];
  };

  const frontmatterData: Record<string, unknown> = {
    title, excerpt, date, tag, readTime: readTime || '5 min', published: published ?? false,
  };
  if (author) frontmatterData.author = author;
  if (image) frontmatterData.image = image;
  if (gallery?.length) frontmatterData.gallery = gallery;
  if (metaTitle) frontmatterData.metaTitle = metaTitle;
  if (metaDescription) frontmatterData.metaDescription = metaDescription;
  if (keywords?.length) frontmatterData.keywords = keywords;

  const fileContent = matter.stringify(content ?? '', frontmatterData);
  fs.writeFileSync(filePath, fileContent, 'utf-8');
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const filePath = findFile(slug);
  if (!filePath) return NextResponse.json({ error: 'Nie znaleziono' }, { status: 404 });
  fs.unlinkSync(filePath);
  return NextResponse.json({ ok: true });
}
