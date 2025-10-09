import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const TOKEN_COOKIE_NAME = 'token'

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE_NAME)
  const { pathname } = request.nextUrl

  const isProtectedRoute = pathname.startsWith('/early-access-users') || pathname.startsWith('/waitlist')
  const isAuthRoute = pathname === '/login'

  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/early-access-users', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/early-access-users/:path*',
    '/waitlist/:path*',
    '/login',
  ],
}
