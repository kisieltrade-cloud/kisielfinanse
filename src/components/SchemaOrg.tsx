export default function SchemaOrg() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Mateusz Nyseth',
    alternateName: ['Nyseth', 'NysethTrading'],
    url: 'https://nysethtrading.pl',
    image: 'https://nysethtrading.pl/og-image.png',
    sameAs: [
      'https://x.com/nysethtrading',
      'https://twitter.com/nysethtrading',
    ],
    jobTitle: 'Day Trader',
    description: 'Trader z Wrocławia z 9-letnim doświadczeniem na rynkach futures, forex i krypto. Publikuje transparentne wyniki tygodniowe.',
    knowsAbout: [
      'day trading', 'scalping', 'futures', 'forex', 'krypto',
      'US100', 'NAS100', 'złoto', 'zarządzanie ryzykiem',
      'price action', 'analiza techniczna',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Wrocław',
      addressCountry: 'PL',
      addressRegion: 'Dolnośląskie',
    },
    worksFor: {
      '@type': 'Organization',
      name: 'NysethTrading',
      url: 'https://nysethtrading.pl',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NysethTrading',
    url: 'https://nysethtrading.pl',
    logo: {
      '@type': 'ImageObject',
      url: 'https://nysethtrading.pl/logo.svg',
      width: 200,
      height: 60,
    },
    image: 'https://nysethtrading.pl/og-image.png',
    description: 'Transparentne wyniki tradingowe — tygodniowe statystyki, equity curve i edukacja. Forex, futures, krypto.',
    foundingDate: '2026',
    founder: {
      '@type': 'Person',
      name: 'Mateusz Nyseth',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Wrocław',
      addressCountry: 'PL',
    },
    sameAs: [
      'https://x.com/nysethtrading',
      'https://twitter.com/nysethtrading',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'nysethtrading@gmail.com',
      contactType: 'customer service',
      availableLanguage: 'Polish',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NysethTrading',
    url: 'https://nysethtrading.pl',
    description: 'Transparentne wyniki tradingowe, tygodniowe statystyki i edukacja. Forex, futures, krypto.',
    inLanguage: 'pl-PL',
    publisher: {
      '@type': 'Organization',
      name: 'NysethTrading',
      url: 'https://nysethtrading.pl',
    },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
