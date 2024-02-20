import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { USER_ROLE } from './lib/constants';
import { UserCredentials } from './types/next-auth';

const UserPath = '/user';
const AdminPath = '/admin';

const UserRestrictedPaths = ['/user/login'];
const AdminRestrictedPaths = ['/admin/login'];

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent
) {
  // prettier-ignore
  const token = (await getToken({ req, secret: process.env.NEXTAUTH_SECRET })) as any;
  const hasToken = Boolean(token);
  const pathname = req.nextUrl.pathname;
  const origin = req.nextUrl.origin;
  const user = token?.user as UserCredentials;
  const role = user?.role ?? '';

  const aUserPath = pathname.startsWith(UserPath);
  const aAdminPath = pathname.startsWith(AdminPath);
  const aIndexPath = pathname === '/';

  // prettier-ignore
  const aUserRestrictedPath = UserRestrictedPaths.some((path) => pathname.startsWith(path))
  // prettier-ignore
  const aAdminRestrictedPath = AdminRestrictedPaths.some((path) => pathname.startsWith(path))

  if (aUserPath || aIndexPath) {
    if ((aIndexPath || aUserRestrictedPath) && hasToken) {
      switch (role) {

        case USER_ROLE.ADMIN:
          return NextResponse.redirect(
            new URL(`${AdminPath}/dashboard`, origin)
          );

        default:
          return NextResponse.redirect(
            new URL(`${UserPath}/progress`, origin)
          );
      }
    }
  }


  if (aAdminPath || aIndexPath) {
    if ((aIndexPath || aAdminRestrictedPath) && hasToken) {
      switch (role) {
        case USER_ROLE.USER:
          return NextResponse.redirect(
            new URL(`${UserPath}/progress`, origin)
          );


        default:
          return NextResponse.redirect(
            new URL(`${AdminPath}/dashboard`, origin)
          );
      }
    }
  }

  // prettier-ignore
  if (!aIndexPath && !aUserRestrictedPath && !aAdminRestrictedPath) {
    const authMiddleware = withAuth({
      pages: {
        signIn: '/',
      },

      callbacks: {
        authorized: ({ token }) => {
          if (aAdminPath) {
            return token?.user?.role === USER_ROLE.ADMIN;
          }

          if (aUserPath) {
            return token?.user?.role === USER_ROLE.USER;
          }


          return token !== null;
        },
      },
    });

    // @ts-expect-error
    return authMiddleware(req, event);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon|sw).*)',
  ],
};