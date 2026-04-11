// Komponent Schema.org JSON-LD — dodaj do src/components/SchemaOrg.tsx
// Użycie w layout.tsx: <SchemaOrg />

export default function SchemaOrg() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Mateusz Nyseth',
    alternateName: 'Nyseth',
    url: 'https://nysethtrading.pl',
    sameAs: [
      'https://nysethtrading.pl',
      'https://x.com/nysethtrading',
    ],
    jobTitle: 'Trader',
    description: 'Trader z Wrocławia z 9-letnim doświadczeniem na rynkach futures, forex i krypto. Publikuje transparentne wyniki tygodniowe.',
    knowsAbout: ['trading', 'futures', 'forex', 'krypto', 'US100', 'złoto', 'zarządzanie ryzykiem'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Wrocław',
      addressCountry: 'PL',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NysethTrading',
    url: 'https://nysethtrading.pl',
    description: 'Transparentne wyniki tradingowe, tygodniowe statystyki i edukacja. Forex, futures, krypto.',
    inLanguage: 'pl-PL',
    author: {
      '@type': 'Person',
      name: 'Mateusz Nyseth',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://nysethtrading.pl/blog?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
