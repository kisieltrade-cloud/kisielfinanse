/**
 * Rewers linkowania słownika: dla danego hasła znajduje opublikowane artykuły,
 * które je wspominają. Używane na stronach /slownik/[slug] ("Artykuły na ten temat").
 *
 * Indeks treści budowany jest raz na proces (build) i cache'owany, więc 111 stron haseł
 * nie czyta plików artykułów po wielokroć.
 */
import { getAllPosts, getPostBySlug } from './posts';
import { postUrl } from './url';

export interface RelatedArticle {
  slug: string;
  title: string;
  tag: string;
  url: string;
}

interface IndexedArticle extends RelatedArticle {
  text: string; // treść artykułu zmniejszona do lowercase, do dopasowań
}

let _index: IndexedArticle[] | null = null;

async function getIndex(): Promise<IndexedArticle[]> {
  if (_index) return _index;
  const posts = await getAllPosts(); // tylko opublikowane, data <= teraz
  _index = await Promise.all(
    posts.map(async (p) => {
      const full = await getPostBySlug(p.slug);
      return {
        slug: p.slug,
        title: p.title,
        tag: p.tag,
        url: postUrl({ tag: p.tag, slug: p.slug }),
        text: (full?.content ?? '').toLowerCase(),
      };
    }),
  );
  return _index;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Zwraca artykuły wspominające którykolwiek z aliasów hasła (z granicami słów). */
export async function articlesForTerm(aliases: string[], limit = 6): Promise<RelatedArticle[]> {
  const index = await getIndex();
  const matchers = aliases.map(
    (a) => new RegExp(`(?<![\\p{L}-])${escapeRegex(a.toLowerCase())}(?![\\p{L}-])`, 'u'),
  );

  const hits = index.filter((article) => matchers.some((re) => re.test(article.text)));

  return hits.slice(0, limit).map(({ text: _text, ...rest }) => rest);
}
