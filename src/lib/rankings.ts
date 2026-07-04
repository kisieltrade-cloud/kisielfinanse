// Rankingi / porównania produktów finansowych ("money pages").
// Data-driven jak pillars.ts: jeden plik danych → /ranking/[slug] renderuje
// karty, tabelę porównawczą, sekcje opisowe, FAQ i schema ItemList + Review.
//
// DODANIE NOWEGO RANKINGU = nowy wpis w RANKINGS (bez zmian w kodzie strony).
// Trzeba też dopisać slug do sitemap.ts (lista RANKING_SLUGS jest stąd eksportowana).
//
// ⚠️  AFILIACJA: pole `affiliateUrl` w każdej pozycji to PLACEHOLDER ('#').
//     Podmień na realny link partnerski przed ustawieniem published: true.
// ⚠️  DANE: liczby (opłaty, premie, oprocentowanie) zmieniają się często.
//     Zweryfikuj aktualne warunki na stronach banków przed publikacją.

export interface RankingField {
  id: string;        // klucz w pick.specs
  label: string;     // nagłówek kolumny w tabeli porównawczej
  short?: string;    // krótszy wariant na mobile (opcjonalnie)
}

export interface RankingPick {
  rank: number;            // pozycja w rankingu (1 = zwycięzca)
  name: string;            // pełna nazwa produktu, np. "mBank eKonto"
  provider: string;        // dostawca, np. "mBank"
  slug: string;            // do kotwicy/anchora w sekcji opisowej
  logo?: string;           // /images/rankings/... (opcjonalny)
  score: number;           // nasza ocena redakcyjna 0-5 (skok 0,1)
  badge?: string;          // "Najlepsze ogólnie", "Najlepsze dla..." itp.
  bestFor: string;         // krótkie "Dla kogo", np. "Dla większości"
  highlight: string;       // jednozdaniowe podsumowanie
  pros: string[];
  cons: string[];
  scores?: { label: string; value: number }[];  // oceny cząstkowe 0-5 (per kryterium)
  specs: Record<string, string>;  // wartości pod kolumny z `fields`
  // Dane liczbowe do interaktywnego kalkulatora zysku (ranking lokat / oszczędności).
  // Gdy WSZYSTKIE pozycje mają `calc`, strona pokazuje kalkulator, który re-rankuje
  // oferty wg realnego zysku netto dla kwoty i okresu wpisanych przez użytkownika
  // (kwota objęta promocją = min(kwota, cap); cap = null → bez limitu).
  calc?: { rate: number; cap: number | null; termMonths: number };
  providerId: string;      // klucz do PROVIDERS (logo marki + link przez /go/[id])
  ctaLabel: string;        // tekst przycisku, np. "Załóż konto"
  body: string[];          // akapity szczegółowego omówienia (na karcie rankingu)
  // Opcjonalne sekcje z nagłówkami na karcie (zastępują body, gdy podane):
  // np. „Jak skorzystać z promocji", „Dlaczego warto założyć konto", „Podsumowanie".
  cardSections?: { title: string; body: string[] }[];
  // Pełna recenzja na osobnej stronie /recenzja/[slug]. Opcjonalna — strona
  // recenzji działa też bez niej (składa się z body/pros/cons/specs/scores),
  // ale `review` dodaje głębsze sekcje i FAQ per produkt (long-tail "opinie/recenzja").
  review?: {
    intro: string[];
    // Rama "premia": gdy podane, /konto/[slug] prowadzi KWOTĄ (duży blok premii
    // w hero + pasek urgency + CTA pod bonus), zamiast neutralnego "szczegóły oferty".
    // amount = napis kwoty ("do 1000 zł"), sub = co się na nią składa, deadline opcjonalny
    // ('YYYY-MM-DD' lub wolny tekst). Brak `bonus` → stary, neutralny układ recenzji.
    bonus?: { amount: string; sub?: string; deadline?: string };
    // "Jak odebrać premię krok po kroku" — ponumerowana, skanowalna lista (konwersja).
    steps?: string[];
    // Dowód pierwszej ręki ("sam testowałem", zrzuty, wypisane haczyki regulaminu) —
    // E-E-A-T. Slot pod realny materiał autora; nie wypełniamy zmyślonymi testami.
    proof?: string[];
    sections?: { title: string; body: string[] }[];
    faq?: { q: string; a: string }[];
  };
}

export interface RankingFaq {
  q: string;
  a: string;
}

export interface Ranking {
  slug: string;            // /ranking/[slug]
  category: string;        // slug kategorii (kolor + breadcrumb), np. 'pieniadze'
  kicker: string;          // etykieta nad H1, np. "Ranking 2026"
  title: string;           // H1
  lead: string;            // podtytuł pod H1
  metaTitle: string;       // <title> (z "| KisielFinanse")
  metaDesc: string;
  keywords: string[];
  cover: string;           // obraz hero
  updated: string;         // 'YYYY-MM-DD' — pokazywane + schema dateModified
  summary?: string[];      // TL;DR „W skrócie" — szybkie wnioski (skanowanie + snippet)
  intro: string[];         // akapity wstępu nad tabelą
  relatedArticles?: { label: string; href: string }[]; // linkowanie wewnętrzne (SEO)
  changelog?: { date: string; note: string }[];        // historia aktualizacji (świeżość/E-E-A-T)
  // Segmenty „Najlepsze konto dla..." (persony/przypadki użycia → konkretny produkt).
  // Łapie long-tail („konto dla studenta", „konto do oszczędzania"). slug = pozycja z picks.
  segments?: { label: string; slug: string; reason: string }[];
  fields: RankingField[];  // kolumny tabeli porównawczej
  // Wagi oceny ogólnej per ranking (label musi pasować do pick.scores[].label).
  // Jeśli brak — używany jest domyślny RATING_WEIGHTS (kryteria kont osobistych).
  ratingWeights?: { label: string; weight: number }[];
  // Opcje dobieracza ("Co jest dla Ciebie najważniejsze?"). key = label oceny cząstkowej
  // lub '__overall'. Jeśli brak — dobieracz pomijany.
  pickerCriteria?: { key: string; label: string }[];
  picks: RankingPick[];    // pozycje rankingu (posortowane wg rank)
  methodology: string[];   // "Jak oceniamy" — transparentność (E-E-A-T)
  verdict?: string[];      // werdykt końcowy ("bottom line") pod recenzjami
  faq: RankingFaq[];
  affiliateNote: string;   // klauzula współpracy afiliacyjnej (disclosure)
  published: boolean;      // false = niewidoczne w sitemapie i na liście /ranking
}

// ─────────────────────────────────────────────────────────────────────────────
// Wspólna klauzula afiliacyjna (disclosure) — wymagana prawnie przy linkach
// partnerskich. Wyświetlana na górze każdej strony rankingu i przy CTA.
// ─────────────────────────────────────────────────────────────────────────────
const AFFILIATE_DISCLOSURE =
  'Część linków w tym zestawieniu to linki partnerskie. Jeśli założysz produkt przez ' +
  'taki link, możemy otrzymać wynagrodzenie od banku - dla ciebie cena i warunki ' +
  'pozostają bez zmian. Ranking odzwierciedla naszą redakcyjną ocenę całości oferty ' +
  '(promocje, warunki, zaufanie, dostępność); współpraca afiliacyjna z bankami może ' +
  'wpływać na kolejność zestawienia. To nie jest oferta w rozumieniu art. 66 § 1 ' +
  'Kodeksu cywilnego ani porada inwestycyjna.';

