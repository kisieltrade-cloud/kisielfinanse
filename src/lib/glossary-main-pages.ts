/**
 * Mapa: hasło słownika → nasza strona dogłębna na ten sam temat.
 *
 * Po co to istnieje (diagnoza z Search Console, eksport 2026-07-17):
 * 31 haseł słownika konkurowało w wynikach z naszymi własnymi artykułami i kalkulatorami
 * o te same zapytania. Cienka definicja (200 słów) stała zwykle na pozycji 60-90, a pełny
 * artykuł na 9-12. Google dostawał dwa sygnały o tym samym i rozpraszał je między URL-e.
 *
 * Dwa mechanizmy:
 *  1. `href` renderuje na stronie hasła widoczny odnośnik do pełnego materiału. Użytkownik
 *     dostaje definicję i drogę dalej, a autorytet spływa do strony docelowej.
 *  2. `consolidate: true` dokłada `noindex, follow`. Hasło znika z indeksu (przestaje
 *     konkurować z własną stroną), ale nadal jest przechodzone i nadal linkuje dalej.
 *
 * KIEDY `consolidate: true`: tylko gdy strona docelowa realnie wygrywa, czyli ma wyraźnie
 * lepszą pozycję albo wielokrotnie więcej wyświetleń. Gdy to HASŁO rankuje lepiej
 * (np. TER poz. 10, Risk/Reward poz. 6, Trend poz. 5), zostaje w indeksie i dostaje
 * wyłącznie odnośnik. Nie usuwamy z indeksu strony, która wygrywa.
 */

export interface MainPageLink {
  href: string;
  label: string;
  consolidate?: boolean;
}

