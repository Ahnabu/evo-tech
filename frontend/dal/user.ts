"use server";

import axios from "@/utils/axios/axios";
import { isAxiosError } from "axios";


export const authUsingApi = async (values: { email: string; password: string; role?: "USER" | "ADMIN" }) => {

    const response = await axios.post("/api/v1/auth/login",
        {
            email: values.email,
            password: values.password,
        },
        {
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => {
            return res.data.data?.user ? res.data.data.user : null;
        })
        .catch((err: unknown) => {
            if (isAxiosError(err)) {
                if (err.code && err.code === "ECONNREFUSED") {
                    return { apiErrMsg: "Server is possibly sleeping" };
                } else if (err.code && err.code === "ETIMEDOUT") {
                    return { apiErrMsg: "Request timed out" };
                } else if (err.response && err.response.status >= 500) {
                    return { apiErrMsg: "An unexpected error occured" };
                }
            }
            return null;
        });

    return response;
};
