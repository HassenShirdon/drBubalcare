import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    const role = token.role as string;

    // Role-based portal access
    if (pathname.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL(role === 'DOCTOR' ? '/doctor' : '/patient', req.url));
    }
    if (pathname.startsWith('/doctor') && role !== 'DOCTOR') {
      return NextResponse.redirect(new URL(role === 'ADMIN' ? '/admin' : '/patient', req.url));
    }
    if (pathname.startsWith('/patient') && role !== 'PATIENT') {
      return NextResponse.redirect(new URL(role === 'ADMIN' ? '/admin' : '/doctor', req.url));
    }

    return NextResponse.next();
  },
  {
    pages: { signIn: '/auth/signin' },
  }
);

export const config = {
  matcher: ['/patient/:path*', '/doctor/:path*', '/admin/:path*'],
};
