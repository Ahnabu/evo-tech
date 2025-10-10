"use server";

import "server-only";
import { z } from 'zod';
import { RegisterSchema } from "@/schemas";
import axios from "@/utils/axios/axios";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return ({ error: "Invalid inputs in fields" });
    }

    const { firstname, lastname, email, password } = validatedFields.data;

    // call backend api to handle registration of user
    const response = await axios.post("/api/signup-user", {
        firstname,
        lastname,
        email,
        password,
    }, {
        headers: {
            "Content-Type": "application/json",
        },
    }
    ).then((res) => {
        return ({ success: res.data.message });
    }
    ).catch((err: any) => {
        if (err.response) {
            return ({ error: err.response.data.message });
        } else {
            return ({ error: "Something went wrong" })
        }
    });

    return response;
};
