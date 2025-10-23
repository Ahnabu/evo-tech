"use client";

import { getSession } from "next-auth/react";
import Axios from "axios";
import axiosErrorLogger from "@/components/error/axios_error";

// Client-side axios instance with session token
const createAxiosClient = async () => {
    const session = await getSession();
    
    // Create a new axios instance to avoid modifying the global one
    const axiosClient = Axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    });

    axiosClient.interceptors.request.use(
        (config) => {
            if (session?.accessToken) {
                config.headers['Authorization'] = `Bearer ${session.accessToken}`;
            }
            return config;
        },
        (error: any) => {
            axiosErrorLogger({ error });
            return Promise.reject(error);
        }
    );

    axiosClient.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                // Handle unauthorized access
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );

    return axiosClient;
};

// Alternative function for when you already have the session
export const createAxiosClientWithSession = (session: any) => {
    const axiosClient = Axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    });

    axiosClient.interceptors.request.use(
        (config) => {
            if (session?.accessToken) {
                config.headers['Authorization'] = `Bearer ${session.accessToken}`;
            }
            return config;
        },
        (error: any) => {
            axiosErrorLogger({ error });
            return Promise.reject(error);
        }
    );

    axiosClient.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                // Handle unauthorized access
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );

    return axiosClient;
};export default createAxiosClient;