/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // ── 301 Redirecty — stare tagi → nowe strony kategorii ──────────────────────
  // Chroni przed 404 po rebrandingu tagów (Edukacja→Trading, Strategia→Trading, etc.)
  // Google automatycznie przenosi sygnały SEO ze starego URL na nowy (301 = permanent)
  async redirects() {
    return [
      // Stare tagi przemianowane podczas rebrandingu
      { source: '/blog/tag/edukacja',    destination: '/trading',     permanent: true },
      { source: '/blog/tag/strategia',   destination: '/trading',     permanent: true },
      { source: '/blog/tag/analiza',     destination: '/inwestycje',  permanent: true },
      { source: '/blog/tag/geopolityka', destination: '/gospodarka',  permanent: true },
      { source: '/blog/tag/finanse',     destination: '/pieniadze',   permanent: true },
      // Nowe tagi — przekieruj /blog/tag/X na /X żeby uniknąć duplikatów
      { source: '/blog/tag/trading',     destination: '/trading',     permanent: true },
      { source: '/blog/tag/inwestycje',  destination: '/inwestycje',  permanent: true },
      { source: '/blog/tag/pieniadze',   destination: '/pieniadze',   permanent: true },
      { source: '/blog/tag/psychologia', destination: '/psychologia',  permanent: true },
      { source: '/blog/tag/gospodarka',  destination: '/gospodarka',  permanent: true },
    ];
  },

  // Image optimization — lazy loading automatycznie przez Next.js Image
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 3600,
    // Loga banków to nasze własne, zaufane pliki SVG (z /public) — bezpieczne serwowanie
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Zewnętrzne domeny dla obrazków jeśli będziesz używać
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },

  // Kompresja
  compress: true,

  // Headers dla bezpieczeństwa i cache
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
      {
        // Cache statycznych assetów na rok
        source: '/(.*)\\.(svg|png|jpg|jpeg|webp|avif|ico|woff|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Lead magnet (PDF) — dostępny tylko mailem, nie indeksować w wyszukiwarkach
        source: '/ebook/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      {
        // Fonty/media z bundla Next (.woff2 itp.) — to zasoby, nie strony.
        // noindex NIE blokuje renderowania (Googlebot dalej je pobiera), tylko
        // wyciąga je z raportu "Crawled - currently not indexed".
        source: '/_next/static/media/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex' },
        ],
      },
      {
        // Manifest PWA — plik techniczny, nie strona do indeksu.
        source: '/site.webmanifest',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex' },
        ],
      },
    ];
  },
};

export default nextConfig;