export const MAIN_PAGES: Record<string, MainPageLink> = {
  // --- konsolidacja: strona dogłębna wyraźnie wygrywa ---
  etf: { href: '/inwestycje/etf-czym-jest-jak-zaczac-inwestowac', label: 'ETF - czym jest i jak zacząć inwestować', consolidate: true },
  ike: { href: '/inwestycje/ike-vs-ikze-2026-co-wybrac-limity-podatki', label: 'IKE czy IKZE - limity, podatki, co wybrać', consolidate: true },
  ikze: { href: '/inwestycje/ike-vs-ikze-2026-co-wybrac-limity-podatki', label: 'IKE czy IKZE - limity, podatki, co wybrać', consolidate: true },
  ppk: { href: '/inwestycje/ppk-pracownicze-plany-kapitalowe-czy-warto-2026', label: 'PPK - czy się opłaca', consolidate: true },
  'etf-akumulujacy': { href: '/inwestycje/etf-akumulujacy-czy-dystrybucyjny', label: 'ETF akumulujący czy dystrybuujący', consolidate: true },
  dywersyfikacja: { href: '/inwestycje/dywersyfikacja-portfela-inwestycyjnego', label: 'Jak naprawdę zdywersyfikować portfel', consolidate: true },
  'analiza-fundamentalna': { href: '/inwestycje/analiza-fundamentalna-jak-ocenic-wartosc-spolki', label: 'Analiza fundamentalna - jak ocenić spółkę', consolidate: true },
  dca: { href: '/inwestycje/dca-dollar-cost-averaging-czy-sie-oplaca', label: 'DCA - czy uśrednianie się opłaca', consolidate: true },
  oki: { href: '/inwestycje/oki-osobiste-konto-inwestycyjne', label: 'OKI - osobiste konto inwestycyjne', consolidate: true },
  'procent-skladany': { href: '/kalkulator/procent-skladany', label: 'Kalkulator procentu składanego', consolidate: true },
  wibor: { href: '/gospodarka/wibor-vs-polstr-co-zmienia-dla-twojej-raty', label: 'WIBOR i POLSTR - co zmienia dla raty', consolidate: true },
  'kredyt-hipoteczny': { href: '/gospodarka/kredyt-hipoteczny-2026-jak-dostac-ile-kosztuje', label: 'Kredyt hipoteczny - jak dostać i ile kosztuje', consolidate: true },
  'zdolnosc-kredytowa': { href: '/kalkulator/zdolnosc-kredytowa', label: 'Kalkulator zdolności kredytowej', consolidate: true },
  recesja: { href: '/gospodarka/recesja-czym-jest-jak-wyglada-jak-sie-przygotowac', label: 'Recesja - czym jest i jak się przygotować', consolidate: true },
  'stop-loss': { href: '/trading/stop-loss-i-take-profit', label: 'Stop loss i take profit - jak ustawić', consolidate: true },
  dzwignia: { href: '/trading/dzwignia-i-margin', label: 'Dźwignia i margin - jak działają', consolidate: true },
  spread: { href: '/trading/koszty-tradingu-spread-prowizje-swap', label: 'Koszty tradingu - spread, prowizje, swap', consolidate: true },
  wolumen: { href: '/trading/wolumen-w-tradingu-jak-czytac', label: 'Wolumen - jak czytać siłę ruchu', consolidate: true },
  forex: { href: '/trading/forex-dla-poczatkujacych', label: 'Forex dla początkujących', consolidate: true },
  futures: { href: '/trading/procent-skladany-w-tradingu-futures', label: 'Procent składany w tradingu futures', consolidate: true },
  'day-trading': { href: '/trading/day-trading-vs-swing-trading', label: 'Day trading czy swing trading', consolidate: true },

  // --- tylko odnośnik: hasło rankuje lepiej niż strona docelowa, zostaje w indeksie ---
  ter: { href: '/inwestycje/podatek-od-etf-dywidendy-belka', label: 'Podatek od ETF i koszty funduszu' },
  'risk-reward': { href: '/kalkulator/risk-reward', label: 'Kalkulator Risk/Reward' },
  trend: { href: '/trading/trend-i-linia-trendu', label: 'Trend i linia trendu' },
  'wsparcie-i-opor': { href: '/trading/wsparcie-i-opor-jak-wyznaczac-poziomy', label: 'Wsparcie i opór - jak wyznaczać poziomy' },
  'swing-trading': { href: '/trading/day-trading-vs-swing-trading', label: 'Day trading czy swing trading' },
  'kredyt-gotowkowy': { href: '/kalkulator/kredyt-gotowkowy', label: 'Kalkulator kredytu gotówkowego' },
  'nadplata-kredytu': { href: '/kalkulator/nadplata-kredytu', label: 'Kalkulator nadpłaty kredytu' },
  scalping: { href: '/trading/day-trading-vs-swing-trading', label: 'Day trading czy swing trading' },
  drawdown: { href: '/trading/jak-testowac-strategie-tradingowa-backtest', label: 'Jak testować strategię tradingową' },
  'revenge-trading': { href: '/trading/overtrading-i-fomo-jak-nad-tym-zapanowac', label: 'Overtrading i FOMO - jak nad tym zapanować' },
  'msci-world': { href: '/inwestycje/inwestowanie-pasywne-portfele-etf-dla-kazdego', label: 'Inwestowanie pasywne - portfele ETF' },
  'owczy-ped': { href: '/psychologia/strach-i-chciwosc-w-czasie-hossy', label: 'Strach i chciwość w czasie hossy' },
  'banka-spekulacyjna': { href: '/gospodarka/stellantis-strata-2025-dlaczego-akcje-spadly', label: 'Anatomia krachu na akcjach' },
  pip: { href: '/trading/forex-dla-poczatkujacych', label: 'Forex dla początkujących' },
  lot: { href: '/kalkulator/wielkosc-pozycji', label: 'Kalkulator wielkości pozycji' },
  'efekt-dyspozycji': { href: '/psychologia/psychologia-tradingu-jak-kontrolowac-emocje', label: 'Psychologia tradingu - jak kontrolować emocje' },
};

export function mainPageFor(slug: string): MainPageLink | undefined {
  return MAIN_PAGES[slug];
}
