import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { ALLOWED_EMAILS } from '@/lib/constants'

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)

  // Allow access to login page
  if (request.nextUrl.pathname.startsWith('/login')) {
    // If already logged in and allowed, redirect to dashboard
    if (user && ALLOWED_EMAILS.includes(user.email as typeof ALLOWED_EMAILS[number])) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return supabaseResponse
  }

  // Allow access to auth callback
  if (request.nextUrl.pathname.startsWith('/auth/callback')) {
    return supabaseResponse
  }

  // Not logged in -> redirect to login
  if (!user) {
    const redirectUrl = new URL('/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Logged in but not in allowed list -> sign out and redirect
  if (!ALLOWED_EMAILS.includes(user.email as typeof ALLOWED_EMAILS[number])) {
    const redirectUrl = new URL('/login?error=unauthorized', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
