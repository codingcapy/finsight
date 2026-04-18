import axios from "axios";

export const api = axios.create({
  baseURL: "/api/v0",
  headers: {
    "Content-Type": "application/json",
  },
});

export function authHeaders(token: string | null) {
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}
