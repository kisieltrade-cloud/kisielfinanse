/**
 * Kuratorska mapa fraza -> artykuł, używana przez remark-internal-links do
 * organicznego linkowania kontekstowego w treści artykułów.
 *
 * Zasady doboru fraz:
 *  - preferujemy frazy wielowyrazowe i jednoznaczne (mniejsze ryzyko kolizji ze słownikiem),
 *  - kilka odmian fleksyjnych na wpis,
 *  - `slug` służy do wykluczenia linkowania artykułu do samego siebie.
 */
export interface InternalLink {
  slug: string;   // slug artykułu docelowego (do wykluczenia self-linku)
  url: string;    // pełny URL z prefiksem kategorii
  phrases: string[];
}

export const INTERNAL_LINKS: InternalLink[] = [
  {
    slug: 'poduszka-finansowa-2026-ile-powinienes-miec-odlozone',
    url: '/pieniadze/poduszka-finansowa-2026-ile-powinienes-miec-odlozone',
    phrases: ['poduszka finansowa', 'poduszki finansowej', 'poduszkę finansową', 'poduszka bezpieczeństwa'],
  },
  {
    slug: 'kredyt-hipoteczny-2026-jak-dostac-ile-kosztuje',
    url: '/gospodarka/kredyt-hipoteczny-2026-jak-dostac-ile-kosztuje',
    phrases: ['kredyt hipoteczny', 'kredytu hipotecznego', 'kredycie hipotecznym'],
  },
  {
    slug: 'dywersyfikacja-portfela-inwestycyjnego',
    url: '/inwestycje/dywersyfikacja-portfela-inwestycyjnego',
    phrases: ['dywersyfikacja portfela', 'dywersyfikacji portfela', 'zdywersyfikować portfel'],
  },
  {
    slug: 'analiza-fundamentalna-jak-ocenic-wartosc-spolki',
    url: '/inwestycje/analiza-fundamentalna-jak-ocenic-wartosc-spolki',
    phrases: ['analiza fundamentalna', 'analizy fundamentalnej', 'analizę fundamentalną'],
  },
  {
    slug: 'inwestowanie-pasywne-portfele-etf-dla-kazdego',
    url: '/inwestycje/inwestowanie-pasywne-portfele-etf-dla-kazdego',
    phrases: ['inwestowanie pasywne', 'inwestowania pasywnego', 'pasywny portfel'],
  },
  {
    slug: 'kwota-wolna-progi-podatkowe-2026',
    url: '/pieniadze/kwota-wolna-progi-podatkowe-2026',
    phrases: ['kwota wolna od podatku', 'kwoty wolnej', 'progi podatkowe'],
  },
  {
    slug: 'skladka-zdrowotna-2026-dzialalnosc-ile-zaplacisz',
    url: '/gospodarka/skladka-zdrowotna-2026-dzialalnosc-ile-zaplacisz',
    phrases: ['składka zdrowotna', 'składki zdrowotnej', 'składkę zdrowotną'],
  },
  {
    slug: 'budzet-domowy-jak-zaczac-i-utrzymac',
    url: '/psychologia/budzet-domowy-jak-zaczac-i-utrzymac',
    phrases: ['budżet domowy', 'budżetu domowego', 'budżetem domowym'],
  },
  {
    slug: 'obligacje-skarbowe-2026-ktore-wybrac-i-jak-kupic',
    url: '/pieniadze/obligacje-skarbowe-2026-ktore-wybrac-i-jak-kupic',
    phrases: ['obligacje skarbowe', 'obligacji skarbowych', 'obligacjach skarbowych'],
  },
  {
    slug: 'fire-wczesna-emerytura-ile-potrzebujesz-polska',
    url: '/psychologia/fire-wczesna-emerytura-ile-potrzebujesz-polska',
    phrases: ['wczesna emerytura', 'wczesnej emerytury', 'niezależność finansowa', 'niezależności finansowej'],
  },
  {
    slug: 'najem-czy-kupno-mieszkania',
    url: '/pieniadze/najem-czy-kupno-mieszkania',
    phrases: ['najem czy kupno', 'wynajem czy zakup', 'kupno mieszkania'],
  },
  {
    slug: 'stale-czy-zmienne-oprocentowanie-kredytu',
    url: '/pieniadze/stale-czy-zmienne-oprocentowanie-kredytu',
    phrases: ['stałe czy zmienne oprocentowanie', 'stałe oprocentowanie', 'zmienne oprocentowanie'],
  },
  {
    slug: 'psychologia-tradingu-jak-kontrolowac-emocje',
    url: '/psychologia/psychologia-tradingu-jak-kontrolowac-emocje',
    phrases: ['psychologia tradingu', 'psychologii tradingu'],
  },
  {
    slug: 'recesja-czym-jest-jak-wyglada-jak-sie-przygotowac',
    url: '/gospodarka/recesja-czym-jest-jak-wyglada-jak-sie-przygotowac',
    phrases: ['recesja', 'recesji', 'recesją'],
  },
  {
    slug: 'dca-dollar-cost-averaging-czy-sie-oplaca',
    url: '/inwestycje/dca-dollar-cost-averaging-czy-sie-oplaca',
    phrases: ['uśredniania ceny zakupu', 'uśrednianie ceny zakupu', 'dollar cost averaging'],
  },
  {
    slug: 'konto-oszczednosciowe-2026-czy-twoje-pieniadze-sa-bezpieczne',
    url: '/pieniadze/konto-oszczednosciowe-2026-czy-twoje-pieniadze-sa-bezpieczne',
    phrases: ['konto oszczędnościowe', 'konta oszczędnościowego', 'koncie oszczędnościowym'],
  },
  {
    slug: 'ike-vs-ikze-2026-co-wybrac-limity-podatki',
    url: '/inwestycje/ike-vs-ikze-2026-co-wybrac-limity-podatki',
    phrases: ['IKE i IKZE', 'IKE oraz IKZE', 'konto IKZE'],
  },
];