export const RANKINGS: Ranking[] = [
  {
    slug: 'konta-osobiste',
    category: 'pieniadze',
    // Token {DATE} podstawia się automatycznie z pola `updated` jako "Miesiąc Rok"
    // (np. "Czerwiec 2026"). Comiesięczna aktualizacja = tylko zmiana `updated` niżej.
    kicker: 'Ranking {DATE}',
    title: 'Ranking kont osobistych {DATE} - które konto wybrać?',
    lead:
      'Aktualny ranking kont osobistych i bankowych w Polsce - porównanie opłat, bankomatów, ' +
      'aplikacji i premii za założenie (nawet do 1300 zł).',
    metaTitle: 'Ranking kont osobistych i bankowych {DATE} | KisielFinanse',
    metaDesc:
      'Ranking kont osobistych i bankowych {DATE}. Porównanie 9 kont (PKO, mBank, Alior, Pekao, ' +
      'Erste i inne): opłaty, darmowe bankomaty, aplikacja i premie za otwarcie nawet do 1300 zł.',
    keywords: [
      'ranking kont osobistych 2026',
      'ranking kont osobistych lipiec 2026',
      'ranking kont bankowych 2026',
      'ranking kont bankowych lipiec 2026',
      'najlepsze konto osobiste',
      'najlepsze konto bankowe 2026',
      'darmowe konto bankowe',
      'konto z premią 2026',
      'premia za założenie konta',
      'mBank eKonto opinie',
    ],
    cover: '/images/blog/covers/coins-gold.jpg',
    updated: '2026-07-04',
    summary: [
      'Naszym wyborem #1 jest PKO Konto za Zero - największa sieć bankomatów i oddziałów w Polsce, ' +
        'AllegroKlik (zwroty za zakupy do ~1200 zł rocznie) i stabilność największego banku. Tuż za nim mBank i Alior.',
      'Każde „darmowe" konto jest darmowe pod warunkami: zwykle wpływ wynagrodzenia i kilka ' +
        'płatności kartą miesięcznie. Bez tego bank może naliczyć opłatę.',
      'Premie za założenie potrafią dziś sięgać 1000-1300 zł, ale zawsze z warunkami (obrót, liczba ' +
        'transakcji, aktywność przez kilka miesięcy). Traktuj je jako dodatek, nie główne kryterium wyboru konta na lata.',
      'Możesz mieć kilka kont naraz - jedno główne do wynagrodzenia, drugie pod promocję lub ' +
        'wysoko oprocentowane konto oszczędnościowe.',
    ],
    intro: [
      'Konto osobiste to produkt, który zakładasz raz i trzymasz latami, więc kilkadziesiąt ' +
        'złotych miesięcznie różnicy w opłatach i prowizjach przez dekadę robi się w realną ' +
        'kwotę. Większość kont reklamuje się jako "darmowe", ale zerowa opłata zwykle obowiązuje ' +
        'tylko po spełnieniu warunków: wpływ wynagrodzenia, kilka płatności kartą w miesiącu albo ' +
        'aktywne logowanie do aplikacji.',
      'Poniżej zestawiam dziewięć kont, które realnie warto rozważyć w 2026 roku. Patrzę na to, ' +
        'co kosztuje naprawdę: prowadzenie konta i karty, wypłaty z bankomatów (zwłaszcza poza ' +
        'siecią banku), przewalutowanie przy płatnościach za granicą oraz jakość aplikacji. Premie ' +
        'za założenie traktuję jako miły dodatek, nie główne kryterium - bo konto zostaje z tobą ' +
        'długo po tym, jak premia się wyczerpie. Ten ranking kont bankowych aktualizuję co miesiąc, ' +
        'więc uwzględnia bieżące promocje i premie.',
    ],
    fields: [
      { id: 'oplata', label: 'Opłata za konto', short: 'Konto' },
      { id: 'karta', label: 'Opłata za kartę', short: 'Karta' },
      { id: 'bankomaty', label: 'Darmowe bankomaty', short: 'Bankomaty' },
      { id: 'premia', label: 'Premia za otwarcie', short: 'Premia' },
      { id: 'aplikacja', label: 'Aplikacja', short: 'Apka' },
    ],
    pickerCriteria: [
      { key: 'Opłaty', label: 'Najniższe opłaty' },
      { key: 'Aplikacja', label: 'Najlepsza aplikacja' },
      { key: 'Bankomaty', label: 'Dużo bankomatów' },
      { key: 'Dodatki', label: 'Premie i dodatki' },
      { key: '__overall', label: 'Najlepsze ogólnie' },
    ],
    picks: [
      {
        rank: 2,
        name: 'mBank eKonto',
        provider: 'mBank',
        slug: 'mbank-ekonto',
        score: 4.6,
        badge: 'Najlepsza aplikacja',
        bestFor: 'Dla większości',
        highlight:
          'Najlepszy balans między niskimi opłatami, świetną aplikacją i szeroką siecią bankomatów.',
        pros: [
          'Konto i karta za 0 zł przy aktywnym korzystaniu (wpływ + płatności kartą)',
          'Jedna z najlepiej ocenianych aplikacji mobilnych w Polsce',
          'Bezpłatne wypłaty ze wszystkich bankomatów w kraju przy spełnieniu warunków',
          'Rozbudowane konto oszczędnościowe i dom maklerski w tej samej apce',
        ],
        cons: [
          'Opłaty wracają, jeśli nie spełnisz miesięcznych warunków aktywności',
          'Przewalutowanie kartą droższe niż w fintechach (Revolut, Wise)',
        ],
        specs: {
          oplata: '0 zł (bez warunków)',
          karta: '0 zł (od 350 zł/mies)',
          bankomaty: 'Wszystkie w kraju (od 300 zł)',
          premia: 'Do ~1000 zł*',
          aplikacja: 'Bardzo dobra',
        },
        scores: [
          { label: 'Opłaty', value: 4.5 },
          { label: 'Aplikacja', value: 4.7 },
          { label: 'Bankomaty', value: 4.5 },
          { label: 'Dodatki', value: 4.5 },
        ],
        providerId: 'mbank',
        ctaLabel: 'Załóż eKonto',
        body: [
          'Gdybym miał wskazać jedno konto dla większości osób, postawiłbym na eKonto. Prowadzenie i karta ' +
            'nic nie kosztują, o ile co miesiąc wpłynie wynagrodzenie i zrobisz kilka płatności kartą. Aplikacja ' +
            'mBanku od lat trzyma się ścisłej czołówki: jest szybka i czytelna. W promocji zgarniesz nawet ' +
            '1000 zł, bony do Media Expert i 5,3% na koncie Moje Cele.',
          'Wygodne jest to, że konto oszczędnościowe, lokaty i dom maklerski eMakler masz w tej samej ' +
            'aplikacji - jedno logowanie zamiast pięciu. Słabszy punkt to przewalutowanie kartą za granicą; ' +
            'na częste wyjazdy dobierz do tego osobną kartę wielowalutową.',
        ],
        review: {
          intro: [
            'mBank eKonto to od lat punkt odniesienia dla darmowej bankowości w Polsce. Jeśli ' +
              'szukasz jednego konta do codziennych płatności, wynagrodzenia i oszczędzania, które ' +
              'nie wymaga kombinowania, to prawdopodobnie najlepszy wybór na start. Poniżej rozkładam ' +
              'ofertę na czynniki pierwsze: co kosztuje naprawdę, co dostajesz w aplikacji i komu ' +
              'eKonto pasuje najbardziej.',
          ],
          bonus: {
            amount: 'do 1000 zł',
            sub: 'premia za aktywność wypłacana w transzach + 5,3% na koncie oszczędnościowym Moje Cele',
            deadline: '2026-08-31',
          },
          steps: [
            'Otwórz eKonto online - przez aplikację albo wideoweryfikację, zajmuje kilkanaście minut.',
            'Zapewnij wpływ wynagrodzenia na konto (wymaganą kwotę podaje regulamin bieżącej edycji).',
            'Płać kartą lub BLIKIEM - wykonaj wymaganą liczbę transakcji w każdym miesiącu promocji.',
            'Loguj się do aplikacji mBanku, jeśli dana edycja promocji tego wymaga.',
            'Utrzymaj aktywność przez kolejne miesiące - premia wpływa transzami, a nie od razu po otwarciu.',
            'Odbierz bony do Media Expert i włącz 5,3% na koncie oszczędnościowym Moje Cele dla nowych środków.',
          ],
          sections: [
            {
              title: 'Jak skorzystać z promocji',
              body: [
                'Otwórz eKonto online i korzystaj z niego aktywnie. W promocji zgarniesz nawet 1000 zł, wypłacane ' +
                  'etapami za spełnianie warunków przez kolejne miesiące: wpływ wynagrodzenia, płatności kartą lub ' +
                  'BLIKIEM oraz aktywne logowanie w aplikacji. Do tego dochodzą bony do Media Expert oraz oprocentowanie ' +
                  '5,3% na koncie oszczędnościowym Moje Cele dla nowych środków.',
                'Dokładne kwoty i progi (np. wymagana wysokość wpływu czy liczba transakcji) zależą od bieżącej edycji ' +
                  'promocji, więc przed założeniem sprawdź aktualny regulamin.',
              ],
            },
            {
              title: 'Opłaty i warunki zwolnienia',
              body: [
                'eKonto jest darmowe w prowadzeniu, a opłata za kartę znika po spełnieniu prostych ' +
                  'warunków aktywności - zwykle wpływ na konto i kilka płatności kartą w miesiącu. ' +
                  'Jeśli aktywnie korzystasz z konta, realny koszt wynosi 0 zł. Brak aktywności w danym ' +
                  'miesiącu może oznaczać naliczenie opłaty za kartę, dlatego warto znać aktualne progi.',
                'Standardowym minusem, wspólnym dla polskich banków, jest koszt przewalutowania przy ' +
                  'płatnościach w obcej walucie. Na regularne wyjazdy zagraniczne lub zakupy w walutach ' +
                  'obcych i tak warto mieć osobno kartę wielowalutową.',
              ],
            },
            {
              title: 'Aplikacja i funkcje',
              body: [
                'Aplikacja mobilna mBanku regularnie wygrywa rankingi bankowości mobilnej w Polsce. ' +
                  'Jest szybka, czytelna i daje dostęp do całego ekosystemu: konta oszczędnościowego, ' +
                  'lokat oraz domu maklerskiego eMakler - wszystko z jednego miejsca, bez przełączania ' +
                  'się między aplikacjami.',
                'Dla osoby, która chce mieć finanse pod kontrolą bez poświęcania na to czasu, to duża ' +
                  'wartość: jedno logowanie, jeden interfejs, pełen obraz pieniędzy.',
              ],
            },
            {
              title: 'Dla kogo jest eKonto',
              body: [
                'eKonto sprawdzi się dla zdecydowanej większości osób szukających głównego konta ' +
                  'osobistego: do wynagrodzenia, opłat i codziennych płatności. Szczególnie docenią je ' +
                  'osoby, które chcą trzymać konto, oszczędności i inwestycje w jednym banku.',
                'Jeśli dużo podróżujesz i płacisz w obcych walutach, połącz eKonto z osobną kartą ' +
                  'wielowalutową - wtedy masz najtańszy zestaw do codzienności i zagranicy.',
              ],
            },
          ],
          faq: [
            {
              q: 'Ile można zyskać w promocji mBank eKonto?',
              a: 'Nawet 1000 zł wypłacane etapami za aktywne korzystanie (wpływ wynagrodzenia, płatności kartą lub ' +
                'BLIKIEM, logowanie w aplikacji), plus bony do Media Expert oraz 5,3% na koncie oszczędnościowym ' +
                'Moje Cele dla nowych środków. Dokładne kwoty zależą od bieżącej edycji promocji.',
            },
            {
              q: 'Ile kosztuje prowadzenie mBank eKonto?',
              a: 'Prowadzenie konta to 0 zł. Opłata za kartę również wynosi 0 zł po spełnieniu ' +
                'miesięcznych warunków aktywności (zwykle wpływ na konto i kilka płatności kartą). ' +
                'Bez spełnienia warunków bank może naliczyć opłatę za kartę - sprawdź aktualną tabelę opłat.',
            },
            {
              q: 'Czy mBank ma konto IKE i IKZE?',
              a: 'Tak. W ramach domu maklerskiego mBanku (eMakler) możesz prowadzić rachunki IKE oraz ' +
                'IKZE i korzystać z ulg podatkowych przy długoterminowym inwestowaniu - wszystko z ' +
                'poziomu tej samej aplikacji co konto osobiste.',
            },
            {
              q: 'Czy warto otworzyć eKonto w 2026 roku?',
              a: 'Dla większości osób tak. eKonto łączy zerowe opłaty przy aktywnym korzystaniu, jedną ' +
                'z najlepszych aplikacji mobilnych w Polsce i szeroki dostęp do bankomatów. To bezpieczny, ' +
                'uniwersalny wybór jako główne konto osobiste.',
            },
          ],
        },
      },
      {
        rank: 4,
        // Erste przejął Santander Bank Polska; rebranding ZAKOŃCZONY (od 25.04.2026,
        // aplikacja „Erste online"). Dokładną nazwę produktu potwierdzić przy linku afiliacyjnym.
        name: 'Erste Konto Smart',
        provider: 'Erste Bank Polska (dawniej Santander)',
        slug: 'erste-konto-smart',
        score: 4.3,
        badge: 'Premia i oprocentowanie',
        bestFor: 'Dla premii i oszczędzania',
        highlight:
          'Promocja do 700 zł za aktywność plus 4,5% na koncie Pro oszczędnościowym i lokacie powitalnej.',
        pros: [
          'Promocja powitalna do 700 zł za aktywność',
          'Wysokie oprocentowanie: 4,5% na koncie Pro i lokacie na powitanie',
          'Konto i karta za 0 zł przy aktywnym korzystaniu',
          'Duża sieć oddziałów dla osób, które lubią kontakt osobisty',
        ],
        cons: [
          'Premie wymagają spełnienia warunków przez kilka miesięcy',
          'Aplikacja solidna, ale nieco mniej dopracowana niż mBank/ING',
        ],
        specs: {
          oplata: '0 zł (od 300 zł/mies)',
          karta: '0 zł (od 300 zł/mies)',
          bankomaty: 'Erste + BLIK*',
          premia: 'Do ~700 zł + 4,5%*',
          aplikacja: 'Dobra',
        },
        scores: [
          { label: 'Opłaty', value: 4.3 },
          { label: 'Aplikacja', value: 4.1 },
          { label: 'Bankomaty', value: 4.2 },
          { label: 'Dodatki', value: 4.6 },
        ],
        providerId: 'erste',
        ctaLabel: 'Sprawdź ofertę',
        body: [
          'To konto dawnego Santandera, który od 25 kwietnia 2026 nazywa się Erste Bank Polska. Rebranding ' +
            'jest już za nami: bankowość i aplikacja chodzą jako Erste online, a numery kont, karty i umowy ' +
            'zostały bez zmian. Bank zawsze mocno walczył o klienta premiami i teraz nie jest inaczej - do 700 zł ' +
            'za aktywność, a samo konto jest darmowe na zwykłych warunkach.',
          'Najmocniejsza karta Konta Smart to połączenie tej premii z wysokim oprocentowaniem oszczędności: ' +
            '4,5% na koncie Pro i na lokacie powitalnej. Premię zbiera się przez kilka miesięcy aktywności, ' +
            'a po zmianie marki warto rzucić okiem na aktualne regulaminy promocji.',
        ],
        review: {
          intro: [
            'Erste Konto Smart to dawne konto Santandera pod nową marką. Stawia na dwie rzeczy naraz: premię ' +
              'powitalną i realne oprocentowanie oszczędności. Poniżej, jak zgarnąć bonus i co dokładnie dostajesz.',
          ],
          bonus: {
            amount: 'do 700 zł',
            sub: 'premia za aktywność + 4,5% na koncie Pro oszczędnościowym i lokacie powitalnej',
            deadline: '2026-07-31',
          },
          steps: [
            'Otwórz Konto Smart online - przez aplikację albo wideoweryfikację.',
            'Zapewnij wpływ min. 1500 zł miesięcznie na konto.',
            'Wykonaj co najmniej 5 płatności kartą lub BLIKIEM w miesiącu.',
            'Ustaw cel oszczędnościowy w aplikacji - to jeden z warunków premii.',
            'Utrzymaj aktywność przez 3 miesiące - do 200 zł miesięcznie plus 100 zł bonusu wpływają transzami.',
            'Włącz Konto Pro i lokatę powitalną na 4,5%, żeby nadwyżki pracowały.',
          ],
          sections: [
            {
              title: 'Jak skorzystać z promocji',
              body: [
                'Otwórz Konto Smart online i utrzymuj aktywność: wpływ min. 1500 zł miesięcznie, co najmniej ' +
                  '5 płatności kartą lub BLIKIEM oraz ustawiony cel oszczędnościowy. Bank wypłaca do 200 zł przez ' +
                  'trzy miesiące, a za spełnienie warunków we wszystkich trzech dorzuca 100 zł - łącznie do 700 zł.',
                'Do premii dochodzi oprocentowanie: 4,5% na Koncie Pro oszczędnościowym (do 100 000 zł, ' +
                  'promocyjnie) oraz 4,5% na lokacie powitalnej (do 50 000 zł, na trzy miesiące - lokatę otwórz ' +
                  'w ciągu 15 dni od założenia konta).',
              ],
            },
            {
              title: 'Warunki i opłaty',
              body: [
                'Prowadzenie i karta są bezpłatne, jeśli w miesiącu zapłacisz kartą lub BLIKIEM co najmniej 300 zł. ' +
                  'Bez tego konto kosztuje 6 zł, a karta 9 zł. Wypłaty z bankomatów Erste i BLIKIEM są darmowe; ' +
                  'z pozostałych w Polsce i strefie euro to 3 zł za wypłatę albo 5 zł miesięcznie za pakiet bez limitu.',
              ],
            },
            {
              title: 'Dla kogo jest Konto Smart',
              body: [
                'Dla osób, które chcą połączyć jednorazową premię z realnym oprocentowaniem nadwyżek. Marka jest ' +
                  'świeżo po rebrandingu (dawniej Santander), więc przed założeniem warto sprawdzić aktualny regulamin promocji.',
              ],
            },
          ],
          faq: [
            {
              q: 'Ile wynosi premia w Erste Konto Smart?',
              a: 'Do 700 zł: do 200 zł miesięcznie przez trzy miesiące plus 100 zł bonusu za spełnienie warunków ' +
                'we wszystkich trzech. Warunki to wpływ min. 1500 zł, 5 płatności kartą lub BLIKIEM i ustawiony cel oszczędnościowy.',
            },
            {
              q: 'Jakie oprocentowanie oferuje Erste?',
              a: '4,5% w skali roku na Koncie Pro oszczędnościowym (do 100 000 zł, w okresie promocyjnym) oraz 4,5% ' +
                'na lokacie powitalnej (do 50 000 zł na trzy miesiące, zakładanej w ciągu 15 dni od otwarcia konta).',
            },
            {
              q: 'Czy Konto Smart jest darmowe?',
              a: 'Tak, przy aktywności: prowadzenie i karta kosztują 0 zł, jeśli miesięcznie zapłacisz kartą lub BLIKIEM ' +
                'co najmniej 300 zł. Bez tego konto to 6 zł, a karta 9 zł miesięcznie.',
            },
          ],
        },
      },
      {
        rank: 5,
        name: 'Konto 360°',
        provider: 'Bank Millennium',
        slug: 'millennium-konto-360',
        score: 4.2,
        bestFor: 'Dla codziennych płatności',
        highlight:
          'Wygodne konto z dobrą aplikacją i częstymi promocjami zwrotów za rachunki.',
        pros: [
          'Konto i karta za 0 zł przy aktywnym korzystaniu',
          'Czytelna, nowoczesna aplikacja',
          'Promocje zwrotów za płatności i rachunki',
          'Szybka rejestracja w pełni online',
        ],
        cons: [
          'Warunki zwolnienia z opłat trzeba pilnować co miesiąc',
          'Sieć własnych bankomatów mniejsza niż u największych banków',
        ],
        specs: {
          oplata: '0 zł (bez warunków)',
          karta: '0 zł (5 płatności/mies)',
          bankomaty: 'Millennium + sieć*',
          premia: 'Do ~700 zł*',
          aplikacja: 'Dobra',
        },
        scores: [
          { label: 'Opłaty', value: 4.2 },
          { label: 'Aplikacja', value: 4.3 },
          { label: 'Bankomaty', value: 3.9 },
          { label: 'Dodatki', value: 4.3 },
        ],
        providerId: 'millennium',
        ctaLabel: 'Załóż Konto 360°',
        body: [
          'Millennium 360° to porządny środek stawki. Konto i karta bez opłat przy aktywnym korzystaniu, ' +
            'nowoczesna aplikacja i regularne promocje, w których bank oddaje część wydatków za płatności ' +
            'kartą i opłacone rachunki. Premia powitalna sięga 700 zł.',
          'Pamiętaj tylko, że zerowe opłaty działają, dopóki co miesiąc trafi wpływ i kilka płatności kartą. ' +
            'Własnych bankomatów Millennium ma mniej niż giganci, więc jeśli często wypłacasz gotówkę, ' +
            'sprawdź zasięg w swojej okolicy.',
        ],
        review: {
          intro: [
            'Konto Millennium 360° to wygodny rachunek z dobrą aplikacją i regularnymi promocjami zwrotów za ' +
              'płatności. Premia powitalna sięga 700 zł, a prowadzenie jest bezpłatne.',
          ],
          bonus: {
            amount: 'do 700 zł',
            sub: '200 zł za warunki startowe + 500 zł za aktywność przez 5 miesięcy',
            deadline: '2026-10-27',
          },
          steps: [
            'Otwórz Konto 360° online wraz z kartą.',
            'Zrób wpływ min. 3000 zł w ciągu 14 dni (1500 zł dla osób do 26 lat).',
            'Zarejestruj portfel cyfrowy (BLIK) i wykonaj co najmniej 5 transakcji.',
            'Odbierz 200 zł za spełnienie warunków startowych.',
            'Utrzymaj co miesiąc wpływ 3000 zł i 1000 zł wydatków kartą przez 5 miesięcy - zbierzesz kolejne 500 zł.',
          ],
          sections: [
            {
              title: 'Jak skorzystać z promocji',
              body: [
                'Otwórz Konto 360° online wraz z kartą. 200 zł dostajesz za warunki startowe: wpływ min. 3000 zł, ' +
                  '5 płatności kartą i rejestrację BLIK. Kolejne 500 zł zbierasz przez pięć następnych miesięcy, ' +
                  'utrzymując co miesiąc wpływ 3000 zł i 1000 zł wydatków kartą - łącznie do 700 zł.',
                'Promocja obowiązuje zwykle do określonej daty, więc przed założeniem sprawdź aktualny regulamin na stronie banku.',
              ],
            },
            {
              title: 'Warunki i opłaty',
              body: [
                'Prowadzenie konta jest bezpłatne bez warunków. Karta i płatności zbliżeniowe są darmowe przy co ' +
                  'najmniej 5 transakcjach kartą lub BLIKIEM miesięcznie (dla osób 18-26 wystarczy jedna). Wypłaty z ' +
                  'bankomatów Millennium są zawsze darmowe; z pozostałych w Polsce to 1 zł (Santander, Planet Cash) ' +
                  'lub 5 zł, jeśli nie spełnisz warunku transakcji.',
              ],
            },
            {
              title: 'Dla kogo jest Konto 360°',
              body: [
                'Dla osób, które cenią nowoczesną apkę i lubią odzyskiwać część wydatków w promocjach zwrotów. ' +
                  'Sieć własnych bankomatów jest mniejsza niż u największych banków, więc przy częstych wypłatach ' +
                  'gotówki warto sprawdzić zasięg w okolicy.',
              ],
            },
          ],
          faq: [
            {
              q: 'Ile można dostać w promocji Konta 360°?',
              a: 'Do 700 zł: 200 zł za spełnienie warunków startowych (wpływ 3000 zł, 5 płatności kartą, rejestracja BLIK) ' +
                'oraz 500 zł zbierane przez pięć kolejnych miesięcy przy utrzymaniu wpływu 3000 zł i 1000 zł wydatków kartą miesięcznie.',
            },
            {
              q: 'Czy Konto Millennium 360° jest darmowe?',
              a: 'Prowadzenie konta to 0 zł bez warunków. Opłata za kartę (do 11 zł) znika przy co najmniej 5 płatnościach ' +
                'kartą lub BLIKIEM w miesiącu; osoby w wieku 18-26 lat potrzebują jednej transakcji.',
            },
            {
              q: 'Czy wypłaty z bankomatów Millennium są darmowe?',
              a: 'Z bankomatów Millennium - zawsze. Z pozostałych w Polsce to 1 zł (Santander, Planet Cash) lub 5 zł, ' +
                'jeśli w danym miesiącu nie spełnisz warunku liczby transakcji.',
            },
          ],
        },
      },
      {
        rank: 1,
        name: 'PKO Konto za Zero',
        provider: 'PKO Bank Polski',
        slug: 'pko-konto-za-zero',
        score: 4.7,
        badge: 'Najlepsze ogólnie',
        bestFor: 'Dla sieci oddziałów',
        highlight:
          'Największy bank w Polsce, maksymalna dostępność oddziałów oraz AllegroKlik - zwroty za zakupy na Allegro.',
        pros: [
          'Najgęstsza sieć oddziałów i bankomatów w kraju',
          'Konto za 0 zł przy spełnieniu warunków aktywności',
          'Stabilny, największy bank - poczucie bezpieczeństwa',
          'Aplikacja IKO z szerokim zakresem funkcji (BLIK powstał właśnie tu)',
        ],
        cons: [
          'Opłata za kartę bywa naliczana przy małej liczbie transakcji',
          'Interfejs miejscami mniej nowoczesny niż u mBanku czy ING',
        ],
        specs: {
          oplata: '0 zł (z warunkami)',
          karta: '0 zł przy aktywności',
          bankomaty: 'Największa sieć PKO',
          premia: 'Cashback Allegro do 1200 zł*',
          aplikacja: 'Dobra (IKO)',
        },
        scores: [
          { label: 'Opłaty', value: 4.6 },
          { label: 'Aplikacja', value: 4.5 },
          { label: 'Bankomaty', value: 5.0 },
          { label: 'Dodatki', value: 4.8 },
        ],
        providerId: 'pko',
        ctaLabel: 'Załóż Konto za Zero',
        body: [
          'PKO BP to największy bank w Polsce i jego główną przewagą jest dostępność: jeśli cenisz ' +
            'możliwość załatwienia sprawy w oddziale i bankomat dosłownie wszędzie, trudno o lepszy ' +
            'wybór. Konto za Zero jest darmowe przy spełnieniu warunków aktywności, a aplikacja IKO ' +
            'jest dojrzała (to z niej wyrósł BLIK). Ciekawym dodatkiem jest AllegroKlik: do 3% zwrotu za ' +
            'zakupy na Allegro (maks. 100 zł miesięcznie przez 12 miesięcy, czyli nawet ~1200 zł) oraz ' +
            'Allegro Smart! na pół roku za 1 zł.',
          'Na minus - opłata za kartę potrafi się pojawić przy małej liczbie płatności, a interfejs ' +
            'bywa mniej "lekki" niż u czołówki bankowości mobilnej. To konto dla osób, które cenią ' +
            'stabilność i fizyczną obecność banku bardziej niż najnowocześniejszy UX.',
        ],
        review: {
          intro: [
            'PKO Konto za Zero to podstawowy rachunek największego banku w Polsce: darmowe prowadzenie przy ' +
              'aktywności i program AllegroKlik, który oddaje część pieniędzy za zakupy na Allegro. Poniżej ' +
              'tłumaczę, jak wyciągnąć z promocji maksimum, ile to realnie kosztuje i komu konto się opłaca.',
          ],
          bonus: {
            amount: 'do 600 zł',
            sub: 'premia z kodem LATO (Letni Bonus) + AllegroKlik: zwrot do ~1200 zł za zakupy na Allegro',
          },
          steps: [
            'Otwórz Konto za Zero online i wpisz kod promocyjny LATO (promocja Letni Bonus).',
            'Zapewnij wpływ i płać kartą lub BLIKIEM zgodnie z warunkami promocji.',
            'Aktywuj usługę AllegroKlik w aplikacji IKO.',
            'Płać za zakupy na Allegro - zgarniasz do 3% zwrotu, maks. 100 zł miesięcznie przez 12 miesięcy.',
            'Utrzymaj aktywność przez wymagany okres - premia i zwroty wpływają transzami, nie od razu.',
          ],
          sections: [
            {
              title: 'Jak skorzystać z promocji AllegroKlik',
              body: [
                'Otwórz Konto za Zero online i aktywuj usługę AllegroKlik w aplikacji IKO. Następnie płać ' +
                  'kartą lub BLIKIEM za zakupy na Allegro - bank zwróci ci do 3% ich wartości, maksymalnie ' +
                  '100 zł miesięcznie przez 12 miesięcy (czyli nawet ~1200 zł). Zwrot trafia na konto następnego dnia.',
                'Podstawowo dostajesz 1% za aktywację. Do 2% wskakujesz przy wpływie min. 2000 zł miesięcznie ' +
                  'lub z wybranym produktem banku (karta kredytowa, pożyczka, ubezpieczenie), a pełne 3% przy ' +
                  'spełnieniu obu warunków. W pakiecie jest też Allegro Smart! na pół roku za 1 zł. Aktualne progi ' +
                  'sprawdź na stronie PKO, bo regulamin promocji bywa aktualizowany.',
              ],
            },
            {
              title: 'Warunki i opłaty',
              body: [
                'Prowadzenie Konta za Zero jest bezpłatne po spełnieniu warunków aktywności, a opłata za kartę ' +
                  'znika przy odpowiedniej liczbie płatności w miesiącu. Wypłaty z bankomatów PKO są darmowe - ' +
                  'bank ma największą sieć w Polsce. Sam AllegroKlik nie wiąże się z żadną dodatkową opłatą.',
              ],
            },
            {
              title: 'Dla kogo jest Konto za Zero',
              body: [
                'Najlepiej sprawdzi się u osób, które cenią dostępność (oddział i bankomat niemal wszędzie), ' +
                  'stabilność największego banku i regularnie kupują na Allegro. Jeśli zależy ci głównie na ' +
                  'najnowocześniejszej aplikacji, mBank czy ING dają lżejszy interfejs - ale siecią i AllegroKlikiem PKO wygrywa.',
              ],
            },
          ],
          faq: [
            {
              q: 'Ile można zyskać na AllegroKlik?',
              a: 'Do 3% zwrotu za zakupy na Allegro, maksymalnie 100 zł miesięcznie przez 12 miesięcy - łącznie ' +
                'nawet około 1200 zł. Podstawowo jest to 1%, a wyższe stawki wymagają wpływu min. 2000 zł miesięcznie ' +
                'lub posiadania wybranego produktu banku. Dodatkowo Allegro Smart! na pół roku za 1 zł.',
            },
            {
              q: 'Czy PKO Konto za Zero jest naprawdę darmowe?',
              a: 'Prowadzenie konta jest bezpłatne po spełnieniu warunków aktywności (zwykle wpływ i kilka płatności ' +
                'kartą). Opłata za kartę również znika przy odpowiedniej liczbie transakcji. Bez aktywności bank może ' +
                'naliczyć opłatę - sprawdź aktualną tabelę opłat.',
            },
            {
              q: 'Jak aktywować AllegroKlik?',
              a: 'Usługę włączysz w aplikacji IKO po założeniu konta. Po aktywacji wystarczy płacić kartą lub BLIKIEM ' +
                'za zakupy na Allegro, a zwrot naliczy się automatycznie.',
            },
          ],
        },
      },
      {
        rank: 8,
        name: 'VeloKonto',
        provider: 'VeloBank',
        slug: 'velobank-velokonto',
        score: 3.9,
        bestFor: 'Dla oszczędzających',
        highlight:
          'Konto często łączone z wysoko oprocentowanym kontem oszczędnościowym dla nowych środków.',
        pros: [
          'Atrakcyjne promocje na koncie oszczędnościowym dla nowych klientów',
          'Konto i karta za 0 zł przy aktywnym korzystaniu',
          'Proste, szybkie założenie online',
          'Dobre dla parkowania nadwyżek finansowych',
        ],
        cons: [
          'Mniejsza sieć oddziałów i bankomatów',
          'Najwyższe oprocentowanie zwykle czasowe i tylko dla nowych środków',
        ],
        specs: {
          oplata: '0 zł (bez warunków)',
          karta: '0 zł (5 płatności/mies)',
          bankomaty: 'Planet Cash + BLIK (PL+UE)',
          premia: 'Cashback + 100 zł/polec.*',
          aplikacja: 'Dobra',
        },
        scores: [
          { label: 'Opłaty', value: 4.2 },
          { label: 'Aplikacja', value: 3.9 },
          { label: 'Bankomaty', value: 3.6 },
          { label: 'Dodatki', value: 3.8 },
        ],
        providerId: 'velobank',
        ctaLabel: 'Sprawdź VeloKonto',
        body: [
          'VeloBank najczęściej trafia do zestawień przez atrakcyjne promocje na koncie ' +
            'oszczędnościowym - wysokie oprocentowanie dla nowych środków bywa jednym z lepszych na ' +
            'rynku. Samo VeloKonto jest darmowe na standardowych warunkach aktywności i dobrze działa ' +
            'jako miejsce, gdzie parkujesz nadwyżki, żeby pracowały.',
          'Trzeba pamiętać, że najwyższe oprocentowanie jest zwykle czasowe i obejmuje tylko nowe ' +
            'pieniądze, a sieć bankomatów jest mniejsza niż u największych banków. To konto bardziej ' +
            '"pod oszczędzanie" niż jako jedyne konto do codziennych operacji.',
        ],
        review: {
          intro: [
            'VeloKonto to darmowe konto codzienne, które najmocniej gra w duecie z kontem oszczędnościowym: ' +
              'wysokie oprocentowanie nowych środków plus cashback i program poleceń.',
          ],
          bonus: {
            amount: 'do 600 zł',
            sub: 'do 50 zł miesięcznie przez 12 miesięcy + wysokie oprocentowanie nowych środków',
          },
          steps: [
            'Otwórz VeloKonto online - prowadzenie jest darmowe bez warunków.',
            'Przystąp do programu VeloKorzyści w aplikacji.',
            'Płać kartą i utrzymuj aktywność - zgarniasz do 50 zł miesięcznie (do 600 zł w rok).',
            'Załóż VeloKonto Oszczędnościowe i przelej na nie nowe środki na wysokie oprocentowanie.',
            'Polecaj znajomych - za każde skuteczne polecenie dostajesz dodatkowy bonus.',
          ],
          sections: [
            {
              title: 'Jak skorzystać z promocji',
              body: [
                'Otwórz VeloKonto online - prowadzenie jest darmowe bez warunków. Do tego załóż VeloKonto ' +
                  'Oszczędnościowe, na którym nowe środki są wysoko oprocentowane przez okres promocyjny. Bank ' +
                  'dorzuca cashback za płatności kartą oraz 100 zł za każdego poleconego znajomego, który spełni ' +
                  'warunki. Dokładne stawki i limity zmieniają się z każdą edycją, więc sprawdź aktualny regulamin.',
              ],
            },
            {
              title: 'Warunki i opłaty',
              body: [
                'Prowadzenie konta jest bezpłatne bez warunków, a karta darmowa przy co najmniej 5 płatnościach ' +
                  'w miesiącu. Wypłaty są darmowe z bankomatów Planet Cash i BLIKIEM w Polsce oraz Unii Europejskiej. ' +
                  'Najwyższe oprocentowanie oszczędności zwykle dotyczy tylko nowych pieniędzy i obowiązuje czasowo.',
              ],
            },
            {
              title: 'Dla kogo jest VeloKonto',
              body: [
                'Najlepiej sprawdzi się u osób, które chcą bezkosztowego konta i miejsca na nadwyżki z dobrym ' +
                  'oprocentowaniem. Jeśli zależy ci na gęstej sieci własnych bankomatów, więksi gracze wypadają ' +
                  'lepiej - VeloBank to bardziej konto "pod oszczędzanie" niż jedyny rachunek do wszystkiego.',
              ],
            },
          ],
          faq: [
            {
              q: 'Ile można zyskać na VeloKoncie?',
              a: 'Cashback za płatności kartą oraz 100 zł za każde skuteczne polecenie znajomego, a na koncie ' +
                'oszczędnościowym wysokie oprocentowanie nowych środków. Konkretne stawki zależą od bieżącej edycji promocji.',
            },
            {
              q: 'Czy VeloKonto jest darmowe?',
              a: 'Prowadzenie konta to 0 zł bez warunków. Karta jest bezpłatna przy co najmniej 5 płatnościach kartą lub BLIKIEM w miesiącu.',
            },
            {
              q: 'Czy wypłaty z bankomatów są darmowe?',
              a: 'Tak, z bankomatów sieci Planet Cash oraz BLIKIEM w Polsce i Unii Europejskiej.',
            },
          ],
        },
      },
      {
        rank: 7,
        name: 'Pekao Konto Przekorzystne',
        provider: 'Bank Pekao S.A.',
        slug: 'pekao-konto-przekorzystne',
        score: 4.0,
        bestFor: 'Dla dużej sieci i stabilności',
        highlight:
          'Jeden z największych banków w Polsce - bardzo szeroka sieć oddziałów i bankomatów.',
        pros: [
          'Bardzo duża sieć oddziałów i bankomatów w całym kraju',
          'Konto i karta za 0 zł przy spełnieniu warunków aktywności',
          'Stabilny, duży bank - poczucie bezpieczeństwa',
          'Aplikacja PeoPay z BLIK i płatnościami mobilnymi',
        ],
        cons: [
          'Opłaty wracają przy małej liczbie transakcji',
          'Interfejs miejscami mniej nowoczesny niż u czołówki bankowości mobilnej',
        ],
        scores: [
          { label: 'Opłaty', value: 4.0 },
          { label: 'Aplikacja', value: 3.9 },
          { label: 'Bankomaty', value: 4.4 },
          { label: 'Dodatki', value: 3.9 },
        ],
        specs: {
          oplata: '0 zł (z warunkami)',
          karta: '0 zł (z warunkami)',
          bankomaty: 'Bardzo duża sieć Pekao',
          premia: 'Do ~300 zł + 5%*',
          aplikacja: 'Dobra (PeoPay)',
        },
        providerId: 'pekao',
        ctaLabel: 'Sprawdź Konto Przekorzystne',
        body: [
          'Pekao to jeden z największych banków w Polsce i jego główną przewagą jest dostępność: ' +
            'gęsta sieć oddziałów i bankomatów sprawia, że sprawę załatwisz niemal wszędzie. Konto ' +
            'Przekorzystne jest darmowe przy spełnieniu warunków aktywności, a aplikacja PeoPay obsługuje ' +
            'BLIK i płatności mobilne.',
          'Na minus - opłaty potrafią wrócić przy małej liczbie transakcji, a interfejs bywa mniej ' +
            'lekki niż u liderów bankowości mobilnej. To konto dla osób, które cenią stabilność dużego ' +
            'banku i fizyczną dostępność bardziej niż najnowocześniejszy UX.',
        ],
        review: {
          intro: [
            'Konto Przekorzystne to rachunek jednego z największych banków w Polsce: premia powitalna, ' +
              'promocyjne oprocentowanie oszczędności i bardzo szeroka sieć oddziałów oraz bankomatów.',
          ],
          bonus: {
            amount: 'do 300 zł',
            sub: 'premia na start i za aktywność + 5% na koncie oszczędnościowym + zwrot w Promocji Podróżnej',
            deadline: '2026-08-31',
          },
          steps: [
            'Otwórz Konto Przekorzystne online metodą selfie/biometrią - 100 zł na start.',
            'Wykonaj min. 5 transakcji kartą w każdym z 2 pierwszych miesięcy - kolejne 200 zł.',
            'Załóż konto oszczędnościowe na 5% i przelej na nie nowe środki.',
            'Płacisz kartą za granicą? Włącz Promocję Podróżną z cashbackiem.',
            'Utrzymaj aktywność - premia wpływa po spełnieniu warunków, nie od razu po otwarciu.',
          ],
          sections: [
            {
              title: 'Jak skorzystać z promocji',
              body: [
                'Otwórz Konto Przekorzystne online i korzystaj z niego aktywnie. Bank wypłaca premię powitalną ' +
                  '(zwykle do około 300 zł: część na start, reszta za aktywność, czyli wpływy i płatności kartą lub ' +
                  'BLIKIEM). Do tego dochodzi promocyjne oprocentowanie na koncie oszczędnościowym oraz akcje typu ' +
                  'Promocja Podróżna z cashbackiem za płatności za granicą. Kwoty i terminy zależą od bieżącej edycji, ' +
                  'więc sprawdź aktualny regulamin.',
              ],
            },
            {
              title: 'Warunki i opłaty',
              body: [
                'Konto i karta są bezpłatne przy spełnieniu warunków aktywności (najczęściej wpływ i kilka płatności ' +
                  'miesięcznie); bez tego opłaty wracają. Dużym atutem jest bardzo szeroka sieć bankomatów Pekao w całym ' +
                  'kraju, a aplikacja PeoPay obsługuje BLIK i płatności mobilne.',
              ],
            },
            {
              title: 'Dla kogo jest Konto Przekorzystne',
              body: [
                'Dla osób, które cenią stabilność dużego banku i fizyczną dostępność (oddział, bankomat) bardziej ' +
                  'niż najlżejszy interfejs. Jeśli najważniejszy jest dla ciebie nowoczesny UX, mBank czy ING wypadają lepiej.',
              ],
            },
          ],
          faq: [
            {
              q: 'Ile wynosi premia w Koncie Przekorzystnym?',
              a: 'Zwykle do około 300 zł: część na start, reszta za aktywność (wpływy i płatności kartą lub BLIKIEM). ' +
                'Dodatkowo promocyjne oprocentowanie konta oszczędnościowego i okresowe akcje cashbackowe. Dokładne kwoty zależą od bieżącej edycji.',
            },
            {
              q: 'Czy konto i karta są darmowe?',
              a: 'Tak, przy spełnieniu warunków aktywności (wpływ i kilka płatności miesięcznie). Bez nich opłaty mogą wrócić.',
            },
            {
              q: 'Czy Pekao ma dużo bankomatów?',
              a: 'Tak, to jedna z największych sieci bankomatów w Polsce, więc o darmową wypłatę gotówki łatwo niemal wszędzie.',
            },
          ],
        },
      },
      {
        rank: 3,
        name: 'Alior Konto',
        provider: 'Alior Bank',
        slug: 'alior-konto',
        score: 4.5,
        badge: 'Najwyższa premia',
        bestFor: 'Dla prostoty i wysokiej premii',
        highlight:
          'Proste konto za 0 zł bez warunków i jedna z najwyższych premii powitalnych (do 1300 zł).',
        pros: [
          'Prowadzenie konta 0 zł bez żadnych warunków',
          'Jedna z najwyższych premii powitalnych - do 1300 zł',
          'Dobra aplikacja Alior Mobile',
          'Rozbudowana oferta kredytowa i produktowa',
        ],
        cons: [
          'Część premii to nie gotówka (obrączka płatnicza, cashback)',
          'Pełna premia wymaga aktywności przez kilka miesięcy',
        ],
        scores: [
          { label: 'Opłaty', value: 4.8 },
          { label: 'Aplikacja', value: 4.4 },
          { label: 'Bankomaty', value: 4.2 },
          { label: 'Dodatki', value: 4.7 },
        ],
        specs: {
          oplata: '0 zł (bez warunków)',
          karta: '0 zł (z warunkami)',
          bankomaty: 'Alior + sieć*',
          premia: 'Do ~1300 zł*',
          aplikacja: 'Dobra',
        },
        providerId: 'alior',
        ctaLabel: 'Otwórz Alior Konto',
        body: [
          'Alior Konto to proste konto osobiste z mocnym atutem: prowadzenie kosztuje 0 zł bez żadnych ' +
            'warunków, a do tego dochodzi jedna z najwyższych promocji powitalnych na rynku - łącznie nawet ' +
            '1300 zł (do 800 zł cashbacku za aktywne korzystanie oraz obrączka płatnicza o wartości 500 zł).',
          'Trzeba pamiętać, że część nagrody to nie gotówka (obrączka płatnicza, cashback), a pełną premię ' +
            'zbiera się przez kilka miesięcy aktywności. Alior ma też osobne konto dla młodych (18-25) i bogatą ' +
            'ofertę kredytową, a aplikacja Alior Mobile jest dobrze oceniana.',
        ],
        review: {
          intro: [
            'Alior Konto łączy dwie rzeczy, które rzadko idą w parze: prowadzenie za 0 zł bez żadnych warunków ' +
              'i jedną z najwyższych premii powitalnych na rynku, łącznie nawet 1300 zł.',
          ],
          bonus: {
            amount: 'do 1300 zł',
            sub: 'obrączka płatnicza ~500 zł + cashback 10% do 800 zł przez 8 miesięcy',
            deadline: '2026-08-31',
          },
          steps: [
            'Otwórz Alior Konto Plus online z kodem promocyjnym ZYSKAJ2026.',
            'W ciągu 10 dni wykonaj 5 transakcji kartą lub BLIKIEM, zapisz się do programu Mastercard Bezcenne Chwile i zaloguj w Alior Mobile - to warunek obrączki płatniczej (~500 zł).',
            'Zapewnij wpływ min. 2000 zł miesięcznie.',
            'Płać kartą, obrączką lub BLIKIEM w sklepach stacjonarnych - dostajesz 10% zwrotu, do 100 zł miesięcznie.',
            'Utrzymuj aktywność przez 8 miesięcy - cashback zbiera się do 800 zł.',
          ],
          sections: [
            {
              title: 'Jak skorzystać z promocji',
              body: [
                'Otwórz Alior Konto Plus online z kodem ZYSKAJ2026. Pierwsza część nagrody to obrączka płatnicza ' +
                  'o wartości około 500 zł - dostajesz ją za 5 transakcji w ciągu 10 dni, zapis do programu Mastercard ' +
                  'Bezcenne Chwile i logowanie w Alior Mobile. Druga część to cashback: 10% zwrotu za płatności w sklepach ' +
                  'stacjonarnych, do 100 zł miesięcznie przez 8 miesięcy (do 800 zł), przy wpływie min. 2000 zł. Łącznie ' +
                  'daje to nawet 1300 zł. Promocja obowiązuje do 31 sierpnia 2026, ale sprawdź aktualny regulamin przed założeniem.',
              ],
            },
            {
              title: 'Warunki i opłaty',
              body: [
                'Prowadzenie konta to 0 zł bez żadnych warunków, co jest rzadkością na rynku. Opłata za kartę znika ' +
                  'przy odpowiedniej liczbie płatności w miesiącu. Pełną premię zbiera się przez kilka miesięcy aktywności, ' +
                  'a część nagrody to nie gotówka, lecz obrączka płatnicza i cashback.',
              ],
            },
            {
              title: 'Dla kogo jest Alior Konto',
              body: [
                'Dla łowców premii, którzy chcą wycisnąć z promocji maksimum, i dla osób ceniących konto bez opłat ' +
                  'bez kombinowania. Alior ma też osobne konto dla młodych (18-25) oraz rozbudowaną ofertę kredytową, ' +
                  'a aplikacja Alior Mobile jest dobrze oceniana.',
              ],
            },
          ],
          faq: [
            {
              q: 'Ile można zyskać w promocji Alior Konta?',
              a: 'Łącznie do 1300 zł: do 800 zł cashbacku (10% za płatności w sklepach stacjonarnych, do 100 zł ' +
                'miesięcznie przez 8 miesięcy) oraz obrączka płatnicza warta około 500 zł. Promocja z kodem ZYSKAJ2026 do 31 sierpnia 2026.',
            },
            {
              q: 'Czy cała premia to gotówka?',
              a: 'Nie. 200 zł na start i cashback trafiają na konto, ale część nagrody (około 500 zł) to obrączka płatnicza, a nie wypłata gotówki.',
            },
            {
              q: 'Czy Alior Konto jest naprawdę za 0 zł?',
              a: 'Tak, prowadzenie konta jest bezpłatne bez warunków. Opłata za kartę znika przy odpowiedniej liczbie płatności w miesiącu.',
            },
          ],
        },
      },
      {
        rank: 6,
        name: 'BNP Paribas Konto Otwarte na Ciebie',
        provider: 'BNP Paribas Bank Polska',
        slug: 'bnp-paribas-konto-otwarte',
        score: 4.0,
        bestFor: 'Dla dużego banku z promocjami',
        highlight:
          'Solidne darmowe konto dużego banku z regularnymi promocjami zwrotów.',
        pros: [
          'Konto i karta za 0 zł przy aktywnym korzystaniu',
          'Dobra aplikacja GOmobile',
          'Szeroka sieć placówek',
          'Okresowe promocje moneyback i zwroty',
        ],
        cons: [
          'Mniej agresywne premie niż u liderów promocji',
          'Warunki zwolnienia z opłat trzeba pilnować co miesiąc',
        ],
        scores: [
          { label: 'Opłaty', value: 4.1 },
          { label: 'Aplikacja', value: 4.0 },
          { label: 'Bankomaty', value: 3.8 },
          { label: 'Dodatki', value: 4.3 },
        ],
        specs: {
          oplata: '0 zł (z warunkami)',
          karta: '0 zł (z warunkami)',
          bankomaty: 'BNP + sieć*',
          premia: 'Do ~700 zł*',
          aplikacja: 'Dobra (GOmobile)',
        },
        providerId: 'bnp',
        ctaLabel: 'Sprawdź ofertę',
        body: [
          'BNP Paribas to duży bank z solidnym, darmowym kontem osobistym i porządną aplikacją ' +
            'GOmobile. Regularnie pojawiają się promocje zwrotów za płatności, a szeroka sieć placówek ' +
            'jest plusem dla osób, które lubią kontakt w oddziale.',
          'Jak wszędzie, "0 zł" zależy od spełnienia warunków aktywności. Premie bywają mniej ' +
            'agresywne niż u banków, które najmocniej walczą bonusami, więc to bardziej solidny środek ' +
            'stawki niż lider promocji.',
        ],
        review: {
          intro: [
            'Konto Otwarte na Ciebie to solidny, darmowy rachunek dużego banku z porządną aplikacją GOmobile ' +
              'i regularnymi promocjami zwrotów. Premia powitalna sięga około 700 zł.',
          ],
          bonus: {
            amount: 'do 700 zł',
            sub: 'za aktywność przez 12 miesięcy + 100 zł przy koncie oszczędnościowym',
          },
          steps: [
            'Otwórz Konto Otwarte na Ciebie online wraz z kartą.',
            'Zapewnij wpływ min. 1000 zł miesięcznie.',
            'Wykonaj min. 7 płatności kartą w miesiącu.',
            'Utrzymaj zgody marketingowe - to warunek wypłaty premii.',
            'Zbieraj 50 zł miesięcznie przez 12 miesięcy; z kontem oszczędnościowym dodatkowo 100 zł.',
          ],
          sections: [
            {
              title: 'Jak skorzystać z promocji',
              body: [
                'Otwórz Konto Otwarte na Ciebie online i korzystaj z niego aktywnie. Bank wypłaca premię powitalną ' +
                  '(w zależności od edycji zwykle do około 700 zł) za spełnianie warunków przez kolejne miesiące: ' +
                  'wpływy, logowania w aplikacji oraz płatności kartą lub BLIKIEM. Często dochodzą do tego promocje ' +
                  'moneyback za płatności. Konkretne kwoty i terminy różnią się między edycjami, więc sprawdź aktualny regulamin.',
              ],
            },
            {
              title: 'Warunki i opłaty',
              body: [
                'Konto i karta są bezpłatne przy spełnieniu warunków aktywności (najczęściej wpływ, logowanie i kilka ' +
                  'transakcji w miesiącu); bez nich opłaty wracają, więc warto je pilnować. Bank ma szeroką sieć ' +
                  'placówek dla osób, które lubią kontakt w oddziale.',
              ],
            },
            {
              title: 'Dla kogo jest to konto',
              body: [
                'Dla osób szukających solidnego konta dużego banku z dobrą aplikacją i okazjonalnymi zwrotami. ' +
                  'Premie bywają mniej agresywne niż u liderów promocji, więc to raczej pewny środek stawki niż rekordzista bonusów.',
              ],
            },
          ],
          faq: [
            {
              q: 'Ile wynosi premia w BNP Paribas?',
              a: 'W zależności od edycji promocji zwykle do około 700 zł, wypłacane za spełnianie warunków (wpływy, ' +
                'logowania, płatności) przez kolejne miesiące. Czasem dochodzą promocje moneyback.',
            },
            {
              q: 'Czy konto i karta są darmowe?',
              a: 'Tak, przy spełnieniu warunków aktywności (wpływ, logowanie w aplikacji i kilka płatności miesięcznie). Bez nich opłaty mogą wrócić.',
            },
            {
              q: 'Jak działa aplikacja GOmobile?',
              a: 'To dojrzała aplikacja mobilna BNP Paribas z BLIK i płatnościami mobilnymi, oceniana solidnie, choć nieco niżej niż liderzy bankowości mobilnej.',
            },
          ],
        },
      },
      {
        rank: 9,
        name: 'Credit Agricole Konto dla Ciebie',
        provider: 'Credit Agricole Bank Polska',
        slug: 'credit-agricole-konto-dla-ciebie',
        score: 3.7,
        bestFor: 'Dla oddziałów i oferty ratalnej',
        highlight:
          'Konto dużego banku z rozbudowaną ofertą kart i zakupów na raty.',
        pros: [
          'Konto i karta za 0 zł przy spełnieniu warunków',
          'Dobre programy ratalne i oferta kart',
          'Sieć placówek i obsługa stacjonarna',
          'Okresowe promocje moneyback',
        ],
        cons: [
          'Mniejsza sieć własnych bankomatów',
          'Aplikacja oceniana słabiej niż u liderów',
        ],
        scores: [
          { label: 'Opłaty', value: 3.8 },
          { label: 'Aplikacja', value: 3.6 },
          { label: 'Bankomaty', value: 3.5 },
          { label: 'Dodatki', value: 4.2 },
        ],
        specs: {
          oplata: '0 zł (z warunkami)',
          karta: '0 zł (z warunkami)',
          bankomaty: 'Sieć partnerska*',
          premia: 'Do ~720 zł zwrotów*',
          aplikacja: 'Przeciętna',
        },
        providerId: 'credit',
        ctaLabel: 'Sprawdź ofertę',
        body: [
          'Credit Agricole to duży bank, który najmocniej gra ofertą kart i zakupów na raty oraz ' +
            'obsługą w oddziałach. Konto dla Ciebie jest darmowe przy spełnieniu warunków, a okresowe ' +
            'promocje moneyback potrafią zwrócić część wydatków.',
          'Słabsze strony to mniejsza sieć własnych bankomatów i aplikacja oceniana niżej niż u ' +
            'czołówki. To wybór raczej dla osób ceniących kontakt w placówce i ofertę ratalną niż dla ' +
            'fanów najnowocześniejszej bankowości mobilnej.',
        ],
        review: {
          intro: [
            'Konto dla Ciebie to rachunek dużego banku, który nagradza nie jednorazową premią, lecz zwrotami za ' +
              'płatności (do około 720 zł w skali roku) oraz wysoko oprocentowaną lokatą powitalną.',
          ],
          bonus: {
            amount: 'do 720 zł',
            sub: '4% zwrotu za płatności, do 60 zł miesięcznie przez 12 miesięcy + Lokata Powitalna',
          },
          steps: [
            'Otwórz Konto dla Ciebie online wraz z kartą.',
            'Zapewnij wpływ około 1500 zł i płać kartą na co dzień.',
            'Wykonaj min. 10 płatności kartą lub BLIKIEM miesięcznie.',
            'Wyraź i utrzymaj zgody marketingowe - bez nich zwrot się nie naliczy.',
            'Zgarniaj 4% zwrotu (do 60 zł/mies przez 12 miesięcy) i włącz Lokatę Powitalną na nowe środki.',
          ],
          sections: [
            {
              title: 'Jak skorzystać z promocji',
              body: [
                'Otwórz Konto dla Ciebie online z kartą i płać nią na co dzień. Bank zwraca część wydatków (zwykle ' +
                  '4% wartości płatności, maksymalnie około 60 zł miesięcznie przez 12 miesięcy, łącznie do około 720 zł). ' +
                  'Do tego dochodzi Lokata Powitalna z oprocentowaniem rzędu 6% dla nowych środków na krótki okres. ' +
                  'Stawki i limity zależą od bieżącej edycji, więc sprawdź aktualny regulamin.',
              ],
            },
            {
              title: 'Warunki i opłaty',
              body: [
                'Konto i karta są bezpłatne przy spełnieniu warunków aktywności (najczęściej wpływ około 1500 zł i ' +
                  'kilka płatności kartą w miesiącu). Słabszą stroną jest mniejsza sieć własnych bankomatów, więc przy ' +
                  'częstych wypłatach gotówki warto sprawdzić zasięg w okolicy.',
              ],
            },
            {
              title: 'Dla kogo jest Konto dla Ciebie',
              body: [
                'Dla osób, które dużo płacą kartą i chcą systematycznie odzyskiwać część wydatków, oraz dla ceniących ' +
                  'obsługę w oddziale i ofertę zakupów na raty. Jeśli zależy ci głównie na nowoczesnej aplikacji, ' +
                  'liderzy bankowości mobilnej wypadają lepiej.',
              ],
            },
          ],
          faq: [
            {
              q: 'Ile można odzyskać w promocji Credit Agricole?',
              a: 'Zwykle 4% wartości płatności kartą, maksymalnie około 60 zł miesięcznie przez 12 miesięcy - łącznie ' +
                'do około 720 zł. Dodatkowo Lokata Powitalna z oprocentowaniem rzędu 6% dla nowych środków.',
            },
            {
              q: 'Czy Konto dla Ciebie jest darmowe?',
              a: 'Tak, przy spełnieniu warunków aktywności (najczęściej wpływ około 1500 zł i kilka płatności kartą w miesiącu). Bez nich mogą pojawić się opłaty.',
            },
            {
              q: 'Czy łatwo o darmowe wypłaty z bankomatów?',
              a: 'Sieć własnych bankomatów jest mniejsza niż u największych banków, dlatego przy częstych wypłatach gotówki warto wcześniej sprawdzić dostępność w swojej okolicy.',
            },
          ],
        },
      },
    ],
    methodology: [
      'Oceniamy konta w pięciu obszarach: realny koszt prowadzenia (konto + karta po spełnieniu ' +
        'typowych warunków), koszt i dostępność wypłat z bankomatów, jakość i wygoda aplikacji ' +
        'mobilnej, dodatkowe korzyści (oprocentowanie, moneyback, premie) oraz dostępność ' +
        '(oddziały, obsługa).',
      'Ocena ogólna (gwiazdki 0-5) to średnia ważona czterech kryteriów: opłaty (35%), ' +
        'aplikacja (30%), bankomaty (20%) oraz dodatki i premie (15%). Ostateczna kolejność to nasza ' +
        'redakcyjna ocena całości oferty - obok wyliczenia bierzemy pod uwagę między innymi wysokość i ' +
        'jakość promocji, zaufanie oraz dostępność banku. Z częścią banków łączy nas współpraca ' +
        'afiliacyjna, co ujawniamy w informacji nad zestawieniem.',
      'Konta bankowe zmieniają warunki kilka razy w roku. Zawsze sprawdź aktualną tabelę opłat i ' +
        'regulamin promocji bezpośrednio u banku przed założeniem konta. Datę ostatniej ' +
        'aktualizacji zestawienia podajemy na górze strony.',
    ],
    verdict: [
      'Naszym wyborem #1 jest PKO Konto za Zero - największa dostępność (bankomaty i oddziały w całej ' +
        'Polsce), program AllegroKlik ze zwrotami za zakupy i stabilność największego banku. Drugi jest ' +
        'mBank (najlepsza w zestawieniu aplikacja), a trzeci Alior (najwyższa premia, do 1300 zł).',
      'Polujesz na premię? Najwięcej daje Alior Konto - łącznie do 1300 zł. A jeśli chcesz, żeby nadwyżki ' +
        'pracowały, załóż VeloKonto pod wysoko oprocentowane konto oszczędnościowe albo postaw na Erste ' +
        '(promocja plus 4,5%). Nie ma jednego konta idealnego dla każdego - jest konto najlepiej dopasowane ' +
        'do tego, jak realnie korzystasz z banku.',
    ],
    faq: [
      {
        q: 'Które konto osobiste jest najlepsze w 2026 roku?',
        a:
          'Naszym wyborem #1 jest PKO Konto za Zero - ma największą sieć bankomatów i oddziałów w Polsce, ' +
          'program AllegroKlik (zwroty za zakupy) i stabilność największego banku. Tuż za nim mBank (najlepsza ' +
          'aplikacja) i Alior (najwyższa premia, do 1300 zł). Jeśli najważniejsza jest premia, najwięcej daje Alior.',
      },
      {
        q: 'Czy darmowe konto osobiste jest naprawdę za darmo?',
        a:
          'Zazwyczaj tak, ale pod warunkami. Większość banków zwalnia z opłaty za konto i kartę, ' +
          'jeśli co miesiąc zapewnisz wpływ wynagrodzenia i wykonasz kilka płatności kartą. Jeśli ' +
          'warunków nie spełnisz, bank może naliczyć opłatę - dlatego warto je znać przed założeniem.',
      },
      {
        q: 'Czy warto zakładać konto tylko dla premii?',
        a:
          'Premie powitalne potrafią dziś sięgać 1000-1300 zł, ale wiążą się z ' +
          'warunkami: określoną liczbą transakcji, wpływem wynagrodzenia i utrzymaniem aktywności ' +
          'przez kilka miesięcy (część kwoty to często moneyback, nie gotówka). To sensowne, jeśli i tak będziesz konta aktywnie używać. Traktuj ' +
          'premię jako dodatek, nie główny powód wyboru konta na lata.',
      },
      {
        q: 'Czy mogę mieć kilka kont osobistych jednocześnie?',
        a:
          'Tak, nie ma limitu. Wiele osób trzyma jedno konto główne do wynagrodzenia i opłat, a ' +
          'drugie zakłada pod konkretną promocję lub wysoko oprocentowane konto oszczędnościowe. ' +
          'Posiadanie kilku kont nie wpływa negatywnie na twoją historię w BIK.',
      },
      {
        q: 'Jak zmienić konto bankowe na nowe?',
        a:
          'Najprościej: załóż nowe konto online, przekieruj wpływ wynagrodzenia i zlecenia stałe, a ' +
          'po przeniesieniu wszystkich płatności zamknij stare konto. Wiele banków oferuje usługę ' +
          'przeniesienia konta, która automatycznie przepisuje zlecenia stałe i polecenia zapłaty.',
      },
    ],
    segments: [
      { label: 'Najlepsze ogólnie', slug: 'pko-konto-za-zero', reason: 'Największa sieć bankomatów i oddziałów w Polsce, AllegroKlik (zwroty do ~1200 zł) i stabilność największego banku.' },
      { label: 'Do oszczędzania', slug: 'velobank-velokonto', reason: 'Wysoko oprocentowane konto oszczędnościowe dla nowych środków.' },
      { label: 'Dla lubiących oddziały', slug: 'pekao-konto-przekorzystne', reason: 'Jeden z największych banków z bardzo szeroką siecią oddziałów i bankomatów.' },
      { label: 'Dla łowców premii', slug: 'alior-konto', reason: 'Najwyższa premia powitalna w zestawieniu - łącznie do 1300 zł.' },
    ],
    relatedArticles: [
      { label: 'Konto oszczędnościowe 2026 - czy twoje pieniądze są bezpieczne', href: '/pieniadze/konto-oszczednosciowe-2026-czy-twoje-pieniadze-sa-bezpieczne' },
      { label: 'Poduszka finansowa - ile powinieneś mieć odłożone', href: '/pieniadze/poduszka-finansowa-2026-ile-powinienes-miec-odlozone' },
      { label: '5 finansowych nawyków, które kosztują cię tysiące złotych', href: '/pieniadze/5-finansowych-nawykow-ktore-kosztuja-cie-tysiace-zlotych-rocznie' },
      { label: 'Budżet domowy - jak zacząć i utrzymać', href: '/pieniadze/budzet-domowy-jak-zaczac-i-utrzymac' },
    ],
    changelog: [
      { date: '2026-07-04', note: 'Aktualizacja oceny dodatków mBank eKonto (promocja do 1000 zł, konto oszczędnościowe 5,3%, dom maklerski w aplikacji) - lepiej oddaje siłę oferty. Kolejność: #1 PKO Konto za Zero, #2 mBank eKonto, #3 Alior Konto.' },
      { date: '2026-07-01', note: 'Weryfikacja lipcowa bezpośrednio na oficjalnych stronach banków. PKO Konto za Zero: edycja „Zakupy z premią" (kod PREMIA) zakończona 30.06 - weszła nowa promocja „Letni Bonus" (kod LATO, do 600 zł). Bez zmian, potwierdzone u źródła: Alior do 1300 zł, kod ZYSKAJ2026 (do 31.08), Erste do 700 zł plus 4,5% (do 31.07), Millennium 360° do 700 zł (do 27.10), mBank do 1000 zł (do 31.08).' },
      { date: '2026-06-20', note: 'Weryfikacja promocji bezpośrednio na oficjalnych stronach banków (czerwiec 2026): mBank eKonto do 1000 zł (do 31.08), Alior Konto Plus do 1300 zł, kod ZYSKAJ2026 (do 31.08), Erste Konto Smart do 700 zł plus 4,5% (do 31.07), Millennium 360° do 700 zł (do 27.10), PKO Konto za Zero do 600 zł, kod PREMIA (do 30.06), Pekao Przekorzystne do 300 zł (do 31.08), VeloKonto do 600 zł, BNP do 700 zł, Credit Agricole do 720 zł. Dodano sekcje „jak odebrać krok po kroku" oraz terminy promocji na stronach kont.' },
      { date: '2026-06-08', note: 'Aktualizacja premii powitalnych (czerwiec 2026): obecnie sięgają 1000-1300 zł. Potwierdzono zakończenie rebrandingu Santander Bank Polska na Erste Bank Polska (od 25.04.2026).' },
      { date: '2026-06-07', note: 'Aktualizacja warunków zwolnienia z opłat i premii powitalnych. Uwzględniono przejęcie Santander Bank Polska przez Erste.' },
    ],
    affiliateNote: AFFILIATE_DISCLOSURE,
    published: true, // konta-osobiste: zweryfikowane linki afiliacyjne + dane, opublikowane 2026-06-09
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // RANKING LOKAT
  // ⚠️ OPROCENTOWANIE ZMIENIA SIĘ CO MIESIĄC. Wartości poniżej są reprezentatywne
  //    dla czerwca 2026 (otoczenie obniżek stóp NBP) i wymagają weryfikacji przed
  //    publikacją. Comiesięczna aktualizacja = zmiana `updated` + oprocentowania.
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'lokaty',
    category: 'pieniadze',
    kicker: 'Ranking {DATE}',
    title: 'Ranking lokat {DATE} - najlepiej oprocentowane lokaty',
    lead:
      'Porównanie najwyżej oprocentowanych lokat bankowych w Polsce: oprocentowanie, okres, ' +
      'kwota i warunki. Aktualizowane co miesiąc, bo stawki banków szybko się zmieniają.',
    metaTitle: 'Ranking lokat {DATE}: najlepiej oprocentowane lokaty | KisielFinanse',
    metaDesc:
      'Najlepsze lokaty bankowe {DATE} - ranking najwyżej oprocentowanych lokat w Polsce. ' +
      'Bank Nowy, Nest, VeloBank, Raiffeisen, Credit Agricole i inne. Oprocentowanie, okres, kwota i warunki w jednym miejscu.',
    keywords: [
      'ranking lokat',
      'najlepsze lokaty',
      'lokaty bankowe',
      'najwyżej oprocentowane lokaty',
      'lokata na nowe środki',
      'oprocentowanie lokat',
      'gdzie założyć lokatę',
      'lokata dla nowych klientów',
    ],
    cover: '/images/blog/covers/coins-gold.jpg',
    updated: '2026-06-10',
    summary: [
      'Najwyższe oprocentowanie dają zwykle lokaty dla nowych klientów lub na nowe środki - to one trafiają na szczyt rankingu.',
      'Wysoka stawka prawie zawsze ma warunek: limit kwoty, krótki okres albo wymóg założenia konta. Czytaj gwiazdki.',
      'Lokata blokuje pieniądze. Na poduszkę finansową, do której potrzebujesz dostępu, lepsze jest konto oszczędnościowe.',
      'Od odsetek z lokaty bank pobiera podatek Belki (19%). Oprocentowanie w rankingu podajemy w skali roku, przed podatkiem.',
    ],
    intro: [
      'Lokata to najprostszy sposób, żeby pieniądze nie traciły na inflacji, kiedy i tak mają poleżeć. ' +
        'Zakładasz ją na ustalony czas, bank gwarantuje oprocentowanie, a po okresie wypłacasz kapitał z odsetkami. ' +
        'Zero ryzyka rynkowego, środki objęte gwarancją BFG do równowartości 100 000 euro.',
      'Poniżej zestawiam najlepiej oprocentowane lokaty dostępne w czerwcu 2026. Najwyższe stawki niemal zawsze ' +
        'dotyczą nowych klientów lub nowych środków i mają limit kwoty, dlatego przy każdej pozycji podaję realne warunki, ' +
        'nie samą reklamową liczbę. Oprocentowanie zmienia się z miesiąca na miesiąc, więc ranking aktualizuję regularnie.',
    ],
    fields: [
      { id: 'oprocentowanie', label: 'Oprocentowanie', short: 'Oproc.' },
      { id: 'okres', label: 'Okres', short: 'Okres' },
      { id: 'kwota', label: 'Kwota maksymalna', short: 'Kwota' },
      { id: 'dlaKogo', label: 'Dla kogo', short: 'Dla kogo' },
      { id: 'kapitalizacja', label: 'Kapitalizacja', short: 'Kapit.' },
    ],
    ratingWeights: [
      { label: 'Oprocentowanie', weight: 0.50 },
      { label: 'Warunki', weight: 0.20 },
      { label: 'Elastyczność', weight: 0.15 },
      { label: 'Zaufanie', weight: 0.15 },
    ],
    pickerCriteria: [
      { key: 'Oprocentowanie', label: 'Najwyższe oprocentowanie' },
      { key: 'Warunki', label: 'Najłatwiejsze warunki' },
      { key: 'Elastyczność', label: 'Krótki okres' },
      { key: 'Zaufanie', label: 'Duży, pewny bank' },
      { key: '__overall', label: 'Najlepsza ogólnie' },
    ],
    picks: [
      {
        rank: 1,
        name: 'Bank Nowy NOWYdepozyt Wysoki Procent',
        provider: 'Bank Nowy',
        slug: 'banknowy-nowydepozyt',
        score: 4.18,
        calc: { rate: 7.0, cap: 10000, termMonths: 1 },
        badge: 'Najwyższa stawka',
        bestFor: 'Dla małych kwot na krótko',
        highlight: 'Najwyższa stawka na rynku, ale tylko do 10 000 zł i na miesiąc, więc realny zysk w złotówkach jest niewielki.',
        pros: [
          'Najwyższe oprocentowanie w całym zestawieniu',
          'Krótki, miesięczny okres, szybko odzyskujesz dostęp',
          'Środki objęte gwarancją BFG',
        ],
        cons: [
          'Najwyższa stawka tylko do 10 000 zł',
          'Wymaga założenia rachunku depozytowego',
          'Na jeden miesiąc nawet 7% to w złotówkach kilkadziesiąt złotych',
        ],
        scores: [
          { label: 'Oprocentowanie', value: 5.0 },
          { label: 'Warunki', value: 2.6 },
          { label: 'Elastyczność', value: 4.7 },
          { label: 'Zaufanie', value: 3.0 },
        ],
        specs: {
          oprocentowanie: '7,00%',
          okres: '1 mies.',
          kwota: 'do 10 000 zł',
          dlaKogo: 'Nowi klienci',
          kapitalizacja: 'Na koniec',
        },
        providerId: 'banknowy',
        ctaLabel: 'Załóż lokatę',
        body: [
          'Bank Nowy trzyma najwyższą reklamową stawkę na rynku, ale trzeba czytać warunki. Siedem procent obejmuje ' +
            'tylko 10 000 zł i tylko przez miesiąc, więc w portfelu zostaje kilkadziesiąt złotych, nie fortuna. To oferta ' +
            'pod konkretny cel: maksymalna stawka na małą kwotę, którą chcesz gdzieś sensownie przechować na chwilę.',
          'Żeby założyć lokatę, musisz otworzyć rachunek depozytowy w banku. Jeśli masz większą sumę, ta pozycja nie jest ' +
            'dla ciebie, bo nadwyżka ponad 10 000 zł i tak musi wylądować gdzie indziej. Wtedy lepsze są lokaty niżej w rankingu, ' +
            'które obejmują wyższą kwotę.',
        ],
      },
      {
        rank: 2,
        name: 'Nest Lokata Witaj',
        provider: 'Nest Bank',
        slug: 'nest-lokata-witaj',
        score: 4.26,
        calc: { rate: 6.10, cap: 25000, termMonths: 6 },
        badge: 'Najlepsza ogólnie',
        bestFor: 'Dla nowych klientów',
        highlight: 'Wysokie 6,10% na pół roku z limitem 25 000 zł - najlepszy kompromis między stawką a realną kwotą.',
        pros: [
          'Jedna z najwyższych stawek na realny okres sześciu miesięcy',
          'Limit 25 000 zł obejmuje większe oszczędności niż lokaty na 10 000 zł',
          'Środki objęte gwarancją BFG',
        ],
        cons: [
          'Tylko dla nowych klientów banku',
          'Wymaga konta i wpływu min. 2000 zł miesięcznie',
        ],
        scores: [
          { label: 'Oprocentowanie', value: 4.75 },
          { label: 'Warunki', value: 3.7 },
          { label: 'Elastyczność', value: 3.7 },
          { label: 'Zaufanie', value: 3.9 },
        ],
        specs: {
          oprocentowanie: '6,10%',
          okres: '6 mies.',
          kwota: 'do 25 000 zł',
          dlaKogo: 'Nowi klienci',
          kapitalizacja: 'Na koniec',
        },
        providerId: 'nest',
        ctaLabel: 'Załóż lokatę',
        body: [
          'Nest Bank od lat walczy o nowych klientów wysoką stawką powitalną i to jedna z najlepszych pozycji w całym ' +
            'zestawieniu. W przeciwieństwie do lidera rankingu stawka 6,10% obejmuje 25 000 zł i działa przez pół roku, ' +
            'więc realny zysk jest dużo większy niż przy miesięcznych lokatach na 10 000 zł.',
          'Warunek to status nowego klienta, założenie konta osobistego i wpływ co najmniej 2000 zł miesięcznie. Jeśli i tak ' +
            'planujesz przenieść pensję, to naturalny wybór. Po zakończeniu okresu sprawdź ofertę przedłużenia, bo standardowe ' +
            'lokaty są wyraźnie niżej oprocentowane.',
        ],
      },
      {
        rank: 3,
        name: 'VeloLokata dla Aktywnych',
        provider: 'VeloBank',
        slug: 'velolokata-dla-aktywnych',
        score: 4.23,
        calc: { rate: 6.0, cap: 50000, termMonths: 6 },
        badge: 'Dla większej kwoty',
        bestFor: 'Dla większych oszczędności',
        highlight: 'Sześć procent na pół roku z limitem 50 000 zł, czyli dwa razy więcej niż u większości konkurentów.',
        pros: [
          'Wysoka stawka połączona z limitem 50 000 zł',
          'Półroczny okres, dobry stosunek stawki do czasu',
          'Środki objęte gwarancją BFG',
        ],
        cons: [
          'Tylko dla nowych klientów',
          'Wymaga konta, zgód marketingowych i wpływu min. 2000 zł miesięcznie',
        ],
        scores: [
          { label: 'Oprocentowanie', value: 4.6 },
          { label: 'Warunki', value: 3.8 },
          { label: 'Elastyczność', value: 3.8 },
          { label: 'Zaufanie', value: 4.0 },
        ],
        specs: {
          oprocentowanie: '6,00%',
          okres: '6 mies.',
          kwota: 'do 50 000 zł',
          dlaKogo: 'Nowi klienci',
          kapitalizacja: 'Na koniec',
        },
        providerId: 'velobank',
        ctaLabel: 'Załóż lokatę',
        body: [
          'VeloBank celuje w osoby z większymi nadwyżkami. Stawka 6,00% obejmuje tu 50 000 zł, czyli dwa razy więcej niż ' +
            'w typowej lokacie powitalnej z limitem 25 000 zł. Przy okresie sześciu miesięcy to jedna z najsensowniejszych ' +
            'ofert dla kogoś, kto ma do ulokowania kilkadziesiąt tysięcy złotych.',
          'Warunki są standardowe dla najlepszych stawek: nowy klient, konto osobiste, zgody marketingowe i wpływ co najmniej ' +
            '2000 zł w każdym pełnym miesiącu. VeloBank działa w pełni online, więc całość ogarniesz z telefonu.',
        ],
      },
      {
        rank: 4,
        name: 'Raiffeisen Digital - Lokata dla Ciebie',
        provider: 'Raiffeisen Digital',
        slug: 'raiffeisen-lokata-dla-ciebie',
        score: 4.21,
        calc: { rate: 6.0, cap: 100000, termMonths: 3 },
        badge: 'Najwyższy limit kwoty',
        bestFor: 'Dla dużych kwot na krótko',
        highlight: 'Sześć procent obejmujące aż 100 000 zł, ale środki chroni austriacki system gwarancji, nie polski BFG.',
        pros: [
          'Stawka 6,00% obejmuje aż 100 000 zł',
          'Krótki, trzymiesięczny okres',
          'W pełni cyfrowy bank, konto i lokatę założysz w aplikacji',
        ],
        cons: [
          'Środki chroni austriacki system gwarancji depozytów, nie polski BFG',
          'Tylko dla nowych klientów, wymaga założenia konta',
        ],
        scores: [
          { label: 'Oprocentowanie', value: 4.6 },
          { label: 'Warunki', value: 4.0 },
          { label: 'Elastyczność', value: 4.2 },
          { label: 'Zaufanie', value: 3.2 },
        ],
        specs: {
          oprocentowanie: '6,00%',
          okres: '3 mies.',
          kwota: 'do 100 000 zł',
          dlaKogo: 'Nowi klienci',
          kapitalizacja: 'Na koniec',
        },
        providerId: 'raiffeisen',
        ctaLabel: 'Załóż lokatę',
        body: [
          'Raiffeisen Digital to cyfrowy bank, który wszedł na polski rynek z agresywną stawką. Jego przewaga to limit: ' +
            'sześć procent obejmuje aż 100 000 zł, więc jako jedyny z czołówki realnie obsługuje duże kwoty na wysokiej stawce, ' +
            'i to przy krótkim, trzymiesięcznym okresie.',
          'Jest jedno ale. Depozyty chroni austriacki system gwarancji depozytów, a nie polski Bankowy Fundusz Gwarancyjny. ' +
            'Ochrona jest porównywalna (do 100 000 euro), ale ewentualna wypłata szłaby przez instytucję zagraniczną. Dla wielu osób ' +
            'to niuans bez znaczenia, ale warto o nim wiedzieć przed wpłatą większej sumy.',
        ],
      },
      {
        rank: 5,
        name: 'Credit Agricole Lokata Powitalna',
        provider: 'Credit Agricole',
        slug: 'credit-agricole-lokata-powitalna',
        score: 4.20,
        calc: { rate: 5.5, cap: 100000, termMonths: 1 },
        badge: 'Duży limit kwoty',
        bestFor: 'Dla dużej kwoty na miesiąc',
        highlight: 'Pięć i pół procent na 100 000 zł w dużym, znanym banku, ale tylko przez miesiąc.',
        pros: [
          'Stawka obejmuje aż 100 000 zł',
          'Duży, stabilny bank z polskim BFG',
          'Wygodne założenie online',
        ],
        cons: [
          'Tylko miesięczny okres',
          'Tylko dla nowych klientów, wymaga konta i zgód marketingowych',
        ],
        scores: [
          { label: 'Oprocentowanie', value: 4.2 },
          { label: 'Warunki', value: 3.9 },
          { label: 'Elastyczność', value: 4.4 },
          { label: 'Zaufanie', value: 4.4 },
        ],
        specs: {
          oprocentowanie: '5,50%',
          okres: '1 mies.',
          kwota: 'do 100 000 zł',
          dlaKogo: 'Nowi klienci',
          kapitalizacja: 'Na koniec',
        },
        providerId: 'credit',
        ctaLabel: 'Załóż lokatę',
        body: [
          'Credit Agricole łączy trzy rzeczy, które rzadko idą w parze: przyzwoitą stawkę 5,50%, wysoki limit 100 000 zł i ' +
            'markę dużego, znanego banku z polską gwarancją BFG. Jeśli masz większą sumę i zależy ci na poczuciu bezpieczeństwa ' +
            'znanej instytucji, to mocny kandydat.',
          'Haczyk to okres: lokata trwa tylko miesiąc, więc po wpłacie szybko wracasz do punktu wyjścia i musisz szukać oferty ' +
            'na kolejny etap. Stawka dotyczy nowych klientów, wymaga konta osobistego i zgód marketingowych.',
        ],
      },
      {
        rank: 6,
        name: 'Erste Lokata dla Ciebie na dzień dobry',
        provider: 'Erste Bank Polska (dawniej Santander)',
        slug: 'erste-lokata-na-dzien-dobry',
        score: 3.97,
        calc: { rate: 4.5, cap: 50000, termMonths: 3 },
        bestFor: 'Dla obecnych klientów',
        highlight: 'Powitalna lokata 4,50% w dużym banku w trakcie zmiany marki z Santandera na Erste.',
        pros: [
          'Stawka obejmuje 50 000 zł',
          'Duży bank z szeroką siecią i polskim BFG',
          'Wygodne założenie online',
        ],
        cons: [
          'Stawka wyraźnie niższa niż u liderów',
          'Tylko dla nowych klientów, weryfikacja przez aplikację lub mObywatela',
        ],
        scores: [
          { label: 'Oprocentowanie', value: 3.9 },
          { label: 'Warunki', value: 3.8 },
          { label: 'Elastyczność', value: 4.2 },
          { label: 'Zaufanie', value: 4.2 },
        ],
        specs: {
          oprocentowanie: '4,50%',
          okres: '3 mies.',
          kwota: 'do 50 000 zł',
          dlaKogo: 'Nowi klienci',
          kapitalizacja: 'Na koniec',
        },
        providerId: 'erste',
        ctaLabel: 'Załóż lokatę',
        body: [
          'To dawny Santander Bank Polska, przechodzący pod markę Erste. Lokata na dzień dobry jest klasyczną ofertą ' +
            'powitalną: stawka 4,50% obejmuje 50 000 zł na trzy miesiące. Bez fajerwerków, ale w dużym banku z szeroką ' +
            'siecią i polską gwarancją BFG.',
          'Stawka jest niższa niż u liderów zestawienia, więc to wybór raczej dla osób, które cenią markę i wygodę dużego ' +
            'banku niż ostatni punkt procentowy. Przy zmianie właściciela warto śledzić aktualne warunki promocji.',
        ],
      },
      {
        rank: 7,
        name: 'Toyota Bank Lokata Standard',
        provider: 'Toyota Bank',
        slug: 'toyota-lokata-standard',
        score: 3.95,
        calc: { rate: 4.3, cap: 40000, termMonths: 6 },
        badge: 'Bez kombinowania',
        bestFor: 'Dla wszystkich, bez warunków',
        highlight: 'Uczciwe 4,30% dla każdego, bez wymogu nowych środków i bez nowego klienta.',
        pros: [
          'Dostępna dla wszystkich, nie tylko dla nowych klientów',
          'Bez warunku nowych środków i bez wymogu konta',
          'Środki objęte gwarancją BFG',
        ],
        cons: [
          'Stawka niższa niż w ofertach powitalnych',
          'Mniejszy bank, mniej znana marka',
        ],
        scores: [
          { label: 'Oprocentowanie', value: 3.8 },
          { label: 'Warunki', value: 4.6 },
          { label: 'Elastyczność', value: 3.6 },
          { label: 'Zaufanie', value: 3.9 },
        ],
        specs: {
          oprocentowanie: '4,30%',
          okres: '6 mies.',
          kwota: 'do 40 000 zł',
          dlaKogo: 'Wszyscy',
          kapitalizacja: 'Na koniec',
        },
        providerId: 'toyota',
        ctaLabel: 'Załóż lokatę',
        body: [
          'Toyota Bank nie wygrywa wyścigu o najwyższą reklamową stawkę, za to ma rzecz, której brakuje liderom: oferta jest ' +
            'dla wszystkich, bez wymogu nowych środków i bez zakładania konta. To, co widzisz, naprawdę dostajesz, bez gwiazdek.',
          'Jeśli masz dość warunków drobnym druczkiem albo nie jesteś już nowym klientem w bankach z czołówki, to jedna z ' +
            'najmniej irytujących lokat na rynku. Stawka jest niższa, ale dostępna od ręki i bez kombinowania.',
        ],
      },
    ],
    methodology: [
      'Oceniamy lokaty w czterech obszarach: oprocentowanie w skali roku (najważniejsze, waga 50%), realne warunki ' +
        '(dla kogo, limit kwoty, wymóg nowych środków - waga 20%), elastyczność (długość okresu i dostępność - waga 15%) ' +
        'oraz zaufanie i wygoda banku (waga 15%). Ocena ogólna to średnia ważona tych kryteriów, a kolejność wynika wprost ' +
        'z wyliczenia, nie z subiektywnego wrażenia.',
      'Podajemy oprocentowanie nominalne w skali roku, przed podatkiem od zysków kapitałowych (podatek Belki, 19%). ' +
        'Środki na lokatach w bankach objętych polskim systemem gwarantowania są chronione przez BFG do równowartości 100 000 euro.',
      'Oprocentowanie lokat zmienia się kilka razy w roku, a najlepsze oferty bywają czasowe. Zawsze sprawdź aktualną ' +
        'stawkę i regulamin promocji bezpośrednio w banku przed założeniem lokaty. Datę ostatniej aktualizacji podajemy na górze strony.',
    ],
    verdict: [
      'Goła stawka 7% w Banku Nowym wygląda najlepiej, ale obejmuje tylko 10 000 zł na miesiąc, więc w złotówkach to ' +
        'drobne. Dla realnych pieniędzy najlepszy kompromis daje Nest Lokata Witaj: 6,10% na pół roku i limit 25 000 zł. ' +
        'Masz więcej? VeloBank obejmuje 50 000 zł, a Raiffeisen Digital nawet 100 000 zł, choć z austriacką gwarancją zamiast BFG.',
      'Zależy ci na dużej kwocie w znanym banku z polskim BFG? Spójrz na Credit Agricole (100 000 zł, ale tylko miesiąc). ' +
        'A jeśli masz dość warunków drobnym druczkiem albo nie jesteś już nowym klientem, Toyota Bank daje uczciwe 4,30% ' +
        'dla wszystkich, bez kombinowania. Nie ma jednej najlepszej lokaty, jest najlepiej dopasowana do tego, ile masz ' +
        'i czy jesteś nowym klientem.',
    ],
    faq: [
      {
        q: 'Która lokata jest teraz najlepiej oprocentowana?',
        a:
          'Najwyższą stawkę (7%) ma Bank Nowy, ale obejmuje tylko 10 000 zł na miesiąc, więc realny zysk jest mały. Dla ' +
          'większych pieniędzy najlepszy kompromis daje Nest Lokata Witaj (6,10% na pół roku, 25 000 zł), a dla dużych kwot ' +
          'VeloBank (50 000 zł) i Raiffeisen Digital (100 000 zł). Stawki zmieniają się co miesiąc, dlatego ranking aktualizujemy regularnie.',
      },
      {
        q: 'Czym różni się lokata od konta oszczędnościowego?',
        a:
          'Lokata blokuje środki na ustalony czas w zamian za z góry znane, zwykle wyższe oprocentowanie. Konto ' +
          'oszczędnościowe daje stały dostęp do pieniędzy, ale jego oprocentowanie jest zmienne i bank może je obniżyć. ' +
          'Poduszkę finansową, do której potrzebujesz dostępu, trzymaj na koncie oszczędnościowym. Lokatę zakładaj na nadwyżki, ' +
          'których nie ruszysz przez kilka miesięcy.',
      },
      {
        q: 'Czy od odsetek z lokaty zapłacę podatek?',
        a:
          'Tak. Od zysków z lokat i kont oszczędnościowych bank automatycznie pobiera podatek od zysków kapitałowych ' +
          '(tak zwany podatek Belki) w wysokości 19%. Oprocentowanie w rankingu podajemy w skali roku przed podatkiem - ' +
          'kwota, którą faktycznie otrzymasz, jest o ten podatek niższa.',
      },
      {
        q: 'Co znaczy lokata na nowe środki?',
        a:
          'To lokata, której promocyjne oprocentowanie obejmuje wyłącznie pieniądze, które dopiero wpłacasz do banku, ' +
          'a nie te, które już tam trzymasz. Banki stosują ten warunek, żeby przyciągać nowy kapitał. Jeśli przeniesiesz ' +
          'środki z innego banku, zwykle liczą się jako nowe.',
      },
      {
        q: 'Czy pieniądze na lokacie są bezpieczne?',
        a:
          'Tak. Depozyty w bankach objętych polskim systemem gwarantowania są chronione przez Bankowy Fundusz Gwarancyjny ' +
          '(BFG) do równowartości 100 000 euro na osobę w jednym banku. Lokata nie wiąże się z ryzykiem rynkowym - znasz ' +
          'oprocentowanie z góry i otrzymasz umówioną kwotę.',
      },
    ],
    segments: [
      { label: 'Najwyższa stawka', slug: 'banknowy-nowydepozyt', reason: 'Najwyższe 7% na rynku, ale tylko do 10 000 zł i na miesiąc.' },
      { label: 'Najlepsza ogólnie', slug: 'nest-lokata-witaj', reason: 'Najlepszy kompromis: 6,10% na pół roku z limitem 25 000 zł.' },
      { label: 'Dla dużej kwoty', slug: 'velolokata-dla-aktywnych', reason: 'Sześć procent obejmujące 50 000 zł, ze środkami pod gwarancją BFG.' },
      { label: 'Bez kombinowania', slug: 'toyota-lokata-standard', reason: 'Uczciwa stawka dla wszystkich, bez wymogu nowych środków i konta.' },
    ],
    relatedArticles: [
      { label: 'Konto oszczędnościowe 2026 - czy twoje pieniądze są bezpieczne', href: '/pieniadze/konto-oszczednosciowe-2026-czy-twoje-pieniadze-sa-bezpieczne' },
      { label: 'Poduszka finansowa - ile powinieneś mieć odłożone', href: '/pieniadze/poduszka-finansowa-2026-ile-powinienes-miec-odlozone' },
      { label: 'Ranking kont osobistych - które konto wybrać', href: '/ranking/konta-osobiste' },
    ],
    changelog: [
      { date: '2026-06-10', note: 'Pełna weryfikacja ofert (Bankier, Moneteo). Nowa czołówka: Bank Nowy 7%, Nest 6,10%, VeloBank i Raiffeisen Digital po 6%. Usunięto nieaktualne pozycje mBank/BOŚ/Pekao/Millennium.' },
      { date: '2026-06-07', note: 'Aktualizacja oprocentowania lokat zgodnie z ofertami banków po obniżkach stóp NBP.' },
    ],
    affiliateNote: AFFILIATE_DISCLOSURE,
    published: false, // ⚠️ ustaw true po weryfikacji oprocentowania i podstawieniu linków afiliacyjnych
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // RANKING KONT OSZCZĘDNOŚCIOWYCH (para z lokatami — te same banki, ten sam system)
  // ⚠️ OPROCENTOWANIE KONT OSZCZĘDNOŚCIOWYCH JEST ZMIENNE i bank może je obniżyć
  //    w dowolnym momencie. Wartości poniżej są reprezentatywne dla czerwca 2026
  //    (otoczenie obniżek stóp NBP) i wymagają weryfikacji przed publikacją.
  //    Comiesięczna aktualizacja = zmiana `updated` + oprocentowania.
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'konta-oszczednosciowe',
    category: 'pieniadze',
    kicker: 'Ranking {DATE}',
    title: 'Ranking kont oszczędnościowych {DATE} - najwyżej oprocentowane',
    lead:
      'Porównanie najwyżej oprocentowanych kont oszczędnościowych w Polsce: oprocentowanie ' +
      'promocyjne, okres promocji, limit kwoty i koszt wypłat. Aktualizowane co miesiąc.',
    metaTitle: 'Ranking kont oszczędnościowych {DATE}: najlepsze konto | KisielFinanse',
    metaDesc:
      'Najlepsze konto oszczędnościowe {DATE} - ranking najwyżej oprocentowanych kont w Polsce. ' +
      'VeloBank, mBank, ING, Nest, BOŚ i inne. Oprocentowanie, okres promocji, limit i wypłaty.',
    keywords: [
      'ranking kont oszczędnościowych',
      'najlepsze konto oszczędnościowe',
      'konto oszczędnościowe 2026',
      'najwyżej oprocentowane konto oszczędnościowe',
      'konto oszczędnościowe na nowe środki',
      'oprocentowanie kont oszczędnościowych',
      'gdzie założyć konto oszczędnościowe',
      'promocja konto oszczędnościowe',
    ],
    cover: '/images/blog/covers/coins-gold.jpg',
    updated: '2026-06-08',
    summary: [
      'Najwyższe oprocentowanie dają promocje dla nowych środków - krótkie (zwykle 3-4 miesiące) i z limitem kwoty objętej stawką.',
      'W przeciwieństwie do lokaty konto oszczędnościowe daje stały dostęp do pieniędzy, ale oprocentowanie jest zmienne i bank może je obniżyć z dnia na dzień.',
      'To najlepsze miejsce na poduszkę finansową: pieniądze pracują, a w razie potrzeby masz je od ręki. Sprawdź tylko, ile darmowych wypłat w miesiącu daje bank.',
      'Po zakończeniu promocji stawka zwykle spada do standardowej. Warto pilnować dat i przenosić środki tam, gdzie akurat jest najlepsza oferta.',
    ],
    intro: [
      'Konto oszczędnościowe to złoty środek między kontem osobistym a lokatą. Pieniądze pracują na ' +
        'wyższym oprocentowaniu niż na zwykłym koncie, a jednocześnie masz do nich stały dostęp i nie ' +
        'blokujesz ich na ustalony czas jak przy lokacie. To z tego powodu jest najlepszym miejscem na ' +
        'poduszkę finansową, do której musisz móc sięgnąć w każdej chwili.',
      'Poniżej zestawiam najlepiej oprocentowane konta oszczędnościowe dostępne w czerwcu 2026. Najwyższe ' +
        'stawki to promocje dla nowych środków: obowiązują przez kilka miesięcy, do określonego limitu kwoty, ' +
        'a po okresie spadają do standardowego, znacznie niższego poziomu. Przy każdej pozycji podaję realne ' +
        'warunki, nie samą reklamową liczbę. Oprocentowanie kont oszczędnościowych jest zmienne i bank może je ' +
        'obniżyć w dowolnym momencie, dlatego ranking aktualizuję co miesiąc.',
    ],
    fields: [
      { id: 'oprocentowanie', label: 'Oprocentowanie', short: 'Oproc.' },
      { id: 'okresPromo', label: 'Okres promocji', short: 'Promocja' },
      { id: 'kwota', label: 'Kwota objęta', short: 'Kwota' },
      { id: 'dlaKogo', label: 'Dla kogo', short: 'Dla kogo' },
      { id: 'wyplaty', label: 'Darmowe wypłaty', short: 'Wypłaty' },
    ],
    ratingWeights: [
      { label: 'Oprocentowanie', weight: 0.45 },
      { label: 'Warunki', weight: 0.20 },
      { label: 'Elastyczność', weight: 0.20 },
      { label: 'Zaufanie', weight: 0.15 },
    ],
    pickerCriteria: [
      { key: 'Oprocentowanie', label: 'Najwyższe oprocentowanie' },
      { key: 'Warunki', label: 'Najłatwiejsze warunki' },
      { key: 'Elastyczność', label: 'Swoboda wypłat' },
      { key: 'Zaufanie', label: 'Duży, pewny bank' },
      { key: '__overall', label: 'Najlepsze ogólnie' },
    ],
    picks: [
      {
        rank: 1,
        name: 'Velo Konto Oszczędnościowe',
        provider: 'VeloBank',
        slug: 'velobank-konto-oszczednosciowe',
        score: 4.5,
        badge: 'Najlepsze ogólnie',
        bestFor: 'Dla nowych środków',
        highlight: 'Regularnie jedna z najwyższych promocyjnych stawek na rynku dla nowych środków, z hojnym limitem kwoty.',
        pros: [
          'Jedno z najwyższych oprocentowań promocyjnych na rynku',
          'Wysoki limit kwoty objętej promocyjną stawką',
          'Stały dostęp do pieniędzy, środki objęte gwarancją BFG',
          'Proste założenie online, czytelna aplikacja',
        ],
        cons: [
          'Najwyższa stawka dotyczy tylko nowych środków i jest czasowa',
          'Po okresie promocji oprocentowanie spada do standardowego',
        ],
        scores: [
          { label: 'Oprocentowanie', value: 5.0 },
          { label: 'Warunki', value: 4.0 },
          { label: 'Elastyczność', value: 4.3 },
          { label: 'Zaufanie', value: 3.9 },
        ],
        specs: {
          oprocentowanie: '7,0%',
          okresPromo: '3 mies.',
          kwota: 'do 100 000 zł',
          dlaKogo: 'Nowe środki',
          wyplaty: '1 darmowa/mies.',
        },
        providerId: 'velobank',
        ctaLabel: 'Załóż konto',
        body: [
          'VeloBank od lat walczy o oszczędzających najwyższą promocyjną stawką na rynku. Velo Konto ' +
            'Oszczędnościowe łączy wysokie oprocentowanie dla nowych środków z limitem kwoty wyższym niż w wielu ' +
            'konkurencyjnych promocjach, więc realnie pracuje na nim większa część twoich pieniędzy.',
          'Jak przy każdej najlepszej ofercie, liczą się nowe środki, a stawka jest czasowa i po okresie promocji ' +
            'spada do standardowej. To dobre miejsce na nadwyżki i poduszkę finansową, ale warto zapisać sobie datę ' +
            'końca promocji i wtedy sprawdzić, gdzie przenieść pieniądze.',
        ],
        review: {
          intro: [
            'Velo Konto Oszczędnościowe to częsty lider rankingów oszczędnościowych w Polsce. Jeśli szukasz ' +
              'miejsca, w którym nadwyżka lub poduszka finansowa będą pracować na wysokiej stawce, a jednocześnie ' +
              'zachowasz do nich dostęp, to mocny kandydat na pierwszy wybór. Poniżej rozkładam ofertę na czynniki ' +
              'pierwsze: ile realnie zarobisz, jakie są warunki i komu to konto pasuje najbardziej.',
          ],
          sections: [
            {
              title: 'Oprocentowanie i warunki promocji',
              body: [
                'Najwyższa stawka obowiązuje dla nowych środków, czyli pieniędzy, które dopiero wpłacasz do banku, ' +
                  'przez ograniczony czas (zwykle kilka miesięcy) i do określonego limitu kwoty. Powyżej limitu oraz ' +
                  'po zakończeniu promocji obowiązuje stawka standardowa, znacznie niższa. To typowy mechanizm kont ' +
                  'oszczędnościowych, nie haczyk wyłącznie VeloBanku.',
                'Praktyczny wniosek: konto sprawdza się najlepiej, kiedy masz konkretną sumę nowych środków i ' +
                  'pilnujesz dat. Po okresie promocji warto porównać rynek i ewentualnie przenieść pieniądze tam, ' +
                  'gdzie akurat jest najlepsza oferta.',
              ],
            },
            {
              title: 'Dostęp do pieniędzy i bezpieczeństwo',
              body: [
                'W przeciwieństwie do lokaty nie blokujesz tu środków. Pieniądze możesz wypłacić w każdej chwili, ' +
                  'choć warto sprawdzić, ile przelewów lub wypłat w miesiącu jest darmowych, bo kolejne bywają płatne. ' +
                  'Dla poduszki finansowej, którą rusza się rzadko, zwykle nie stanowi to problemu.',
                'Środki na koncie oszczędnościowym objęte są gwarancją Bankowego Funduszu Gwarancyjnego do ' +
                  'równowartości 100 000 euro, tak samo jak na lokacie czy koncie osobistym.',
              ],
            },
            {
              title: 'Dla kogo jest to konto',
              body: [
                'Velo Konto Oszczędnościowe sprawdzi się dla osób z wolną gotówką, które chcą wycisnąć z niej ' +
                  'najwyższą dostępną stawkę i nie boją się pilnować dat promocji. To też dobre miejsce na poduszkę ' +
                  'finansową dzięki stałemu dostępowi do pieniędzy.',
                'Jeśli zależy ci na świętym spokoju bez śledzenia ofert, rozważ konto z uczciwą stawką dla wszystkich ' +
                  'lub lokatę z gwarantowanym oprocentowaniem na dłuższy okres.',
              ],
            },
          ],
          faq: [
            {
              q: 'Ile wynosi oprocentowanie Velo Konta Oszczędnościowego?',
              a: 'Promocyjna stawka należy do najwyższych na rynku i obowiązuje dla nowych środków przez ograniczony ' +
                'czas oraz do określonego limitu kwoty. Po okresie promocji oraz powyżej limitu obowiązuje stawka ' +
                'standardowa, znacznie niższa. Aktualne wartości sprawdź na stronie banku, bo zmieniają się co miesiąc.',
            },
            {
              q: 'Czy mogę wypłacić pieniądze z konta oszczędnościowego w każdej chwili?',
              a: 'Tak. Konto oszczędnościowe, w odróżnieniu od lokaty, daje stały dostęp do środków. Zwróć tylko uwagę ' +
                'na liczbę darmowych wypłat lub przelewów w miesiącu - kolejne mogą być płatne zgodnie z tabelą opłat.',
            },
            {
              q: 'Czy warto założyć Velo Konto Oszczędnościowe w 2026 roku?',
              a: 'Dla osób z wolnymi środkami, które chcą wysokiej stawki i akceptują warunek nowych środków oraz ' +
                'czasowy charakter promocji, to jeden z najlepszych wyborów. Jeśli wolisz nie pilnować dat, rozważ ' +
                'konto z równą stawką dla wszystkich albo lokatę.',
            },
          ],
        },
      },
      {
        rank: 2,
        name: 'mBank Konto Oszczędnościowe',
        provider: 'mBank',
        slug: 'mbank-konto-oszczednosciowe',
        score: 4.5,
        badge: 'Najwygodniejsze',
        bestFor: 'Dla wygody i ekosystemu',
        highlight: 'Wysoka stawka na nowe środki połączona z najlepszą aplikacją i całym ekosystemem w jednym miejscu.',
        pros: [
          'Atrakcyjne oprocentowanie promocyjne na nowe środki',
          'Wszystko w świetnej aplikacji obok konta, lokat i domu maklerskiego',
          'Duży, stabilny bank notowany na GPW',
          'Stały dostęp do środków, gwarancja BFG',
        ],
        cons: [
          'Najwyższa stawka tylko dla nowych środków i czasowo',
          'Standardowe oprocentowanie po promocji wyraźnie niższe',
        ],
        scores: [
          { label: 'Oprocentowanie', value: 4.6 },
          { label: 'Warunki', value: 4.0 },
          { label: 'Elastyczność', value: 4.5 },
          { label: 'Zaufanie', value: 4.6 },
        ],
        specs: {
          oprocentowanie: '6,0%',
          okresPromo: '3 mies.',
          kwota: 'do 100 000 zł',
          dlaKogo: 'Nowe środki',
          wyplaty: 'Bez limitu*',
        },
        providerId: 'mbank',
        ctaLabel: 'Załóż konto',
        body: [
          'mBank łączy konkurencyjną promocję na nowe środki z wygodą, której brakuje mniejszym bankom. Konto ' +
            'oszczędnościowe założysz w kilka chwil w aplikacji, a środki widzisz obok konta osobistego, lokat i ' +
            'domu maklerskiego eMakler. Jeśli i tak bankujesz w mBanku, to najprostsza droga, żeby nadwyżka pracowała.',
          'Tak jak u konkurencji, najwyższa stawka dotyczy nowych środków i jest czasowa. Po okresie promocji ' +
            'oprocentowanie spada do standardowego, więc warto pilnować dat i porównywać rynek.',
        ],
      },
      {
        rank: 3,
        name: 'ING Otwarte Konto Oszczędnościowe',
        provider: 'ING Bank Śląski',
        slug: 'ing-otwarte-konto-oszczednosciowe',
        score: 4.3,
        badge: 'Najwygodniejsze wypłaty',
        bestFor: 'Dla swobody dostępu',
        highlight: 'Bardzo wygodne zarządzanie oszczędnościami i swobodny dostęp do pieniędzy w najprostszej aplikacji.',
        pros: [
          'Swobodny dostęp do środków i wygodne przelewy na konto osobiste',
          'Aplikacja Moje ING uznawana za jedną z najprostszych w obsłudze',
          'Cele oszczędnościowe i automatyczne odkładanie wbudowane w konto',
          'Duży, stabilny bank, gwarancja BFG',
        ],
        cons: [
          'Standardowa stawka bywa niższa od promocji konkurencji',
          'Najlepsze oprocentowanie zwykle wymaga nowych środków',
        ],
        scores: [
          { label: 'Oprocentowanie', value: 4.2 },
          { label: 'Warunki', value: 4.3 },
          { label: 'Elastyczność', value: 4.6 },
          { label: 'Zaufanie', value: 4.5 },
        ],
        specs: {
          oprocentowanie: '5,5%',
          okresPromo: '4 mies.',
          kwota: 'do 100 000 zł',
          dlaKogo: 'Nowe środki',
          wyplaty: 'Swobodne',
        },
        providerId: 'ing',
        ctaLabel: 'Załóż konto',
        body: [
          'ING wygrywa wygodą. Otwarte Konto Oszczędnościowe obsłużysz w aplikacji Moje ING, którą bez problemu ' +
            'opanuje osoba mniej pewna technologii, a środki przeniesiesz na konto osobiste jednym przelewem. ' +
            'W parze z celami oszczędnościowymi i automatycznym odkładaniem to wygodny zestaw do budowania nadwyżki.',
          'Promocyjna stawka dotyczy zwykle nowych środków i ma swój okres, a standardowe oprocentowanie rzadko ' +
            'bywa liderem. To konto dla osób, które cenią prostotę i swobodny dostęp bardziej niż ostatni punkt ' +
            'procentowy promocji.',
        ],
      },
      {
        rank: 4,
        name: 'Nest Konto Oszczędnościowe',
        provider: 'Nest Bank',
        slug: 'nest-konto-oszczednosciowe',
        score: 4.3,
        badge: 'Wysoka stawka',
        bestFor: 'Dla nowych klientów',
        highlight: 'Wysokie oprocentowanie promocyjne dla nowych klientów, podobnie jak w lokatach Nest.',
        pros: [
          'Jedno z wyższych oprocentowań promocyjnych dla nowych klientów',
          'Stały dostęp do środków',
          'Proste założenie online, gwarancja BFG',
        ],
        cons: [
          'Najwyższa stawka dla nowych klientów i nowych środków',
          'Mniejszy bank, mniej rozbudowana aplikacja niż u gigantów',
        ],
        scores: [
          { label: 'Oprocentowanie', value: 4.8 },
          { label: 'Warunki', value: 3.8 },
          { label: 'Elastyczność', value: 4.0 },
          { label: 'Zaufanie', value: 3.8 },
        ],
        specs: {
          oprocentowanie: '6,5%',
          okresPromo: '3 mies.',
          kwota: 'do 50 000 zł',
          dlaKogo: 'Nowi klienci',
          wyplaty: '1 darmowa/mies.',
        },
        providerId: 'nest',
        ctaLabel: 'Załóż konto',
        body: [
          'Nest Bank konsekwentnie walczy o nowych klientów wysoką stawką, tak samo na koncie oszczędnościowym jak ' +
            'na lokacie. Promocyjne oprocentowanie należy do wyższych na rynku, ale obejmuje pierwsze środki nowego ' +
            'klienta i działa przez ograniczony czas.',
          'To dobry wybór, jeśli nie korzystałeś wcześniej z Nest Banku i masz wolną gotówkę. Po okresie promocji ' +
            'sprawdź, czy standardowa stawka nadal jest konkurencyjna, czy lepiej przenieść środki gdzie indziej.',
        ],
      },
      {
        rank: 5,
        name: 'BOŚ Konto Oszczędnościowe',
        provider: 'BOŚ Bank',
        slug: 'bos-konto-oszczednosciowe',
        score: 4.3,
        badge: 'Wysoki limit kwoty',
        bestFor: 'Dla większych oszczędności',
        highlight: 'Solidna promocyjna stawka obejmująca wysoką kwotę środków.',
        pros: [
          'Promocyjna stawka obejmuje wysoki limit kwoty',
          'Dobra propozycja dla większych oszczędności',
          'Stały dostęp do środków, gwarancja BFG',
        ],
        cons: [
          'Zwykle wymóg nowych środków lub założenia konta',
          'Mniejsza sieć i mniej rozbudowana aplikacja niż u gigantów',
        ],
        scores: [
          { label: 'Oprocentowanie', value: 4.6 },
          { label: 'Warunki', value: 4.2 },
          { label: 'Elastyczność', value: 3.9 },
          { label: 'Zaufanie', value: 3.9 },
        ],
        specs: {
          oprocentowanie: '5,8%',
          okresPromo: '4 mies.',
          kwota: 'do 200 000 zł',
          dlaKogo: 'Nowe środki',
          wyplaty: '1 darmowa/mies.',
        },
        providerId: 'bos',
        ctaLabel: 'Załóż konto',
        body: [
          'BOŚ Bank wyróżnia się tym, że promocyjna stawka obejmuje wyraźnie wyższą kwotę niż wiele ofert z limitem ' +
            '50 000 zł. Dla kogoś, kto chce ulokować większą sumę na jednym koncie z wysokim oprocentowaniem, to ' +
            'realna przewaga.',
          'W zamian trzeba zwykle spełnić warunek nowych środków lub założenia konta, a obsługa jest mniej dopracowana ' +
            'niż w największych bankach. To konto pod konkretny cel: większa nadwyżka, wysoka stawka, stały dostęp.',
        ],
      },
      {
        rank: 6,
        name: 'Millennium Konto Oszczędnościowe',
        provider: 'Bank Millennium',
        slug: 'millennium-konto-oszczednosciowe',
        score: 4.2,
        bestFor: 'Dla wygody w aplikacji',
        highlight: 'Wygodne konto oszczędnościowe na nowe środki, często powiązane z promocją konta osobistego.',
        pros: [
          'Szybkie założenie w nowoczesnej aplikacji',
          'Częste promocje powiązane z kontem osobistym',
          'Stabilny bank z dobrą obsługą',
        ],
        cons: [
          'Niższy limit kwoty na najlepszej stawce',
          'Najwyższe oprocentowanie tylko na nowe środki',
        ],
        scores: [
          { label: 'Oprocentowanie', value: 4.4 },
          { label: 'Warunki', value: 3.9 },
          { label: 'Elastyczność', value: 4.2 },
          { label: 'Zaufanie', value: 4.3 },
        ],
        specs: {
          oprocentowanie: '5,5%',
          okresPromo: '3 mies.',
          kwota: 'do 50 000 zł',
          dlaKogo: 'Nowe środki',
          wyplaty: 'Swobodne',
        },
        providerId: 'millennium',
        ctaLabel: 'Załóż konto',
        body: [
          'Millennium to solidny środek stawki: przyzwoite konto oszczędnościowe na nowe środki, które bez problemu ' +
            'założysz w aplikacji, często w pakiecie z promocją konta osobistego. Dla obecnych klientów banku to ' +
            'wygodny sposób na ulokowanie nadwyżki blisko konta.',
          'Limit kwoty na najlepszej stawce jest niższy niż u liderów, a oprocentowanie dotyczy nowych środków. ' +
            'Dla mniejszych sum i osób ceniących wygodną aplikację to rozsądny wybór.',
        ],
      },
      {
        rank: 7,
        name: 'Pekao Konto Oszczędnościowe',
        provider: 'Bank Pekao S.A.',
        slug: 'pekao-konto-oszczednosciowe',
        score: 4.2,
        bestFor: 'Dla klientów dużego banku',
        highlight: 'Przyzwoita stawka na nowe środki w jednym z największych banków w Polsce.',
        pros: [
          'Wygodne założenie w aplikacji PeoPay',
          'Duży, stabilny bank z szeroką siecią',
          'Dobre dla osób, które już bankują w Pekao',
        ],
        cons: [
          'Stawka niższa niż u liderów rankingu',
          'Najwyższe oprocentowanie tylko na nowe środki',
        ],
        scores: [
          { label: 'Oprocentowanie', value: 4.3 },
          { label: 'Warunki', value: 3.9 },
          { label: 'Elastyczność', value: 4.0 },
          { label: 'Zaufanie', value: 4.6 },
        ],
        specs: {
          oprocentowanie: '5,0%',
          okresPromo: '3 mies.',
          kwota: 'do 100 000 zł',
          dlaKogo: 'Nowe środki',
          wyplaty: '1 darmowa/mies.',
        },
        providerId: 'pekao',
        ctaLabel: 'Załóż konto',
        body: [
          'Pekao to wybór dla osób, które cenią stabilność i wygodę dużego banku bardziej niż ostatni punkt ' +
            'procentowy. Konto oszczędnościowe założysz w aplikacji PeoPay, a środki masz obok konta i pozostałych ' +
            'produktów.',
          'Stawka jest niższa niż u liderów zestawienia i dotyczy nowych środków, ale dla obecnych klientów Pekao ' +
            'to najprostsza droga, żeby nadwyżka nie leżała bezczynnie na koncie osobistym.',
        ],
      },
      {
        rank: 8,
        name: 'Erste Konto Oszczędnościowe',
        provider: 'Erste Bank Polska (dawniej Santander)',
        slug: 'erste-konto-oszczednosciowe',
        score: 4.1,
        bestFor: 'Dla obecnych klientów',
        highlight: 'Standardowa promocja na nowe środki w banku w trakcie zmiany marki.',
        pros: [
          'Wygodne założenie online',
          'Duży bank z szeroką siecią',
          'Częste promocje dla nowych środków',
        ],
        cons: [
          'Stawka niższa niż u liderów',
          'Marka w trakcie rebrandingu (dawniej Santander)',
        ],
        scores: [
          { label: 'Oprocentowanie', value: 4.2 },
          { label: 'Warunki', value: 3.9 },
          { label: 'Elastyczność', value: 4.0 },
          { label: 'Zaufanie', value: 4.2 },
        ],
        specs: {
          oprocentowanie: '4,8%',
          okresPromo: '3 mies.',
          kwota: 'do 100 000 zł',
          dlaKogo: 'Nowe środki',
          wyplaty: 'Swobodne',
        },
        providerId: 'erste',
        ctaLabel: 'Załóż konto',
        body: [
          'To dawny Santander Bank Polska, przechodzący pod markę Erste. Konto oszczędnościowe jest standardową ' +
            'ofertą na nowe środki: bez fajerwerków, ale wygodne i dostępne online, w dużym banku z szeroką siecią.',
          'Stawka jest niższa niż u liderów zestawienia, a przy zmianie właściciela warto śledzić aktualne warunki ' +
            'promocji. Dla obecnych klientów to najprostsza droga, żeby nadwyżka pracowała przy stałym dostępie do środków.',
        ],
      },
    ],
    methodology: [
      'Oceniamy konta oszczędnościowe w czterech obszarach: oprocentowanie promocyjne w skali roku (najważniejsze, ' +
        'waga 45%), realne warunki (dla kogo, limit kwoty, wymóg nowych środków - waga 20%), elastyczność (swoboda i ' +
        'koszt wypłat oraz dostęp do pieniędzy - waga 20%) oraz zaufanie i wygoda banku (waga 15%). Ocena ogólna to ' +
        'średnia ważona tych kryteriów, a kolejność wynika wprost z wyliczenia, nie z subiektywnego wrażenia.',
      'Podajemy oprocentowanie nominalne w skali roku, przed podatkiem od zysków kapitałowych (podatek Belki, 19%). ' +
        'Oprocentowanie kont oszczędnościowych jest zmienne - bank może je obniżyć w dowolnym momencie, także w trakcie ' +
        'trwania promocji zgodnie z regulaminem. Środki objęte są gwarancją BFG do równowartości 100 000 euro.',
      'Promocyjne stawki obejmują zwykle nowe środki, mają limit kwoty i ograniczony okres, po którym oprocentowanie ' +
        'spada do standardowego. Zawsze sprawdź aktualną stawkę i regulamin promocji bezpośrednio w banku przed ' +
        'założeniem konta. Datę ostatniej aktualizacji zestawienia podajemy na górze strony.',
    ],
    verdict: [
      'Jeśli chcesz po prostu najwyższą stawkę i masz wolne środki nowe dla banku, wybierz Velo Konto ' +
        'Oszczędnościowe - wysoka promocja przy hojnym limicie kwoty. Gdy zależy ci na wygodzie i całym ekosystemie ' +
        'w jednej aplikacji, mBank daje najlepszy kompromis między oprocentowaniem a komfortem.',
      'Cenisz swobodny dostęp i prostotę? ING jest najwygodniejsze w obsłudze. Masz większą sumę? BOŚ obejmuje ' +
        'promocyjną stawką znacznie wyższą kwotę. Pamiętaj tylko, że oprocentowanie kont oszczędnościowych jest ' +
        'zmienne i promocje są czasowe - najlepiej traktować je jako miejsce na poduszkę i nadwyżki, pilnując dat.',
    ],
    faq: [
      {
        q: 'Które konto oszczędnościowe jest teraz najlepiej oprocentowane?',
        a:
          'Najwyższe oprocentowanie w tym zestawieniu ma Velo Konto Oszczędnościowe, ale stawka promocyjna dotyczy ' +
          'nowych środków, działa przez ograniczony czas i ma limit kwoty. Dla wygody dużego banku warto spojrzeć na ' +
          'mBank, a dla swobody dostępu na ING. Oprocentowanie kont oszczędnościowych jest zmienne i bywa aktualizowane ' +
          'co miesiąc, dlatego ranking odświeżamy regularnie.',
      },
      {
        q: 'Czym różni się konto oszczędnościowe od lokaty?',
        a:
          'Konto oszczędnościowe daje stały dostęp do pieniędzy i ma zmienne oprocentowanie, które bank może obniżyć. ' +
          'Lokata blokuje środki na ustalony czas w zamian za z góry znaną, zwykle wyższą stawkę. Poduszkę finansową, ' +
          'do której potrzebujesz dostępu, trzymaj na koncie oszczędnościowym. Lokatę zakładaj na nadwyżki, których nie ' +
          'ruszysz przez kilka miesięcy.',
      },
      {
        q: 'Czy oprocentowanie konta oszczędnościowego może się zmienić?',
        a:
          'Tak. W odróżnieniu od lokaty, oprocentowanie konta oszczędnościowego jest zmienne i bank może je obniżyć ' +
          'w dowolnym momencie, zgodnie z regulaminem. Promocyjne stawki dla nowych środków obowiązują dodatkowo tylko ' +
          'przez określony czas, po którym wracasz do stawki standardowej.',
      },
      {
        q: 'Co znaczy konto oszczędnościowe na nowe środki?',
        a:
          'To konto, którego promocyjne oprocentowanie obejmuje wyłącznie pieniądze nowo wpłacone do banku, a nie te, ' +
          'które już tam trzymasz. Banki stosują ten warunek, żeby przyciągać nowy kapitał. Środki przeniesione z ' +
          'innego banku zwykle liczą się jako nowe.',
      },
      {
        q: 'Czy od odsetek z konta oszczędnościowego zapłacę podatek?',
        a:
          'Tak. Od zysków z kont oszczędnościowych i lokat bank automatycznie pobiera podatek od zysków kapitałowych ' +
          '(podatek Belki) w wysokości 19%. Oprocentowanie w rankingu podajemy w skali roku przed podatkiem - kwota, ' +
          'którą faktycznie otrzymasz, jest o ten podatek niższa.',
      },
    ],
    segments: [
      { label: 'Najwyższe oprocentowanie', slug: 'velobank-konto-oszczednosciowe', reason: 'Jedna z najwyższych promocyjnych stawek na rynku przy hojnym limicie kwoty.' },
      { label: 'Najwygodniejsze', slug: 'mbank-konto-oszczednosciowe', reason: 'Wysoka stawka i wszystko obok konta w jednej z najlepszych aplikacji.' },
      { label: 'Swoboda dostępu', slug: 'ing-otwarte-konto-oszczednosciowe', reason: 'Najprostsza obsługa i wygodne przelewy na konto osobiste.' },
      { label: 'Dla wysokich kwot', slug: 'bos-konto-oszczednosciowe', reason: 'Promocyjna stawka obejmuje wyraźnie wyższy limit kwoty.' },
    ],
    relatedArticles: [
      { label: 'Konto oszczędnościowe 2026 - czy twoje pieniądze są bezpieczne', href: '/pieniadze/konto-oszczednosciowe-2026-czy-twoje-pieniadze-sa-bezpieczne' },
      { label: 'Poduszka finansowa - ile powinieneś mieć odłożone', href: '/pieniadze/poduszka-finansowa-2026-ile-powinienes-miec-odlozone' },
      { label: 'Ranking lokat - najlepiej oprocentowane lokaty', href: '/ranking/lokaty' },
      { label: 'Ranking kont osobistych - które konto wybrać', href: '/ranking/konta-osobiste' },
    ],
    changelog: [
      { date: '2026-06-08', note: 'Pierwsza publikacja rankingu. Oprocentowanie reprezentatywne dla czerwca 2026 (otoczenie obniżek stóp NBP).' },
    ],
    affiliateNote: AFFILIATE_DISCLOSURE,
    published: false, // ⚠️ ustaw true po weryfikacji oprocentowania i podstawieniu linków afiliacyjnych
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // RANKING IKE / IKZE (konta emerytalne z ulgą podatkową)
  // Inny typ produktu niż konta/lokaty: liczy się ulga podatkowa i GDZIE trzymasz
  // konto (maklerskie vs obligacje). Skupiamy się na wariantach inwestycyjnych,
  // gdzie sam kupujesz ETF-y/akcje, oraz na IKE/IKZE-Obligacjach dla ostrożnych.
  // ⚠️ LIMITY ROCZNE zmieniają się co roku. Wartości (IKE 28 260 zł, IKZE 11 304 zł)
  //    są zgodne z artykułem /inwestycje/ike-vs-ikze... dla 2026 — zweryfikuj przed publikacją.
  // ⚠️ PROWIZJE/OPŁATY brokerów zmieniają się — zweryfikuj w tabelach opłat.
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'ike-ikze',
    category: 'inwestycje',
    kicker: 'Ranking {DATE}',
    title: 'Ranking IKE i IKZE {DATE} - gdzie założyć konto emerytalne',
    lead:
      'Porównanie kont IKE i IKZE z ulgą podatkową: koszty, oferta inwestycyjna, platforma i typ ' +
      'konta. Skupiamy się na wariantach, w których sam inwestujesz w ETF-y, akcje lub obligacje.',
    metaTitle: 'Ranking IKE i IKZE {DATE}: gdzie założyć konto emerytalne | KisielFinanse',
    metaDesc:
      'Gdzie założyć IKE i IKZE w 2026? Ranking kont emerytalnych z ulgą podatkową - XTB, mBank, ' +
      'DM BOŚ, obligacje skarbowe i inne. Koszty, prowizje, oferta ETF i porównanie w jednym miejscu.',
    keywords: [
      'ranking IKE IKZE',
      'gdzie założyć IKE',
      'gdzie założyć IKZE',
      'najlepsze IKE',
      'najlepsze IKZE',
      'IKE ETF',
      'IKE maklerskie',
      'konto emerytalne z ulgą podatkową',
    ],
    cover: '/images/blog/covers/coins-stack.jpg',
    updated: '2026-06-08',
    summary: [
      'IKE i IKZE to konta z ulgą podatkową na emeryturę. IKE zwalnia z 19% podatku Belki przy wypłacie po 60. roku, IKZE odlicza wpłaty od dochodu już dziś (zwrot z PIT).',
      'Dla większości najwięcej daje konto maklerskie IKE/IKZE, na którym sam kupujesz tanie ETF-y - niskie koszty plus ulga podatkowa to najmocniejsza kombinacja na lata.',
      'Najtaniej inwestujesz w ETF-y w XTB (brak prowizji do limitu obrotu). DM BOŚ ma najszerszą ofertę rynków, a mBank najwygodniej łączy konto z resztą bankowości.',
      'Jeśli nie chcesz inwestować w akcje, IKE/IKZE-Obligacje (przez PKO) pozwala trzymać w opakowaniu emerytalnym detaliczne obligacje skarbowe z ochroną kapitału.',
    ],
    intro: [
      'IKE i IKZE to dwa konta emerytalne z ulgą podatkową - nie produkty same w sobie, lecz ' +
        '"opakowanie", w którym trzymasz inwestycje. IKE zwalnia zyski z 19% podatku Belki, jeśli ' +
        'wypłacisz środki po 60. roku życia. IKZE pozwala odliczyć roczne wpłaty od dochodu, więc zwrot ' +
        'z podatku dostajesz już teraz, a przy wypłacie po 65. roku płacisz tylko zryczałtowane 10%. ' +
        'Różnicę i to, które konto bardziej ci się opłaca, rozkładam w osobnym poradniku - tu skupiam ' +
        'się na tym, gdzie te konta najlepiej założyć.',
      'Najwięcej z ulgi wyciągniesz, jeśli w IKE lub IKZE inwestujesz samodzielnie w tanie ETF-y na ' +
        'rachunku maklerskim. Dlatego ranking porównuje przede wszystkim koszty (prowizje i opłaty za ' +
        'prowadzenie), ofertę (co realnie kupisz: ETF zagraniczne, akcje, obligacje) oraz wygodę platformy. ' +
        'Dla osób, które nie chcą inwestować w akcje, uwzględniam też IKE/IKZE-Obligacje, czyli konto ' +
        'emerytalne oparte na detalicznych obligacjach skarbowych. Limity wpłat na 2026 rok wynoszą ' +
        '28 260 zł dla IKE oraz 11 304 zł dla IKZE (wyższy limit dla osób prowadzących działalność).',
    ],
    fields: [
      { id: 'typ', label: 'Typ konta', short: 'Typ' },
      { id: 'prowizja', label: 'Prowizja (akcje/ETF)', short: 'Prowizja' },
      { id: 'oplata', label: 'Opłata za prowadzenie', short: 'Opłata' },
      { id: 'oferta', label: 'Co kupisz', short: 'Oferta' },
      { id: 'konta', label: 'IKE / IKZE', short: 'IKE/IKZE' },
    ],
    ratingWeights: [
      { label: 'Koszty', weight: 0.40 },
      { label: 'Oferta', weight: 0.30 },
      { label: 'Platforma', weight: 0.20 },
      { label: 'Zaufanie', weight: 0.10 },
    ],
    pickerCriteria: [
      { key: 'Koszty', label: 'Najniższe koszty' },
      { key: 'Oferta', label: 'Najszersza oferta' },
      { key: 'Platforma', label: 'Najwygodniejsza platforma' },
      { key: 'Zaufanie', label: 'Duży, pewny dostawca' },
      { key: '__overall', label: 'Najlepsze ogólnie' },
    ],
    picks: [
      {
        rank: 1,
        name: 'XTB IKE i IKZE',
        provider: 'XTB',
        slug: 'xtb-ike-ikze',
        score: 4.7,
        badge: 'Najlepsze ogólnie',
        bestFor: 'Dla inwestujących w ETF',
        highlight: 'Brak prowizji od akcji i ETF do limitu obrotu plus świetna platforma - najtańszy sposób na IKE/IKZE w ETF.',
        pros: [
          'Brak prowizji od akcji i ETF do miesięcznego limitu obrotu',
          'Bardzo dobra, prosta aplikacja i platforma webowa',
          'Dostęp do akcji i ETF z rynków zagranicznych',
          'Oferuje zarówno IKE, jak i IKZE',
        ],
        cons: [
          'Powyżej limitu obrotu naliczana jest prowizja',
          'Przewalutowanie przy zakupie zagranicznych instrumentów ma swój koszt',
        ],
        scores: [
          { label: 'Koszty', value: 5.0 },
          { label: 'Oferta', value: 4.5 },
          { label: 'Platforma', value: 4.8 },
          { label: 'Zaufanie', value: 4.2 },
        ],
        specs: {
          typ: 'Maklerskie',
          prowizja: '0% do limitu*',
          oplata: '0 zł',
          oferta: 'ETF, akcje (świat)',
          konta: 'IKE i IKZE',
        },
        providerId: 'xtb',
        ctaLabel: 'Otwórz IKE/IKZE',
        body: [
          'XTB zmienił układ sił na rynku IKE/IKZE, oferując akcje i ETF bez prowizji do określonego ' +
            'miesięcznego limitu obrotu. Dla osoby, która regularnie dokłada do emerytalnego portfela ETF, ' +
            'oznacza to realnie zerowy koszt transakcyjny - a przez kilkadziesiąt lat to różnica liczona w ' +
            'dziesiątkach tysięcy złotych. Do tego dochodzi prosta, dobrze oceniana platforma.',
          'Trzeba pamiętać o dwóch rzeczach: po przekroczeniu limitu obrotu pojawia się prowizja, a przy ' +
            'kupnie instrumentów w obcej walucie dochodzi koszt przewalutowania. Dla typowego, długoterminowego ' +
            'inwestora ETF te ograniczenia są drugorzędne wobec braku prowizji i wygody.',
        ],
        review: {
          intro: [
            'XTB IKE i IKZE to dziś domyślny wybór dla osób, które chcą oszczędzać na emeryturę przez tanie ' +
              'ETF-y i przy okazji korzystać z ulgi podatkowej. Brak prowizji do limitu obrotu plus prosta ' +
              'platforma sprawiają, że to jeden z najtańszych i najwygodniejszych sposobów prowadzenia konta ' +
              'emerytalnego. Poniżej rozkładam ofertę na czynniki pierwsze.',
          ],
          sections: [
            {
              title: 'Koszty - tu XTB wygrywa',
              body: [
                'Akcje i ETF kupujesz bez prowizji do miesięcznego limitu obrotu, a konto nie ma opłaty za ' +
                  'prowadzenie. Dla inwestora, który dokłada do portfela co miesiąc kilkaset czy kilka tysięcy ' +
                  'złotych, realny koszt transakcji wynosi zero. W długim terminie to najmocniejsza przewaga XTB, ' +
                  'bo każda zaoszczędzona złotówka prowizji procentuje przez dekady.',
                'Pamiętaj o dwóch kosztach pobocznych: prowizji powyżej limitu obrotu oraz przewalutowaniu przy ' +
                  'zakupie instrumentów notowanych w obcej walucie. Dla regularnego, długoterminowego inwestora ETF ' +
                  'są one drugorzędne, ale warto je znać.',
              ],
            },
            {
              title: 'Oferta i platforma',
              body: [
                'Masz dostęp do akcji i ETF z rynków zagranicznych, co wystarcza do zbudowania globalnie ' +
                  'zdywersyfikowanego portfela emerytalnego na jednym czy dwóch tanich funduszach ETF. Oferta jest ' +
                  'węższa niż u brokerów dla zaawansowanych, ale dla pasywnego inwestora w zupełności wystarczająca.',
                'Platforma i aplikacja XTB są proste i dobrze oceniane - łatwo złożysz zlecenie, ustawisz regularne ' +
                  'dopłaty i ogarniesz portfel bez wiedzy eksperckiej. To realna wartość dla osób, które zakładają ' +
                  'konto emerytalne raz i chcą się nim zajmować jak najmniej.',
              ],
            },
            {
              title: 'Dla kogo jest XTB IKE/IKZE',
              body: [
                'To wybór dla zdecydowanej większości osób budujących emeryturę przez tanie ETF-y: niskie koszty, ' +
                  'prosta obsługa i oba konta (IKE oraz IKZE) w jednym miejscu. Szczególnie docenią je osoby, które ' +
                  'chcą inwestować pasywnie i regularnie, bez śledzenia rynku.',
                'Jeśli zależy ci na egzotycznych rynkach, obligacjach korporacyjnych czy szerokiej ofercie dla ' +
                  'aktywnego tradingu, rozważ brokera z bogatszą ofertą, jak DM BOŚ. Dla pasywnego portfela ETF ' +
                  'oferta XTB jest jednak w sam raz.',
              ],
            },
          ],
          faq: [
            {
              q: 'Czy w XTB można mieć i IKE, i IKZE?',
              a: 'Tak. XTB prowadzi zarówno konto IKE, jak i IKZE. Możesz mieć oba jednocześnie i korzystać z ulg ' +
                'podatkowych obu kont, wpłacając do rocznych limitów ustawowych (w 2026 roku 28 260 zł na IKE i ' +
                '11 304 zł na IKZE).',
            },
            {
              q: 'Czy ETF-y w XTB IKE naprawdę są bez prowizji?',
              a: 'Akcje i ETF kupujesz bez prowizji do określonego miesięcznego limitu obrotu. Po jego przekroczeniu ' +
                'naliczana jest prowizja zgodnie z tabelą opłat. Dodatkowo przy instrumentach w obcej walucie dochodzi ' +
                'koszt przewalutowania. Aktualne warunki sprawdź na stronie XTB.',
            },
            {
              q: 'Czy XTB IKE nadaje się dla początkującego?',
              a: 'Tak. Platforma jest prosta w obsłudze, a do zbudowania zdywersyfikowanego portfela emerytalnego ' +
                'wystarczy jeden lub dwa szerokie ETF-y. To jeden z najprzystępniejszych sposobów rozpoczęcia ' +
                'długoterminowego oszczędzania z ulgą podatkową.',
            },
          ],
        },
      },
      {
        rank: 2,
        name: 'mBank Biuro Maklerskie IKE/IKZE',
        provider: 'mBank',
        slug: 'mbank-ike-ikze',
        score: 4.3,
        badge: 'Najwygodniejsze',
        bestFor: 'Dla klientów mBanku',
        highlight: 'Konto emerytalne w ekosystemie mBanku - GPW i rynki zagraniczne obok konta i oszczędności.',
        pros: [
          'Wszystko w aplikacji mBanku, obok konta i oszczędności',
          'Dostęp do GPW oraz rynków zagranicznych',
          'Oferuje IKE i IKZE',
          'Duży, stabilny bank notowany na GPW',
        ],
        cons: [
          'Prowizje wyższe niż w modelu bezprowizyjnym XTB',
          'Koszty rosną przy częstym handlu na rynkach zagranicznych',
        ],
        scores: [
          { label: 'Koszty', value: 4.0 },
          { label: 'Oferta', value: 4.3 },
          { label: 'Platforma', value: 4.6 },
          { label: 'Zaufanie', value: 4.6 },
        ],
        specs: {
          typ: 'Maklerskie',
          prowizja: '0,29%, min 19 zł*',
          oplata: '0 zł',
          oferta: 'ETF, akcje, GPW',
          konta: 'IKE i IKZE',
        },
        providerId: 'mbank',
        ctaLabel: 'Otwórz IKE/IKZE',
        body: [
          'Dla osób, które już bankują w mBanku, biuro maklerskie z IKE/IKZE to najwygodniejsza droga do konta ' +
            'emerytalnego: rachunek prowadzisz w tej samej aplikacji co konto osobiste, oszczędności i lokaty, ' +
            'bez przełączania się między platformami. Masz dostęp do GPW i rynków zagranicznych.',
          'Model prowizyjny jest klasyczny (procent od transakcji z kwotą minimalną), więc przy częstych zakupach ' +
            'lub mniejszych kwotach koszty bywają wyższe niż w bezprowizyjnym XTB. Dla inwestora ceniącego wygodę ' +
            'jednego ekosystemu to jednak solidny, bezpieczny wybór.',
        ],
      },
      {
        rank: 3,
        name: 'DM BOŚ (Bossa) IKE/IKZE',
        provider: 'BOŚ Bank',
        slug: 'bos-bossa-ike-ikze',
        score: 4.3,
        badge: 'Najszersza oferta',
        bestFor: 'Dla wymagających inwestorów',
        highlight: 'Weteran rynku maklerskiego z szerokim dostępem do rynków zagranicznych i rozbudowanymi narzędziami.',
        pros: [
          'Bardzo szeroki dostęp do rynków i instrumentów zagranicznych',
          'Rozbudowane narzędzia analityczne dla wymagających',
          'Oferuje IKE i IKZE, długie doświadczenie na rynku',
          'Dobre dla budowy zdywersyfikowanego portfela ETF',
        ],
        cons: [
          'Prowizje w modelu klasycznym, wyższe niż bezprowizyjny XTB',
          'Platforma bardziej rozbudowana, mniej "lekka" dla początkującego',
        ],
        scores: [
          { label: 'Koszty', value: 4.2 },
          { label: 'Oferta', value: 4.7 },
          { label: 'Platforma', value: 4.0 },
          { label: 'Zaufanie', value: 4.0 },
        ],
        specs: {
          typ: 'Maklerskie',
          prowizja: 'Od ~0,29%*',
          oplata: '0 zł',
          oferta: 'ETF, akcje, świat',
          konta: 'IKE i IKZE',
        },
        providerId: 'bos',
        ctaLabel: 'Otwórz IKE/IKZE',
        body: [
          'Dom Maklerski BOŚ (platforma Bossa) to weteran polskiego rynku z jedną z najszerszych ofert dostępu ' +
            'do rynków zagranicznych i rozbudowanymi narzędziami. Dla kogoś, kto chce mieć wybór instrumentów ' +
            'szerszy niż podstawowe ETF-y i ceni dojrzałą platformę, to mocny kandydat na konto emerytalne.',
          'Model prowizyjny jest klasyczny, więc przy małych, częstych zakupach koszty bywają wyższe niż w XTB. ' +
            'Platforma jest też bardziej rozbudowana, co dla początkującego może być przytłaczające. To wybór ' +
            'raczej dla świadomego inwestora niż dla osoby stawiającej pierwsze kroki.',
        ],
      },
      {
        rank: 4,
        name: 'IKE/IKZE-Obligacje (obligacje skarbowe)',
        provider: 'PKO Bank Polski',
        slug: 'ike-ikze-obligacje',
        score: 4.0,
        badge: 'Dla ostrożnych',
        bestFor: 'Dla unikających ryzyka',
        highlight: 'Konto emerytalne oparte na detalicznych obligacjach skarbowych - ulga podatkowa bez ryzyka rynku akcji.',
        pros: [
          'Ochrona kapitału - brak ryzyka rynku akcji',
          'Ulga podatkowa IKE/IKZE na obligacjach skarbowych',
          'Prosty produkt dla osób, które nie chcą inwestować w akcje',
          'Obligacje gwarantowane przez Skarb Państwa',
        ],
        cons: [
          'Długoterminowo niższy potencjał zysku niż portfel ETF',
          'Brak ekspozycji na wzrost rynków akcji',
        ],
        scores: [
          { label: 'Koszty', value: 4.8 },
          { label: 'Oferta', value: 3.0 },
          { label: 'Platforma', value: 3.5 },
          { label: 'Zaufanie', value: 4.8 },
        ],
        specs: {
          typ: 'Obligacje',
          prowizja: 'Brak prowizji',
          oplata: '0 zł',
          oferta: 'Obligacje skarbowe',
          konta: 'IKE i IKZE',
        },
        providerId: 'pko',
        ctaLabel: 'Sprawdź ofertę',
        body: [
          'IKE-Obligacje i IKZE-Obligacje to konta emerytalne, w których zamiast akcji czy ETF kupujesz ' +
            'detaliczne obligacje skarbowe (oferowane za pośrednictwem PKO BP jako agenta emisji). Dostajesz pełną ' +
            'ulgę podatkową IKE/IKZE, ale bez ryzyka rynku akcji - kapitał jest chroniony, a obligacje gwarantuje ' +
            'Skarb Państwa.',
          'Cena tego bezpieczeństwa to niższy długoterminowy potencjał zysku niż przy portfelu ETF. To rozsądny ' +
            'wybór dla osób blisko emerytury lub takich, które po prostu nie chcą inwestować w akcje, ale chcą ' +
            'korzystać z ulgi podatkowej i opakowania emerytalnego.',
        ],
      },
      {
        rank: 5,
        name: 'Erste Biuro Maklerskie IKE/IKZE',
        provider: 'Erste Bank Polska (dawniej Santander)',
        slug: 'erste-ike-ikze',
        score: 3.9,
        bestFor: 'Dla klientów dużego banku',
        highlight: 'Konto maklerskie z ulgą emerytalną w dużym banku w trakcie zmiany marki.',
        pros: [
          'Dostęp do GPW i rynków zagranicznych',
          'Wygodne dla obecnych klientów banku',
          'Oferuje IKE i IKZE',
          'Duży bank z szeroką siecią',
        ],
        cons: [
          'Prowizje wyższe niż w modelu bezprowizyjnym',
          'Marka w trakcie rebrandingu (dawniej Santander)',
        ],
        scores: [
          { label: 'Koszty', value: 3.8 },
          { label: 'Oferta', value: 4.0 },
          { label: 'Platforma', value: 3.9 },
          { label: 'Zaufanie', value: 4.2 },
        ],
        specs: {
          typ: 'Maklerskie',
          prowizja: 'Od ~0,29%*',
          oplata: '0 zł',
          oferta: 'ETF, akcje, GPW',
          konta: 'IKE i IKZE',
        },
        providerId: 'erste',
        ctaLabel: 'Sprawdź ofertę',
        body: [
          'To biuro maklerskie dawnego Santander Bank Polska, przechodzącego pod markę Erste. Konto maklerskie ' +
            'IKE/IKZE daje dostęp do GPW i rynków zagranicznych, a dla obecnych klientów banku jest wygodnym ' +
            'sposobem na połączenie inwestycji emerytalnych z resztą bankowości.',
          'Model prowizyjny jest klasyczny, więc koszty bywają wyższe niż w bezprowizyjnym XTB. Przy zmianie ' +
            'właściciela warto też śledzić aktualne tabele opłat i ofertę, bo mogą się zmieniać w trakcie ' +
            'przechodzenia na nową markę.',
        ],
      },
      {
        rank: 6,
        name: 'Pekao Biuro Maklerskie IKE/IKZE',
        provider: 'Bank Pekao S.A.',
        slug: 'pekao-ike-ikze',
        score: 3.9,
        bestFor: 'Dla stabilności dużego banku',
        highlight: 'Konto emerytalne maklerskie w jednym z największych banków w Polsce.',
        pros: [
          'Duży, stabilny bank z szeroką siecią',
          'Dostęp do GPW i rynków zagranicznych',
          'Oferuje IKE i IKZE',
          'Wygodne dla obecnych klientów Pekao',
        ],
        cons: [
          'Prowizje wyższe niż w modelu bezprowizyjnym',
          'Platforma mniej "lekka" niż u liderów',
        ],
        scores: [
          { label: 'Koszty', value: 3.7 },
          { label: 'Oferta', value: 3.9 },
          { label: 'Platforma', value: 3.8 },
          { label: 'Zaufanie', value: 4.6 },
        ],
        specs: {
          typ: 'Maklerskie',
          prowizja: 'Od ~0,29%*',
          oplata: '0 zł',
          oferta: 'ETF, akcje, GPW',
          konta: 'IKE i IKZE',
        },
        providerId: 'pekao',
        ctaLabel: 'Sprawdź ofertę',
        body: [
          'Biuro Maklerskie Pekao to wybór dla osób ceniących stabilność i wygodę jednego z największych banków ' +
            'w Polsce. Konto IKE/IKZE daje dostęp do GPW i rynków zagranicznych, a dla obecnych klientów Pekao ' +
            'jest naturalnym uzupełnieniem bankowości w jednym miejscu.',
          'Jak w bankowych biurach maklerskich, prowizje są w modelu klasycznym i bywają wyższe niż w ' +
            'bezprowizyjnym XTB, a platforma jest mniej lekka niż u liderów. To wybór pod stabilność i wygodę ' +
            'dużego banku, nie pod minimalizację kosztów.',
        ],
      },
    ],
    methodology: [
      'Oceniamy konta IKE/IKZE w czterech obszarach: koszty (prowizje od transakcji i opłaty za prowadzenie - ' +
        'najważniejsze, waga 40%), oferta inwestycyjna (dostęp do ETF zagranicznych, akcji, obligacji - waga 30%), ' +
        'wygoda platformy i aplikacji (waga 20%) oraz zaufanie i stabilność dostawcy (waga 10%). Ocena ogólna to ' +
        'średnia ważona tych kryteriów, a kolejność wynika wprost z wyliczenia, nie z subiektywnego wrażenia.',
      'Skupiamy się na kontach inwestycyjnych (maklerskich), na których sam kupujesz ETF-y, akcje lub obligacje, ' +
        'bo dla większości osób połączenie niskich kosztów i ulgi podatkowej daje najlepszy długoterminowy wynik. ' +
        'Pomijamy IKE/IKZE w formie ubezpieczeniowej, które zwykle mają wyższe opłaty. Uwzględniamy IKE/IKZE-Obligacje ' +
        'jako bezpieczny wariant dla osób unikających ryzyka rynku akcji.',
      'Prowizje, opłaty i szczegóły oferty zmieniają się, a limity wpłat na IKE i IKZE są ustalane co roku. Zawsze ' +
        'sprawdź aktualną tabelę opłat i regulamin u dostawcy przed założeniem konta. Datę ostatniej aktualizacji ' +
        'zestawienia podajemy na górze strony.',
    ],
    verdict: [
      'Jeśli budujesz emeryturę przez tanie ETF-y - a dla większości to najrozsądniejsza droga - wybierz XTB. ' +
        'Brak prowizji do limitu obrotu i prosta platforma dają najtańszy i najwygodniejszy zestaw, a oba konta ' +
        '(IKE i IKZE) prowadzisz w jednym miejscu.',
      'Cenisz wygodę jednego banku? mBank połączy konto emerytalne z resztą bankowości. Chcesz najszerszej oferty ' +
        'rynków i rozbudowanych narzędzi? Postaw na DM BOŚ. A jeśli nie chcesz ryzyka akcji, IKE/IKZE-Obligacje ' +
        'dają ulgę podatkową na bezpiecznych obligacjach skarbowych. Najpierw zdecyduj, jak chcesz inwestować, ' +
        'potem wybierz dostawcę.',
    ],
    faq: [
      {
        q: 'Gdzie najlepiej założyć IKE i IKZE w 2026 roku?',
        a:
          'Dla większości osób najlepszym wyborem jest konto maklerskie, na którym samodzielnie inwestujesz w tanie ' +
          'ETF-y. Najtańszy pod tym względem jest XTB (brak prowizji do limitu obrotu). Jeśli cenisz wygodę jednego ' +
          'banku, dobrym wyborem jest mBank, a dla najszerszej oferty rynków DM BOŚ. Osoby unikające ryzyka mogą ' +
          'wybrać IKE/IKZE-Obligacje oparte na obligacjach skarbowych.',
      },
      {
        q: 'Czym różni się IKE od IKZE?',
        a:
          'IKE zwalnia zyski z 19% podatku Belki, jeśli wypłacisz środki po 60. roku życia. IKZE pozwala odliczyć ' +
          'roczne wpłaty od dochodu (zwrot z PIT już dziś), a przy wypłacie po 65. roku płacisz zryczałtowany ' +
          'podatek 10%. IKE ma wyższy limit wpłat, IKZE daje korzyść podatkową od razu. Wiele osób korzysta z obu ' +
          'kont jednocześnie.',
      },
      {
        q: 'Ile można wpłacić na IKE i IKZE w 2026 roku?',
        a:
          'Limit wpłat na 2026 rok wynosi 28 260 zł dla IKE oraz 11 304 zł dla IKZE. Osoby prowadzące działalność ' +
          'gospodarczą mają wyższy limit IKZE. Limity są ustalane co roku na podstawie prognozowanego przeciętnego ' +
          'wynagrodzenia, dlatego warto sprawdzać aktualne wartości.',
      },
      {
        q: 'Czy w IKE/IKZE można kupować ETF-y?',
        a:
          'Tak, jeśli wybierzesz konto maklerskie IKE/IKZE (na przykład w XTB, mBanku czy DM BOŚ). Na rachunku ' +
          'maklerskim kupujesz akcje i ETF tak jak na zwykłym koncie, z tą różnicą, że zyski są objęte ulgą ' +
          'podatkową konta emerytalnego. To najpopularniejszy sposób długoterminowego inwestowania z ulgą.',
      },
      {
        q: 'Czy mogę mieć IKE i IKZE jednocześnie?',
        a:
          'Tak. To dwa osobne konta i możesz prowadzić oba naraz, korzystając z ulg podatkowych każdego z nich. ' +
          'Możesz mieć IKE u jednego dostawcy, a IKZE u innego. Jedyne ograniczenie to roczne limity wpłat ' +
          'ustalane ustawowo dla każdego konta osobno.',
      },
    ],
    segments: [
      { label: 'Najlepsze ogólnie', slug: 'xtb-ike-ikze', reason: 'Brak prowizji od ETF do limitu obrotu i prosta platforma - najtańszy zestaw dla pasywnego inwestora.' },
      { label: 'Dla klientów banku', slug: 'mbank-ike-ikze', reason: 'Konto emerytalne w tej samej aplikacji co konto, oszczędności i lokaty.' },
      { label: 'Najszersza oferta', slug: 'bos-bossa-ike-ikze', reason: 'Najszerszy dostęp do rynków zagranicznych i rozbudowane narzędzia.' },
      { label: 'Dla ostrożnych', slug: 'ike-ikze-obligacje', reason: 'Ulga podatkowa na bezpiecznych obligacjach skarbowych, bez ryzyka akcji.' },
    ],
    relatedArticles: [
      { label: 'IKE vs IKZE 2026 - co wybrać, limity i podatki', href: '/inwestycje/ike-vs-ikze-2026-co-wybrac-limity-podatki' },
      { label: 'ETF - czym jest i jak zacząć inwestować', href: '/inwestycje/etf-czym-jest-jak-zaczac-inwestowac' },
      { label: 'Inwestowanie pasywne - portfele ETF dla każdego', href: '/inwestycje/inwestowanie-pasywne-portfele-etf-dla-kazdego' },
      { label: 'Obligacje skarbowe 2026 - które wybrać i jak kupić', href: '/pieniadze/obligacje-skarbowe-2026-ktore-wybrac-i-jak-kupic' },
    ],
    changelog: [
      { date: '2026-06-08', note: 'Pierwsza publikacja rankingu. Limity IKE/IKZE i warunki dostawców zgodne ze stanem na 2026 rok.' },
    ],
    affiliateNote: AFFILIATE_DISCLOSURE,
    published: false, // ⚠️ ustaw true po weryfikacji limitów/prowizji i podstawieniu linków afiliacyjnych
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // RANKING KONT FIRMOWYCH (para z kontami osobistymi — te same banki, ten system)
  // ⚠️ Opłaty, premie i warunki dla firm zmieniają się często i zależą od formy
  //    działalności (JDG/spółka/VAT). Wartości reprezentatywne dla 2026 — zweryfikuj
  //    aktualne tabele opłat i regulaminy promocji przed publikacją.
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'konta-firmowe',
    category: 'pieniadze',
    kicker: 'Ranking {DATE}',
    title: 'Ranking kont firmowych {DATE} - które konto dla firmy?',
    lead:
      'Porównanie kont firmowych dla jednoosobowej działalności i spółek: opłaty, darmowe ' +
      'przelewy do ZUS i US, księgowość online, terminale i premie za założenie.',
    metaTitle: 'Ranking kont firmowych {DATE}: najlepsze konto dla firmy | KisielFinanse',
    metaDesc:
      'Które konto firmowe wybrać w 2026? Porównujemy 8 kont dla działalności - mBank, ING, Nest, ' +
      'Alior, PKO i inne. Opłaty, darmowe przelewy ZUS/US, KSeF, księgowość online i premie do 5000 zł.',
    keywords: [
      'ranking kont firmowych 2026',
      'najlepsze konto firmowe',
      'konto firmowe dla jdg',
      'darmowe konto firmowe',
      'konto dla działalności gospodarczej',
      'premia za konto firmowe',
      'konto firmowe z księgowością',
      'konto firmowe przelewy zus us',
    ],
    cover: '/images/blog/covers/coins-gold.jpg',
    updated: '2026-06-10',
    summary: [
      'Najlepsze konto firmowe dla większości jednoosobowych działalności to mBank mKonto Biznes - zero opłat na zawsze, dobra aplikacja, darmowe przelewy do ZUS i US oraz integracja z KSeF.',
      'Dla firmy liczą się inne rzeczy niż dla konta osobistego: darmowe przelewy do urzędów, księgowość online, faktury, terminal płatniczy i integracje, nie tylko sama opłata za konto.',
      'Premie za otwarcie konta firmowego bywają wysokie (często 1000-2000 zł), ale zawsze wiążą się z warunkami: określony obrót, liczba transakcji lub utrzymanie aktywności przez kilka miesięcy.',
      'Konto firmowe i prywatne trzymaj osobno. Przy działalności (zwłaszcza VAT i split payment) osobne konto firmowe jest w praktyce niezbędne.',
    ],
    intro: [
      'Konto firmowe to nie to samo co osobiste z inną nazwą. Dla działalności liczy się przede ' +
        'wszystkim to, czego konto prywatne nie musi mieć: darmowe przelewy do ZUS i urzędu skarbowego, ' +
        'mechanizm podzielonej płatności (split payment), rachunek VAT, integracja z księgowością online, ' +
        'wystawianie faktur, terminal płatniczy i bramka płatnicza. To te elementy decydują, czy konto ' +
        'realnie ułatwia prowadzenie firmy, czy tylko trzyma pieniądze.',
      'W 2026 doszedł nowy temat: obowiązkowy KSeF, czyli Krajowy System e-Faktur. Od tego roku faktury ' +
        'wystawiasz i odbierasz przez rządowy system, a banki zaczęły wpinać KSeF wprost w bankowość dla firm. ' +
        'Część promocji (jak u ING) wręcz wymaga podpięcia konta do KSeF, żeby zgarnąć premię. Przy wyborze konta ' +
        'warto więc patrzeć, czy bank ma już integrację z e-fakturami, bo to oszczędza skakania między aplikacjami.',
      'Poniżej zestawiam osiem kont firmowych, które warto rozważyć w 2026 roku, głównie pod kątem ' +
        'jednoosobowej działalności. Patrzę na realny koszt (konto, karta, przelewy), darmowość przelewów ' +
        'do urzędów, narzędzia dla firm oraz premie za założenie. Premie potrafią sięgać kilku tysięcy złotych, ' +
        'ale to zwykle cashback rozłożony na 12-24 miesiące z warunkami obrotu, nie gotówka na start - dlatego ' +
        'traktuję je jako dodatek, a nie główne kryterium. Konto firmowe zostaje z tobą na lata.',
    ],
    fields: [
      { id: 'oplata', label: 'Opłata za konto', short: 'Konto' },
      { id: 'karta', label: 'Opłata za kartę', short: 'Karta' },
      { id: 'zus', label: 'Przelewy ZUS/US', short: 'ZUS/US' },
      { id: 'ksiegowosc', label: 'Księgowość / narzędzia', short: 'Narzędzia' },
      { id: 'premia', label: 'Premia za otwarcie', short: 'Premia' },
    ],
    ratingWeights: [
      { label: 'Opłaty', weight: 0.35 },
      { label: 'Przelewy', weight: 0.25 },
      { label: 'Narzędzia', weight: 0.25 },
      { label: 'Dodatki', weight: 0.15 },
    ],
    pickerCriteria: [
      { key: 'Opłaty', label: 'Najniższe opłaty' },
      { key: 'Przelewy', label: 'Darmowe przelewy ZUS/US' },
      { key: 'Narzędzia', label: 'Księgowość i narzędzia' },
      { key: 'Dodatki', label: 'Premie i dodatki' },
      { key: '__overall', label: 'Najlepsze ogólnie' },
    ],
    picks: [
      {
        rank: 1,
        name: 'mBank mKonto Biznes',
        provider: 'mBank',
        slug: 'mbank-mkonto-biznes',
        score: 4.5,
        badge: 'Najlepsze ogólnie',
        bestFor: 'Dla większości firm',
        highlight:
          'Najlepszy balans: zero opłat przy aktywności, świetna aplikacja, darmowe przelewy do ZUS i US oraz księgowość online.',
        pros: [
          'Konto i karta za 0 zł przy aktywnym korzystaniu',
          'Darmowe przelewy do ZUS i urzędu skarbowego',
          'Bardzo dobra aplikacja i bankowość, ta sama co prywatna',
          'mKsięgowość, faktury i integracje dla firm',
        ],
        cons: [
          'Część dodatków i pakietów księgowych jest płatna',
          'Opłaty wracają, jeśli nie spełnisz warunków aktywności',
        ],
        specs: {
          oplata: '0 zł na zawsze',
          karta: '0 zł',
          zus: 'Darmowe, bez limitu',
          ksiegowosc: 'mKsięgowość + KSeF + integracje',
          premia: 'do ~1200 zł*',
        },
        scores: [
          { label: 'Opłaty', value: 4.6 },
          { label: 'Przelewy', value: 4.5 },
          { label: 'Narzędzia', value: 4.5 },
          { label: 'Dodatki', value: 4.3 },
        ],
        providerId: 'mbank',
        ctaLabel: 'Załóż konto firmowe',
        body: [
          'mBank to dla wielu przedsiębiorców naturalny wybór: konto firmowe działa w tej samej, bardzo ' +
            'dobrze ocenianej aplikacji co konto prywatne, jest darmowe przy aktywnym korzystaniu, a przelewy ' +
            'do ZUS i urzędu skarbowego nie kosztują. Do tego dochodzą narzędzia dla firm: mKsięgowość, ' +
            'wystawianie faktur i integracje, które realnie skracają papierologię.',
          'Trzeba pamiętać, że "0 zł" zależy od spełnienia warunków aktywności, a część rozbudowanych pakietów ' +
            'księgowych jest płatna. Dla zdecydowanej większości jednoosobowych działalności to jednak ' +
            'najbezpieczniejszy, uniwersalny wybór jako główne konto firmowe.',
        ],
        review: {
          intro: [
            'mBank mKonto Biznes to jedno z najpopularniejszych kont firmowych w Polsce i dla większości ' +
              'jednoosobowych działalności bezpieczny wybór na start. Łączy darmowe prowadzenie przy aktywności, ' +
              'świetną aplikację i darmowe przelewy do urzędów. Poniżej rozkładam ofertę na czynniki pierwsze.',
          ],
          sections: [
            {
              title: 'Opłaty i przelewy do urzędów',
              body: [
                'Konto i karta są darmowe po spełnieniu prostych warunków aktywności, a przelewy do ZUS i ' +
                  'urzędu skarbowego nie kosztują. Dla firmy, która co miesiąc opłaca składki i podatki, to ' +
                  'realna oszczędność i wygoda. Brak aktywności w danym miesiącu może oznaczać naliczenie opłat, ' +
                  'dlatego warto znać aktualne progi.',
                'Konto obsługuje rachunek VAT i mechanizm podzielonej płatności, czyli wszystko, czego ' +
                  'potrzebuje czynny podatnik VAT.',
              ],
            },
            {
              title: 'Narzędzia dla firmy',
              body: [
                'W ramach konta dostępne są mKsięgowość, wystawianie faktur oraz integracje, dzięki którym ' +
                  'część obowiązków księgowych ogarniesz z poziomu bankowości. Dla mikrofirmy bez biura ' +
                  'rachunkowego to duże ułatwienie, choć rozbudowane pakiety bywają płatne.',
                'Aplikacja jest ta sama co dla klientów indywidualnych, więc jeśli masz już konto prywatne w ' +
                  'mBanku, firmowe obsłużysz bez nauki nowego interfejsu.',
              ],
            },
          ],
          faq: [
            {
              q: 'Ile kosztuje mBank mKonto Biznes?',
              a: 'Prowadzenie konta i karta wynoszą 0 zł po spełnieniu miesięcznych warunków aktywności. ' +
                'Przelewy do ZUS i urzędu skarbowego są darmowe. Część rozbudowanych pakietów księgowych jest ' +
                'dodatkowo płatna. Sprawdź aktualną tabelę opłat przed założeniem.',
            },
            {
              q: 'Czy mKonto Biznes obsługuje VAT i split payment?',
              a: 'Tak. Konto obsługuje rachunek VAT oraz mechanizm podzielonej płatności (split payment), więc ' +
                'nadaje się dla czynnych podatników VAT.',
            },
          ],
        },
      },
      {
        rank: 2,
        name: 'ING Konto z Lwem dla Firmy',
        provider: 'ING Bank Śląski',
        slug: 'ing-konto-z-lwem-firmowe',
        score: 4.4,
        badge: 'Najlepsze narzędzia',
        bestFor: 'Dla wygody i księgowości',
        highlight:
          'Najprostsza obsługa i najlepsze narzędzia: ING Księgowość, faktury i bramka płatnicza imoje.',
        pros: [
          'Najprostsza w obsłudze bankowość dla firm',
          'ING Księgowość i wystawianie faktur w pakiecie',
          'Bramka płatnicza imoje dla e-commerce',
          'Darmowe przelewy do ZUS i US przy aktywności',
        ],
        cons: [
          'Część zaawansowanych funkcji księgowych płatna',
          'Warunki darmowości trzeba pilnować co miesiąc',
        ],
        specs: {
          oplata: '0 zł przez 24 mies.',
          karta: '0 zł (z warunkami)',
          zus: 'Darmowe',
          ksiegowosc: 'ING Księgowość + KSeF + imoje',
          premia: 'do ~4200 zł*',
        },
        scores: [
          { label: 'Opłaty', value: 4.4 },
          { label: 'Przelewy', value: 4.4 },
          { label: 'Narzędzia', value: 4.7 },
          { label: 'Dodatki', value: 4.2 },
        ],
        providerId: 'ing',
        ctaLabel: 'Załóż konto firmowe',
        body: [
          'ING wygrywa wygodą i narzędziami. Bankowość dla firm jest tak samo prosta jak prywatna, a do tego ' +
            'dochodzą ING Księgowość, wystawianie faktur i bramka płatnicza imoje, która przyda się każdemu, ' +
            'kto sprzedaje online. ING ma też wpiętą integrację z KSeF, więc e-faktury ogarniasz z poziomu ' +
            'aplikacji Moje ING. Konto jest darmowe przez 24 miesiące, a przelewy do ZUS i US nie kosztują.',
          'Bank prowadzi mocną promocję: premia sięga 4200 zł, ale rozłożona na 12 miesięcy (cashback od ' +
            'przelewów do ZUS i od płatności kartą), z warunkiem podpięcia KSeF i utrzymania salda. Liczy się więc ' +
            'aktywne korzystanie, a nie jednorazowy bonus. Dla jednoosobowej działalności na uproszczonej ' +
            'księgowości, która chce ograniczyć papierologię, to dziś jedna z najmocniejszych ofert na rynku.',
        ],
        review: {
          intro: [
            'ING ma dziś jedną z najmocniejszych ofert dla firm, ale nazwa premii potrafi mylić. Te 4200 zł to ' +
              'nie gotówka na start, tylko cashback rozłożony na cały rok, w dwóch strumieniach. Poniżej tłumaczę, ' +
              'z czego składa się premia, jakie warunki trzeba spełniać co miesiąc i dla kogo oferta jest dostępna.',
          ],
          sections: [
            {
              title: 'Z czego składa się premia 4200 zł',
              body: [
                'Premia ma dwie części, obie wypłacane przez 12 miesięcy. Pierwsza to 100 zł miesięcznie za ' +
                  'przelew do ZUS lub KRUS (minimum 300 zł), co daje do 1200 zł rocznie. Druga to 10% zwrotu od ' +
                  'płatności kartą, maksymalnie 250 zł miesięcznie, czyli do 3000 zł rocznie.',
                'Żeby zgarnąć pełne 3000 zł zwrotu z karty, musisz wydawać kartą około 2500 zł miesięcznie. ' +
                  'Realny zwrot zależy więc od Twojego obrotu - przy mniejszych wydatkach premia będzie ' +
                  'odpowiednio niższa.',
              ],
            },
            {
              title: 'Warunki, które trzeba spełniać co miesiąc',
              body: [
                'W każdym z 12 miesięcy trzeba: podpiąć konto do KSeF w aplikacji Moje ING, utrzymać saldo ' +
                  'minimum 4000 zł na koniec przynajmniej jednego dnia miesiąca oraz wykonać przelew do ZUS i ' +
                  'płatności kartą, od których liczy się zwrot.',
                'Konto jest przy tym darmowe przez 24 miesiące, a przelewy krajowe i do urzędów nie kosztują. ' +
                  'Podpięcie KSeF jest tu warunkiem promocji, a nie tylko dodatkiem, więc to oferta dla kogoś, kto ' +
                  'i tak chce ogarnąć e-faktury przez bank.',
              ],
            },
            {
              title: 'Dla kogo jest ta oferta',
              body: [
                'Promocja jest wyłącznie dla jednoosobowych działalności rozliczających się w formie uproszczonej ' +
                  '(KPiR, ryczałt, karta podatkowa), które na 31 marca 2026 nie miały konta w ING na dany NIP. ' +
                  'Oferta obowiązuje do 30 czerwca 2026.',
                'Premia to przychód z działalności i podlega opodatkowaniu. Jeśli prowadzisz pełną księgowość ' +
                  'albo spółkę, ta konkretna promocja Cię nie obejmie, choć samo konto firmowe ING dalej jest ' +
                  'dobrym wyborem pod kątem narzędzi.',
              ],
            },
          ],
          faq: [
            {
              q: 'Czy dostanę całe 4200 zł?',
              a: 'Tylko jeśli przez 12 miesięcy spełnisz wszystkie warunki i będziesz wydawać kartą około 2500 zł ' +
                'miesięcznie (to daje pełny zwrot 250 zł). Część za przelewy do ZUS (do 1200 zł) jest łatwiejsza. ' +
                'Przy mniejszych wydatkach kartą realna premia będzie niższa niż 4200 zł.',
            },
            {
              q: 'Po co podpinać konto do KSeF?',
              a: 'Bo to warunek promocji. Przy okazji od 2026 KSeF jest obowiązkowy, więc integracja w aplikacji ' +
                'Moje ING pozwala obsługiwać e-faktury z poziomu banku, bez osobnego programu.',
            },
            {
              q: 'Kto może skorzystać?',
              a: 'Jednoosobowe działalności na uproszczonej księgowości (KPiR, ryczałt, karta podatkowa), które na ' +
                '31 marca 2026 nie miały konta w ING na ten NIP. Promocja trwa do 30 czerwca 2026.',
            },
          ],
        },
      },
      {
        rank: 3,
        name: 'Nest Bank Konto Biznes',
        provider: 'Nest Bank',
        slug: 'nest-konto-biznes',
        score: 4.35,
        badge: 'Najtańsze dla JDG',
        bestFor: 'Dla jednoosobowej działalności',
        highlight:
          'Konto mocno nastawione na małe firmy: niskie opłaty, darmowe przelewy do urzędów i częste premie.',
        pros: [
          'Bardzo niskie opłaty, dobre dla jednoosobowych działalności',
          'Darmowe przelewy do ZUS i US',
          'Często atrakcyjne premie powitalne dla firm',
          'Proste założenie online',
        ],
        cons: [
          'Mniejsza sieć oddziałów i bankomatów',
          'Mniej rozbudowane narzędzia niż u największych banków',
        ],
        specs: {
          oplata: '0 zł',
          karta: '0 zł (z warunkami)',
          zus: 'Darmowe',
          ksiegowosc: 'Faktury + księgowość',
          premia: 'do ~3000 zł*',
        },
        scores: [
          { label: 'Opłaty', value: 4.7 },
          { label: 'Przelewy', value: 4.3 },
          { label: 'Narzędzia', value: 4.0 },
          { label: 'Dodatki', value: 4.2 },
        ],
        providerId: 'nest',
        ctaLabel: 'Załóż konto firmowe',
        body: [
          'Nest Bank konsekwentnie celuje w mikrofirmy i jednoosobowe działalności. Konto firmowe jest tanie w ' +
            'prowadzeniu, przelewy do ZUS i US są darmowe, a bank regularnie kusi przedsiębiorców premiami ' +
            'powitalnymi. Dla kogoś, kto chce niskich kosztów bez kombinowania, to mocna propozycja.',
          'W zamian dostajesz mniejszą sieć placówek i bankomatów oraz mniej rozbudowane narzędzia niż u ' +
            'gigantów. Dla typowej jednoosobowej działalności rzadko jest to problem, ale większa firma z ' +
            'obrotem gotówkowym powinna sprawdzić dostępność wpłatomatów w okolicy.',
        ],
        review: {
          intro: [
            'Nest Bank to jedno z najtańszych kont firmowych dla jednoosobowej działalności. Jego mocna strona ' +
              'to nie wysokość premii, tylko niskie, proste koszty i częsty moneyback. Poniżej tłumaczę, na czym ' +
              'polega oferta i komu się najbardziej opłaca.',
          ],
          sections: [
            {
              title: 'Jak działa premia i moneyback',
              body: [
                'Nest zwykle nagradza nie jednorazową premią, tylko zwrotem za płatności (moneyback): procent od ' +
                  'transakcji kartą i BLIK przez wiele miesięcy, z miesięcznym limitem. Im więcej płacisz kartą ' +
                  'firmową, tym większy zwrot, do określonego maksimum.',
                'To oznacza, że reklamowana kwota to górna granica przy aktywnym używaniu karty, a nie gotówka na ' +
                  'start. Dla firmy, która i tak płaci kartą za bieżące wydatki, zwrot zbiera się sam. Dokładne ' +
                  'stawki i limity sprawdź w aktualnym regulaminie promocji.',
              ],
            },
            {
              title: 'Opłaty i dla kogo',
              body: [
                'Konto jest tanie w prowadzeniu, a przelewy do ZUS i urzędu skarbowego są darmowe. To wybór pod ' +
                  'jednoosobową działalność i mikrofirmę, która ceni niskie koszty i prostotę, a nie potrzebuje ' +
                  'rozbudowanych narzędzi ani gęstej sieci oddziałów.',
                'Jeśli obracasz dużą ilością gotówki, sprawdź wcześniej dostępność wpłatomatów w okolicy, bo sieć ' +
                  'Nest jest mniejsza niż u największych banków.',
              ],
            },
          ],
          faq: [
            {
              q: 'Dlaczego premia w Nest jest niższa niż u konkurencji?',
              a: 'Bo Nest stawia na niskie, proste koszty i moneyback zamiast efektownych promocji z wieloma ' +
                'warunkami. Dla małej firmy realna oszczędność na opłatach przez lata bywa cenniejsza niż ' +
                'jednorazowa wysoka premia obwarowana wymogami obrotu.',
            },
            {
              q: 'Dla kogo jest konto Nest Biznes?',
              a: 'Dla jednoosobowej działalności i mikrofirmy, która chce niskich kosztów, darmowych przelewów do ' +
                'urzędów i prostej obsługi online, bez potrzeby gęstej sieci oddziałów.',
            },
          ],
        },
      },
      {
        rank: 4,
        name: 'Erste Konto Firmowe',
        provider: 'Erste Bank Polska (dawniej Santander)',
        slug: 'erste-konto-firmowe',
        score: 4.27,
        badge: 'Najlepsze premie',
        bestFor: 'Dla łowców premii',
        highlight:
          'Regularnie jedne z najwyższych premii za założenie konta firmowego, w dużym banku z szeroką siecią.',
        pros: [
          'Często najwyższe na rynku premie powitalne dla firm',
          'Darmowe przelewy do ZUS i US przy spełnieniu warunków',
          'Duża sieć oddziałów dla kontaktu osobistego',
          'Solidna oferta dla firm rosnących',
        ],
        cons: [
          'Premie wymagają określonego obrotu i aktywności',
          'Marka w trakcie rebrandingu (dawniej Santander)',
        ],
        specs: {
          oplata: '0 zł na zawsze',
          karta: '0 zł',
          zus: 'Darmowe',
          ksiegowosc: 'Mini Firma',
          premia: 'do ~4500 zł*',
        },
        scores: [
          { label: 'Opłaty', value: 4.3 },
          { label: 'Przelewy', value: 4.2 },
          { label: 'Narzędzia', value: 4.0 },
          { label: 'Dodatki', value: 4.8 },
        ],
        providerId: 'erste',
        ctaLabel: 'Sprawdź ofertę',
        body: [
          'To dawny Santander Bank Polska, przechodzący pod markę Erste. Bank od lat walczy o przedsiębiorców ' +
            'wysokimi premiami powitalnymi za konto firmowe, a samo konto jest darmowe na standardowych ' +
            'warunkach aktywności. Duża sieć oddziałów to plus dla firm, które cenią kontakt osobisty.',
          'Premie zawsze wiążą się z warunkami: określony obrót, liczba transakcji lub utrzymanie aktywności ' +
            'przez kilka miesięcy. Przy zmianie właściciela warto śledzić aktualne tabele opłat i regulaminy ' +
            'promocji, bo oferta może się zmieniać w trakcie przejścia na nową markę.',
        ],
        review: {
          intro: [
            'Erste (dawniej Santander) prowadzi jedną z najwyższych promocji firmowych na rynku: do 4500 zł. ' +
              'To jednak nie jeden przelew na start, tylko trzy transze po 1500 zł, po jednej za każdy z trzech ' +
              'miesięcy, w których spełnisz komplet warunków. Poniżej rozkładam, jak realnie zgarnąć całą kwotę ' +
              'i dla kogo to konto się opłaca.',
          ],
          sections: [
            {
              title: 'Jak zdobyć premię krok po kroku',
              body: [
                'Po pierwsze, otwórz Konto Firmowe Online z bankowością Mini Firma w okresie promocji (oferta ' +
                  'obowiązuje od 1 maja do 30 września 2026). Samo założenie konta to za mało.',
                'Po drugie, w ciągu 10 dni od złożenia wniosku zarejestruj się do promocji na stronie banku. ' +
                  'Trzeba znaleźć sekcję promocji i wypełnić formularz (imię, nazwisko, e-mail, NIP) oraz ' +
                  'zaakceptować regulamin. Bez tej rejestracji premia nie zostanie naliczona, nawet jeśli ' +
                  'spełnisz wszystkie warunki transakcyjne.',
              ],
            },
            {
              title: 'Warunki w każdym z trzech miesięcy',
              body: [
                'Premię dostajesz w trzech transzach po 1500 zł. Żeby zgarnąć transzę za dany miesiąc, musisz ' +
                  'w tym miesiącu spełnić trzy rzeczy naraz: wykonać przelew do ZUS na minimum 100 zł z tego ' +
                  'konta, zrobić co najmniej 5 płatności kartą lub BLIK (każda na minimum 50 zł) oraz zapewnić ' +
                  'wpływ na konto co najmniej 5000 zł.',
                'Dobra wiadomość: wpływ 5000 zł może pochodzić z Twojego własnego konta w innym banku, więc ' +
                  'nie musisz mieć aż takich obrotów z firmy. Powtórz to przez trzy miesiące i masz pełne 4500 zł. ' +
                  'Opuścisz warunek w którymś miesiącu - tracisz tylko transzę za ten miesiąc.',
              ],
            },
            {
              title: 'Dla kogo i ile kosztuje konto',
              body: [
                'Promocja jest dla nowych klientów firmowych, czyli osób, które nie miały konta firmowego w ' +
                  'Erste przez ostatnie 12 miesięcy, i wyłącznie dla jednoosobowej działalności (bez spółki ' +
                  'cywilnej). Samo konto jest darmowe na zawsze, niezależnie od promocji.',
                'Pamiętaj, że premia to przychód z działalności i podlega opodatkowaniu według Twojej formy ' +
                  'rozliczenia. Warunki i daty potrafią się zmieniać, więc przed założeniem sprawdź aktualny ' +
                  'regulamin promocji na stronie banku.',
              ],
            },
          ],
          faq: [
            {
              q: 'Ile realnie dostanę z promocji Erste?',
              a: 'Do 4500 zł, ale tylko jeśli przez trzy miesiące z rzędu spełnisz komplet warunków: przelew do ' +
                'ZUS (min. 100 zł), 5 płatności kartą lub BLIK (po min. 50 zł) i wpływ 5000 zł. Każdy spełniony ' +
                'miesiąc to 1500 zł. Pominiesz miesiąc - przepada tylko transza za ten miesiąc.',
            },
            {
              q: 'Czy wpływ 5000 zł musi pochodzić z firmy?',
              a: 'Nie. Według warunków promocji wpływ może pochodzić także z Twojego własnego konta w innym ' +
                'banku, więc nie musisz mieć wysokich obrotów firmowych, żeby spełnić ten warunek.',
            },
            {
              q: 'Kto może skorzystać z promocji?',
              a: 'Nowi klienci firmowi (bez konta firmowego w Erste przez ostatnie 12 miesięcy), prowadzący ' +
                'jednoosobową działalność gospodarczą bez spółki cywilnej. Konto trzeba otworzyć w okresie ' +
                'promocji i zarejestrować się do niej w ciągu 10 dni.',
            },
          ],
        },
      },
      {
        rank: 5,
        name: 'Alior iKonto Biznes',
        provider: 'Alior Bank',
        slug: 'alior-ikonto-biznes',
        score: 4.17,
        bestFor: 'Dla elastyczności',
        highlight:
          'Elastyczne konto firmowe z dobrą aplikacją i rozbudowaną ofertą kredytową dla rosnących firm.',
        pros: [
          'Konto i karta za 0 zł przy aktywnym korzystaniu',
          'Dobra aplikacja Alior Mobile',
          'Rozbudowana oferta kredytowa dla firm',
          'Darmowe przelewy do ZUS i US (z limitem)',
        ],
        cons: [
          'Warunki darmowości bywają bardziej złożone',
          'Część dodatkowych usług płatna',
        ],
        specs: {
          oplata: '0 zł (z warunkami)',
          karta: '0 zł (z warunkami)',
          zus: 'Darmowe (limit)',
          ksiegowosc: 'Dobre integracje',
          premia: 'do ~4400 zł*',
        },
        scores: [
          { label: 'Opłaty', value: 4.2 },
          { label: 'Przelewy', value: 4.1 },
          { label: 'Narzędzia', value: 4.2 },
          { label: 'Dodatki', value: 4.2 },
        ],
        providerId: 'alior',
        ctaLabel: 'Sprawdź ofertę',
        body: [
          'Alior to wybór dla firm, które cenią elastyczność i mogą potrzebować finansowania. iKonto Biznes ' +
            'jest darmowe przy aktywnym korzystaniu, ma dobrą aplikację i porządne integracje, a bank ma ' +
            'rozbudowaną ofertę kredytową dla rosnących działalności.',
          'Trzeba uważać na warunki: zwolnienie z opłat i limity darmowych przelewów bywają bardziej złożone ' +
            'niż w prostych darmowych kontach. Dla kogoś, kto lubi dopasować ofertę pod siebie, to plus; dla ' +
            'kogoś, kto chce maksymalnej prostoty, raczej minus.',
        ],
        review: {
          intro: [
            'Alior iKonto Biznes to elastyczne konto dla firm, które mogą potrzebować finansowania. Reklamowana ' +
              'premia bywa wysoka, ale jak u konkurencji składa się z kilku warunkowych elementów. Poniżej, na co ' +
              'realnie zwrócić uwagę.',
          ],
          sections: [
            {
              title: 'Premia i warunki',
              body: [
                'Wysoka premia w Alior to zwykle suma bonusów: za otwarcie i aktywność oraz za skorzystanie z ' +
                  'dodatkowych produktów (karta, finansowanie). Jak zawsze przy takich kwotach, pełną premię ' +
                  'zgarnia firma, która faktycznie korzysta z całej oferty, a nie tylko zakłada konto.',
                'Zwolnienie z opłat za konto i kartę działa przy aktywnym korzystaniu, a darmowe przelewy do ' +
                  'urzędów bywają objęte limitem. Warunki są bardziej złożone niż w prostych darmowych kontach, ' +
                  'dlatego przed założeniem warto przejść regulamin promocji punkt po punkcie.',
              ],
            },
            {
              title: 'Dla kogo to konto',
              body: [
                'Alior najlepiej sprawdzi się u przedsiębiorcy, który ceni elastyczność i może potrzebować kredytu ' +
                  'lub innego finansowania - bank ma tu rozbudowaną ofertę. Aplikacja Alior Mobile jest dobra, a ' +
                  'integracje dla firm porządne.',
                'Jeśli zależy Ci na maksymalnej prostocie i przewidywalnych zerowych kosztach bez pilnowania ' +
                  'warunków, prostsze będą konta mBanku, Nest czy Erste. Aktualne stawki sprawdź u banku.',
              ],
            },
          ],
          faq: [
            {
              q: 'Czy konto Alior jest darmowe?',
              a: 'Konto i karta są bez opłat przy aktywnym korzystaniu, ale warunki zwolnienia i limity darmowych ' +
                'przelewów bywają bardziej złożone niż w prostych darmowych kontach. Sprawdź aktualną tabelę opłat.',
            },
            {
              q: 'Dla kogo jest iKonto Biznes?',
              a: 'Dla firm, które cenią elastyczność i mogą potrzebować finansowania (kredyt, linia, leasing). ' +
                'Alior ma tu szeroką ofertę. Dla maksymalnej prostoty lepsze będą prostsze darmowe konta.',
            },
          ],
        },
      },
      {
        rank: 6,
        name: 'PKO Konto Firmowe',
        provider: 'PKO Bank Polski',
        slug: 'pko-konto-firmowe',
        score: 3.96,
        bestFor: 'Dla sieci i terminali',
        highlight:
          'Największy bank w Polsce - maksymalna dostępność oddziałów, bankomatów i terminali płatniczych.',
        pros: [
          'Najgęstsza sieć oddziałów i bankomatów w kraju',
          'Szeroka oferta dla firm i terminale płatnicze',
          'Stabilny, największy bank - poczucie bezpieczeństwa',
          'Darmowe przelewy do ZUS i US przy spełnieniu warunków',
        ],
        cons: [
          'Opłaty potrafią wrócić przy małej aktywności',
          'Interfejs miejscami mniej nowoczesny niż u czołówki',
        ],
        specs: {
          oplata: '0 zł (z warunkami)',
          karta: '0 zł przy aktywności',
          zus: 'Darmowe (z warunkami)',
          ksiegowosc: 'Szeroka oferta + terminale',
          premia: 'do ~4200 zł*',
        },
        scores: [
          { label: 'Opłaty', value: 3.9 },
          { label: 'Przelewy', value: 4.0 },
          { label: 'Narzędzia', value: 4.1 },
          { label: 'Dodatki', value: 3.8 },
        ],
        providerId: 'pko',
        ctaLabel: 'Sprawdź ofertę',
        body: [
          'PKO BP to największy bank w Polsce i jego główną przewagą jest dostępność: oddziały, bankomaty i ' +
            'terminale płatnicze niemal wszędzie. Dla firmy, która przyjmuje płatności kartą lub obraca ' +
            'gotówką, szeroka sieć i oferta terminali to realna wartość. Konto jest darmowe przy spełnieniu ' +
            'warunków aktywności.',
          'Na minus - opłaty potrafią wrócić przy małej liczbie transakcji, a interfejs bywa mniej lekki niż u ' +
            'czołówki bankowości mobilnej. To konto dla firm, które cenią stabilność i fizyczną obecność banku ' +
            'bardziej niż najnowocześniejszy UX.',
        ],
        review: {
          intro: [
            'PKO BP to największy bank w Polsce, a jego przewagą jest dostępność: oddziały, bankomaty i terminale ' +
              'niemal wszędzie. Premia bywa wysoka, ale jak u innych dużych banków wiąże się z utrzymaniem ' +
              'aktywności. Poniżej, na co zwrócić uwagę.',
          ],
          sections: [
            {
              title: 'Premia i warunki aktywności',
              body: [
                'Reklamowana premia (rzędu kilku tysięcy złotych) to zwykle bonus rozłożony w czasie, zależny od ' +
                  'aktywności na koncie - na przykład utrzymania określonej liczby przelewów w miesiącu (często ' +
                  'około dziesięciu) oraz korzystania z karty. To nie jednorazowa wypłata na start.',
                'Konto i karta są bez opłat przy spełnieniu warunków aktywności, a przelewy do ZUS i US darmowe. ' +
                  'Przy małej liczbie transakcji opłaty potrafią jednak wrócić, dlatego sprawdź aktualny regulamin ' +
                  'promocji i tabelę opłat.',
              ],
            },
            {
              title: 'Dla kogo to konto',
              body: [
                'PKO najlepiej sprawdzi się u firmy, która ceni fizyczną obecność banku: chce mieć oddział pod ' +
                  'ręką, korzysta z wpłatomatów albo przyjmuje płatności kartą i potrzebuje terminala. Pod tym ' +
                  'względem zasięg PKO jest nie do pobicia.',
                'Jeśli zależy Ci głównie na najnowocześniejszej aplikacji i minimalnych kosztach, czołówka ' +
                  'bankowości mobilnej (mBank, ING) bywa wygodniejsza. PKO to wybór pod stabilność i dostępność.',
              ],
            },
          ],
          faq: [
            {
              q: 'Jak utrzymać zerowe opłaty w PKO?',
              a: 'Trzeba spełniać miesięczne warunki aktywności (zwykle określona liczba przelewów i korzystanie z ' +
                'karty). Przy małej liczbie transakcji opłaty mogą wrócić. Dokładne progi sprawdź w aktualnej ' +
                'tabeli opłat banku.',
            },
            {
              q: 'Dla kogo jest PKO Konto Firmowe?',
              a: 'Dla firm, które cenią największą sieć oddziałów, bankomatów i terminali w kraju oraz stabilność ' +
                'największego banku. Dla najnowocześniejszego UX i minimalnych kosztów lepsze bywają mBank czy ING.',
            },
          ],
        },
      },
      {
        rank: 7,
        name: 'Millennium Konto Firmowe',
        provider: 'Bank Millennium',
        slug: 'millennium-konto-firmowe',
        score: 3.95,
        bestFor: 'Dla wygody w aplikacji',
        highlight:
          'Wygodne konto firmowe z nowoczesną aplikacją i częstymi promocjami dla nowych firm.',
        pros: [
          'Konto i karta za 0 zł przy aktywnym korzystaniu',
          'Czytelna, nowoczesna aplikacja',
          'Częste promocje dla nowych firm',
          'Darmowe przelewy do ZUS i US przy spełnieniu warunków',
        ],
        cons: [
          'Warunki darmowości trzeba pilnować co miesiąc',
          'Sieć własnych bankomatów mniejsza niż u gigantów',
        ],
        specs: {
          oplata: '0 zł (z warunkami)',
          karta: '0 zł (z warunkami)',
          zus: 'Darmowe (z warunkami)',
          ksiegowosc: 'Dobre',
          premia: 'do ~5000 zł*',
        },
        scores: [
          { label: 'Opłaty', value: 4.0 },
          { label: 'Przelewy', value: 3.9 },
          { label: 'Narzędzia', value: 3.9 },
          { label: 'Dodatki', value: 4.0 },
        ],
        providerId: 'millennium',
        ctaLabel: 'Sprawdź ofertę',
        body: [
          'Millennium to solidny środek stawki dla firm: darmowe przy aktywnym korzystaniu, z porządną ' +
            'aplikacją i regularnymi promocjami dla nowych działalności. Przelewy do ZUS i US są darmowe przy ' +
            'spełnieniu warunków, a obsługa jest wygodna i nowoczesna.',
          'Jak wszędzie, "0 zł" zależy od aktywności, a sieć bankomatów jest mniejsza niż u największych ' +
            'banków. Dla firmy bez dużego obrotu gotówkowego to wygodny, rozsądny wybór.',
        ],
        review: {
          intro: [
            'Millennium reklamuje premię do 5000 zł, ale tę najwyższą kwotę osiągniesz tylko z dodatkowymi ' +
              'produktami. Sama baza jest niższa, a resztę dokładasz, podpisując umowy na terminal płatniczy i ' +
              'leasing. Poniżej tłumaczę, jak to się składa i dla kogo ma sens.',
          ],
          sections: [
            {
              title: 'Jak zbudować premię do 5000 zł',
              body: [
                'Podstawową premię dostajesz za założenie konta i aktywne korzystanie (przelewy, płatności ' +
                  'kartą). Premię można powiększyć o około 2600 zł, jeśli dodatkowo podpiszesz umowy na terminal ' +
                  'płatniczy i leasing. Stąd reklamowana kwota do 5000 zł.',
                'Jeśli nie przyjmujesz płatności kartą i nie potrzebujesz leasingu, realnie liczy się tylko ' +
                  'część bazowa. Terminal ma sens dla firm, które sprzedają stacjonarnie, więc nie dokładaj go ' +
                  'tylko dla premii, jeśli nie będziesz go używać.',
              ],
            },
            {
              title: 'Opłaty i dla kogo',
              body: [
                'Konto Mój Biznes jest darmowe przez 2 lata na warunkach promocyjnych. Promocja jest dla ' +
                  'jednoosobowych działalności, które nie miały konta firmowego w Millennium od 1 kwietnia 2024.',
                'Aplikacja jest nowoczesna i czytelna, a przelewy do ZUS i US bezpłatne przy spełnieniu warunków. ' +
                  'Kwoty i warunki promocji potrafią się zmieniać, więc sprawdź aktualny regulamin przed założeniem.',
              ],
            },
          ],
          faq: [
            {
              q: 'Czy dostanę 5000 zł za samo konto?',
              a: 'Nie. Sama baza jest niższa. Do pełnej kwoty (około 5000 zł) dokładasz premię za podpisanie umów ' +
                'na terminal płatniczy i leasing. Bez tych produktów liczy się tylko premia podstawowa.',
            },
            {
              q: 'Kto może skorzystać z promocji?',
              a: 'Jednoosobowe działalności, które nie miały konta firmowego w Banku Millennium od 1 kwietnia 2024. ' +
                'Konto jest darmowe przez 2 lata w ramach promocji.',
            },
          ],
        },
      },
      {
        rank: 8,
        name: 'Pekao Konto Przekorzystne Biznes',
        provider: 'Bank Pekao S.A.',
        slug: 'pekao-konto-przekorzystne-biznes',
        score: 3.94,
        bestFor: 'Dla stabilności dużego banku',
        highlight:
          'Konto firmowe w jednym z największych banków - szeroka sieć, terminale i pełna oferta dla firm.',
        pros: [
          'Bardzo duża sieć oddziałów i bankomatów',
          'Pełna oferta dla firm i terminale płatnicze',
          'Stabilny, duży bank - poczucie bezpieczeństwa',
          'Darmowe przelewy do ZUS i US przy spełnieniu warunków',
        ],
        cons: [
          'Opłaty wracają przy małej aktywności',
          'Interfejs miejscami mniej nowoczesny niż u liderów',
        ],
        specs: {
          oplata: '0 zł (z warunkami)',
          karta: '0 zł (z warunkami)',
          zus: 'Darmowe (z warunkami)',
          ksiegowosc: 'Solidne + terminale',
          premia: 'do ~4200 zł*',
        },
        scores: [
          { label: 'Opłaty', value: 3.9 },
          { label: 'Przelewy', value: 4.0 },
          { label: 'Narzędzia', value: 3.9 },
          { label: 'Dodatki', value: 4.0 },
        ],
        providerId: 'pekao',
        ctaLabel: 'Sprawdź ofertę',
        body: [
          'Pekao to jeden z największych banków w Polsce, z pełną ofertą dla firm i gęstą siecią placówek oraz ' +
            'terminali. Dla przedsiębiorcy, który ceni stabilność dużego banku i możliwość załatwienia sprawy w ' +
            'oddziale, Konto Przekorzystne Biznes jest naturalnym wyborem. Konto jest darmowe przy spełnieniu ' +
            'warunków aktywności.',
          'Na minus - opłaty potrafią wrócić przy małej liczbie transakcji, a interfejs bywa mniej lekki niż u ' +
            'liderów bankowości mobilnej. To konto pod stabilność i dostępność, nie pod minimalizację kosztów.',
        ],
        review: {
          intro: [
            'Pekao kusi premią do 4200 zł, ale to suma czterech różnych bonusów, a nie jedna wypłata. Część ' +
              'z nich wymaga produktów, których mała firma może w ogóle nie potrzebować (linia kredytowa, leasing). ' +
              'Poniżej rozkładam, z czego składa się premia i ile realnie jesteś w stanie zgarnąć.',
          ],
          sections: [
            {
              title: 'Z czego składa się premia',
              body: [
                'Na pełne 4200 zł składają się cztery elementy: 200 zł za zdalne otwarcie konta z kartą, do ' +
                  '2000 zł zwrotu za płatności zbliżeniowe telefonem (Google Pay, Apple Pay, Garmin Pay) - po ' +
                  '100 zł miesięcznie przez 10 miesięcy, 600 zł za uruchomienie linii kredytowej na minimum ' +
                  '5000 zł oraz 600 zł za przelew do Pekao Leasing na ratę leasingową.',
                'To oznacza, że bez leasingu i linii kredytowej realnie zostaje Ci około 2200 zł (otwarcie plus ' +
                  'zwroty za płatności telefonem). Pełne 4200 zł zgarnie tylko firma, która i tak korzysta z ' +
                  'leasingu i finansowania.',
              ],
            },
            {
              title: 'Opłaty i dla kogo to konto',
              body: [
                'Konto Biznes z Żubrem jest darmowe przez 2 lata w ramach promocji dla nowych firm. Przelewy do ' +
                  'ZUS i US są bezpłatne. To wybór dla przedsiębiorcy, który ceni dużą sieć oddziałów, terminale ' +
                  'i pełną ofertę dużego banku, a płatności robi głównie telefonem.',
                'Promocja obowiązuje do 30 czerwca 2026. Warunki i kwoty potrafią się zmieniać między edycjami, ' +
                  'więc przed założeniem sprawdź aktualny regulamin na stronie banku.',
              ],
            },
          ],
          faq: [
            {
              q: 'Ile premii dostanę bez leasingu i kredytu?',
              a: 'Około 2200 zł: 200 zł za zdalne otwarcie konta i do 2000 zł zwrotu za płatności telefonem ' +
                '(100 zł miesięcznie przez 10 miesięcy). Pozostałe 2×600 zł wymaga uruchomienia linii kredytowej ' +
                'i przelewu do Pekao Leasing.',
            },
            {
              q: 'Jak działa zwrot za płatności?',
              a: 'Płacisz telefonem (Google Pay, Apple Pay lub Garmin Pay) kartą do konta, a bank zwraca część ' +
                'wydatków - do 100 zł miesięcznie przez 10 miesięcy, łącznie do 2000 zł.',
            },
          ],
        },
      },
    ],
    methodology: [
      'Oceniamy konta firmowe w czterech obszarach: realny koszt (konto, karta, przelewy - waga 35%), ' +
        'darmowość i wygoda przelewów do ZUS oraz urzędu skarbowego (waga 25%), narzędzia dla firm (księgowość ' +
        'online, faktury, terminale, integracje - waga 25%) oraz dodatkowe korzyści i premie (waga 15%). Ocena ' +
        'ogólna to średnia ważona tych kryteriów, a kolejność wynika wprost z wyliczenia, nie z subiektywnego wrażenia.',
      'Patrzymy głównie na potrzeby jednoosobowych działalności i mikrofirm. Konta firmowe różnią się też ' +
        'obsługą rachunku VAT, mechanizmu podzielonej płatności (split payment) oraz integracją z KSeF - dla ' +
        'czynnych podatników VAT to istotne. Premie za założenie traktujemy jako dodatek (waga 15%), bo ' +
        'reklamowane kwoty 4000-5000 zł to niemal zawsze cashback rozłożony na 12-24 miesiące, z warunkami ' +
        'obrotu i aktywności - realna wartość zależy od tego, ile faktycznie wydasz i przelejesz.',
      'Opłaty, premie i warunki dla firm zmieniają się często i zależą od formy działalności. Zawsze sprawdź ' +
        'aktualną tabelę opłat i regulamin promocji bezpośrednio w banku przed założeniem konta. Datę ostatniej ' +
        'aktualizacji zestawienia podajemy na górze strony.',
    ],
    verdict: [
      'Jeśli chcesz jedno konto firmowe, które po prostu działa - wybierz mBank mKonto Biznes. Łączy zerowe ' +
        'opłaty na zawsze, najlepszą w tym zestawieniu aplikację, darmowe przelewy do urzędów i księgowość ' +
        'online z KSeF. To bezpieczny wybór dla większości jednoosobowych działalności.',
      'Zależy ci na narzędziach, sprzedaży online i wysokiej premii? ING dorzuca ING Księgowość, bramkę imoje, ' +
        'integrację KSeF i promocję sięgającą 4200 zł. Liczysz każdą złotówkę przy małej firmie? Nest Bank jest ' +
        'jednym z najtańszych. Jedno zastrzeżenie do premii: te najwyższe kwoty (4000-5000 zł) to prawie zawsze ' +
        'cashback rozłożony na rok lub dwa, z warunkami obrotu, a nie gotówka na start. Policz, ile realnie ' +
        'zgarniesz przy swoim obrocie, zanim wybierzesz konto tylko dla bonusu. Nie ma jednego konta idealnego, ' +
        'jest najlepiej dopasowane do tego, jak działa twoja firma.',
    ],
    faq: [
      {
        q: 'Które konto firmowe jest najlepsze w 2026 roku?',
        a:
          'Dla większości jednoosobowych działalności najlepszym wyborem jest mBank mKonto Biznes - łączy ' +
          'zerowe opłaty przy aktywności, dobrą aplikację, darmowe przelewy do ZUS i US oraz księgowość online. ' +
          'Jeśli zależy ci na narzędziach i sprzedaży online, mocną alternatywą jest ING, a dla najniższych ' +
          'kosztów przy małej firmie - Nest Bank.',
      },
      {
        q: 'Czy do działalności gospodarczej trzeba mieć osobne konto firmowe?',
        a:
          'Przepisy nie zawsze tego wprost wymagają dla jednoosobowej działalności, ale w praktyce osobne konto ' +
          'firmowe jest niemal niezbędne: przy płatnościach powyżej limitu, rozliczeniach VAT i mechanizmie ' +
          'podzielonej płatności (split payment) potrzebny jest rachunek firmowy z rachunkiem VAT. Mieszanie ' +
          'finansów prywatnych i firmowych utrudnia też księgowość.',
      },
      {
        q: 'Czy przelewy do ZUS i urzędu skarbowego są darmowe?',
        a:
          'W większości kont firmowych z tego zestawienia przelewy do ZUS i US są darmowe, czasem po spełnieniu ' +
          'warunków aktywności lub w ramach limitu. To jeden z ważniejszych parametrów konta firmowego, bo te ' +
          'przelewy wykonujesz co miesiąc. Zawsze sprawdź aktualną tabelę opłat.',
      },
      {
        q: 'Czy warto założyć konto firmowe tylko dla premii?',
        a:
          'Premie potrafią wyglądać imponująco (4000-5000 zł), ale to prawie zawsze cashback rozłożony na 12-24 ' +
          'miesiące: procent od płatności kartą i od przelewów do ZUS, z miesięcznymi limitami i warunkiem ' +
          'aktywności. Realnie zgarniesz tyle tylko przy odpowiednio wysokim obrocie. To sensowne, jeśli i tak ' +
          'będziesz konta intensywnie używać, ale traktuj premię jako dodatek, nie główny powód wyboru konta na lata.',
      },
      {
        q: 'Czy konto firmowe musi obsługiwać KSeF?',
        a:
          'Od 2026 roku KSeF (Krajowy System e-Faktur) jest obowiązkowy, więc faktury i tak wystawiasz przez ' +
          'rządowy system. Konto nie musi mieć własnej integracji z KSeF, ale jeśli ma (np. mBank, ING), ' +
          'wystawianie i odbieranie e-faktur ogarniesz z poziomu bankowości, bez przeskakiwania między aplikacjami. ' +
          'Część banków uzależnia od podpięcia KSeF wypłatę premii promocyjnej.',
      },
      {
        q: 'Czy mogę zmienić konto firmowe na nowe?',
        a:
          'Tak. Najprościej: załóż nowe konto firmowe, zaktualizuj numer rachunku w urzędzie skarbowym (przez ' +
          'CEIDG dla jednoosobowej działalności), ZUS, u kontrahentów i w umowach, przekieruj zlecenia stałe, a ' +
          'po przeniesieniu wszystkiego zamknij stare konto. Pamiętaj o aktualizacji rachunku na białej liście podatników VAT.',
      },
    ],
    segments: [
      { label: 'Najlepsze ogólnie', slug: 'mbank-mkonto-biznes', reason: 'Najwyższa ocena: zero opłat przy aktywności, świetna aplikacja, darmowe przelewy do urzędów i księgowość.' },
      { label: 'Księgowość i narzędzia', slug: 'ing-konto-z-lwem-firmowe', reason: 'ING Księgowość, faktury i bramka imoje - najlepsze narzędzia dla firmy.' },
      { label: 'Najtańsze dla JDG', slug: 'nest-konto-biznes', reason: 'Bardzo niskie opłaty, nastawione na jednoosobową działalność.' },
      { label: 'Dla łowców premii', slug: 'erste-konto-firmowe', reason: 'Regularnie jedne z najwyższych premii powitalnych dla firm.' },
    ],
    relatedArticles: [
      { label: 'Ranking kont osobistych - które konto wybrać', href: '/ranking/konta-osobiste' },
      { label: 'Składka zdrowotna 2026 - ile zapłaci działalność', href: '/gospodarka/skladka-zdrowotna-2026-dzialalnosc-ile-zaplacisz' },
      { label: 'Kwota wolna i progi podatkowe 2026', href: '/pieniadze/kwota-wolna-progi-podatkowe-2026' },
    ],
    changelog: [
      { date: '2026-06-10', note: 'Weryfikacja ofert (Bankier, Moneteo): zaktualizowane premie (ING do 4200 zł, Millennium/BNP do 5000 zł), dodany wątek obowiązkowego KSeF i integracji e-faktur.' },
      { date: '2026-06-08', note: 'Pierwsza publikacja rankingu kont firmowych. Warunki i premie reprezentatywne dla 2026 roku.' },
    ],
    affiliateNote: AFFILIATE_DISCLOSURE,
    published: false, // ⚠️ ustaw true po weryfikacji opłat/premii i podstawieniu linków afiliacyjnych
  },
];

