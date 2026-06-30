import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { tagToSlug as _tagToSlug } from './url';

const POSTS_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

export interface FaqItem {
  q: string;
  a: string;
}

export interface HowToStep {
  name: string;
  text: string;
}

function calcReadTime(content: string): string {
  const text = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*_~>`|]/g, '')
    .trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min`;
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;       // sformatowana dla wyświetlania, np. "03 MAR 2026"
  dateISO: string;    // ISO 8601 dla schema.org i OG, np. "2026-03-03"
  updatedISO?: string; // ISO 8601 daty ostatniej aktualizacji (opcjonalne)
  excerpt: string;
  tag: string;
  readTime: string;
  published: boolean;
  author?: string;
  keywords?: string[];
  image?: string;
  gallery?: string[];
  metaTitle?: string;       // custom SEO title (z CMS); jeśli brak → używamy title
  metaDescription?: string; // custom meta description (z CMS); jeśli brak → używamy excerpt
  noindex?: boolean;        // frontmatter noindex:true → strona z meta robots noindex (poza Google)
}

export interface Post extends PostMeta {
  content: string;
  faq: FaqItem[];
  howto?: { title?: string; steps: HowToStep[] };
}

// ─── Read all posts (sorted by date desc) ────────────────────────────────────
export async function getAllPosts(): Promise<PostMeta[]> {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

  const now = new Date();

  const posts = files
    .map((file) => {
      const slug = file.replace(/\.(mdx|md)$/, '');
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
      const { data, content } = matter(raw);
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
        updatedISO: (data.updated as string) || undefined,
        excerpt: data.excerpt ?? '',
        tag: data.tag ?? 'Trading',
        readTime: data.readTime ?? calcReadTime(content),
        published: data.published !== false,
        author: (data.author as string) || undefined,
        keywords: data.keywords ?? [],
        image: data.image ?? '',
        gallery: data.gallery ?? [],
        metaTitle: (data.metaTitle as string) || undefined,
        metaDescription: (data.metaDescription as string) || undefined,
        noindex: data.noindex === true,
        _rawDate: rawDate,
      };
    })
    .filter((p) => p.published && p._rawDate !== '' && new Date(p._rawDate) <= now)
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
    updatedISO: (data.updated as string) || undefined,
    excerpt: data.excerpt ?? '',
    tag: data.tag ?? 'Trading',
    readTime: data.readTime ?? '5 min',
    published: data.published !== false,
    keywords: data.keywords ?? [],
    image: data.image ?? '',
    gallery: data.gallery ?? [],
    metaTitle: (data.metaTitle as string) || undefined,
    metaDescription: (data.metaDescription as string) || undefined,
    noindex: data.noindex === true,
    faq: Array.isArray(data.faq) ? (data.faq as FaqItem[]) : [],
    howto: Array.isArray(data.howto) && data.howto.length > 0
      ? { title: (data.howtoTitle as string) || undefined, steps: data.howto as HowToStep[] }
      : undefined,
    content,
  };
}

// ─── Tag utilities ────────────────────────────────────────────────────────────
// Re-export from url.ts so existing imports from @/lib/posts continue to work
export { tagToSlug } from './url';

export async function getAllTags(): Promise<{ tag: string; slug: string; count: number }[]> {
  const posts = await getAllPosts();
  const map = new Map<string, number>();
  posts.forEach((p) => map.set(p.tag, (map.get(p.tag) ?? 0) + 1));
  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, slug: _tagToSlug(tag), count }))
    .sort((a, b) => b.count - a.count);
}

export async function getPostsByTag(tagSlug: string): Promise<{ posts: PostMeta[]; tag: string } | null> {
  const posts = await getAllPosts();
  const matched = posts.filter((p) => _tagToSlug(p.tag) === tagSlug);
  if (matched.length === 0) return null;
  return { posts: matched, tag: matched[0].tag };
}

// ─── Get all slugs (for generateStaticParams) ─────────────────────────────────
export async function getAllSlugs(): Promise<string[]> {
  const posts = await getAllPosts(); // already filters published: false
  return posts.map((p) => p.slug);
}
