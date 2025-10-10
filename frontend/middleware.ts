import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import {
    authRoutes,
    protectedRoutePrefix,
    adminRoutePrefix,
    apiAuthPrefix,
    DEFAULT_SIGNIN_REDIRECT_USER,
    DEFAULT_SIGNIN_REDIRECT_ADMIN,
} from "@/routeslist";
import { auth } from '@/auth';

const { auth: middleware } = NextAuth(authConfig);

export default middleware( async (request) => {
    const { nextUrl, headers, cookies } = request;
    const isLoggedIn = !!request.auth; //convert to boolean
    const userSession = await auth();
    const userRole = userSession?.user?.role;
    const referer = headers.get('referer');
    const fetchDest = headers.get("sec-fetch-dest");

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isAdminOnlyRoute = nextUrl.pathname.startsWith(adminRoutePrefix);
    const isProtectedRoute = nextUrl.pathname.startsWith(protectedRoutePrefix);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    // not all api routes but allow only these, that are prefixed with apiAuthPrefix
    if (isApiAuthRoute) {
        return NextResponse.next();
    }

    // when the route is not an auth or api route
    if (!isAuthRoute) {
        if (isAdminOnlyRoute) {
            // redirect if admin route and the user is not even authenticated
            if (!isLoggedIn) {
                return NextResponse.redirect(new URL("/sign-in", nextUrl));
            }

            // redirect if the user is authenticated but not an ADMIN
            if (!userRole || userRole !== "ADMIN") {
                return NextResponse.redirect(new URL(DEFAULT_SIGNIN_REDIRECT_USER, nextUrl));
            }
            
            const response = NextResponse.next();
            response.cookies.set("last_pg", nextUrl.pathname, { path: "/" });
            return response;
        }

        // redirect if protected route but the user is not authenticated
        if (isProtectedRoute && !isLoggedIn) {
            return NextResponse.redirect(new URL("/sign-in", nextUrl));
        }


        if (isLoggedIn) {
            const response = NextResponse.next();
            response.cookies.set("last_pg", nextUrl.pathname, { path: "/" });
            return response;
        }
    
        return NextResponse.next();
    }

    // intended for authenticating users, which the signed-in users shouldn't view
    if (isAuthRoute) {
        if (isLoggedIn) {
            let default_redir = DEFAULT_SIGNIN_REDIRECT_USER;
            if (userRole && userRole === "ADMIN") {
                default_redir = DEFAULT_SIGNIN_REDIRECT_ADMIN;
            }
            
            const lastPage = cookies.get("last_pg")?.value || default_redir;

            if (referer && new URL(referer).origin === nextUrl.origin) {
                return NextResponse.redirect(new URL(lastPage, nextUrl));
            } else if (!referer && fetchDest === "document") {
                // Direct navigation (search bar entry)
                return NextResponse.redirect(new URL(lastPage, nextUrl));
            } else {
                // External origin access
                return NextResponse.redirect(new URL(default_redir, nextUrl));
            }
        }

        return NextResponse.next();
    }

});


export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