// "Czerwiec 2026" (mianownik) z daty ISO — sygnał świeżości w nazwie/tytule.
export function rankingMonthYear(iso: string): string {
  const months = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
  ];
  const d = new Date(iso);
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

// Podstawia token {DATE} → "Czerwiec 2026" (tytuł, kicker, meta).
export function withRankingDate(str: string, iso: string): string {
  return str.replace(/\{DATE\}/g, rankingMonthYear(iso));
}

export function getRankingBySlug(slug: string): Ranking | undefined {
  return RANKINGS.find((r) => r.slug === slug);
}

// ── Ocena ogólna i kolejność (wyliczane, nie ręczne) ───────────────────────────
// Ocena ogólna = średnia WAŻONA ocen cząstkowych (pick.scores). Dzięki temu
// kolejność rankingu jest obronna i wynika z konkretnych kryteriów, a nie z
// subiektywnego wrażenia. Wagi sumują się do 1.
export const RATING_WEIGHTS: { label: string; weight: number }[] = [
  { label: 'Opłaty', weight: 0.35 },
  { label: 'Aplikacja', weight: 0.30 },
  { label: 'Bankomaty', weight: 0.20 },
  { label: 'Dodatki', weight: 0.15 },
];

/** Średnia ważona ocen cząstkowych (null, gdy brak `scores` → użyjemy ręcznego score). */
export function computeOverall(
  scores?: { label: string; value: number }[],
  weights: { label: string; weight: number }[] = RATING_WEIGHTS,
): number | null {
  if (!scores || scores.length === 0) return null;
  let sum = 0;
  let wsum = 0;
  for (const s of scores) {
    const w = weights.find((x) => x.label === s.label)?.weight ?? (1 / scores.length);
    sum += s.value * w;
    wsum += w;
  }
  return wsum > 0 ? sum / wsum : null;
}

