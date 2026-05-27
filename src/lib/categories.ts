export interface CategoryConfig {
  name: string;
  slug: string;
  color: string;
  rgb: string;
  desc: string;
  longDesc: string;
  metaTitle: string;
  metaDesc: string;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    name: 'Trading',
    slug: 'trading',
    color: '#c9a227',
    rgb: '201,162,39',
    desc: 'Strategie, analiza techniczna, zarządzanie ryzykiem, day trading',
    longDesc:
      'Futures, Forex, krypto - aktywny handel na rynkach. Piszę o price action, zarządzaniu kapitałem i psychologii tradera z perspektywy kogoś, kto sam przez to przechodził. Nie ma tu magicznych wskaźników ani systemów które "zawsze działają". Jest to, czego nauczyłem się przez 9 lat, w tym jak wiele można stracić przez brak dyscypliny i co z tym zrobić.',
    metaTitle: 'Strategie tradingowe i day trading | KisielFinanse',
    metaDesc:
      'Praktyczne artykuły o tradingu: strategie price action, zarządzanie ryzykiem, futures, Forex. Z perspektywy tradera z 9-letnim doświadczeniem - bez ściemy.',
  },
  {
    name: 'Inwestycje',
    slug: 'inwestycje',
    color: '#f5c518',
    rgb: '245,197,24',
    desc: 'ETF, akcje, portfel długoterminowy, OKI, analiza fundamentalna',
    longDesc:
      'Długoterminowe budowanie majątku bez spędzania godzin przed wykresami. ETF-y, akcje, portfel pasywny, IKE, IKZE i nowe OKI. Piszę dla kogoś, kto chce żeby pieniądze pracowały zamiast leżeć na koncie. Żadnej magii - tylko matematyka procentu składanego i czas.',
    metaTitle: 'Jak inwestować długoterminowo? ETF, akcje, OKI | KisielFinanse',
    metaDesc:
      'Jak budować portfel inwestycyjny krok po kroku. ETF-y, akcje, analiza fundamentalna, OKI, IKE, IKZE. Praktyczny przewodnik po długoterminowym inwestowaniu.',
  },
  {
    name: 'Pieniądze',
    slug: 'pieniadze',
    color: '#e8963a',
    rgb: '232,150,58',
    desc: 'Konta bankowe, kredyty, BIK, rankingi, oszczędzanie',
    longDesc:
      'Codzienne finanse - te, o których rzadko ktoś mówi wprost. Jak działa BIK i kiedy warto go wyczyścić. Kiedy kredyt hipoteczny ma sens, a kiedy nie. Konta bankowe, rachunki maklerskie, koszty ukryte w produktach finansowych. Konkrety, które możesz zastosować od razu.',
    metaTitle: 'Kredyty hipoteczne, konta bankowe i BIK | KisielFinanse',
    metaDesc:
      'Rankingi kont bankowych, kredyty hipoteczne, jak wyczyścić BIK, najem vs kupno. Praktyczne poradniki finansowe - stosuj od razu.',
  },
  {
    name: 'Psychologia',
    slug: 'psychologia',
    color: '#a78bfa',
    rgb: '167,139,250',
    desc: 'Emocje, błędy poznawcze, mindset tradera i inwestora',
    longDesc:
      'Możesz mieć najlepszą strategię i stracić wszystko przez jedną decyzję podjętą pod wpływem emocji. Błędy poznawcze, FOMO, revenge trading, efekt dyspozycji - i jak z tym realnie pracować. Psychologia to jedyna dziedzina, w której możesz się poprawić bez żadnego kapitału na start.',
    metaTitle: 'Psychologia tradingu i inwestowania | KisielFinanse',
    metaDesc:
      'Psychologia finansów i tradingu: błędy poznawcze, emocje, FOMO, revenge trading. Jak kontrolować głowę i podejmować lepsze decyzje finansowe.',
  },
  {
    name: 'Gospodarka',
    slug: 'gospodarka',
    color: '#ff2d78',
    rgb: '255,45,120',
    desc: 'Makroekonomia, geopolityka, trendy globalne',
    longDesc:
      'Makroekonomia tłumaczona przez kogoś, kto ma w tym skórę. Geopolityka, wyścig technologiczny, polityka Fed i NBP, inflacja, surowce - jak to przekłada się na konkretny portfel. Nie piszę dla akademików. Piszę dla kogoś, kto chce rozumieć świat, bo to pomaga podejmować lepsze decyzje finansowe.',
    metaTitle: 'Makroekonomia i geopolityka dla inwestorów | KisielFinanse',
    metaDesc:
      'Geopolityka i makroekonomia z perspektywy inwestora. Jak globalne wydarzenia wpływają na rynki i Twój portfel. AI, wyścig chipów, polityka Fed, EBC.',
  },
];

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
