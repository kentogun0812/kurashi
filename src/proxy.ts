import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createClient } from '@/lib/supabase/server'
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // 1. Handle i18n routing first
  const i18nResponse = handleI18nRouting(request);
  
  // 2. Update Supabase session (extension of cookies)
  // We apply session updates to the i18n response if needed
  const response = await updateSession(request);

  const { pathname } = request.nextUrl;

  // 3. Admin protection logic
  // Since we use [locale] prefix, we check if pathname contains /admin
  if (pathname.includes('/admin')) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const url = request.nextUrl.clone();
      // Redirect to login with current locale prefix would be better, 
      // but for now simple redirect to /login
      url.pathname = '/login';
      url.searchParams.set('next', pathname);
      return Response.redirect(url);
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return Response.redirect(url);
    }
  }

  // If i18n middleware wants to redirect/rewrite, prioritized it
  // Otherwise return the session-updated response
  return i18nResponse || response;
}

export const config = {
  matcher: [
    // Match only internationalized pathnames
    '/', 
    '/(vi|en|jp)/:path*',
    // Match all request paths except for the ones starting with:
    // - api, api-docs (API routes and Swagger UI)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    '/((?!api|api-docs|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
