// Słownik dostawców (banki / brokerzy) — SINGLE SOURCE OF TRUTH.
// Rankingi referują dostawcę po `id`; logo, kolor marki i link afiliacyjny
// żyją tutaj w jednym miejscu. Zmiana linku afiliacyjnego = jedna linijka.
//
// ⚠️  `affiliateUrl` to PLACEHOLDER ('#'). Wklej realny link partnerski TUTAJ
//     (nie w rankings.ts). Strona linkuje przez /go/[id], więc surowy link
//     afiliacyjny nigdy nie pojawia się w HTML i można go podmienić bez deployu treści.

export interface Provider {
  id: string;          // stabilny identyfikator (slug), używany w /go/[id]
  name: string;        // krótka nazwa marki, np. "mBank"
  logoText: string;    // monogram/skrót na logo (gdy brak pliku graficznego)
  brand: string;       // kolor marki (hex) — tło monogramu
  logoImg?: string;    // /images/rankings/logos/...  (opcjonalnie; ma priorytet nad monogramem)
  affiliateUrl: string;// ⚠️ realny link partnerski (placeholder '#')
  homepage?: string;   // oficjalna strona (fallback, gdy brak afiliacji)
}

export const PROVIDERS: Record<string, Provider> = {
  mbank:      { id: 'mbank',      name: 'mBank',          logoText: 'm',   brand: '#e60000', logoImg: '/images/rankings/logos/mbank.svg', affiliateUrl: 'https://matikisiel.produktyfinansowe.pl/e/lead/923?source=lt', homepage: 'https://www.mbank.pl' },
  ing:        { id: 'ing',        name: 'ING',            logoText: 'ING', brand: '#ff6200', affiliateUrl: '#', homepage: 'https://www.ing.pl' },
  erste:      { id: 'erste',      name: 'Erste',          logoText: 'E',   brand: '#1455b0', logoImg: '/images/rankings/logos/erste.svg', affiliateUrl: 'https://matikisiel.produktyfinansowe.pl/e/lead/392?source=lt', homepage: 'https://www.erste.pl' },
  millennium: { id: 'millennium', name: 'Millennium',     logoText: 'M',   brand: '#7c2d8c', logoImg: '/images/rankings/logos/millennium.svg', affiliateUrl: 'https://matikisiel.produktyfinansowe.pl/e/lead/403?source=lt', homepage: 'https://www.bankmillennium.pl' },
  pko:        { id: 'pko',        name: 'PKO BP',         logoText: 'PKO', brand: '#003574', logoImg: '/images/rankings/logos/pko.svg', affiliateUrl: 'https://matikisiel.produktyfinansowe.pl/e/lead/1473?source=lt', homepage: 'https://www.pkobp.pl' },
  velobank:   { id: 'velobank',   name: 'VeloBank',       logoText: 'V',   brand: '#00b3a4', logoImg: '/images/rankings/logos/velobank.svg', affiliateUrl: 'https://matikisiel.produktyfinansowe.pl/e/lead/830?source=lt', homepage: 'https://www.velobank.pl' },
  pekao:      { id: 'pekao',      name: 'Pekao',          logoText: 'P',   brand: '#d6001c', logoImg: '/images/rankings/logos/pekao.svg', affiliateUrl: 'https://matikisiel.produktyfinansowe.pl/e/lead/2848?source=lt', homepage: 'https://www.pekao.com.pl' },
  alior:      { id: 'alior',      name: 'Alior Bank',     logoText: 'A',   brand: '#c4122f', logoImg: '/images/rankings/logos/alior.svg', affiliateUrl: 'https://matikisiel.produktyfinansowe.pl/e/lead/1337?source=lt', homepage: 'https://www.aliorbank.pl' },
  bnp:        { id: 'bnp',        name: 'BNP Paribas',    logoText: 'BNP', brand: '#00915a', logoImg: '/images/rankings/logos/bnp.svg', affiliateUrl: 'https://matikisiel.produktyfinansowe.pl/e/lead/1587?source=lt', homepage: 'https://www.bnpparibas.pl' },
  credit:     { id: 'credit',     name: 'Credit Agricole', logoText: 'CA', brand: '#007a4d', logoImg: '/images/rankings/logos/credit.svg', affiliateUrl: 'https://matikisiel.produktyfinansowe.pl/e/lead/1362?source=lt', homepage: 'https://www.credit-agricole.pl' },

  // Banki mocne w lokatach / oszczędnościach
  nest:       { id: 'nest',       name: 'Nest Bank',      logoText: 'N',   brand: '#cd1f7b', affiliateUrl: '#', homepage: 'https://nestbank.pl' },
  bos:        { id: 'bos',        name: 'BOŚ Bank',       logoText: 'BOŚ', brand: '#6aa32a', affiliateUrl: '#', homepage: 'https://www.bosbank.pl' },
  toyota:     { id: 'toyota',     name: 'Toyota Bank',    logoText: 'T',   brand: '#e50000', affiliateUrl: '#', homepage: 'https://www.toyotabank.pl' },

  // Brokerzy (pod przyszły ranking — migracja ranking-brokerow do systemu)
  xtb:        { id: 'xtb',        name: 'XTB',            logoText: 'XTB', brand: '#d4001a', affiliateUrl: '#', homepage: 'https://www.xtb.com/pl' },
  degiro:     { id: 'degiro',     name: 'DEGIRO',         logoText: 'D',   brand: '#003d66', affiliateUrl: '#', homepage: 'https://www.degiro.pl' },
  ibkr:       { id: 'ibkr',       name: 'Interactive Brokers', logoText: 'IB', brand: '#d4122e', affiliateUrl: '#', homepage: 'https://www.interactivebrokers.com' },
  traderepublic: { id: 'traderepublic', name: 'Trade Republic', logoText: 'TR', brand: '#111111', affiliateUrl: '#', homepage: 'https://traderepublic.com' },
};

export function getProvider(id: string): Provider | undefined {
  return PROVIDERS[id];
}

/** Link, który pokazujemy w stronie — zawsze przez /go/[id] (tracking + swap bez deployu). */
export function goUrl(id: string): string {
  return `/go/${id}`;
}

/** Realny cel przekierowania dla /go/[id]: link afiliacyjny → homepage → '#'. */
export function resolveTarget(id: string): string | null {
  const p = PROVIDERS[id];
  if (!p) return null;
  if (p.affiliateUrl && p.affiliateUrl !== '#') return p.affiliateUrl;
  if (p.homepage) return p.homepage;
  return null;
}
