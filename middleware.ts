import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const CANONICAL_HOST = 'lanternell.com'

export function middleware(request: NextRequest) {
  const { hostname, pathname, search } = request.nextUrl

  // 1. Redirect www → non-www (301 permanent)
  if (hostname === `www.${CANONICAL_HOST}`) {
    return NextResponse.redirect(
      `https://${CANONICAL_HOST}${pathname}${search}`,
      301
    )
  }

  // 2. Force HTTPS (in case any HTTP request leaks through)
  const proto = request.headers.get('x-forwarded-proto')
  if (proto === 'http') {
    return NextResponse.redirect(
      `https://${hostname}${pathname}${search}`,
      301
    )
  }

  return NextResponse.next()
}

export const config = {
  // Run on all routes except static assets and internal Next.js paths
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|images/|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)'],
}
