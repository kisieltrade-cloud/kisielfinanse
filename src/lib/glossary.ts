/**
 * Słownik pojęć finansowych.
 * Jedno źródło prawdy: strony /slownik/[slug] oraz auto-linkowanie w artykułach
 * (remark-glossary). Dodanie hasła tutaj = nowa strona + automatyczne linki w treści.
 *
 * `aliases` zawiera odmiany fleksyjne łapane przez auto-linker. Kolejność dowolna,
 * plugin sortuje po długości (najdłuższe najpierw), żeby "ETF-y" miało pierwszeństwo przed "ETF".
 */

export interface GlossaryTerm {
  slug: string;
  term: string;
  aliases: string[];
  short: string;
  body: string[];
  /**
   * Pytania i odpowiedzi pod definicją. Generują schema FAQPage, czyli szansę na
   * rozszerzony wynik w Google, i łapią zapytania wtórne („czy…", „ile…", „jak…"),
   * których sama definicja nie obsługuje. Odpowiedzi pełnymi zdaniami, bez odsyłaczy.
   */
  faq?: { q: string; a: string }[];
  /** Przykład liczbowy lub scenariusz. Renderowany jako wyróżniona ramka pod treścią. */
  example?: { title: string; text: string };
  related?: string[];
  calc?: { href: string; label: string };
  noindex?: boolean; // true → pojęcie wyłączone z indeksu Google (meta robots noindex)
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    slug: 'etf',
    term: 'ETF',
    aliases: ['ETF', 'ETF-y', 'ETF-ów', 'ETF-ach', 'ETF-a', 'ETF-em', 'ETF-ami', 'fundusz ETF', 'funduszy ETF'],
    short: 'ETF (Exchange Traded Fund) to fundusz notowany na giełdzie, który jednym zakupem daje ekspozycję na cały koszyk aktywów, na przykład setki spółek z indeksu.',
    body: [
      'Kupując jedną jednostkę ETF na indeks taki jak MSCI World albo S&P 500, stajesz się pośrednio współwłaścicielem wszystkich spółek wchodzących w skład tego indeksu. To najprostszy sposób na szeroką dywersyfikację bez kupowania dziesiątek akcji osobno.',
      'ETF-y mają zwykle niskie roczne koszty zarządzania (TER), często poniżej 0,2%. Dzielą się na akumulujące (reinwestują dywidendy) i dystrybuujące (wypłacają je na konto). Dla długoterminowego inwestora w Polsce ETF kupowany w ramach IKE lub IKZE to jedno z najtańszych podatkowo rozwiązań.',
    ],
    related: ['dywersyfikacja', 'ike', 'ikze'],
    calc: { href: '/kalkulator/etf', label: 'Kalkulator ETF' },
  },
  {
    slug: 'ike',
    term: 'IKE',
    aliases: ['IKE', 'Indywidualne Konto Emerytalne', 'konto IKE', 'rachunek IKE'],
    short: 'IKE (Indywidualne Konto Emerytalne) to rachunek, na którym zyski z inwestycji są zwolnione z 19% podatku Belki, o ile wypłacisz środki po 60. roku życia.',
    body: [
      'Na IKE możesz inwestować w akcje, ETF-y, obligacje i inne instrumenty. Dopóki nie wypłacisz pieniędzy przed czasem, nie płacisz podatku od zysków kapitałowych. To tarcza podatkowa, która przy długim horyzoncie potrafi dać dziesiątki tysięcy złotych różnicy.',
      'Limit wpłat na IKE w 2026 roku wynosi 28 260 zł. Warunek zwolnienia z podatku: wypłata po ukończeniu 60 lat (lub 55 przy nabyciu uprawnień emerytalnych) oraz wpłaty w co najmniej 5 dowolnych latach.',
    ],
    related: ['ikze', 'podatek-belki', 'etf'],
  },
  {
    slug: 'ikze',
    term: 'IKZE',
    aliases: ['IKZE', 'Indywidualne Konto Zabezpieczenia Emerytalnego', 'konto IKZE', 'rachunek IKZE'],
    short: 'IKZE (Indywidualne Konto Zabezpieczenia Emerytalnego) pozwala odliczyć wpłaty od dochodu w PIT już w roku wpłaty, a przy wypłacie po 65. roku życia płacisz tylko 10% zryczałtowanego podatku zamiast 19% Belki.',
    body: [
      'IKZE daje korzyść podatkową od razu: kwotę wpłaconą w danym roku odpisujesz od podstawy opodatkowania w rocznym PIT, więc realnie odzyskujesz część pieniędzy w zwrocie podatku.',
      'Limit wpłat na IKZE w 2026 roku wynosi 11 304 zł dla osób nieprowadzących działalności i 16 956 zł dla prowadzących działalność gospodarczą. Wypłata przed 65. rokiem życia oznacza utratę ulgi i doliczenie wypłaty do dochodu.',
    ],
    related: ['ike', 'podatek-belki'],
  },
  {
    slug: 'podatek-belki',
    term: 'Podatek Belki',
    aliases: ['podatek Belki', 'podatku Belki', 'podatkiem Belki', 'podatek od zysków kapitałowych'],
    short: 'Podatek Belki to potoczna nazwa 19% podatku od zysków kapitałowych: od odsetek, dywidend i zysków ze sprzedaży papierów wartościowych.',
    body: [
      'Nazwa pochodzi od Marka Belki, ministra finansów, za którego kadencji podatek wprowadzono w 2002 roku. Formalnie jest to zryczałtowany podatek od dochodów kapitałowych, a jego stawka wynosi 19 procent.',
      'Sposób rozliczenia zależy od źródła zysku i to jest najczęstsze źródło nieporozumień. Od odsetek z lokaty i konta oszczędnościowego oraz od dywidend z polskich spółek podatek pobiera automatycznie bank lub biuro maklerskie, więc na konto wpływa kwota już pomniejszona i nic nie musisz robić. Natomiast zyski ze sprzedaży akcji, ETF-ów czy obligacji rozliczasz samodzielnie w zeznaniu PIT-38, na podstawie informacji PIT-8C od brokera, w terminie do końca kwietnia za rok poprzedni.',
      'Przy inwestowaniu liczy się jeszcze jedna cecha tego podatku: płacisz go dopiero przy realizacji zysku, czyli sprzedaży. Dopóki trzymasz papier, wzrost wartości nie jest opodatkowany. Dlatego częste obracanie portfelem oznacza płacenie podatku wielokrotnie po drodze, zamiast pozwolić całej kwocie dalej pracować.',
      'Straty nie przepadają. Jeżeli w danym roku zamkniesz rok pod kreską, stratę możesz rozliczyć w kolejnych pięciu latach, obniżając przyszły podatek, przy czym w jednym roku odliczysz nie więcej niż połowę straty z danego roku. Warunkiem jest wykazanie jej w zeznaniu, dlatego PIT-38 składa się także przy wyniku ujemnym.',
      'Legalne sposoby na odroczenie lub uniknięcie tego podatku to konta emerytalne IKE i IKZE, gdzie zyski są zwolnione lub opodatkowane inaczej przy spełnieniu warunków wieku i stażu wpłat. Przy długim horyzoncie ta różnica bywa większa niż wszystkie prowizje maklerskie razem wzięte.',
    ],
    example: {
      title: 'Ile zostaje z zysku i co daje odroczenie',
      text: 'Kupujesz ETF za 20 000 zł i sprzedajesz po latach za 35 000 zł. Zysk to 15 000 zł, podatek 19 procent wynosi 2850 zł, więc na rękę zostaje 12 150 zł. Gdyby ten sam zysk powstał na rachunku IKE i spełnione byłyby warunki wypłaty, podatku nie zapłaciłbyś wcale. Przy portfelu budowanym przez dwadzieścia lat te 19 procent zabierane przy każdej sprzedaży po drodze robi z procentu składanego znacznie mniej, niż pokazuje kalkulator liczący zysk brutto.',
    },
    faq: [
      {
        q: 'Czy muszę sam rozliczyć podatek Belki?',
        a: 'To zależy od źródła. Od odsetek z lokat i kont oszczędnościowych oraz od dywidend z polskich spółek podatek potrąca automatycznie bank lub broker i nie robisz nic. Zyski ze sprzedaży akcji, ETF-ów i obligacji rozliczasz samodzielnie w PIT-38 na podstawie PIT-8C otrzymanego od biura maklerskiego.',
      },
      {
        q: 'Kiedy płaci się podatek od wzrostu wartości akcji?',
        a: 'Dopiero w momencie sprzedaży, czyli realizacji zysku. Sam wzrost kursu trzymanego papieru nie rodzi obowiązku podatkowego, niezależnie od tego, jak długo go posiadasz i o ile urósł.',
      },
      {
        q: 'Czy stratę można odliczyć?',
        a: 'Tak. Stratę z inwestycji rozlicza się w ciągu pięciu kolejnych lat podatkowych, obniżając dochód z tego samego źródła, przy czym w jednym roku odliczysz maksymalnie połowę straty poniesionej w danym roku. Aby móc z tego skorzystać, stratę trzeba wykazać w zeznaniu, więc PIT-38 składa się również przy wyniku ujemnym.',
      },
      {
        q: 'Jak legalnie nie płacić podatku Belki?',
        a: 'Służą do tego konta emerytalne. Na IKE zyski są zwolnione z podatku, jeśli wypłacisz środki po osiągnięciu wymaganego wieku i przy odpowiedniej liczbie lat z wpłatami. IKZE daje z kolei odliczenie wpłat od dochodu, a przy wypłacie po spełnieniu warunków obowiązuje niski zryczałtowany podatek zamiast dziewiętnastu procent.',
      },
    ],
    related: ['ike', 'ikze'],
  },
  {
    slug: 'wibor',
    term: 'WIBOR',
    aliases: ['WIBOR', 'WIBOR-u', 'WIBOR-em', 'WIBOR 3M', 'WIBOR 6M'],
    short: 'WIBOR to stopa procentowa, po jakiej banki pożyczają sobie pieniądze, używana jako podstawa oprocentowania większości kredytów hipotecznych w złotych.',
    body: [
      'Rata kredytu o zmiennym oprocentowaniu to suma WIBOR-u i stałej marży banku. Gdy WIBOR rośnie, rosną raty; gdy spada, raty maleją. Najczęściej stosuje się WIBOR 3M (trzymiesięczny) lub 6M.',
      'WIBOR jest stopniowo zastępowany nowym wskaźnikiem referencyjnym w ramach reformy wskaźników. Docelowo nowe umowy mają opierać się na wskaźniku liczonym na podstawie realnych transakcji, a nie deklaracji banków.',
    ],
    related: ['inflacja'],
    calc: { href: '/kalkulator-hipoteczny', label: 'Kalkulator hipoteczny' },
  },
  {
    slug: 'dywersyfikacja',
    term: 'Dywersyfikacja',
    aliases: ['dywersyfikacja', 'dywersyfikacji', 'dywersyfikację', 'dywersyfikacją'],
    short: 'Dywersyfikacja to rozłożenie kapitału na wiele różnych aktywów, żeby strata na jednym nie pogrążyła całego portfela.',
    body: [
      'Zamiast wkładać wszystko w jedną spółkę, rozkładasz ryzyko na wiele firm, sektorów, krajów i klas aktywów (akcje, obligacje, surowce). Gdy jedna część traci, inna może zyskiwać, co wygładza wyniki portfela.',
      'Najprostszy sposób na szeroką dywersyfikację to globalny ETF akcyjny, który jednym zakupem daje ekspozycję na tysiące spółek. Dywersyfikacja ogranicza ryzyko specyficzne pojedynczej spółki, ale nie chroni przed spadkami całego rynku.',
    ],
    related: ['etf', 'drawdown'],
  },
  {
    slug: 'procent-skladany',
    term: 'Procent składany',
    aliases: ['procent składany', 'procentu składanego', 'procentem składanym', 'procent skladany'],
    short: 'Procent składany to mechanizm, w którym odsetki dopisują się do kapitału i same zaczynają zarabiać, dzięki czemu kapitał rośnie coraz szybciej.',
    body: [
      'Reinwestując zyski, w kolejnym okresie zarabiasz nie tylko od pierwotnej kwoty, ale też od wcześniej dopisanych zysków. Im dłuższy horyzont, tym efekt potężniejszy, bo wzrost jest wykładniczy, a nie liniowy.',
      'To dlatego czas jest najważniejszym sojusznikiem inwestora. 1000 zł miesięcznie przez 30 lat przy 8% rocznie urośnie do kwoty wielokrotnie większej niż suma samych wpłat, właśnie dzięki procentowi składanemu.',
    ],
    related: ['etf', 'inflacja'],
    calc: { href: '/kalkulator/procent-skladany', label: 'Kalkulator procentu składanego' },
  },
  {
    slug: 'inflacja',
    term: 'Inflacja',
    aliases: ['inflacja', 'inflacji', 'inflację', 'inflacją'],
    short: 'Inflacja to wzrost ogólnego poziomu cen w czasie, który obniża siłę nabywczą pieniądza, czyli za tę samą kwotę kupujesz mniej.',
    body: [
      'Jeśli inflacja wynosi 5% rocznie, to po roku za 100 zł kupisz tyle, co dziś za około 95 zł. Pieniądze trzymane bez oprocentowania realnie tracą na wartości.',
      'Dlatego oszczędności chroni się instrumentami, które dają szansę pobić inflację: lokatami, obligacjami antyinflacyjnymi, a w długim terminie akcjami i ETF-ami. Realna stopa zwrotu to nominalny zysk pomniejszony o inflację.',
    ],
    related: ['procent-skladany', 'wibor'],
  },
  {
    slug: 'drawdown',
    term: 'Drawdown',
    aliases: ['drawdown', 'drawdownu', 'drawdownów', 'max drawdown', 'maksymalny drawdown', 'obsunięcie kapitału'],
    short: 'Drawdown to spadek wartości portfela od ostatniego szczytu do kolejnego dołka, podawany w procentach. Mierzy, ile maksymalnie traciłeś po drodze.',
    body: [
      'Jeśli portfel urósł do 100 000 zł, a potem spadł do 70 000 zł, drawdown wynosi 30%. Maksymalny drawdown (max drawdown) to największy taki spadek w całej historii i jest ważną miarą ryzyka strategii.',
      'Drawdown jest tak samo istotny jak stopa zwrotu: po spadku o 50% potrzeba aż 100% wzrostu, żeby wrócić do punktu wyjścia. Dobre zarządzanie ryzykiem ma ograniczać głębokość obsunięć, nie tylko maksymalizować zyski.',
    ],
    related: ['dywersyfikacja'],
  },
  {
    slug: 'fire',
    term: 'FIRE',
    aliases: ['FIRE', 'ruch FIRE', 'Financial Independence Retire Early', 'Lean FIRE', 'Coast FIRE'],
    short: 'FIRE (Financial Independence, Retire Early) to strategia agresywnego oszczędzania i inwestowania, by zgromadzić kapitał pozwalający żyć z zysków i przejść na wczesną emeryturę.',
    body: [
      'Idea opiera się na zgromadzeniu portfela równego około 25-krotności rocznych wydatków. Przy regule 4% taki kapitał pozwala wypłacać rocznie 4% bez wyczerpania oszczędności w długim terminie.',
      'Droga do FIRE to wysoka stopa oszczędności (często 40-60% dochodu) i konsekwentne inwestowanie, najczęściej w szerokie ETF-y. Istnieją warianty, jak Lean FIRE (skromne wydatki) i Coast FIRE (zgromadzony kapitał sam dorasta do emerytury).',
    ],
    related: ['procent-skladany', 'etf', 'dywersyfikacja'],
    calc: { href: '/kalkulator/fire', label: 'Kalkulator FIRE' },
  },
  {
    slug: 'akcja',
    term: 'Akcja',
    aliases: ['akcja', 'akcje', 'akcji', 'akcją', 'akcjami', 'akcjach'],
    short: 'Akcja to papier wartościowy potwierdzający udział w spółce. Kupując akcje, stajesz się współwłaścicielem firmy i masz prawo do części jej zysków oraz głosu na walnym zgromadzeniu.',
    body: [
      'Cena akcji zmienia się na giełdzie w zależności od popytu, podaży i oczekiwań co do przyszłych wyników spółki. Zarabiasz na dwa sposoby: na wzroście kursu (sprzedajesz drożej, niż kupiłeś) oraz na dywidendzie, jeśli spółka ją wypłaca.',
      'Akcje pojedynczych spółek dają wyższy potencjał zysku, ale i wyższe ryzyko niż szeroki ETF. Pojedyncza firma może zbankrutować, a indeks setek spółek nie.',
    ],
    related: ['etf', 'dywidenda', 'gpw', 'dywersyfikacja'],
  },
  {
    slug: 'obligacja',
    term: 'Obligacja',
    aliases: ['obligacja', 'obligacje', 'obligacji', 'obligacją', 'obligacjami', 'obligacjach'],
    short: 'Obligacja to dłużny papier wartościowy: pożyczasz pieniądze emitentowi (państwu lub firmie), a on zobowiązuje się zwrócić kapitał z odsetkami w określonym terminie.',
    body: [
      'Kupując obligację, jesteś wierzycielem, a nie współwłaścicielem. To zasadnicza różnica wobec akcji i decyduje o wszystkim pozostałym. Nie masz udziału w zyskach, gdy emitentowi idzie świetnie, za to Twoje roszczenie jest zapisane w umowie i w razie kłopotów zaspokajane przed akcjonariuszami.',
      'Trzy parametry opisują każdą obligację: wartość nominalna, czyli kwota zwracana na koniec, kupon, czyli wysokość odsetek, oraz termin wykupu. Kupon bywa stały przez cały okres, zmienny (powiązany ze wskaźnikiem rynkowym) albo indeksowany inflacją, co przy obligacjach skarbowych jest najpopularniejszym wariantem długoterminowym.',
      'Podział według emitenta wyznacza poziom ryzyka. Obligacje skarbowe emituje państwo i są uznawane za najbezpieczniejsze dostępne instrumenty w danej walucie. Obligacje korporacyjne emitują firmy, płacą więcej, ale niosą ryzyko niewypłacalności emitenta. Istnieją też obligacje komunalne emitowane przez samorządy.',
      'Najmniej intuicyjny jest związek ceny ze stopami procentowymi. Cena obligacji na rynku porusza się odwrotnie do stóp: gdy stopy rosną, nowe emisje płacą więcej, więc starsze obligacje ze stałym niższym kuponem tanieją, żeby dorównać im opłacalnością. Gdy stopy spadają, dzieje się odwrotnie. Ta zależność dotyczy tylko obligacji sprzedawanych przed terminem wykupu. Trzymając papier do końca, otrzymasz wartość nominalną niezależnie od tego, co po drodze działo się z ceną.',
      'Im dłuższy termin do wykupu i im niższy kupon, tym mocniej cena reaguje na zmiany stóp. Dlatego długoterminowe obligacje o stałym oprocentowaniu, uważane potocznie za bezpieczne, potrafią w okresie gwałtownych podwyżek stóp przynieść straty porównywalne z rynkiem akcji, jeśli trzeba je sprzedać przed terminem.',
    ],
    example: {
      title: 'Dlaczego bezpieczna obligacja potrafi stracić na wartości',
      text: 'Kupujesz obligację o wartości nominalnej 1000 zł ze stałym kuponem 4 procent, czyli 40 zł rocznie, i terminem wykupu za 10 lat. Rok później stopy rynkowe rosną i nowe obligacje płacą 6 procent, czyli 60 zł. Nikt nie kupi Twojej za pełne 1000 zł, skoro obok dostanie więcej, więc jej cena rynkowa spada, żeby wyrównać opłacalność. Trzymając papier do wykupu, i tak odzyskasz 1000 zł plus wszystkie kupony. Strata pojawia się wyłącznie wtedy, gdy musisz sprzedać wcześniej.',
    },
    faq: [
      {
        q: 'Czy obligacje są bezpieczne?',
        a: 'Bezpieczniejsze od akcji, ale nie pozbawione ryzyka. Przy obligacjach skarbowych głównym zagrożeniem nie jest niewypłacalność, tylko inflacja zjadająca realną wartość odsetek oraz spadek ceny rynkowej przy wzroście stóp, jeśli trzeba sprzedać przed terminem. Przy obligacjach korporacyjnych dochodzi realne ryzyko upadłości emitenta.',
      },
      {
        q: 'Dlaczego cena obligacji spada, gdy rosną stopy procentowe?',
        a: 'Ponieważ nowe emisje oferują wtedy wyższe odsetki. Starsza obligacja ze stałym, niższym kuponem musi potanieć, żeby jej opłacalność dla kupującego dorównała nowym papierom. Zależność jest odwrotna i tym silniejsza, im dłuższy pozostały termin do wykupu.',
      },
      {
        q: 'Czym różni się obligacja od lokaty?',
        a: 'Lokata to umowa z bankiem objęta gwarancją Bankowego Funduszu Gwarancyjnego, o stałym oprocentowaniu i braku ceny rynkowej. Obligacja to papier wartościowy, który można sprzedać przed terminem, ale po cenie ustalonej przez rynek, czyli czasem niższej od nominalnej. Obligacje skarbowe dają zwykle dłuższy horyzont i warianty indeksowane inflacją, których lokata nie oferuje.',
      },
      {
        q: 'Co się stanie, jeśli emitent zbankrutuje?',
        a: 'Jako wierzyciel jesteś zaspokajany przed akcjonariuszami, ale to nie gwarantuje odzyskania całości. Przy obligacjach korporacyjnych realna wypłata zależy od majątku upadłej firmy i kolejności zaspokajania wierzycieli. Przy obligacjach skarbowych w walucie krajowej ryzyko to jest uznawane za marginalne.',
      },
    ],
    related: ['obligacje-skarbowe', 'akcja', 'inflacja'],
  },
  {
    slug: 'obligacje-skarbowe',
    term: 'Obligacje skarbowe',
    aliases: ['obligacje skarbowe', 'obligacji skarbowych', 'obligacjami skarbowymi', 'obligacje detaliczne'],
    short: 'Obligacje skarbowe to obligacje emitowane przez Skarb Państwa. Uchodzą za jedną z najbezpieczniejszych form oszczędzania, bo gwarantem wykupu jest państwo.',
    body: [
      'W Polsce popularne są detaliczne obligacje skarbowe, w tym antyinflacyjne, których oprocentowanie w kolejnych latach zależy od inflacji powiększonej o stałą marżę. To popularny sposób ochrony oszczędności przed utratą wartości.',
      'Kupujesz je bez prowizji bezpośrednio od emitenta. W zamian za bezpieczeństwo akceptujesz niższy potencjalny zysk niż na akcjach czy ETF-ach. Wcześniejszy wykup zwykle jest możliwy za niewielką opłatą.',
    ],
    related: ['obligacja', 'inflacja', 'lokata'],
  },
  {
    slug: 'dywidenda',
    term: 'Dywidenda',
    aliases: ['dywidenda', 'dywidendy', 'dywidendę', 'dywidendą', 'dywidend'],
    short: 'Dywidenda to część zysku spółki wypłacana akcjonariuszom, zwykle raz w roku. To jeden z dwóch sposobów zarabiania na akcjach, obok wzrostu kursu.',
    body: [
      'O wypłacie decyduje walne zgromadzenie akcjonariuszy, dzieląc zysk na część wypłacaną i część zatrzymaną w spółce na dalszy rozwój. Nie ma tu żadnego automatyzmu: spółka może mieć zysk i nie wypłacić nic, jeżeli uzna, że pieniądze lepiej zapracują wewnątrz firmy.',
      'Dwie daty decydują o tym, komu należy się wypłata. Dzień ustalenia prawa do dywidendy wyznacza, kto musi mieć akcje zapisane na rachunku, żeby ją otrzymać. Dzień wypłaty to moment, w którym pieniądze trafiają na rachunek maklerski. Kupno akcji po dniu ustalenia prawa nie daje już prawa do tej wypłaty.',
      'Wysokość podaje się na dwa sposoby: jako kwotę na jedną akcję albo jako stopę dywidendy, czyli stosunek rocznej wypłaty do ceny akcji. Ta druga miara bywa myląca, bo rośnie także wtedy, gdy kurs spada. Bardzo wysoka stopa dywidendy jest częściej sygnałem kłopotów spółki niż okazji.',
      'W dniu odcięcia prawa do dywidendy kurs akcji zwykle spada o mniej więcej wartość wypłaty. To nie jest przypadek ani reakcja rynku, tylko prosta konsekwencja tego, że ze spółki wyszły pieniądze. Dywidenda nie jest więc darmowym dodatkiem do posiadania akcji, lecz przesunięciem części wartości z rachunku spółki na Twój.',
      'Od dywidendy z polskich spółek podatek 19 procent pobiera automatycznie biuro maklerskie. Przy spółkach zagranicznych sprawa się komplikuje, bo pojawia się podatek u źródła pobierany w kraju spółki i konieczność rozliczenia różnicy w Polsce. To jeden z powodów, dla których inwestorzy długoterminowi wybierają fundusze akumulujące, które reinwestują dywidendy wewnątrz funduszu.',
    ],
    example: {
      title: 'Stopa dywidendy i to, czego nie pokazuje',
      text: 'Spółka wypłaca 4 zł dywidendy na akcję, a jej kurs wynosi 80 zł. Stopa dywidendy to 5 procent. Po potrąceniu 19 procent podatku otrzymasz 3,24 zł na akcję, czyli realnie 4,05 procent. Jeżeli kurs tej samej spółki spadnie do 50 zł przy niezmienionej wypłacie, stopa dywidendy skoczy do 8 procent, choć spółka nie stała się przez to lepsza. Wysoka stopa bywa więc efektem taniejących akcji, a nie hojności zarządu.',
    },
    faq: [
      {
        q: 'Kiedy trzeba mieć akcje, żeby dostać dywidendę?',
        a: 'Trzeba je posiadać w dniu ustalenia prawa do dywidendy. Kupno akcji po tym dniu nie daje prawa do bieżącej wypłaty, nawet jeśli sama wypłata następuje później. Sprzedaż akcji po dniu ustalenia prawa nie odbiera już prawa do dywidendy.',
      },
      {
        q: 'Czy dywidenda to darmowy zysk?',
        a: 'Nie. W dniu odcięcia prawa kurs akcji spada zwykle mniej więcej o wartość wypłaty, ponieważ z majątku spółki ubyły pieniądze. Dywidenda przenosi część wartości ze spółki do Ciebie, a dodatkowo uruchamia podatek, którego przy samym wzroście kursu byś nie zapłacił.',
      },
      {
        q: 'Jaki podatek płaci się od dywidendy?',
        a: 'Dziewiętnaście procent. Przy polskich spółkach podatek potrąca automatycznie biuro maklerskie i na rachunek trafia kwota netto. Przy spółkach zagranicznych część podatku pobiera kraj spółki, a różnicę rozlicza się w polskim zeznaniu rocznym.',
      },
      {
        q: 'Czy wysoka stopa dywidendy to dobry sygnał?',
        a: 'Nie zawsze, a często wręcz przeciwnie. Stopa dywidendy rośnie także wtedy, gdy spada kurs akcji, więc bardzo wysoka wartość bywa oznaką problemów spółki i zapowiedzią obniżenia przyszłych wypłat. Ważniejsze od samej stopy jest to, czy zysk spółki pokrywa dywidendę i czy da się ją utrzymać.',
      },
    ],
    related: ['akcja', 'podatek-belki', 'etf-dystrybuujacy'],
  },
  {
    slug: 'indeks-gieldowy',
    term: 'Indeks giełdowy',
    aliases: ['indeks giełdowy', 'indeks', 'indeksu', 'indeksie', 'indeksy', 'indeksów'],
    short: 'Indeks giełdowy to wskaźnik pokazujący łączną zmianę kursów wybranego koszyka spółek. Mierzy, jak radzi sobie cały rynek albo jego segment.',
    body: [
      'Przykłady to amerykański S&P 500 (500 największych spółek z USA), polski WIG20 (20 największych spółek z GPW) czy globalny MSCI World. Gdy mówi się, że rynek wzrósł o 2%, zwykle chodzi o zmianę indeksu.',
      'Indeksów nie da się kupić bezpośrednio, ale można w nie inwestować przez ETF-y, które odwzorowują ich skład. To podstawa inwestowania pasywnego.',
    ],
    related: ['etf', 's-and-p-500', 'wig20'],
  },
  {
    slug: 's-and-p-500',
    term: 'S&P 500',
    aliases: ['S&P 500', 'S&P500', 'SP500', 'indeks S&P 500'],
    short: 'S&P 500 to indeks 500 największych spółek notowanych w USA. Uważany za najlepszy barometr amerykańskiej giełdy i punkt odniesienia dla inwestorów na całym świecie.',
    body: [
      'Indeks obejmuje pięćset największych spółek notowanych w Stanach Zjednoczonych, wybieranych przez komitet według kryteriów obejmujących kapitalizację, płynność i rentowność. Skład nie jest więc automatyczną listą największych firm, tylko decyzją opartą na regułach, a spółki bywają z niego usuwane i do niego dodawane.',
      'Największa cecha, którą początkujący przeoczają: indeks jest ważony kapitalizacją. Oznacza to, że największe spółki mają w nim nieproporcjonalnie duży udział, a kilkanaście czołowych firm technologicznych potrafi odpowiadać za znaczną część całości. Kupując ETF na S&P 500, nie kupujesz więc pięciuset równych części, tylko portfel silnie przechylony w stronę kilku gigantów.',
      'Historyczna stopa zwrotu podawana jest zwykle w przedziale około 7 do 10 procent rocznie w długim terminie, ale ta liczba wymaga trzech zastrzeżeń. Jest nominalna, czyli przed inflacją. Dotyczy okresów wielodziesięcioletnich, wewnątrz których zdarzały się dekady bez zysku. I jest liczona z reinwestowanymi dywidendami, więc sam wykres indeksu cenowego pokazuje mniej.',
      'Dla polskiego inwestora dochodzi ryzyko walutowe, o którym łatwo zapomnieć. Indeks jest wyceniany w dolarze, więc na Twój wynik w złotych wpływa nie tylko zachowanie amerykańskich spółek, ale też kurs USD/PLN. Umocnienie złotego potrafi zjeść część zysku z rosnącego indeksu, a osłabienie dodać zysk mimo stojącego rynku.',
      'Najprostszą formą ekspozycji jest fundusz notowany na giełdzie odwzorowujący ten indeks. Dla inwestora z Unii Europejskiej istotny jest domicyl funduszu, najczęściej irlandzki, ze względu na korzystniejsze opodatkowanie dywidend u źródła, oraz wariant akumulujący, który reinwestuje dywidendy zamiast je wypłacać.',
    ],
    example: {
      title: 'Co naprawdę oznacza „500 spółek"',
      text: 'Ponieważ indeks jest ważony kapitalizacją, udział spółki zależy od jej wielkości, a nie od miejsca na liście. Firma warta bilion dolarów waży w indeksie tyle, co kilkadziesiąt najmniejszych spółek razem wziętych. W praktyce oznacza to, że wynik funduszu na S&P 500 w dużej mierze zależy od kilkunastu największych firm, głównie technologicznych. Dywersyfikacja jest więc mniejsza, niż sugeruje liczba pięćset, i to jest argument za dołożeniem ekspozycji na inne regiony.',
    },
    faq: [
      {
        q: 'Jak inwestować w S&P 500 z Polski?',
        a: 'Najprościej przez fundusz notowany na giełdzie odwzorowujący ten indeks, kupowany na zwykłym rachunku maklerskim, w ramach IKE albo IKZE. Zwraca się uwagę na koszty roczne funduszu, jego wielkość oraz domicyl, najczęściej irlandzki ze względu na korzystniejsze rozliczenie podatku od dywidend u źródła.',
      },
      {
        q: 'Ile średnio zarabia S&P 500?',
        a: 'Długoterminowe zestawienia wskazują na wynik rzędu 7 do 10 procent rocznie nominalnie, z reinwestowanymi dywidendami. To średnia z bardzo długiego okresu, wewnątrz którego zdarzały się kilkuletnie i dłuższe okresy bez zysku, a także spadki przekraczające połowę wartości. Nie jest to stopa, na którą można liczyć w żadnym pojedynczym roku.',
      },
      {
        q: 'Czy S&P 500 wystarczy jako cały portfel?',
        a: 'Daje ekspozycję na jedną gospodarkę, jedną walutę i portfel mocno przechylony w stronę największych spółek technologicznych. Wielu inwestorów uzupełnia go o rynki rozwinięte spoza Stanów Zjednoczonych, rynki wschodzące oraz część obligacyjną dopasowaną do horyzontu.',
      },
      {
        q: 'Czy kurs dolara wpływa na mój wynik?',
        a: 'Tak, i bywa to pomijane. Indeks jest wyceniany w dolarze, więc wynik przeliczony na złote zależy również od kursu USD/PLN. Umocnienie złotego obniża zysk wyrażony w złotych, a osłabienie go podnosi, niezależnie od tego, co robią same spółki.',
      },
    ],
    related: ['indeks-gieldowy', 'etf', 'msci-world'],
  },
  {
    slug: 'msci-world',
    term: 'MSCI World',
    aliases: ['MSCI World', 'indeks MSCI World', 'MSCI ACWI'],
    short: 'MSCI World to globalny indeks akcji obejmujący ponad 1000 dużych i średnich spółek z krajów rozwiniętych. Daje ekspozycję na cały świat rozwinięty jednym ruchem.',
    body: [
      'W odróżnieniu od S&P 500, który jest tylko amerykański, MSCI World rozkłada kapitał na wiele krajów, choć USA i tak stanowi w nim największą część. Wariant MSCI ACWI dokłada rynki wschodzące.',
      'ETF na MSCI World to popularny wybór na rdzeń portfela pasywnego, bo jednym instrumentem kupujesz kawałek największych firm świata.',
    ],
    related: ['s-and-p-500', 'etf', 'dywersyfikacja'],
  },
  {
    slug: 'ter',
    term: 'TER (koszty funduszu)',
    aliases: ['TER', 'wskaźnik TER', 'Total Expense Ratio'],
    short: 'TER (Total Expense Ratio) to roczny wskaźnik kosztów funduszu lub ETF-u, podawany w procentach. Pokazuje, ile rocznie potrącane jest z Twoich pieniędzy za zarządzanie.',
    body: [
      'TER obejmuje opłatę za zarządzanie oraz bieżące koszty działania funduszu, takie jak obsługa administracyjna, depozytariusz czy audyt. Podawany jest jako procent w skali roku i naliczany od całej wartości Twojej inwestycji, a nie od zysku. To ważne rozróżnienie: opłatę płacisz również w latach, w których fundusz stracił.',
      'Nie zobaczysz tego kosztu jako osobnej pozycji na rachunku. Jest potrącany stopniowo z aktywów funduszu, więc odbija się na wycenie jednostki albo ceny ETF-u. Efekt jest niewidoczny na co dzień i właśnie dlatego łatwo go zignorować przy wyborze funduszu.',
      'Rzędy wielkości są dziś mocno rozwarstwione. Fundusze notowane na giełdzie odwzorowujące szerokie indeksy rozwinięte mieszczą się zwykle w przedziale od 0,05 do 0,30 procent rocznie. Fundusze na rynki wschodzące, sektory branżowe czy strategie tematyczne bywają wyraźnie droższe. Klasyczne fundusze aktywnie zarządzane potrafią pobierać kilka procent rocznie.',
      'TER nie jest jedynym kosztem, jaki ponosisz. Osobno zapłacisz prowizję maklerską przy zakupie i sprzedaży, a przy aktywach w obcej walucie także spread walutowy. Do tego dochodzi różnica odwzorowania, czyli rozjazd między wynikiem funduszu a wynikiem indeksu, który bywa nieco większy niż sam TER.',
      'Praktyczna zasada przy porównywaniu dwóch podobnych funduszy na ten sam indeks brzmi: jeśli oba śledzą to samo i mają podobną wielkość oraz płynność, tańszy jest po prostu lepszy. Nie ma tu premii za wyższą cenę.',
    ],
    example: {
      title: 'Ile realnie kosztuje 1 punkt procentowy różnicy',
      text: 'Przy 50 000 zł zainwestowanych na 25 lat i średniorocznym wyniku brutto 7 procent, fundusz z TER 0,20 procent zostawia około 259 tys. zł, a fundusz z TER 1,20 procent około 205 tys. zł. Jeden punkt procentowy rocznej opłaty kosztuje w tym przykładzie około 54 tys. zł, czyli więcej niż cała pierwotna wpłata. Powód jest prosty: opłata zabiera nie tylko pieniądze, ale też przyszłe zyski, które te pieniądze mogłyby wypracować.',
    },
    faq: [
      {
        q: 'Czy TER jest pobierany osobno z mojego konta?',
        a: 'Nie. Koszt jest potrącany bezpośrednio z aktywów funduszu, stopniowo przez cały rok, i odzwierciedla się w wycenie jednostki lub cenie ETF-u. Nie zobaczysz go jako oddzielnej opłaty na wyciągu, przez co bywa niedoceniany.',
      },
      {
        q: 'Jaki TER jest niski?',
        a: 'Dla funduszy odwzorowujących szerokie indeksy rynków rozwiniętych za niski uznaje się poziom poniżej mniej więcej 0,25 procent rocznie. Dla rynków wschodzących i strategii sektorowych progi są wyższe, bo prowadzenie takiego funduszu kosztuje więcej. Sensowne porównanie robi się zawsze między funduszami na ten sam indeks.',
      },
      {
        q: 'Czy TER to jedyny koszt inwestycji?',
        a: 'Nie. Poza nim płacisz prowizję maklerską przy każdej transakcji, przy aktywach zagranicznych koszt przewalutowania, a w rozliczeniu rocznym podatek od zysków. Dochodzi też różnica odwzorowania, czyli odchylenie wyniku funduszu od indeksu, które w praktyce bywa nieco większe niż sam wskaźnik kosztów.',
      },
      {
        q: 'Czy droższy fundusz daje lepszy wynik?',
        a: 'Nie ma takiej zależności, a długoterminowe badania wskazują raczej odwrotnie: koszt jest jedną z niewielu cech funduszu, która przewidywalnie wpływa na wynik netto, i wpływa negatywnie. Wyższa opłata musi zostać najpierw odrobiona, zanim inwestor cokolwiek zyska.',
      },
    ],
    related: ['etf', 'procent-skladany'],
  },
  {
    slug: 'etf-akumulujacy',
    term: 'ETF akumulujący',
    aliases: ['ETF akumulujący', 'akumulujący', 'akumulacyjny', 'ETF accumulating'],
    short: 'ETF akumulujący to fundusz, który automatycznie reinwestuje otrzymane dywidendy zamiast wypłacać je na konto. Kapitał rośnie szybciej dzięki procentowi składanemu.',
    body: [
      'Dla inwestora długoterminowego w fazie budowania majątku wariant akumulujący jest zwykle wygodniejszy: nie musisz ręcznie reinwestować dywidend i nie rozliczasz ich podatkowo na bieżąco przy koncie zwykłym.',
      'Przeciwieństwem jest ETF dystrybuujący, który wypłaca dywidendy na rachunek. Wybór zależy od tego, czy budujesz kapitał, czy potrzebujesz z niego bieżącego dochodu.',
    ],
    related: ['etf', 'etf-dystrybuujacy', 'procent-skladany'],
  },
  {
    slug: 'etf-dystrybuujacy',
    term: 'ETF dystrybuujący',
    aliases: ['ETF dystrybuujący', 'dystrybuujący', 'ETF distributing', 'ETF wypłacający dywidendy'],
    short: 'ETF dystrybuujący to fundusz, który regularnie wypłaca otrzymane dywidendy na rachunek inwestora, zamiast je reinwestować.',
    body: [
      'Sprawdza się, gdy chcesz czerpać z portfela bieżący dochód, na przykład na emeryturze albo w strategii FIRE. Wadą jest to, że wypłacone dywidendy podlegają podatkowi Belki, a reinwestowanie ich zależy już od Ciebie.',
      'Przeciwieństwo to ETF akumulujący, który reinwestuje dywidendy automatycznie. Wybór zależy od tego, czy jesteś w fazie gromadzenia kapitału, czy korzystania z niego.',
    ],
    related: ['etf', 'etf-akumulujacy', 'dywidenda'],
  },
  {
    slug: 'broker',
    term: 'Broker',
    aliases: ['broker', 'brokera', 'brokerzy', 'brokerem', 'brokerów', 'brokerom'],
    short: 'Broker to pośrednik, który daje Ci dostęp do giełdy i realizuje Twoje zlecenia kupna i sprzedaży instrumentów finansowych. W Polsce zwykle działa jako dom maklerski.',
    body: [
      'Sam nie możesz złożyć zlecenia bezpośrednio na giełdzie. Robi to za Ciebie broker, który jest członkiem giełdy, przekazuje Twoje zlecenie do systemu notowań, prowadzi rachunek, przechowuje kupione papiery i rozlicza transakcje. Za tę usługę pobiera prowizję, a czasem także opłaty za prowadzenie rachunku, przewalutowanie czy dostęp do notowań w czasie rzeczywistym.',
      'Brokerów dzieli się z grubsza na trzy grupy. Domy maklerskie przy polskich bankach są wygodne, bo działają w tej samej aplikacji co konto, ale bywają droższe i mają węższą ofertę zagraniczną. Brokerzy wyspecjalizowani oferują niższe prowizje i szeroki dostęp do rynków zagranicznych. Osobną kategorią są firmy oferujące kontrakty CFD, gdzie nie kupujesz realnych akcji, tylko zawierasz zakład o zmianę ceny z dźwignią.',
      'Przy wyborze liczy się kilka rzeczy naraz. Prowizja od transakcji i minimalna kwota prowizji, bo przy małych zleceniach to ona decyduje o koszcie. Opłata za przewalutowanie, jeśli kupujesz aktywa w innej walucie, bo bywa większa niż sama prowizja. Dostęp do rynków, na których faktycznie chcesz inwestować. Możliwość prowadzenia rachunku IKE lub IKZE, co przy długim horyzoncie potrafi zaoszczędzić więcej niż wszystkie prowizje razem wzięte. I wreszcie sposób rozliczania podatku, bo polski broker wystawi PIT-8C, a zagraniczny zwykle nie.',
      'Kwestia bezpieczeństwa sprowadza się do nadzoru. Broker działający w Polsce lub w Unii Europejskiej podlega nadzorowi (w Polsce KNF), musi oddzielać środki klientów od własnego majątku i należy do systemu rekompensat. Oznacza to, że papiery wartościowe kupione przez Ciebie są Twoje, a nie brokera, nawet gdyby ten upadł. Zupełnie inaczej wygląda to u firm spoza nadzoru unijnego, obiecujących wysoką dźwignię i szybkie zyski.',
      'Zmiana brokera jest możliwa i nie wymaga sprzedawania portfela, bo papiery można przenieść na inny rachunek. Bywa jednak płatna i czasochłonna, dlatego pierwszy wybór lepiej przemyśleć niż odkręcać.',
    ],
    example: {
      title: 'Jak prowizja minimalna zjada małe zlecenia',
      text: 'Prowizja 0,39 procent brzmi nisko, ale zwykle ma dolny próg, na przykład 5 zł. Przy zleceniu na 500 zł zapłacisz właśnie te 5 zł, czyli realnie 1 procent, a przy kupnie i sprzedaży 2 procent. Przy zleceniu na 5000 zł prowizja procentowa to 19,50 zł, czyli faktycznie 0,39 procent. Wniosek praktyczny: przy regularnym inwestowaniu małych kwot rzadsze i większe zlecenia są tańsze niż częste i drobne.',
    },
    faq: [
      {
        q: 'Czy pieniądze u brokera są bezpieczne?',
        a: 'U brokera podlegającego nadzorowi w Unii Europejskiej środki i papiery klientów są prawnie oddzielone od majątku firmy, a rachunki objęte systemem rekompensat. Kupione akcje czy ETF-y pozostają Twoją własnością nawet w razie upadłości brokera. Ryzyko rośnie u podmiotów spoza nadzoru unijnego, zwłaszcza tych reklamujących bardzo wysoką dźwignię.',
      },
      {
        q: 'Ile kosztuje broker?',
        a: 'Najważniejsze są trzy pozycje: prowizja od transakcji razem z jej kwotą minimalną, opłata za przewalutowanie przy aktywach zagranicznych oraz ewentualna opłata za prowadzenie rachunku. Przy małych, częstych zleceniach decyduje prowizja minimalna, przy zakupach zagranicznych zwykle przewalutowanie.',
      },
      {
        q: 'Czym różni się broker od domu maklerskiego?',
        a: 'W praktyce w Polsce to często to samo. Dom maklerski to formalna nazwa licencjonowanej instytucji świadczącej usługi maklerskie, a broker to potoczne określenie pośrednika. Różnica pojawia się przy firmach zagranicznych oferujących kontrakty CFD, które nazywają siebie brokerami, choć nie dają dostępu do realnych akcji.',
      },
      {
        q: 'Czy można mieć rachunki u kilku brokerów?',
        a: 'Tak i bywa to uzasadnione, na przykład gdy jeden ma dobrą ofertę IKE, a drugi tańszy dostęp do rynków zagranicznych. Kosztem jest rozproszenie portfela i trudniejsze rozliczenie podatkowe, zwłaszcza gdy jeden z brokerów nie wystawia PIT-8C.',
      },
    ],
    related: ['dom-maklerski', 'rachunek-maklerski', 'gpw'],
  },
  {
    slug: 'dom-maklerski',
    term: 'Dom maklerski',
    aliases: ['dom maklerski', 'domu maklerskiego', 'domem maklerskim', 'domy maklerskie'],
    short: 'Dom maklerski to instytucja finansowa uprawniona do prowadzenia rachunków maklerskich i pośredniczenia w obrocie papierami wartościowymi, nadzorowana przez KNF.',
    body: [
      'To polski odpowiednik brokera działający pod nadzorem Komisji Nadzoru Finansowego. Prowadzi rachunki, wykonuje zlecenia, często oferuje też konta IKE i IKZE oraz materiały edukacyjne.',
      'Nadzór KNF i polskie regulacje dają wyższy poziom ochrony i prostsze dochodzenie roszczeń niż w przypadku brokerów spoza Polski.',
    ],
    related: ['broker', 'rachunek-maklerski', 'gpw'],
  },
  {
    slug: 'gpw',
    term: 'GPW',
    aliases: ['GPW', 'Giełda Papierów Wartościowych', 'warszawska giełda', 'GPW w Warszawie'],
    short: 'GPW (Giełda Papierów Wartościowych w Warszawie) to główna giełda w Polsce, na której notowane są akcje spółek, obligacje i inne instrumenty.',
    body: [
      'GPW powstała w 1991 roku, po transformacji ustrojowej, a pierwsza sesja odbyła się w gmachu dawnego Komitetu Centralnego. Dziś jest największą giełdą w regionie Europy Środkowo-Wschodniej i podlega nadzorowi Komisji Nadzoru Finansowego.',
      'Handel odbywa się na kilku rynkach. Główny rynek regulowany skupia największe i najbardziej płynne spółki, spełniające najostrzejsze wymogi informacyjne. NewConnect to rynek alternatywny dla mniejszych, często młodych firm, z łagodniejszymi wymogami i wyraźnie wyższym ryzykiem. Catalyst służy obrotowi obligacjami, w tym korporacyjnymi i komunalnymi.',
      'Zachowanie rynku opisują indeksy. WIG20 obejmuje dwadzieścia największych spółek i to on jest najczęściej cytowany w mediach. mWIG40 i sWIG80 grupują średnie i mniejsze firmy. Najszerszy jest WIG, obejmujący zdecydowaną większość notowanych spółek. Jest tu jednak haczyk: WIG20 to indeks cenowy, czyli nie uwzględnia dywidend, przez co zaniża faktyczny zysk inwestora, w przeciwieństwie do WIG.',
      'Sesja przebiega w kilku fazach: od przyjmowania zleceń przed otwarciem, przez notowania ciągłe, po fixing zamknięcia, w którym ustalany jest kurs końcowy. Ta ostatnia faza bywa zaskoczeniem dla początkujących, bo cena zamknięcia potrafi odbiegać od ostatniej ceny z notowań ciągłych.',
      'Dla polskiego inwestora GPW ma dwie praktyczne zalety: kupujesz w złotych, więc nie ponosisz kosztu przewalutowania, a rozliczenie podatkowe jest prostsze, bo polskie biuro maklerskie wystawia PIT-8C. Ograniczeniem jest skala: warszawski rynek to niewielki ułamek światowej kapitalizacji i jest silnie skoncentrowany na kilku sektorach, dlatego oparcie na nim całego portfela oznacza słabą dywersyfikację geograficzną.',
    ],
    example: {
      title: 'Dlaczego WIG20 pokazuje mniej, niż faktycznie zarobiłeś',
      text: 'WIG20 jest indeksem cenowym i nie uwzględnia wypłacanych dywidend. Jeżeli spółki z indeksu wypłacają średnio 4 procent dywidendy rocznie, to inwestor trzymający ich akcje zarabia o te 4 punkty procentowe więcej rocznie, niż pokazuje wykres indeksu. Przez dekadę różnica staje się ogromna: sam indeks może wyglądać na stojący w miejscu, podczas gdy realny wynik z reinwestowanymi dywidendami jest wyraźnie dodatni. Do oceny własnych wyników służy WIG albo indeks dochodowy, nie WIG20.',
    },
    faq: [
      {
        q: 'Jak zacząć inwestować na GPW?',
        a: 'Potrzebujesz rachunku maklerskiego w biurze prowadzącym obrót na warszawskim parkiecie. Otwarcie odbywa się online i zajmuje zwykle kilkanaście minut. Po zasileniu rachunku składasz zlecenia kupna, wybierając spółkę, liczbę akcji i rodzaj zlecenia. Rozliczenie podatku przeprowadzisz na podstawie PIT-8C w zeznaniu PIT-38.',
      },
      {
        q: 'Czym różni się WIG od WIG20?',
        a: 'WIG20 obejmuje dwadzieścia największych spółek i jest indeksem cenowym, czyli pomija dywidendy. WIG obejmuje zdecydowaną większość notowanych spółek i jest indeksem dochodowym, uwzględniającym wypłacane dywidendy. Do porównywania własnych wyników trafniejszy jest WIG.',
      },
      {
        q: 'W jakich godzinach odbywa się sesja?',
        a: 'Sesja trwa w dni robocze i dzieli się na fazy: przyjmowanie zleceń przed otwarciem, notowania ciągłe stanowiące główną część dnia oraz fixing zamknięcia ustalający kurs końcowy. Aktualny harmonogram publikuje GPW, ponieważ szczegółowe godziny bywają korygowane.',
      },
      {
        q: 'Czy inwestowanie tylko na GPW wystarczy?',
        a: 'Do dywersyfikacji zwykle nie. Warszawski rynek odpowiada za niewielki ułamek globalnej kapitalizacji i jest mocno skoncentrowany na kilku sektorach, przede wszystkim finansowym i surowcowym. Portfel oparty wyłącznie na nim jest silnie uzależniony od kondycji jednej gospodarki, dlatego często uzupełnia się go ekspozycją na rynki zagraniczne.',
      },
    ],
    related: ['wig20', 'akcja', 'dom-maklerski'],
  },
  {
    slug: 'rachunek-maklerski',
    term: 'Rachunek maklerski',
    aliases: ['rachunek maklerski', 'rachunku maklerskiego', 'konto maklerskie', 'konta maklerskiego'],
    short: 'Rachunek maklerski to konto u brokera, na którym przechowujesz papiery wartościowe i środki przeznaczone na inwestycje oraz z którego składasz zlecenia.',
    body: [
      'Rachunek maklerski składa się w praktyce z dwóch części: pieniężnej, na której trzymasz gotówkę przeznaczoną na zakupy, oraz papierów wartościowych, gdzie zapisane są posiadane akcje, obligacje czy jednostki funduszy notowanych na giełdzie. Kupno przenosi środki z jednej części do drugiej, sprzedaż odwrotnie.',
      'Kupione papiery są Twoją własnością, a nie majątkiem brokera, i to jest podstawowa różnica wobec trzymania pieniędzy w banku. Broker jedynie prowadzi ich ewidencję, dlatego jego ewentualna upadłość nie oznacza utraty portfela, choć może oznaczać czasowe utrudnienia w dostępie.',
      'Rachunki dzielą się na trzy typy pod względem podatkowym. Zwykły rachunek nie daje żadnych ulg, więc od zrealizowanych zysków rozliczasz 19 procent podatku w zeznaniu PIT-38. Rachunek IKE zwalnia zyski z tego podatku, jeśli spełnisz warunki wieku i lat z wpłatami. Rachunek IKZE pozwala odliczać wpłaty od dochodu, a przy wypłacie stosuje niski zryczałtowany podatek. Nic nie stoi na przeszkodzie, żeby mieć wszystkie trzy naraz.',
      'Otwarcie jest zwykle bezpłatne i odbywa się w całości online, z potwierdzeniem tożsamości przelewem weryfikacyjnym lub wideoweryfikacją. Cały proces zajmuje zwykle kilkanaście minut, a rachunek bywa gotowy tego samego dnia.',
      'Przed wyborem sprawdza się cztery rzeczy: prowizję od transakcji razem z jej kwotą minimalną, opłatę za prowadzenie rachunku i warunki jej uniknięcia, koszt przewalutowania przy zakupach zagranicznych oraz to, czy broker wystawia PIT-8C, bo bez tego dokumentu rozliczenie roczne robisz w całości samodzielnie.',
    ],
    example: {
      title: 'Co decyduje o koszcie przy różnych kwotach',
      text: 'Przy zleceniu na 1000 zł i prowizji 0,39 procent z minimum 5 zł zapłacisz 5 zł, czyli 0,5 procent. Przy zleceniu na 10 000 zł zapłacisz 39 zł, czyli faktycznie 0,39 procent. Jeśli jednak kupujesz aktywa notowane w dolarze, a broker przewalutowuje po kursie z narzutem 0,5 procent, to przy tym samym zleceniu na 10 000 zł koszt przewalutowania wyniesie około 50 zł, czyli więcej niż sama prowizja. Przy inwestowaniu zagranicznym to zwykle przewalutowanie, a nie prowizja, jest największym kosztem.',
    },
    faq: [
      {
        q: 'Czy rachunek maklerski jest płatny?',
        a: 'Otwarcie jest zwykle darmowe. Opłata za prowadzenie w wielu biurach wynosi zero albo znika po spełnieniu prostego warunku, na przykład wykonaniu jednej transakcji w roku lub wyrażeniu zgody na elektroniczną korespondencję. Realne koszty pojawiają się przy transakcjach i przewalutowaniu.',
      },
      {
        q: 'Czy mogę mieć IKE i zwykły rachunek jednocześnie?',
        a: 'Tak i jest to typowe rozwiązanie. Na IKE trafia część długoterminowa, korzystająca ze zwolnienia podatkowego przy wypłacie po spełnieniu warunków, a na zwykłym rachunku trzymasz środki, po które możesz sięgnąć wcześniej. Limity wpłat na IKE dotyczą wyłącznie tego rachunku i nie ograniczają zwykłego.',
      },
      {
        q: 'Co się stanie z moimi akcjami, jeśli broker upadnie?',
        a: 'Papiery wartościowe pozostają Twoją własnością, ponieważ są ewidencjonowane odrębnie od majątku brokera. W praktyce zostają przeniesione do innego podmiotu prowadzącego rachunki. Środki pieniężne na rachunku objęte są dodatkowo systemem rekompensat do określonego limitu.',
      },
      {
        q: 'Czy broker rozliczy za mnie podatek?',
        a: 'Nie rozliczy, ale przy polskich biurach maklerskich otrzymasz do końca lutego formularz PIT-8C z zestawieniem przychodów i kosztów. Na jego podstawie samodzielnie składasz PIT-38. Brokerzy zagraniczni zwykle nie wystawiają PIT-8C, więc całe zestawienie transakcji przygotowujesz sam.',
      },
    ],
    related: ['broker', 'ike', 'ikze'],
  },
  {
    slug: 'oki',
    term: 'OKI',
    aliases: ['OKI', 'Osobiste Konto Inwestycyjne', 'konto OKI'],
    short: 'OKI (Osobiste Konto Inwestycyjne) to zapowiadane konto inwestycyjne z ulgą podatkową, mające uprościć długoterminowe inwestowanie dla Polaków.',
    body: [
      'OKI ma rozszerzyć paletę kont z preferencjami podatkowymi obok istniejących IKE i IKZE. Celem jest zachęcenie do samodzielnego oszczędzania na przyszłość przez korzystne traktowanie zysków kapitałowych.',
      'Szczegółowe zasady, takie jak limity i warunki wypłaty, zależą od ostatecznego kształtu przepisów. Idea jest zbliżona do IKE: nagrodzić długoterminowych, cierpliwych inwestorów.',
    ],
    related: ['ike', 'ikze', 'podatek-belki'],
  },
  {
    slug: 'ipo',
    term: 'IPO',
    aliases: ['IPO', 'pierwsza oferta publiczna', 'debiut giełdowy', 'Initial Public Offering'],
    short: 'IPO (Initial Public Offering) to pierwsza oferta publiczna, czyli debiut spółki na giełdzie, kiedy po raz pierwszy sprzedaje akcje szerokiemu gronu inwestorów.',
    body: [
      'Dzięki IPO firma pozyskuje kapitał na rozwój, a inwestorzy mogą kupić jej akcje. Debiuty bywają medialne i zmienne: kurs po pierwszym dniu potrafi mocno wahać się w obie strony.',
      'Udział w IPO wiąże się z podwyższonym ryzykiem, bo spółka ma krótką historię notowań i trudniej ją wycenić. Wymaga ostrożności i analizy dokumentów oferty.',
    ],
    related: ['akcja', 'gpw', 'analiza-fundamentalna'],
  },
  {
    slug: 'reit',
    term: 'REIT',
    aliases: ['REIT', 'REIT-y', 'fundusz REIT', 'Real Estate Investment Trust'],
    short: 'REIT to spółka lub fundusz inwestujący w nieruchomości na wynajem, którego akcje kupisz na giełdzie. Pozwala inwestować w nieruchomości bez kupowania mieszkania.',
    body: [
      'REIT-y zarabiają na czynszach i wzroście wartości nieruchomości, a większość zysku wypłacają w formie dywidendy. To sposób na ekspozycję na rynek nieruchomości z płynnością akcji.',
      'W Polsce ramy prawne dla REIT-ów wciąż się kształtują, ale można inwestować w zagraniczne REIT-y i ETF-y na nie. Dają dywersyfikację portfela poza akcje i obligacje.',
    ],
    related: ['dywidenda', 'dywersyfikacja', 'etf'],
  },
  {
    slug: 'tfi',
    term: 'TFI (fundusz inwestycyjny)',
    aliases: ['TFI', 'Towarzystwo Funduszy Inwestycyjnych', 'fundusz inwestycyjny', 'fundusze inwestycyjne'],
    short: 'TFI (Towarzystwo Funduszy Inwestycyjnych) to instytucja zarządzająca funduszami, które zbierają pieniądze wielu osób i inwestują je według określonej strategii.',
    body: [
      'Kupując jednostki uczestnictwa, oddajesz pieniądze pod zarząd specjalistom, którzy decydują, co znajdzie się w portfelu funduszu. Nie musisz sam wybierać spółek ani pilnować proporcji. Wartość jednostki (nazywana wyceną) zmienia się razem z wartością aktywów funduszu i jest publikowana zwykle raz dziennie, a nie na bieżąco jak notowania akcji.',
      'Za tę wygodę płaci się opłatą za zarządzanie, pobieraną co roku od całej zainwestowanej kwoty, niezależnie od wyniku. W polskich funduszach akcyjnych bywa ona rzędu kilku procent rocznie, podczas gdy tanie fundusze ETF na szerokie indeksy mieszczą się często poniżej 0,2 procent. Ta różnica nie brzmi dramatycznie w skali roku, ale przy horyzoncie kilkunastu lat decyduje o dziesiątkach procent końcowego kapitału, bo opłata jest pobierana także od zysków, które mogłyby dalej pracować.',
      'Do tego dochodzi kwestia skuteczności. Fundusz aktywny obiecuje pobicie rynku, ale badania długoterminowe pokazują konsekwentnie, że większości zarządzających nie udaje się to po uwzględnieniu opłat, a ci, którym udaje się w jednym okresie, rzadko powtarzają wynik w kolejnym. Dlatego przy inwestowaniu w szerokie, płynne rynki tani fundusz indeksowy jest zwykle rozsądniejszym punktem wyjścia.',
      'Fundusze TFI zachowują sens tam, gdzie trudno o dobry odpowiednik indeksowy: w niszowych klasach aktywów, na rynkach o ograniczonej dostępności albo w rozwiązaniach z dodatkową obsługą. Bywają też domyślną opcją w ramach produktów emerytalnych oferowanych przez banki.',
      'Przed zakupem sprawdza się trzy rzeczy: całkowite koszty w skali roku, faktyczny skład portfela (bo nazwa funduszu potrafi obiecywać co innego niż zawartość) oraz to, czy podobną ekspozycję da się kupić taniej przez fundusz notowany na giełdzie.',
    ],
    example: {
      title: 'Co robi z kapitałem różnica 2 punktów procentowych opłaty',
      text: 'Załóżmy 100 000 zł zainwestowane na 20 lat przy średniorocznym wyniku brutto 7 procent. Przy opłacie 0,2 procent rocznie efektywna stopa to około 6,8 procent, co daje w przybliżeniu 373 tys. zł. Przy opłacie 2,2 procent efektywna stopa spada do około 4,8 procent i kapitał rośnie do około 255 tys. zł. Ta sama strategia i ten sam rynek, a różnica sięga blisko 120 tys. zł i bierze się wyłącznie z kosztów.',
    },
    faq: [
      {
        q: 'Czym różni się fundusz TFI od ETF-u?',
        a: 'Fundusz TFI kupujesz i sprzedajesz po wycenie ustalanej zwykle raz dziennie, bezpośrednio u towarzystwa lub przez dystrybutora, a jego portfelem aktywnie zarządza zespół. ETF jest notowany na giełdzie i kupujesz go jak akcję, po bieżącej cenie, a najczęściej odwzorowuje indeks zamiast próbować go pobić. Główna praktyczna różnica to koszty roczne, zwykle wyraźnie niższe po stronie ETF-u.',
      },
      {
        q: 'Ile kosztuje fundusz inwestycyjny?',
        a: 'Podstawowa pozycja to opłata za zarządzanie pobierana rocznie od wartości inwestycji, niezależnie od tego, czy fundusz zarobił. Do tego dochodzić może opłata dystrybucyjna przy zakupie oraz opłata zmienna od wyniku. Całkowity koszt sprawdzisz we wskaźniku kosztów podanym w dokumencie informacyjnym funduszu.',
      },
      {
        q: 'Czy fundusze TFI się opłacają?',
        a: 'Zależy od alternatywy. Przy inwestowaniu w szerokie rynki rozwinięte tani fundusz indeksowy jest zwykle korzystniejszy, bo aktywne zarządzanie rzadko odrabia swoje koszty w długim terminie. Fundusz TFI bywa uzasadniony tam, gdzie nie ma sensownego odpowiednika indeksowego albo gdy jest to jedyna dostępna forma w ramach konkretnego produktu emerytalnego.',
      },
      {
        q: 'Czy pieniądze w funduszu są bezpieczne?',
        a: 'Aktywa funduszu są prawnie oddzielone od majątku towarzystwa i przechowuje je niezależny depozytariusz, więc kłopoty samego TFI nie oznaczają utraty wpłaconych środków. Nie chroni to natomiast przed ryzykiem rynkowym: wartość jednostki może spaść i fundusz nie gwarantuje zwrotu kapitału.',
      },
    ],
    related: ['etf', 'ter', 'akcja'],
  },
  {
    slug: 'wskaznik-c-z',
    term: 'Wskaźnik C/Z (P/E)',
    aliases: ['wskaźnik C/Z', 'C/Z', 'P/E', 'wskaźnik cena/zysk', 'cena do zysku'],
    short: 'Wskaźnik C/Z (cena do zysku, ang. P/E) pokazuje, ile płacisz za każdą złotówkę rocznego zysku spółki. Pomaga ocenić, czy akcja jest tania, czy droga.',
    body: [
      'Liczy się go, dzieląc cenę akcji przez zysk na akcję. Wysokie C/Z oznacza, że inwestorzy oczekują szybkiego wzrostu zysków, a niskie może wskazywać okazję albo problemy spółki.',
      'C/Z porównuje się w obrębie tej samej branży i z historią spółki, nie w oderwaniu. To jedno z podstawowych narzędzi analizy fundamentalnej, ale samo w sobie nie daje pełnego obrazu.',
    ],
    related: ['analiza-fundamentalna', 'akcja', 'kapitalizacja-rynkowa'],
  },
  {
    slug: 'kapitalizacja-rynkowa',
    term: 'Kapitalizacja rynkowa',
    aliases: ['kapitalizacja rynkowa', 'kapitalizacja', 'kapitalizacji', 'market cap'],
    short: 'Kapitalizacja rynkowa to łączna wartość wszystkich akcji spółki, czyli cena akcji pomnożona przez ich liczbę. Mówi, ile rynek wycenia całą firmę.',
    body: [
      'Dzieli spółki na duże (large cap), średnie (mid cap) i małe (small cap). Duże spółki są zwykle stabilniejsze, a małe dają wyższy potencjał wzrostu przy większym ryzyku.',
      'Indeksy takie jak S&P 500 czy WIG20 ważą spółki właśnie kapitalizacją: im większa firma, tym większy jej udział w indeksie.',
    ],
    related: ['akcja', 'indeks-gieldowy', 'wskaznik-c-z'],
  },
  {
    slug: 'rebalancing',
    term: 'Rebalancing',
    aliases: ['rebalancing', 'rebalansowanie', 'równoważenie portfela'],
    short: 'Rebalancing to okresowe przywracanie portfela do założonych proporcji aktywów, na przykład 70% akcji i 30% obligacji, gdy ruchy rynku je rozjadą.',
    body: [
      'Portfel rozjeżdża się sam, bez żadnej Twojej decyzji. Jeżeli akcje rosną szybciej niż obligacje, ich udział pęcznieje ponad założenia, a wraz z nim ryzyko całości. Po kilku dobrych latach portfel zaplanowany jako umiarkowany potrafi stać się agresywny, i to dokładnie w momencie, gdy wyceny są najwyższe.',
      'Rebalancing przywraca zamierzone proporcje: sprzedajesz część tego, czego jest za dużo, i dokupujesz to, czego brakuje. Efektem ubocznym jest mechanizm, który wymusza sprzedaż drożejących aktywów i zakup tanich, czyli dokładnie odwrotnie, niż podpowiadają emocje.',
      'Stosuje się dwa podejścia. Kalendarzowe polega na sprawdzeniu proporcji w ustalonym terminie, zwykle raz albo dwa razy w roku. Progowe uruchamia działanie dopiero wtedy, gdy udział klasy aktywów odchyli się od planu o określoną wielkość, na przykład 5 punktów procentowych. Pierwsze jest prostsze, drugie reaguje na to, co faktycznie robi rynek.',
      'Najczęstszy błąd to robienie tego zbyt często. Każda transakcja kosztuje prowizję, a przy rachunku bez tarczy podatkowej sprzedaż z zyskiem uruchamia podatek, którego przy trzymaniu nie zapłaciłbyś wcale. Rebalancing kwartalny czy miesięczny zwykle kosztuje więcej, niż daje.',
      'Tańszy wariant polega na rebalancingu wpłatami. Zamiast sprzedawać to, czego jest za dużo, kierujesz kolejne wpłaty wyłącznie do niedoważonej części portfela. Nie generuje to podatku ani kosztów sprzedaży i przy regularnym dokładaniu pieniędzy często wystarcza do utrzymania proporcji.',
    ],
    example: {
      title: 'Jak portfel przestaje być tym, co zaplanowałeś',
      text: 'Zaczynasz od 100 000 zł w proporcji 70 procent akcji i 30 procent obligacji, czyli 70 000 i 30 000 zł. Po roku, w którym akcje zyskały 25 procent, a obligacje 3 procent, masz 87 500 zł w akcjach i 30 900 zł w obligacjach, razem 118 400 zł. Udział akcji wynosi teraz około 74 procent zamiast 70. Po drugim takim roku sięga już 77,5 procent. Nie zmieniłeś strategii, a ryzyko portfela rośnie samo, bo wygrywająca część rośnie szybciej od reszty.',
    },
    faq: [
      {
        q: 'Jak często robić rebalancing?',
        a: 'Dla większości inwestorów wystarczy raz w roku albo po przekroczeniu ustalonego progu odchylenia, na przykład 5 punktów procentowych. Częstsze poprawianie proporcji podnosi koszty transakcyjne i podatkowe, a badania nad różnymi częstotliwościami nie pokazują przewagi rebalancingu kwartalnego nad rocznym.',
      },
      {
        q: 'Czy rebalancing zwiększa zyski?',
        a: 'Nie jest to jego głównym zadaniem i w długich okresach silnej hossy potrafi wynik obniżyć, bo ogranicza udział najlepiej rosnącej części portfela. Jego rolą jest kontrola ryzyka, czyli pilnowanie, żeby portfel pozostał tym, na co się godziłeś, a nie maksymalizacja stopy zwrotu.',
      },
      {
        q: 'Czy rebalancing kosztuje podatkowo?',
        a: 'Na zwykłym rachunku tak: sprzedaż z zyskiem oznacza 19 procent podatku, płaconego wcześniej, niż byłoby to konieczne. Na rachunkach IKE i IKZE problem nie występuje, dlatego to właśnie tam rebalancing przez sprzedaż jest najtańszy.',
      },
      {
        q: 'Czy da się rebalansować bez sprzedawania?',
        a: 'Tak i zwykle jest to najlepsze rozwiązanie przy regularnym oszczędzaniu. Kolejne wpłaty kierujesz w całości do tej części portfela, której jest za mało, aż proporcje wrócą do planu. Nie płacisz wtedy ani prowizji od sprzedaży, ani podatku od zysku.',
      },
    ],
    related: ['alokacja-aktywow', 'dywersyfikacja', 'obligacja'],
  },
  {
    slug: 'alokacja-aktywow',
    term: 'Alokacja aktywów',
    aliases: ['alokacja aktywów', 'alokacja', 'alokacji aktywów', 'podział portfela'],
    short: 'Alokacja aktywów to sposób, w jaki dzielisz kapitał między klasy aktywów: akcje, obligacje, gotówkę, surowce. To jedna z najważniejszych decyzji inwestora.',
    body: [
      'Badania nad wynikami portfeli konsekwentnie pokazują to samo: o zmienności i o większości długoterminowego wyniku decyduje podział między klasy aktywów, a nie wybór konkretnych spółek ani moment wejścia. Początkujący inwestor poświęca zwykle całą uwagę temu, co kupić, podczas gdy ważniejsze jest, w jakich proporcjach.',
      'Punktem wyjścia jest horyzont, czyli za ile lat te pieniądze będą potrzebne. Kapitał na wydatek za dwa lata nie powinien stać w akcjach, bo dwuletnie okno bez straty nie jest gwarantowane. Kapitał na trzydzieści lat trzymany w gotówce traci realnie przez inflację, mimo że nominalnie nie spada. Ryzyko zmienia więc znaczenie razem z horyzontem.',
      'Drugim kryterium jest odporność psychiczna, a nie deklarowana skłonność do ryzyka. Miarą praktyczną jest pytanie, przy jakim spadku wartości portfela zaczniesz podejmować decyzje wbrew planowi. Alokacja, którą wytrzymasz w bessie, jest lepsza od teoretycznie optymalnej, z której uciekniesz na dnie.',
      'Popularna zasada mówi, żeby udział obligacji odpowiadał mniej więcej wiekowi inwestora, a reszta przypadała akcjom. To uproszczenie, które ignoruje wielkość kapitału, stabilność dochodów i pozostałe źródła zabezpieczenia, ale bywa użytecznym punktem startowym dla kogoś, kto nie wie, od czego zacząć.',
      'Alokacja nie jest decyzją jednorazową. Rynek sam ją rozjeżdża, bo szybciej rosnące składniki zwiększają swój udział, więc raz do roku przywraca się zamierzone proporcje. Zmienia się ją świadomie wtedy, gdy zmienia się horyzont albo sytuacja życiowa, a nie pod wpływem bieżących nastrojów rynkowych.',
    ],
    example: {
      title: 'Ta sama strata, dwie różne alokacje',
      text: 'Rynek akcji spada o 40 procent. Portfel złożony w całości z akcji traci 40 procent: ze 100 000 zł zostaje 60 000 zł. Portfel w proporcji 60 procent akcji i 40 procent obligacji, przy założeniu, że obligacje utrzymały wartość, traci 24 procent, czyli zostaje 76 000 zł. Pierwszy portfel potrzebuje wzrostu o około 67 procent, żeby wrócić do punktu wyjścia, drugi o około 32 procent. Cena za tę odporność jest widoczna dopiero w hossie, gdy portfel mieszany rośnie wolniej.',
    },
    faq: [
      {
        q: 'Jaka alokacja jest odpowiednia dla mnie?',
        a: 'Zależy przede wszystkim od horyzontu, czyli terminu, w którym pieniądze będą potrzebne, oraz od tego, jaki spadek wartości wytrzymasz bez łamania planu. Im krótszy horyzont, tym większy udział instrumentów bezpiecznych. Przy horyzoncie kilkudziesięcioletnim przeważa zwykle część akcyjna, bo to ona daje realny wzrost ponad inflację.',
      },
      {
        q: 'Czy zasada „udział obligacji równy wiekowi" ma sens?',
        a: 'Jako punkt wyjścia tak, jako reguła bezwzględna nie. Nie uwzględnia wielkości kapitału, stabilności dochodów, innych zabezpieczeń emerytalnych ani indywidualnej odporności na wahania. Traktuje się ją jako szkic do skorygowania, a nie gotową odpowiedź.',
      },
      {
        q: 'Jak często zmieniać alokację?',
        a: 'Samych założeń nie zmienia się często, bo wynikają z horyzontu i sytuacji życiowej, a te zmieniają się rzadko. Natomiast raz w roku przywraca się zamierzone proporcje, ponieważ rynek rozjeżdża je samoczynnie. Zmiana alokacji pod wpływem bieżących nastrojów rynkowych jest najczęstszym sposobem na kupowanie drogo i sprzedawanie tanio.',
      },
      {
        q: 'Czy alokacja ważniejsza od wyboru spółek?',
        a: 'Dla większości inwestorów tak. Badania portfeli wskazują, że to podział między klasy aktywów odpowiada za większość zmienności i długoterminowego wyniku. Wybór pojedynczych spółek ma znaczenie, ale przy szerokiej dywersyfikacji jego wpływ na wynik całości jest mniejszy niż wpływ proporcji akcji do obligacji.',
      },
    ],
    related: ['dywersyfikacja', 'rebalancing', 'obligacja'],
  },
  {
    slug: 'lokata',
    term: 'Lokata',
    aliases: ['lokata', 'lokaty', 'lokatę', 'lokatą', 'lokat', 'lokacie'],
    short: 'Lokata to umowa z bankiem, w której powierzasz pieniądze na określony czas w zamian za ustalone z góry oprocentowanie. Po zakończeniu odbierasz kapitał z odsetkami.',
    body: [
      'Mechanizm jest prosty: blokujesz pieniądze na ustalony okres, a bank z góry zobowiązuje się do konkretnego oprocentowania. Ta pewność jest główną zaletą lokaty i jednocześnie źródłem jej ograniczeń, bo w zamian tracisz dostęp do środków przed terminem.',
      'Bezpieczeństwo zapewnia Bankowy Fundusz Gwarancyjny. Depozyty do równowartości 100 000 euro na osobę w jednym banku są objęte gwarancją, co oznacza, że nawet w razie upadłości banku odzyskasz swoje pieniądze wraz z naliczonymi odsetkami. Limit liczy się osobno dla każdego banku, więc rozbicie większej kwoty na kilka instytucji zwiększa objętą gwarancją sumę.',
      'Podstawowa pułapka lokat nie leży w ryzyku, tylko w inflacji. Liczy się nie oprocentowanie nominalne, ale realne, czyli oprocentowanie po odjęciu inflacji i podatku. Gdy inflacja przewyższa oprocentowanie po opodatkowaniu, kapitał rośnie na papierze, a jednocześnie traci siłę nabywczą. Lokata chroni wtedy przed utratą nominalną, nie przed utratą wartości.',
      'Od odsetek bank automatycznie pobiera 19 procent podatku, więc na konto trafia kwota już pomniejszona i nie musisz nic wykazywać w rocznym zeznaniu. Zerwanie lokaty przed terminem zwykle oznacza utratę części lub całości odsetek, przy czym kapitał pozostaje nienaruszony.',
      'Lokata sprawdza się jako miejsce na pieniądze o znanym terminie wykorzystania: wkład własny za rok, zaplanowany wydatek, część poduszki finansowej. Do budowania kapitału na kilkanaście lat jest narzędziem słabym, bo z definicji nie daje udziału we wzroście gospodarczym.',
    ],
    example: {
      title: 'Realne oprocentowanie, czyli ile faktycznie zostaje',
      text: 'Lokata na 10 000 zł z oprocentowaniem 5 procent w skali roku daje 500 zł odsetek brutto. Podatek 19 procent zabiera 95 zł, więc na rękę zostaje 405 zł, co odpowiada 4,05 procent netto. Jeżeli w tym samym czasie inflacja wyniosła 4 procent, realny zysk to około 0,05 procent, czyli praktycznie zero. Przy inflacji 6 procent kapitał urósł nominalnie do 10 405 zł, ale jego siła nabywcza spadła o blisko 2 procent.',
    },
    faq: [
      {
        q: 'Czy pieniądze na lokacie są bezpieczne?',
        a: 'Depozyty w bankach działających w Polsce są objęte gwarancją Bankowego Funduszu Gwarancyjnego do równowartości 100 000 euro na osobę w jednym banku, razem z naliczonymi odsetkami. Powyżej tego limitu w jednej instytucji gwarancja nie obowiązuje, dlatego większe kwoty rozkłada się na kilka banków.',
      },
      {
        q: 'Czy od lokaty trzeba rozliczyć podatek?',
        a: 'Nie musisz nic robić. Bank pobiera 19 procent podatku od odsetek automatycznie przy wypłacie i odprowadza go do urzędu, a na konto wpływa kwota netto. Odsetek z lokaty nie wykazuje się w rocznym zeznaniu podatkowym.',
      },
      {
        q: 'Co się stanie, jeśli zerwę lokatę przed terminem?',
        a: 'Wpłacony kapitał zawsze otrzymujesz w całości, bo lokata nie może przynieść straty nominalnej. Tracisz natomiast odsetki: w zależności od umowy całość albo ich część naliczoną do dnia zerwania. Warunki wcześniejszego zerwania są zapisane w umowie i różnią się między bankami.',
      },
      {
        q: 'Lokata czy konto oszczędnościowe?',
        a: 'Lokata daje oprocentowanie ustalone z góry na cały okres, ale kosztem blokady środków. Konto oszczędnościowe pozwala wypłacać pieniądze w każdej chwili, za to bank może zmienić oprocentowanie w dowolnym momencie. Do środków, po które możesz sięgnąć nagle, lepiej pasuje konto oszczędnościowe, do kwot o znanym terminie lokata.',
      },
    ],
    related: ['konto-oszczednosciowe', 'obligacje-skarbowe', 'podatek-belki'],
  },
  {
    slug: 'konto-oszczednosciowe',
    term: 'Konto oszczędnościowe',
    aliases: ['konto oszczędnościowe', 'konta oszczędnościowego', 'kontem oszczędnościowym', 'konta oszczędnościowe'],
    short: 'Konto oszczędnościowe łączy oprocentowanie z elastycznością: pieniądze możesz wypłacić w każdej chwili, choć często z limitem darmowych przelewów w miesiącu.',
    body: [
      'W odróżnieniu od lokaty nie blokujesz środków na sztywno. Oprocentowanie jest zmienne, bank może je obniżyć w dowolnym momencie, a najwyższe stawki to zwykle promocje dla nowych środków.',
      'To dobre miejsce na poduszkę finansową: pieniądze pracują, a jednocześnie masz do nich natychmiastowy dostęp. Od odsetek pobierany jest podatek Belki.',
    ],
    related: ['lokata', 'poduszka-finansowa', 'inflacja'],
  },
  {
    slug: 'rrso',
    term: 'RRSO',
    aliases: ['RRSO', 'Rzeczywista Roczna Stopa Oprocentowania'],
    short: 'RRSO (Rzeczywista Roczna Stopa Oprocentowania) to całkowity roczny koszt kredytu w procentach, uwzględniający nie tylko odsetki, ale też prowizje i inne opłaty.',
    body: [
      'To najuczciwszy wskaźnik do porównywania ofert kredytów. Dwie pożyczki o tym samym oprocentowaniu mogą mieć różne RRSO, jeśli różnią się prowizją czy ubezpieczeniem. Im niższe RRSO, tym taniej.',
      'Banki mają obowiązek podawać RRSO w reklamach i umowach. Uwaga: przy bardzo krótkich pożyczkach RRSO potrafi wyglądać ekstremalnie wysoko z powodu sposobu liczenia w skali roku.',
    ],
    related: ['kredyt-gotowkowy', 'kredyt-hipoteczny', 'marza-kredytu'],
  },
  {
    slug: 'bik',
    term: 'BIK',
    aliases: ['BIK', 'Biuro Informacji Kredytowej', 'raport BIK'],
    short: 'BIK (Biuro Informacji Kredytowej) to instytucja gromadząca historię kredytową Polaków. Banki sprawdzają w nim, jak spłacałeś dotychczasowe zobowiązania.',
    body: [
      'Twoja historia w BIK wpływa na scoring i decyzję kredytową. Terminowo spłacane kredyty budują pozytywną historię, opóźnienia ją psują. Co ważne, brak jakiejkolwiek historii też bywa problemem, bo bank nie ma Cię jak ocenić.',
      'Masz prawo raz na pół roku bezpłatnie sprawdzić swój raport BIK. Ten przegląd pozwala wyłapać błędy lub ślady prób wyłudzenia kredytu na Twoje dane.',
    ],
    related: ['scoring', 'zdolnosc-kredytowa', 'kredyt-hipoteczny'],
  },
  {
    slug: 'scoring',
    term: 'Scoring kredytowy',
    aliases: ['scoring', 'scoringu', 'scoring kredytowy', 'ocena punktowa'],
    short: 'Scoring kredytowy to punktowa ocena Twojej wiarygodności jako kredytobiorcy, liczona na podstawie historii w BIK i danych z wniosku.',
    body: [
      'Im wyższy scoring, tym większa szansa na kredyt i lepsze warunki. Na ocenę wpływają terminowość spłat, liczba zobowiązań, wykorzystanie limitów na kartach i długość historii kredytowej.',
      'Scoring nie jest stały: poprawia się z czasem, jeśli spłacasz terminowo i nie wnioskujesz o zbyt wiele kredytów naraz. Każdy wniosek zostawia ślad zapytania w BIK.',
    ],
    related: ['bik', 'zdolnosc-kredytowa'],
  },
  {
    slug: 'zdolnosc-kredytowa',
    term: 'Zdolność kredytowa',
    aliases: ['zdolność kredytowa', 'zdolności kredytowej', 'zdolnością kredytową'],
    short: 'Zdolność kredytowa to maksymalna kwota kredytu, jaką bank jest skłonny Ci pożyczyć, oceniona na podstawie dochodów, wydatków i istniejących zobowiązań.',
    body: [
      'Bank liczy, ile zostaje Ci po odjęciu kosztów życia i rat innych kredytów, i sprawdza, czy udźwigniesz nową ratę. Wpływ mają dochody, forma zatrudnienia, liczba osób na utrzymaniu i historia w BIK.',
      'Zdolność rośnie wraz z dochodami i spadkiem zadłużenia, a maleje przy wysokich stopach procentowych, bo raty są wtedy większe. Niewykorzystane karty kredytowe i limity też ją obniżają.',
    ],
    related: ['bik', 'scoring', 'kredyt-hipoteczny'],
  },
  {
    slug: 'kredyt-hipoteczny',
    term: 'Kredyt hipoteczny',
    aliases: ['kredyt hipoteczny', 'kredytu hipotecznego', 'kredytem hipotecznym', 'hipoteka', 'hipoteki'],
    short: 'Kredyt hipoteczny to długoterminowy kredyt na zakup nieruchomości, zabezpieczony hipoteką na tej nieruchomości. Zwykle spłacany przez 20-30 lat.',
    body: [
      'Oprocentowanie to suma stawki bazowej (WIBOR, docelowo nowy wskaźnik) i marży banku, albo stała stopa na kilka lat. Do tego dochodzą prowizja, ubezpieczenia i wymagany wkład własny, zwykle co najmniej 10-20% wartości nieruchomości.',
      'Całkowity koszt najlepiej porównywać przez RRSO. Przy 25-letnim kredycie suma odsetek potrafi przewyższyć pożyczoną kwotę, dlatego nadpłaty i wybór dobrego momentu mają duże znaczenie.',
    ],
    related: ['wibor', 'rrso', 'wklad-wlasny', 'marza-kredytu'],
    calc: { href: '/kalkulator-hipoteczny', label: 'Kalkulator hipoteczny' },
  },
  {
    slug: 'kredyt-gotowkowy',
    term: 'Kredyt gotówkowy',
    aliases: ['kredyt gotówkowy', 'kredytu gotówkowego', 'pożyczka gotówkowa'],
    short: 'Kredyt gotówkowy to kredyt na dowolny cel, bez zabezpieczenia nieruchomością, zwykle na krótszy okres i z wyższym oprocentowaniem niż hipoteczny.',
    body: [
      'Dostajesz pieniądze do dowolnego celu i spłacasz je w miesięcznych ratach, bez zabezpieczenia na majątku. Bank nie ma czego przejąć w razie kłopotów ze spłatą, więc ryzyko wlicza w cenę. Stąd oprocentowanie wyraźnie wyższe niż przy kredycie hipotecznym, przy jednocześnie krótszym okresie spłaty.',
      'Do porównywania ofert służy wyłącznie RRSO, czyli rzeczywista roczna stopa oprocentowania. Uwzględnia ona nie tylko odsetki, ale też prowizję i inne koszty obowiązkowe, sprowadzając wszystko do jednej liczby. Samo oprocentowanie nominalne nic nie mówi, bo bank może je obniżyć i odzyskać różnicę w prowizji.',
      'Największą pułapką są produkty dołączane do kredytu. Ubezpieczenie na życie czy od utraty pracy bywa warunkiem niższego oprocentowania, ale jego składka potrafi przewyższyć oszczędność. Jeżeli koszt jest obowiązkowy, wchodzi do RRSO, dlatego porównanie po tym wskaźniku ujawnia takie konstrukcje.',
      'Prawo ogranicza, ile bank może doliczyć poza odsetkami. Ustawa o kredycie konsumenckim wyznacza maksymalny limit kosztów pozaodsetkowych, czyli prowizji i opłat, zależny od kwoty i okresu kredytowania. Nie chroni to jednak przed kredytem po prostu drogim w warstwie odsetkowej.',
      'Masz też prawo do wcześniejszej spłaty w każdej chwili, a bank musi wtedy proporcjonalnie zwrócić koszty przypadające na skrócony okres, w tym część prowizji. To istotne przy konsolidacji: łączenie kilku zobowiązań w jedno ma sens tylko wtedy, gdy realnie obniża RRSO i całkowitą kwotę do zapłaty, a nie samą wysokość raty przez wydłużenie okresu.',
    ],
    example: {
      title: 'Dlaczego niższa rata bywa droższym kredytem',
      text: 'Kredyt 30 000 zł na 3 lata przy oprocentowaniu 12 procent daje ratę około 996 zł i łączny koszt odsetek około 5870 zł. Ten sam kredyt rozłożony na 7 lat to rata około 530 zł, czyli o 466 zł mniej miesięcznie, ale odsetki rosną do około 14 485 zł. Rata spadła o niemal połowę, a zapłacisz prawie dwa i pół raza więcej. Przy ocenie oferty patrz więc na całkowitą kwotę do zapłaty, nie na wysokość raty.',
    },
    faq: [
      {
        q: 'Czym różni się kredyt gotówkowy od hipotecznego?',
        a: 'Kredyt gotówkowy nie wymaga zabezpieczenia na nieruchomości, jest udzielany na dowolny cel i na krótszy okres, zwykle do kilku lat. Kredyt hipoteczny jest zabezpieczony na mieszkaniu lub domu, przez co bank ponosi mniejsze ryzyko i oferuje znacznie niższe oprocentowanie, ale procedura jest dłuższa, a okres spłaty liczony w dekadach.',
      },
      {
        q: 'Na co patrzeć przy porównywaniu ofert?',
        a: 'Na RRSO oraz na całkowitą kwotę do zapłaty. RRSO sprowadza odsetki, prowizję i koszty obowiązkowe do jednej wartości, dzięki czemu oferty są porównywalne. Sama rata jest myląca, bo można ją obniżyć wydłużeniem okresu, co podnosi łączny koszt.',
      },
      {
        q: 'Czy można spłacić kredyt gotówkowy wcześniej?',
        a: 'Tak, w dowolnym momencie. Bank ma wtedy obowiązek proporcjonalnie obniżyć całkowity koszt kredytu, łącznie ze zwrotem części pobranej prowizji, przypadającej na okres, o który spłatę skrócono.',
      },
      {
        q: 'Czy konsolidacja zawsze się opłaca?',
        a: 'Nie. Opłaca się wtedy, gdy nowy kredyt ma realnie niższe RRSO i niższą całkowitą kwotę do zapłaty niż suma dotychczasowych zobowiązań. Częstym mechanizmem jest obniżenie raty przez wydłużenie okresu spłaty, co poprawia płynność miesięczną, ale podnosi łączny koszt.',
      },
    ],
    related: ['rrso', 'kredyt-hipoteczny', 'zdolnosc-kredytowa'],
    calc: { href: '/kalkulator/kredyt-gotowkowy', label: 'Kalkulator kredytu gotówkowego' },
  },
  {
    slug: 'marza-kredytu',
    term: 'Marża kredytu',
    aliases: ['marża kredytu', 'marża banku', 'marży kredytu', 'marża'],
    short: 'Marża kredytu to stała część oprocentowania, którą bank dolicza do stawki bazowej (np. WIBOR). To zarobek banku, niezmienny przez cały okres kredytu.',
    body: [
      'Przy kredycie o zmiennym oprocentowaniu rata to stawka bazowa plus marża. Stawka bazowa się zmienia, marża nie. Dlatego niska marża to jedna z najważniejszych rzeczy do wynegocjowania, bo zostaje z Tobą na 25-30 lat.',
      'Banki obniżają marżę w zamian za dodatkowe produkty (konto, karta, ubezpieczenie). Policz, czy te produkty nie kosztują więcej, niż wynosi oszczędność na marży.',
    ],
    related: ['kredyt-hipoteczny', 'wibor', 'rrso'],
  },
  {
    slug: 'raty-rowne',
    term: 'Raty równe',
    aliases: ['raty równe', 'rata równa', 'raty annuitetowe', 'raty stałe'],
    short: 'Raty równe (annuitetowe) to sposób spłaty kredytu, w którym każda miesięczna rata ma tę samą wysokość przez cały okres (przy stałym oprocentowaniu).',
    body: [
      'Na początku w racie dominują odsetki, a spłata kapitału jest niewielka, z czasem proporcje się odwracają. Raty równe dają niższą ratę na starcie niż malejące, ale wyższy łączny koszt odsetek.',
      'To najpopularniejszy wariant, bo przewidywalny i łatwiejszy do udźwignięcia na początku. Przy zmiennym oprocentowaniu wysokość raty i tak zmienia się wraz ze stawką bazową.',
    ],
    related: ['raty-malejace', 'kredyt-hipoteczny'],
  },
  {
    slug: 'raty-malejace',
    term: 'Raty malejące',
    aliases: ['raty malejące', 'rata malejąca', 'raty kapitałowe'],
    short: 'Raty malejące to sposób spłaty, w którym co miesiąc spłacasz stałą część kapitału plus odsetki od malejącego salda, więc rata z czasem maleje.',
    body: [
      'Na początku raty są wyższe niż przy równych, ale szybciej spłacasz kapitał, dzięki czemu łączny koszt odsetek jest niższy. To opłaca się osobom o wyższej zdolności kredytowej.',
      'Wadą jest wyższe obciążenie budżetu na starcie. Z czasem rata spada, co bywa wygodne w planowaniu długoterminowym.',
    ],
    related: ['raty-rowne', 'kredyt-hipoteczny'],
  },
  {
    slug: 'wklad-wlasny',
    term: 'Wkład własny',
    aliases: ['wkład własny', 'wkładu własnego', 'wkładem własnym'],
    short: 'Wkład własny to część wartości nieruchomości, którą pokrywasz z własnych środków przy kredycie hipotecznym. Reszta to kredyt.',
    body: [
      'Zalecany poziom wkładu własnego to 20 procent wartości nieruchomości. Banki dopuszczają zwykle 10 procent, ale wtedy wymagają dodatkowego zabezpieczenia, najczęściej ubezpieczenia niskiego wkładu własnego, doliczanego do marży albo raty do czasu, aż zadłużenie spadnie poniżej progu.',
      'Podstawą wyliczenia jest wartość z wyceny rzeczoznawcy, a nie cena z umowy. Gdy wycena wypadnie niżej niż to, co płacisz, różnicę musisz pokryć z własnych środków ponad zakładany wkład. To jedna z częstszych niespodzianek na finiszu procedury kredytowej.',
      'Wkładem nie muszą być wyłącznie oszczędności. Bank uznaje zwykle działkę, na której ma powstać dom, wcześniej wniesione zadatki, środki z zamknięcia innego kredytu mieszkaniowego, a czasem darowiznę od rodziny. Nie uznaje natomiast pieniędzy pochodzących z pożyczki, bo to podniosłoby Twoje zadłużenie zamiast je ograniczyć.',
      'Poza formalnym progiem wkład ma znaczenie ekonomiczne. Każde 10 000 zł włożone z własnej kieszeni to 10 000 zł, od których nie zapłacisz odsetek przez cały okres kredytowania. Przy oprocentowaniu rzędu 7 procent i horyzoncie dwudziestu lat oznacza to oszczędność wyraźnie większą niż sama wpłacona kwota.',
      'Jest jednak granica rozsądku. Wydanie na wkład wszystkich oszczędności, łącznie z poduszką finansową, jest ryzykowne: pierwsza awaria czy utrata dochodu zmusza wtedy do sięgnięcia po drogi kredyt konsumpcyjny. Poduszkę zostawia się poza wkładem, nawet kosztem nieco gorszych warunków kredytu.',
    ],
    example: {
      title: 'Ile realnie oszczędza wyższy wkład własny',
      text: 'Mieszkanie za 500 000 zł. Przy wkładzie 10 procent bierzesz kredyt 450 000 zł, przy wkładzie 20 procent kredyt 400 000 zł. Przy oprocentowaniu 7 procent na 25 lat rata wynosi odpowiednio około 3181 zł i 2827 zł, a łączna suma odsetek około 504 tys. zł wobec 448 tys. zł. Dodatkowe 50 000 zł wkładu obniża więc odsetki o około 56 tys. zł, czyli oszczędzasz nieco więcej, niż wynosi sama wpłacona kwota. Do tego dochodzi brak ubezpieczenia niskiego wkładu i zwykle niższa marża.',
    },
    faq: [
      {
        q: 'Ile wynosi minimalny wkład własny?',
        a: 'Zalecany poziom to 20 procent wartości nieruchomości. W praktyce większość banków akceptuje 10 procent, warunkując to dodatkowym zabezpieczeniem w postaci ubezpieczenia niskiego wkładu, które podnosi koszt kredytu do momentu obniżenia zadłużenia poniżej progu.',
      },
      {
        q: 'Co może być wkładem własnym poza gotówką?',
        a: 'Bank uznaje najczęściej działkę pod budowę domu, wpłacone wcześniej zadatki i zaliczki, środki z książeczki mieszkaniowej oraz darowiznę od najbliższej rodziny. Nie uzna pieniędzy z pożyczki czy kredytu konsumpcyjnego, ponieważ zwiększałyby one Twoje zadłużenie zamiast obniżać ryzyko banku.',
      },
      {
        q: 'Czy opłaca się wpłacić wyższy wkład własny?',
        a: 'Zwykle tak, bo każda złotówka wkładu to złotówka, od której nie płacisz odsetek przez cały okres kredytowania, a wyższy wkład oznacza też niższą marżę i brak ubezpieczenia niskiego wkładu. Granicą jest poduszka finansowa: wydanie na wkład wszystkich oszczędności zostawia Cię bez zabezpieczenia na nagłe wydatki.',
      },
      {
        q: 'Co jeśli wycena banku jest niższa od ceny mieszkania?',
        a: 'Bank liczy kredyt i wskaźnik LTV od wartości z wyceny, nie od ceny transakcyjnej. Różnicę między jedną a drugą musisz pokryć własnymi środkami, ponad planowany wkład. Dlatego przy napiętym budżecie ostrożniej jest założyć rezerwę na taki scenariusz.',
      },
    ],
    related: ['kredyt-hipoteczny', 'ltv', 'marza-kredytu'],
  },
  {
    slug: 'ltv',
    term: 'LTV',
    aliases: ['LTV', 'wskaźnik LTV', 'Loan to Value'],
    short: 'LTV (Loan to Value) to stosunek kwoty kredytu do wartości nieruchomości, podawany w procentach. Pokazuje, jaką część zakupu finansujesz kredytem.',
    body: [
      'Wskaźnik liczy się prosto: kwota kredytu podzielona przez wartość nieruchomości. Kredyt 360 000 zł na mieszkanie warte 400 000 zł daje LTV 90 procent, co oznacza wkład własny na poziomie 10 procent. Im niższe LTV, tym mniejsze ryzyko banku, bo w razie problemów ze spłatą łatwiej odzyskać należność ze sprzedaży nieruchomości.',
      'Wartość nieruchomości do wyliczenia ustala bank na podstawie wyceny rzeczoznawcy, a nie ceny z umowy. Gdy wycena wypadnie niżej niż cena zakupu, LTV rośnie i potrzebny jest wyższy wkład własny. To jedna z częstszych niespodzianek na etapie finalizowania kredytu.',
      'Zalecenia nadzoru wskazują wkład własny na poziomie 20 procent, czyli LTV do 80 procent. Banki dopuszczają zwykle niższy wkład, około 10 procent, ale wtedy wymagają dodatkowego zabezpieczenia, najczęściej ubezpieczenia niskiego wkładu własnego, doliczanego do marży lub raty do momentu, aż zadłużenie spadnie poniżej progu.',
      'LTV nie jest wartością stałą. Maleje z każdą ratą, bo spłacasz kapitał, i zmienia się razem z wartością nieruchomości. Wzrost cen na rynku obniża LTV bez żadnego działania z Twojej strony, spadek podnosi. W skrajnym przypadku, gdy ceny mocno spadną, zadłużenie może przekroczyć wartość mieszkania.',
      'Praktyczne znaczenie ma to przy renegocjacji i refinansowaniu. Po kilku latach spłaty LTV bywa już wyraźnie niższe niż na starcie, co jest konkretnym argumentem za obniżeniem marży albo warunkiem wejścia do lepszej oferty w innym banku.',
    ],
    example: {
      title: 'Jak wycena poniżej ceny zakupu psuje wkład własny',
      text: 'Kupujesz mieszkanie za 500 000 zł, mając 100 000 zł oszczędności, i zakładasz wkład własny 20 procent. Bank wycenia nieruchomość na 470 000 zł i to od tej kwoty liczy wskaźnik. Potrzebny kredyt to 400 000 zł, więc LTV wynosi około 85 procent, a nie 80. Żeby zejść do zakładanego poziomu, musisz dołożyć jeszcze 24 000 zł albo zgodzić się na gorsze warunki. Różnica bierze się wyłącznie z wyceny, a nie ze zmiany ceny transakcyjnej.',
    },
    faq: [
      {
        q: 'Jak obliczyć LTV?',
        a: 'Dzielisz kwotę kredytu przez wartość nieruchomości i mnożysz przez sto. Kredyt 340 000 zł przy nieruchomości wartej 400 000 zł daje LTV 85 procent. Do wyliczenia bank przyjmuje wartość z wyceny rzeczoznawcy, która bywa niższa od ceny zakupu.',
      },
      {
        q: 'Jaki wkład własny jest wymagany?',
        a: 'Zalecany poziom to 20 procent wartości nieruchomości, czyli LTV do 80 procent. Wiele banków dopuszcza wkład około 10 procent, ale wymaga wtedy dodatkowego zabezpieczenia w postaci ubezpieczenia niskiego wkładu, które podnosi koszt kredytu do czasu obniżenia zadłużenia.',
      },
      {
        q: 'Czy LTV się zmienia w trakcie spłaty?',
        a: 'Tak, i to w obie strony. Maleje wraz ze spłatą kapitału oraz przy wzroście cen nieruchomości, a rośnie, gdy ceny na rynku spadają. Bank nie przelicza go automatycznie na Twoją korzyść, więc obniżenie marży z tego tytułu wymaga zwykle Twojej inicjatywy.',
      },
      {
        q: 'Dlaczego niższe LTV oznacza tańszy kredyt?',
        a: 'Ponieważ zmniejsza ryzyko banku. Przy dużym wkładzie własnym nawet spadek cen nieruchomości nie sprawia, że zadłużenie przewyższa wartość zabezpieczenia. Banki odzwierciedlają to niższą marżą i rezygnacją z dodatkowych ubezpieczeń.',
      },
    ],
    related: ['wklad-wlasny', 'kredyt-hipoteczny'],
  },
  {
    slug: 'wiron',
    term: 'WIRON / POLSTR',
    aliases: ['WIRON', 'POLSTR', 'nowy wskaźnik referencyjny'],
    short: 'WIRON (docelowo POLSTR) to nowy wskaźnik referencyjny, który ma zastąpić WIBOR jako podstawa oprocentowania kredytów. Opiera się na realnych transakcjach, nie deklaracjach banków.',
    body: [
      'Reforma wskaźników ma uczynić oprocentowanie bardziej odpornym na manipulacje. Nowy wskaźnik liczony jest na bazie rzeczywistych depozytów, przez co zachowuje się nieco inaczej niż WIBOR.',
      'Przejście jest rozłożone w czasie i budzi sporo pytań kredytobiorców. Sama nazwa docelowego wskaźnika zmieniała się w trakcie prac, co dodatkowo namieszało w komunikacji.',
    ],
    related: ['wibor', 'kredyt-hipoteczny'],
  },
  {
    slug: 'nadplata-kredytu',
    term: 'Nadpłata kredytu',
    aliases: ['nadpłata kredytu', 'nadpłata', 'nadpłaty kredytu', 'nadpłacanie kredytu'],
    short: 'Nadpłata kredytu to wpłata ponad wymaganą ratę, która zmniejsza saldo zadłużenia, a przez to łączne odsetki do zapłaty.',
    body: [
      'Nadpłata trafia bezpośrednio w kapitał, czyli w tę część zadłużenia, od której naliczane są odsetki. Dlatego działa mocniej, niż sugeruje jej wielkość: obniżając saldo dziś, obniżasz odsetki naliczane przez wszystkie pozostałe lata.',
      'Przy każdej nadpłacie bank pyta o jedną z dwóch opcji i ten wybór ma duże znaczenie finansowe. Skrócenie okresu oznacza, że rata zostaje bez zmian, a kredyt kończy się wcześniej. Obniżenie raty oznacza, że okres pozostaje ten sam, ale płacisz mniej miesięcznie. Pierwsza opcja daje zdecydowanie większą oszczędność na odsetkach, druga poprawia płynność bieżącego budżetu.',
      'Efekt jest silnie zależny od momentu. W pierwszych latach spłaty rata składa się głównie z odsetek, a kapitał maleje powoli, więc nadpłata zbija wtedy największą przyszłą kwotę odsetek. Ta sama nadpłata wykonana pod koniec kredytu daje wielokrotnie mniejszą korzyść, bo odsetek do zapłacenia zostało już niewiele.',
      'Kwestia opłat: przy kredytach hipotecznych ze zmiennym oprocentowaniem prawo pozwala bankowi pobrać rekompensatę tylko w pierwszych trzech latach spłaty i ogranicza jej wysokość. Po tym okresie nadpłata jest bezpłatna. Przy kredytach konsumenckich bank zwraca proporcjonalnie część prowizji przypadającą na skrócony okres.',
      'Nadpłata nie zawsze jest najlepszym zastosowaniem wolnych środków. Ma sens przede wszystkim przy wysokim oprocentowaniu kredytu i wtedy, gdy masz już poduszkę finansową. Jeżeli kredyt jest tani, a Ty nie masz oszczędności na nagłe wydatki, budowanie rezerwy jest ważniejsze, bo nadpłaconych pieniędzy nie da się z kredytu wyjąć z powrotem.',
    ],
    example: {
      title: 'Skrócenie okresu kontra obniżenie raty',
      text: 'Kredyt 400 000 zł na 25 lat przy 7 procentach daje ratę około 2827 zł i łączne odsetki około 448 tys. zł. Jednorazowa nadpłata 30 000 zł po roku spłaty przy wyborze skrócenia okresu obniża łączne odsetki o około 109 tys. zł i skraca kredyt o ponad 4 lata. Ta sama nadpłata z obniżeniem raty daje spadek raty o około 215 zł, ale oszczędność na odsetkach to tylko około 32 tys. zł. Ponad trzykrotna różnica bierze się wyłącznie z wyboru opcji przy tej samej wpłacie.',
    },
    faq: [
      {
        q: 'Skrócić okres czy obniżyć ratę?',
        a: 'Skrócenie okresu daje wielokrotnie większą oszczędność na odsetkach, bo eliminuje najdroższe lata spłaty. Obniżenie raty poprawia natomiast bieżącą płynność i zmniejsza ryzyko problemów przy spadku dochodów. Przy stabilnej sytuacji finansowej korzystniejsze jest skracanie okresu.',
      },
      {
        q: 'Czy bank może pobrać opłatę za nadpłatę?',
        a: 'Przy kredycie hipotecznym ze zmiennym oprocentowaniem rekompensata jest dopuszczalna tylko w pierwszych trzech latach spłaty i ograniczona co do wysokości. Po tym okresie nadpłata jest bezpłatna. Przy kredycie konsumenckim bank ma obowiązek proporcjonalnie zwrócić część prowizji przypadającą na okres, o który spłatę skrócono.',
      },
      {
        q: 'Kiedy nadpłata daje największy efekt?',
        a: 'Na początku okresu kredytowania, gdy rata składa się głównie z odsetek, a kapitał maleje najwolniej. Im później nadpłacasz, tym mniejsza korzyść, ponieważ odsetek pozostałych do zapłacenia jest coraz mniej.',
      },
      {
        q: 'Nadpłacać kredyt czy inwestować?',
        a: 'Porównuje się oprocentowanie kredytu z realnym, czyli po podatku, oczekiwanym zwrotem z inwestycji. Nadpłata daje pewny zysk równy oprocentowaniu kredytu, inwestycja daje zysk niepewny. Przy drogim kredycie nadpłata zwykle wygrywa. Zawsze jednak przed jednym i drugim buduje się poduszkę finansową, bo nadpłaconych środków nie można wycofać.',
      },
    ],
    related: ['kredyt-hipoteczny', 'refinansowanie'],
  },
  {
    slug: 'refinansowanie',
    term: 'Refinansowanie',
    aliases: ['refinansowanie', 'refinansowania', 'refinansować', 'przeniesienie kredytu'],
    short: 'Refinansowanie to przeniesienie kredytu do innego banku na lepszych warunkach, na przykład z niższą marżą, by obniżyć ratę lub całkowity koszt.',
    body: [
      'Mechanizm polega na tym, że nowy bank spłaca Twoje dotychczasowe zadłużenie, a Ty od tej pory spłacasz jego. Zmienia się umowa, marża i harmonogram, natomiast sama nieruchomość czy cel kredytu pozostają bez zmian.',
      'Sens pojawia się w dwóch sytuacjach. Pierwsza to spadek marż na rynku od czasu, gdy podpisywałeś umowę. Druga, częściej pomijana, to poprawa Twojej własnej sytuacji: wyższe dochody, spłacona część zobowiązań albo wzrost wartości nieruchomości, dzięki któremu wskaźnik LTV spadł i kwalifikujesz się do niższej marży.',
      'Refinansowanie to pełna procedura kredytowa, a nie formalność. Bank ponownie bada zdolność, sprawdza historię w BIK i wymaga wyceny nieruchomości. Może się okazać, że przy obecnych dochodach albo obecnych zasadach liczenia zdolności nowej umowy po prostu nie dostaniesz, mimo że starą spłacasz bez opóźnień.',
      'Koszty przeniesienia trzeba policzyć zawczasu, bo potrafią zjeść korzyść. Składają się na nie wycena nieruchomości, opłaty sądowe za zmianę wpisu hipoteki, podatek od czynności cywilnoprawnych przy ustanowieniu nowej hipoteki, ewentualna prowizja nowego banku oraz koszt wcześniejszej spłaty w starym, jeśli umowa go przewiduje.',
      'Zanim złożysz wniosek gdzie indziej, spróbuj renegocjacji we własnym banku. Bank, który widzi konkretną ofertę konkurencji i rzetelnie spłacanego klienta, bywa skłonny obniżyć marżę aneksem. Kosztuje to ułamek tego, co pełne przeniesienie, i nie wymaga ponownej procedury.',
    ],
    example: {
      title: 'Kiedy przeniesienie zwraca się w rozsądnym czasie',
      text: 'Pozostało Ci 300 000 zł kredytu na 20 lat przy oprocentowaniu 7,5 procent, czyli rata około 2417 zł. Nowy bank proponuje 6,5 procent, co daje ratę około 2237 zł, więc oszczędzasz około 180 zł miesięcznie. Jeżeli koszty przeniesienia wyniosą 3000 zł, zwrócą się po niecałych 17 miesiącach, a przez pozostałe lata oszczędność zostaje w kieszeni: łącznie ponad 40 tys. zł mniej odsetek. Przy dwóch latach do końca spłaty ta sama operacja nie miałaby sensu.',
    },
    faq: [
      {
        q: 'Kiedy refinansowanie się opłaca?',
        a: 'Gdy oszczędność na odsetkach wyraźnie przewyższa koszty przeniesienia, a do końca spłaty zostało jeszcze sporo lat. Przy krótkim pozostałym okresie odsetki stanowią niewielką część raty, więc nawet niższa marża nie odrobi opłat. Prostym sprawdzianem jest okres zwrotu: koszty podzielone przez miesięczną oszczędność.',
      },
      {
        q: 'Ile kosztuje przeniesienie kredytu hipotecznego?',
        a: 'Na koszt składają się wycena nieruchomości, opłaty sądowe związane ze zmianą wpisu hipoteki, podatek od ustanowienia nowej hipoteki, ewentualna prowizja nowego banku i koszt wcześniejszej spłaty w dotychczasowym, jeśli umowa go przewiduje. Sumę trzeba zestawić z policzoną oszczędnością, zanim złoży się wniosek.',
      },
      {
        q: 'Czy bank może odmówić refinansowania?',
        a: 'Tak, ponieważ jest to zaciągnięcie nowego kredytu i podlega pełnej ocenie zdolności kredytowej. Zmiana dochodów, forma zatrudnienia, inne zobowiązania czy zaostrzone zasady liczenia zdolności mogą sprawić, że nowej umowy nie otrzymasz mimo terminowej spłaty dotychczasowej.',
      },
      {
        q: 'Czym różni się refinansowanie od renegocjacji?',
        a: 'Renegocjacja to obniżenie marży aneksem w banku, w którym już masz kredyt. Jest szybsza, tańsza i nie wymaga ponownej procedury, ale zależy wyłącznie od dobrej woli banku. Refinansowanie oznacza przeniesienie zobowiązania do innej instytucji, daje większe pole do negocjacji, ale wiąże się z kosztami i pełnym wnioskiem kredytowym.',
      },
    ],
    related: ['kredyt-hipoteczny', 'marza-kredytu', 'nadplata-kredytu'],
  },
  {
    slug: 'poduszka-finansowa',
    term: 'Poduszka finansowa',
    aliases: ['poduszka finansowa', 'poduszki finansowej', 'poduszkę finansową', 'fundusz awaryjny'],
    short: 'Poduszka finansowa to oszczędności odłożone na nieprzewidziane wydatki i utratę dochodu, trzymane w bezpiecznym, łatwo dostępnym miejscu.',
    body: [
      'Standardowo to równowartość od 3 do 6 miesięcy wydatków. Daje spokój i chroni przed wpadnięciem w drogie długi, gdy zepsuje się samochód albo stracisz pracę.',
      'Poduszkę trzyma się na koncie oszczędnościowym lub w obligacjach skarbowych, nie na giełdzie, bo ma być dostępna od ręki i nie tracić nominalnie na wartości. To fundament, który buduje się przed inwestowaniem.',
    ],
    related: ['konto-oszczednosciowe', 'obligacje-skarbowe', 'inflacja'],
  },
  {
    slug: 'pozycja-dluga',
    term: 'Pozycja długa (long)',
    aliases: ['pozycja długa', 'long', 'długa pozycja', 'gra na wzrost'],
    short: 'Pozycja długa (long) to zakup instrumentu w oczekiwaniu, że jego cena wzrośnie. Zarabiasz, gdy sprzedasz drożej, niż kupiłeś.',
    body: [
      'To najbardziej naturalny sposób inwestowania: kupujesz akcję, ETF czy krypto, licząc na wzrost. Maksymalna strata ogranicza się do zainwestowanej kwoty, a potencjalny zysk jest teoretycznie nieograniczony.',
      'Długoterminowy inwestor pasywny praktycznie zawsze jest na pozycji długiej, czyli po prostu trzyma kupione aktywa. Przeciwieństwem jest pozycja krótka.',
    ],
    related: ['pozycja-krotka', 'akcja'],
  },
  {
    slug: 'pozycja-krotka',
    term: 'Pozycja krótka (short)',
    aliases: ['pozycja krótka', 'short', 'krótka pozycja', 'krótka sprzedaż', 'gra na spadek'],
    short: 'Pozycja krótka (short) to zarabianie na spadku ceny: pożyczasz instrument, sprzedajesz go, a potem odkupujesz taniej i oddajesz, zatrzymując różnicę.',
    body: [
      'Mechanizm klasycznej krótkiej sprzedaży wygląda tak: pożyczasz akcje od kogoś, kto je posiada, sprzedajesz je natychmiast po bieżącej cenie, a po spadku odkupujesz taniej i oddajesz właścicielowi. Różnica między ceną sprzedaży a ceną odkupu jest Twoim zyskiem. W praktyce detaliczny inwestor rzadko robi to bezpośrednio, częściej korzystając z instrumentów pochodnych, gdzie ten sam efekt osiąga się jednym kliknięciem.',
      'Ryzyko jest tu zasadniczo inne niż przy zwykłym kupnie i to jest najważniejsza rzecz do zrozumienia. Kupując akcję za 100 zł, ryzykujesz najwyżej te 100 zł, bo cena nie spadnie poniżej zera. Grając na spadek, nie masz takiego ograniczenia od góry: cena może wzrosnąć dwukrotnie, pięciokrotnie albo bardziej, a Twoja strata rośnie razem z nią. Zysk jest ograniczony, strata teoretycznie nie.',
      'Do tego dochodzą koszty, których przy pozycji długiej nie ma. Za pożyczone papiery płaci się opłatę, a przy instrumentach lewarowanych naliczane są punkty swapowe za każdą dobę utrzymywania pozycji. Grając na spadek, płacisz więc za sam upływ czasu, co przy dłuższym trzymaniu pozycji potrafi pochłonąć znaczną część zysku.',
      'Osobnym zjawiskiem jest short squeeze. Gdy wiele osób gra na spadek konkretnej spółki, a jej kurs zaczyna rosnąć, grający na spadek muszą odkupywać akcje, żeby ograniczyć straty. To odkupywanie samo w sobie podbija cenę, co zmusza kolejnych do zamykania pozycji i napędza spiralę wzrostu. Kurs potrafi wtedy oderwać się od jakiejkolwiek wyceny fundamentalnej na wiele dni.',
      'Krótka pozycja ma też zastosowanie niespekulacyjne, jako zabezpieczenie istniejącego portfela przed spadkiem bez jego sprzedawania. Niezależnie od celu jest to narzędzie wymagające ścisłego zarządzania ryzykiem, ponieważ rynek rośnie w długim terminie, czyli działa strukturalnie przeciwko tej stronie transakcji.',
    ],
    example: {
      title: 'Asymetria, która czyni short groźnym',
      text: 'Otwierasz krótką pozycję na akcji wartej 100 zł. Jeżeli kurs spadnie do zera, zarobisz maksymalnie 100 zł na akcję i to jest Twój sufit. Jeżeli kurs wzrośnie do 300 zł, tracisz 200 zł, czyli dwa razy więcej, niż mogłeś zarobić w najlepszym scenariuszu. Przy pozycji długiej proporcje są odwrotne: ryzykujesz najwyżej wpłaconą kwotę, a potencjalny zysk nie ma górnej granicy.',
    },
    faq: [
      {
        q: 'Jak zarabia się na spadku ceny?',
        a: 'Sprzedajesz instrument, którego nie posiadasz, pożyczając go wcześniej, a następnie odkupujesz po niższej cenie i oddajesz. Zyskiem jest różnica między ceną sprzedaży a ceną odkupu. Ten sam efekt uzyskuje się przez instrumenty pochodne, gdzie rozliczana jest wyłącznie różnica cen.',
      },
      {
        q: 'Czy strata na krótkiej pozycji jest nieograniczona?',
        a: 'Teoretycznie tak, ponieważ cena instrumentu może rosnąć bez górnego limitu, podczas gdy maksymalny zysk to spadek do zera. W praktyce u brokerów podlegających regulacjom unijnym klienta detalicznego chroni mechanizm automatycznego zamykania pozycji oraz ochrona przed ujemnym saldem, ale utrata całego depozytu pozostaje realna.',
      },
      {
        q: 'Co to jest short squeeze?',
        a: 'To gwałtowny wzrost kursu wywołany masowym zamykaniem krótkich pozycji. Rosnąca cena zmusza grających na spadek do odkupywania instrumentu, co dodatkowo podbija kurs i zmusza kolejnych do tego samego. Powstaje spirala, w której cena potrafi na krótko oderwać się od jakiejkolwiek racjonalnej wyceny.',
      },
      {
        q: 'Czy początkujący powinien grać na spadki?',
        a: 'Zwykle nie. Poza odwróconą asymetrią ryzyka dochodzą koszty utrzymania pozycji naliczane za każdą dobę oraz fakt, że rynki akcji w długim terminie rosną, co działa przeciwko tej stronie transakcji. To narzędzie dla osób z przetestowaną strategią i ścisłym zarządzaniem ryzykiem.',
      },
    ],
    related: ['pozycja-dluga', 'dzwignia', 'cfd'],
  },
  {
    slug: 'dzwignia',
    term: 'Dźwignia finansowa',
    aliases: ['dźwignia finansowa', 'dźwignia', 'dźwigni', 'lewar', 'lewarowanie'],
    short: 'Dźwignia finansowa pozwala obracać kwotą większą niż posiadany kapitał. Zwielokrotnia zarówno potencjalne zyski, jak i straty.',
    body: [
      'Dźwignia 1:10 oznacza, że mając 1000 zł, kontrolujesz pozycję wartą 10 000 zł. Ruch ceny o 10% to wtedy podwojenie albo utrata całego depozytu. To miecz obosieczny.',
      'Produkty lewarowane (CFD, forex, futures) są przyczyną, dla której większość inwestorów detalicznych traci pieniądze. Wymagają ścisłego zarządzania ryzykiem i nie są dla początkujących.',
    ],
    related: ['cfd', 'depozyt-zabezpieczajacy', 'drawdown'],
  },
  {
    slug: 'cfd',
    term: 'CFD',
    aliases: ['CFD', 'kontrakt CFD', 'kontrakty CFD', 'kontrakt na różnicę'],
    short: 'CFD (kontrakt na różnicę) to instrument pochodny, który pozwala zarabiać na zmianie ceny aktywa bez jego posiadania, zwykle z dźwignią.',
    body: [
      'Kupując CFD na akcję czy indeks, nie stajesz się właścicielem instrumentu bazowego. Zawierasz z brokerem umowę, zgodnie z którą rozliczycie różnicę między ceną otwarcia a ceną zamknięcia pozycji. Nie masz więc prawa głosu na walnym zgromadzeniu ani realnych akcji w portfelu, a odpowiednik dywidendy jest jedynie księgowany jako korekta na rachunku.',
      'Dwie cechy odróżniają CFD od zwykłego kupna. Po pierwsze dźwignia: wykładasz tylko depozyt zabezpieczający, a kontrolujesz pozycję wielokrotnie większą, co proporcjonalnie powiększa zarówno zysk, jak i stratę. Po drugie możliwość gry na spadki, czyli otwarcia pozycji krótkiej bez pożyczania papierów, co przy zwykłym rachunku maklerskim jest trudniejsze.',
      'Regulacje unijne mocno ograniczyły ten instrument dla klientów detalicznych. Obowiązują limity dźwigni zależne od klasy aktywów, ochrona przed ujemnym saldem, czyli zakaz wpędzania klienta w dług wobec brokera, oraz automatyczne zamykanie pozycji przy spadku depozytu do ustalonego progu. Firmy oferujące CFD mają też obowiązek podawać w materiałach reklamowych odsetek rachunków detalicznych, które tracą pieniądze. Ten odsetek wynosi zwykle od około 60 do ponad 80 procent i jest przeliczany co kwartał.',
      'Koszty bywają niedoszacowane, bo nie sprowadzają się do prowizji. Płacisz spread, czyli różnicę między ceną kupna a sprzedaży, a przy pozycjach trzymanych przez noc także punkty swapowe naliczane codziennie. Przy dłuższym utrzymywaniu pozycji sam koszt finansowania potrafi przewyższyć zakładany zysk.',
      'Praktyczny wniosek: CFD są narzędziem krótkoterminowym dla osób, które rozumieją dźwignię i zarządzają ryzykiem. Do długoterminowego budowania kapitału służą inne instrumenty, bo koszty finansowania i mechanika dźwigni działają tu przeciwko cierpliwości.',
    ],
    example: {
      title: 'Jak dźwignia zamienia mały ruch w dużą stratę',
      text: 'Otwierasz pozycję o wartości 20 000 zł, wykładając 1000 zł depozytu, czyli z dźwignią 20 do 1. Ruch ceny o 1 procent w Twoją stronę daje 200 zł zysku, czyli 20 procent depozytu. Ten sam ruch o 1 procent przeciwko Tobie zabiera 200 zł, czyli jedną piątą depozytu. Spadek o 5 procent oznacza już utratę całej wpłaconej kwoty. Dźwignia nie zmienia szans na trafienie kierunku, zmienia wyłącznie to, jak szybko kończy się Twój kapitał.',
    },
    faq: [
      {
        q: 'Czy kupując CFD, posiadam akcje?',
        a: 'Nie. CFD to umowa z brokerem o rozliczenie różnicy cen, a nie zakup instrumentu bazowego. Nie masz praw akcjonariusza ani papierów zapisanych na rachunku, a wypłacona przez spółkę dywidenda odzwierciedla się jedynie jako korekta rozliczeniowa.',
      },
      {
        q: 'Jaka dźwignia jest dostępna dla klienta detalicznego w Unii Europejskiej?',
        a: 'Limity zależą od klasy aktywów i są ustawione znacznie niżej niż przed regulacją. Najwyższe dopuszczalne poziomy dotyczą głównych par walutowych, a najniższe kryptowalut i pojedynczych akcji. Oferta dźwigni wielokrotnie wyższej niż unijne limity oznacza zwykle podmiot spoza nadzoru unijnego i jest sygnałem ostrzegawczym.',
      },
      {
        q: 'Czy mogę stracić więcej, niż wpłaciłem?',
        a: 'Klient detaliczny u brokera podlegającego regulacjom unijnym jest objęty ochroną przed ujemnym saldem, więc nie powinien zostać z długiem wobec brokera. Nadal można natomiast stracić całość wpłaconych środków, i to szybko, bo pozycje są zamykane automatycznie przy spadku depozytu do określonego poziomu.',
      },
      {
        q: 'Ile kosztuje trzymanie pozycji CFD przez dłuższy czas?',
        a: 'Poza spreadem i ewentualną prowizją naliczane są punkty swapowe za każdą dobę utrzymywania pozycji. Przy pozycji trzymanej tygodniami koszt finansowania kumuluje się i potrafi zjeść znaczną część zysku, dlatego CFD słabo nadają się do długiego horyzontu.',
      },
    ],
    related: ['dzwignia', 'pozycja-krotka', 'spread'],
  },
  {
    slug: 'spread',
    term: 'Spread',
    aliases: ['spread', 'spreadu', 'spready', 'spread bid-ask'],
    short: 'Spread to różnica między ceną kupna a ceną sprzedaży instrumentu. To ukryty koszt transakcji, który płacisz przy każdym wejściu i wyjściu z pozycji.',
    body: [
      'Jeśli kupno jest po 100,10, a sprzedaż po 100,00, spread wynosi 10 groszy. Im węższy spread, tym taniej handlujesz. Na płynnych rynkach spready są niskie, na egzotycznych szerokie.',
      'Dla aktywnych traderów spread to istotny koszt, bo płaci się go wielokrotnie. Dla długoterminowego inwestora ma mniejsze znaczenie niż prowizje i koszty funduszu.',
    ],
    related: ['plynnosc', 'cfd', 'forex'],
  },
  {
    slug: 'stop-loss',
    term: 'Stop loss',
    aliases: ['stop loss', 'stop-loss', 'zlecenie stop loss', 'SL'],
    short: 'Stop loss to zlecenie automatycznie zamykające pozycję, gdy cena dojdzie do ustalonego poziomu straty. Ogranicza stratę na pojedynczej transakcji.',
    body: [
      'To podstawowe narzędzie zarządzania ryzykiem: zanim wejdziesz w pozycję, ustalasz, ile maksymalnie jesteś gotów stracić, i tam stawiasz stop. Chroni przed emocjonalnym trzymaniem stratnej pozycji.',
      'Stop loss nie gwarantuje zamknięcia dokładnie po ustalonej cenie przy gwałtownych ruchach (poślizg). Mimo to brak stopa to jeden z najczęstszych błędów początkujących.',
    ],
    related: ['take-profit', 'risk-reward', 'drawdown'],
  },
  {
    slug: 'take-profit',
    term: 'Take profit',
    aliases: ['take profit', 'take-profit', 'zlecenie take profit', 'TP', 'realizacja zysku'],
    short: 'Take profit to zlecenie automatycznie zamykające pozycję po osiągnięciu ustalonego poziomu zysku. Pozwala zrealizować zysk bez ciągłego pilnowania rynku.',
    body: [
      'Take profit zdejmuje z Ciebie emocje: zysk realizuje się sam, zanim chciwość każe czekać na więcej i oddać zarobek. Ustawia się go razem ze stop lossem, definiując z góry oba scenariusze.',
      'Stosunek odległości take profit do stop loss wyznacza wskaźnik risk/reward, od którego zależy długoterminowa rentowność strategii.',
    ],
    related: ['stop-loss', 'risk-reward'],
  },
  {
    slug: 'risk-reward',
    term: 'Risk/Reward (R/R)',
    aliases: ['risk/reward', 'risk reward', 'R/R', 'stosunek zysku do ryzyka'],
    short: 'Risk/reward (R/R) to stosunek potencjalnego zysku do ryzykowanej kwoty w transakcji. R/R 1:3 oznacza, że ryzykujesz 1, by zarobić 3.',
    body: [
      'Dobry R/R pozwala być rentownym nawet przy niskiej skuteczności. Przy R/R 1:3 wystarczy wygrywać 1 transakcję na 3, by wyjść na zero. To dlatego traderzy pilnują tego wskaźnika bardziej niż samej trafności.',
      'R/R ustala się przed wejściem w pozycję, wyznaczając poziomy stop loss i take profit. Wejścia o słabym R/R to prosta droga do strat mimo częstych drobnych zysków.',
    ],
    related: ['stop-loss', 'take-profit', 'drawdown'],
    calc: { href: '/kalkulator/risk-reward', label: 'Kalkulator Risk/Reward' },
  },
  {
    slug: 'zlecenie-rynkowe',
    term: 'Zlecenie rynkowe',
    aliases: ['zlecenie rynkowe', 'zlecenie market', 'market order', 'po cenie rynkowej'],
    short: 'Zlecenie rynkowe (market) wykonuje się natychmiast po najlepszej dostępnej cenie. Daje pewność realizacji, ale nie gwarantuje konkretnej ceny.',
    body: [
      'Używasz go, gdy zależy Ci na szybkim wejściu lub wyjściu, a dokładna cena jest drugorzędna. Na płynnym rynku różnica jest minimalna, na mało płynnym możesz dostać gorszą cenę (poślizg).',
      'Przeciwieństwem jest zlecenie z limitem, które daje kontrolę nad ceną kosztem pewności wykonania.',
    ],
    related: ['zlecenie-z-limitem', 'spread', 'plynnosc'],
  },
  {
    slug: 'zlecenie-z-limitem',
    term: 'Zlecenie z limitem',
    aliases: ['zlecenie z limitem', 'limit order', 'zlecenie limit', 'zlecenie oczekujące'],
    short: 'Zlecenie z limitem realizuje się tylko po wskazanej cenie lub lepszej. Daje kontrolę nad ceną, ale może się nie wykonać, jeśli rynek jej nie osiągnie.',
    body: [
      'Ustawiasz na przykład kupno akcji po 95 zł, choć teraz kosztuje 100 zł. Zlecenie czeka i wykona się dopiero, gdy cena spadnie do 95. Pozwala kupować i sprzedawać na własnych warunkach.',
      'To narzędzie cierpliwego inwestora. Wadą jest ryzyko, że okazja Cię ominie, jeśli cena nie dojdzie do limitu.',
    ],
    related: ['zlecenie-rynkowe', 'spread'],
  },
  {
    slug: 'wolumen',
    term: 'Wolumen',
    aliases: ['wolumen', 'wolumenu', 'wolumen obrotu'],
    short: 'Wolumen to liczba jednostek instrumentu, które zmieniły właściciela w danym czasie. Pokazuje, jak duże zainteresowanie towarzyszy ruchowi ceny.',
    body: [
      'Wysoki wolumen potwierdza siłę ruchu: wybicie ceny na dużym wolumenie jest wiarygodniejsze niż na małym. Niski wolumen oznacza słabsze zainteresowanie i często większą zmienność.',
      'Wolumen to jedno z podstawowych narzędzi analizy technicznej. Pomaga ocenić, czy za zmianą ceny stoi realny popyt, czy tylko przypadkowe ruchy.',
    ],
    related: ['analiza-techniczna', 'plynnosc', 'trend'],
  },
  {
    slug: 'swieca-japonska',
    term: 'Świeca japońska',
    aliases: ['świeca japońska', 'świece japońskie', 'formacja świecowa', 'świeca'],
    short: 'Świeca japońska to sposób przedstawiania ceny na wykresie, pokazujący w jednym elemencie cenę otwarcia, zamknięcia oraz maksimum i minimum w danym okresie.',
    body: [
      'Korpus świecy to zakres między otwarciem a zamknięciem, a cienie (knoty) pokazują skrajne ceny. Kolor mówi, czy okres zamknął się wzrostem, czy spadkiem. To podstawa wykresów w analizie technicznej.',
      'Z układów świec traderzy odczytują formacje, które mają sugerować dalszy kierunek. To narzędzie pomocnicze, nie wyrocznia.',
    ],
    related: ['analiza-techniczna', 'trend', 'wsparcie-i-opor'],
  },
  {
    slug: 'wsparcie-i-opor',
    term: 'Wsparcie i opór',
    aliases: ['wsparcie i opór', 'wsparcie', 'opór', 'poziom wsparcia', 'poziom oporu'],
    short: 'Wsparcie i opór to poziomy cenowe, przy których ruch często się zatrzymuje: wsparcie hamuje spadki, opór hamuje wzrosty.',
    body: [
      'Wsparcie to poziom, przy którym pojawia się popyt i cena odbija w górę, a opór to poziom, gdzie przeważa podaż i wzrost wygasa. Im częściej poziom był testowany, tym uważa się go za ważniejszy.',
      'Przebicie ważnego oporu lub wsparcia bywa sygnałem kontynuacji ruchu. To jedno z najpopularniejszych narzędzi analizy technicznej.',
    ],
    related: ['analiza-techniczna', 'trend', 'swieca-japonska'],
  },
  {
    slug: 'trend',
    term: 'Trend',
    aliases: ['trend', 'trendu', 'trend wzrostowy', 'trend spadkowy', 'trendzie'],
    short: 'Trend to dominujący kierunek ruchu ceny w czasie: wzrostowy (kolejne szczyty i dołki coraz wyżej), spadkowy (coraz niżej) albo boczny.',
    body: [
      'Powiedzenie, że trend jest twoim przyjacielem, oddaje podejście, w którym handluje się zgodnie z głównym kierunkiem rynku, a nie wbrew niemu. Rozpoznanie trendu to fundament analizy technicznej.',
      'Trendy występują na różnych horyzontach naraz: długoterminowy wzrostowy może zawierać krótkoterminowe korekty w dół. Dopasowanie horyzontu do strategii rozstrzyga, który trend Cię obowiązuje.',
    ],
    related: ['analiza-techniczna', 'wsparcie-i-opor', 'korekta'],
  },
  {
    slug: 'day-trading',
    term: 'Day trading',
    aliases: ['day trading', 'daytrading', 'day trader', 'handel jednodniowy'],
    short: 'Day trading to styl handlu, w którym pozycje otwiera się i zamyka w ciągu jednego dnia, bez przetrzymywania ich na noc.',
    body: [
      'Day trader zarabia na małych, częstych ruchach ceny, zwykle z użyciem dźwigni i analizy technicznej. Wymaga czasu, dyscypliny i odporności psychicznej, a koszty transakcyjne potrafią zjadać zyski.',
      'To jedna z najtrudniejszych dróg na rynku: badania pokazują, że większość day traderów traci pieniądze w długim terminie. Nie ma nic wspólnego z pasywnym inwestowaniem.',
    ],
    related: ['scalping', 'swing-trading', 'dzwignia'],
  },
  {
    slug: 'scalping',
    term: 'Scalping',
    aliases: ['scalping', 'skalpowanie', 'scalper'],
    short: 'Scalping to bardzo krótkoterminowy styl handlu, w którym trader otwiera wiele transakcji dziennie, zarabiając na minimalnych ruchach ceny.',
    body: [
      'Scalper trzyma pozycje sekundy lub minuty, polując na drobne ruchy z dużą częstotliwością. Wymaga niskich spreadów, szybkiego wykonania zleceń i żelaznej dyscypliny.',
      'To najbardziej wymagający i stresujący styl tradingu, w którym koszty transakcyjne i psychika decydują o wyniku. Zdecydowanie nie dla początkujących.',
    ],
    related: ['day-trading', 'spread', 'dzwignia'],
  },
  {
    slug: 'swing-trading',
    term: 'Swing trading',
    aliases: ['swing trading', 'swingtrading', 'swing trader'],
    short: 'Swing trading to styl, w którym pozycje trzyma się od kilku dni do kilku tygodni, łapiąc średnioterminowe ruchy (swingi) ceny.',
    body: [
      'To pośrednia droga między day tradingiem a inwestowaniem długoterminowym. Daje więcej oddechu niż handel jednodniowy i nie wymaga ciągłego patrzenia w ekran, ale naraża na ryzyko ruchów po godzinach.',
      'Swing trader łączy analizę techniczną z obserwacją trendu. Mniejsza częstotliwość transakcji oznacza niższe koszty niż przy scalpingu.',
    ],
    related: ['day-trading', 'trend', 'analiza-techniczna'],
  },
  {
    slug: 'futures',
    term: 'Futures (kontrakt terminowy)',
    aliases: ['futures', 'kontrakt terminowy', 'kontrakty terminowe', 'kontrakty futures'],
    short: 'Futures (kontrakt terminowy) to umowa kupna lub sprzedaży aktywa w przyszłości po ustalonej dziś cenie. Standaryzowany, notowany na giełdzie, zwykle z dźwignią.',
    body: [
      'Futures służą zarówno spekulacji, jak i zabezpieczaniu się przed zmianą cen (hedging). Dzięki dźwigni angażujesz tylko depozyt zabezpieczający, a nie pełną wartość kontraktu, co zwielokrotnia ryzyko.',
      'To instrumenty dla zaawansowanych. Popularne są kontrakty na indeksy, surowce i waluty. Wymagają rozumienia dźwigni i zarządzania ryzykiem.',
    ],
    related: ['dzwignia', 'opcje', 'depozyt-zabezpieczajacy'],
  },
  {
    slug: 'opcje',
    term: 'Opcje',
    aliases: ['opcja', 'opcje', 'opcji', 'opcja call', 'opcja put'],
    short: 'Opcja to instrument pochodny dający prawo (nie obowiązek) kupna lub sprzedaży aktywa po ustalonej cenie w określonym czasie. Za to prawo płacisz premię.',
    body: [
      'Opcja call daje prawo kupna, opcja put prawo sprzedaży. Opcje pozwalają na zaawansowane strategie: spekulację z dźwignią, zabezpieczanie portfela czy generowanie dochodu. Ich wycena jest złożona.',
      'To jedne z trudniejszych instrumentów, wrażliwe na czas i zmienność. Nieumiejętne użycie potrafi szybko wyzerować premię. Wymagają solidnej wiedzy.',
    ],
    related: ['futures', 'dzwignia', 'zmiennosc'],
  },
  {
    slug: 'forex',
    term: 'Forex',
    aliases: ['forex', 'rynek forex', 'FX', 'rynek walutowy'],
    short: 'Forex (rynek walutowy) to największy rynek finansowy świata, na którym handluje się parami walut, na przykład EUR/USD. Działa całą dobę, pięć dni w tygodniu.',
    body: [
      'Zarabia się na zmianie kursu jednej waluty względem drugiej, zwykle z wysoką dźwignią. Ogromna płynność i dostępność przyciągają, ale dźwignia sprawia, że większość początkujących traci.',
      'Forex u brokerów detalicznych odbywa się najczęściej przez CFD na pary walutowe. To rynek dla doświadczonych, ze ścisłym zarządzaniem ryzykiem.',
    ],
    related: ['cfd', 'dzwignia', 'pip'],
  },
  {
    slug: 'pip',
    term: 'Pip',
    aliases: ['pip', 'pips', 'pipsy', 'pipsów'],
    short: 'Pip to najmniejsza standardowa jednostka zmiany kursu na rynku forex, zwykle czwarte miejsce po przecinku (0,0001). Służy do mierzenia ruchu ceny i zysku.',
    body: [
      'Jeśli EUR/USD przesunie się z 1,1000 na 1,1010, to ruch o 10 pipsów. Wartość pipa w pieniądzu zależy od wielkości pozycji (lota), co przy dźwigni mocno wpływa na wynik.',
      'Pipsy to język traderów forex. Wynik strategii opisuje się często liczbą zarobionych lub straconych pipsów, niezależnie od wielkości rachunku.',
    ],
    related: ['forex', 'lot', 'spread'],
  },
  {
    slug: 'lot',
    term: 'Lot',
    aliases: ['lot', 'lota', 'loty', 'wielkość lota'],
    short: 'Lot to standardowa jednostka wielkości pozycji na rynku forex. Jeden standardowy lot to 100 000 jednostek waluty bazowej.',
    body: [
      'Oprócz standardowego lota używa się mini lota (10 000) i mikro lota (1000), co pozwala dopasować ryzyko do wielkości rachunku. Im większy lot, tym większa wartość jednego pipa, a więc i ryzyko.',
      'Dobór wielkości lota to element zarządzania ryzykiem: zbyt duży lot względem kapitału to najszybsza droga do wyzerowania konta.',
    ],
    related: ['forex', 'pip', 'dzwignia'],
  },
  {
    slug: 'depozyt-zabezpieczajacy',
    term: 'Depozyt zabezpieczający (margin)',
    aliases: ['depozyt zabezpieczający', 'margin', 'margin call', 'wezwanie do uzupełnienia depozytu'],
    short: 'Depozyt zabezpieczający (margin) to część wartości pozycji, którą musisz utrzymywać na koncie przy handlu z dźwignią, jako zabezpieczenie dla brokera.',
    body: [
      'Dźwignia pozwala otworzyć dużą pozycję, blokując tylko ułamek jej wartości jako depozyt. Gdy strata zjada depozyt, broker wysyła wezwanie do uzupełnienia (margin call), a przy jego braku zamyka pozycję.',
      'Margin call to moment, w którym wielu lewarowanych traderów realizuje duże straty. To kolejny powód, dla którego dźwignia jest ryzykowna.',
    ],
    related: ['dzwignia', 'cfd', 'futures'],
  },
  {
    slug: 'analiza-techniczna',
    term: 'Analiza techniczna',
    aliases: ['analiza techniczna', 'analizy technicznej', 'analizę techniczną'],
    short: 'Analiza techniczna to przewidywanie ruchów cen na podstawie wykresów, formacji i wskaźników, przy założeniu, że historia kursu odzwierciedla psychologię rynku.',
    body: [
      'Analiza techniczna opiera się na trzech założeniach. Pierwsze mówi, że cena dyskontuje wszystko, czyli zawiera już w sobie wszystkie znane informacje i oczekiwania. Drugie, że ceny poruszają się w trendach, które trwają dłużej, niż podpowiada intuicja. Trzecie, że schematy zachowań uczestników rynku powtarzają się, bo powtarza się ludzka psychologia stojąca za decyzjami.',
      'Narzędzia dzielą się na kilka grup. Poziomy wsparcia i oporu wskazują miejsca, w których cena wcześniej reagowała. Linie i kanały trendu opisują kierunek. Formacje świecowe i wykresu opisują układy zapowiadające kontynuację lub odwrócenie. Wskaźniki, takie jak średnie kroczące, RSI czy MACD, przetwarzają cenę i wolumen na dodatkowy sygnał.',
      'Najczęstszy błąd początkujących polega na traktowaniu tych narzędzi jak systemu przepowiadania przyszłości. Analiza techniczna nie mówi, co się stanie, tylko porządkuje prawdopodobieństwa i wyznacza konkretne poziomy: gdzie wejść, gdzie przyznać się do pomyłki i gdzie zrealizować zysk. Bez tego trzeciego elementu, czyli zarządzania ryzykiem, nawet trafna analiza nie przekłada się na zarobek.',
      'Drugi typowy błąd to nadmiar wskaźników. Ponieważ większość z nich liczona jest z tej samej ceny, pięć wskaźników zwykle pokazuje to samo pięć razy i buduje fałszywe poczucie potwierdzenia. Rozsądniej działają dwa narzędzia pełniące różne funkcje, na przykład jedno opisujące trend i jedno opisujące wykupienie rynku.',
      'Analiza techniczna i fundamentalna nie wykluczają się. Fundamentalna odpowiada na pytanie, co kupić i czy jest to tanie względem wartości spółki. Techniczna odpowiada na pytanie, kiedy to zrobić i gdzie postawić granicę straty. Inwestor długoterminowy używa zwykle pierwszej, trader krótkoterminowy niemal wyłącznie drugiej.',
    ],
    example: {
      title: 'Dlaczego sam sygnał nic nie znaczy bez ryzyka',
      text: 'Dwóch traderów dostaje ten sam sygnał kupna, który sprawdza się w 40 procentach przypadków. Pierwszy ustawia stop loss na 100 zł, a take profit na 300 zł. Drugi ustawia stop loss na 300 zł, a zysk realizuje przy 100 zł. Po 10 transakcjach pierwszy ma 4 razy po 300 zł zysku i 6 razy po 100 zł straty, czyli 600 zł na plusie. Drugi ma 400 zł zysku i 1800 zł straty, czyli 1400 zł na minusie. Ta sama analiza, ta sama skuteczność, przeciwne wyniki.',
    },
    faq: [
      {
        q: 'Czy analiza techniczna działa?',
        a: 'Nie jest metodą przewidywania przyszłości i nie daje pewności co do pojedynczej transakcji. Jej użyteczność polega na porządkowaniu decyzji: wyznaczaniu poziomów wejścia, wyjścia i granicy straty w sposób powtarzalny. O wyniku przesądza połączenie z zarządzaniem ryzykiem, a nie sama trafność sygnałów.',
      },
      {
        q: 'Od czego zacząć naukę analizy technicznej?',
        a: 'Od czytania samego wykresu: budowy świecy, kierunku trendu oraz poziomów wsparcia i oporu. Wskaźniki dokłada się później, gdy potrafisz już opisać, co robi cena bez nich. Odwrotna kolejność, czyli start od wskaźników, prowadzi do wykresu zasłoniętego liniami, z których nic nie wynika.',
      },
      {
        q: 'Ile wskaźników stosować naraz?',
        a: 'Zwykle wystarczą dwa, pełniące różne funkcje, na przykład jeden opisujący trend i jeden opisujący wykupienie lub wyprzedanie rynku. Większość wskaźników liczona jest z tej samej ceny, więc ich mnożenie daje pozorne potwierdzenie zamiast nowej informacji.',
      },
      {
        q: 'Czym różni się od analizy fundamentalnej?',
        a: 'Analiza fundamentalna bada wartość spółki na podstawie wyników finansowych, otoczenia i perspektyw, odpowiadając na pytanie, co kupić. Analiza techniczna bada zachowanie samej ceny i odpowiada na pytanie, kiedy to zrobić oraz gdzie postawić stop loss. Dla inwestora długoterminowego pierwsza jest ważniejsza, dla tradera druga.',
      },
    ],
    related: ['analiza-fundamentalna', 'trend', 'wsparcie-i-opor'],
  },
  {
    slug: 'analiza-fundamentalna',
    term: 'Analiza fundamentalna',
    aliases: ['analiza fundamentalna', 'analizy fundamentalnej', 'analizę fundamentalną'],
    short: 'Analiza fundamentalna to ocena realnej wartości aktywa na podstawie danych: wyników finansowych spółki, wskaźników, sytuacji branży i całej gospodarki.',
    body: [
      'Inwestor fundamentalny szuka spółek wycenionych poniżej ich wartości, analizując przychody, zyski, zadłużenie i wskaźniki takie jak C/Z. To podejście inwestowania w wartość.',
      'W odróżnieniu od analizy technicznej, która patrzy na wykres, analiza fundamentalna pyta, ile ta firma jest naprawdę warta. Dominuje w inwestowaniu długoterminowym.',
    ],
    related: ['analiza-techniczna', 'wskaznik-c-z', 'akcja'],
  },
  {
    slug: 'zmiennosc',
    term: 'Zmienność (volatility)',
    aliases: ['zmienność', 'zmienności', 'volatility', 'wahania cen'],
    short: 'Zmienność (volatility) to skala wahań ceny instrumentu w czasie. Wysoka zmienność oznacza duże, gwałtowne ruchy w obie strony.',
    body: [
      'Im wyższa zmienność, tym większe ryzyko i potencjalny zysk, ale i większy stres. Krypto ma wysoką zmienność, obligacje skarbowe niską. Zmienność rośnie zwykle w czasie kryzysów i niepewności.',
      'Zmienność to nie to samo co ryzyko trwałej straty: szeroki ETF bywa zmienny krótkoterminowo, ale w długim terminie historycznie rósł. Dla tradera zmienność to okazja, dla inwestora hałas do przeczekania.',
    ],
    related: ['drawdown', 'dywersyfikacja', 'plynnosc'],
  },
  {
    slug: 'plynnosc',
    term: 'Płynność',
    aliases: ['płynność', 'płynności', 'liquidity', 'płynny rynek'],
    short: 'Płynność to łatwość kupna lub sprzedaży aktywa bez znaczącego wpływu na jego cenę. Im więcej chętnych po obu stronach, tym wyższa płynność.',
    body: [
      'Płynny rynek (np. duże akcje, główne pary forex) ma wąskie spready i szybkie wykonanie zleceń. Na rynku mało płynnym trudniej wyjść z pozycji bez psucia ceny, a spready są szerokie.',
      'Płynność bywa pozorna: w spokojnych czasach wysoka, w panice potrafi wyparować, gdy wszyscy chcą sprzedawać naraz. To ważny, często niedoceniany wymiar ryzyka.',
    ],
    related: ['spread', 'wolumen', 'zmiennosc'],
  },
  {
    slug: 'deflacja',
    term: 'Deflacja',
    aliases: ['deflacja', 'deflacji', 'deflację', 'deflacją'],
    short: 'Deflacja to trwały spadek ogólnego poziomu cen, czyli odwrotność inflacji. Brzmi dobrze, ale dla gospodarki bywa groźniejsza niż umiarkowana inflacja.',
    body: [
      'Odruchowo deflacja wydaje się korzystna, bo za te same pieniądze kupisz więcej. Problem pojawia się, gdy spadek cen jest trwały i powszechny, bo wtedy zmienia zachowanie całej gospodarki, a nie tylko pojedynczego kupującego.',
      'Mechanizm spirali wygląda tak: skoro ceny mają spaść, opłaca się odłożyć zakupy na później. Odroczony popyt oznacza mniejsze przychody firm, te tną produkcję, pensje i zatrudnienie, co jeszcze bardziej ogranicza popyt i pcha ceny w dół. Każdy krok jest indywidualnie racjonalny, a wynik zbiorowy destrukcyjny.',
      'Osobno działa efekt zadłużenia, często poważniejszy od samego spadku popytu. Kwota kredytu jest zapisana nominalnie i nie maleje, natomiast pieniądz, którym go spłacasz, staje się coraz droższy. Realny ciężar długu rośnie sam z siebie, przy niezmienionej racie. Dotyczy to tak samo gospodarstw domowych, jak firm i państw, i dlatego deflacja bywa groźniejsza dla zadłużonej gospodarki niż umiarkowana inflacja.',
      'Deflacja utrudnia też reagowanie bankom centralnym. Główne narzędzie, czyli obniżanie stóp procentowych, ma naturalną granicę w okolicach zera. Poniżej niej pozostają rozwiązania nadzwyczajne, takie jak skup aktywów, których skuteczność jest ograniczona i rozłożona w czasie.',
      'Odróżnia się przy tym deflację od zwykłego potanienia pojedynczych dóbr. Spadek cen elektroniki wynikający z postępu technicznego jest zdrowy i nie tworzy spirali. Deflacja to sytuacja, w której przeciętny poziom cen w całej gospodarce spada przez dłuższy czas. Właśnie dlatego banki centralne celują nie w zero, lecz w niewielki dodatni wzrost cen, zwykle około 2 procent.',
    ],
    example: {
      title: 'Dlaczego dług boli bardziej przy spadku cen',
      text: 'Zaciągasz kredyt na 300 000 zł przy zarobkach 6000 zł miesięcznie, czyli dług odpowiada 50 miesięcznym pensjom. Przy inflacji pensje nominalnie rosną: po kilku latach zarabiasz 8000 zł, a dług to już tylko 37,5 pensji, mimo że kwota kredytu się nie zmieniła. Przy deflacji dzieje się odwrotnie, bo pensje spadają razem z cenami: przy 5000 zł ten sam kredyt odpowiada już 60 pensjom. Nie zmieniło się nic w umowie, a spłata stała się realnie trudniejsza.',
    },
    faq: [
      {
        q: 'Czy deflacja jest korzystna dla konsumenta?',
        a: 'Krótkoterminowo i pojedynczo tak, bo rosną realne możliwości zakupu. W dłuższym okresie skutki uboczne zwykle przeważają: spadająca sprzedaż prowadzi do cięć zatrudnienia i pensji, więc ostatecznie konsument traci dochód szybciej, niż zyskuje na niższych cenach.',
      },
      {
        q: 'Czym różni się deflacja od dezinflacji?',
        a: 'Dezinflacja to spowolnienie tempa wzrostu cen, które nadal rosną, tylko wolniej. Deflacja oznacza, że ceny faktycznie spadają, czyli wskaźnik inflacji jest ujemny. Pierwsze zjawisko jest zwykle celem banku centralnego, drugie jego problemem.',
      },
      {
        q: 'Dlaczego banki centralne nie dążą do zerowej inflacji?',
        a: 'Zero byłoby zbyt blisko granicy deflacji, a błąd prognozy w dół oznaczałby wejście w spadek cen z bardzo ograniczonym polem do reakcji. Niewielka dodatnia inflacja, zwykle w okolicach 2 procent, tworzy bufor bezpieczeństwa i ułatwia dostosowania w gospodarce.',
      },
      {
        q: 'Co dzieje się z kredytem podczas deflacji?',
        a: 'Nominalna kwota zadłużenia nie zmienia się, ale realny ciężar rośnie, bo dochody i ceny spadają, a rata pozostaje ta sama. Dla kredytobiorcy deflacja jest więc niekorzystna, odwrotnie niż inflacja, która stopniowo zmniejsza realną wartość długu.',
      },
    ],
    related: ['inflacja', 'recesja', 'stopa-procentowa'],
  },
  {
    slug: 'recesja',
    term: 'Recesja',
    aliases: ['recesja', 'recesji', 'recesję', 'recesją'],
    short: 'Recesja to wyraźny, utrzymujący się spadek aktywności gospodarczej. Umownie mówi się o niej po dwóch kwartałach z rzędu spadku PKB.',
    body: [
      'W recesji rośnie bezrobocie, spadają zyski firm i wydatki konsumentów, a giełdy często reagują wcześniej, zniżkując w oczekiwaniu na spowolnienie. To naturalna faza cyklu koniunkturalnego.',
      'Dla inwestora długoterminowego recesje to przejściowe dołki, po których historycznie zawsze następowało odbicie. Poduszka finansowa i dywersyfikacja pomagają je przetrwać bez paniki.',
    ],
    related: ['pkb', 'bessa', 'poduszka-finansowa'],
  },
  {
    slug: 'stagflacja',
    term: 'Stagflacja',
    aliases: ['stagflacja', 'stagflacji', 'stagflację'],
    short: 'Stagflacja to rzadkie i trudne połączenie wysokiej inflacji z gospodarczą stagnacją i wysokim bezrobociem naraz.',
    body: [
      'Normalnie inflacja idzie w parze ze wzrostem gospodarczym, a nie ze stagnacją. Stagflacja łamie tę zależność i jest koszmarem banków centralnych, bo lekarstwo na inflację (wysokie stopy) dusi i tak słabą gospodarkę.',
      'Najgłośniejszy przykład to lata 70. XX wieku po szokach naftowych. Dla inwestorów to wymagające otoczenie, w którym ochrony szuka się m.in. w surowcach i aktywach realnych.',
    ],
    related: ['inflacja', 'recesja', 'stopa-procentowa'],
  },
  {
    slug: 'pkb',
    term: 'PKB',
    noindex: true, // wyłączone z indeksu Google (decyzja 2026-06-19)
    aliases: ['PKB', 'Produkt Krajowy Brutto', 'wzrost PKB'],
    short: 'PKB (Produkt Krajowy Brutto) to wartość wszystkich dóbr i usług wytworzonych w kraju w danym okresie. Podstawowa miara wielkości i kondycji gospodarki.',
    body: [
      'Wzrost PKB oznacza, że gospodarka się rozwija, a spadek sygnalizuje spowolnienie lub recesję. Patrzy się głównie na zmianę realną, czyli oczyszczoną z inflacji.',
      'PKB nie mówi wszystkiego: nie pokazuje nierówności ani jakości życia. Mimo to pozostaje najważniejszym punktem odniesienia dla polityki gospodarczej i rynków.',
    ],
    related: ['recesja', 'inflacja'],
  },
  {
    slug: 'stopa-procentowa',
    term: 'Stopa procentowa',
    aliases: ['stopa procentowa', 'stopy procentowe', 'stóp procentowych', 'stopami procentowymi'],
    short: 'Stopa procentowa to cena pieniądza: określa, ile kosztuje pożyczanie i ile można zarobić na oszczędnościach. Ustalają ją banki centralne.',
    body: [
      'W Polsce najważniejsza jest stopa referencyjna Narodowego Banku Polskiego, ustalana przez Radę Polityki Pieniężnej na comiesięcznych posiedzeniach. Wyznacza ona koszt, po jakim banki pożyczają pieniądze od banku centralnego i między sobą, a przez to poziom oprocentowania w całej gospodarce. Aktualną wysokość publikuje NBP.',
      'Przełożenie na kredyty przebiega przez wskaźnik referencyjny, czyli WIBOR, a docelowo POLSTR. Rata kredytu ze zmiennym oprocentowaniem składa się z tego wskaźnika i stałej marży banku. Gdy stopy rosną, rośnie wskaźnik, a w ślad za nim rata, mimo że marża zapisana w umowie się nie zmienia. Dostosowanie następuje w terminach określonych w umowie, zwykle co trzy lub sześć miesięcy.',
      'Na oszczędności stopy działają w drugą stronę, ale wolniej i mniej hojnie. Banki podnoszą oprocentowanie lokat i kont oszczędnościowych z opóźnieniem i zwykle w mniejszej skali, niż podnoszą koszt kredytów, ponieważ nie muszą konkurować o depozyty tak mocno jak o kredytobiorców.',
      'Dla rynku akcji wysokie stopy oznaczają dwa niekorzystne efekty naraz. Rosną koszty finansowania spółek, co obniża ich zyski, a jednocześnie bezpieczne obligacje zaczynają oferować przyzwoity zwrot, przez co akcje muszą konkurować o kapitał z instrumentem pozbawionym ryzyka. Dlatego zapowiedzi zmian stóp poruszają giełdą mocniej niż wiele innych informacji.',
      'Bank centralny steruje stopami, żeby utrzymać inflację blisko celu. Podnoszenie ich schładza gospodarkę: kredyt drożeje, konsumpcja i inwestycje słabną, presja na ceny maleje. Obniżanie działa odwrotnie. Efekt nie jest natychmiastowy i pojawia się z opóźnieniem liczonym w kwartałach, co jest jednym z najtrudniejszych elementów tej polityki.',
    ],
    example: {
      title: 'Ile zmienia 1 punkt procentowy w racie kredytu',
      text: 'Kredyt 400 000 zł na 25 lat przy oprocentowaniu 7 procent daje ratę około 2827 zł. Wzrost oprocentowania o 1 punkt procentowy, do 8 procent, podnosi ratę do około 3087 zł, czyli o 260 zł miesięcznie i ponad 3100 zł rocznie. Spadek do 6 procent obniża ją do około 2577 zł. Przy kredycie ze zmiennym oprocentowaniem te 250 zł w każdą stronę pojawiają się bez żadnej zmiany w umowie, wyłącznie w wyniku decyzji o stopach.',
    },
    faq: [
      {
        q: 'Kto ustala stopy procentowe w Polsce?',
        a: 'Rada Polityki Pieniężnej działająca przy Narodowym Banku Polskim, na posiedzeniach odbywających się zwykle raz w miesiącu. Decyzje dotyczą kilku stóp, z których najważniejsza jest stopa referencyjna, wpływająca na oprocentowanie w całej gospodarce.',
      },
      {
        q: 'Kiedy zmiana stóp wpłynie na moją ratę?',
        a: 'Przy kredycie ze zmiennym oprocentowaniem rata zmienia się w terminie aktualizacji wskaźnika referencyjnego zapisanym w umowie, najczęściej co trzy lub sześć miesięcy. Oznacza to opóźnienie między decyzją Rady a odczuwalną zmianą w domowym budżecie. Przy oprocentowaniu stałym rata pozostaje niezmieniona przez cały okres jego obowiązywania.',
      },
      {
        q: 'Dlaczego wyższe stopy szkodzą giełdzie?',
        a: 'Z dwóch powodów naraz. Spółki płacą więcej za finansowanie, co obniża ich zyski, a jednocześnie obligacje zaczynają oferować atrakcyjny zwrot bez ryzyka, więc kapitał ma dokąd odpłynąć z akcji. Dodatkowo wyższa stopa obniża bieżącą wycenę przyszłych zysków, co uderza najmocniej w spółki wzrostowe.',
      },
      {
        q: 'Czy przy wysokich stopach lepiej oszczędzać niż inwestować?',
        a: 'Wysokie stopy podnoszą oprocentowanie lokat, ale zwykle towarzyszy im podwyższona inflacja, która to oprocentowanie zjada. Znaczenie ma stopa realna, czyli oprocentowanie po odjęciu inflacji i podatku, a nie sama wysokość odsetek. Decyzję trafniej opiera się na horyzoncie i celu niż na aktualnym poziomie stóp.',
      },
    ],
    related: ['nbp', 'inflacja', 'wibor'],
  },
  {
    slug: 'stopa-referencyjna',
    term: 'Stopa referencyjna',
    aliases: ['stopa referencyjna', 'stopa NBP', 'główna stopa procentowa'],
    short: 'Stopa referencyjna to główna stopa procentowa banku centralnego, która wyznacza poziom pozostałych stóp i wpływa na koszt pieniądza w całej gospodarce.',
    body: [
      'W Polsce ustala ją Rada Polityki Pieniężnej przy NBP. Jej zmiany przekładają się na oprocentowanie kredytów, lokat i pośrednio na WIBOR, a więc na raty kredytów hipotecznych.',
      'Podnosząc stopę referencyjną, bank centralny walczy z inflacją kosztem droższego kredytu. Obniżając, pobudza gospodarkę. Decyzje śledzą zarówno kredytobiorcy, jak i inwestorzy.',
    ],
    related: ['nbp', 'stopa-procentowa', 'wibor'],
  },
  {
    slug: 'nbp',
    term: 'NBP',
    aliases: ['NBP', 'Narodowy Bank Polski'],
    short: 'NBP (Narodowy Bank Polski) to bank centralny Polski. Odpowiada za emisję złotego, stabilność cen i ustalanie stóp procentowych.',
    body: [
      'Przez Radę Polityki Pieniężnej NBP ustala stopy procentowe, dążąc do utrzymania inflacji w celu. Wpływa tym na kredyty, oszczędności i kurs złotego.',
      'NBP pełni też rolę banku banków i zarządza rezerwami walutowymi kraju. Jego decyzje są jednym z najważniejszych sygnałów dla polskiej gospodarki i rynków.',
    ],
    related: ['stopa-referencyjna', 'inflacja', 'ebc'],
  },
  {
    slug: 'fed',
    term: 'Fed',
    aliases: ['Fed', 'Rezerwa Federalna', 'Federal Reserve'],
    short: 'Fed (Rezerwa Federalna) to bank centralny USA. Jego decyzje o stopach procentowych wpływają na rynki finansowe na całym świecie, nie tylko w Ameryce.',
    body: [
      'Fed ustala stopy w USA i steruje podażą dolara, waluty rezerwowej świata. Gdy podnosi stopy, kapitał płynie do USA, co osłabia inne waluty i rynki wschodzące.',
      'Wypowiedzi szefa Fedu potrafią ruszyć giełdy na całym świecie w kilka minut. To najbardziej wpływowy bank centralny globu.',
    ],
    related: ['ebc', 'nbp', 'stopa-procentowa'],
  },
  {
    slug: 'ebc',
    term: 'EBC',
    aliases: ['EBC', 'Europejski Bank Centralny', 'ECB'],
    short: 'EBC (Europejski Bank Centralny) to bank centralny strefy euro. Ustala stopy procentowe dla krajów posługujących się euro i dba o stabilność cen w strefie.',
    body: [
      'Choć Polska nie jest w strefie euro, decyzje EBC wpływają na nią pośrednio: przez kurs euro, nastroje na rynkach i powiązania gospodarcze z zachodnimi partnerami.',
      'EBC, obok Fedu, to jeden z dwóch najważniejszych banków centralnych świata. Jego polityka pieniężna oddziałuje na całą europejską gospodarkę.',
    ],
    related: ['fed', 'nbp', 'stopa-procentowa'],
  },
  {
    slug: 'hossa',
    term: 'Hossa',
    aliases: ['hossa', 'hossy', 'rynek byka', 'bull market'],
    short: 'Hossa to długotrwały wzrost cen na rynku, okres dominacji optymizmu i kupujących. Nazywana też rynkiem byka.',
    body: [
      'Technicznie za początek hossy przyjmuje się zwykle wzrost indeksu o co najmniej 20 procent od dołka, choć jest to umowna granica, a nie ścisła definicja. Ważniejsza jest struktura rynku: kolejne szczyty i dołki wypadają coraz wyżej, spadki są płytkie i szybko wykupywane, a powroty do wcześniejszych poziomów nie następują.',
      'Hossa trwa zwykle dłużej niż bessa, choć rośnie wolniej. Bessa jest gwałtowna i emocjonalna, hossa rozciąga się latami i przez większość czasu wygląda nudno. Ta asymetria ma praktyczną konsekwencję: inwestor, który wychodzi z rynku przy każdym niepokoju, częściej wypada z powolnych wzrostów, niż unika szybkich spadków.',
      'Charakterystyczne dla dojrzałej hossy jest przesuwanie się uwagi. Na początku rosną spółki o solidnych fundamentach, bo są tanie po bessie. Później kapitał przechodzi do aktywów bardziej ryzykownych i spekulacyjnych, pojawiają się nowe emisje, rośnie zainteresowanie mediów i osób, które wcześniej nie inwestowały. Powszechne przekonanie, że tym razem jest inaczej, historycznie pojawiało się blisko końca cyklu.',
      'Największym zagrożeniem w hossie nie jest sam rynek, tylko wnioski, jakie inwestor z niej wyciąga o sobie. Rosnący rynek podnosi prawie wszystko, więc łatwo pomylić sprzyjające warunki z własną umiejętnością. Stąd bierze się zwiększanie pozycji, rezygnacja z zasad ryzyka i kupowanie coraz droższych aktywów w przekonaniu, że spadki się skończyły.',
      'Rozsądne zachowanie w hossie jest nudne i sprowadza się do trzymania planu: regularne wpłaty niezależnie od nastroju, okresowe przywracanie zamierzonych proporcji portfela i niepowiększanie ryzyka tylko dlatego, że ostatnie miesiące były udane.',
    ],
    example: {
      title: 'Dlaczego wychodzenie z rynku „na chwilę" tyle kosztuje',
      text: 'Wzrosty w czasie hossy rozkładają się bardzo nierówno i koncentrują w krótkich okresach. Portfel wart 100 000 zł rosnący średnio 8 procent rocznie osiąga po 20 latach około 466 tys. zł. Ten sam portfel przy stopie obniżonej do 5 procent, bo część najlepszych okresów spędził poza rynkiem, kończy z około 265 tys. zł. Trzy punkty procentowe różnicy, wynikające z kilku decyzji o przeczekaniu, kosztują w tym przykładzie około 200 tys. zł.',
    },
    faq: [
      {
        q: 'Kiedy zaczyna się hossa?',
        a: 'Umownie przyjmuje się wzrost głównego indeksu o co najmniej 20 procent od dołka, ale w praktyce początek hossy rozpoznaje się dopiero z perspektywy czasu. W momencie, w którym się zaczyna, nastroje są zwykle złe, a wiadomości gospodarcze nadal negatywne.',
      },
      {
        q: 'Ile trwa hossa?',
        a: 'Historycznie hossy trwały dłużej niż bessy, często kilka lat, choć rozpiętość jest duża i żaden cykl nie powtarza poprzedniego. Nie ma kalendarza, który pozwalałby przewidzieć koniec, dlatego strategie oparte na zgadywaniu momentu wyjścia zawodzą częściej, niż pomagają.',
      },
      {
        q: 'Czy w czasie hossy można jeszcze kupować?',
        a: 'Tak, przy czym rosnące wyceny oznaczają niższe oczekiwane stopy zwrotu w przyszłości. Dla inwestora długoterminowego rozwiązaniem jest regularność wpłat zamiast prób trafienia w idealny moment, bo próba przeczekania hossy poza rynkiem historycznie kosztowała więcej niż kupowanie po wyższych cenach.',
      },
      {
        q: 'Czym hossa różni się od bańki?',
        a: 'Hossa to wzrost wynikający z poprawy wyników i warunków gospodarczych. Bańka to sytuacja, w której ceny oderwały się od tego, co uzasadniają zyski spółek, a wzrost napędza głównie oczekiwanie dalszego wzrostu. Granica bywa czytelna dopiero po fakcie, ale sygnałem ostrzegawczym jest rosnąca rola dźwigni i argument, że stare miary wyceny przestały obowiązywać.',
      },
    ],
    related: ['bessa', 'korekta', 'banka-spekulacyjna'],
  },
  {
    slug: 'bessa',
    term: 'Bessa',
    aliases: ['bessa', 'bessy', 'rynek niedźwiedzia', 'bear market'],
    short: 'Bessa to długotrwały spadek cen na rynku, okres pesymizmu i przewagi sprzedających. Nazywana też rynkiem niedźwiedzia.',
    body: [
      'Umownie o bessie mówi się przy spadku o ponad 20% od szczytu. Towarzyszą jej strach, wyprzedaże i złe nagłówki. Bywa bolesna, ale jest naturalną fazą cyklu.',
      'Dla cierpliwego inwestora bessa to czas okazji: te same aktywa kupujesz taniej. Historycznie po każdej bessie przychodziła hossa, choć nikt nie zna jej dokładnego dna.',
    ],
    related: ['hossa', 'recesja', 'korekta'],
  },
  {
    slug: 'korekta',
    term: 'Korekta',
    aliases: ['korekta', 'korekty', 'korektę', 'korekta rynkowa'],
    short: 'Korekta to przejściowy spadek cen w trakcie trendu wzrostowego, umownie o około 10% od szczytu. Krótsza i płytsza niż bessa.',
    body: [
      'Korekty są zdrowe i normalne: schładzają rozgrzany rynek i wytrząsają słabe ręce. Często mylone z początkiem bessy, co wywołuje niepotrzebną panikę.',
      'Dla inwestora długoterminowego korekta to zwykle okazja do dokupienia, a nie powód do ucieczki. Próby przewidzenia każdej korekty częściej szkodzą, niż pomagają.',
    ],
    related: ['hossa', 'bessa', 'trend'],
  },
  {
    slug: 'krach',
    term: 'Krach giełdowy',
    aliases: ['krach', 'krachu', 'krach giełdowy', 'krach na giełdzie'],
    short: 'Krach to gwałtowny, paniczny spadek cen na giełdzie w bardzo krótkim czasie, często o kilkanaście procent w ciągu kilku dni albo nawet jednej sesji.',
    body: [
      'Krach różni się od zwykłego spadku tempem, a nie samą skalą. Przyjęło się, że cofnięcie rynku o około 10 procent to korekta, spadek o 20 procent i więcej rozciągnięty w czasie to bessa, a krach to sytuacja, w której podobna przecena dzieje się w dni albo godziny. To rozróżnienie ma znaczenie praktyczne: korekta zdarza się niemal co roku, bessa co kilka lat, a krach jest rzadki i zwykle zapamiętywany z nazwy.',
      'Mechanizm jest za każdym razem podobny. Zaczyna się od wydarzenia, które podważa wcześniejsze założenia rynku, ale prawdziwe przyspieszenie daje dopiero sprzężenie zwrotne. Inwestorzy z dźwignią dostają wezwania do uzupełnienia depozytu i muszą sprzedawać, żeby je pokryć. Sprzedaż zbija ceny niżej, co uruchamia kolejne wezwania i kolejne zlecenia obronne. Do tego dochodzą systemy automatyczne, które reagują na zmienność, oraz zwykła ludzka panika. Rynek przestaje wyceniać wartość spółek, a zaczyna wyceniać to, kto musi sprzedać natychmiast.',
      'Najczęściej przywoływane przykłady to październik 1929 roku, który otworzył wielki kryzys, Czarny Poniedziałek 19 października 1987 roku z jednodniowym spadkiem indeksu Dow Jones o ponad 22 procent, kryzys finansowy 2008 roku oraz krach pandemiczny z marca 2020 roku, kiedy amerykański rynek przeszedł do bessy w tempie najszybszym w swojej historii.',
      'Dla inwestora ważniejsze od samego spadku jest to, co działo się potem. Krach z marca 2020 roku został odrobiony w kilka miesięcy. Spadki z 2008 roku wymagały kilku lat. Po 1929 roku powrót do poprzedniego poziomu zajął ponad dwie dekady. Historia nie obiecuje więc szybkiego odbicia, pokazuje za to regułę odwrotną: im większa dźwignia i im krótszy horyzont, tym mniejsza szansa, że doczekasz odrobienia straty.',
      'Najdroższą decyzją w krachu jest zwykle sprzedaż na dnie, po tym jak strata stała się nie do zniesienia psychicznie. Zapobiega się temu przed krachem, a nie w jego trakcie: poduszką finansową, która zdejmuje przymus sprzedaży, wielkością pozycji dopasowaną do własnej odporności i spisanym planem, który mówi, co robisz przy spadku o 20 czy 30 procent.',
    ],
    example: {
      title: 'Dlaczego odrabianie boli bardziej, niż się wydaje',
      text: 'Spadek nie jest symetryczny ze wzrostem, który go odrabia. Portfel wart 100 000 zł po przecenie o 30 procent jest wart 70 000 zł. Żeby wrócić do punktu wyjścia, musi zyskać nie 30, lecz około 43 procent. Przy spadku o 50 procent potrzeba już wzrostu o 100 procent. To arytmetyka, która tłumaczy, dlaczego ochrona kapitału jest ważniejsza od pogoni za ostatnimi procentami zysku.',
    },
    faq: [
      {
        q: 'Czym różni się krach od bessy?',
        a: 'Różnicą jest tempo. Bessa to długotrwały spadek rynku, zwykle o 20 procent i więcej, rozłożony na miesiące. Krach to gwałtowna przecena o podobnej lub większej skali, która dzieje się w ciągu dni albo jednej sesji. Krach często rozpoczyna bessę, ale nie musi: w 1987 roku po jednodniowym załamaniu rynek wrócił do wzrostów stosunkowo szybko.',
      },
      {
        q: 'Ile trwa odrobienie krachu?',
        a: 'Nie ma jednej odpowiedzi i to jest sedno ryzyka. Spadek z marca 2020 roku amerykański rynek odrobił w kilka miesięcy, straty z kryzysu 2008 roku wymagały kilku lat, a po krachu z 1929 roku powrót do poprzedniego poziomu zajął ponad dwadzieścia lat. Dlatego pieniądze potrzebne w krótkim horyzoncie nie powinny leżeć na rynku akcji.',
      },
      {
        q: 'Czy da się przewidzieć krach?',
        a: 'Co do dnia nie. Można natomiast rozpoznać warunki, w których ryzyko rośnie: wysokie wyceny oderwane od zysków spółek, powszechny optymizm, dużo kapitału na kredyt i przekonanie, że spadki się skończyły. To sygnały do ostrożniejszego doboru wielkości pozycji, a nie do próby trafienia w szczyt.',
      },
      {
        q: 'Co robić, gdy krach już trwa?',
        a: 'Przede wszystkim nie podejmować decyzji, których nie przewidziałeś wcześniej. Jeśli inwestujesz długoterminowo i nie musisz sięgać po te pieniądze, sprzedaż po dużym spadku zamienia stratę papierową w rzeczywistą. Jeśli handlujesz z dźwignią, priorytetem jest ograniczenie ryzyka, bo w krachu poślizgi rosną i zlecenia obronne realizują się gorzej niż zwykle.',
      },
    ],
    related: ['bessa', 'banka-spekulacyjna', 'recesja'],
  },
  {
    slug: 'banka-spekulacyjna',
    term: 'Bańka spekulacyjna',
    aliases: ['bańka spekulacyjna', 'bańka', 'bańki spekulacyjnej', 'bańka cenowa'],
    short: 'Bańka spekulacyjna to gwałtowny wzrost ceny aktywa znacznie ponad jego realną wartość, napędzany euforią i spekulacją, który kończy się pęknięciem.',
    body: [
      'Bańki powstają, gdy ludzie kupują tylko dlatego, że ceny rosną, w przekonaniu, że sprzedadzą drożej. Klasyczne przykłady to tulipanowa mania, bańka dot-comów czy niektóre szczyty na krypto.',
      'Pęknięcie bańki przynosi gwałtowne spadki i straty spóźnionych kupujących. Rozpoznanie bańki na czas jest trudne, bo w euforii zawsze pojawia się narracja, że tym razem jest inaczej.',
    ],
    related: ['krach', 'hossa', 'bessa'],
  },
  {
    slug: 'qe',
    term: 'QE (luzowanie ilościowe)',
    aliases: ['QE', 'luzowanie ilościowe', 'quantitative easing', 'dodruk pieniądza'],
    short: 'QE (luzowanie ilościowe) to skup aktywów przez bank centralny za nowo wykreowane pieniądze, by pobudzić gospodarkę, gdy obniżki stóp już nie wystarczają.',
    body: [
      'Luzowanie ilościowe wchodzi do gry wtedy, gdy zwykłe narzędzie banku centralnego, czyli obniżanie stóp procentowych, dobiega do granicy w okolicach zera i przestaje wystarczać. Bank sięga wówczas po działanie nadzwyczajne: tworzy nowy pieniądz i za niego skupuje z rynku aktywa, przede wszystkim obligacje skarbowe, a czasem inne papiery.',
      'Mechanizm działa dwutorowo. Skup obligacji podbija ich cenę, a że cena obligacji porusza się odwrotnie do rentowności, spadają długoterminowe stopy w gospodarce, czyli koszt kredytów hipotecznych i firmowych. Jednocześnie pieniądz, który trafia do sprzedających obligacje, szuka zysku gdzie indziej, więc płynie w akcje, nieruchomości i inne aktywa, podnosząc ich ceny.',
      'I tu leży najczęściej pomijana konsekwencja. QE podnosi wyceny aktywów, a te posiadają głównie zamożniejsi, więc polityka pomyślana jako ratunek dla całej gospodarki bywa krytykowana za powiększanie nierówności majątkowych. To jeden z powodów, dla których pozostaje narzędziem kontrowersyjnym, a nie rutynowym.',
      'Drugim ryzykiem jest inflacja. Zwiększenie ilości pieniądza w systemie nie musi od razu podnosić cen, jeśli gospodarka jest słaba i pieniądz nie krąży, ale w sprzyjających warunkach może to zrobić z opóźnieniem. Dlatego decyzje o skali i czasie trwania takiego programu należą do najtrudniejszych w polityce pieniężnej.',
      'Operacją odwrotną jest zacieśnianie ilościowe: bank centralny pozwala skupionym obligacjom wygasać albo je sprzedaje, ściągając pieniądz z rynku. Działa to jak podnoszenie długoterminowych stóp i zwykle ciąży wycenom aktywów, które wcześniej rosły dzięki luzowaniu.',
    ],
    example: {
      title: 'Dlaczego skup obligacji obniża oprocentowanie kredytów',
      text: 'Cena obligacji i jej rentowność poruszają się w przeciwne strony. Gdy bank centralny masowo skupuje obligacje, ich cena rośnie, a rentowność spada, na przykład z 5 do 3 procent. Ponieważ oprocentowanie długoterminowych kredytów jest powiązane z rentownością obligacji skarbowych, tańsze staje się finansowanie hipotek i inwestycji firm. To właśnie tą drogą, a nie bezpośrednim rozdawaniem pieniędzy, luzowanie pobudza gospodarkę.',
    },
    faq: [
      {
        q: 'Czy QE to dodruk pieniądza?',
        a: 'W potocznym sensie tak, bo bank centralny tworzy nowy pieniądz, żeby skupić aktywa. Różnica wobec dosłownego drukowania polega na tym, że pieniądz nie trafia bezpośrednio do obywateli, tylko na rynek finansowy w zamian za obligacje, a program można odwrócić, ściągając ten pieniądz z powrotem.',
      },
      {
        q: 'Jak QE wpływa na giełdę?',
        a: 'Zwykle podbija ceny akcji i innych aktywów. Dzieje się tak, bo spadają rentowności obligacji, przez co akcje stają się relatywnie atrakcyjniejsze, a pieniądz od sprzedających obligacje szuka zysku na rynku. Zacieśnianie ilościowe, czyli operacja odwrotna, działa na wyceny w drugą stronę.',
      },
      {
        q: 'Czy luzowanie ilościowe powoduje inflację?',
        a: 'Może, ale nie musi. Samo zwiększenie ilości pieniądza nie podnosi cen, jeśli gospodarka jest słaba i pieniądz nie krąży. Ryzyko inflacji rośnie, gdy popyt się odbudowuje, a program trwa długo. Efekt jest opóźniony i zależny od stanu gospodarki, co czyni dozowanie tego narzędzia trudnym.',
      },
      {
        q: 'Co to jest zacieśnianie ilościowe?',
        a: 'To odwrotność luzowania. Bank centralny zmniejsza swój portfel obligacji, pozwalając im wygasać albo je sprzedając, i w ten sposób ściąga pieniądz z rynku. Podnosi to długoterminowe stopy i zwykle obniża wyceny aktywów, które wcześniej korzystały na luzowaniu.',
      },
    ],
    related: ['inflacja', 'stopa-procentowa', 'fed'],
  },
  {
    slug: 'wig20',
    term: 'WIG20',
    aliases: ['WIG20', 'indeks WIG20'],
    short: 'WIG20 to indeks 20 największych i najpłynniejszych spółek notowanych na GPW w Warszawie. Główny barometr polskiej giełdy.',
    body: [
      'Gdy mówi się o kondycji polskiego rynku akcji, najczęściej chodzi o WIG20. W jego skład wchodzą czołowe polskie spółki, między innymi banki i firmy paliwowe.',
      'WIG20 można pośrednio kupić przez ETF-y i kontrakty na ten indeks. Obok niego istnieje szerszy WIG, obejmujący znacznie więcej spółek z giełdy.',
    ],
    related: ['indeks-gieldowy', 'gpw', 'akcja'],
  },
  {
    slug: 'fomo',
    term: 'FOMO',
    aliases: ['FOMO', 'strach przed przegapieniem', 'Fear of Missing Out'],
    short: 'FOMO (strach przed przegapieniem okazji) to emocja, która każe kupować w pośpiechu, bo cena rośnie i boisz się, że ominie Cię zysk.',
    body: [
      'FOMO każe wchodzić na szczytach, bez planu, pod wpływem tłumu i nagłówków. To jeden z najkosztowniejszych błędów inwestora, bo prowadzi do kupowania drogo i sprzedawania tanio w panice.',
      'Antidotum to plan i zasady ustalone na zimno, zanim emocje wejdą do gry. Rynek zawsze stworzy nową okazję, przegapienie jednej nie jest katastrofą.',
    ],
    related: ['fud', 'owczy-ped', 'banka-spekulacyjna'],
  },
  {
    slug: 'fud',
    term: 'FUD',
    aliases: ['FUD', 'Fear Uncertainty Doubt'],
    short: 'FUD (strach, niepewność, wątpliwości) to negatywne emocje i informacje, które wywołują paniczną wyprzedaż, często niezależnie od fundamentów.',
    body: [
      'FUD bywa naturalny (złe wieści) albo celowo rozsiewany, by zbić cenę. Pod jego wpływem inwestorzy sprzedają w panice, na dnie, realizując straty, których dało się uniknąć.',
      'Termin spopularyzowała społeczność krypto, ale zjawisko dotyczy każdego rynku. Obrona to chłodna ocena faktów zamiast reagowania na emocjonalne nagłówki.',
    ],
    related: ['fomo', 'owczy-ped', 'bessa'],
  },
  {
    slug: 'revenge-trading',
    term: 'Revenge trading',
    aliases: ['revenge trading', 'odgrywanie się', 'handel z zemsty'],
    short: 'Revenge trading to próba szybkiego odrobienia straty przez kolejne, pochopne transakcje, podejmowane pod wpływem złości zamiast chłodnej analizy.',
    body: [
      'Po bolesnej stracie pojawia się chęć odbicia się natychmiast. Trader zwiększa ryzyko, ignoruje plan i zwykle pogłębia straty. To emocjonalna spirala, nie strategia.',
      'Lekarstwo to odejście od ekranu po stracie i powrót dopiero na spokojnie. Z góry ustalony dzienny limit straty chroni przed tym mechanizmem.',
    ],
    related: ['stop-loss', 'awersja-do-straty', 'drawdown'],
  },
  {
    slug: 'awersja-do-straty',
    term: 'Awersja do straty',
    aliases: ['awersja do straty', 'awersji do straty', 'loss aversion'],
    short: 'Awersja do straty to skłonność psychiki, w której ból straty odczuwamy mocniej niż przyjemność z zysku tej samej wielkości, zwykle około dwukrotnie.',
    body: [
      'Zjawisko opisali Daniel Kahneman i Amos Tversky w ramach teorii perspektywy, za którą Kahneman otrzymał później Nagrodę Nobla z ekonomii. Ich badania pokazały, że strata określonej kwoty boli mniej więcej dwa razy mocniej, niż cieszy zysk tej samej wielkości. To nie jest wada charakteru, tylko powszechna cecha ludzkiego umysłu.',
      'Skutek w inwestowaniu jest bardzo konkretny. Sprzedaż stratnej pozycji oznacza przyznanie się do błędu i domknięcie bolesnego rozdziału, więc odkładamy ją, licząc na powrót ceny. Jednocześnie zysk chcemy zamknąć szybko, żeby go nie stracić. Efekt jest dokładnie odwrotny do tego, czego wymaga rentowna strategia: małe zyski i duże straty.',
      'Ten sam mechanizm stoi za innymi błędami. Przesuwanie stop lossa dalej, gdy cena się zbliża, to unikanie bólu straty kosztem powiększenia ryzyka. Uśrednianie w dół na stratnej pozycji często nie jest decyzją analityczną, tylko sposobem na obniżenie ceny wejścia, żeby powrót do zera wydawał się bliższy. Odgrywanie się po stracie to próba natychmiastowego zlikwidowania nieprzyjemnego uczucia.',
      'Awersja do straty tłumaczy też zachowania poza rynkiem: trzymanie oszczędności na nisko oprocentowanym koncie zamiast zainwestowania ich, przywiązanie do przecenionego mieszkania kupionego drożej czy niechęć do sprzedaży samochodu poniżej ceny zakupu. W każdym z tych przypadków punktem odniesienia jest cena, którą sami zapłaciliśmy, choć dla rynku jest ona bez znaczenia.',
      'Neutralizuje się ją nie siłą woli, tylko konstrukcją decyzji. Poziom wyjścia ustala się przed wejściem, kiedy nie ma jeszcze emocji, i zapisuje razem z uzasadnieniem. Pomaga też pytanie kontrolne: gdybym tej pozycji dziś nie miał, czy otworzyłbym ją po obecnej cenie. Jeśli odpowiedź brzmi nie, to trzymasz ją wyłącznie dlatego, że nie chcesz zaksięgować straty.',
    ],
    example: {
      title: 'Asymetria, która wywraca statystykę strategii',
      text: 'Trader ma strategię z trafnością 50 procent, planowaną stratą 100 zł i planowanym zyskiem 200 zł na transakcję. Na papierze po 10 transakcjach daje to 500 zł zysku. W praktyce awersja do straty każe mu zamykać zyski przy 80 zł, a stratne pozycje trzymać, aż urosną do 250 zł. Te same 10 transakcji przy tej samej trafności daje wtedy 850 zł straty. Strategia się nie zmieniła, zmieniło się tylko wykonanie.',
    },
    faq: [
      {
        q: 'Czym jest awersja do straty?',
        a: 'To udokumentowana skłonność psychiki, w której ból związany ze stratą jest odczuwany około dwukrotnie silniej niż przyjemność z zysku o tej samej wartości. Opisali ją Daniel Kahneman i Amos Tversky w teorii perspektywy, a zjawisko należy do najlepiej potwierdzonych obserwacji ekonomii behawioralnej.',
      },
      {
        q: 'Jak awersja do straty szkodzi inwestorowi?',
        a: 'Prowadzi do zbyt długiego trzymania stratnych pozycji i zbyt szybkiego zamykania zyskownych, czyli do odwrócenia proporcji, na której opiera się rentowność strategii. Stoi też za przesuwaniem stop lossa, uśrednianiem w dół i odgrywaniem się po stracie.',
      },
      {
        q: 'Czy da się ją wyeliminować?',
        a: 'Nie da się jej usunąć, bo jest wbudowana w sposób działania umysłu, ale można ograniczyć jej wpływ na decyzje. Skuteczne są rozwiązania mechaniczne: ustalenie poziomu wyjścia przed otwarciem pozycji, zlecenia obronne złożone od razu i prowadzenie dziennika, który pokazuje rozbieżność między planem a wykonaniem.',
      },
      {
        q: 'Czym różni się od efektu dyspozycji?',
        a: 'Awersja do straty to mechanizm psychologiczny, czyli przyczyna. Efekt dyspozycji to jego obserwowalny skutek na rynku, polegający na realizowaniu zysków wcześniej niż strat. Pierwsze wyjaśnia, dlaczego drugie występuje tak powszechnie.',
      },
    ],
    related: ['efekt-dyspozycji', 'revenge-trading', 'stop-loss'],
  },
  {
    slug: 'efekt-dyspozycji',
    term: 'Efekt dyspozycji',
    aliases: ['efekt dyspozycji', 'disposition effect'],
    short: 'Efekt dyspozycji to tendencja do sprzedawania zyskownych inwestycji zbyt wcześnie, a trzymania stratnych zbyt długo, wbrew zdrowemu rozsądkowi.',
    body: [
      'To praktyczny skutek awersji do straty: realizujemy małe zyski dla poczucia wygranej, a stratę trzymamy, bo sprzedaż oznaczałaby przyznanie się do błędu.',
      'Efekt obniża wyniki portfela. Przeciwdziała mu z góry ustalony plan wyjścia i trzymanie się go niezależnie od emocji.',
    ],
    related: ['awersja-do-straty', 'stop-loss', 'take-profit'],
  },
  {
    slug: 'blad-potwierdzenia',
    term: 'Błąd potwierdzenia',
    aliases: ['błąd potwierdzenia', 'confirmation bias', 'efekt potwierdzenia'],
    short: 'Błąd potwierdzenia to skłonność do szukania i przyjmowania tylko tych informacji, które potwierdzają nasze przekonania, z pominięciem przeczących.',
    body: [
      'Inwestor zakochany w spółce czyta tylko pozytywne analizy i ignoruje sygnały ostrzegawcze. To prowadzi do trzymania złych pozycji i ślepoty na ryzyko.',
      'Obrona to celowe szukanie argumentów przeciwnych własnej tezie i uczciwe konfrontowanie się z nimi. Dobry inwestor pyta, co może pójść nie tak, nie tylko dlaczego ma rację.',
    ],
    related: ['owczy-ped', 'analiza-fundamentalna'],
  },
  {
    slug: 'owczy-ped',
    term: 'Owczy pęd',
    aliases: ['owczy pęd', 'stadny instynkt', 'herd behavior', 'efekt stada'],
    short: 'Owczy pęd to podążanie za tłumem na rynku: kupowanie, bo wszyscy kupują, i sprzedawanie, bo wszyscy sprzedają, bez własnej analizy.',
    body: [
      'Stadny instynkt napędza bańki (euforyczne kupowanie) i krachy (paniczna wyprzedaż). Tłum na rynku często ma rację w środku trendu, ale myli się na skrajnościach.',
      'Najlepsze okazje powstają zwykle wtedy, gdy działa się wbrew tłumowi. Wymaga to jednak własnego planu i odporności na presję otoczenia.',
    ],
    related: ['fomo', 'fud', 'banka-spekulacyjna'],
  },
  {
    slug: 'zakotwiczenie',
    term: 'Zakotwiczenie',
    aliases: ['zakotwiczenie', 'efekt zakotwiczenia', 'anchoring', 'kotwica cenowa'],
    short: 'Zakotwiczenie to błąd polegający na zbytnim przywiązaniu do pierwszej poznanej liczby, na przykład ceny zakupu, przy ocenie wartości.',
    body: [
      'Inwestor zakotwiczony na cenie, po której kupił akcję, ocenia jej atrakcyjność względem tej liczby, a nie realnej wartości. Czeka z wyjściem, aż wróci do ceny zakupu, choć rynek się zmienił.',
      'Cena, którą zapłaciłeś, nie ma znaczenia dla rynku, liczy się to, co aktywo jest warte teraz i w przyszłości. Świadomość kotwicy pomaga podejmować decyzje na chłodno.',
    ],
    related: ['blad-potwierdzenia', 'efekt-dyspozycji'],
  },
  {
    slug: 'ksiegowanie-mentalne',
    term: 'Księgowanie mentalne',
    aliases: ['księgowanie mentalne', 'mental accounting', 'rachunkowość mentalna'],
    short: 'Księgowanie mentalne to traktowanie pieniędzy różnie w zależności od ich pochodzenia, mimo że złotówka jest zawsze warta tyle samo.',
    body: [
      'Wygraną w totka albo premię łatwiej wydajemy lub ryzykujemy niż ciężko zarobione pieniądze, choć ich wartość jest identyczna. Tak samo dzielimy budżet na sztywne koperty, tracąc elastyczność.',
      'Ten błąd prowadzi do nieracjonalnych decyzji, na przykład trzymania oszczędności na nisko oprocentowanym koncie i jednoczesnego spłacania drogiego długu. Pieniądz działa tak samo niezależnie od tego, w której „przegródce” go umieścisz.',
    ],
    related: ['poduszka-finansowa', 'awersja-do-straty'],
  },
  {
    slug: 'kryptowaluta',
    term: 'Kryptowaluta',
    aliases: ['kryptowaluta', 'kryptowaluty', 'krypto', 'kryptowalut', 'kryptowalutami'],
    short: 'Kryptowaluta to cyfrowa waluta oparta na kryptografii i technologii blockchain, działająca bez centralnego emitenta jak bank czy państwo.',
    body: [
      'Transakcje zapisywane są w rozproszonym rejestrze (blockchain), co utrudnia fałszerstwo i nie wymaga zaufanego pośrednika. Najbardziej znane to Bitcoin i Ethereum.',
      'Krypto cechuje bardzo wysoka zmienność i ryzyko, łącznie z możliwością utraty całego kapitału. To aktywo spekulacyjne, do którego podchodzi się ostrożnie i tylko za pieniądze, które możesz stracić.',
    ],
    related: ['bitcoin', 'blockchain', 'zmiennosc'],
  },
  {
    slug: 'bitcoin',
    term: 'Bitcoin',
    aliases: ['Bitcoin', 'BTC', 'bitcoina', 'bitcoinie'],
    short: 'Bitcoin (BTC) to pierwsza i największa kryptowaluta, uruchomiona w 2009 roku. Ma ograniczoną podaż do 21 milionów sztuk, co czyni go cyfrowo rzadkim.',
    body: [
      'Zwolennicy widzą w nim cyfrowe złoto i zabezpieczenie przed inflacją walut, a sceptycy aktywo bez wartości wewnętrznej, napędzane spekulacją. Prawda bywa gdzieś pomiędzy.',
      'Bitcoin słynie z ekstremalnej zmienności: potrafi zyskać lub stracić kilkadziesiąt procent w tygodnie. To aktywo wysokiego ryzyka, nie substytut oszczędności.',
    ],
    related: ['kryptowaluta', 'blockchain', 'halving'],
  },
  {
    slug: 'blockchain',
    term: 'Blockchain',
    aliases: ['blockchain', 'łańcuch bloków', 'technologia blockchain'],
    short: 'Blockchain (łańcuch bloków) to rozproszona, niezmienialna baza danych, w której zapisy grupowane są w bloki połączone kryptograficznie. Podstawa kryptowalut.',
    body: [
      'Kopie rejestru przechowuje wiele komputerów naraz, więc nie ma jednego punktu kontroli ani łatwego sposobu na sfałszowanie historii. To zapewnia przejrzystość i odporność na manipulację.',
      'Poza kryptowalutami technologia bywa stosowana między innymi w śledzeniu łańcuchów dostaw i umowach (smart kontrakty), choć wokół tematu narosło też dużo szumu.',
    ],
    related: ['kryptowaluta', 'bitcoin'],
  },
  {
    slug: 'stablecoin',
    term: 'Stablecoin',
    aliases: ['stablecoin', 'stablecoiny', 'stabilna kryptowaluta'],
    short: 'Stablecoin to kryptowaluta, której kurs jest powiązany ze stabilnym aktywem, najczęściej dolarem, by uniknąć typowej dla krypto zmienności.',
    body: [
      'Stablecoiny pełnią na rynku kryptowalut rolę gotówki. Pozwalają wyjść z pozycji bez przewalutowania na złote czy dolary, rozliczać transakcje między giełdami i przechowywać środki między jedną a drugą inwestycją, bez narażania ich na typową dla krypto zmienność. Najbardziej znane to USDT i USDC, oba powiązane z dolarem.',
      'Utrzymanie stałego kursu odbywa się na kilka sposobów i to właśnie one decydują o ryzyku. Najpopularniejsze są stablecoiny zabezpieczone rezerwami: emitent deklaruje, że za każdą wyemitowaną jednostkę trzyma odpowiednik w gotówce lub krótkoterminowych obligacjach. Istnieją też konstrukcje zabezpieczone innymi kryptowalutami z nadmiarowym pokryciem oraz, historycznie, tak zwane algorytmiczne, utrzymujące kurs wyłącznie mechanizmem podaży.',
      'Ten ostatni wariant okazał się najbardziej zawodny. W maju 2022 roku algorytmiczny stablecoin TerraUSD stracił powiązanie z dolarem i w ciągu kilku dni jego wartość praktycznie wyparowała, pociągając za sobą powiązany token i wywołując falę upadłości w całym sektorze. To najczęściej przywoływany dowód na to, że słowo "stable" w nazwie jest deklaracją, a nie gwarancją.',
      'Przy stablecoinach zabezpieczonych rezerwami ryzyko jest inne, ale realne. Sprowadza się do pytania, czy rezerwy faktycznie istnieją, w czym są trzymane i kto to potwierdza. Utrata parytetu, nazywana depegiem, zdarzała się także dużym emitentom w reakcji na wątpliwości co do jakości zabezpieczenia lub kondycji banku przechowującego środki.',
      'Od strony prawnej w Unii Europejskiej obowiązują dziś przepisy porządkujące ten rynek, nakładające na emitentów wymogi dotyczące rezerw, ich przechowywania i raportowania. Zmniejsza to ryzyko, ale go nie usuwa: stablecoin pozostaje zobowiązaniem prywatnej firmy, a nie pieniądzem gwarantowanym przez państwo, i nie obejmuje go bankowy system gwarancji depozytów.',
    ],
    example: {
      title: 'Co oznacza depeg w praktyce',
      text: 'Trzymasz równowartość 20 000 zł w stablecoinie, zakładając kurs 1 do 1 wobec dolara. Jeżeli kurs spadnie do 0,95 dolara, Twoje środki są warte około 19 000 zł, mimo że nie zajmowałeś żadnej pozycji ani nie zmieniła się cena żadnej kryptowaluty. Przy pełnym załamaniu parytetu, jak w przypadku TerraUSD, strata sięga niemal całości. To ryzyko emitenta, nie ryzyko rynkowe, i dlatego nie znika przez samo unikanie zmiennych aktywów.',
    },
    faq: [
      {
        q: 'Czy stablecoin jest bezpieczny?',
        a: 'Jest bezpieczniejszy od zwykłych kryptowalut pod względem zmienności kursu, ale niesie własne ryzyko: wypłacalności i wiarygodności emitenta. Nie obejmuje go gwarancja depozytów bankowych, więc w razie problemów emitenta nie ma instytucji, która zwróci środki.',
      },
      {
        q: 'Czym stablecoin różni się od pieniądza w banku?',
        a: 'Środki na rachunku bankowym są objęte gwarancją do równowartości 100 000 euro i podlegają nadzorowi bankowemu. Stablecoin jest zobowiązaniem prywatnego emitenta, którego pokrycie zależy od rezerw, jakie faktycznie utrzymuje. Wygoda i szybkość rozliczeń są większe, poziom ochrony niższy.',
      },
      {
        q: 'Co to jest depeg?',
        a: 'To utrata powiązania stablecoina z aktywem bazowym, czyli sytuacja, w której jego kurs przestaje odpowiadać jednemu dolarowi. Bywa przejściowy i sięga ułamków procenta, ale w skrajnych przypadkach, jak upadek TerraUSD w 2022 roku, oznacza praktycznie całkowitą utratę wartości.',
      },
      {
        q: 'Czy trzymanie stablecoinów jest opodatkowane?',
        a: 'Samo posiadanie nie rodzi podatku. Znaczenie ma moment zamiany na walutę tradycyjną lub zapłaty za towar czy usługę, bo dopiero wtedy powstaje przychód podlegający rozliczeniu. Wymiana jednej kryptowaluty na inną, w tym na stablecoina, jest w polskich przepisach neutralna podatkowo.',
      },
    ],
    related: ['kryptowaluta', 'bitcoin'],
  },
  {
    slug: 'halving',
    term: 'Halving',
    aliases: ['halving', 'halvingu', 'halving Bitcoina', 'połowienie'],
    short: 'Halving to zaprogramowane zmniejszenie o połowę nagrody dla kopiących nowe bloki Bitcoina, następujące mniej więcej co cztery lata.',
    body: [
      'Halving spowalnia tempo powstawania nowych bitcoinów, zmniejszając podaż. Historycznie poprzedzał silne wzrosty kursu, choć przeszłe wyniki nie gwarantują przyszłych.',
      'To mechanizm wpisany w kod Bitcoina, dążący do ograniczonej podaży 21 milionów sztuk. Wokół kolejnych halvingów narasta zwykle duża spekulacja.',
    ],
    related: ['bitcoin', 'kryptowaluta'],
  },
  {
    slug: 'portfel-krypto',
    term: 'Portfel krypto (wallet)',
    aliases: ['portfel krypto', 'portfel kryptowalut', 'wallet', 'portfel sprzętowy'],
    short: 'Portfel krypto (wallet) to narzędzie do przechowywania kluczy dających dostęp do Twoich kryptowalut. Dzieli się na gorące (online) i zimne (offline).',
    body: [
      'Portfel zimny (np. sprzętowy) trzyma klucze offline i jest najbezpieczniejszy przed atakami. Portfel gorący (aplikacja, giełda) jest wygodniejszy, ale bardziej narażony na kradzież.',
      'W krypto obowiązuje zasada: nie twoje klucze, nie twoje monety. Trzymanie środków na giełdzie oznacza zaufanie jej, a nie pełną kontrolę. Bezpieczeństwo kluczy to podstawa.',
    ],
    related: ['kryptowaluta', 'bitcoin'],
  },
  {
    slug: 'dca',
    term: 'DCA (uśrednianie)',
    aliases: ['DCA', 'uśrednianie ceny zakupu', 'Dollar Cost Averaging', 'regularne dokupowanie'],
    short: 'DCA (uśrednianie ceny zakupu) to strategia regularnego inwestowania stałej kwoty niezależnie od ceny, zamiast jednorazowego wejścia całością.',
    body: [
      'Kupując co miesiąc za tę samą kwotę, raz kupisz drożej, raz taniej, a w efekcie uśredniasz cenę i wygładzasz wpływ wahań rynku. Eliminujesz też pokusę łapania dołka.',
      'DCA świetnie sprawdza się przy regularnym inwestowaniu w ETF-y z pensji i zdejmuje z procesu emocje. To jedna z najprostszych i najskuteczniejszych strategii dla początkujących.',
    ],
    related: ['etf', 'procent-skladany', 'fomo'],
  },
  {
    slug: 'ppk',
    term: 'PPK',
    aliases: ['PPK', 'Pracownicze Plany Kapitałowe', 'Pracowniczych Planów Kapitałowych'],
    short: 'PPK (Pracownicze Plany Kapitałowe) to dobrowolny program długoterminowego oszczędzania, w którym do wpłat pracownika dokłada się pracodawca i państwo.',
    body: [
      'Część odprowadza pracownik z pensji, część dokłada pracodawca, a państwo dorzuca wpłatę powitalną i roczne dopłaty. Te dopłaty to w praktyce darmowy dodatek do Twoich oszczędności.',
      'Środki są inwestowane w fundusze zdefiniowanej daty i są prywatne oraz dziedziczone. Można się wypisać, ale rezygnacja oznacza utratę dopłat pracodawcy i państwa.',
    ],
    related: ['ike', 'ikze', 'procent-skladany'],
  },
  {
    slug: 'pit-38',
    term: 'PIT-38',
    aliases: ['PIT-38', 'deklaracja PIT-38', 'rozliczenie zysków kapitałowych'],
    short: 'PIT-38 to deklaracja podatkowa, w której rozliczasz zyski kapitałowe z giełdy: ze sprzedaży akcji, ETF-ów i innych papierów wartościowych.',
    body: [
      'PIT-38 składa się raz w roku, do końca kwietnia, za rok poprzedni. Podstawą jest informacja PIT-8C, którą polskie biuro maklerskie przysyła zwykle do końca lutego. Zawiera ona sumę przychodów ze sprzedaży i kosztów ich uzyskania, a Twoim zadaniem jest przepisanie tych kwot i wyliczenie 19 procent od różnicy.',
      'Obowiązek dotyczy wyłącznie zysków zrealizowanych, czyli takich, w których faktycznie sprzedałeś papier. Wzrost wartości portfela, którego nie sprzedałeś, nie pojawia się w zeznaniu, niezależnie od skali. Nie wykazuje się tu również odsetek z lokat ani dywidend z polskich spółek, bo od nich podatek pobrał już bank lub broker.',
      'Deklarację składa się także wtedy, gdy rok zakończył się stratą, i to jest najczęściej pomijany szczegół. Tylko wykazana strata daje prawo do rozliczenia jej w kolejnych pięciu latach, przy czym w jednym roku odliczysz najwyżej połowę straty z danego roku. Pominięcie deklaracji przy stracie oznacza po prostu utratę tego uprawnienia.',
      'Osobnego potraktowania wymagają rachunki u brokerów zagranicznych, którzy zwykle nie wystawiają PIT-8C. Zestawienie transakcji przygotowujesz wtedy samodzielnie, przeliczając każdą operację na złote według kursu z dnia poprzedzającego jej realizację. Do tego dochodzi kwestia podatku pobranego za granicą od dywidend, który rozlicza się według właściwej umowy o unikaniu podwójnego opodatkowania.',
      'Rachunki IKE i IKZE są z tego obowiązku wyłączone. Transakcji zawartych w ich ramach nie wykazuje się w PIT-38, co poza samą korzyścią podatkową oznacza również mniej pracy przy rocznym rozliczeniu.',
    ],
    example: {
      title: 'Jak strata z poprzedniego roku obniża podatek',
      text: 'W pierwszym roku zamykasz rachunek ze stratą 10 000 zł i wykazujesz ją w PIT-38. W drugim roku osiągasz zysk 12 000 zł. Możesz odliczyć maksymalnie połowę straty z tamtego roku, czyli 5000 zł, więc opodatkowany dochód wynosi 7000 zł, a podatek 1330 zł zamiast 2280 zł. Pozostałe 5000 zł straty czeka na kolejne lata, w ramach pięcioletniego okna. Gdybyś nie złożył deklaracji za stratny rok, zapłaciłbyś pełne 2280 zł.',
    },
    faq: [
      {
        q: 'Do kiedy trzeba złożyć PIT-38?',
        a: 'Do 30 kwietnia roku następującego po roku, w którym osiągnąłeś przychód. Informację PIT-8C, na podstawie której wypełniasz deklarację, biuro maklerskie przesyła zwykle do końca lutego.',
      },
      {
        q: 'Czy trzeba składać PIT-38 przy stracie?',
        a: 'Nie ma takiego przymusu, ale niezłożenie deklaracji oznacza utratę prawa do rozliczenia tej straty w kolejnych latach. Ponieważ stratę można odliczać przez pięć lat od przyszłych zysków, złożenie zeznania przy wyniku ujemnym jest w praktyce decyzją opłacalną.',
      },
      {
        q: 'Czy PIT-38 obejmuje zyski z IKE i IKZE?',
        a: 'Nie. Transakcje zawierane w ramach rachunków IKE i IKZE pozostają poza tą deklaracją. To jedna z praktycznych zalet tych kont, obok samej korzyści podatkowej.',
      },
      {
        q: 'Co zrobić, gdy broker nie wystawia PIT-8C?',
        a: 'Dotyczy to zwykle brokerów zagranicznych. Zestawienie przychodów i kosztów przygotowujesz wtedy sam, na podstawie historii transakcji, przeliczając kwoty na złote według kursu średniego z dnia poprzedzającego dzień transakcji. Obowiązek rozliczenia istnieje niezależnie od tego, czy dokument otrzymałeś.',
      },
    ],
    related: ['podatek-belki', 'rachunek-maklerski', 'ike'],
  },
  {
    slug: 'danina-solidarnosciowa',
    term: 'Danina solidarnościowa',
    aliases: ['danina solidarnościowa', 'daniny solidarnościowej', 'podatek solidarnościowy'],
    short: 'Danina solidarnościowa to dodatkowy 4% podatek od nadwyżki rocznych dochodów ponad 1 milion złotych, płacony obok zwykłego podatku dochodowego.',
    body: [
      'Liczy się ją od sumy dochodów ponad milion złotych w roku, w tym z pracy, działalności i części zysków kapitałowych. To realny temat dla wąskiej grupy najlepiej zarabiających.',
      'Choć większości nie dotyczy, trzeba ją znać przy bardzo dobrych latach inwestycyjnych albo sprzedaży dużych aktywów, bo łączy się z innymi dochodami.',
    ],
    related: ['podatek-belki', 'pit-38'],
  },
];

export function getTermBySlug(slug: string): GlossaryTerm | undefined {
  return GLOSSARY.find((t) => t.slug === slug);
}

export function getAllTermsSorted(): GlossaryTerm[] {
  return [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, 'pl'));
}
