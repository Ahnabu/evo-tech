import Axios, { AxiosInstance } from "axios";

const ensureApiV1Path = (instance: AxiosInstance, url?: string) => {
  if (!url) return url;

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const normalized = url.startsWith("/") ? url : `/${url}`;

  if (normalized.startsWith("/api/v1")) {
    return normalized;
  }

  const baseUrl = instance.defaults.baseURL ?? "";
  const baseHasApiPrefix =
    typeof baseUrl === "string" && baseUrl.includes("/api/v1");

  if (baseHasApiPrefix) {
    return normalized;
  }

  if (normalized.startsWith("/api/")) {
    return normalized.replace(/^\/api\//, "/api/v1/");
  }

  return `/api/v1${normalized}`;
};

const attachApiPrefix = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      // Don't modify URL if baseURL already contains /api/v1
      const baseUrl = instance.defaults.baseURL ?? "";
      if (baseUrl.includes("/api/v1")) {
        // Base URL already has /api/v1, don't add it again
        return config;
      }
      config.url = ensureApiV1Path(instance, config.url ?? undefined);
      return config;
    },
    (error) => Promise.reject(error)
  );
};

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

attachApiPrefix(axios);

export const axiosPrivate = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

attachApiPrefix(axiosPrivate);

export default axios;
