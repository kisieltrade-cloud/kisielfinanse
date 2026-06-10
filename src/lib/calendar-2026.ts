// Finansowy kalendarz 2026 — dane wydarzeń (data-driven).
// Daty zweryfikowane: harmonogram RPP (NBP), terminy KSeF (MF), waloryzacje, podatki.
// Aktualizacja = edycja tablicy CAL_EVENTS_2026. Linki tylko do żywych artykułów.

export type CalCategoryId = 'stopy' | 'podatki' | 'firma' | 'emerytury';

export interface CalCategory {
  id: CalCategoryId;
  label: string;
  rgb: string; // kolor akcentu (R,G,B)
}

export const CAL_CATEGORIES: CalCategory[] = [
  { id: 'stopy', label: 'Stopy i RPP', rgb: '201,162,39' },
  { id: 'podatki', label: 'Podatki i terminy', rgb: '46,125,79' },
  { id: 'firma', label: 'Firma i KSeF', rgb: '88,128,255' },
  { id: 'emerytury', label: 'Emerytury i świadczenia', rgb: '167,139,250' },
];

export interface CalEvent {
  date: string;            // 'YYYY-MM-DD' (dla okresów: data startu)
  title: string;
  category: CalCategoryId;
  desc: string;
  href?: string;           // link do powiązanego artykułu (tylko żywe strony)
  approx?: boolean;        // data orientacyjna (np. wypłata świadczenia)
}

// Comiesięczne, powtarzalne terminy (sekcja osobna, nie pojedyncze daty).
export const CAL_RECURRING: { title: string; desc: string; category: CalCategoryId }[] = [
  { title: 'do 20. każdego miesiąca', desc: 'Zaliczka na podatek dochodowy (PIT) i składki ZUS za poprzedni miesiąc.', category: 'firma' },
  { title: 'do 25. każdego miesiąca', desc: 'Rozliczenie VAT i wysyłka pliku JPK_V7 za poprzedni miesiąc.', category: 'podatki' },
  { title: 'koniec miesiąca / ok. 15.', desc: 'GUS publikuje szybki szacunek inflacji (koniec miesiąca) i odczyt finalny (ok. 15. kolejnego).', category: 'stopy' },
];

