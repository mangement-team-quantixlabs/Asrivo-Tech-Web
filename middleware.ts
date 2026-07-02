import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    let response = NextResponse.next({
      request,
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
            response = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // 1. If accessing login route
    if (pathname === '/admin/login') {
      if (user) {
        const { data: profile } = await supabase
          .from('admin_profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile) {
          return NextResponse.redirect(new URL('/admin', request.url))
        }
      }
      return response
    }

    // 2. If accessing any other /admin routes and not logged in
    if (!user) {
      const url = new URL('/admin/login', request.url)
      url.searchParams.set('redirected', 'true')
      return NextResponse.redirect(url)
    }

    // 3. Authenticated - check if admin profile exists
    const { data: profile, error } = await supabase
      .from('admin_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error || !profile) {
      const url = new URL('/admin/login', request.url)
      url.searchParams.set('error', 'unauthorized')

      const redirectResponse = NextResponse.redirect(url)
      request.cookies.getAll().forEach(cookie => {
        if (cookie.name.startsWith('sb-') || cookie.name.includes('supabase')) {
          redirectResponse.cookies.delete(cookie.name)
        }
      })
      return redirectResponse
    }

    // 4. ROLE-LEVEL ROUTE PROTECTION: block low admins from high-admin-only routes
    const highOnlyRoutes = ['/admin/admins', '/admin/settings']
    if (profile.role !== 'high' && highOnlyRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

