import { cookies } from "next/headers";
import { axiosPrivate } from "@/utils/axios/axios";
import axiosErrorLogger from "@/components/error/axios_error";
import { auth } from "@/auth";

const axiosIntercept = async () => {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    const session = await auth();
    const token = session?.accessToken;

    if (!token) {
        throw new Error("No authentication token available");
    }

    axiosPrivate.interceptors.request.use(
        (config) => {

            config.headers['Authorization'] = `Bearer ${token}`;
            config.headers['Cookie'] = cookieString;

            return config;
        },
        (error: any) => {
            axiosErrorLogger({ error });
            return Promise.reject(error);
        }
    );

    return axiosPrivate;
}

export default axiosIntercept;
