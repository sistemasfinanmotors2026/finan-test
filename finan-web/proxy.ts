import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const isLogged = request.cookies.get('admin-auth')?.value
  const path = request.nextUrl.pathname

  // ✅ PERMITIR acceso libre al login
  if (path === '/admin/login') {
    return NextResponse.next()
  }

  // 🔒 PROTEGER /admin
  if (!isLogged && path.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}