/**
 * Zwraca ranking z oceną ogólną (`score`) i pozycją (`rank`) wyliczonymi z ocen
 * cząstkowych i posortowanymi malejąco. Surowe `score`/`rank` w danych są
 * używane tylko jako fallback, gdy pozycja nie ma `scores`.
 */
export function resolveRanking(r: Ranking): Ranking {
  const weights = r.ratingWeights ?? RATING_WEIGHTS;
  const enriched = r.picks.map((p) => {
    const computed = computeOverall(p.scores, weights);
    return { p, precise: computed ?? p.score };
  });
  enriched.sort((a, b) => b.precise - a.precise);
  const picks = enriched.map((x, i) => ({
    ...x.p,
    score: Math.round(x.precise * 10) / 10,
    rank: i + 1,
  }));
  return { ...r, picks };
}

// ── Recenzje pojedynczych produktów (/recenzja/[slug]) ─────────────────────────
export interface PickWithContext {
  pick: RankingPick;
  ranking: Ranking;
}

/** Znajduje pozycję (konto/produkt) po jej slug-u; zwraca z wyliczoną oceną/pozycją. */
export function findPick(slug: string): PickWithContext | undefined {
  for (const raw of RANKINGS) {
    if (raw.picks.some((p) => p.slug === slug)) {
      const ranking = resolveRanking(raw);
      const pick = ranking.picks.find((p) => p.slug === slug)!;
      return { pick, ranking };
    }
  }
  return undefined;
}

/** Wszystkie slugi recenzji (też ze szkiców) — do generateStaticParams. */
export function getAllPickSlugs(): string[] {
  return RANKINGS.flatMap((r) => r.picks.map((p) => p.slug));
}

/** Slugi recenzji z opublikowanych rankingów — do sitemap. */
export function getPublishedPickSlugs(): string[] {
  return RANKINGS.filter((r) => r.published).flatMap((r) => r.picks.map((p) => p.slug));
}

/** Wszystkie rankingi (także szkice) — do generateStaticParams. */
export function getAllRankings(): Ranking[] {
  return RANKINGS;
}

/** Tylko opublikowane — do listy /ranking i sitemap. */
export function getPublishedRankings(): Ranking[] {
  return RANKINGS.filter((r) => r.published);
}

/** Slugi opublikowanych rankingów — używane w sitemap.ts. */
export const RANKING_SLUGS: string[] = RANKINGS.filter((r) => r.published).map((r) => r.slug);
