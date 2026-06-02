// Treść stron-filarów (pillar pages) per kategoria.
// Każdy wpis renderuje się na /[category] przez komponent PillarGuide.
// Na razie wypełniona jest tylko kategoria 'inwestycje' (pilotaż).
// Dodanie kolejnej kategorii = nowy wpis tutaj, bez zmian w kodzie strony.

export interface PillarLink {
  label: string;
  href: string;
}

export interface PillarSection {
  title: string;
  body: string[];
  links?: PillarLink[];
}

export interface PillarFaq {
  q: string;
  a: string;
}

export interface Pillar {
  heading: string;     // H2 nad przewodnikiem
  intro: string[];     // akapity wstępu
  sections: PillarSection[];
  faq: PillarFaq[];
}

export const PILLARS: Record<string, Pillar> = {
  inwestycje: {
    heading: 'Jak zacząć inwestować w 2026 - kompletny przewodnik',
    intro: [
      'Inwestowanie brzmi groźnie, dopóki nie sprowadzisz go do jednej zasady: regularnie odkładasz część pieniędzy do aktywów, które z czasem pracują za ciebie. Cała reszta to szczegóły, które ten przewodnik rozkłada na czynniki pierwsze.',
      'Poniżej znajdziesz uporządkowaną ścieżkę: od wyboru między inwestowaniem pasywnym a aktywnym, przez ETF-y i konta z ulgą podatkową, po akcje i krypto. Każdą sekcję pogłębia osobny artykuł, jeśli chcesz wejść głębiej w konkretny temat.',
    ],
    sections: [
      {
        title: 'Od czego zacząć: pasywnie czy aktywnie',
        body: [
          'Pierwsza decyzja nie dotyczy tego, co kupić, tylko ile czasu chcesz na to poświęcać. Inwestowanie pasywne to regularne kupowanie szerokiego rynku i trzymanie go latami. Aktywne to samodzielny wybór spółek i momentu wejścia, co wymaga wiedzy i czasu. Dla większości osób pasywne podejście wygrywa, bo nie konkuruje z emocjami ani z kosztami transakcji.',
        ],
        links: [
          { label: 'Inwestowanie pasywne - 3 portfele ETF', href: '/inwestycje/inwestowanie-pasywne-portfele-etf-dla-kazdego' },
          { label: 'Jak zdywersyfikować portfel', href: '/inwestycje/dywersyfikacja-portfela-inwestycyjnego' },
        ],
      },
      {
        title: 'ETF-y: fundament portfela',
        body: [
          'ETF to fundusz notowany na giełdzie, który jednym zakupem daje ci kawałek setek spółek naraz. To najprostszy sposób na dywersyfikację bez wybierania pojedynczych akcji. Niskie koszty i automatyczna ekspozycja na cały rynek sprawiają, że ETF-y są naturalnym rdzeniem portfela początkującego.',
        ],
        links: [
          { label: 'Czym są ETF-y i jak zacząć', href: '/inwestycje/etf-czym-jest-jak-zaczac-inwestowac' },
        ],
      },
      {
        title: 'Jak kupować: regularnie czy jednorazowo',
        body: [
          'Mając już co kupić, zostaje pytanie kiedy. Strategia regularnych, równych wpłat rozkłada zakupy w czasie i zdejmuje z ciebie presję łapania dołka. Nie zawsze daje najwyższy wynik, ale chroni przed najgorszym scenariuszem: wrzuceniem całej gotówki na szczycie.',
        ],
        links: [
          { label: 'DCA - czy regularne kupowanie się opłaca', href: '/inwestycje/dca-dollar-cost-averaging-czy-sie-oplaca' },
        ],
      },
      {
        title: 'Konta z ulgą podatkową',
        body: [
          'Zanim kupisz cokolwiek, warto zrobić to przez właściwe konto. IKE i IKZE dają realne korzyści podatkowe, PPK dokłada pieniądze pracodawcy i państwa, a OKI to nowa opcja na rynku. Te same ETF-y kupione przez konto z ulgą zostawiają w twojej kieszeni więcej.',
        ],
        links: [
          { label: 'IKE vs IKZE - co wybrać', href: '/inwestycje/ike-vs-ikze-2026-co-wybrac-limity-podatki' },
          { label: 'PPK - czy warto', href: '/inwestycje/ppk-pracownicze-plany-kapitalowe-czy-warto-2026' },
          { label: 'OKI - osobiste konto inwestycyjne', href: '/inwestycje/oki-osobiste-konto-inwestycyjne' },
        ],
      },
      {
        title: 'Wybór akcji i ocena spółek',
        body: [
          'Jeśli chcesz wyjść poza ETF-y i kupować pojedyncze spółki, potrzebujesz sposobu na ocenę, czy firma jest coś warta. Analiza fundamentalna patrzy na wyniki, zadłużenie i wycenę, zamiast na same wykresy. To więcej pracy, ale daje podstawy do świadomych decyzji.',
        ],
        links: [
          { label: 'Analiza fundamentalna - jak ocenić spółkę', href: '/inwestycje/analiza-fundamentalna-jak-ocenic-wartosc-spolki' },
        ],
      },
      {
        title: 'Krypto: najbardziej ryzykowna część',
        body: [
          'Kryptowaluty potrafią kusić, ale rządzą się inną zmiennością niż akcje czy ETF-y. Warto rozumieć, czym różnią się od klasycznych inwestycji, jak duża powinna być ta część portfela i jak rozliczyć podatek od zysków. Jako mały dodatek mają sens, jako podstawa oszczędności zwykle nie.',
        ],
        links: [
          { label: 'Kryptowaluty vs ETF', href: '/inwestycje/kryptowaluty-vs-etf-porownanie-2026' },
          { label: 'Bitcoin 2026 - prognozy', href: '/inwestycje/bitcoin-2026-bessa-czy-szczyt-prognozy' },
          { label: 'Podatek od kryptowalut', href: '/inwestycje/podatek-od-kryptowalut-2026' },
        ],
      },
      {
        title: 'Policz, zanim zainwestujesz',
        body: [
          'Liczby przekonują lepiej niż hasła. Zanim wybierzesz strategię, sprawdź na kalkulatorach, jak działa procent składany w długim terminie, jak ETF wypada wobec lokaty i kiedy realnie osiągniesz niezależność finansową.',
        ],
        links: [
          { label: 'Kalkulator procentu składanego', href: '/kalkulator/procent-skladany' },
          { label: 'ETF vs lokata', href: '/kalkulator/etf' },
          { label: 'Kalkulator FIRE', href: '/kalkulator/fire' },
        ],
      },
    ],
    faq: [
      {
        q: 'Od jakiej kwoty można zacząć inwestować?',
        a: 'Realnie od 100 zł miesięcznie. Wiele ETF-ów i kont maklerskich pozwala kupować ułamki jednostek, a przy regularnych wpłatach najważniejszy jest czas i konsekwencja, a nie wielkość pierwszej wpłaty.',
      },
      {
        q: 'Lepiej inwestować jednorazowo czy regularnie?',
        a: 'Regularne wpłaty są bezpieczniejsze psychologicznie i chronią przed wejściem na szczycie. Jednorazowa wpłata statystycznie bywa nieco lepsza przy dużej gotówce i długim horyzoncie, ale wymaga odporności na wahania.',
      },
      {
        q: 'Ile inwestować w kryptowaluty?',
        a: 'Tyle, ile możesz stracić bez wpływu na życie. Dla większości to niewielka część portfela, traktowana jako pozycja wysokiego ryzyka, a nie fundament oszczędności.',
      },
      {
        q: 'Czy potrzebuję doradcy, żeby zacząć?',
        a: 'Nie. Pasywny portfel ETF kupowany przez konto z ulgą podatkową jest na tyle prosty, że ogarniesz go sam. Doradca bywa przydatny przy większym majątku i bardziej złożonej sytuacji podatkowej.',
      },
    ],
  },

  trading: {
    heading: 'Trading od podstaw - jak zacząć i nie stracić',
    intro: [
      'Trading kusi obietnicą szybkich pieniędzy, a kończy się stratą u zdecydowanej większości. Ten przewodnik podchodzi do tematu od drugiej strony: najpierw pokazuje, dlaczego ludzie tracą, a dopiero potem jak zacząć, żeby nie dołączyć do statystyki.',
      'Idziemy po kolei: od realiów rynku, przez pierwsze kroki i strategie, po zarządzanie kapitałem i psychikę. Każdą sekcję pogłębia osobny artykuł.',
    ],
    sections: [
      {
        title: 'Zanim zaczniesz: dlaczego większość traci',
        body: [
          'Statystyki są bezlitosne: większość początkujących traci kapitał w pierwszym roku. Powodem rzadko jest brak strategii, a znacznie częściej brak zarządzania ryzykiem i emocje. Zrozumienie tych pułapek na starcie jest ważniejsze niż jakikolwiek wskaźnik.',
        ],
        links: [
          { label: 'Dlaczego 90% traderów traci', href: '/trading/dlaczego-90-procent-traderow-traci' },
        ],
      },
      {
        title: 'Pierwsze kroki',
        body: [
          'Start to wybór rynku, brokera i wielkości pozycji, a nie szukanie magicznego systemu. Zanim wpłacisz prawdziwe pieniądze, warto przejść przez podstawy na koncie demo i ustalić zasady, których będziesz się trzymać.',
        ],
        links: [
          { label: 'Jak zacząć trading od zera', href: '/trading/jak-zaczac-trading-od-zera' },
        ],
      },
      {
        title: 'Strategia i analiza',
        body: [
          'Dobra strategia jest prosta, powtarzalna i dopasowana do twojego stylu. Zamiast zbierać dziesiątki wskaźników, lepiej opanować jedno podejście i rozumieć narzędzia, których używasz, takie jak poziomy Fibonacciego.',
        ],
        links: [
          { label: 'Strategie, które naprawdę działają', href: '/trading/strategie-tradingowe-ktore-naprawde-dzialaja' },
          { label: 'Fibonacci - kompletny przewodnik', href: '/trading/fibonacci-w-tradingu-kompletny-przewodnik' },
        ],
      },
      {
        title: 'Zarządzanie kapitałem',
        body: [
          'To, czy przetrwasz na rynku, zależy bardziej od zarządzania kapitałem niż od trafności pojedynczych transakcji. Reinwestowanie zysków i kontrola wielkości pozycji decydują o tym, czy konto rośnie, czy topnieje.',
        ],
        links: [
          { label: 'Procent składany w tradingu', href: '/trading/procent-skladany-w-tradingu-futures' },
        ],
      },
      {
        title: 'Psychika tradera',
        body: [
          'Najlepsza strategia nie pomoże, jeśli emocje przejmują stery. Strach i chciwość, rewanż po stracie i obsesyjne sprawdzanie wyników niszczą więcej kont niż złe wejścia. Nad tym da się pracować i to często najwyższa stopa zwrotu z włożonego wysiłku.',
        ],
        links: [
          { label: 'Psychologia tradingu', href: '/psychologia/psychologia-tradingu-jak-kontrolowac-emocje' },
          { label: 'Dlaczego sprawdzasz portfel 10 razy dziennie', href: '/psychologia/dlaczego-sprawdzasz-portfel-10-razy-dziennie' },
        ],
      },
      {
        title: 'Policz ryzyko, zanim wejdziesz',
        body: [
          'Każdą transakcję warto przeliczyć, zanim ją otworzysz. Sprawdź stosunek zysku do ryzyka i zobacz, jak reinwestowanie zysków działa na konto w dłuższym terminie.',
        ],
        links: [
          { label: 'Kalkulator Risk / Reward', href: '/kalkulator/risk-reward' },
          { label: 'Kalkulator procentu składanego', href: '/kalkulator/procent-skladany' },
        ],
      },
    ],
    faq: [
      { q: 'Ile pieniędzy potrzeba, żeby zacząć trading?', a: 'Technicznie wystarczy kilkaset złotych, ale na małym koncie koszty i emocje biją mocniej. Ważniejsze od kwoty jest to, żeby były to pieniądze, których stratę jesteś w stanie znieść.' },
      { q: 'Czy trading to dobry sposób na szybkie wzbogacenie się?', a: 'Nie. Większość początkujących traci, a stabilne wyniki wymagają lat pracy i dyscypliny. Traktowanie tradingu jak loterii kończy się zwykle utratą kapitału.' },
      { q: 'Trading czy inwestowanie długoterminowe?', a: 'Dla większości osób inwestowanie pasywne jest rozsądniejsze, bo nie wymaga czasu przed wykresami i nie konkuruje z emocjami. Trading ma sens, jeśli realnie chcesz poświęcić na naukę setki godzin.' },
      { q: 'Od czego najlepiej zacząć naukę?', a: 'Od zarządzania ryzykiem i jednej prostej strategii, a nie od kolekcjonowania wskaźników. Konto demo pozwala przećwiczyć zasady, zanim ryzykujesz prawdziwe pieniądze.' },
    ],
  },

  pieniadze: {
    heading: 'Finanse osobiste 2026 - oszczędzanie, kredyty, podatki',
    intro: [
      'Finanse osobiste to nie giełda ani spekulacja, tylko codzienne decyzje, które po cichu decydują o tym, ile zostaje ci w kieszeni. Ten przewodnik porządkuje je od fundamentów po tematy zaawansowane.',
      'Zaczynamy od bezpieczeństwa i oszczędzania, przechodzimy przez budżet, kredyty i mieszkanie, a kończymy na podatkach, emeryturze i historii kredytowej. Każdy wątek rozwija osobny artykuł.',
    ],
    sections: [
      {
        title: 'Zacznij od poduszki bezpieczeństwa',
        body: [
          'Zanim pomyślisz o inwestowaniu, potrzebujesz zapasu na czarną godzinę. Poduszka finansowa chroni przed wpadnięciem w długi przy nagłym wydatku, a trzymanie jej na dobrze oprocentowanym koncie sprawia, że nie traci na wartości bez sensu.',
        ],
        links: [
          { label: 'Poduszka finansowa - ile odłożyć', href: '/pieniadze/poduszka-finansowa-2026-ile-powinienes-miec-odlozone' },
          { label: 'Konto oszczędnościowe - czy bezpieczne', href: '/pieniadze/konto-oszczednosciowe-2026-czy-twoje-pieniadze-sa-bezpieczne' },
        ],
      },
      {
        title: 'Gdzie trzymać oszczędności',
        body: [
          'Lokata, obligacje skarbowe i konto oszczędnościowe to trzy różne narzędzia o różnym profilu bezpieczeństwa i zysku. Wybór zależy od tego, na jak długo odkładasz i czy zależy ci na ochronie przed inflacją.',
        ],
        links: [
          { label: 'Lokata, obligacje czy konto', href: '/pieniadze/lokata-obligacje-konto-oszczednosciowe-porownanie-2026' },
          { label: 'Obligacje skarbowe 2026', href: '/pieniadze/obligacje-skarbowe-2026-ktore-wybrac-i-jak-kupic' },
        ],
      },
      {
        title: 'Budżet i nawyki, które zjadają pensję',
        body: [
          'Najwięcej pieniędzy ucieka nie przy wielkich decyzjach, tylko w drobnych, codziennych nawykach. Świadomy budżet i wyłapanie kilku kosztownych przyzwyczajeń potrafią uwolnić więcej gotówki niż kolejna podwyżka.',
        ],
        links: [
          { label: '5 nawyków, które kosztują tysiące', href: '/pieniadze/5-finansowych-nawykow-ktore-kosztuja-cie-tysiace-zlotych-rocznie' },
          { label: 'Co zjada twoją pensję', href: '/pieniadze/zarabiasz-wiecej-a-kasy-brak-co-zjada-twoja-pensje' },
          { label: 'Budżet domowy krok po kroku', href: '/psychologia/budzet-domowy-jak-zaczac-i-utrzymac' },
        ],
      },
      {
        title: 'Kredyt i mieszkanie',
        body: [
          'Mieszkanie to zwykle największa decyzja finansowa w życiu. Zanim weźmiesz kredyt, warto policzyć, czy bardziej opłaca się najem czy zakup, jak wybrać oprocentowanie i czy łapiesz się na rządowe dopłaty.',
        ],
        links: [
          { label: 'Najem czy kupno mieszkania', href: '/pieniadze/najem-czy-kupno-mieszkania' },
          { label: 'Stałe czy zmienne oprocentowanie', href: '/pieniadze/stale-czy-zmienne-oprocentowanie-kredytu' },
          { label: 'Pierwsze Klucze 2026 - dopłaty', href: '/pieniadze/pierwsze-klucze-2026-doplaty-kredyt-mieszkaniowy' },
          { label: 'Kredyt hipoteczny - zdolność i koszty', href: '/gospodarka/kredyt-hipoteczny-2026-jak-dostac-ile-kosztuje' },
        ],
      },
      {
        title: 'Podatki i emerytura',
        body: [
          'Część pieniędzy tracisz, zanim w ogóle je zobaczysz. Zrozumienie progów podatkowych i tego, jak działa emerytura z ZUS, pozwala legalnie zostawić więcej w kieszeni i lepiej zaplanować przyszłość.',
        ],
        links: [
          { label: 'Kwota wolna i progi PIT 2026', href: '/pieniadze/kwota-wolna-progi-podatkowe-2026' },
          { label: 'Waloryzacja emerytur 2026', href: '/pieniadze/waloryzacja-emerytur-2026-zus' },
        ],
      },
      {
        title: 'Historia kredytowa i BIK',
        body: [
          'Twoja historia w BIK decyduje o tym, czy dostaniesz kredyt i na jakich warunkach. Warto wiedzieć, co da się z niej usunąć, a co zostaje, zanim złożysz wniosek.',
        ],
        links: [
          { label: 'Jak wyczyścić BIK', href: '/pieniadze/jak-wyczyscic-bik' },
        ],
      },
      {
        title: 'Policz swoje finanse',
        body: [
          'Decyzje finansowe wygodniej podejmować na liczbach. Sprawdź, ile naprawdę zostaje ci na rękę, ile wyniesie rata kredytu i jak procent składany pracuje na twoich oszczędnościach.',
        ],
        links: [
          { label: 'Kalkulator brutto-netto', href: '/kalkulator/wynagrodzenia' },
          { label: 'Kalkulator hipoteczny', href: '/kalkulator-hipoteczny' },
          { label: 'Kalkulator procentu składanego', href: '/kalkulator/procent-skladany' },
        ],
      },
    ],
    faq: [
      { q: 'Od czego zacząć ogarnianie finansów?', a: 'Od poduszki bezpieczeństwa i budżetu. Dopiero gdy masz zapas na nagłe wydatki i wiesz, gdzie znikają pieniądze, ma sens myślenie o inwestowaniu czy kredycie.' },
      { q: 'Ile powinna wynosić poduszka finansowa?', a: 'Zwykle od 3 do 6 miesięcy twoich wydatków, zależnie od stabilności dochodu. Osoby na niepewnym zatrudnieniu powinny celować w górną granicę.' },
      { q: 'Lepiej spłacać kredyt szybciej czy inwestować?', a: 'Zależy od oprocentowania kredytu. Drogi kredyt konsumencki zwykle warto spłacać priorytetowo, a przy tanim kredycie inwestowanie nadwyżki bywa korzystniejsze.' },
      { q: 'Czy warto trzymać oszczędności na lokacie?', a: 'Na krótki termin i jako bezpieczny zapas tak, ale przy niskich stopach i podatku Belki realny zysk bywa bliski zeru. Na dłuższy horyzont warto rozważyć obligacje lub inwestycje.' },
    ],
  },

  psychologia: {
    heading: 'Psychologia pieniędzy i inwestowania',
    intro: [
      'Możesz znać każdą zasadę finansów i dalej podejmować złe decyzje, bo o pieniądzach rzadko decyduje arkusz, a najczęściej emocje. Ten przewodnik pokazuje, jak działa twój mózg wokół pieniędzy i jak z nim współpracować, zamiast z nim walczyć.',
      'Przechodzimy przez błędy poznawcze, emocje na rynku, obsesję kontroli i cel, dla którego to wszystko robimy. Każdy temat rozwija osobny artykuł.',
    ],
    sections: [
      {
        title: 'Dlaczego wydajemy za dużo',
        body: [
          'Większość nadmiernych wydatków nie wynika z głupoty, tylko z mechanizmów wbudowanych w nasz mózg. Rozpoznanie kilku najczęstszych błędów poznawczych i prosty budżet potrafią zatrzymać wyciek pieniędzy, którego wcześniej nawet nie widziałeś.',
        ],
        links: [
          { label: '7 błędów poznawczych niszczących budżet', href: '/psychologia/dlaczego-wydajemy-za-duzo-bledy-poznawcze' },
          { label: 'Budżet domowy krok po kroku', href: '/psychologia/budzet-domowy-jak-zaczac-i-utrzymac' },
        ],
      },
      {
        title: 'Emocje na rynku',
        body: [
          'Strach i chciwość to dwie siły, które każą kupować na górce i sprzedawać na dole. Świadomość, jak działają w czasie hossy i paniki, jest często ważniejsza niż znajomość samej strategii.',
        ],
        links: [
          { label: 'Strach i chciwość w czasie hossy', href: '/psychologia/strach-i-chciwosc-w-czasie-hossy' },
          { label: 'Psychologia tradingu', href: '/psychologia/psychologia-tradingu-jak-kontrolowac-emocje' },
        ],
      },
      {
        title: 'Obsesja sprawdzania portfela',
        body: [
          'Ciągłe zaglądanie do portfela nie poprawia wyników, tylko podbija emocje i prowokuje pochopne ruchy. Mniej kontroli często oznacza lepsze decyzje i spokojniejszą głowę.',
        ],
        links: [
          { label: 'Dlaczego sprawdzasz portfel 10 razy dziennie', href: '/psychologia/dlaczego-sprawdzasz-portfel-10-razy-dziennie' },
        ],
      },
      {
        title: 'Cel: wolność finansowa',
        body: [
          'Łatwiej znosić wyrzeczenia, gdy masz konkretny cel. Ruch FIRE pokazuje, ile realnie trzeba odłożyć, żeby uniezależnić się od pensji, i czy to osiągalne w polskich realiach.',
        ],
        links: [
          { label: 'FIRE - ile naprawdę potrzebujesz', href: '/psychologia/fire-wczesna-emerytura-ile-potrzebujesz-polska' },
          { label: 'Kalkulator FIRE', href: '/kalkulator/fire' },
        ],
      },
    ],
    faq: [
      { q: 'Dlaczego trudno trzymać się budżetu?', a: 'Bo budżet konkuruje z natychmiastową przyjemnością z zakupów, a mózg domyślnie wybiera teraźniejszość. Pomaga automatyzacja oszczędzania i wcześniejsze zaplanowanie wydatków, zamiast polegania na silnej woli.' },
      { q: 'Jak przestać panikować przy spadkach?', a: 'Najlepiej zmniejszyć wielkość pozycji do poziomu, przy którym wahania nie odbierają snu, i ograniczyć sprawdzanie portfela. Panika to zwykle sygnał, że ryzyko jest za duże, a nie że rynek robi coś nadzwyczajnego.' },
      { q: 'Czy emocje da się całkowicie wyłączyć?', a: 'Nie, ale da się ograniczyć ich wpływ przez zasady ustalone na chłodno i trzymanie się ich, gdy robi się gorąco. Dobre decyzje podejmuje się przed transakcją, nie w jej trakcie.' },
      { q: 'Od czego zacząć pracę nad finansową psychiką?', a: 'Od poznania własnych błędów poznawczych i prowadzenia budżetu, który pokazuje realne wydatki. Świadomość mechanizmu jest pierwszym krokiem do jego kontroli.' },
    ],
  },

  gospodarka: {
    heading: 'Gospodarka 2026 - stopy, inflacja, rynki',
    intro: [
      'Gospodarka brzmi abstrakcyjnie, dopóki nie zobaczysz, jak decyzje banku centralnego i kursy walut lądują na twoim koncie. Ten przewodnik tłumaczy najważniejsze mechanizmy z perspektywy zwykłego portfela.',
      'Idziemy od stóp procentowych i mieszkań, przez waluty, złoto i giełdę, po podatki firmowe i geopolitykę. Każdy temat rozwija osobny artykuł.',
    ],
    sections: [
      {
        title: 'Stopy procentowe i co z nich wynika',
        body: [
          'Decyzje Rady Polityki Pieniężnej o stopach przekładają się wprost na raty kredytów i oprocentowanie oszczędności. Zrozumienie, dokąd idą stopy, pomaga ocenić, czy to dobry moment na kredyt i czego spodziewać się po lokatach.',
        ],
        links: [
          { label: 'Obniżki stóp NBP - co oznaczają', href: '/gospodarka/obnizki-stop-procentowych-nbp-2026-co-oznacza' },
          { label: 'Kredyt hipoteczny - zdolność i koszty', href: '/gospodarka/kredyt-hipoteczny-2026-jak-dostac-ile-kosztuje' },
        ],
      },
      {
        title: 'Mieszkania i ceny',
        body: [
          'Ceny mieszkań w Polsce trzymają się wysoko mimo zmian stóp, co frustruje kupujących. Warto rozumieć, co naprawdę napędza ten rynek, zanim podejmiesz decyzję o zakupie.',
        ],
        links: [
          { label: 'Kryzys mieszkaniowy 2026', href: '/gospodarka/kryzys-mieszkaniowy-polska-2026-dlaczego-ceny-nie-spadaja' },
        ],
      },
      {
        title: 'Waluty i złoto',
        body: [
          'Kurs dolara i cena złota wpływają na twoje pieniądze nawet wtedy, gdy nie masz ani jednego, ani drugiego. Decydują o cenach importu, inflacji i wartości oszczędności.',
        ],
        links: [
          { label: 'Kurs dolara a złoty', href: '/gospodarka/kurs-dolara-zloty-usd-pln-2026-co-to-znaczy-dla-twoich-pieniedzy' },
          { label: 'Złoto 2026 - czy warto', href: '/gospodarka/zloto-2026-dlaczego-wszyscy-kupuja-i-czy-warto' },
        ],
      },
      {
        title: 'Giełda i recesja',
        body: [
          'Polska giełda i ryzyko recesji to dwa tematy, które wracają w nagłówkach. Warto wiedzieć, czy WIG20 na szczytach to okazja czy ostrzeżenie i jak przygotować finanse na spowolnienie.',
        ],
        links: [
          { label: 'WIG20 na szczytach - kupować?', href: '/gospodarka/wig20-historyczne-szczyty-polskie-akcje-2026' },
          { label: 'Recesja - jak się przygotować', href: '/gospodarka/recesja-czym-jest-jak-wyglada-jak-sie-przygotowac' },
        ],
      },
      {
        title: 'Podatki i koszty firmy',
        body: [
          'Jeśli prowadzisz działalność, zmiany w składkach i podatkach uderzają w ciebie bezpośrednio. Składka zdrowotna to dziś jeden z największych kosztów jednoosobowej firmy.',
        ],
        links: [
          { label: 'Składka zdrowotna 2026', href: '/gospodarka/skladka-zdrowotna-2026-dzialalnosc-ile-zaplacisz' },
          { label: 'Kalkulator składki zdrowotnej', href: '/kalkulator/skladka-zdrowotna' },
        ],
      },
      {
        title: 'Geopolityka i technologia',
        body: [
          'Wielka gospodarka to także rywalizacja o technologie. Wyścig o chipy i sztuczną inteligencję zmienia układ sił na świecie i pośrednio wpływa na rynki, w które inwestujesz.',
        ],
        links: [
          { label: 'AI jako broń geopolityczna', href: '/gospodarka/ai-bron-geopolityczna-wyscig-chipow' },
        ],
      },
    ],
    faq: [
      { q: 'Jak stopy procentowe wpływają na moją ratę?', a: 'Przy kredycie ze zmiennym oprocentowaniem każda zmiana stóp NBP przekłada się na ratę z pewnym opóźnieniem. Obniżki zmniejszają ratę, podwyżki ją podnoszą.' },
      { q: 'Czy złoto chroni przed inflacją?', a: 'W długim terminie złoto bywa traktowane jako ochrona wartości, ale potrafi mocno się wahać i nie daje odsetek. Sprawdza się raczej jako mała część portfela niż jego podstawa.' },
      { q: 'Dlaczego ceny mieszkań nie spadają mimo wysokich stóp?', a: 'Bo na rynku działa też popyt gotówkowy i ograniczona podaż, które podtrzymują ceny niezależnie od zdolności kredytowej. Sama drożyzna kredytu nie wystarcza, żeby je zbić.' },
      { q: 'Jak przygotować finanse na recesję?', a: 'Najważniejsze to poduszka bezpieczeństwa, ograniczenie drogiego zadłużenia i unikanie paniki na rynkach. Recesje są częścią cyklu i mijają, a pochopne decyzje zostają.' },
    ],
  },
};

export function getPillar(slug: string): Pillar | null {
  return PILLARS[slug] ?? null;
}
