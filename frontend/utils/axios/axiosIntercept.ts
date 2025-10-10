import { cookies } from "next/headers";
import { axiosPrivate } from "@/utils/axios/axios";
import axiosErrorLogger from "@/components/error/axios_error";
import { getToken } from "next-auth/jwt";

const axiosIntercept = async () => {

    const token = await getToken({ req: { headers: { cookie: cookies().toString() } }, secret: process.env.AUTH_SECRET });

    axiosPrivate.interceptors.request.use(
        (config) => {

            config.headers['Authorization'] = `Bearer ${token}`;
            config.headers['Cookie'] = cookies().toString();

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
