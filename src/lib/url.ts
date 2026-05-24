/**
 * Client-safe URL utilities — no `fs`, safe to import in 'use client' components.
 */

export function tagToSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e')
    .replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o')
    .replace(/ś/g, 's').replace(/ź/g, 'z').replace(/ż/g, 'z')
    .replace(/\s+/g, '-');
}

/** Returns the canonical path for an article, e.g. /trading/jak-zaczac-trading */
export function postUrl(post: { tag: string; slug: string }): string {
  return `/${tagToSlug(post.tag)}/${post.slug}`;
}
