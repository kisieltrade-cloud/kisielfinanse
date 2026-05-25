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
      'Wszystko o aktywnym handlu na rynkach finansowych. Strategie price action, zarządzanie kapitałem, futures, Forex — z perspektywy tradera z 9-letnim doświadczeniem. Bez bullshitu, bez magicznych systemów.',
    metaTitle: 'Strategie tradingowe i day trading | KisielFinanse',
    metaDesc:
      'Praktyczne artykuły o tradingu: strategie price action, zarządzanie ryzykiem, futures, Forex. Z perspektywy tradera z 9-letnim doświadczeniem — bez ściemy.',
  },
  {
    name: 'Inwestycje',
    slug: 'inwestycje',
    color: '#f5c518',
    rgb: '245,197,24',
    desc: 'ETF, akcje, portfel długoterminowy, OKI, analiza fundamentalna',
    longDesc:
      'Długoterminowe budowanie majątku: ETF-y, akcje, analiza fundamentalna, dywersyfikacja portfela, IKE, IKZE i nowe OKI. Inwestuj świadomie — nie dlatego, że wszyscy inwestują.',
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
      'Codzienne finanse pod kontrolą: rankingi kont bankowych, kredyty hipoteczne, czyszczenie BIK, oprocentowanie stałe vs zmienne, najem vs kupno. Bez żargonu — tylko konkrety.',
    metaTitle: 'Kredyty hipoteczne, konta bankowe i BIK | KisielFinanse',
    metaDesc:
      'Rankingi kont bankowych, kredyty hipoteczne, jak wyczyścić BIK, najem vs kupno. Praktyczne poradniki finansowe — stosuj od razu.',
  },
  {
    name: 'Psychologia',
    slug: 'psychologia',
    color: '#a78bfa',
    rgb: '167,139,250',
    desc: 'Emocje, błędy poznawcze, mindset tradera i inwestora',
    longDesc:
      'Głowa to największa przewaga i największa słabość w finansach. Błędy poznawcze, kontrola emocji, FOMO, revenge trading, efekt dyspozycji — i jak z tym wszystkim nie dać się zgubić.',
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
      'Jak globalne wydarzenia wpływają na Twój portfel. Geopolityka, wyścig technologiczny, polityka Fed i EBC, inflacja, surowce — makroekonomia tłumaczona przez inwestora, nie przez dziennikarza.',
    metaTitle: 'Makroekonomia i geopolityka dla inwestorów | KisielFinanse',
    metaDesc:
      'Geopolityka i makroekonomia z perspektywy inwestora. Jak globalne wydarzenia wpływają na rynki i Twój portfel. AI, wyścig chipów, polityka Fed, EBC.',
  },
];

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
