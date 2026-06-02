export default function SchemaOrg() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Mateusz Kisiel',
    alternateName: ['KISIEL', 'KisielFinanse'],
    url: 'https://kisielfinanse.pl',
    image: 'https://kisielfinanse.pl/images/profile.png',
    sameAs: [
      'https://x.com/Kisielfinanse',
      'https://www.youtube.com/@Kisielfinanse',
      'https://www.instagram.com/kisielfinanse',
    ],
    jobTitle: 'Twórca portalu KisielFinanse',
    description: 'Trader i analityk finansowy z Wrocławia. Edukacja z zakresu tradingu, krypto, oszczędzania i geopolityki finansowej.',
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
      name: 'KisielFinanse',
      url: 'https://kisielfinanse.pl',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'KisielFinanse',
    url: 'https://kisielfinanse.pl',
    logo: {
      '@type': 'ImageObject',
      url: 'https://kisielfinanse.pl/logo.png',
      width: 200,
      height: 60,
    },
    image: 'https://kisielfinanse.pl/og-image.png',
    description: 'Edukacja finansowa z zakresu tradingu, krypto, oszczędzania i geopolityki. Bez ściemy - tylko rzetelna wiedza.',
    foundingDate: '2026',
    founder: {
      '@type': 'Person',
      name: 'Mateusz Kisiel',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Wrocław',
      addressCountry: 'PL',
    },
    sameAs: [
      'https://x.com/Kisielfinanse',
      'https://www.youtube.com/@Kisielfinanse',
      'https://www.instagram.com/kisielfinanse',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'kisieltrade@gmail.com',
      contactType: 'customer service',
      availableLanguage: 'Polish',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'KisielFinanse',
    url: 'https://kisielfinanse.pl',
    description: 'Finanse, trading, krypto, oszczędzanie - edukacja finansowa dla każdego. KisielFinanse.pl',
    inLanguage: 'pl-PL',
    publisher: {
      '@type': 'Organization',
      name: 'KisielFinanse',
      url: 'https://kisielfinanse.pl',
    },
    author: {
      '@type': 'Person',
      name: 'Mateusz Kisiel',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://kisielfinanse.pl/blog?q={search_term_string}',
      },
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
