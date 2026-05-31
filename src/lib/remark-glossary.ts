/**
 * remark-glossary — plugin auto-linkujący pojęcia ze słownika (/slownik) w treści artykułów.
 *
 * Zasady (świadomie zachowawcze, żeby nie robić choinki z linków):
 *  - linkuje TYLKO pierwsze wystąpienie danego hasła w całym artykule,
 *  - pomija nagłówki, bloki kodu i tekst już będący linkiem,
 *  - dopasowuje odmiany fleksyjne z `aliases` (najdłuższe najpierw),
 *  - dokleja tooltip (title) z krótką definicją i klasę .glossary-link do stylowania.
 *
 * Działa na drzewie mdast, więc musi być w łańcuchu PRZED remark-html.
 */
import { GLOSSARY } from './glossary';

interface MdastNode {
  type: string;
  value?: string;
  children?: MdastNode[];
  url?: string;
  data?: { hProperties?: Record<string, unknown> };
}

const SKIP_TYPES = new Set(['heading', 'link', 'linkReference', 'code', 'inlineCode']);

// Maksymalna liczba linków do słownika w jednym artykule. Chroni przed "choinką" linków
// przy dużym słowniku (każde hasło i tak linkuje się max raz, ale przy 100 hasłach trzeba ograniczyć sumę).
const MAX_LINKS_PER_ARTICLE = 10;

// Płaska lista aliasów (alias -> hasło), posortowana od najdłuższego, żeby "ETF-y" wygrało z "ETF".
const ALIASES = GLOSSARY.flatMap((term) =>
  term.aliases.map((alias) => ({ alias, slug: term.slug, short: term.short })),
).sort((a, b) => b.alias.length - a.alias.length);

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Granice uwzględniające polskie litery: alias nie może być poprzedzony/zakończony literą ani myślnikiem
// (dzięki temu "ETF" nie złapie się w środku "ETF-y", a osobny alias "ETF-y" tak).
const matchers = ALIASES.map((a) => ({
  ...a,
  re: new RegExp(`(?<![\\p{L}-])${escapeRegex(a.alias)}(?![\\p{L}-])`, 'iu'),
}));

function makeLink(url: string, label: string, title: string): MdastNode {
  return {
    type: 'link',
    url,
    data: { hProperties: { className: ['glossary-link'], title } },
    children: [{ type: 'text', value: label }],
  };
}

export default function remarkGlossary() {
  return (tree: MdastNode) => {
    const linked = new Set<string>();

    // Zamienia jeden węzeł tekstowy na ciąg [tekst, link, tekst, ...] dla pierwszych wystąpień.
    function linkifyText(value: string): MdastNode[] {
      const out: MdastNode[] = [];
      let rest = value;

      while (rest.length > 0) {
        if (linked.size >= MAX_LINKS_PER_ARTICLE) {
          out.push({ type: 'text', value: rest });
          break;
        }

        let best: { index: number; length: number; slug: string; short: string; label: string } | null = null;

        for (const m of matchers) {
          if (linked.has(m.slug)) continue;
          const hit = m.re.exec(rest);
          if (hit && (best === null || hit.index < best.index)) {
            best = { index: hit.index, length: hit[0].length, slug: m.slug, short: m.short, label: hit[0] };
            if (hit.index === 0) break; // nie znajdziemy nic wcześniej
          }
        }

        if (!best) {
          out.push({ type: 'text', value: rest });
          break;
        }

        if (best.index > 0) out.push({ type: 'text', value: rest.slice(0, best.index) });
        out.push(makeLink(`/slownik/${best.slug}`, best.label, best.short));
        linked.add(best.slug);
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
