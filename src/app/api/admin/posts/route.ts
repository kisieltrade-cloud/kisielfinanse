import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { useGitHub, ghGetFileSha, ghWriteFile } from '@/lib/github-cms';

async function pingGoogle() {
  try {
    await fetch('https://www.google.com/ping?sitemap=https://kisielfinanse.pl/sitemap.xml');
  } catch {}
}

export const dynamic = 'force-dynamic';

const POSTS_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

export async function GET() {
  if (!fs.existsSync(POSTS_DIR)) return NextResponse.json([]);
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));
  const posts = files
    .map((file) => {
      const slug = file.replace(/\.(mdx|md)$/, '');
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
      const { data } = matter(raw);
      return {
        slug,
        title: (data.title as string) ?? 'Bez tytułu',
        date: (data.date as string) ?? '',
        published: data.published !== false,
        tag: (data.tag as string) ?? '',
        excerpt: (data.excerpt as string) ?? '',
        image: (data.image as string) ?? '',
        readTime: (data.readTime as string) ?? '',
        author: (data.author as string) ?? '',
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    slug, title, excerpt, date, tag, readTime, published,
    content, metaTitle, metaDescription, author, image, gallery, keywords, faq,
  } = body as {
    slug: string; title: string; excerpt?: string; date?: string; tag?: string;
    readTime?: string; published?: boolean; content?: string; metaTitle?: string;
    metaDescription?: string; author?: string; image?: string;
    gallery?: string[]; keywords?: string[];
    faq?: Array<{ q: string; a: string }>;
  };

  if (!slug || !title)
    return NextResponse.json({ error: 'Slug i tytuł są wymagane' }, { status: 400 });

  const filename = `${slug}.mdx`;

  const frontmatterData: Record<string, unknown> = {
    title, excerpt, date, tag, readTime: readTime || '5 min', published: published ?? false,
  };
  if (author) frontmatterData.author = author;
  if (image) frontmatterData.image = image;
  if (gallery?.length) frontmatterData.gallery = gallery;
  if (metaTitle) frontmatterData.metaTitle = metaTitle;
  if (metaDescription) frontmatterData.metaDescription = metaDescription;
  if (keywords?.length) frontmatterData.keywords = keywords;
  if (faq?.length) frontmatterData.faq = faq;

  const fileContent = matter.stringify(content ?? '', frontmatterData);

  if (useGitHub()) {
    // Produkcja: sprawdź czy plik już istnieje w repo
    const existing = await ghGetFileSha(filename);
    if (existing) return NextResponse.json({ error: 'Artykuł z tym slugiem już istnieje' }, { status: 409 });
    // Utwórz nowy plik (sha=null → create)
    const result = await ghWriteFile(filename, fileContent, null, `cms: create ${slug}`);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
    pingGoogle();
    return NextResponse.json({ ok: true, slug });
  }

  // Lokalnie: zapis na dysk
  const filePath = path.join(POSTS_DIR, filename);
  if (fs.existsSync(filePath))
    return NextResponse.json({ error: 'Artykuł z tym slugiem już istnieje' }, { status: 409 });
  if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });
  fs.writeFileSync(filePath, fileContent, 'utf-8');
  return NextResponse.json({ ok: true, slug });
}
