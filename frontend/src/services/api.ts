import axios from "axios";
import { clearCurrentUser, getAccessToken } from "../utils/authStorage";

const API_BASE = (import.meta.env.VITE_API_BASE ?? "").replace(/\/$/, "");

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = String(err.config?.url ?? "");
    if (err.response?.status === 401 && !url.includes("/auth/login")) {
      clearCurrentUser();
      window.location.assign("/");
    }
    return Promise.reject(err);
  }
);

/** Backend Spring trả body dạng { success, message, data } */
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export function unwrapApiData<T>(res: { data: ApiEnvelope<T> }): T {
  return res.data.data;
}

export default api;
