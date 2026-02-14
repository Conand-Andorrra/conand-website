import { NextRequest, NextResponse } from 'next/server'

const locales = ['ca', 'es', 'en', 'fr'] as const
const defaultLocale = 'ca'
const localePrefix = locales.filter((l) => l !== defaultLocale) // es, en, fr

// Paths that should NOT be handled by the locale middleware
const ignorePaths = ['/_next', '/api', '/admin', '/img', '/favicon', '/data']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static files, API routes, admin, etc.
  if (ignorePaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Check if path starts with a locale prefix
  const pathnameLocale = localePrefix.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  if (pathnameLocale) {
    // Strip the locale prefix and rewrite
    const strippedPath = pathname.replace(`/${pathnameLocale}`, '') || '/'
    const url = request.nextUrl.clone()
    url.pathname = strippedPath
    const response = NextResponse.rewrite(url)
    response.headers.set('x-locale', pathnameLocale)
    return response
  }

  // No locale prefix → default locale (ca)
  const response = NextResponse.next()
  response.headers.set('x-locale', defaultLocale)
  return response
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