export const CAL_EVENTS_2026: CalEvent[] = [
  // ── Styczeń ──
  { date: '2026-01-01', title: 'Nowe stawki na 2026', category: 'firma', desc: 'Wchodzą nowe podstawy: płaca minimalna 4806 zł, nowe podstawy składek ZUS i limity podatkowe na 2026 rok.' },
  { date: '2026-01-14', title: 'Decyzja RPP o stopach', category: 'stopy', desc: 'Pierwsze w 2026 roku posiedzenie decyzyjne Rady Polityki Pieniężnej.', href: '/gospodarka/obnizki-stop-procentowych-nbp-2026-co-oznacza' },

  // ── Luty ──
  { date: '2026-02-01', title: 'KSeF obowiązkowy dla dużych firm', category: 'firma', desc: 'Krajowy System e-Faktur staje się obowiązkowy dla firm ze sprzedażą powyżej 200 mln zł. Wszystkie firmy muszą od tej daty odbierać e-faktury.' },
  { date: '2026-02-01', title: 'Nowa minimalna składka zdrowotna', category: 'firma', desc: 'Minimalna podstawa składki zdrowotnej zrównana z płacą minimalną - najniższa składka przedsiębiorcy to ok. 432,54 zł.', href: '/gospodarka/skladka-zdrowotna-2026-dzialalnosc-ile-zaplacisz' },
  { date: '2026-02-04', title: 'Decyzja RPP o stopach', category: 'stopy', desc: 'Lutowe posiedzenie decyzyjne Rady Polityki Pieniężnej.', href: '/gospodarka/obnizki-stop-procentowych-nbp-2026-co-oznacza' },

  // ── Marzec ──
  { date: '2026-03-01', title: 'Waloryzacja emerytur i rent', category: 'emerytury', desc: 'Coroczna waloryzacja świadczeń z ZUS - emerytury i renty rosną o ustalony wskaźnik.', href: '/pieniadze/waloryzacja-emerytur-2026-zus' },
  { date: '2026-03-04', title: 'Decyzja RPP o stopach', category: 'stopy', desc: 'Marcowe posiedzenie decyzyjne Rady Polityki Pieniężnej.', href: '/gospodarka/obnizki-stop-procentowych-nbp-2026-co-oznacza' },
  { date: '2026-03-31', title: 'CIT-8 za 2025 rok', category: 'podatki', desc: 'Termin złożenia rocznego zeznania CIT-8 i zapłaty podatku przez spółki za 2025 rok.' },

  // ── Kwiecień ──
  { date: '2026-04-01', title: 'KSeF obowiązkowy dla pozostałych firm', category: 'firma', desc: 'Obowiązek wystawiania e-faktur w KSeF obejmuje resztę przedsiębiorców. Drobni (faktury do 10 tys. zł brutto miesięcznie) wchodzą dopiero od 2027.' },
  { date: '2026-04-01', title: '13. emerytura', category: 'emerytury', desc: 'Wypłata trzynastej emerytury, zwykle w kwietniu, razem ze świadczeniem za ten miesiąc.', approx: true, href: '/pieniadze/waloryzacja-emerytur-2026-zus' },
  { date: '2026-04-09', title: 'Decyzja RPP o stopach', category: 'stopy', desc: 'Kwietniowe posiedzenie decyzyjne Rady Polityki Pieniężnej.', href: '/gospodarka/obnizki-stop-procentowych-nbp-2026-co-oznacza' },
  { date: '2026-04-30', title: 'Rozliczenie PIT za 2025', category: 'podatki', desc: 'Ostateczny termin złożenia rocznego zeznania PIT za 2025 rok i dopłaty podatku.', href: '/pieniadze/kwota-wolna-progi-podatkowe-2026' },

  // ── Maj ──
  { date: '2026-05-06', title: 'Decyzja RPP o stopach', category: 'stopy', desc: 'Majowe posiedzenie decyzyjne Rady Polityki Pieniężnej.', href: '/gospodarka/obnizki-stop-procentowych-nbp-2026-co-oznacza' },
  { date: '2026-05-20', title: 'Roczne rozliczenie składki zdrowotnej', category: 'firma', desc: 'Termin rocznego rozliczenia składki zdrowotnej za 2025 rok dla przedsiębiorców.', href: '/gospodarka/skladka-zdrowotna-2026-dzialalnosc-ile-zaplacisz' },

  // ── Czerwiec ──
  { date: '2026-06-10', title: 'Decyzja RPP o stopach', category: 'stopy', desc: 'Czerwcowe posiedzenie decyzyjne Rady Polityki Pieniężnej.', href: '/gospodarka/stopy-procentowe-czerwiec-2026-decyzja-rpp' },

  // ── Lipiec ──
  { date: '2026-07-08', title: 'Decyzja RPP o stopach', category: 'stopy', desc: 'Lipcowe posiedzenie decyzyjne Rady Polityki Pieniężnej.', href: '/gospodarka/stopy-procentowe-czerwiec-2026-decyzja-rpp' },

  // ── Sierpień ──
  { date: '2026-08-25', title: 'Posiedzenie RPP (niedecyzyjne)', category: 'stopy', desc: 'Jednodniowe posiedzenie RPP o charakterze niedecyzyjnym - Rada nie zmienia stóp procentowych.' },

  // ── Wrzesień ──
  { date: '2026-09-02', title: 'Decyzja RPP o stopach', category: 'stopy', desc: 'Wrześniowe posiedzenie decyzyjne Rady Polityki Pieniężnej.', href: '/gospodarka/stopy-procentowe-czerwiec-2026-decyzja-rpp' },
  { date: '2026-09-15', title: 'Płaca minimalna 2027 ustalona', category: 'podatki', desc: 'Ostateczny termin, do którego rząd ustala rozporządzeniem płacę minimalną na 2027 rok.' },

  // ── Październik ──
  { date: '2026-10-07', title: 'Decyzja RPP o stopach', category: 'stopy', desc: 'Październikowe posiedzenie decyzyjne Rady Polityki Pieniężnej.', href: '/gospodarka/stopy-procentowe-czerwiec-2026-decyzja-rpp' },

  // ── Listopad ──
  { date: '2026-11-04', title: 'Decyzja RPP o stopach', category: 'stopy', desc: 'Listopadowe posiedzenie decyzyjne Rady Polityki Pieniężnej.', href: '/gospodarka/stopy-procentowe-czerwiec-2026-decyzja-rpp' },

  // ── Grudzień ──
  { date: '2026-12-02', title: 'Decyzja RPP o stopach', category: 'stopy', desc: 'Ostatnie w 2026 roku posiedzenie decyzyjne Rady Polityki Pieniężnej.', href: '/gospodarka/stopy-procentowe-czerwiec-2026-decyzja-rpp' },
];

const MONTHS_PL = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
];

export function monthName(iso: string): string {
  return MONTHS_PL[new Date(iso).getMonth()];
}

export function dayNum(iso: string): number {
  return new Date(iso).getDate();
}

// Pierwsze wydarzenie z datą >= dziś (do bloku „Najbliższe").
export function nextEvent(events: CalEvent[], todayISO: string): CalEvent | undefined {
  return [...events].sort((a, b) => a.date.localeCompare(b.date)).find((e) => e.date >= todayISO);
}
