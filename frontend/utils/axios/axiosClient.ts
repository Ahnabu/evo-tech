"use client";

import { getSession } from "next-auth/react";
import Axios, { AxiosInstance } from "axios";
import axiosErrorLogger from "@/components/error/axios_error";

const ensureApiV1Path = (instance: AxiosInstance, url?: string) => {
    if (!url) return url;
    if (/^https?:\/\//i.test(url)) {
        return url;
    }

    const normalized = url.startsWith('/') ? url : `/${url}`;

    if (normalized.startsWith('/api/v1')) {
        return normalized;
    }

    const baseUrl = instance.defaults.baseURL ?? '';
    const baseHasApiPrefix = typeof baseUrl === "string" && baseUrl.includes("/api/v1");

    if (baseHasApiPrefix) {
        return normalized;
    }

    if (normalized.startsWith('/api/')) {
        return normalized.replace(/^\/api\//, '/api/v1/');
    }

    return `/api/v1${normalized}`;
};

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
            config.url = ensureApiV1Path(axiosClient, config.url ?? undefined);
            return config;
        },
        (error: any) => Promise.reject(error)
    );

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
            config.url = ensureApiV1Path(axiosClient, config.url ?? undefined);
            return config;
        },
        (error: any) => Promise.reject(error)
    );

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

export default createAxiosClient;