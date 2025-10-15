import { CredentialsSignin, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { LoginSchema } from "@/schemas";
import { authUsingApi } from "@/dal/user";

export class CustomCredSignin extends CredentialsSignin {
    code = `c_autherror`;
    constructor(message?: string | Error) {
        super(message);
        if (typeof message === "string") {
            this.message = message;
        }
    }
};

export default {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            async profile(profile) {
                // profile callback might only be executed after a successful sign-in with the provider, 
                // and should return a profile object, that will be used in the callbacks to create user session
                return {
                    id: profile.id,
                    email: profile.email,
                    firstname: profile.given_name || profile.family_name || profile.name,
                    lastname: (profile.given_name && profile.family_name) ? profile.family_name : null,
                    email_verified: profile.email_verified,
                    phone: null,
                    role: null,
                    reward_points: null,
                    newsletter_opt_in: null,
                    addresses: null,
                };
            },
        }),
        Credentials({
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { email, password, role } = validatedFields.data;

                    const user = await authUsingApi({ email, password, role });

                    if (user) {
                        if (user.apiErrMsg && typeof user.apiErrMsg === "string") {
                            throw new CustomCredSignin(`${user.apiErrMsg}`); // auth flow is broken & end-user will see the message
                        }

                        return {
                            id: user._id || user.uuid,
                            email: user.email,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            phone: user.phone ? user.phone : null, // ternary op. to explicitly check falsy values instead of using || .
                            email_verified: user.emailVerifiedAt ? true : false,
                            role: user.userType ? user.userType.toUpperCase() : null,
                            reward_points: user.rewardPoints ?? null,
                            newsletter_opt_in: user.newsletterOptIn ?? null,
                            addresses: null, // Backend doesn't include addresses in auth response
                        };
                    }
                }

                return null;
            },
        })
    ],
} satisfies NextAuthConfig;
