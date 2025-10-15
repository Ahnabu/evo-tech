/**
 * Protected route prefix. These are the routes that require authentication.
 */
export const protectedRoutePrefix = "/user";


/**
 * Protected and Admin only route prefix. These routes require authentication.
 */
// export const adminRoutePrefix = "/control";
export const adminRoutePrefix = "/nocontrol";


/**
 * Auth routes that logged in users will not
 * get access to when they are logged in.
 * 
 * Logged out users can access these routes.
 */
export const authRoutes: string[] = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/et-admin/auth/sign-in",
    "/auth-error",
];


/**
 * Routes that start with this prefix are used for API authentication purposes
 */
export const apiAuthPrefix = "/api/auth";


/**
 * default route for users to redirect to after signing-in
 */
export const DEFAULT_SIGNIN_REDIRECT_USER = "/"


/**
 * default route for admins to redirect to after signing-in
 */
export const DEFAULT_SIGNIN_REDIRECT_ADMIN = "/control/dashboard"
