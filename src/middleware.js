import { NextResponse } from 'next/server';
import {jwtDecode} from 'jwt-decode';

export async function middleware(request) {
  const publicPaths = ['/login']; // Add any other public paths here
  const currentPath = request.nextUrl.pathname;

  // Allow access to public paths without token
  if (publicPaths.includes(currentPath)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token');
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const decoded = jwtDecode(token.value);
    const { is_root, is_admin } = decoded;

    const allowedPaths = {
      root: '/root',
      admin: '/admin',
      user: '/user',
    };

    const rolePath =
      is_root ? allowedPaths.root : is_admin ? allowedPaths.admin : allowedPaths.user;

    if (!currentPath.startsWith(rolePath)) {
      return NextResponse.redirect(new URL('/not-found', request.url));
    }
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/(root|admin|user)/:path*', '/login'],
};
