import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tag: string;
  readTime: string;
  published: boolean;
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

      return {
        slug,
        title: data.title ?? 'Bez tytułu',
        date: data.date
          ? new Date(data.date).toLocaleDateString('pl-PL', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }).toUpperCase()
          : '',
        excerpt: data.excerpt ?? '',
        tag: data.tag ?? 'Trading',
        readTime: data.readTime ?? '5 min',
        published: data.published !== false,
      } as PostMeta;
    })
    .filter((p) => p.published)
    .sort((a, b) => {
      // Sort by raw date string in frontmatter — re-parse for comparison
      const af = fs.readFileSync(path.join(POSTS_DIR, `${a.slug}.mdx`), 'utf-8');
      const bf = fs.readFileSync(path.join(POSTS_DIR, `${b.slug}.mdx`), 'utf-8');
      const ad = matter(af).data.date as string;
      const bd = matter(bf).data.date as string;
      return new Date(bd).getTime() - new Date(ad).getTime();
    });

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

  return {
    slug,
    title: data.title ?? 'Bez tytułu',
    date: data.date
      ? new Date(data.date).toLocaleDateString('pl-PL', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : '',
    excerpt: data.excerpt ?? '',
    tag: data.tag ?? 'Trading',
    readTime: data.readTime ?? '5 min',
    published: data.published !== false,
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
