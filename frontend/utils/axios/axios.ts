import Axios, { AxiosInstance } from "axios";

const ensureApiV1Path = (instance: AxiosInstance, url?: string) => {
  if (!url) return url;

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const normalized = url.startsWith("/") ? url : `/${url}`;

  const baseUrl = instance.defaults.baseURL ?? "";
  const baseHasApiPrefix =
    typeof baseUrl === "string" && baseUrl.includes("/api/v1");

  if (normalized.startsWith("/api/v1")) {
    return normalized;
  }

  if (normalized.startsWith("/api/")) {
    if (baseHasApiPrefix) {
      return normalized.replace(/^\/api\//, "/");
    }

    return normalized.replace(/^\/api\//, "/api/v1/");
  }

  if (baseHasApiPrefix) {
    return normalized;
  }

  return `/api/v1${normalized}`;
};

const attachApiPrefix = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      const baseUrl = config.baseURL ?? instance.defaults.baseURL ?? "";
      const currentUrl = config.url ?? "";
      
      // If baseURL already contains /api/v1, strip /api prefix from relative URLs
      if (baseUrl.includes("/api/v1") && currentUrl.startsWith("/api/")) {
        config.url = currentUrl.replace(/^\/api\//, "/");
      } else if (!baseUrl.includes("/api/v1")) {
        config.url = ensureApiV1Path(instance, currentUrl);
      }
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
