import { NextResponse } from 'next/server'

export function middleware() {
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('Content-Security-Policy', "default-src 'self'; img-src 'self' https: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' https:; frame-ancestors 'none'")
  return response
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
