# NysethTrading — Next.js Website

Strona marki tradingowej zbudowana w Next.js 15 z App Router.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Język**: TypeScript
- **CMS**: MDX pliki (filesystem-based) — łatwo migrować do Sanity/Contentful
- **Live dane**: Binance Public REST API (krypto) + Open Exchange Rates (forex)
- **Hosting**: Vercel (zero config)

## Szybki start

```bash
cd nysethtrading
npm install
npm run dev
```

Strona będzie dostępna na [http://localhost:3000](http://localhost:3000)

## Wdrożenie na Vercel

```bash
npm install -g vercel
vercel
```

Lub połącz repozytorium GitHub z Vercel — automatyczne deploy przy każdym push.

---

## Jak dodać nowy artykuł na bloga

1. Utwórz plik `src/content/blog/twoj-slug.mdx`
2. Dodaj frontmatter:

```mdx
---
title: "Tytuł artykułu"
date: "2025-03-01"
excerpt: "Krótki opis widoczny na liście (1-2 zdania)"
tag: "Strategia"          # Strategia | Psychologia | Analiza | Risk Management | Rynek
readTime: "8 min"
published: true
---

Treść artykułu w Markdown...
```

3. Zapisz plik — artykuł pojawi się automatycznie na `/blog` i stronie głównej.

Dostępne tagi (wpływają na kolor):
| Tag | Kolor |
|-----|-------|
| Strategia | Cyan |
| Psychologia | Fioletowy |
| Analiza | Żółty |
| Risk Management | Różowy |
| Rynek | Żółty |

---

## Jak zaktualizować statystyki tradingowe

Edytuj plik `src/components/Stats.tsx` — na początku pliku znajdziesz obiekt `STATS` i tablicę `MONTHLY_DATA`:

```typescript
const STATS = {
  annualReturn: '+183%',
  winRate: '68.4%',
  // ...
};

const MONTHLY_DATA = {
  '2025': [
    { name: 'STY', pct: 12.3 },
    // ...
  ],
};
```

---

## Live dane rynkowe

Dane są pobierane przez `/api/trading` (Next.js Route Handler):

- **Krypto**: Binance Public API — bezpłatne, bez klucza API
- **Forex**: Open Exchange Rates — bezpłatne
- **Odświeżanie**: co 30 sekund (ticker na stronie głównej)

Aby dodać indeksy (S&P 500, DAX etc.) potrzebujesz płatnego API:
- [Twelve Data](https://twelvedata.com) — darmowy plan 800 req/dzień
- [Alpha Vantage](https://alphavantage.co) — darmowy plan 25 req/dzień

Dodaj klucz do `.env.local`:
```
TWELVE_DATA_API_KEY=twój_klucz
```

---

## Newsletter

Komponent Newsletter (`src/components/Newsletter.tsx`) jest gotowy na podpięcie do:
- **Resend** — najlepszy wybór dla nowych projektów
- **Mailerlite** — prosty interfejs, darmowy do 1000 subskrybentów
- **ConvertKit** — dobry do twórców (courses, tags, sequences)

Stwórz `/api/newsletter/route.ts` z odpowiednią integracją.

---

## Struktura projektu

```
src/
├── app/
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # Strona główna
│   ├── globals.css         # Wszystkie style (CSS custom properties)
│   ├── api/
│   │   └── trading/        # Live dane rynkowe
│   └── blog/
│       ├── page.tsx        # Lista artykułów
│       └── [slug]/page.tsx # Pojedynczy artykuł
├── components/
│   ├── Nav.tsx
│   ├── Hero.tsx
│   ├── Ticker.tsx          # Live ticker (Binance API)
│   ├── Stats.tsx           # Wyniki tradingowe
│   ├── BlogSection.tsx     # 3 ostatnie artykuły
│   ├── Newsletter.tsx
│   ├── Footer.tsx
│   └── RevealOnScroll.tsx
├── content/
│   └── blog/               # Artykuły w MDX
│       ├── system-tradingowy-profit-factor.mdx
│       ├── bledy-kognitywne-traderzy.mdx
│       └── risk-management-framework.mdx
└── lib/
    └── posts.ts            # Funkcje do obsługi MDX
```
