import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import axios from "@/utils/axios/axios";
import { isAxiosError } from "axios";
import jwt from "jsonwebtoken";

interface addressType {
    house_and_street: string;
    subdistrict: string;
    city: string;
    postal_code?: string | null;
    country: string;
    is_default_address: boolean;
};

declare module "next-auth" {
    interface User {
        uuid?: string;
        firstName?: string;
        lastName?: string;
        phone?: string | null;
        role?: string | null;
        email_verified?: boolean;
        reward_points?: number | null;
        newsletter_opt_in?: boolean | null;
        addresses?: addressType[] | null;
        accessToken?: string;
        permittedRoutes?: string[];
    }

    interface Session {
        accessToken?: string;
        user: {
            id?: string;
            uuid?: string;
            email?: string;
            firstName?: string;
            lastName?: string;
            phone?: string | null;
            role?: string | null;
            email_verified?: boolean;
            reward_points?: number | null;
            newsletter_opt_in?: boolean | null;
            addresses?: addressType[] | null;
            permittedRoutes?: string[];
        }
    }
}

declare module "@auth/core/jwt" {
    interface JWT {
        /**
         * user data from the signin attempt
         */
        userdata?: {
            uuid?: string;
            firstName?: string;
            lastName?: string;
            phone?: string | null;
            role?: string | null;
            email_verified?: boolean;
            reward_points?: number | null;
            newsletter_opt_in?: boolean | null;
            addresses?: addressType[] | null;
            permittedRoutes?: string[];
        }
        accessToken?: string;
    }
}


export const {
    handlers,
    auth,
    signIn,
    signOut,
} = NextAuth({
    ...authConfig,
    session: {
        strategy: "jwt",
        maxAge: 1209600, // 14 days,
    },
    events: {
        async signOut(message) {
            // Clear token data on sign out
            if ('token' in message && message.token) {
                message.token.userdata = undefined;
                message.token.accessToken = undefined;
            }
        },
    },
    jwt: {
        // maxAge: 1209600,
        // encode: async ({ token }) => {

        //     const payload = { ...token };
        //     const authsecret = process.env.AUTH_SECRET!;
        //     const createdJwt = jwt.sign(payload, authsecret, { algorithm: 'HS256', expiresIn: 1209600 });
        //     console.log({ createdJwt });
        //     return createdJwt;

        // //     const expiration = Math.floor(Date.now() / 1000) + (maxAge ?? 1209600);
        // //     // sign jwt
        // //     return await new SignJWT({ ...token })
        // //         .setProtectedHeader({ alg: "HS256" })
        // //         .setIssuedAt()
        // //         .setExpirationTime(expiration)
        // //         .sign(secretkey);
        // },
        
        // decode: async ({ token }) => {
        //     const authsecret = process.env.AUTH_SECRET!;
        // //     const secretkey = new TextEncoder().encode(authsecret);
        //     try {
        //         return jwt.verify(token!, authsecret, { algorithms: ['HS256'] }) as any
        // //         const { payload } = await jwtVerify(token!, secretkey, {
        // //             algorithms: ['HS256'],
        // //         })
        // //         return payload;
        //     } catch (error) {
        //         return null;
        //     }
        // },
    },
    // cookies: {
    //     sessionToken: {
    //         name: process.env.NODE_ENV === 'production'
    //             ? `__Secure-authjs.session-token`
    //             : `authjs.session-token`,
    //         options: {
    //             httpOnly: true,
    //             sameSite: 'lax',
    //             path: '/',
    //             secure: process.env.NODE_ENV === 'production' ? true : false
    //         }
    //     },
    // },
    pages: {
        signIn: "/login",
        error: "/auth-error", // to be created
    },
    debug: false,
    callbacks: {
        async signIn({ user, account, profile }) {
            return true;
        },
        async jwt({ token, user, account, profile }) {

            if (user) { // user is only available here while signing in
                token.userdata = {
                    uuid: user.uuid, // Add UUID to token
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    role: user.role,
                    email_verified: user.email_verified,
                    reward_points: user.reward_points,
                    newsletter_opt_in: user.newsletter_opt_in,
                    addresses: user.addresses,
                    permittedRoutes: user.permittedRoutes, // Add permitted routes to token
                };
                token.accessToken = user.accessToken;
            }

            return token;
        },
        // token flows from jwt to session callback
        async session({ token, session }) {

            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.userdata && session.user) {
                session.user = {
                    ...session.user,
                    ...token.userdata
                };
            }

            if (token.accessToken) {
                session.accessToken = token.accessToken;
            }

            return session;
        },
    },
});
