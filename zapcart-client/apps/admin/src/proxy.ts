import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Paths that don't require authentication
    const publicPaths = ['/login', '/signup', '/forgot-password'];

    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

    // If trying to access protected route without token
    if (!token && !isPublicPath) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        // Optional: Add return URL
        // url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
    }

    // If trying to access public route (login) with token
    if (token && isPublicPath) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - assets (public assets)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
    ],
};
