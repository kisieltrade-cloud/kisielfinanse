'use client';

import { useState } from 'react';

const FAQS = [
  {
    q: 'Czym jest NysethTrading?',
    a: 'NysethTrading to projekt transparentnego tradingu prowadzony przez Nyseth — tradera z Wrocławia z 7-letnim doświadczeniem na rynkach Forex, krypto i futures. Celem projektu jest pokazywanie realnych wyników tradingowych bez koloryzowania — zarówno zyskownych jak i stratnych tygodni.',
  },
  {
    q: 'Jakie rynki traderujesz?',
    a: 'Zajmuję się day tradingiem na trzech rynkach: Forex (głównie pary EUR/USD, GBP/USD), krypto (Bitcoin, Ethereum) oraz kontrakty futures na indeksy giełdowe (NAS100, S&P500). Każdy rynek ma swoją specyfikę — łączy je wspólny system zarządzania ryzykiem.',
  },
  {
    q: 'Jak często aktualizujesz wyniki?',
    a: 'Wyniki tygodniowe publikuję co poniedziałek za poprzedni tydzień. Equity curve jest aktualizowana w tym samym rytmie. Nie ma tu opóźnień ani selekcji — publikuję wszystko, również stratne tygodnie.',
  },
  {
    q: 'Czy oferujesz sygnały tradingowe lub zarządzanie kapitałem?',
    a: 'Nie. NysethTrading to projekt edukacyjny i transparentny dziennik wyników — nie zarządzam cudzym kapitałem ani nie sprzedaję sygnałów. Treści na stronie mają charakter wyłącznie informacyjny i nie stanowią doradztwa inwestycyjnego.',
  },
  {
    q: 'Jak mogę się nauczyć tradingu?',
    a: 'Zacznij od sekcji Blog i Słownika — znajdziesz tam artykuły o zarządzaniu ryzykiem, psychologii tradingu i podstawowych pojęciach. Dołącz też do newslettera — co tydzień wysyłam podsumowanie rynków i własne obserwacje, które nie trafiają na stronę.',
  },
  {
    q: 'Jak dołączyć do newslettera?',
    a: 'Przewiń na dół strony głównej i wpisz swój adres email w sekcji Newsletter. Wysyłam cotygodniowe podsumowanie rynków, moje setup\'y i przemyślenia których nie publikuję publicznie. Zero spamu — możesz się wypisać w każdej chwili.',
  },
  {
    q: 'Czy wyniki są audytowane?',
    a: 'Wyniki nie są audytowane przez zewnętrzny podmiot. Dane pochodzą bezpośrednio z mojego rachunku tradingowego i są publikowane bez selekcji. W przyszłości planuję integrację z narzędziem do weryfikacji wyników (Myfxbook lub podobnym) dla pełnej transparentności.',
  },
  {
    q: 'Czy mogę nawiązać współpracę?',
    a: 'Tak — jeśli reprezentujesz giełdę krypto, platformę tradingową lub markę z branży finansowej, możemy porozmawiać o współpracy. Przejdź do zakładki Współpraca i wypełnij formularz kontaktowy.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="faq-section" id="faq">
      <div className="faq-inner">
        <div className="section-label">// pytania i odpowiedzi</div>
        <h2 className="section-title reveal">
          <span aria-hidden="true">CZĘSTO ZADAWANE <span className="gradient-text-cp">PYTANIA</span></span>
          <span className="seo-only">FAQ — często zadawane pytania o trading, wyniki i NysethTrading</span>
        </h2>

        <div className="faq-list reveal">
          {FAQS.map((f, i) => (
            <div
              key={i}
              className={`faq-item${open === i ? ' faq-open' : ''}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="faq-question">
                <span>{f.q}</span>
                <span className="faq-icon">{open === i ? '−' : '+'}</span>
              </div>
              {open === i && (
                <div className="faq-answer">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
