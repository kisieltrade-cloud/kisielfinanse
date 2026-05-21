'use client';

import { useState } from 'react';

const FAQS = [
  {
    q: 'Czym jest KisielFinanse?',
    a: 'KisielFinanse to portal edukacyjny o finansach prowadzony przez Mateusza - tradera z Wrocławia z 9-letnim doświadczeniem na rynkach. Piszę o tradingu, krypto, oszczędzaniu, geopolityce i wszystkim, co wpływa na pieniądze. Bez lania wody - tylko rzeczy, które realnie działają.',
  },
  {
    q: 'O czym piszesz na blogu?',
    a: 'Tematy są szerokie: strategie tradingowe, analiza rynków (forex, krypto, indeksy), geopolityka i jej wpływ na finanse, psychologia pieniędzy, oszczędzanie i budowanie majątku. Łączy je jeden mianownik - chcę żebyś po przeczytaniu wiedział więcej i myślał inaczej o pieniądzach.',
  },
  {
    q: 'Czy treści są dla początkujących?',
    a: 'Tak - staram się pisać tak, żeby każdy coś wyniósł. Artykuły podstawowe tłumaczą pojęcia od zera, bardziej zaawansowane wchodzą głębiej w strategie i analizę. Zacznij od Bloga i filtruj wg tematu który Cię interesuje.',
  },
  {
    q: 'Czy oferujesz sygnały tradingowe lub zarządzanie kapitałem?',
    a: 'Nie. KisielFinanse to portal edukacyjny - nie zarządzam cudzym kapitałem ani nie sprzedaję sygnałów. Wszystkie treści mają charakter wyłącznie informacyjny i nie stanowią doradztwa inwestycyjnego.',
  },
  {
    q: 'Jak zacząć naukę tradingu od zera?',
    a: 'Zacznij od artykułów na Blogu - znajdziesz tam materiały o zarządzaniu ryzykiem, analizie technicznej i psychologii tradingu. Nie śpiesz się z realnym kapitałem - najpierw demo, potem małe pozycje, dopiero potem skalujesz.',
  },
  {
    q: 'Jak często publikujesz nowe artykuły?',
    a: 'Regularnie, bez sztucznego harmonogramu. Wolę opublikować mniej, ale porządnie - zamiast produkować content na siłę. Obserwuj profil na X (@KisielFinanse) żeby nie przegapić nowych materiałów.',
  },
  {
    q: 'Czy mogę napisać lub zadać pytanie?',
    a: 'Tak - najłatwiej przez formularz na stronie Współpraca lub przez X (@KisielFinanse). Czytam wszystkie wiadomości, choć odpowiedź może zająć kilka dni.',
  },
  {
    q: 'Czy mogę nawiązać współpracę biznesową?',
    a: 'Tak - jeśli reprezentujesz markę z obszaru finansów, tradingu, krypto lub inwestycji, możemy porozmawiać. Przejdź do zakładki Współpraca i wypełnij krótki formularz kontaktowy.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.a,
    },
  })),
};

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="faq-section" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="faq-inner">
        <h2 className="section-title reveal">
          <span aria-hidden="true">CZĘSTO ZADAWANE <span className="gradient-text-cp">PYTANIA</span></span>
          <span className="seo-only">FAQ - często zadawane pytania o finanse, trading, krypto i KisielFinanse</span>
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