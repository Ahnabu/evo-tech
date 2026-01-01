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

// Add auth interceptor for client-side requests
if (typeof window !== "undefined") {
  // Request interceptor: Add access token to requests
  axios.interceptors.request.use(
    async (config) => {
      const { getSession } = await import("next-auth/react");
      const session = await getSession();

      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor: Handle 401 errors and refresh token
  let isRefreshing = false;
  let failedQueue: any[] = [];

  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If error is 401 and we haven't tried to refresh yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return axios(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Try to refresh the token
          const response = await Axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
            {},
            { withCredentials: true }
          );

          if (response.data?.data?.accessToken) {
            const newAccessToken = response.data.data.accessToken;

            // Trigger session refresh by calling getSession again
            const { getSession } = await import("next-auth/react");
            await getSession();

            // Update the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            processQueue(null, newAccessToken);
            isRefreshing = false;

            // Retry the original request
            return axios(originalRequest);
          } else {
            throw new Error("No access token in refresh response");
          }
        } catch (refreshError: any) {
          processQueue(refreshError, null);
          isRefreshing = false;

          // If refresh fails, sign out and redirect to login
          if (typeof window !== "undefined") {
            const { signOut } = await import("next-auth/react");
            await signOut({ redirect: false });
            // Use replace to prevent back button loop
            window.location.replace("/login");
          }

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
}

attachApiPrefix(axios);

export const axiosPrivate = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

attachApiPrefix(axiosPrivate);

// For client-side authenticated requests, create a helper function
export const createAuthAxios = async () => {
  if (typeof window === "undefined") {
    // Server-side, return the base axios instance
    return axios;
  }

  // Client-side, attach auth token
  const { getSession } = await import("next-auth/react");
  const session = await getSession();

  const authAxios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
      ...(session?.accessToken && {
        Authorization: `Bearer ${session.accessToken}`,
      }),
    },
    withCredentials: true,
  });

  attachApiPrefix(authAxios);
  return authAxios;
};

export default axios;
