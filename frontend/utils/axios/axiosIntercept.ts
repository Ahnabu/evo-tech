import { cookies } from "next/headers";
import { axiosPrivate } from "@/utils/axios/axios";
import axiosErrorLogger from "@/components/error/axios_error";
import { getToken } from "next-auth/jwt";

const axiosIntercept = async () => {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    const token = await getToken({ req: { headers: { cookie: cookieString } }, secret: process.env.AUTH_SECRET });

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
