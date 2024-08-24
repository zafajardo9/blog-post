import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // First, update the Supabase session
  let response = await updateSession(request);

  // Now, let's add our custom route protection logic
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Check if the path is within the (protected) folder
  if (path.startsWith('/posts') || path.startsWith('/profile')) {
    if (!user) {
      // If user is not authenticated and trying to access a protected route, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } 
  // Check if the path is a public route
  else if (path === '/login' || path === '/') {
    if (user) {
      // If user is authenticated and trying to access a public route, redirect to a default protected route
      return NextResponse.redirect(new URL('/posts', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - api routes
     * - auth callback route
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api|auth/callback).*)",
  ],
};