import axios from "axios";
import { setAccessToken, setLoggedOut } from "../features/auth/auth.slice";
import store from "./app.store";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const API_BASE_URL = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().auth.accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid silent token refresh hijacking for auth/login/register endpoints
    const isAuthEndpoint = originalRequest.url && (
      originalRequest.url.includes("auth/login") ||
      originalRequest.url.includes("auth/register") ||
      originalRequest.url.includes("auth/verify-otp") ||
      originalRequest.url.includes("auth/resend-otp") ||
      originalRequest.url.includes("auth/forgot-password") ||
      originalRequest.url.includes("auth/reset-password")
    );

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
          },
        );

        const newAccessToken = response.data?.data?.token;

        if (newAccessToken) {
          store.dispatch(setAccessToken(newAccessToken));
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);

          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(setLoggedOut());
        window.location.href = "/sign-in";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
