export interface TocItem {
  level: number;
  text: string;
  id: string;
}

export function slugifyHeading(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')
    .toLowerCase()
    .replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e')
    .replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o')
    .replace(/ś/g, 's').replace(/ź/g, 'z').replace(/ż/g, 'z')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function extractTocItems(markdown: string): TocItem[] {
  return markdown
    .split('\n')
    .map((line) => {
      const match = line.match(/^(#{2,4})\s+(.+)$/);
      if (!match) return null;
      const text = match[2].trim();
      return { level: match[1].length, text, id: slugifyHeading(text) };
    })
    .filter((item): item is TocItem => item !== null);
}
