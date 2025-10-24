import { CredentialsSignin, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

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
                            firstName: user.firstname,
                            lastName: user.lastname,
                            phone: user.phone ? user.phone : null, // ternary op. to explicitly check falsy values instead of using || .
                            email_verified: user.emailVerifiedAt ? true : false,
                            role: user.userType ? user.userType.toUpperCase() : null,
                            reward_points: user.rewardPoints ?? null,
                            newsletter_opt_in: user.newsletterOptIn ?? null,
                            addresses: null, // Backend doesn't include addresses in auth response
                            accessToken: user.accessToken,
                        };
                    }
                }

                return null;
            },
        })
    ],
} satisfies NextAuthConfig;
