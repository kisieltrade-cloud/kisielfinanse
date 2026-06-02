/**
 * remark-internal-links — auto-linkuje wybrane frazy w treści artykułu do
 * powiązanych artykułów (linkowanie kontekstowe, model pillar-cluster).
 *
 * Zasady (zachowawcze, jak w remark-glossary):
 *  - linkuje TYLKO pierwsze wystąpienie frazy danego artykułu docelowego,
 *  - jeden link na artykuł docelowy, max MAX_LINKS na cały artykuł,
 *  - pomija nagłówki, kod i tekst już będący linkiem,
 *  - NIE linkuje artykułu do samego siebie (currentSlug),
 *  - dopasowuje frazy najdłuższe najpierw, z granicami uwzględniającymi polskie litery.
 *
 * Musi być w łańcuchu remark PRZED remark-glossary (żeby słownik nie re-linkował
 * wnętrza naszych linków) i PRZED remark-html.
 */
import { INTERNAL_LINKS } from './internal-links';

interface MdastNode {
  type: string;
  value?: string;
  children?: MdastNode[];
  url?: string;
  data?: { hProperties?: Record<string, unknown> };
}

const SKIP_TYPES = new Set(['heading', 'link', 'linkReference', 'code', 'inlineCode']);
const MAX_LINKS = 6;

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function makeLink(url: string, label: string): MdastNode {
  return {
    type: 'link',
    url,
    data: { hProperties: { className: ['internal-link'] } },
    children: [{ type: 'text', value: label }],
  };
}

export default function remarkInternalLinks(options: { currentSlug?: string } = {}) {
  const current = options.currentSlug ?? '';

  const matchers = INTERNAL_LINKS
    .filter((e) => e.slug !== current)
    .flatMap((e) => e.phrases.map((phrase) => ({ phrase, url: e.url, slug: e.slug })))
    .sort((a, b) => b.phrase.length - a.phrase.length)
    .map((m) => ({
      ...m,
      re: new RegExp(`(?<![\\p{L}-])${escapeRegex(m.phrase)}(?![\\p{L}-])`, 'iu'),
    }));

  return (tree: MdastNode) => {
    const linkedSlugs = new Set<string>();
    let total = 0;

    function linkifyText(value: string): MdastNode[] {
      const out: MdastNode[] = [];
      let rest = value;

      while (rest.length > 0) {
        if (total >= MAX_LINKS) {
          out.push({ type: 'text', value: rest });
          break;
        }

        let best: { index: number; length: number; url: string; slug: string; label: string } | null = null;

        for (const m of matchers) {
          if (linkedSlugs.has(m.slug)) continue;
          const hit = m.re.exec(rest);
          if (hit && (best === null || hit.index < best.index)) {
            best = { index: hit.index, length: hit[0].length, url: m.url, slug: m.slug, label: hit[0] };
            if (hit.index === 0) break;
          }
        }

        if (!best) {
          out.push({ type: 'text', value: rest });
          break;
        }

        if (best.index > 0) out.push({ type: 'text', value: rest.slice(0, best.index) });
        out.push(makeLink(best.url, best.label));
        linkedSlugs.add(best.slug);
        total += 1;
        rest = rest.slice(best.index + best.length);
      }

      return out.length > 0 ? out : [{ type: 'text', value }];
    }

    function walk(node: MdastNode, linkable: boolean) {
      if (!node.children) return;
      const next: MdastNode[] = [];

      for (const child of node.children) {
        if (child.type === 'text' && linkable) {
          next.push(...linkifyText(child.value ?? ''));
        } else {
          const childLinkable = linkable && !SKIP_TYPES.has(child.type);
          walk(child, childLinkable);
          next.push(child);
        }
      }

      node.children = next;
    }

    walk(tree, true);
  };
}
