import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

export interface PostMeta {
  slug: string;
  title: string;
  date: string;       // sformatowana dla wyświetlania, np. "03 MAR 2026"
  dateISO: string;    // ISO 8601 dla schema.org i OG, np. "2026-03-03"
  excerpt: string;
  tag: string;
  readTime: string;
  published: boolean;
  keywords?: string[];
}

export interface Post extends PostMeta {
  content: string;
}

// ─── Read all posts (sorted by date desc) ────────────────────────────────────
export async function getAllPosts(): Promise<PostMeta[]> {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

  const posts = files
    .map((file) => {
      const slug = file.replace(/\.(mdx|md)$/, '');
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
      const { data } = matter(raw);
      const rawDate = (data.date as string) || '';

      return {
        slug,
        title: data.title ?? 'Bez tytułu',
        date: rawDate
          ? new Date(rawDate).toLocaleDateString('pl-PL', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }).toUpperCase()
          : '',
        dateISO: rawDate ? rawDate : '',
        excerpt: data.excerpt ?? '',
        tag: data.tag ?? 'Trading',
        readTime: data.readTime ?? '5 min',
        published: data.published !== false,
        keywords: data.keywords ?? [],
        _rawDate: rawDate,
      };
    })
    .filter((p) => p.published)
    .sort((a, b) => new Date(b._rawDate).getTime() - new Date(a._rawDate).getTime())
    .map(({ _rawDate: _, ...p }) => p as PostMeta);

  return posts;
}

// ─── Get single post ──────────────────────────────────────────────────────────
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const extensions = ['.mdx', '.md'];
  let filePath = '';

  for (const ext of extensions) {
    const candidate = path.join(POSTS_DIR, `${slug}${ext}`);
    if (fs.existsSync(candidate)) {
      filePath = candidate;
      break;
    }
  }

  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  const rawDate = (data.date as string) || '';
  return {
    slug,
    title: data.title ?? 'Bez tytułu',
    date: rawDate
      ? new Date(rawDate).toLocaleDateString('pl-PL', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : '',
    dateISO: rawDate,
    excerpt: data.excerpt ?? '',
    tag: data.tag ?? 'Trading',
    readTime: data.readTime ?? '5 min',
    published: data.published !== false,
    keywords: data.keywords ?? [],
    content,
  };
}

// ─── Get all slugs (for generateStaticParams) ─────────────────────────────────
export async function getAllSlugs(): Promise<string[]> {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((f) => f.replace(/\.(mdx|md)$/, ''));
}
