import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
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

export const config = { matcher: ['/kf-7q3x-cms/:path+'] };
