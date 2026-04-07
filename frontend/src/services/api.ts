import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_BASE ?? "").replace(/\/$/, "");

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { "Content-Type": "application/json" },
});

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
