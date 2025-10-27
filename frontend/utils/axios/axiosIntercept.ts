import { cookies } from "next/headers";
import { axiosPrivate } from "@/utils/axios/axios";
import axiosErrorLogger from "@/components/error/axios_error";
import { auth } from "@/auth";

const axiosIntercept = async () => {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    const session = await auth();
    const token = session?.accessToken;

    console.log('🔐 axiosIntercept - Session:', {
        hasSession: !!session,
        hasToken: !!token,
        userRole: session?.user?.role,
        userEmail: session?.user?.email
    });

    if (!token) {
        console.error('❌ No authentication token available');
        throw new Error("No authentication token available");
    }

    axiosPrivate.interceptors.request.use(
        (config) => {
            config.headers['Authorization'] = `Bearer ${token}`;
            config.headers['Cookie'] = cookieString;
            
            console.log('📤 Request:', config.method?.toUpperCase(), config.url);

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
