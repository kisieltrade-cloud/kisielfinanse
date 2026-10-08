import { NextRequest, NextResponse } from 'next/server';

// Strona wyłączona (decyzja 2026-10-09): każdy adres zwraca pusty 410 Gone.
// Żeby przywrócić stronę — ustaw SITE_DISABLED na false i wdróż.
const SITE_DISABLED = true;

export function middleware(req: NextRequest) {
  if (SITE_DISABLED) {
    return new NextResponse(null, {
      status: 410,
      headers: { 'X-Robots-Tag': 'noindex, nofollow' },
    });
  }

  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/kf-7q3x-cms/')) {
    const session = req.cookies.get('admin_session');
    const expected = process.env.ADMIN_PASSWORD ?? '';
    if (!session || session.value !== expected) {
      return NextResponse.redirect(new URL('/kf-7q3x-cms', req.url));
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ['/:path*'] };
