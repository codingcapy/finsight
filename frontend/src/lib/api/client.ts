import axios from "axios";

export const api = axios.create({
  baseURL: "/api/v0",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (config.url && !config.url.endsWith("/")) {
    config.url += "/";
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message;
    if (message) {
      return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  },
);

export function authHeaders(token: string | null) {
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}
